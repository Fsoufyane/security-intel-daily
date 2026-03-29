import { useState } from "react";

const T = {
  fr: {
    appName: "Scrap Info", appTag: "Veille & Contenu",
    newProject: "Nouveau projet", projectName: "Nom du projet",
    projectDesc: "Description (thématique, ton, plateformes...)",
    projectDescPlaceholder: "Ex: Actualités crypto grand public, ton accessible, TikTok + YouTube...",
    projectTopics: "Sujets à surveiller (séparés par virgules)",
    projectTopicsPlaceholder: "Ex: fuites de données, cybersécurité, IA, crypto...",
    projectSave: "Créer", cancel: "Annuler",
    noProjects: "Aucun projet. Créez-en un pour commencer.",
    fetch: "Récupérer les news", fetching: "Chargement...",
    lastFetch: "Dernière mise à jour",
    tabs: ["News","Tendances","Hashtags","Calendrier"],
    recap: "Récap quotidien (FR + EN)", generating: "Génération...",
    analyse: "Analyser les tendances", hashtags: "Générer la stratégie hashtags",
    calendar: "Générer le calendrier", export: "Export Pack", copy: "Copier",
    viral: ["Faible","Moyen","Viral"], cached: "News en cache.",
    btns: ["🎙️ Script ElevenLabs","🖼️ Image Prompt","📱 Post Copy","✍️ Blog","🧵 Thread X","🔁 Variations"],
    mediaBtn: "🎬 Générer par média", cancel2: "Annuler",
    mediaLabels: { instagram:"Instagram", youtube:"YouTube Shorts", linkedin:"LinkedIn", tiktok:"TikTok" },
    confirmDelete: "Supprimer ce projet ?",
  },
  en: {
    appName: "Scrap Info", appTag: "Intel & Content",
    newProject: "New project", projectName: "Project name",
    projectDesc: "Description (topic, tone, platforms...)",
    projectDescPlaceholder: "E.g. Crypto news for general public, casual tone, TikTok + YouTube...",
    projectTopics: "Topics to monitor (comma-separated)",
    projectTopicsPlaceholder: "E.g. data breaches, cybersecurity, AI, crypto...",
    projectSave: "Create", cancel: "Cancel",
    noProjects: "No projects yet. Create one to get started.",
    fetch: "Fetch latest news", fetching: "Loading...",
    lastFetch: "Last fetch",
    tabs: ["News","Trends","Hashtags","Calendar"],
    recap: "Daily Recap (FR + EN)", generating: "Generating...",
    analyse: "Analyse trends", hashtags: "Generate hashtag strategy",
    calendar: "Generate calendar", export: "Export Pack", copy: "Copy",
    viral: ["Low","Medium","Viral"], cached: "Using cached news.",
    btns: ["🎙️ ElevenLabs Script","🖼️ Image Prompt","📱 Post Copy","✍️ Blog","🧵 X Thread","🔁 Variations"],
    mediaBtn: "🎬 Generate per media", cancel2: "Cancel",
    mediaLabels: { instagram:"Instagram", youtube:"YouTube Shorts", linkedin:"LinkedIn", tiktok:"TikTok" },
    confirmDelete: "Delete this project?",
  }
};

function mediaPrompt(media, b, proj) {
  const tone = "Tone: "+(proj.desc||"accessible, punchy, vulgarisation grand public")+". Project: "+proj.name+".";
  if (media==="instagram") return tone+"\nNews: "+b+"\n\nGenerate INSTAGRAM content (FR + EN):\nVISUAL CONCEPT: ideal image/graphic\nCAPTION FR: hook + body (3-4 lines) + CTA + 10 hashtags\nCAPTION EN: same\nSTORY FR: 3 slides (hook/facts/CTA)\nSTORY EN: same\nPlain text only.";
  if (media==="youtube") return tone+"\nNews: "+b+"\n\nGenerate YOUTUBE SHORTS content (FR + EN) — reusable for TikTok:\nTHUMBNAIL CONCEPT\nTITLE FR (max 60 chars, SEO)\nTITLE EN (max 60 chars, SEO)\nVIDEO SCRIPT FR (60s):\n  [0-5s] HOOK\n  [5-15s] CONTEXT\n  [15-35s] KEY FACTS (3 facts, one per cut)\n  [35-50s] WHY IT MATTERS\n  [50-60s] CTA\nVIDEO SCRIPT EN: same structure\nMONTAGE NOTES: shots, cuts, overlays, music, pacing\nDESCRIPTION FR + tags\nDESCRIPTION EN + tags\nPlain text only.";
  if (media==="linkedin") return tone+"\nNews: "+b+"\n\nGenerate LINKEDIN content (FR + EN):\nPOST FR: scroll-stopper hook + 4-6 short paragraphs + 3 bullet takeaways + CTA question + 5 hashtags\nPOST EN: same\nARTICLE IDEA: long-form angle suggestion\nPlain text only.";
  if (media==="tiktok") return tone+"\nNews: "+b+"\n\nGenerate TIKTOK content (FR + EN) — same script as YouTube Shorts:\nHOOK FR (3s): ultra punchy\nHOOK EN: same\nVIDEO SCRIPT FR (60s):\n  [0-3s] HOOK\n  [3-10s] CONTEXT\n  [10-35s] KEY FACTS\n  [35-50s] TWIST/INSIGHT\n  [50-60s] CTA\nVIDEO SCRIPT EN: same\nMONTAGE NOTES: transitions, overlays, trending audio\nCAPTION FR (150 chars) + 5 hashtags\nCAPTION EN + 5 hashtags\nPlain text only.";
  return "";
}

