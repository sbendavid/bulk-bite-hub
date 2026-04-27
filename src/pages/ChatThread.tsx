import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TopBar } from "@/components/TopBar";
import { api } from "@/lib/api";
import type { ChatMessage, ChatThread } from "@/types";
import { Send } from "lucide-react";

const ChatThreadPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    api.listMessages(id).then(setMessages);
    api.listThreads().then((ts) => setThread(ts.find((t) => t.id === id) ?? null));
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const send = async () => {
    if (!id || !text.trim()) return;
    const t = text.trim();
    setText("");
    const msg = await api.sendMessage(id, t);
    setMessages((p) => [...(p ?? []), msg]);
    // Mock reply
    setTimeout(async () => {
      const reply = await api.sendMessage(id, "Thanks! We'll get back to you shortly. 😊");
      setMessages((p) => [...(p ?? []), { ...reply, from: "them" }]);
    }, 1200);
  };

  return (
    <AppLayout>
      <TopBar showBack title={thread?.title ?? "Chat"} />
      <main className="container max-w-3xl flex flex-col flex-1 pb-32 md:pb-6">
        <div className="flex-1 space-y-3 py-4">
          {!messages
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 ? "justify-end" : ""}`}>
                  <div className={`h-12 w-2/3 rounded-2xl skeleton ${i % 2 ? "rounded-br-sm" : "rounded-bl-sm"}`} />
                </div>
              ))
            : messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-float-up`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm rounded-2xl shadow-card ${
                      m.from === "me"
                        ? "gradient-warm text-primary-foreground rounded-br-sm"
                        : "bg-card text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
          <div ref={endRef} />
        </div>

        <div className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 md:right-0 bg-background/95 backdrop-blur border-t border-border safe-bottom">
          <div className="container max-w-3xl flex items-center gap-2 py-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button onClick={send} className="h-10 w-10 rounded-full gradient-warm text-primary-foreground flex items-center justify-center shadow-glow active:scale-95 transition-transform" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default ChatThreadPage;
