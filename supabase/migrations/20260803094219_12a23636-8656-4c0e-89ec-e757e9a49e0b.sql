-- Enums
CREATE TYPE public.user_role AS ENUM ('user', 'astrologer');
CREATE TYPE public.prediction_outcome AS ENUM ('pending', 'true', 'false');
CREATE TYPE public.mood_type AS ENUM ('happy', 'neutral', 'sad');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'verified_plus');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- 1. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  name TEXT,
  dob DATE,
  tob TIME,
  place_of_birth TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT ALL ON public.users TO service_role;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read basic user rows" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own row" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own row" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. astrologers
CREATE TABLE public.astrologers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  trust_score NUMERIC NOT NULL DEFAULT 0,
  total_predictions INT NOT NULL DEFAULT 0,
  verified_predictions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.astrologers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.astrologers TO authenticated;
GRANT ALL ON public.astrologers TO service_role;
ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Astrologers are publicly readable" ON public.astrologers FOR SELECT USING (true);
CREATE POLICY "Astrologers manage own record" ON public.astrologers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_astrologers_updated_at BEFORE UPDATE ON public.astrologers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. predictions
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  astrologer_id UUID NOT NULL REFERENCES public.astrologers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  check_in_due_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 day'),
  outcome public.prediction_outcome NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ
);
GRANT SELECT ON public.predictions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.predictions TO authenticated;
GRANT ALL ON public.predictions TO service_role;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Predictions are publicly readable" ON public.predictions FOR SELECT USING (true);
CREATE POLICY "Users update own predictions" ON public.predictions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. journal_entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood public.mood_type NOT NULL DEFAULT 'neutral',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
GRANT ALL ON public.journal_entries TO service_role;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own journal" ON public.journal_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_journal_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier public.subscription_tier NOT NULL DEFAULT 'free',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  renews_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subscription" ON public.subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. share_cards
CREATE TABLE public.share_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  image_url TEXT,
  share_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.share_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.share_cards TO authenticated;
GRANT ALL ON public.share_cards TO service_role;
ALTER TABLE public.share_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Share cards are publicly readable" ON public.share_cards FOR SELECT USING (true);
CREATE POLICY "Authenticated can create share cards" ON public.share_cards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update share cards" ON public.share_cards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_share_cards_updated_at BEFORE UPDATE ON public.share_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Prediction template library (used to assign starter predictions on signup)
CREATE TABLE public.prediction_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  specialty TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prediction_templates TO anon;
GRANT SELECT ON public.prediction_templates TO authenticated;
GRANT ALL ON public.prediction_templates TO service_role;
ALTER TABLE public.prediction_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are publicly readable" ON public.prediction_templates FOR SELECT USING (true);

