import test from "node:test";
import assert from "node:assert/strict";
import { eras, chooseLife, resolveStats } from "./dist/data.js";
import { allStories } from "./dist/stories-all.js";
test("catalog contains eight unique eras and 24 coherent entries", () => {
  assert.equal(eras.length, 8);
  assert.equal(new Set(eras.map((e) => e.id)).size, 8);
  assert.equal(
    eras.reduce((n, e) => n + e.species.length, 0),
    24,
  );
  for (const e of eras) {
    assert.equal(e.species.length, 3);
    for (const s of e.species) {
      assert.equal(s.length, 6);
      assert(s.every((x) => typeof x === "string" && x.length));
    }
  }
});
test("all era and species endpoints reachable", () => {
  for (let ei = 0; ei < 8; ei++)
    for (let si = 0; si < 3; si++) {
      let values = [(ei + 0.5) / 8, (si + 0.5) / 3];
      let life = chooseLife("all", () => values.shift());
      assert.equal(life.era.id, eras[ei].id);
      assert.equal(life.index, si);
    }
});
test("era filters always respected", () => {
  for (const e of eras)
    for (let i = 0; i < 100; i++) assert.equal(chooseLife(e.id).era.id, e.id);
});
test("all event routes have four chapters and two well-formed choices", () => {
  for (const story of Object.values(allStories)) {
    assert.equal(story.chapters.length, 4);
    for (const event of story.chapters.flat()) {
      assert.equal(event[2].length, 2);
      for (const choice of event[2]) {
        assert.equal(choice[2].length, 3);
        assert(choice[2].every(Number.isFinite));
      }
    }
  }
});
test("10000 simulations preserve stat bounds without mutating previous state", () => {
  for (let i = 0; i < 10000; i++) {
    let initial = [60, 45, 35],
      s = initial;
    for (let j = 0; j < 4; j++) {
      s = resolveStats(
        s,
        allStories[Object.keys(allStories)[i % 24]].chapters[j][i % 2][2][
          i % 2
        ][2],
      );
      assert(s.every((n) => Number.isInteger(n) && n >= 0 && n <= 100));
    }
    assert.deepEqual(initial, [60, 45, 35]);
  }
});
test("random integer offsets and clamping are exact", () => {
  assert.deepEqual(
    resolveStats([50, 50, 50], [0, 0, 0], () => 0),
    [46, 46, 46],
  );
  assert.deepEqual(
    resolveStats([50, 50, 50], [0, 0, 0], () => 0.99999),
    [54, 54, 54],
  );
  assert.deepEqual(
    resolveStats([0, 100, 50], [-30, 30, 0], () => 0.5),
    [0, 100, 50],
  );
});
