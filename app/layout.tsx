import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PLATFORM } from "@/lib/platform";

export const metadata: Metadata = {
  title: { default: PLATFORM.name, template: `%s | ${PLATFORM.name}` },
  description: PLATFORM.tagline,
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
      <body className="antialiased bg-brand-light text-brand-dark font-sans">{children}</body>
    </html>
  );
}
