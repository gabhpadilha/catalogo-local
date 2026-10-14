import { getCatalog } from "@/lib/data";
import { PLATFORM } from "@/lib/platform";
import { QuoteError, quoteDelivery } from "@/lib/uber";

// Cotação do frete pelo Uber Direct para o checkout. O preço nunca vem do cliente: só o endereço.

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

// Limite simples por IP (por instância): evita que alguém use a conta da plataforma para cotar em massa.
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 15;
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (limited(ip)) return Response.json({ error: "Muitas cotações seguidas. Espere um minuto." }, { status: 429 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const slug = str(body?.slug, 40);
  const street = str(body?.street, 120);
  const number = str(body?.number, 20);
  const complement = str(body?.complement, 60);
  const neighborhood = str(body?.neighborhood, 60);
  const cep = str(body?.cep, 9).replace(/\D/g, "");
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  if (!slug || !street || !number || cep.length !== 8) {
    return Response.json({ error: "Informe CEP, rua e número." }, { status: 400 });
  }

  const catalog = await getCatalog(slug);
  const store = catalog?.store;
  if (!store || store.deliveryMode !== "uber" || !store.address) {
    return Response.json({ error: "Esta loja combina o frete pelo WhatsApp." }, { status: 400 });
  }

  const coords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : undefined;
  try {
    const quote = await quoteDelivery(
      { street: store.address, city: store.city, state: PLATFORM.state, cep: PLATFORM.cep },
      { street: [`${street}, ${number}`, complement, neighborhood].filter(Boolean).join(" - "), city: store.city, state: PLATFORM.state, cep: `${cep.slice(0, 5)}-${cep.slice(5)}` },
      coords
    );
    return Response.json(quote);
  } catch (e) {
    if (e instanceof QuoteError) return Response.json({ error: e.message }, { status: 422 });
    console.error(e);
    return Response.json({ error: "Não foi possível cotar agora. A loja combina o frete pelo WhatsApp." }, { status: 502 });
  }
}
