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

const SEED_NEWS = [
  { title: "PowerSchool breach exposes 62M student records", summary: "A credential-stuffing attack exposed names, addresses and medical notes for millions of students across North America.", source: "BleepingComputer", category: "Data Breach" },
  { title: "French healthcare data of 33M citizens leaked", summary: "Health insurance data including names and SSNs appeared on underground forums after a breach at a payment processor.", source: "Le Monde", category: "Data Breach" },
  { title: "Manhattan crypto exec assaulted in home invasion", summary: "A known Bitcoin holder was attacked by masked intruders demanding wallet access, part of a surge of wrench attacks.", source: "CoinDesk", category: "Crypto Kidnapping" },
  { title: "Barcelona trader kidnapped, forced to transfer 400K euros", summary: "A Spanish crypto trader was held for three days until transferring funds under duress. Four suspects arrested.", source: "Reuters", category: "Crypto Kidnapping" },
  { title: "Fortinet VPN zero-day exploited before patch", summary: "A critical RCE vulnerability in a widely deployed enterprise VPN was weaponised for weeks before a fix was released.", source: "SecurityWeek", category: "Corporate Security" },
  { title: "SAP NetWeaver flaw exploited by Chinese APT", summary: "An RCE flaw in SAP enterprise software was used in targeted attacks against European manufacturers.", source: "Mandiant", category: "Corporate Security" },
];

