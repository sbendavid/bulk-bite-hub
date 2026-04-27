import { MenuItem } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";

export function MenuItemRow({ item }: { item: MenuItem }) {
  const { lines, addOrUpdate, vendorId } = useCart();
  const line = lines.find((l) => l.itemId === item.id);
  const qty = line?.qty ?? 0;

  const updateQty = (next: number) => {
    if (vendorId && vendorId !== item.vendorId && qty === 0) {
      toast("Cart cleared", { description: "Started a new order from this vendor." });
    }
    if (next > 0 && next < item.minQty) next = item.minQty;
    addOrUpdate(item.id, item.vendorId, next);
  };

  return (
    <article className="flex gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-1">
          {item.tags.map((t) => (
            <span key={t} className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display font-semibold leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-bold text-primary">{formatNaira(item.pricePerHead)}</span>
            <span className="text-xs text-muted-foreground"> /serving</span>
          </div>
          <div className="text-[11px] text-muted-foreground">Min {item.minQty}</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        <img src={item.image} alt={item.name} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
        {qty === 0 ? (
          <button
            onClick={() => updateQty(item.minQty)}
            className="text-xs font-bold gradient-warm text-primary-foreground px-4 py-1.5 rounded-full shadow-glow hover:scale-105 active:scale-95 transition-transform"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-card border border-border rounded-full p-0.5 shadow-card">
            <button
              onClick={() => updateQty(qty - item.step)}
              className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Decrease"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-bold w-7 text-center">{qty}</span>
            <button
              onClick={() => updateQty(qty + item.step)}
              className="h-7 w-7 rounded-full gradient-warm text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Increase"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
