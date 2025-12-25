import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const bodyParts = [
  { name: "Top of Head", duration: 15, instruction: "Bring your attention to the very top of your head. Notice any sensations—tingling, warmth, or tension." },
  { name: "Forehead & Eyes", duration: 15, instruction: "Relax your forehead. Let go of any furrowing. Soften the muscles around your eyes." },
  { name: "Jaw & Mouth", duration: 15, instruction: "Unclench your jaw. Let your tongue rest gently. Slightly part your lips." },
  { name: "Neck & Shoulders", duration: 20, instruction: "Roll your shoulders back and let them drop. Release any tightness in your neck." },
  { name: "Arms & Hands", duration: 15, instruction: "Notice sensations in your arms down to your fingertips. Let them feel heavy and relaxed." },
  { name: "Chest & Heart", duration: 20, instruction: "Feel your chest rise and fall. Notice your heartbeat. Breathe into this space." },
  { name: "Stomach & Core", duration: 15, instruction: "Soften your belly. Let go of any holding. Allow your breath to reach deep." },
  { name: "Lower Back & Hips", duration: 20, instruction: "Release tension in your lower back. Let your hips feel grounded and supported." },
  { name: "Legs & Thighs", duration: 15, instruction: "Notice sensations in your thighs. Let them feel heavy against the surface beneath you." },
  { name: "Feet & Toes", duration: 15, instruction: "Bring awareness to your feet. Feel each toe. Notice the ground beneath you." },
];

const BodyScanPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const [timeLeft, setTimeLeft] = useState(bodyParts[0].duration);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentPart < bodyParts.length - 1) {
              setCurrentPart((p) => p + 1);
              return bodyParts[currentPart + 1].duration;
            } else {
              setIsComplete(true);
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentPart, isComplete]);

  const reset = () => {
    setCurrentPart(0);
    setTimeLeft(bodyParts[0].duration);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const progress = ((currentPart + 1) / bodyParts.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/relax")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Body Scan</h1>
            <p className="text-sm text-muted-foreground">Progressive relaxation from head to toe</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{currentPart + 1} of {bodyParts.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main visualization */}
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">🧘</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Body Scan Complete</h2>
              <p className="text-muted-foreground mb-6">You've brought awareness to your entire body. Notice how you feel now.</p>
              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Again
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className={`w-24 h-24 mx-auto rounded-full bg-calm-lavender-light flex items-center justify-center mb-4 ${isPlaying ? 'animate-pulse' : ''}`}>
                  <span className="text-4xl">🧘</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">{bodyParts[currentPart].name}</h2>
                <p className="text-3xl font-bold text-primary mt-2">{timeLeft}s</p>
              </div>

              <p className="text-center text-muted-foreground leading-relaxed mb-6">
                {bodyParts[currentPart].instruction}
              </p>

              <div className="flex justify-center gap-4">
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
                      {currentPart === 0 && timeLeft === bodyParts[0].duration ? "Start" : "Resume"}
                    </>
                  )}
                </Button>
                <Button onClick={reset} variant="outline" size="lg" className="rounded-xl">
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Body parts list */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">All Areas</h3>
          <div className="grid grid-cols-2 gap-2">
            {bodyParts.map((part, index) => (
              <div
                key={part.name}
                className={`p-3 rounded-xl text-sm transition-all ${
                  index === currentPart
                    ? "bg-primary text-primary-foreground"
                    : index < currentPart
                    ? "bg-calm-mint-light text-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentPart && "✓ "}{part.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BodyScanPage;
