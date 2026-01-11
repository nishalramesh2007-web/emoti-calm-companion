import { supabase } from "@/integrations/supabase/client";

export const useActivityTracker = () => {
  const incrementCheckIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current value and increment
    const { data: profile } = await supabase
      .from("profiles")
      .select("check_ins")
      .eq("user_id", user.id)
      .single();

    const currentCheckIns = profile?.check_ins ?? 0;

    await supabase
      .from("profiles")
      .update({ check_ins: currentCheckIns + 1 })
      .eq("user_id", user.id);
  };

  const incrementCalmMoment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current value and increment
    const { data: profile } = await supabase
      .from("profiles")
      .select("calm_moments")
      .eq("user_id", user.id)
      .single();

    const currentCalmMoments = profile?.calm_moments ?? 0;

    await supabase
      .from("profiles")
      .update({ calm_moments: currentCalmMoments + 1 })
      .eq("user_id", user.id);
  };

  return { incrementCheckIn, incrementCalmMoment };
};
