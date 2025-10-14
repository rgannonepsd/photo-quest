/* ===========================================
 *  Photo Quest: Exposure Triad (Bilingual)
 *  - Robust Capture button binding
 *  - Auto-open "Why" panel after grading
 * =========================================== */

/* ----------------- Language ----------------- */
const DEFAULT_LANG = localStorage.getItem("pq_lang") || "en";
let LANG = DEFAULT_LANG;
document.documentElement.lang = LANG;

/* ----------------- Translations ----------------- */
const STRINGS = {
  en: {
    appTitle: "Photo Quest: Exposure Triad",
    language: "Language",
    glossaryToggle: "Glossary ▸",
    glossaryTitle: "Glossary",
    glossaryClose: "Close",
    scene: "Scene",
    settingsHeading: "Choose Your Settings",
    apertureLabel: "Aperture (f/stop)",
    shutterLabel: "Shutter Speed",
    isoLabel: "ISO",
    capture: "Capture!",
    nextScene: "Next Scene ↻",
    roundScore: "Round Score:",
    totalScore: "Total:",
    cleared: "Scenes Cleared:",
    histHeading: "Histogram (simulated)",
    whySummary: "Why did I get this result?",
    tip: "Tip: Hover (or focus) highlighted terms in scene text to see quick definitions.",
    // Feedback fragments
    exposure_spot: "Exposure looks spot on.",
    under_by: d => `Underexposed (too dark) by about ${d} EV.`,
    over_by: d => `Overexposed (too bright) by about ${d} EV.`,
    dof: "DOF",
    motion: "Motion",
    noise: "Noise",
    try_adjust: "Try adjusting one or two settings and capture again.",
    captured: "Nice! Scene captured.",
    // Why list
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
    // Labels for descriptors
    shallow: "shallow",
    deep: "deep",
    normal: "normal",
    freeze: "freeze",
    blur: "blur",
    low: "low",
    moderate: "moderate",
    high: "high",
    // Glossary
    glossary: {
      "Aperture": "The opening in a camera lens that controls how much light enters. Wide aperture (low f-number) = shallow depth of field.",
      "ISO": "Sensor sensitivity to light. Low ISO = cleaner image; high ISO = brighter but more noise.",
      "Shutter Speed": "How long the shutter stays open. Fast freezes motion; slow can blur moving subjects.",
      "Exposure": "Total light captured (Aperture × Shutter × ISO).",
      "White Balance": "Adjusts color temperature so whites look neutral under different lighting.",
      "Focus": "Sharpness on the subject.",
      "RAW Format": "Uncompressed sensor data with maximum editing flexibility.",
      "Crop": "Cut away edges to improve composition.",
      "Histogram": "Graph of brightness values from dark (left) to bright (right).",
      "Saturation": "Color intensity.",
      "Contrast": "Difference between darkest and brightest tones."
    }
  },
  es: {
    appTitle: "Photo Quest: Tríada de Exposición",
    language: "Idioma",
    glossaryToggle: "Glosario ▸",
    glossaryTitle: "Glosario",
    glossaryClose: "Cerrar",
    scene: "Escena",
    settingsHeading: "Elige tus ajustes",
    apertureLabel: "Apertura (número f)",
    shutterLabel: "Velocidad de obturación",
    isoLabel: "ISO",
    capture: "¡Capturar!",
    nextScene: "Siguiente escena ↻",
    roundScore: "Puntuación de la ronda:",
    totalScore: "Total:",
    cleared: "Escenas completadas:",
    histHeading: "Histograma (simulado)",
    whySummary: "¿Por qué obtuve este resultado?",
    tip: "Consejo: Coloca el cursor (o enfoca) sobre los términos resaltados para ver definiciones rápidas.",
    // Feedback fragments
    exposure_spot: "La exposición está muy bien.",
    under_by: d => `Subexpuesta (demasiado oscura) por ~${d} EV.`,
    over_by: d => `Sobreexpuesta (demasiado clara) por ~${d} EV.`,
    dof: "PdC",
    motion: "Movimiento",
    noise: "Ruido",
    try_adjust: "Ajusta uno o dos valores y vuelve a intentar.",
    captured: "¡Bien! Escena capturada.",
    // Why list
    why_excellent: "Exposición: excelente (≈0 EV de diferencia).",
    why_close: "Exposición: cercana (dentro de ±1 EV).",
    why_off: "Exposición: desviada (más allá de ±1 EV).",
    why_dof_mismatch: (want, got) => `Profundidad de campo: se quería <strong>${want}</strong> pero los ajustes dan <strong>${got}</strong>.`,
    why_dof_match: got => `Profundidad de campo: correcta (<strong>${got}</strong>).`,
    why_motion_freeze_needed: "Movimiento: se necesita <strong>congelar</strong> la acción—usa una obturación más rápida.",
    why_motion_blur_risk: "Movimiento: la obturación lenta genera desenfoque—sube la velocidad o usa trípode.",
    why_motion_ok: "Movimiento: adecuado para la escena.",
    why_iso_low: min => `ISO: un poco baja para esta luz (riesgo de subexposición); sugerida ≥ ${min}.`,
    why_iso_high: max => `ISO: alta (más ruido); sugerida ≤ ${max}.`,
    // Labels for descriptors
    shallow: "poca",
    deep: "mucha",
    normal: "media",
    freeze: "congelar",
    blur: "desenfoque",
    low: "bajo",
    moderate: "moderado",
    high: "alto",
    // Glossary
    glossary: {
      "Apertura": "La abertura del objetivo que controla cuánta luz entra. Apertura amplia (número f bajo) = poca profundidad de campo.",
      "ISO": "Sensibilidad del sensor a la luz. ISO bajo = imagen más limpia; ISO alto = más brillo pero más ruido.",
      "Velocidad de obturación": "Tiempo que el obturador permanece abierto. Rápida congela; lenta puede causar desenfoque de movimiento.",
      "Exposición": "Luz total capturada (Apertura × Obturación × ISO).",
      "Balance de blancos": "Ajusta la temperatura de color para que los blancos se vean neutros en distintas luces.",
      "Enfoque": "Nitidez del sujeto.",
      "Formato RAW": "Datos sin comprimir del sensor con máxima flexibilidad de edición.",
      "Recorte": "Cortar bordes para mejorar la composición.",
      "Histograma": "Gráfico de brillo de oscuro (izq.) a claro (der.).",
      "Saturación": "Intensidad del color.",
      "Contraste": "Diferencia entre sombras y luces."
    }
  }
};

