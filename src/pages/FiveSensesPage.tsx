import { useState } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";

const senses = [
  { 
    name: "See", 
    emoji: "👁️", 
    count: 5, 
    color: "bg-calm-blue-light",
    instruction: "Look around you. Name 5 things you can see right now.",
    examples: "A plant, the sky, a picture frame, your hands, a cup..."
  },
  { 
    name: "Touch", 
    emoji: "✋", 
    count: 4, 
    color: "bg-calm-peach-light",
    instruction: "Notice 4 things you can physically feel.",
    examples: "Your feet on the floor, clothes on your skin, the chair beneath you..."
  },
  { 
    name: "Hear", 
    emoji: "👂", 
    count: 3, 
    color: "bg-calm-lavender-light",
    instruction: "Listen carefully. What 3 sounds can you hear?",
    examples: "Birds chirping, distant traffic, your own breathing..."
  },
  { 
    name: "Smell", 
    emoji: "👃", 
    count: 2, 
    color: "bg-calm-mint-light",
    instruction: "Notice 2 things you can smell right now.",
    examples: "Fresh air, coffee, your soap, food nearby..."
  },
  { 
    name: "Taste", 
    emoji: "👅", 
    count: 1, 
    color: "bg-calm-cream",
    instruction: "What 1 thing can you taste in this moment?",
    examples: "The taste of your last drink, toothpaste, or simply your own mouth..."
  },
];

const FiveSensesPage = () => {
  const navigate = useNavigate();
  const [currentSense, setCurrentSense] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(5).fill(""));
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentSense < senses.length - 1) {
      setCurrentSense(currentSense + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentSense] = value;
    setResponses(newResponses);
  };

  const reset = () => {
    setCurrentSense(0);
    setResponses(Array(5).fill(""));
    setIsComplete(false);
  };

  const progress = ((currentSense + 1) / senses.length) * 100;

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
            <h1 className="font-display text-xl font-bold text-foreground">5 Senses Check</h1>
            <p className="text-sm text-muted-foreground">Ground yourself in the present moment</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Sense indicators */}
        <div className="flex justify-center gap-2">
          {senses.map((sense, index) => (
            <div
              key={sense.name}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                index === currentSense
                  ? `${sense.color} scale-110 shadow-card`
                  : index < currentSense
                  ? "bg-calm-mint-light"
                  : "bg-muted opacity-50"
              }`}
            >
              {index < currentSense ? "✓" : sense.emoji}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main content */}
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <span className="text-5xl mb-4 block">🌟</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're Grounded</h2>
              <p className="text-muted-foreground mb-6">
                You've reconnected with all five senses. Notice how present you feel right now.
              </p>
              
              {/* Summary */}
              <div className="text-left bg-muted/50 rounded-xl p-4 mb-6 space-y-3">
                {senses.map((sense, index) => (
                  responses[index] && (
                    <div key={sense.name} className="text-sm">
                      <span className="font-medium text-foreground">{sense.emoji} {sense.name}:</span>
                      <span className="text-muted-foreground ml-2">{responses[index]}</span>
                    </div>
                  )
                ))}
              </div>

              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Again
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className={`w-20 h-20 mx-auto rounded-full ${senses[currentSense].color} flex items-center justify-center mb-4`}>
                <span className="text-4xl">{senses[currentSense].emoji}</span>
              </div>

              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  {senses[currentSense].count} Thing{senses[currentSense].count > 1 ? "s" : ""} You Can {senses[currentSense].name}
                </h2>
                <p className="text-muted-foreground">{senses[currentSense].instruction}</p>
              </div>

              <Textarea
                value={responses[currentSense]}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder={senses[currentSense].examples}
                className="bg-muted/50 border-0 rounded-xl min-h-[100px] resize-none mb-4"
              />

              <Button onClick={handleNext} className="w-full rounded-xl" size="lg">
                {currentSense < senses.length - 1 ? (
                  <>
                    Next Sense
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  "Complete Exercise"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Tips */}
        {!isComplete && (
          <div className="bg-calm-lavender-light/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">💡 Tip:</span> Take your time with each sense. 
              This exercise helps bring you back to the present moment when feeling anxious.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FiveSensesPage;
