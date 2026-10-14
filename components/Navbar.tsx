"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/format";
import { LAST_SEARCH_KEY } from "@/lib/storage";
import { SearchField, SearchToggle } from "./SearchBar";
import { useStore } from "./StoreProvider";
import { useCart } from "./CartProvider";
import StoreMark from "./StoreMark";
import DeliveryStatus from "./DeliveryStatus";
import Sheet, { SheetIconButton } from "./Sheet";
import { BagIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, InstagramIcon, MenuIcon, WhatsAppIcon } from "./icons";

// Termo da última busca na home (por aba). No servidor não existe: a faixa começa com "Todas as lojas".
const readLastSearch = () => {
  try {
    return sessionStorage.getItem(LAST_SEARCH_KEY);
  } catch {
    return null;
  }
};
const noSubscribe = () => () => {};

const menuRow =
  "flex items-center justify-between gap-3 min-h-13 px-3 rounded-xl font-medium hover:bg-brand-soft aria-[current=page]:bg-brand-soft transition-colors";
const iconButton = "relative grid place-items-center w-10 h-10 rounded-full text-brand-dark hover:bg-brand-soft transition-colors";

function CartIconButton() {
  const { count, setOpen } = useCart();
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label={count ? `Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir sacola"} className={iconButton}>
      <BagIcon />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand-primary text-brand-light text-[11px] font-semibold tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const { store } = useStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const home = `/${store.slug}`;
  const links = [
    { text: "Catálogo", href: home },
    { text: "Entregas", href: `${home}/entregas` },
  ];
  const placeholder = `Buscar na ${store.name}`;
  const lastSearch = useSyncExternalStore(noSubscribe, readLastSearch, () => null);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Faixa da plataforma: mostra onde a loja está e leva às outras. Some ao rolar. */}
      <div className="bg-brand-dark text-brand-light text-[13px]">
        <div className="max-w-6xl mx-auto h-9 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Quem veio da busca da home volta para os resultados. */}
          <Link
            href={lastSearch ? `/?q=${encodeURIComponent(lastSearch)}` : "/"}
            className="inline-flex items-center gap-1 -ml-1 pr-1 min-w-0 rounded-sm opacity-85 hover:opacity-100 hover:underline underline-offset-4"
          >
            <ChevronLeftIcon className="w-4 h-4 shrink-0" />
            {lastSearch ? (
              <span className="truncate">Voltar para &ldquo;{lastSearch}&rdquo;</span>
            ) : (
              <span>
                Todas as lojas<span className="hidden sm:inline"> de {store.city}</span>
              </span>
            )}
          </Link>
          <DeliveryStatus open={store.deliveryOpen} />
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-line">
        <div className="relative max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center gap-2 md:gap-6">
          <Link href={home} className="flex items-center gap-2.5 min-w-0 mr-auto md:mr-0 md:w-56 shrink-0 rounded-lg">
            <StoreMark store={store} size={34} />
            <span className="headline font-bold text-lg truncate">{store.name}</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <SearchField home={home} placeholder={placeholder} />
          </div>

          <nav aria-label="Loja" className="hidden md:flex items-center gap-1 ml-auto">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 h-10 inline-flex items-center rounded-full text-sm font-medium transition-colors ${
                    active ? "text-brand-dark bg-brand-soft" : "text-brand-muted hover:text-brand-dark"
                  }`}
                >
                  {l.text}
                </Link>
              );
            })}
            {store.instagram && (
              <a href={store.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram da ${store.name}`} className={iconButton}>
                <InstagramIcon />
              </a>
            )}
          </nav>

          <div className="md:hidden">
            <SearchToggle home={home} placeholder={placeholder} />
          </div>
          <CartIconButton />
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen} className={`${iconButton} md:hidden -mr-2`}>
            <MenuIcon />
          </button>
        </div>
      </header>

      <Sheet open={menuOpen} onClose={closeMenu} labelledBy="menu-title" history={false}>
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-brand-line shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <StoreMark store={store} size={30} />
            <h2 id="menu-title" className="headline font-bold text-lg truncate">{store.name}</h2>
          </div>
          <SheetIconButton label="Fechar menu" onClick={closeMenu}>
            <CloseIcon />
          </SheetIconButton>
        </div>
        <nav aria-label="Menu" className="overflow-y-auto px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={closeMenu} aria-current={pathname === l.href ? "page" : undefined} className={menuRow}>
                  {l.text}
                  <ChevronRightIcon className="w-4 h-4 text-brand-muted" />
                </Link>
              </li>
            ))}
            {store.instagram && (
              <li>
                <a href={store.instagram} target="_blank" rel="noopener noreferrer" className={menuRow}>
                  <span className="inline-flex items-center gap-3"><InstagramIcon className="w-5 h-5 text-brand-muted" />Instagram</span>
                </a>
              </li>
            )}
            <li>
              <a href={whatsappUrl(store.whatsapp, `Olá! Preciso de ajuda na ${store.name}.`)} target="_blank" rel="noopener noreferrer" className={menuRow}>
                <span className="inline-flex items-center gap-3"><WhatsAppIcon className="w-5 h-5 text-brand-muted" />Falar com a loja no WhatsApp</span>
              </a>
            </li>
            <li className="border-t border-brand-line mt-2 pt-2">
              <Link href="/" onClick={closeMenu} className={`${menuRow} text-brand-muted`}>
                Todas as lojas de {store.city}
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </li>
          </ul>
        </nav>
      </Sheet>
    </>
  );
}
