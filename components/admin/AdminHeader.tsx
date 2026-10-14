import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { PLATFORM } from "@/lib/platform";

type Props = { back?: { href: string; label: string }; title: string; subtitle?: string };

export default function AdminHeader({ back, title, subtitle }: Props) {
  return (
    <header className="pt-6 pb-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        {back ? (
          <Link href={back.href} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white border border-gray-200 text-sm font-bold hover:border-brand-dark">
            ← {back.label}
          </Link>
        ) : (
          <span className="font-black tracking-tight">{PLATFORM.name} · Painel</span>
        )}
        <form action={logout}>
          <button type="submit" className="h-10 px-4 rounded-full text-sm font-bold text-brand-muted hover:text-brand-dark hover:bg-white">
            Sair
          </button>
        </form>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight">{title}</h1>
      {subtitle && <p className="text-brand-muted font-medium mt-1">{subtitle}</p>}
    </header>
  );
}
