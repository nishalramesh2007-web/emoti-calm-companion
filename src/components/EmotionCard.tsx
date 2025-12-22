import { cn } from "@/lib/utils";

interface EmotionCardProps {
  emoji: string;
  label: string;
  color: "lavender" | "mint" | "peach" | "blue";
  isSelected?: boolean;
  onClick: () => void;
  delay?: number;
}

const colorClasses = {
  lavender: "bg-calm-lavender-light border-calm-lavender/30 hover:border-calm-lavender",
  mint: "bg-calm-mint-light border-calm-mint/30 hover:border-calm-mint",
  peach: "bg-calm-peach-light border-calm-peach/30 hover:border-calm-peach",
  blue: "bg-calm-blue-light border-calm-blue/30 hover:border-calm-blue",
};

const EmotionCard = ({ emoji, label, color, isSelected, onClick, delay = 0 }: EmotionCardProps) => {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "w-full p-4 rounded-2xl border-2 transition-all duration-300 animate-fade-in-up",
        "hover:shadow-card hover:scale-[1.02] active:scale-[0.98]",
        "flex flex-col items-center justify-center gap-2",
        colorClasses[color],
        isSelected && "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-card"
      )}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </button>
  );
};

export default EmotionCard;
