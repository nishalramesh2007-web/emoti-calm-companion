import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface YogaPose {
  name: string;
  duration: string;
  emoji: string;
  description: string;
  instructions: string[];
  benefits: string;
}

interface YogaExerciseProps {
  pose: YogaPose;
}

const YogaExercise = ({ pose }: YogaExerciseProps) => {
  const { incrementCalmMoment } = useActivityTracker();
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasTrackedRef = useRef(false);

  // Parse duration to get seconds per step (e.g., "1-3 min" -> use middle value)
  const getDurationSeconds = () => {
    const match = pose.duration.match(/(\d+)-?(\d+)?/);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min;
      const avgMinutes = (min + max) / 2;
      return Math.floor((avgMinutes * 60) / pose.instructions.length);
    }
    return 20;
  };

  useEffect(() => {
    // Reset when pose changes
    setIsPracticing(false);
    setCurrentStep(0);
    setTimeLeft(getDurationSeconds());
    setIsPlaying(false);
    setIsComplete(false);
  }, [pose]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentStep < pose.instructions.length - 1) {
              setCurrentStep((s) => s + 1);
              return getDurationSeconds();
            } else {
              setIsComplete(true);
              setIsPlaying(false);
              // Track calm moment on completion
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
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, isComplete, pose.instructions.length]);

  const startPractice = () => {
    setIsPracticing(true);
    setCurrentStep(0);
    setTimeLeft(getDurationSeconds());
    setIsPlaying(true);
    setIsComplete(false);
  };

  const reset = () => {
    setIsPracticing(false);
    setCurrentStep(0);
    setTimeLeft(getDurationSeconds());
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < pose.instructions.length) {
      setCurrentStep(step);
      setTimeLeft(getDurationSeconds());
    }
  };

  const progress = ((currentStep + 1) / pose.instructions.length) * 100;

  if (!isPracticing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-calm-mint-light flex items-center justify-center text-3xl">
            {pose.emoji}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">{pose.name}</h3>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {pose.duration}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground">{pose.description}</p>

        <Button onClick={startPractice} className="w-full rounded-xl" size="lg">
          <Play className="w-5 h-5 mr-2" />
          Start Guided Practice
        </Button>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">📋</span> Preview Steps
          </h4>
          <ol className="space-y-2">
            {pose.instructions.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-calm-lavender-light/50 rounded-xl p-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-primary">✨</span> Benefits
          </h4>
          <p className="text-sm text-muted-foreground">{pose.benefits}</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-calm-mint-light flex items-center justify-center mb-4">
          <span className="text-5xl">{pose.emoji}</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Pose Complete!</h2>
        <p className="text-muted-foreground mb-6">
          Well done! You've completed {pose.name}. Take a moment to notice how your body feels.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
          <Button onClick={() => setIsPracticing(false)} className="rounded-xl">
            View Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Step {currentStep + 1} of {pose.instructions.length}</span>
          <span className="text-primary font-medium">{pose.name}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main visualization */}
      <div className="text-center">
        <div className={cn(
          "w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-calm-mint-light to-calm-lavender-light flex items-center justify-center mb-4 transition-transform",
          isPlaying && "animate-pulse scale-105"
        )}>
          <span className="text-5xl">{pose.emoji}</span>
        </div>
        
        <div className="text-4xl font-bold text-primary mb-2">{timeLeft}s</div>
        <p className="text-sm text-muted-foreground">Time remaining for this step</p>
      </div>

      {/* Current instruction */}
      <div className="bg-gradient-to-br from-calm-lavender-light/50 to-calm-mint-light/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {currentStep + 1}
          </span>
          <h4 className="font-semibold text-foreground">Current Step</h4>
        </div>
        <p className="text-foreground leading-relaxed">{pose.instructions[currentStep]}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => goToStep(currentStep - 1)}
          disabled={currentStep === 0}
          variant="outline"
          size="icon"
          className="rounded-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          size="lg"
          className="rounded-xl px-8"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          )}
        </Button>

        <Button
          onClick={() => goToStep(currentStep + 1)}
          disabled={currentStep === pose.instructions.length - 1}
          variant="outline"
          size="icon"
          className="rounded-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <Button onClick={reset} variant="ghost" className="w-full text-muted-foreground">
        <RotateCcw className="w-4 h-4 mr-2" />
        Exit Practice
      </Button>

      {/* Step indicators */}
      <div className="flex justify-center gap-2">
        {pose.instructions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentStep
                ? "bg-primary w-6"
                : index < currentStep
                ? "bg-primary/50"
                : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default YogaExercise;
