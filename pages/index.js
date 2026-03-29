import{useState,useEffect}from"react";

const HISTORY_KEY="scrapinfo_hist_v1";
const loadHist=()=>{try{const r=localStorage.getItem(HISTORY_KEY);return r?JSON.parse(r):[];}catch{return[];}};
const saveHist=(e)=>{try{localStorage.setItem(HISTORY_KEY,JSON.stringify(e));}catch{}};
const addHist=(entry)=>{const h=loadHist();h.unshift(entry);const t=h.slice(0,500);saveHist(t);return t;};

const T={
  fr:{appName:"Scrap Info",appTag:"Veille & Contenu",newProject:"Nouveau projet",projectName:"Nom du projet",projectDescPlaceholder:"Ex: Actualités crypto grand public, ton accessible...",projectTopicsPlaceholder:"Ex: fuites de données, cybersécurité, IA...",projectSave:"Créer",cancel:"Annuler",fetch:"Récupérer les news",fetching:"Chargement...",lastFetch:"Dernière mise à jour",tabs:["News","Tendances","Hashtags","Calendrier","📋 Historique"],recap:"Récap (FR + EN)",generating:"Génération...",analyse:"Analyser les tendances",hashtags:"Générer hashtags",calendar:"Générer le calendrier",export:"Export",copy:"Copier",viral:["Faible","Moyen","Viral"],cached:"News en cache.",btns:["🎙️ ElevenLabs","🖼️ Image","📱 Post Copy","✍️ Blog","🧵 Thread X","🔁 Variations"],mediaBtn:"🎬 Par média",agentBtn:"🤖 Agent IA",mediaLabels:{instagram:"Instagram",youtube:"YouTube Shorts",linkedin:"LinkedIn",tiktok:"TikTok"},confirmDelete:"Supprimer ce projet ?",agentTitle:"🤖 Protocole Agent IA",historyTitle:"📋 Historique",historyEmpty:"Aucune génération enregistrée.",historySearch:"Rechercher...",historyFilterAll:"Tout",historyDelete:"Suppr.",historyClearAll:"Tout effacer",historyExport:"↓ Export",},
  en:{appName:"Scrap Info",appTag:"Intel & Content",newProject:"New project",projectName:"Project name",projectDescPlaceholder:"E.g. Crypto news, casual tone...",projectTopicsPlaceholder:"E.g. data breaches, cybersecurity...",projectSave:"Create",cancel:"Cancel",fetch:"Fetch latest news",fetching:"Loading...",lastFetch:"Last fetch",tabs:["News","Trends","Hashtags","Calendar","📋 History"],recap:"Daily Recap (FR + EN)",generating:"Generating...",analyse:"Analyse trends",hashtags:"Generate hashtags",calendar:"Generate calendar",export:"Export",copy:"Copy",viral:["Low","Medium","Viral"],cached:"Using cached news.",btns:["🎙️ ElevenLabs","🖼️ Image","📱 Post Copy","✍️ Blog","🧵 X Thread","🔁 Variations"],mediaBtn:"🎬 Per media",agentBtn:"🤖 AI Agent",mediaLabels:{instagram:"Instagram",youtube:"YouTube Shorts",linkedin:"LinkedIn",tiktok:"TikTok"},confirmDelete:"Delete this project?",agentTitle:"🤖 AI Agent Protocol",historyTitle:"📋 History",historyEmpty:"No generations yet.",historySearch:"Search...",historyFilterAll:"All",historyDelete:"Delete",historyClearAll:"Clear all",historyExport:"↓ Export",},
};
const TYPE_ICONS={script:"🎙️",image:"🖼️",post:"📱",blog:"✍️",thread:"🧵",formats:"🔁",media_instagram:"📸",media_youtube:"▶️",media_linkedin:"💼",media_tiktok:"🎵",agent:"🤖",recap:"📋",trends:"📈",hashtags:"🏷️",calendar:"🗓️"};
const AGENT_PROMPT=(item,proj)=>"You are an AI publishing agent for project \""+proj.name+"\".\nTone: "+(proj.desc||"accessible, punchy bilingual FR+EN")+"\nNEWS: "+item.title+" — "+item.summary+"\nCategory: "+item.category+" | Viral: "+item.viral+"/10\n\nSTEP 1 — GENERATE ALL:\n[INSTAGRAM] Visual concept + Caption FR+EN (hook+body+CTA+10 hashtags) + Story FR+EN 3 slides\n[TIKTOK] Hook FR+EN 3s + Script FR+EN 60s ([0-3s]HOOK/[3-10s]CONTEXT/[10-35s]FACTS/[35-50s]TWIST/[50-60s]CTA) + Montage notes + Caption FR+EN 150chars\n[YOUTUBE] Thumbnail + Title FR+EN 60chars SEO + Script FR+EN 60s + Montage notes + Description FR+EN+tags\n[LINKEDIN] Post FR+EN (hook+paragraphs+bullets+CTA+hashtags) + Article idea\n[X/TWITTER] Thread FR+EN 7 tweets max 280chars + Single post FR+EN\n\nSTEP 2 — VALIDATION CHECKLIST (all must be approved):\n□ Caption Instagram FR/EN □ Visual □ Script TikTok FR/EN □ Montage □ Script YouTube FR/EN □ Thumbnail □ Post LinkedIn FR/EN □ Thread X FR/EN\n\nSTEP 3 — POST SEQUENCE: 1.X now 2.Instagram +10min 3.TikTok +40min 4.YouTube +70min 5.LinkedIn +130min\n\nSTEP 4 — REPORT: links + engagement prediction + 48h follow-up\nAPIs: Instagram Graph API | TikTok Content Posting API | YouTube Data API v3 | LinkedIn Share API | Twitter API v2\nENV: INSTAGRAM_ACCESS_TOKEN TIKTOK_ACCESS_TOKEN YOUTUBE_OAUTH2_TOKEN LINKEDIN_ACCESS_TOKEN TWITTER_API_KEY";
function mp(media,b,proj){const t="Tone: "+(proj.desc||"accessible")+". Project: "+proj.name+".";if(media==="instagram")return t+"\nNews: "+b+"\nINSTAGRAM FR+EN: VISUAL CONCEPT / CAPTION FR+EN (hook+body+CTA+hashtags) / STORY FR+EN 3 slides. Plain text.";if(media==="youtube")return t+"\nNews: "+b+"\nYOUTUBE SHORTS FR+EN: THUMBNAIL / TITLE FR+EN / SCRIPT FR+EN 60s / MONTAGE NOTES / DESCRIPTION FR+EN. Plain text.";if(media==="linkedin")return t+"\nNews: "+b+"\nLINKEDIN FR+EN: POST FR+EN (hook+paragraphs+bullets+CTA+hashtags) / ARTICLE IDEA. Plain text.";if(media==="tiktok")return t+"\nNews: "+b+"\nTIKTOK FR+EN: HOOK FR+EN 3s / SCRIPT FR+EN 60s / MONTAGE NOTES / CAPTION FR+EN 150chars. Plain text.";return"";}
async function askClaude(prompt){const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"API error");if(!d.text)throw new Error("Empty");return d.text;}
const MC={instagram:{icon:"📸",bg:"#FBEAF0",border:"#ED93B1",text:"#993556",desc:"Caption+Story"},youtube:{icon:"▶️",bg:"#FCEBEB",border:"#F09595",text:"#A32D2D",desc:"Script+Montage"},linkedin:{icon:"💼",bg:"#E6F1FB",border:"#85B7EB",text:"#185FA5",desc:"Post+Article"},tiktok:{icon:"🎵",bg:"#FAECE7",border:"#F0997B",text:"#993C1D",desc:"Script+Caption"}};
const BK=["script","image","post","blog","thread","formats"];
const VI=["Caption Instagram FR","Caption Instagram EN","Visuel Instagram","Script TikTok FR","Script TikTok EN","Montage TikTok","Script YouTube FR","Script YouTube EN","Thumbnail YouTube","Post LinkedIn FR","Post LinkedIn EN","Thread X FR","Thread X EN"];
const css={v:"var(--color-background-primary,#fff)",vs:"var(--color-background-secondary,#f3f4f6)",b1:"var(--color-border-tertiary,#e5e7eb)",b2:"var(--color-border-secondary,#d1d5db)",t1:"var(--color-text-primary,#111)",t2:"var(--color-text-secondary,#6b7280)"};
const S={shell:{maxWidth:860,margin:"0 auto",fontFamily:"Inter,system-ui,sans-serif"},topbar:{background:css.v,borderBottom:"0.5px solid "+css.b1,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"},lRow:{display:"flex",alignItems:"center",gap:10},lBox:{width:32,height:32,borderRadius:8,background:"#7F77DD",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13},lName:{fontSize:15,fontWeight:600,color:css.t1},lBadge:{fontSize:10,padding:"2px 8px",borderRadius:99,background:"#EEEDFE",color:"#534AB7",border:"0.5px solid #AFA9EC"},tr:{display:"flex",alignItems:"center",gap:8},lb:(a)=>({fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99,border:"0.5px solid "+(a?"#7F77DD":css.b2),background:a?"#EEEDFE":"transparent",color:a?"#534AB7":css.t2,cursor:"pointer"}),pb:{background:css.vs,borderBottom:"0.5px solid "+css.b1,display:"flex",alignItems:"center",overflowX:"auto",padding:"0 16px"},pt:(a)=>({padding:"10px 14px",fontSize:12,fontWeight:a?600:400,color:a?"#534AB7":css.t2,borderBottom:a?"2px solid #7F77DD":"2px solid transparent",background:"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}),pa:{padding:"8px 14px",fontSize:20,color:css.t2,background:"transparent",border:"none",cursor:"pointer",lineHeight:1},main:{padding:"18px 20px"},fb:(l)=>({width:"100%",padding:"11px",background:l?css.vs:"#7F77DD",color:l?css.t2:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:l?"not-allowed":"pointer",marginBottom:14}),ts:{display:"flex",gap:3,background:css.vs,border:"0.5px solid "+css.b1,borderRadius:10,padding:3,marginBottom:14},tb:(a)=>({flex:1,padding:"6px 2px",fontSize:11,fontWeight:500,border:a?"0.5px solid "+css.b1:"none",borderRadius:8,cursor:"pointer",color:a?css.t1:css.t2,background:a?css.v:"transparent"}),card:{background:css.v,border:"0.5px solid "+css.b1,borderRadius:12,padding:"14px 16px",marginBottom:10},cb:(t)=>{const m={"Data Breach":["#FAECE7","#993C1D","#F0997B"],"Crypto Kidnapping":["#FAEEDA","#854F0B","#EF9F27"],"Corporate Security":["#E6F1FB","#185FA5","#85B7EB"],"AI":["#EEEDFE","#534AB7","#AFA9EC"],"Politique":["#E1F5EE","#0F6E56","#5DCAA5"],"Économie":["#FAEEDA","#854F0B","#EF9F27"]}[t]||["#F1EFE8","#5F5E5A","#B4B2A9"];return{fontSize:10,fontWeight:500,padding:"2px 8px",borderRadius:99,whiteSpace:"nowrap",flexShrink:0,marginTop:2,background:m[0],color:m[1],border:"0.5px solid "+m[2]};},t1:{fontSize:13,fontWeight:600,color:css.t1,lineHeight:1.4,marginBottom:3},sm:{fontSize:12,color:css.t2,lineHeight:1.5},mt:{display:"flex",gap:10,marginTop:5,flexWrap:"wrap",alignItems:"center"},sc:{fontSize:11,color:css.t2},tr2:{fontSize:11,color:"#1D9E75"},vb:(v)=>{const h=v>=7,m=v>=4;return{fontSize:10,fontWeight:600,padding:"2px 9px",borderRadius:99,background:h?"#EAF3DE":m?"#FAEEDA":"#FAECE7",color:h?"#3B6D11":m?"#854F0B":"#993C1D",border:"0.5px solid "+(h?"#97C459":m?"#EF9F27":"#F0997B")};},dv:{height:"0.5px",background:css.b1,margin:"10px 0"},ar:{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"},ab:(a)=>({fontSize:11,padding:"4px 10px",border:"0.5px solid "+(a?"#7F77DD":css.b2),borderRadius:8,background:a?"#EEEDFE":css.vs,color:a?"#534AB7":css.t1,cursor:"pointer",fontWeight:a?600:400}),mb:{fontSize:11,padding:"4px 10px",border:"0.5px solid #5DCAA5",borderRadius:8,background:"#E1F5EE",color:"#0F6E56",cursor:"pointer",fontWeight:600},ag:(a)=>({fontSize:11,padding:"4px 10px",border:"0.5px solid #7F77DD",borderRadius:8,background:a?"#7F77DD":"#EEEDFE",color:a?"#fff":"#534AB7",cursor:"pointer",fontWeight:700}),eb:{fontSize:11,padding:"4px 10px",border:"0.5px solid #AFA9EC",borderRadius:8,background:"#EEEDFE",color:"#534AB7",cursor:"pointer",fontWeight:600,marginLeft:"auto"},ob:{marginTop:10,background:css.vs,border:"0.5px solid "+css.b1,borderRadius:8,padding:"10px 12px"},oh:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7},ol:{fontSize:11,fontWeight:600,color:css.t1},cpb:{fontSize:10,padding:"2px 8px",border:"0.5px solid "+css.b2,borderRadius:6,background:"transparent",cursor:"pointer",color:css.t2},ot:{fontSize:12,color:css.t2,lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:280,overflowY:"auto"},err:{background:"#FAECE7",border:"0.5px solid #F0997B",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#993C1D",marginTop:8},sc2:{background:css.v,border:"0.5px solid "+css.b1,borderRadius:12,padding:"14px 16px",marginBottom:10},st:{fontSize:13,fontWeight:600,color:css.t1,marginBottom:10},sb:()=>({width:"100%",padding:"9px",border:"0.5px solid "+css.b2,borderRadius:8,background:css.vs,fontSize:12,fontWeight:500,cursor:"pointer",color:css.t1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}),pw:{margin:"8px 0"},pl:{fontSize:11,color:css.t2,marginBottom:4},ptrk:{height:4,background:css.vs,borderRadius:99,overflow:"hidden",border:"0.5px solid "+css.b1},pf:(p)=>({height:"100%",background:"#7F77DD",borderRadius:99,width:p+"%",transition:"width 0.3s ease"}),sr:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10},sk:{background:css.vs,borderRadius:8,padding:"10px 12px"},sl:{fontSize:10,color:css.t2,marginBottom:3},sv:{fontSize:18,fontWeight:600,color:css.t1},rb:{width:"100%",padding:"10px",border:"0.5px solid #AFA9EC",borderRadius:10,background:"#EEEDFE",color:"#534AB7",fontSize:12,fontWeight:600,cursor:"pointer",margin:"10px 0"},inp:{width:"100%",padding:"9px 12px",border:"0.5px solid "+css.b2,borderRadius:8,fontSize:12,color:css.t1,background:css.v,marginBottom:8,outline:"none",fontFamily:"inherit"},txa:{width:"100%",padding:"9px 12px",border:"0.5px solid "+css.b2,borderRadius:8,fontSize:12,color:css.t1,background:css.v,marginBottom:8,outline:"none",resize:"vertical",minHeight:64,fontFamily:"inherit"},prm:{padding:"9px 16px",background:"#7F77DD",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"},sec:{padding:"9px 16px",background:css.vs,color:css.t1,border:"0.5px solid "+css.b2,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer"},inf:{background:"#EEEDFE",border:"0.5px solid #AFA9EC",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#534AB7",marginBottom:10},mpa:{marginTop:12,background:css.vs,border:"0.5px solid "+css.b1,borderRadius:10,padding:"12px 14px"},mg:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10},apa:{marginTop:12,background:"#EEEDFE",border:"0.5px solid #AFA9EC",borderRadius:10,padding:"14px 16px"},pf2:{background:css.v,border:"0.5px solid "+css.b1,borderRadius:12,padding:"18px 20px",maxWidth:480,margin:"0 auto"},pft:{fontSize:14,fontWeight:600,color:css.t1,marginBottom:14},};

function Prog({label,pct}){return(<div style={S.pw}><div style={S.pl}>{label}</div><div style={S.ptrk}><div style={S.pf(pct)}/></div></div>);}

function HistoryPanel({lang,projName}){
  const t=T[lang];
  const [entries,setEntries]=useState(()=>loadHist());
  const [search,setSearch]=useState("");
  const [filterType,setFilterType]=useState("all");
  const [filterDate,setFilterDate]=useState("all");
  const [expanded,setExpanded]=useState(null);
  const [copied,setCopied]=useState(null);
  const types=[...new Set(entries.filter(e=>!projName||e.project===projName).map(e=>e.type))];
  const now=Date.now();
  const DR={all:Infinity,"24h":86400000,"7d":604800000,"30d":2592000000};
  const filtered=entries.filter(e=>{
    if(projName&&e.project!==projName)return false;
    if(now-e.ts>(DR[filterDate]||Infinity))return false;
    if(filterType!=="all"&&e.type!==filterType)return false;
    if(search&&!e.title?.toLowerCase().includes(search.toLowerCase())&&!e.content?.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const copy=(e,id)=>{navigator.clipboard.writeText(e.content);setCopied(id);setTimeout(()=>setCopied(null),1500);};
  const del=(id)=>{const n=entries.filter(e=>e.id!==id);setEntries(n);saveHist(n);};
  const clearAll=()=>{if(!window.confirm(lang==="fr"?"Effacer tout l'historique ?":"Clear all history?"))return;setEntries([]);saveHist([]);};
  const exportAll=()=>{if(!filtered.length)return;let txt="=== SCRAP INFO HISTORY ===\n\n";filtered.forEach(e=>{txt+="["+new Date(e.ts).toLocaleString()+"} "+e.project+" — "+e.type.toUpperCase()+"\nNews: "+e.title+"\n\n"+e.content+"\n"+"─".repeat(50)+"\n\n";});Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:"scrapinfo_history.txt"}).click();};
  return(
    <div style={S.sc2}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <span style={S.st}>{t.historyTitle} ({filtered.length})</span>
        <div style={{display:"flex",gap:6}}>
          {filtered.length>0&&<button onClick={exportAll} style={{...S.eb,marginLeft:0}}>{t.historyExport}</button>}
          {entries.length>0&&<button onClick={clearAll} style={{...S.sec,padding:"4px 10px",fontSize:10,color:"#993C1D",border:"0.5px solid #F0997B",background:"#FAECE7"}}>{t.historyClearAll}</button>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <input style={{...S.inp,marginBottom:0,flex:2,minWidth:140}} placeholder={t.historySearch} value={search} onChange={e=>setSearch(e.target.value)}/>
        <select style={{...S.inp,marginBottom:0,flex:1,minWidth:90}} value={filterDate} onChange={e=>setFilterDate(e.target.value)}>
          <option value="all">{lang==="fr"?"Toutes dates":"All dates"}</option>
          <option value="24h">{lang==="fr"?"Aujourd'hui":"Today"}</option>
          <option value="7d">{lang==="fr"?"7 jours":"7 days"}</option>
          <option value="30d">{lang==="fr"?"30 jours":"30 days"}</option>
        </select>
        <select style={{...S.inp,marginBottom:0,flex:1,minWidth:90}} value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="all">{t.historyFilterAll}</option>
          {types.map(tp=><option key={tp} value={tp}>{(TYPE_ICONS[tp]||"")+' '+tp}</option>)}
        </select>
      </div>
      {filtered.length===0
        ?<div style={{textAlign:"center",padding:"24px",color:css.t2,fontSize:12}}>{t.historyEmpty}</div>
        :filtered.map(entry=>(
          <div key={entry.id} style={{...S.card,marginBottom:8,padding:"10px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:"#EEEDFE",color:"#534AB7",border:"0.5px solid #AFA9EC",fontWeight:600}}>{TYPE_ICONS[entry.type]||""} {entry.type}</span>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:css.vs,color:css.t2,border:"0.5px solid "+css.b1}}>{entry.project}</span>
                  <span style={{fontSize:10,color:css.t2}}>{new Date(entry.ts).toLocaleString(lang==="fr"?"fr-FR":"en-GB")}</span>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:css.t1,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.title}</div>
                {expanded!==entry.id&&<div style={{fontSize:11,color:css.t2}}>{(entry.content||"").slice(0,80)}...</div>}
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                <button onClick={()=>setExpanded(expanded===entry.id?null:entry.id)} style={{...S.cpb,padding:"3px 8px"}}>{expanded===entry.id?"▲":"▼"}</button>
                <button onClick={()=>copy(entry,entry.id)} style={{...S.cpb,padding:"3px 8px",color:copied===entry.id?"#3B6D11":css.t2}}>{copied===entry.id?"✓":t.copy}</button>
                <button onClick={()=>del(entry.id)} style={{...S.cpb,padding:"3px 8px",color:"#993C1D"}}>{t.historyDelete}</button>
              </div>
            </div>
            {expanded===entry.id&&<div style={{...S.ob,marginTop:8}}><div style={S.ot}>{entry.content}</div></div>}
          </div>
        ))
      }
    </div>
  );
}

function AgentPanel({item,lang,proj,onClose}){
  const t=T[lang];
  const [protocol,setProtocol]=useState(null);
  const [loading,setLoading]=useState(false);
  const [prog,setProg]=useState(0);
  const [step,setStep]=useState(0);
  const [checks,setChecks]=useState({});
  const STEPS=lang==="fr"?["1. Génération","2. Validation","3. Post"]:["1. Generation","2. Validation","3. Post"];
  const gen=async()=>{setLoading(true);setProg(10);const tick=setInterval(()=>setProg(p=>Math.min(p+6,85)),400);try{const text=await askClaude(AGENT_PROMPT(item,proj));clearInterval(tick);setProg(100);setProtocol(text);setStep(0);addHist({id:Date.now().toString(36),ts:Date.now(),project:proj.name,type:"agent",title:item.title,content:text});}catch(e){clearInterval(tick);setProg(0);setProtocol("Error: "+e.message);}setLoading(false);};
  const allOk=VI.every((_,i)=>checks[i]);
  const exp=()=>{if(!protocol)return;const all=protocol+"\n\n=== VALIDATION ===\n"+VI.map((v,i)=>(checks[i]?"[✓]":"[ ]")+" "+v).join("\n");Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([all],{type:"text/plain"})),download:proj.name.replace(/\s+/g,"_")+"_agent.txt"}).click();};
  return(
    <div style={S.apa}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:12,fontWeight:700,color:"#534AB7"}}>{t.agentTitle}</span>
        <div style={{display:"flex",gap:6}}>{protocol&&<button onClick={exp} style={{...S.eb,marginLeft:0,background:"#7F77DD",color:"#fff",border:"none",fontSize:10}}>↓ Export</button>}<button onClick={onClose} style={{...S.sec,padding:"4px 10px",fontSize:10}}>{t.cancel}</button></div>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>{STEPS.map((s,i)=><button key={i} onClick={()=>protocol&&setStep(i)} style={{fontSize:11,padding:"4px 10px",borderRadius:99,border:"0.5px solid "+(step===i?"#7F77DD":css.b2),background:step===i?"#7F77DD":css.v,color:step===i?"#fff":css.t2,fontWeight:step===i?600:400}}>{s}</button>)}</div>
      {!protocol&&<button onClick={gen} disabled={loading} style={{...S.prm,width:"100%",padding:"10px",fontSize:12}}>{loading?"⏳ "+(lang==="fr"?"Génération...":"Generating..."):"🤖 "+(lang==="fr"?"Générer le protocole":"Generate protocol")}</button>}
      {loading&&<Prog label={lang==="fr"?"Génération...":"Generating..."} pct={prog}/>}
      {protocol&&step===0&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>📋</span><div style={{display:"flex",gap:5}}><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(protocol)}>{t.copy}</button><button onClick={()=>setProtocol(null)} style={{...S.cpb,color:"#993C1D"}}>↺</button></div></div><div style={S.ot}>{protocol}</div></div>}
      {protocol&&step===1&&(
        <div style={{background:css.v,border:"0.5px solid #AFA9EC",borderRadius:8,padding:"10px 12px",marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,fontWeight:600,color:css.t1}}>{lang==="fr"?"Validation":"Validation"} — {VI.filter((_,i)=>checks[i]).length}/{VI.length}</span><span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:allOk?"#EAF3DE":"#FAEEDA",color:allOk?"#3B6D11":"#854F0B"}}>{allOk?"✓ OK":"Pending"}</span></div>
          {VI.map((v,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:"0.5px solid "+css.b1,cursor:"pointer"}} onClick={()=>setChecks(c=>({...c,[i]:!c[i]}))}>
            <div style={{width:14,height:14,borderRadius:3,border:"1.5px solid "+(checks[i]?"#7F77DD":css.b2),background:checks[i]?"#7F77DD":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{checks[i]&&<span style={{fontSize:9,color:"#fff",fontWeight:700}}>✓</span>}</div>
            <span style={{fontSize:12,color:css.t1}}>{v}</span>
          </div>)}
          {allOk&&<button onClick={()=>setStep(2)} style={{...S.prm,width:"100%",marginTop:10,fontSize:12}}>✓ {lang==="fr"?"Passer au post":"Proceed to posting"}</button>}
        </div>
      )}
      {protocol&&step===2&&(
        <div>
          {!allOk&&<div style={{...S.inf,background:"#FAECE7",border:"0.5px solid #F0997B",color:"#993C1D"}}>⚠️ {lang==="fr"?"Validation incomplète":"Incomplete validation"}</div>}
          <div style={{fontSize:12,fontWeight:600,color:css.t1,marginBottom:8}}>{lang==="fr"?"Ordre de publication:":"Publishing order:"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10}}>
            {[{n:"X/Twitter",bg:"#E1F5EE",br:"#5DCAA5",tx:"#0F6E56",ic:"✕",d:"Now"},{n:"Instagram",bg:"#FBEAF0",br:"#ED93B1",tx:"#993556",ic:"📸",d:"+10min"},{n:"TikTok",bg:"#FAECE7",br:"#F0997B",tx:"#993C1D",ic:"🎵",d:"+40min"},{n:"YouTube",bg:"#FCEBEB",br:"#F09595",tx:"#A32D2D",ic:"▶️",d:"+70min"},{n:"LinkedIn",bg:"#E6F1FB",br:"#85B7EB",tx:"#185FA5",ic:"💼",d:"+130min"}].map((net,i)=>(
              <div key={i} style={{padding:"8px 4px",border:"0.5px solid "+net.br,borderRadius:8,background:net.bg,textAlign:"center"}}><div style={{fontSize:16,marginBottom:2}}>{net.ic}</div><div style={{fontSize:10,fontWeight:600,color:net.tx}}>{net.n}</div><div style={{fontSize:9,color:css.t2,marginTop:1}}>{net.d}</div></div>
            ))}
          </div>
          <div style={{...S.ob,background:css.v,fontSize:11,color:css.t2,lineHeight:1.7}}>🔑 INSTAGRAM_ACCESS_TOKEN · TIKTOK_ACCESS_TOKEN · YOUTUBE_OAUTH2_TOKEN · LINKEDIN_ACCESS_TOKEN · TWITTER_API_KEY</div>
          <button onClick={exp} style={{...S.prm,width:"100%",marginTop:10,fontSize:12}}>↓ Export Protocol + Checklist</button>
        </div>
      )}
    </div>
  );
}

