"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Novo hook importado para ler a URL atual

const Icons = {
  ajuda: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  ),
  entrega: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="15" height="13" x="1" y="3" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  ),
  loja: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  )
};

const NavLink = ({ text, icon, href }: { text: string; icon: React.ReactNode; href: string }) => {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <Link 
        href={href} 
        target={isExternal ? "_blank" : "_self"}
        className="relative flex items-center gap-1.5 cursor-pointer group font-medium text-sm px-1"
      >
        <span className="text-brand-muted group-hover:text-brand-light transition-colors duration-300">
          {icon}
        </span>
        <div className="relative overflow-hidden h-5 leading-5">
          <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2">
            <span className="block text-brand-light">{text}</span>
            <span className="block text-brand-light">{text}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

const MobileLink = ({ text, icon, href, onClick }: { text: string; icon: React.ReactNode; href: string; onClick: () => void }) => {
  const isExternal = href.startsWith("http");
  return (
    <li>
      <Link 
        href={href}
        target={isExternal ? "_blank" : "_self"}
        onClick={onClick}
        className="flex items-center gap-4 px-6 py-4 text-brand-light font-medium border-b border-[#2A2A2A] last:border-0 hover:bg-[#2A2A2A] active:bg-brand-primary transition-colors cursor-pointer"
      >
        <span className="text-brand-muted [&>svg]:w-5 [&>svg]:h-5">
          {icon}
        </span>
        {text}
      </Link>
    </li>
  );
};

const StatusBadge = ({ isOpen }: { isOpen: boolean }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] pointer-events-none">
    <span className="relative flex h-2 w-2">
      {isOpen && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-green-500' : 'bg-[#555555]'}`}></span>
    </span>
    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isOpen ? 'text-brand-light' : 'text-brand-muted'}`}>
      {isOpen ? "Entregando Hoje" : "Entregas Pausadas"}
    </span>
  </div>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Pega a rota atual da página
  
  const lojaAberta = true; 
  const isHome = pathname === "/"; // Verifica se o usuário está na vitrine principal

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      
      <nav className="relative bg-brand-dark text-brand-light rounded-full p-2 flex items-center justify-between shadow-2xl border border-[#2A2A2A] z-20">
        
        {/* BOTÃO DINÂMICO DE VOLTAR */}
        <Link 
          href="/" 
          className={`bg-brand-light text-brand-dark rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95 ${
            isHome ? "w-10 h-10" : "h-10 px-4 gap-1.5"
          }`}
        >
          {isHome ? (
            <span className="font-black text-xl tracking-tighter">G</span>
          ) : (
            <>
              {/* Ícone de Seta para Esquerda */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              <span className="font-black text-sm tracking-tight">Catálogo</span>
            </>
          )}
        </Link>

        {/* Resto da Navbar continua idêntico... */}
        <ul className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8 px-4 whitespace-nowrap">
          <NavLink icon={Icons.ajuda} text="Como Funciona" href="/como-funciona" />
          <NavLink icon={Icons.instagram} text="Instagram" href="https://instagram.com/gribb.pt" />
          <NavLink icon={Icons.entrega} text="Entregas" href="/entregas" />
          <NavLink icon={Icons.loja} text="Sobre a Loja" href="/sobre" />
        </ul>

        <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <StatusBadge isOpen={lojaAberta} />
        </div>

        <div className="hidden md:block shrink-0">
          <StatusBadge isOpen={lojaAberta} />
        </div>

        <div className="md:hidden flex items-center gap-1 sm:gap-2 shrink-0">
          <a 
            href="https://wa.me/5541999999999?text=Olá! Preciso de ajuda na Gribb."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-brand-light text-brand-dark px-3 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-transform active:scale-95"
          >
            {Icons.whatsapp}
            <span className="hidden sm:inline">Suporte</span>
          </a>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2A2A2A] transition-colors focus:outline-none"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
        
      </nav>

      {isMenuOpen && (
        <div className="absolute top-16 left-4 right-4 bg-brand-dark border border-[#2A2A2A] rounded-3xl shadow-2xl overflow-hidden md:hidden z-10">
          <ul className="flex flex-col">
            <MobileLink icon={Icons.ajuda} href="/como-funciona" onClick={() => setIsMenuOpen(false)} text="Como Funciona" />
            <MobileLink icon={Icons.instagram} href="https://instagram.com/gribb.pt" onClick={() => setIsMenuOpen(false)} text="Instagram" />
            <MobileLink icon={Icons.entrega} href="/entregas" onClick={() => setIsMenuOpen(false)} text="Entregas" />
            <MobileLink icon={Icons.loja} href="/sobre" onClick={() => setIsMenuOpen(false)} text="Sobre a Loja" />
          </ul>
        </div>
      )}
      
    </div>
  );
}