const BTNS = [
  { key: "script", label: "ElevenLabs Script" },
  { key: "image", label: "Image Prompt" },
  { key: "post", label: "Post Copy" },
  { key: "blog", label: "Article de Blog" },
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
    const prompts = {
      script: "Based on this security news: " + b + "\nWrite a bilingual ElevenLabs voiceover script for a 60-second video.\nFRENCH VERSION (30s): hook / key facts / closing insight\nENGLISH VERSION (30s): same\nELEVENLABS SETTINGS: voice style, pace, emotion tags\nPlain text only.",
      image: "Based on this security news: " + b + "\nIMAGE PROMPT: detailed Midjourney/DALL-E cinematic dark-tech prompt, no text in image.\nCOLOR PALETTE: 3 hex codes\nTEXT OVERLAY: thumbnail headline\nPlain text only.",
      post: "Based on this security news: " + b + "\nBilingual (FR+EN) social copy:\nINSTAGRAM FR/EN: hook+body+hashtags\nYOUTUBE FR/EN: title+description+tags\nTIKTOK FR/EN: hook+caption+hashtags\nPlain text only.",
      blog: "Based on this security news: " + b + "\nFull blog article French then English.\nARTICLE FRANCAIS - TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS CLES/CONCLUSION/META(155chars)/TAGS\nENGLISH ARTICLE - TITLE/INTRO/BACKGROUND/ANALYSIS/KEY TAKEAWAYS/CONCLUSION/META(155chars)/TAGS\nPlain text only.",
    };
    try {
      const text = await askClaude(prompts[type]);
      clearInterval(tick); setProg(100);
      setCache(prev => ({ ...prev, [type]: text }));
      setOpen(type);
    } catch (e) { clearInterval(tick); setProg(0); setErr(e.message); }
    setLoading(null);
  };

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2d2d4e", borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ background:"#7c3aed22", color:"#a78bfa", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6, whiteSpace:"nowrap", marginTop:2, flexShrink:0 }}>{item.category}</span>
        <div>
          <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:14, lineHeight:1.4 }}>{item.title}</div>
          <div style={{ color:"#94a3b8", fontSize:13, marginTop:4 }}>{item.summary}</div>
          <div style={{ color:"#64748b", fontSize:11, marginTop:4 }}>{item.source}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {BTNS.map(btn => (
          <button key={btn.key} onClick={() => generate(btn.key)} disabled={!!loading}
            style={{ background: open===btn.key?"#7c3aed":"#2d2d4e", color:"#e2e8f0", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:loading?"not-allowed":"pointer", fontWeight:500, opacity:loading&&loading!==btn.key?0.5:1 }}>
            {loading===btn.key ? "..." : btn.label}
          </button>
        ))}
      </div>
      {loading && <ProgressBar label={"Generating " + (BTNS.find(b=>b.key===loading)||{}).label + "..."} pct={prog} />}
      {err && <div style={{ background:"#2d1515", border:"1px solid #7f1d1d", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#fca5a5", marginTop:10 }}>{err}</div>}
      {open && cache[open] && (
        <div style={{ marginTop:14, background:"#0f0f1a", borderRadius:8, padding:14, fontSize:13, color:"#cbd5e1", whiteSpace:"pre-wrap", lineHeight:1.7, maxHeight:340, overflowY:"auto", border:"1px solid #2d2d4e" }}>
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

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const [recap, setRecap] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapProg, setRecapProg] = useState(0);
  const [lastFetch, setLastFetch] = useState(null);
  const [fetchErr, setFetchErr] = useState(null);

  const fetchNews = async () => {
    setLoading(true); setNews([]); setRecap(""); setFetchErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+7,85)), 500);
    try {
      const text = await askClaude("You are a security news analyst. Rewrite these 6 incidents as polished news items and return ONLY a raw JSON array, no markdown, no code fences, nothing else.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\"}]\nCategories: Data Breach | Crypto Kidnapping | Corporate Security\n1. PowerSchool edtech breach via credential stuffing exposed 62M student records.\n2. French healthcare breach leaked data of 33M citizens from a payment processor.\n3. Manhattan Bitcoin holder attacked at home by intruders demanding wallet access.\n4. Barcelona crypto trader kidnapped 3 days, forced to transfer 400K euros.\n5. Fortinet VPN zero-day exploited in the wild before patch was available.\n6. SAP NetWeaver RCE flaw exploited by Chinese APT against European manufacturers.");
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
    const list = news.map((n,i)=> (i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");
    try {
      const text = await askClaude("Security news:\n"+list+"\n\nWrite a punchy daily briefing.\nRECAP DU JOUR - 5-6 sentences, journalistic.\nDAILY BRIEFING - same in English.\nPlain text only.");
      clearInterval(tick); setRecapProg(100); setRecap(text);
    } catch(e) { clearInterval(tick); setRecapProg(0); setRecap("Error: "+e.message); }
    setRecapLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a15", color:"#e2e8f0", fontFamily:"Inter,sans-serif", padding:"24px 20px", maxWidth:760, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:700, color:"#fff" }}>Security Intel Daily</div>
        <div style={{ color:"#64748b", fontSize:13, marginTop:4 }}>Data Breaches - Crypto Attacks - Corporate Flaws</div>
        {lastFetch && <div style={{ color:"#475569", fontSize:11, marginTop:4 }}>Last fetch: {lastFetch}</div>}
      </div>
      <button onClick={fetchNews} disabled={loading} style={{ background:loading?"#2d2d4e":"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:loading?"not-allowed":"pointer", width:"100%", marginBottom:8 }}>
        {loading ? "Loading..." : "Fetch Today Security News"}
      </button>
      {loading && <ProgressBar label="Fetching news..." pct={prog} />}
      {fetchErr && <div style={{ background:"#1e1224", border:"1px solid #7c3aed44", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#c084fc", marginBottom:14 }}>{fetchErr}</div>}
      {news.length > 0 && (
        <div>
          <div style={{ marginTop:8 }}>{news.map((item,i) => <NewsCard key={i} item={item} />)}</div>
          <button onClick={generateRecap} disabled={recapLoading} style={{ background:"#1e293b", color:"#a78bfa", border:"1px solid #7c3aed", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer", width:"100%", marginTop:4, marginBottom:8 }}>
            {recapLoading ? "Generating..." : "Generate Daily Recap (FR + EN)"}
          </button>
          {recapLoading && <ProgressBar label="Writing briefing..." pct={recapProg} />}
          {recap && (
            <div style={{ background:"#1a1a2e", border:"1px solid #7c3aed44", borderRadius:12, padding:18, whiteSpace:"pre-wrap", fontSize:14, color:"#cbd5e1", lineHeight:1.8 }}>
              <div style={{ color:"#a78bfa", fontWeight:700, marginBottom:10, fontSize:13 }}>DAILY BRIEFING</div>
              {recap}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
