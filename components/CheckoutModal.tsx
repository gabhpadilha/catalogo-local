"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useStore } from "./StoreProvider";
import Sheet, { SheetIconButton } from "./Sheet";
import { CheckIcon, CloseIcon, PinIcon, WhatsAppIcon } from "./icons";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { PLATFORM } from "@/lib/platform";
import { logStoreEvent } from "@/lib/events";
import type { CartItem, DeliveryZone } from "@/lib/types";
import UberDelivery, { type QuoteState } from "./UberDelivery";
import AddressFields, { addressLine, emptyAddress, useStreetCheck, type Coords, type DropoffAddress, type StreetCheck } from "./AddressFields";
import { sameNeighborhood } from "@/lib/neighborhoods";

const CUSTOMER_KEY = "gribb-customer";
const NAME_MAX = 60;
const ADDRESS_MAX = 160;

type Customer = { name: string; deliveryId: string; address: string; drop: DropoffAddress };
const UBER = "uber"; // deliveryId de "entrega pelo Uber" (não é uma zona)

// Só é montado no cliente (após interação), por isso o localStorage é seguro aqui.
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

// Dados do cliente são compartilhados entre lojas; o bairro é validado contra as zonas da loja atual.
const loadCustomer = (zones: DeliveryZone[]): Customer => {
  let saved: Partial<Record<keyof Customer, unknown>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(CUSTOMER_KEY) ?? "{}") ?? {};
  } catch {}
  // Escolha salva desta loja, ou vazio (quem chama decide o padrão).
  const deliveryId = zones.some((o) => o.id === saved.deliveryId) ? (saved.deliveryId as string) : "";
  const d = (saved.drop ?? {}) as Partial<Record<keyof DropoffAddress, unknown>>;
  const drop = { cep: str(d.cep, 9), street: str(d.street, 120), number: str(d.number, 20), complement: str(d.complement, 60), neighborhood: str(d.neighborhood, 60) };
  return { name: str(saved.name, NAME_MAX), deliveryId, address: str(saved.address, ADDRESS_MAX), drop };
};

// Uma linha só, sem espaços repetidos.
const clean = (s: string) => s.replace(/\s+/g, " ").trim();

// O que o mapa diz sobre o endereço: bairro pelo GPS, bairros por onde a rua passa, ou nada.
type Evidence = { method: "gps" | "street"; neighborhoods: string[] } | { method: "notfound" | "pending" };

const evidenceOf = (gpsNeighborhood: string | null, check: StreetCheck): Evidence =>
  gpsNeighborhood
    ? { method: "gps", neighborhoods: [gpsNeighborhood] }
    : check.status === "found" && check.neighborhoods.length
      ? { method: "street", neighborhoods: check.neighborhoods }
      : { method: check.status === "notfound" ? "notfound" : "pending" };

// Selo para o lojista conferir antes de mandar o Pix.
const checkLine = (ev: Evidence, chosen?: string, outside: string[] = []) => {
  if (!("neighborhoods" in ev)) {
    return ev.method === "notfound" ? "⚠ Rua não encontrada no mapa: confira o endereço antes de cobrar o frete" : "⚠ Endereço não conferido no mapa";
  }
  const where = ev.neighborhoods.join(", ");
  if (chosen && !ev.neighborhoods.some((n) => sameNeighborhood(n, chosen))) return `⚠ Pelo mapa, o endereço fica em ${where}: confira o bairro (${chosen})`;
  if (ev.method === "street" && outside.length) return `⚠ A rua passa por ${where}; confira se é mesmo ${chosen} (${outside.join(", ")} fora da tabela)`;
  return ev.method === "gps" ? `✔ Bairro confirmado pelo GPS (${where})` : `✔ Rua encontrada no mapa (${where})`;
};

// Como o pedido vai ser entregue, para montar a mensagem.
type Shipping =
  | { kind: "pickup" }
  | { kind: "zone"; label: string; fee: number; address: string; mapUrl: string; check: string }
  | { kind: "uber"; fee: number | null; address: string; cep: string; mapUrl: string; check: string };

