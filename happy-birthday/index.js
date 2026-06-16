// ===== BACKGROUND HEARTS =====
(function () {
  const container = document.getElementById("bgHearts");
  const hearts = ["💗", "💕", "💓", "🌸", "✨", "💖", "🌷"];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    el.className = "bg-heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 8 + Math.random() * 10 + "s";
    el.style.animationDelay = Math.random() * 12 + "s";
    el.style.fontSize = 0.8 + Math.random() * 1.4 + "rem";
    container.appendChild(el);
  }
})();
// ===== NAVIGATION =====
const titles = {
  curtain: "SEAL.EXE",
  count: "LOADING.EXE",
  load: "LOADING.EXE",
  party: "PARTY.EXE",
  cake: "CAKE.EXE",
  gallery: "GALLERY.EXE",
  letter: "LETTER.EXE",
  finale: "PARTY.EXE",
};
function goTo(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("screen-" + name);
  if (target) {
    target.classList.add("active");
    document.getElementById("winTitle").textContent = titles[name] || "APP.EXE";
    // Reset win animation
    const win = document.getElementById("mainWin");
    win.style.animation = "none";
    requestAnimationFrame(() => {
      win.style.animation = "";
    });
  }
  if (name === "cake") initCake();
  if (name === "gallery") initGallery();
  if (name === "finale") startConfetti();
}
// ===== SCREEN 1: CURTAIN HOLD =====
(function () {
  const btn = document.getElementById("sealBtn");
  const stripes = document.getElementById("curtainStripes");
  let holdTimer = null;
  let holding = false;
  function startHold() {
    if (holding) return;
    holding = true;
    stripes.classList.add("curtain-open");
    holdTimer = setTimeout(() => {
      if (holding) beginCountdown();
    }, 1500);
  }
  function endHold() {
    if (!holding) return;
    holding = false;
    stripes.classList.remove("curtain-open");
    clearTimeout(holdTimer);
  }
  btn.addEventListener("mousedown", startHold);
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      startHold();
    },
    { passive: false }
  );
  btn.addEventListener("mouseup", endHold);
  btn.addEventListener("mouseleave", endHold);
  btn.addEventListener("touchend", endHold);
})();
// ===== SCREEN 2: COUNTDOWN =====
function beginCountdown() {
  goTo("count");
  let n = 3;
  document.getElementById("countNum").textContent = n;
  const iv = setInterval(() => {
    n--;
    const el = document.getElementById("countNum");
    if (n > 0) {
      el.style.animation = "none";
      requestAnimationFrame(() => {
        el.style.animation = "countPulse 0.6s ease-out";
      });
      el.textContent = n;
    } else {
      clearInterval(iv);
      goTo("load");
      setTimeout(() => goTo("party"), 2200);
    }
  }, 1000);
}
// ===== SCREEN 5: CAKE SLICE =====
function initCake() {
  const canvas = document.getElementById("cake-canvas");
  const wrap = document.getElementById("cakeWrap");
  const W = wrap.offsetWidth;
  const H = wrap.offsetHeight;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  // Pink frosting layer
  ctx.fillStyle = "rgba(255,182,217,0.18)";
  ctx.fillRect(0, 0, W, H);
  let painting = false;
  let painted = 0;
  const total = W * H;
  let done = false;
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - r.left, y: clientY - r.top };
  }
  function paint(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fill();
    // count revealed pixels
    const data = ctx.getImageData(0, 0, W, H).data;
    let revealed = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) revealed++;
    }
    const pct = Math.min(100, Math.round((revealed / total) * 100));
    document.getElementById("cakeProgress").textContent = pct + "% sliced";
    if (pct >= 60 && !done) {
      done = true;
      document.getElementById("cakeProgress").textContent =
        "🎂 Well done! Moving on...";
      setTimeout(() => goTo("gallery"), 1200);
    }
  }
  canvas.addEventListener("mousedown", (e) => {
    painting = true;
    paint(...Object.values(getPos(e)));
  });
  canvas.addEventListener("mousemove", (e) => {
    if (painting) {
      const p = getPos(e);
      paint(p.x, p.y);
    }
  });
  canvas.addEventListener("mouseup", () => (painting = false));
  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      painting = true;
      const p = getPos(e);
      paint(p.x, p.y);
    },
    { passive: false }
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      if (painting) {
        const p = getPos(e);
        paint(p.x, p.y);
      }
    },
    { passive: false }
  );
  canvas.addEventListener("touchend", () => (painting = false));
}
// ===== SCREEN 6: GALLERY =====
// ---- CUSTOMIZE: replace these with your actual image URLs or base64 ----
const PHOTOS = [
  { src: "./img/birthday-1.jpg", caption: "📸", emoji: "" },
  { src: "./img/birthday-2.jpg", caption: "🌟", emoji: "" },
  { src: "./img/birthday-3.jpg", caption: "💕", emoji: "" },
  { src: "./img/birthday-4.jpg", caption: "🌸", emoji: "" },
  { src: "./img/birthday-5.jpg", caption: "✨", emoji: "" },
];
// For each photo, set src to the image URL string, e.g.:
// { src: "https://example.com/photo1.jpg", caption: "Our first selfie", emoji: "📸" }
// If src is null, a placeholder with emoji is shown instead.
function initGallery() {
  const track = document.getElementById("galleryTrack");
  const dotsWrap = document.getElementById("galleryDots");
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  PHOTOS.forEach((p, i) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";

    if (p.src) {
      const img = document.createElement("img");
      img.src = p.src;
      img.alt = p.caption;
      slide.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "photo-placeholder";
      ph.innerHTML =
        p.emoji + "<br><br>Add your<br>photo here<br><br>" + p.caption;
      slide.appendChild(ph);
    }

    const lbl = document.createElement("span");
    lbl.className = "slide-label";
    lbl.textContent = p.caption;
    slide.appendChild(lbl);
    track.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "gallery-dot" + (i === 0 ? " active" : "");
    dot.onclick = () => slideTo(i);
    dotsWrap.appendChild(dot);
  });

  let cur = 0;
  let startX = 0;

  function slideTo(idx) {
    cur = Math.max(0, Math.min(PHOTOS.length - 1, idx));
    track.style.transform = `translateX(-${cur * 100}%)`;
    document.querySelectorAll(".gallery-dot").forEach((d, i) => {
      d.classList.toggle("active", i === cur);
    });
  }

  const slider = document.getElementById("gallerySlider");
  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  slider.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) slideTo(dx < 0 ? cur + 1 : cur - 1);
  });
  slider.addEventListener("mousedown", (e) => {
    startX = e.clientX;
  });
  slider.addEventListener("mouseup", (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) slideTo(dx < 0 ? cur + 1 : cur - 1);
  });
}