const t = (key, ...args) => {
  const value = STRINGS[LANG][key];
  return typeof value === "function" ? value(...args) : value;
};
const tg = (term) => STRINGS[LANG].glossary[term];

/* ----------------- Glossary bridge keys ----------------- */
const GLOSSARY_KEYS = {
  Aperture: { en: "Aperture", es: "Apertura" },
  ISO: { en: "ISO", es: "ISO" },
  "Shutter Speed": { en: "Shutter Speed", es: "Velocidad de obturación" },
  Exposure: { en: "Exposure", es: "Exposición" },
  "White Balance": { en: "White Balance", es: "Balance de blancos" },
  Focus: { en: "Focus", es: "Enfoque" },
  "RAW Format": { en: "RAW Format", es: "Formato RAW" },
  Crop: { en: "Crop", es: "Recorte" },
  Histogram: { en: "Histogram", es: "Histograma" },
  Saturation: { en: "Saturation", es: "Saturación" },
  Contrast: { en: "Contrast", es: "Contraste" }
};

/* ----------------- Scene Library (bilingual) ----------------- */
const scenes = [
  {
    id: "sunny_portrait",
    img: "assets/sunny_portrait.jpg",
    alt: "Outdoor portrait in bright sunlight with blurry background.",
    credit: "Photo credit: Your Source / Unsplash (replace as needed)",
    brief_en: `Bright sunny day portrait. You want a nice <em data-term="Depth of Field">blurry background</em> and a clean image.`,
    brief_es: `Retrato en un día soleado. Buscas un <em data-term="Depth of Field">fondo borroso</em> agradable y una imagen limpia.`,
    tags_en: ["Portrait", "Bright Light", "Shallow DOF"],
    tags_es: ["Retrato", "Mucha luz", "Poca PdC"],
    targets: { baseEV100: 15, motion: "normal", dof: "shallow", minISO: 100, maxISO: 400 }
  },
  {
    id: "indoor_tungsten",
    img: "assets/indoor_tungsten.jpg",
    alt: "Warm indoor scene with table lamp.",
    credit: "Photo credit: Your Source / Pexels (replace as needed)",
    brief_en: `Warm indoor light (tungsten). Keep it sharp without too much <em data-term="ISO">noise</em>.`,
    brief_es: `Luz interior cálida (tungsteno). Mantén nitidez sin demasiado <em data-term="ISO">ruido</em>.`,
    tags_en: ["Indoor", "Warm Light", "Handheld"],
    tags_es: ["Interior", "Luz cálida", "A pulso"],
    targets: { baseEV100: 7.5, motion: "normal", dof: "normal", minISO: 200, maxISO: 1600 }
  },
  {
    id: "sports_action",
    img: "assets/sports_action.jpg",
    alt: "Athlete mid-action on a field.",
    credit: "Photo credit: Your Source",
    brief_en: `Fast action—freeze motion.`,
    brief_es: `Acción rápida—debes <em data-term="Shutter Speed">congelar</em> el movimiento.`,
    tags_en: ["Action", "Daylight", "Fast Shutter"],
    tags_es: ["Acción", "Luz de día", "Obturación rápida"],
    targets: { baseEV100: 13, motion: "freeze", dof: "normal", minISO: 100, maxISO: 800 }
  },
  {
    id: "night_city",
    img: "assets/night_city.jpg",
    alt: "City street at night with neon signs.",
    credit: "Photo credit: Your Source",
    brief_en: `Night city scene. Very low light—minimize <em data-term="Noise">noise</em> if possible.`,
    brief_es: `Escena nocturna en la ciudad. Muy poca luz—minimiza el <em data-term="Noise">ruido</em> si es posible.`,
    tags_en: ["Night", "Low Light", "Tripod or High ISO"],
    tags_es: ["Noche", "Poca luz", "Trípode o ISO alto"],
    targets: { baseEV100: 3.5, motion: "normal", dof: "normal", minISO: 100, maxISO: 6400 }
  },
  {
    id: "landscape_clouds",
    img: "assets/landscape_clouds.jpg",
    alt: "Wide daylight landscape with clouds and distant mountains.",
    credit: "Photo credit: Your Source",
    brief_en: `Daytime landscape. Keep most of the scene in focus (deep DOF).`,
    brief_es: `Paisaje diurno. Mantén gran parte de la escena nítida (mucha PdC).`,
    tags_en: ["Landscape", "Daylight", "Deep DOF"],
    tags_es: ["Paisaje", "Luz de día", "Mucha PdC"],
    targets: { baseEV100: 14, motion: "normal", dof: "deep", minISO: 100, maxISO: 400 }
  }
];

