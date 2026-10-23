import { eras, resolveStats, chooseLife } from "./data.js?rev=launch";
import { allStories, profiles } from "./stories-all.js?rev=launch";
export const lifeKeys = Object.keys(allStories);
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
export function lifeFor(key) {
  let base = null;
  for (const era of eras) {
    const index = era.species.findIndex((_, i) => key === `${era.id}-${i}`);
    if (index >= 0) {
      base = { era, index, species: era.species[index], key };
      break;
    }
  }
  if (!base) return null;
  const profile = profiles[key] || {};
  const species = [...base.species];
  if (key === "cretaceous-2") species[1] = "✦";
  if (profile.habitat) species[2] = profile.habitat;
  if (profile.location) species[3] = profile.location;
  if (profile.intro) species[5] = profile.intro;
  return {
    ...base,
    era: { ...base.era, time: allStories[key]?.time || base.era.time },
    species,
  };
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
export function eventFor(key, step, choices = [], seed = 1) {
  if (!lifeFor(key) || !Number.isInteger(step) || step < 0 || step > 3)
    throw Error("Invalid chapter");
  return allStories[key].chapters[step][
    step === 0 ? seed % 2 : choices[step - 1] || 0
  ];
}
export function endingFor(key, choices, stats) {
  const bold = choices.reduce((a, b) => a + b, 0);
  return allStories[key].endings[bold <= 1 ? 0 : bold >= 3 ? 2 : 1];
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
      after: event[3][choice],
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
  return `#${kind}=${run.key}.${run.seed}.${kind === "r" ? run.choices.join("") + "." : ""}${language === "en" ? "en" : "zh-Hant"}`;
}
export function parseRun(hash) {
  if (typeof hash !== "string" || hash.length > 150) return null;
  const m =
    /^#([rc])=([a-z]+-\d)\.([1-9]\d{0,9})\.(?:(\d{4})\.)?(en|zh-Hant)$/.exec(
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
  for (const c of "earthlife-daily-" + date)
    seed = Math.imul(seed ^ c.charCodeAt(0), 16777619) >>> 0;
  seed = seed || 1;
  return {
    key: lifeKeys[Math.floor(seeded(seed)() * lifeKeys.length)],
    seed,
    choices: [],
  };
}
export function freshRun(filter = "all") {
  const seed = (Math.floor(Math.random() * 4294967295) + 1) >>> 0;
  return {
    key: chooseLife(filter, seeded(seed)).key,
    seed: seed || 1,
    choices: [],
  };
}

const eraTimes = {
  carboniferous: "約 3.26 億至 3 億年前",
  jurassic: "約 1.99 億至 1.45 億年前",
  cretaceous: "約 7,200 萬至 6,600 萬年前",
  iceage: "約 3 萬至 2 萬年前",
};
export const catalog = eras.map((era) => ({
  ...era,
  time: eraTimes[era.id] || era.time,
  species: era.species.map((_, i) => lifeFor(`${era.id}-${i}`).species),
}));
export { catalog as eras };
