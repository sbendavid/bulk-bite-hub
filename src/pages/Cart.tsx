import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { formatNaira } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag, Calendar, MapPin, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { vendors } from "@/data/mock";
import { toast } from "sonner";

const Cart = () => {
  const { itemsDetailed, addOrUpdate, remove, clear, totalServings, totalAmount, vendorId } = useCart();
  const vendor = vendors.find((v) => v.id === vendorId);
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [address, setAddress] = useState("12 Admiralty Way, Lekki");
  const [contact, setContact] = useState("+234 801 234 5678");
  const [when, setWhen] = useState("");
  const [placing, setPlacing] = useState(false);
  const nav = useNavigate();

  const deliveryFee = totalAmount > 0 ? 2500 : 0;
  const serviceFee = Math.round(totalAmount * 0.05);
  const grand = totalAmount + deliveryFee + serviceFee;

  const placeOrder = async () => {
    if (!vendor) return;
    setPlacing(true);
    const order = await api.createOrder({
      vendorId: vendor.id,
      vendorName: vendor.name,
      items: itemsDetailed.map(({ item, line }) => ({ name: item.name, qty: line.qty, pricePerHead: item.pricePerHead })),
      servings: totalServings,
      total: grand,
      status: "placed",
      scheduledFor: when || new Date(Date.now() + 3 * 3600_000).toISOString(),
      address,
      contact,
    });
    setPlacing(false);
    clear();
    toast.success("Order placed!", { description: `Tracking #${order.id}` });
    nav(`/orders/${order.id}`);
  };

  if (totalServings === 0) {
    return (
      <AppLayout>
        <TopBar title="Your cart" />
        <main className="container max-w-3xl py-20 text-center">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Browse vendors and add bulk dishes to get started.</p>
          <Link to="/" className="inline-block mt-6 gradient-warm text-primary-foreground px-6 py-3 rounded-full font-bold shadow-glow">
            Discover kitchens
          </Link>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar showBack title={step === "cart" ? "Your cart" : "Checkout"} />
      <main className="container max-w-3xl pb-12">
        {step === "cart" && (
          <>
            <section className="rounded-2xl bg-card shadow-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Ordering from</div>
                  <div className="font-display font-bold">{vendor?.name}</div>
                </div>
                <button onClick={clear} className="text-xs text-destructive font-semibold hover:underline flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
              <div className="divide-y divide-border">
                {itemsDetailed.map(({ item, line }) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{formatNaira(item.pricePerHead)} × {line.qty}</div>
                    </div>
                    <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                      <button onClick={() => addOrUpdate(item.id, item.vendorId, line.qty - item.step)} className="h-7 w-7 rounded-full hover:bg-card flex items-center justify-center"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-xs font-bold w-7 text-center">{line.qty}</span>
                      <button onClick={() => addOrUpdate(item.id, item.vendorId, line.qty + item.step)} className="h-7 w-7 rounded-full gradient-warm text-primary-foreground flex items-center justify-center"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-2xl bg-card shadow-card p-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatNaira(totalAmount)} />
              <Row label="Delivery" value={formatNaira(deliveryFee)} />
              <Row label="Service fee" value={formatNaira(serviceFee)} />
              <div className="h-px bg-border my-2" />
              <Row label="Total" value={formatNaira(grand)} bold />
            </section>

            <button onClick={() => setStep("checkout")} className="w-full mt-5 gradient-warm text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-glow hover:scale-[1.01] transition-transform">
              Continue to checkout
            </button>
          </>
        )}

        {step === "checkout" && (
          <>
            <section className="rounded-2xl bg-card shadow-card p-5 space-y-4">
              <Field label="Delivery address" icon={<MapPin className="h-4 w-4" />}>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="Contact number" icon={<Phone className="h-4 w-4" />}>
                <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
              <Field label="Delivery date & time" icon={<Calendar className="h-4 w-4" />}>
                <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="w-full bg-transparent outline-none" />
              </Field>
            </section>
            <section className="mt-4 rounded-2xl bg-card shadow-card p-5 space-y-2 text-sm">
              <Row label={`${totalServings} servings · Subtotal`} value={formatNaira(totalAmount)} />
              <Row label="Delivery" value={formatNaira(deliveryFee)} />
              <Row label="Service fee" value={formatNaira(serviceFee)} />
              <div className="h-px bg-border my-2" />
              <Row label="Total" value={formatNaira(grand)} bold />
            </section>
            <button disabled={placing} onClick={placeOrder} className="w-full mt-5 gradient-sunset text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-glow disabled:opacity-60">
              {placing ? "Placing order…" : `Place order · ${formatNaira(grand)}`}
            </button>
          </>
        )}
      </main>
    </AppLayout>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={`flex justify-between ${bold ? "font-display text-base font-bold" : "text-muted-foreground"}`}>
    <span>{label}</span>
    <span className={bold ? "text-primary" : "text-foreground"}>{value}</span>
  </div>
);

const Field = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    <div className="mt-1.5 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted text-sm">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  </label>
);

export default Cart;
