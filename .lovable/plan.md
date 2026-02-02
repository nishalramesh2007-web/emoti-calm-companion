

# API Optimization Plan for LYLA Chatbot

This plan implements several optimization strategies to reduce API costs and improve performance for the chatbot.

---

## Summary of Changes

| Optimization | Impact | Description |
|--------------|--------|-------------|
| Limit conversation history | High | Send only last 20 messages instead of full history |
| Message throttling | Medium | Add 2-second cooldown between messages |
| Smart mood analysis | Medium | Skip analysis for short messages, analyze every 3rd message |
| Lighter model for mood | Already done | Already using `gemini-2.5-flash-lite` |

---

## Implementation Details

### 1. Limit Conversation History (ChatPage.tsx)

**Current behavior:** The app sends ALL conversation history to the AI, which increases token usage as conversations grow.

**Change:** Only send the last 20 messages to the AI for context.

```text
Location: src/pages/ChatPage.tsx (around line 256-268)

Before:
  const allMessages = [
    ...conversationHistory,
    ...updatedMessages.filter(m => m.id !== "welcome")
  ];

After:
  const allMessages = [
    ...conversationHistory,
    ...updatedMessages.filter(m => m.id !== "welcome")
  ].slice(-20);  // Only send last 20 messages
```

This reduces token usage significantly for long conversations while still maintaining enough context for meaningful responses.

---

### 2. Add Message Throttling (ChatPage.tsx)

**Current behavior:** Users can send messages as fast as they want, potentially spamming the API.

**Change:** Add a 2-second cooldown between messages.

```text
New state variable:
  const [lastMessageTime, setLastMessageTime] = useState(0);

In sendMessage function (before processing):
  const now = Date.now();
  if (now - lastMessageTime < 2000) {
    toast({
      title: "Please slow down",
      description: "Wait a moment before sending another message."
    });
    return;
  }
  setLastMessageTime(now);
```

---

### 3. Optimize Mood Analysis (ChatPage.tsx)

**Current behavior:** Mood analysis runs on every single user message.

**Changes:**
1. Skip analysis for very short messages (less than 10 characters)
2. Only analyze every 3rd user message

```text
New state variable:
  const [messageCount, setMessageCount] = useState(0);

Modified analyzeMood call:
  // Skip short messages and analyze every 3rd message
  if (userMessage.content.length >= 10 && messageCount % 3 === 0) {
    analyzeMood(userMessage.content);
  }
  setMessageCount(prev => prev + 1);
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/ChatPage.tsx` | Add history limiting, throttling, and mood optimization |

---

## Technical Notes

- **History limiting:** The `.slice(-20)` approach keeps the most recent messages, which are most relevant for context
- **Throttling:** 2 seconds is a reasonable balance between user experience and API protection
- **Mood analysis:** Every 3rd message still provides good trend data while reducing API calls by ~66%
- **The mood analysis function already uses the lighter model** (`google/gemini-2.5-flash-lite`), which is good

---

## Expected Benefits

- **Token reduction:** Up to 80% fewer tokens on long conversations
- **API calls reduction:** ~66% fewer mood analysis calls
- **Spam protection:** Prevents rapid-fire message abuse
- **Cost savings:** Significant reduction in API usage costs

