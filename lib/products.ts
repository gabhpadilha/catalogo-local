import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camiseta Streetwear Oversized Preta",
    store: "Gribb Store",
    price: 89.90,
    originalPrice: 129.90,
    category: "Roupas",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    description: "Confeccionada em algodão pesado (heavy cotton) de alta gramatura. Modelagem oversized exclusiva com caimento perfeito e gola reforçada anti-deformação.",
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: 2,
    name: "Tênis Sneaker X Urban",
    store: "Footwear Local",
    price: 299.90,
    category: "Calçados",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "O equilíbrio definitivo entre amortecimento de impacto e atitude urbana. Solado emborrachado antiderrapante e cabedal respirável de alta durabilidade.",
    sizes: ["38", "39", "40", "41", "42"]
  },
  {
    id: 3,
    name: "Boné Dad Hat Minimalista",
    store: "Gribb Store",
    price: 59.90,
    originalPrice: 79.90,
    category: "Acessórios",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
    description: "Estilo clássico desestruturado com aba curva. Regulador traseiro em metal escovado e tecido tecnológico com proteção contra raios UV.",
    sizes: ["Único"]
  },
  {
    id: 4,
    name: "Moletom Essential Cinza",
    store: "Street Wearhouse",
    price: 149.90,
    category: "Roupas",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    description: "Flanelado por dentro para máxima retenção térmica nos dias frios do litoral. Bolso canguru frontal e punhos com elasticidade reforçada.",
    sizes: ["P", "M", "G", "GG"]
  }
];
