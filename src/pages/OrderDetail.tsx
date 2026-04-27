import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { Skeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";
import { formatNaira, formatRelative, statusLabel } from "@/lib/format";
import { Check, MapPin, Phone, MessageCircle } from "lucide-react";

const flow: OrderStatus[] = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered"];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => { if (id) api.getOrder(id).then((o) => setOrder(o ?? null)); }, [id]);

  if (!order) {
    return (
      <AppLayout>
        <TopBar showBack title="Order" />
        <main className="container max-w-3xl pb-12 space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </main>
      </AppLayout>
    );
  }

  const currentIdx = flow.indexOf(order.status);

  return (
    <AppLayout>
      <TopBar showBack title={`Order #${order.id}`} />
      <main className="container max-w-3xl pb-12 space-y-4">
        <section className="rounded-2xl gradient-sunset p-5 text-primary-foreground shadow-glow">
          <div className="text-xs uppercase tracking-wider opacity-90">{statusLabel[order.status]}</div>
          <div className="font-display text-2xl font-bold mt-1">
            {order.status === "delivered" ? "Delivered. Enjoy! 🎉" : `Arriving ${formatRelative(order.scheduledFor)}`}
          </div>
          <div className="text-sm opacity-90 mt-1">{order.vendorName} · {order.servings} servings</div>
        </section>

        {/* Tracking */}
        <section className="rounded-2xl bg-card shadow-card p-5">
          <h3 className="font-display font-bold mb-4">Tracking</h3>
          <ol className="space-y-4">
            {flow.map((s, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <li key={s} className="flex gap-3 items-start">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${done ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"} ${active ? "shadow-glow ring-4 ring-primary/20" : ""}`}>
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{statusLabel[s]}</div>
                    {active && <div className="text-xs text-primary mt-0.5 animate-pulse">In progress…</div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Items */}
        <section className="rounded-2xl bg-card shadow-card p-5">
          <h3 className="font-display font-bold mb-3">Items</h3>
          <div className="divide-y divide-border">
            {order.items.map((it, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{formatNaira(it.pricePerHead)} × {it.qty}</div>
                </div>
                <div className="font-semibold">{formatNaira(it.pricePerHead * it.qty)}</div>
              </div>
            ))}
          </div>
          <div className="h-px bg-border my-3" />
          <div className="flex justify-between font-display font-bold">
            <span>Total</span>
            <span className="text-primary">{formatNaira(order.total)}</span>
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-2xl bg-card shadow-card p-5 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-primary" />
            <div><div className="font-semibold">{order.address}</div><div className="text-xs text-muted-foreground">Delivery address</div></div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 mt-0.5 text-primary" />
            <div><div className="font-semibold">{order.contact}</div><div className="text-xs text-muted-foreground">Contact</div></div>
          </div>
        </section>

        <Link to="/chat/t1" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary text-primary py-3 font-bold hover:bg-primary/5 transition-colors">
          <MessageCircle className="h-4 w-4" /> Chat with support
        </Link>
      </main>
    </AppLayout>
  );
};

export default OrderDetail;