// ===== SCREEN 7: LETTER =====
// ---- CUSTOMIZE: write your letter here ----
const LETTER_TEXT = `
      Happy Birthday
      
      Happy Birthday!! I hope your day is filled with smiles, good vibes and all the little things that make you happy. Stay the amazing person you are, have a year ahead! :) beautiful
      
      Have lots of fun, eat your favourite food, and laugh a little extra today. Make some memories that will make you smile even weeks later.

      Yours truly,
      Jitu..
      `;

function openLetter() {
  const envelope = document.getElementById("letterEnvelope");
  const seal = document.getElementById("waxSeal");
  seal.style.animation = "none";
  seal.textContent = "💗";
  seal.style.transform = "scale(1.2)";
  setTimeout(() => {
    envelope.classList.remove("sealed");
    envelope.style.cursor = "default";
    envelope.onclick = null;
    const content = document.createElement("div");
    content.className = "letter-content open";
    content.innerHTML = LETTER_TEXT.replace(/\n/g, "<br>");
    envelope.innerHTML = "";
    envelope.appendChild(content);
    document.getElementById("letterAfterBtn").style.display = "block";
  }, 400);
}

// ===== SCREEN 8: CONFETTI =====
function startConfetti() {
  const rain = document.getElementById("confettiRain");
  rain.innerHTML = "";
  const colors = [
    "#FF3D8B",
    "#FF79B0",
    "#FFD166",
    "#A8DAFF",
    "#B5EAD7",
    "#FFDAC1",
  ];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("div");
    c.className = "confetto";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 2 + Math.random() * 3 + "s";
    c.style.animationDelay = Math.random() * 2 + "s";
    c.style.width = 6 + Math.random() * 8 + "px";
    c.style.height = 6 + Math.random() * 8 + "px";
    c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    rain.appendChild(c);
  }
  setTimeout(() => {
    rain.innerHTML = "";
  }, 5000);
}

// ===== RESTART =====
function restartAll() {
  document.getElementById("curtainStripes").classList.remove("curtain-open");
  document.getElementById("letterEnvelope").classList.add("sealed");
  document.getElementById("letterEnvelope").onclick = openLetter;
  document.getElementById("letterAfterBtn").style.display = "none";
  const env = document.getElementById("letterEnvelope");
  env.innerHTML =
    '<div class="wax-seal" id="waxSeal">🤍</div><span class="seal-label">TAP TO OPEN</span>';
  document.getElementById("confettiRain").innerHTML = "";
  goTo("curtain");
}
