import { allStories, newSources } from "./stories-all.js?rev=launch";
const baseSources = {
  "cambrian-2": {
    name: "Smithsonian",
    url: "https://qrius.si.edu/taxonomy/term/11906",
    scope: "feeding",
    checked: "2026-10-23",
  },
  "carboniferous-2": {
    name: "Kew Science",
    url: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30001654-2/general-information",
    scope: "fern spores only; not fossil identity",
    checked: "2026-10-23",
  },
  "cretaceous-0": {
    name: "Natural History Museum",
    url: "https://www.nhm.ac.uk/discover/dino-directory/triceratops.html",
    scope: "taxon, period, diet",
    checked: "2026-10-23",
  },
  "iceage-0": {
    name: "Natural History Museum",
    url: "https://www.nhm.ac.uk/our-science/research/projects/mammoth-evolution-model-species-origins.html",
    scope: "cold open habitat and grass diet",
    checked: "2026-10-23",
  },
  "ancient-0": {
    name: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/essays/han-dynasty-206-b-c-220-a-d",
    scope: "historical period only; agriculture narrative not reconstructed",
    checked: "2026-10-23",
  },
  "modern-1": {
    name: "British Antarctic Survey",
    url: "https://www.bas.ac.uk/news/loss-of-sea-ice-causes-catastrophic-breeding-failure-for-emperor-penguins/",
    scope: "breeding sea ice and seasonal cycle",
    checked: "2026-10-23",
  },
};
export const sources = { ...baseSources, ...newSources };
export function knowledgeFor(key) {
  const stories = allStories;
  return {
    time: stories[key]?.time,
    note:
      stories[key]?.note ||
      "這段情境使用類群層級的簡化設定，行為與事件是想像故事。",
    source: sources[key],
  };
}
