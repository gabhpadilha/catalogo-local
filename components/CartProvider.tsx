"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";
import { useStore } from "./StoreProvider";


type CartContextValue = {
  cart: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  clearCart: () => void;
  addItem: (product: Product, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const MAX_QTY = 20;

type StoredItem = Pick<CartItem, "id" | "selectedSize" | "quantity">;

const sameItem = (item: CartItem, id: string, size: string) =>
  item.id === id && item.selectedSize === size;

// Reconstrói a sacola a partir do catálogo, descartando dados inválidos ou adulterados.
const restoreCart = (data: unknown, products: Product[]): CartItem[] => {
  if (!Array.isArray(data)) return [];
  const items: CartItem[] = [];
  for (const raw of data as Partial<StoredItem>[]) {
    const product = products.find((p) => p.id === raw?.id);
    const size = raw?.selectedSize;
    const qty = Math.floor(Number(raw?.quantity));
    if (!product || typeof size !== "string" || !product.variants.some((v) => v.label === size && v.inStock) || !(qty >= 1)) continue;
    if (items.some((i) => sameItem(i, product.id, size))) continue;
    items.push({ ...product, selectedSize: size, quantity: Math.min(qty, MAX_QTY) });
  }
  return items;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { store, products } = useStore();
  // Uma sacola por loja: o pedido vai para o WhatsApp de uma loja só.
  const storageKey = `cart:${store.slug}`;

  // Restaura a sacola do localStorage após montar (evita mismatch de hidratação).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCart(restoreCart(JSON.parse(saved), products));
    } catch {}
    setHydrated(true);
  }, [storageKey, products]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persiste só id/tamanho/quantidade: preço e nome vêm sempre do catálogo.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const stored: StoredItem[] = cart.map(({ id, selectedSize, quantity }) => ({ id, selectedSize, quantity }));
      localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch {}
  }, [cart, hydrated, storageKey]);

  const addItem = useCallback((product: Product, size: string) => {
    setCart((prev) =>
      prev.some((i) => sameItem(i, product.id, size))
        ? prev.map((i) => (sameItem(i, product.id, size) ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i))
        : [...prev, { ...product, quantity: 1, selectedSize: size }]
    );
  }, []);

  const updateQuantity = useCallback((id: string, size: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        sameItem(i, id, size) ? { ...i, quantity: Math.min(MAX_QTY, Math.max(1, i.quantity + delta)) } : i
      )
    );
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setCart((prev) => prev.filter((i) => !sameItem(i, id, size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const i of cart) {
      count += i.quantity;
      total += i.price * i.quantity;
    }
    return {
      cart, count, total, isOpen, setOpen, isCheckoutOpen, setCheckoutOpen,
      clearCart, addItem, updateQuantity, removeItem,
    };
  }, [cart, isOpen, isCheckoutOpen, clearCart, addItem, updateQuantity, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
