/* ===== Photo Quest: Exposure Triad (Bilingual, Robust Bind) =====
   This build:
   - Proves the script loaded (console + badge)
   - Waits for DOMContentLoaded
   - Uses event delegation for Capture/Next
   - Auto-opens "Why" panel
   - Logs helpful diagnostics
================================================================= */

// --- prove the script loaded
console.log("[PhotoQuest] game.js loaded");
(function(){ 
  const tag = document.createElement("div");
  tag.textContent = "PhotoQuest JS ✔";
  tag.style.cssText = "position:fixed;bottom:8px;right:8px;font:12px/1.2 system-ui;background:#0c1116;color:#9ae6b4;border:1px solid #2b3340;border-radius:8px;padding:4px 8px;opacity:.7;z-index:9999";
  tag.id = "pq-badge";
  document.addEventListener("DOMContentLoaded", ()=> {
    if (!document.getElementById("pq-badge")) document.body.appendChild(tag);
    setTimeout(()=> tag.remove(), 3000);
  });
})();

/* ----------------- Language setup (same as before; shortened) ----------------- */
const DEFAULT_LANG = localStorage.getItem("pq_lang") || "en";
let LANG = DEFAULT_LANG;
document.documentElement.lang = LANG;

const STRINGS = {
  en: {
    scene: "Scene", settingsHeading: "Choose Your Settings",
    apertureLabel: "Aperture (f/stop)", shutterLabel: "Shutter Speed", isoLabel: "ISO",
    capture: "Capture!", nextScene: "Next Scene ↻", roundScore: "Round Score:",
    totalScore: "Total:", cleared: "Scenes Cleared:", histHeading: "Histogram (simulated)",
    whySummary: "Why did I get this result?", tip: "Tip: Hover (or focus) highlighted terms in scene text to see quick definitions.",
    exposure_spot: "Exposure looks spot on.",
    under_by: d => `Underexposed (too dark) by about ${d} EV.`,
    over_by: d => `Overexposed (too bright) by about ${d} EV.`,
    dof: "DOF", motion: "Motion", noise: "Noise",
    try_adjust: "Try adjusting one or two settings and capture again.",
    captured: "Nice! Scene captured.",
    why_excellent: "Exposure: excellent (≈0 EV difference).",
    why_close: "Exposure: close (within ±1 EV).",
    why_off: "Exposure: off (beyond ±1 EV).",
    why_dof_mismatch: (want, got) => `Depth of Field: wanted <strong>${want}</strong> but settings gave <strong>${got}</strong>.`,
    why_dof_match: got => `Depth of Field: matched (<strong>${got}</strong>).`,
    why_motion_freeze_needed: "Motion: needed to <strong>freeze</strong> action—use faster shutter.",
    why_motion_blur_risk: "Motion: slow shutter risks blur—consider faster speed or tripod.",
    why_motion_ok: "Motion: appropriate for the scene.",
    why_iso_low: min => `ISO: a bit low for this light (risk underexposure); suggested ≥ ${min}.`,
    why_iso_high: max => `ISO: high (more noise); suggested ≤ ${max}.`,
    shallow:"shallow", deep:"deep", normal:"normal", freeze:"freeze", blur:"blur", low:"low", moderate:"moderate", high:"high",
    glossary: {
      "Aperture":"The opening in a camera lens...",
      "ISO":"Sensor sensitivity to light...",
      "Shutter Speed":"How long the shutter stays open...",
      "Exposure":"Total light captured (Aperture × Shutter × ISO).",
      "White Balance":"Adjusts color temperature...",
      "Focus":"Sharpness on the subject.",
      "RAW Format":"Uncompressed sensor data...",
      "Crop":"Cut away edges to improve composition.",
      "Histogram":"Graph of brightness values...",
      "Saturation":"Color intensity.",
      "Contrast":"Difference between darkest and brightest tones."
    }
  },
  es: {
    scene:"Escena", settingsHeading:"Elige tus ajustes",
    apertureLabel:"Apertura (número f)", shutterLabel:"Velocidad de obturación", isoLabel:"ISO",
    capture:"¡Capturar!", nextScene:"Siguiente escena ↻", roundScore:"Puntuación de la ronda:",
    totalScore:"Total:", cleared:"Escenas completadas:", histHeading:"Histograma (simulado)",
    whySummary:"¿Por qué obtuve este resultado?", tip:"Consejo: Coloca el cursor...",
    exposure_spot:"La exposición está muy bien.",
    under_by: d => `Subexpuesta por ~${d} EV.`, over_by: d => `Sobreexpuesta por ~${d} EV.`,
    dof:"PdC", motion:"Movimiento", noise:"Ruido",
    try_adjust:"Ajusta uno o dos valores y vuelve a intentar.",
    captured:"¡Bien! Escena capturada.",
    why_excellent:"Exposición: excelente (≈0 EV).",
    why_close:"Exposición: cercana (±1 EV).",
    why_off:"Exposición: desviada (más de ±1 EV).",
    why_dof_mismatch:(want,got)=>`Profundidad de campo: se quería <strong>${want}</strong> pero dio <strong>${got}</strong>.`,
    why_dof_match: got=>`Profundidad de campo: correcta (<strong>${got}</strong>).`,
    why_motion_freeze_needed:"Movimiento: hay que congelar—usa obturación más rápida.",
    why_motion_blur_risk:"Movimiento: obturación lenta—sube velocidad o usa trípode.",
    why_motion_ok:"Movimiento: adecuado.",
    why_iso_low:min=>`ISO baja; sugerida ≥ ${min}.`,
    why_iso_high:max=>`ISO alta; sugerida ≤ ${max}.`,
    shallow:"poca", deep:"mucha", normal:"media", freeze:"congelar", blur:"desenfoque", low:"bajo", moderate:"moderado", high:"alto",
    glossary: {
      "Apertura":"La abertura del objetivo...",
      "ISO":"Sensibilidad del sensor...",
      "Velocidad de obturación":"Tiempo que el obturador permanece abierto...",
      "Exposición":"Luz total capturada...",
      "Balance de blancos":"Ajusta la temperatura de color...",
      "Enfoque":"Nitidez del sujeto.",
      "Formato RAW":"Datos sin comprimir del sensor...",
      "Recorte":"Cortar bordes...",
      "Histograma":"Gráfico de brillo...",
      "Saturación":"Intensidad del color.",
      "Contraste":"Diferencia entre sombras y luces."
    }
  }
};
const t = (k,...a)=> (typeof STRINGS[LANG][k]==="function" ? STRINGS[LANG][k](...a) : STRINGS[LANG][k]);

