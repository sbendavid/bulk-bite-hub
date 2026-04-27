import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

type AuthCtx = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem("bulkbite_user");
      if (u) setUser(JSON.parse(u));
    } catch {}
    setLoading(false);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login: async (email, password) => {
          const u = await api.login(email, password);
          setUser(u);
        },
        signup: async (name, email, password) => {
          const u = await api.signup(name, email, password);
          setUser(u);
        },
        logout: () => {
          api.logout();
          setUser(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
