import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background breathing circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-calm-lavender/10 animate-breathe" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-calm-mint/10 animate-breathe stagger-1" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-calm-peach/10 animate-breathe stagger-2" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-calm-lavender/40 animate-float" />
      <div className="absolute top-32 right-16 w-3 h-3 rounded-full bg-calm-mint/50 animate-float stagger-2" />
      <div className="absolute bottom-40 left-20 w-5 h-5 rounded-full bg-calm-peach/40 animate-float stagger-3" />
      <div className="absolute bottom-32 right-12 w-3 h-3 rounded-full bg-calm-blue/50 animate-float stagger-1" />

      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo/Icon */}
        <div className="mb-8 animate-float">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-calm-blue shadow-glow flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>

        {/* App name */}
        <h1 className="font-display text-5xl font-bold text-foreground mb-4 tracking-wide">
          EMOTICALM
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground text-lg font-medium animate-fade-in stagger-3">
          Your peace begins here
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft stagger-1" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft stagger-2" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
