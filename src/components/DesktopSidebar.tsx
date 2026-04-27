import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, Package, User, Bell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationsContext";

const nav = [
  { to: "/", label: "Discover", icon: Home },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/account", label: "Account", icon: User },
];

export function DesktopSidebar() {
  const { pathname } = useLocation();
  const { totalServings } = useCart();
  const { unread } = useNotifications();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-card sticky top-0 h-screen">
      <div className="px-6 py-6 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl gradient-sunset flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">Bulkbite</div>
          <div className="text-[11px] text-muted-foreground">Bulk food, on time.</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          const badge =
            to === "/cart" ? totalServings : to === "/notifications" ? unread : 0;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full gradient-warm text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl gradient-sunset p-4 text-primary-foreground shadow-glow">
          <div className="text-xs uppercase tracking-wider opacity-80">Need 100+ meals?</div>
          <div className="font-display font-bold text-lg leading-tight mt-1">Talk to a bulk specialist</div>
          <Link to="/chat" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full">
            Start chat →
          </Link>
        </div>
      </div>
    </aside>
  );
}
