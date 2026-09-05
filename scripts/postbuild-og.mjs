// GitHub Pages picks Content-Type from the file extension. Next's generated
// OpenGraph route is emitted as `out/<lang>/opengraph-image` (no extension),
// which Pages would serve as application/octet-stream and social crawlers
// would reject. Copy each image to `opengraph-image.png` and point every HTML
// reference (og:image, twitter:image) at the .png copy.
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");
const LOCALES = ["mn", "en"];

for (const lang of LOCALES) {
  const src = join(out, lang, "opengraph-image");
  if (!existsSync(src)) {
    console.error(`postbuild-og: missing ${src}`);
    process.exit(1);
  }
  copyFileSync(src, `${src}.png`);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

let rewritten = 0;
for (const file of htmlFiles(out)) {
  const html = readFileSync(file, "utf8");
  const next = html.replace(/\/opengraph-image(\?|")/g, "/opengraph-image.png$1");
  if (next !== html) {
    writeFileSync(file, next);
    rewritten += 1;
  }
}
console.log(`postbuild-og: copied ${LOCALES.length} images to .png, rewrote ${rewritten} HTML file(s)`);