function MediaPanel({item,lang,proj,onClose}){
  const t=T[lang];
  const [active,setActive]=useState(null);
  const [cache,setCache]=useState({});
  const [loading,setLoading]=useState(null);
  const [prog,setProg]=useState(0);
  const [err,setErr]=useState(null);
  const b=item.title+" — "+item.summary;
  const gen=async(media)=>{if(cache[media]){setActive(media);return;}setActive(media);setLoading(media);setErr(null);setProg(10);const tick=setInterval(()=>setProg(p=>Math.min(p+8,85)),400);try{const text=await askClaude(mp(media,b,proj));clearInterval(tick);setProg(100);setCache(c=>({...c,[media]:text}));addHist({id:Date.now().toString(36),ts:Date.now(),project:proj.name,type:"media_"+media,title:item.title,content:text});}catch(e){clearInterval(tick);setProg(0);setErr(e.message);}setLoading(null);};
  const expAll=()=>{const keys=Object.keys(cache);if(!keys.length)return;let txt="=== MEDIA PACK ===\n"+item.title+"\n\n";keys.forEach(k=>{txt+="--- "+k.toUpperCase()+" ---\n"+cache[k]+"\n\n";});Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:proj.name+"_media.txt"}).click();};
  return(
    <div style={S.mpa}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:12,fontWeight:600,color:css.t1}}>🎬 {t.mediaBtn}</span><div style={{display:"flex",gap:6}}>{Object.keys(cache).length>0&&<button onClick={expAll} style={{...S.eb,fontSize:10}}>↓</button>}<button onClick={onClose} style={{...S.sec,padding:"4px 10px",fontSize:10}}>{t.cancel}</button></div></div>
      <div style={S.mg}>{Object.entries(MC).map(([key,cfg])=>{const isA=active===key;return(<button key={key} onClick={()=>gen(key)} disabled={loading===key} style={{padding:"10px 12px",border:"0.5px solid "+(isA?cfg.border:css.b2),borderRadius:8,background:isA?cfg.bg:css.v,cursor:"pointer",textAlign:"left"}}><span style={{fontSize:18,marginBottom:4,display:"block"}}>{cfg.icon}</span><div style={{fontSize:12,fontWeight:600,color:isA?cfg.text:css.t1}}>{loading===key?"⏳ ":(cache[key]?"✓ ":"")}{t.mediaLabels[key]}</div><div style={{fontSize:10,color:css.t2,marginTop:2}}>{cfg.desc}</div></button>);})}</div>
      {loading&&<Prog label={"Generating "+t.mediaLabels[loading]+"..."} pct={prog}/>}
      {err&&<div style={S.err}>{err}</div>}
      {active&&cache[active]&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>{MC[active].icon} {t.mediaLabels[active]}</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(cache[active])}>{t.copy}</button></div><div style={S.ot}>{cache[active]}</div></div>}
    </div>
  );
}

