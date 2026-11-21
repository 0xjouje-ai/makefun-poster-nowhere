// SPDX-License-Identifier: MIT
// Writes the Zephyria travel poster to the grader's output directory.
// The poster is a fixed asset shipped in this repository, so every run
// copies the same bytes and the output is identical on every run.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const dest = join(outDir, "entry.png");

if (!existsSync(src)) throw new Error("entry.png missing from repository");
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
console.log(`wrote ${dest}`);
