import { Badge as BadgeType, UserBadge } from "@/hooks/useBadges";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface BadgesDisplayProps {
  allBadges: BadgeType[];
  earnedBadges: UserBadge[];
  loading?: boolean;
}

const categoryLabels: Record<string, string> = {
  check_ins: "Check-ins",
  calm_moments: "Calm Moments",
  streak: "Streaks",
};

export const BadgesDisplay = ({ allBadges, earnedBadges, loading }: BadgesDisplayProps) => {
  const earnedBadgeIds = new Set(earnedBadges.map(ub => ub.badge_id));

  // Group badges by category
  const groupedBadges = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, BadgeType[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-14 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const earnedCount = earnedBadges.length;
  const totalCount = allBadges.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Achievements</h3>
        <Badge variant="secondary" className="text-xs">
          {earnedCount}/{totalCount} Unlocked
        </Badge>
      </div>

      <TooltipProvider>
        {Object.entries(groupedBadges).map(([category, badges]) => (
          <div key={category} className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {categoryLabels[category] || category}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {badges.map((badge) => {
                const isEarned = earnedBadgeIds.has(badge.id);
                const earnedData = earnedBadges.find(ub => ub.badge_id === badge.id);

                return (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                          transition-all duration-300 cursor-pointer
                          ${isEarned
                            ? "bg-gradient-to-br from-calm-lavender to-calm-mint shadow-soft hover:scale-110"
                            : "bg-muted/50 grayscale opacity-50 hover:opacity-70"
                          }
                        `}
                      >
                        {isEarned ? (
                          badge.icon
                        ) : (
                          <div className="relative">
                            <span className="opacity-30">{badge.icon}</span>
                            <Lock className="absolute -bottom-1 -right-1 w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-center">
                      <p className="font-semibold">{badge.icon} {badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {isEarned && earnedData && (
                        <p className="text-xs text-primary mt-1">
                          Earned {new Date(earnedData.earned_at).toLocaleDateString()}
                        </p>
                      )}
                      {!isEarned && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Requires {badge.requirement_value} {badge.requirement_type.replace("_", " ")}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};
