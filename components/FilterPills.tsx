"use client";

import { useState } from "react";

const categorias = ["Todos", "Masculino", "Feminino", "Kids", "Skate", "Casual"];

export default function FilterPills() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  return (
    // Alterámos de overflow-x-auto para flex-wrap. O gap também é menor no telemóvel (gap-2) e maior no PC (md:gap-3)
    <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3 mb-8">
      
      {categorias.map((categoria) => {
        const isAtivo = categoriaAtiva === categoria;

        return (
          <button
            key={categoria}
            onClick={() => setCategoriaAtiva(categoria)}
            className={`
              /* px-4 py-1.5 e text-xs para telemóvel. Os prefixos md: restauram o tamanho maior no PC */
              px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 border
              ${isAtivo 
                ? "bg-brand-dark text-brand-light border-brand-dark shadow-md"
                : "bg-transparent text-brand-muted border-gray-300 hover:border-brand-dark hover:text-brand-dark"
              }
            `}
          >
            {categoria}
          </button>
        );
      })}
      
    </div>
  );
}