/* ----------------- Nodes ----------------- */
const $ = sel => document.querySelector(sel);
const apertureSelect = $("#apertureSelect");
const shutterSelect  = $("#shutterSelect");
const isoSelect      = $("#isoSelect");
const nextBtn        = $("#nextBtn");
const feedback       = $("#feedback");
const roundScore     = $("#roundScore");
const totalScore     = $("#totalScore");
const clearedCount   = $("#clearedCount");
const sceneTitle     = $("#sceneTitle");
const sceneBrief     = $("#sceneBrief");
const sceneImg       = $("#sceneImg");
const photoCredit    = $("#photoCredit");
const sceneTags      = $("#sceneTags");
const whyList        = $("#whyList");
const whyDetails     = document.querySelector(".why");  // <details>
const bars = [$("#h1"), $("#h2"), $("#h3"), $("#h4"), $("#h5")];

// Header & labels (for i18n)
const appTitle = $("#appTitle");
const langLabel = $("#langLabel");
const langSelect = $("#langSelect");
const glossaryToggle = $("#glossaryToggle");
const settingsHeading = $("#settingsHeading");
const apertureLabel = $("#apertureLabel");
const shutterLabel = $("#shutterLabel");
const isoLabel = $("#isoLabel");
const roundScoreLabel = $("#roundScoreLabel");
const totalScoreLabel = $("#totalScoreLabel");
const clearedLabel = $("#clearedLabel");
const histHeading = $("#histHeading");
const whySummary = $("#whySummary");
const tipText = $("#tipText");

