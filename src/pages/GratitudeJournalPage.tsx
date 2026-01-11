import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface JournalEntry {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

const GratitudeJournalPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { incrementCalmMoment } = useActivityTracker();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [journalName, setJournalName] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("gratitude_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading entries:", error);
        toast({
          title: "Error loading entries",
          description: "Please try again later",
          variant: "destructive",
        });
      } else {
        setEntries(data || []);
      }
      setIsLoading(false);
    };

    loadEntries();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const saveEntry = async () => {
    if (!journalName.trim() || !journalContent.trim()) {
      toast({
        title: "Please fill in both fields",
        description: "Give your journal a name and write something you're grateful for.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save entries",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("gratitude_entries")
      .insert({
        user_id: session.user.id,
        name: journalName.trim(),
        content: journalContent.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error saving entry",
        description: "Please try again later",
        variant: "destructive",
      });
    } else {
      setEntries([data, ...entries]);
      toast({
        title: "Journal saved ✨",
        description: "Your gratitude has been recorded.",
      });
      setJournalName("");
      setJournalContent("");
      setIsWriting(false);
      // Track as calm moment
      incrementCalmMoment();
    }

    setIsSaving(false);
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from("gratitude_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error deleting entry",
        description: "Please try again later",
        variant: "destructive",
      });
    } else {
      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "Journal entry has been removed.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/relax")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Gratitude Journal</h1>
            <p className="text-sm text-muted-foreground">Reflect on what you're thankful for</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Write new entry */}
        {isWriting ? (
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-4 animate-fade-in">
            <Input
              placeholder="Give your journal a name..."
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              className="bg-muted/50 border-0 rounded-xl"
            />
            <Textarea
              placeholder="What are you grateful for today? Write about the moments, people, or things that brought you joy..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="bg-muted/50 border-0 rounded-xl min-h-[150px] resize-none"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setIsWriting(false)}
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={saveEntry}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Journal
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWriting(true)}
            className="w-full bg-gradient-to-br from-calm-lavender-light to-calm-mint-light rounded-2xl p-5 border border-primary/20 hover:shadow-card transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Write New Entry</span>
          </button>
        )}

        {/* Saved entries */}
        {entries.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Your Journals</h2>
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="bg-card rounded-2xl p-4 shadow-soft border border-border animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{entry.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.created_at)}</p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.content}</p>
              </div>
            ))}
          </div>
        )}

        {entries.length === 0 && !isWriting && (
          <div className="text-center py-12 animate-fade-in">
            <span className="text-4xl mb-4 block">📝</span>
            <p className="text-muted-foreground">No journal entries yet</p>
            <p className="text-sm text-muted-foreground">Start writing to capture your gratitude</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default GratitudeJournalPage;
