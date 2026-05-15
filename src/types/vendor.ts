import type { Vendor, MenuItem, Order } from "./index";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type VendorProfile = Vendor & {
  email: string;
  phone: string;
  address: string;
  description: string;
  verification: VerificationStatus;
  documents: { businessName?: string; rcNumber?: string; taxId?: string; idUploaded?: boolean; certUploaded?: boolean };
  payout: { bankName?: string; accountName?: string; accountNumber?: string };
};

export type VendorOrder = Order & {
  customerName: string;
};

export type DishInput = Omit<MenuItem, "id" | "vendorId">;
