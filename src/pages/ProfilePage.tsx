import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Moon, Heart, Calendar, ChevronRight, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

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
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{ type: "emoji" | "image"; value: string; bg?: string }>(() => {
    const saved = localStorage.getItem("emoticam_avatar");
    return saved ? JSON.parse(saved) : { type: "emoji", value: "🌸", bg: "from-calm-lavender to-calm-mint" };
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("emoticam_user");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("emoticam_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("emoticam_theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("emoticam_user");
    toast({
      title: "See you soon!",
      description: "Take care of yourself 💜",
    });
    setTimeout(() => navigate("/auth"), 500);
  };

  const handleAvatarSelect = (avatar: typeof avatarOptions[0]) => {
    const newAvatar = { type: "emoji" as const, value: avatar.emoji, bg: avatar.bg };
    setSelectedAvatar(newAvatar);
    localStorage.setItem("emoticam_avatar", JSON.stringify(newAvatar));
    setAvatarDialogOpen(false);
    toast({
      title: "Avatar updated!",
      description: "Looking great! ✨",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const newAvatar = { type: "image" as const, value: reader.result as string };
        setSelectedAvatar(newAvatar);
        localStorage.setItem("emoticam_avatar", JSON.stringify(newAvatar));
        setAvatarDialogOpen(false);
        toast({
          title: "Photo updated!",
          description: "Your new profile photo looks wonderful 💜",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: "Check-ins", value: "12", icon: Calendar },
    { label: "Calm Moments", value: "8", icon: Heart },
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
            {stats.map((stat) => (
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
                <Moon className="w-5 h-5 text-calm-blue" />
              </div>
              <div>
                <p className="font-medium text-foreground">Calm Dark Mode</p>
                <p className="text-sm text-muted-foreground">Easier on the eyes</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
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
