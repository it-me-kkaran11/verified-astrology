CREATE POLICY "Users can log own predictions"
ON public.predictions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);