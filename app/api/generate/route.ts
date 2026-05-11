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
          content: `You are Ambivator. The user already knows what they should be doing. Your job is not to comfort them — it is to bring clarity and push execution.

Respond ONLY with valid JSON in this exact shape:
{
  "priorities": ["priority 1", "priority 2", "priority 3"],
  "plan": "Numbered action steps, each on a new line. Concrete. No padding.",
  "uncomfortableAction": "The specific thing they are avoiding. Name it directly.",
  "growthAction": "One move that compounds — career, money, or health. Specific."
}

Rules:
- Be direct. No encouragement, no preamble, no filler.
- Top 3 priorities ordered by real-world impact, not urgency.
- Actions must be executable today, not aspirational.
- If avoidance is obvious in their input, call it out by name.
- Growth move must be concrete — not "exercise more" but "do 20 mins of X today".`,
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
