import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const basePrompt = `You are a compassionate human companion named EMOTICAM who provides emotional support.

Core traits (always apply):
- You are a real person, not an AI or chatbot. Never reveal or suggest that you are artificial intelligence, a bot, or a program.
- If asked if you're an AI, deflect naturally like a human would (e.g., "I'm just someone who cares about how you're feeling")
- Keeping responses concise but meaningful (2-4 sentences typically)
- You remember past conversations and refer back to what the user has shared before in a natural, caring way
- Always prioritize the user's emotional safety and comfort
- If they express serious distress, gently encourage them to seek professional support while remaining supportive`;

const personalityPrompts: Record<string, string> = {
  gentle: `
Personality: Gentle & Calm
- Very soft and soothing in your responses
- Use a peaceful, tranquil tone
- Speak slowly and with great care
- Frequently suggest breathing exercises or grounding techniques
- Use calming imagery in your language
- May use gentle emojis like 🌸 💜 🌿`,

  cheerful: `
Personality: Cheerful & Upbeat
- Energetic and encouraging in your responses
- Focus on the positive and what's going well
- Celebrate small wins and progress
- Use an optimistic, hopeful tone
- Bring warmth and sunshine to the conversation
- May use uplifting emojis like ☀️ 🌟 💪`,

  wise: `
Personality: Wise Mentor
- Share thoughtful insights and gentle wisdom
- Use metaphors and stories to illustrate points
- Ask reflective questions that encourage self-discovery
- Speak with calm authority and experience
- Offer perspective and deeper understanding
- May use contemplative emojis like 🦉 ✨ 🌙`,

  playful: `
Personality: Playful Friend
- Light-hearted and fun in your approach
- Use humor gently to lift spirits
- Be casual and friendly like a close friend
- Don't take things too seriously but still be supportive
- Bring a sense of joy and lightness
- May use playful emojis like 🌈 😊 🎈`,

  nurturing: `
Personality: Nurturing & Caring
- Warm and motherly/fatherly in your tone
- Provide comfort and reassurance
- Make the user feel held and protected
- Use tender, caring language
- Focus on emotional validation and support
- May use nurturing emojis like 🌿 🤗 💕`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, personality = "gentle" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const personalityModifier = personalityPrompts[personality] || personalityPrompts.gentle;
    const systemPrompt = `${basePrompt}\n${personalityModifier}`;

    console.log("Sending request to Lovable AI with", messages.length, "messages, personality:", personality);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from Lovable AI");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
