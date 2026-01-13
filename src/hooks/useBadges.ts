import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

// Global celebration callback
let celebrationCallback: ((badge: Badge) => void) | null = null;

export const setCelebrationCallback = (callback: ((badge: Badge) => void) | null) => {
  celebrationCallback = callback;
};

export const useBadges = () => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [celebratingBadge, setCelebratingBadge] = useState<Badge | null>(null);

  const fetchBadges = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all available badges
    const { data: badges } = await supabase
      .from("badges")
      .select("*")
      .order("requirement_value", { ascending: true });

    // Fetch user's earned badges
    const { data: userBadges } = await supabase
      .from("user_badges")
      .select("*, badge:badges(*)")
      .eq("user_id", user.id);

    if (badges) setAllBadges(badges);
    if (userBadges) {
      setEarnedBadges(userBadges.map(ub => ({
        ...ub,
        badge: ub.badge as Badge
      })));
    }
    setLoading(false);
  }, []);

  const checkAndAwardBadges = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user's current stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("check_ins, calm_moments, current_streak")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return;

    // Get all badges and user's earned badges
    const { data: badges } = await supabase.from("badges").select("*");
    const { data: userBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id);

    if (!badges) return;

    const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
    const newlyEarned: Badge[] = [];

    for (const badge of badges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      let earned = false;
      switch (badge.requirement_type) {
        case "check_ins":
          earned = (profile.check_ins ?? 0) >= badge.requirement_value;
          break;
        case "calm_moments":
          earned = (profile.calm_moments ?? 0) >= badge.requirement_value;
          break;
        case "streak":
          earned = (profile.current_streak ?? 0) >= badge.requirement_value;
          break;
      }

      if (earned) {
        const { error } = await supabase.from("user_badges").insert({
          user_id: user.id,
          badge_id: badge.id,
        });

        if (!error) {
          newlyEarned.push(badge);
        }
      }
    }

    // Show celebration for newly earned badges
    if (newlyEarned.length > 0) {
      // Trigger celebration animation for the first badge
      if (celebrationCallback) {
        celebrationCallback(newlyEarned[0]);
      }
      setCelebratingBadge(newlyEarned[0]);
      
      // Show toasts for additional badges if multiple earned at once
      if (newlyEarned.length > 1) {
        for (let i = 1; i < newlyEarned.length; i++) {
          const badge = newlyEarned[i];
          setTimeout(() => {
            toast({
              title: `🎉 New Badge Unlocked!`,
              description: `${badge.icon} ${badge.name} - ${badge.description}`,
            });
          }, i * 500);
        }
      }
      // Refresh badges list
      fetchBadges();
    }

    return newlyEarned;
  }, [fetchBadges]);

  const updateStreak = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, longest_streak, last_activity_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return;

    let newStreak = 1;
    const lastActivity = profile.last_activity_date;

    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already logged today, no change
        return;
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak = (profile.current_streak ?? 0) + 1;
      }
      // Otherwise streak resets to 1
    }

    const newLongest = Math.max(newStreak, profile.longest_streak ?? 0);

    await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: today,
      })
      .eq("user_id", user.id);
  }, []);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return {
    allBadges,
    earnedBadges,
    loading,
    celebratingBadge,
    setCelebratingBadge,
    fetchBadges,
    checkAndAwardBadges,
    updateStreak,
  };
};
