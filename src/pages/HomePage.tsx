import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmotionCard from "@/components/EmotionCard";
import DailyTip from "@/components/DailyTip";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useBadges } from "@/hooks/useBadges";
import { isGuestMode } from "@/lib/guestMode";

const emotionResponses = {
  Happy: [
    "That's wonderful! Let's keep this positive energy flowing. What made you feel happy today?",
    "I love seeing you happy! Joy is contagious — would you like to share what sparked this feeling?",
    "Happiness looks beautiful on you! Let's savor this moment together.",
    "What a lovely feeling! Remember this moment when things get tough.",
    "Your happiness brightens the world! What's bringing you joy right now?",
  ],
  Sad: [
    "I understand how heavy sadness can feel. Let's slow down together. Would you like to talk about it or try a calming exercise?",
    "It's okay to feel sad. I'm here with you, and your feelings are valid.",
    "Sadness is a part of being human. Let me offer you some gentle comfort.",
    "I see you're going through a tough time. Remember, this feeling will pass.",
    "Your heart is heavy right now, and that's okay. Let's breathe through this together.",
  ],
  Angry: [
    "It's okay to feel angry. Let's take a few deep breaths together to find some calm.",
    "Anger is trying to tell you something. Let's explore it gently.",
    "I hear you. Anger can be intense. Let's find a safe way to release this energy.",
    "Your feelings are valid. Would you like to try some grounding exercises?",
    "Let's pause and breathe. Anger is powerful, but so is your ability to find peace.",
  ],
  Anxious: [
    "Anxiety can be overwhelming. You're safe here. Let's ground ourselves with some breathing exercises.",
    "I'm right here with you. Let's take this one breath at a time.",
    "Your worries are valid, but you're stronger than you know. Let's find calm together.",
    "Anxiety is uncomfortable, but it will pass. Let me guide you to a peaceful place.",
    "You're not alone in this. Let's slow down and find your center together.",
  ],
  Tired: [
    "Rest is important. Be gentle with yourself. Would you like some relaxation techniques?",
    "Your body is asking for rest. Honor that need — you deserve it.",
    "Tiredness is your body's way of saying 'slow down'. Let's find some peace.",
    "Even the strongest need rest. What would feel most restorative right now?",
    "It's okay to take a break. Let me help you find some gentle relaxation.",
  ],
  Calm: [
    "Beautiful! Embrace this peaceful moment. How can we make it even more serene?",
    "What a lovely state to be in. Let's deepen this sense of tranquility.",
    "Calmness is a gift. Let's nurture this peaceful feeling together.",
    "You've found your center. Would you like to explore some mindfulness practices?",
    "This peaceful energy is wonderful. Let's keep it flowing.",
  ],
};

const emotions = [
  { emoji: "😊", label: "Happy", color: "mint" as const },
  { emoji: "😔", label: "Sad", color: "blue" as const },
  { emoji: "😠", label: "Angry", color: "peach" as const },
  { emoji: "😟", label: "Anxious", color: "lavender" as const },
  { emoji: "😴", label: "Tired", color: "blue" as const },
  { emoji: "😌", label: "Calm", color: "mint" as const },
];

const getRandomResponse = (emotion: string): string => {
  const responses = emotionResponses[emotion as keyof typeof emotionResponses];
  return responses[Math.floor(Math.random() * responses.length)];
};

const HomePage = () => {
  const navigate = useNavigate();
  const { updateStreak, checkAndAwardBadges } = useBadges();
  const [username, setUsername] = useState("Friend");
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (isGuestMode()) {
      setUsername("Guest");
      return;
    }

    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile?.username) {
        setUsername(profile.username);
      }

      await updateStreak();
      await checkAndAwardBadges();
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isGuestMode()) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmotionSelect = (index: number) => {
    const emotion = emotions[index].label;
    const response = getRandomResponse(emotion);
    setSelectedEmotion(index);
    setCurrentResponse(response);
    setShowResponse(true);
  };

  const handleChatWithAI = () => {
    navigate("/chat", { 
      state: { 
        emotion: emotions[selectedEmotion!].label,
        initialMessage: currentResponse 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-calm-lavender/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-calm-mint/5 blur-3xl" />

      {/* Breathing background animation */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <div className="absolute inset-0 rounded-full bg-calm-lavender/5 animate-breathe" />
        <div className="absolute inset-8 rounded-full bg-calm-mint/5 animate-breathe stagger-1" />
        <div className="absolute inset-16 rounded-full bg-calm-peach/5 animate-breathe stagger-2" />
      </div>

      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-muted-foreground mb-1">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold text-foreground">{username}</h1>
        </div>

        {/* Main question */}
        <div className="text-center mb-8 animate-fade-in-up stagger-1">
          <div className="inline-block px-6 py-3 rounded-2xl bg-card shadow-soft border border-border">
            <p className="text-lg font-medium text-foreground">
              How are you feeling right now?
            </p>
          </div>
        </div>

        {/* Emotion grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {emotions.map((emotion, index) => (
            <EmotionCard
              key={emotion.label}
              emoji={emotion.emoji}
              label={emotion.label}
              color={emotion.color}
              isSelected={selectedEmotion === index}
              onClick={() => handleEmotionSelect(index)}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Daily Tip */}
        <div className="mb-8">
          <DailyTip />
        </div>

        {/* AI Response */}
        {showResponse && selectedEmotion !== null && (
          <div className="animate-fade-in-up">
            <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-calm-blue flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">
                    {currentResponse}
                  </p>
                  <button
                    onClick={handleChatWithAI}
                    className="mt-4 text-primary font-semibold flex items-center gap-2 hover:underline transition-all"
                  >
                    <span>Talk with me</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
