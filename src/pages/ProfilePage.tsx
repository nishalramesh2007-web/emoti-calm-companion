import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Moon, Heart, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Friend");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-calm-lavender to-calm-mint flex items-center justify-center text-4xl shadow-soft">
              🌸
            </div>
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

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