const shippingLines = (s: Shipping, subtotal: number, city: string) => {
  if (s.kind === "pickup") return { fee: ["Entrega: Retirada na loja (grátis)", `*Total: ${formatPrice(subtotal)}*`], where: ["Retirada na loja"] };
  if (s.kind === "zone") {
    return {
      fee: [`Frete Uber Flash (${s.label}): ~${formatPrice(s.fee)} — a confirmar`, `*Total estimado: ${formatPrice(subtotal + s.fee)}*`],
      where: [`Endereço: ${clean(s.address)} — ${s.label}, ${city}`, `Mapa: ${s.mapUrl}`, s.check],
    };
  }
  return {
    fee:
      s.fee == null
        ? ["Frete: a combinar (o site não conseguiu cotar)", `*Total sem frete: ${formatPrice(subtotal)}*`]
        : [`Frete Uber (cotado no site): ${formatPrice(s.fee)}`, `*Total: ${formatPrice(subtotal + s.fee)}*`],
    where: [`Endereço: ${clean(s.address)}, ${city} - CEP ${s.cep}`, `Mapa: ${s.mapUrl}`, s.check],
  };
};

const buildOrderMessage = (storeName: string, city: string, cart: CartItem[], name: string, subtotal: number, shipping: Shipping) => {
  const { fee, where } = shippingLines(shipping, subtotal, city);
  return [
    `Olá! Quero fazer este pedido na ${storeName}:`,
    "",
    ...cart.map((i) => `• ${i.quantity}x ${i.name} (${i.selectedSize}) — ${formatPrice(i.price * i.quantity)}`),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    ...fee,
    "",
    `Nome: ${clean(name)}`,
    ...where,
  ].join("\n");
};

