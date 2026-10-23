import { readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
for (const root of ["dist", "scripts"]) {
  for (const entry of readdirSync(root, { recursive: true })) {
    if (!/\.m?js$/.test(entry)) continue;
    execFileSync(process.execPath, ["--check", join(root, entry)], {
      stdio: "inherit",
    });
  }
}
console.log("All distribution and maintenance modules passed syntax checks.");
