import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Sun, Heart, Calendar, ChevronRight, Camera, MessageCircle, Type, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [username, setUsername] = useState("Friend");
  const [notifications, setNotifications] = useState(true);
  const [lightMode, setLightMode] = useState(() => {
    return !document.documentElement.classList.contains("dark");
  });
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{ type: "emoji" | "image"; value: string; bg?: string }>({
    type: "emoji",
    value: "🌸",
    bg: "from-calm-lavender to-calm-mint",
  });
  const [stats, setStats] = useState({ checkIns: 0, calmMoments: 0 });
  const [userId, setUserId] = useState<string | null>(null);
  const [chatFont, setChatFont] = useState(() => localStorage.getItem("emoticam_chat_font") || "quicksand");
  const [chatColor, setChatColor] = useState(() => localStorage.getItem("emoticam_chat_color") || "lavender");

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
        setNotifications(profile.notifications_enabled ?? true);
        setLightMode(!(profile.dark_mode ?? true));
        setStats({
          checkIns: profile.check_ins ?? 0,
          calmMoments: profile.calm_moments ?? 0,
        });
        
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

  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("emoticam_theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("emoticam_theme", "dark");
    }

    // Update in database
    if (userId) {
      supabase
        .from("profiles")
        .update({ dark_mode: !lightMode })
        .eq("user_id", userId)
        .then();
    }
  }, [lightMode, userId]);

  useEffect(() => {
    if (userId) {
      supabase
        .from("profiles")
        .update({ notifications_enabled: notifications })
        .eq("user_id", userId)
        .then();
    }
  }, [notifications, userId]);

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

  const statsDisplay = [
    { label: "Check-ins", value: stats.checkIns.toString(), icon: Calendar },
    { label: "Calm Moments", value: stats.calmMoments.toString(), icon: Heart },
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
          <div className="grid grid-cols-2 gap-4">
            {statsDisplay.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/50 rounded-2xl p-4 text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 mt-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground px-2">Settings</h2>

        <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
          {/* Notifications */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-lavender-light flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Gentle reminders</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          {/* Dark mode */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calm-blue-light flex items-center justify-center">
                <Sun className="w-5 h-5 text-calm-blue" />
              </div>
              <div>
                <p className="font-medium text-foreground">Light Mode</p>
                <p className="text-sm text-muted-foreground">Brighter theme</p>
              </div>
            </div>
            <Switch checked={lightMode} onCheckedChange={setLightMode} />
          </div>
        </div>

        {/* Chatbot Settings */}
        <h2 className="font-display text-lg font-bold text-foreground px-2 mt-6">Chatbot Settings</h2>

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
          <div className="flex items-center justify-between p-4">
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

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
