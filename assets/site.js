// 大樓網站的位置。上線打包時改成 "building/"（見 _說明.md）
window.BUILDING = "building/";
window.IG_URL = "https://www.instagram.com/mina11042026/";

(function () {
  const here = document.body.dataset.page;
  const nav = [
    ["index.html", "首頁", "home"],
    ["about.html", "關於米娜", "about"],
    ["exhibition.html", "作品策展", "exhibition"],
    ["game.html", "猜猜看", "game"],
  ];
  const head = document.createElement("header");
  head.className = "site-head";
  head.innerHTML = `<a class="brand" href="index.html" aria-label="米娜 首頁"><img src="assets/img/logo.png" alt="Mina 米娜"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="site-nav">選單</button>
    <nav id="site-nav">${nav.map(([h, t, k]) => `<a href="${h}"${k === here ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>`;
  document.body.prepend(head);
  const btn = head.querySelector(".menu-btn"), navEl = head.querySelector("nav");
  btn.onclick = () => { const o = navEl.classList.toggle("open"); btn.setAttribute("aria-expanded", o); btn.textContent = o ? "關閉" : "選單"; };
  addEventListener("scroll", () => head.classList.toggle("scrolled", scrollY > 8), { passive: true });

  const foot = document.createElement("footer");
  foot.className = "site-foot";
  foot.innerHTML = `<img src="assets/img/wordmark.png" alt="Mina">
    <p>每天蓋一層，慢慢來。</p>
    <p><a href="${IG_URL}" target="_blank" rel="noopener">Instagram ＠mina11042026</a></p>
    <p class="small">© 2026 米娜 Mina</p>`;
  document.body.append(foot);


  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // 作品彈窗：策展、猜猜看點作品時在原頁打開，關掉就回到原本的位置（不跳到大樓頁）
  // 用法：<a data-unit="4M" href="#unit-4M">（不連到舊的大樓頁）；頁面要先載入大樓的 data.js（window.UNITS）
  const SIDE_NAME = { L: "左戶", M: "中戶", R: "右戶" };
  const box = document.createElement("div");
  box.className = "unit-modal"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
  box.innerHTML = `<div class="unit-card"><video playsinline muted loop autoplay></video>
    <div class="unit-text"><div class="unit-mark"></div><div class="unit-title"></div><div class="unit-lines"></div><div class="unit-cap"></div></div></div>
    <button class="unit-close" aria-label="關閉">×</button>`;
  document.body.append(box);
  const q = s => box.querySelector(s), vid = q("video");
  const P = s => Object.assign(document.createElement("p"), { textContent: s });
  window.openUnit = key => {
    const m = /^(\d+)([LMR])$/.exec(key); if (!m) return;
    const f = +m[1], sd = m[2], k = String(f).padStart(2, "0") + sd;
    const u = (window.UNITS || {})[key] || { lines: [], caption: [] };
    box.classList.toggle("roof", f === 11);
    vid.poster = `${BUILDING}assets/tiles/${k}.jpg`; vid.src = `${BUILDING}assets/video/${k}.mp4`;
    q(".unit-mark").textContent = f === 11 ? `屋頂｜${SIDE_NAME[sd]}` : `${f}F｜${SIDE_NAME[sd]}・${u.kind || ""}`;
    q(".unit-title").textContent = u.title || "";
    q(".unit-lines").replaceChildren(...(u.lines || []).map(P));
    q(".unit-cap").replaceChildren(...(u.caption || []).map(P));
    q(".unit-cap").style.display = (u.caption || []).length ? "" : "none";
    box.classList.add("open"); document.documentElement.style.overflow = "hidden";
    q(".unit-close").focus({ preventScroll: true });
  };
  const close = () => { box.classList.remove("open"); vid.pause(); vid.removeAttribute("src"); vid.load(); document.documentElement.style.overflow = ""; };
  q(".unit-close").onclick = close;
  box.addEventListener("click", e => { if (e.target === box) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("open")) close(); });
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-unit]");
    if (!a) return;
    e.preventDefault(); openUnit(a.dataset.unit);
  });
})();
