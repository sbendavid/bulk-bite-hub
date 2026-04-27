import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

type Mode = "login" | "signup";

const Auth = ({ mode: initial = "login" }: { mode?: Mode }) => {
  const [mode, setMode] = useState<Mode>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password);
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      nav("/");
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual (desktop) */}
      <div className="hidden md:flex flex-1 gradient-sunset relative overflow-hidden p-12 text-primary-foreground">
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-md self-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="font-display font-bold text-xl">Bulkbite</div>
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] mt-10">
            Bulk food orders, beautifully simple.
          </h1>
          <p className="opacity-90 mt-4 text-lg">From 10 servings to 1,000 — one app, every kitchen, on time.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {["Verified vendors for large orders", "Live tracking & in-app chat", "One bill, scheduled delivery"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl gradient-sunset flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold text-xl">Bulkbite</div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to continue your order." : "Start ordering bulk food in minutes."}
            </p>
          </div>

          {mode === "signup" && (
            <Input label="Full name" value={name} onChange={setName} placeholder="Adaeze Okafor" required />
          )}
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />

          <button disabled={loading} className="w-full gradient-warm text-primary-foreground py-3 rounded-2xl font-bold shadow-glow disabled:opacity-60 hover:scale-[1.01] transition-transform">
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:underline">Continue as guest →</Link>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", ...rest }: any) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
      className="mt-1.5 w-full px-4 py-3 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
    />
  </label>
);

export default Auth;
