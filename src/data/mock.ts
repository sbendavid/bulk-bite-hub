import type { Vendor, MenuItem, Order, Notification, ChatThread, ChatMessage } from "@/types";
import jollof from "@/assets/dish-jollof.jpg";
import salad from "@/assets/dish-salad.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import suya from "@/assets/dish-suya.jpg";

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Mama Cass Kitchen",
    tagline: "Authentic Nigerian party trays",
    cuisine: "African • Continental",
    rating: 4.9,
    reviews: 1284,
    minOrder: 20,
    prepTime: "3-5 hrs",
    image: jollof,
    badges: ["Top rated", "Free delivery"],
  },
  {
    id: "v2",
    name: "Greens & Co.",
    tagline: "Fresh salads & wholesome bowls",
    cuisine: "Healthy • Vegan",
    rating: 4.7,
    reviews: 562,
    minOrder: 10,
    prepTime: "2-3 hrs",
    image: salad,
    badges: ["Vegan friendly"],
  },
  {
    id: "v3",
    name: "Forno Pizzeria",
    tagline: "Wood-fired pizza for crowds",
    cuisine: "Italian • Pizza",
    rating: 4.8,
    reviews: 932,
    minOrder: 15,
    prepTime: "2-4 hrs",
    image: pizza,
    badges: ["Trending"],
  },
  {
    id: "v4",
    name: "Suya Spot",
    tagline: "Smoky skewers, party-ready",
    cuisine: "Grill • Street food",
    rating: 4.6,
    reviews: 410,
    minOrder: 25,
    prepTime: "4-6 hrs",
    image: suya,
    badges: ["Best for events"],
  },
];

export const menuItems: MenuItem[] = [
  { id: "m1", vendorId: "v1", name: "Jollof Rice & Grilled Chicken", description: "Smoky party jollof with marinated grilled chicken thighs.", pricePerHead: 3500, minQty: 20, step: 5, image: jollof, tags: ["Bestseller", "Spicy"] },
  { id: "m2", vendorId: "v1", name: "Fried Rice Combo", description: "Fried rice, plantain and choice of protein.", pricePerHead: 3800, minQty: 20, step: 5, image: jollof, tags: ["Classic"] },
  { id: "m3", vendorId: "v2", name: "Garden Crunch Bowl", description: "Crisp greens, cherry tomato, cucumber, citrus dressing.", pricePerHead: 2200, minQty: 10, step: 5, image: salad, tags: ["Vegan", "Light"] },
  { id: "m4", vendorId: "v2", name: "Quinoa Power Tray", description: "Quinoa, roasted veg, chickpeas, tahini drizzle.", pricePerHead: 2800, minQty: 10, step: 5, image: salad, tags: ["Protein"] },
  { id: "m5", vendorId: "v3", name: "Margherita Box (12 pies)", description: "Wood-fired margheritas, serves a crowd.", pricePerHead: 1800, minQty: 15, step: 5, image: pizza, tags: ["Vegetarian"] },
  { id: "m6", vendorId: "v3", name: "Pepperoni Party Pack", description: "Classic pepperoni & mozzarella, sliced & ready.", pricePerHead: 2100, minQty: 15, step: 5, image: pizza, tags: ["Bestseller"] },
  { id: "m7", vendorId: "v4", name: "Mixed Suya Platter", description: "Beef, chicken & ram suya with onions & yaji.", pricePerHead: 2500, minQty: 25, step: 5, image: suya, tags: ["Spicy", "Bestseller"] },
];

const now = Date.now();
const iso = (offsetMin: number) => new Date(now + offsetMin * 60_000).toISOString();

export const orders: Order[] = [
  {
    id: "o1029",
    vendorId: "v1", vendorName: "Mama Cass Kitchen",
    items: [{ name: "Jollof Rice & Grilled Chicken", qty: 50, pricePerHead: 3500 }],
    servings: 50, total: 175000,
    status: "out_for_delivery",
    placedAt: iso(-180), scheduledFor: iso(15),
    address: "12 Admiralty Way, Lekki", contact: "+234 801 234 5678",
  },
  {
    id: "o1014",
    vendorId: "v3", vendorName: "Forno Pizzeria",
    items: [{ name: "Margherita Box", qty: 30, pricePerHead: 1800 }, { name: "Pepperoni Party Pack", qty: 20, pricePerHead: 2100 }],
    servings: 50, total: 96000,
    status: "preparing",
    placedAt: iso(-90), scheduledFor: iso(120),
    address: "Office HQ, Victoria Island", contact: "+234 802 222 1010",
  },
  {
    id: "o0987",
    vendorId: "v2", vendorName: "Greens & Co.",
    items: [{ name: "Garden Crunch Bowl", qty: 25, pricePerHead: 2200 }],
    servings: 25, total: 55000,
    status: "delivered",
    placedAt: iso(-60 * 24 * 3), scheduledFor: iso(-60 * 24 * 3 + 180),
    address: "Conference Center, Ikeja", contact: "+234 803 555 9999",
  },
];

export const notifications: Notification[] = [
  { id: "n1", type: "order", title: "Driver is on the way", body: "Your order #1029 from Mama Cass is 15 min away.", createdAt: iso(-5), read: false, href: "/orders/o1029" },
  { id: "n2", type: "promo", title: "20% off bulk pizza", body: "Forno Pizzeria — this weekend only.", createdAt: iso(-60 * 4), read: false, href: "/vendor/v3" },
  { id: "n3", type: "message", title: "New message from support", body: "Hi! Just confirming your delivery window…", createdAt: iso(-60 * 8), read: true, href: "/chat/t1" },
  { id: "n4", type: "system", title: "Payment receipt", body: "Your invoice for order #1014 is ready.", createdAt: iso(-60 * 24), read: true },
];

export const chatThreads: ChatThread[] = [
  { id: "t1", title: "Bulkbite Support", subtitle: "Usually replies in minutes", lastMessage: "Hi! Just confirming your delivery window…", lastAt: iso(-60 * 8), unread: 1 },
  { id: "t2", title: "Mama Cass Kitchen", subtitle: "Vendor", lastMessage: "Order packed, leaving the kitchen now 🚚", lastAt: iso(-30), unread: 0 },
  { id: "t3", title: "Forno Pizzeria", subtitle: "Vendor", lastMessage: "We'll add extra napkins, no problem!", lastAt: iso(-60 * 26), unread: 0 },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  t1: [
    { id: "m1", threadId: "t1", from: "them", text: "Hi 👋 Welcome to Bulkbite! How can we help?", at: iso(-60 * 9) },
    { id: "m2", threadId: "t1", from: "me", text: "Need to change the delivery address for order #1029.", at: iso(-60 * 8.5) },
    { id: "m3", threadId: "t1", from: "them", text: "Got it. Just confirming your delivery window…", at: iso(-60 * 8) },
  ],
  t2: [
    { id: "m1", threadId: "t2", from: "them", text: "Order received, thank you!", at: iso(-60 * 3) },
    { id: "m2", threadId: "t2", from: "them", text: "Order packed, leaving the kitchen now 🚚", at: iso(-30) },
  ],
  t3: [
    { id: "m1", threadId: "t3", from: "me", text: "Could you add extra napkins for the team?", at: iso(-60 * 27) },
    { id: "m2", threadId: "t3", from: "them", text: "We'll add extra napkins, no problem!", at: iso(-60 * 26) },
  ],
};
