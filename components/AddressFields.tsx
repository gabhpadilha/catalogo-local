"use client";

import { useEffect, useRef, useState } from "react";
import { normalize } from "@/lib/format";
import { PinIcon } from "./icons";

export type DropoffAddress = { cep: string; street: string; number: string; complement: string; neighborhood: string };
export type Coords = { lat: number; lng: number };
export type StreetCheck =
  | { status: "idle" | "loading" | "notfound" | "error" }
  | { status: "found"; street: string; neighborhoods: string[] };

export const emptyAddress: DropoffAddress = { cep: "", street: "", number: "", complement: "", neighborhood: "" };
export const NO_NUMBER = "S/N";

const digits = (s: string) => s.replace(/\D/g, "");
const maskCep = (s: string) => digits(s).slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

export const addressLine = (a: DropoffAddress) =>
  [`${a.street}, ${a.number}`, a.complement, a.neighborhood].filter((p) => p.trim()).join(" - ");

/** Pergunta ao mapa se a rua existe na cidade e por quais bairros passa (espera o cliente parar de digitar). */
export function useStreetCheck(street: string): StreetCheck {
  const [check, setCheck] = useState<StreetCheck>({ status: "idle" });
  const term = street.replace(/\s+/g, " ").trim();
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (term.length < 4) {
      setCheck({ status: "idle" });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setCheck({ status: "loading" });
      fetch(`/api/endereco?rua=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then(async (r) => {
          const d = (await r.json()) as { found?: boolean; street?: string; neighborhoods?: string[] };
          if (!r.ok) return setCheck({ status: "error" });
          setCheck(d.found ? { status: "found", street: d.street ?? term, neighborhoods: d.neighborhoods ?? [] } : { status: "notfound" });
        })
        .catch((e) => e.name !== "AbortError" && setCheck({ status: "error" }));
    }, 800);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [term]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return check;
}

type Props = {
  value: DropoffAddress;
  onChange: (a: DropoffAddress) => void;
  coords: Coords | null;
  /** Coordenada do GPS e o bairro que o mapa achou nela (null quando o GPS deixa de valer). */
  onGps: (gps: { coords: Coords; neighborhood: string } | null) => void;
  /** CEP só é pedido quando o frete é do Uber (a cidade tem CEP único). */
  showCep: boolean;
  /** Campo de bairro: texto livre ou a lista de bairros da loja. */
  neighborhoodField: React.ReactNode;
  inputClass: string;
  labelClass: string;
};

// Campos de endereço do checkout. Regras: número com algarismo (ou "sem número"), rua com nome de verdade,
// e o GPS deixa de valer se o cliente trocar a rua que veio dele.
export default function AddressFields({ value, onChange, coords, onGps, showCep, neighborhoodField, inputClass, labelClass }: Props) {
  const [cepStatus, setCepStatus] = useState<"" | "loading" | "notfound">("");
  const [gps, setGps] = useState<"" | "loading" | "denied" | "filled" | "dropped">("");
  const lastCep = useRef("");
  const gpsStreet = useRef("");
  const numberRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  });

  const set = (field: keyof DropoffAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = field === "cep" ? maskCep(e.target.value) : e.target.value;
    // Trocou a rua que o GPS achou: a localização não representa mais esse endereço.
    if (field === "street" && coords && normalize(v) !== normalize(gpsStreet.current)) {
      onGps(null);
      setGps("dropped");
    }
    onChange({ ...value, [field]: v });
  };

  // CEP completo: o ViaCEP preenche rua e bairro (o cliente ainda pode corrigir).
  useEffect(() => {
    if (!showCep) return;
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
  }, [value, onChange, showCep]);

  const useLocation = () => {
    if (!navigator.geolocation) return setGps("denied");
    setGps("loading");
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const c = { lat: Number(p.coords.latitude.toFixed(6)), lng: Number(p.coords.longitude.toFixed(6)) };
        // Preenche rua, bairro e CEP pelo mapa; o número quase nunca vem, então o foco vai para ele.
        try {
          const r = await fetch(`/api/endereco?lat=${c.lat}&lng=${c.lng}`);
          const d = (await r.json()) as Partial<DropoffAddress> & { error?: string };
          if (!r.ok || !d.street) return setGps("denied");
          const current = valueRef.current;
          lastCep.current = digits(d.cep ?? ""); // não deixa o ViaCEP sobrescrever o que veio do mapa
          gpsStreet.current = d.street;
          onGps({ coords: c, neighborhood: d.neighborhood ?? "" });
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

  const noNumber = value.number === NO_NUMBER;
  const gpsButton = (
    <button
      type="button"
      onClick={useLocation}
      className={`h-12 px-4 rounded-xl border text-sm font-medium inline-flex items-center justify-center gap-2 ${coords ? "border-brand-primary text-brand-primary bg-brand-tint" : "border-brand-line text-brand-dark bg-white hover:border-brand-dark/30"}`}
    >
      <PinIcon className="w-4 h-4" />
      {gps === "loading" ? "Buscando…" : coords ? "Localização ok" : "Usar minha localização"}
    </button>
  );

  return (
    <div className="space-y-4">
      {showCep ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-end">
          <div>
            <label htmlFor="co-cep" className={labelClass}>CEP</label>
            <input id="co-cep" required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" pattern="\d{5}-\d{3}" title="CEP com 8 números" value={value.cep} onChange={set("cep")} className={inputClass} />
          </div>
          {gpsButton}
        </div>
      ) : (
        <div className="grid">{gpsButton}</div>
      )}
      {cepStatus === "notfound" && <p className="text-sm text-red-700 -mt-2">CEP não encontrado. Confira os números.</p>}
      {gps === "denied" && <p className="text-sm text-brand-muted -mt-2">Não foi possível usar a localização. Preencha o endereço.</p>}
      {gps === "dropped" && <p className="text-sm text-brand-muted -mt-2">Você trocou a rua, então a localização do GPS deixou de ser usada.</p>}
      {gps === "filled" && (
        <p className="text-sm text-brand-dark -mt-2">Endereço preenchido pela sua localização. {value.number ? "Confira os dados." : "Só falta o número."}</p>
      )}

      <div>
        <label htmlFor="co-street" className={labelClass}>Rua</label>
        <input
          id="co-street"
          required
          autoComplete="address-line1"
          minLength={4}
          maxLength={120}
          pattern=".*[A-Za-zÀ-ÿ]{3,}.*"
          title="Escreva o nome da rua (ex.: Rua Vieira dos Santos)"
          placeholder={cepStatus === "loading" ? "Buscando pelo CEP…" : "Nome da rua"}
          value={value.street}
          onChange={set("street")}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2">
        <div>
          <label htmlFor="co-number" className={labelClass}>Número</label>
          <input
            id="co-number"
            ref={numberRef}
            required
            inputMode="numeric"
            maxLength={20}
            pattern={noNumber ? undefined : ".*\\d.*"}
            title="Número da casa (ou marque Sem número)"
            disabled={noNumber}
            value={value.number}
            onChange={set("number")}
            className={`${inputClass} disabled:bg-brand-soft disabled:text-brand-muted`}
          />
        </div>
        <div>
          <label htmlFor="co-comp" className={labelClass}>Complemento</label>
          <input id="co-comp" autoComplete="address-line2" maxLength={60} placeholder="Apto, bloco, referência" value={value.complement} onChange={set("complement")} className={inputClass} />
        </div>
      </div>
      <label className="-mt-2 inline-flex items-center gap-2 text-sm text-brand-muted cursor-pointer">
        <input type="checkbox" checked={noNumber} onChange={(e) => onChange({ ...value, number: e.target.checked ? NO_NUMBER : "" })} className="w-4 h-4 accent-brand-dark" />
        Sem número
      </label>
      {neighborhoodField}
    </div>
  );
}
