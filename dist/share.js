import { lifeFor, encodeRun } from "./engine.js";
import { translateText } from "./i18n.js";
export function shareURL(run, language, kind = "r") {
  return new URL(
    "/" + encodeRun(run, kind, language),
    "https://otherlife.icareu.tw",
  ).href;
}
export function shareText(run, title, language) {
  const life = lifeFor(run.key);
  const t = (s) => translateText(s, language);
  return language === "en"
    ? `I became ${t(life.species[0])} in Earthlife Atlas — ${t(title)}. What story will you live?`
    : `我在地球轉生所成為${life.species[0]}，留下「${title}」的故事。你會走出怎樣的一生？`;
}
export function socialLinks(url, text) {
  return {
    LINE:
      "https://social-plugins.line.me/lineit/share?url=" +
      encodeURIComponent(url) +
      "&text=" +
      encodeURIComponent(text),
    Facebook:
      "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url),
    X:
      "https://twitter.com/intent/tweet?url=" +
      encodeURIComponent(url) +
      "&text=" +
      encodeURIComponent(text),
  };
}
export function wrapLines(context, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const char of text) {
    if (
      char === "\n" ||
      (line && context.measureText(line + char).width > maxWidth)
    ) {
      lines.push(line);
      line = char === "\n" ? "" : char;
    } else line += char;
  }
  if (line) lines.push(line);
  return lines;
}
export async function resultImage(run, result, language, portrait = false) {
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = portrait ? 1920 : 1350;
  const c = canvas.getContext("2d");
  if (!c) throw Error("Canvas unavailable");
  const t = (s) => translateText(s, language),
    l = lifeFor(run.key);
  c.fillStyle = "#f5f6ef";
  c.fillRect(0, 0, 1080, canvas.height);
  c.fillStyle = l.era.color;
  c.beginPath();
  c.arc(890, 210, 340, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#264c43";
  c.font = "500 30px system-ui";
  c.fillText("EARTHLIFE ATLAS", 80, 110);
  let y = portrait ? 340 : 250;
  const draw = (text, font, color = "#264c43", gap = 65) => {
    c.font = font;
    c.fillStyle = color;
    for (const line of wrapLines(c, text, 920)) {
      c.fillText(line, 80, y);
      y += gap;
    }
    y += 25;
  };
  draw(t(l.species[0]), "bold 72px system-ui");
  draw(
    t(l.era.name) + " · " + t(l.species[3]),
    "32px system-ui",
    "#527168",
    48,
  );
  draw(t(result.title), "bold 44px system-ui", "#264c43", 58);
  draw(
    language === "en" ? "The traces I left behind" : "我留下的足跡",
    "28px system-ui",
    "#527168",
    40,
  );
  result.log.forEach((row, i) =>
    draw(`${i + 1}. ${t(row.text)}`, "30px system-ui", "#264c43", 42),
  );
  draw(
    result.stats
      .map((n, i) => `${t(["活力", "連結", "探索"][i])} ${n}`)
      .join("   "),
    "27px system-ui",
    "#527168",
    40,
  );
  c.fillStyle = "#264c43";
  c.font = "bold 30px system-ui";
  c.fillText(
    language === "en" ? "Who will you become?" : "下一次，你會成為誰？",
    80,
    canvas.height - 145,
  );
  c.font = "26px system-ui";
  c.fillText("otherlife.icareu.tw", 80, canvas.height - 95);
  c.font = "20px system-ui";
  c.fillText(
    language === "en"
      ? "An imagined journey. Stats are narrative indicators."
      : "一場想像旅程，數值為敘事指標。",
    80,
    canvas.height - 52,
  );
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(Error("Image unavailable"))),
      "image/png",
    ),
  );
}
export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
