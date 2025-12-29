import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodEntry {
  id: string;
  mood_score: number;
  mood_label: string;
  created_at: string;
}

const moodEmojis: Record<number, string> = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "🙂",
  5: "😊",
};

const moodColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-orange-400",
  3: "bg-yellow-400",
  4: "bg-lime-400",
  5: "bg-green-500",
};

const MoodTrends = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");

  useEffect(() => {
    const fetchMoodData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        console.error("Error fetching mood data:", error);
        setIsLoading(false);
        return;
      }

      setEntries(data || []);

      if (data && data.length > 0) {
        // Calculate average
        const avg = data.reduce((sum, e) => sum + e.mood_score, 0) / data.length;
        setAverageMood(avg);

        // Calculate trend (compare first half vs second half)
        if (data.length >= 4) {
          const midpoint = Math.floor(data.length / 2);
          const recentAvg = data.slice(0, midpoint).reduce((sum, e) => sum + e.mood_score, 0) / midpoint;
          const olderAvg = data.slice(midpoint).reduce((sum, e) => sum + e.mood_score, 0) / (data.length - midpoint);
          
          if (recentAvg > olderAvg + 0.3) {
            setTrend("up");
          } else if (recentAvg < olderAvg - 0.3) {
            setTrend("down");
          } else {
            setTrend("stable");
          }
        }
      }

      setIsLoading(false);
    };

    fetchMoodData();
  }, []);

  const groupByDay = (entries: MoodEntry[]) => {
    const groups: Record<string, MoodEntry[]> = {};
    entries.forEach((entry) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return groups;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border text-center">
        <p className="text-muted-foreground">
          Start chatting to see your mood trends! Your emotional journey will be tracked here.
        </p>
      </div>
    );
  }

  const grouped = groupByDay(entries);
  const days = Object.keys(grouped).slice(0, 7);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">Your Mood Journey</h3>
          {trend === "up" && (
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Improving</span>
            </div>
          )}
          {trend === "down" && (
            <div className="flex items-center gap-1 text-orange-500 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>Take care</span>
            </div>
          )}
          {trend === "stable" && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Minus className="w-4 h-4" />
              <span>Steady</span>
            </div>
          )}
        </div>

        {/* Average Mood */}
        {averageMood && (
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{moodEmojis[Math.round(averageMood)]}</div>
            <div>
              <p className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average mood score</p>
            </div>
          </div>
        )}

        {/* Mini Chart */}
        <div className="flex items-end gap-1 h-16">
          {entries.slice(0, 20).reverse().map((entry, i) => (
            <div
              key={entry.id}
              className={cn(
                "flex-1 rounded-t transition-all",
                moodColors[entry.mood_score]
              )}
              style={{ height: `${(entry.mood_score / 5) * 100}%` }}
              title={`${entry.mood_label} - ${new Date(entry.created_at).toLocaleString()}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Last 20 check-ins</p>
      </div>

      {/* Recent Days */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display text-lg font-semibold text-foreground">Recent Days</h3>
        </div>

        <div className="space-y-3">
          {days.map((date) => {
            const dayEntries = grouped[date];
            const dayAvg = dayEntries.reduce((sum, e) => sum + e.mood_score, 0) / dayEntries.length;
            const dominantLabel = dayEntries[0]?.mood_label || "neutral";

            return (
              <div key={date} className="flex items-center gap-3">
                <div className="w-16 text-sm text-muted-foreground">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", moodColors[Math.round(dayAvg)])}
                    style={{ width: `${(dayAvg / 5) * 100}%` }}
                  />
                </div>
                <div className="text-lg">{moodEmojis[Math.round(dayAvg)]}</div>
                <div className="w-20 text-sm text-muted-foreground capitalize">{dominantLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;
