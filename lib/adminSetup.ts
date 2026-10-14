import type { AdminProduct, AdminStore } from "./admin";

export type SetupStep = { label: string; done: boolean; href: string };

const DEFAULT_PRIMARY = "#73030D";
const PLACEHOLDER_WHATSAPP = "5500000000000";

/** Passos para a loja ficar pronta para vender (o card some quando tudo estiver feito). */
export function setupSteps(store: AdminStore, products: AdminProduct[], zonesCount: number, base: string): SetupStep[] {
  const withPhoto = products.filter((p) => p.image_url && p.is_active).length;
  return [
    { label: "Logo da loja", done: !!store.logo_url, href: `${base}/loja` },
    { label: "Cores da sua marca", done: !!store.theme.primary && store.theme.primary.toUpperCase() !== DEFAULT_PRIMARY, href: `${base}/loja` },
    { label: "WhatsApp que recebe os pedidos", done: !!store.whatsapp && store.whatsapp !== PLACEHOLDER_WHATSAPP, href: `${base}/loja` },
    { label: "Endereço da loja", done: !!store.address, href: `${base}/loja` },
    { label: "Frete configurado", done: store.delivery_mode === "uber" ? !!store.address : zonesCount > 0, href: `${base}/loja` },
    { label: `5 produtos com foto (${Math.min(withPhoto, 5)}/5)`, done: withPhoto >= 5, href: `${base}/produtos/novo` },
  ];
}
