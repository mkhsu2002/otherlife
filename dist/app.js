import { eras, stages, events, chooseLife, resolveStats } from "./data.js";
import { translateText, translateMarkup } from "./i18n.js";
import {
  lifeFor,
  replay,
  eventFor,
  endingFor,
  validRun,
  encodeRun,
  parseRun,
  dailyRun,
  freshRun,
  pilotKeys,
} from "./engine.js";
import {
  STORAGE_KEY,
  normalizeState,
  addRecord,
  importState,
  activeOK,
} from "./storage.js";
import { pilots } from "./stories.js";
import { knowledgeFor } from "./knowledge.js";
import {
  shareURL,
  shareText,
  socialLinks,
  resultImage,
  downloadBlob,
} from "./share.js";
const $ = (s) => document.querySelector(s);
let records = [],
  saveOK = true,
  view = "home",
  life = null,
  step = 0,
  stats = [60, 45, 35],
  log = [],
  pending = false;
let store = normalizeState(null),
  run = null,
  shared = false;
try {
  store = normalizeState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
    JSON.parse(localStorage.getItem("earthlife-v1") || "[]"),
  );
  records = store.records;
} catch {
  saveOK = false;
}
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function persist() {
  store.records = records;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    saveOK = false;
  }
}
function persistActive() {
  if (shared) return;
  if (life && step < 4 && validRun(run))
    store.active = {
      run: { ...run, choices: [...run.choices] },
      step,
      pending,
    };
  persist();
}
let language = "zh-Hant";
try {
  if (localStorage.getItem("earthlife-language") === "en") language = "en";
} catch {}
const t = (text) => translateText(text, language);
function setHTML(selector, html) {
  $(selector).innerHTML = translateMarkup(html, language);
}
function renderShell() {
  document.documentElement.lang = language;
  document.title = t("地球轉生所｜下一次，成為誰？");
  $('meta[name="description"]').setAttribute(
    "content",
    t("假如能重新出生，你會成為誰？跨越八個年代、二十四種生命的地球轉生冒險。"),
  );
  for (const [id, text] of Object.entries({
    brandName: "地球轉生所",
    navHome: "開始旅程",
    navCollection: "生命圖鑑",
    navAbout: "關於實驗",
    footerQuote: "✳ 每一種生命，都有自己的宇宙。",
    footerNote: "一場關於偶然、選擇與共存的想像實驗",
  }))
    $("#" + id).textContent = t(text);
  $(".brand").setAttribute("aria-label", t("地球轉生所首頁"));
  $("#languageToggle").textContent = language === "en" ? "繁體中文" : "English";
  $("#languageToggle").setAttribute(
    "aria-label",
    language === "en" ? "Switch to Traditional Chinese" : "切換為英文",
  );
  $("#languageToggle").setAttribute(
    "lang",
    language === "en" ? "zh-Hant" : "en",
  );
}
function setLanguage(next) {
  if (!["zh-Hant", "en"].includes(next) || next === language) return;
  const eraFilter = $("#eraSelect")?.value,
    collectionFilter = $("#collectionFilter")?.value;
  const scroll = {
    left: window.scrollX || 0,
    top: window.scrollY || 0,
    behavior: "instant",
  };
  language = next;
  try {
    localStorage.setItem("earthlife-language", language);
  } catch {}
  renderShell();
  render();
  if (view === "collection" && collectionFilter) {
    $("#collectionFilter").value = collectionFilter;
    renderGrid();
  } else if (view === "home" && !life && eraFilter)
    $("#eraSelect").value = eraFilter;
  window.scrollTo(scroll);
}
const unique = () => store.unlocked.length;
const earth = `<svg class="earth-svg" viewBox="0 0 600 520" role="img" aria-label="手繪風格地球，環繞著山林、海洋與星辰"><defs><linearGradient id="sea" x2="1" y2="1"><stop stop-color="#addcdb"/><stop offset="1" stop-color="#73b7bc"/></linearGradient><clipPath id="globe"><circle cx="300" cy="256" r="175"/></clipPath></defs><ellipse cx="303" cy="464" rx="142" ry="18" fill="#b8c5a9" opacity=".18"/><circle cx="300" cy="256" r="214" fill="none" stroke="#b9cbb9" stroke-dasharray="3 9"/><ellipse cx="300" cy="256" rx="264" ry="85" transform="rotate(-25 300 256)" fill="none" stroke="#a2b7a0" opacity=".5"/><circle cx="300" cy="256" r="175" fill="url(#sea)"/><g clip-path="url(#globe)" fill="#d0e0aa"><path d="M117 149l47-45 57 9 12 38 44 15-8 39-44 9-13 40-40-2-20-36-43-18zm86 124 48 8 29 40-13 43-25 37-10 43-25-26-8-65-24-36zm135-183 56 13 21 30 60-2 28 55-26 31-42-14-24 42-42-20-23-43-47 4-17-28zm-18 151 45-24 47 32 4 43-30 61-25-10-17-48-39-23zm97 101 36-12 35 25-12 25-47 2-22-17z"/><path d="M174 120l41 8 4 14-35 19-24-11zm150 137 31-24 16 23-26 25z" fill="#b0ca8c"/></g><g fill="#6e9d7b"><path d="m177 168 13-31 13 31h-9v15h-8v-15zm219-23 13-31 13 31h-9v15h-8v-15zm-43 139 13-31 13 31h-9v15h-8v-15z"/></g><g fill="#f6f6e9"><path d="m232 343 14-25 18 30h-35zm161-166 17-31 21 36h-41z"/><ellipse cx="162" cy="252" rx="39" ry="8"/><ellipse cx="437" cy="286" rx="38" ry="8"/><ellipse cx="291" cy="122" rx="33" ry="7"/></g><g stroke="#f8f7e9" stroke-width="3" fill="none" opacity=".75"><path d="M275 230q12-8 24 0t24 0M289 240q12-8 24 0M303 373q12-8 24 0t24 0M159 302q12-8 24 0"/></g><g fill="#769888"><path d="m94 110 4-10 4 10 10 4-10 4-4 10-4-10-10-4zM490 360l4-10 4 10 10 4-10 4-4 10-4-10-10-4z"/><circle cx="487" cy="131" r="5"/><circle cx="122" cy="375" r="4"/></g><g fill="#f2c887"><circle cx="465" cy="78" r="22"/><circle cx="92" cy="285" r="10"/></g><path d="M442 64q24 8 35 29" fill="none" stroke="#e3af6d" stroke-width="2"/><path d="m264 71 10-4 7 6m-1-7 10-4 7 6" fill="none" stroke="#6b8271" stroke-width="2"/></svg>`;
function scene(l) {
  let water = ["游泳", "固著"].includes(l.species[4]);
  return `<div class="life-scene ${water ? "water" : ""}" style="--scene:${l.era.color}"><span class="scene-sun"></span><span class="scene-cloud cloud-one"></span><span class="scene-cloud cloud-two"></span><div class="hill hill-back"></div><div class="hill hill-front"></div><span class="scene-flora f-one">${water ? "◌" : "🌿"}</span><span class="scene-flora f-two">${water ? "◌" : "🌱"}</span><span class="scene-animal">${l.species[1]}</span><span class="scene-caption">${l.era.name} · ${l.species[2]}</span></div>`;
}
function updateCount() {
  $("#collectionCount").textContent = unique();
}
function setView(v) {
  view = v;
  document
    .querySelectorAll(".nav")
    .forEach((n) => n.classList.toggle("active", n.dataset.view === v));
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function render() {
  updateCount();
  if (view === "collection") renderCollection();
  else if (view === "about") renderAbout();
  else if (life) renderLife();
  else renderHome();
}
function renderHome() {
  setHTML(
    "#app",
    `<section class="hero"><div class="hero-copy"><div class="eyebrow"><i></i> 地球很大，生命不只一種模樣</div><h1>下一次，<br>你會成為<span>誰？<svg viewBox="0 0 210 15" aria-hidden="true"><path d="M5 10Q100-4 205 8"/></svg></span></h1><p class="intro">也許是侏羅紀的森林居民，<br>也許是深海裡，一個安靜的小生命。<br>把起點交給宇宙，把故事留給自己。</p><div class="start-panel"><label for="eraSelect">這次想去哪個時代？</label><select id="eraSelect"><option value="all">✧ 讓地球決定 · 全時代隨機</option>${eras.map((e) => `<option value="${e.id}">${e.name} · ${e.time}</option>`).join("")}</select><button class="primary" id="begin">開啟一次新生命 <span>↗</span></button><button class="secondary daily" id="daily">今日共同起點 ↗</button><small>以溫哥華日期每天更換；相同起點，不同故事。</small><small>約 2 分鐘一段旅程 · 無需註冊 · 免費探索</small></div></div><div class="hero-art">${earth}<span class="floating-label label-one"><i>✦</i> 5.2 億年，無數種可能</span><span class="floating-label label-two"><i>🌱</i> 你的下一個起點，正在萌芽</span><div class="art-caption"><span>ONE PLANET.</span><span>COUNTLESS POSSIBILITIES.</span></div></div></section><section class="overview"><div><b>08<span>個年代</span></b><p>從寒武紀，到今天</p></div><div><b>24<span>種生命</span></b><p>在人類之外，重新看世界</p></div><div><b>04<span>次選擇</span></b><p>讓每一段生命有不同走向</p></div><a href="#journey">探索玩法 <span>↓</span></a></section><section class="journey" id="journey"><div class="section-heading"><span class="eyebrow">HOW IT UNFOLDS</span><h2>不用選對人生。<br>只要好好體驗這一次。</h2></div><div class="steps"><article><span>01 / 出生</span><h3>先抽一張生命籤</h3><p>年代、棲地與生命形態一起揭曉。每個起點，都有自己的風景。</p></article><article><span>02 / 經歷</span><h3>在變動中，做出選擇</h3><p>四個篇章，照顧活力、連結與探索。沒有唯一的正確答案。</p></article><article><span>03 / 留下</span><h3>收集你來過的證明</h3><p>把這一生收進圖鑑，再啟程，看看世界的另一面。</p></article></div></section><div class="gentle-note">✳ 這是一場想像遊戲。年代與生命採精選配對；抽選機率為遊戲設計，不代表真實出生或存活機率。</div>`,
  );
  $("#begin").onclick = () => start($("#eraSelect").value);
  $("#daily").onclick = () => beginRun(dailyRun(today()));
  if (paused) showResume();
}
function beginRun(next) {
  run = { ...next, choices: [...next.choices] };
  life = lifeFor(run.key);
  paused = null;
  shared = false;
  step = -1;
  stats = [60, 45, 35];
  log = [];
  pending = false;
  clearShareHash();
  persistActive();
  setView("home");
}
function start(filter) {
  beginRun(freshRun(filter));
}
function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
function statBars() {
  return `<div class="stats">${["活力", "連結", "探索"].map((s, i) => `<div><div class="stat-title"><span>${["♡", "⌘", "✧"][i]} ${s}</span><b>${stats[i]}</b></div><div class="bar"><i style="width:${stats[i]}%;--bar:${["#8cba94", "#e7b66e", "#83b6cb"][i]}"></i></div></div>`).join("")}</div>`;
}
function renderLife() {
  persistActive();
  let s = life.species,
    e = life.era;
  if (step === 4) {
    renderResult();
    return;
  }
  setHTML(
    "#app",
    `<div class="game-top"><button class="text-button" id="back">← 暫停，回到首頁</button><span>一顆星球，一段新故事</span></div><div class="game-grid"><aside class="identity-card">${scene(life)}<div class="identity-body"><span class="eyebrow">YOUR LIFE ON EARTH</span><h2>${s[0]}</h2><div class="tags"><span>${e.name}</span><span>${s[4]}</span></div><dl><div><dt>情境時間</dt><dd>${knowledgeFor(life.key).time || e.time}</dd></div><div><dt>所在之地</dt><dd>${s[3]}</dd></div><div><dt>你的棲地</dt><dd>${s[2]}</dd></div></dl><p class="geo-note">${["cambrian", "carboniferous", "jurassic", "cretaceous", "iceage"].includes(e.id) ? "地名以今日位置協助理解；當時的海陸分布與現在不同。" : "地點為代表性情境，故事為虛構。"}</p></div></aside><section class="story-card" aria-live="polite">${
      step === -1
        ? `<span class="eyebrow">生命籤已揭曉</span><h1>這一次，<br>你是${s[0]}。</h1><p class="story-lead">${s[5]}</p><div class="fact"><span>地球的小筆記</span><p>${knowledgeFor(life.key).note}</p><button class="text-button" id="lifeNote">查看小筆記 →</button></div><button class="primary" id="enter">走進這一生 <span>→</span></button><p class="subtle">起點由偶然決定，接下來的篇章由你參與。</p>`
        : `<div class="chapter-progress">${["啟程", "適應", "變動", "回聲"].map((x, i) => `<span class="${i === step ? "current" : i < step ? "complete" : ""}"><i>${i < step ? "✓" : i + 1}</i>${x}</span>`).join("")}</div>${statBars()}<div class="event"><span class="eyebrow">CHAPTER 0${step + 1} / ${["啟程", "適應", "變動", "回聲"][step]}</span><h2>${getEvent()[0]}</h2><p>${getEvent()[1]}</p></div><div class="choices">${getEvent()[2]
            .map(
              (c, i) =>
                `<button class="choice" data-choice="${i}"><span class="choice-num">0${i + 1}</span><span><b>${c[0]}</b><small>${c[1]}</small><em>${c[2].map((n, j) => `${["活力", "連結", "探索"][j]} ${n > 0 ? "+" : ""}${n}`).join(" · ")}<span>（另有 ±4 波動）</span></em></span><span class="choice-arrow">↗</span></button>`,
            )
            .join("")}</div><div id="aftermath"></div>`
    }</section></div>${step >= 0 ? `<section class="life-log"><h3>這一路的足跡 <span>${log.length} / 4</span></h3>${log.length ? log.map((l, i) => `<p><span>0${i + 1}</span>${l.text}<small>${l.delta.map((n, j) => `${["活力", "連結", "探索"][j]} ${n >= 0 ? "+" : ""}${n}`).join(" · ")}</small></p>`).join("") : '<p class="subtle">你的故事，正要開始。</p>'}</section>` : ""}`,
  );
  $("#back").onclick = () => {
    lifePaused();
  };
  if (step >= 0) {
    $(".story-card").setAttribute("tabindex", "-1");
    $(".story-card").focus?.({ preventScroll: true });
  }
  if (step === -1) {
    $("#enter").onclick = () => {
      step = 0;
      renderLife();
    };
    $("#lifeNote").onclick = () => showNote(life.key);
  } else {
    document
      .querySelectorAll("[data-choice]")
      .forEach((b) => (b.onclick = () => makeChoice(Number(b.dataset.choice))));
    if (pending) showAftermath(log[log.length - 1].delta);
  }
}
let paused = null;
function lifePaused() {
  paused = {
    life,
    run: { ...run, choices: [...run.choices] },
    shared: false,
    step,
    stats: [...stats],
    log: [...log],
    pending,
  };
  life = null;
  renderHome();
}
function showResume() {
  const p = document.createElement("div");
  p.className = "resume";
  p.innerHTML = translateMarkup(
    '<span>你還有一段未完成的旅程。</span><button class="text-button">繼續這一生 →</button>',
    language,
  );
  $("#app").prepend(p);
  p.querySelector("button").onclick = () => {
    ({ life, run, shared, step, stats, log, pending } = paused);
    paused = null;
    renderLife();
  };
}
function getEvent() {
  return eventFor(life.key, step, run?.choices || [], run?.seed || 1);
}
function makeChoice(index) {
  if (pending || shared || (index !== 0 && index !== 1) || step < 0 || step > 3)
    return;
  if (run.key !== life.key) run = { ...run, key: life.key };
  pending = true;
  run.choices.push(index);
  const result = replay(run);
  stats = result.stats;
  log = result.log;
  persistActive();
  showAftermath(log[log.length - 1].delta, index);
}
function showAftermath(
  delta,
  index = getEvent()[2].findIndex((c) => c[0] === log[log.length - 1].text),
) {
  document.querySelectorAll("[data-choice]").forEach((b) => {
    b.disabled = true;
    b.classList.toggle("selected", Number(b.dataset.choice) === index);
  });
  $(".stats").outerHTML = translateMarkup(statBars(), language);
  setHTML(
    "#aftermath",
    `<div class="aftermath"><span>✦ 這個選擇，已成為你的一部分。</span><p>${log[log.length - 1].after || ""}</p><p>${delta.map((n, i) => `${["活力", "連結", "探索"][i]} ${n >= 0 ? "+" : ""}${n}`).join("　")}</p><button class="primary" id="continue">${step === 3 ? "看看這一生留下什麼" : "前往下一篇章"} <span>→</span></button></div>`,
  );
  const expectedStep = step;
  $("#continue").onclick = () => {
    if (!pending || step !== expectedStep) return;
    step++;
    pending = false;
    if (step === 4) saveLife();
    renderLife();
  };
}
function outcome() {
  return endingFor(life.key, run?.choices || [], stats);
}
function saveLife() {
  if (shared) return;
  const r = {
    key: life.key,
    stats: [...stats],
    title: outcome(),
    date: Date.now(),
    log: log.map((x) => x.text),
    run: { ...run, choices: [...run.choices] },
  };
  store = addRecord(store, r);
  records = store.records;
  persist();
  updateCount();
}
function renderResult() {
  setHTML(
    "#app",
    `<section class="result"><div class="result-icon">${life.species[1]}</div><span class="eyebrow">A LIFE WELL EXPLORED</span><h1>小小的一生，<br>也在地球留下了回聲。</h1><p>${life.era.name} · ${life.species[0]} · ${life.species[3]}</p><div class="outcome">✦ ${outcome()}</div><div class="result-stats">${statBars()}</div><p class="result-copy">${stats[2] >= stats[0] ? "你曾走向未知，也把好奇留給了這個世界。" : "你在季節與變動之間，找到屬於自己的步調。"}<br>故事的價值，並不只有存活得更久。</p><p class="share-note">${shared ? "這是朋友分享的旅程，不會加入你的圖鑑。" : "選擇決定路線，沒有唯一的最佳結局。"}</p><section class="recap"><h2>故事回顧</h2>${log.map((r, i) => `<p><b>0${i + 1} · ${r.event || ""}</b><br>${r.text}<br><small>${r.after || ""}</small></p>`).join("")}</section>${sharingMarkup()}<div class="result-actions"><button class="primary" id="again">再來一段新生命 <span>↻</span></button><button class="secondary" id="seeCollection">查看生命圖鑑 →</button></div><small>${shared ? "這是朋友分享的旅程，不會加入你的圖鑑。" : saveOK ? "已收藏在這個瀏覽器的生命圖鑑" : "瀏覽器無法儲存；本次圖鑑僅在開啟期間保留"} · 已探索 ${unique()} / 24 種生命</small><section class="worlds" aria-labelledby="worlds-title"><span class="eyebrow">THE NEXT HORIZON</span><h2 id="worlds-title">這一生落幕了，<br>另一個世界正等著你。</h2><p>帶著這一生的好奇，繼續走向新的風景。</p><div class="world-links"><a class="world-link" href="https://k-hunting-log.icareu.tw/" target="_blank" rel="noopener noreferrer"><span class="world-symbol" aria-hidden="true">✳</span><span><small>FIELD NOTES / 01</small><b>探索 K 的狩獵日誌</b></span><span class="world-arrow" aria-hidden="true">↗</span></a><a class="world-link world-blue" href="https://neobabylon.icareu.tw/" target="_blank" rel="noopener noreferrer"><span class="world-symbol" aria-hidden="true">✧</span><span><small>ANOTHER WORLD / 02</small><b>走進《新巴比倫》</b></span><span class="world-arrow" aria-hidden="true">↗</span></a></div><small class="world-note">在新分頁開啟，這一生的回聲會留在這裡。</small></section><div class="result-foot">這是四個篇章的敘事收束，不是壽命預測。數值為遊戲體驗，不代表生命的高低。</div></section>`,
  );
  $("#again").onclick = () => {
    life = null;
    paused = null;
    shared = false;
    restoreActive();
    clearShareHash();
    renderHome();
  };
  $("#seeCollection").onclick = () => setView("collection");
  wireSharing();
}
function renderCollection() {
  setHTML(
    "#app",
    `<section class="collection-head"><div><span class="eyebrow">THE LIVES YOU HAVE LIVED</span><h1>你曾是，<br>世界的一部分。</h1><p>每一次重生，都是一種觀看地球的新方式。</p></div><div class="collection-total"><b>${unique()}<small> / 24</small></b><span>種生命已留下足跡</span><span>${records.length} 段旅程已收藏</span></div></section><div class="collection-toolbar"><label>瀏覽年代 <select id="collectionFilter"><option value="all">所有年代</option>${eras.map((e) => `<option value="${e.id}">${e.name}</option>`).join("")}</select></label><span>完成一生，即可點亮圖鑑</span></div><div class="backup-actions"><button class="secondary" id="exportBackup">匯出備份</button><label class="secondary" for="importBackup">匯入備份</label><input type="file" id="importBackup" accept="application/json,.json"><button class="text-button" id="clearData">清除本機資料</button></div><div id="collectionGrid"></div><div class="gentle-note">圖鑑保存在這個瀏覽器。已解鎖生命會持續保留，旅程保留最近 100 筆；未完成旅程可於重新整理後繼續。${saveOK ? "" : " 此瀏覽器目前無法持久儲存。"}</div>`,
  );
  $("#collectionFilter").onchange = renderGrid;
  wireBackup();
  renderGrid();
}
function renderGrid() {
  const filter = $("#collectionFilter").value;
  setHTML(
    "#collectionGrid",
    eras
      .filter((e) => filter === "all" || filter === e.id)
      .map(
        (e) =>
          `<section class="era-collection"><h2>${e.name}<small>${e.time}</small></h2><div class="collection-grid">${e.species
            .map((s, i) => {
              const r = store.unlocked.includes(`${e.id}-${i}`);
              return `<article class="specimen ${r ? "unlocked" : "locked"}"><span class="specimen-icon">${r ? s[1] : "✧"}</span><div><small>${r ? "已探索" : "等待相遇"}</small><h3>${s[0]}</h3><p>${s[2]}</p>${r ? `<span class="specimen-title">旅程已收藏</span>` : '<span class="specimen-title">一個還沒開始的故事</span>'}<button class="text-button" data-note="${e.id}-${i}">查看小筆記 →</button></div></article>`;
            })
            .join("")}</div></section>`,
      )
      .join(""),
  );
  for (const b of document.querySelectorAll("[data-note]"))
    b.onclick = () => showNote(b.dataset.note);
}
function renderAbout() {
  setHTML(
    "#app",
    `<section class="about"><span class="eyebrow">ONE PLANET, MANY STORIES</span><h1>把視角放小，<br>把世界看大。</h1><p class="intro">如果生命可以重新抽籤，我們還會用同一把尺，衡量每一種存在嗎？</p><article><h2>這個版本怎麼玩？</h2><p>所有生命都能探索；六段分支故事帶你更靠近各自的世界。</p><p>你的選擇會改變後續篇章與結局；數值是敘事指標，不代表生命價值。</p></article><article><h2>隨機，不等於真實機率</h2><p>隨機生命，每種約 1/24；指定年代則每種約 1/3。今日共同起點另以當日固定起點開始。</p></article><article><h2>地球的歷史，比遊戲更複雜</h2><p>古地理與生態都比故事複雜。部分名稱代表類群而非單一物種；年代是情境參照。</p><p>故事為想像情節；圖示為象徵，不是物種復原圖。</p></article><article><h2>分享這一生</h2><p>你可以分享一次結果，或邀朋友從相同起點開始。相同起點與選擇會重現相同結果，這不是真實出生機率或科學預測。</p></article><article><h2>關於你的資料</h2><p>進度與語言偏好只保存在這個瀏覽器。可匯出備份；清除網站資料會移除存檔。分享是自願的，不會自動發布到社群。</p></article><button class="primary" id="aboutStart">準備好，去見見世界 <span>↗</span></button></section>`,
  );
  $("#aboutStart").onclick = () => {
    if (life && step < 4) lifePaused();
    else life = null;
    setView("home");
  };
}
for (const n of document.querySelectorAll("[data-view]"))
  n.onclick = () => setView(n.dataset.view);
$(".brand").onclick = (e) => {
  e.preventDefault();
  setView("home");
};
$("#languageToggle").onclick = () =>
  setLanguage(language === "en" ? "zh-Hant" : "en");
restoreActive();
renderShell();
if (!openShare()) render();
window.addEventListener?.("hashchange", () => {
  if (!openShare()) render();
});

function clearShareHash() {
  if (typeof location !== "undefined" && /^#[rc]=/.test(location.hash))
    history.replaceState(null, "", location.pathname + location.search);
}
function restoreActive() {
  const a = store.active;
  if (!activeOK(a)) return;
  const result = replay(a.run);
  run = a.run;
  paused = {
    life: lifeFor(run.key),
    run: { ...run, choices: [...run.choices] },
    shared: false,
    step: a.step,
    stats: result.stats,
    log: result.log,
    pending: a.pending,
  };
}
function openShare() {
  if (typeof location === "undefined" || !/^#[rc]=/.test(location.hash))
    return false;
  const parsed = parseRun(location.hash);
  if (!parsed) {
    setHTML(
      "#app",
      '<section class="about"><h1>這個分享連結無法讀取，請向朋友取得新的連結。</h1><a href="/">返回首頁</a></section>',
    );
    return true;
  }
  language = parsed.language;
  renderShell();
  run = parsed.run;
  shared = parsed.kind === "r";
  if (!shared) {
    beginRun(run);
    return true;
  }
  life = lifeFor(run.key);
  ({ stats, log } = replay(run));
  step = 4;
  pending = false;
  view = "home";
  renderResult();
  return true;
}
function notify(message) {
  $("#toast").textContent = t(message);
  $("#toast").classList.add("visible");
  setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}
function sharingMarkup() {
  const url = shareURL(run, language),
    text = shareText(run, outcome(), language);
  return `<section class="sharing" aria-labelledby="share-title"><h2 id="share-title">分享這一生</h2><p>和朋友走出不同的一生</p><div class="share-buttons"><button class="primary" id="systemShare">分享結果 ↗</button><button class="secondary" id="copyLink">複製結果連結</button><button class="secondary" id="copyChallenge">複製同籤連結</button><button class="secondary" id="copyText">複製分享文字</button><button class="secondary" id="postCard">下載貼文卡</button><button class="secondary" id="storyCard">下載限動卡</button></div><div class="social-links">${Object.entries(
    socialLinks(url, text),
  )
    .map(
      ([name, href]) =>
        `<a class="secondary" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`,
    )
    .join(
      "",
    )}</div><button class="text-button" id="sameBeginning">用相同起點遊玩 →</button><p class="subtle">結果卡可下載後分享到 Instagram 或 Threads。</p><p class="subtle">公開連結只包含這段旅程的起點與選擇，不包含你的圖鑑或個人資料。</p><div id="shareFallback"></div></section>`;
}
async function copyContent(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    notify(message);
  } catch {
    setHTML(
      "#shareFallback",
      `<label for="shareContent">可手動複製以下內容。</label><textarea id="shareContent" readonly aria-label="分享內容"></textarea>`,
    );
    $("#shareContent").value = text;
    $("#shareContent").focus();
    $("#shareContent").select();
  }
}
function wireSharing() {
  let preparedImage = null;
  const current = { ...run, choices: [...run.choices] },
    lang = language,
    result = replay(current),
    url = shareURL(current, lang),
    text = shareText(current, result.title, lang);
  resultImage(current, result, lang)
    .then((blob) => {
      preparedImage = new File([blob], "earthlife-result.png", {
        type: "image/png",
      });
    })
    .catch(() => {});
  $("#copyLink").onclick = () => copyContent(url, "連結已複製。");
  $("#copyChallenge").onclick = () =>
    copyContent(shareURL(current, lang, "c"), "連結已複製。");
  $("#copyText").onclick = () => copyContent(text + "\n" + url, "文字已複製。");
  $("#sameBeginning").onclick = () => beginRun({ ...current, choices: [] });
  for (const [id, portrait] of [
    ["postCard", false],
    ["storyCard", true],
  ])
    $("#" + id).onclick = async () => {
      try {
        downloadBlob(
          await resultImage(current, result, lang, portrait),
          "earthlife-" + current.key + (portrait ? "-story" : "") + ".png",
        );
        notify("圖片已下載。");
      } catch {
        notify("無法產生圖片，請改用複製連結。");
      }
    };
  $("#systemShare").onclick = async () => {
    if (!navigator.share) {
      notify("此裝置未提供系統分享，請使用下方分享入口或複製連結。");
      return;
    }
    try {
      const data = {
        title: lang === "en" ? "Earthlife Atlas" : "地球轉生所",
        text,
        url,
      };
      if (preparedImage && navigator.canShare?.({ files: [preparedImage] }))
        data.files = [preparedImage];
      await navigator.share(data);
    } catch (e) {
      if (e.name !== "AbortError")
        notify("分享未完成，請改用複製連結或下載圖片。");
    }
  };
}
function showNote(key) {
  const l = lifeFor(key);
  if (!l) return;
  const k = knowledgeFor(key),
    old = $("#fieldNote");
  if (old) old.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "fieldNote";
  dialog.innerHTML = translateMarkup(
    `<button class="text-button close-note" aria-label="關閉小筆記">×</button><span class="eyebrow">FIELD NOTE</span><h2>${l.species[0]}</h2><p>${k.time || l.era.time} · ${l.species[3]}</p><p>${k.note}</p><p class="subtle">故事為想像情節；圖示為象徵，不是物種復原圖。</p><a href="${k.source?.url || "https://naturalhistory.si.edu/education/teaching-resources/paleontology"}" target="_blank" rel="noopener noreferrer">閱讀來源 · ${k.source?.name || "Smithsonian"} ↗</a><h3>故事回顧</h3>${
      records
        .filter((r) => r.key === key)
        .slice(0, 3)
        .map((r) => `<p>${r.log.map(esc).join(" · ")}</p>`)
        .join("") || "<p>尚無足跡，完成一段旅程後再來回顧。</p>"
    }`,
    language,
  );
  document.body.append(dialog);
  dialog.querySelector("button").onclick = () => dialog.close();
  dialog.addEventListener("close", () => dialog.remove());
  dialog.showModal();
}
function wireBackup() {
  $("#exportBackup").onclick = () => {
    persistActive();
    downloadBlob(
      new Blob([JSON.stringify(store, null, 2)], { type: "application/json" }),
      "earthlife-backup.json",
    );
    notify("備份已下載。");
  };
  $("#importBackup").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.size > 250000) throw Error("large");
      const next = importState(await file.text());
      store = next;
      records = store.records;
      life = null;
      paused = null;
      shared = false;
      clearShareHash();
      restoreActive();
      persist();
      renderCollection();
      updateCount();
      notify(
        saveOK
          ? "備份已匯入。"
          : "無法儲存，請先匯出備份；目前資料僅在此頁保留。",
      );
    } catch {
      notify("備份格式不符或檔案過大，原有資料已保留。");
    }
  };
  $("#clearData").onclick = () => {
    if (!window.confirm(t("只會清除這個瀏覽器的遊戲存檔。要繼續嗎？"))) return;
    store = normalizeState(null);
    records = [];
    life = null;
    paused = null;
    run = null;
    shared = false;
    clearShareHash();
    try {
      localStorage.removeItem("earthlife-v1");
    } catch {}
    persist();
    renderCollection();
    updateCount();
    notify("記錄已清除。");
  };
}