const mapUrl = (address: string, city: string, coords: Coords | null) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords ? `${coords.lat},${coords.lng}` : `${address}, ${city} - ${PLATFORM.state}`)}`;

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-brand-line bg-white text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/10 transition";
const labelClass = "block text-sm font-medium text-brand-dark mb-2";
const segment =
  "grid place-items-center h-10 rounded-full text-sm font-medium cursor-pointer text-brand-muted has-[:checked]:bg-white has-[:checked]:text-brand-dark has-[:checked]:shadow-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-dark transition-colors";

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { cart, total: subtotal, clearCart } = useCart();
  const { store } = useStore();
  const zones = store.zones;
  const uber = store.deliveryMode === "uber";
  const pickupZone = zones.find((z) => z.pickup);
  const deliveryZones = zones.filter((z) => !z.pickup);
  const [customer, setCustomer] = useState(() => {
    const c = loadCustomer(zones);
    // Padrão é entrega (não retirada, mesmo que ela seja a primeira zona); retirada só se o cliente escolheu antes.
    if (c.deliveryId === pickupZone?.id) return c;
    if (uber) return { ...c, deliveryId: UBER };
    return { ...c, deliveryId: c.deliveryId || ((zones.find((z) => !z.pickup) ?? zones[0])?.id ?? "") };
  });
  const [coords, setCoords] = useState<Coords | null>(null);
  const [gpsNeighborhood, setGpsNeighborhood] = useState<string | null>(null);
  const onGps = useCallback((g: { coords: Coords; neighborhood: string } | null) => {
    setCoords(g?.coords ?? null);
    setGpsNeighborhood(g?.neighborhood || null);
  }, []);
  const [quote, setQuote] = useState<QuoteState>({ status: "idle" });
  const setDrop = useCallback((drop: DropoffAddress) => setCustomer((c) => ({ ...c, drop })), []);
  // Bairro lembrado ao alternar entre entrega e retirada.
  const [lastDeliveryId, setLastDeliveryId] = useState(() =>
    deliveryZones.some((z) => z.id === customer.deliveryId) ? customer.deliveryId : deliveryZones[0]?.id ?? ""
  );
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const delivery: DeliveryZone = zones.find((o) => o.id === customer.deliveryId) ?? zones[0] ?? { id: "", label: "A combinar", fee: 0 };
  const pickup = uber ? customer.deliveryId === pickupZone?.id : !!delivery.pickup;
  const uberFee = quote.status === "ok" ? quote.fee : null;
  const fee = pickup ? 0 : uber ? uberFee ?? 0 : delivery.fee;
  const drop = customer.drop ?? emptyAddress;
  // Com Uber, só envia depois que a cotação respondeu (com valor ou com erro, aí o frete fica a combinar).
  const waitingQuote = uber && !pickup && (quote.status === "idle" || quote.status === "loading");
  // Bairro decidido pelo endereço, não pela escolha livre: só entram as zonas que batem com o mapa.
  const streetCheck = useStreetCheck(pickup ? "" : drop.street);
  const evidence = evidenceOf(coords ? gpsNeighborhood : null, streetCheck);
  const matching = "neighborhoods" in evidence ? deliveryZones.filter((z) => evidence.neighborhoods.some((n) => sameNeighborhood(z.label, n))) : [];
  // Bairros do mapa que a loja não atende (ex.: a rua também passa pela Prainha, que não está na tabela).
  const outside = "neighborhoods" in evidence ? evidence.neighborhoods.filter((n) => !deliveryZones.some((z) => sameNeighborhood(z.label, n))) : [];
  const zoneOptions = matching.length ? matching : deliveryZones;
  const zoneLocked = matching.length === 1 && outside.length === 0;
  const matchKey = matching.map((z) => z.id).join(",");
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (uber || pickup || !matchKey) return;
    const ids = matchKey.split(",");
    if (!ids.includes(customer.deliveryId)) {
      setLastDeliveryId(ids[0]);
      setCustomer((c) => ({ ...c, deliveryId: ids[0] }));
    }
  }, [uber, pickup, matchKey, customer.deliveryId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const update = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [field]: e.target.value }));
  const chooseZone = (id: string) => {
    if (deliveryZones.some((z) => z.id === id)) setLastDeliveryId(id);
    setCustomer((c) => ({ ...c, deliveryId: id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (waitingQuote) return;
    const shipping: Shipping = pickup
      ? { kind: "pickup" }
      : uber
        ? { kind: "uber", fee: uberFee, address: addressLine(drop), cep: drop.cep, mapUrl: mapUrl(`${drop.street}, ${drop.number}${drop.neighborhood ? ` - ${drop.neighborhood}` : ""}`, store.city, coords), check: checkLine(evidence) }
        : {
            kind: "zone",
            label: delivery.label,
            fee: delivery.fee,
            address: addressLine({ ...drop, neighborhood: "" }),
            mapUrl: mapUrl(`${drop.street}, ${drop.number} - ${delivery.label}`, store.city, coords),
            check: checkLine(evidence, delivery.label, outside),
          };
    const url = whatsappUrl(store.whatsapp, buildOrderMessage(store.name, store.city, cart, customer.name, subtotal, shipping));
    window.open(url, "_blank", "noopener,noreferrer");
    logStoreEvent(store.slug, "order", subtotal + fee);
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    } catch {}
    // Mantém o link à mão caso o navegador bloqueie a nova aba.
    setSentUrl(url);
    clearCart();
  };

  if (sentUrl) {
    return (
      <div className="px-6 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-10 text-center">
        <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-brand-tint text-brand-primary">
          <CheckIcon className="w-7 h-7" />
        </span>
        <h2 id="checkout-title" className="headline font-bold text-2xl mt-5">Agora é só enviar no WhatsApp</h2>
        <p className="text-brand-muted mt-2 max-w-sm mx-auto">
          O pedido já está escrito na conversa com a {store.name}. Envie a mensagem para confirmar o frete e receber a chave Pix.
        </p>
        <a
          href={sentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-2 w-full h-13 rounded-full bg-brand-primary text-brand-light font-semibold hover:bg-brand-dark transition-colors"
        >
          <WhatsAppIcon />
          Abrir o WhatsApp de novo
        </a>
        <button type="button" onClick={onClose} className="mt-2 w-full h-12 rounded-full font-semibold text-brand-muted hover:text-brand-dark">
          Voltar à loja
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between gap-3 px-5 sm:px-8 h-16 border-b border-brand-line shrink-0">
        <h2 id="checkout-title" className="headline font-bold text-xl">Finalizar pedido</h2>
        <SheetIconButton label="Fechar" onClick={onClose}>
          <CloseIcon />
        </SheetIconButton>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 space-y-5">
        <div>
          <label htmlFor="co-name" className={labelClass}>Seu nome</label>
          <input id="co-name" required autoComplete="name" maxLength={NAME_MAX} placeholder="Como podemos te chamar?" value={customer.name} onChange={update("name")} className={inputClass} />
        </div>

        {pickupZone && (uber || deliveryZones.length > 0) && (
          <fieldset>
            <legend className={labelClass}>Como você quer receber?</legend>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-brand-soft">
              <label className={segment}>
                <input type="radio" name="co-mode" className="sr-only" checked={!pickup} onChange={() => chooseZone(uber ? UBER : lastDeliveryId)} />
                Entrega
              </label>
              <label className={segment}>
                <input type="radio" name="co-mode" className="sr-only" checked={pickup} onChange={() => chooseZone(pickupZone.id)} />
                Retirar na loja
              </label>
            </div>
          </fieldset>
        )}

        {pickup ? (
          <p className="flex gap-3 rounded-2xl bg-brand-soft p-4 text-sm text-brand-dark">
            <PinIcon className="w-5 h-5 shrink-0 text-brand-muted" />
            <span>
              {store.address ? <>Retire em {store.address}, {store.city}.</> : <>Retire na loja, em {store.city}.</>} O horário é combinado no WhatsApp.
            </span>
          </p>
        ) : uber ? (
          <UberDelivery
            slug={store.slug}
            value={drop}
            onChange={setDrop}
            coords={coords}
            onGps={onGps}
            quote={quote}
            onQuote={setQuote}
            inputClass={inputClass}
            labelClass={labelClass}
          />
        ) : (
          <AddressFields
            value={drop}
            onChange={setDrop}
            coords={coords}
            onGps={onGps}
            showCep={false}
            inputClass={inputClass}
            labelClass={labelClass}
            neighborhoodField={
              deliveryZones.length > 0 && (
                <div>
                  <label htmlFor="co-delivery" className={labelClass}>Bairro</label>
                  <select
                    id="co-delivery"
                    value={customer.deliveryId}
                    disabled={zoneLocked}
                    onChange={(e) => chooseZone(e.target.value)}
                    className={`${inputClass} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10 disabled:bg-brand-soft disabled:opacity-100`}
                    style={{ backgroundImage: zoneLocked ? undefined : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                  >
                    {zoneOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label} (frete {formatPrice(o.fee)})
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-brand-muted">
                    {zoneLocked
                      ? evidence.method === "gps"
                        ? "Bairro definido pela sua localização."
                        : "Bairro definido pela rua informada."
                      : matching.length > 0 && outside.length > 0
                        ? `Essa rua também passa por ${outside.join(", ")}, fora da tabela da loja. Escolha o seu bairro; a loja confere antes do Pix.`
                        : matching.length > 1
                          ? "Essa rua passa por mais de um bairro: escolha o seu."
                        : "neighborhoods" in evidence
                          ? `Pelo mapa, esse endereço fica em ${evidence.neighborhoods.join(", ")}, fora da tabela da loja. A loja confirma o frete no WhatsApp.`
                          : evidence.method === "notfound"
                            ? "Não achamos essa rua no mapa. Escolha o bairro; a loja confere antes do Pix."
                            : "Informe a rua para conferirmos o bairro."}
                  </p>
                </div>
              )
            }
          />
        )}

        {PLATFORM.demo && (
          <p role="note" className="rounded-2xl bg-amber-100 text-amber-950 text-sm p-4">
            <strong className="font-semibold">Demonstração.</strong> Esta loja é fictícia: o pedido vai para um número de teste e não será atendido.
          </p>
        )}

        <dl className="rounded-2xl border border-brand-line p-4 space-y-2 text-sm">
          <div className="flex justify-between text-brand-muted">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-brand-muted">
            <dt>{pickup ? "Retirada na loja" : uber ? "Frete pelo Uber" : "Frete estimado (Uber Flash)"}</dt>
            <dd className="tabular-nums">
              {pickup ? "Grátis" : !uber ? formatPrice(delivery.fee) : uberFee != null ? formatPrice(uberFee) : quote.status === "loading" ? "Cotando…" : "A combinar"}
            </dd>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-brand-line">
            <dt className="font-medium text-brand-dark">{pickup || uberFee != null ? "Total" : uber ? "Total sem frete" : "Total estimado"}</dt>
            <dd className="text-xl font-semibold text-brand-dark tabular-nums">{formatPrice(subtotal + fee)}</dd>
          </div>
        </dl>
        {!pickup && (
          <p className="text-sm text-brand-muted -mt-2">
            {uber
              ? "Valor cotado agora no Uber. A loja confirma no WhatsApp e chama o entregador depois do Pix."
              : "O frete final é cotado no Uber na hora do pedido e confirmado no WhatsApp antes do Pix."}
          </p>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-line px-5 sm:px-8 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6">
        <button
          type="submit"
          disabled={cart.length === 0 || waitingQuote}
          className="w-full h-13 rounded-full bg-brand-primary text-brand-light font-semibold hover:bg-brand-dark transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
        >
          <WhatsAppIcon />
          Enviar pedido no WhatsApp
        </button>
      </div>
    </form>
  );
}

export default function CheckoutModal() {
  const { isCheckoutOpen, setCheckoutOpen } = useCart();
  const close = useCallback(() => setCheckoutOpen(false), [setCheckoutOpen]);
  // Montagem condicional: o formulário reinicia a cada abertura.
  return isCheckoutOpen ? (
    <Sheet open onClose={close} labelledBy="checkout-title">
      <CheckoutForm onClose={close} />
    </Sheet>
  ) : null;
}
