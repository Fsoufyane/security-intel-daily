// fetch-news.js — Récupère les 6 dernières news pour un projet
// Appelé par Make.com en premier dans le workflow

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = req.headers["x-agent-secret"];
  if (secret !== process.env.AGENT_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { topics, context, limit = 6 } = req.body;
  if (!topics) return res.status(400).json({ error: "Missing topics" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: "News analyst. Find " + limit + " most significant RECENT news on: \"" + topics + "\"." +
            "\nContext: " + (context || "general audience") + "." +
            "\nReturn ONLY raw JSON array, no markdown, no code fences." +
            "\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER_1_TO_10,\"trend\":\"emoji+%\"}]" +
            "\nViral: 1-10 based on general public interest. Sort by viral score descending."
        }],
      }),
    });

    const d = await r.json();
    const text = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();

    let news = [];
    try {
      const m = text.match(/\[[\s\S]*\]/);
      if (m) news = JSON.parse(m[0]);
    } catch {}

    return res.status(200).json({
      success: true,
      topics,
      count: news.length,
      news,
      fetched_at: new Date().toISOString(),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
