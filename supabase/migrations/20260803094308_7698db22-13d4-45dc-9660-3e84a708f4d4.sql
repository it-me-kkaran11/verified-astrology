DROP POLICY "Authenticated can create share cards" ON public.share_cards;
DROP POLICY "Authenticated can update share cards" ON public.share_cards;
REVOKE INSERT, UPDATE, DELETE ON public.share_cards FROM authenticated;

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.assign_starter_predictions() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_prediction(UUID, public.prediction_outcome) FROM anon;
REVOKE ALL ON FUNCTION public.register_share(UUID, TEXT) FROM anon;