import { useState, useRef } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useActivityTracker } from "@/hooks/useActivityTracker";

const techniques = [
  {
    name: "5-4-3-2-1",
    emoji: "🖐️",
    description: "Engage all five senses to anchor yourself in the present.",
    steps: [
      { instruction: "Name 5 things you can SEE around you right now.", emoji: "👁️", hint: "Look around slowly. Notice colors, shapes, textures." },
      { instruction: "Name 4 things you can TOUCH or feel.", emoji: "✋", hint: "Feel your clothes, the chair, the air on your skin." },
      { instruction: "Name 3 things you can HEAR.", emoji: "👂", hint: "Listen carefully. Near sounds, far sounds, subtle sounds." },
      { instruction: "Name 2 things you can SMELL.", emoji: "👃", hint: "Breathe in deeply. Notice any scents in the air." },
      { instruction: "Name 1 thing you can TASTE.", emoji: "👅", hint: "Notice the taste in your mouth right now." },
    ],
  },
  {
    name: "RAIN Technique",
    emoji: "🌧️",
    description: "Recognize, Allow, Investigate, Nurture your emotions.",
    steps: [
      { instruction: "RECOGNIZE: What are you feeling right now? Name the emotion.", emoji: "🔍", hint: "Simply label it — anxiety, sadness, anger, overwhelm." },
      { instruction: "ALLOW: Let the feeling be there without trying to fix it.", emoji: "🤲", hint: "Say to yourself: 'It's okay to feel this way.'" },
      { instruction: "INVESTIGATE: Where do you feel this in your body?", emoji: "🫀", hint: "Notice tension, tightness, heat, or heaviness." },
      { instruction: "NURTURE: Place your hand on your heart. What do you need?", emoji: "💕", hint: "Offer yourself the same kindness you'd give a friend." },
    ],
  },
  {
    name: "Square Breathing",
    emoji: "⬜",
    description: "A simple breathing pattern to reset your nervous system.",
    steps: [
      { instruction: "Breathe IN slowly for 4 counts.", emoji: "🫁", hint: "1... 2... 3... 4... Fill your lungs completely." },
      { instruction: "HOLD your breath for 4 counts.", emoji: "⏸️", hint: "1... 2... 3... 4... Stay still and calm." },
      { instruction: "Breathe OUT slowly for 4 counts.", emoji: "💨", hint: "1... 2... 3... 4... Release all the air." },
      { instruction: "HOLD empty for 4 counts.", emoji: "🔇", hint: "1... 2... 3... 4... Rest in the stillness." },
      { instruction: "Repeat two more cycles on your own.", emoji: "🔄", hint: "Continue this square pattern. Feel your body settling." },
    ],
  },
];

const GroundingPage = () => {
  const navigate = useNavigate();
  const { incrementCalmMoment } = useActivityTracker();
  const [selectedTechnique, setSelectedTechnique] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const hasTrackedRef = useRef(false);

  const technique = techniques[selectedTechnique];

  const handleNext = () => {
    if (currentStep < technique.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      if (!hasTrackedRef.current) {
        hasTrackedRef.current = true;
        incrementCalmMoment();
      }
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsComplete(false);
    setIsStarted(false);
    hasTrackedRef.current = false;
  };

  const selectTechnique = (index: number) => {
    setSelectedTechnique(index);
    setCurrentStep(0);
    setIsComplete(false);
    setIsStarted(false);
    hasTrackedRef.current = false;
  };

  const progress = ((currentStep + 1) / technique.steps.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/relax")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Grounding Techniques</h1>
            <p className="text-sm text-muted-foreground">Anchor yourself in the present</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {techniques.map((t, i) => (
            <button
              key={t.name}
              onClick={() => selectTechnique(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedTechnique === i
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {!isStarted ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">{technique.emoji}</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">{technique.name}</h2>
              <p className="text-muted-foreground mb-6">{technique.description}</p>
              <Button onClick={() => setIsStarted(true)} size="lg" className="rounded-xl">
                Begin <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">🌟</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're Grounded</h2>
              <p className="text-muted-foreground mb-6">
                Take a moment to notice how you feel now compared to before. You have the power to find calm anytime.
              </p>
              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-4xl">{technique.steps[currentStep].emoji}</span>
              </div>

              <div className="text-center mb-6">
                <p className="text-xs font-semibold text-primary mb-2">
                  Step {currentStep + 1} of {technique.steps.length}
                </p>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {technique.steps[currentStep].instruction}
                </h3>
                <p className="text-sm text-muted-foreground">{technique.steps[currentStep].hint}</p>
              </div>

              <Button onClick={handleNext} className="w-full rounded-xl" size="lg">
                {currentStep < technique.steps.length - 1 ? (
                  <>Next Step <ChevronRight className="w-5 h-5 ml-2" /></>
                ) : (
                  "Complete"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default GroundingPage;
