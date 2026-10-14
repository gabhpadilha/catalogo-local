"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server";
import { requireStore } from "@/lib/admin";
import { FormError, hexColor, instagram, json, parsePrice, price, storageUrl, text, whatsapp } from "@/lib/validate";

export type ActionState = { error?: string; ok?: string };

const fail = (e: unknown): ActionState => {
  if (e instanceof FormError) return { error: e.message };
  console.error(e);
  return { error: "Não foi possível salvar. Tente novamente." };
};

// Atualiza a vitrine pública e a lista de lojas na hora.
const refreshStorefront = (slug: string) => {
  revalidatePath(`/${slug}`, "layout");
  revalidatePath("/");
};

// ───────────── Login ─────────────

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha incorretos." };
  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ───────────── Produtos ─────────────

type VariantInput = { label: string; inStock: boolean };

const parseVariants = (form: FormData) => {
  const raw = json<VariantInput[]>(form, "variants");
  if (!Array.isArray(raw) || raw.length === 0) throw new FormError("Adicione pelo menos uma opção (tamanho, voltagem ou \"Único\").");
  if (raw.length > 40) throw new FormError("Máximo de 40 opções por produto.");
  const seen = new Set<string>();
  return raw.map((v, i) => {
    const label = String(v?.label ?? "").trim().slice(0, 30);
    if (!label) throw new FormError("Há uma opção sem nome.");
    if (seen.has(label.toLowerCase())) throw new FormError(`A opção "${label}" está repetida.`);
    seen.add(label.toLowerCase());
    return { label, stock: v?.inStock ? null : 0, sort_order: i };
  });
};

export async function saveProduct(slug: string, productId: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { supabase, store } = await requireStore(slug);

    const salePrice = price(form, "price", true)!;
    const originalPrice = price(form, "original_price");
    if (originalPrice !== null && originalPrice <= salePrice) {
      throw new FormError("O preço \"de\" (antigo) precisa ser maior que o preço atual.");
    }
    const fields = {
      name: text(form, "name", 120, true),
      description: text(form, "description", 2000),
      category: text(form, "category", 40) || "Geral",
      price: salePrice,
      original_price: originalPrice,
      image_url: storageUrl(form.get("image_url")),
      is_active: form.get("is_active") === "on",
    };
    const variants = parseVariants(form);

    let id = productId;
    if (id) {
      const { error } = await supabase.from("products").update(fields).eq("id", id).eq("store_id", store.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("products").insert({ ...fields, store_id: store.id }).select("id").single();
      if (error) throw error;
      id = data.id as string;
    }

    // Sincroniza as opções: grava as atuais e remove as que saíram da lista.
    const { error: upErr } = await supabase
      .from("product_variants")
      .upsert(variants.map((v) => ({ ...v, product_id: id })), { onConflict: "product_id,label" });
    if (upErr) throw upErr;

    const { data: existing } = await supabase.from("product_variants").select("label").eq("product_id", id);
    const keep = new Set(variants.map((v) => v.label));
    const removed = (existing ?? []).map((v) => v.label as string).filter((l) => !keep.has(l));
    if (removed.length) {
      const { error } = await supabase.from("product_variants").delete().eq("product_id", id).in("label", removed);
      if (error) throw error;
    }

    refreshStorefront(slug);
  } catch (e) {
    return fail(e);
  }
  redirect(`/admin/${slug}`);
}

export async function setProductActive(slug: string, productId: string, active: boolean) {
  const { supabase, store } = await requireStore(slug);
  const { error } = await supabase.from("products").update({ is_active: active }).eq("id", productId).eq("store_id", store.id);
  if (error) throw error;
  refreshStorefront(slug);
}

/** Marca todas as opções como esgotadas (ou disponíveis) de uma vez. */
export async function setProductStock(slug: string, productId: string, inStock: boolean) {
  const { supabase } = await requireStore(slug);
  const { error } = await supabase.from("product_variants").update({ stock: inStock ? null : 0 }).eq("product_id", productId);
  if (error) throw error;
  refreshStorefront(slug);
}

