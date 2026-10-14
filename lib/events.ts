// Métricas do painel do lojista: visita à vitrine e pedido enviado ao WhatsApp (só contagem, sem dado pessoal).
export function logStoreEvent(slug: string, kind: "visit" | "order", total = 0) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  fetch(`${url}/rest/v1/rpc/log_store_event`, {
    method: "POST",
    keepalive: true,
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ p_slug: slug, p_kind: kind, p_total: Math.round(total * 100) / 100 }),
  }).catch(() => {});
}
