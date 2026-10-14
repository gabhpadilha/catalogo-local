import { isOnSale, normalize } from "./format";
import type { SearchIndex, SearchItem, SearchStore } from "./types";

// Busca entre lojas, feita no navegador (até ~1.000 produtos). Acima disso, migrar para o
// índice de texto do Postgres mantendo a mesma interface de search().

export const MIN_QUERY = 2;

const words = (s: string) => normalize(s).split(/[^a-z0-9]+/).filter(Boolean);

// Palavras de ligação não precisam aparecer no produto ("tinta de parede" acha "Tinta parede").
const STOPWORDS = new Set(["a", "o", "as", "os", "e", "de", "da", "do", "das", "dos", "em", "na", "no", "nas", "nos", "um", "uma", "com", "para", "pra", "por"]);
const queryTerms = (q: string) => {
  const all = words(q);
  const meaningful = all.filter((w) => !STOPWORDS.has(w));
  return meaningful.length ? meaningful : all;
};

// Plural para singular, aplicado dos dois lados: "martelos" acha "martelo", "materiais" acha "material".
function singular(w: string) {
  if (w.length <= 3 || !w.endsWith("s")) return w;
  if (w.endsWith("oes") || w.endsWith("aes")) return `${w.slice(0, -3)}ao`; // botões, pães
  if (w.endsWith("ais")) return `${w.slice(0, -3)}al`; // materiais
  if (w.endsWith("eis")) return `${w.slice(0, -3)}el`; // pincéis
  if (w.endsWith("ois")) return `${w.slice(0, -3)}ol`; // anzóis
  if (w.endsWith("res") || w.endsWith("zes")) return w.slice(0, -2); // flores, luzes
  return w.slice(0, -1);
}

// Uma letra trocada, faltando, sobrando ou duas vizinhas invertidas.
function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
  }
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

// Mesmo radical: "camisa" acha "camiseta" (5+ letras iniciais iguais, quase o termo inteiro).
function sameStem(term: string, w: string) {
  let i = 0;
  while (i < term.length && i < w.length && term[i] === w[i]) i++;
  return i >= 5 && i >= term.length - 1;
}

// 3 = palavra inteira, 2 = começo da palavra (ainda digitando), 1 = erro de digitação ou mesmo radical.
function termScore(term: string, list: string[]) {
  const base = singular(term);
  let best = 0;
  for (const w of list) {
    if (w === term || singular(w) === base) return 3;
    if (w.startsWith(term)) best = 2;
    else if (!best && term.length >= 5 && (withinOneEdit(term, w) || sameStem(base, w))) best = 1;
  }
  return best;
}

type Field = [list: string[], weight: number];

// Todas as palavras da busca precisam aparecer em algum campo.
function fieldsScore(terms: string[], fields: Field[]) {
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const [list, weight] of fields) best = Math.max(best, termScore(term, list) * weight);
    if (!best) return 0;
    total += best;
  }
  return total;
}

type PreparedItem = { item: SearchItem; order: number; nameText: string; nameWords: string[]; categoryWords: string[]; descriptionWords: string[] };
type PreparedStore = { store: SearchStore; nameWords: string[]; segmentWords: string[] };
export type PreparedIndex = { stores: PreparedStore[]; storeBySlug: Map<string, SearchStore>; items: PreparedItem[] };

/** Pré-processa o índice uma vez, quando ele chega no navegador. */
export function prepareIndex({ stores, items }: SearchIndex): PreparedIndex {
  return {
    stores: stores.map((store) => ({ store, nameWords: words(store.name), segmentWords: words(store.segment) })),
    storeBySlug: new Map(stores.map((s) => [s.slug, s])),
    items: items.map((item, order) => ({
      item,
      order,
      nameText: normalize(item.name),
      nameWords: words(item.name),
      categoryWords: words(item.category),
      descriptionWords: words(item.description),
    })),
  };
}

/** No empate, a ordem das lojas gira um passo por dia: ninguém fica sempre por último. */
export function dailyStoreOrder(slugs: string[], date = new Date()) {
  const sorted = [...slugs].sort();
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  const shift = sorted.length ? day % sorted.length : 0;
  return new Map([...sorted.slice(shift), ...sorted.slice(0, shift)].map((slug, i) => [slug, i]));
}

