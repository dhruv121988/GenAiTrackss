// script.js

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));

// ---------- Tilt + glow follow ----------
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 10;

    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    card.style.setProperty("--mx", `${(x / r.width) * 100}%`);
    card.style.setProperty("--my", `${(y / r.height) * 100}%`);
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// ---------- Modal data ----------
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeModal");
const copyBtn = document.getElementById("copyLink");

const modalTitle = document.getElementById("modalTitle");
const modalDesc  = document.getElementById("modalDesc");
const modalBadge = document.getElementById("modalBadge");
const modalIcon  = document.getElementById("modalIcon");

const TRACKS = {
  appathon: {
    badge: "APPATHON 3.0",
    title: "Appathon 3.0",
    desc: "Build a real-world mobile application with a clear problem statement, strong UX, and a working prototype/demo.",
    img: "assets/appathon.png"
  },
  datathon: {
    badge: "DATATHON 3.0",
    title: "Datathon 3.0",
    desc: "Analyze datasets, find patterns, and present insights clearly with strong reasoning and visuals.",
    img: "assets/datathon.png"
  },
  webathon: {
    badge: "WEBATHON 3.0",
    title: "Webathon 3.0",
    desc: "Create a modern web app/site with responsive UI, good UX flow, and solid functionality.",
    img: "assets/webathon.png"
  },
  hackstreet: {
    badge: "HACKSTREET 4.0",
    title: "Hackstreet 4.0",
    desc: "High-intensity hack sprint: build fast, validate quickly, test well, and pitch a feasible solution.",
    img: "assets/hackstreet.png"
  },
  ideathon: {
    badge: "IDEATHON 3.0",
    title: "Ideathon 3.0",
    desc: "Pitch an innovative idea with feasibility, roadmap, impact, and clear execution plan.",
    img: "assets/ideathon.png"
  }
};

document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-open");
    const t = TRACKS[key];

    modalBadge.textContent = t.badge;
    modalTitle.textContent = t.title;
    modalDesc.textContent  = t.desc;
    modalIcon.src = t.img;

    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeModal(){
  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

// Copy form link
copyBtn.addEventListener("click", async () => {
  const link = "https://forms.gle/Ln9zJooH7D7To6Sy9";
  try{
    await navigator.clipboard.writeText(link);
    copyBtn.textContent = "Copied!";
    setTimeout(()=> copyBtn.textContent = "Copy Registration Link", 1200);
  } catch {
    alert("Copy failed. Link: " + link);
  }
});

// ---------- Stars canvas ----------
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let W, H, stars;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;

  const count = Math.floor(Math.min(170, Math.max(90, W / 12)));
  stars = Array.from({length: count}).map(() => ({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.6 + 0.2,
    a: Math.random()*0.5 + 0.12,
    vx: (Math.random()-0.5)*0.25,
    vy: (Math.random()-0.5)*0.25
  }));
}
window.addEventListener("resize", resize);
resize();

function loop(){
  ctx.clearRect(0,0,W,H);

  // stars
  for(const s of stars){
    s.x += s.vx; s.y += s.vy;
    if(s.x < -20) s.x = W+20;
    if(s.x > W+20) s.x = -20;
    if(s.y < -20) s.y = H+20;
    if(s.y > H+20) s.y = -20;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  }

  // subtle connections
  for(let i=0;i<stars.length;i++){
    for(let j=i+1;j<stars.length;j++){
      const a = stars[i], b = stars[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if(d < 120){
        const alpha = (1 - d/120) * 0.07;
        ctx.strokeStyle = `rgba(255,43,43,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(loop);
}
loop();
