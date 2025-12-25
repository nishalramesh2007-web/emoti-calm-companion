import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Activity, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreathingExercise from "@/components/BreathingExercise";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";

const breathingPatterns = [
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
  { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8 },
  { name: "Calm Breath", inhale: 4, hold: 2, exhale: 6 },
];

const yogaPoses = [
  { name: "Child's Pose", duration: "1-3 min", emoji: "🧒", description: "Gentle stretch for back and hips" },
  { name: "Cat-Cow Stretch", duration: "1-2 min", emoji: "🐱", description: "Spinal flexibility and stress relief" },
  { name: "Legs Up Wall", duration: "5-10 min", emoji: "🦵", description: "Deep relaxation and circulation" },
  { name: "Seated Forward Fold", duration: "1-3 min", emoji: "🙇", description: "Calms the mind, stretches spine" },
];

const mindfulActivities = [
  { name: "Gratitude Journal", icon: "📝", description: "Write 3 things you're grateful for" },
  { name: "Body Scan", icon: "🧘", description: "Notice sensations from head to toe" },
  { name: "5 Senses Check", icon: "👁️", description: "Name 5 things you can see, 4 you can touch..." },
  { name: "Loving Kindness", icon: "💝", description: "Send kind wishes to yourself and others" },
];

const affirmations = [
  "I am worthy of peace and calm",
  "I release what I cannot control",
  "This moment is enough",
  "I am safe and supported",
  "I breathe in calm, I breathe out tension",
  "I am doing my best, and that is enough",
];

const RelaxPage = () => {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const handleActivityClick = (activityName: string) => {
    if (activityName === "Gratitude Journal") {
      navigate("/gratitude-journal");
    }
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-6 py-4 z-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Relaxation</h1>
        <p className="text-sm text-muted-foreground">Find your calm with these activities</p>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="w-full bg-muted/50 p-1 rounded-2xl mb-6">
            <TabsTrigger value="breathing" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <Wind className="w-4 h-4" />
              Breathe
            </TabsTrigger>
            <TabsTrigger value="yoga" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <Activity className="w-4 h-4" />
              Yoga
            </TabsTrigger>
            <TabsTrigger value="mindful" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft">
              <Sparkles className="w-4 h-4" />
              Mind
            </TabsTrigger>
          </TabsList>

          {/* Breathing Tab */}
          <TabsContent value="breathing" className="space-y-6 animate-fade-in">
            {/* Pattern selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {breathingPatterns.map((pattern, index) => (
                <button
                  key={pattern.name}
                  onClick={() => setSelectedPattern(index)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    selectedPattern === index
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-card border border-border hover:border-primary/30"
                  )}
                >
                  {pattern.name}
                </button>
              ))}
            </div>

            {/* Breathing exercise */}
            <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
              <BreathingExercise pattern={breathingPatterns[selectedPattern]} />
            </div>
          </TabsContent>

          {/* Yoga Tab */}
          <TabsContent value="yoga" className="space-y-4 animate-fade-in">
            {yogaPoses.map((pose, index) => (
              <div
                key={pose.name}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-calm-mint-light flex items-center justify-center text-2xl">
                  {pose.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{pose.name}</h3>
                  <p className="text-sm text-muted-foreground">{pose.description}</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {pose.duration}
                </span>
              </div>
            ))}
          </TabsContent>

          {/* Mindfulness Tab */}
          <TabsContent value="mindful" className="space-y-6 animate-fade-in">
            {/* Affirmation card */}
            <div
              onClick={nextAffirmation}
              className="bg-gradient-to-br from-calm-lavender-light to-calm-mint-light rounded-3xl p-6 border border-primary/20 cursor-pointer hover:shadow-card transition-all"
            >
              <p className="text-xs font-medium text-primary mb-2">✨ Daily Affirmation</p>
              <p className="font-display text-xl font-semibold text-foreground leading-relaxed">
                "{affirmations[currentAffirmation]}"
              </p>
              <p className="text-xs text-muted-foreground mt-4">Tap for another</p>
            </div>

            {/* Activities */}
            <div className="grid grid-cols-2 gap-3">
              {mindfulActivities.map((activity, index) => (
                <div
                  key={activity.name}
                  onClick={() => handleActivityClick(activity.name)}
                  className="bg-card rounded-2xl p-4 shadow-soft border border-border hover:shadow-card transition-all cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-2xl mb-2 block">{activity.icon}</span>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{activity.name}</h3>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default RelaxPage;
