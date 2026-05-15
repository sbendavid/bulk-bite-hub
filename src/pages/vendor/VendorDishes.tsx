import { Link } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { formatNaira } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const VendorDishes = () => {
  const dishes = useVendorStore((s) => s.getDishes());
  const [q, setQ] = useState("");
  const filtered = dishes.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <VendorLayout>
      <TopBar title="My dishes" />
      <main className="container max-w-4xl pb-12 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes" className="pl-9" />
          </div>
          <Link to="/vendor-portal/dishes/new">
            <Button className="gap-1"><Plus className="h-4 w-4" /> New dish</Button>
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-card shadow-card p-10 text-center">
            <div className="font-display font-bold text-lg">No dishes yet</div>
            <p className="text-sm text-muted-foreground mt-1">Add your first bulk dish so customers can order.</p>
            <Link to="/vendor-portal/dishes/new" className="inline-block mt-4">
              <Button>Add a dish</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((d) => (
              <article key={d.id} className="bg-card rounded-2xl shadow-card overflow-hidden flex">
                <img src={d.image} alt={d.name} className="h-28 w-28 object-cover shrink-0" />
                <div className="flex-1 min-w-0 p-3 flex flex-col">
                  <div className="font-semibold truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{d.description}</div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div>
                      <div className="font-bold text-sm">{formatNaira(d.pricePerHead)} <span className="text-xs text-muted-foreground font-normal">/ head</span></div>
                      <div className="text-[11px] text-muted-foreground">Min {d.minQty} servings</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link to={`/vendor-portal/dishes/${d.id}`} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></Link>
                      <button
                        onClick={() => { if (confirm("Delete this dish?")) { vendorStore.removeDish(d.id); toast.success("Dish deleted"); } }}
                        className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors" aria-label="Delete"
                      ><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </VendorLayout>
  );
};

export default VendorDishes;