/* ----------------- Scenes (unchanged from your last build) ----------------- */
const scenes = [
  { id:"sunny_portrait", img:"assets/sunny_portrait.jpg", alt:"Outdoor portrait...",
    credit:"Photo credit: Your Source / Unsplash (replace as needed)",
    brief_en:`Bright sunny day portrait. You want a nice <em data-term="Depth of Field">blurry background</em> and a clean image.`,
    brief_es:`Retrato en un día soleado. Buscas un <em data-term="Depth of Field">fondo borroso</em> agradable y una imagen limpia.`,
    tags_en:["Portrait","Bright Light","Shallow DOF"], tags_es:["Retrato","Mucha luz","Poca PdC"],
    targets:{ baseEV100:15, motion:"normal", dof:"shallow", minISO:100, maxISO:400 }
  },
  { id:"indoor_tungsten", img:"assets/indoor_tungsten.jpg", alt:"Warm indoor scene...",
    credit:"Photo credit: Your Source / Pexels (replace as needed)",
    brief_en:`Warm indoor light (tungsten). Keep it sharp without too much <em data-term="ISO">noise</em>.`,
    brief_es:`Luz interior cálida (tungsteno). Mantén nitidez sin demasiado <em data-term="ISO">ruido</em>.`,
    tags_en:["Indoor","Warm Light","Handheld"], tags_es:["Interior","Luz cálida","A pulso"],
    targets:{ baseEV100:7.5, motion:"normal", dof:"normal", minISO:200, maxISO:1600 }
  },
  { id:"sports_action", img:"assets/sports_action.jpg", alt:"Athlete mid-action...",
    credit:"Photo credit: Your Source",
    brief_en:`Fast action—freeze motion.`,
    brief_es:`Acción rápida—debes <em data-term="Shutter Speed">congelar</em> el movimiento.`,
    tags_en:["Action","Daylight","Fast Shutter"], tags_es:["Acción","Luz de día","Obturación rápida"],
    targets:{ baseEV100:13, motion:"freeze", dof:"normal", minISO:100, maxISO:800 }
  },
  { id:"night_city", img:"assets/night_city.jpg", alt:"City street at night...",
    credit:"Photo credit: Your Source",
    brief_en:`Night city scene. Very low light—minimize <em data-term="Noise">noise</em> if possible.`,
    brief_es:`Escena nocturna en la ciudad. Muy poca luz—minimiza el <em data-term="Noise">ruido</em> si es posible.`,
    tags_en:["Night","Low Light","Tripod or High ISO"], tags_es:["Noche","Poca luz","Trípode o ISO alto"],
    targets:{ baseEV100:3.5, motion:"normal", dof:"normal", minISO:100, maxISO:6400 }
  },
  { id:"landscape_clouds", img:"assets/landscape_clouds.jpg", alt:"Wide daylight landscape...",
    credit:"Photo credit: Your Source",
    brief_en:`Daytime landscape. Keep most of the scene in focus (deep DOF).`,
    brief_es:`Paisaje diurno. Mantén gran parte de la escena nítida (mucha PdC).`,
    tags_en:["Landscape","Daylight","Deep DOF"], tags_es:["Paisaje","Luz de día","Mucha PdC"],
    targets:{ baseEV100:14, motion:"normal", dof:"deep", minISO:100, maxISO:400 }
  }
];

