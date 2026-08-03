import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { VerifiedBadge } from "@/components/VerifiedBadge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Set Up Your Chart — AstroLive Verified" },
      {
        name: "description",
        content: "Add your birth details so your predictions and chart summary can be generated.",
      },
      { property: "og:title", content: "Set Up Your Chart — AstroLive Verified" },
      {
        property: "og:description",
        content: "Birth date, time and place — the basis of your verified reading history.",
      },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("You need to be signed in.");

      const { error: upsertError } = await supabase.from("users").upsert(
        {
          id: userId,
          name: name.trim(),
          dob,
          tob: tob || null,
          place_of_birth: place.trim() || null,
        },
        { onConflict: "id" },
      );
      if (upsertError) throw upsertError;

      await queryClient.invalidateQueries();
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="starfield flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="glass-card w-full max-w-sm p-6">
        <VerifiedBadge size="lg" />
        <h1 className="mt-4 text-2xl">Your birth details</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Used once to build your chart summary. You can edit it later from your profile.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ari Novak"
              className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Date of birth</span>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-ring"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Time of birth</span>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-ring"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">Place of birth</span>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Lisbon, Portugal"
              className="mt-1.5 w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </label>

          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-60"
          >
            {busy ? "Saving…" : "Generate my chart"}
          </button>
        </form>
      </div>
    </div>
  );
}
