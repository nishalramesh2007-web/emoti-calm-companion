import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useActivityTracker } from "@/hooks/useActivityTracker";

const muscleGroups = [
  { name: "Hands & Forearms", emoji: "✊", tense: "Clench your fists tightly. Squeeze as hard as you can.", release: "Let go. Feel your hands open and relax completely. Notice the warmth.", duration: 30 },
  { name: "Upper Arms", emoji: "💪", tense: "Flex your biceps. Bring your forearms up and tense.", release: "Release your arms. Let them fall to your sides, heavy and loose.", duration: 30 },
  { name: "Shoulders", emoji: "🤷", tense: "Raise your shoulders up toward your ears. Hold them tight.", release: "Drop your shoulders down. Feel the tension melt away.", duration: 30 },
  { name: "Face", emoji: "😤", tense: "Scrunch your entire face. Squeeze your eyes, clench your jaw.", release: "Relax your face completely. Smooth your forehead. Let your jaw hang.", duration: 30 },
  { name: "Chest & Stomach", emoji: "🫁", tense: "Take a deep breath and tighten your chest and stomach muscles.", release: "Exhale slowly. Let your torso soften. Feel your belly relax.", duration: 30 },
  { name: "Back", emoji: "🔙", tense: "Arch your back gently, pressing your shoulder blades together.", release: "Release and let your back settle into a natural, comfortable position.", duration: 30 },
  { name: "Legs", emoji: "🦵", tense: "Tighten your thigh muscles. Press your legs together firmly.", release: "Let go completely. Feel heaviness in your legs as they relax.", duration: 30 },
  { name: "Feet", emoji: "🦶", tense: "Curl your toes tightly. Tense the arches of your feet.", release: "Release your toes. Let your feet rest flat and relaxed.", duration: 30 },
];

const MuscleRelaxationPage = () => {
  const navigate = useNavigate();
  const { incrementCalmMoment } = useActivityTracker();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [phase, setPhase] = useState<"intro" | "tense" | "release" | "complete">("intro");
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasTrackedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase === "intro") {
            setPhase("tense");
            return 10; // tense for 10s
          } else if (phase === "tense") {
            setPhase("release");
            return 15; // release for 15s
          } else if (phase === "release") {
            if (currentGroup < muscleGroups.length - 1) {
              setCurrentGroup((g) => g + 1);
              setPhase("tense");
              return 10;
            } else {
              setPhase("complete");
              setIsPlaying(false);
              if (!hasTrackedRef.current) {
                hasTrackedRef.current = true;
                incrementCalmMoment();
              }
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, phase, currentGroup]);

  const start = () => {
    setPhase("intro");
    setTimeLeft(5);
    setIsPlaying(true);
  };

  const reset = () => {
    setCurrentGroup(0);
    setPhase("intro");
    setTimeLeft(5);
    setIsPlaying(false);
    hasTrackedRef.current = false;
  };

  const progress = ((currentGroup + (phase === "release" ? 0.7 : phase === "tense" ? 0.3 : 0)) / muscleGroups.length) * 100;

  const getInstruction = () => {
    if (phase === "intro") return "Get comfortable. Take a deep breath. We'll begin shortly.";
    if (phase === "tense") return muscleGroups[currentGroup].tense;
    if (phase === "release") return muscleGroups[currentGroup].release;
    return "";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/relax")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Muscle Relaxation</h1>
            <p className="text-sm text-muted-foreground">Progressive tense & release</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Muscle group indicators */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {muscleGroups.map((g, i) => (
            <div
              key={g.name}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
                i === currentGroup && phase !== "complete"
                  ? "bg-primary/20 scale-110 ring-2 ring-primary"
                  : i < currentGroup || phase === "complete"
                  ? "bg-primary/10 opacity-60"
                  : "bg-muted opacity-40"
              }`}
            >
              {i < currentGroup || phase === "complete" ? "✓" : g.emoji}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${phase === "complete" ? 100 : progress}%` }} />
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {phase === "complete" ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">😌</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Fully Relaxed</h2>
              <p className="text-muted-foreground mb-6">
                You've released tension from every muscle group. Notice how light and calm your body feels.
              </p>
              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" /> Start Again
              </Button>
            </div>
          ) : !isPlaying && phase === "intro" && timeLeft === 5 ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">💆</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Progressive Muscle Relaxation</h2>
              <p className="text-muted-foreground mb-6">
                This exercise guides you through tensing and releasing each muscle group, melting away stress.
              </p>
              <Button onClick={start} size="lg" className="rounded-xl">
                <Play className="w-5 h-5 mr-2" /> Begin Session
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">{phase === "intro" ? "🫁" : muscleGroups[currentGroup].emoji}</span>
              </div>

              {phase !== "intro" && (
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {phase === "tense" ? "⚡ Tense" : "🌊 Release"} — {muscleGroups[currentGroup].name}
                </p>
              )}

              <p className="text-foreground text-lg font-medium leading-relaxed" key={`${currentGroup}-${phase}`}>
                {getInstruction()}
              </p>

              <p className="text-2xl font-bold text-primary">{timeLeft}s</p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setIsPlaying(!isPlaying)} size="lg" className="rounded-xl w-32">
                  {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Resume</>}
                </Button>
                <Button onClick={reset} variant="outline" size="icon" className="rounded-xl">
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MuscleRelaxationPage;
