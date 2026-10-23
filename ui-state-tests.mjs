import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import * as data from "./dist/data.js";
import * as i18n from "./dist/i18n.js";
import * as engine from "./dist/engine.js";
import * as storage from "./dist/storage.js";
import * as stories from "./dist/stories.js";
import * as knowledge from "./dist/knowledge.js";
import * as sharing from "./dist/share.js";
import * as music from "./dist/music.js";
function app(saved = new Map(), storageAvailable = true) {
  const nodes = new Map();
  function node(s) {
    if (!nodes.has(s))
      nodes.set(s, {
        innerHTML: "",
        textContent: "",
        value: "all",
        style: {},
        dataset: {},
        attributes: {},
        setAttribute(k, v) {
          this.attributes[k] = v;
        },
        classList: { toggle() {}, add() {}, remove() {} },
        prepend() {},
        querySelector(t) {
          return node(s + " " + t);
        },
        set outerHTML(v) {
          this.innerHTML = v;
        },
      });
    return nodes.get(s);
  }
  const nav = ["home", "collection", "about"].map((v) => ({
    ...node("nav" + v),
    dataset: { view: v },
  }));
  const choices = [0, 1].map((i) => ({
    ...node("choice" + i),
    dataset: { choice: String(i) },
  }));
  const ctx = vm.createContext({
    ...data,
    ...i18n,
    ...engine,
    ...storage,
    ...stories,
    ...knowledge,
    ...sharing,
    ...music,
    setTimeout: () => {},
    console,
    Math,
    Date,
    Set,
    Number,
    JSON,
    localStorage: {
      getItem: (k) => {
        if (!storageAvailable) throw Error("blocked");
        return saved.get(k) || null;
      },
      setItem: (k, v) => {
        if (!storageAvailable) throw Error("blocked");
        saved.set(k, v);
      },
    },
    window: { scrollTo() {} },
    document: {
      addEventListener() {},
      removeEventListener() {},
      documentElement: { lang: "zh-Hant" },
      querySelector: node,
      querySelectorAll: (s) => (s === "[data-choice]" ? choices : nav),
      createElement: () => node("resume"),
    },
  });
  vm.runInContext(
    fs.readFileSync("dist/app.js", "utf8").replace(/^import[\s\S]*?;\n/gm, ""),
    ctx,
  );
  return { run: (s) => vm.runInContext(s, ctx), node, saved };
}
test("every era completes four chapters, saves once, replays and renders collection", () => {
  for (const era of data.eras) {
    const a = app();
    a.run(`start('${era.id}');step=0;renderLife()`);
    for (let i = 0; i < 4; i++) {
      a.run(`makeChoice(${i % 2})`);
      assert.equal(a.run("log.length"), i + 1);
      a.run("makeChoice(0)");
      assert.equal(a.run("log.length"), i + 1);
      a.node("#continue").onclick();
    }
    assert.equal(a.run("step"), 4);
    assert.equal(a.run("records.length"), 1);
    assert.equal(JSON.parse(a.saved.get("earthlife-save")).records.length, 1);
    a.run("setView('collection');setView('about');setView('home')");
    a.node("#again").onclick();
    assert.equal(a.run("life"), null);
  }
});
test("pending choice survives navigation and pause/resume, including final chapter", () => {
  const a = app();
  a.run(
    "start('modern');step=0;renderLife();makeChoice(0);setView('collection');setView('home')",
  );
  a.node("#continue").onclick();
  assert.equal(a.run("step"), 1);
  for (let i = 1; i < 4; i++) {
    a.run("makeChoice(0);lifePaused()");
    a.run("setView('collection');setView('home')");
    a.node("resume button").onclick();
    assert.equal(a.run("pending"), true);
    a.node("#continue").onclick();
  }
  assert.equal(a.run("records.length"), 1);
  assert.equal(a.run("step"), 4);
});
test("optional world invitations appear only after completion and preserve replay and collection", () => {
  const a = app();
  assert(!a.node("#app").innerHTML.includes("world-links"));
  a.run("start('modern');step=0;renderLife()");
  assert(!a.node("#app").innerHTML.includes("world-links"));
  for (let i = 0; i < 4; i++) {
    a.run("makeChoice(0)");
    a.node("#continue").onclick();
  }
  const html = a.node("#app").innerHTML;
  assert(html.includes("這一生落幕了，"));
  assert(html.includes("探索 K 的狩獵日誌"));
  assert(html.includes("走進《新巴比倫》"));
  const links = [...html.matchAll(/<a class="world-link[^>]+>/g)].map(
    (m) => m[0],
  );
  assert.equal(links.length, 2);
  for (const [i, url] of [
    "https://k-hunting-log.icareu.tw/",
    "https://neobabylon.icareu.tw/",
  ].entries()) {
    assert(links[i].includes(`href="${url}"`));
    assert(links[i].includes('target="_blank"'));
    assert(links[i].includes('rel="noopener noreferrer"'));
  }
  a.node("#seeCollection").onclick();
  assert.equal(a.run("view"), "collection");
  a.run("setView('home')");
  a.node("#again").onclick();
  assert.equal(a.run("life"), null);
  assert(!a.node("#app").innerHTML.includes("world-links"));
  assert.equal(a.run("records.length"), 1);
});

const han = /\p{Script=Han}/u;
function assertEnglish(html) {
  assert(
    !han.test(html.replace(/<[^>]*>/g, "")),
    html.match(/[\u3400-\u9fff][^<>]*/g)?.join(" | "),
  );
}
function state(a) {
  return a.run(
    "JSON.stringify({life,step,stats,log,pending,paused,records,view})",
  );
}
test("all catalog and event text has English translations without changing canonical data", () => {
  const before = JSON.stringify(data);
  function visit(v) {
    if (typeof v === "string" && han.test(v))
      assert(!han.test(i18n.translateText(v, "en")), v);
    else if (v && typeof v === "object") Object.values(v).forEach(visit);
  }
  visit({ eras: data.eras, stories: stories.coreStories });
  assert.equal(JSON.stringify(data), before);
});
test("every life and route renders in English through four chapters, results, collection and about", () => {
  for (let ei = 0; ei < 8; ei++)
    for (let si = 0; si < 3; si++) {
      const a = app();
      a.run("setLanguage('en')");
      assertEnglish(a.node("#app").innerHTML);
      a.run(
        `start('${data.eras[ei].id}');life={era:eras[${ei}],index:${si},species:eras[${ei}].species[${si}],key:'${data.eras[ei].id}-${si}'};renderLife()`,
      );
      assertEnglish(a.node("#app").innerHTML);
      a.node("#enter").onclick();
      for (let chapter = 0; chapter < 4; chapter++) {
        assertEnglish(a.node("#app").innerHTML);
        a.run(`makeChoice(${(chapter + si) % 2})`);
        assertEnglish(a.node("#aftermath").innerHTML);
        a.node("#continue").onclick();
      }
      assertEnglish(a.node("#app").innerHTML);
      assert(a.node("#app").innerHTML.includes("Another world awaits."));
      assert(a.node("#app").innerHTML.includes("Explore K’s Hunting Log"));
      assert(a.node("#app").innerHTML.includes("Enter Neo Babylon"));
      a.run("setView('collection')");
      assertEnglish(a.node("#app").innerHTML);
      assertEnglish(a.node("#collectionGrid").innerHTML);
      a.run("setView('about')");
      assertEnglish(a.node("#app").innerHTML);
      assert.equal(a.run("records.length"), 1);
    }
});
test("switching languages preserves reveal, pending choices, pause, results and collection filters", () => {
  const a = app();
  a.node("#eraSelect").value = "jurassic";
  a.run("setLanguage('en')");
  assert.equal(a.node("#eraSelect").value, "jurassic");
  a.run("start('modern')");
  let before = state(a);
  a.run("setLanguage('zh-Hant')");
  assert.equal(state(a), before);
  a.node("#enter").onclick();
  for (let i = 0; i < 4; i++) {
    a.run("makeChoice(0)");
    before = state(a);
    a.run("setLanguage('en')");
    assert.equal(state(a), before);
    assertEnglish(a.node("#aftermath").innerHTML);
    a.run("makeChoice(1)");
    assert.equal(state(a), before);
    a.run("setLanguage('zh-Hant')");
    assert.equal(state(a), before);
    if (i === 2) {
      a.run("lifePaused()");
      before = state(a);
      a.run("setLanguage('en')");
      assert.equal(state(a), before);
      assertEnglish(a.node("resume").innerHTML);
      a.node("resume button").onclick();
      assert.equal(a.run("pending"), true);
    }
    a.node("#continue").onclick();
  }
  before = state(a);
  a.run("setLanguage('zh-Hant');setLanguage('en')");
  assert.equal(state(a), before);
  assert.equal(a.run("records.length"), 1);
  a.run("setView('collection')");
  a.node("#collectionFilter").value = "modern";
  a.run("setLanguage('zh-Hant')");
  assert.equal(a.node("#collectionFilter").value, "modern");
  assert(!a.node("#collectionGrid").innerHTML.includes("寒武紀"));
});
test("language preference persists independently of completed lives; unfinished life resumes", () => {
  const saved = new Map();
  let a = app(saved);
  assert.equal(a.run("language"), "zh-Hant");
  a.run("setLanguage('en');start('modern')");
  assert.equal(saved.get("earthlife-language"), "en");
  assert(saved.has("earthlife-save"));
  a = app(saved);
  assert.equal(a.run("language"), "en");
  assert.equal(a.run("life"), null);
  assert(a.run("paused"));
  assertEnglish(a.node("#app").innerHTML);
  a.run("start('modern');step=0;renderLife()");
  for (let i = 0; i < 4; i++) {
    a.run("makeChoice(0)");
    a.node("#continue").onclick();
  }
  a = app(saved);
  assert.equal(a.run("records.length"), 1);
  a.run("setLanguage('zh-Hant')");
  assert.equal(a.run("records.length"), 1);
  assert.equal(saved.get("earthlife-language"), "zh-Hant");
  assert.equal(JSON.parse(saved.get("earthlife-save")).records.length, 1);
});
test("both languages work when browser storage is unavailable", () => {
  const a = app(new Map(), false);
  a.run("setLanguage('en');start('modern');step=0;renderLife()");
  for (let i = 0; i < 4; i++) {
    a.run("makeChoice(0)");
    a.node("#continue").onclick();
  }
  assertEnglish(a.node("#app").innerHTML);
  assert(a.node("#app").innerHTML.includes("Storage is unavailable"));
  a.run("setView('collection')");
  assertEnglish(a.node("#app").innerHTML);
  a.run("setLanguage('zh-Hant')");
  assert(a.node("#app").innerHTML.includes("此瀏覽器目前無法持久儲存"));
});
test("localization preserves link destinations and language-independent HTML attributes", () => {
  const original =
    '<a href="https://neobabylon.icareu.tw/" target="_blank" rel="noopener noreferrer" aria-label="走進《新巴比倫》">走進《新巴比倫》</a>';
  const en = i18n.translateMarkup(original, "en");
  assert(en.includes('href="https://neobabylon.icareu.tw/"'));
  assert(en.includes('target="_blank" rel="noopener noreferrer"'));
  assert(en.includes('aria-label="Enter Neo Babylon"'));
  assert.equal(i18n.translateMarkup(original, "zh-Hant"), original);
});

test("unfinished pending choice restores and settles once after reload", () => {
  const saved = new Map();
  let a = app(saved);
  a.run("start('modern');step=0;renderLife();makeChoice(1)");
  const expected = a.run("JSON.stringify({stats,log,run})");
  a = app(saved);
  assert(a.run("paused.pending"));
  a.node("resume button").onclick();
  assert.equal(a.run("JSON.stringify({stats,log,run})"), expected);
  a.run("makeChoice(0)");
  assert.equal(a.run("log.length"), 1);
  a.node("#continue").onclick();
  assert.equal(a.run("step"), 1);
  assert.equal(a.run("run.choices.length"), 1);
});

test("repeated stale continue handlers never advance or save twice", () => {
  const a = app();
  a.run("start('modern');step=0;renderLife();makeChoice(0)");
  const stale = a.node("#continue").onclick;
  stale();
  stale();
  assert.equal(a.run("step"), 1);
  assert.equal(a.run("records.length"), 0);
});

test("resuming own save after viewing a shared result restores own run and allows choices", () => {
  const a = app();
  a.run(
    "beginRun({key:'cambrian-2',seed:99,choices:[]});step=0;renderLife();lifePaused();run={key:'modern-1',seed:42,choices:[0,1,0,1]};shared=true;life=lifeFor(run.key);step=4;setView('about')",
  );
  a.node("#aboutStart").onclick();
  a.node("resume button").onclick();
  assert.equal(a.run("run.key"), "cambrian-2");
  assert.equal(a.run("run.seed"), 99);
  assert.equal(a.run("shared"), false);
  a.run("makeChoice(0)");
  assert.equal(a.run("pending"), true);
  assert.equal(a.run("run.choices.length"), 1);
});

test("pending route and music language changes preserve the current journey", () => {
  const saved = new Map();
  let a = app(saved);
  a.run(
    "beginRun({key:'cambrian-0',seed:42,choices:[],});step=0;renderLife();makeChoice(1)",
  );
  const old = a.run("JSON.stringify({run,log,stats})");
  a = app(saved);
  a.node("resume button").onclick();
  assert.equal(a.run("JSON.stringify({run,log,stats})"), old);
  a.run("setLanguage('en')");
  assert.equal(a.node("#musicToggle").textContent, "Music: off");
  assert.equal(a.run("JSON.stringify({run,log,stats})"), old);
});
