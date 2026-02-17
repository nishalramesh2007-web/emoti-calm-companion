import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useActivityTracker } from "@/hooks/useActivityTracker";

const meditations = [
  {
    name: "Calm Mind",
    duration: 300,
    emoji: "🧘",
    steps: [
      { text: "Find a comfortable seated position. Close your eyes gently.", duration: 30 },
      { text: "Take three deep breaths. In through your nose, out through your mouth.", duration: 30 },
      { text: "Let your breathing return to its natural rhythm. Simply observe it.", duration: 40 },
      { text: "Notice the air entering your nostrils. Feel its temperature.", duration: 40 },
      { text: "If thoughts arise, acknowledge them gently and return to your breath.", duration: 40 },
      { text: "Scan your body from head to toe. Release any tension you find.", duration: 40 },
      { text: "Return your focus to your breath. Feel your chest rise and fall.", duration: 40 },
      { text: "Begin to deepen your breath. Slowly bring awareness back.", duration: 20 },
      { text: "Gently open your eyes. Carry this calm with you.", duration: 20 },
    ],
  },
  {
    name: "Focus & Clarity",
    duration: 300,
    emoji: "🎯",
    steps: [
      { text: "Sit tall with your spine straight. Rest your hands on your knees.", duration: 30 },
      { text: "Close your eyes. Take a deep breath and set an intention for clarity.", duration: 30 },
      { text: "Count your breaths from 1 to 10. Start over if you lose count.", duration: 60 },
      { text: "Visualize a clear, still lake. Your mind is becoming that still.", duration: 40 },
      { text: "Focus on one thing you want to accomplish. See it clearly.", duration: 40 },
      { text: "Release the visualization. Return to counting breaths.", duration: 40 },
      { text: "Feel the clarity settling in your mind like dust settling in water.", duration: 30 },
      { text: "Take three final deep breaths. Open your eyes with focus.", duration: 30 },
    ],
  },
  {
    name: "Sleep Prep",
    duration: 300,
    emoji: "🌙",
    steps: [
      { text: "Lie down comfortably. Let your body sink into the surface beneath you.", duration: 30 },
      { text: "Close your eyes. Take a slow, deep breath in... and release.", duration: 30 },
      { text: "Relax your face muscles. Unclench your jaw. Soften your eyes.", duration: 40 },
      { text: "Let your shoulders drop away from your ears. Release your arms.", duration: 40 },
      { text: "Feel heaviness spreading through your body, like warm honey.", duration: 40 },
      { text: "Imagine you're floating on a calm, warm ocean under the stars.", duration: 40 },
      { text: "Each breath takes you deeper into relaxation.", duration: 40 },
      { text: "Let go of today. Tomorrow can wait. Right now, just rest.", duration: 40 },
    ],
  },
];

const MeditationPage = () => {
  const navigate = useNavigate();
  const { incrementCalmMoment } = useActivityTracker();
  const [selectedMeditation, setSelectedMeditation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const hasTrackedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const meditation = meditations[selectedMeditation];

  useEffect(() => {
    setTimeLeft(meditation.steps[0].duration);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
  }, [selectedMeditation]);

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
            return meditation.steps[nextStep].duration;
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
  }, [isPlaying, currentStep, meditation]);

  const reset = () => {
    setCurrentStep(0);
    setTimeLeft(meditation.steps[0].duration);
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
  };

  const totalDuration = meditation.steps.reduce((a, s) => a + s.duration, 0);
  const elapsed = meditation.steps.slice(0, currentStep).reduce((a, s) => a + s.duration, 0) + (meditation.steps[currentStep]?.duration || 0) - timeLeft;
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
        <div className="flex gap-2 overflow-x-auto pb-2">
          {meditations.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setSelectedMeditation(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedMeditation === i
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">✨</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Session Complete</h2>
              <p className="text-muted-foreground mb-6">You've completed {meditation.name}. Well done.</p>
              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" /> Start Again
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
                {meditation.steps[currentStep].text}
              </p>

              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {meditation.steps.length} · {timeLeft}s left
              </p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setIsPlaying(!isPlaying)} size="lg" className="rounded-xl w-32">
                  {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> {currentStep > 0 || timeLeft < meditation.steps[0].duration ? "Resume" : "Start"}</>}
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
