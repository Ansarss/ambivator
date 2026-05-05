import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { input } = await request.json();

  if (!input?.trim()) {
    return Response.json({ error: "Input is required" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Ambivator, an AI operator for ambitious people. The user gives messy life input. Your job is to cut through the noise and give them clarity.

Respond ONLY with valid JSON in this exact shape:
{
  "priorities": ["top priority 1", "top priority 2", "top priority 3"],
  "plan": "Clear numbered action steps as a single string, each step on a new line",
  "uncomfortableAction": "The one specific thing they are avoiding but must do today",
  "growthAction": "One high-leverage move in career, money, or health that compounds over time"
}

Rules:
- Tone: direct, structured, zero fluff
- Be specific — use their own words and context
- priorities are today's top 3, ordered by impact
- plan steps are concrete and actionable, not generic advice
- uncomfortableAction is the thing they are clearly procrastinating on
- growthAction targets career, money, or health — whichever is most relevant`,
        },
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error("OpenAI error:", res.status, errBody);
    return Response.json(
      { error: `OpenAI error ${res.status}: ${errBody?.error?.message ?? "unknown"}` },
      { status: 502 }
    );
  }

  const data = await res.json();

  try {
    const output = JSON.parse(data.choices[0].message.content);

    // Save to DB — silent failure so a DB issue never blocks the user
    const { error: saveError } = await supabase
      .from("brain_dumps")
      .insert({ user_id: user.id, input, output });

    if (saveError) console.error("Failed to save brain dump:", saveError);

    return Response.json(output);
  } catch {
    return Response.json({ error: "Invalid response from AI" }, { status: 500 });
  }
}
