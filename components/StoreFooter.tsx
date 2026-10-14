import Link from "next/link";
import type { Store } from "@/lib/types";
import { PLATFORM } from "@/lib/platform";
import { whatsappUrl } from "@/lib/format";
import StoreMark from "./StoreMark";
import { PinIcon } from "./icons";

const footerLink = "text-brand-dark hover:underline underline-offset-4";

export default function StoreFooter({ store }: { store: Store }) {
  return (
    <footer className="bg-white border-t border-brand-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="flex items-center gap-2.5">
            <StoreMark store={store} size={30} />
            <span className="headline font-bold text-lg">{store.name}</span>
          </p>
          {store.tagline && <p className="mt-3 text-sm text-brand-muted max-w-sm">{store.tagline}</p>}
          {store.address && (
            <p className="mt-3 flex gap-2 text-sm text-brand-muted">
              <PinIcon className="w-4 h-4 mt-0.5 shrink-0" />
              {store.address}, {store.city}
            </p>
          )}
        </div>
        <ul className="flex flex-wrap sm:flex-col gap-x-6 gap-y-3 text-sm font-medium">
          <li>
            <a href={whatsappUrl(store.whatsapp, `Olá! Vim pela vitrine da ${store.name}.`)} target="_blank" rel="noopener noreferrer" className={footerLink}>
              WhatsApp
            </a>
          </li>
          {store.instagram && (
            <li>
              <a href={store.instagram} target="_blank" rel="noopener noreferrer" className={footerLink}>
                Instagram
              </a>
            </li>
          )}
          <li>
            <Link href={`/${store.slug}/entregas`} className={footerLink}>
              Entregas e frete
            </Link>
          </li>
        </ul>
      </div>
      {/* Espaço extra no mobile para a barra da sacola não cobrir o rodapé. */}
      <div className="border-t border-brand-line">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-4 text-xs text-brand-muted">
          Esta loja faz parte da {PLATFORM.name}.{" "}
          <Link href="/" className="text-brand-dark hover:underline underline-offset-4">
            Ver outras lojas de {store.city}
          </Link>
        </p>
      </div>
    </footer>
  );
}
