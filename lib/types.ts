export type Variant = { label: string; inStock: boolean };

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  description: string;
  variants: Variant[];
};

export type CartItem = Product & {
  quantity: number;
  selectedSize: string;
};

export type DeliveryZone = { id: string; label: string; fee: number; pickup?: boolean };

export type StoreTheme = { primary: string; dark: string; light: string };

export type StoreHero = { title: string; highlight: string; text: string; imageUrl?: string };

export type Store = {
  id: string;
  slug: string;
  name: string;
  segment: string;
  tagline: string;
  whatsapp: string;
  instagram?: string;
  logoUrl?: string;
  city: string;
  address?: string;
  deliveryOpen: boolean;
  theme: StoreTheme;
  hero: StoreHero;
  zones: DeliveryZone[];
};

export type StoreCatalog = { store: Store; products: Product[] };

/** Loja como aparece na busca da plataforma. */
export type SearchStore = Pick<Store, "slug" | "name" | "segment" | "logoUrl" | "theme" | "deliveryOpen">;

/** Produto enxuto para a busca entre lojas (só os que têm estoque). */
export type SearchItem = {
  id: string;
  name: string;
  category: string;
  /** Início da descrição: só entra na busca quando nome e categoria não acham nada. */
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  store: string;
};

export type SearchIndex = { stores: SearchStore[]; items: SearchItem[] };
