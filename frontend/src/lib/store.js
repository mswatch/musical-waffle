import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (v) => set({ open: v }),
      add: (product, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.id === product.id);
        if (idx >= 0) items[idx].qty += qty;
        else items.push({ id: product.id, handle: product.handle, title: product.title, price: product.price, image: product.images?.[0], qty });
        set({ items, open: true });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) => set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "ms-cart" }
  )
);

export const useWishlist = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({ ids: get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [...get().ids, id] }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "ms-wishlist" }
  )
);

export const useTheme = create(
  persist(
    (set, get) => ({
      mode: "light",
      toggle: () => {
        const next = get().mode === "light" ? "dark" : "light";
        set({ mode: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },
      init: () => {
        document.documentElement.classList.toggle("dark", get().mode === "dark");
      },
    }),
    { name: "ms-theme" }
  )
);

export const useRecentlyViewed = create(
  persist(
    (set, get) => ({
      ids: [],
      push: (id) => {
        const ids = [id, ...get().ids.filter((x) => x !== id)].slice(0, 8);
        set({ ids });
      },
    }),
    { name: "ms-recent" }
  )
);