/* ----------------- DOM helpers ----------------- */
const $ = s => document.querySelector(s);
const clamp = (n,min,max)=> Math.max(min, Math.min(max,n));
const shutterToSeconds = s => s.includes("/") ? (s.split("/").map(Number)[0] / s.split("/").map(Number)[1]) : Number(s);
const exposureValue = (ap, sh, iso) => Math.log2((ap*ap)/shutterToSeconds(sh)) + Math.log2(iso/100);
const dofDescriptor = f => f<=2.8 ? "shallow" : (f>=11 ? "deep" : "normal");
const motionDescriptor = sh => {
  const t = shutterToSeconds(sh);
  if (t <= 1/500) return "freeze";
  if (t >= 1/30)  return "blur";
  return "normal";
};
const noiseLevel = iso => iso<=200 ? "low" : (iso<=800 ? "moderate" : "high");
function renderHistogram(bars, deltaEV){
  const base=[0.2,0.6,1.0,0.6,0.2], shift=clamp(deltaEV,-3,3);
  base.map((v,i)=> clamp(v+((i-2)*shift*0.18),0.05,1.6))
      .forEach((h,i)=>{ if(bars[i]) bars[i].style.transform=`scaleY(${h})`; });
}
function annotateTerms(html, glossary){
  return html.replace(/<em data-term="([^"]+)">([^<]+)<\/em>/g,(m,key,text)=>{
    const def = glossary[key] || glossary["Aperture"] || "";
    return `<span class="chip" title="${def.replace(/"/g,'&quot;')}">${text}</span>`;
  });
}

/* ----------------- App state ----------------- */
let currentScene=null, scoreTotal=0, cleared=0;

