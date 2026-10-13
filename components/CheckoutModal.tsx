"use client";

import { useCallback, useState } from "react";
import { useCart } from "./CartProvider";
import { useDialog } from "@/lib/useDialog";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { useStore } from "./StoreProvider";
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
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-brand-dark font-medium placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition";
const labelClass = "block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2";

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { cart, total: subtotal, clearCart } = useCart();
  const { store } = useStore();
  const zones = store.zones;
  const [customer, setCustomer] = useState(() => loadCustomer(zones));
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  useDialog(true, onClose);

  const delivery: DeliveryZone = zones.find((o) => o.id === customer.deliveryId) ?? zones[0] ?? { id: "", label: "A combinar", fee: 0 };
  const pickup = !!delivery.pickup;
  const update = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [field]: e.target.value }));

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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div role="dialog" aria-modal="true" aria-labelledby="checkout-done" className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
          <h2 id="checkout-done" className="text-2xl font-black text-brand-dark tracking-tight mb-2">Pedido enviado!</h2>
          <p className="text-brand-muted mb-6">Finalize a conversa no WhatsApp para confirmar o frete e receber a chave Pix.</p>
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg mb-3">
            Abrir WhatsApp novamente
          </a>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-full font-bold text-brand-muted hover:text-brand-dark transition-colors">
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90dvh]"
      >
        <div className="flex items-center justify-between p-6 sm:px-8 border-b border-gray-100">
          <h2 id="checkout-title" className="text-2xl font-black text-brand-dark tracking-tight">Finalizar Pedido</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-full text-brand-dark hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:px-8 space-y-5">
          <div>
            <label htmlFor="co-name" className={labelClass}>Nome</label>
            <input id="co-name" required autoComplete="name" maxLength={NAME_MAX} placeholder="Como te chamamos?" value={customer.name} onChange={update("name")} className={inputClass} />
          </div>

          <div>
            <label htmlFor="co-delivery" className={labelClass}>Bairro de Entrega · {store.city}</label>
            <div className="relative">
              <select id="co-delivery" value={customer.deliveryId} onChange={update("deliveryId")} className={`${inputClass} appearance-none pr-10`}>
                {zones.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} {o.pickup ? "(Grátis)" : `(~${formatPrice(o.fee)})`}
                  </option>
                ))}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {!pickup && (
            <div>
              <label htmlFor="co-address" className={labelClass}>Endereço Completo</label>
              <input id="co-address" required autoComplete="street-address" maxLength={ADDRESS_MAX} placeholder="Rua, número e referência" value={customer.address} onChange={update("address")} className={inputClass} />
            </div>
          )}

          <dl className="bg-[#F8F8F8] rounded-2xl p-5 space-y-2 text-sm">
            <div className="flex justify-between text-brand-muted font-medium">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-brand-muted font-medium">
              <dt>{pickup ? "Retirada na loja" : "Frete Uber Flash · estimativa"}</dt>
              <dd>{pickup ? "Grátis" : `~${formatPrice(delivery.fee)}`}</dd>
            </div>
            <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-gray-200">
              <dt className="font-bold text-brand-dark">{pickup ? "Total" : "Total estimado"}</dt>
              <dd className="text-2xl font-black text-brand-primary">{formatPrice(subtotal + delivery.fee)}</dd>
            </div>
          </dl>
          {!pickup && (
            <p className="text-xs text-brand-muted -mt-2">O frete final é cotado no Uber no momento do pedido e confirmado no WhatsApp antes do Pix.</p>
          )}
        </div>

        <div className="p-6 sm:px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] border-t border-gray-100">
          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Enviar Pedido para WhatsApp
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutModal() {
  const { isCheckoutOpen, setCheckoutOpen } = useCart();
  const close = useCallback(() => setCheckoutOpen(false), [setCheckoutOpen]);
  // Montagem condicional: o formulário reinicia a cada abertura.
  return isCheckoutOpen ? <CheckoutForm onClose={close} /> : null;
}
