import type { StoreCatalog } from "./types";

// Lojas de demonstração: usadas quando o Supabase não está configurado
// (desenvolvimento local e apresentação comercial para lojistas).
const GUARATUBA_ZONES = [
  { id: "centro", label: "Centro", fee: 5 },
  { id: "brejatuba", label: "Brejatuba", fee: 8 },
  { id: "coroados", label: "Coroados", fee: 12 },
  { id: "retirada", label: "Retirar na Loja", fee: 0, pickup: true },
];

const sizes = (...labels: string[]) => labels.map((label) => ({ label, inStock: true }));

export const SEED: StoreCatalog[] = [
  {
    store: {
      id: "seed-gribb",
      slug: "gribb",
      name: "Gribb",
      segment: "Streetwear",
      tagline: "Streetwear com entrega no mesmo dia.",
      whatsapp: "5500000000000",
      instagram: "https://instagram.com/gribb.pt",
      city: "Guaratuba",
      deliveryOpen: true,
      theme: { primary: "#73030D", dark: "#0D0D0D", light: "#F2F2F2" },
      hero: {
        title: "ESTILO EM",
        highlight: "CADA PASSO.",
        text: "Descubra coleções exclusivas com conforto e atitude. Entrega no mesmo dia na sua porta em Guaratuba.",
        imageUrl: "/tenis.png",
      },
      zones: GUARATUBA_ZONES,
    },
    products: [
      {
        id: "gribb-1",
        name: "Camiseta Streetwear Oversized Preta",
        price: 89.9,
        originalPrice: 129.9,
        category: "Roupas",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        description: "Confeccionada em algodão pesado (heavy cotton) de alta gramatura. Modelagem oversized exclusiva com caimento perfeito e gola reforçada anti-deformação.",
        variants: sizes("P", "M", "G", "GG"),
      },
      {
        id: "gribb-2",
        name: "Tênis Sneaker X Urban",
        price: 299.9,
        category: "Calçados",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        description: "O equilíbrio definitivo entre amortecimento de impacto e atitude urbana. Solado emborrachado antiderrapante e cabedal respirável de alta durabilidade.",
        variants: [...sizes("38", "39", "40", "41"), { label: "42", inStock: false }],
      },
      {
        id: "gribb-3",
        name: "Boné Dad Hat Minimalista",
        price: 59.9,
        originalPrice: 79.9,
        category: "Acessórios",
        imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
        description: "Estilo clássico desestruturado com aba curva. Regulador traseiro em metal escovado e tecido tecnológico com proteção contra raios UV.",
        variants: sizes("Único"),
      },
      {
        id: "gribb-4",
        name: "Moletom Essential Cinza",
        price: 149.9,
        category: "Roupas",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        description: "Flanelado por dentro para máxima retenção térmica nos dias frios do litoral. Bolso canguru frontal e punhos com elasticidade reforçada.",
        variants: sizes("P", "M", "G", "GG"),
      },
    ],
  },
  {
    store: {
      id: "seed-obra",
      slug: "casa-e-obra",
      name: "Casa & Obra",
      segment: "Materiais de Construção",
      tagline: "Ferramentas e materiais na sua porta, hoje.",
      whatsapp: "5500000000000",
      city: "Guaratuba",
      deliveryOpen: true,
      theme: { primary: "#C2410C", dark: "#1C1917", light: "#F5F5F4" },
      hero: {
        title: "PRECISOU,",
        highlight: "CHEGOU HOJE.",
        text: "Faltou ferramenta no meio da obra? Peça pelo celular e receba em minutos em Guaratuba.",
      },
      zones: GUARATUBA_ZONES,
    },
    products: [
      {
        id: "obra-1",
        name: "Furadeira de Impacto 650W",
        price: 219.9,
        originalPrice: 259.9,
        category: "Ferramentas",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80",
        description: "Mandril de 13 mm, velocidade variável e função impacto para alvenaria. Acompanha maleta.",
        variants: sizes("127V", "220V"),
      },
      {
        id: "obra-2",
        name: "Jogo de Chaves Combinadas 12 peças",
        price: 89.9,
        category: "Ferramentas",
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&q=80",
        description: "Aço cromo-vanádio, de 6 a 22 mm. Ideal para manutenção doméstica e automotiva.",
        variants: sizes("Único"),
      },
      {
        id: "obra-3",
        name: "Tinta Acrílica Fosca Branca",
        price: 159.9,
        category: "Tintas",
        imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80",
        description: "Alto rendimento e cobertura para áreas internas e externas. Resistente à maresia.",
        variants: sizes("3,6 L", "18 L"),
      },
    ],
  },
];