// Drawer
const drawer = $("#glossary");
const closeGlossBtn = $("#closeGlossary");
const glossaryTitle = $("#glossaryTitle");
const glossaryList = $("#glossaryList");

/* ----------------- Options ----------------- */
const APERTURES = [1.8, 2, 2.8, 4, 5.6, 8, 11, 16];
const SHUTTERS = ["1/4000","1/2000","1/1000","1/500","1/250","1/125","1/60","1/30","1/15","1/8","1/4","1/2","1","2"];
const ISOS = [100,200,400,800,1600,3200,6400];

function populateSelect(el, arr, formatFn = (v)=>String(v)){
  if (!el) return;
  el.innerHTML = arr.map(v=>`<option value="${v}">${formatFn(v)}</option>`).join("");
}
populateSelect(apertureSelect, APERTURES, f => `f/${f}`);
populateSelect(shutterSelect, SHUTTERS);
populateSelect(isoSelect, ISOS);

/* ----------------- State ----------------- */
let currentScene = null;
let scoreTotal = 0;
let cleared = 0;

/* ----------------- Helpers ----------------- */
function shutterToSeconds(s){
  if (s.includes("/")){
    const [n,d] = s.split("/").map(Number);
    return n/d;
  }
  return Number(s);
}
function exposureValue(aperture, shutter, iso){
  const t = shutterToSeconds(shutter);
  const EV100 = Math.log2((aperture*aperture)/t);
  return EV100 + Math.log2(iso/100);
}
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
function renderHistogram(deltaEV){
  const base = [0.2, 0.6, 1.0, 0.6, 0.2];
  const shift = clamp(deltaEV, -3, 3);
  const shifted = base.map((v, i) => clamp(v + ((i-2) * shift * 0.18), 0.05, 1.6));
  shifted.forEach((h,i)=>{ bars[i].style.transform = `scaleY(${h})`; });
}
function dofDescriptor(f){
  if (f <= 2.8) return "shallow";
  if (f >= 11)  return "deep";
  return "normal";
}
function motionDescriptor(shutter){
  const t = shutterToSeconds(shutter);
  if (t <= 1/500) return "freeze";
  if (t >= 1/30)  return "blur";
  return "normal";
}
function noiseLevel(iso){
  if (iso <= 200) return "low";
  if (iso <= 800) return "moderate";
  return "high";
}
function annotateTerms(html){
  return html.replace(/<em data-term="([^"]+)">([^<]+)<\/em>/g, (m,key,text)=>{
    const lookup = GLOSSARY_KEYS[key] ? (LANG === "es" ? GLOSSARY_KEYS[key].es : GLOSSARY_KEYS[key].en) : key;
    const def = STRINGS[LANG].glossary[lookup] || STRINGS[LANG].glossary[key] || "";
    return `<span class="chip" title="${def.replace(/"/g,'&quot;')}">${text}</span>`;
  });
}
function titleFromId(id){
  return id.replace(/_/g, " ").replace(/\b\w/g, m=>m.toUpperCase());
}