function NewsCard({item,lang,proj}){
  const t=T[lang];
  const [open,setOpen]=useState(null);
  const [cache,setCache]=useState({});
  const [loading,setLoading]=useState(null);
  const [err,setErr]=useState(null);
  const [prog,setProg]=useState(0);
  const [showMedia,setShowMedia]=useState(false);
  const [showAgent,setShowAgent]=useState(false);
  const tone="Tone: "+(proj.desc||"accessible, punchy")+". Project: "+proj.name+".";
  const gen=async(type)=>{if(cache[type]){setOpen(type);return;}setLoading(type);setErr(null);setProg(10);const tick=setInterval(()=>setProg(p=>Math.min(p+8,85)),400);const b=item.title+" — "+item.summary;const P={script:tone+" News: "+b+"\nBilingual ElevenLabs 60s. FR 30s: hook/facts/insight. EN: same. ELEVENLABS voice+pace+emotion. Plain text.",image:"News: "+b+"\nIMAGE PROMPT cinematic Midjourney no text. COLOR PALETTE 3 hex. TEXT OVERLAY. Plain text.",post:tone+" News: "+b+"\nBilingual: INSTAGRAM FR/EN YOUTUBE FR/EN TIKTOK FR/EN. Plain text.",blog:tone+" News: "+b+"\nBlog FR then EN. FR: TITRE/CHAPEAU/CONTEXTE/ANALYSE/POINTS/CONCLUSION/META/TAGS. EN: same. Plain text.",thread:tone+" News: "+b+"\nX thread FR+EN 7 tweets max 280. Plain text.",formats:tone+" News: "+b+"\n3 formats: TIKTOK 15s / YOUTUBE 60s / CARROUSEL IG 5 slides. FR+EN. Plain text."};try{const text=await askClaude(P[type]);clearInterval(tick);setProg(100);setCache(c=>({...c,[type]:text}));setOpen(type);addHist({id:Date.now().toString(36),ts:Date.now(),project:proj.name,type,title:item.title,content:text});}catch(e){clearInterval(tick);setProg(0);setErr(e.message);}setLoading(null);};
  const expPack=()=>{const keys=Object.keys(cache);if(!keys.length)return;let txt="=== CONTENT PACK ===\n"+item.title+"\n\n";keys.forEach(k=>{txt+="--- "+t.btns[BK.indexOf(k)]+" ---\n"+cache[k]+"\n\n";});Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([txt],{type:"text/plain"})),download:item.title.slice(0,30).replace(/[^a-z0-9]/gi,"_")+".txt"}).click();};
  const vl=item.viral>=7?t.viral[2]:item.viral>=4?t.viral[1]:t.viral[0];
  const tog=(p)=>{if(p==="media"){setShowMedia(!showMedia);setShowAgent(false);setOpen(null);}if(p==="agent"){setShowAgent(!showAgent);setShowMedia(false);setOpen(null);}};
  return(
    <div style={S.card}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
        <span style={S.cb(item.category)}>{item.category}</span>
        <div style={{flex:1}}><div style={S.t1}>{item.title}</div><div style={S.sm}>{item.summary}</div><div style={S.mt}><span style={S.sc}>{item.source}</span>{item.trend&&<span style={S.tr2}>{item.trend}</span>}<span style={S.vb(item.viral)}>{item.viral}/10 — {vl}</span></div></div>
      </div>
      <div style={S.dv}/>
      <div style={S.ar}>
        {BK.map((k,i)=><button key={k} onClick={()=>gen(k)} disabled={!!loading} style={S.ab(open===k)}>{loading===k?"⏳":t.btns[i]}</button>)}
        <button onClick={()=>tog("media")} style={S.mb}>{showMedia?"✕":t.mediaBtn}</button>
        <button onClick={()=>tog("agent")} style={S.ag(showAgent)}>{showAgent?"✕":t.agentBtn}</button>
        <button onClick={expPack} style={S.eb}>↓ {t.export}</button>
      </div>
      {showMedia&&<MediaPanel item={item} lang={lang} proj={proj} onClose={()=>setShowMedia(false)}/>}
      {showAgent&&<AgentPanel item={item} lang={lang} proj={proj} onClose={()=>setShowAgent(false)}/>}
      {!showMedia&&!showAgent&&loading&&<Prog label={t.btns[BK.indexOf(loading)]+"..."} pct={prog}/>}
      {!showMedia&&!showAgent&&err&&<div style={S.err}>{err}</div>}
      {!showMedia&&!showAgent&&open&&cache[open]&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>{t.btns[BK.indexOf(open)]}</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(cache[open])}>{t.copy}</button></div><div style={S.ot}>{cache[open]}</div></div>}
    </div>
  );
}

