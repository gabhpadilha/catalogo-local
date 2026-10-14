import { getSearchIndex } from "@/lib/data";

// Índice da busca entre lojas: estático, refeito no máximo a cada 60 s (e na hora quando o lojista salva).
export const revalidate = 60;

export async function GET() {
  return Response.json(await getSearchIndex());
}
