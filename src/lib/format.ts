export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

export const formatRelative = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const fmt = (n: number, unit: string) => `${future ? "in " : ""}${Math.round(n)}${unit}${future ? "" : " ago"}`;
  if (abs < 60) return future ? "in a moment" : "just now";
  if (abs < 3600) return fmt(abs / 60, "m");
  if (abs < 86400) return fmt(abs / 3600, "h");
  if (abs < 86400 * 7) return fmt(abs / 86400, "d");
  return new Date(iso).toLocaleDateString();
};

export const statusLabel: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const statusColor: Record<string, string> = {
  placed: "bg-muted text-foreground",
  confirmed: "bg-indigo/10 text-indigo",
  preparing: "bg-warning/15 text-warning-foreground",
  out_for_delivery: "bg-primary/15 text-primary",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};
