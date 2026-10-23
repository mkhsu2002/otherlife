import fs from "node:fs";
const source = new URL(
    "../node_modules/qrcode-generator/dist/qrcode.mjs",
    import.meta.url,
  ),
  target = new URL("../dist/vendor/qrcode.mjs", import.meta.url);
fs.mkdirSync(new URL("../dist/vendor/", import.meta.url), { recursive: true });
fs.copyFileSync(source, target);
