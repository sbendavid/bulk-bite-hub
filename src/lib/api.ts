/**
 * API client — central place to swap mock data for your Node.js backend.
 *
 * Usage when ready:
 *   1. Set VITE_API_BASE_URL in your env (e.g. https://api.yourdomain.com)
 *   2. Flip USE_MOCK to false (or it auto-switches when VITE_API_BASE_URL is set)
 *   3. Each function below points at the matching REST endpoint.
 */
import {
  vendors,
  menuItems,
  orders,
  notifications,
  chatThreads,
  chatMessages,
} from "@/data/mock";
import type {
  Vendor,
  MenuItem,
  Order,
  Notification,
  ChatThread,
  ChatMessage,
} from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const USE_MOCK = !BASE_URL;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Token helpers
export const tokenStorage = {
  get: () => localStorage.getItem("access_token"),
  set: (token: string) => localStorage.setItem("access_token", token),
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  getRefresh: () => localStorage.getItem("refresh_token"),
  setRefresh: (token: string) => localStorage.setItem("refresh_token", token),
};

export const refreshTokenStorage = {
  get: () => localStorage.getItem("refresh_token"),
  set: (token: string) => localStorage.setItem("refresh_token", token),
  clear: () => localStorage.removeItem("refresh_token"),
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = tokenStorage.get();
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

// export const api = {
//   async listVendors(): Promise<Vendor[]> {
//     if (USE_MOCK) {
//       await delay(700);
//       return vendors;
//     }
//     return http("/vendors");
//   },
//   async getVendor(id: string): Promise<Vendor | undefined> {
//     if (USE_MOCK) {
//       await delay(500);
//       return vendors.find((v) => v.id === id);
//     }
//     return http(`/vendors/${id}`);
//   },
//   async listMenu(vendorId: string): Promise<MenuItem[]> {
//     if (USE_MOCK) {
//       await delay(600);
//       return menuItems.filter((m) => m.vendorId === vendorId);
//     }
//     return http(`/vendors/${vendorId}/menu`);
//   },
//   async listOrders(): Promise<Order[]> {
//     if (USE_MOCK) {
//       await delay(700);
//       return orders;
//     }
//     return http("/orders");
//   },
//   async getOrder(id: string): Promise<Order | undefined> {
//     if (USE_MOCK) {
//       await delay(450);
//       return orders.find((o) => o.id === id);
//     }
//     return http(`/orders/${id}`);
//   },
//   async createOrder(payload: Partial<Order>): Promise<Order> {
//     if (USE_MOCK) {
//       await delay(900);
//       const id = "o" + Math.floor(1000 + Math.random() * 9000);
//       const newOrder = {
//         ...(payload as Order),
//         id,
//         status: "placed" as const,
//         placedAt: new Date().toISOString(),
//       };
//       orders.unshift(newOrder);
//       return newOrder;
//     }
//     return http("/orders", { method: "POST", body: JSON.stringify(payload) });
//   },
//   async listNotifications(): Promise<Notification[]> {
//     if (USE_MOCK) {
//       await delay(400);
//       return notifications;
//     }
//     return http("/notifications");
//   },
//   async listThreads(): Promise<ChatThread[]> {
//     if (USE_MOCK) {
//       await delay(400);
//       return chatThreads;
//     }
//     return http("/chat/threads");
//   },
//   async listMessages(threadId: string): Promise<ChatMessage[]> {
//     if (USE_MOCK) {
//       await delay(350);
//       return chatMessages[threadId] ?? [];
//     }
//     return http(`/chat/threads/${threadId}/messages`);
//   },
//   async sendMessage(threadId: string, text: string): Promise<ChatMessage> {
//     if (USE_MOCK) {
//       await delay(250);
//       const msg: ChatMessage = {
//         id: String(Date.now()),
//         threadId,
//         from: "me",
//         text,
//         at: new Date().toISOString(),
//       };
//       (chatMessages[threadId] ||= []).push(msg);
//       return msg;
//     }
//     return http(`/chat/threads/${threadId}/messages`, {
//       method: "POST",
//       body: JSON.stringify({ text }),
//     });
//   },
// };

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;

    const { access_token, refresh_token } = await res.json();
    tokenStorage.set(access_token);
    if (refresh_token) tokenStorage.setRefresh(refresh_token);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });

  // Auto-refresh on 401
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry the original request once with the new token
      return request<T>(method, path, body, options);
    }
    // Refresh failed — clear tokens and redirect to auth
    tokenStorage.clear();
    window.location.href = "/auth";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    throw new Error(errorBody?.message ?? `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// Public API object
export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),

  /** Multipart file upload — skips JSON content-type so fetch sets boundary */
  upload: <T>(path: string, formData: FormData) =>
    request<T>("POST", path, undefined, {
      body: formData as unknown as BodyInit,
      headers: {} as Record<string, string>, // let fetch set Content-Type with boundary
    }),
};