function useGen(){const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);const [prog,setProg]=useState(0);const run=async(prompt,he)=>{setLoading(true);setProg(10);const tick=setInterval(()=>setProg(p=>Math.min(p+9,85)),400);try{const text=await askClaude(prompt);clearInterval(tick);setProg(100);setResult(text);if(he)addHist({id:Date.now().toString(36),ts:Date.now(),...he,content:text});}catch(e){clearInterval(tick);setProg(0);setResult("Error: "+e.message);}setLoading(false);};return{result,loading,prog,run};}

function ProjectWorkspace({proj,lang}){
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
  const fetchNews=async()=>{setLoading(true);setNews([]);setRecap("");setFetchErr(null);setProg(10);const tick=setInterval(()=>setProg(p=>Math.min(p+7,85)),500);const topics=proj.topics||proj.name;try{const text=await askClaude("News analyst. 6 most significant recent news on: \""+topics+"\".\nContext: "+(proj.desc||"general audience")+".\nReturn ONLY raw JSON array no markdown.\nSchema: [{\"title\":\"...\",\"summary\":\"2 sentences.\",\"source\":\"...\",\"category\":\"...\",\"viral\":NUMBER,\"trend\":\"emoji+%\"}]\nViral 1-10.");clearInterval(tick);setProg(95);let p2=[];try{const m=text.match(/\[[\s\S]*\]/);if(m)p2=JSON.parse(m[0]);}catch{}if(!p2.length){p2=[{title:"Exemple",summary:"Relancez.",source:"—",category:topics.split(",")[0].trim(),viral:5,trend:"↑"}];setFetchErr(t.cached);}setNews(p2);setLastFetch(new Date().toLocaleString(lang==="fr"?"fr-FR":"en-GB"));setProg(100);}catch(e){clearInterval(tick);setProg(0);setFetchErr(e.message);}setLoading(false);};
  const genRecap=async()=>{setRecapLoading(true);setRecapProg(10);const tick=setInterval(()=>setRecapProg(p=>Math.min(p+9,85)),400);const list=news.map((n,i)=>(i+1)+". ["+n.category+"] "+n.title+": "+n.summary).join("\n");try{const text=await askClaude("Project \""+proj.name+"\" briefing. Tone: "+(proj.desc||"accessible")+"\n"+list+"\n\nRECAP FR 5-6 sentences.\nDAILY BRIEFING EN same. Plain text.");clearInterval(tick);setRecapProg(100);setRecap(text);addHist({id:Date.now().toString(36),ts:Date.now(),project:proj.name,type:"recap",title:"Recap "+new Date().toLocaleDateString(),content:text});}catch(e){clearInterval(tick);setRecapProg(0);setRecap("Error: "+e.message);}setRecapLoading(false);};
  const avg=news.length?Math.round(news.reduce((a,n)=>a+(n.viral||5),0)/news.length*10)/10:0;
  const topN=news.length?news.reduce((a,b)=>((b.viral||0)>(a.viral||0)?b:a)):{};
  // KEY FIX: always show tabs, History tab always accessible
  const showTabs=news.length>0||tab===4;
  return(
    <div style={S.main}>
      <div style={{background:css.vs,borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div><span style={{fontSize:13,fontWeight:600,color:css.t1}}>{proj.name}</span>{proj.topics&&<span style={{fontSize:11,color:css.t2,marginLeft:8}}>📌 {proj.topics}</span>}</div>
        {lastFetch&&<span style={{fontSize:11,color:css.t2}}>{t.lastFetch}: {lastFetch}</span>}
      </div>
      <button onClick={fetchNews} disabled={loading} style={S.fb(loading)}>{loading?t.fetching:"↻  "+t.fetch}</button>
      {loading&&<Prog label={t.fetching} pct={prog}/>}
      {fetchErr&&<div style={S.inf}>{fetchErr}</div>}
      {/* ALWAYS show tabs bar — History tab visible even before fetch */}
      <div style={S.ts}>{t.tabs.map((name,i)=><button key={i} onClick={()=>setTab(i)} style={S.tb(tab===i)}>{name}</button>)}</div>
      {tab===0&&news.length===0&&<div style={{textAlign:"center",padding:"32px 20px"}}><div style={{fontSize:32,marginBottom:12}}>📡</div><div style={{fontSize:13,color:css.t2}}>{lang==="fr"?'Cliquez pour scraper les news sur "'+(proj.topics||proj.name)+'".' :'Click to fetch news on "'+(proj.topics||proj.name)+'".'}</div></div>}
      {tab===0&&news.length>0&&(<>
        {news.map((item,i)=><NewsCard key={i} item={item} lang={lang} proj={proj}/>)}
        <button onClick={genRecap} disabled={recapLoading} style={S.rb}>{recapLoading?t.generating:"📋 "+t.recap}</button>
        {recapLoading&&<Prog label={t.generating} pct={recapProg}/>}
        {recap&&<div style={S.sc2}><div style={S.oh}><span style={S.st}>📋 {proj.name}</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(recap)}>{t.copy}</button></div><div style={{fontSize:13,color:css.t2,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{recap}</div></div>}
      </>)}
      {tab===1&&<div style={S.sc2}><div style={S.sr}><div style={S.sk}><div style={S.sl}>Stories</div><div style={S.sv}>{news.length}</div></div><div style={S.sk}><div style={S.sl}>{lang==="fr"?"Score moyen":"Avg"}</div><div style={S.sv}>{avg}</div></div><div style={S.sk}><div style={S.sl}>Top</div><div style={{...S.sv,fontSize:11,paddingTop:4}}>{topN.category||"—"}</div></div></div><button onClick={()=>trends.run("Trends \""+proj.name+"\": "+news.map((n,i)=>(i+1)+". "+n.title).join(", ")+"\nTREND FR 5-6s\nTREND EN same\nOPP 3 angles\nTIME by platform\nPlain text.",{project:proj.name,type:"trends",title:"Trends "+new Date().toLocaleDateString()})} disabled={trends.loading} style={S.sb()}>{trends.loading?"⏳ "+t.generating:"📈 "+t.analyse}</button>{trends.loading&&<Prog label={t.generating} pct={trends.prog}/>}{trends.result&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>📈</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(trends.result)}>{t.copy}</button></div><div style={S.ot}>{trends.result}</div></div>}</div>}
      {tab===2&&<div style={S.sc2}><div style={S.st}>🏷️ Hashtags</div><button onClick={()=>hash.run("Hashtags \""+proj.name+"\": "+news.map(n=>n.title).join(", ")+"\nFR 10 ranked\nEN 10 ranked\nTRENDING 5\nAVOID 3\nPlain text.",{project:proj.name,type:"hashtags",title:"Hashtags "+new Date().toLocaleDateString()})} disabled={hash.loading} style={S.sb()}>{hash.loading?"⏳ "+t.generating:t.hashtags}</button>{hash.loading&&<Prog label={t.generating} pct={hash.prog}/>}{hash.result&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>🏷️</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(hash.result)}>{t.copy}</button></div><div style={S.ot}>{hash.result}</div></div>}</div>}
      {tab===3&&<div style={S.sc2}><div style={S.st}>🗓️ {t.tabs[3]}</div><div style={{display:"flex",gap:8}}><button onClick={()=>cal.run("7-day calendar \""+proj.name+"\": "+news.map((n,i)=>(i+1)+". ["+n.viral+"/10] "+n.title).join("\n")+"\nDAY/PLATFORM/CONTENT/TIME/HOOK. Prioritize viral. Plain text.",{project:proj.name,type:"calendar",title:"Calendar "+new Date().toLocaleDateString()})} disabled={cal.loading} style={{...S.sb(),flex:1}}>{cal.loading?"⏳ "+t.generating:"🗓️ "+t.calendar}</button>{cal.result&&<button onClick={()=>Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([cal.result],{type:"text/plain"})),download:proj.name+"_cal.txt"}).click()} style={{...S.sec,padding:"9px 14px"}}>↓</button>}</div>{cal.loading&&<Prog label={t.generating} pct={cal.prog}/>}{cal.result&&<div style={S.ob}><div style={S.oh}><span style={S.ol}>🗓️</span><button style={S.cpb} onClick={()=>navigator.clipboard.writeText(cal.result)}>{t.copy}</button></div><div style={S.ot}>{cal.result}</div></div>}</div>}
      {tab===4&&<HistoryPanel lang={lang} projName={proj.name}/>}
    </div>
  );
}

