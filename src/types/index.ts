export type Vendor = {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviews: number;
  minOrder: number; // people
  prepTime: string; // "2-4 hrs"
  image: string;
  badges: string[];
};

export type MenuItem = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  pricePerHead: number; // currency unit (₦ display)
  minQty: number; // min servings (bulk)
  step: number;
  image: string;
  tags: string[];
};

export type CartLine = {
  itemId: string;
  vendorId: string;
  qty: number; // servings
};

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  vendorId: string;
  vendorName: string;
  items: { name: string; qty: number; pricePerHead: number }[];
  servings: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  scheduledFor: string;
  address: string;
  contact: string;
};

export type Notification = {
  id: string;
  type: "order" | "promo" | "message" | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type ChatThread = {
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  from: "me" | "them";
  text: string;
  at: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
} | null;
