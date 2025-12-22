import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingExerciseProps {
  pattern: {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    holdAfter?: number;
  };
}

const BreathingExercise = ({ pattern }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfter">("inhale");
  const [countdown, setCountdown] = useState(pattern.inhale);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return pattern.hold;
          } else if (phase === "hold") {
            setPhase("exhale");
            return pattern.exhale;
          } else if (phase === "exhale") {
            if (pattern.holdAfter) {
              setPhase("holdAfter");
              return pattern.holdAfter;
            }
            setPhase("inhale");
            setCycles((c) => c + 1);
            return pattern.inhale;
          } else {
            setPhase("inhale");
            setCycles((c) => c + 1);
            return pattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, pattern]);

  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setCountdown(pattern.inhale);
    setCycles(0);
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdAfter":
        return "Hold";
    }
  };

  const getCircleScale = () => {
    if (phase === "inhale") return "scale-110";
    if (phase === "exhale") return "scale-90";
    return "scale-100";
  };

  return (
    <div className="flex flex-col items-center">
      {/* Breathing circle */}
      <div className="relative w-48 h-48 mb-8">
        {/* Outer glow ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-calm-blue/20 transition-transform duration-1000 ${
            isActive ? getCircleScale() : ""
          }`}
        />
        
        {/* Main circle */}
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br from-primary to-calm-blue shadow-glow transition-transform duration-1000 flex items-center justify-center ${
            isActive ? getCircleScale() : ""
          }`}
        >
          <div className="text-center text-primary-foreground">
            <p className="text-4xl font-bold mb-1">{countdown}</p>
            <p className="text-sm font-medium opacity-90">{getPhaseLabel()}</p>
          </div>
        </div>

        {/* Ripple effect */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ripple" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ripple stagger-2" />
          </>
        )}
      </div>

      {/* Pattern info */}
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{pattern.name}</h3>
        <p className="text-sm text-muted-foreground">
          {pattern.inhale}s in · {pattern.hold}s hold · {pattern.exhale}s out
          {pattern.holdAfter ? ` · ${pattern.holdAfter}s hold` : ""}
        </p>
        {cycles > 0 && (
          <p className="text-sm text-primary font-medium mt-2">
            {cycles} cycle{cycles !== 1 ? "s" : ""} completed
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="calm"
          size="lg"
          onClick={() => setIsActive(!isActive)}
          className="gap-2"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="lg" onClick={reset}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
