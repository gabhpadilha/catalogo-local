"use client";

import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import AddressFields, { type Coords, type DropoffAddress } from "./AddressFields";

export type QuoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; fee: number; etaMinutes: number }
  | { status: "error"; message: string };

const digits = (s: string) => s.replace(/\D/g, "");

type Props = {
  slug: string;
  value: DropoffAddress;
  onChange: (a: DropoffAddress) => void;
  coords: Coords | null;
  onGps: (gps: { coords: Coords; neighborhood: string } | null) => void;
  quote: QuoteState;
  onQuote: (q: QuoteState) => void;
  inputClass: string;
  labelClass: string;
};

// Endereço do cliente + cotação do Uber na hora (a cada mudança, com uma pequena espera).
export default function UberDelivery({ slug, value, onChange, coords, onGps, quote, onQuote, inputClass, labelClass }: Props) {
  // Cota quando CEP, rua e número estão preenchidos. A coordenada só vai se ainda corresponder à rua (ver AddressFields).
  const ready = digits(value.cep).length === 8 && value.street.trim().length >= 4 && value.number.trim();
  const payload = ready ? JSON.stringify({ slug, ...value, ...coords }) : "";
  useEffect(() => {
    if (!payload) {
      onQuote({ status: "idle" });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      onQuote({ status: "loading" });
      fetch("/api/frete", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, signal: ctrl.signal })
        .then(async (r) => {
          const d = await r.json();
          onQuote(r.ok ? { status: "ok", fee: d.fee, etaMinutes: d.etaMinutes } : { status: "error", message: d.error ?? "Não foi possível cotar." });
        })
        .catch((e) => e.name !== "AbortError" && onQuote({ status: "error", message: "Sem conexão para cotar o frete." }));
    }, 700);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [payload, onQuote]);

  return (
    <div className="space-y-4">
      <AddressFields
        value={value}
        onChange={onChange}
        coords={coords}
        onGps={onGps}
        showCep
        inputClass={inputClass}
        labelClass={labelClass}
        neighborhoodField={
          <div>
            <label htmlFor="co-bairro" className={labelClass}>Bairro</label>
            <input id="co-bairro" maxLength={60} value={value.neighborhood} onChange={(e) => onChange({ ...value, neighborhood: e.target.value })} className={inputClass} />
          </div>
        }
      />

      <p role="status" className={`rounded-2xl p-4 text-sm ${quote.status === "error" ? "bg-red-50 text-red-800" : "bg-brand-soft text-brand-dark"}`}>
        {quote.status === "idle" && "Preencha CEP, rua e número para ver o frete do Uber."}
        {quote.status === "loading" && "Cotando o frete no Uber…"}
        {quote.status === "ok" && (
          <>
            Frete pelo Uber: <strong className="font-semibold tabular-nums">{formatPrice(quote.fee)}</strong>
            {quote.etaMinutes > 0 && <>, entrega em cerca de {quote.etaMinutes} min depois que a loja chamar o entregador</>}.
          </>
        )}
        {quote.status === "error" && <>{quote.message} Você ainda pode enviar o pedido e combinar o frete no WhatsApp.</>}
      </p>
    </div>
  );
}
