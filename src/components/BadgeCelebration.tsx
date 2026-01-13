import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Badge } from "@/hooks/useBadges";

interface BadgeCelebrationProps {
  badge: Badge | null;
  onComplete: () => void;
}

export const BadgeCelebration = ({ badge, onComplete }: BadgeCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      
      // Fire confetti from both sides
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#E9D5FF", "#A5F3FC", "#FDE68A", "#FECACA", "#BBF7D0"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Center burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
      });

      // Auto dismiss after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [badge, onComplete]);

  if (!badge || !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => {
        setIsVisible(false);
        onComplete();
      }}
    >
      {/* Sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Badge card */}
      <div className="relative bg-gradient-to-br from-calm-lavender via-background to-calm-mint p-1 rounded-3xl animate-scale-in shadow-glow">
        <div className="bg-background rounded-3xl p-8 text-center max-w-sm mx-4">
          {/* Glowing badge icon */}
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 animate-pulse-glow rounded-full" />
            <div className="relative text-7xl animate-bounce-slow">
              {badge.icon}
            </div>
          </div>

          {/* Text content */}
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            🎉 Badge Unlocked!
          </h2>
          <h3 className="text-xl font-semibold text-primary mb-2">
            {badge.name}
          </h3>
          <p className="text-muted-foreground">
            {badge.description}
          </p>

          {/* Dismiss hint */}
          <p className="text-xs text-muted-foreground mt-6 animate-pulse">
            Tap anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
};
