import { useState } from "react";

async function askClaude(prompt) {
  const r = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || JSON.stringify(d));
  if (!d.text) throw new Error("Empty response");
  return d.text;
}

function ProgressBar({ label, pct }) {
  return (
    <div style={{ margin: "12px 0" }}>
      <div style={{ fontSize: 12, color: "#a78bfa", marginBottom: 5 }}>{label}</div>
      <div style={{ background: "#1e1e3a", borderRadius: 99, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#7c3aed,#4f46e5)", width: pct + "%", transition: "width 0.35s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: "#475569", marginTop: 3, textAlign: "right" }}>{pct}%</div>
    </div>
  );
}

const VIRAL_COLORS = { high: "#22c55e", medium: "#f59e0b", low: "#ef4444" };

function ViralScore({ score }) {
  const color = score >= 7 ? VIRAL_COLORS.high : score >= 4 ? VIRAL_COLORS.medium : VIRAL_COLORS.low;
  const label = score >= 7 ? "Viral" : score >= 4 ? "Moyen" : "Faible";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
      <div style={{ background: color + "22", border: "1px solid " + color, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, color }}>
        🔥 {score}/10 — {label}
      </div>
    </div>
  );
}

const SEED_NEWS = [
  { title: "PowerSchool breach exposes 62M student records", summary: "A credential-stuffing attack exposed names, addresses and medical notes for millions of students across North America.", source: "BleepingComputer", category: "Data Breach", viral: 8, trend: "📈 +340% searches" },
  { title: "French healthcare data of 33M citizens leaked", summary: "Health insurance data including names and SSNs appeared on underground forums after a breach at a payment processor.", source: "Le Monde", category: "Data Breach", viral: 9, trend: "📈 +520% searches" },
  { title: "Manhattan crypto exec assaulted in home invasion", summary: "A known Bitcoin holder was attacked by masked intruders demanding wallet access.", source: "CoinDesk", category: "Crypto Kidnapping", viral: 9, trend: "📈 +780% searches" },
  { title: "Barcelona trader kidnapped, forced to transfer 400K euros", summary: "A Spanish crypto trader was held for three days until transferring funds under duress.", source: "Reuters", category: "Crypto Kidnapping", viral: 8, trend: "📈 +410% searches" },
  { title: "Fortinet VPN zero-day exploited before patch", summary: "A critical RCE flaw in enterprise VPN was weaponised for weeks before a fix was released.", source: "SecurityWeek", category: "Corporate Security", viral: 6, trend: "📈 +190% searches" },
  { title: "SAP NetWeaver flaw exploited by Chinese APT", summary: "An RCE flaw in SAP software was used in targeted attacks against European manufacturers.", source: "Mandiant", category: "Corporate Security", viral: 7, trend: "📈 +230% searches" },
];

const BTNS = [
  { key: "script", label: "🎙️ Script ElevenLabs" },
  { key: "image",  label: "🖼️ Image Prompt" },
  { key: "post",   label: "📱 Post Copy" },
  { key: "blog",   label: "✍️ Blog" },
  { key: "thread", label: "🧵 Thread X" },
  { key: "formats",label: "🔁 Variations" },
];

function NewsCard({ item }) {
  const [open, setOpen] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(null);
  const [err, setErr] = useState(null);
  const [prog, setProg] = useState(0);

  const generate = async (type) => {
    if (cache[type]) { setOpen(type); return; }
    setLoading(type); setErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p + 8, 85)), 400);
    const b = item.title + " - " + item.summary;
    const tone = "Ton: vulgarisation grand public, accessible, accrocheur. Marque: BustedData.";
    const prompts = {
      script: tone + " Based on: " + b + "\nWrite bilingual ElevenLabs voiceover script 60s.\nFRENCH (30s): hook choc / faits clés / insight\nENGLISH (30s): same\nELEVENLABS SETTINGS: voice, pace, emotion tags\nPlain text only.",
      image: "Based on: " + b + "\nIMAGE PROMPT: cinematic dark-tech Midjourney/DALL-E, no text in image.\nCOLOR PALETTE: 3 hex\nTEXT OVERLAY: headline thumbnail BustedData\nPlain text only.",
      post: tone + " Based on: " + b + "\nBilingual social copy:\nINSTAGRAM FR/EN: hook+body+hashtags\nYOUTUBE FR/EN: title+description+tags\nTIKTOK FR/EN: hook+caption+hashtags\nPlain text only.",
      blog: tone + " Based on: " + b + "\nBlog article FR then EN.\nFR: TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS CLES/CONCLUSION/META/TAGS\nEN: TITLE/INTRO/BACKGROUND/ANALYSIS/KEY TAKEAWAYS/CONCLUSION/META/TAGS\nPlain text only.",
      thread: tone + " Based on: " + b + "\nCreate a viral Twitter/X thread in French AND English.\nFR THREAD: 7 tweets numbered, hook tweet 1, facts 2-5, insight 6, CTA 7. Max 280 chars each.\nEN THREAD: same structure.\nPlain text only.",
      formats: tone + " Based on: " + b + "\nGenerate 3 content format variations:\nFORMAT 1 - TIKTOK 15s: ultra-short hook script\nFORMAT 2 - YOUTUBE 60s: full script with intro/body/outro\nFORMAT 3 - CARROUSEL INSTAGRAM: 5 slides titles + captions\nAll bilingual FR/EN. Plain text only.",
    };
    try {
      const text = await askClaude(prompts[type]);
      clearInterval(tick); setProg(100);
      setCache(prev => ({ ...prev, [type]: text }));
      setOpen(type);
    } catch (e) { clearInterval(tick); setProg(0); setErr(e.message); }
    setLoading(null);
  };

  const exportPack = () => {
    const keys = Object.keys(cache);
    if (!keys.length) { alert("Generate at least one content first."); return; }
    let txt = "=== BUSTEDDATA CONTENT PACK ===\n";
    txt += "News: " + item.title + "\n";
    txt += "Category: " + item.category + " | Viral Score: " + (item.viral || "N/A") + "/10\n";
    txt += "=".repeat(50) + "\n\n";
    keys.forEach(k => { txt += "--- " + (BTNS.find(b=>b.key===k)||{label:k}).label + " ---\n" + cache[k] + "\n\n"; });
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = item.title.slice(0,30).replace(/[^a-z0-9]/gi,"_") + "_pack.txt";
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2d2d4e", borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ background:"#7c3aed22", color:"#a78bfa", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6, whiteSpace:"nowrap", marginTop:2, flexShrink:0 }}>{item.category}</span>
        <div style={{ flex:1 }}>
          <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, lineHeight:1.4 }}>{item.title}</div>
          <div style={{ color:"#94a3b8", fontSize:13, marginTop:4 }}>{item.summary}</div>
          <div style={{ display:"flex", gap:12, marginTop:6, flexWrap:"wrap" }}>
            <div style={{ color:"#64748b", fontSize:11 }}>📎 {item.source}</div>
            {item.trend && <div style={{ color:"#22d3ee", fontSize:11 }}>{item.trend}</div>}
          </div>
          {item.viral && <ViralScore score={item.viral} />}
        </div>
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
        {BTNS.map(btn => (
          <button key={btn.key} onClick={() => generate(btn.key)} disabled={!!loading}
            style={{ background: open===btn.key?"#7c3aed":"#2d2d4e", color:"#e2e8f0", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, cursor:loading?"not-allowed":"pointer", fontWeight:500, opacity:loading&&loading!==btn.key?0.5:1 }}>
            {loading===btn.key ? "⏳" : btn.label}
          </button>
        ))}
        <button onClick={exportPack} style={{ background:"#064e3b", color:"#6ee7b7", border:"1px solid #065f46", borderRadius:8, padding:"5px 11px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
          📦 Export Pack
        </button>
      </div>

      {loading && <ProgressBar label={"Generating " + (BTNS.find(b=>b.key===loading)||{}).label + "..."} pct={prog} />}
      {err && <div style={{ background:"#2d1515", border:"1px solid #7f1d1d", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#fca5a5", marginTop:8 }}>{err}</div>}

      {open && cache[open] && (
        <div style={{ marginTop:12, background:"#0f0f1a", borderRadius:8, padding:14, fontSize:13, color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.7, maxHeight:340, overflowY:"auto", border:"1px solid #2d2d4e" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#a78bfa", fontWeight:600, fontSize:12 }}>{(BTNS.find(b=>b.key===open)||{}).label}</span>
            <button onClick={() => navigator.clipboard.writeText(cache[open])} style={{ background:"none", border:"1px solid #2d2d4e", color:"#94a3b8", borderRadius:4, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>Copy</button>
          </div>
          {cache[open]}
        </div>
      )}
    </div>
  );
}

function HashtagTracker({ news }) {
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);

  const generate = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    const titles = news.map(n=>n.title).join(", ");
    try {
      const text = await askClaude("Based on these security news topics: " + titles + "\n\nGenerate a hashtag strategy for BustedData (vulgarisation grand public).\n\nFR HASHTAGS: 10 hashtags French ranked by potential reach (data security, cyber, vie privée)\nEN HASHTAGS: 10 hashtags English ranked by potential reach\nTRENDING NOW: 5 hashtags currently trending related to these topics\nTO AVOID: 3 overused/shadowbanned hashtags\n\nPlain text only.");
      clearInterval(tick); setProg(100); setTags(text);
    } catch(e) { clearInterval(tick); setProg(0); setTags("Error: "+e.message); }
    setLoading(false);
  };

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2d2d4e", borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, marginBottom:10 }}>🏷️ Hashtag Tracker BustedData</div>
      <button onClick={generate} disabled={loading} style={{ background:"#1e293b", color:"#22d3ee", border:"1px solid #164e63", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, cursor:"pointer", width:"100%", marginBottom:8 }}>
        {loading ? "⏳ Analysing..." : "🔍 Generate Hashtag Strategy"}
      </button>
      {loading && <ProgressBar label="Analysing trends..." pct={prog} />}
      {tags && (
        <div style={{ background:"#0f0f1a", borderRadius:8, padding:14, fontSize:13, color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.8, border:"1px solid #2d2d4e" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#22d3ee", fontWeight:600, fontSize:12 }}>🏷️ Hashtag Strategy</span>
            <button onClick={() => navigator.clipboard.writeText(tags)} style={{ background:"none", border:"1px solid #2d2d4e", color:"#94a3b8", borderRadius:4, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>Copy</button>
          </div>
          {tags}
        </div>
      )}
    </div>
  );
}

function TrendAnalysis({ news }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);

  const generate = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    const items = news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title).join("\n");
    try {
      const text = await askClaude("Analyse these security news for BustedData (vulgarisation grand public):\n"+items+"\n\nProvide:\nTREND ANALYSIS FR: dominant themes, rising topics, audience interest (5-6 sentences)\nTREND ANALYSIS EN: same in English\nCONTENT OPPORTUNITIES: 3 unique angle ideas for BustedData not covered by mainstream media\nBEST POSTING TIME: recommended days/hours for each platform (IG, TikTok, YouTube, X)\nPlain text only.");
      clearInterval(tick); setProg(100); setAnalysis(text);
    } catch(e) { clearInterval(tick); setProg(0); setAnalysis("Error: "+e.message); }
    setLoading(false);
  };

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2d2d4e", borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, marginBottom:10 }}>📊 Analyse de Tendances</div>
      <button onClick={generate} disabled={loading} style={{ background:"#1e293b", color:"#f59e0b", border:"1px solid #78350f", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, cursor:"pointer", width:"100%", marginBottom:8 }}>
        {loading ? "⏳ Analysing..." : "📈 Analyser les tendances"}
      </button>
      {loading && <ProgressBar label="Trend analysis in progress..." pct={prog} />}
      {analysis && (
        <div style={{ background:"#0f0f1a", borderRadius:8, padding:14, fontSize:13, color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.8, border:"1px solid #2d2d4e" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#f59e0b", fontWeight:600, fontSize:12 }}>📊 Tendances</span>
            <button onClick={() => navigator.clipboard.writeText(analysis)} style={{ background:"none", border:"1px solid #2d2d4e", color:"#94a3b8", borderRadius:4, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>Copy</button>
          </div>
          {analysis}
        </div>
      )}
    </div>
  );
}

function EditorialCalendar({ news }) {
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);

  const generate = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    const items = news.map((n,i)=>(i+1)+". [Score:"+n.viral+"/10] "+n.title+" ("+n.category+")").join("\n");
    try {
      const text = await askClaude("Create a 7-day editorial calendar for BustedData (security news vulgarisation) based on these stories:\n"+items+"\n\nFORMAT for each day:\nDAY X - [Date placeholder]\nPLATFORM: [IG/TikTok/YouTube/X]\nCONTENT: [which story + format]\nTIME: [best posting time]\nFR CAPTION HOOK: [opening line]\n\nPrioritize by viral score. Include rest days. Plain text only.");
      clearInterval(tick); setProg(100); setCalendar(text);
    } catch(e) { clearInterval(tick); setProg(0); setCalendar("Error: "+e.message); }
    setLoading(false);
  };

  const exportCal = () => {
    if (!calendar) return;
    const blob = new Blob([calendar], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="busteddata_calendar.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2d2d4e", borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, marginBottom:10 }}>🗓️ Calendrier Éditorial 7 jours</div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={generate} disabled={loading} style={{ background:"#1e293b", color:"#c084fc", border:"1px solid #581c87", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, cursor:"pointer", flex:1, marginBottom:8 }}>
          {loading ? "⏳ Generating..." : "🗓️ Générer le calendrier"}
        </button>
        {calendar && <button onClick={exportCal} style={{ background:"#064e3b", color:"#6ee7b7", border:"1px solid #065f46", borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>⬇️</button>}
      </div>
      {loading && <ProgressBar label="Building editorial calendar..." pct={prog} />}
      {calendar && (
        <div style={{ background:"#0f0f1a", borderRadius:8, padding:14, fontSize:13, color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.8, maxHeight:400, overflowY:"auto", border:"1px solid #2d2d4e" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#c084fc", fontWeight:600, fontSize:12 }}>🗓️ Editorial Calendar</span>
            <button onClick={() => navigator.clipboard.writeText(calendar)} style={{ background:"none", border:"1px solid #2d2d4e", color:"#94a3b8", borderRadius:4, padding:"2px 8px", fontSize:11, cursor:"pointer" }}>Copy</button>
          </div>
          {calendar}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const [recap, setRecap] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapProg, setRecapProg] = useState(0);
  const [lastFetch, setLastFetch] = useState(null);
  const [fetchErr, setFetchErr] = useState(null);
  const [tab, setTab] = useState("news");

  const fetchNews = async () => {
    setLoading(true); setNews([]); setRecap(""); setFetchErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+7,85)), 500);
    try {
      const text = await askClaude("You are a security news analyst for BustedData (vulgarisation grand public). Rewrite these 6 incidents as polished news items and return ONLY a raw JSON array, no markdown, no code fences.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER_1_TO_10,\"trend\":\"trending indicator\"}]\nCategories: Data Breach | Crypto Kidnapping | Corporate Security\n1. PowerSchool edtech breach exposed 62M student records.\n2. French healthcare breach leaked 33M citizens data.\n3. Manhattan Bitcoin holder attacked by home intruders.\n4. Barcelona crypto trader kidnapped 3 days, lost 400K euros.\n5. Fortinet VPN zero-day exploited before patch.\n6. SAP NetWeaver RCE flaw exploited by Chinese APT.\nFor viral score: rate newsworthiness 1-10 for general public. For trend: write short trending indicator like emoji + percentage.");
      clearInterval(tick); setProg(95);
      let parsed = [];
      try { const m = text.match(/\[[\s\S]*\]/); if (m) parsed = JSON.parse(m[0]); } catch {}
      if (!parsed.length) { parsed = SEED_NEWS; setFetchErr("Using cached news."); }
      setNews(parsed); setLastFetch(new Date().toLocaleString("fr-FR")); setProg(100);
    } catch(e) { clearInterval(tick); setProg(0); setFetchErr(e.message); setNews(SEED_NEWS); setLastFetch(new Date().toLocaleString("fr-FR")); }
    setLoading(false);
  };

  const generateRecap = async () => {
    if (!news.length) return;
    setRecapLoading(true); setRecapProg(10);
    const tick = setInterval(() => setRecapProg(p => Math.min(p+9,85)), 400);
    const list = news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");
    try {
      const text = await askClaude("BustedData daily briefing. Tone: vulgarisation grand public, punchy.\nNews:\n"+list+"\n\nRECAP DU JOUR (FR) - 5-6 sentences journalistiques, hook fort.\nDAILY BRIEFING (EN) - same.\nPlain text only.");
      clearInterval(tick); setRecapProg(100); setRecap(text);
    } catch(e) { clearInterval(tick); setRecapProg(0); setRecap("Error: "+e.message); }
    setRecapLoading(false);
  };

  const TABS = [
    { id: "news", label: "📰 News" },
    { id: "trends", label: "📊 Tendances" },
    { id: "hashtags", label: "🏷️ Hashtags" },
    { id: "calendar", label: "🗓️ Calendrier" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a15", color:"#e2e8f0", fontFamily:"Inter,sans-serif", padding:"0 0 40px" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a1a2e,#0f0f1a)", borderBottom:"1px solid #2d2d4e", padding:"20px 24px 16px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:-0.5 }}>🛡️ BustedData</div>
            <span style={{ background:"#7c3aed22", color:"#a78bfa", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99, border:"1px solid #7c3aed44" }}>INTEL DAILY</span>
          </div>
          <div style={{ color:"#64748b", fontSize:12 }}>Data Breaches · Crypto Attacks · Corporate Flaws — Vulgarisation Grand Public</div>
          {lastFetch && <div style={{ color:"#475569", fontSize:11, marginTop:4 }}>🕐 Last fetch: {lastFetch}</div>}
        </div>
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"20px 24px 0" }}>
        {/* Fetch button */}
        <button onClick={fetchNews} disabled={loading} style={{ background:loading?"#2d2d4e":"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", width:"100%", marginBottom:8, letterSpacing:0.2 }}>
          {loading ? "🔍 Chargement des news..." : "🔄 Fetch Today's Security News"}
        </button>
        {loading && <ProgressBar label="Fetching & scoring news..." pct={prog} />}
        {fetchErr && <div style={{ background:"#1e1224", border:"1px solid #7c3aed44", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#c084fc", marginBottom:14 }}>ℹ️ {fetchErr}</div>}

        {news.length > 0 && (
          <>
            {/* Tabs */}
            <div style={{ display:"flex", gap:4, marginBottom:16, background:"#1a1a2e", borderRadius:10, padding:4, border:"1px solid #2d2d4e" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, background:tab===t.id?"#7c3aed":"transparent", color:tab===t.id?"#fff":"#64748b", border:"none", borderRadius:7, padding:"8px 4px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* News tab */}
            {tab === "news" && (
              <>
                {news.map((item,i) => <NewsCard key={i} item={item} />)}
                <button onClick={generateRecap} disabled={recapLoading} style={{ background:"#1e293b", color:"#a78bfa", border:"1px solid #7c3aed", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer", width:"100%", marginTop:4, marginBottom:8 }}>
                  {recapLoading ? "⏳ Generating..." : "📋 Daily Recap BustedData (FR + EN)"}
                </button>
                {recapLoading && <ProgressBar label="Writing briefing..." pct={recapProg} />}
                {recap && (
                  <div style={{ background:"#1a1a2e", border:"1px solid #7c3aed44", borderRadius:12, padding:18, whiteSpace:"pre-wrap", fontSize:14, color:"#cbd5e1", lineHeight:1.8 }}>
                    <div style={{ color:"#a78bfa", fontWeight:700, marginBottom:10, fontSize:13 }}>📋 DAILY BRIEFING — BUSTEDDATA</div>
                    {recap}
                  </div>
                )}
              </>
            )}

            {/* Trends tab */}
            {tab === "trends" && <TrendAnalysis news={news} />}

            {/* Hashtags tab */}
            {tab === "hashtags" && <HashtagTracker news={news} />}

            {/* Calendar tab */}
            {tab === "calendar" && <EditorialCalendar news={news} />}
          </>
        )}
      </div>
    </div>
  );
        }
