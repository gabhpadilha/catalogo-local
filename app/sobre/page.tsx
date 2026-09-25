export default function SobrePage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
        O COMÉRCIO LOCAL, <br />
        <span className="text-brand-primary">NA VELOCIDADE DO AGORA.</span>
      </h1>
      
      <div className="space-y-6 text-lg md:text-xl text-brand-muted font-medium leading-relaxed">
        <p>
          A Gribb nasceu de uma necessidade real em Guaratuba: a falta de opções práticas para comprar online no comércio da nossa própria cidade com entrega imediata.
        </p>
        <p>
          Enquanto grandes plataformas pedem dias para entregar, nós conectamos você diretamente ao estoque físico dos lojistas locais. Comprou pelo WhatsApp, a loja separou, chegou na sua casa hoje.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-black text-2xl text-brand-dark mb-3">Valorização Local</h3>
          <p className="text-brand-muted">
            O dinheiro gira dentro da cidade, fortalecendo os comerciantes parceiros e aquecendo a economia de Guaratuba.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-black text-2xl text-brand-dark mb-3">Fricção Zero</h3>
          <p className="text-brand-muted">
            Sem cadastros demorados. Escolha no catálogo, clique e finalize o pedido conversando direto com a loja.
          </p>
        </div>
      </div>
    </main>
  );
}