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
  "e-geree.svg",
  "yesh.svg",
  "octagon.png",
  "avatar.webp",
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
  ["en/index.html", '<div lang="en"'],
  ["en/index.html", /hreflang="mn"/i],
  ["en/index.html", "application/ld+json"],
  ["mn/index.html", "/mn/opengraph-image.png"],
  ["en/index.html", "/en/opengraph-image.png"],
  ["mn/index.txt", "/mn/opengraph-image.png"],
  ["mn/cv/index.html", 'og:url" content="https://bttlg.github.io/mn/cv/"'],
  ["en/cv/index.html", 'og:url" content="https://bttlg.github.io/en/cv/"'],
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

if (!existsSync(out)) {
  problems.push("missing out/ directory (run `npm run build` first)");
} else {
  if (!readdirSync(out).some((f) => f.startsWith("icon") && f.endsWith(".svg"))) {
    problems.push("missing out/icon*.svg");
  }
  // The OG-image source JPEG (assets/avatar-og.jpg) must never end up
  // published as a standalone static-export file.
  if (existsSync(join(out, "avatar.jpg"))) {
    problems.push("out/avatar.jpg must not be published (OG source photo leaked into the static export)");
  }
}

if (problems.length > 0) {
  console.error("Static export check failed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Static export OK (${required.length} files, ${contains.length} content checks, icon present).`);
