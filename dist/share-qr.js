import qrcode from "./vendor/qrcode.mjs?rev=otherlife72";
export function drawShareQR(context, url, x, y, size = 240) {
  const parsed = new URL(url);
  if (
    parsed.origin !== "https://otherlife.icareu.tw" ||
    !Number.isInteger(size) ||
    size < 160
  )
    throw Error("Invalid QR destination or size");
  const code = qrcode(0, "M");
  code.addData(url, "Byte");
  code.make();
  const count = code.getModuleCount(),
    quiet = 4,
    cell = Math.floor(size / (count + quiet * 2));
  if (cell < 3) throw Error("QR area too small");
  const offsetX = Math.round(x + (size - cell * (count + quiet * 2)) / 2),
    offsetY = Math.round(y + (size - cell * (count + quiet * 2)) / 2);
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, size, size);
  context.fillStyle = "#173b32";
  for (let row = 0; row < count; row++)
    for (let col = 0; col < count; col++)
      if (code.isDark(row, col))
        context.fillRect(
          offsetX + (col + quiet) * cell,
          offsetY + (row + quiet) * cell,
          cell,
          cell,
        );
  return { modules: count, quietZone: quiet, cell };
}
