import { Link } from "@tanstack/react-router";
import { Home, Trophy, Sparkles, User, CreditCard } from "lucide-react";
import type { ReactNode } from "react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/astra", label: "Astra", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      {/* Desktop side nav */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar/60 px-4 py-6 backdrop-blur-xl md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <VerifiedBadge size="md" label="AstroLive Verified" />
          <span className="text-sm font-bold tracking-tight">AstroLive</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-primary/40 text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-primary/20" }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-5 md:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold md:text-3xl">{title}</h1>
            {subtitle ? (
              <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-soft">
            <VerifiedBadge size="sm" />
            Verified
          </span>
        </header>

        <main className="flex-1 px-5 pb-28 pt-6 md:px-8 md:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-sidebar/85 backdrop-blur-xl md:hidden">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "text-gold-soft" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
