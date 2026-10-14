"use client";

import { useCallback, useState } from "react";
import { useCart } from "./CartProvider";
import { useStore } from "./StoreProvider";
import Sheet, { SheetIconButton } from "./Sheet";
import { CheckIcon, CloseIcon, PinIcon, WhatsAppIcon } from "./icons";
import { formatPrice, whatsappUrl } from "@/lib/format";
import type { CartItem, DeliveryZone } from "@/lib/types";

const CUSTOMER_KEY = "gribb-customer";
const NAME_MAX = 60;
const ADDRESS_MAX = 160;

type Customer = { name: string; deliveryId: string; address: string };

// Só é montado no cliente (após interação), por isso o localStorage é seguro aqui.
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

// Dados do cliente são compartilhados entre lojas; o bairro é validado contra as zonas da loja atual.
const loadCustomer = (zones: DeliveryZone[]): Customer => {
  let saved: Partial<Record<keyof Customer, unknown>> = {};
  try {
    saved = JSON.parse(localStorage.getItem(CUSTOMER_KEY) ?? "{}") ?? {};
  } catch {}
  const deliveryId = zones.some((o) => o.id === saved.deliveryId) ? (saved.deliveryId as string) : zones[0]?.id ?? "";
  return { name: str(saved.name, NAME_MAX), deliveryId, address: str(saved.address, ADDRESS_MAX) };
};

// Uma linha só, sem espaços repetidos.
const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const buildOrderMessage = (storeName: string, city: string, cart: CartItem[], c: Customer, subtotal: number, fee: number, deliveryLabel: string, pickup: boolean) =>
  [
    `Olá! Quero fazer este pedido na ${storeName}:`,
    "",
    ...cart.map((i) => `• ${i.quantity}x ${i.name} (${i.selectedSize}) — ${formatPrice(i.price * i.quantity)}`),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    pickup ? "Entrega: Retirada na loja (grátis)" : `Frete Uber Flash (${deliveryLabel}): ~${formatPrice(fee)} — a confirmar`,
    `*Total${pickup ? "" : " estimado"}: ${formatPrice(subtotal + fee)}*`,
    "",
    `Nome: ${clean(c.name)}`,
    pickup ? "Retirada na loja" : `Endereço: ${clean(c.address)} — ${deliveryLabel}, ${city}`,
  ].join("\n");

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-brand-line bg-white text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/10 transition";
const labelClass = "block text-sm font-medium text-brand-dark mb-2";
const segment =
  "grid place-items-center h-10 rounded-full text-sm font-medium cursor-pointer text-brand-muted has-[:checked]:bg-white has-[:checked]:text-brand-dark has-[:checked]:shadow-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-dark transition-colors";

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { cart, total: subtotal, clearCart } = useCart();
  const { store } = useStore();
  const zones = store.zones;
  const pickupZone = zones.find((z) => z.pickup);
  const deliveryZones = zones.filter((z) => !z.pickup);
  const [customer, setCustomer] = useState(() => loadCustomer(zones));
  // Bairro lembrado ao alternar entre entrega e retirada.
  const [lastDeliveryId, setLastDeliveryId] = useState(() =>
    deliveryZones.some((z) => z.id === customer.deliveryId) ? customer.deliveryId : deliveryZones[0]?.id ?? ""
  );
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const delivery: DeliveryZone = zones.find((o) => o.id === customer.deliveryId) ?? zones[0] ?? { id: "", label: "A combinar", fee: 0 };
  const pickup = !!delivery.pickup;
  const update = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [field]: e.target.value }));
  const chooseZone = (id: string) => {
    if (deliveryZones.some((z) => z.id === id)) setLastDeliveryId(id);
    setCustomer((c) => ({ ...c, deliveryId: id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const url = whatsappUrl(store.whatsapp, buildOrderMessage(store.name, store.city, cart, customer, subtotal, delivery.fee, delivery.label, pickup));
    window.open(url, "_blank", "noopener,noreferrer");
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

        {pickupZone && deliveryZones.length > 0 && (
          <fieldset>
            <legend className={labelClass}>Como você quer receber?</legend>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-brand-soft">
              <label className={segment}>
                <input type="radio" name="co-mode" className="sr-only" checked={!pickup} onChange={() => chooseZone(lastDeliveryId)} />
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
        ) : (
          <>
            {deliveryZones.length > 0 && (
              <div>
                <label htmlFor="co-delivery" className={labelClass}>Bairro</label>
                <select id="co-delivery" value={customer.deliveryId} onChange={(e) => chooseZone(e.target.value)} className={`${inputClass} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
                  {deliveryZones.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label} (frete {formatPrice(o.fee)})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="co-address" className={labelClass}>Endereço</label>
              <input id="co-address" required autoComplete="street-address" maxLength={ADDRESS_MAX} placeholder="Rua, número e complemento" value={customer.address} onChange={update("address")} className={inputClass} />
            </div>
          </>
        )}

        <dl className="rounded-2xl border border-brand-line p-4 space-y-2 text-sm">
          <div className="flex justify-between text-brand-muted">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-brand-muted">
            <dt>{pickup ? "Retirada na loja" : "Frete estimado (Uber Flash)"}</dt>
            <dd className="tabular-nums">{pickup ? "Grátis" : formatPrice(delivery.fee)}</dd>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-brand-line">
            <dt className="font-medium text-brand-dark">{pickup ? "Total" : "Total estimado"}</dt>
            <dd className="text-xl font-semibold text-brand-dark tabular-nums">{formatPrice(subtotal + delivery.fee)}</dd>
          </div>
        </dl>
        {!pickup && (
          <p className="text-sm text-brand-muted -mt-2">O frete final é cotado no Uber na hora do pedido e confirmado no WhatsApp antes do Pix.</p>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-line px-5 sm:px-8 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6">
        <button
          type="submit"
          disabled={cart.length === 0}
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
