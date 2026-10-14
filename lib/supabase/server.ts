import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente com a sessão do lojista (cookies). Use só no painel /admin e em Server Actions.
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        // Em Server Components não dá para gravar cookies; o proxy renova a sessão.
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}
