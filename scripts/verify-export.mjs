// Fails the build if the static export is missing anything GitHub Pages needs.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
const problems = [];

const required = [
  "index.html",
  "404.html",
  "mn/index.html",
  "en/index.html",
  "mn/cv/index.html",
  "en/cv/index.html",
  "mn/opengraph-image.png",
  "en/opengraph-image.png",
  "sitemap.xml",
  "robots.txt",
  ".nojekyll",
];
for (const file of required) {
  if (!existsSync(join(out, file))) problems.push(`missing out/${file}`);
}

// [file, needle] — needle is a string (exact) or a RegExp (e.g. case-insensitive
// attribute names: Next renders `hrefLang`, browsers read it case-insensitively).
const contains = [
  ["index.html", 'http-equiv="refresh"'],
  ["index.html", "location.replace"],
  ["mn/index.html", 'lang="mn"'],
  ["en/index.html", 'lang="en"'],
  ["en/index.html", /hreflang="mn"/i],
  ["en/index.html", "application/ld+json"],
  ["mn/index.html", "/mn/opengraph-image.png"],
  ["en/index.html", "/en/opengraph-image.png"],
  ["sitemap.xml", "https://bttlg.github.io/en/cv/"],
  ["robots.txt", "Sitemap: https://bttlg.github.io/sitemap.xml"],
];
for (const [file, needle] of contains) {
  const path = join(out, file);
  if (!existsSync(path)) continue; // already reported above
  const html = readFileSync(path, "utf8");
  const ok = typeof needle === "string" ? html.includes(needle) : needle.test(html);
  if (!ok) problems.push(`out/${file} does not contain ${needle.toString()}`);
}

if (!readdirSync(out).some((f) => f.startsWith("icon") && f.endsWith(".svg"))) {
  problems.push("missing out/icon*.svg");
}

if (problems.length > 0) {
  console.error("Static export check failed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Static export OK (${required.length} files, ${contains.length} content checks, icon present).`);
