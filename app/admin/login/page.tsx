import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import { PLATFORM } from "@/lib/platform";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-4 py-12 max-w-md mx-auto">
      <p className="headline font-bold text-brand-muted mb-2">{PLATFORM.name}</p>
      <h1 className="headline text-4xl font-bold mb-8">Painel do Lojista</h1>
      <LoginForm />
      <p className="text-sm text-brand-muted text-center mt-6">Esqueceu a senha? Fale com o suporte da plataforma.</p>
      <Link href="/admin/demo" className="mt-8 block text-center text-sm font-semibold underline underline-offset-4">
        Ainda não tem loja? Veja o painel por dentro
      </Link>
    </main>
  );
}
