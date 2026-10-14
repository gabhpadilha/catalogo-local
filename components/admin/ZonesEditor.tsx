"use client";

import { useState } from "react";
import { ghostButton, input, label as labelClass } from "./ui";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

type Zone = { id?: string; label: string; fee: string; pickup: boolean };

export default function ZonesEditor({ initial }: { initial: Zone[] }) {
  const [zones, setZones] = useState<Zone[]>(initial);
  const update = (i: number, patch: Partial<Zone>) => setZones((zs) => zs.map((z, j) => (j === i ? { ...z, ...patch } : z)));

  return (
    <fieldset>
      <legend className={labelClass}>Bairros e frete estimado</legend>
      <input type="hidden" name="zones" value={JSON.stringify(zones)} />
      <p className="text-sm text-brand-muted mb-3">
        O valor é uma estimativa mostrada ao cliente; o frete final é confirmado no WhatsApp. Use os nomes de bairro sugeridos: assim o site
        confere no mapa se a rua do cliente fica mesmo no bairro escolhido.
      </p>
      <datalist id="bairros-mapa">
        {NEIGHBORHOODS.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      <ul className="space-y-2 mb-3">
        {zones.map((z, i) => (
          <li key={z.id ?? `novo-${i}`} className="flex items-center gap-2">
            <input value={z.label} onChange={(e) => update(i, { label: e.target.value })} maxLength={60} aria-label="Bairro" placeholder="Bairro" list="bairros-mapa" className={`${input.replace("w-full ", "")} flex-1 min-w-0 h-11`} />
            {z.pickup ? (
              <span className="w-28 text-center text-sm font-semibold text-green-800 bg-green-100 h-11 rounded-xl flex items-center justify-center shrink-0">Retirada</span>
            ) : (
              <input
                value={z.fee}
                onChange={(e) => update(i, { fee: e.target.value })}
                inputMode="decimal"
                aria-label={`Frete para ${z.label}`}
                placeholder="R$"
                className={`${input.replace("w-full ", "")} w-28 h-11 shrink-0`}
              />
            )}
            <button type="button" onClick={() => setZones((zs) => zs.filter((_, j) => j !== i))} aria-label={`Remover ${z.label}`} className="w-11 h-11 rounded-xl text-brand-muted hover:bg-gray-100 shrink-0">
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={ghostButton} onClick={() => setZones((zs) => [...zs, { label: "", fee: "", pickup: false }])}>
          + Bairro
        </button>
        {!zones.some((z) => z.pickup) && (
          <button type="button" className={ghostButton} onClick={() => setZones((zs) => [...zs, { label: "Retirar na Loja", fee: "0", pickup: true }])}>
            + Retirada na loja
          </button>
        )}
      </div>
    </fieldset>
  );
}
