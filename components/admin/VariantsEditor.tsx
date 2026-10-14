"use client";

import { useState } from "react";
import { ghostButton, input, label as labelClass } from "./ui";

type Variant = { label: string; inStock: boolean };

// Atalhos para o lojista não precisar digitar tamanho por tamanho.
const PRESETS: { name: string; labels: string[] }[] = [
  { name: "Único", labels: ["Único"] },
  { name: "P ao GG", labels: ["P", "M", "G", "GG"] },
  { name: "34 ao 44", labels: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"] },
  { name: "127V / 220V", labels: ["127V", "220V"] },
];

export default function VariantsEditor({ initial }: { initial: Variant[] }) {
  const [variants, setVariants] = useState<Variant[]>(initial.length ? initial : [{ label: "Único", inStock: true }]);
  const [draft, setDraft] = useState("");

  const update = (i: number, patch: Partial<Variant>) => setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  const remove = (i: number) => setVariants((vs) => vs.filter((_, j) => j !== i));
  const add = () => {
    const labelText = draft.trim();
    if (!labelText || variants.some((v) => v.label.toLowerCase() === labelText.toLowerCase())) return;
    setVariants((vs) => [...vs, { label: labelText, inStock: true }]);
    setDraft("");
  };

  return (
    <fieldset>
      <legend className={labelClass}>Opções (tamanho, voltagem, cor…)</legend>
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      <div className="flex flex-wrap gap-2 mb-3">
        {PRESETS.map((p) => (
          <button key={p.name} type="button" className={ghostButton} onClick={() => setVariants(p.labels.map((l) => ({ label: l, inStock: true })))}>
            {p.name}
          </button>
        ))}
      </div>

      <ul className="space-y-2 mb-3">
        {variants.map((v, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              value={v.label}
              onChange={(e) => update(i, { label: e.target.value })}
              maxLength={30}
              aria-label="Nome da opção"
              className={`${input.replace("w-full ", "")} flex-1 min-w-0 h-11`}
            />
            <button
              type="button"
              onClick={() => update(i, { inStock: !v.inStock })}
              aria-pressed={!v.inStock}
              className={`h-11 px-4 rounded-xl text-sm font-semibold shrink-0 transition-colors ${
                v.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
              }`}
            >
              {v.inStock ? "Tem" : "Esgotou"}
            </button>
            <button type="button" onClick={() => remove(i)} aria-label={`Remover ${v.label}`} className="w-11 h-11 rounded-xl text-brand-muted hover:bg-gray-100 shrink-0">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          maxLength={30}
          placeholder="Nova opção, ex.: Azul"
          className={`${input.replace("w-full ", "")} flex-1 min-w-0 h-11`}
        />
        <button type="button" onClick={add} className={ghostButton}>
          Adicionar
        </button>
      </div>
    </fieldset>
  );
}