/* ----------------- Scene handling ----------------- */
function pickScene(){
  currentScene = scenes[Math.floor(Math.random()*scenes.length)];
  renderSceneText();
  feedback.innerHTML = "";
  roundScore.textContent = "0";
  whyList.innerHTML = "";
  if (whyDetails) whyDetails.open = false;
  renderHistogram(0);
  // sensible defaults
  if (apertureSelect) apertureSelect.value = "5.6";
  if (shutterSelect)  shutterSelect.value  = "1/125";
  if (isoSelect)      isoSelect.value      = "200";
}
function renderSceneText(){
  const useBrief = LANG === "es" ? currentScene.brief_es : currentScene.brief_en;
  const useTags  = LANG === "es" ? currentScene.tags_es  : currentScene.tags_en;

  sceneTitle.textContent = `${t("scene")}: ${titleFromId(currentScene.id)}`;
  sceneBrief.innerHTML = annotateTerms(useBrief);
  sceneImg.src = currentScene.img;
  sceneImg.alt = currentScene.alt;
  photoCredit.textContent = currentScene.credit;
  sceneTags.innerHTML = useTags.map(tag=>`<span class="chip">${tag}</span>`).join("");
}

/* ----------------- Scoring ----------------- */
function grade(){
  const a = Number(apertureSelect.value);
  const s = shutterSelect.value;
  const i = Number(isoSelect.value);

  const ev = exposureValue(a, s, i);
  const targetEV100 = currentScene.targets.baseEV100;
  const deltaEV = ev - targetEV100;

  let points = 100;
  const why = [];

  const expoPenalty = Math.min(60, Math.abs(deltaEV) * 25);
  points -= expoPenalty;
  if (Math.abs(deltaEV) < 0.3) { why.push(t("why_excellent")); }
  else if (Math.abs(deltaEV) < 1) { why.push(t("why_close")); }
  else { why.push(t("why_off")); }

  const wantDOF = currentScene.targets.dof;
  const gotDOF  = dofDescriptor(a);
  if (wantDOF && gotDOF !== wantDOF){
    points -= 15;
    why.push(t("why_dof_mismatch")(t(wantDOF), t(gotDOF)));
  } else if (wantDOF) {
    why.push(t("why_dof_match")(t(gotDOF)));
  }

  const wantMotion = currentScene.targets.motion;
  const gotMotion  = motionDescriptor(s);
  if (wantMotion === "freeze" && gotMotion !== "freeze"){
    points -= 15;
    why.push(t("why_motion_freeze_needed"));
  } else if (wantMotion === "normal" && gotMotion === "blur"){
    points -= 10;
    why.push(t("why_motion_blur_risk"));
  } else {
    why.push(t("why_motion_ok"));
  }

  const {minISO, maxISO} = currentScene.targets;
  if (i < minISO){
    points -= 5;
    why.push(t("why_iso_low")(minISO));
  }
  if (i > maxISO){
    points -= 5;
    why.push(t("why_iso_high")(maxISO));
  }

  points = Math.round(clamp(points, 0, 100));

  const noise = t(noiseLevel(i));
  const dofTxt = t(dofDescriptor(a));
  const motTxt = t(motionDescriptor(s));

  let expoText = "";
  if (Math.abs(deltaEV) < 0.3) expoText = `<span class="ok">${t("exposure_spot")}</span>`;
  else if (deltaEV < 0) expoText = `<span class="warn">${t("under_by")(Math.abs(deltaEV).toFixed(1))}</span>`;
  else expoText = `<span class="warn">${t("over_by")(Math.abs(deltaEV).toFixed(1))}</span>`;

  const fb = [
    expoText,
    `${t("dof")}: <strong>${dofTxt}</strong>  •  ${t("motion")}: <strong>${motTxt}</strong>  •  ${t("noise")}: <strong>${noise}</strong>`
  ].join("<br>");

  feedback.innerHTML = fb;
  roundScore.textContent = String(points);
  renderHistogram(deltaEV);

  whyList.innerHTML = why.map(w=>`<li>${w}</li>`).join("");

  if (points >= 80){
    scoreTotal += points;
    cleared += 1;
    totalScore.textContent = String(scoreTotal);
    clearedCount.textContent = String(cleared);
    feedback.innerHTML += `<br><br><span class="ok">${t("captured")}</span>`;
  } else {
    feedback.innerHTML += `<br><br><span class="err">${t("try_adjust")}</span>`;
  }

  // Auto-open the Why panel so students see the reasoning
  if (whyDetails) whyDetails.open = true;
}

