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
  { 
    name: "Child's Pose", 
    duration: "1-3 min", 
    emoji: "🧒", 
    description: "Gentle stretch for back and hips",
    instructions: [
      "Kneel on the floor with toes together and knees hip-width apart",
      "Exhale and lower your torso between your thighs",
      "Extend your arms forward with palms facing down",
      "Rest your forehead on the mat and breathe deeply",
      "Hold for 1-3 minutes, focusing on releasing tension"
    ],
    benefits: "Relieves back pain, calms the mind, and gently stretches hips and thighs"
  },
  { 
    name: "Cat-Cow Stretch", 
    duration: "1-2 min", 
    emoji: "🐱", 
    description: "Spinal flexibility and stress relief",
    instructions: [
      "Start on all fours with wrists under shoulders and knees under hips",
      "Inhale: Drop your belly, lift your chest and tailbone (Cow)",
      "Exhale: Round your spine, tuck your chin and tailbone (Cat)",
      "Flow between poses with each breath",
      "Repeat 10-15 times, moving slowly and mindfully"
    ],
    benefits: "Improves spinal flexibility, relieves stress, and massages internal organs"
  },
  { 
    name: "Legs Up Wall", 
    duration: "5-10 min", 
    emoji: "🦵", 
    description: "Deep relaxation and circulation",
    instructions: [
      "Sit sideways against a wall, then swing your legs up as you lie back",
      "Scoot your hips as close to the wall as comfortable",
      "Rest your arms by your sides with palms facing up",
      "Close your eyes and breathe naturally",
      "Stay for 5-10 minutes, allowing complete relaxation"
    ],
    benefits: "Reduces anxiety, relieves tired legs, improves circulation, and calms the nervous system"
  },
  { 
    name: "Seated Forward Fold", 
    duration: "1-3 min", 
    emoji: "🙇", 
    description: "Calms the mind, stretches spine",
    instructions: [
      "Sit with legs extended straight in front of you",
      "Inhale and lengthen your spine, reaching arms overhead",
      "Exhale and hinge forward from your hips, not your waist",
      "Reach for your feet, ankles, or shins—wherever comfortable",
      "Hold for 1-3 minutes, breathing into tight areas"
    ],
    benefits: "Stretches the entire back body, calms the mind, and reduces stress and anxiety"
  },
];

const mindfulActivities = [
  { name: "Body Scan", icon: "🧘", description: "Notice sensations from head to toe", path: "/body-scan" },
  { name: "5 Senses Check", icon: "👁️", description: "Name 5 things you can see, 4 you can touch...", path: "/five-senses" },
  { name: "Loving Kindness", icon: "💝", description: "Send kind wishes to yourself and others", path: "/loving-kindness" },
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
  const [selectedPose, setSelectedPose] = useState(0);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const handleActivityClick = (path: string) => {
    navigate(path);
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
          <TabsContent value="yoga" className="space-y-6 animate-fade-in">
            {/* Pose selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {yogaPoses.map((pose, index) => (
                <button
                  key={pose.name}
                  onClick={() => setSelectedPose(index)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    selectedPose === index
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-card border border-border hover:border-primary/30"
                  )}
                >
                  {pose.emoji} {pose.name}
                </button>
              ))}
            </div>

            {/* Selected pose details */}
            <div className="bg-card rounded-3xl p-6 shadow-card border border-border space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-calm-mint-light flex items-center justify-center text-3xl">
                  {yogaPoses[selectedPose].emoji}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{yogaPoses[selectedPose].name}</h3>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {yogaPoses[selectedPose].duration}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground">{yogaPoses[selectedPose].description}</p>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-primary">📋</span> Instructions
                </h4>
                <ol className="space-y-2">
                  {yogaPoses[selectedPose].instructions.map((step, index) => (
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
                <p className="text-sm text-muted-foreground">{yogaPoses[selectedPose].benefits}</p>
              </div>
            </div>
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
                  onClick={() => handleActivityClick(activity.path)}
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
