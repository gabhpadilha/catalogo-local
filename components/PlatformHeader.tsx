import Link from "next/link";
import { PLATFORM } from "@/lib/platform";

const LINKS = [
  { text: "Lojas", href: "/" },
  { text: "Como Funciona", href: "/como-funciona" },
  { text: "Sobre", href: "/sobre" },
];

export default function PlatformHeader() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <nav className="bg-brand-dark text-brand-light rounded-full p-2 pl-5 flex items-center justify-between gap-2 shadow-2xl border border-[#2A2A2A]">
        <Link href="/" className="font-black tracking-tight truncate">
          {PLATFORM.name}
        </Link>
        <ul className="flex items-center gap-1 text-xs sm:text-sm font-bold shrink-0">
          {LINKS.map((l) => (
            // No mobile o nome da plataforma já leva às lojas.
            <li key={l.href} className={l.href === "/" ? "hidden sm:block" : undefined}>
              <Link href={l.href} className="block px-3 py-2 rounded-full hover:bg-[#2A2A2A] transition-colors">
                {l.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
