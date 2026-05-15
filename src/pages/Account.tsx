import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, MapPin, CreditCard, Bell, HelpCircle, ChevronRight, User as UserIcon } from "lucide-react";

const Account = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <AppLayout>
      <TopBar title="Account" />
      <main className="container max-w-3xl pb-12">
        <section className="rounded-2xl gradient-sunset p-5 text-primary-foreground shadow-glow flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-xl">
            {user?.fullName?.[0]?.toUpperCase() ?? <UserIcon className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-xl">{user?.fullName ?? "Guest"}</div>
            <div className="text-sm opacity-90 truncate">{user?.email ?? "Sign in to save your orders"}</div>
          </div>
          {!user && (
            <Link to="/login" className="bg-white/25 hover:bg-white/35 transition-colors px-4 py-2 rounded-full text-sm font-bold">
              Sign in
            </Link>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-card shadow-card divide-y divide-border overflow-hidden">
          {[
            { icon: MapPin, label: "Saved addresses", to: "/account" },
            { icon: CreditCard, label: "Payment methods", to: "/account" },
            { icon: Bell, label: "Notifications", to: "/notifications" },
            { icon: HelpCircle, label: "Help & support", to: "/chat/t1" },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center"><Icon className="h-4 w-4 text-foreground" /></div>
              <span className="flex-1 font-semibold text-sm">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </section>

        {user && (
          <button
            onClick={() => { logout(); nav("/"); }}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/40 text-destructive font-semibold hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        )}
      </main>
    </AppLayout>
  );
};

export default Account;
