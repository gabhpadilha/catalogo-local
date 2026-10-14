"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { PinIcon } from "./icons";

export type DropoffAddress = { cep: string; street: string; number: string; complement: string; neighborhood: string };
export type Coords = { lat: number; lng: number };
export type QuoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; fee: number; etaMinutes: number }
  | { status: "error"; message: string };

export const emptyAddress: DropoffAddress = { cep: "", street: "", number: "", complement: "", neighborhood: "" };

const digits = (s: string) => s.replace(/\D/g, "");
const maskCep = (s: string) => digits(s).slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

export const addressLine = (a: DropoffAddress) =>
  [`${a.street}, ${a.number}`, a.complement, a.neighborhood].filter((p) => p.trim()).join(" - ");

type Props = {
  slug: string;
  value: DropoffAddress;
  onChange: (a: DropoffAddress) => void;
  coords: Coords | null;
  onCoords: (c: Coords | null) => void;
  quote: QuoteState;
  onQuote: (q: QuoteState) => void;
  inputClass: string;
  labelClass: string;
};

// Endereço do cliente + cotação do Uber na hora (a cada mudança, com uma pequena espera).
export default function UberDelivery({ slug, value, onChange, coords, onCoords, quote, onQuote, inputClass, labelClass }: Props) {
  const [cepStatus, setCepStatus] = useState<"" | "loading" | "notfound">("");
  const [gps, setGps] = useState<"" | "loading" | "denied" | "filled">("");
  const lastCep = useRef("");
  const numberRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  });
  const set = (field: keyof DropoffAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [field]: field === "cep" ? maskCep(e.target.value) : e.target.value });

  // CEP completo: o ViaCEP preenche rua e bairro (o cliente ainda pode corrigir).
  useEffect(() => {
    const cep = digits(value.cep);
    if (cep.length !== 8 || cep === lastCep.current) return;
    lastCep.current = cep;
    let cancelled = false;
    setCepStatus("loading");
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((d: { erro?: boolean; logradouro?: string; bairro?: string }) => {
        if (cancelled) return;
        if (d.erro) return setCepStatus("notfound");
        setCepStatus("");
        onChange({ ...value, street: d.logradouro || value.street, neighborhood: d.bairro || value.neighborhood });
      })
      .catch(() => !cancelled && setCepStatus(""));
    return () => {
      cancelled = true;
    };
  }, [value, onChange]);

  // Cota quando CEP, rua e número estão preenchidos; espera o cliente parar de digitar.
  const ready = digits(value.cep).length === 8 && value.street.trim() && value.number.trim();
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

  const useLocation = () => {
    if (!navigator.geolocation) return setGps("denied");
    setGps("loading");
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const c = { lat: Number(p.coords.latitude.toFixed(6)), lng: Number(p.coords.longitude.toFixed(6)) };
        onCoords(c);
        // Preenche CEP, rua e bairro pelo mapa; o número quase nunca vem, então o foco vai para ele.
        try {
          const r = await fetch(`/api/endereco?lat=${c.lat}&lng=${c.lng}`);
          const d = (await r.json()) as Partial<DropoffAddress> & { error?: string };
          if (!r.ok || !d.street) return setGps("denied");
          const current = valueRef.current;
          lastCep.current = (d.cep ?? "").replace(/\D/g, ""); // não deixa o ViaCEP sobrescrever o que veio do mapa
          onChange({
            ...current,
            cep: d.cep ?? current.cep,
            street: d.street,
            neighborhood: d.neighborhood || current.neighborhood,
            number: current.number || d.number || "",
          });
          setGps("filled");
          if (!current.number && !d.number) numberRef.current?.focus();
        } catch {
          setGps("denied");
        }
      },
      () => setGps("denied"),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-end">
        <div>
          <label htmlFor="co-cep" className={labelClass}>CEP</label>
          <input id="co-cep" required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={value.cep} onChange={set("cep")} className={inputClass} />
        </div>
        <button
          type="button"
          onClick={useLocation}
          className={`h-12 px-4 rounded-xl border text-sm font-medium inline-flex items-center gap-2 ${coords ? "border-brand-primary text-brand-primary bg-brand-tint" : "border-brand-line text-brand-dark bg-white hover:border-brand-dark/30"}`}
        >
          <PinIcon className="w-4 h-4" />
          {gps === "loading" ? "Buscando…" : coords ? "Localização ok" : "Usar minha localização"}
        </button>
      </div>
      {cepStatus === "notfound" && <p className="text-sm text-red-700 -mt-2">CEP não encontrado. Confira os números.</p>}
      {gps === "denied" && <p className="text-sm text-brand-muted -mt-2">Não foi possível usar a localização. Preencha o endereço.</p>}
      {gps === "filled" && (
        <p className="text-sm text-brand-dark -mt-2">
          Endereço preenchido pela sua localização. {value.number ? "Confira os dados." : "Só falta o número."}
        </p>
      )}

      <div>
        <label htmlFor="co-street" className={labelClass}>Rua</label>
        <input id="co-street" required autoComplete="address-line1" maxLength={120} placeholder={cepStatus === "loading" ? "Buscando pelo CEP…" : "Nome da rua"} value={value.street} onChange={set("street")} className={inputClass} />
      </div>
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2">
        <div>
          <label htmlFor="co-number" className={labelClass}>Número</label>
          <input id="co-number" ref={numberRef} required inputMode="numeric" maxLength={20} value={value.number} onChange={set("number")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="co-comp" className={labelClass}>Complemento</label>
          <input id="co-comp" autoComplete="address-line2" maxLength={60} placeholder="Apto, bloco, referência" value={value.complement} onChange={set("complement")} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="co-bairro" className={labelClass}>Bairro</label>
        <input id="co-bairro" maxLength={60} value={value.neighborhood} onChange={set("neighborhood")} className={inputClass} />
      </div>

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
