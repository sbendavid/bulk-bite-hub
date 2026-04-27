import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { OrderRowSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import { Link } from "react-router-dom";
import { formatNaira, formatRelative, statusColor, statusLabel } from "@/lib/format";

const Orders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tab, setTab] = useState<"active" | "past">("active");

  useEffect(() => { api.listOrders().then(setOrders); }, []);

  const filter = (o: Order) => (tab === "active" ? o.status !== "delivered" && o.status !== "cancelled" : o.status === "delivered" || o.status === "cancelled");

  return (
    <AppLayout>
      <TopBar title="Your orders" />
      <main className="container max-w-3xl pb-12">
        <div className="flex gap-1 bg-muted rounded-full p-1 w-fit mb-5">
          {(["active", "past"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${tab === t ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {!orders ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <OrderRowSkeleton key={i} />)}</div>
        ) : orders.filter(filter).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No {tab} orders yet.</div>
        ) : (
          <div className="space-y-3">
            {orders.filter(filter).map((o) => (
              <Link key={o.id} to={`/orders/${o.id}`} className="block rounded-2xl bg-card shadow-card p-4 hover:shadow-elevated transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-display font-bold">{o.vendorName}</div>
                    <div className="text-xs text-muted-foreground">#{o.id} · {formatRelative(o.placedAt)}</div>
                  </div>
                  <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                    {statusLabel[o.status]}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {o.items.map((i) => `${i.qty}× ${i.name}`).join(" · ")}
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{o.servings} servings</span>
                  <span className="font-bold text-primary">{formatNaira(o.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
};

export default Orders;
