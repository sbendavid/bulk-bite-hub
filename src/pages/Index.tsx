import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { VendorCard } from "@/components/VendorCard";
import { VendorCardSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import type { Vendor } from "@/types";
import { Search, Sparkles, Users } from "lucide-react";
import heroImg from "@/assets/hero-bulk.jpg";

const categories = [
  { label: "All", icon: "🍽️" },
  { label: "African", icon: "🍛" },
  { label: "Pizza", icon: "🍕" },
  { label: "Healthy", icon: "🥗" },
  { label: "Grill", icon: "🔥" },
  { label: "Desserts", icon: "🍰" },
  { label: "Drinks", icon: "🥤" },
];

const Index = () => {
  const [vendors, setVendors] = useState<Vendor[] | null>(null);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  // useEffect(() => { api.listVendors().then(setVendors); }, []);

  const filtered = (vendors ?? []).filter((v) => {
    const matchQ = v.name.toLowerCase().includes(query.toLowerCase()) || v.cuisine.toLowerCase().includes(query.toLowerCase());
    const matchC = active === "All" || v.cuisine.toLowerCase().includes(active.toLowerCase());
    return matchQ && matchC;
  });

  return (
    <AppLayout>
      <TopBar showLocation />
      <main className="container max-w-6xl pb-8">
        {/* Hero */}
        <section className="relative mt-2 rounded-3xl overflow-hidden shadow-elevated">
          <img src={heroImg} alt="Bulk catering trays" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-transparent" />
          <div className="relative p-6 sm:p-10 max-w-md text-background">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold bg-background/15 backdrop-blur px-2.5 py-1 rounded-full">
              <Sparkles className="h-3 w-3" /> Bulk specialists
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mt-3">
              Feed the whole crew, beautifully.
            </h1>
            <p className="text-sm sm:text-base opacity-90 mt-2">
              Order party-sized trays from trusted kitchens. From 10 to 1,000 servings.
            </p>
            <div className="mt-5 flex items-center gap-2 bg-background rounded-full p-1.5 shadow-glow">
              <Search className="h-4 w-4 text-muted-foreground ml-3" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, cuisines, vendors…"
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button className="gradient-warm text-primary-foreground text-xs font-bold px-4 py-2 rounded-full">
                Find
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {categories.map((c) => (
              <button
                key={c.label}
                onClick={() => setActive(c.label)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active === c.label
                    ? "gradient-warm text-primary-foreground border-transparent shadow-glow"
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <span className="mr-1.5">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* Promo strip */}
        <section className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl gradient-cool p-5 text-primary-foreground relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <div className="text-[11px] uppercase tracking-wider opacity-80">Weekend deal</div>
            <div className="font-display text-xl font-bold leading-tight mt-1">20% off bulk pizza</div>
            <div className="text-xs opacity-90 mt-1">Forno Pizzeria — orders 30+ servings.</div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl gradient-warm flex items-center justify-center shadow-glow shrink-0">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold">Planning an event?</div>
              <div className="text-xs text-muted-foreground">Chat with a bulk specialist for menus & quotes.</div>
            </div>
          </div>
        </section>

        {/* Vendors */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Top kitchens for bulk</h2>
              <p className="text-sm text-muted-foreground">Verified vendors that handle large orders flawlessly.</p>
            </div>
          </div>

          {!vendors ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <VendorCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No vendors match your search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((v) => <VendorCard key={v.id} vendor={v} />)}
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
};

export default Index;
