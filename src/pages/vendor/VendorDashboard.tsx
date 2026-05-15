import { Link } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore } from "@/data/vendorMock";
import { formatNaira, formatRelative, statusLabel, statusColor } from "@/lib/format";
import { ShieldCheck, ShieldAlert, ShieldQuestion, TrendingUp, ClipboardList, UtensilsCrossed, ArrowRight } from "lucide-react";

const VendorDashboard = () => {
  const profile = useVendorStore((s) => s.getProfile());
  const orders = useVendorStore((s) => s.getOrders());
  const dishes = useVendorStore((s) => s.getDishes());

  const incoming = orders.filter((o) => o.status === "placed");
  const active = orders.filter((o) => ["confirmed", "preparing", "out_for_delivery"].includes(o.status));
  const today = orders.filter((o) => new Date(o.placedAt).toDateString() === new Date().toDateString());
  const revenueToday = today.reduce((s, o) => s + o.total, 0);

  const verifBadge =
    profile.verification === "verified" ? { icon: ShieldCheck, label: "Verified", cls: "bg-success/15 text-success" }
    : profile.verification === "pending" ? { icon: ShieldQuestion, label: "Pending review", cls: "bg-warning/15 text-warning-foreground" }
    : profile.verification === "rejected" ? { icon: ShieldAlert, label: "Rejected", cls: "bg-destructive/15 text-destructive" }
    : { icon: ShieldAlert, label: "Unverified", cls: "bg-muted text-foreground" };
  const VBIcon = verifBadge.icon;

  return (
    <VendorLayout>
      <TopBar title="Dashboard" />
      <main className="container max-w-5xl pb-12 space-y-5">
        {/* Hero */}
        <section className="rounded-3xl gradient-cool p-6 text-primary-foreground shadow-glow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Welcome back</div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{profile.name}</h1>
              <p className="opacity-90 text-sm mt-1">{profile.tagline}</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${verifBadge.cls}`}>
              <VBIcon className="h-3 w-3" /> {verifBadge.label}
            </span>
          </div>
          {profile.verification !== "verified" && (
            <Link to="/vendor-portal/verification" className="mt-4 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full text-sm font-bold">
              Complete verification <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Incoming" value={incoming.length} icon={ClipboardList} accent="text-primary" />
          <Stat label="Active" value={active.length} icon={TrendingUp} accent="text-indigo" />
          <Stat label="Dishes" value={dishes.length} icon={UtensilsCrossed} accent="text-accent" />
          <Stat label="Revenue today" value={formatNaira(revenueToday)} icon={TrendingUp} accent="text-success" />
        </section>

        {/* Incoming orders preview */}
        <section className="rounded-2xl bg-card shadow-card overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display font-bold text-lg">Incoming requests</h2>
            <Link to="/vendor-portal/orders" className="text-sm font-semibold text-primary">View all →</Link>
          </header>
          {incoming.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No incoming requests right now.</div>
          ) : (
            <ul className="divide-y divide-border">
              {incoming.slice(0, 4).map((o) => (
                <li key={o.id}>
                  <Link to={`/vendor-portal/orders/${o.id}`} className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors">
                    <div className="h-10 w-10 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold">
                      {o.customerName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{o.customerName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{o.servings} servings · {formatRelative(o.placedAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatNaira(o.total)}</div>
                      <div className="text-[11px] text-muted-foreground">#{o.id}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </VendorLayout>
  );
};

function Stat({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: any; accent: string }) {
  return (
    <div className="rounded-2xl bg-card shadow-card p-4">
      <div className={`h-8 w-8 rounded-xl bg-muted flex items-center justify-center ${accent}`}><Icon className="h-4 w-4" /></div>
      <div className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-xl truncate">{value}</div>
    </div>
  );
}

export default VendorDashboard;
