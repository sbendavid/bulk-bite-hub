import { Vendor } from "@/types";
import { Link } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      to={`/vendor/${vendor.id}`}
      className="group block rounded-2xl bg-card shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300 animate-float-up"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {vendor.badges.map((b) => (
            <span key={b} className="text-[10px] uppercase tracking-wider font-bold bg-card/95 backdrop-blur px-2 py-1 rounded-full">
              {b}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">{vendor.name}</h3>
            <p className="text-xs opacity-90">{vendor.cuisine}</p>
          </div>
          <div className="flex items-center gap-1 bg-card/95 backdrop-blur text-foreground px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs font-bold">{vendor.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>{vendor.prepTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>Min {vendor.minOrder} servings</span>
        </div>
        <div className="font-semibold text-primary">{vendor.reviews}+ reviews</div>
      </div>
    </Link>
  );
}
