import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Heart, Calendar, ChevronRight, Camera, Type, Palette, Sparkles, ImageIcon, Upload, MessageCircle, Loader2, Trash2, Search, X, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useBadges } from "@/hooks/useBadges";
import { BadgesDisplay } from "@/components/BadgesDisplay";
const fontOptions = [
  { value: "quicksand", label: "Quicksand", fontClass: "font-sans" },
  { value: "playfair", label: "Playfair Display", fontClass: "font-display" },
  { value: "system", label: "System Default", fontClass: "font-system" },
];

const colorOptions = [
  { value: "lavender", label: "Lavender", userBg: "bg-primary", userText: "text-primary-foreground", aiBg: "bg-card", aiText: "text-foreground" },
  { value: "mint", label: "Mint", userBg: "bg-calm-mint", userText: "text-foreground", aiBg: "bg-calm-mint-light", aiText: "text-foreground" },
  { value: "peach", label: "Peach", userBg: "bg-calm-peach", userText: "text-foreground", aiBg: "bg-calm-peach-light", aiText: "text-foreground" },
  { value: "blue", label: "Ocean", userBg: "bg-calm-blue", userText: "text-foreground", aiBg: "bg-calm-blue-light", aiText: "text-foreground" },
];

const personalityOptions = [
  { value: "gentle", label: "Gentle & Calm", emoji: "🌸", description: "Soft, soothing responses" },
  { value: "cheerful", label: "Cheerful", emoji: "☀️", description: "Upbeat and encouraging" },
  { value: "wise", label: "Wise Mentor", emoji: "🦉", description: "Thoughtful guidance" },
  { value: "playful", label: "Playful Friend", emoji: "🌈", description: "Light and fun" },
  { value: "nurturing", label: "Nurturing", emoji: "🌿", description: "Warm and caring" },
];

