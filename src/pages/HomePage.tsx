import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmotionCard from "@/components/EmotionCard";
import BottomNav from "@/components/BottomNav";

const emotions = [
  { emoji: "😊", label: "Happy", color: "mint" as const, response: "That's wonderful! Let's keep this positive energy flowing. What made you feel happy today?" },
  { emoji: "😔", label: "Sad", color: "blue" as const, response: "I understand how heavy sadness can feel. Let's slow down together. Would you like to talk about it or try a calming exercise?" },
  { emoji: "😠", label: "Angry", color: "peach" as const, response: "It's okay to feel angry. Let's take a few deep breaths together to find some calm." },
  { emoji: "😟", label: "Anxious", color: "lavender" as const, response: "Anxiety can be overwhelming. You're safe here. Let's ground ourselves with some breathing exercises." },
  { emoji: "😴", label: "Tired", color: "blue" as const, response: "Rest is important. Be gentle with yourself. Would you like some relaxation techniques?" },
  { emoji: "😌", label: "Calm", color: "mint" as const, response: "Beautiful! Embrace this peaceful moment. How can we make it even more serene?" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Friend");
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("emoticam_user");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleEmotionSelect = (index: number) => {
    setSelectedEmotion(index);
    setShowResponse(true);
  };

  const handleChatWithAI = () => {
    navigate("/chat", { 
      state: { 
        emotion: emotions[selectedEmotion!].label,
        initialMessage: emotions[selectedEmotion!].response 
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
                    {emotions[selectedEmotion].response}
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
