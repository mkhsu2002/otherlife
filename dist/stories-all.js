import * as expansionEarly from "./expansion-early.js?rev=otherlife72";
import * as expansionMiddle from "./expansion-middle.js?rev=otherlife72";
import * as expansionRecent from "./expansion-recent.js?rev=otherlife72";
import { coreStories, storyEnglish } from "./stories.js?rev=otherlife72";
import {
  stories as early,
  translations as earlyEnglish,
  sources as earlySources,
  profiles as earlyProfiles,
} from "./stories-early.js?rev=otherlife72";
import {
  stories as middle,
  translations as middleEnglish,
  sources as middleSources,
  profiles as middleProfiles,
} from "./stories-middle.js?rev=otherlife72";
import {
  stories as recent,
  translations as recentEnglish,
  sources as recentSources,
  profiles as recentProfiles,
} from "./stories-recent.js?rev=otherlife72";
export const allStories = {
  ...coreStories,
  ...early,
  ...middle,
  ...recent,
  ...expansionEarly.stories,
  ...expansionMiddle.stories,
  ...expansionRecent.stories,
};
export const allStoryEnglish = {
  ...storyEnglish,
  ...earlyEnglish,
  ...middleEnglish,
  ...recentEnglish,
  ...expansionEarly.translations,
  ...expansionMiddle.translations,
  ...expansionRecent.translations,
};
export const newSources = {
  ...earlySources,
  ...middleSources,
  ...recentSources,
  ...expansionEarly.sources,
  ...expansionMiddle.sources,
  ...expansionRecent.sources,
};
export const profiles = {
  ...earlyProfiles,
  ...middleProfiles,
  ...recentProfiles,
  ...expansionEarly.profiles,
  ...expansionMiddle.profiles,
  ...expansionRecent.profiles,
};
