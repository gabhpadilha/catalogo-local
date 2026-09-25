export default function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16 lg:py-24">
      
      {/* Lado Esquerdo: Tipografia e Call to Action (Botão) */}
      <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-brand-dark tracking-tighter mb-6 leading-[1.1]">
          ESTILO EM <br />
          <span className="text-brand-primary">CADA PASSO.</span>
        </h1>
        
        <p className="text-lg text-brand-muted mb-10 max-w-md">
          Descubra coleções exclusivas com conforto e atitude. Entrega no mesmo dia na sua porta em Guaratuba.
        </p>
        
        <button className="bg-brand-dark text-brand-light px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-brand-primary hover:scale-105 hover:shadow-xl active:scale-95">
          Explorar Catálogo
        </button>
      </div>

      {/* Lado Direito: Área da Imagem de Destaque */}
      <div className="flex-1 relative w-full max-w-md lg:max-w-lg mx-auto">
        {/* Bloco decorativo de fundo (Inspirado no bloco roxo da sua referência) */}
        <div className="absolute inset-0 bg-brand-primary rounded-[2.5rem] rotate-6 scale-105 opacity-10 transition-transform duration-700 hover:rotate-12"></div>
        
        {/* Container principal da imagem */}
        <div className="relative bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-8 overflow-hidden">
          
          <span className="text-brand-primary/20 font-black text-8xl absolute top-10 -left-4 select-none">
            GRIBB
          </span>
          
          <div className="z-10 text-brand-muted font-medium text-center border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center rounded-2xl">
            [ Imagem do Ténis <br/> Grande Sem Fundo ]
          </div>
          
        </div>
      </div>

    </section>
  );
}