export async function deleteProduct(slug: string, productId: string) {
  const { supabase, store } = await requireStore(slug);
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("store_id", store.id)
    .select("image_url")
    .maybeSingle();
  if (error) throw error;

  // Apaga a foto do Storage (melhor esforço).
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;
  if (data?.image_url?.startsWith(prefix)) {
    await supabase.storage.from("product-images").remove([data.image_url.slice(prefix.length)]);
  }
  refreshStorefront(slug);
  redirect(`/admin/${slug}`);
}

// ───────────── Loja ─────────────

export async function setDeliveryOpen(slug: string, open: boolean) {
  const { supabase, store } = await requireStore(slug);
  const { error } = await supabase.from("stores").update({ delivery_open: open }).eq("id", store.id);
  if (error) throw error;
  refreshStorefront(slug);
}

type ZoneInput = { id?: string; label: string; fee: string | number; pickup: boolean };

export async function saveStore(slug: string, _: ActionState, form: FormData): Promise<ActionState> {
  try {
    const { supabase, store, role } = await requireStore(slug);
    if (role !== "owner") throw new FormError("Só o dono da loja pode alterar estas configurações.");

    const theme = {
      primary: hexColor(form.get("primary"), "#73030D"),
      dark: hexColor(form.get("dark"), "#0D0D0D"),
      light: hexColor(form.get("light"), "#F2F2F2"),
    };
    const fields = {
      name: text(form, "name", 80, true),
      segment: text(form, "segment", 60) || "Loja",
      tagline: text(form, "tagline", 160),
      whatsapp: whatsapp(form.get("whatsapp")),
      instagram: instagram(form.get("instagram")),
      address: text(form, "address", 160) || null,
      theme,
      hero: {
        title: text(form, "hero_title", 40),
        highlight: text(form, "hero_highlight", 40),
        text: text(form, "hero_text", 240),
        imageUrl: storageUrl(form.get("hero_image")) ?? (store.hero.imageUrl?.startsWith("/") ? store.hero.imageUrl : undefined),
      },
      logo_url: storageUrl(form.get("logo_url")),
    };

    const zones = json<ZoneInput[]>(form, "zones");
    if (!Array.isArray(zones) || zones.length === 0) throw new FormError("Cadastre pelo menos um bairro ou a retirada na loja.");
    if (zones.length > 30) throw new FormError("Máximo de 30 bairros.");
    const cleanZones = zones.map((z, i) => {
      const label = String(z?.label ?? "").trim().slice(0, 60);
      if (!label) throw new FormError("Há um bairro sem nome.");
      return {
        id: typeof z.id === "string" && z.id ? z.id : undefined,
        label,
        fee: z.pickup ? 0 : parsePrice(z.fee) ?? 0,
        is_pickup: !!z.pickup,
        sort_order: i,
        store_id: store.id,
      };
    });

    const { error } = await supabase.from("stores").update(fields).eq("id", store.id);
    if (error) throw error;

    // Sincroniza bairros: atualiza os existentes, cria os novos, apaga os removidos.
    const { data: existing } = await supabase.from("delivery_zones").select("id").eq("store_id", store.id);
    const keepIds = new Set(cleanZones.map((z) => z.id).filter(Boolean));
    const removed = (existing ?? []).map((z) => z.id as string).filter((id) => !keepIds.has(id));
    if (removed.length) {
      const { error: delErr } = await supabase.from("delivery_zones").delete().in("id", removed);
      if (delErr) throw delErr;
    }
    const updates = cleanZones.filter((z) => z.id);
    const inserts = cleanZones
      .filter((z) => !z.id)
      .map(({ label, fee, is_pickup, sort_order, store_id }) => ({ label, fee, is_pickup, sort_order, store_id }));
    if (updates.length) {
      const { error: upErr } = await supabase.from("delivery_zones").upsert(updates);
      if (upErr) throw upErr;
    }
    if (inserts.length) {
      const { error: insErr } = await supabase.from("delivery_zones").insert(inserts);
      if (insErr) throw insErr;
    }

    refreshStorefront(slug);
    return { ok: "Loja atualizada! A vitrine já mostra as mudanças." };
  } catch (e) {
    return fail(e);
  }
}
