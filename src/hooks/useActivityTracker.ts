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

    await supabase.rpc("increment_check_ins", { p_user_id: user.id });

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

    await supabase.rpc("increment_calm_moments", { p_user_id: user.id });

    await updateStreak();
    await checkAndAwardBadges();
  };

  return { incrementCheckIn, incrementCalmMoment };
};
