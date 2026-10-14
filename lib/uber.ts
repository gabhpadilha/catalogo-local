// Uber Direct: cotação de entrega. Só no servidor (usa o client secret).
// Docs: https://developer.uber.com/docs/deliveries/guides/authentication

export type UberAddress = { street: string; city: string; state: string; cep: string };
export type UberQuote = { fee: number; etaMinutes: number; expiresAt: string };

export class QuoteError extends Error {}

const env = () => {
  const { UBER_DIRECT_CUSTOMER_ID: customer, UBER_DIRECT_CLIENT_ID: id, UBER_DIRECT_CLIENT_SECRET: secret } = process.env;
  return customer && id && secret ? { customer, id, secret } : null;
};

export const uberConfigured = () => !!env();

// O token vale 30 dias: guarda em memória e renova um pouco antes de vencer.
let token: { value: string; expiresAt: number } | null = null;

async function getToken() {
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const cfg = env();
  if (!cfg) throw new QuoteError("Cotação do Uber não configurada.");
  const res = await fetch("https://auth.uber.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: cfg.id, client_secret: cfg.secret, grant_type: "client_credentials", scope: "eats.deliveries" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Uber token ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return token.value;
}

const address = (a: UberAddress) =>
  JSON.stringify({ street_address: [a.street], city: a.city, state: a.state, zip_code: a.cep, country: "BR" });

export async function quoteDelivery(pickup: UberAddress, dropoff: UberAddress, dropoffCoords?: { lat: number; lng: number }): Promise<UberQuote> {
  const cfg = env();
  if (!cfg) throw new QuoteError("Cotação do Uber não configurada.");
  const res = await fetch(`https://api.uber.com/v1/customers/${cfg.customer}/delivery_quotes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await getToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      pickup_address: address(pickup),
      dropoff_address: address(dropoff),
      ...(dropoffCoords && { dropoff_latitude: dropoffCoords.lat, dropoff_longitude: dropoffCoords.lng }),
    }),
    cache: "no-store",
  });
  if (res.status === 401) token = null; // token revogado: o próximo pedido busca outro
  const data = (await res.json().catch(() => ({}))) as {
    fee?: number; duration?: number; expires?: string; code?: string; message?: string; metadata?: { details?: string };
  };
  if (!res.ok || typeof data.fee !== "number") {
    // Fora do raio (o Direct entrega até ~5 km da loja) ou endereço não achado: mensagem para o cliente.
    if (data.code === "address_undeliverable" && /radius/i.test(data.metadata?.details ?? "")) {
      throw new QuoteError("Esse endereço fica longe demais da loja para entrega pelo Uber (até cerca de 5 km).");
    }
    if (res.status === 400 || res.status === 404 || res.status === 422) throw new QuoteError("O Uber não entrega nesse endereço. Confira o número e o CEP.");
    throw new Error(`Uber quote ${res.status}: ${data.code ?? ""} ${data.message ?? ""}`);
  }
  return { fee: data.fee / 100, etaMinutes: Math.round(data.duration ?? 0), expiresAt: data.expires ?? "" };
}
