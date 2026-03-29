import { useState } from "react";

const T = {
  fr: {
    appName:"Scrap Info", appTag:"Veille & Contenu",
    newProject:"Nouveau projet", projectName:"Nom du projet",
    projectDescPlaceholder:"Ex: Actualités crypto grand public, ton accessible, TikTok + YouTube...",
    projectTopicsPlaceholder:"Ex: fuites de données, cybersécurité, IA, crypto...",
    projectSave:"Créer", cancel:"Annuler",
    fetch:"Récupérer les news", fetching:"Chargement...",
    lastFetch:"Dernière mise à jour",
    tabs:["News","Tendances","Hashtags","Calendrier"],
    recap:"Récap quotidien (FR + EN)", generating:"Génération...",
    analyse:"Analyser les tendances", hashtags:"Générer la stratégie hashtags",
    calendar:"Générer le calendrier", export:"Export Pack", copy:"Copier",
    viral:["Faible","Moyen","Viral"], cached:"News en cache.",
    btns:["🎙️ ElevenLabs","🖼️ Image","📱 Post Copy","✍️ Blog","🧵 Thread X","🔁 Variations"],
    mediaBtn:"🎬 Par média", agentBtn:"🤖 Script Agent IA",
    mediaLabels:{instagram:"Instagram",youtube:"YouTube Shorts",linkedin:"LinkedIn",tiktok:"TikTok"},
    confirmDelete:"Supprimer ce projet ?",
    agentTitle:"🤖 Script Agent IA — Protocole de publication",
    agentNetworks:["Instagram","TikTok","YouTube","LinkedIn","X / Twitter"],
    agentCopy:"Copier le protocole complet",
    agentExport:"↓ Export .txt",
  },
  en: {
    appName:"Scrap Info", appTag:"Intel & Content",
    newProject:"New project", projectName:"Project name",
    projectDescPlaceholder:"E.g. Crypto news for general public, casual tone, TikTok + YouTube...",
    projectTopicsPlaceholder:"E.g. data breaches, cybersecurity, AI, crypto...",
    projectSave:"Create", cancel:"Cancel",
    fetch:"Fetch latest news", fetching:"Loading...",
    lastFetch:"Last fetch",
    tabs:["News","Trends","Hashtags","Calendar"],
    recap:"Daily Recap (FR + EN)", generating:"Generating...",
    analyse:"Analyse trends", hashtags:"Generate hashtag strategy",
    calendar:"Generate calendar", export:"Export Pack", copy:"Copy",
    viral:["Low","Medium","Viral"], cached:"Using cached news.",
    btns:["🎙️ ElevenLabs","🖼️ Image","📱 Post Copy","✍️ Blog","🧵 X Thread","🔁 Variations"],
    mediaBtn:"🎬 Per media", agentBtn:"🤖 AI Agent Script",
    mediaLabels:{instagram:"Instagram",youtube:"YouTube Shorts",linkedin:"LinkedIn",tiktok:"TikTok"},
    confirmDelete:"Delete this project?",
    agentTitle:"🤖 AI Agent Script — Publishing Protocol",
    agentNetworks:["Instagram","TikTok","YouTube","LinkedIn","X / Twitter"],
    agentCopy:"Copy full protocol",
    agentExport:"↓ Export .txt",
  }
};

