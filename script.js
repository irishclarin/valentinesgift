const $ = (sel) => document.querySelector(sel);

const toName = $("#toName");
const tag = $("#tag");
const bouquet = $("#bouquet");
const fxLayer = $("#fxLayer");

const giveBtn = $("#giveBtn");
const styleBtn = $("#styleBtn");
const noteBtn = $("#noteBtn");
const downloadBtn = $("#downloadBtn");
const togglePetalsBtn = $("#togglePetals");

const modal = $("#modal");
const modalOverlay = $("#modalOverlay");
const closeModalBtn = $("#closeModal");
const copyNoteBtn = $("#copyNote");
const sparkleBtn = $("#sparkleBtn");
const noteText = $("#noteText");
const bubu = $("#bubu");

const FIXED_NAME = "You";
const FIXED_MESSAGE = "I’m always cheering for you. 143";

toName.textContent = FIXED_NAME;

let petalsOn = true;

function setTag(t){ tag.textContent = t; }
function rand(min,max){ return Math.random()*(max-min)+min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* Bouquet styles (unique feature) */
const BOUQUET_STYLES = [
  { name:"Rosy Wrap", wrapA:"#ffffff", wrapB:"#ffe6ef", ribbonA:"#ff2e63", ribbonB:"#ff6aa2",
    flowers:[["#ff6aa2","#ffdf7a"],["#ff4d88","#ffe08a"],["#ffa7c4","#fff0a6"],["#fda4af","#fde68a"],["#b8a1ff","#fff1a8"]] },

  { name:"Lavender Dream", wrapA:"#ffffff", wrapB:"#efe7ff", ribbonA:"#8b5cf6", ribbonB:"#b8a1ff",
    flowers:[["#b8a1ff","#fff1a8"],["#a78bfa","#fde68a"],["#c4b5fd","#fff0a6"],["#ff6aa2","#ffdf7a"],["#7dd3fc","#fff1a8"]] },

  { name:"Sky Sweet", wrapA:"#ffffff", wrapB:"#e6f6ff", ribbonA:"#38bdf8", ribbonB:"#7dd3fc",
    flowers:[["#7dd3fc","#fff1a8"],["#60a5fa","#fde68a"],["#ff6aa2","#ffdf7a"],["#ffa7c4","#fff0a6"],["#b8a1ff","#fff1a8"]] },
];

let styleIndex = 0;

function burstSparkle(rect){
  const x = rect.left + rect.width/2;
  const y = rect.top + rect.height/2;
  for(let i=0;i<7;i++){
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = `${x + rand(-22,22)}px`;
    s.style.top = `${y + rand(-22,22)}px`;
    fxLayer.appendChild(s);
    setTimeout(()=>s.remove(), 900);
  }
}

function sprinklePetals(){
  if(!petalsOn) return;
  const colors = ["#ff6aa2","#ffa7c4","#ff4d88","#ffd1dc","#b8a1ff","#7dd3fc"];
  const p = document.createElement("div");
  p.className = "fallingPetal";
  p.style.left = `${rand(0, 100)}vw`;
  p.style.background = pick(colors);
  p.style.setProperty("--dx", `${rand(-20,20)}vw`);
  p.style.setProperty("--rot", `${rand(-180,180)}deg`);
  p.style.animationDuration = `${rand(3.0, 5.2).toFixed(2)}s`;
  fxLayer.appendChild(p);
  setTimeout(()=>p.remove(), 5500);
}
setInterval(sprinklePetals, 380);

function makeFlowerHead(petalColor, centerColor, size=54){
  const head = document.createElement("div");
  head.className = "flowerHead";
  head.style.width = `${size}px`;
  head.style.height = `${size}px`;

  const petals = [];
  for(let i=1;i<=4;i++){
    const p = document.createElement("div");
    p.className = `petal p${i}`;
    p.style.background = petalColor;
    petals.push(p);
    head.appendChild(p);
  }
  const c = document.createElement("div");
  c.className = "center";
  c.style.background = centerColor;
  head.appendChild(c);

  head.addEventListener("click", () => burstSparkle(head.getBoundingClientRect()));

  return head;
}

function buildBouquet(style){
  bouquet.innerHTML = "";


  const wrap = document.createElement("div");
  wrap.className = "wrapPaper";
  wrap.style.background = `linear-gradient(135deg, ${style.wrapA}, ${style.wrapB})`;


  const ribbon = document.createElement("div");
  ribbon.className = "ribbon";
  const rGrad = `linear-gradient(135deg, ${style.ribbonA}, ${style.ribbonB})`;
  ribbon.style.background = rGrad;
  ribbon.style.setProperty("--ribbon", rGrad);
  ribbon.style.background = rGrad;
  ribbon.style.setProperty("background", rGrad);


  ribbon.style.setProperty("--r1", style.ribbonA);
  ribbon.style.setProperty("--r2", style.ribbonB);

  const old = document.getElementById("ribbonDyn");
  if(old) old.remove();
  const dyn = document.createElement("style");
  dyn.id = "ribbonDyn";
  dyn.textContent = `
    .ribbon::before,.ribbon::after{ background: ${rGrad}; }
  `;
  document.head.appendChild(dyn);

  bouquet.append(wrap, ribbon);

  const stems = [
    { x:-72, ang:-18, top:18 },
    { x:-32, ang:-8,  top:6  },
    { x:  0, ang: 0,  top:0  },
    { x: 32, ang: 10, top:10 },
    { x: 72, ang: 18, top:22 },
  ];

  stems.forEach((s, i) => {
    const stem = document.createElement("div");
    stem.className = "stem";
    stem.style.transform = `translateX(${s.x}px) rotate(${s.ang}deg)`;

    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.top = `${rand(60, 82)}px`;
    leaf.style.transform = `rotate(${rand(-45,-5)}deg)`;
    stem.appendChild(leaf);

    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "50%";
    holder.style.bottom = "205px";
    holder.style.transform = `translateX(${s.x}px)`;

    const [petal, center] = style.flowers[i % style.flowers.length];
    const head = makeFlowerHead(petal, center, 54);
    head.style.top = `${s.top}px`;
    holder.appendChild(head);

    bouquet.appendChild(stem);
    bouquet.appendChild(holder);
  });
}

function animateBubuGive(){
  bubu.style.animation = "none";
  void bubu.offsetWidth;
  bubu.style.animation = "bubuGive 700ms ease-out 1";
  setTimeout(() => { bubu.style.animation = "bubuIdle 2.8s ease-in-out infinite"; }, 760);
}

function giveBouquet(){
  const style = BOUQUET_STYLES[styleIndex];
  buildBouquet(style);
  animateBubuGive();
  setTag(`Bubu gave ${style.name} to ${FIXED_NAME} • “${FIXED_MESSAGE}”`);
  burstSparkle(bouquet.getBoundingClientRect());
}

giveBtn.addEventListener("click", giveBouquet);
bubu.addEventListener("click", giveBouquet);

styleBtn.addEventListener("click", () => {
  styleIndex = (styleIndex + 1) % BOUQUET_STYLES.length;
  const style = BOUQUET_STYLES[styleIndex];
  buildBouquet(style);
  setTag(`Bouquet style: ${style.name} `);
  burstSparkle(styleBtn.getBoundingClientRect());
});

togglePetalsBtn.addEventListener("click", () => {
  petalsOn = !petalsOn;
  togglePetalsBtn.textContent = `Petals: ${petalsOn ? "On" : "Off"}`;
  togglePetalsBtn.setAttribute("aria-pressed", String(petalsOn));
  setTag(petalsOn ? "Petals are floating " : "Petals paused ");
});


function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}
noteBtn.addEventListener("click", openModal);
modalOverlay.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

