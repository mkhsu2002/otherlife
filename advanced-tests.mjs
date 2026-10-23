import test from "node:test";
import assert from "node:assert/strict";
let engine;
try {
  engine = await import("./dist/engine.js");
} catch {}
test("result links reproduce every decision and reject malformed input", () => {
  assert(engine, "sharing engine must exist");
  for (const key of [
    "cambrian-2",
    "carboniferous-2",
    "cretaceous-0",
    "iceage-0",
    "ancient-0",
    "modern-1",
  ])
    for (let mask = 0; mask < 16; mask++) {
      const choices = Array.from({ length: 4 }, (_, i) => (mask >> i) & 1),
        run = { key, seed: 12987, choices };
      const hash = engine.encodeRun(run, "r", "en"),
        parsed = engine.parseRun(hash);
      assert.deepEqual(parsed.run, run);
      assert.equal(parsed.language, "en");
      assert.deepEqual(engine.replay(parsed.run), engine.replay(run));
    }
  for (const hash of [
    "#r=<script>",
    "#r=modern-1.-1.0000.en",
    "#r=modern-9.1.0000.en",
    "#r=modern-1.0.0000.en",
    "#r=modern-1.1.0002.en",
    "#r=modern-1.1.000.en",
    "#r=" + "a".repeat(1000),
  ])
    assert.equal(engine.parseRun(hash), null);
});
test("dedicated stories branch, have three reachable endings and deterministic bounded stats", () => {
  assert(engine);
  for (const key of engine.lifeKeys) {
    const titles = new Set();
    for (let mask = 0; mask < 16; mask++) {
      const run = {
        key,

        seed: 42,
        choices: Array.from({ length: 4 }, (_, i) => (mask >> i) & 1),
      };
      const r = engine.replay(run);
      assert.equal(r.log.length, 4);
      assert(r.stats.every((x) => x >= 0 && x <= 100));
      titles.add(r.title);
    }
    assert.equal(titles.size, 3);
    assert.notEqual(
      engine.eventFor(key, 1, [0])[0],
      engine.eventFor(key, 1, [1])[0],
    );
  }
  assert.deepEqual(
    engine.dailyRun("2026-10-23"),
    engine.dailyRun("2026-10-23"),
  );
  assert.notEqual(
    engine.dailyRun("2026-10-23").seed,
    engine.dailyRun("2026-10-24").seed,
  );
});
let storage;
try {
  storage = await import("./dist/storage.js");
} catch {}
test("discoveries persist beyond last 100; corrupt backups cannot replace state", () => {
  assert(storage, "versioned storage must exist");
  const initialRecords = [
    { key: "modern-1", stats: [60, 45, 35], title: "x", date: 1, log: [] },
  ];
  let state = storage.normalizeState({
    format: "earthlife",
    records: initialRecords,
    unlocked: [],
    active: null,
  });
  assert(state.unlocked.includes("modern-1"));
  for (let i = 0; i < 110; i++)
    state = storage.addRecord(state, {
      key: "ancient-0",
      stats: [50, 50, 50],
      title: "x",
      date: 10 + i,
      log: [],
    });
  assert.equal(state.records.length, 100);
  assert(state.unlocked.includes("modern-1"));
  assert.throws(() => storage.importState('{"version":999}'));
  assert.throws(() => storage.importState("x".repeat(300001)));
  assert.deepEqual(storage.importState(JSON.stringify(state)), state);
});

test("all core story text has English coverage and eight reachable events across seeds and routes", async () => {
  const { coreStories } = await import("./dist/stories.js"),
    { translateText } = await import("./dist/i18n.js");
  for (const key of Object.keys(coreStories)) {
    const names = new Set();
    for (const seed of [42, 43])
      for (let mask = 0; mask < 16; mask++) {
        const choices = Array.from({ length: 4 }, (_, i) => (mask >> i) & 1);
        for (let chapter = 0; chapter < 4; chapter++)
          names.add(engine.eventFor(key, chapter, choices, seed)[0]);
      }
    assert.equal(names.size, 8);
    const visit = (x) => {
      if (typeof x === "string")
        assert(!/\p{Script=Han}/u.test(translateText(x, "en")), x);
      else if (x && typeof x === "object") Object.values(x).forEach(visit);
    };
    visit(coreStories[key]);
  }
});

test("backups reject impossible pending chapters and invalid records", () => {
  const base = { format: "earthlife", records: [], unlocked: [], active: null };
  for (const active of [
    {
      run: { key: "modern-1", seed: 1, choices: [0] },
      step: 0,
      pending: false,
    },
    { run: { key: "modern-1", seed: 1, choices: [] }, step: 2, pending: true },
    {
      run: { key: "modern-1", seed: 0, choices: [] },
      step: -1,
      pending: false,
    },
  ])
    assert.throws(() =>
      storage.importState(JSON.stringify({ ...base, active })),
    );
  assert.throws(() =>
    storage.importState(JSON.stringify({ ...base, unlocked: ["fake-0"] })),
  );
  assert.throws(() =>
    storage.importState(
      JSON.stringify({
        ...base,
        records: [{ key: "modern-1", stats: [NaN, 1, 1] }],
      }),
    ),
  );
});

test("share URLs use public origin and encode social text safely", async () => {
  const { shareURL, socialLinks } = await import("./dist/share.js");
  const run = { key: "modern-1", seed: 42, choices: [0, 1, 0, 1] };
  assert.equal(
    shareURL(run, "en"),
    "https://otherlife.icareu.tw/#r=modern-1.42.0101.en",
  );
  assert.deepEqual(
    engine.parseRun(new URL(shareURL(run, "en", "c")).hash).run,
    { ...run, choices: [] },
  );
  for (const href of Object.values(
    socialLinks(shareURL(run, "en"), "&<script>"),
  )) {
    const u = new URL(href);
    assert.equal(u.protocol, "https:");
    assert(!href.includes("<script>"));
  }
});
