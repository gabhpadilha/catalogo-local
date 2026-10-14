import type { Metadata } from "next";
import Link from "next/link";
import DeliverySteps from "@/components/DeliverySteps";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Escolha na vitrine, envie o pedido pelo WhatsApp, pague via Pix e receba hoje em Guaratuba.",
};

const STEPS = [
  { title: "Explore a vitrine", text: "Escolha o produto e a opção direto no catálogo, sem sair da página." },
  { title: "Monte a sacola", text: "Sem cadastro nem senha. A sacola fica salva no seu celular enquanto você navega." },
  { title: "Pedido no WhatsApp", text: "Informe nome e endereço e a mensagem chega pronta para a loja, com itens e opções." },
  { title: "Pix e entrega hoje", text: "A loja confirma o frete do Uber Flash, você paga via Pix e o pedido sai no mesmo dia." },
];

export default function ComoFuncionaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <h1 className="headline font-bold text-4xl sm:text-6xl leading-[1.02]">Comprou, chegou hoje.</h1>
      <p className="mt-5 text-lg text-brand-muted max-w-2xl leading-relaxed">
        Esqueça os prazos de 7 dias úteis e os fretes absurdos. Veja como é simples comprar no comércio de Guaratuba:
      </p>

      <div className="mt-12">
        <DeliverySteps steps={STEPS} />
      </div>

      <Link href="/" className="mt-12 inline-flex items-center h-12 px-6 rounded-full bg-brand-dark text-brand-light font-semibold hover:bg-brand-primary transition-colors">
        Ver as lojas
      </Link>
    </main>
  );
}
