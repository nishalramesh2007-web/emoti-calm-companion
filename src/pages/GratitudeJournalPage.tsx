import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

interface JournalEntry {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

const GratitudeJournalPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [journalName, setJournalName] = useState("");
  const [journalContent, setJournalContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("gratitude_journals");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!journalName.trim() || !journalContent.trim()) {
      toast({
        title: "Please fill in both fields",
        description: "Give your journal a name and write something you're grateful for.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      name: journalName.trim(),
      content: journalContent.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("gratitude_journals", JSON.stringify(updatedEntries));

    toast({
      title: "Journal saved ✨",
      description: "Your gratitude has been recorded.",
    });

    setJournalName("");
    setJournalContent("");
    setIsWriting(false);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("gratitude_journals", JSON.stringify(updatedEntries));
    toast({
      title: "Entry deleted",
      description: "Journal entry has been removed.",
    });
  };

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
              >
                Cancel
              </Button>
              <Button
                onClick={saveEntry}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
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
                    <p className="text-xs text-muted-foreground">{entry.createdAt}</p>
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
