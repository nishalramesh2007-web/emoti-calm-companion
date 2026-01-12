-- Create badges table for defining available achievements
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_badges table for tracking earned badges
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Add streak tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN current_streak integer DEFAULT 0,
ADD COLUMN longest_streak integer DEFAULT 0,
ADD COLUMN last_activity_date date;

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Badges are readable by everyone (public catalog)
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value) VALUES
-- Check-in milestones
('First Steps', 'Complete your first check-in', '🌱', 'check_ins', 'check_ins', 1),
('Getting Started', 'Complete 5 check-ins', '🌿', 'check_ins', 'check_ins', 5),
('Consistent Checker', 'Complete 10 check-ins', '🌳', 'check_ins', 'check_ins', 10),
('Mood Master', 'Complete 25 check-ins', '🏆', 'check_ins', 'check_ins', 25),
('Check-in Champion', 'Complete 50 check-ins', '👑', 'check_ins', 'check_ins', 50),

-- Calm moments milestones
('Finding Peace', 'Complete your first calm moment', '🕊️', 'calm_moments', 'calm_moments', 1),
('Inner Calm', 'Complete 5 calm moments', '🧘', 'calm_moments', 'calm_moments', 5),
('Zen Seeker', 'Complete 10 calm moments', '☮️', 'calm_moments', 'calm_moments', 10),
('Tranquil Soul', 'Complete 25 calm moments', '🌸', 'calm_moments', 'calm_moments', 25),
('Serenity Master', 'Complete 50 calm moments', '✨', 'calm_moments', 'calm_moments', 50),

-- Streak milestones
('Day One', 'Start your wellness journey', '⭐', 'streak', 'streak', 1),
('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', 'streak', 7),
('Fortnight Focus', 'Maintain a 14-day streak', '💪', 'streak', 'streak', 14),
('Monthly Master', 'Maintain a 30-day streak', '🌟', 'streak', 'streak', 30);