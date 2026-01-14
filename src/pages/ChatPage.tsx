import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MoodTrends from "@/components/MoodTrends";
import { useActivityTracker } from "@/hooks/useActivityTracker";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MOOD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-mood`;


const ChatPage = () => {
  const location = useLocation();
  const {
    toast
  } = useToast();
  const { incrementCheckIn } = useActivityTracker();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showMoodTrends, setShowMoodTrends] = useState(false);
  const [moodKey, setMoodKey] = useState(0);
  
  const [chatFont, setChatFont] = useState(() => localStorage.getItem("emoticam_chat_font") || "quicksand");
  const [chatColor, setChatColor] = useState(() => localStorage.getItem("emoticam_chat_color") || "lavender");
  const [chatPersonality, setChatPersonality] = useState(() => localStorage.getItem("emoticam_chat_personality") || "gentle");
  const [chatBackground, setChatBackground] = useState(() => localStorage.getItem("emoticam_chat_background") || "none");
  const [customBgImage, setCustomBgImage] = useState(() => localStorage.getItem("emoticam_chat_custom_bg") || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  // Get user and load conversation history (for AI memory, not display)
  useEffect(() => {
    const loadHistory = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingHistory(false);
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Hello, I'm here to listen and support you. How are you feeling today? Take your time — there's no rush here. 💜"
        }]);
        return;
      }
      setUserId(user.id);

      // Load previous messages for AI context (not displayed)
      const {
        data: history,
        error
      } = await supabase.from("chat_messages").select("*").eq("user_id", user.id).order("created_at", {
        ascending: true
      });
      if (error) {
        console.error("Error loading chat history:", error);
      }
      
      // Store full history for AI memory
      if (history && history.length > 0) {
        setConversationHistory(history.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content
        })));
      }

      // Random welcome messages for variety
      const welcomeMessages = [
        "Hello, I'm here to listen and support you. How are you feeling today? Take your time — there's no rush here. 💜",
        "Hi there! I'm glad you're here. What's on your mind today? 🌸",
        "Welcome! This is a safe space to share. How can I support you right now? 💫",
        "Hey, it's good to see you. How are things going for you today? 🌿",
        "Hello! I'm here whenever you're ready to talk. What would you like to share? 💜",
        "Hi! Take a deep breath — you're in good company. How are you feeling? 🌻",
        "Welcome back! I'm here to listen without judgment. What's happening in your world? 🦋",
        "Hey there! Your feelings matter. What's on your heart today? 💕"
      ];
      
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      
      const welcomeMsg: Message = {
        id: "welcome",
        role: "assistant",
        content: randomWelcome
      };
      setMessages([welcomeMsg]);
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, [location.state]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Listen for chat customization changes from profile
  useEffect(() => {
    const handleStorageChange = () => {
      setChatFont(localStorage.getItem("emoticam_chat_font") || "quicksand");
      setChatColor(localStorage.getItem("emoticam_chat_color") || "lavender");
      setChatPersonality(localStorage.getItem("emoticam_chat_personality") || "gentle");
      setChatBackground(localStorage.getItem("emoticam_chat_background") || "none");
      setCustomBgImage(localStorage.getItem("emoticam_chat_custom_bg") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getBackgroundStyle = (): React.CSSProperties => {
    const bgOptions: Record<string, { type: string; gradient?: string; url?: string }> = {
      "none": { type: "none" },
      "gradient-lavender": { type: "gradient", gradient: "linear-gradient(135deg, hsl(260 60% 92%), hsl(260 55% 85%))" },
      "gradient-mint": { type: "gradient", gradient: "linear-gradient(135deg, hsl(160 50% 92%), hsl(160 40% 85%))" },
      "gradient-peach": { type: "gradient", gradient: "linear-gradient(135deg, hsl(30 70% 95%), hsl(30 60% 85%))" },
      "gradient-ocean": { type: "gradient", gradient: "linear-gradient(135deg, hsl(200 60% 92%), hsl(200 50% 85%))" },
      "gradient-aurora": { type: "gradient", gradient: "linear-gradient(135deg, hsl(260 55% 75%), hsl(200 50% 75%), hsl(160 40% 75%))" },
      "gradient-dusk": { type: "gradient", gradient: "linear-gradient(135deg, hsl(260 40% 70%), hsl(30 50% 80%))" },
      "image-clouds": { type: "image", url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80" },
      "image-stars": { type: "image", url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80" },
      "image-beach": { type: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
      "image-mountains": { type: "image", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
      "image-forest": { type: "image", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
      "custom": { type: "custom" },
    };

    const bg = bgOptions[chatBackground];
    if (!bg || bg.type === "none") return {};
    if (bg.type === "gradient") return { background: bg.gradient };
    if (bg.type === "image" && bg.url) return { 
      backgroundImage: `url(${bg.url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    if (bg.type === "custom" && customBgImage) return {
      backgroundImage: `url(${customBgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    return {};
  };
  const saveMessage = async (uid: string, role: "user" | "assistant", content: string) => {
    const {
      error
    } = await supabase.from("chat_messages").insert({
      user_id: uid,
      role,
      content
    });
    if (error) {
      console.error("Error saving message:", error);
    }
  };
  const analyzeMood = async (message: string) => {
    if (!userId) return;
    try {
      const response = await fetch(MOOD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          message
        })
      });
      if (!response.ok) {
        console.error("Mood analysis failed");
        return;
      }
      const moodData = await response.json();

      // Save mood entry to database
      const {
        error
      } = await supabase.from("mood_entries").insert({
        user_id: userId,
        mood_score: moodData.score,
        mood_label: moodData.label,
        message_snippet: message.substring(0, 100)
      });
      if (error) {
        console.error("Error saving mood entry:", error);
      } else {
        // Refresh mood trends and increment check-in counter
        setMoodKey(k => k + 1);
        incrementCheckIn();
      }
    } catch (error) {
      console.error("Mood analysis error:", error);
    }
  };
  const clearHistory = async () => {
    if (!userId) return;
    const {
      error
    } = await supabase.from("chat_messages").delete().eq("user_id", userId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear conversation",
        variant: "destructive"
      });
      return;
    }
    const welcomeMsg: Message = {
      id: "welcome-new",
      role: "assistant",
      content: "I've cleared our previous conversation. How are you feeling right now? I'm here for you. 💜"
    };
    setMessages([welcomeMsg]);
    await saveMessage(userId, "assistant", welcomeMsg.content);
    toast({
      title: "Conversation cleared",
      description: "Your chat history has been deleted"
    });
  };
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Save user message to database
    if (userId) {
      await saveMessage(userId, "user", userMessage.content);
      // Analyze mood in background
      analyzeMood(userMessage.content);
    }
    let assistantContent = "";
    try {
      // Combine stored history with current session for AI context
      const allMessages = [
        ...conversationHistory,
        ...updatedMessages.filter(m => m.id !== "welcome") // Exclude welcome messages
      ];
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({
            role: m.role,
            content: m.content
          })),
          personality: chatPersonality
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: "Please wait",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive"
          });
        } else if (response.status === 402) {
          toast({
            title: "Credits needed",
            description: "AI credits exhausted. Please add credits to continue.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: errorData.error || "Failed to get response",
            variant: "destructive"
          });
        }
        setIsLoading(false);
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let textBuffer = "";
      const assistantId = (Date.now() + 1).toString();
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, {
          stream: true
        });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? {
                    ...m,
                    content: assistantContent
                  } : m);
                }
                return [...prev, {
                  id: assistantId,
                  role: "assistant",
                  content: assistantContent
                }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
            }
          } catch {
            /* ignore */
          }
        }
        if (assistantContent) {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.id === assistantId) {
              return prev.map((m, i) => i === prev.length - 1 ? {
                ...m,
                content: assistantContent
              } : m);
            }
            return [...prev, {
              id: assistantId,
              role: "assistant",
              content: assistantContent
            }];
          });
        }
      }

      // Save assistant message to database
      if (userId && assistantContent) {
        await saveMessage(userId, "assistant", assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Connection error",
        description: "Failed to connect to the AI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  if (isLoadingHistory) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your conversation...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-6 py-4 z-10">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            {userId && <Button variant={showMoodTrends ? "default" : "ghost"} size="icon" onClick={() => setShowMoodTrends(!showMoodTrends)} className={cn(showMoodTrends ? "" : "text-muted-foreground hover:text-primary")} title="Mood trends">
                <BarChart3 className="w-5 h-5" />
              </Button>}
            {userId && messages.length > 1 && <Button variant="ghost" size="icon" onClick={clearHistory} className="text-muted-foreground hover:text-destructive" title="Clear conversation">
                <Trash2 className="w-5 h-5" />
              </Button>}
          </div>
        </div>
      </div>

      {/* Mood Trends Panel */}
      {showMoodTrends && <div className="px-4 py-4 border-b border-border bg-muted/30 animate-fade-in">
          <MoodTrends key={moodKey} />
        </div>}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative" style={getBackgroundStyle()}>
        {chatBackground !== "none" && <div className="absolute inset-0 bg-background/30 pointer-events-none" />}
        {messages.map(message => {
        const fontClass = chatFont === "playfair" ? "font-display" : chatFont === "system" ? "font-system" : "font-sans";
        const getUserBubbleClasses = () => {
          switch (chatColor) {
            case "mint":
              return "bg-calm-mint text-foreground";
            case "peach":
              return "bg-calm-peach text-foreground";
            case "blue":
              return "bg-calm-blue text-foreground";
            default:
              return "bg-primary text-primary-foreground";
          }
        };
        const getAiBubbleClasses = () => {
          switch (chatColor) {
            case "mint":
              return "bg-calm-mint-light text-foreground border-calm-mint/30";
            case "peach":
              return "bg-calm-peach-light text-foreground border-calm-peach/30";
            case "blue":
              return "bg-calm-blue-light text-foreground border-calm-blue/30";
            default:
              return "bg-card text-foreground border-border";
          }
        };
        return <div key={message.id} className={cn("flex animate-fade-in-up relative z-10", message.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-2xl px-4 py-3", message.role === "user" ? `${getUserBubbleClasses()} rounded-br-md` : `${getAiBubbleClasses()} border shadow-soft rounded-bl-md`)}>
                <p className={cn("text-sm leading-relaxed", fontClass)}>{message.content}</p>
              </div>
            </div>;
      })}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && <div className="flex justify-start animate-fade-in relative z-10">
            <div className="bg-card border border-border shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft" />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft stagger-1" />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft stagger-2" />
              </div>
            </div>
          </div>}

        <div ref={messagesEndRef} className="relative z-10" />
      </div>

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-10 py-[5px] my-0 mx-0 border-0 px-[16px] mb-[5px] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Share what's on your mind..." className="flex-1 bg-muted/50" disabled={isLoading} />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon" className="shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>;
};
export default ChatPage;