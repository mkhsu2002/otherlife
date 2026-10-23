import { lifeFor, validRun } from "./engine.js?rev=launch";
export const STORAGE_KEY = "earthlife-save";
const recordOK = (r) =>
  r &&
  lifeFor(r.key) &&
  Array.isArray(r.stats) &&
  r.stats.length === 3 &&
  r.stats.every((n) => Number.isFinite(n) && n >= 0 && n <= 100) &&
  Number.isFinite(r.date) &&
  Array.isArray(r.log) &&
  r.log.length <= 4 &&
  r.log.every((x) => typeof x === "string" && x.length < 200) &&
  typeof r.title === "string" &&
  r.title.length < 100;
export function activeOK(a) {
  return !!(
    a &&
    validRun(a.run) &&
    Number.isInteger(a.step) &&
    a.step >= -1 &&
    a.step <= 3 &&
    typeof a.pending === "boolean" &&
    (a.step>=0 || !a.pending) &&
    a.run.choices.length === (a.step < 0 ? 0 : a.step + (a.pending ? 1 : 0))
  );
}
export function normalizeState(raw) {
  const s = raw?.format === "earthlife" ? raw : {};
  const records = (Array.isArray(s.records) ? s.records : [])
    .filter(recordOK)
    .slice(0, 100);
  return {
    format: "earthlife",
    records,
    unlocked: [
      ...new Set(
        [
          ...(Array.isArray(s.unlocked) ? s.unlocked : []),
          ...records.map((r) => r.key),
        ].filter((k) => typeof k === "string" && lifeFor(k)),
      ),
    ],
    active: activeOK(s.active) ? s.active : null,
  };
}
export function addRecord(state, r) {
  if (!recordOK(r)) throw Error("Invalid record");
  return {
    ...state,
    records: [r, ...state.records].slice(0, 100),
    unlocked: [...new Set([...state.unlocked, r.key])],
    active: null,
  };
}
export function importState(text) {
  if (typeof text !== "string" || text.length > 250000)
    throw Error("Backup too large");
  const s = JSON.parse(text);
  if (
    !s ||
    s.format !== "earthlife" ||
    !Array.isArray(s.records) ||
    s.records.length > 100 ||
    !s.records.every(recordOK) ||
    !Array.isArray(s.unlocked) ||
    s.unlocked.length > 24 ||
    !s.unlocked.every((k) => typeof k === "string" && lifeFor(k)) ||
    (s.active !== null && !activeOK(s.active))
  )
    throw Error("Invalid backup");
  return normalizeState(s);
}
