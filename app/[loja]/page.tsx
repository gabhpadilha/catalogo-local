import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import { getCatalog } from "@/lib/data";

export default async function StorePage({ params }: { params: Promise<{ loja: string }> }) {
  const catalog = await getCatalog((await params).loja);
  if (!catalog) notFound();

  return (
    <main>
      <Hero {...catalog} />
      <Catalog />
    </main>
  );
}
