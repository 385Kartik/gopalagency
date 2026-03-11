
-- Allow anon to read profiles (for admin panel)
CREATE POLICY "Anon can select all profiles" ON public.profiles
  FOR SELECT TO anon
  USING (true);

-- Allow anon to read orders (for admin customers page aggregation)
-- Already exists from previous migration
