import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight, Heart, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

// Extended phrases pool for each recipient type
const phrasePools = {
  self: [
    "May I be happy and content",
    "May I be healthy and strong",
    "May I be safe and protected",
    "May I live with ease and joy",
    "May I be free from suffering",
    "May I be filled with peace",
    "May I accept myself as I am",
    "May I be patient with myself",
    "May I find inner strength",
    "May I be surrounded by love",
    "May I embrace my journey",
    "May I find comfort in stillness",
  ],
  others: [
    "May you be happy and at peace",
    "May you be healthy in body and mind",
    "May you be safe from harm",
    "May you live with ease and grace",
    "May you be free from worry",
    "May you be filled with joy",
    "May you find what you seek",
    "May you be loved and appreciated",
    "May you know your own worth",
    "May you experience kindness",
    "May you find comfort and rest",
    "May you be surrounded by warmth",
  ],
  all: [
    "May all beings be happy",
    "May all beings be healthy",
    "May all beings be safe",
    "May all beings live with ease",
    "May all beings be free from suffering",
    "May all beings find peace",
    "May all beings know love",
    "May all beings be at rest",
    "May all beings be protected",
    "May all beings find joy",
    "May all beings experience kindness",
    "May all beings feel connected",
  ],
};

const recipientTemplates = [
  {
    name: "Yourself",
    emoji: "🪞",
    color: "bg-calm-lavender-light",
    intro: "Begin by sending love and kindness to yourself.",
    pool: "self" as const,
  },
  {
    name: "A Loved One",
    emoji: "💕",
    color: "bg-calm-peach-light",
    intro: "Think of someone you love deeply. Picture them clearly.",
    pool: "others" as const,
  },
  {
    name: "A Neutral Person",
    emoji: "🧑",
    color: "bg-calm-blue-light",
    intro: "Think of someone you neither like nor dislike—perhaps a neighbor or stranger.",
    pool: "others" as const,
  },
  {
    name: "A Difficult Person",
    emoji: "🌱",
    color: "bg-calm-mint-light",
    intro: "Think of someone you find challenging. This takes courage—go gently.",
    pool: "others" as const,
  },
  {
    name: "All Beings",
    emoji: "🌍",
    color: "bg-calm-cream",
    intro: "Expand your loving-kindness to all beings everywhere.",
    pool: "all" as const,
  },
];

// Function to get random unique phrases
const getRandomPhrases = (pool: string[], count: number, usedPhrases: Set<string>): string[] => {
  const available = pool.filter(p => !usedPhrases.has(p));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const LovingKindnessPage = () => {
  const navigate = useNavigate();
  const [currentRecipient, setCurrentRecipient] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [usedPhrases, setUsedPhrases] = useState<Set<string>>(new Set());
  const [recipients, setRecipients] = useState<Array<typeof recipientTemplates[0] & { phrases: string[] }>>([]);

  // Initialize with random phrases on mount
  useEffect(() => {
    const used = new Set<string>();
    const initializedRecipients = recipientTemplates.map(template => {
      const pool = phrasePools[template.pool];
      const phrases = getRandomPhrases(pool, 4, used);
      phrases.forEach(p => used.add(p));
      return { ...template, phrases };
    });
    setRecipients(initializedRecipients);
    setUsedPhrases(used);
  }, []);

  const handleNext = () => {
    if (recipients.length === 0) return;
    
    if (currentPhrase < recipients[currentRecipient].phrases.length - 1) {
      setCurrentPhrase(currentPhrase + 1);
    } else if (currentRecipient < recipients.length - 1) {
      setCurrentRecipient(currentRecipient + 1);
      setCurrentPhrase(0);
    } else {
      setIsComplete(true);
    }
  };

  const reset = () => {
    // Generate new random phrases for next session
    const used = new Set<string>();
    const newRecipients = recipientTemplates.map(template => {
      const pool = phrasePools[template.pool];
      const phrases = getRandomPhrases(pool, 4, used);
      phrases.forEach(p => used.add(p));
      return { ...template, phrases };
    });
    setRecipients(newRecipients);
    setUsedPhrases(used);
    setCurrentRecipient(0);
    setCurrentPhrase(0);
    setIsComplete(false);
  };

  if (recipients.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const totalPhrases = recipients.reduce((acc, r) => acc + r.phrases.length, 0);
  const completedPhrases = recipients.slice(0, currentRecipient).reduce((acc, r) => acc + r.phrases.length, 0) + currentPhrase;
  const progress = ((completedPhrases + 1) / totalPhrases) * 100;

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
            <h1 className="font-display text-xl font-bold text-foreground">Loving Kindness</h1>
            <p className="text-sm text-muted-foreground">Send compassion to yourself and others</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Recipient indicators */}
        <div className="flex justify-center gap-2">
          {recipients.map((recipient, index) => (
            <div
              key={recipient.name}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                index === currentRecipient
                  ? `${recipient.color} scale-110 shadow-card`
                  : index < currentRecipient
                  ? "bg-calm-mint-light"
                  : "bg-muted opacity-50"
              }`}
            >
              {index < currentRecipient ? "💚" : recipient.emoji}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{recipients[currentRecipient].name}</span>
            <span>Step {currentRecipient + 1} of {recipients.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-calm-peach-light animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-primary" fill="currentColor" />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Practice Complete</h2>
              <p className="text-muted-foreground mb-6">
                You've shared loving-kindness with yourself and the world. Carry this warmth with you.
              </p>
              <Button onClick={reset} className="rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in text-center">
              <div className={`w-20 h-20 mx-auto rounded-full ${recipients[currentRecipient].color} flex items-center justify-center mb-4`}>
                <span className="text-4xl">{recipients[currentRecipient].emoji}</span>
              </div>

              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                {recipients[currentRecipient].name}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {recipients[currentRecipient].intro}
              </p>

              {/* Phrase display */}
              <div className="bg-gradient-to-br from-calm-lavender-light to-calm-mint-light rounded-2xl p-6 mb-6">
                <p className="font-display text-2xl font-semibold text-foreground leading-relaxed">
                  "{recipients[currentRecipient].phrases[currentPhrase]}"
                </p>
              </div>

              {/* Phrase indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {recipients[currentRecipient].phrases.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPhrase
                        ? "bg-primary w-6"
                        : index < currentPhrase
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Take a deep breath and feel the meaning of these words
              </p>

              <Button onClick={handleNext} className="rounded-xl px-8" size="lg">
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        {!isComplete && (
          <div className="bg-calm-lavender-light/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">💝 About this practice:</span> Loving-kindness meditation 
              cultivates feelings of warmth and goodwill toward yourself and others, reducing stress and increasing compassion.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default LovingKindnessPage;
