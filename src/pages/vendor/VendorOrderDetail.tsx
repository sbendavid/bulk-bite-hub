import { useParams, Link } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { formatNaira, formatRelative, statusLabel, statusColor } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Calendar, Receipt } from "lucide-react";
import { toast } from "sonner";

const FLOW: Record<string, string | null> = {
  placed: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
  delivered: null,
  cancelled: null,
};
const NEXT_LABEL: Record<string, string> = {
  placed: "Accept order",
  confirmed: "Start preparing",
  preparing: "Mark out for delivery",
  out_for_delivery: "Mark delivered",
};

const VendorOrderDetail = () => {
  const { id } = useParams();
  const order = useVendorStore((s) => s.getOrders().find((o) => o.id === id));

  if (!order) {
    return (
      <VendorLayout>
        <TopBar showBack title="Order" />
        <main className="container max-w-3xl pb-12 text-center text-muted-foreground py-20">Order not found.</main>
      </VendorLayout>
    );
  }

  const next = FLOW[order.status];

  return (
    <VendorLayout>
      <TopBar showBack title={`Order #${order.id}`} />
      <main className="container max-w-3xl pb-12 space-y-4">
        <section className="rounded-2xl bg-card shadow-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-display font-bold text-xl">{order.customerName}</div>
              <div className="text-xs text-muted-foreground mt-1">Placed {formatRelative(order.placedAt)}</div>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
          </div>

          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {order.contact}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {order.address}</li>
            <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Scheduled {formatRelative(order.scheduledFor)}</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-card shadow-card p-5">
          <h2 className="font-display font-bold mb-3 flex items-center gap-2"><Receipt className="h-4 w-4" /> Items</h2>
          <ul className="divide-y divide-border">
            {order.items.map((it, i) => (
              <li key={i} className="py-3 flex justify-between text-sm">
                <span><span className="font-semibold">{it.name}</span> <span className="text-muted-foreground">× {it.qty}</span></span>
                <span className="font-semibold">{formatNaira(it.qty * it.pricePerHead)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-border flex justify-between font-display font-bold text-lg">
            <span>Total</span><span>{formatNaira(order.total)}</span>
          </div>
        </section>

        <section className="flex gap-2">
          {next ? (
            <Button className="flex-1" onClick={() => { vendorStore.setOrderStatus(order.id, next as any); toast.success(NEXT_LABEL[order.status] + " ✓"); }}>
              {NEXT_LABEL[order.status]}
            </Button>
          ) : (
            <Link to="/vendor-portal/orders" className="flex-1 text-center py-3 rounded-2xl border border-border font-semibold">Back to orders</Link>
          )}
          {order.status === "placed" && (
            <Button variant="outline" className="flex-1" onClick={() => { vendorStore.setOrderStatus(order.id, "cancelled"); toast("Order declined"); }}>Decline</Button>
          )}
        </section>
      </main>
    </VendorLayout>
  );
};

export default VendorOrderDetail;
