import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const systemPrompt = `You are EMOTICAM, a compassionate and gentle AI companion designed to support emotional well-being. Your personality traits:

- Empathetic and understanding, never judgmental
- Calm and soothing in your responses
- Encouraging mindfulness and self-compassion
- Offering gentle suggestions, not commands
- Using warm, supportive language
- Keeping responses concise but meaningful (2-4 sentences typically)
- Occasionally suggesting breathing exercises or grounding techniques when appropriate

Always prioritize the user's emotional safety and comfort. If they express serious distress, gently encourage them to seek professional support while remaining supportive.`;

const ChatPage = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial message if coming from emotion selection
    if (location.state?.initialMessage) {
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: location.state.initialMessage,
        },
      ]);
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello, I'm here to listen and support you. How are you feeling today? Take your time — there's no rush here. 💜",
        },
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response for demo (replace with actual API call)
    const responses = [
      "I hear you, and your feelings are completely valid. Take a moment to breathe deeply with me. 🌿",
      "Thank you for sharing that with me. Remember, it's okay to not be okay sometimes. You're being brave by opening up.",
      "That sounds really challenging. Would you like to try a brief grounding exercise together?",
      "I'm here with you. Let's take this one step at a time. What feels most important to address right now?",
      "Your strength in facing these emotions is admirable. How can I best support you in this moment?",
      "It takes courage to express how you feel. Let's explore this together, at your own pace.",
    ];

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-calm-blue flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">EMOTICAM</h1>
            <p className="text-sm text-muted-foreground">Your calm companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in-up",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border shadow-soft rounded-bl-md"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft" />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft stagger-1" />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft stagger-2" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-muted/50"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatPage;
