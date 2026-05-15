import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, ShieldCheck, Store, ArrowLeftRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { vendorStore, useVendorStore } from "@/data/vendorMock";

const nav = [
  { to: "/vendor-portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/vendor-portal/orders", label: "Orders", icon: ClipboardList },
  { to: "/vendor-portal/dishes", label: "Dishes", icon: UtensilsCrossed },
  { to: "/vendor-portal/verification", label: "Verification", icon: ShieldCheck },
  { to: "/vendor-portal/profile", label: "Profile", icon: Store },
];

export function VendorLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const orders = useVendorStore((s) => s.getOrders());
  const incoming = orders.filter((o) => o.status === "placed").length;
  const profile = useVendorStore((s) => s.getProfile());

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card sticky top-0 h-screen">
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-cool flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">Vendor Hub</div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">{profile.name}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => {
            const active = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
            const badge = to === "/vendor-portal/orders" ? incoming : 0;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full gradient-warm text-primary-foreground text-[11px] font-bold flex items-center justify-center">{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <Link to="/" className="flex items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-sm font-semibold hover:bg-muted transition-colors">
            <ArrowLeftRight className="h-4 w-4" /> Switch to buyer
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">{children}</div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border safe-bottom">
        <ul className="grid grid-cols-5">
          {nav.map(({ to, label, icon: Icon, end }) => {
            const active = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
            const badge = to === "/vendor-portal/orders" ? incoming : 0;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors relative",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="relative">
                    <Icon className={cn("h-5 w-5", active && "scale-110")} strokeWidth={active ? 2.4 : 2} />
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full gradient-warm text-primary-foreground text-[10px] font-bold flex items-center justify-center">{badge}</span>
                    )}
                  </div>
                  <span>{label.length > 7 ? label.slice(0, 7) : label}</span>
                  {active && <span className="absolute top-0 h-1 w-8 rounded-b-full gradient-warm" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export { vendorStore };
