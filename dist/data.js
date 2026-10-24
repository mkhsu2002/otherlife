import {catalogWorlds} from './stories-all.js?rev=familiar72';
export const eras=catalogWorlds;
export function chooseLife(filter = "all", random = Math.random) {
  let pool = eras.filter((e) => filter === "all" || e.id === filter);
  let era = pool[Math.floor(random() * pool.length)];
  let index = Math.floor(random() * era.species.length);
  return { era, index, species: era.species[index], key: `${era.id}-${index}` };
}
export function resolveStats(stats, effects, random = Math.random) {
  return stats.map((s, i) =>
    Math.max(0, Math.min(100, s + effects[i] + Math.floor(random() * 9) - 4)),
  );
}
