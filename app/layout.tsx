import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Importamos a Navbar aqui

export const metadata: Metadata = {
  title: "Gribb | Catálogo Rápido",
  description: "O comércio local com entrega no mesmo dia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-brand-light text-brand-dark font-sans">
        {/* A Navbar agora mora no Layout Global, aparecendo em todas as páginas */}
        <Navbar />
        
        {/* O 'children' é onde o Next.js vai injetar o conteúdo de cada página */}
        {children}
      </body>
    </html>
  );
}