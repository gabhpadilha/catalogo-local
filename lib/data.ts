import { cache } from "react";
import { supabase } from "./supabase";
import { SEED } from "./seed";
import type { Product, Store, StoreCatalog, StoreTheme } from "./types";

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
  instagram: string | null; city: string; address: string | null; delivery_open: boolean; theme: unknown; hero: unknown;
  delivery_zones?: { id: string; label: string; fee: number; is_pickup: boolean; sort_order: number }[];
};

type ProductRow = {
  id: string; name: string; description: string; category: string; price: number; original_price: number | null;
  image_url: string | null; product_variants: { label: string; stock: number | null; sort_order: number }[];
};

const STORE_COLUMNS = "id, slug, name, segment, tagline, whatsapp, instagram, city, address, delivery_open, theme, hero";

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
    city: r.city,
    address: r.address ?? undefined,
    deliveryOpen: r.delivery_open,
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
