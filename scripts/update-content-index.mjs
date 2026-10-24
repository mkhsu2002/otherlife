import { writeFileSync } from "node:fs";
import { lifeKeys, lifeFor } from "../dist/engine.js";
import { sources, knowledgeFor } from "../dist/knowledge.js";
const cell = (value) =>
  String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const rows = lifeKeys.map((key) => {
  const life = lifeFor(key),
    source = sources[key],
    note = knowledgeFor(key);
  if (!source?.checked || !source.url)
    throw Error(`Missing checked source: ${key}`);
  return `| ${key} | ${cell(life.species[0])} | ${cell(note.time)} | ${cell(life.species[2])} / ${cell(life.species[3])} | [${cell(source.name)}](${source.url}): ${cell(source.scope)} | ${source.checked} |`;
});
writeFileSync(
  new URL("../docs/content-audit.md", import.meta.url),
  `# 內容與來源索引

目前${lifeKeys.length}種生命，每種4章、8個可達事件、3個結局。來源查核日期逐項沿用實際研究紀錄，不因重建索引自動更新。正式發布證據見[發布驗證](release-verification.md)。

本輪熟悉物種與替換故事的研究見research-familiar-worlds.md、research-familiar-overrides.md、research-companions.md。其他沿用故事的較早研究紀錄保留其原始範圍與歷史註記。數值與具體遭遇是原創敘事，不是自然機率或化石逐日紀錄。

| ID | 生命 | 情境時間 | 棲地與地點 | 來源與證據範圍 | 查核日期 |
|---|---|---|---|---|---|
${rows.join("\n")}

## 證據界線

- 同一年代內採各自情境，不宣稱所有生命同時同地存在；地名協助辨識今日位置。
- 未確定的化石食性、群居、育幼與飛行能力不補成定論；推論須與化石直接證據分開。
- 古典／前工業野生動物以一般生態資料支持行為，古代個體、景觀與路線仍屬虛構；不把當代保護區或追蹤航線移植至古代。
- 植物與珊瑚選項是資源分配的比喻，不表示具有人的意識；四章不等於一年。
- 新增生命的兩個選項至少各有一項數值優勢；這是敘事設計，不是實際生存模型。
- 英文涵蓋全部目錄、故事、後果、結局、來源情境、流程提示與公開無障礙文字。
`,
);
console.log(
  `Indexed ${rows.length} lives without changing source-check dates.`,
);
