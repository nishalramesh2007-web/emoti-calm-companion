const GUEST_MODE_KEY = "emoticam_guest_mode";
const GUEST_ENTRIES_KEY = "emoticam_guest_journal_entries";
const GUEST_MESSAGES_KEY = "emoticam_guest_chat_messages";
const GUEST_STATS_KEY = "emoticam_guest_stats";

export const isGuestMode = (): boolean => {
  return localStorage.getItem(GUEST_MODE_KEY) === "true";
};

export const enableGuestMode = () => {
  localStorage.setItem(GUEST_MODE_KEY, "true");
  // Initialize guest stats
  if (!localStorage.getItem(GUEST_STATS_KEY)) {
    localStorage.setItem(GUEST_STATS_KEY, JSON.stringify({ checkIns: 0, calmMoments: 0, currentStreak: 0 }));
  }
};

export const disableGuestMode = () => {
  localStorage.removeItem(GUEST_MODE_KEY);
  localStorage.removeItem(GUEST_ENTRIES_KEY);
  localStorage.removeItem(GUEST_MESSAGES_KEY);
  localStorage.removeItem(GUEST_STATS_KEY);
};

export const getGuestStats = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_STATS_KEY) || '{"checkIns":0,"calmMoments":0,"currentStreak":0}');
  } catch {
    return { checkIns: 0, calmMoments: 0, currentStreak: 0 };
  }
};

export const updateGuestStats = (update: Partial<{ checkIns: number; calmMoments: number; currentStreak: number }>) => {
  const current = getGuestStats();
  localStorage.setItem(GUEST_STATS_KEY, JSON.stringify({ ...current, ...update }));
};

export const getGuestJournalEntries = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_ENTRIES_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveGuestJournalEntry = (entry: { id: string; name: string; content: string; created_at: string; emotionTag?: string }) => {
  const entries = getGuestJournalEntries();
  entries.unshift(entry);
  localStorage.setItem(GUEST_ENTRIES_KEY, JSON.stringify(entries));
};

export const deleteGuestJournalEntry = (id: string) => {
  const entries = getGuestJournalEntries().filter((e: any) => e.id !== id);
  localStorage.setItem(GUEST_ENTRIES_KEY, JSON.stringify(entries));
};
