// Serve the repository root and import this module in a browser to regenerate dist/social.png.
import { drawShareQR } from "../dist/share-qr.js";
export async function socialCover() {
  const art = new Image();
  art.src = new URL(
    "../dist/assets/earthlife-share.webp",
    import.meta.url,
  ).href;
  await new Promise((resolve, reject) => {
    art.onload = resolve;
    art.onerror = reject;
  });
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const c = canvas.getContext("2d");
  c.fillStyle = "#f5f6ef";
  c.fillRect(0, 0, 1200, 630);
  const crop = (art.height * 750) / 630;
  c.drawImage(art, (art.width - crop) / 2, 0, crop, art.height, 0, 0, 750, 630);
  c.fillStyle = "#264c43";
  c.font = "600 24px system-ui";
  c.fillText("OTHER LIFE", 790, 68);
  c.font = "bold 42px system-ui";
  c.fillText("地球轉生所", 790, 144);
  c.font = "600 32px system-ui";
  c.fillText("下一次，成為誰？", 790, 204);
  c.font = "24px system-ui";
  c.fillStyle = "#527168";
  c.fillText("掃碼，開啟你的生命故事", 790, 254);
  drawShareQR(c, "https://otherlife.icareu.tw/", 840, 282, 240);
  c.fillStyle = "#264c43";
  c.font = "24px system-ui";
  c.fillText("otherlife.icareu.tw", 790, 588);
  return canvas;
}
