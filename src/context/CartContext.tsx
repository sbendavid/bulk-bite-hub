import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { CartLine, MenuItem } from "@/types";
import { menuItems } from "@/data/mock";

type CartCtx = {
  lines: CartLine[];
  addOrUpdate: (itemId: string, vendorId: string, qty: number) => void;
  remove: (itemId: string) => void;
  clear: () => void;
  totalServings: number;
  totalAmount: number;
  vendorId: string | null;
  itemsDetailed: { item: MenuItem; line: CartLine }[];
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem("bulkbite_cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("bulkbite_cart", JSON.stringify(lines));
  }, [lines]);

  const addOrUpdate = (itemId: string, vendorId: string, qty: number) => {
    setLines((prev) => {
      // single-vendor cart for simplicity
      const sameVendor = prev.length === 0 || prev[0].vendorId === vendorId;
      const base = sameVendor ? prev : [];
      const existing = base.find((l) => l.itemId === itemId);
      if (qty <= 0) return base.filter((l) => l.itemId !== itemId);
      if (existing) return base.map((l) => (l.itemId === itemId ? { ...l, qty } : l));
      return [...base, { itemId, vendorId, qty }];
    });
  };

  const remove = (itemId: string) => setLines((p) => p.filter((l) => l.itemId !== itemId));
  const clear = () => setLines([]);

  const itemsDetailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = menuItems.find((m) => m.id === l.itemId);
          return item ? { item, line: l } : null;
        })
        .filter(Boolean) as { item: MenuItem; line: CartLine }[],
    [lines]
  );

  const totalServings = lines.reduce((s, l) => s + l.qty, 0);
  const totalAmount = itemsDetailed.reduce((s, { item, line }) => s + item.pricePerHead * line.qty, 0);
  const vendorId = lines[0]?.vendorId ?? null;

  return (
    <Ctx.Provider value={{ lines, addOrUpdate, remove, clear, totalServings, totalAmount, vendorId, itemsDetailed }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
