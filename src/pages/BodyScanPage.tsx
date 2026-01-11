import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useActivityTracker } from "@/hooks/useActivityTracker";

const bodyParts = [
  { 
    name: "Top of Head", 
    duration: 15, 
    emoji: "👒",
    instructions: [
      "Bring your attention to the very top of your head",
      "Notice any sensations—tingling, warmth, or tension",
      "Imagine a warm, gentle light resting on your crown"
    ],
    sensations: ["tingling", "warmth", "pressure", "lightness", "pulsing"]
  },
  { 
    name: "Forehead & Eyes", 
    duration: 15, 
    emoji: "👁️",
    instructions: [
      "Relax your forehead and smooth out any furrowing",
      "Soften the muscles around your eyes",
      "Let your eyelids feel heavy and relaxed"
    ],
    sensations: ["heaviness", "smoothness", "warmth", "relaxation", "softening"]
  },
  { 
    name: "Jaw & Mouth", 
    duration: 15, 
    emoji: "👄",
    instructions: [
      "Unclench your jaw and let it hang slightly open",
      "Let your tongue rest gently on the roof of your mouth",
      "Slightly part your lips and relax your cheeks"
    ],
    sensations: ["looseness", "release", "space", "softness", "ease"]
  },
  { 
    name: "Neck & Shoulders", 
    duration: 20, 
    emoji: "💪",
    instructions: [
      "Roll your shoulders back gently and let them drop",
      "Release any tightness in your neck",
      "Feel the weight of your head supported by your spine"
    ],
    sensations: ["release", "dropping", "heaviness", "warmth", "melting"]
  },
  { 
    name: "Arms & Hands", 
    duration: 15, 
    emoji: "🤲",
    instructions: [
      "Notice sensations flowing down your arms",
      "Feel your hands resting, fingers gently curled",
      "Let your arms feel heavy and supported"
    ],
    sensations: ["tingling", "warmth", "heaviness", "pulsing", "flowing"]
  },
  { 
    name: "Chest & Heart", 
    duration: 20, 
    emoji: "💖",
    instructions: [
      "Feel your chest rise and fall with each breath",
      "Notice your heartbeat, steady and calm",
      "Breathe into this space with gratitude"
    ],
    sensations: ["expansion", "rhythm", "warmth", "openness", "beating"]
  },
  { 
    name: "Stomach & Core", 
    duration: 15, 
    emoji: "🌊",
    instructions: [
      "Soften your belly completely",
      "Let go of any holding or tension",
      "Allow your breath to reach deep into your abdomen"
    ],
    sensations: ["softening", "movement", "warmth", "gurgling", "expansion"]
  },
  { 
    name: "Lower Back & Hips", 
    duration: 20, 
    emoji: "🪑",
    instructions: [
      "Release tension in your lower back",
      "Let your hips feel grounded and supported",
      "Feel the connection to the surface beneath you"
    ],
    sensations: ["grounding", "support", "release", "heaviness", "stability"]
  },
  { 
    name: "Legs & Thighs", 
    duration: 15, 
    emoji: "🦵",
    instructions: [
      "Notice sensations in your thighs",
      "Feel them heavy against the surface",
      "Let any tension flow downward and out"
    ],
    sensations: ["heaviness", "warmth", "relaxation", "weight", "stillness"]
  },
  { 
    name: "Feet & Toes", 
    duration: 15, 
    emoji: "🦶",
    instructions: [
      "Bring awareness to your feet",
      "Feel each toe individually",
      "Notice the ground beneath you, solid and supporting"
    ],
    sensations: ["grounding", "tingling", "warmth", "contact", "connection"]
  },
];

const BodyScanPage = () => {
  const navigate = useNavigate();
  const { incrementCalmMoment } = useActivityTracker();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPart, setCurrentPart] = useState(0);
  const [timeLeft, setTimeLeft] = useState(bodyParts[0].duration);
  const [isComplete, setIsComplete] = useState(false);
  const hasTrackedRef = useRef(false);

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
  }, [isPlaying, currentPart, isComplete]);

  const reset = () => {
    setCurrentPart(0);
    setTimeLeft(bodyParts[0].duration);
    setIsPlaying(false);
    setIsComplete(false);
    hasTrackedRef.current = false;
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
                  <span className="text-4xl">{bodyParts[currentPart].emoji}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">{bodyParts[currentPart].name}</h2>
                <p className="text-3xl font-bold text-primary mt-2">{timeLeft}s</p>
              </div>

              {/* Instructions */}
              <div className="space-y-2 mb-4">
                {bodyParts[currentPart].instructions.map((instruction, index) => (
                  <p key={index} className="text-center text-muted-foreground leading-relaxed">
                    • {instruction}
                  </p>
                ))}
              </div>

              {/* Sensations to notice */}
              <div className="bg-calm-mint-light/50 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-foreground mb-2">✨ Sensations to notice:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {bodyParts[currentPart].sensations.map((sensation, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-card rounded-full text-xs text-muted-foreground border border-border"
                    >
                      {sensation}
                    </span>
                  ))}
                </div>
              </div>

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
