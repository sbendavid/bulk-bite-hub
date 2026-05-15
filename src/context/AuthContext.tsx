import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import type { User } from "@/types";
import { authService } from "@/services/auth.service";

type AuthCtx = {
  user: User;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  signup: (payload: RegisterRequest) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}
    setLoading(false);
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login: async (LoginRequest: LoginRequest) => {
          const u = await authService.login(LoginRequest);
          setUser(u);
        },
        signup: async (RegisterRequest: RegisterRequest) => {
          const u = await authService.signup(RegisterRequest);
          console.log({ u });
          setUser(u);
        },
        verifyOtp: async (email: string, otp: string) => {
          const u = await authService.verifyOtp(email, otp);
          setUser(u);
        },
        resendOtp: async (email: string) => {
          await authService.resendOtp(email);
        },
        logout: () => {
          authService.logout();
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
