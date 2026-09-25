export type Product = {
  id: number;
  name: string;
  store: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  description: string;
  sizes: string[];
};

export type CartItem = Product & {
  quantity: number;
  selectedSize: string;
};
