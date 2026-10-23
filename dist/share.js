import { drawShareQR } from "./share-qr.js?rev=otherlife72";
import { lifeFor, encodeRun } from "./engine.js?rev=otherlife72";
import { translateText } from "./i18n.js?rev=otherlife72";
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
    ? `I became ${t(life.species[0])} in OTHER LIFE — ${t(title)}. What story will you live?`
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
let artPromise;
export function loadShareArt() {
  if (!artPromise)
    artPromise = new Promise((resolve, reject) => {
      const image = new Image();
      const timer = setTimeout(() => reject(Error("Artwork timed out")), 8000);
      image.onload = () => {
        clearTimeout(timer);
        resolve(image);
      };
      image.onerror = () => {
        clearTimeout(timer);
        reject(Error("Artwork unavailable"));
      };
      image.src = new URL(
        "./assets/earthlife-share.webp",
        import.meta.url,
      ).href;
    }).catch((error) => {
      artPromise = null;
      throw error;
    });
  return artPromise;
}
function heroArt(c, image, x, y, w, h) {
  c.save();
  c.beginPath();
  c.roundRect(x, y, w, h, 28);
  c.clip();
  if (image) {
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight),
      width = image.naturalWidth * scale,
      height = image.naturalHeight * scale;
    c.drawImage(
      image,
      x + (w - width) / 2,
      y + (h - height) / 2,
      width,
      height,
    );
  } else {
    c.fillStyle = "#dce9dd";
    c.fillRect(x, y, w, h);
    c.fillStyle = "#84bfc2";
    c.beginPath();
    c.arc(x + w / 2, y + h / 2, h * 0.39, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#bdcf8f";
    c.beginPath();
    c.ellipse(
      x + w * 0.47,
      y + h * 0.4,
      w * 0.13,
      h * 0.17,
      -0.3,
      0,
      Math.PI * 2,
    );
    c.fill();
    c.beginPath();
    c.ellipse(
      x + w * 0.55,
      y + h * 0.65,
      w * 0.07,
      h * 0.18,
      0.4,
      0,
      Math.PI * 2,
    );
    c.fill();
  }
  c.restore();
}
export async function resultImage(run, result, language, portrait = false) {
  if (document.fonts?.ready)
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);
  const art = await loadShareArt().catch(() => null),
    canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = portrait ? 1920 : 1350;
  const c = canvas.getContext("2d");
  if (!c) throw Error("Canvas unavailable");
  const t = (s) => translateText(s, language),
    life = lifeFor(run.key),
    height = canvas.height;
  c.fillStyle = "#f5f6ef";
  c.fillRect(0, 0, 1080, height);
  const heroHeight = portrait ? 760 : 440;
  heroArt(c, art, 40, 40, 1000, heroHeight);
  c.fillStyle = "#fffef1e8";
  c.beginPath();
  c.roundRect(64, 62, 370, 54, 20);
  c.fill();
  c.fillStyle = "#264c43";
  c.font = "500 25px system-ui";
  c.fillText("OTHER LIFE", 86, 98);
  const fit = (text, base, min, width = 936) => {
    let size = base;
    do {
      c.font = `bold ${size}px system-ui`;
      if (c.measureText(text).width <= width) break;
      size--;
    } while (size > min);
    return size;
  };
  let y = 40 + heroHeight + 80;
  const name = t(life.species[0]);
  fit(name, 64, 40);
  c.fillText(name, 72, y);
  y += 52;
  c.font = "26px system-ui";
  c.fillStyle = "#527168";
  const meta = wrapLines(
    c,
    t(life.era.name) + " · " + t(life.species[3]),
    936,
  ).slice(0, 2);
  for (const line of meta) {
    c.fillText(line, 74, y);
    y += 34;
  }
  y += 26;
  const title = t(result.title);
  fit(title, 40, 26);
  c.fillStyle = "#264c43";
  c.fillText(title, 72, y);
  y += 74;
  const labels = ["活力", "連結", "探索"];
  result.stats.forEach((value, i) => {
    const x = 74 + i * 316;
    c.font = "24px system-ui";
    c.fillStyle = "#527168";
    c.fillText(t(labels[i]), x, y);
    c.font = "bold 32px system-ui";
    c.fillStyle = "#264c43";
    c.fillText(String(value), x, y + 43);
    c.fillStyle = "#dae5d5";
    c.fillRect(x, y + 59, 250, 7);
    c.fillStyle = ["#86a880", "#c4a169", "#7faab4"][i];
    c.fillRect(x, y + 59, (250 * value) / 100, 7);
  });
  y += 120;
  c.font = "24px system-ui";
  c.fillStyle = "#527168";
  c.fillText(
    language === "en" ? "Traces of this life" : "這一生留下的足跡",
    74,
    y,
  );
  y += 43;
  const traces = portrait ? result.log : result.log.slice(-1);
  for (const [i, row] of traces.entries()) {
    c.font = "27px system-ui";
    c.fillStyle = "#264c43";
    const prefix = portrait ? `${i + 1}. ` : "";
    for (const line of wrapLines(c, prefix + t(row.text), 936).slice(0, 2)) {
      c.fillText(line, 74, y);
      y += 34;
    }
    y += 12;
  }
  const footerY = height - 294;
  c.fillStyle = "#e7eee1";
  c.beginPath();
  c.roundRect(40, footerY, 1000, 250, 24);
  c.fill();
  drawShareQR(c, shareURL(run, language), 776, footerY + 5, 240);
  c.fillStyle = "#264c43";
  c.font = "bold 33px system-ui";
  c.fillText(
    language === "en" ? "Who will you become?" : "下一次，你會成為誰？",
    72,
    footerY + 64,
  );
  c.font = "25px system-ui";
  c.fillStyle = "#527168";
  c.fillText(
    language === "en" ? "Scan to see this story" : "掃碼看看這段故事",
    74,
    footerY + 118,
  );
  c.fillText(
    language === "en"
      ? "Then begin your own journey"
      : "再從同一起點，走出你的一生",
    74,
    footerY + 155,
  );
  c.font = "24px system-ui";
  c.fillStyle = "#264c43";
  c.fillText("otherlife.icareu.tw", 74, footerY + 211);
  c.font = "18px system-ui";
  c.fillStyle = "#71806b";
  c.fillText(
    language === "en"
      ? "An imagined journey. Stats are narrative indicators."
      : "一場想像旅程，數值為敘事指標。",
    74,
    height - 18,
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
