import React from "react";

interface ProductCardProps {
  id: number;
  name: string;
  store: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  onCardClick: () => void; // Função que abre o modal de detalhes
}

export default function ProductCard({ name, store, price, originalPrice, imageUrl, onCardClick }: ProductCardProps) {
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div 
      onClick={onCardClick}
      className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      
      {/* Imagem do Produto */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F8F8]">
        {originalPrice && discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-brand-primary text-brand-light text-xs font-black px-3 py-1.5 rounded-full shadow-md">
            -{discountPercentage}%
          </div>
        )}
        <img 
          src={imageUrl} 
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Informações */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">{store}</span>
        <h3 className="text-lg font-bold text-brand-dark leading-tight mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{name}</h3>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {originalPrice && (
              <div className="text-sm text-brand-muted line-through font-medium mb-0.5">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div className={`font-black text-brand-dark ${originalPrice ? 'text-2xl text-brand-primary' : 'text-xl'}`}>
              R$ {price.toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          {/* Indicador visual de toque/clique */}
          <div className="bg-gray-100 text-brand-dark px-3.5 py-2 rounded-full text-xs font-bold group-hover:bg-brand-dark group-hover:text-white transition-colors">
            Ver +
          </div>
        </div>
      </div>
    </div>
  );
}