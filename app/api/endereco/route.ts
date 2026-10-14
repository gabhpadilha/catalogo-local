import { PLATFORM } from "@/lib/platform";

// Endereço a partir do GPS do cliente (OpenStreetMap/Nominatim, gratuito). Chamado pelo servidor
// para mandar a identificação que a política de uso do Nominatim exige.

type NominatimAddress = { road?: string; house_number?: string; suburb?: string; neighbourhood?: string; city_district?: string; postcode?: string };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return Response.json({ error: "Localização inválida." }, { status: 400 });
  }

  // 5 casas (~1 m) bastam e deixam o cache do Next reaproveitar consultas repetidas.
  const q = new URLSearchParams({ format: "jsonv2", lat: lat.toFixed(5), lon: lng.toFixed(5), zoom: "18", addressdetails: "1", "accept-language": "pt-BR" });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${q}`, {
    headers: { "User-Agent": `${PLATFORM.name.replace(/\s+/g, "")}/1.0 (vitrine de lojas de ${PLATFORM.city})` },
    next: { revalidate: 86_400 },
  }).catch(() => null);
  if (!res?.ok) return Response.json({ error: "Não foi possível achar o endereço. Preencha os campos." }, { status: 502 });

  const a = ((await res.json()) as { address?: NominatimAddress }).address ?? {};
  const cep = (a.postcode ?? "").replace(/\D/g, "");
  return Response.json({
    street: a.road ?? "",
    number: a.house_number ?? "",
    neighborhood: a.suburb ?? a.neighbourhood ?? a.city_district ?? "",
    // Sem CEP no mapa, usa o geral da cidade (o Uber usa a coordenada para a entrega).
    cep: cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : PLATFORM.cep,
  });
}