export type SearchResult = { stores: SearchStore[]; items: SearchItem[] };

export function search(index: PreparedIndex, query: string, date = new Date()): SearchResult {
  const terms = queryTerms(query);
  if (!terms.length) return { stores: [], items: [] };
  const rotation = dailyStoreOrder(index.stores.map((s) => s.store.slug), date);
  const rank = (slug: string) => rotation.get(slug) ?? 0;
  const phrase = normalize(query);

  const stores = index.stores
    .map((s) => ({ store: s.store, score: fieldsScore(terms, [[s.nameWords, 1], [s.segmentWords, 1]]) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || rank(a.store.slug) - rank(b.store.slug))
    .map((r) => r.store);

  // Nome e categoria primeiro; a descrição só entra se eles não acharem nada.
  const score = (fields: (p: PreparedItem) => Field[]) =>
    index.items
      .map((p) => {
        const base = fieldsScore(terms, fields(p));
        return { p, score: base && base + (p.nameText.startsWith(phrase) ? 2 : 0) };
      })
      .filter((r) => r.score > 0);
  let matches = score((p) => [[p.nameWords, 3], [p.categoryWords, 2]]);
  if (!matches.length) matches = score((p) => [[p.nameWords, 3], [p.categoryWords, 2], [p.descriptionWords, 1]]);

  // Loja com entrega pausada vai para o fim; depois relevância, rodízio do dia e ordem da loja.
  const paused = (slug: string) => (index.storeBySlug.get(slug)?.deliveryOpen ? 0 : 1);
  const items = matches
    .sort(
      (a, b) =>
        paused(a.p.item.store) - paused(b.p.item.store) ||
        b.score - a.score ||
        rank(a.p.item.store) - rank(b.p.item.store) ||
        a.p.order - b.p.order
    )
    .map((r) => r.p.item);

  return { stores, items };
}

/** Categorias com mais produtos, juntando grafias diferentes ("Ferramenta", "ferramentas"). */
export function topCategories(items: SearchItem[], limit = 6) {
  const groups = new Map<string, { count: number; labels: Map<string, number> }>();
  for (const { category } of items) {
    const key = words(category).map(singular).join(" ");
    if (!key || key === "geral") continue;
    const g = groups.get(key) ?? { count: 0, labels: new Map() };
    g.count++;
    g.labels.set(category, (g.labels.get(category) ?? 0) + 1);
    groups.set(key, g);
  }
  return [...groups.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((g) => [...g.labels].sort((a, b) => b[1] - a[1])[0][0]);
}

const discount = (it: SearchItem) => (it.originalPrice ? (it.originalPrice - it.price) / it.originalPrice : 0);

/** Faixa da home: ofertas de todas as lojas ou, sem nenhuma, os produtos mais novos. */
export function pickShelf(items: SearchItem[], city: string, limit = 12) {
  const sales = items.filter(isOnSale).sort((a, b) => discount(b) - discount(a));
  return sales.length ? { title: `Ofertas em ${city}`, items: sales.slice(0, limit) } : { title: "Novidades", items: items.slice(0, limit) };
}

// ───────────── Navegador ─────────────

let request: Promise<PreparedIndex> | null = null;

/** Baixa o índice só quando o cliente vai buscar; fica em memória entre navegações. */
export function loadSearchIndex() {
  request ??= fetch("/api/busca")
    .then((r) => {
      if (!r.ok) throw new Error(`busca ${r.status}`);
      return r.json() as Promise<SearchIndex>;
    })
    .then(prepareIndex)
    .catch((e) => {
      request = null; // deixa tentar de novo
      throw e;
    });
  return request;
}

const logged = new Set<string>();

/** Registra uma busca sem resultado (só o termo) para medir a demanda que nenhuma loja atende. */
export function logSearchMiss(term: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const t = term.trim().toLowerCase().replace(/\s+/g, " ");
  if (!url || !key || t.length < 3 || t.length > 60 || logged.has(t)) return;
  logged.add(t);
  fetch(`${url}/rest/v1/rpc/log_search_miss`, {
    method: "POST",
    keepalive: true,
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ p_term: t }),
  }).catch(() => {});
}
