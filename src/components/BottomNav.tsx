import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/cart", label: "Cart", icon: ShoppingBag, badge: true },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { totalServings } = useCart();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border safe-bottom">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors relative",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} strokeWidth={active ? 2.4 : 2} />
                  {badge && totalServings > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full gradient-warm text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-glow">
                      {totalServings}
                    </span>
                  )}
                </div>
                <span>{label}</span>
                {active && <span className="absolute top-0 h-1 w-8 rounded-b-full gradient-warm" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
