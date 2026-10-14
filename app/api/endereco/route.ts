import { PLATFORM } from "@/lib/platform";

// Endereço pelo mapa (OpenStreetMap/Nominatim, gratuito), chamado pelo servidor para mandar a
// identificação que a política de uso do Nominatim exige. Dois modos:
//   ?lat=&lng=  → rua, bairro e CEP do ponto do GPS
//   ?rua=       → se a rua existe na cidade e por quais bairros ela passa

type NominatimAddress = {
  road?: string; house_number?: string; suburb?: string; neighbourhood?: string; city_district?: string; postcode?: string; town?: string; city?: string;
};
const UA = { "User-Agent": `${PLATFORM.name.replace(/\s+/g, "")}/1.0 (vitrine de lojas de ${PLATFORM.city})` };
const bairro = (a: NominatimAddress) => a.suburb ?? a.neighbourhood ?? a.city_district ?? "";
const error = (msg: string, status: number) => Response.json({ error: msg }, { status });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const street = url.searchParams.get("rua")?.replace(/\s+/g, " ").trim().slice(0, 120);
  if (street) return searchStreet(street);

  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return error("Localização inválida.", 400);

  // 5 casas (~1 m) bastam e deixam o cache do Next reaproveitar consultas repetidas.
  const q = new URLSearchParams({ format: "jsonv2", lat: lat.toFixed(5), lon: lng.toFixed(5), zoom: "18", addressdetails: "1", "accept-language": "pt-BR" });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${q}`, { headers: UA, next: { revalidate: 86_400 } }).catch(() => null);
  if (!res?.ok) return error("Não foi possível achar o endereço. Preencha os campos.", 502);

  const a = ((await res.json()) as { address?: NominatimAddress }).address ?? {};
  const cep = (a.postcode ?? "").replace(/\D/g, "");
  return Response.json({
    street: a.road ?? "",
    number: a.house_number ?? "",
    neighborhood: bairro(a),
    // Sem CEP no mapa, usa o geral da cidade (o Uber usa a coordenada para a entrega).
    cep: cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : PLATFORM.cep,
  });
}

async function searchStreet(street: string) {
  if (street.length < 4) return error("Rua muito curta.", 400);
  const q = new URLSearchParams({ street, city: PLATFORM.city, state: "Paraná", country: "Brasil", format: "jsonv2", addressdetails: "1", limit: "15", "accept-language": "pt-BR" });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${q}`, { headers: UA, next: { revalidate: 86_400 } }).catch(() => null);
  if (!res?.ok) return error("Mapa indisponível agora.", 502);

  const results = ((await res.json()) as { address?: NominatimAddress }[])
    .map((r) => r.address ?? {})
    .filter((a) => a.road && (a.town ?? a.city ?? "").toLowerCase() === PLATFORM.city.toLowerCase());
  return Response.json({
    found: results.length > 0,
    street: results[0]?.road ?? "",
    neighborhoods: [...new Set(results.map(bairro).filter(Boolean))],
  });
}
