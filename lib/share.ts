import { headers } from "next/headers";
import QRCode from "qrcode";

/** Endereço público da vitrine (domínio do pedido atual) e o QR Code em SVG. */
export async function storeShareInfo(slug: string) {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const url = `${proto}://${host}/${slug}`;
  const qrSvg = await QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#10201D", light: "#FFFFFF" } });
  return { url, qrSvg };
}
