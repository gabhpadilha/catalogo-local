import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM } from "@/lib/platform";
import { whatsappUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sobre",
  description: "O comércio de Guaratuba com entrega no mesmo dia.",
};

const VALUES = [
  { title: "Valorização local", text: "O dinheiro gira dentro da cidade, fortalecendo os comerciantes parceiros e aquecendo a economia de Guaratuba." },
  { title: "Fricção zero", text: "Sem cadastros demorados. Escolha no catálogo, clique e finalize o pedido conversando direto com a loja." },
];

export default function SobrePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <h1 className="headline font-bold text-4xl sm:text-6xl leading-[1.02]">O comércio local, na velocidade do agora.</h1>

      <div className="mt-8 space-y-5 text-lg text-brand-muted leading-relaxed">
        <p>
          Nascemos de uma necessidade real em Guaratuba: a falta de opções práticas para comprar online no comércio da nossa própria cidade com entrega imediata.
        </p>
        <p>
          Enquanto grandes plataformas pedem dias para entregar, nós conectamos você diretamente ao estoque físico dos lojistas locais. Pediu pelo WhatsApp, pagou no Pix, chegou na sua casa hoje.
        </p>
      </div>

      <dl className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 border-t border-brand-line pt-10">
        {VALUES.map((v) => (
          <div key={v.title}>
            <dt className="font-semibold text-xl">{v.title}</dt>
            <dd className="mt-2 text-brand-muted leading-relaxed">{v.text}</dd>
          </div>
        ))}
      </dl>

      <section id="lojistas" aria-labelledby="lojistas-titulo" className="mt-16 scroll-mt-24 rounded-3xl bg-white ring-1 ring-brand-line p-6 sm:p-8">
        <h2 id="lojistas-titulo" className="headline font-bold text-2xl">Para lojistas</h2>
        <ul className="mt-4 space-y-2 text-brand-muted leading-relaxed list-disc pl-5">
          <li>Vitrine própria com as cores e o link da sua loja, para divulgar no Instagram.</li>
          <li>Pedidos chegam prontos no seu WhatsApp; o pagamento é no Pix, direto para você.</li>
          <li>Frete calculado na hora pelo Uber ou pela sua tabela de bairros.</li>
          <li>Seus produtos também aparecem na busca de todas as lojas da cidade.</li>
        </ul>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappUrl(PLATFORM.salesWhatsapp, `Olá! Tenho uma loja em ${PLATFORM.city} e quero vender na ${PLATFORM.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-brand-primary text-brand-light font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            Quero vender aqui
          </a>
          <Link href="/admin/demo" className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white ring-1 ring-brand-line font-semibold text-sm hover:ring-brand-dark/30">
            Ver o painel por dentro
          </Link>
          <Link href="/admin" className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-white ring-1 ring-brand-line font-semibold text-sm hover:ring-brand-dark/30">
            Já sou lojista: entrar no painel
          </Link>
        </div>
      </section>
    </main>
  );
}