-- Auth signup -> public.users row
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (NEW.id, NULLIF(NEW.raw_user_meta_data ->> 'name', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, tier) VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- New app user -> assign starter predictions
CREATE OR REPLACE FUNCTION public.assign_starter_predictions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  a_id UUID;
  t RECORD;
  i INT := 0;
BEGIN
  SELECT id INTO a_id FROM public.astrologers ORDER BY trust_score DESC LIMIT 1;
  IF a_id IS NULL THEN RETURN NEW; END IF;
  FOR t IN SELECT text FROM public.prediction_templates ORDER BY random() LIMIT 4 LOOP
    i := i + 1;
    INSERT INTO public.predictions (astrologer_id, user_id, text, check_in_due_at)
    VALUES (
      a_id, NEW.id, t.text,
      CASE WHEN i <= 2 THEN now() - interval '2 hours' ELSE now() + (i || ' days')::interval END
    );
  END LOOP;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_app_user_created
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION public.assign_starter_predictions();

-- Resolve a prediction and recalculate the astrologer trust score
CREATE OR REPLACE FUNCTION public.resolve_prediction(_prediction_id UUID, _outcome public.prediction_outcome)
RETURNS public.predictions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p public.predictions;
BEGIN
  IF _outcome NOT IN ('true', 'false') THEN
    RAISE EXCEPTION 'Outcome must be true or false';
  END IF;

  SELECT * INTO p FROM public.predictions WHERE id = _prediction_id;
  IF p.id IS NULL THEN RAISE EXCEPTION 'Prediction not found'; END IF;
  IF p.user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Not your prediction'; END IF;
  IF p.outcome <> 'pending' THEN RAISE EXCEPTION 'Prediction already resolved'; END IF;

  UPDATE public.predictions
  SET outcome = _outcome, verified_at = now()
  WHERE id = _prediction_id
  RETURNING * INTO p;

  UPDATE public.astrologers
  SET total_predictions = total_predictions + 1,
      verified_predictions = verified_predictions + CASE WHEN _outcome = 'true' THEN 1 ELSE 0 END
  WHERE id = p.astrologer_id;

  UPDATE public.astrologers
  SET trust_score = CASE WHEN total_predictions = 0 THEN 0
        ELSE round((verified_predictions::numeric / total_predictions::numeric) * 100, 1) END
  WHERE id = p.astrologer_id;

  RETURN p;
END;
$$;
REVOKE ALL ON FUNCTION public.resolve_prediction(UUID, public.prediction_outcome) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_prediction(UUID, public.prediction_outcome) TO authenticated;

-- Register a share for a verified prediction
CREATE OR REPLACE FUNCTION public.register_share(_prediction_id UUID, _image_url TEXT DEFAULT NULL)
RETURNS public.share_cards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  card public.share_cards;
BEGIN
  SELECT * INTO card FROM public.share_cards WHERE prediction_id = _prediction_id LIMIT 1;
  IF card.id IS NULL THEN
    INSERT INTO public.share_cards (prediction_id, image_url, share_count)
    VALUES (_prediction_id, _image_url, 1)
    RETURNING * INTO card;
  ELSE
    UPDATE public.share_cards
    SET share_count = share_count + 1,
        image_url = COALESCE(_image_url, image_url)
    WHERE id = card.id
    RETURNING * INTO card;
  END IF;
  RETURN card;
END;
$$;
REVOKE ALL ON FUNCTION public.register_share(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_share(UUID, TEXT) TO authenticated;

-- Seed demo astrologers
INSERT INTO public.users (id, name, role) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Mira Kalyani', 'astrologer'),
  ('22222222-2222-4222-8222-222222222222', 'Devin Rao', 'astrologer'),
  ('33333333-3333-4333-8333-333333333333', 'Selene Marchetti', 'astrologer'),
  ('44444444-4444-4444-8444-444444444444', 'Arjun Vaidya', 'astrologer'),
  ('55555555-5555-4555-8555-555555555555', 'Nora Ellison', 'astrologer');

INSERT INTO public.astrologers (user_id, bio, specialties, trust_score, total_predictions, verified_predictions) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Vedic astrologer focused on career turning points. Logs every call before it lands.', ARRAY['career','finance'], 94.2, 412, 388),
  ('22222222-2222-4222-8222-222222222222', 'Relationship timing specialist. Twelve years of publicly verified readings.', ARRAY['relationships','health'], 88.7, 306, 271),
  ('33333333-3333-4333-8333-333333333333', 'Financial cycles and market-mood astrology, verified monthly.', ARRAY['finance','career'], 81.5, 249, 203),
  ('44444444-4444-4444-8444-444444444444', 'Health and wellbeing transits, tracked with daily check-ins.', ARRAY['health'], 76.3, 178, 136),
  ('55555555-5555-4555-8555-555555555555', 'Modern western astrology for relationships and self-work.', ARRAY['relationships','career','health'], 69.8, 132, 92);

INSERT INTO public.prediction_templates (text, specialty) VALUES
  ('A conversation about your work direction will surface before the week ends.', 'career'),
  ('An unexpected message from someone in your past will reach you.', 'relationships'),
  ('A small financial detail you overlooked will need attention.', 'finance'),
  ('Your energy will dip mid-week — rest will matter more than effort.', 'health'),
  ('Someone will offer you help you did not ask for.', 'relationships'),
  ('A delayed payment or reimbursement finally moves.', 'finance'),
  ('You will make a decision you have been postponing for weeks.', 'career'),
  ('A change of routine will improve your sleep noticeably.', 'health');

-- Demo prediction history for astrologer profile screens
INSERT INTO public.predictions (astrologer_id, text, outcome, verified_at, check_in_due_at)
SELECT a.id, v.text, v.outcome::public.prediction_outcome,
       CASE WHEN v.outcome = 'pending' THEN NULL ELSE now() - interval '3 days' END,
       now() - interval '4 days'
FROM public.astrologers a
CROSS JOIN (VALUES
  ('A career opening appears through an old contact.', 'true'),
  ('Travel plans shift at short notice.', 'false'),
  ('A financial decision benefits from waiting one more week.', 'true'),
  ('A new collaboration takes shape this month.', 'pending')
) AS v(text, outcome);