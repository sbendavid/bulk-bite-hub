import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { api, tokenStorage } from "../lib/api";

export const authService = {
  async login(payload: LoginRequest) {
    const res = await api.post<AuthResponse>("/auth/login", payload);
    const { user, token, refreshToken } = res.data;
    tokenStorage.set(token);
    if (refreshToken) tokenStorage.setRefresh(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  async signup(payload: RegisterRequest) {
    console.log("Signing up with payload:", payload);
    const res = await api.post<AuthResponse>("/auth/register", payload);
    const { user, token, refreshToken } = res.data;
    tokenStorage.set(token);
    if (refreshToken) tokenStorage.setRefresh(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  async verifyOtp(email: string, otp: string) {
    const res = await api.get<AuthResponse>(`/auth/verify-email/${otp}`);
    const { user, token, refreshToken } = res.data;
    tokenStorage.set(token);
    if (refreshToken) tokenStorage.setRefresh(refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  async resendOtp(email: string) {
    await api.post("/auth/resend-otp", { email });
  },

  logout() {
    tokenStorage.clear();
    localStorage.removeItem("user");
  },
};
