import { useState } from "react";

const T = {
  fr: {
    fetch: "Récupérer les news du jour",
    fetching: "Chargement...",
    tabs: ["News","Tendances","Hashtags","Calendrier","Projets"],
    recap: "Récap quotidien BustedData (FR + EN)",
    generating: "Génération...",
    analyse: "Analyser les tendances",
    hashtags: "Générer la stratégie hashtags",
    calendar: "Générer le calendrier",
    export: "Export Pack",
    copy: "Copier",
    addProject: "Nouveau projet",
    projectName: "Nom du projet",
    projectTopic: "Sujet / thématique",
    projectDesc: "Description & type de contenu recherché",
    projectPlaceholder: "Ex: Actualités IA pour startup tech, ton vulgarisation, posts LinkedIn + TikTok...",
    projectSave: "Créer le projet",
    projectSearch: "Rechercher du contenu",
    searching: "Recherche en cours...",
    noProjects: "Aucun projet. Créez-en un pour commencer.",
    lastFetch: "Dernière mise à jour",
    viral: ["Faible","Moyen","Viral"],
    cached: "News en cache — connexion limitée.",
    btns: ["🎙️ Script ElevenLabs","🖼️ Image Prompt","📱 Post Copy","✍️ Blog","🧵 Thread X","🔁 Variations"],
  },
  en: {
    fetch: "Fetch today's news",
    fetching: "Loading...",
    tabs: ["News","Trends","Hashtags","Calendar","Projects"],
    recap: "Daily Recap BustedData (FR + EN)",
    generating: "Generating...",
    analyse: "Analyse trends",
    hashtags: "Generate hashtag strategy",
    calendar: "Generate calendar",
    export: "Export Pack",
    copy: "Copy",
    addProject: "New project",
    projectName: "Project name",
    projectTopic: "Topic / theme",
    projectDesc: "Description & content type",
    projectPlaceholder: "E.g. AI news for tech startup, casual tone, LinkedIn + TikTok posts...",
    projectSave: "Create project",
    projectSearch: "Search content",
    searching: "Searching...",
    noProjects: "No projects yet. Create one to get started.",
    lastFetch: "Last fetch",
    viral: ["Low","Medium","Viral"],
    cached: "Using cached news.",
    btns: ["🎙️ ElevenLabs Script","🖼️ Image Prompt","📱 Post Copy","✍️ Blog","🧵 X Thread","🔁 Variations"],
  }
};

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

