import type { Metadata } from "next";

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
    </main>
  );
}