async function askClaude(prompt) {
  const r = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({messages:[{role:"user",content:prompt}]}) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message||JSON.stringify(d));
  if (!d.text) throw new Error("Empty response");
  return d.text;
}

const MEDIA_CONFIG = {
  instagram:{ icon:"📸", bg:"#FBEAF0", border:"#ED93B1", text:"#993556", desc:"Caption + Story + Hashtags" },
  youtube:  { icon:"▶️",  bg:"#FCEBEB", border:"#F09595", text:"#A32D2D", desc:"Script 60s + Montage + SEO" },
  linkedin: { icon:"💼", bg:"#E6F1FB", border:"#85B7EB", text:"#185FA5", desc:"Post long + Article angle" },
  tiktok:   { icon:"🎵", bg:"#FAECE7", border:"#F0997B", text:"#993C1D", desc:"Script 60s + Montage + Caption" },
};

const BTN_KEYS = ["script","image","post","blog","thread","formats"];

const S = {
  shell:{ maxWidth:860, margin:"0 auto", fontFamily:"Inter,system-ui,sans-serif" },
  topbar:{ background:"var(--color-background-primary,#fff)", borderBottom:"0.5px solid var(--color-border-tertiary,#e5e7eb)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" },
  logoRow:{ display:"flex", alignItems:"center", gap:10 },
  logoBox:{ width:32, height:32, borderRadius:8, background:"#7F77DD", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 },
  logoName:{ fontSize:15, fontWeight:600, color:"var(--color-text-primary,#111)" },
  logoBadge:{ fontSize:10, padding:"2px 8px", borderRadius:99, background:"#EEEDFE", color:"#534AB7", border:"0.5px solid #AFA9EC" },
  topRight:{ display:"flex", alignItems:"center", gap:8 },
  langBtn:(a)=>({ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:99, border:"0.5px solid "+(a?"#7F77DD":"var(--color-border-secondary,#d1d5db)"), background:a?"#EEEDFE":"transparent", color:a?"#534AB7":"var(--color-text-secondary,#6b7280)", cursor:"pointer" }),
  projBar:{ background:"var(--color-background-secondary,#f3f4f6)", borderBottom:"0.5px solid var(--color-border-tertiary,#e5e7eb)", display:"flex", alignItems:"center", overflowX:"auto", padding:"0 16px" },
  projTab:(a)=>({ padding:"10px 14px", fontSize:12, fontWeight:a?600:400, color:a?"#534AB7":"var(--color-text-secondary,#6b7280)", borderBottom:a?"2px solid #7F77DD":"2px solid transparent", background:"transparent", border:"none", borderBottom:a?"2px solid #7F77DD":"2px solid transparent", cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }),
  projTabAdd:{ padding:"8px 14px", fontSize:20, color:"var(--color-text-secondary,#6b7280)", background:"transparent", border:"none", cursor:"pointer", lineHeight:1 },
  main:{ padding:"18px 20px" },
  fetchBtn:(l)=>({ width:"100%", padding:"11px", background:l?"var(--color-background-secondary,#f3f4f6)":"#7F77DD", color:l?"var(--color-text-secondary,#6b7280)":"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:600, cursor:l?"not-allowed":"pointer", marginBottom:14 }),
  tabs:{ display:"flex", gap:3, background:"var(--color-background-secondary,#f3f4f6)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:10, padding:3, marginBottom:14 },
  tab:(a)=>({ flex:1, padding:"6px 2px", fontSize:11, fontWeight:500, border:a?"0.5px solid var(--color-border-tertiary,#e5e7eb)":"none", borderRadius:8, cursor:"pointer", color:a?"var(--color-text-primary,#111)":"var(--color-text-secondary,#6b7280)", background:a?"var(--color-background-primary,#fff)":"transparent" }),
  card:{ background:"var(--color-background-primary,#fff)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:12, padding:"14px 16px", marginBottom:10 },
  catBadge:(t)=>{ const m={"Data Breach":["#FAECE7","#993C1D","#F0997B"],"Crypto Kidnapping":["#FAEEDA","#854F0B","#EF9F27"],"Corporate Security":["#E6F1FB","#185FA5","#85B7EB"],"AI":["#EEEDFE","#534AB7","#AFA9EC"],"Politique":["#E1F5EE","#0F6E56","#5DCAA5"],"Économie":["#FAEEDA","#854F0B","#EF9F27"]}[t]||["#F1EFE8","#5F5E5A","#B4B2A9"]; return { fontSize:10, fontWeight:500, padding:"2px 8px", borderRadius:99, whiteSpace:"nowrap", flexShrink:0, marginTop:2, background:m[0], color:m[1], border:"0.5px solid "+m[2] }; },
  title:{ fontSize:13, fontWeight:600, color:"var(--color-text-primary,#111)", lineHeight:1.4, marginBottom:3 },
  summary:{ fontSize:12, color:"var(--color-text-secondary,#6b7280)", lineHeight:1.5 },
  meta:{ display:"flex", gap:10, marginTop:5, flexWrap:"wrap", alignItems:"center" },
  source:{ fontSize:11, color:"var(--color-text-secondary,#6b7280)" },
  trend:{ fontSize:11, color:"#1D9E75" },
  viralBadge:(v)=>{ const h=v>=7,m=v>=4; return { fontSize:10, fontWeight:600, padding:"2px 9px", borderRadius:99, background:h?"#EAF3DE":m?"#FAEEDA":"#FAECE7", color:h?"#3B6D11":m?"#854F0B":"#993C1D", border:"0.5px solid "+(h?"#97C459":m?"#EF9F27":"#F0997B") }; },
  divider:{ height:"0.5px", background:"var(--color-border-tertiary,#e5e7eb)", margin:"10px 0" },
  actionRow:{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" },
  actionBtn:(a)=>({ fontSize:11, padding:"4px 10px", border:"0.5px solid "+(a?"#7F77DD":"var(--color-border-secondary,#d1d5db)"), borderRadius:8, background:a?"#EEEDFE":"var(--color-background-secondary,#f3f4f6)", color:a?"#534AB7":"var(--color-text-primary,#111)", cursor:"pointer", fontWeight:a?600:400 }),
  mediaBtnS:{ fontSize:11, padding:"4px 10px", border:"0.5px solid #5DCAA5", borderRadius:8, background:"#E1F5EE", color:"#0F6E56", cursor:"pointer", fontWeight:600 },
  exportBtn:{ fontSize:11, padding:"4px 10px", border:"0.5px solid #AFA9EC", borderRadius:8, background:"#EEEDFE", color:"#534AB7", cursor:"pointer", fontWeight:600, marginLeft:"auto" },
  outBox:{ marginTop:10, background:"var(--color-background-secondary,#f3f4f6)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:8, padding:"10px 12px" },
  outHdr:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 },
  outLabel:{ fontSize:11, fontWeight:600, color:"var(--color-text-primary,#111)" },
  copyBtn:{ fontSize:10, padding:"2px 8px", border:"0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius:6, background:"transparent", cursor:"pointer", color:"var(--color-text-secondary,#6b7280)" },
  outText:{ fontSize:12, color:"var(--color-text-secondary,#6b7280)", lineHeight:1.7, whiteSpace:"pre-wrap", maxHeight:300, overflowY:"auto" },
  errBox:{ background:"#FAECE7", border:"0.5px solid #F0997B", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#993C1D", marginTop:8 },
  secCard:{ background:"var(--color-background-primary,#fff)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:12, padding:"14px 16px", marginBottom:10 },
  secTitle:{ fontSize:13, fontWeight:600, color:"var(--color-text-primary,#111)", marginBottom:10 },
  secBtn:()=>({ width:"100%", padding:"9px", border:"0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius:8, background:"var(--color-background-secondary,#f3f4f6)", fontSize:12, fontWeight:500, cursor:"pointer", color:"var(--color-text-primary,#111)", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }),
  progressWrap:{ margin:"8px 0" },
  progressLabel:{ fontSize:11, color:"var(--color-text-secondary,#6b7280)", marginBottom:4 },
  progressTrack:{ height:4, background:"var(--color-background-secondary,#f3f4f6)", borderRadius:99, overflow:"hidden", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)" },
  progressFill:(p)=>({ height:"100%", background:"#7F77DD", borderRadius:99, width:p+"%", transition:"width 0.3s ease" }),
  statRow:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 },
  statCard:{ background:"var(--color-background-secondary,#f3f4f6)", borderRadius:8, padding:"10px 12px" },
  statLabel:{ fontSize:10, color:"var(--color-text-secondary,#6b7280)", marginBottom:3 },
  statVal:{ fontSize:18, fontWeight:600, color:"var(--color-text-primary,#111)" },
  recapBtn:{ width:"100%", padding:"10px", border:"0.5px solid #AFA9EC", borderRadius:10, background:"#EEEDFE", color:"#534AB7", fontSize:12, fontWeight:600, cursor:"pointer", margin:"10px 0" },
  input:{ width:"100%", padding:"9px 12px", border:"0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius:8, fontSize:12, color:"var(--color-text-primary,#111)", background:"var(--color-background-primary,#fff)", marginBottom:8, outline:"none", fontFamily:"inherit" },
  textarea:{ width:"100%", padding:"9px 12px", border:"0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius:8, fontSize:12, color:"var(--color-text-primary,#111)", background:"var(--color-background-primary,#fff)", marginBottom:8, outline:"none", resize:"vertical", minHeight:64, fontFamily:"inherit" },
  primaryBtn:{ padding:"9px 16px", background:"#7F77DD", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" },
  secondaryBtn:{ padding:"9px 16px", background:"var(--color-background-secondary,#f3f4f6)", color:"var(--color-text-primary,#111)", border:"0.5px solid var(--color-border-secondary,#d1d5db)", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer" },
  infoBox:{ background:"#EEEDFE", border:"0.5px solid #AFA9EC", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#534AB7", marginBottom:10 },
  mediaPanel:{ marginTop:12, background:"var(--color-background-secondary,#f3f4f6)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:10, padding:"12px 14px" },
  mediaGrid:{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:10 },
  projForm:{ background:"var(--color-background-primary,#fff)", border:"0.5px solid var(--color-border-tertiary,#e5e7eb)", borderRadius:12, padding:"18px 20px", maxWidth:480, margin:"0 auto" },
  projFormTitle:{ fontSize:14, fontWeight:600, color:"var(--color-text-primary,#111)", marginBottom:14 },
};

function Prog({ label, pct }) {
  return (
    <div style={S.progressWrap}>
      <div style={S.progressLabel}>{label}</div>
      <div style={S.progressTrack}><div style={S.progressFill(pct)}/></div>
    </div>
  );
}

function MediaPanel({ item, lang, proj, onClose }) {
  const t = T[lang];
  const [active, setActive] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(null);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState(null);
  const b = item.title+" — "+item.summary;
  const gen = async (media) => {
    if (cache[media]) { setActive(media); return; }
    setActive(media); setLoading(media); setErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+8,85)), 400);
    try {
      const text = await askClaude(mediaPrompt(media, b, proj));
      clearInterval(tick); setProg(100); setCache(c=>({...c,[media]:text}));
    } catch(e) { clearInterval(tick); setProg(0); setErr(e.message); }
    setLoading(null);
  };
  const exportAll = () => {
    const keys = Object.keys(cache); if (!keys.length) return;
    let txt = "=== "+proj.name.toUpperCase()+" — MEDIA PACK ===\n"+item.title+"\n"+"=".repeat(40)+"\n\n";
    keys.forEach(k => { txt += "--- "+k.toUpperCase()+" ---\n"+cache[k]+"\n\n"; });
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_mediapack.txt"}).click();
  };
  return (
    <div style={S.mediaPanel}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary,#111)"}}>🎬 {t.mediaBtn}</span>
        <div style={{display:"flex",gap:6}}>
          {Object.keys(cache).length>0 && <button onClick={exportAll} style={{...S.exportBtn,fontSize:10}}>↓ Export Media Pack</button>}
          <button onClick={onClose} style={{...S.secondaryBtn,padding:"4px 10px",fontSize:10}}>{t.cancel}</button>
        </div>
      </div>
      <div style={S.mediaGrid}>
        {Object.entries(MEDIA_CONFIG).map(([key,cfg]) => {
          const isA = active===key;
          return (
            <button key={key} onClick={() => gen(key)} disabled={loading===key}
              style={{padding:"10px 12px",border:"0.5px solid "+(isA?cfg.border:"var(--color-border-secondary,#d1d5db)"),borderRadius:8,background:isA?cfg.bg:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:18,marginBottom:4,display:"block"}}>{cfg.icon}</span>
              <div style={{fontSize:12,fontWeight:600,color:isA?cfg.text:"var(--color-text-primary,#111)"}}>{loading===key?"⏳ ":(cache[key]?"✓ ":"")}{t.mediaLabels[key]}</div>
              <div style={{fontSize:10,color:"var(--color-text-secondary,#6b7280)",marginTop:2}}>{cfg.desc}</div>
            </button>
          );
        })}
      </div>
      {loading && <Prog label={"Generating "+t.mediaLabels[loading]+"..."} pct={prog}/>}
      {err && <div style={S.errBox}>{err}</div>}
      {active && cache[active] && (
        <div style={S.outBox}>
          <div style={S.outHdr}><span style={S.outLabel}>{MEDIA_CONFIG[active].icon} {t.mediaLabels[active]}</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cache[active])}>{t.copy}</button></div>
          <div style={S.outText}>{cache[active]}</div>
        </div>
      )}
    </div>
  );
}

function NewsCard({ item, lang, proj }) {
  const t = T[lang];
  const [open, setOpen] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(null);
  const [err, setErr] = useState(null);
  const [prog, setProg] = useState(0);
  const [showMedia, setShowMedia] = useState(false);
  const tone = "Tone: "+(proj.desc||"accessible, punchy")+". Project: "+proj.name+".";
  const gen = async (type) => {
    if (cache[type]) { setOpen(type); return; }
    setLoading(type); setErr(null); setProg(10);
    const tick = setInterval(() => setProg(p => Math.min(p+8,85)), 400);
    const b = item.title+" — "+item.summary;
    const P = {
      script: tone+" News: "+b+"\nBilingual ElevenLabs script 60s.\nFR (30s): hook/facts/insight\nEN (30s): same\nELEVENLABS: voice,pace,emotion\nPlain text.",
      image:  "News: "+b+"\nIMAGE PROMPT: cinematic Midjourney/DALL-E, no text in image.\nCOLOR PALETTE: 3 hex\nTEXT OVERLAY: thumbnail headline\nPlain text.",
      post:   tone+" News: "+b+"\nBilingual social copy:\nINSTAGRAM FR/EN: hook+body+hashtags\nYOUTUBE FR/EN: title+desc+tags\nTIKTOK FR/EN: hook+caption+hashtags\nPlain text.",
      blog:   tone+" News: "+b+"\nFull blog FR then EN.\nFR: TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS CLES/CONCLUSION/META/TAGS\nEN: same\nPlain text.",
      thread: tone+" News: "+b+"\nViral X thread FR AND EN. 7 tweets each max 280 chars. Plain text.",
      formats:tone+" News: "+b+"\n3 variations: TIKTOK 15s / YOUTUBE 60s / CARROUSEL IG 5 slides. All FR/EN. Plain text.",
    };
    try {
      const text = await askClaude(P[type]);
      clearInterval(tick); setProg(100); setCache(c=>({...c,[type]:text})); setOpen(type);
    } catch(e) { clearInterval(tick); setProg(0); setErr(e.message); }
    setLoading(null);
  };
  const exportPack = () => {
    const keys = Object.keys(cache); if (!keys.length) return;
    let txt = "=== "+proj.name.toUpperCase()+" — CONTENT PACK ===\n"+item.title+"\nScore: "+item.viral+"/10\n"+"=".repeat(40)+"\n\n";
    keys.forEach(k=>{ txt+="--- "+t.btns[BTN_KEYS.indexOf(k)]+" ---\n"+cache[k]+"\n\n"; });
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:item.title.slice(0,30).replace(/[^a-z0-9]/gi,"_")+"_pack.txt"}).click();
  };
  const vl = item.viral>=7?t.viral[2]:item.viral>=4?t.viral[1]:t.viral[0];
  return (
    <div style={S.card}>
      <div style={S.cardTop||{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
        <span style={S.catBadge(item.category)}>{item.category}</span>
        <div style={{flex:1}}>
          <div style={S.title}>{item.title}</div>
          <div style={S.summary}>{item.summary}</div>
          <div style={S.meta}>
            <span style={S.source}>{item.source}</span>
            {item.trend&&<span style={S.trend}>{item.trend}</span>}
            <span style={S.viralBadge(item.viral)}>{item.viral}/10 — {vl}</span>
          </div>
        </div>
      </div>
      <div style={S.divider}/>
      <div style={S.actionRow}>
        {BTN_KEYS.map((k,i)=>(
          <button key={k} onClick={()=>gen(k)} disabled={!!loading} style={S.actionBtn(open===k)}>
            {loading===k?"⏳":t.btns[i]}
          </button>
        ))}
        <button onClick={()=>{setShowMedia(!showMedia);setOpen(null);}} style={S.mediaBtnS}>{showMedia?"✕":t.mediaBtn}</button>
        <button onClick={exportPack} style={S.exportBtn}>↓ {t.export}</button>
      </div>
      {showMedia&&<MediaPanel item={item} lang={lang} proj={proj} onClose={()=>setShowMedia(false)}/>}
      {!showMedia&&loading&&<Prog label={t.btns[BTN_KEYS.indexOf(loading)]+"..."} pct={prog}/>}
      {!showMedia&&err&&<div style={S.errBox}>{err}</div>}
      {!showMedia&&open&&cache[open]&&(
        <div style={S.outBox}>
          <div style={S.outHdr}><span style={S.outLabel}>{t.btns[BTN_KEYS.indexOf(open)]}</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cache[open])}>{t.copy}</button></div>
          <div style={S.outText}>{cache[open]}</div>
        </div>
      )}
    </div>
  );
}

function useGen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const run = async (prompt) => {
    setLoading(true); setProg(10);
    const tick = setInterval(()=>setProg(p=>Math.min(p+9,85)),400);
    try { const text=await askClaude(prompt); clearInterval(tick); setProg(100); setResult(text); }
    catch(e) { clearInterval(tick); setProg(0); setResult("Error: "+e.message); }
    setLoading(false);
  };
  return { result, loading, prog, run };
}

function ProjectWorkspace({ proj, lang }) {
  const t = T[lang];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const [recap, setRecap] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [recapProg, setRecapProg] = useState(0);
  const [lastFetch, setLastFetch] = useState(null);
  const [fetchErr, setFetchErr] = useState(null);
  const [tab, setTab] = useState(0);
  const trends = useGen(); const hash = useGen(); const cal = useGen();

  const fetchNews = async () => {
    setLoading(true); setNews([]); setRecap(""); setFetchErr(null); setProg(10);
    const tick = setInterval(()=>setProg(p=>Math.min(p+7,85)),500);
    const topics = proj.topics||proj.name;
    try {
      const text = await askClaude("You are a news analyst. Find and rewrite the 6 most significant recent news on: \""+topics+"\".\nContext: "+(proj.desc||"general audience")+".\nReturn ONLY raw JSON array, no markdown.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER,\"trend\":\"emoji+%\"}]\nViral: 1-10 general public interest.");
      clearInterval(tick); setProg(95);
      let parsed=[];
      try { const m=text.match(/\[[\s\S]*\]/); if(m) parsed=JSON.parse(m[0]); } catch {}
      if (!parsed.length) { parsed=[{title:"Exemple — "+proj.name,summary:"Relancez le fetch.",source:"—",category:topics.split(",")[0].trim(),viral:5,trend:"↑"}]; setFetchErr(t.cached); }
      setNews(parsed); setLastFetch(new Date().toLocaleString(lang==="fr"?"fr-FR":"en-GB")); setProg(100);
    } catch(e) { clearInterval(tick); setProg(0); setFetchErr(e.message); }
    setLoading(false);
  };

  const genRecap = async () => {
    setRecapLoading(true); setRecapProg(10);
    const tick = setInterval(()=>setRecapProg(p=>Math.min(p+9,85)),400);
    const list = news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");
    try {
      const text = await askClaude("Project \""+proj.name+"\" daily briefing. Tone: "+(proj.desc||"accessible")+"\nNews:\n"+list+"\n\nRECAP DU JOUR (FR) — 5-6 sentences hook fort.\nDAILY BRIEFING (EN) — same. Plain text.");
      clearInterval(tick); setRecapProg(100); setRecap(text);
    } catch(e) { clearInterval(tick); setRecapProg(0); setRecap("Error: "+e.message); }
    setRecapLoading(false);
  };

  const avg = news.length ? Math.round(news.reduce((a,n)=>a+(n.viral||5),0)/news.length*10)/10 : 0;
  const topN = news.length ? news.reduce((a,b)=>((b.viral||0)>(a.viral||0)?b:a)) : {};

  return (
    <div style={S.main}>
      <div style={{background:"var(--color-background-secondary,#f3f4f6)",borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary,#111)"}}>{proj.name}</span>
          {proj.topics&&<span style={{fontSize:11,color:"var(--color-text-secondary,#6b7280)",marginLeft:8}}>📌 {proj.topics}</span>}
        </div>
        {lastFetch&&<span style={{fontSize:11,color:"var(--color-text-secondary,#6b7280)"}}>{t.lastFetch}: {lastFetch}</span>}
      </div>

      <button onClick={fetchNews} disabled={loading} style={S.fetchBtn(loading)}>{loading?t.fetching:"↻  "+t.fetch}</button>
      {loading&&<Prog label={t.fetching} pct={prog}/>}
      {fetchErr&&<div style={S.infoBox}>{fetchErr}</div>}

      {news.length>0&&(
        <>
          <div style={S.tabs}>{t.tabs.map((name,i)=><button key={i} onClick={()=>setTab(i)} style={S.tab(tab===i)}>{name}</button>)}</div>

          {tab===0&&(
            <>
              {news.map((item,i)=><NewsCard key={i} item={item} lang={lang} proj={proj}/>)}
              <button onClick={genRecap} disabled={recapLoading} style={S.recapBtn}>{recapLoading?t.generating:"📋 "+t.recap}</button>
              {recapLoading&&<Prog label={t.generating} pct={recapProg}/>}
              {recap&&(
                <div style={S.secCard}>
                  <div style={S.outHdr}><span style={S.secTitle}>📋 Daily Briefing — {proj.name}</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(recap)}>{t.copy}</button></div>
                  <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{recap}</div>
                </div>
              )}
            </>
          )}

          {tab===1&&(
            <div style={S.secCard}>
              <div style={S.statRow}>
                <div style={S.statCard}><div style={S.statLabel}>Stories</div><div style={S.statVal}>{news.length}</div></div>
                <div style={S.statCard}><div style={S.statLabel}>{lang==="fr"?"Score moyen":"Avg score"}</div><div style={S.statVal}>{avg}</div></div>
                <div style={S.statCard}><div style={S.statLabel}>{lang==="fr"?"Top sujet":"Top topic"}</div><div style={{...S.statVal,fontSize:11,paddingTop:4}}>{topN.category||"—"}</div></div>
              </div>
              <button onClick={()=>trends.run("Trend analysis project \""+proj.name+"\" ("+( proj.desc||"general audience")+"):\n"+news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title).join("\n")+"\n\nTREND ANALYSIS FR: 5-6 sentences\nTREND ANALYSIS EN: same\nCONTENT OPPORTUNITIES: 3 unique angles\nBEST POSTING TIME: by platform\nPlain text.")} disabled={trends.loading} style={S.secBtn()}>{trends.loading?"⏳ "+t.generating:"📈 "+t.analyse}</button>
              {trends.loading&&<Prog label={t.generating} pct={trends.prog}/>}
              {trends.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>📈 Tendances</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(trends.result)}>{t.copy}</button></div><div style={S.outText}>{trends.result}</div></div>}
            </div>
          )}

          {tab===2&&(
            <div style={S.secCard}>
              <div style={S.secTitle}>🏷️ Hashtags</div>
              <button onClick={()=>hash.run("Hashtag strategy project \""+proj.name+"\": "+news.map(n=>n.title).join(", ")+"\n\nFR HASHTAGS: 10 ranked\nEN HASHTAGS: 10 ranked\nTRENDING NOW: 5\nTO AVOID: 3\nPlain text.")} disabled={hash.loading} style={S.secBtn()}>{hash.loading?"⏳ "+t.generating:t.hashtags}</button>
              {hash.loading&&<Prog label={t.generating} pct={hash.prog}/>}
              {hash.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>🏷️ Hashtags</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(hash.result)}>{t.copy}</button></div><div style={S.outText}>{hash.result}</div></div>}
            </div>
          )}

          {tab===3&&(
            <div style={S.secCard}>
              <div style={S.secTitle}>🗓️ {t.tabs[3]}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>cal.run("7-day editorial calendar project \""+proj.name+"\" ("+(proj.desc||"")+"):\n"+news.map((n,i)=>(i+1)+". ["+n.viral+"/10] "+n.title+" ("+n.category+")").join("\n")+"\n\nFor each day: DAY / PLATFORM / CONTENT / POSTING TIME / FR HOOK\nPrioritize by viral score. Plain text.")} disabled={cal.loading} style={{...S.secBtn(),flex:1}}>{cal.loading?"⏳ "+t.generating:"🗓️ "+t.calendar}</button>
                {cal.result&&<button onClick={()=>Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([cal.result],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_calendar.txt"}).click()} style={{...S.secondaryBtn,padding:"9px 14px"}}>↓</button>}
              </div>
              {cal.loading&&<Prog label={t.generating} pct={cal.prog}/>}
              {cal.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>🗓️ Calendrier</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cal.result)}>{t.copy}</button></div><div style={S.outText}>{cal.result}</div></div>}
            </div>
          )}
        </>
      )}

      {!news.length&&(
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:32,marginBottom:12}}>📡</div>
          <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)"}}>{lang==="fr"?'Cliquez pour scraper les news sur "'+( proj.topics||proj.name)+'".' :'Click to fetch news on "'+( proj.topics||proj.name)+'".'}</div>
        </div>
      )}
    </div>
  );
}

function NewProjectForm({ lang, onSave, onCancel }) {
  const t = T[lang];
  const [form, setForm] = useState({ name:"", topics:"", desc:"" });
  const save = () => { if (!form.name.trim()) return; onSave({...form,id:Date.now()}); };
  return (
    <div style={S.main}>
      <div style={S.projForm}>
        <div style={S.projFormTitle}>+ {t.newProject}</div>
        <input style={S.input} placeholder={t.projectName+" *"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
        <input style={S.input} placeholder={t.projectTopicsPlaceholder} value={form.topics} onChange={e=>setForm(f=>({...f,topics:e.target.value}))}/>
        <textarea style={S.textarea} placeholder={t.projectDescPlaceholder} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={save} style={S.primaryBtn}>{t.projectSave}</button>
          {onCancel&&<button onClick={onCancel} style={S.secondaryBtn}>{t.cancel}</button>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("fr");
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const t = T[lang];

  const addProject = (proj) => { setProjects(p=>[...p,proj]); setActiveId(proj.id); setShowNew(false); };
  const deleteProject = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    const rest = projects.filter(p=>p.id!==id);
    setProjects(rest); setActiveId(rest.length?rest[rest.length-1].id:null);
  };

  const activeProj = projects.find(p=>p.id===activeId);

  return (
    <div style={S.shell}>
      <div style={S.topbar}>
        <div style={S.logoRow}>
          <div style={S.logoBox}>SI</div>
          <span style={S.logoName}>{t.appName}</span>
          <span style={S.logoBadge}>{t.appTag}</span>
        </div>
        <div style={S.topRight}>
          <button onClick={()=>setLang("fr")} style={S.langBtn(lang==="fr")}>FR</button>
          <button onClick={()=>setLang("en")} style={S.langBtn(lang==="en")}>EN</button>
        </div>
      </div>

      <div style={S.projBar}>
        {projects.map(proj=>(
          <button key={proj.id} onClick={()=>{setActiveId(proj.id);setShowNew(false);}}
            style={S.projTab(activeId===proj.id&&!showNew)}>
            <span>{proj.name}</span>
            <span onClick={e=>{e.stopPropagation();deleteProject(proj.id);}} style={{fontSize:11,color:"var(--color-text-secondary,#6b7280)",marginLeft:4,cursor:"pointer",opacity:0.7}}>✕</span>
          </button>
        ))}
        <button onClick={()=>{setShowNew(true);setActiveId(null);}} style={S.projTabAdd} title={t.newProject}>＋</button>
      </div>

      {showNew&&<NewProjectForm lang={lang} onSave={addProject} onCancel={projects.length?()=>{setShowNew(false);setActiveId(projects[projects.length-1].id);}:null}/>}
      {!showNew&&activeProj&&<ProjectWorkspace key={activeProj.id} proj={activeProj} lang={lang}/>}
      {!showNew&&!activeProj&&(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>📡</div>
          <div style={{fontSize:15,fontWeight:600,color:"var(--color-text-primary,#111)",marginBottom:8}}>{t.appName}</div>
          <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)",marginBottom:24,maxWidth:380,margin:"0 auto 24px"}}>{lang==="fr"?"Créez un projet pour scraper et générer du contenu sur n'importe quel sujet.":"Create a project to scrape and generate content on any topic."}</div>
          <button onClick={()=>setShowNew(true)} style={S.primaryBtn}>+ {t.newProject}</button>
        </div>
      )}
    </div>
  );
  }
