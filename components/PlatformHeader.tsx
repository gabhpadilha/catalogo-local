"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLATFORM } from "@/lib/platform";

const LINKS = [
  { text: "Lojas", href: "/" },
  { text: "Como funciona", href: "/como-funciona" },
  { text: "Sobre", href: "/sobre" },
];

export default function PlatformHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-brand-line">
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="headline font-bold text-base sm:text-lg whitespace-nowrap">
          {PLATFORM.name}
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center sm:gap-1 text-sm font-medium">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                // No mobile o nome da plataforma já leva às lojas.
                <li key={l.href} className={l.href === "/" ? "hidden sm:block" : undefined}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center h-10 px-2.5 sm:px-3 rounded-full whitespace-nowrap transition-colors ${active ? "bg-brand-soft text-brand-dark" : "text-brand-muted hover:text-brand-dark"}`}
                  >
                    {l.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
