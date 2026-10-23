import { coreStories, storyEnglish } from "./stories.js?rev=sharecard";
import {
  stories as early,
  translations as earlyEnglish,
  sources as earlySources,
  profiles as earlyProfiles,
} from "./stories-early.js?rev=sharecard";
import {
  stories as middle,
  translations as middleEnglish,
  sources as middleSources,
  profiles as middleProfiles,
} from "./stories-middle.js?rev=sharecard";
import {
  stories as recent,
  translations as recentEnglish,
  sources as recentSources,
  profiles as recentProfiles,
} from "./stories-recent.js?rev=sharecard";
export const allStories = { ...coreStories, ...early, ...middle, ...recent };
export const allStoryEnglish = {
  ...storyEnglish,
  ...earlyEnglish,
  ...middleEnglish,
  ...recentEnglish,
};
export const newSources = {
  ...earlySources,
  ...middleSources,
  ...recentSources,
};
export const profiles = {
  ...earlyProfiles,
  ...middleProfiles,
  ...recentProfiles,
};