const backgroundOptions = [
  { value: "none", label: "None", type: "none" },
  { value: "gradient-lavender", label: "Lavender Dream", type: "gradient", gradient: "linear-gradient(135deg, hsl(260 60% 92%), hsl(260 55% 85%))" },
  { value: "gradient-mint", label: "Mint Fresh", type: "gradient", gradient: "linear-gradient(135deg, hsl(160 50% 92%), hsl(160 40% 85%))" },
  { value: "gradient-peach", label: "Peach Sunset", type: "gradient", gradient: "linear-gradient(135deg, hsl(30 70% 95%), hsl(30 60% 85%))" },
  { value: "gradient-ocean", label: "Ocean Calm", type: "gradient", gradient: "linear-gradient(135deg, hsl(200 60% 92%), hsl(200 50% 85%))" },
  { value: "gradient-aurora", label: "Aurora", type: "gradient", gradient: "linear-gradient(135deg, hsl(260 55% 75%), hsl(200 50% 75%), hsl(160 40% 75%))" },
  { value: "gradient-dusk", label: "Dusk", type: "gradient", gradient: "linear-gradient(135deg, hsl(260 40% 70%), hsl(30 50% 80%))" },
  { value: "image-clouds", label: "Soft Clouds", type: "image", url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80" },
  { value: "image-zen", label: "Zen Garden", type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { value: "image-stars", label: "Night Sky", type: "image", url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80" },
  { value: "custom", label: "Custom Image", type: "custom" },
];

const avatarOptions = [
  { emoji: "🌸", bg: "from-calm-lavender to-calm-mint" },
  { emoji: "🌿", bg: "from-calm-mint to-calm-blue" },
  { emoji: "🦋", bg: "from-calm-blue to-calm-lavender" },
  { emoji: "🌙", bg: "from-calm-blue to-primary" },
  { emoji: "☀️", bg: "from-calm-peach to-calm-cream" },
  { emoji: "🌊", bg: "from-calm-blue to-calm-mint" },
  { emoji: "🌺", bg: "from-calm-peach to-calm-lavender" },
  { emoji: "🍃", bg: "from-calm-mint to-calm-cream" },
  { emoji: "✨", bg: "from-calm-lavender to-calm-peach" },
  { emoji: "🌈", bg: "from-calm-peach to-calm-mint" },
  { emoji: "🐱", bg: "from-calm-lavender to-calm-blue" },
  { emoji: "🐶", bg: "from-calm-peach to-calm-cream" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("Friend");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [bgDialogOpen, setBgDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ id: string; role: string; content: string; created_at: string }[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<{ type: "emoji" | "image"; value: string; bg?: string }>({
    type: "emoji",
    value: "🌸",
    bg: "from-calm-lavender to-calm-mint",
  });
  const [stats, setStats] = useState({ checkIns: 0, calmMoments: 0, currentStreak: 0 });
  const [userId, setUserId] = useState<string | null>(null);
  const [chatFont, setChatFont] = useState(() => localStorage.getItem("emoticam_chat_font") || "quicksand");
  const [chatColor, setChatColor] = useState(() => localStorage.getItem("emoticam_chat_color") || "lavender");
  const [chatPersonality, setChatPersonality] = useState(() => localStorage.getItem("emoticam_chat_personality") || "gentle");
  const [chatBackground, setChatBackground] = useState(() => localStorage.getItem("emoticam_chat_background") || "none");
  const [customBgImage, setCustomBgImage] = useState(() => localStorage.getItem("emoticam_chat_custom_bg") || "");
  
  const { allBadges, earnedBadges, loading: badgesLoading, fetchBadges } = useBadges();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        setUsername(profile.username || "Friend");
        setStats({
          checkIns: profile.check_ins ?? 0,
          calmMoments: profile.calm_moments ?? 0,
          currentStreak: profile.current_streak ?? 0,
        });
        
        // Refresh badges when profile loads
        fetchBadges();
        
        if (profile.avatar_type && profile.avatar_value) {
          const avatarBg = avatarOptions.find(a => a.emoji === profile.avatar_value)?.bg;
          setSelectedAvatar({
            type: profile.avatar_type as "emoji" | "image",
            value: profile.avatar_value,
            bg: avatarBg || "from-calm-lavender to-calm-mint",
          });
        }
      }
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "See you soon!",
      description: "Take care of yourself 💜",
    });
    navigate("/auth");
  };

  const handleAvatarSelect = async (avatar: typeof avatarOptions[0]) => {
    const newAvatar = { type: "emoji" as const, value: avatar.emoji, bg: avatar.bg };
    setSelectedAvatar(newAvatar);
    setAvatarDialogOpen(false);

    if (userId) {
      await supabase
        .from("profiles")
        .update({ avatar_type: "emoji", avatar_value: avatar.emoji })
        .eq("user_id", userId);
    }

    toast({
      title: "Avatar updated!",
      description: "Looking great! ✨",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please choose an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        const newAvatar = { type: "image" as const, value: imageData };
        setSelectedAvatar(newAvatar);
        setAvatarDialogOpen(false);

        // Note: For production, you should upload to storage instead of storing base64
        if (userId) {
          await supabase
            .from("profiles")
            .update({ avatar_type: "image", avatar_value: imageData })
            .eq("user_id", userId);
        }

        toast({
          title: "Photo updated!",
          description: "Your new profile photo looks wonderful 💜",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please choose an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setCustomBgImage(imageData);
        setChatBackground("custom");
        localStorage.setItem("emoticam_chat_custom_bg", imageData);
        localStorage.setItem("emoticam_chat_background", "custom");
        setBgDialogOpen(false);
        toast({
          title: "Background updated!",
          description: "Your custom background looks great 🎨",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgSelect = (value: string) => {
    setChatBackground(value);
    localStorage.setItem("emoticam_chat_background", value);
    setBgDialogOpen(false);
    toast({
      title: "Background updated!",
      description: "Your chat background has been changed",
    });
  };

  const loadChatHistory = async () => {
    if (!userId) return;
    
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({
        title: "Error loading history",
        description: "Could not load your chat history",
        variant: "destructive",
      });
    } else {
      setChatHistory(data || []);
    }
    setIsLoadingHistory(false);
  };

  const handleOpenHistory = () => {
    setHistoryDialogOpen(true);
    setSearchQuery("");
    loadChatHistory();
  };

  const handleDeleteMessage = async (messageId: string) => {
    setIsDeletingMessage(messageId);
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", messageId);
    
    if (error) {
      toast({
        title: "Error deleting message",
        description: "Could not delete the message",
        variant: "destructive",
      });
    } else {
      setChatHistory(prev => prev.filter(m => m.id !== messageId));
      toast({
        title: "Message deleted",
        description: "The message has been removed",
      });
    }
    setIsDeletingMessage(null);
  };

  const handleClearAllHistory = async () => {
    if (!userId) return;
    
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", userId);
    
    if (error) {
      toast({
        title: "Error clearing history",
        description: "Could not clear your chat history",
        variant: "destructive",
      });
    } else {
      setChatHistory([]);
      setClearAllDialogOpen(false);
      toast({
        title: "History cleared",
        description: "All your chat history has been deleted",
      });
    }
  };

  // Filter chat history based on search query
  const filteredHistory = searchQuery.trim()
    ? chatHistory.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatHistory;

  // Group chat history by date
  const groupedHistory = filteredHistory.reduce((groups, message) => {
    const date = format(new Date(message.created_at), "MMMM d, yyyy");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof filteredHistory>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const statsDisplay = [
    { label: "Check-ins", value: stats.checkIns.toString(), icon: Calendar },
    { label: "Calm Moments", value: stats.calmMoments.toString(), icon: Heart },
    { label: "Day Streak", value: stats.currentStreak.toString(), icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-calm-blue overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-calm-mint/20 blur-2xl" />
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-calm-peach/20 blur-2xl" />
      </div>

      {/* Profile card */}
      <div className="px-6 -mt-20 relative z-10">
        <div className="bg-card rounded-3xl p-6 shadow-card border border-border">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setAvatarDialogOpen(true)}
              className="relative group"
            >
              {selectedAvatar.type === "emoji" ? (
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedAvatar.bg} flex items-center justify-center text-4xl shadow-soft transition-transform group-hover:scale-105`}>
                  {selectedAvatar.value}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-soft transition-transform group-hover:scale-105">
                  <img
                    src={selectedAvatar.value}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-soft">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{username}</h1>
              <p className="text-muted-foreground">On a journey to inner peace</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {statsDisplay.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/50 rounded-2xl p-3 text-center"
              >
                <stat.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Badges Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <BadgesDisplay 
              allBadges={allBadges} 
              earnedBadges={earnedBadges} 
              loading={badgesLoading} 
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 mt-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground px-2">Chatbot Settings</h2>

        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          {/* Chat Font */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-lavender-light flex items-center justify-center">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Chat Font</p>
                <p className="text-sm text-muted-foreground">Message text style</p>
              </div>
            </div>
            <Select value={chatFont} onValueChange={(value) => {
              setChatFont(value);
              localStorage.setItem("emoticam_chat_font", value);
              toast({ title: "Font updated!", description: "Your chat font has been changed" });
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span className={font.fontClass}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chat Color */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-peach-light flex items-center justify-center">
                <Palette className="w-5 h-5 text-calm-peach" />
              </div>
              <div>
                <p className="font-medium text-foreground">Chat Color</p>
                <p className="text-sm text-muted-foreground">Message bubble theme</p>
              </div>
            </div>
            <Select value={chatColor} onValueChange={(value) => {
              setChatColor(value);
              localStorage.setItem("emoticam_chat_color", value);
              toast({ title: "Color updated!", description: "Your chat theme has been changed" });
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${color.userBg}`} />
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AI Personality */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-mint-light flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-calm-mint" />
              </div>
              <div>
                <p className="font-medium text-foreground">AI Personality</p>
                <p className="text-sm text-muted-foreground">Companion tone</p>
              </div>
            </div>
            <Select value={chatPersonality} onValueChange={(value) => {
              setChatPersonality(value);
              localStorage.setItem("emoticam_chat_personality", value);
              toast({ title: "Personality updated!", description: "Your companion will adjust their tone" });
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {personalityOptions.map((personality) => (
                  <SelectItem key={personality.value} value={personality.value}>
                    <div className="flex items-center gap-2">
                      <span>{personality.emoji}</span>
                      <span>{personality.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chat Background */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-blue-light flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-calm-blue" />
              </div>
              <div>
                <p className="font-medium text-foreground">Chat Background</p>
                <p className="text-sm text-muted-foreground">Gradient or image</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setBgDialogOpen(true)}
              className="h-9"
            >
              {backgroundOptions.find(b => b.value === chatBackground)?.label || "Choose"}
            </Button>
          </div>
        </div>

        {/* Chat History */}
        <h2 className="font-display text-lg font-bold text-foreground px-2 mt-6">Chat History</h2>

        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          <button
            onClick={handleOpenHistory}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-lavender-light flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">View Past Conversations</p>
                <p className="text-sm text-muted-foreground">Browse your chat history</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full justify-between h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Choose Your Avatar</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload from gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-calm-lavender-light to-calm-mint-light border border-primary/20 hover:shadow-card transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Upload from Gallery</p>
                <p className="text-sm text-muted-foreground">Choose your own photo</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Preset avatars */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Or choose an avatar</p>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatar.bg} flex items-center justify-center text-2xl shadow-soft hover:scale-110 transition-transform ${
                      selectedAvatar.type === "emoji" && selectedAvatar.value === avatar.emoji
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Selection Dialog */}
      <Dialog open={bgDialogOpen} onOpenChange={setBgDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Chat Background</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload custom background */}
            <button
              onClick={() => bgFileInputRef.current?.click()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-calm-lavender-light to-calm-mint-light border border-primary/20 hover:shadow-card transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Upload Custom Image</p>
                <p className="text-sm text-muted-foreground">Choose from your storage</p>
              </div>
            </button>
            <input
              ref={bgFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgImageUpload}
              className="hidden"
            />

            {/* Show custom background preview if set */}
            {customBgImage && chatBackground === "custom" && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary">
                <img 
                  src={customBgImage} 
                  alt="Custom background" 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full">
                    Current Custom Background
                  </span>
                </div>
              </div>
            )}

            {/* Gradient options */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Gradients</p>
              <div className="grid grid-cols-3 gap-3">
                {backgroundOptions.filter(b => b.type === "none" || b.type === "gradient").map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => handleBgSelect(bg.value)}
                    className={`h-20 rounded-2xl flex items-center justify-center text-xs font-medium shadow-soft hover:scale-105 transition-transform ${
                      chatBackground === bg.value ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ 
                      background: bg.type === "gradient" ? bg.gradient : "hsl(var(--muted))"
                    }}
                  >
                    <span className="bg-background/80 px-2 py-1 rounded-full text-foreground">
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image options */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Images</p>
              <div className="grid grid-cols-3 gap-3">
                {backgroundOptions.filter(b => b.type === "image").map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => handleBgSelect(bg.value)}
                    className={`h-20 rounded-2xl overflow-hidden flex items-center justify-center text-xs font-medium shadow-soft hover:scale-105 transition-transform relative ${
                      chatBackground === bg.value ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    <img 
                      src={bg.url} 
                      alt={bg.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="relative bg-background/80 px-2 py-1 rounded-full text-foreground z-10">
                      {bg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-display text-xl">Chat History</DialogTitle>
              {chatHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setClearAllDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            <DialogDescription className="sr-only">
              View and manage your past chat conversations
            </DialogDescription>
          </DialogHeader>

          {/* Search Input */}
          {chatHistory.length > 0 && !isLoadingHistory && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No chat history yet</p>
              <p className="text-sm text-muted-foreground">Start a conversation to see your history here</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No messages found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 pb-4">
                {sortedDates.map((date) => (
                  <div key={date}>
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 mb-3">
                      <p className="text-sm font-semibold text-muted-foreground">{date}</p>
                    </div>
                    <div className="space-y-3">
                      {groupedHistory[date].sort((a, b) => 
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      ).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
                        >
                          <div className="relative">
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap pr-6">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}>
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              disabled={isDeletingMessage === message.id}
                              className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                                message.role === "user" 
                                  ? "hover:bg-primary-foreground/20 text-primary-foreground/70"
                                  : "hover:bg-foreground/10 text-muted-foreground"
                              }`}
                              title="Delete message"
                            >
                              {isDeletingMessage === message.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Clear all chat history?</DialogTitle>
            <DialogDescription>
              This will permanently delete all your chat messages. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl flex-1" onClick={() => setClearAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleClearAllHistory}
              className="rounded-xl flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
