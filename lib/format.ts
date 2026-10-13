const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (value: number) => brl.format(value);

export const isOnSale = (p: { price: number; originalPrice?: number }) =>
  !!p.originalPrice && p.originalPrice > p.price;

// Defina NEXT_PUBLIC_WHATSAPP_NUMBER na Vercel (só dígitos, com DDI: 5541...).
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5541999999999";

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Minúsculas e sem acentos, para pesquisa tolerante ("tenis" encontra "Tênis").
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