const AGENT_PROMPT = (item, proj, lang) => {
  const l = lang === "fr";
  const networks = ["Instagram","TikTok","YouTube Shorts","LinkedIn","X / Twitter"];
  const tone = proj.desc || (l ? "vulgarisation grand public, accessible, punchy" : "general public, accessible, punchy");
  return `You are an AI publishing agent for the project "${proj.name}".

Your role: autonomously generate, prepare, submit for human validation, then post content on all 5 platforms.
Tone: ${tone}
Language: bilingual French + English (FR first, EN second)

===== NEWS TO PROCESS =====
Title: ${item.title}
Summary: ${item.summary}
Source: ${item.source}
Category: ${item.category}
Viral score: ${item.viral}/10

===== STEP-BY-STEP AGENT PROTOCOL =====

--- STEP 1: CONTENT GENERATION ---
Generate ALL of the following before any validation:

[INSTAGRAM]
• Visual concept (image description for generation)
• Caption FR: hook (1 punchy line) + body (3-4 lines) + CTA + 10 hashtags
• Caption EN: same structure
• Story FR: slide 1 hook / slide 2 key fact / slide 3 CTA + link
• Story EN: same

[TIKTOK]
• Hook FR (0-3s): ultra-short spoken line
• Hook EN: same
• Video script FR (60s): [0-3s] hook / [3-10s] context / [10-35s] 3 key facts / [35-50s] insight / [50-60s] CTA
• Video script EN: same
• Montage notes: transitions, text overlays, trending audio suggestions
• Caption FR (max 150 chars) + 5 hashtags
• Caption EN + 5 hashtags

[YOUTUBE SHORTS]
• Thumbnail concept
• Title FR (max 60 chars, SEO)
• Title EN (max 60 chars, SEO)
• Video script FR (60s): [0-5s] hook / [5-15s] context / [15-35s] 3 key facts / [35-50s] why it matters / [50-60s] CTA
• Video script EN: same structure
• Montage notes: shot list, cuts, overlays, music vibe, pacing
• Description FR + tags
• Description EN + tags

[LINKEDIN]
• Post FR: scroll-stopper hook + 4-6 short paragraphs + 3 bullet takeaways + CTA question + 5 hashtags
• Post EN: same
• Article idea: long-form angle suggestion for this topic

[X / TWITTER]
• Thread FR: 7 tweets numbered, tweet 1 = hook, tweets 2-5 = key facts, tweet 6 = insight, tweet 7 = CTA (max 280 chars each)
• Thread EN: same structure
• Single post FR (max 280 chars) + 3 hashtags
• Single post EN + 3 hashtags

--- STEP 2: VALIDATION CHECKLIST (send to employee for approval) ---
Before any posting, the agent MUST send this checklist to the assigned employee:

□ Instagram caption FR approved
□ Instagram caption EN approved
□ Instagram visual concept approved
□ TikTok script FR approved
□ TikTok script EN approved
□ TikTok montage notes approved
□ YouTube script FR approved
□ YouTube script EN approved
□ YouTube thumbnail concept approved
□ LinkedIn post FR approved
□ LinkedIn post EN approved
□ X thread FR approved
□ X thread EN approved

VALIDATION RULE: ALL boxes must be checked before the agent proceeds to Step 3.
If employee requests changes: agent regenerates only the flagged items and resubmits.

--- STEP 3: POSTING SEQUENCE ---
Post in this exact order after full validation:

1. X / TWITTER — Post thread (FR first, then EN reply)
   → Wait 10 minutes
2. INSTAGRAM — Post caption + story
   → Wait 30 minutes
3. TIKTOK — Upload video with caption
   → Wait 30 minutes
4. YOUTUBE SHORTS — Upload video with description
   → Wait 1 hour
5. LINKEDIN — Post long-form content
   → Done

--- STEP 4: POST-PUBLISHING REPORT ---
After all posts are live, the agent sends a report to the employee with:
• Links to all published posts
• Best posting time actually used per platform
• Engagement prediction score based on viral score (${item.viral}/10)
• Recommended follow-up content within 48h

===== TECHNICAL SPECIFICATIONS FOR AUTOMATION =====

API endpoints to use:
• Instagram: Instagram Graph API → POST /me/media then /me/media_publish
• TikTok: TikTok Content Posting API → POST /v2/post/publish/video/init
• YouTube: YouTube Data API v3 → POST /upload/youtube/v3/videos
• LinkedIn: LinkedIn Share API → POST /v2/ugcPosts
• X/Twitter: Twitter API v2 → POST /2/tweets

Required credentials (store in environment variables):
• INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_ACCOUNT_ID
• TIKTOK_ACCESS_TOKEN
• YOUTUBE_OAUTH2_TOKEN + YOUTUBE_CHANNEL_ID
• LINKEDIN_ACCESS_TOKEN + LINKEDIN_AUTHOR_URN
• TWITTER_API_KEY + TWITTER_API_SECRET + TWITTER_ACCESS_TOKEN + TWITTER_ACCESS_SECRET

Validation notification method:
• Send checklist via email / Slack / internal tool
• Employee responds with approved/changes
• Agent listens for response before proceeding

Error handling:
• If API call fails: retry 3 times with 5min intervals
• If still failing: notify employee and pause queue
• Log all actions with timestamps
`;
};

function mediaPrompt(media, b, proj) {
  const tone = "Tone: "+(proj.desc||"accessible, punchy")+". Project: "+proj.name+".";
  if (media==="instagram") return tone+"\nNews: "+b+"\n\nGenerate INSTAGRAM content (FR + EN):\nVISUAL CONCEPT\nCAPTION FR: hook+body+CTA+10 hashtags\nCAPTION EN: same\nSTORY FR: 3 slides\nSTORY EN: same\nPlain text.";
  if (media==="youtube")   return tone+"\nNews: "+b+"\n\nYOUTUBE SHORTS (FR+EN reusable for TikTok):\nTHUMBNAIL\nTITLE FR/EN (60 chars SEO)\nSCRIPT FR 60s: [0-5s]HOOK/[5-15s]CONTEXT/[15-35s]FACTS/[35-50s]WHY/[50-60s]CTA\nSCRIPT EN: same\nMONTAGE NOTES\nDESCRIPTION FR+EN+tags\nPlain text.";
  if (media==="linkedin")  return tone+"\nNews: "+b+"\n\nLINKEDIN (FR+EN):\nPOST FR: hook+4-6 paragraphs+3 bullets+CTA+5 hashtags\nPOST EN: same\nARTICLE IDEA\nPlain text.";
  if (media==="tiktok")    return tone+"\nNews: "+b+"\n\nTIKTOK (FR+EN same script as YT Shorts):\nHOOK FR/EN (3s)\nSCRIPT FR 60s: [0-3s]HOOK/[3-10s]CONTEXT/[10-35s]FACTS/[35-50s]TWIST/[50-60s]CTA\nSCRIPT EN: same\nMONTAGE NOTES\nCAPTION FR/EN (150 chars)+hashtags\nPlain text.";
  return "";
}

async function askClaude(prompt) {
  const r = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message||JSON.stringify(d));
  if (!d.text) throw new Error("Empty response");
  return d.text;
}

const MEDIA_CONFIG = {
  instagram:{icon:"📸",bg:"#FBEAF0",border:"#ED93B1",text:"#993556",desc:"Caption + Story"},
  youtube:  {icon:"▶️", bg:"#FCEBEB",border:"#F09595",text:"#A32D2D",desc:"Script + Montage"},
  linkedin: {icon:"💼",bg:"#E6F1FB",border:"#85B7EB",text:"#185FA5",desc:"Post + Article"},
  tiktok:   {icon:"🎵",bg:"#FAECE7",border:"#F0997B",text:"#993C1D",desc:"Script + Caption"},
};
const BTN_KEYS=["script","image","post","blog","thread","formats"];

