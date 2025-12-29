import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a sentiment analyzer. Analyze the emotional tone of the user's message and respond with ONLY a JSON object in this exact format:
{
  "score": <number 1-5>,
  "label": "<string>"
}

Score meanings:
1 = Very negative (distressed, angry, very sad)
2 = Somewhat negative (worried, frustrated, down)
3 = Neutral (calm, okay, mixed feelings)
4 = Somewhat positive (hopeful, content, relaxed)
5 = Very positive (happy, grateful, excited)

Labels should be a single descriptive word like: distressed, anxious, sad, frustrated, neutral, calm, hopeful, content, happy, grateful, excited, relieved

Respond with ONLY the JSON object, no other text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing mood for message:", message.substring(0, 50));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze mood");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response:", content);

    // Parse the JSON response
    let moodData;
    try {
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moodData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse mood response:", parseError);
      // Default to neutral if parsing fails
      moodData = { score: 3, label: "neutral" };
    }

    // Validate and clamp score
    moodData.score = Math.max(1, Math.min(5, Math.round(moodData.score || 3)));
    moodData.label = moodData.label || "neutral";

    console.log("Mood analysis result:", moodData);

    return new Response(JSON.stringify(moodData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mood analysis error:", error);
    return new Response(JSON.stringify({ score: 3, label: "neutral" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
