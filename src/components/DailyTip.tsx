import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  { text: "Take a 5-minute break every hour to stretch and breathe deeply.", category: "Wellness" },
  { text: "Write down three things you're grateful for before bed tonight.", category: "Gratitude" },
  { text: "Drink a glass of water right now — hydration improves mood.", category: "Health" },
  { text: "Try the 4-7-8 breathing technique when you feel overwhelmed.", category: "Breathing" },
  { text: "Spend 10 minutes outside today, even if it's just a short walk.", category: "Nature" },
  { text: "Put your phone down for 30 minutes and be fully present.", category: "Mindfulness" },
  { text: "Send a kind message to someone you care about today.", category: "Connection" },
  { text: "Notice five things around you right now — ground yourself.", category: "Grounding" },
  { text: "It's okay to say no. Your energy is valuable.", category: "Boundaries" },
  { text: "Do one thing today that your future self will thank you for.", category: "Motivation" },
  { text: "Progress, not perfection. Celebrate small wins.", category: "Growth" },
  { text: "Your feelings are valid. Give yourself permission to feel.", category: "Self-compassion" },
  { text: "Replace 'I have to' with 'I get to' — shift your perspective.", category: "Mindset" },
  { text: "Tidy one small space today. A clear space creates a clear mind.", category: "Environment" },
  { text: "Listen to a song that makes you feel alive.", category: "Joy" },
  { text: "Forgive yourself for yesterday. Today is a fresh start.", category: "Healing" },
  { text: "Smile at a stranger today — kindness is contagious.", category: "Kindness" },
  { text: "Before reacting, take three deep breaths.", category: "Calm" },
  { text: "You are enough, exactly as you are right now.", category: "Affirmation" },
  { text: "End your day by naming one thing that went well.", category: "Reflection" },
  { text: "Stretch your body for just two minutes — release the tension.", category: "Movement" },
  { text: "Journal about how you're feeling right now, no filter needed.", category: "Expression" },
  { text: "Practice the body scan technique to check in with yourself.", category: "Awareness" },
  { text: "Set one small intention for today and follow through.", category: "Focus" },
  { text: "Remember: you've survived 100% of your worst days.", category: "Resilience" },
  { text: "Slow down. Not everything is urgent.", category: "Pace" },
  { text: "Compliment yourself the way you'd compliment a friend.", category: "Self-love" },
  { text: "Try eating one meal today without any screens.", category: "Presence" },
  { text: "Your mental health matters more than your to-do list.", category: "Priority" },
  { text: "Take the scenic route today — literally or metaphorically.", category: "Adventure" },
  { text: "Close your eyes for 60 seconds and just listen.", category: "Stillness" },
];

const getDailyTip = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return tips[dayOfYear % tips.length];
};

const DailyTip = () => {
  const [tip, setTip] = useState(getDailyTip);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border animate-fade-in-up stagger-1">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary">Daily Tip</p>
            <p className="text-[10px] text-muted-foreground">{tip.category}</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          title="Get another tip"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      <p className="text-sm text-foreground leading-relaxed">
        "{tip.text}"
      </p>
    </div>
  );
};

export default DailyTip;
