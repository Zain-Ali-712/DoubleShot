"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "./data";

type Line = { slug: string; qty: number };
type User = { name: string; email: string };

type Store = {
  lines: (Line & { product: Product })[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const StoreContext = createContext<Store | null>(null);

const CART_KEY = "ds-cart";
const USER_KEY = "ds-user";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRaw(read<Line[]>(CART_KEY, []));
    setUser(read<User | null>(USER_KEY, null));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(CART_KEY, raw);
  }, [raw, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setRaw((prev) => {
      const hit = prev.find((l) => l.slug === slug);
      if (hit) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setRaw((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setRaw([]), []);

  const signIn = useCallback((u: User) => {
    setUser(u);
    write(USER_KEY, u);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch {}
  }, []);

  const value = useMemo<Store>(() => {
    const lines = raw.flatMap((l) => {
      const product = getProduct(l.slug);
      return product ? [{ ...l, product }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
      user,
      signIn,
      signOut,
    };
  }, [raw, add, setQty, remove, clear, cartOpen, user, signIn, signOut]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
