import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { PLATFORM } from "@/lib/platform";
import { ChevronLeftIcon } from "../icons";

type Props = { back?: { href: string; label: string }; title: string; subtitle?: string; demo?: boolean };

export default function AdminHeader({ back, title, subtitle, demo = false }: Props) {
  return (
    <header className="pt-6 pb-5">
      <div className="flex items-center justify-between gap-2 mb-5">
        {back ? (
          <Link href={back.href} className="inline-flex items-center gap-1 h-10 pl-2 pr-4 rounded-full bg-white ring-1 ring-brand-line text-sm font-semibold hover:ring-brand-dark/30">
            <ChevronLeftIcon className="w-4 h-4" />
            {back.label}
          </Link>
        ) : (
          <span className="headline font-bold truncate">Painel<span className="hidden sm:inline"> {PLATFORM.name}</span></span>
        )}
        {demo ? (
          <Link href="/sobre#lojistas" className="h-10 px-4 inline-flex items-center rounded-full text-sm font-semibold text-brand-muted hover:text-brand-dark hover:bg-white">
            Sair<span className="hidden sm:inline">&nbsp;da demonstração</span>
          </Link>
        ) : (
          <form action={logout}>
            <button type="submit" className="h-10 px-4 rounded-full text-sm font-semibold text-brand-muted hover:text-brand-dark hover:bg-white">
              Sair
            </button>
          </form>
        )}
      </div>
      <h1 className="headline text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
      {subtitle && <p className="text-brand-muted mt-1">{subtitle}</p>}
    </header>
  );
}
