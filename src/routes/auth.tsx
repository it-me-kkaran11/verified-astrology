import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — AstroLive Verified" },
      {
        name: "description",
        content: "Create your AstroLive Verified account to log and confirm astrology predictions.",
      },
      { property: "og:title", content: "Sign In — AstroLive Verified" },
      {
        property: "og:description",
        content: "Log in to verify predictions and track astrologer Trust Scores.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="starfield flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <VerifiedBadge />
        <span className="font-bold tracking-tight">AstroLive Verified</span>
      </Link>

      <div className="glass-card w-full max-w-sm p-6">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1 text-sm font-semibold">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "rounded-full bg-primary py-2 text-primary-foreground"
                  : "rounded-full py-2 text-muted-foreground"
              }
            >
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <h1 className="text-2xl">
          {mode === "signup" ? "Start verifying" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Your check-ins are what make Trust Scores real."
            : "Pick up your check-in streak where you left off."}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/home" });
          }}
        >
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01]"
          >
            {mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <VerifiedBadge size="sm" />
          Predictions are logged before outcomes are known
        </p>
      </div>
    </div>
  );
}
