import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { useNotifications } from "@/context/NotificationsContext";
import { Bell, Package, Tag, MessageCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelative } from "@/lib/format";

const iconFor = (t: string) => {
  switch (t) {
    case "order": return Package;
    case "promo": return Tag;
    case "message": return MessageCircle;
    default: return Settings;
  }
};

const Notifications = () => {
  const { items, markAllRead } = useNotifications();
  return (
    <AppLayout>
      <TopBar title="Notifications" />
      <main className="container max-w-3xl pb-12">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-muted-foreground">{items.filter((i) => !i.read).length} unread</p>
          <button onClick={markAllRead} className="text-sm font-semibold text-primary hover:underline">Mark all read</button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <div className="font-display font-bold">All clear</div>
            <div className="text-sm text-muted-foreground">You'll see order updates and promos here.</div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card shadow-card divide-y divide-border overflow-hidden">
            {items.map((n) => {
              const Icon = iconFor(n.type);
              const Body = (
                <div className={`flex gap-3 p-4 hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === "order" ? "gradient-warm text-primary-foreground" :
                    n.type === "promo" ? "gradient-cool text-primary-foreground" :
                    "bg-muted text-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">{n.title}</div>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{n.body}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{formatRelative(n.createdAt)}</div>
                  </div>
                </div>
              );
              return n.href ? <Link key={n.id} to={n.href}>{Body}</Link> : <div key={n.id}>{Body}</div>;
            })}
          </div>
        )}
      </main>
    </AppLayout>
  );
};

export default Notifications;
