/**
 * API client — central place to swap mock data for your Node.js backend.
 *
 * Usage when ready:
 *   1. Set VITE_API_BASE_URL in your env (e.g. https://api.yourdomain.com)
 *   2. Flip USE_MOCK to false (or it auto-switches when VITE_API_BASE_URL is set)
 *   3. Each function below points at the matching REST endpoint.
 */
import { vendors, menuItems, orders, notifications, chatThreads, chatMessages } from "@/data/mock";
import type { Vendor, MenuItem, Order, Notification, ChatThread, ChatMessage } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const USE_MOCK = !BASE_URL;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("bulkbite_token");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  async listVendors(): Promise<Vendor[]> {
    if (USE_MOCK) { await delay(700); return vendors; }
    return http("/vendors");
  },
  async getVendor(id: string): Promise<Vendor | undefined> {
    if (USE_MOCK) { await delay(500); return vendors.find((v) => v.id === id); }
    return http(`/vendors/${id}`);
  },
  async listMenu(vendorId: string): Promise<MenuItem[]> {
    if (USE_MOCK) { await delay(600); return menuItems.filter((m) => m.vendorId === vendorId); }
    return http(`/vendors/${vendorId}/menu`);
  },
  async listOrders(): Promise<Order[]> {
    if (USE_MOCK) { await delay(700); return orders; }
    return http("/orders");
  },
  async getOrder(id: string): Promise<Order | undefined> {
    if (USE_MOCK) { await delay(450); return orders.find((o) => o.id === id); }
    return http(`/orders/${id}`);
  },
  async createOrder(payload: Partial<Order>): Promise<Order> {
    if (USE_MOCK) {
      await delay(900);
      const id = "o" + Math.floor(1000 + Math.random() * 9000);
      const newOrder = { ...(payload as Order), id, status: "placed" as const, placedAt: new Date().toISOString() };
      orders.unshift(newOrder);
      return newOrder;
    }
    return http("/orders", { method: "POST", body: JSON.stringify(payload) });
  },
  async listNotifications(): Promise<Notification[]> {
    if (USE_MOCK) { await delay(400); return notifications; }
    return http("/notifications");
  },
  async listThreads(): Promise<ChatThread[]> {
    if (USE_MOCK) { await delay(400); return chatThreads; }
    return http("/chat/threads");
  },
  async listMessages(threadId: string): Promise<ChatMessage[]> {
    if (USE_MOCK) { await delay(350); return chatMessages[threadId] ?? []; }
    return http(`/chat/threads/${threadId}/messages`);
  },
  async sendMessage(threadId: string, text: string): Promise<ChatMessage> {
    if (USE_MOCK) {
      await delay(250);
      const msg: ChatMessage = { id: String(Date.now()), threadId, from: "me", text, at: new Date().toISOString() };
      (chatMessages[threadId] ||= []).push(msg);
      return msg;
    }
    return http(`/chat/threads/${threadId}/messages`, { method: "POST", body: JSON.stringify({ text }) });
  },
  // Auth
  async login(email: string, _password: string) {
    if (USE_MOCK) {
      await delay(700);
      const user = { id: "u1", name: email.split("@")[0], email };
      localStorage.setItem("bulkbite_token", "mock-token");
      localStorage.setItem("bulkbite_user", JSON.stringify(user));
      return user;
    }
    const { user, token } = await http<{ user: any; token: string }>("/auth/login", {
      method: "POST", body: JSON.stringify({ email, password: _password }),
    });
    localStorage.setItem("bulkbite_token", token);
    localStorage.setItem("bulkbite_user", JSON.stringify(user));
    return user;
  },
  async signup(name: string, email: string, password: string) {
    if (USE_MOCK) {
      await delay(900);
      const user = { id: "u1", name, email };
      localStorage.setItem("bulkbite_token", "mock-token");
      localStorage.setItem("bulkbite_user", JSON.stringify(user));
      return user;
    }
    const { user, token } = await http<{ user: any; token: string }>("/auth/signup", {
      method: "POST", body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("bulkbite_token", token);
    localStorage.setItem("bulkbite_user", JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem("bulkbite_token");
    localStorage.removeItem("bulkbite_user");
  },
};
