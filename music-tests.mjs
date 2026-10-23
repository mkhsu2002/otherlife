import test from "node:test";
import assert from "node:assert/strict";
import { ambientScore, createMusicController } from "./dist/music.js";
function setup() {
  const handlers = new Map(),
    jobs = new Map();
  let next = 1,
    contexts = 0,
    starts = 0,
    stops = 0;
  const node = () => ({
    gain: {
      value: 0,
      setValueAtTime() {},
      linearRampToValueAtTime() {},
      exponentialRampToValueAtTime() {},
      setTargetAtTime() {},
    },
    frequency: { value: 0 },
    delayTime: { value: 0 },
    connect() {},
    disconnect() {},
    start() {
      starts++;
    },
    stop() {
      stops++;
    },
  });
  class Context {
    constructor() {
      contexts++;
      this.state = "suspended";
      this.currentTime = 0;
      this.destination = node();
    }
    createGain() {
      return node();
    }
    createOscillator() {
      return node();
    }
    createBiquadFilter() {
      return node();
    }
    createDelay() {
      return node();
    }
    async resume() {
      this.state = "running";
    }
    async suspend() {
      this.state = "suspended";
    }
    async close() {
      this.state = "closed";
    }
  }
  const doc = {
    hidden: false,
    addEventListener: (k, f) => handlers.set(k, f),
    removeEventListener: (k) => handlers.delete(k),
  };
  const controller = createMusicController({
    AudioContextClass: Context,
    document: doc,
    timers: {
      setTimeout: (f) => {
        jobs.set(next, f);
        return next++;
      },
      clearTimeout: (id) => jobs.delete(id),
    },
  });
  return {
    controller,
    doc,
    handlers,
    jobs,
    counts: () => ({ contexts, starts, stops }),
  };
}
test("music stays off until requested, and repeated starts use one context and one scheduler", async () => {
  const a = setup();
  assert.equal(a.counts().contexts, 0);
  assert.equal(a.controller.state().enabled, false);
  await a.controller.setEnabled(true);
  await a.controller.setEnabled(true);
  assert.equal(a.counts().contexts, 1);
  assert.equal(a.jobs.size, 1);
  assert.equal(a.controller.state().playing, true);
  await a.controller.setEnabled(false);
  assert.equal(a.jobs.size, 0);
  assert.equal(a.controller.state().playing, false);
  assert(a.counts().stops > 0);
  await a.controller.destroy();
  assert.equal(a.handlers.size, 0);
});
test("background suspension preserves player choice and volume stays bounded", async () => {
  const a = setup();
  await a.controller.setEnabled(true);
  a.doc.hidden = true;
  await a.handlers.get("visibilitychange")();
  assert.equal(a.jobs.size, 0);
  assert.equal(a.controller.state().enabled, true);
  assert.equal(a.controller.state().playing, false);
  a.doc.hidden = false;
  await a.handlers.get("visibilitychange")();
  assert.equal(a.jobs.size, 1);
  assert.equal(a.controller.state().playing, true);
  a.controller.setVolume(5);
  assert.equal(a.controller.state().volume, 1);
  a.controller.setVolume(-1);
  assert.equal(a.controller.state().volume, 0);
  a.controller.setVolume(NaN);
  assert.equal(a.controller.state().volume, 0);
  await a.controller.destroy();
});
test("unsupported audio fails without leaving playback enabled", async () => {
  const controller = createMusicController({
    AudioContextClass: null,
    document: {
      hidden: false,
      addEventListener() {},
      removeEventListener() {},
    },
  });
  await assert.rejects(controller.setEnabled(true));
  assert.equal(controller.state().enabled, false);
});
test("score contains gentle bounded sustained notes", () => {
  const score = ambientScore();
  assert.equal(score.notes.length, 64);
  assert.equal(score.duration, 72);
  assert(
    score.notes.every(
      (n) =>
        n.time + n.duration <= score.duration &&
        n.gain < 0.1 &&
        n.duration >= 3,
    ),
  );
});

test("sparse melody uses only the calm C-major pentatonic pitch classes", () => {
  const allowed = new Set([0, 2, 4, 7, 9]);
  for (const n of ambientScore().notes.filter((n) => n.type === "triangle")) {
    const midi = Math.round(69 + 12 * Math.log2(n.frequency / 440));
    assert(allowed.has(midi % 12));
  }
});