copyNoteBtn.addEventListener("click", async () => {
  const text = `To: ${FIXED_NAME}\n${FIXED_MESSAGE}\n\n${noteText.textContent.trim()}`;
  try{
    await navigator.clipboard.writeText(text);
    setTag("Copied your note ✨");
    burstSparkle(copyNoteBtn.getBoundingClientRect());
  }catch(e){
    setTag("Copy blocked by browser—select text manually");
  }
});

sparkleBtn.addEventListener("click", () => {
  const r = sparkleBtn.getBoundingClientRect();
  for(let i=0;i<18;i++){
    burstSparkle({ left:r.left+rand(-50,50), top:r.top+rand(-50,50), width:1, height:1 });
  }
});


const dyn = document.createElement("style");
dyn.textContent = `
@keyframes bubuGive{
  0%{ transform: translateY(0) rotate(-2deg) scale(1); }
  45%{ transform: translateY(-6px) rotate(2deg) scale(1.02); }
  100%{ transform: translateY(0) rotate(-1deg) scale(1); }
}`;
document.head.appendChild(dyn);


buildBouquet(BOUQUET_STYLES[styleIndex]);


downloadBtn.addEventListener("click", () => {
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");

  const style = BOUQUET_STYLES[styleIndex];


  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0, "#ffb3c7");
  g.addColorStop(0.55, "#ffe2ec");
  g.addColorStop(1, "#fff6fb");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // title
  ctx.fillStyle = "#2b2b2b";
  ctx.font = "900 72px ui-rounded, system-ui, -apple-system, Segoe UI, Arial";
  ctx.fillText("A Bouquet Gift", 110, 165);

  ctx.font = "800 52px ui-rounded, system-ui, -apple-system, Segoe UI, Arial";
  ctx.fillStyle = "#ff2e63";
  ctx.fillText(`For: ${FIXED_NAME}`, 110, 245);

  ctx.fillStyle = "#2b2b2b";
  ctx.font = "700 40px ui-rounded, system-ui, -apple-system, Segoe UI, Arial";
  wrapText(ctx, FIXED_MESSAGE, 110, 325, 860, 54);

 
  drawBouquet(ctx, 540, 900, style);

  ctx.globalAlpha = .85;
  ctx.font = "800 34px ui-rounded, system-ui, -apple-system, Segoe UI, Arial";
  ctx.fillStyle = "#2b2b2b";
  ctx.fillText("— from Tel", 110, 1260);
  ctx.globalAlpha = 1;

  const a = document.createElement("a");
  a.download = `bouquet_for_${FIXED_NAME.replace(/\s+/g,"_")}.png`;
  a.href = canvas.toDataURL("image/png");
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTag("Downloaded card PNG ✨");
  burstSparkle(downloadBtn.getBoundingClientRect());
});

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(" ");
  let line = "";
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + " ";
    if(ctx.measureText(testLine).width > maxWidth && n > 0){
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else line = testLine;
  }
  ctx.fillText(line, x, y);
}

