import Link from "next/link";

// O modelo em 3 passos, na home: sem cadastro, pedido no WhatsApp, Pix e entrega no mesmo dia.
const STEPS = [
  { title: "Escolha na vitrine", text: "Sem cadastro e sem senha." },
  { title: "Envie pelo WhatsApp", text: "O pedido chega pronto para a loja." },
  { title: "Pague no Pix e receba hoje", text: "Entrega pelo Uber ou retirada na loja." },
];

export default function HowItWorksStrip() {
  return (
    <section aria-labelledby="como-funciona" className="mt-14 sm:mt-20 rounded-3xl bg-white ring-1 ring-brand-line p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="como-funciona" className="headline font-bold text-xl sm:text-2xl">Como funciona</h2>
        <Link href="/como-funciona" className="text-sm font-semibold underline-offset-4 hover:underline">
          Saiba mais
        </Link>
      </div>
      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="shrink-0 grid place-items-center w-8 h-8 rounded-full bg-brand-tint text-brand-primary text-sm font-semibold tabular-nums">{i + 1}</span>
            <span className="pt-1 leading-snug">
              <span className="block font-semibold">{s.title}</span>
              <span className="block text-sm text-brand-muted">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
