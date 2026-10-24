import {allStories,newSources} from './stories-all.js?rev=familiar72';
export const sources=newSources;
export function knowledgeFor(key){const story=allStories[key];return {time:story?.time,note:story?.note,source:sources[key]};}