const s = {
  shell: { maxWidth: 820, margin: "0 auto", fontFamily: "Inter,system-ui,sans-serif" },
  topbar: { background: "var(--color-background-primary,#fff)", borderBottom: "0.5px solid var(--color-border-tertiary,#e5e7eb)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: { width: 32, height: 32, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 },
  logoName: { fontSize: 15, fontWeight: 600, color: "var(--color-text-primary,#111)" },
  logoBadge: { fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#EEEDFE", color: "#534AB7", border: "0.5px solid #AFA9EC" },
  topRight: { display: "flex", alignItems: "center", gap: 10 },
  lastFetch: { fontSize: 11, color: "var(--color-text-secondary,#6b7280)" },
  langBtn: (active) => ({ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, border: "0.5px solid " + (active ? "#7F77DD" : "var(--color-border-secondary,#d1d5db)"), background: active ? "#EEEDFE" : "transparent", color: active ? "#534AB7" : "var(--color-text-secondary,#6b7280)", cursor: "pointer" }),
  main: { padding: "18px 20px" },
  fetchBtn: (loading) => ({ width: "100%", padding: "11px", background: loading ? "var(--color-background-secondary,#f3f4f6)" : "#7F77DD", color: loading ? "var(--color-text-secondary,#6b7280)" : "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }),
  tabs: { display: "flex", gap: 3, background: "var(--color-background-secondary,#f3f4f6)", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 10, padding: 3, marginBottom: 14 },
  tab: (active) => ({ flex: 1, padding: "6px 2px", fontSize: 11, fontWeight: 500, border: active ? "0.5px solid var(--color-border-tertiary,#e5e7eb)" : "none", borderRadius: 8, cursor: "pointer", color: active ? "var(--color-text-primary,#111)" : "var(--color-text-secondary,#6b7280)", background: active ? "var(--color-background-primary,#fff)" : "transparent" }),
  card: { background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
  cardTop: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
  catBadge: (type) => { const m = { "Data Breach": ["#FAECE7","#993C1D","#F0997B"], "Crypto Kidnapping": ["#FAEEDA","#854F0B","#EF9F27"], "Corporate Security": ["#E6F1FB","#185FA5","#85B7EB"] }[type] || ["#F1EFE8","#5F5E5A","#B4B2A9"]; return { fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2, background: m[0], color: m[1], border: "0.5px solid " + m[2] }; },
  title: { fontSize: 13, fontWeight: 600, color: "var(--color-text-primary,#111)", lineHeight: 1.4, marginBottom: 3 },
  summary: { fontSize: 12, color: "var(--color-text-secondary,#6b7280)", lineHeight: 1.5 },
  meta: { display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap", alignItems: "center" },
  source: { fontSize: 11, color: "var(--color-text-secondary,#6b7280)" },
  trend: { fontSize: 11, color: "#1D9E75" },
  viralBadge: (score) => { const h = score >= 7; const m = score >= 4; return { fontSize: 10, fontWeight: 600, padding: "2px 9px", borderRadius: 99, background: h ? "#EAF3DE" : m ? "#FAEEDA" : "#FAECE7", color: h ? "#3B6D11" : m ? "#854F0B" : "#993C1D", border: "0.5px solid " + (h ? "#97C459" : m ? "#EF9F27" : "#F0997B") }; },
  divider: { height: "0.5px", background: "var(--color-border-tertiary,#e5e7eb)", margin: "10px 0" },
  actionRow: { display: "flex", gap: 5, flexWrap: "wrap" },
  actionBtn: (active) => ({ fontSize: 11, padding: "4px 10px", border: "0.5px solid " + (active ? "#7F77DD" : "var(--color-border-secondary,#d1d5db)"), borderRadius: 8, background: active ? "#EEEDFE" : "var(--color-background-secondary,#f3f4f6)", color: active ? "#534AB7" : "var(--color-text-primary,#111)", cursor: "pointer", fontWeight: active ? 600 : 400 }),
  exportBtn: { fontSize: 11, padding: "4px 10px", border: "0.5px solid #5DCAA5", borderRadius: 8, background: "#E1F5EE", color: "#0F6E56", cursor: "pointer", fontWeight: 600, marginLeft: "auto" },
  outBox: { marginTop: 10, background: "var(--color-background-secondary,#f3f4f6)", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 8, padding: "10px 12px" },
  outHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
  outLabel: { fontSize: 11, fontWeight: 600, color: "var(--color-text-primary,#111)" },
  copyBtn: { fontSize: 10, padding: "2px 8px", border: "0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius: 6, background: "transparent", cursor: "pointer", color: "var(--color-text-secondary,#6b7280)" },
  outText: { fontSize: 12, color: "var(--color-text-secondary,#6b7280)", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 280, overflowY: "auto" },
  errBox: { background: "#FAECE7", border: "0.5px solid #F0997B", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#993C1D", marginTop: 8 },
  sectionCard: { background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "var(--color-text-primary,#111)", marginBottom: 10 },
  sectionBtn: (color) => ({ width: "100%", padding: "9px", border: "0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius: 8, background: "var(--color-background-secondary,#f3f4f6)", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "var(--color-text-primary,#111)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }),
  progressWrap: { margin: "8px 0" },
  progressLabel: { fontSize: 11, color: "var(--color-text-secondary,#6b7280)", marginBottom: 4 },
  progressTrack: { height: 4, background: "var(--color-background-secondary,#f3f4f6)", borderRadius: 99, overflow: "hidden", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)" },
  progressFill: (pct) => ({ height: "100%", background: "#7F77DD", borderRadius: 99, width: pct + "%", transition: "width 0.3s ease" }),
  statRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 },
  statCard: { background: "var(--color-background-secondary,#f3f4f6)", borderRadius: 8, padding: "10px 12px" },
  statLabel: { fontSize: 10, color: "var(--color-text-secondary,#6b7280)", marginBottom: 3 },
  statVal: { fontSize: 18, fontWeight: 600, color: "var(--color-text-primary,#111)" },
  htGrid: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 },
  htBadge: (type) => { const m = { fr: ["#EEEDFE","#534AB7","#AFA9EC"], en: ["#E6F1FB","#185FA5","#85B7EB"], trend: ["#E1F5EE","#0F6E56","#5DCAA5"] }[type]; return { fontSize: 11, padding: "3px 10px", borderRadius: 99, background: m[0], color: m[1], border: "0.5px solid " + m[2] }; },
  calDay: { border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 8, padding: "10px 12px", marginBottom: 6, display: "flex", gap: 12, alignItems: "flex-start" },
  calNum: { fontSize: 10, fontWeight: 600, background: "var(--color-background-secondary,#f3f4f6)", borderRadius: 6, padding: "4px 8px", color: "var(--color-text-secondary,#6b7280)", whiteSpace: "nowrap", flexShrink: 0 },
  calPlatform: (p) => { const m = { TikTok: ["#FAECE7","#993C1D"], Instagram: ["#FBEAF0","#993556"], YouTube: ["#FCEBEB","#A32D2D"], X: ["#E1F5EE","#0F6E56"] }[p] || ["#F1EFE8","#5F5E5A"]; return { fontSize: 10, padding: "2px 7px", borderRadius: 99, background: m[0], color: m[1], display: "inline-block", marginBottom: 3 }; },
  recapBtn: { width: "100%", padding: "10px", border: "0.5px solid #AFA9EC", borderRadius: 10, background: "#EEEDFE", color: "#534AB7", fontSize: 12, fontWeight: 600, cursor: "pointer", margin: "10px 0" },
  input: { width: "100%", padding: "9px 12px", border: "0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius: 8, fontSize: 12, color: "var(--color-text-primary,#111)", background: "var(--color-background-primary,#fff)", marginBottom: 8, outline: "none" },
  textarea: { width: "100%", padding: "9px 12px", border: "0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius: 8, fontSize: 12, color: "var(--color-text-primary,#111)", background: "var(--color-background-primary,#fff)", marginBottom: 8, outline: "none", resize: "vertical", minHeight: 72, fontFamily: "inherit" },
  projCard: { background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius: 12, padding: "14px 16px", marginBottom: 10 },
  projHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  projName: { fontSize: 13, fontWeight: 600, color: "var(--color-text-primary,#111)" },
  projTopic: { fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#EEEDFE", color: "#534AB7", border: "0.5px solid #AFA9EC" },
  projDesc: { fontSize: 12, color: "var(--color-text-secondary,#6b7280)", marginBottom: 10, lineHeight: 1.5 },
  primaryBtn: { padding: "9px 16px", background: "#7F77DD", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  secondaryBtn: { padding: "9px 16px", background: "var(--color-background-secondary,#f3f4f6)", color: "var(--color-text-primary,#111)", border: "0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer" },
  infoBox: { background: "#EEEDFE", border: "0.5px solid #AFA9EC", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#534AB7", marginBottom: 10 },
};

const SEED_NEWS = [
  { title: "33 millions de Français exposés après une fuite chez un prestataire santé", summary: "Des données d'assurance maladie ont fuité sur des forums souterrains après une compromission chez un prestataire de paiement.", source: "Le Monde", category: "Data Breach", viral: 9, trend: "↑ +520%" },
  { title: "PowerSchool : 62M de dossiers scolaires compromis par credential stuffing", summary: "Une attaque par bourrage de credentials a exposé noms, adresses et données médicales de millions d'élèves en Amérique du Nord.", source: "BleepingComputer", category: "Data Breach", viral: 8, trend: "↑ +340%" },
  { title: "Investisseur Bitcoin séquestré à Manhattan, contraint de virer ses fonds", summary: "Un détenteur de Bitcoin connu a été agressé à domicile par des individus masqués exigeant l'accès à son wallet.", source: "CoinDesk", category: "Crypto Kidnapping", viral: 9, trend: "↑ +780%" },
  { title: "Trader crypto barcelonais kidnappé 3 jours, 400K€ transférés de force", summary: "Un trader espagnol a été séquestré pendant 72h et contraint de transférer des fonds. Quatre suspects liés au crime organisé arrêtés.", source: "Reuters", category: "Crypto Kidnapping", viral: 8, trend: "↑ +410%" },
  { title: "Zero-day Fortinet VPN exploité des semaines avant le patch", summary: "Une faille RCE critique dans un VPN d'entreprise très répandu a été weaponisée pendant plusieurs semaines avant la publication du correctif.", source: "SecurityWeek", category: "Corporate Security", viral: 6, trend: "↑ +190%" },
  { title: "Faille SAP NetWeaver exploitée par un APT chinois contre des industriels européens", summary: "Une RCE dans SAP a servi de vecteur d'attaque ciblée contre des fabricants européens, attribuée à un acteur étatique chinois.", source: "Mandiant", category: "Corporate Security", viral: 7, trend: "↑ +230%" },
];

const BTN_KEYS = ["script","image","post","blog","thread","formats"];

function Progress({ label, pct }) {
  return (
    <div style={s.progressWrap}>
      <div style={s.progressLabel}>{label}</div>
      <div style={s.progressTrack}><div style={s.progressFill(pct)} /></div>
    </div>
  );
}

function NewsCard({ item, lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(null);
  const [err, setErr] = useState(null);
  const [prog, setProg] = useState(0);

  const gen = async (type) => {
    if (cache[type]) { setOpen(type); return; }
    setLoading(type); setErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+8,85)), 400);
    const b = item.title + " - " + item.summary;
    const tone = "Tone: vulgarisation grand public, accessible, punchy. Brand: BustedData.";
    const P = {
      script: tone+" News: "+b+"\nBilingual ElevenLabs script 60s.\nFR (30s): hook/facts/insight\nEN (30s): same\nELEVENLABS: voice,pace,emotion\nPlain text.",
      image: "News: "+b+"\nIMAGE PROMPT: cinematic dark-tech Midjourney/DALL-E, no text.\nCOLOR PALETTE: 3 hex\nTEXT OVERLAY: thumbnail headline\nPlain text.",
      post: tone+" News: "+b+"\nBilingual social copy:\nINSTAGRAM FR/EN: hook+body+hashtags\nYOUTUBE FR/EN: title+desc+tags\nTIKTOK FR/EN: hook+caption+hashtags\nPlain text.",
      blog: tone+" News: "+b+"\nFull blog FR then EN.\nFR: TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS CLES/CONCLUSION/META/TAGS\nEN: TITLE/INTRO/BACKGROUND/ANALYSIS/TAKEAWAYS/CONCLUSION/META/TAGS\nPlain text.",
      thread: tone+" News: "+b+"\nViral X thread FR AND EN.\nFR THREAD: 7 tweets numbered, hook t1, facts t2-5, insight t6, CTA t7. Max 280 chars each.\nEN THREAD: same.\nPlain text.",
      formats: tone+" News: "+b+"\n3 variations:\nFORMAT 1 - TIKTOK 15s: ultra-short script\nFORMAT 2 - YOUTUBE 60s: intro/body/outro\nFORMAT 3 - CARROUSEL IG: 5 slides titles+captions\nAll FR/EN. Plain text.",
    };
    try {
      const text = await askClaude(P[type]);
      clearInterval(tick); setProg(100);
      setCache(c => ({ ...c, [type]: text }));
      setOpen(type);
    } catch(e) { clearInterval(tick); setProg(0); setErr(e.message); }
    setLoading(null);
  };

  const exportPack = () => {
    const keys = Object.keys(cache);
    if (!keys.length) return;
    let txt = "=== BUSTEDDATA CONTENT PACK ===\nNews: "+item.title+"\nScore: "+item.viral+"/10\n" + "=".repeat(40) + "\n\n";
    keys.forEach(k => { txt += "--- " + t.btns[BTN_KEYS.indexOf(k)] + " ---\n" + cache[k] + "\n\n"; });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([txt],{type:"text/plain"})), download: item.title.slice(0,30).replace(/[^a-z0-9]/gi,"_")+"_pack.txt" });
    a.click();
  };

  const viralLabel = item.viral >= 7 ? t.viral[2] : item.viral >= 4 ? t.viral[1] : t.viral[0];

  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <span style={s.catBadge(item.category)}>{item.category}</span>
        <div style={{flex:1}}>
          <div style={s.title}>{item.title}</div>
          <div style={s.summary}>{item.summary}</div>
          <div style={s.meta}>
            <span style={s.source}>{item.source}</span>
            {item.trend && <span style={s.trend}>{item.trend}</span>}
            <span style={s.viralBadge(item.viral)}>{item.viral}/10 — {viralLabel}</span>
          </div>
        </div>
      </div>
      <div style={s.divider} />
      <div style={s.actionRow}>
        {BTN_KEYS.map((k,i) => (
          <button key={k} onClick={() => gen(k)} disabled={!!loading} style={s.actionBtn(open===k)}>
            {loading===k ? "⏳" : t.btns[i]}
          </button>
        ))}
        <button onClick={exportPack} style={s.exportBtn}>↓ {t.export}</button>
      </div>
      {loading && <Progress label={t.btns[BTN_KEYS.indexOf(loading)] + "..."} pct={prog} />}
      {err && <div style={s.errBox}>{err}</div>}
      {open && cache[open] && (
        <div style={s.outBox}>
          <div style={s.outHdr}>
            <span style={s.outLabel}>{t.btns[BTN_KEYS.indexOf(open)]}</span>
            <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(cache[open])}>{t.copy}</button>
          </div>
          <div style={s.outText}>{cache[open]}</div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ title, btnLabel, onGenerate, loading, prog, result, lang, color }) {
  const t = T[lang];
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>{title}</div>
      <button onClick={onGenerate} disabled={loading} style={s.sectionBtn()}>
        {loading ? "⏳ " + t.generating : btnLabel}
      </button>
      {loading && <Progress label={t.generating} pct={prog} />}
      {result && (
        <div style={s.outBox}>
          <div style={s.outHdr}>
            <span style={s.outLabel}>{title}</span>
            <button style={s.copyBtn} onClick={() => navigator.clipboard.writeText(result)}>{t.copy}</button>
          </div>
          <div style={s.outText}>{result}</div>
        </div>
      )}
    </div>
  );
}

function HashtagTab({ news, lang }) {
  const t = T[lang];
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const gen = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    try {
      const text = await askClaude("Hashtag strategy for BustedData (vulgarisation grand public) based on topics: "+news.map(n=>n.title).join(", ")+"\n\nFR HASHTAGS: 10 ranked by reach\nEN HASHTAGS: 10 ranked by reach\nTRENDING NOW: 5 trending related hashtags\nTO AVOID: 3 overused/shadowbanned\nPlain text.");
      clearInterval(tick); setProg(100); setResult(text);
    } catch(e) { clearInterval(tick); setProg(0); setResult("Error: "+e.message); }
    setLoading(false);
  };
  return <SectionBlock title="🏷️ Hashtags" btnLabel={t.hashtags} onGenerate={gen} loading={loading} prog={prog} result={result} lang={lang} />;
}

function TrendsTab({ news, lang }) {
  const t = T[lang];
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const avg = news.length ? Math.round(news.reduce((a,n)=>a+(n.viral||5),0)/news.length*10)/10 : 0;
  const top = news.reduce((a,b)=>((b.viral||0)>(a.viral||0)?b:a),news[0]||{});
  const gen = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    try {
      const text = await askClaude("Trend analysis for BustedData (vulgarisation grand public):\n"+news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title).join("\n")+"\n\nTREND ANALYSIS FR: dominant themes, rising topics (5-6 sentences)\nTREND ANALYSIS EN: same in English\nCONTENT OPPORTUNITIES: 3 unique angles for BustedData\nBEST POSTING TIME: by platform (IG/TikTok/YouTube/X)\nPlain text.");
      clearInterval(tick); setProg(100); setResult(text);
    } catch(e) { clearInterval(tick); setProg(0); setResult("Error: "+e.message); }
    setLoading(false);
  };
  return (
    <div>
      <div style={s.sectionCard}>
        <div style={s.statRow}>
          <div style={s.statCard}><div style={s.statLabel}>Stories</div><div style={s.statVal}>{news.length}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>{lang==="fr"?"Score moyen":"Avg score"}</div><div style={s.statVal}>{avg}</div></div>
          <div style={s.statCard}><div style={s.statLabel}>{lang==="fr"?"Top sujet":"Top topic"}</div><div style={{...s.statVal,fontSize:11,paddingTop:4}}>{top.category||"—"}</div></div>
        </div>
        <button onClick={gen} disabled={loading} style={s.sectionBtn()}>
          {loading ? "⏳ "+t.generating : "📈 "+t.analyse}
        </button>
        {loading && <Progress label={t.generating} pct={prog} />}
        {result && (
          <div style={s.outBox}>
            <div style={s.outHdr}><span style={s.outLabel}>📈 Tendances</span><button style={s.copyBtn} onClick={()=>navigator.clipboard.writeText(result)}>{t.copy}</button></div>
            <div style={s.outText}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarTab({ news, lang }) {
  const t = T[lang];
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const gen = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+9,85)), 400);
    try {
      const text = await askClaude("7-day editorial calendar for BustedData (vulgarisation grand public):\n"+news.map((n,i)=>(i+1)+". ["+n.viral+"/10] "+n.title+" ("+n.category+")").join("\n")+"\n\nFor each day: DAY X / PLATFORM / CONTENT / POSTING TIME / FR HOOK\nPrioritize by viral score. Plain text.");
      clearInterval(tick); setProg(100); setResult(text);
    } catch(e) { clearInterval(tick); setProg(0); setResult("Error: "+e.message); }
    setLoading(false);
  };
  const dl = () => { if (!result) return; const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([result],{type:"text/plain"})),download:"busteddata_calendar.txt"}); a.click(); };
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionTitle}>🗓️ {t.tabs[3]}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={gen} disabled={loading} style={{...s.sectionBtn(),flex:1}}>
          {loading ? "⏳ "+t.generating : "🗓️ "+t.calendar}
        </button>
        {result && <button onClick={dl} style={{...s.secondaryBtn,padding:"9px 14px"}}>↓</button>}
      </div>
      {loading && <Progress label={t.generating} pct={prog} />}
      {result && (
        <div style={s.outBox}>
          <div style={s.outHdr}><span style={s.outLabel}>🗓️ Calendrier</span><button style={s.copyBtn} onClick={()=>navigator.clipboard.writeText(result)}>{t.copy}</button></div>
          <div style={s.outText}>{result}</div>
        </div>
      )}
    </div>
  );
}

function ProjectsTab({ lang }) {
  const t = T[lang];
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", topic: "", desc: "" });
  const [activeProj, setActiveProj] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchProg, setSearchProg] = useState(0);
  const [searchResult, setSearchResult] = useState(null);

  const save = () => {
    if (!form.name.trim()) return;
    setProjects(prev => [...prev, { ...form, id: Date.now(), results: [] }]);
    setForm({ name: "", topic: "", desc: "" });
    setShowForm(false);
  };

  const search = async (proj) => {
    setActiveProj(proj.id);
    setSearchLoading(true); setSearchProg(10); setSearchResult(null);
    const tick = setInterval(() => setSearchProg(p => Math.min(p+8,85)), 400);
    try {
      const text = await askClaude("You are a content strategist for BustedData. Project: \""+proj.name+"\". Topic: \""+proj.topic+"\". Brief: \""+proj.desc+"\".\n\nGenerate:\n1. 5 recent news angles on this topic (title + 2-sentence summary each)\n2. Content recommendations: best format, tone, platform for this topic\n3. 3 post ideas ready to produce (FR + EN hook for each)\nPlain text.");
      clearInterval(tick); setSearchProg(100); setSearchResult(text);
    } catch(e) { clearInterval(tick); setSearchProg(0); setSearchResult("Error: "+e.message); }
    setSearchLoading(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary,#111)"}}>
          {lang==="fr"?"Vos projets":"Your projects"} ({projects.length})
        </span>
        <button onClick={() => setShowForm(!showForm)} style={s.primaryBtn}>
          + {t.addProject}
        </button>
      </div>

      {showForm && (
        <div style={{...s.sectionCard, border:"0.5px solid #AFA9EC"}}>
          <div style={s.sectionTitle}>+ {t.addProject}</div>
          <input style={s.input} placeholder={t.projectName} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input style={s.input} placeholder={t.projectTopic} value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} />
          <textarea style={s.textarea} placeholder={t.projectPlaceholder} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
          <div style={{display:"flex",gap:8}}>
            <button onClick={save} style={s.primaryBtn}>{t.projectSave}</button>
            <button onClick={()=>setShowForm(false)} style={s.secondaryBtn}>{lang==="fr"?"Annuler":"Cancel"}</button>
          </div>
        </div>
      )}

      {!projects.length && !showForm && (
        <div style={{...s.sectionCard,textAlign:"center",padding:"28px 16px"}}>
          <div style={{fontSize:24,marginBottom:8}}>📁</div>
          <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)"}}>{t.noProjects}</div>
        </div>
      )}

      {projects.map(proj => (
        <div key={proj.id} style={s.projCard}>
          <div style={s.projHeader}>
            <span style={s.projName}>{proj.name}</span>
            <span style={s.projTopic}>{proj.topic}</span>
          </div>
          {proj.desc && <div style={s.projDesc}>{proj.desc}</div>}
          <button onClick={() => search(proj)} disabled={searchLoading && activeProj===proj.id} style={{...s.sectionBtn(),marginBottom:0}}>
            {searchLoading && activeProj===proj.id ? "⏳ "+t.searching : "🔍 "+t.projectSearch}
          </button>
          {searchLoading && activeProj===proj.id && <Progress label={t.searching} pct={searchProg} />}
          {searchResult && activeProj===proj.id && (
            <div style={s.outBox}>
              <div style={s.outHdr}>
                <span style={s.outLabel}>🔍 {proj.name}</span>
                <button style={s.copyBtn} onClick={()=>navigator.clipboard.writeText(searchResult)}>{t.copy}</button>
              </div>
              <div style={s.outText}>{searchResult}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const [recap, setRecap] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapProg, setRecapProg] = useState(0);
  const [lastFetch, setLastFetch] = useState(null);
  const [fetchErr, setFetchErr] = useState(null);
  const [tab, setTab] = useState(0);
  const t = T[lang];

  const fetchNews = async () => {
    setLoading(true); setNews([]); setRecap(""); setFetchErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+7,85)), 500);
    try {
      const text = await askClaude("Security news analyst for BustedData (vulgarisation grand public). Rewrite 6 incidents as polished news and return ONLY raw JSON array, no markdown.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER,\"trend\":\"short indicator\"}]\nCategories: Data Breach|Crypto Kidnapping|Corporate Security\n1. PowerSchool 62M records breach.\n2. French healthcare 33M citizens leak.\n3. Manhattan Bitcoin holder home attack.\n4. Barcelona crypto trader kidnapped 3 days 400K.\n5. Fortinet VPN zero-day before patch.\n6. SAP NetWeaver Chinese APT.\nViral: 1-10 general public interest. Trend: short emoji+% string.");
      clearInterval(tick); setProg(95);
      let parsed = [];
      try { const m = text.match(/\[[\s\S]*\]/); if (m) parsed = JSON.parse(m[0]); } catch {}
      if (!parsed.length) { parsed = SEED_NEWS; setFetchErr(t.cached); }
      setNews(parsed); setLastFetch(new Date().toLocaleString(lang==="fr"?"fr-FR":"en-GB")); setProg(100);
    } catch(e) { clearInterval(tick); setProg(0); setFetchErr(e.message); setNews(SEED_NEWS); setLastFetch(new Date().toLocaleString(lang==="fr"?"fr-FR":"en-GB")); }
    setLoading(false);
  };

  const genRecap = async () => {
    setRecapLoading(true); setRecapProg(10);
    const tick = setInterval(() => setRecapProg(p => Math.min(p+9,85)), 400);
    const list = news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");
    try {
      const text = await askClaude("BustedData daily briefing (vulgarisation grand public).\nNews:\n"+list+"\n\nRECAP DU JOUR (FR) — 5-6 sentences, hook fort.\nDAILY BRIEFING (EN) — same.\nPlain text.");
      clearInterval(tick); setRecapProg(100); setRecap(text);
    } catch(e) { clearInterval(tick); setRecapProg(0); setRecap("Error: "+e.message); }
    setRecapLoading(false);
  };

  return (
    <div style={s.shell}>
      <div style={s.topbar}>
        <div style={s.logoRow}>
          <div style={s.logoBox}>BD</div>
          <span style={s.logoName}>BustedData</span>
          <span style={s.logoBadge}>Intel Daily</span>
        </div>
        <div style={s.topRight}>
          {lastFetch && <span style={s.lastFetch}>{t.lastFetch}: {lastFetch}</span>}
          <button onClick={() => setLang("fr")} style={s.langBtn(lang==="fr")}>FR</button>
          <button onClick={() => setLang("en")} style={s.langBtn(lang==="en")}>EN</button>
        </div>
      </div>

      <div style={s.main}>
        <button onClick={fetchNews} disabled={loading} style={s.fetchBtn(loading)}>
          {loading ? t.fetching : "↻  "+t.fetch}
        </button>
        {loading && <Progress label={t.fetching} pct={prog} />}
        {fetchErr && <div style={s.infoBox}>{fetchErr}</div>}

        {(news.length > 0 || tab === 4) && (
          <>
            <div style={s.tabs}>
              {t.tabs.map((name,i) => (
                <button key={i} onClick={() => setTab(i)} style={s.tab(tab===i)}>{name}</button>
              ))}
            </div>

            {tab === 0 && (
              <>
                {news.map((item,i) => <NewsCard key={i} item={item} lang={lang} />)}
                <button onClick={genRecap} disabled={recapLoading} style={s.recapBtn}>
                  {recapLoading ? t.generating : "📋 "+t.recap}
                </button>
                {recapLoading && <Progress label={t.generating} pct={recapProg} />}
                {recap && (
                  <div style={s.sectionCard}>
                    <div style={s.outHdr}><span style={s.sectionTitle}>📋 BustedData — Daily Briefing</span><button style={s.copyBtn} onClick={()=>navigator.clipboard.writeText(recap)}>{t.copy}</button></div>
                    <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{recap}</div>
                  </div>
                )}
              </>
            )}
            {tab === 1 && <TrendsTab news={news} lang={lang} />}
            {tab === 2 && <HashtagTab news={news} lang={lang} />}
            {tab === 3 && <CalendarTab news={news} lang={lang} />}
            {tab === 4 && <ProjectsTab lang={lang} />}
          </>
        )}

        {!news.length && tab !== 4 && (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:32,marginBottom:12}}>🛡️</div>
            <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)",marginBottom:16}}>{lang==="fr"?"Cliquez pour charger les dernières news sécurité.":"Click to load the latest security news."}</div>
          </div>
        )}
      </div>
    </div>
  );
}
