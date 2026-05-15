import { Link } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { formatNaira, formatRelative, statusLabel, statusColor } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

const TABS: { key: string; label: string; statuses: string[] }[] = [
  { key: "incoming", label: "Incoming", statuses: ["placed"] },
  { key: "active", label: "Active", statuses: ["confirmed", "preparing", "out_for_delivery"] },
  { key: "history", label: "History", statuses: ["delivered", "cancelled"] },
];

const VendorOrders = () => {
  const orders = useVendorStore((s) => s.getOrders());
  const [tab, setTab] = useState("incoming");
  const list = orders.filter((o) => TABS.find((t) => t.key === tab)!.statuses.includes(o.status));

  return (
    <VendorLayout>
      <TopBar title="Orders" />
      <main className="container max-w-4xl pb-12">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            {TABS.map((t) => {
              const count = orders.filter((o) => t.statuses.includes(o.status)).length;
              return (
                <TabsTrigger key={t.key} value={t.key} className="gap-2">
                  {t.label}
                  {count > 0 && <span className="text-[10px] font-bold bg-primary/15 text-primary rounded-full px-1.5">{count}</span>}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key} className="space-y-3">
              {list.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12 bg-card rounded-2xl shadow-card">No orders here yet.</div>
              ) : (
                list.map((o) => (
                  <article key={o.id} className="bg-card rounded-2xl shadow-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold">{o.customerName[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{o.customerName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">#{o.id} · {formatRelative(o.placedAt)} · {o.servings} servings</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{o.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatNaira(o.total)}</div>
                        <Link to={`/vendor-portal/orders/${o.id}`} className="text-xs font-semibold text-primary">Details →</Link>
                      </div>
                    </div>

                    {o.status === "placed" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1"
                          onClick={() => { vendorStore.setOrderStatus(o.id, "confirmed"); toast.success("Order accepted"); }}
                        >Accept</Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => { vendorStore.setOrderStatus(o.id, "cancelled"); toast("Order declined"); }}
                        >Decline</Button>
                      </div>
                    )}
                    {o.status === "confirmed" && (
                      <Button size="sm" className="mt-3 w-full" onClick={() => { vendorStore.setOrderStatus(o.id, "preparing"); toast.success("Marked as preparing"); }}>Start preparing</Button>
                    )}
                    {o.status === "preparing" && (
                      <Button size="sm" className="mt-3 w-full" onClick={() => { vendorStore.setOrderStatus(o.id, "out_for_delivery"); toast.success("Out for delivery"); }}>Mark out for delivery</Button>
                    )}
                    {o.status === "out_for_delivery" && (
                      <Button size="sm" className="mt-3 w-full" onClick={() => { vendorStore.setOrderStatus(o.id, "delivered"); toast.success("Delivered ✓"); }}>Mark delivered</Button>
                    )}
                  </article>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </VendorLayout>
  );
};

export default VendorOrders;
