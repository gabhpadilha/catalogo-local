import Link from "next/link";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { getMyStores } from "@/lib/admin";

export default async function AdminHome() {
  const stores = await getMyStores();
  if (stores.length === 1) redirect(`/admin/${stores[0].slug}`);

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader title="Suas lojas" />
      {stores.length === 0 ? (
        <p className="text-brand-muted">Seu usuário ainda não está ligado a nenhuma loja. Fale com o suporte da plataforma.</p>
      ) : (
        <ul className="space-y-3">
          {stores.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/${s.slug}`} className="block bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 hover:shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">{s.segment}</span>
                <span className="block text-xl font-black">{s.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
