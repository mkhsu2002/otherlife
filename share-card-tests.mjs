import test from "node:test";
import assert from "node:assert/strict";
import jsQR from "jsqr";
import { catalog } from "./dist/engine.js";
import { shareURL } from "./dist/share.js";
import * as qr from "./dist/share-qr.js";
test("QR rendered pixels decode to the exact public result URL for every life and language", () => {
  for (const era of catalog)
    for (let i = 0; i < 3; i++)
      for (const language of ["zh-Hant", "en"]) {
        const run = {
            key: era.id + "-" + i,
            seed: 4294967295,
            choices: [0, 1, 0, 1],
          },
          url = shareURL(run, language),
          size = 240,
          pixels = new Uint8ClampedArray(size * size * 4);
        const context = {
          fillStyle: "#fff",
          fillRect(x, y, w, h) {
            const dark = this.fillStyle !== "#ffffff";
            for (let yy = y; yy < y + h; yy++)
              for (let xx = x; xx < x + w; xx++) {
                const index = (yy * size + xx) * 4;
                pixels[index] =
                  pixels[index + 1] =
                  pixels[index + 2] =
                    dark ? 0 : 255;
                pixels[index + 3] = 255;
              }
          },
        };
        qr.drawShareQR(context, url, 0, 0, size);
        const decoded = jsQR(pixels, size, size);
        assert(decoded, run.key);
        assert.equal(decoded.data, url);
      }
});
test("QR rejects unrelated origins and undersized areas", () => {
  assert.throws(() => qr.drawShareQR({}, "https://example.com/", 0, 0, 240));
  assert.throws(() =>
    qr.drawShareQR({}, "https://otherlife.icareu.tw/", 0, 0, 50),
  );
});
