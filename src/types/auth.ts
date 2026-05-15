export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
};

export interface User {
  _id: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  fullName: string;
}

export type AuthResponse = {
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
};

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  BUYER = "buyer",
  CHEF = "chef",
  RIDER = "rider",
}
