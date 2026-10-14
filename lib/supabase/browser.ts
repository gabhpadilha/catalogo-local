import { createBrowserClient } from "@supabase/ssr";

// Cliente do navegador (usa a sessão dos cookies). Usado no upload de fotos.
export const createBrowserSupabase = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
