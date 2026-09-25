"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  store: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  description: string;
  sizes: string[];
};

type CartItem = Product & { 
  quantity: number;
  selectedSize: string; // Guarda o tamanho escolhido na sacola
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camiseta Streetwear Oversized Preta",
    store: "Gribb Store",
    price: 89.90,
    originalPrice: 129.90,
    category: "Roupas",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    description: "Confeccionada em algodão pesado (heavy cotton) de alta gramatura. Modelagem oversized exclusiva com caimento perfeito e gola reforçada anti-deformação.",
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: 2,
    name: "Tênis Sneaker X Urban",
    store: "Footwear Local",
    price: 299.90,
    category: "Calçados",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "O equilíbrio definitivo entre amortecimento de impacto e atitude urbana. Solado emborrachado antiderrapante e cabedal respirável de alta durabilidade.",
    sizes: ["38", "39", "40", "41", "42"]
  },
  {
    id: 3,
    name: "Boné Dad Hat Minimalista",
    store: "Gribb Store",
    price: 59.90,
    originalPrice: 79.90,
    category: "Acessórios",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
    description: "Estilo clássico desestruturado com aba curva. Regulador traseiro em metal escovado e tecido tecnológico com proteção contra raios UV.",
    sizes: ["Único"]
  },
  {
    id: 4,
    name: "Moletom Essential Cinza",
    store: "Street Wearhouse",
    price: 149.90,
    category: "Roupas",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    description: "Flanelado por dentro para máxima retenção térmica nos dias frios do litoral. Bolso canguru frontal e punhos com elasticidade reforçada.",
    sizes: ["P", "M", "G", "GG"]
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  // Estados do Carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados do Modal de Detalhes do Produto (Quick View)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Abrir o modal e pré-selecionar o primeiro tamanho disponível
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "");
  };

  // Adicionar ao carrinho a partir do Modal de Detalhes
  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;

    setCart((prevCart) => {
      // O item é único combinando o ID e o Tamanho escolhido
      const existingItem = prevCart.find(
        (item) => item.id === selectedProduct.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === selectedProduct.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...selectedProduct, quantity: 1, selectedSize }];
    });

    // Fecha o modal de detalhes e limpa a seleção
    setSelectedProduct(null);
  };

  const updateQuantity = (id: number, size: string, delta: number) => {
    setCart((prevCart) => prevCart.map((item) => {
      if (item.id === id && item.selectedSize === size) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const hasSales = MOCK_PRODUCTS.some(p => p.originalPrice && p.originalPrice > p.price);
  const baseCategories = ["Todos", "Roupas", "Calçados", "Acessórios"];
  const categories = hasSales ? ["🔥 Ofertas", ...baseCategories] : baseCategories;

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (activeFilter === "Todos") return true;
    if (activeFilter === "🔥 Ofertas") return product.originalPrice && product.originalPrice > product.price;
    return product.category === activeFilter;
  });

  return (
    <main className="min-h-screen bg-[#F4F4F4] scroll-smooth overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(-2deg) scale(1); }
          50% { transform: translateY(-15px) rotate(1deg) scale(1.02); }
          100% { transform: translateY(0px) rotate(-2deg) scale(1); }
        }
        @keyframes shadow-pulse {
          0% { transform: translateX(-50%) scale(1); opacity: 0.35; }
          50% { transform: translateX(-50%) scale(0.85); opacity: 0.2; }
          100% { transform: translateX(-50%) scale(1); opacity: 0.35; }
        }
        .animate-float-shoe { animation: float 6s ease-in-out infinite; }
        .animate-floor-shadow { animation: shadow-pulse 6s ease-in-out infinite; }
      `}} />

      {/* --- HERO SECTION --- */}
      <section className="min-h-[85vh] md:min-h-[calc(100vh-5rem)] flex items-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-32 pb-8 md:pb-12 overflow-visible">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full">
          <div className="flex-1 max-w-xl text-center md:text-left z-20 mt-4 md:mt-0">
            <h1 className="text-[3.5rem] leading-[0.95] sm:text-7xl md:text-8xl font-black text-brand-dark tracking-tighter mb-4">
              ESTILO EM <br />
              <span className="text-brand-primary">CADA PASSO.</span>
            </h1>
            <p className="text-base md:text-xl text-brand-muted font-medium mb-4 md:mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
              Descubra coleções exclusivas com conforto e atitude. Entrega no mesmo dia na sua porta em Guaratuba.
            </p>
            <a href="#catalogo" className="hidden md:inline-flex items-center gap-2 bg-brand-dark text-brand-light px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-primary transition-colors active:scale-95 shadow-xl">
              <span>Explorar Catálogo</span>
            </a>
          </div>

          <div className="w-full flex-1 relative flex justify-center items-center min-h-[220px] md:min-h-[500px] z-10 mt-6 md:mt-0 mb-4 md:mb-0">
            <img src="/tenis.png" alt="Destaque Gribb" className="w-[110%] sm:w-[120%] max-w-[320px] sm:max-w-md lg:max-w-2xl object-contain animate-float-shoe relative drop-shadow-2xl" style={{ filter: 'drop-shadow(0px 40px 25px rgba(0,0,0,0.4))' }} />
            <div className="absolute bottom-[-10%] md:bottom-[10%] left-1/2 w-48 sm:w-80 h-5 sm:h-12 bg-black rounded-[100%] blur-xl animate-floor-shadow pointer-events-none -z-10"></div>
          </div>

          <div className="md:hidden w-full flex justify-center z-20 mt-4 mb-2">
            <a href="#catalogo" className="inline-flex items-center gap-2 bg-brand-dark text-brand-light px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-primary transition-colors active:scale-95 shadow-xl">
              <span>Explorar Catálogo</span>
            </a>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DO CATÁLOGO --- */}
      <section id="catalogo" className="min-h-screen pt-24 md:pt-32 pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-10 border-t border-gray-200/60">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tighter mb-2">VITRINE DISPONÍVEL</h2>
          <p className="text-brand-muted font-medium">Clique em um produto para ver detalhes e escolher o tamanho.</p>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-10 justify-center md:justify-start">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveFilter(category)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${activeFilter === category ? category === "🔥 Ofertas" ? "bg-brand-primary text-brand-light shadow-md" : "bg-brand-dark text-brand-light shadow-md" : "bg-white text-brand-muted border border-gray-200 hover:border-brand-dark hover:text-brand-dark"}`}>
              {category}
            </button>
          ))}
        </div>

        {/* Grid passando a função de abrir o modal ao clicar no card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              store={product.store}
              price={product.price}
              originalPrice={product.originalPrice}
              imageUrl={product.imageUrl}
              onCardClick={() => handleOpenProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 🔍 MODAL DE DETALHES DO PRODUTO (QUICK VIEW) */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fundo escuro */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          {/* Caixa do Modal */}
          <div className="relative bg-white w-full max-w-lg rounded-[2.5p_2.5rem] rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            
            {/* Botão fechar */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-dark hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagem do Produto */}
            <div className="relative aspect-square w-full bg-[#F8F8F8] overflow-hidden">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            {/* Conteúdo */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">{selectedProduct.store}</span>
              <h3 className="text-2xl font-black text-brand-dark leading-tight mt-1 mb-2">{selectedProduct.name}</h3>
              
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-brand-primary">
                  R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-brand-muted line-through font-medium">
                    R$ {selectedProduct.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>

              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Seletor de Tamanhos */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2.5">
                  Escolha o Tamanho:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
                        selectedSize === size
                          ? "bg-brand-dark text-white border-brand-dark shadow-md"
                          : "bg-white text-brand-dark border-gray-200 hover:border-brand-dark"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão Adicionar */}
              <button
                onClick={handleAddToCartFromModal}
                className="w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Adicionar à Sacola</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🛒 BOTÃO FLUTUANTE ESTILO iFOOD */}
      {/* ======================================================== */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 w-full px-4 z-40 flex justify-center pointer-events-none">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto w-full max-w-md bg-brand-primary text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(229,75,46,0.4)] hover:bg-brand-dark transition-all active:scale-95 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-primary">
                  {cartItemsCount}
                </span>
              </div>
              <span className="font-bold text-lg">Ver Sacola</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🛒 ABA LATERAL DA SACOLA */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-2xl font-black text-brand-dark tracking-tight">Sua Sacola</h2>
          
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-brand-muted hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Voltar às compras
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
              <p className="font-bold text-xl mb-2">Sacola Vazia</p>
              <p className="text-sm">Explore o catálogo e adicione os seus produtos favoritos.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 bg-[#F8F8F8] p-3 rounded-2xl relative">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-white border border-gray-100" />
                
                <div className="flex-1 flex flex-col py-1">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{item.store}</span>
                  <h4 className="text-sm font-bold text-brand-dark leading-tight line-clamp-2 my-0.5 pr-6">{item.name}</h4>
                  
                  {/* Etiqueta do Tamanho escolhido */}
                  <span className="inline-block bg-gray-200/80 text-brand-dark font-bold text-[10px] px-2 py-0.5 rounded-md w-max mb-2">
                    Tamanho: {item.selectedSize}
                  </span>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-8">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} disabled={item.quantity <= 1} className="w-7 h-full flex items-center justify-center text-brand-dark hover:bg-gray-100 disabled:opacity-30 transition-colors">-</button>
                      <span className="w-6 text-center text-xs font-bold text-brand-dark">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="w-7 h-full flex items-center justify-center text-brand-dark hover:bg-gray-100 transition-colors">+</button>
                    </div>

                    <div className="font-black text-brand-primary">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total da Sacola:</span>
              <span className="text-2xl font-black text-brand-dark">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <button className="w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2">
              <span>Finalizar Compra</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </main>
  );
}