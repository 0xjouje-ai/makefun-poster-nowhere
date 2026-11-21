// SPDX-License-Identifier: MIT
// Writes the Zephyria travel poster to the grader's output directory.
// The poster is a fixed asset shipped in this repository, so every run
// copies the same bytes and the output is identical on every run.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// PNG signature: the first eight bytes every valid PNG file starts with.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Resolve the grader's output directory, defaulting to "out" next to this file.
function resolveOutDir(): string {
  const raw = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  return resolve(dirname(fileURLToPath(import.meta.url)), raw);
}

// Read the poster bytes and refuse to proceed unless they are a real,
// non-empty PNG, so a corrupt or truncated asset fails loudly instead of
// silently producing a broken output file.
function loadPosterBytes(srcPath: string): Buffer {
  if (!existsSync(srcPath)) throw new Error("entry.png missing from repository");
  const bytes = readFileSync(srcPath);
  if (bytes.length === 0) throw new Error("entry.png is empty");
  if (!bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    throw new Error("entry.png does not start with the PNG magic bytes");
  }
  return bytes;
}

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const outDir = resolveOutDir();
const dest = join(outDir, "entry.png");

const poster = loadPosterBytes(src);
mkdirSync(outDir, { recursive: true });
writeFileSync(dest, poster);
console.log(`wrote ${dest}`);
