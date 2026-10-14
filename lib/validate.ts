// Validação dos formulários do painel. Tudo que vem do navegador é tratado como não confiável.

export class FormError extends Error {}

export const text = (form: FormData, key: string, max: number, required = false) => {
  const value = String(form.get(key) ?? "").trim().replace(/\s+/g, " ");
  if (required && !value) throw new FormError(`Preencha o campo "${key}".`);
  if (value.length > max) throw new FormError(`"${key}" pode ter no máximo ${max} caracteres.`);
  return value;
};

/** Aceita "59,90", "59.90", "R$ 1.299,90". Retorna null se vazio. */
export const parsePrice = (raw: unknown): number | null => {
  const s = String(raw ?? "").replace(/[R$\s]/g, "");
  if (!s) return null;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) throw new FormError(`Preço inválido: "${raw}".`);
  return Math.round(n * 100) / 100;
};

export const price = (form: FormData, key: string, required = false) => {
  const value = parsePrice(form.get(key));
  if (required && value === null) throw new FormError("Informe o preço.");
  return value;
};

/** Só dígitos; adiciona 55 se o lojista digitar só DDD + número. */
export const whatsapp = (raw: unknown) => {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  if (!/^[0-9]{12,13}$/.test(d)) throw new FormError("WhatsApp inválido. Use DDD + número, ex.: 41 99999-9999.");
  return d;
};

/** Aceita "@loja", "loja" ou a URL completa. */
export const instagram = (raw: unknown) => {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const handle = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9._]{1,30}$/i.test(handle)) throw new FormError("Instagram inválido.");
  return `https://instagram.com/${handle}`;
};

export const hexColor = (raw: unknown, fallback: string) => {
  const s = String(raw ?? "");
  return /^#[0-9a-f]{6}$/i.test(s) ? s : fallback;
};

/** URL pública de imagem no Storage do próprio projeto (ou vazio). */
export const storageUrl = (raw: unknown) => {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
  if (!s.startsWith(base)) throw new FormError("Imagem inválida. Envie a foto pelo botão.");
  return s;
};

/** Lê um campo JSON gerado pelos editores do painel. */
export const json = <T>(form: FormData, key: string): T => {
  try {
    return JSON.parse(String(form.get(key) ?? "[]")) as T;
  } catch {
    throw new FormError("Dados do formulário inválidos. Recarregue a página.");
  }
};
