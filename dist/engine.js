import { eras, events, resolveStats, chooseLife } from "./data.js";
import { pilots } from "./stories.js";
export const RULE_VERSION = 2;
export const pilotKeys = Object.keys(pilots);
export function lifeFor(key) {
  for (const era of eras) {
    const index = era.species.findIndex((_, i) => key === `${era.id}-${i}`);
    if (index >= 0) return { era, index, species: era.species[index], key };
  }
  return null;
}
export function validRun(run) {
  return !!(
    run &&
    lifeFor(run.key) &&
    Number.isInteger(run.seed) &&
    run.seed > 0 &&
    run.seed <= 4294967295 &&
    Array.isArray(run.choices) &&
    run.choices.length <= 4 &&
    run.choices.every((n) => n === 0 || n === 1)
  );
}
export function seeded(seed) {
  let n = seed >>> 0;
  return () => {
    n = (n + 0x6d2b79f5) >>> 0;
    let x = n;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
export function eventFor(key, step, choices = [], seed = 1) {
  const l = lifeFor(key);
  if (!l || step < 0 || step > 3) throw Error("Invalid chapter");
  return (
    pilots[key]?.chapters[step][
      step === 0 ? seed % 2 : choices[step - 1] || 0
    ] || (events[l.species[4]] || events.animal)[step]
  );
}
export function endingFor(key, choices, stats) {
  const pilot = pilots[key];
  if (pilot) {
    const bold = choices.reduce((a, b) => a + b, 0);
    return pilot.endings[bold <= 1 ? 0 : bold >= 3 ? 2 : 1];
  }
  if (Math.max(...stats) - Math.min(...stats) <= 12) return "在變動中找到平衡";
  return ["安穩的守護者", "溫柔的連結者", "勇敢的探索者"][
    stats.indexOf(Math.max(...stats))
  ];
}
export function replay(run) {
  if (!validRun(run)) throw Error("Invalid journey");
  const random = seeded(run.seed);
  let stats = [60, 45, 35],
    log = [];
  run.choices.forEach((choice, step) => {
    const event = eventFor(run.key, step, run.choices, run.seed),
      c = event[2][choice],
      previous = stats;
    stats = resolveStats(stats, c[2], random);
    log.push({
      text: c[0],
      delta: stats.map((x, i) => x - previous[i]),
      event: event[0],
      after: event[3]?.[choice] || c[1],
    });
  });
  return { stats, log, title: endingFor(run.key, run.choices, stats) };
}
export function encodeRun(run, kind = "r", language = "zh-Hant") {
  if (
    !validRun(run) ||
    !["r", "c"].includes(kind) ||
    (kind === "r" && run.choices.length !== 4)
  )
    throw Error("Invalid share");
  return `#${kind}=2.${run.key}.${run.seed}.${kind === "r" ? run.choices.join("") + "." : ""}${language === "en" ? "en" : "zh-Hant"}`;
}
export function parseRun(hash) {
  if (typeof hash !== "string" || hash.length > 150) return null;
  const m =
    /^#([rc])=2\.([a-z]+-\d)\.([1-9]\d{0,9})\.(?:(\d{4})\.)?(en|zh-Hant)$/.exec(
      hash,
    );
  if (!m || (m[1] === "r") !== !!m[4]) return null;
  const run = {
    key: m[2],
    seed: Number(m[3]),
    choices: m[4] ? [...m[4]].map(Number) : [],
  };
  return validRun(run) ? { kind: m[1], run, language: m[5] } : null;
}
export function dailyRun(date) {
  let seed = 2166136261;
  for (const c of "earthlife-v2-" + date)
    seed = Math.imul(seed ^ c.charCodeAt(0), 16777619) >>> 0;
  seed = seed || 1;
  const key = pilotKeys[Math.floor(seeded(seed)() * pilotKeys.length)];
  return { key, seed, choices: [] };
}
export function freshRun(filter = "all") {
  const seed = (Math.floor(Math.random() * 4294967295) + 1) >>> 0;
  return {
    key: chooseLife(filter, seeded(seed)).key,
    seed: seed || 1,
    choices: [],
  };
}
