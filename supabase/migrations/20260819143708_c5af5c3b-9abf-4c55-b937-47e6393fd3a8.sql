CREATE TYPE public.circle_score_type AS ENUM ('trust_confirmation', 'daily_energy');

CREATE TABLE public.circle_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score_type public.circle_score_type NOT NULL DEFAULT 'daily_energy',
  score_value int NOT NULL CHECK (score_value >= 0 AND score_value <= 100),
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_posts TO authenticated;
GRANT SELECT ON public.circle_posts TO anon;
GRANT ALL ON public.circle_posts TO service_role;

ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read circle posts" ON public.circle_posts FOR SELECT USING (true);
CREATE POLICY "Users insert own circle posts" ON public.circle_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own circle posts" ON public.circle_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own circle posts" ON public.circle_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX circle_posts_score_created_idx ON public.circle_posts (score_value, created_at DESC);

CREATE TABLE public.circle_resonances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.circle_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.circle_resonances TO authenticated;
GRANT SELECT ON public.circle_resonances TO anon;
GRANT ALL ON public.circle_resonances TO service_role;

ALTER TABLE public.circle_resonances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read resonances" ON public.circle_resonances FOR SELECT USING (true);
CREATE POLICY "Users insert own resonance" ON public.circle_resonances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own resonance" ON public.circle_resonances FOR DELETE TO authenticated USING (auth.uid() = user_id);