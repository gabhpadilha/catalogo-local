"use client";

import { useActionState, useState } from "react";
import { saveStore, type ActionState } from "@/app/admin/actions";
import type { AdminStore, AdminZone } from "@/lib/admin";
import { contrast } from "@/lib/color";
import ImageUpload from "./ImageUpload";
import ZonesEditor from "./ZonesEditor";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";
import { card, input, label, textarea } from "./ui";

type Props = { store: AdminStore; zones: AdminZone[] };

const COLORS = [
  { key: "primary", name: "Cor principal", hint: "Botões e destaques" },
  { key: "dark", name: "Cor escura", hint: "Barra do topo e títulos" },
  { key: "light", name: "Cor de fundo", hint: "Fundo da vitrine" },
] as const;

const formatPhone = (d: string) => (d.startsWith("55") ? d.slice(2) : d);

export default function StoreForm({ store, zones }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(saveStore.bind(null, store.slug), {});
  const [colors, setColors] = useState({
    primary: store.theme.primary ?? "#73030D",
    dark: store.theme.dark ?? "#0D0D0D",
    light: store.theme.light ?? "#F2F2F2",
  });

  // O texto dos botões usa a cor de fundo sobre a cor principal; o texto da página usa a escura sobre o fundo.
  const warnings = [
    contrast(colors.light, colors.primary) < 4.5 && "O texto dos botões pode ficar difícil de ler: escureça a cor principal ou clareie o fundo.",
    contrast(colors.dark, colors.light) < 7 && "Os títulos podem ficar apagados: use uma cor escura mais forte.",
  ].filter(Boolean) as string[];

  return (
    <form action={action} className="space-y-4">
      <section className={`${card} space-y-5`}>
        <h2 className="headline text-xl font-bold">Identidade</h2>
        <ImageUpload name="logo_url" storeId={store.id} defaultUrl={store.logo_url} label="Logo" hint="Quadrado, de preferência com fundo." round />
        <div>
          <label htmlFor="s-name" className={label}>Nome da loja</label>
          <input id="s-name" name="name" required maxLength={80} defaultValue={store.name} className={input} />
        </div>
        <div>
          <label htmlFor="s-seg" className={label}>Ramo</label>
          <input id="s-seg" name="segment" maxLength={60} defaultValue={store.segment} placeholder="Ex.: Materiais de Construção" className={input} />
        </div>
        <div>
          <label htmlFor="s-tag" className={label}>Frase curta</label>
          <input id="s-tag" name="tagline" maxLength={160} defaultValue={store.tagline ?? ""} placeholder="Aparece na lista de lojas" className={input} />
        </div>
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className="headline text-xl font-bold">Cores</h2>
        <div className="grid grid-cols-3 gap-3">
          {COLORS.map((c) => (
            <label key={c.key} className="block text-center">
              <input
                type="color"
                name={c.key}
                value={colors[c.key]}
                onChange={(e) => setColors((cs) => ({ ...cs, [c.key]: e.target.value }))}
                className="w-full h-16 rounded-2xl border border-gray-200 cursor-pointer bg-white p-1"
              />
              <span className="block text-xs font-bold mt-1">{c.name}</span>
              <span className="block text-[11px] text-brand-muted">{c.hint}</span>
            </label>
          ))}
        </div>

        {/* Prévia ao vivo */}
        <div className="rounded-[2rem] p-5 space-y-3" style={{ background: colors.light }} aria-label="Prévia das cores">
          <div className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: colors.dark, color: colors.light }}>
            {store.name}
          </div>
          <p className="headline text-2xl font-bold leading-tight" style={{ color: colors.dark }}>
            Título da vitrine <span style={{ color: colors.primary }}>em destaque</span>
          </p>
          <div className="rounded-full py-3 text-center font-bold" style={{ background: colors.primary, color: colors.light }}>
            Adicionar à sacola
          </div>
        </div>
        {warnings.map((w) => (
          <p key={w} className="rounded-2xl bg-amber-50 text-amber-800 text-sm font-bold p-4">⚠️ {w}</p>
        ))}
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className="headline text-xl font-bold">Topo da vitrine</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="s-ht" className={label}>Título</label>
            <input id="s-ht" name="hero_title" maxLength={40} defaultValue={store.hero.title} placeholder="PRECISOU," className={input} />
          </div>
          <div>
            <label htmlFor="s-hh" className={label}>Destaque</label>
            <input id="s-hh" name="hero_highlight" maxLength={40} defaultValue={store.hero.highlight} placeholder="CHEGOU HOJE." className={input} />
          </div>
        </div>
        <div>
          <label htmlFor="s-hx" className={label}>Texto</label>
          <textarea id="s-hx" name="hero_text" maxLength={240} defaultValue={store.hero.text} className={textarea} />
        </div>
        <ImageUpload
          name="hero_image"
          storeId={store.id}
          defaultUrl={store.hero.imageUrl?.startsWith("https://") ? store.hero.imageUrl : null}
          label="Imagem de destaque (opcional)"
          hint="Produto com fundo transparente fica melhor."
        />
      </section>

      <section className={`${card} space-y-5`}>
        <h2 className="headline text-xl font-bold">Contato</h2>
        <div>
          <label htmlFor="s-wa" className={label}>WhatsApp que recebe os pedidos</label>
          <input id="s-wa" name="whatsapp" required inputMode="tel" defaultValue={formatPhone(store.whatsapp)} placeholder="41 99999-9999" className={input} />
        </div>
        <div>
          <label htmlFor="s-ig" className={label}>Instagram (opcional)</label>
          <input id="s-ig" name="instagram" defaultValue={store.instagram ?? ""} placeholder="@sualoja" className={input} />
        </div>
        <div>
          <label htmlFor="s-ad" className={label}>Endereço da loja (opcional)</label>
          <input id="s-ad" name="address" maxLength={160} defaultValue={store.address ?? ""} placeholder="Para retiradas" className={input} />
        </div>
      </section>

      <section className={card}>
        <ZonesEditor initial={zones.map((z) => ({ id: z.id, label: z.label, fee: Number(z.fee).toFixed(2).replace(".", ","), pickup: z.is_pickup }))} />
      </section>

      <FormMessage state={state} />
      <SubmitButton className="w-full">Salvar loja</SubmitButton>
    </form>
  );
}
