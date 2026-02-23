import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, UserRound, Eye, EyeOff } from "lucide-react";
import { enableGuestMode, isGuestMode } from "@/lib/guestMode";

type AuthMode = "login" | "signup" | "forgot-password";

const AuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = authMode === "login";
  const isForgotPassword = authMode === "forgot-password";

  useEffect(() => {
    // If guest mode is active, redirect to home
    if (isGuestMode()) {
      navigate("/home");
      return;
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        toast({
          title: "Failed to send reset email",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset email sent!",
        description: "Check your inbox for the password reset link.",
      });
      setAuthMode("login");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Welcome back!",
          description: "Redirecting to your calm space...",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username || email.split("@")[0],
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try logging in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Account created!",
          description: "Welcome to your calm space...",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return "Reset Password";
    if (isLogin) return "Welcome Back";
    return "Begin Your Journey";
  };

  const getSubtitle = () => {
    if (isForgotPassword) return "Enter your email to receive a reset link";
    if (isLogin) return "Continue to your calm space";
    return "Create your peaceful sanctuary";
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
            {getTitle()}
          </h1>
          <p className="text-muted-foreground">
            {getSubtitle()}
          </p>
        </div>

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="w-full max-w-sm space-y-4 animate-fade-in-up stagger-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card/80 backdrop-blur-sm"
                required
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
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="w-full flex items-center justify-center gap-2 mt-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
          </form>
        ) : (
          <>
            {/* Login/Signup Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 animate-fade-in-up stagger-1">
              {!isLogin && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-foreground">Username</label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-card/80 backdrop-blur-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card/80 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot-password")}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-card/80 backdrop-blur-sm pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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

            {/* Guest mode */}
            <div className="mt-6 animate-fade-in-up stagger-2">
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-background px-3 text-xs text-muted-foreground">or</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full rounded-xl"
                onClick={() => {
                  enableGuestMode();
                  navigate("/home");
                }}
              >
                <UserRound className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>
            </div>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "New to EMOTICALM?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => setAuthMode(isLogin ? "signup" : "login")}
                className="mt-2 text-primary font-semibold hover:underline transition-all"
              >
                {isLogin ? "Create an account" : "Sign in instead"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
