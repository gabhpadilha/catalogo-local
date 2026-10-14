import { PLATFORM } from "@/lib/platform";

// Faixa no topo de todas as páginas enquanto o site for só uma demonstração (PLATFORM.demo).
export default function DemoNotice() {
  if (!PLATFORM.demo) return null;
  return (
    <p role="note" className="bg-amber-100 text-amber-950 text-[13px] leading-snug text-center px-4 py-2">
      <strong className="font-semibold">Site de demonstração.</strong> As lojas, os produtos e os preços são fictícios, e nenhum pedido será atendido.
    </p>
  );
}
