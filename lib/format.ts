const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (value: number) => brl.format(value);

export const isOnSale = (p: { price: number; originalPrice?: number }) =>
  !!p.originalPrice && p.originalPrice > p.price;

export const WHATSAPP_NUMBER = "5541999999999";

export const whatsappUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