const S={
  shell:{maxWidth:860,margin:"0 auto",fontFamily:"Inter,system-ui,sans-serif"},
  topbar:{background:"var(--color-background-primary,#fff)",borderBottom:"0.5px solid var(--color-border-tertiary,#e5e7eb)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"},
  logoRow:{display:"flex",alignItems:"center",gap:10},
  logoBox:{width:32,height:32,borderRadius:8,background:"#7F77DD",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13},
  logoName:{fontSize:15,fontWeight:600,color:"var(--color-text-primary,#111)"},
  logoBadge:{fontSize:10,padding:"2px 8px",borderRadius:99,background:"#EEEDFE",color:"#534AB7",border:"0.5px solid #AFA9EC"},
  topRight:{display:"flex",alignItems:"center",gap:8},
  langBtn:(a)=>({fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99,border:"0.5px solid "+(a?"#7F77DD":"var(--color-border-secondary,#d1d5db)"),background:a?"#EEEDFE":"transparent",color:a?"#534AB7":"var(--color-text-secondary,#6b7280)",cursor:"pointer"}),
  projBar:{background:"var(--color-background-secondary,#f3f4f6)",borderBottom:"0.5px solid var(--color-border-tertiary,#e5e7eb)",display:"flex",alignItems:"center",overflowX:"auto",padding:"0 16px"},
  projTab:(a)=>({padding:"10px 14px",fontSize:12,fontWeight:a?600:400,color:a?"#534AB7":"var(--color-text-secondary,#6b7280)",borderBottom:a?"2px solid #7F77DD":"2px solid transparent",background:"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}),
  projTabAdd:{padding:"8px 14px",fontSize:20,color:"var(--color-text-secondary,#6b7280)",background:"transparent",border:"none",cursor:"pointer",lineHeight:1},
  main:{padding:"18px 20px"},
  fetchBtn:(l)=>({width:"100%",padding:"11px",background:l?"var(--color-background-secondary,#f3f4f6)":"#7F77DD",color:l?"var(--color-text-secondary,#6b7280)":"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:l?"not-allowed":"pointer",marginBottom:14}),
  tabs:{display:"flex",gap:3,background:"var(--color-background-secondary,#f3f4f6)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:10,padding:3,marginBottom:14},
  tab:(a)=>({flex:1,padding:"6px 2px",fontSize:11,fontWeight:500,border:a?"0.5px solid var(--color-border-tertiary,#e5e7eb)":"none",borderRadius:8,cursor:"pointer",color:a?"var(--color-text-primary,#111)":"var(--color-text-secondary,#6b7280)",background:a?"var(--color-background-primary,#fff)":"transparent"}),
  card:{background:"var(--color-background-primary,#fff)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:12,padding:"14px 16px",marginBottom:10},
  catBadge:(t)=>{const m={"Data Breach":["#FAECE7","#993C1D","#F0997B"],"Crypto Kidnapping":["#FAEEDA","#854F0B","#EF9F27"],"Corporate Security":["#E6F1FB","#185FA5","#85B7EB"],"AI":["#EEEDFE","#534AB7","#AFA9EC"],"Politique":["#E1F5EE","#0F6E56","#5DCAA5"],"Économie":["#FAEEDA","#854F0B","#EF9F27"]}[t]||["#F1EFE8","#5F5E5A","#B4B2A9"];return{fontSize:10,fontWeight:500,padding:"2px 8px",borderRadius:99,whiteSpace:"nowrap",flexShrink:0,marginTop:2,background:m[0],color:m[1],border:"0.5px solid "+m[2]};},
  title:{fontSize:13,fontWeight:600,color:"var(--color-text-primary,#111)",lineHeight:1.4,marginBottom:3},
  summary:{fontSize:12,color:"var(--color-text-secondary,#6b7280)",lineHeight:1.5},
  meta:{display:"flex",gap:10,marginTop:5,flexWrap:"wrap",alignItems:"center"},
  source:{fontSize:11,color:"var(--color-text-secondary,#6b7280)"},
  trend:{fontSize:11,color:"#1D9E75"},
  viralBadge:(v)=>{const h=v>=7,m=v>=4;return{fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:99,background:h?"#EAF3DE":m?"#FAEEDA":"#FAECE7",color:h?"#3B6D11":m?"#854F0B":"#993C1D",border:"0.5px solid "+(h?"#97C459":m?"#EF9F27":"#F0997B")};},
  divider:{height:"0.5px",background:"var(--color-border-tertiary,#e5e7eb)",margin:"10px 0"},
  actionRow:{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"},
  actionBtn:(a)=>({fontSize:11,padding:"4px 10px",border:"0.5px solid "+(a?"#7F77DD":"var(--color-border-secondary,#d1d5db)"),borderRadius:8,background:a?"#EEEDFE":"var(--color-background-secondary,#f3f4f6)",color:a?"#534AB7":"var(--color-text-primary,#111)",cursor:"pointer",fontWeight:a?600:400}),
  mediaBtnS:{fontSize:11,padding:"4px 10px",border:"0.5px solid #5DCAA5",borderRadius:8,background:"#E1F5EE",color:"#0F6E56",cursor:"pointer",fontWeight:600},
  agentBtnS:{fontSize:11,padding:"4px 10px",border:"0.5px solid #7F77DD",borderRadius:8,background:"#EEEDFE",color:"#534AB7",cursor:"pointer",fontWeight:700},
  exportBtn:{fontSize:11,padding:"4px 10px",border:"0.5px solid #AFA9EC",borderRadius:8,background:"#EEEDFE",color:"#534AB7",cursor:"pointer",fontWeight:600,marginLeft:"auto"},
  outBox:{marginTop:10,background:"var(--color-background-secondary,#f3f4f6)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:8,padding:"10px 12px"},
  outHdr:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7},
  outLabel:{fontSize:11,fontWeight:600,color:"var(--color-text-primary,#111)"},
  copyBtn:{fontSize:10,padding:"2px 8px",border:"0.5px solid var(--color-border-secondary,#d1d5db)",borderRadius:6,background:"transparent",cursor:"pointer",color:"var(--color-text-secondary,#6b7280)"},
  outText:{fontSize:12,color:"var(--color-text-secondary,#6b7280)",lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:300,overflowY:"auto"},
  errBox:{background:"#FAECE7",border:"0.5px solid #F0997B",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#993C1D",marginTop:8},
  secCard:{background:"var(--color-background-primary,#fff)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:12,padding:"14px 16px",marginBottom:10},
  secTitle:{fontSize:13,fontWeight:600,color:"var(--color-text-primary,#111)",marginBottom:10},
  secBtn:()=>({width:"100%",padding:"9px",border:"0.5px solid var(--color-border-secondary,#d1d5db)",borderRadius:8,background:"var(--color-background-secondary,#f3f4f6)",fontSize:12,fontWeight:500,cursor:"pointer",color:"var(--color-text-primary,#111)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}),
  progressWrap:{margin:"8px 0"},
  progressLabel:{fontSize:11,color:"var(--color-text-secondary,#6b7280)",marginBottom:4},
  progressTrack:{height:4,background:"var(--color-background-secondary,#f3f4f6)",borderRadius:99,overflow:"hidden",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)"},
  progressFill:(p)=>({height:"100%",background:"#7F77DD",borderRadius:99,width:p+"%",transition:"width 0.3s ease"}),
  statRow:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10},
  statCard:{background:"var(--color-background-secondary,#f3f4f6)",borderRadius:8,padding:"10px 12px"},
  statLabel:{fontSize:10,color:"var(--color-text-secondary,#6b7280)",marginBottom:3},
  statVal:{fontSize:18,fontWeight:600,color:"var(--color-text-primary,#111)"},
  recapBtn:{width:"100%",padding:"10px",border:"0.5px solid #AFA9EC",borderRadius:10,background:"#EEEDFE",color:"#534AB7",fontSize:12,fontWeight:600,cursor:"pointer",margin:"10px 0"},
  input:{width:"100%",padding:"9px 12px",border:"0.5px solid var(--color-border-secondary,#d1d5db)",borderRadius:8,fontSize:12,color:"var(--color-text-primary,#111)",background:"var(--color-background-primary,#fff)",marginBottom:8,outline:"none",fontFamily:"inherit"},
  textarea:{width:"100%",padding:"9px 12px",border:"0.5px solid var(--color-border-secondary,#d1d5db)",borderRadius:8,fontSize:12,color:"var(--color-text-primary,#111)",background:"var(--color-background-primary,#fff)",marginBottom:8,outline:"none",resize:"vertical",minHeight:64,fontFamily:"inherit"},
  primaryBtn:{padding:"9px 16px",background:"#7F77DD",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"},
  secondaryBtn:{padding:"9px 16px",background:"var(--color-background-secondary,#f3f4f6)",color:"var(--color-text-primary,#111)",border:"0.5px solid var(--color-border-secondary,#d1d5db)",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer"},
  infoBox:{background:"#EEEDFE",border:"0.5px solid #AFA9EC",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#534AB7",marginBottom:10},
  mediaPanel:{marginTop:12,background:"var(--color-background-secondary,#f3f4f6)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:10,padding:"12px 14px"},
  mediaGrid:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10},
  // Agent panel
  agentPanel:{marginTop:12,background:"#EEEDFE",border:"0.5px solid #AFA9EC",borderRadius:10,padding:"14px 16px"},
  agentHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12},
  agentTitle:{fontSize:12,fontWeight:700,color:"#534AB7"},
  agentStepRow:{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"},
  agentStep:(active)=>({fontSize:11,padding:"4px 12px",borderRadius:99,border:"0.5px solid "+(active?"#7F77DD":"var(--color-border-secondary,#d1d5db)"),background:active?"#7F77DD":"var(--color-background-primary,#fff)",color:active?"#fff":"var(--color-text-secondary,#6b7280)",fontWeight:active?600:400}),
  networkGrid:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10},
  networkBtn:(a,c)=>({padding:"8px 4px",border:"0.5px solid "+(a?c.border:"var(--color-border-secondary,#d1d5db)"),borderRadius:8,background:a?c.bg:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"center"}),
  validBox:{background:"var(--color-background-primary,#fff)",border:"0.5px solid #AFA9EC",borderRadius:8,padding:"10px 12px",marginTop:8},
  checkRow:{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:"0.5px solid var(--color-border-tertiary,#e5e7eb)"},
  checkBox:(checked)=>({width:14,height:14,borderRadius:3,border:"1.5px solid "+(checked?"#7F77DD":"var(--color-border-secondary,#d1d5db)"),background:checked?"#7F77DD":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}),
  projForm:{background:"var(--color-background-primary,#fff)",border:"0.5px solid var(--color-border-tertiary,#e5e7eb)",borderRadius:12,padding:"18px 20px",maxWidth:480,margin:"0 auto"},
  projFormTitle:{fontSize:14,fontWeight:600,color:"var(--color-text-primary,#111)",marginBottom:14},
};

const NETWORK_CONFIG = {
  Instagram:{icon:"📸",bg:"#FBEAF0",border:"#ED93B1",text:"#993556"},
  TikTok:   {icon:"🎵",bg:"#FAECE7",border:"#F0997B",text:"#993C1D"},
  YouTube:  {icon:"▶️", bg:"#FCEBEB",border:"#F09595",text:"#A32D2D"},
  LinkedIn: {icon:"💼",bg:"#E6F1FB",border:"#85B7EB",text:"#185FA5"},
  X:        {icon:"✕", bg:"#E1F5EE",border:"#5DCAA5",text:"#0F6E56"},
};

const VALIDATION_ITEMS = [
  "Caption Instagram FR","Caption Instagram EN","Visuel Instagram",
  "Script TikTok FR","Script TikTok EN","Notes montage TikTok",
  "Script YouTube FR","Script YouTube EN","Thumbnail YouTube",
  "Post LinkedIn FR","Post LinkedIn EN",
  "Thread X FR","Thread X EN",
];

function Prog({label,pct}) {
  return (
    <div style={S.progressWrap}>
      <div style={S.progressLabel}>{label}</div>
      <div style={S.progressTrack}><div style={S.progressFill(pct)}/></div>
    </div>
  );
}

function AgentPanel({item,lang,proj,onClose}) {
  const t = T[lang];
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(0);
  const [step, setStep] = useState(0); // 0=generate,1=validate,2=post
  const [checks, setChecks] = useState({});
  const [activeNet, setActiveNet] = useState(null);
  const STEPS = lang==="fr"
    ? ["1. Génération","2. Validation salarié","3. Séquence de post"]
    : ["1. Generation","2. Employee validation","3. Post sequence"];

  const generate = async () => {
    setLoading(true); setProg(10);
    const tick = setInterval(()=>setProg(p=>Math.min(p+6,85)),400);
    try {
      const text = await askClaude(AGENT_PROMPT(item,proj,lang));
      clearInterval(tick); setProg(100); setProtocol(text); setStep(0);
    } catch(e) { clearInterval(tick); setProg(0); setProtocol("Error: "+e.message); }
    setLoading(false);
  };

  const allChecked = VALIDATION_ITEMS.every((_,i)=>checks[i]);
  const checkedCount = VALIDATION_ITEMS.filter((_,i)=>checks[i]).length;

  const exportProtocol = () => {
    if (!protocol) return;
    const all = protocol+"\n\n===== VALIDATION STATUS =====\n"+VALIDATION_ITEMS.map((item,i)=>(checks[i]?"[✓]":"[ ]")+" "+item).join("\n");
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([all],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_agent_protocol.txt"}).click();
  };

  return (
    <div style={S.agentPanel}>
      <div style={S.agentHeader}>
        <span style={S.agentTitle}>{t.agentTitle}</span>
        <div style={{display:"flex",gap:6}}>
          {protocol && <button onClick={exportProtocol} style={{...S.exportBtn,fontSize:10,background:"#7F77DD",color:"#fff",border:"none"}}>{t.agentExport}</button>}
          <button onClick={onClose} style={{...S.secondaryBtn,padding:"4px 10px",fontSize:10}}>{t.cancel}</button>
        </div>
      </div>

      {/* Step indicators */}
      <div style={S.agentStepRow}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>protocol&&setStep(i)} style={S.agentStep(step===i)}>{s}</button>
        ))}
      </div>

      {/* Generate button */}
      {!protocol && (
        <button onClick={generate} disabled={loading} style={{...S.primaryBtn,width:"100%",padding:"10px",fontSize:12}}>
          {loading?"⏳ "+(lang==="fr"?"Génération du protocole...":"Generating protocol..."):"🤖 "+(lang==="fr"?"Générer le protocole complet":"Generate full protocol")}
        </button>
      )}
      {loading && <Prog label={lang==="fr"?"Génération en cours...":"Generating..."} pct={prog}/>}

      {/* STEP 0 — Full protocol */}
      {protocol && step===0 && (
        <div style={S.outBox}>
          <div style={S.outHdr}>
            <span style={S.outLabel}>📋 {lang==="fr"?"Protocole complet":"Full protocol"}</span>
            <div style={{display:"flex",gap:6}}>
              <button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(protocol)}>{t.copy}</button>
              <button onClick={()=>setProtocol(null)} style={{...S.copyBtn,color:"#993C1D"}}>↺</button>
            </div>
          </div>
          <div style={S.outText}>{protocol}</div>
        </div>
      )}

      {/* STEP 1 — Validation checklist */}
      {protocol && step===1 && (
        <div style={S.validBox}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary,#111)"}}>
              {lang==="fr"?"Validation salarié":"Employee validation"} — {checkedCount}/{VALIDATION_ITEMS.length}
            </span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:allChecked?"#EAF3DE":"#FAEEDA",color:allChecked?"#3B6D11":"#854F0B",border:"0.5px solid "+(allChecked?"#97C459":"#EF9F27")}}>
              {allChecked?(lang==="fr"?"✓ Tout validé":"✓ All approved"):(lang==="fr"?"En attente":"Pending")}
            </span>
          </div>
          {VALIDATION_ITEMS.map((item,i)=>(
            <div key={i} style={S.checkRow} onClick={()=>setChecks(c=>({...c,[i]:!c[i]}))}>
              <div style={S.checkBox(checks[i])}>{checks[i]&&<span style={{fontSize:9,color:"#fff",fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:12,color:checks[i]?"var(--color-text-primary,#111)":"var(--color-text-secondary,#6b7280)",textDecoration:checks[i]?"none":"none",cursor:"pointer"}}>{item}</span>
            </div>
          ))}
          {allChecked && (
            <button onClick={()=>setStep(2)} style={{...S.primaryBtn,width:"100%",marginTop:12,fontSize:12}}>
              {lang==="fr"?"✓ Validation complète — Passer à la séquence de post":"✓ All validated — Go to post sequence"}
            </button>
          )}
        </div>
      )}

      {/* STEP 2 — Post sequence */}
      {protocol && step===2 && (
        <div>
          {!allChecked && (
            <div style={{...S.infoBox,background:"#FAECE7",border:"0.5px solid #F0997B",color:"#993C1D"}}>
              ⚠️ {lang==="fr"?"Validation incomplète — retournez à l'étape 2 pour cocher tous les éléments.":"Validation incomplete — go back to step 2 to check all items."}
            </div>
          )}
          <div style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary,#111)",marginBottom:8}}>
            {lang==="fr"?"Ordre de publication :":"Publishing order:"}
          </div>
          <div style={S.networkGrid}>
            {[
              {name:"X / Twitter",k:"X",delay:lang==="fr"?"Maintenant":"Now"},
              {name:"Instagram",k:"Instagram",delay:"+10 min"},
              {name:"TikTok",k:"TikTok",delay:"+40 min"},
              {name:"YouTube",k:"YouTube",delay:"+70 min"},
              {name:"LinkedIn",k:"LinkedIn",delay:"+130 min"},
            ].map((net,i)=>{
              const cfg = NETWORK_CONFIG[net.k]||NETWORK_CONFIG["X"];
              const isActive = activeNet===net.k;
              return (
                <button key={i} onClick={()=>setActiveNet(isActive?null:net.k)}
                  style={S.networkBtn(isActive,cfg)}>
                  <div style={{fontSize:16,marginBottom:3}}>{cfg.icon}</div>
                  <div style={{fontSize:10,fontWeight:600,color:isActive?cfg.text:"var(--color-text-primary,#111)"}}>{net.name}</div>
                  <div style={{fontSize:9,color:"var(--color-text-secondary,#6b7280)",marginTop:2}}>{net.delay}</div>
                </button>
              );
            })}
          </div>
          <div style={{...S.outBox,background:"var(--color-background-primary,#fff)"}}>
            <div style={{fontSize:11,color:"var(--color-text-secondary,#6b7280)",lineHeight:1.7}}>
              {lang==="fr"
                ? "🔑 Variables d'environnement requises pour l'automatisation :\nINSTAGRAM_ACCESS_TOKEN · TIKTOK_ACCESS_TOKEN · YOUTUBE_OAUTH2_TOKEN · LINKEDIN_ACCESS_TOKEN · TWITTER_API_KEY"
                : "🔑 Required environment variables for automation:\nINSTAGRAM_ACCESS_TOKEN · TIKTOK_ACCESS_TOKEN · YOUTUBE_OAUTH2_TOKEN · LINKEDIN_ACCESS_TOKEN · TWITTER_API_KEY"}
            </div>
          </div>
          <button onClick={exportProtocol} style={{...S.primaryBtn,width:"100%",marginTop:10,fontSize:12}}>
            {t.agentExport} {lang==="fr"?"— Protocole + Checklist":"— Protocol + Checklist"}
          </button>
        </div>
      )}
    </div>
  );
}

function MediaPanel({item,lang,proj,onClose}) {
  const t=T[lang];
  const [active,setActive]=useState(null);
  const [cache,setCache]=useState({});
  const [loading,setLoading]=useState(null);
  const [prog,setProg]=useState(0);
  const [err,setErr]=useState(null);
  const b=item.title+" — "+item.summary;
  const gen=async(media)=>{
    if(cache[media]){setActive(media);return;}
    setActive(media);setLoading(media);setErr(null);setProg(10);
    const tick=setInterval(()=>setProg(p=>Math.min(p+8,85)),400);
    try{const text=await askClaude(mediaPrompt(media,b,proj));clearInterval(tick);setProg(100);setCache(c=>({...c,[media]:text}));}
    catch(e){clearInterval(tick);setProg(0);setErr(e.message);}
    setLoading(null);
  };
  const exportAll=()=>{
    const keys=Object.keys(cache);if(!keys.length)return;
    let txt="=== "+proj.name.toUpperCase()+" — MEDIA PACK ===\n"+item.title+"\n"+"=".repeat(40)+"\n\n";
    keys.forEach(k=>{txt+="--- "+k.toUpperCase()+" ---\n"+cache[k]+"\n\n";});
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_mediapack.txt"}).click();
  };
  return (
    <div style={S.mediaPanel}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary,#111)"}}>🎬 {t.mediaBtn}</span>
        <div style={{display:"flex",gap:6}}>
          {Object.keys(cache).length>0&&<button onClick={exportAll} style={{...S.exportBtn,fontSize:10}}>↓ Export</button>}
          <button onClick={onClose} style={{...S.secondaryBtn,padding:"4px 10px",fontSize:10}}>{t.cancel}</button>
        </div>
      </div>
      <div style={S.mediaGrid}>
        {Object.entries(MEDIA_CONFIG).map(([key,cfg])=>{
          const isA=active===key;
          return(
            <button key={key} onClick={()=>gen(key)} disabled={loading===key}
              style={{padding:"10px 12px",border:"0.5px solid "+(isA?cfg.border:"var(--color-border-secondary,#d1d5db)"),borderRadius:8,background:isA?cfg.bg:"var(--color-background-primary,#fff)",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:18,marginBottom:4,display:"block"}}>{cfg.icon}</span>
              <div style={{fontSize:12,fontWeight:600,color:isA?cfg.text:"var(--color-text-primary,#111)"}}>{loading===key?"⏳ ":(cache[key]?"✓ ":"")}{t.mediaLabels[key]}</div>
              <div style={{fontSize:10,color:"var(--color-text-secondary,#6b7280)",marginTop:2}}>{cfg.desc}</div>
            </button>
          );
        })}
      </div>
      {loading&&<Prog label={"Generating "+t.mediaLabels[loading]+"..."} pct={prog}/>}
      {err&&<div style={S.errBox}>{err}</div>}
      {active&&cache[active]&&(
        <div style={S.outBox}>
          <div style={S.outHdr}><span style={S.outLabel}>{MEDIA_CONFIG[active].icon} {t.mediaLabels[active]}</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cache[active])}>{t.copy}</button></div>
          <div style={S.outText}>{cache[active]}</div>
        </div>
      )}
    </div>
  );
}

function NewsCard({item,lang,proj}) {
  const t=T[lang];
  const [open,setOpen]=useState(null);
  const [cache,setCache]=useState({});
  const [loading,setLoading]=useState(null);
  const [err,setErr]=useState(null);
  const [prog,setProg]=useState(0);
  const [showMedia,setShowMedia]=useState(false);
  const [showAgent,setShowAgent]=useState(false);
  const tone="Tone: "+(proj.desc||"accessible, punchy")+". Project: "+proj.name+".";
  const gen=async(type)=>{
    if(cache[type]){setOpen(type);return;}
    setLoading(type);setErr(null);setProg(10);
    const tick=setInterval(()=>setProg(p=>Math.min(p+8,85)),400);
    const b=item.title+" — "+item.summary;
    const P={
      script:tone+" News: "+b+"\nBilingual ElevenLabs script 60s. FR (30s): hook/facts/insight. EN: same. ELEVENLABS: voice,pace,emotion. Plain text.",
      image:"News: "+b+"\nIMAGE PROMPT: cinematic Midjourney/DALL-E, no text. COLOR PALETTE: 3 hex. TEXT OVERLAY: headline. Plain text.",
      post:tone+" News: "+b+"\nBilingual social copy: INSTAGRAM FR/EN, YOUTUBE FR/EN, TIKTOK FR/EN. Plain text.",
      blog:tone+" News: "+b+"\nFull blog FR then EN. FR: TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS CLES/CONCLUSION/META/TAGS. EN: same. Plain text.",
      thread:tone+" News: "+b+"\nViral X thread FR AND EN. 7 tweets each max 280 chars. Plain text.",
      formats:tone+" News: "+b+"\n3 variations: TIKTOK 15s / YOUTUBE 60s / CARROUSEL IG 5 slides. All FR/EN. Plain text.",
    };
    try{const text=await askClaude(P[type]);clearInterval(tick);setProg(100);setCache(c=>({...c,[type]:text}));setOpen(type);}
    catch(e){clearInterval(tick);setProg(0);setErr(e.message);}
    setLoading(null);
  };
  const exportPack=()=>{
    const keys=Object.keys(cache);if(!keys.length)return;
    let txt="=== "+proj.name.toUpperCase()+" — CONTENT PACK ===\n"+item.title+"\nScore: "+item.viral+"/10\n"+"=".repeat(40)+"\n\n";
    keys.forEach(k=>{txt+="--- "+t.btns[BTN_KEYS.indexOf(k)]+" ---\n"+cache[k]+"\n\n";});
    Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:item.title.slice(0,30).replace(/[^a-z0-9]/gi,"_")+"_pack.txt"}).click();
  };
  const vl=item.viral>=7?t.viral[2]:item.viral>=4?t.viral[1]:t.viral[0];
  const toggle=(panel)=>{
    if(panel==="media"){setShowMedia(!showMedia);setShowAgent(false);setOpen(null);}
    if(panel==="agent"){setShowAgent(!showAgent);setShowMedia(false);setOpen(null);}
  };
  return (
    <div style={S.card}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
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
        <button onClick={()=>toggle("media")} style={S.mediaBtnS}>{showMedia?"✕":t.mediaBtn}</button>
        <button onClick={()=>toggle("agent")} style={{...S.agentBtnS,background:showAgent?"#7F77DD":"#EEEDFE",color:showAgent?"#fff":"#534AB7"}}>{showAgent?"✕":t.agentBtn}</button>
        <button onClick={exportPack} style={S.exportBtn}>↓ {t.export}</button>
      </div>
      {showMedia&&<MediaPanel item={item} lang={lang} proj={proj} onClose={()=>setShowMedia(false)}/>}
      {showAgent&&<AgentPanel item={item} lang={lang} proj={proj} onClose={()=>setShowAgent(false)}/>}
      {!showMedia&&!showAgent&&loading&&<Prog label={t.btns[BTN_KEYS.indexOf(loading)]+"..."} pct={prog}/>}
      {!showMedia&&!showAgent&&err&&<div style={S.errBox}>{err}</div>}
      {!showMedia&&!showAgent&&open&&cache[open]&&(
        <div style={S.outBox}>
          <div style={S.outHdr}><span style={S.outLabel}>{t.btns[BTN_KEYS.indexOf(open)]}</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cache[open])}>{t.copy}</button></div>
          <div style={S.outText}>{cache[open]}</div>
        </div>
      )}
    </div>
  );
}

function useGen() {
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [prog,setProg]=useState(0);
  const run=async(prompt)=>{
    setLoading(true);setProg(10);
    const tick=setInterval(()=>setProg(p=>Math.min(p+9,85)),400);
    try{const text=await askClaude(prompt);clearInterval(tick);setProg(100);setResult(text);}
    catch(e){clearInterval(tick);setProg(0);setResult("Error: "+e.message);}
    setLoading(false);
  };
  return{result,loading,prog,run};
}

function ProjectWorkspace({proj,lang}) {
  const t=T[lang];
  const [news,setNews]=useState([]);
  const [loading,setLoading]=useState(false);
  const [prog,setProg]=useState(0);
  const [recap,setRecap]=useState("");
  const [recapLoading,setRecapLoading]=useState(false);
  const [recapProg,setRecapProg]=useState(0);
  const [lastFetch,setLastFetch]=useState(null);
  const [fetchErr,setFetchErr]=useState(null);
  const [tab,setTab]=useState(0);
  const trends=useGen();const hash=useGen();const cal=useGen();

  const fetchNews=async()=>{
    setLoading(true);setNews([]);setRecap("");setFetchErr(null);setProg(10);
    const tick=setInterval(()=>setProg(p=>Math.min(p+7,85)),500);
    const topics=proj.topics||proj.name;
    try{
      const text=await askClaude("News analyst. Find 6 most significant recent news on: \""+topics+"\".\nContext: "+(proj.desc||"general audience")+".\nReturn ONLY raw JSON array, no markdown.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER,\"trend\":\"emoji+%\"}]\nViral: 1-10.");
      clearInterval(tick);setProg(95);
      let parsed=[];
      try{const m=text.match(/\[[\s\S]*\]/);if(m)parsed=JSON.parse(m[0]);}catch{}
      if(!parsed.length){parsed=[{title:"Exemple — "+proj.name,summary:"Relancez le fetch.",source:"—",category:topics.split(",")[0].trim(),viral:5,trend:"↑"}];setFetchErr(t.cached);}
      setNews(parsed);setLastFetch(new Date().toLocaleString(lang==="fr"?"fr-FR":"en-GB"));setProg(100);
    }catch(e){clearInterval(tick);setProg(0);setFetchErr(e.message);}
    setLoading(false);
  };

  const genRecap=async()=>{
    setRecapLoading(true);setRecapProg(10);
    const tick=setInterval(()=>setRecapProg(p=>Math.min(p+9,85)),400);
    const list=news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");
    try{
      const text=await askClaude("Project \""+proj.name+"\" briefing. Tone: "+(proj.desc||"accessible")+"\nNews:\n"+list+"\n\nRECAP DU JOUR (FR) — 5-6 sentences.\nDAILY BRIEFING (EN) — same. Plain text.");
      clearInterval(tick);setRecapProg(100);setRecap(text);
    }catch(e){clearInterval(tick);setRecapProg(0);setRecap("Error: "+e.message);}
    setRecapLoading(false);
  };

  const avg=news.length?Math.round(news.reduce((a,n)=>a+(n.viral||5),0)/news.length*10)/10:0;
  const topN=news.length?news.reduce((a,b)=>((b.viral||0)>(a.viral||0)?b:a)):{};

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
              <button onClick={()=>trends.run("Trend analysis project \""+proj.name+"\":\n"+news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title).join("\n")+"\n\nTREND ANALYSIS FR: 5-6 sentences\nTREND ANALYSIS EN: same\nCONTENT OPPORTUNITIES: 3 angles\nBEST POSTING TIME: by platform\nPlain text.")} disabled={trends.loading} style={S.secBtn()}>{trends.loading?"⏳ "+t.generating:"📈 "+t.analyse}</button>
              {trends.loading&&<Prog label={t.generating} pct={trends.prog}/>}
              {trends.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>📈</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(trends.result)}>{t.copy}</button></div><div style={S.outText}>{trends.result}</div></div>}
            </div>
          )}
          {tab===2&&(
            <div style={S.secCard}>
              <div style={S.secTitle}>🏷️ Hashtags</div>
              <button onClick={()=>hash.run("Hashtag strategy project \""+proj.name+"\": "+news.map(n=>n.title).join(", ")+"\n\nFR HASHTAGS: 10 ranked\nEN HASHTAGS: 10 ranked\nTRENDING NOW: 5\nTO AVOID: 3\nPlain text.")} disabled={hash.loading} style={S.secBtn()}>{hash.loading?"⏳ "+t.generating:t.hashtags}</button>
              {hash.loading&&<Prog label={t.generating} pct={hash.prog}/>}
              {hash.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>🏷️</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(hash.result)}>{t.copy}</button></div><div style={S.outText}>{hash.result}</div></div>}
            </div>
          )}
          {tab===3&&(
            <div style={S.secCard}>
              <div style={S.secTitle}>🗓️ {t.tabs[3]}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>cal.run("7-day editorial calendar project \""+proj.name+"\":\n"+news.map((n,i)=>(i+1)+". ["+n.viral+"/10] "+n.title+" ("+n.category+")").join("\n")+"\n\nFor each day: DAY / PLATFORM / CONTENT / TIME / FR HOOK\nPrioritize viral score. Plain text.")} disabled={cal.loading} style={{...S.secBtn(),flex:1}}>{cal.loading?"⏳ "+t.generating:"🗓️ "+t.calendar}</button>
                {cal.result&&<button onClick={()=>Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([cal.result],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_calendar.txt"}).click()} style={{...S.secondaryBtn,padding:"9px 14px"}}>↓</button>}
              </div>
              {cal.loading&&<Prog label={t.generating} pct={cal.prog}/>}
              {cal.result&&<div style={S.outBox}><div style={S.outHdr}><span style={S.outLabel}>🗓️</span><button style={S.copyBtn} onClick={()=>navigator.clipboard.writeText(cal.result)}>{t.copy}</button></div><div style={S.outText}>{cal.result}</div></div>}
            </div>
          )}
        </>
      )}
      {!news.length&&(
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:32,marginBottom:12}}>📡</div>
          <div style={{fontSize:13,color:"var(--color-text-secondary,#6b7280)"}}>{lang==="fr"?'Cliquez pour scraper les news sur "'+(proj.topics||proj.name)+'".' :'Click to fetch news on "'+(proj.topics||proj.name)+'".'}</div>
        </div>
      )}
    </div>
  );
}

function NewProjectForm({lang,onSave,onCancel}) {
  const t=T[lang];
  const [form,setForm]=useState({name:"",topics:"",desc:""});
  const save=()=>{if(!form.name.trim())return;onSave({...form,id:Date.now()});};
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
  const [lang,setLang]=useState("fr");
  const [projects,setProjects]=useState([]);
  const [activeId,setActiveId]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const t=T[lang];
  const addProject=(proj)=>{setProjects(p=>[...p,proj]);setActiveId(proj.id);setShowNew(false);};
  const deleteProject=(id)=>{
    if(!window.confirm(t.confirmDelete))return;
    const rest=projects.filter(p=>p.id!==id);
    setProjects(rest);setActiveId(rest.length?rest[rest.length-1].id:null);
  };
  const activeProj=projects.find(p=>p.id===activeId);
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
          <button key={proj.id} onClick={()=>{setActiveId(proj.id);setShowNew(false);}} style={S.projTab(activeId===proj.id&&!showNew)}>
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
