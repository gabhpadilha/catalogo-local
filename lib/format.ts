const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (value: number) => brl.format(value);

export const isOnSale = (p: { price: number; originalPrice?: number }) =>
  !!p.originalPrice && p.originalPrice > p.price;

// Número da loja só com dígitos e DDI (5541...).
export const whatsappUrl = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const inStock = (p: { variants: { inStock: boolean }[] }) => p.variants.some((v) => v.inStock);

// Minúsculas e sem acentos, para pesquisa tolerante ("tenis" encontra "Tênis").
export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
