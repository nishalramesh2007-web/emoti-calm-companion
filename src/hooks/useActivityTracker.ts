import { supabase } from "@/integrations/supabase/client";
import { useBadges } from "./useBadges";
import { isGuestMode, getGuestStats, updateGuestStats } from "@/lib/guestMode";

export const useActivityTracker = () => {
  const { checkAndAwardBadges, updateStreak } = useBadges();

  const incrementCheckIn = async () => {
    if (isGuestMode()) {
      const stats = getGuestStats();
      updateGuestStats({ checkIns: stats.checkIns + 1 });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    await updateStreak();
    await checkAndAwardBadges();
  };

  const incrementCalmMoment = async () => {
    if (isGuestMode()) {
      const stats = getGuestStats();
      updateGuestStats({ calmMoments: stats.calmMoments + 1 });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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

    await updateStreak();
    await checkAndAwardBadges();
  };

  return { incrementCheckIn, incrementCalmMoment };
};
