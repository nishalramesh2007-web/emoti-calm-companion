import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Clock, Flame, Heart } from "lucide-react";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

interface BreathingExerciseProps {
  pattern: {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    holdAfter?: number;
  };
}

const durationOptions = [
  { 
    label: "2 min", 
    seconds: 120, 
    description: "Quick reset",
    benefits: "Reduces heart rate, quick stress relief",
    calories: "~3 cal"
  },
  { 
    label: "5 min", 
    seconds: 300, 
    description: "Balanced session",
    benefits: "Lowers cortisol, improves focus & mood",
    calories: "~8 cal"
  },
  { 
    label: "10 min", 
    seconds: 600, 
    description: "Deep relaxation",
    benefits: "Deep nervous system reset, reduces anxiety significantly",
    calories: "~15 cal"
  },
];

const BreathingExercise = ({ pattern }: BreathingExerciseProps) => {
  const { incrementCalmMoment } = useActivityTracker();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfter">("inhale");
  const [countdown, setCountdown] = useState(pattern.inhale);
  const [cycles, setCycles] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const hasTrackedRef = useRef(false);

  // Reset when pattern changes
  useEffect(() => {
    setSelectedDuration(null);
    setIsActive(false);
    setPhase("inhale");
    setCountdown(pattern.inhale);
    setCycles(0);
    setTotalElapsed(0);
    hasTrackedRef.current = false;
  }, [pattern.name]);

  useEffect(() => {
    if (!isActive || selectedDuration === null) return;

    const timer = setInterval(() => {
      setTotalElapsed(prev => {
        const next = prev + 1;
        if (next >= durationOptions[selectedDuration].seconds) {
          setIsActive(false);
          if (!hasTrackedRef.current) {
            hasTrackedRef.current = true;
            incrementCalmMoment();
          }
        }
        return next;
      });

      setCountdown((prev) => {
        if (prev <= 1) {
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
  }, [isActive, phase, pattern, selectedDuration]);

  const reset = () => {
    setIsActive(false);
    setPhase("inhale");
    setCountdown(pattern.inhale);
    setCycles(0);
    setTotalElapsed(0);
    hasTrackedRef.current = false;
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "holdAfter": return "Hold";
    }
  };

  const getCircleScale = () => {
    if (phase === "inhale") return "scale-110";
    if (phase === "exhale") return "scale-90";
    return "scale-100";
  };

  const isSessionComplete = selectedDuration !== null && totalElapsed >= durationOptions[selectedDuration].seconds;

  // Selection screen
  if (selectedDuration === null) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="text-center mb-2">
          <h3 className="font-display text-xl font-bold text-foreground mb-1">{pattern.name}</h3>
          <p className="text-sm text-muted-foreground">
            {pattern.inhale}s in · {pattern.hold}s hold · {pattern.exhale}s out
            {pattern.holdAfter ? ` · ${pattern.holdAfter}s hold` : ""}
          </p>
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">Choose your session length</p>
        <div className="space-y-3">
          {durationOptions.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setSelectedDuration(i)}
              className="w-full text-left bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/40 rounded-2xl p-4 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{opt.label}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{opt.description}</span>
              </div>
              <div className="flex items-start gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-primary/70" /> {opt.benefits}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary/70 mt-1">
                <Flame className="w-3 h-3" /> {opt.calories}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Completion screen
  if (isSessionComplete) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <span className="text-5xl mb-4 block">🌬️</span>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Session Complete!</h2>
        <p className="text-muted-foreground mb-1">{cycles} cycles of {pattern.name}</p>
        <p className="text-sm text-primary font-medium mb-6">{durationOptions[selectedDuration].calories} burned</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Button onClick={() => { reset(); setSelectedDuration(null); }} className="rounded-xl">
            Change Duration
          </Button>
        </div>
      </div>
    );
  }

  const timeRemaining = durationOptions[selectedDuration].seconds - totalElapsed;
  const progressPct = (totalElapsed / durationOptions[selectedDuration].seconds) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Duration progress bar */}
      <div className="w-full mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{durationOptions[selectedDuration].label} session</span>
          <span>{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, "0")} left</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Breathing circle */}
      <div className="relative w-48 h-48 mb-8">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-calm-blue/20 transition-transform duration-1000 ${isActive ? getCircleScale() : ""}`} />
        <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-primary to-calm-blue shadow-glow transition-transform duration-1000 flex items-center justify-center ${isActive ? getCircleScale() : ""}`}>
          <div className="text-center text-primary-foreground">
            <p className="text-4xl font-bold mb-1">{countdown}</p>
            <p className="text-sm font-medium opacity-90">{getPhaseLabel()}</p>
          </div>
        </div>
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ripple" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ripple stagger-2" />
          </>
        )}
      </div>

      <div className="text-center mb-6">
        {cycles > 0 && (
          <p className="text-sm text-primary font-medium">
            {cycles} cycle{cycles !== 1 ? "s" : ""} completed
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="calm" size="lg" onClick={() => setIsActive(!isActive)} className="gap-2">
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => { reset(); setSelectedDuration(null); }}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingExercise;
