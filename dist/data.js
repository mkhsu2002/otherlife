import { additions as earlyAdditions } from "./expansion-early.js?rev=otherlife72";
import { additions as middleAdditions } from "./expansion-middle.js?rev=otherlife72";
import { additions as recentAdditions } from "./expansion-recent.js?rev=otherlife72";
// A curated fictional life simulator, not a model of biological probability.
export const eras = [
  {
    id: "cambrian",
    name: "寒武紀",
    time: "約 5.2 億至 5 億年前",
    short: "古生代",
    habitat: "海洋",
    color: "#b5e8ef",
    fact: "海洋裡出現了許多不同身體構造的動物；陸地還不是動物的家。",
    species: [
      [
        "三葉蟲",
        "✦",
        "古海洋淺海",
        "今天的中國雲南附近",
        "底棲",
        "在柔軟的海床上，你用觸角讀取水流的訊息。",
      ],
      [
        "奇蝦類",
        "🦐",
        "古海洋大陸棚",
        "今天的加拿大西部附近",
        "游泳",
        "陽光穿過水面，你展開兩側的游泳葉，滑入古老海洋。",
      ],
      [
        "海綿",
        "🧽",
        "古海洋礁區",
        "今天的中國華南附近",
        "固著",
        "你附著在海底，讓流經身體的海水帶來食物。",
      ],
    ],
  },
  {
    id: "carboniferous",
    name: "石炭紀",
    time: "約 3 億年前",
    short: "古生代",
    habitat: "森林",
    color: "#bddbc2",
    fact: "溫暖潮濕的沼澤森林廣布；許多植物殘骸後來形成煤層。",
    species: [
      [
        "巨脈蜻蜓類",
        "✦",
        "赤道沼澤森林",
        "今天的歐洲附近",
        "飛行",
        "蕨類與高大的石松植物之間，你舒展翅膀。",
      ],
      [
        "節胸蟲",
        "✦",
        "潮濕森林地表",
        "今天的北美洲附近",
        "陸地",
        "厚厚的落葉像一片世界，你的許多腳依序向前。",
      ],
      [
        "樹蕨",
        "🌿",
        "熱帶濕地",
        "今天的歐洲附近",
        "植物",
        "你從陰濕的土壤展開新葉，努力接住林間的光。",
      ],
    ],
  },
  {
    id: "jurassic",
    name: "侏羅紀",
    time: "約 1.5 億年前",
    short: "中生代",
    habitat: "森林",
    color: "#d1e6ae",
    fact: "恐龍在陸地上繁盛，海洋有大型爬行動物，早期鳥類也已出現。",
    species: [
      [
        "腕龍",
        "🦕",
        "河漫灘林地",
        "今天的北美洲附近",
        "陸地",
        "高大的針葉樹遮住天空；你追隨群體留下的足跡。",
      ],
      [
        "始祖鳥",
        "🪶",
        "海島林地",
        "今天的德國附近",
        "飛行",
        "你踩住低矮樹枝，在島嶼森林裡試探風的方向。",
      ],
      [
        "菊石",
        "🐚",
        "溫暖淺海",
        "今天的歐洲附近",
        "游泳",
        "螺旋的殼是你隨身的家，潮流帶你越過海底。",
      ],
    ],
  },
  {
    id: "cretaceous",
    name: "白堊紀晚期",
    time: "約 6,700 萬年前",
    short: "中生代",
    habitat: "大地",
    color: "#e2dfae",
    fact: "開花植物逐漸多樣化，陸地上仍有眾多非鳥恐龍。",
    species: [
      [
        "三角龍",
        "✦",
        "沿海平原",
        "今天的北美洲附近",
        "陸地",
        "你穿過灌木，額上的角還沒有長得很大。",
      ],
      [
        "滄龍類",
        "✦",
        "內陸海",
        "今天的北美洲附近",
        "游泳",
        "你浮出海面呼吸，再潛入溫暖的水下世界。",
      ],
      [
        "早期有袋類親緣哺乳動物",
        "🐁",
        "森林地表",
        "今天的北美洲附近",
        "陸地",
        "夜晚是你的保護色，小小的身體鑽入落葉的縫隙。",
      ],
    ],
  },
  {
    id: "iceage",
    name: "更新世冰期",
    time: "約 2 萬年前",
    short: "新生代",
    habitat: "草原",
    color: "#c9e4e7",
    fact: "冰期的環境並不處處冰封；草原、森林與熱帶生態系同時存在。",
    species: [
      [
        "長毛象",
        "🦣",
        "寒冷草原",
        "今天的西伯利亞附近",
        "陸地",
        "冷風梳過長毛，你緊緊跟著象群尋找草地。",
      ],
      [
        "洞穴獅",
        "🦁",
        "開闊草原",
        "今天的歐洲附近",
        "陸地",
        "你在晨霜裡甦醒，草原上的腳印指向遠處。",
      ],
      [
        "智人",
        "🧑",
        "河谷營地",
        "今天的東非附近",
        "人類",
        "火光照亮同伴的臉；故事、工具與合作支撐著生活。",
      ],
    ],
  },
  {
    id: "ancient",
    name: "古典時代",
    time: "約西元 200 年",
    short: "人類歷史",
    habitat: "聚落",
    color: "#ead9b8",
    fact: "人類聚落、農田與野生生物棲地並存；不同地區的生活差異很大。",
    species: [
      [
        "稻農",
        "🧑‍🌾",
        "江南水田",
        "東亞・長江下游",
        "人類",
        "清晨的水田映著天光，季節和水位安排你的日常。",
      ],
      [
        "赤狐",
        "🦊",
        "林地與農田邊緣",
        "歐洲",
        "陸地",
        "你在聚落邊緣停下，空氣裡有陌生又誘人的氣味。",
      ],
      [
        "海龜",
        "🐢",
        "熱帶近岸海域",
        "印度洋",
        "游泳",
        "你越過海草床，岸邊人類的燈火還很稀疏。",
      ],
    ],
  },
  {
    id: "preindustrial",
    name: "前工業時代",
    time: "約西元 1500 年",
    short: "人類歷史",
    habitat: "大地",
    color: "#f0ddb6",
    fact: "跨海交通正在改變世界，但多數生命仍跟著當地水土與季節生活。",
    species: [
      [
        "織工",
        "🧑‍🎨",
        "安地斯山區聚落",
        "南美洲",
        "人類",
        "高地的陽光落在纖維上，一件織物需要耐心與技藝。",
      ],
      [
        "座頭鯨",
        "🐋",
        "遷徙海域",
        "南太平洋",
        "游泳",
        "你聽見遠方的歌聲，跟著季節穿越廣闊海洋。",
      ],
      [
        "非洲象",
        "🐘",
        "稀樹草原",
        "非洲東部",
        "陸地",
        "長輩記得水源的位置，你在塵土和草香裡跟上隊伍。",
      ],
    ],
  },
  {
    id: "modern",
    name: "當代地球",
    time: "西元 2026 年",
    short: "現在",
    habitat: "地球",
    color: "#cae7cf",
    fact: "人類活動影響了許多棲地；城市、農田和保護區都可能是生命的家。",
    species: [
      [
        "城市居民",
        "🧑‍💻",
        "海港城市",
        "東亞・臺北",
        "人類",
        "窗外的城市開始運轉。你也將決定如何分配自己的時間。",
      ],
      [
        "帝王企鵝",
        "🐧",
        "南極海冰",
        "南極洲",
        "陸地",
        "你站在冰與海之間，鄰居的呼聲在寒風裡此起彼落。",
      ],
      [
        "紅樹",
        "🌱",
        "潮間帶濕地",
        "東南亞",
        "植物",
        "鹽水漲退之間，你的根讓泥土慢慢安定下來。",
      ],
    ],
  },
];
for (const era of eras) {
  const extra =
    earlyAdditions[era.id] ||
    middleAdditions[era.id] ||
    recentAdditions[era.id] ||
    [];
  era.species.push(...extra);
}
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
