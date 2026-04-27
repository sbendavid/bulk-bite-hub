import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import type { Notification } from "@/types";
import { toast } from "sonner";

type NotifCtx = {
  items: Notification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
};

const Ctx = createContext<NotifCtx | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    api.listNotifications().then(setItems);
  }, []);

  // Simulated realtime push (every 45s, surfaces a toast — swap for WebSocket/SSE on your Node API)
  useEffect(() => {
    const id = setInterval(() => {
      const n: Notification = {
        id: "rt-" + Date.now(),
        type: "order",
        title: "Order update",
        body: "Your driver just picked up the order.",
        createdAt: new Date().toISOString(),
        read: false,
      };
      setItems((prev) => [n, ...prev]);
      toast(n.title, { description: n.body });
    }, 45000);
    return () => clearInterval(id);
  }, []);

  const unread = items.filter((n) => !n.read).length;
  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return <Ctx.Provider value={{ items, unread, markAllRead, markRead }}>{children}</Ctx.Provider>;
}

export const useNotifications = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};