/* ----------------- Glossary Drawer ----------------- */
function openGlossary(){
  drawer.setAttribute("aria-hidden","false");
  glossaryToggle.setAttribute("aria-expanded","true");
}
function closeGlossary(){
  drawer.setAttribute("aria-hidden","true");
  glossaryToggle.setAttribute("aria-expanded","false");
}
function renderGlossary(){
  const entries = STRINGS[LANG].glossary;
  glossaryList.innerHTML = Object.entries(entries)
    .map(([term,def]) => `<li><strong>${term}:</strong> ${def}</li>`)
    .join("");
}
glossaryToggle?.addEventListener("click", openGlossary);
glossaryToggle?.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openGlossary(); }});
closeGlossBtn?.addEventListener("click", closeGlossary);
drawer?.addEventListener("click", (e)=>{ if(e.target===drawer) closeGlossary(); });

/* ----------------- Language switching ----------------- */
function applyLanguage(){
  document.documentElement.lang = LANG;
  localStorage.setItem("pq_lang", LANG);

  appTitle.textContent = t("appTitle");
  langLabel.textContent = t("language");
  glossaryToggle.textContent = t("glossaryToggle");
  glossaryTitle.textContent = t("glossaryTitle");
  closeGlossBtn.textContent = t("glossaryClose");

  sceneTitle.textContent = t("scene");
  settingsHeading.textContent = t("settingsHeading");
  apertureLabel.textContent = t("apertureLabel");
  shutterLabel.textContent = t("shutterLabel");
  isoLabel.textContent = t("isoLabel");
  const captureBtn = document.querySelector("#checkBtn, #saveBtn, [data-action='capture']");
  if (captureBtn) captureBtn.textContent = t("capture");
  nextBtn.textContent = t("nextScene");
  roundScoreLabel.textContent = t("roundScore");
  totalScoreLabel.textContent = t("totalScore");
  clearedLabel.textContent = t("cleared");
  histHeading.textContent = t("histHeading");
  whySummary.textContent = t("whySummary");
  tipText.textContent = t("tip");

  renderSceneText();
  renderGlossary();
}
langSelect.value = LANG;
langSelect.addEventListener("change", () => {
  LANG = langSelect.value;
  applyLanguage();
});

/* ----------------- Robust Capture Button Binding ----------------- */
function bindControls(){
  // Support multiple possible IDs/attrs for the capture button
  const captureBtn = document.querySelector("#checkBtn, #saveBtn, [data-action='capture']");
  if (!captureBtn) {
    console.warn("Capture button not found. Ensure the button has id='checkBtn' OR id='saveBtn' OR data-action='capture'.");
  } else {
    captureBtn.addEventListener("click", () => {
      grade();
      if (whyDetails) whyDetails.open = true;
    });
  }

  nextBtn?.addEventListener("click", pickScene);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e)=>{
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      grade();
      if (whyDetails) whyDetails.open = true;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
      pickScene();
    }
  });
}

/* ----------------- Boot ----------------- */
applyLanguage();   // set UI strings based on LANG
renderGlossary();  // build glossary contents
bindControls();    // attach handlers (robust)
pickScene();       // start with a random scene
