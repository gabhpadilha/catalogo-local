"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "gribb-cart";

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
  updateQuantity: (id: number, size: string, delta: number) => void;
  removeItem: (id: number, size: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const sameItem = (item: CartItem, id: number, size: string) =>
  item.id === id && item.selectedSize === size;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restaura a sacola do localStorage após montar (evita mismatch de hidratação).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  const addItem = useCallback((product: Product, size: string) => {
    setCart((prev) =>
      prev.some((i) => sameItem(i, product.id, size))
        ? prev.map((i) => (sameItem(i, product.id, size) ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...product, quantity: 1, selectedSize: size }]
    );
  }, []);

  const updateQuantity = useCallback((id: number, size: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        sameItem(i, id, size) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  }, []);

  const removeItem = useCallback((id: number, size: string) => {
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
