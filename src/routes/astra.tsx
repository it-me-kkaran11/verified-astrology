import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { astraMessages } from "@/lib/mock-data";

export const Route = createFileRoute("/astra")({
  head: () => ({
    meta: [
      { title: "Astra — AstroLive Verified" },
      {
        name: "description",
        content: "Chat with Astra about your chart, your logged predictions, and Trust Scores.",
      },
      { property: "og:title", content: "Astra — AstroLive Verified" },
      {
        property: "og:description",
        content: "Your verification-aware astrology assistant.",
      },
    ],
  }),
  component: AstraPage,
});

type Msg = { id: string; from: "astra" | "user"; text: string; verified?: boolean };

function AstraPage() {
  const [messages, setMessages] = useState<Msg[]>(astraMessages);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `u${prev.length}`, from: "user", text },
      {
        id: `a${prev.length + 1}`,
        from: "astra",
        text: "I'll check that against your verified prediction history once we're connected.",
        verified: true,
      },
    ]);
    setDraft("");
  };

  return (
    <AppShell title="Astra" subtitle="Grounded in your verified history">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.from === "user"
                ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                : "glass-card max-w-[88%] p-4 text-sm leading-relaxed"
            }
          >
            {m.from === "astra" ? (
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
                <VerifiedBadge size="sm" /> Astra
              </p>
            ) : null}
            {m.text}
          </div>
        ))}

        <div className="glass-card sticky bottom-24 mt-4 flex items-center gap-2 p-2 md:bottom-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about a prediction…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={send}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
