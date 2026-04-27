import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      <DesktopSidebar />
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
