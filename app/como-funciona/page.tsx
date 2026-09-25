export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
        COMPROU, <br />
        <span className="text-brand-primary">CHEGOU HOJE.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-brand-muted mb-16 max-w-2xl font-medium">
        Esqueça os prazos de 7 dias úteis e fretes absurdos. Conectamos você ao estoque das melhores lojas de Guaratuba. Veja como é simples:
      </p>

      {/* Container do Passo a Passo */}
      <div className="space-y-12">
        
        {/* Passo 1 */}
        <div className="flex gap-6 items-start group">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 text-brand-dark font-black flex items-center justify-center text-2xl shadow-sm group-hover:border-brand-dark transition-colors">
            1
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">Explore a Vitrine</h3>
            <p className="text-brand-muted text-lg leading-relaxed">
              Navegue pelo nosso catálogo e encontre os produtos que são a sua cara, todos já disponíveis fisicamente aqui na cidade.
            </p>
          </div>
        </div>

        {/* Passo 2 */}
        <div className="flex gap-6 items-start group">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 text-brand-dark font-black flex items-center justify-center text-2xl shadow-sm group-hover:border-brand-dark transition-colors">
            2
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">Peça pelo WhatsApp</h3>
            <p className="text-brand-muted text-lg leading-relaxed">
              Sem carrinho de compras ou senhas para esquecer. Clique no botão do produto e fale direto com a loja, com a mensagem já pronta.
            </p>
          </div>
        </div>

        {/* Passo 3 */}
        <div className="flex gap-6 items-start group">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 text-brand-dark font-black flex items-center justify-center text-2xl shadow-sm group-hover:border-brand-dark transition-colors">
            3
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">Pagamento Rápido</h3>
            <p className="text-brand-muted text-lg leading-relaxed">
              Combine a forma de pagamento (Pix, Cartão) direto no atendimento humanizado. A loja separa o seu pedido na hora.
            </p>
          </div>
        </div>

        {/* Passo 4 - Destaque */}
        <div className="flex gap-6 items-start group">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-primary text-brand-light font-black flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
            4
          </div>
          <div>
            <h3 className="text-2xl font-black text-brand-primary mb-2">Entrega Expressa</h3>
            <p className="text-brand-muted text-lg leading-relaxed">
              Pronto! O pedido é despachado imediatamente por um parceiro de logística local e chega na sua porta.
            </p>
          </div>
        </div>

      </div>
      
    </main>
  );
}