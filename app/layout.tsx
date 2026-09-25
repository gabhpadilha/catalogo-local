import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartProvider";
import { SearchProvider } from "@/components/SearchProvider";

export const metadata: Metadata = {
  title: "Gribb | Catálogo Rápido",
  description: "O comércio local com entrega no mesmo dia.",
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-brand-light text-brand-dark font-sans">
        <CartProvider>
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}