/* ----------------- Main init after DOM ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  console.log("[PhotoQuest] DOM ready");

  // cache nodes (after DOM!)
  const apertureSelect=$("#apertureSelect");
  const shutterSelect=$("#shutterSelect");
  const isoSelect=$("#isoSelect");
  const nextBtn=$("#nextBtn");
  const feedback=$("#feedback");
  const roundScore=$("#roundScore");
  const totalScore=$("#totalScore");
  const clearedCount=$("#clearedCount");
  const sceneTitle=$("#sceneTitle");
  const sceneBrief=$("#sceneBrief");
  const sceneImg=$("#sceneImg");
  const photoCredit=$("#photoCredit");
  const sceneTags=$("#sceneTags");
  const whyList=$("#whyList");
  const whyDetails=$(".why");
  const bars=[ "#h1","#h2","#h3","#h4","#h5" ].map(sel=>$(sel));

  // populate selects
  const APERTURES=[1.8,2,2.8,4,5.6,8,11,16];
  const SHUTTERS=["1/4000","1/2000","1/1000","1/500","1/250","1/125","1/60","1/30","1/15","1/8","1/4","1/2","1","2"];
  const ISOS=[100,200,400,800,1600,3200,6400];
  const fill = (el, arr, fmt=(v)=>String(v)) => { if(el) el.innerHTML = arr.map(v=>`<option value="${v}">${fmt(v)}</option>`).join(""); };
  fill(apertureSelect, APERTURES, f=>`f/${f}`); fill(shutterSelect, SHUTTERS); fill(isoSelect, ISOS);

  function titleFromId(id){ return id.replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase()); }

  function renderSceneText(){
    const brief = (LANG==="es" ? currentScene.brief_es : currentScene.brief_en);
    const tags = (LANG==="es" ? currentScene.tags_es : currentScene.tags_en);
    sceneTitle.textContent = `${STRINGS[LANG].scene}: ${titleFromId(currentScene.id)}`;
    sceneBrief.innerHTML = annotateTerms(brief, STRINGS[LANG].glossary);
    sceneImg.src = currentScene.img; sceneImg.alt = currentScene.alt;
    photoCredit.textContent = currentScene.credit;
    sceneTags.innerHTML = tags.map(t=>`<span class="chip">${t}</span>`).join("");
  }

  function pickScene(){
    currentScene = scenes[Math.floor(Math.random()*scenes.length)];
    renderSceneText();
    feedback.innerHTML=""; roundScore.textContent="0"; whyList.innerHTML="";
    if (whyDetails) whyDetails.open=false;
    renderHistogram(bars, 0);
    if (apertureSelect) apertureSelect.value="5.6";
    if (shutterSelect)  shutterSelect.value="1/125";
    if (isoSelect)      isoSelect.value="200";
  }

  function grade(){
    const a=Number(apertureSelect.value);
    const s=shutterSelect.value;
    const i=Number(isoSelect.value);

    const ev = exposureValue(a,s,i);
    const deltaEV = ev - currentScene.targets.baseEV100;

    let points=100; const why=[];
    const expoPenalty = Math.min(60, Math.abs(deltaEV)*25); points-=expoPenalty;
    if (Math.abs(deltaEV)<0.3) why.push(STRINGS[LANG].why_excellent);
    else if (Math.abs(deltaEV)<1) why.push(STRINGS[LANG].why_close);
    else why.push(STRINGS[LANG].why_off);

    const wantDOF=currentScene.targets.dof, gotDOF=dofDescriptor(a);
    if (wantDOF && gotDOF!==wantDOF){ points-=15; why.push(STRINGS[LANG].why_dof_mismatch(STRINGS[LANG][wantDOF]||wantDOF, STRINGS[LANG][gotDOF]||gotDOF)); }
    else if (wantDOF){ why.push(STRINGS[LANG].why_dof_match(STRINGS[LANG][gotDOF]||gotDOF)); }

    const wantMotion=currentScene.targets.motion, gotMotion=motionDescriptor(s);
    if (wantMotion==="freeze" && gotMotion!=="freeze"){ points-=15; why.push(STRINGS[LANG].why_motion_freeze_needed); }
    else if (wantMotion==="normal" && gotMotion==="blur"){ points-=10; why.push(STRINGS[LANG].why_motion_blur_risk); }
    else { why.push(STRINGS[LANG].why_motion_ok); }

    const {minISO,maxISO}=currentScene.targets;
    if (i<minISO){ points-=5; why.push(STRINGS[LANG].why_iso_low(minISO)); }
    if (i>maxISO){ points-=5; why.push(STRINGS[LANG].why_iso_high(maxISO)); }

    points = Math.round(clamp(points,0,100));

    const expoText = Math.abs(deltaEV)<0.3
      ? `<span class="ok">${STRINGS[LANG].exposure_spot}</span>`
      : (deltaEV<0 ? `<span class="warn">${STRINGS[LANG].under_by(Math.abs(deltaEV).toFixed(1))}</span>`
                   : `<span class="warn">${STRINGS[LANG].over_by(Math.abs(deltaEV).toFixed(1))}</span>`);

    const fb = [
      expoText,
      `${STRINGS[LANG].dof}: <strong>${STRINGS[LANG][dofDescriptor(a)]||dofDescriptor(a)}</strong>  •  ${STRINGS[LANG].motion}: <strong>${STRINGS[LANG][motionDescriptor(s)]||motionDescriptor(s)}</strong>  •  ${STRINGS[LANG].noise}: <strong>${STRINGS[LANG][noiseLevel(i)]||noiseLevel(i)}</strong>`
    ].join("<br>");

    feedback.innerHTML = fb;
    roundScore.textContent = String(points);
    renderHistogram(bars, deltaEV);
    whyList.innerHTML = why.map(w=>`<li>${w}</li>`).join("");

    if (points>=80){
      scoreTotal += points; cleared += 1;
      totalScore.textContent=String(scoreTotal); clearedCount.textContent=String(cleared);
      feedback.innerHTML += `<br><br><span class="ok">${STRINGS[LANG].captured}</span>`;
    } else {
      feedback.innerHTML += `<br><br><span class="err">${STRINGS[LANG].try_adjust}</span>`;
    }

    if (whyDetails) whyDetails.open = true;
  }

  // --- Event delegation: works even if IDs change or elements render later
  document.addEventListener("click", (e)=>{
    const cap = e.target.closest("#checkBtn, #saveBtn, [data-action='capture']");
    if (cap){ e.preventDefault(); console.log("[PhotoQuest] Capture clicked"); grade(); return; }
    const nxt = e.target.closest("#nextBtn, [data-action='next']");
    if (nxt){ e.preventDefault(); console.log("[PhotoQuest] Next Scene"); pickScene(); return; }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown",(e)=>{
    if (e.key==="Enter" && !e.ctrlKey && !e.metaKey){ grade(); if (whyDetails) whyDetails.open=true; }
    if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="enter"){ pickScene(); }
  });

  // First render
  pickScene();

  // Final quick diagnostics
  if (!$("#checkBtn") && !document.querySelector("[data-action='capture']")) {
    console.warn("No capture button found by ID. Delegation still works if you add data-action='capture' to your button.");
  }
});
