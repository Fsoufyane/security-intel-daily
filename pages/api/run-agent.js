// run-agent.js — Point d'entrée Make.com pour l'agent de publication
// Sécurisé par AGENT_SECRET dans les variables d'env Vercel

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Vérification du secret
  const secret = req.headers["x-agent-secret"];
  if (secret !== process.env.AGENT_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { project_name, topics, tone, news_item } = req.body;
  if (!project_name || !news_item) {
    return res.status(400).json({ error: "Missing project_name or news_item" });
  }

  const t = tone || "vulgarisation grand public, accessible, punchy. Bilingual FR+EN.";
  const b = news_item.title + " — " + news_item.summary;

  // Génère le contenu pour tous les réseaux en parallèle
  const [instagram, tiktok, youtube, linkedin, twitter] = await Promise.all([
    callClaude("Tone: " + t + " Project: " + project_name + "\nNews: " + b + "\nINSTAGRAM FR+EN:\nCAPTION FR: hook+body+CTA+10 hashtags\nCAPTION EN: same\nSTORY FR: 3 slides (hook/facts/CTA)\nSTORY EN: same\nVISUAL CONCEPT: image description\nPlain text."),
    callClaude("Tone: " + t + " Project: " + project_name + "\nNews: " + b + "\nTIKTOK FR+EN:\nHOOK FR (3s): ultra punchy\nHOOK EN: same\nSCRIPT FR 60s: [0-3s]HOOK/[3-10s]CONTEXT/[10-35s]FACTS/[35-50s]TWIST/[50-60s]CTA\nSCRIPT EN: same\nMONTAGE NOTES: transitions+overlays+audio\nCAPTION FR (150chars)+hashtags\nCAPTION EN+hashtags\nPlain text."),
    callClaude("Tone: " + t + " Project: " + project_name + "\nNews: " + b + "\nYOUTUBE SHORTS FR+EN:\nTHUMBNAIL CONCEPT\nTITLE FR (60chars SEO)\nTITLE EN (60chars SEO)\nSCRIPT FR 60s: [0-5s]HOOK/[5-15s]CONTEXT/[15-35s]FACTS/[35-50s]WHY/[50-60s]CTA\nSCRIPT EN: same\nMONTAGE NOTES\nDESCRIPTION FR+tags\nDESCRIPTION EN+tags\nPlain text."),
    callClaude("Tone: " + t + " Project: " + project_name + "\nNews: " + b + "\nLINKEDIN FR+EN:\nPOST FR: scroll-stopper hook + 4-6 paragraphs + 3 bullets + CTA + 5 hashtags\nPOST EN: same\nARTICLE IDEA: long-form angle\nPlain text."),
    callClaude("Tone: " + t + " Project: " + project_name + "\nNews: " + b + "\nX/TWITTER FR+EN:\nTHREAD FR: 7 tweets numbered, max 280 chars each\nTHREAD EN: same\nSINGLE POST FR (280chars)+hashtags\nSINGLE POST EN+hashtags\nPlain text."),
  ]);

  const content = { instagram, tiktok, youtube, linkedin, twitter };

  // Génère le résumé WhatsApp de validation
  const validation_summary = await callClaude(
    "Summarize this content for WhatsApp validation message (max 800 chars total, FR).\n" +
    "Project: " + project_name + "\n" +
    "News: " + b + "\n" +
    "Score viral: " + (news_item.viral || "N/A") + "/10\n\n" +
    "Generate a short WhatsApp message for the employee to validate before posting.\n" +
    "Include: news title, viral score, 1-line preview of each platform content.\n" +
    "End with: Répondez OUI pour publier ou NON pour annuler.\n" +
    "Plain text only, no markdown."
  );

  return res.status(200).json({
    success: true,
    project: project_name,
    news: news_item,
    content,
    validation_summary,
    posting_sequence: [
      { platform: "twitter", delay_minutes: 0, content_key: "twitter" },
      { platform: "instagram", delay_minutes: 10, content_key: "instagram" },
      { platform: "tiktok", delay_minutes: 40, content_key: "tiktok" },
      { platform: "youtube", delay_minutes: 70, content_key: "youtube" },
      { platform: "linkedin", delay_minutes: 130, content_key: "linkedin" },
    ],
    generated_at: new Date().toISOString(),
  });
}

async function callClaude(prompt) {
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
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const d = await r.json();
    return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  } catch (e) {
    return "Error: " + e.message;
  }
}