function NewProjectForm({lang,onSave,onCancel}){const t=T[lang];const [form,setForm]=useState({name:"",topics:"",desc:""});const save=()=>{if(!form.name.trim())return;onSave({...form,id:Date.now()});};return(<div style={S.main}><div style={S.pf2}><div style={S.pft}>+ {t.newProject}</div><input style={S.inp} placeholder={t.projectName+" *"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/><input style={S.inp} placeholder={t.projectTopicsPlaceholder} value={form.topics} onChange={e=>setForm(f=>({...f,topics:e.target.value}))}/><textarea style={S.txa} placeholder={t.projectDescPlaceholder} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/><div style={{display:"flex",gap:8}}><button onClick={save} style={S.prm}>{t.projectSave}</button>{onCancel&&<button onClick={onCancel} style={S.sec}>{t.cancel}</button>}</div></div></div>);}

export default function App(){
  const [lang,setLang]=useState("fr");
  const [projects,setProjects]=useState([]);
  const [activeId,setActiveId]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const t=T[lang];
  const addProject=(proj)=>{setProjects(p=>[...p,proj]);setActiveId(proj.id);setShowNew(false);};
  const deleteProject=(id)=>{if(!window.confirm(t.confirmDelete))return;const rest=projects.filter(p=>p.id!==id);setProjects(rest);setActiveId(rest.length?rest[rest.length-1].id:null);};
  const activeProj=projects.find(p=>p.id===activeId);
  return(
    <div style={S.shell}>
      <div style={S.topbar}><div style={S.lRow}><div style={S.lBox}>SI</div><span style={S.lName}>{t.appName}</span><span style={S.lBadge}>{t.appTag}</span></div><div style={S.tr}><button onClick={()=>setLang("fr")} style={S.lb(lang==="fr")}>FR</button><button onClick={()=>setLang("en")} style={S.lb(lang==="en")}>EN</button></div></div>
      <div style={S.pb}>{projects.map(proj=>(<button key={proj.id} onClick={()=>{setActiveId(proj.id);setShowNew(false);}} style={S.pt(activeId===proj.id&&!showNew)}><span>{proj.name}</span><span onClick={e=>{e.stopPropagation();deleteProject(proj.id);}} style={{fontSize:11,color:css.t2,marginLeft:4,cursor:"pointer",opacity:0.7}}>✕</span></button>))}<button onClick={()=>{setShowNew(true);setActiveId(null);}} style={S.pa} title={t.newProject}>＋</button></div>
      {showNew&&<NewProjectForm lang={lang} onSave={addProject} onCancel={projects.length?()=>{setShowNew(false);setActiveId(projects[projects.length-1].id);}:null}/>}
      {!showNew&&activeProj&&<ProjectWorkspace key={activeProj.id} proj={activeProj} lang={lang}/>}
      {!showNew&&!activeProj&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>📡</div><div style={{fontSize:15,fontWeight:600,color:css.t1,marginBottom:8}}>{t.appName}</div><div style={{fontSize:13,color:css.t2,marginBottom:24,maxWidth:380,margin:"0 auto 24px"}}>{lang==="fr"?"Créez un projet pour scraper et générer du contenu.":"Create a project to scrape and generate content."}</div><button onClick={()=>setShowNew(true)} style={S.prm}>+ {t.newProject}</button></div>}
    </div>
  );
                       }
