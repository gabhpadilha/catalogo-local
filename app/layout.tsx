import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { PLATFORM } from "@/lib/platform";

// Variável com eixo de largura: texto normal e títulos semi-expandidos com um arquivo só.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: { default: PLATFORM.name, template: `%s | ${PLATFORM.name}` },
  description: PLATFORM.tagline,
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body className="antialiased bg-brand-light text-brand-dark font-sans">{children}</body>
    </html>
  );
}
