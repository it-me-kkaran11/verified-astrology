import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ScoreType = Database["public"]["Enums"]["circle_score_type"];

export type CirclePost = {
  id: string;
  user_id: string;
  score_type: ScoreType;
  score_value: number;
  caption: string | null;
  created_at: string;
  author: string;
  resonances: number;
  resonated: boolean;
};

export type Circle = {
  score: number;
  posts: CirclePost[];
};

/** Higher scores lean gold and luminous; lower ones stay muted violet. */
export function scoreBand(score: number) {
  if (score >= 85)
    return {
      label: "Luminous",
      ring: "border-gold/55",
      glow: "shadow-[var(--shadow-gold-glow)]",
      dot: "bg-gold",
      text: "text-gold",
      tint: "bg-gold/12",
    };
  if (score >= 70)
    return {
      label: "Bright",
      ring: "border-gold/35",
      glow: "shadow-[var(--shadow-glow)]",
      dot: "bg-gold-soft",
      text: "text-gold-soft",
      tint: "bg-gold/8",
    };
  if (score >= 50)
    return {
      label: "Steady",
      ring: "border-primary-glow/45",
      glow: "",
      dot: "bg-primary-glow",
      text: "text-foreground",
      tint: "bg-primary/25",
    };
  return {
    label: "Dim",
    ring: "border-border",
    glow: "",
    dot: "bg-primary/70",
    text: "text-muted-foreground",
    tint: "bg-primary/15",
  };
}

export const circleFeedQuery = (viewerId: string | undefined) =>
  queryOptions({
    queryKey: ["circle-feed", viewerId],
    queryFn: async (): Promise<CirclePost[]> => {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data, error } = await supabase
        .from("circle_posts")
        .select("id, user_id, score_type, score_value, caption, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      const posts = data ?? [];
      if (posts.length === 0) return [];

      const userIds = [...new Set(posts.map((p) => p.user_id))];
      const [{ data: users }, { data: res }] = await Promise.all([
        supabase.from("users").select("id, name").in("id", userIds),
        supabase
          .from("circle_resonances")
          .select("post_id, user_id")
          .in(
            "post_id",
            posts.map((p) => p.id),
          ),
      ]);

      const nameById = new Map((users ?? []).map((u) => [u.id, u.name ?? "Anonymous"]));
      const counts = new Map<string, number>();
      const mine = new Set<string>();
      for (const r of res ?? []) {
        counts.set(r.post_id, (counts.get(r.post_id) ?? 0) + 1);
        if (viewerId && r.user_id === viewerId) mine.add(r.post_id);
      }

      return posts.map((p) => ({
        ...p,
        author: nameById.get(p.user_id) ?? "Anonymous",
        resonances: counts.get(p.id) ?? 0,
        resonated: mine.has(p.id),
      }));
    },
  });

/** Group posts into circles by identical score_value, brightest first. */
export function groupIntoCircles(posts: CirclePost[]): Circle[] {
  const map = new Map<number, CirclePost[]>();
  for (const p of posts) {
    const list = map.get(p.score_value) ?? [];
    list.push(p);
    map.set(p.score_value, list);
  }
  return [...map.entries()]
    .map(([score, list]) => ({ score, posts: list }))
    .sort((a, b) => b.posts.length - a.posts.length || b.score - a.score);
}

export async function createCirclePost(input: {
  userId: string;
  scoreType: ScoreType;
  scoreValue: number;
  caption?: string;
}) {
  const { data, error } = await supabase
    .from("circle_posts")
    .insert({
      user_id: input.userId,
      score_type: input.scoreType,
      score_value: Math.round(input.scoreValue),
      caption: input.caption?.trim() ? input.caption.trim() : null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** One-tap resonate: toggles the viewer's reaction on a post. */
export async function toggleResonance(postId: string, userId: string, on: boolean) {
  if (on) {
    const { error } = await supabase
      .from("circle_resonances")
      .insert({ post_id: postId, user_id: userId });
    if (error && error.code !== "23505") throw error;
    return;
  }
  const { error } = await supabase
    .from("circle_resonances")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
  if (error) throw error;
}
