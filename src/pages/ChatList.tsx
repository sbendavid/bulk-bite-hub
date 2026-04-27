import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { ChatRowSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import type { ChatThread } from "@/types";
import { Link } from "react-router-dom";
import { formatRelative } from "@/lib/format";
import { MessageCircle } from "lucide-react";

const ChatList = () => {
  const [threads, setThreads] = useState<ChatThread[] | null>(null);
  useEffect(() => { api.listThreads().then(setThreads); }, []);

  return (
    <AppLayout>
      <TopBar title="Messages" />
      <main className="container max-w-3xl pb-12">
        <div className="rounded-2xl bg-card shadow-card divide-y divide-border overflow-hidden">
          {!threads
            ? Array.from({ length: 3 }).map((_, i) => <ChatRowSkeleton key={i} />)
            : threads.map((t) => (
                <Link key={t.id} to={`/chat/${t.id}`} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <div className="h-12 w-12 rounded-full gradient-cool text-primary-foreground flex items-center justify-center shrink-0 font-display font-bold">
                    {t.title.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-display font-semibold truncate">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground shrink-0">{formatRelative(t.lastAt)}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <div className="text-sm text-muted-foreground truncate">{t.lastMessage}</div>
                      {t.unread > 0 && <span className="h-5 min-w-5 px-1.5 rounded-full gradient-warm text-primary-foreground text-[11px] font-bold flex items-center justify-center">{t.unread}</span>}
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {threads && threads.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <div className="font-display font-bold">No messages yet</div>
            <div className="text-sm text-muted-foreground">Vendors and support will appear here.</div>
          </div>
        )}
      </main>
    </AppLayout>
  );
};

export default ChatList;
