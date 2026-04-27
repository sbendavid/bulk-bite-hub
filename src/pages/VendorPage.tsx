import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { MenuItemRow } from "@/components/MenuItemRow";
import { MenuRowSkeleton, Skeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import type { Vendor, MenuItem } from "@/types";
import { Star, Clock, Users, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";

const VendorPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const { totalServings, totalAmount, vendorId } = useCart();

  useEffect(() => {
    if (!id) return;
    api.getVendor(id).then((v) => setVendor(v ?? null));
    api.listMenu(id).then(setItems);
  }, [id]);

  return (
    <AppLayout>
      <TopBar showBack title={vendor?.name ?? "Loading…"} />
      <main className="container max-w-4xl pb-32">
        <section className="rounded-3xl overflow-hidden bg-card shadow-card">
          {vendor ? (
            <>
              <div className="relative h-48 sm:h-60">
                <img src={vendor.image} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-primary-foreground">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {vendor.badges.map((b) => (
                      <span key={b} className="text-[10px] uppercase tracking-wider font-bold bg-card/95 text-foreground backdrop-blur px-2 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold">{vendor.name}</h1>
                  <p className="text-sm opacity-90">{vendor.tagline}</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 grid grid-cols-3 divide-x divide-border text-center text-sm">
                <div className="px-2">
                  <div className="flex items-center justify-center gap-1 text-warning"><Star className="h-4 w-4 fill-warning" /><span className="font-bold text-foreground">{vendor.rating}</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">{vendor.reviews}+ reviews</div>
                </div>
                <div className="px-2">
                  <div className="flex items-center justify-center gap-1 text-foreground"><Clock className="h-4 w-4" /><span className="font-bold">{vendor.prepTime}</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">Prep time</div>
                </div>
                <div className="px-2">
                  <div className="flex items-center justify-center gap-1 text-foreground"><Users className="h-4 w-4" /><span className="font-bold">{vendor.minOrder}+</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">Min servings</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-48 sm:h-60 rounded-none" />
              <div className="p-5 grid grid-cols-3 gap-4"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
            </>
          )}
        </section>

        <section className="mt-6">
          <h2 className="font-display text-xl font-bold mb-3">Bulk menu</h2>
          {!items ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <MenuRowSkeleton key={i} />)}</div>
          ) : (
            <div className="space-y-1 bg-card rounded-2xl p-2 shadow-card">
              {items.map((it) => <MenuItemRow key={it.id} item={it} />)}
            </div>
          )}
        </section>

        {/* Floating cart bar */}
        {totalServings > 0 && vendorId === id && (
          <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 animate-float-up">
            <Link to="/cart" className="flex items-center justify-between gap-3 gradient-warm text-primary-foreground rounded-2xl p-4 shadow-glow hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs opacity-90">{totalServings} servings</div>
                  <div className="font-bold">{formatNaira(totalAmount)}</div>
                </div>
              </div>
              <span className="font-semibold text-sm">View cart →</span>
            </Link>
          </div>
        )}
      </main>
    </AppLayout>
  );
};

export default VendorPage;
