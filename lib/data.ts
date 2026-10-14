import { cache } from "react";
import { supabase } from "./supabase/public";
import { SEED } from "./seed";
import type { Product, SearchIndex, SearchItem, SearchStore, Store, StoreCatalog, StoreTheme } from "./types";

const DEFAULT_THEME: StoreTheme = { primary: "#73030D", dark: "#0D0D0D", light: "#F2F2F2" };
const HEX = /^#[0-9a-f]{6}$/i;

// Só aceita cores hex: o tema vai direto para variáveis CSS.
const toTheme = (raw: unknown): StoreTheme => {
  const t = (raw ?? {}) as Record<string, unknown>;
  const pick = (k: keyof StoreTheme) => (typeof t[k] === "string" && HEX.test(t[k] as string) ? (t[k] as string) : DEFAULT_THEME[k]);
  return { primary: pick("primary"), dark: pick("dark"), light: pick("light") };
};

const text = (v: unknown) => (typeof v === "string" ? v : "");

type StoreRow = {
  id: string; slug: string; name: string; segment: string; tagline: string | null; whatsapp: string;
  instagram: string | null; logo_url: string | null; city: string; address: string | null; delivery_open: boolean; delivery_mode: string; theme: unknown; hero: unknown;
  delivery_zones?: { id: string; label: string; fee: number; is_pickup: boolean; sort_order: number }[];
};

type ProductRow = {
  id: string; name: string; description: string; category: string; price: number; original_price: number | null;
  image_url: string | null; product_variants: { label: string; stock: number | null; sort_order: number }[];
};

const STORE_COLUMNS = "id, slug, name, segment, tagline, whatsapp, instagram, logo_url, city, address, delivery_open, delivery_mode, theme, hero";

const toStore = (r: StoreRow): Store => {
  const hero = (r.hero ?? {}) as Record<string, unknown>;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    segment: r.segment,
    tagline: r.tagline ?? "",
    whatsapp: r.whatsapp,
    instagram: r.instagram ?? undefined,
    logoUrl: r.logo_url ?? undefined,
    city: r.city,
    address: r.address ?? undefined,
    deliveryOpen: r.delivery_open,
    deliveryMode: r.delivery_mode === "uber" ? "uber" : "zones",
    theme: toTheme(r.theme),
    hero: { title: text(hero.title) || r.name.toUpperCase(), highlight: text(hero.highlight), text: text(hero.text) || (r.tagline ?? ""), imageUrl: text(hero.imageUrl) || undefined },
    zones: [...(r.delivery_zones ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((z) => ({ id: z.id, label: z.label, fee: Number(z.fee), pickup: z.is_pickup })),
  };
};

const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  name: r.name,
  description: r.description,
  category: r.category,
  price: Number(r.price),
  originalPrice: r.original_price == null ? undefined : Number(r.original_price),
  imageUrl: r.image_url ?? "",
  variants: [...r.product_variants]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({ label: v.label, inStock: v.stock == null || v.stock > 0 })),
});

/** Lojas ativas, para a página inicial do marketplace. */
export const getStores = cache(async (): Promise<Store[]> => {
  if (!supabase) return SEED.map((s) => s.store);
  const { data, error } = await supabase.from("stores").select(STORE_COLUMNS).eq("is_active", true).order("name");
  if (error) throw error;
  return (data as StoreRow[]).map(toStore);
});

/** Loja + produtos ativos. Null se a loja não existe ou está inativa. */
export const getCatalog = cache(async (slug: string): Promise<StoreCatalog | null> => {
  if (!supabase) return SEED.find((s) => s.store.slug === slug) ?? null;

  const { data: store, error } = await supabase
    .from("stores")
    .select(`${STORE_COLUMNS}, delivery_zones (id, label, fee, is_pickup, sort_order)`)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!store) return null;

  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id, name, description, category, price, original_price, image_url, product_variants (label, stock, sort_order)")
    .eq("store_id", (store as StoreRow).id)
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (pErr) throw pErr;

  return { store: toStore(store as StoreRow), products: (products as ProductRow[]).map(toProduct) };
});

const DESCRIPTION_MAX = 160;
const PAGE = 1000;

type SearchRow = {
  id: string; name: string; description: string; category: string; price: number; original_price: number | null;
  image_url: string | null; store_id: string; product_variants: { stock: number | null }[];
};

const toSearchStore = ({ slug, name, segment, logoUrl, theme, deliveryOpen }: Store): SearchStore => ({ slug, name, segment, logoUrl, theme, deliveryOpen });

/** Produtos com estoque de todas as lojas ativas, do mais novo ao mais antigo (busca da home). */
export const getSearchIndex = cache(async (): Promise<SearchIndex> => {
  const stores = await getStores();
  if (!supabase) {
    const items = SEED.flatMap(({ store, products }) =>
      products
        .filter((p) => p.variants.some((v) => v.inStock))
        .map((p): SearchItem => ({
          id: p.id, name: p.name, category: p.category, description: p.description.slice(0, DESCRIPTION_MAX),
          price: p.price, originalPrice: p.originalPrice, imageUrl: p.imageUrl, store: store.slug,
        }))
    );
    return { stores: stores.map(toSearchStore), items };
  }

  // Em páginas: o Supabase devolve no máximo 1.000 linhas por consulta.
  const rows: SearchRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, category, price, original_price, image_url, store_id, product_variants (stock)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...(data as SearchRow[]));
    if (data.length < PAGE) break;
  }

  const slugById = new Map(stores.map((s) => [s.id, s.slug]));
  const items = rows
    .filter((r) => slugById.has(r.store_id) && r.product_variants.some((v) => v.stock == null || v.stock > 0))
    .map((r): SearchItem => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description.slice(0, DESCRIPTION_MAX),
      price: Number(r.price),
      originalPrice: r.original_price == null ? undefined : Number(r.original_price),
      imageUrl: r.image_url ?? "",
      store: slugById.get(r.store_id)!,
    }));
  return { stores: stores.map(toSearchStore), items };
});
