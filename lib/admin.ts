import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { createAuthClient } from "./supabase/server";

export type AdminStore = {
  id: string;
  slug: string;
  name: string;
  segment: string;
  tagline: string | null;
  whatsapp: string;
  instagram: string | null;
  address: string | null;
  delivery_open: boolean;
  delivery_mode: string;
  is_active: boolean;
  theme: { primary?: string; dark?: string; light?: string };
  hero: { title?: string; highlight?: string; text?: string; imageUrl?: string };
  logo_url: string | null;
};

export type AdminZone = { id: string; label: string; fee: number; is_pickup: boolean; sort_order: number };

export type AdminVariant = { label: string; stock: number | null; sort_order: number };

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  product_variants: AdminVariant[];
};

const STORE_COLUMNS = "id, slug, name, segment, tagline, whatsapp, instagram, address, delivery_open, delivery_mode, is_active, theme, hero, logo_url";

/** Usuário logado (validado pelo Supabase) ou redireciona para o login. */
export const requireUser = cache(async () => {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");
  return { supabase, userId, email: (data.claims.email as string | undefined) ?? "" };
});

/** Lojas em que o usuário é membro. */
export const getMyStores = cache(async () => {
  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("store_members")
    .select("role, stores (id, slug, name, segment, is_active)")
    .eq("user_id", userId);
  if (error) throw error;
  type Row = { role: string; stores: { id: string; slug: string; name: string; segment: string; is_active: boolean } };
  return (data as unknown as Row[]).map((r) => ({ ...r.stores, role: r.role }));
});

/** Loja do painel: só se o usuário for membro dela. */
export const requireStore = cache(async (slug: string) => {
  const { supabase, userId } = await requireUser();
  const { data: store, error } = await supabase.from("stores").select(STORE_COLUMNS).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!store) notFound();

  const { data: member } = await supabase
    .from("store_members")
    .select("role")
    .eq("store_id", store.id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!member) notFound();

  return { supabase, store: store as AdminStore, role: member.role as "owner" | "staff" };
});

export const getAdminProducts = async (slug: string) => {
  const { supabase, store } = await requireStore(slug);
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, category, price, original_price, image_url, is_active, sort_order, product_variants (label, stock, sort_order)")
    .eq("store_id", store.id)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as AdminProduct[];
};

export const getAdminZones = async (slug: string) => {
  const { supabase, store } = await requireStore(slug);
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id, label, fee, is_pickup, sort_order")
    .eq("store_id", store.id)
    .order("sort_order");
  if (error) throw error;
  return data as AdminZone[];
};

export type StoreStats = { todayOrders: number; todayTotal: number; weekOrders: number; weekTotal: number; weekVisits: number };

// Data no fuso de Guaratuba (os eventos são gravados assim pelo banco).
const spDate = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

/** Pedidos enviados e visitas dos últimos 7 dias (o lojista só lê as métricas da própria loja). */
export const getStoreStats = async (slug: string): Promise<StoreStats> => {
  const { supabase, store } = await requireStore(slug);
  const today = spDate(new Date());
  const weekStart = spDate(new Date(Date.now() - 6 * 86_400_000));
  const { data, error } = await supabase
    .from("store_events")
    .select("day, kind, hits, total")
    .eq("store_id", store.id)
    .gte("day", weekStart);
  if (error) throw error;
  const stats: StoreStats = { todayOrders: 0, todayTotal: 0, weekOrders: 0, weekTotal: 0, weekVisits: 0 };
  for (const e of data as { day: string; kind: string; hits: number; total: number }[]) {
    if (e.kind === "visit") stats.weekVisits += e.hits;
    if (e.kind !== "order") continue;
    stats.weekOrders += e.hits;
    stats.weekTotal += Number(e.total);
    if (e.day === today) {
      stats.todayOrders += e.hits;
      stats.todayTotal += Number(e.total);
    }
  }
  return stats;
};