function roundedRect(ctx, x, y, w, h, r){
  const rad = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rad, y);
  ctx.arcTo(x+w, y, x+w, y+h, rad);
  ctx.arcTo(x+w, y+h, x, y+h, rad);
  ctx.arcTo(x, y+h, x, y, rad);
  ctx.arcTo(x, y, x+w, y, rad);
  ctx.closePath();
}

function drawFlower(ctx, x, y, r, petalColor, centerColor){
  ctx.save();
  ctx.translate(x,y);
  ctx.fillStyle = petalColor;
  for(let i=0;i<4;i++){
    ctx.save();
    ctx.rotate((Math.PI/4)*i);
    roundedRect(ctx, -r*0.55, -r, r*1.1, r*1.8, r*0.45);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(0,0,r*0.28,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawBouquet(ctx, cx, cy, style){
  ctx.save();
  ctx.translate(cx, cy);

  // wrap
  const grad = ctx.createLinearGradient(-250, -120, 250, 250);
  grad.addColorStop(0, style.wrapA);
  grad.addColorStop(1, style.wrapB);

  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-260, -110);
  ctx.lineTo(260, -110);
  ctx.lineTo(320, 150);
  ctx.lineTo(0, 340);
  ctx.lineTo(-320, 150);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ribbon
  const rg = ctx.createLinearGradient(-120, 80, 120, 130);
  rg.addColorStop(0, style.ribbonA);
  rg.addColorStop(1, style.ribbonB);
  ctx.fillStyle = rg;
  roundedRect(ctx, -130, 80, 260, 50, 25);
  ctx.fill();

  // stems
  ctx.strokeStyle = "#2bb673";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  const stems = [
    {dx:-120, dy:-270},
    {dx:-55, dy:-300},
    {dx:0,   dy:-320},
    {dx:55,  dy:-302},
    {dx:120, dy:-275},
  ];
  stems.forEach(s => {
    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.quadraticCurveTo(s.dx*0.45, s.dy*0.15, s.dx, s.dy);
    ctx.stroke();
  });

  // flowers
  stems.forEach((s, i) => {
    const [p,c] = style.flowers[i % style.flowers.length];
    drawFlower(ctx, s.dx, s.dy, 62, p, c);
  });

  ctx.restore();
}
