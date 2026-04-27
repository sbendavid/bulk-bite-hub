import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, MapPin, Search } from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  showBack?: boolean;
  showLocation?: boolean;
  showSearch?: boolean;
  transparent?: boolean;
};

export function TopBar({ title, showBack, showLocation, showSearch, transparent }: Props) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { unread } = useNotifications();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 safe-top transition-colors",
        transparent ? "bg-transparent" : "bg-background/85 backdrop-blur border-b border-border"
      )}
    >
      <div className="container max-w-6xl flex items-center gap-3 h-14">
        {showBack && (
          <button
            onClick={() => nav(-1)}
            className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {isHome && showLocation ? (
          <button className="flex items-center gap-2 text-left flex-1 min-w-0">
            <div className="h-9 w-9 rounded-full gradient-warm flex items-center justify-center shadow-glow">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Deliver to</div>
              <div className="text-sm font-semibold truncate">Lekki Phase 1, Lagos</div>
            </div>
          </button>
        ) : (
          <h1 className="font-display text-lg font-bold flex-1 truncate">{title}</h1>
        )}

        <div className="flex items-center gap-2">
          {showSearch && (
            <Link
              to="/"
              className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
          )}
          <Link
            to="/notifications"
            className="relative h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
