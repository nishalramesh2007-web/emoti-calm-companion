import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";

const meditationTypes = [
  {
    name: "Calm Mind",
    emoji: "🧘",
    description: "Quiets mental chatter and brings inner peace",
    steps: [
      "Find a comfortable seated position. Close your eyes gently.",
      "Take three deep breaths. In through your nose, out through your mouth.",
      "Let your breathing return to its natural rhythm. Simply observe it.",
      "Notice the air entering your nostrils. Feel its temperature.",
      "If thoughts arise, acknowledge them gently and return to your breath.",
      "Scan your body from head to toe. Release any tension you find.",
      "Return your focus to your breath. Feel your chest rise and fall.",
      "Begin to deepen your breath. Slowly bring awareness back.",
      "Gently open your eyes. Carry this calm with you.",
    ],
  },
  {
    name: "Focus & Clarity",
    emoji: "🎯",
    description: "Sharpens attention and clears mental fog",
    steps: [
      "Sit tall with your spine straight. Rest your hands on your knees.",
      "Close your eyes. Take a deep breath and set an intention for clarity.",
      "Count your breaths from 1 to 10. Start over if you lose count.",
      "Visualize a clear, still lake. Your mind is becoming that still.",
      "Focus on one thing you want to accomplish. See it clearly.",
      "Release the visualization. Return to counting breaths.",
      "Feel the clarity settling in your mind like dust settling in water.",
      "Take three final deep breaths. Open your eyes with focus.",
    ],
  },
  {
    name: "Sleep Prep",
    emoji: "🌙",
    description: "Guides your mind and body toward restful sleep",
    steps: [
      "Lie down comfortably. Let your body sink into the surface beneath you.",
      "Close your eyes. Take a slow, deep breath in... and release.",
      "Relax your face muscles. Unclench your jaw. Soften your eyes.",
      "Let your shoulders drop away from your ears. Release your arms.",
      "Feel heaviness spreading through your body, like warm honey.",
      "Imagine you're floating on a calm, warm ocean under the stars.",
      "Each breath takes you deeper into relaxation.",
      "Let go of today. Tomorrow can wait. Right now, just rest.",
    ],
  },
];

const durationOptions = [
  { label: "5 min", seconds: 300, benefits: "Quick mental reset, reduces stress hormones", calories: "~8 cal" },
  { label: "10 min", seconds: 600, benefits: "Improved focus, emotional regulation, lower anxiety", calories: "~15 cal" },
  { label: "15 min", seconds: 900, benefits: "Deep relaxation, enhanced self-awareness, better sleep", calories: "~22 cal" },
  { label: "20 min", seconds: 1200, benefits: "Maximum neuroplasticity benefits, profound calm", calories: "~30 cal" },
];

const MeditationPage = () => {
  const navigate = useNavigate();
  const { incrementCalmMoment } = useActivityTracker();
  const [selectedType, setSelectedType] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasTrackedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const meditation = meditationTypes[selectedType];

  // Compute step durations based on selected total duration
  const getStepDuration = () => {
    if (selectedDuration === null) return 30;
    return Math.floor(durationOptions[selectedDuration].seconds / meditation.steps.length);
  };

  useEffect(() => {
    setSelectedDuration(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
  }, [selectedType]);

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentStep < meditation.steps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            return getStepDuration();
          } else {
            setIsPlaying(false);
            setIsComplete(true);
            if (!hasTrackedRef.current) {
              hasTrackedRef.current = true;
              incrementCalmMoment();
            }
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentStep, meditation, selectedDuration]);

  const startSession = () => {
    setCurrentStep(0);
    setTimeLeft(getStepDuration());
    setIsPlaying(true);
    setIsComplete(false);
    hasTrackedRef.current = false;
  };

  const reset = () => {
    setCurrentStep(0);
    setTimeLeft(getStepDuration());
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
  };

  const totalDuration = selectedDuration !== null ? durationOptions[selectedDuration].seconds : meditation.steps.length * 30;
  const stepDur = getStepDuration();
  const elapsed = currentStep * stepDur + (stepDur - timeLeft);
  const progress = (elapsed / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/relax")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Guided Meditation</h1>
            <p className="text-sm text-muted-foreground">Find stillness within</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Type selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {meditationTypes.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setSelectedType(i)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedType === i
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border hover:border-primary/30"
              )}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {/* Duration selection screen */}
          {selectedDuration === null ? (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <span className="text-4xl mb-2 block">{meditation.emoji}</span>
                <h3 className="font-display text-xl font-bold text-foreground">{meditation.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{meditation.description}</p>
              </div>

              <p className="text-sm font-medium text-muted-foreground text-center">Choose session duration</p>

              <div className="grid grid-cols-2 gap-3">
                {durationOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedDuration(i)}
                    className="text-left bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/40 rounded-2xl p-4 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground text-lg">{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 leading-relaxed">{opt.benefits}</p>
                    <p className="text-xs text-primary/70 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {opt.calories}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">✨</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Session Complete</h2>
              <p className="text-muted-foreground mb-1">You've completed {meditation.name}. Well done.</p>
              <p className="text-sm text-primary font-medium mb-6">{durationOptions[selectedDuration].calories} burned</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={reset} variant="outline" className="rounded-xl">
                  <RotateCcw className="w-4 h-4 mr-2" /> Start Again
                </Button>
                <Button onClick={() => { reset(); setSelectedDuration(null); }} className="rounded-xl">
                  Change Duration
                </Button>
              </div>
            </div>
          ) : !isPlaying && currentStep === 0 && timeLeft === 0 ? (
            // Pre-start screen
            <div className="text-center space-y-4 animate-fade-in">
              <span className="text-4xl block">{meditation.emoji}</span>
              <h3 className="font-display text-xl font-bold text-foreground">{meditation.name}</h3>
              <div className="flex justify-center gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{durationOptions[selectedDuration].label}</span>
                <span className="text-xs font-medium bg-muted px-3 py-1 rounded-full">{meditation.steps.length} steps</span>
              </div>
              <p className="text-sm text-muted-foreground">{meditation.description}</p>
              <Button onClick={startSession} size="lg" className="rounded-xl w-full">
                <Play className="w-5 h-5 mr-2" /> Begin Session
              </Button>
              <Button onClick={() => setSelectedDuration(null)} variant="ghost" className="w-full text-muted-foreground text-sm">
                Change duration
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="fill-none stroke-muted" strokeWidth="4" />
                  <circle cx="50" cy="50" r="45" className="fill-none stroke-primary transition-all duration-1000" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">{meditation.emoji}</span>
                </div>
              </div>

              <p className="text-foreground text-lg font-medium leading-relaxed animate-fade-in" key={currentStep}>
                {meditation.steps[currentStep]}
              </p>

              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {meditation.steps.length} · {timeLeft}s left
              </p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setIsPlaying(!isPlaying)} size="lg" className="rounded-xl w-32">
                  {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> {currentStep > 0 || timeLeft < getStepDuration() ? "Resume" : "Start"}</>}
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

export default MeditationPage;
