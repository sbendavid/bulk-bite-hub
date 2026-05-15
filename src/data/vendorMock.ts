import type { VendorProfile, VendorOrder } from "@/types/vendor";
import type { MenuItem } from "@/types";
import { vendors, menuItems, orders } from "./mock";
import jollof from "@/assets/dish-jollof.jpg";

const STORAGE_KEY = "bulkbite_vendor_state_v1";

type State = {
  profile: VendorProfile;
  dishes: MenuItem[];
  orders: VendorOrder[];
};

const customerNames = ["Adaeze O.", "Tolu A.", "Chinedu E.", "Maryam B.", "Femi K.", "Ngozi P."];

function defaultState(): State {
  const v = vendors[0];
  const profile: VendorProfile = {
    ...v,
    email: "kitchen@mamacass.ng",
    phone: "+234 803 111 2222",
    address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    description: "Family-run kitchen serving authentic Nigerian party trays since 2014.",
    verification: "unverified",
    documents: {},
    payout: {},
  };
  const dishes = menuItems
    .filter((m) => m.vendorId === v.id)
    .concat([
      { id: "vm-extra-1", vendorId: v.id, name: "Asun Pepper Bowl", description: "Smoky goat meat tossed with peppers & onions.", pricePerHead: 4200, minQty: 15, step: 5, image: jollof, tags: ["Spicy"] },
    ]);
  // Synthesize incoming orders for this vendor
  const baseOrders: VendorOrder[] = orders
    .filter((o) => o.vendorId === v.id)
    .map((o, i) => ({ ...o, customerName: customerNames[i % customerNames.length] }));
  const synth: VendorOrder[] = [
    { id: "ro-2201", vendorId: v.id, vendorName: v.name, items: [{ name: "Jollof Rice & Grilled Chicken", qty: 40, pricePerHead: 3500 }], servings: 40, total: 140000, status: "placed", placedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), address: "Wedding Hall, Ikoyi", contact: "+234 805 444 1212", customerName: "Bisi Events Co." },
    { id: "ro-2188", vendorId: v.id, vendorName: v.name, items: [{ name: "Fried Rice Combo", qty: 60, pricePerHead: 3800 }], servings: 60, total: 228000, status: "placed", placedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(), address: "Corporate HQ, V/I", contact: "+234 802 555 7878", customerName: "Helix Tech" },
    { id: "ro-2150", vendorId: v.id, vendorName: v.name, items: [{ name: "Asun Pepper Bowl", qty: 25, pricePerHead: 4200 }], servings: 25, total: 105000, status: "confirmed", placedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), address: "Birthday Venue, Lekki", contact: "+234 807 999 1011", customerName: "Tolu A." },
  ];
  return { profile, dishes, orders: [...synth, ...baseOrders] };
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = defaultState();
  save(s);
  return s;
}

function save(s: State) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

let state: State = typeof window !== "undefined" ? load() : defaultState();
const listeners = new Set<() => void>();
function emit() { save(state); listeners.forEach((l) => l()); }

export const vendorStore = {
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); },
  getProfile: () => state.profile,
  getDishes: () => state.dishes,
  getOrders: () => state.orders,
  updateProfile(patch: Partial<VendorProfile>) { state = { ...state, profile: { ...state.profile, ...patch } }; emit(); },
  submitVerification(docs: VendorProfile["documents"]) {
    state = { ...state, profile: { ...state.profile, verification: "pending", documents: { ...state.profile.documents, ...docs } } };
    emit();
    setTimeout(() => { state = { ...state, profile: { ...state.profile, verification: "verified" } }; emit(); }, 4000);
  },
  addDish(d: Omit<MenuItem, "id" | "vendorId">) {
    const dish: MenuItem = { ...d, id: "d" + Date.now(), vendorId: state.profile.id };
    state = { ...state, dishes: [dish, ...state.dishes] };
    emit();
    return dish;
  },
  updateDish(id: string, patch: Partial<MenuItem>) {
    state = { ...state, dishes: state.dishes.map((x) => (x.id === id ? { ...x, ...patch } : x)) };
    emit();
  },
  removeDish(id: string) {
    state = { ...state, dishes: state.dishes.filter((x) => x.id !== id) };
    emit();
  },
  setOrderStatus(id: string, status: VendorOrder["status"]) {
    state = { ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) };
    emit();
  },
  resetAll() { state = defaultState(); emit(); },
};

import { useSyncExternalStore } from "react";
export function useVendorStore<T>(selector: (s: typeof vendorStore) => T): T {
  return useSyncExternalStore(
    (cb) => vendorStore.subscribe(cb),
    () => selector(vendorStore),
    () => selector(vendorStore),
  );
}
