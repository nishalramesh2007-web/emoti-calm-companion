import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Store username in localStorage for demo
    localStorage.setItem("emoticam_user", username);
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: "Redirecting to your calm space...",
    });

    setTimeout(() => {
      navigate("/home");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-calm-lavender/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-calm-mint/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-calm-peach/5 blur-3xl" />

      {/* Floating elements */}
      <div className="absolute top-24 left-8 w-3 h-3 rounded-full bg-calm-lavender/40 animate-float" />
      <div className="absolute top-40 right-10 w-4 h-4 rounded-full bg-calm-mint/40 animate-float stagger-2" />
      <div className="absolute bottom-32 left-16 w-3 h-3 rounded-full bg-calm-peach/50 animate-float stagger-1" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-calm-blue shadow-soft flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome Back" : "Begin Your Journey"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Continue to your calm space" : "Create your peaceful sanctuary"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 animate-fade-in-up stagger-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Username</label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-card/80 backdrop-blur-sm"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-foreground">
                Email <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card/80 backdrop-blur-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-card/80 backdrop-blur-sm"
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Please wait...</span>
              </div>
            ) : (
              isLogin ? "Continue to Calm" : "Begin Your Journey"
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center animate-fade-in-up stagger-2">
          <p className="text-muted-foreground">
            {isLogin ? "New to EMOTICAM?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-primary font-semibold hover:underline transition-all"
          >
            {isLogin ? "Create an account" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
