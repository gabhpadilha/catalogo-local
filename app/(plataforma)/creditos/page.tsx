import type { Metadata } from "next";
import { DEMO_PHOTOS } from "@/lib/demoPhotos";

export const metadata: Metadata = {
  title: "Créditos das fotos",
  description: "Autoria e licença das fotos usadas nas lojas de demonstração.",
};

// As lojas de demonstração usam fotos da Wikimedia Commons; licenças CC BY pedem crédito ao autor.
export default function CreditosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <h1 className="headline font-bold text-4xl sm:text-5xl leading-[1.05]">Créditos das fotos</h1>
      <p className="mt-5 text-lg text-brand-muted leading-relaxed">
        As lojas de demonstração usam fotos da Wikimedia Commons, sob licenças livres. Obrigado aos autores.
      </p>
      <ul className="mt-10 divide-y divide-brand-line border-y border-brand-line text-sm">
        {DEMO_PHOTOS.map((p) => (
          <li key={p.file} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-medium">{p.product}</span>
            <span className="text-brand-muted">
              {p.author || "Autor desconhecido"}, {p.license},{" "}
              <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-brand-dark">
                Wikimedia Commons
              </a>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
