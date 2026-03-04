
CREATE OR REPLACE FUNCTION public.increment_check_ins(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles SET check_ins = COALESCE(check_ins, 0) + 1 WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_calm_moments(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles SET calm_moments = COALESCE(calm_moments, 0) + 1 WHERE user_id = p_user_id;
$$;
