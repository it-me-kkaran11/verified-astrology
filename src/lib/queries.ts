import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Outcome = Database["public"]["Enums"]["prediction_outcome"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type PredictionRow = Database["public"]["Tables"]["predictions"]["Row"];

export type AstrologerCard = {
  id: string;
  user_id: string;
  bio: string | null;
  specialties: string[];
  trust_score: number;
  total_predictions: number;
  verified_predictions: number;
  name: string;
};

export const SPECIALTIES = ["career", "relationships", "finance", "health"] as const;
export type Specialty = (typeof SPECIALTIES)[number];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export { initials };

async function mapAstrologers(): Promise<AstrologerCard[]> {
  const { data, error } = await supabase
    .from("astrologers")
    .select("id, user_id, bio, specialties, trust_score, total_predictions, verified_predictions, users(name)")
    .order("trust_score", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((a) => ({
    id: a.id,
    user_id: a.user_id,
    bio: a.bio,
    specialties: a.specialties ?? [],
    trust_score: Number(a.trust_score),
    total_predictions: a.total_predictions,
    verified_predictions: a.verified_predictions,
    name: (a.users as { name: string | null } | null)?.name ?? "Unnamed astrologer",
  }));
}

export const astrologersQuery = () =>
  queryOptions({ queryKey: ["astrologers"], queryFn: mapAstrologers });

export const astrologerQuery = (id: string) =>
  queryOptions({
    queryKey: ["astrologer", id],
    queryFn: async () => {
      const list = await mapAstrologers();
      return list.find((a) => a.id === id) ?? null;
    },
  });

export const astrologerPredictionsQuery = (id: string) =>
  queryOptions({
    queryKey: ["astrologer-predictions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select("id, text, outcome, created_at, check_in_due_at, verified_at")
        .eq("astrologer_id", id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

export const myProfileQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export type CheckInPrediction = PredictionRow & { astrologer: AstrologerCard | null };

export const myPredictionsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["my-predictions", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return [];
      const [{ data, error }, astrologers] = await Promise.all([
        supabase
          .from("predictions")
          .select("*")
          .eq("user_id", userId)
          .order("check_in_due_at", { ascending: true }),
        mapAstrologers(),
      ]);
      if (error) throw error;
      const byId = new Map(astrologers.map((a) => [a.id, a]));
      return (data ?? []).map((p) => ({ ...p, astrologer: byId.get(p.astrologer_id) ?? null }));
    },
  });

export const shareCountQuery = (predictionId: string | undefined) =>
  queryOptions({
    queryKey: ["share-count", predictionId],
    enabled: Boolean(predictionId),
    queryFn: async () => {
      if (!predictionId) return 0;
      const { data, error } = await supabase
        .from("share_cards")
        .select("share_count")
        .eq("prediction_id", predictionId)
        .maybeSingle();
      if (error) throw error;
      return data?.share_count ?? 0;
    },
  });

export async function resolvePrediction(predictionId: string, outcome: "true" | "false") {
  const { data, error } = await supabase.rpc("resolve_prediction", {
    _prediction_id: predictionId,
    _outcome: outcome,
  });
  if (error) throw error;
  return data;
}

export async function registerShare(predictionId: string) {
  const { data, error } = await supabase.rpc("register_share", {
    _prediction_id: predictionId,
  });
  if (error) throw error;
  return data;
}

/** Consecutive days (ending today or yesterday) with at least one confirmation. */
export function checkInStreak(verifiedAt: (string | null)[]): number {
  const days = new Set(
    verifiedAt.filter(Boolean).map((v) => new Date(v!).toISOString().slice(0, 10)),
  );
  if (days.size === 0) return 0;

  const cursor = new Date();
  const today = cursor.toISOString().slice(0, 10);
  if (!days.has(today)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
