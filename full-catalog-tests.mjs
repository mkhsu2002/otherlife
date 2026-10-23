import test from "node:test";
import assert from "node:assert/strict";
import * as engine from "./dist/engine.js";
test("one current story model powers fresh runs and sharing", () => {
  const run = engine.freshRun("modern");
  assert.deepEqual(Object.keys(run).sort(), ["choices", "key", "seed"]);
  const result = { key: "modern-0", seed: 42, choices: [0, 1, 0, 1] };
  assert.deepEqual(engine.parseRun(engine.encodeRun(result)).run, result);
  assert.equal(engine.parseRun("#r=unknown.modern-0.42.0101.en"), null);
  assert.equal(
    engine.replay(result).log[0].event,
    engine.eventFor(result.key, 0, [], result.seed)[0],
  );
});
let music;
try {
  music = await import("./dist/music.js");
} catch {}
test("ambient score is slow, bounded and deterministic", () => {
  assert(music, "ambient music module must exist");
  const a = music.ambientScore();
  assert.deepEqual(a, music.ambientScore());
  assert(a.duration >= 60);
  assert(a.notes.length > 30);
  assert(
    a.notes.every(
      (n) =>
        n.time >= 0 &&
        n.time + n.duration <= a.duration &&
        n.frequency >= 65 &&
        n.frequency <= 1000 &&
        n.gain > 0 &&
        n.gain < 0.12,
    ),
  );
});

test("all 72 current lives have eight reachable localized events, three endings and scoped sources", async () => {
  const { allStories } = await import("./dist/stories-all.js"),
    { sources } = await import("./dist/knowledge.js"),
    { translateText } = await import("./dist/i18n.js");
  assert.equal(Object.keys(allStories).length, 72);
  assert.equal(Object.keys(sources).length, 72);
  const visit = (value) => {
    if (typeof value === "string")
      assert(!/\p{Script=Han}/u.test(translateText(value, "en")), value);
    else if (value && typeof value === "object")
      Object.values(value).forEach(visit);
  };
  visit(allStories);
  visit(engine.catalog);
  for (const key of Object.keys(allStories)) {
    const seen = new Set(),
      endings = new Set();
    for (const seed of [42, 43])
      for (let mask = 0; mask < 16; mask++) {
        const run = {
            key,
            seed,

            choices: Array.from({ length: 4 }, (_, i) => (mask >> i) & 1),
          },
          result = engine.replay(run);
        endings.add(result.title);
        for (let chapter = 0; chapter < 4; chapter++) {
          const event = engine.eventFor(key, chapter, run.choices, seed, 3);
          seen.add(event[0]);
          assert.equal(event[2].length, 2);
          for (const choice of event[2]) {
            assert.equal(choice[2].length, 3);
            assert(choice[2].every(Number.isFinite));
          }
        }
        assert.deepEqual(
          engine.replay(engine.parseRun(engine.encodeRun(run)).run),
          result,
        );
      }
    assert.equal(seen.size, 8, key);
    assert.equal(endings.size, 3, key);
    assert.equal(new URL(sources[key].url).protocol, "https:");
    assert(sources[key].scope.length > 5);
    assert(sources[key].checked);
    assert(!/\p{Script=Han}/u.test(translateText(sources[key].name, "en")), `${key}: source title needs English`);
  }
});

test("backups reject a pending choice before the first chapter", async () => {
  const { activeOK, importState } = await import("./dist/storage.js");
  const active = {
    run: { key: "modern-0", seed: 42, choices: [] },
    step: -1,
    pending: true,
  };
  assert.equal(activeOK(active), false);
  assert.throws(() =>
    importState(
      JSON.stringify({
        format: "earthlife",
        records: [],
        unlocked: [],
        active,
      }),
    ),
  );
});

test("a complete 72-life atlas round-trips through a backup", async () => {
  const { importState } = await import("./dist/storage.js");
  assert.equal(engine.lifeKeys.length, 72);
  const imported = importState(
    JSON.stringify({
      format: "earthlife",
      records: [],
      unlocked: engine.lifeKeys,
      active: null,
    }),
  );
  assert.deepEqual(imported.unlocked, engine.lifeKeys);
});

test("new life decisions offer a stat tradeoff rather than a dominating option", async () => {
  const { allStories } = await import("./dist/stories-all.js");
  const signatures = new Set();
  let count = 0;
  for (const [key, story] of Object.entries(allStories)) {
    if (Number(key.split("-")[1]) < 3) continue;
    count++;
    for (const event of story.chapters.flat()) {
      const [a, b] = event[2].map((choice) => choice[2]);
      assert(
        a.some((value, i) => value > b[i]) &&
          a.some((value, i) => value < b[i]),
        `${key}: ${event[0]} must offer a real tradeoff`,
      );
      signatures.add(JSON.stringify([a, b]));
    }
  }
  assert.equal(count, 48);
  assert(
    signatures.size >= 24,
    "different ecological decisions must use varied effects",
  );
});
