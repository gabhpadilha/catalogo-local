import Link from "next/link";
import { PLATFORM } from "@/lib/platform";

const LINKS = [
  { text: "Lojas", href: "/#lojas" },
  { text: "Como funciona", href: "/como-funciona" },
  { text: "Sobre", href: "/sobre" },
  { text: "Área do lojista", href: "/admin" },
  { text: "Créditos das fotos", href: "/creditos" },
];

export default function PlatformFooter() {
  return (
    <footer className="bg-white border-t border-brand-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <p className="headline font-bold text-lg">{PLATFORM.name}</p>
          <p className="mt-2 text-sm text-brand-muted max-w-xs">Tem uma loja em {PLATFORM.city}? Venda aqui com vitrine própria e entrega no mesmo dia.</p>
          <Link href="/sobre#lojistas" className="mt-3 inline-flex items-center h-10 px-4 rounded-full bg-brand-dark text-brand-light text-sm font-semibold hover:bg-brand-primary transition-colors">
            Quero vender aqui
          </Link>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:underline underline-offset-4">
                {l.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
