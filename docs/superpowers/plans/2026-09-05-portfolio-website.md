# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Тэргэл Ганболдын хоёр хэлтэй (mn/en), бараан dev-style, статик Next.js 16 танилцуулга сайтыг GitHub Pages (`https://bttlg.github.io/`) дээр байршуулах.

**Architecture:** Next.js 16 App Router `output: 'export'`; `src/app/[lang]/` доор `generateStaticParams(['mn','en'])`-тэй хуудсууд, `/` дээр inline script-тэй хэл сонгох redirect хуудас. Бүх текст `src/content/` доторх төрөлжсөн `Localized<T> = Record<Locale, T>` объектуудад; компонентууд `lang` prop авч индекслэнэ. Нэг root layout (`<html lang="mn">`), `[lang]` layout контентыг `<div lang={lang}>`-ээр ороодог. Deploy: GitHub Actions → `actions/deploy-pages`.

**Tech Stack:** Next.js ^16.3, React ^19.2, TypeScript ^5, Tailwind CSS ^4 (`@tailwindcss/postcss`), `next/font/google` (Inter, JetBrains Mono), Vitest ^5 + @testing-library/react ^16 + jsdom, ESLint ^9 + eslint-config-next, `@fontsource/inter` (OG зургийн фонт), Node 24, npm.

**Spec:** `docs/superpowers/specs/2026-09-05-portfolio-website-design.md`

## Global Constraints

- Node `24` (`.nvmrc`; 2026-09-06 controller ruling — Vitest 5/jsdom 30 engines шаардлага, Task 1-д `20` гэж бичсэн нь Task 11-д `24` болно), package manager npm; TypeScript `^5` (7.x-г ашиглахгүй), ESLint `^9`.
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. Static export-д хориотой зүйл (proxy, redirects/rewrites/headers config, server actions, cookies, ISR, `dynamicParams: true`) ашиглахгүй.
- Locale-ууд: `mn` (default), `en`. URL үргэлж trailing slash-тай: `/mn/`, `/en/cv/`.
- Бүх хэрэглэгчид харагдах текст `src/content/`-оос ирнэ; компонент дотор хатуу бичсэн монгол/англи текст байхгүй (`GitHub`, `LinkedIn`, `404`, `$ whoami` гэх мэт брэнд/тэмдэг л).
- Тодорхойгүй баримт бүрийн дэргэд `// TODO(Тэргэл): ...` comment; сайт дээр placeholder текст гарахгүй. Хоосон массив/хоосон string → холбогдох UI огт render болохгүй.
- Theme token-ууд (Tailwind класс): `bg-canvas`, `bg-surface`, `border-border`, `text-fg`, `text-muted`, `text-accent`, `font-sans`, `font-mono`. Dark-only, `color-scheme: dark`.
- Гадаад линк бүр `target="_blank" rel="noopener noreferrer"`.
- Next.js API ашиглахаасаа өмнө `node_modules/next/dist/docs/01-app/` доторх холбогдох баримтыг унших.
- Commit бүр `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` мөртэй. Repo: `/Users/hades/Documents/GitHub/personal/portfolio` (`main`). Эх хавтас `/Users/hades/Documents/GitHub` нь өөр git repo — тэндээс хэзээ ч `git add` хийхгүй.
- Remote нэмэх / push хийх нь нийтлэх үйлдэл: Task 12-т Тэргэлээс тодорхой зөвшөөрөл авсны дараа л хийнэ.

---

## Файлын бүтэц (эцсийн байдал)

| Файл | Үүрэг |
|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.setup.ts`, `.nvmrc`, `.gitignore`, `README.md` | Төслийн тохиргоо |
| `public/.nojekyll` | GitHub Pages `_next/` хавтсыг Jekyll-ээр үл тоохгүй байлгах |
| `scripts/verify-export.mjs` | `out/` доторх файлуудыг build-ийн дараа шалгах |
| `.github/workflows/deploy.yml` | CI + GitHub Pages deploy |
| `src/lib/i18n.ts` | `LOCALES`, `Locale`, `DEFAULT_LOCALE`, `hasLocale`, `otherLocale`, `stripLocale`, `localePath` |
| `src/lib/dates.ts` | `formatYearMonth`, `formatPeriod`, `yearsSince` |
| `src/lib/redirect-script.ts` | `REDIRECT_SCRIPT` string (`/` хуудсын inline script) |
| `src/lib/site.ts` | `SITE_URL`, `SITE_HOST` |
| `src/lib/jsonld.ts` | `personJsonLd(lang)` |
| `src/content/types.ts` | `Localized`, `Period`, `Profile`, `Experience`, `Project`, `SkillGroup`, `Education`, `UiDict`, `Ui` |
| `src/content/{profile,experience,projects,skills,education,ui}.ts` | Агуулга (MN/EN) |
| `src/content/index.ts` | Бүгдийг re-export + `experienceStart` |
| `src/app/layout.tsx` | Root layout: html/body, фонт, `metadataBase` |
| `src/app/globals.css` | Tailwind import, theme token, дэвсгэр, animation, print |
| `src/app/page.tsx` | `/` хэл сонгож redirect |
| `src/app/not-found.tsx` | 404 (хоёр хэл) |
| `src/app/icon.svg` | Favicon |
| `src/app/sitemap.ts`, `src/app/robots.ts` | SEO |
| `src/app/[lang]/layout.tsx` | `generateStaticParams`, `dynamicParams=false`, `generateMetadata`, `<div lang>`, Nav + Footer |
| `src/app/[lang]/page.tsx` | Нүүр: Hero → About → Skills → Experience → Projects → Contact + JSON-LD |
| `src/app/[lang]/cv/page.tsx` | CV хуудас |
| `src/app/[lang]/opengraph-image.tsx` | OG зураг (build үед) |
| `src/components/Nav.tsx`, `LangSwitch.tsx` (client), `Footer.tsx`, `Section.tsx`, `Chip.tsx`, `Icon.tsx`, `SocialLinks.tsx` | Layout ба нийтлэг UI |
| `src/components/Hero.tsx`, `About.tsx`, `Skills.tsx`, `Experience.tsx`, `Projects.tsx`, `ProjectCard.tsx`, `Contact.tsx`, `JsonLd.tsx` | Нүүрийн section-ууд |
| `src/components/cv/CvDocument.tsx`, `cv/PrintButton.tsx` (client) | CV |
| `*.test.ts(x)` эх файлын хажууд | Vitest тестүүд |

---

### Task 1: Төслийн scaffold ба build pipeline

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.setup.ts`, `.nvmrc`, `README.md`, `public/.nojekyll`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: юу ч үгүй (хоосон repo, `.gitignore` ба spec commit хийгдсэн).
- Produces: `npm run lint|typecheck|test|build` ажилладаг Next 16 static-export төсөл; `@/*` → `./src/*` alias; Vitest jsdom + jest-dom тохиргоо. Дараагийн task-ууд энэ тохиргоог өөрчлөхгүй (globals.css-ийг Task 4 өргөтгөнө).

- [ ] **Step 1: `package.json` бичих**

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "verify-export": "node scripts/verify-export.mjs",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build && npm run verify-export"
  },
  "dependencies": {
    "next": "^16.3.4",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@fontsource/inter": "^5.3.0",
    "@tailwindcss/postcss": "^4",
    "@testing-library/dom": "^10",
    "@testing-library/jest-dom": "^7",
    "@testing-library/react": "^16",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6",
    "eslint": "^9",
    "eslint-config-next": "^16.3.4",
    "jsdom": "^30",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^5"
  }
}
```

- [ ] **Step 2: Тохиргооны файлууд бичих**

`.nvmrc`:
```
20
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mts", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

`postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

`eslint.config.mjs`:
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
```

`vitest.config.mts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

`public/.nojekyll`: хоосон файл (`touch public/.nojekyll`).

`README.md`:
````markdown
# tergel portfolio

Тэргэл Ганболдын танилцуулга сайт — https://bttlg.github.io/

Next.js 16 (static export) · Tailwind CSS 4 · Vitest · GitHub Pages.

## Хөгжүүлэлт

```bash
npm install
npm run dev        # http://localhost:3000 → /mn/ руу redirect
npm run check      # lint + typecheck + test + build + export шалгалт
```

Агуулга `src/content/` дотор. `TODO(Тэргэл)` comment-той мөрүүдийг засах.
````

- [ ] **Step 3: Хамгийн бага app файлууд бичих**

`src/app/globals.css` (Task 4-т өргөтгөнө):
```css
@import "tailwindcss";

@theme {
  --color-canvas: #09090b;
  --color-surface: #18181b;
  --color-border: #27272a;
  --color-fg: #f4f4f5;
  --color-muted: #a1a1aa;
  --color-accent: #34d399;
}

@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

html {
  color-scheme: dark;
}
```

`src/app/layout.tsx`:
```tsx
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
```

`src/app/page.tsx` (Task 4-т бүтнээр солигдоно):
```tsx
export default function Page() {
  return <main className="p-8 font-mono">portfolio scaffold</main>;
}
```

- [ ] **Step 4: Суулгаж, бүх script ажиллаж байгааг шалгах**

Run: `npm install`
Expected: амжилттай, `package-lock.json` үүснэ (peer warning байж болно, error байхгүй).

Run: `npm run lint && npm run typecheck`
Expected: хоёулаа 0 exit code (typecheck нь `next-env.d.ts` байхгүй гэж гомдоллож болно — тэгвэл эхлээд `npm run build` ажиллуулж дараа нь дахин).

Run: `npm run test`
Expected: `No test files found, exiting with code 0` (`--passWithNoTests` тул exit 0).

Run: `npm run build && ls out/`
Expected: `out/index.html`, `out/404.html`, `out/_next/` байна.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 static-export project with Tailwind 4 and Vitest

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: `lib/i18n`, `lib/dates`, `lib/redirect-script` (TDD)

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/i18n.test.ts`, `src/lib/dates.ts`, `src/lib/dates.test.ts`, `src/lib/redirect-script.ts`, `src/lib/redirect-script.test.ts`, `src/lib/site.ts`

**Interfaces:**
- Consumes: Task 1-ийн Vitest тохиргоо.
- Produces:
  - `LOCALES: readonly ['mn','en']`, `type Locale = 'mn' | 'en'`, `DEFAULT_LOCALE: Locale = 'mn'`
  - `hasLocale(value: string): value is Locale`
  - `otherLocale(locale: Locale): Locale`
  - `stripLocale(pathname: string): string` — `'/en/cv/' → '/cv/'`, `'/mn' → '/'`, `'/cv' → '/cv/'`
  - `localePath(locale: Locale, sub?: string): string` — `('en','/cv') → '/en/cv/'`, `('mn') → '/mn/'`
  - `interface Period { from: string; to: string | null }` (`'YYYY-MM'`)
  - `formatYearMonth(ym: string, locale: Locale): string` — mn `'2023.03'`, en `'Mar 2023'`
  - `formatPeriod(period: Period, locale: Locale, presentLabel: string): string` — `'2023.03 – одоог хүртэл'`
  - `yearsSince(from: string, now: Date): number` — бүтэн жилээр доош бөөрөнхийлсөн
  - `REDIRECT_SCRIPT: string`
  - `SITE_URL = 'https://bttlg.github.io'`, `SITE_HOST = 'bttlg.github.io'`

- [ ] **Step 1: i18n тест бичих**

`src/lib/i18n.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  LOCALES,
  DEFAULT_LOCALE,
  hasLocale,
  otherLocale,
  stripLocale,
  localePath,
} from "./i18n";

describe("LOCALES", () => {
  it("is mn then en, default mn", () => {
    expect([...LOCALES]).toEqual(["mn", "en"]);
    expect(DEFAULT_LOCALE).toBe("mn");
  });
});

describe("hasLocale", () => {
  it("accepts supported locales only", () => {
    expect(hasLocale("mn")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("de")).toBe(false);
    expect(hasLocale("")).toBe(false);
    expect(hasLocale("MN")).toBe(false);
  });
});

describe("otherLocale", () => {
  it("flips between mn and en", () => {
    expect(otherLocale("mn")).toBe("en");
    expect(otherLocale("en")).toBe("mn");
  });
});

describe("stripLocale", () => {
  it.each([
    ["/en/cv/", "/cv/"],
    ["/en/cv", "/cv/"],
    ["/mn/", "/"],
    ["/mn", "/"],
    ["/", "/"],
    ["/cv", "/cv/"],
    ["/english/", "/english/"],
  ])("%s -> %s", (input, expected) => {
    expect(stripLocale(input)).toBe(expected);
  });
});

describe("localePath", () => {
  it.each([
    ["en", "/cv", "/en/cv/"],
    ["en", "/cv/", "/en/cv/"],
    ["en", "cv", "/en/cv/"],
    ["mn", "/", "/mn/"],
    ["mn", undefined, "/mn/"],
  ] as const)("(%s, %s) -> %s", (locale, sub, expected) => {
    expect(localePath(locale, sub)).toBe(expected);
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/lib/i18n.test.ts`
Expected: FAIL — `Failed to resolve import "./i18n"`.

- [ ] **Step 3: `src/lib/i18n.ts` бичих**

```ts
export const LOCALES = ["mn", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "mn";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "mn" ? "en" : "mn";
}

/** Always returns a path that starts and ends with "/". */
function normalize(path: string): string {
  let out = path.startsWith("/") ? path : `/${path}`;
  if (!out.endsWith("/")) out += "/";
  return out;
}

/** Remove a leading locale segment: "/en/cv/" -> "/cv/", "/mn" -> "/". */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(mn|en)(?=\/|$)/);
  const rest = match ? pathname.slice(match[0].length) : pathname;
  return normalize(rest);
}

/** Build a locale-prefixed path with trailing slash: ("en", "/cv") -> "/en/cv/". */
export function localePath(locale: Locale, sub: string = "/"): string {
  const normalized = normalize(sub);
  return normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`;
}
```

- [ ] **Step 4: Тест ногоон болсныг шалгах**

Run: `npx vitest run src/lib/i18n.test.ts`
Expected: PASS (5 describe, бүх case).

- [ ] **Step 5: dates тест бичих**

`src/lib/dates.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatYearMonth, formatPeriod, yearsSince } from "./dates";

describe("formatYearMonth", () => {
  it("formats mn as YYYY.MM", () => {
    expect(formatYearMonth("2023-03", "mn")).toBe("2023.03");
  });
  it("formats en as Mon YYYY", () => {
    expect(formatYearMonth("2023-03", "en")).toBe("Mar 2023");
    expect(formatYearMonth("2021-10", "en")).toBe("Oct 2021");
  });
});

describe("formatPeriod", () => {
  it("uses the present label when to is null", () => {
    expect(formatPeriod({ from: "2023-03", to: null }, "mn", "одоог хүртэл")).toBe(
      "2023.03 – одоог хүртэл",
    );
    expect(formatPeriod({ from: "2023-03", to: null }, "en", "Present")).toBe(
      "Mar 2023 – Present",
    );
  });
  it("formats closed periods", () => {
    expect(formatPeriod({ from: "2021-10", to: "2026-08" }, "en", "Present")).toBe(
      "Oct 2021 – Aug 2026",
    );
  });
});

describe("yearsSince", () => {
  it("floors to whole years", () => {
    expect(yearsSince("2021-03", new Date(2026, 8, 5))).toBe(5); // 2026-09-05
    expect(yearsSince("2021-03", new Date(2026, 1, 1))).toBe(4); // 2026-02-01
    expect(yearsSince("2021-03", new Date(2026, 2, 1))).toBe(5); // 2026-03-01
  });
  it("never goes negative", () => {
    expect(yearsSince("2030-01", new Date(2026, 0, 1))).toBe(0);
  });
});
```

- [ ] **Step 6: Тест унаж байгааг шалгах**

Run: `npx vitest run src/lib/dates.test.ts`
Expected: FAIL — `Failed to resolve import "./dates"`.

- [ ] **Step 7: `src/lib/dates.ts` бичих**

```ts
import type { Locale } from "./i18n";

/** "YYYY-MM" strings; `to: null` means "present". */
export interface Period {
  from: string;
  to: string | null;
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function split(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-");
  return { year: Number(y), month: Number(m) };
}

export function formatYearMonth(ym: string, locale: Locale): string {
  const { year, month } = split(ym);
  if (locale === "mn") return `${year}.${String(month).padStart(2, "0")}`;
  return `${EN_MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(period: Period, locale: Locale, presentLabel: string): string {
  const from = formatYearMonth(period.from, locale);
  const to = period.to ? formatYearMonth(period.to, locale) : presentLabel;
  return `${from} – ${to}`;
}

/** Whole years elapsed between "YYYY-MM" and `now`, floored, never negative. */
export function yearsSince(from: string, now: Date): number {
  const { year, month } = split(from);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 12));
}
```

- [ ] **Step 8: Тест ногоон болсныг шалгах**

Run: `npx vitest run src/lib/dates.test.ts`
Expected: PASS.

- [ ] **Step 9: redirect-script тест бичих**

`src/lib/redirect-script.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { REDIRECT_SCRIPT } from "./redirect-script";

interface Fakes {
  saved?: string | null;
  storageThrows?: boolean;
  languages?: string[];
  language?: string;
}

/** Runs the exact shipped script with fake globals and returns the replaced URL. */
function run({ saved = null, storageThrows = false, languages, language = "" }: Fakes): string {
  let replaced = "";
  const localStorage = {
    getItem: () => {
      if (storageThrows) throw new Error("denied");
      return saved;
    },
  };
  const navigator = { languages, language };
  const location = { replace: (url: string) => { replaced = url; } };
  new Function("localStorage", "navigator", "location", REDIRECT_SCRIPT)(localStorage, navigator, location);
  return replaced;
}

describe("REDIRECT_SCRIPT", () => {
  it("prefers a saved locale over the browser language", () => {
    expect(run({ saved: "en", languages: ["mn-MN"] })).toBe("/en/");
    expect(run({ saved: "mn", languages: ["en-US"] })).toBe("/mn/");
  });
  it("ignores an unsupported saved value", () => {
    expect(run({ saved: "de", languages: ["en-US"] })).toBe("/en/");
  });
  it("uses the first browser language", () => {
    expect(run({ languages: ["en-GB", "mn"] })).toBe("/en/");
    expect(run({ languages: ["mn-MN", "en"] })).toBe("/mn/");
    expect(run({ languages: [], language: "en" })).toBe("/en/");
  });
  it("defaults to mn", () => {
    expect(run({})).toBe("/mn/");
    expect(run({ languages: ["de-DE"] })).toBe("/mn/");
    expect(run({ languages: ["eng"] })).toBe("/mn/");
  });
  it("survives a throwing localStorage and still detects the language", () => {
    expect(run({ storageThrows: true, languages: ["en-US"] })).toBe("/en/");
    expect(run({ storageThrows: true })).toBe("/mn/");
  });
});
```

- [ ] **Step 10: Тест унаж байгааг шалгах**

Run: `npx vitest run src/lib/redirect-script.test.ts`
Expected: FAIL — `Failed to resolve import "./redirect-script"`.

- [ ] **Step 11: `src/lib/redirect-script.ts` ба `src/lib/site.ts` бичих**

`src/lib/redirect-script.ts`:
```ts
/**
 * Inline script for the "/" page. Runs during HTML parsing, before React and
 * before the <meta http-equiv="refresh"> fallback fires, and replaces the URL.
 *
 * Priority: saved choice (localStorage "locale") > first browser language > "mn".
 * Kept as a plain string so the exact shipped code is unit-tested with fake globals.
 */
export const REDIRECT_SCRIPT = `(function () {
  var target = null;
  try {
    var saved = localStorage.getItem('locale');
    if (saved === 'mn' || saved === 'en') target = saved;
  } catch (e) {}
  if (!target) {
    var lang = '';
    try {
      lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    } catch (e) {}
    target = /^en(-|$)/i.test(lang) ? 'en' : 'mn';
  }
  location.replace('/' + target + '/');
})();`;
```

`src/lib/site.ts`:
```ts
export const SITE_HOST = "bttlg.github.io";
export const SITE_URL = `https://${SITE_HOST}`;
```

- [ ] **Step 12: Бүх тест ногоон, lint/typecheck цэвэр**

Run: `npm run test && npm run lint && npm run typecheck`
Expected: 3 тест файл PASS, lint/typecheck 0 exit.

- [ ] **Step 13: Commit**

```bash
git add src/lib
git commit -m "feat: add i18n, date formatting and locale redirect script helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Агуулгын модель ба MN/EN ноорог агуулга

**Files:**
- Create: `src/content/types.ts`, `src/content/ui.ts`, `src/content/profile.ts`, `src/content/experience.ts`, `src/content/projects.ts`, `src/content/skills.ts`, `src/content/education.ts`, `src/content/index.ts`, `src/content/content.test.ts`

**Interfaces:**
- Consumes: `Locale`, `LOCALES` (`@/lib/i18n`), `Period` (`@/lib/dates`).
- Produces: `import { profile, experience, projects, skills, education, ui, experienceStart } from "@/content"` ба `import type { Profile, Experience, Project, SkillGroup, Education, UiDict, Localized } from "@/content"`. `ui[lang]` нь `UiDict`. `experienceStart` нь хамгийн эрт `experience[].period.from` (`'2021-03'`).

- [ ] **Step 1: Төрлүүд бичих**

`src/content/types.ts`:
```ts
import type { Locale } from "@/lib/i18n";
import type { Period } from "@/lib/dates";

export type { Period };

/** Every user-visible string exists in both locales; missing one fails `tsc`. */
export type Localized<T = string> = Record<Locale, T>;

export interface Profile {
  name: Localized;
  title: Localized;
  tagline: Localized;
  location: Localized;
  email: string;
  github: string;
  /** Empty string = not shown anywhere. */
  linkedin: string;
  /** Paragraphs. Same count in both locales. */
  about: Localized<string[]>;
  facts: { label: Localized; value: Localized }[];
}

export interface Experience {
  id: string;
  company: Localized;
  url?: string;
  role: Localized;
  period: Period;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
}

export interface Project {
  slug: string;
  name: Localized;
  kind: "work" | "personal";
  role: Localized;
  period: Period;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface SkillGroup {
  id: string;
  label: Localized;
  items: string[];
}

export interface Education {
  school: Localized;
  degree: Localized;
  period: Period;
}

export interface UiDict {
  brand: string;
  langName: string;
  nav: Record<"label" | "about" | "skills" | "experience" | "projects" | "contact" | "cv", string>;
  sections: Record<
    "about" | "skills" | "experience" | "projects" | "work" | "personal" | "contact" | "education",
    string
  >;
  actions: Record<"viewProjects" | "viewCv" | "contactMe" | "live" | "source" | "print", string>;
  hero: Record<"prompt", string>;
  about: Record<"years" | "yearsValue", string>;
  contact: Record<"body" | "email", string>;
  cv: Record<"title" | "summary" | "featuredProjects" | "present", string>;
  notFound: Record<"title" | "body" | "home", string>;
  footer: Record<"builtWith", string>;
}

export type Ui = Record<Locale, UiDict>;
```

- [ ] **Step 2: Content parity тест бичих**

`src/content/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { profile, experience, projects, skills, education, ui, experienceStart } from "./index";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function isLocalized(v: unknown): v is { mn: Json; en: Json } {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const keys = Object.keys(v).sort();
  return keys.length === 2 && keys[0] === "en" && keys[1] === "mn";
}

/** Both locale values must have the same shape and no empty strings. */
function assertParallel(a: Json, b: Json, path: string): void {
  if (typeof a === "string" || typeof b === "string") {
    expect(typeof a, path).toBe("string");
    expect(typeof b, path).toBe("string");
    expect((a as string).trim(), `${path} (mn) is empty`).not.toBe("");
    expect((b as string).trim(), `${path} (en) is empty`).not.toBe("");
    return;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    expect(Array.isArray(a) && Array.isArray(b), path).toBe(true);
    expect((a as Json[]).length, `${path} length differs between mn and en`).toBe((b as Json[]).length);
    (a as Json[]).forEach((item, i) => assertParallel(item, (b as Json[])[i], `${path}[${i}]`));
    return;
  }
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    expect(ka, `${path} keys differ`).toEqual(kb);
    ka.forEach((k) => assertParallel((a as Record<string, Json>)[k], (b as Record<string, Json>)[k], `${path}.${k}`));
  }
}

/** Walk any content tree; every {mn, en} node is checked with assertParallel. */
function walk(node: unknown, path: string): void {
  if (isLocalized(node)) {
    assertParallel(node.mn, node.en, path);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (typeof node === "object" && node !== null) {
    Object.entries(node).forEach(([k, v]) => walk(v, `${path}.${k}`));
  }
}

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function checkPeriod(period: { from: string; to: string | null }, path: string): void {
  expect(period.from, `${path}.from`).toMatch(YEAR_MONTH);
  if (period.to !== null) {
    expect(period.to, `${path}.to`).toMatch(YEAR_MONTH);
    expect(period.to >= period.from, `${path}: to is before from`).toBe(true);
  }
}

describe("content: every localized value exists in mn and en", () => {
  it("profile", () => walk(profile, "profile"));
  it("experience", () => walk(experience, "experience"));
  it("projects", () => walk(projects, "projects"));
  it("skills", () => walk(skills, "skills"));
  it("education", () => walk(education, "education"));
  it("ui", () => assertParallel(ui.mn as unknown as Json, ui.en as unknown as Json, "ui"));
});

describe("content: identifiers and URLs", () => {
  it("project slugs are unique and url-safe", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });
  it("experience ids are unique", () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("all urls are https", () => {
    const urls = [
      profile.github,
      ...(profile.linkedin ? [profile.linkedin] : []),
      ...experience.flatMap((e) => (e.url ? [e.url] : [])),
      ...projects.flatMap((p) => [p.liveUrl, p.repoUrl].filter((u): u is string => Boolean(u))),
    ];
    urls.forEach((u) => expect(u).toMatch(/^https:\/\/[^\s]+$/));
  });
  it("email looks like an email", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

describe("content: periods and flags", () => {
  it("periods are YYYY-MM and ordered", () => {
    experience.forEach((e) => checkPeriod(e.period, `experience.${e.id}`));
    projects.forEach((p) => checkPeriod(p.period, `projects.${p.slug}`));
    education.forEach((e, i) => checkPeriod(e.period, `education[${i}]`));
  });
  it("has at least one featured project of each kind", () => {
    expect(projects.some((p) => p.featured && p.kind === "work")).toBe(true);
    expect(projects.some((p) => p.featured && p.kind === "personal")).toBe(true);
  });
  it("experienceStart is the earliest experience start", () => {
    const sorted = experience.map((e) => e.period.from).sort();
    expect(experienceStart).toBe(sorted[0]);
    expect(experienceStart).toMatch(YEAR_MONTH);
  });
  it("skill groups are non-empty with unique ids", () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((g) => expect(g.items.length).toBeGreaterThan(0));
    expect(new Set(skills.map((g) => g.id)).size).toBe(skills.length);
  });
});
```

- [ ] **Step 3: Тест унаж байгааг шалгах**

Run: `npx vitest run src/content/content.test.ts`
Expected: FAIL — `Failed to resolve import "./index"`.

- [ ] **Step 4: `ui.ts` бичих**

`src/content/ui.ts`:
```ts
import type { Ui } from "./types";

export const ui: Ui = {
  mn: {
    brand: "~/tergel",
    langName: "Монгол",
    nav: {
      label: "Үндсэн цэс",
      about: "Тухай",
      skills: "Ур чадвар",
      experience: "Туршлага",
      projects: "Төслүүд",
      contact: "Холбоо барих",
      cv: "CV",
    },
    sections: {
      about: "Миний тухай",
      skills: "Ур чадвар",
      experience: "Ажлын туршлага",
      projects: "Төслүүд",
      work: "Ажлын төслүүд",
      personal: "Хувийн / OSS",
      contact: "Холбоо барих",
      education: "Боловсрол",
    },
    actions: {
      viewProjects: "Төслүүд харах",
      viewCv: "CV харах",
      contactMe: "Холбоо барих",
      live: "Live",
      source: "Код",
      print: "Хэвлэх / PDF",
    },
    hero: { prompt: "$ whoami" },
    about: { years: "Туршлага", yearsValue: "{n}+ жил" },
    contact: {
      body: "Шинэ төсөл, хамтын ажиллагаа, эсвэл зүгээр л мэндчилэх бол бичээрэй. Ихэвчлэн нэг өдрийн дотор хариулдаг.",
      email: "И-мэйл",
    },
    cv: {
      title: "CV",
      summary: "Товч танилцуулга",
      featuredProjects: "Гол төслүүд",
      present: "одоог хүртэл",
    },
    notFound: {
      title: "Хуудас олдсонгүй",
      body: "Ийм хаяг байхгүй эсвэл зөөгдсөн байна.",
      home: "Нүүр хуудас",
    },
    footer: { builtWith: "Next.js + Tailwind · GitHub Pages" },
  },
  en: {
    brand: "~/tergel",
    langName: "English",
    nav: {
      label: "Main navigation",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
      cv: "CV",
    },
    sections: {
      about: "About me",
      skills: "Skills",
      experience: "Work experience",
      projects: "Projects",
      work: "Work projects",
      personal: "Personal / OSS",
      contact: "Get in touch",
      education: "Education",
    },
    actions: {
      viewProjects: "View projects",
      viewCv: "View CV",
      contactMe: "Contact me",
      live: "Live",
      source: "Source",
      print: "Print / PDF",
    },
    hero: { prompt: "$ whoami" },
    about: { years: "Experience", yearsValue: "{n}+ years" },
    contact: {
      body: "Have a project, a collaboration idea, or just want to say hi? Write me. I usually reply within a day.",
      email: "Email",
    },
    cv: {
      title: "CV",
      summary: "Summary",
      featuredProjects: "Selected projects",
      present: "Present",
    },
    notFound: {
      title: "Page not found",
      body: "This address does not exist or has moved.",
      home: "Home",
    },
    footer: { builtWith: "Next.js + Tailwind · GitHub Pages" },
  },
};
```

- [ ] **Step 5: `profile.ts` бичих**

`src/content/profile.ts`:
```ts
import type { Profile } from "./types";

export const profile: Profile = {
  // TODO(Тэргэл): Нэрийн бичилтийг шалгах («Тэргэл Ганболд» эсвэл «Г. Тэргэл»).
  name: { mn: "Тэргэл Ганболд", en: "Tergel Ganbold" },
  title: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
  tagline: {
    mn: "Финтек, банкны интеграц, цахим гэрээний системүүдийг Java / Spring Boot backend-ээс Next.js веб, мобайл апп хүртэл бүтнээр нь хийдэг.",
    en: "I build fintech, bank-integration and e-contract systems end to end: from Java / Spring Boot backends to Next.js web and mobile apps.",
  },
  location: { mn: "Улаанбаатар, Монгол", en: "Ulaanbaatar, Mongolia" },
  email: "ganboldtergel11@gmail.com",
  github: "https://github.com/Bttlg",
  // TODO(Тэргэл): LinkedIn профайлын бүтэн URL (https://www.linkedin.com/in/...). Хоосон бол линк хаана ч харагдахгүй.
  linkedin: "",
  about: {
    mn: [
      "2021 оноос хойш Монголын финтек, цахим үйлчилгээний салбарт full-stack хөгжүүлэгчээр ажиллаж байна. Крипто бирж, банкны интеграц, цахим гэрээ, шуудан логистикийн системүүдийн backend архитектур болон frontend-ийг хийсэн.",
      "Гол хүч нь Java / Spring Boot микросервис, MongoDB, Redis, RabbitMQ дээр суурилсан backend. Түүн дээрээ Next.js / React frontend болон React Native, SwiftUI мобайл апп хөгжүүлдэг.",
      "Чөлөөт цагаараа өөрт хэрэгтэй жижиг бүтээгдэхүүн хийх дуртай: Улаанбаатарын автобусны бодит цагийн iOS апп, дууг stem-үүдэд салгаж миксддэг веб апп гэх мэт.",
    ],
    en: [
      "Since 2021 I have worked as a full-stack developer in Mongolia's fintech and digital-services sector, building the backend architecture and frontends of a crypto exchange, bank integrations, an e-contract platform and postal-logistics systems.",
      "My core is Java / Spring Boot microservices on MongoDB, Redis and RabbitMQ. On top of that I build Next.js / React frontends and React Native or SwiftUI mobile apps.",
      "In my spare time I like building small products I need myself: a real-time iOS app for Ulaanbaatar buses, a web app that splits songs into stems and mixes them, and more.",
    ],
  },
  facts: [
    { label: { mn: "Байршил", en: "Location" }, value: { mn: "Улаанбаатар", en: "Ulaanbaatar" } },
    // TODO(Тэргэл): Одоо голчлон юу хийж байгаагаа шалгах.
    { label: { mn: "Одоо", en: "Currently" }, value: { mn: "e-geree.mn, MnPost backend", en: "e-geree.mn, MnPost backend" } },
    { label: { mn: "Хэл", en: "Languages" }, value: { mn: "Монгол, Англи", en: "Mongolian, English" } },
  ],
};
```

- [ ] **Step 6: `experience.ts` бичих**

`src/content/experience.ts` (хугацаа git түүхээс; компанийн албан нэр ба албан тушаал TODO):
```ts
import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    id: "egeree",
    // TODO(Тэргэл): Компанийн албан нэр (e-geree.mn-ийг эзэмшдэг ХХК) ба албан тушаал.
    company: { mn: "e-geree.mn", en: "e-geree.mn" },
    url: "https://e-geree.mn",
    role: { mn: "Full-stack хөгжүүлэгч (backend гол)", en: "Full-stack Developer (backend-focused)" },
    period: { from: "2023-03", to: null },
    summary: {
      mn: "Байгууллага, иргэдэд зориулсан цахим гэрээ байгуулах, цахим гарын үсгээр баталгаажуулах платформ. Backend микросервисүүд, төлбөр ба банкны интеграц, Next.js frontend-ийг хөгжүүлсэн.",
      en: "Platform for creating and digitally signing contracts for businesses and citizens. Built the backend microservices, payment and bank integrations, and the Next.js frontend.",
    },
    highlights: {
      mn: [
        "Auth, notification, PDF generator, SSO, 2FA гэх мэт 10+ Spring Boot микросервисийн архитектур ба хөгжүүлэлт (backend-д 2400+ commit)",
        "Цахим гарын үсэг, ХУР (XYP) төрийн мэдээлэл солилцооны систем, банкны төлбөрийн интеграц",
        "Next.js 13 → 16 шилжилт, OpenTelemetry ажиглалт нэвтрүүлсэн",
      ],
      en: [
        "Designed and built 10+ Spring Boot microservices: auth, notifications, PDF generation, SSO, 2FA and more (2,400+ backend commits)",
        "Integrated digital signatures, the XYP government data-exchange system and bank payments",
        "Led the Next.js 13 → 16 migration and introduced OpenTelemetry observability",
      ],
    },
    stack: ["Java 21", "Spring Boot", "Spring Cloud", "MongoDB", "Redis", "RabbitMQ", "AWS S3/SQS/SNS", "Azure Blob", "Next.js", "OpenTelemetry"],
  },
  {
    id: "octagon",
    // TODO(Тэргэл): Компанийн албан нэр, албан тушаал, дууссан огноо (эсвэл to: null).
    company: { mn: "Octagon", en: "Octagon" },
    url: "https://octagon.mn",
    role: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
    period: { from: "2021-10", to: "2026-08" },
    summary: {
      mn: "Монголын крипто валютын бирж. Арилжааны API, банкны интеграц, хэрэглэгчийн таних систем болон веб frontend-үүдийг хөгжүүлсэн.",
      en: "Mongolian cryptocurrency exchange. Built the exchange API, bank integrations, the identity service and the web frontends.",
    },
    highlights: {
      mn: [
        "Хаан, Голомт, ХХБ банкуудтай орлого / зарлагын автомат интеграц",
        "Exchange API: захиалга, хэтэвч, 2FA, WebSocket бодит цагийн ханш",
        "trade.octagon.mn, id.octagon.mn, NFT маркетплэйс frontend-үүд (Next.js)",
      ],
      en: [
        "Automated deposit / withdrawal integrations with Khan, Golomt and TDB banks",
        "Exchange API: orders, wallets, 2FA and real-time WebSocket price feeds",
        "Next.js frontends for trade.octagon.mn, id.octagon.mn and an NFT marketplace",
      ],
    },
    stack: ["Java 17/21", "Spring Boot", "MongoDB", "Redis", "WebSocket", "Next.js", "Docker"],
  },
  {
    id: "mnpost",
    // TODO(Тэргэл): «MnPost» нь Монгол Шуудан мөн үү, албан нэр, албан тушаал.
    company: { mn: "MnPost", en: "MnPost" },
    url: "https://mnpost.mn",
    role: { mn: "Backend хөгжүүлэгч", en: "Backend Developer" },
    period: { from: "2024-09", to: null },
    summary: {
      mn: "Шуудан, логистикийн үйлчилгээний систем. Backend-ийн үндсэн хөгжүүлэгч, удирдлагын веб апп.",
      en: "Postal and logistics service system. Primary backend developer, plus the admin web app.",
    },
    highlights: {
      mn: [
        "Backend-ийн үндсэн хөгжүүлэгч (1000+ commit)",
        "RabbitMQ дээр суурилсан мессеж урсгал, 2FA, удирдлагын API",
        "Next.js 13 удирдлагын frontend",
      ],
      en: [
        "Primary backend contributor (1,000+ commits)",
        "RabbitMQ-based messaging, 2FA and admin APIs",
        "Next.js 13 admin frontend",
      ],
    },
    stack: ["Java 17", "Spring Boot", "MongoDB", "RabbitMQ", "Next.js"],
  },
  {
    id: "yesh",
    // TODO(Тэргэл): Компанийн албан нэр, албан тушаал, дууссан огноо.
    company: { mn: "yesh.mn", en: "yesh.mn" },
    url: "https://yesh.mn",
    role: { mn: "Full-stack хөгжүүлэгч", en: "Full-stack Developer" },
    period: { from: "2021-03", to: "2025-10" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформ: сурагч ба багшийн API, веб болон мобайл апп.",
      en: "Online test-prep platform for Mongolia's national university entrance exam: student and teacher APIs, web and mobile apps.",
    },
    highlights: {
      mn: [
        "mobile-api, teacher-api Spring Boot сервисүүд",
        "yesh.mn веб (Next.js) ба мобайл апп",
        "Тест, даалгавар, үнэлгээний модулиуд",
      ],
      en: [
        "Spring Boot services: mobile-api and teacher-api",
        "yesh.mn web app (Next.js) and the mobile app",
        "Test, assignment and grading modules",
      ],
    },
    stack: ["Java 21", "Spring Boot", "MongoDB", "Next.js", "React Native"],
  },
  {
    id: "smart-transport",
    // TODO(Тэргэл): Захиалагч / компанийн нэр.
    company: { mn: "Smart Transport", en: "Smart Transport" },
    role: { mn: "Мобайл хөгжүүлэгч", en: "Mobile Developer" },
    period: { from: "2024-04", to: "2024-07" },
    summary: {
      mn: "Нийтийн тээврийн мобайл апп (React Native).",
      en: "Public-transport mobile app built with React Native.",
    },
    highlights: {
      mn: ["React Native, react-navigation, Firebase push мэдэгдэл"],
      en: ["React Native, react-navigation, Firebase push notifications"],
    },
    stack: ["React Native", "TypeScript", "Firebase"],
  },
  {
    id: "poweredmn",
    // TODO(Тэргэл): PoweredMN гэж юу вэ, live URL (powered.mn мөн үү?), албан тушаал.
    company: { mn: "PoweredMN", en: "PoweredMN" },
    role: { mn: "Frontend хөгжүүлэгч", en: "Frontend Developer" },
    period: { from: "2022-05", to: "2023-01" },
    summary: {
      mn: "Next.js дээр хийсэн вебсайт.",
      en: "Website built with Next.js.",
    },
    highlights: {
      mn: ["Next.js 13, SEO тохиргоо"],
      en: ["Next.js 13 with SEO setup"],
    },
    stack: ["Next.js", "React"],
  },
];
```

- [ ] **Step 7: `projects.ts` бичих**

`src/content/projects.ts`:
```ts
import type { Project } from "./types";

export const projects: Project[] = [
  // ---------- Ажлын ----------
  {
    slug: "e-geree",
    name: { mn: "e-geree.mn", en: "e-geree.mn" },
    kind: "work",
    role: { mn: "Backend архитектур, full-stack", en: "Backend architecture, full-stack" },
    period: { from: "2023-03", to: null },
    summary: {
      mn: "Цахим гэрээ байгуулах, цахим гарын үсгээр баталгаажуулах платформ. Auth, notification, PDF, SSO, 2FA микросервисүүд, ХУР ба банкны интеграц, Next.js frontend.",
      en: "E-contract platform with digital signatures. Auth, notification, PDF, SSO and 2FA microservices, XYP and bank integrations, Next.js frontend.",
    },
    highlights: {
      mn: [
        "Spring Cloud микросервисүүд, RabbitMQ, Redis, AWS SQS/SNS дээр асинхрон урсгал",
        "PDF үүсгэх, цахим гарын үсэг, гэрээний callback-ийн middleware-үүд",
        "Next.js 16, OpenTelemetry-тэй frontend",
      ],
      en: [
        "Spring Cloud microservices with async flows on RabbitMQ, Redis and AWS SQS/SNS",
        "Middleware for PDF generation, digital signatures and contract callbacks",
        "Next.js 16 frontend instrumented with OpenTelemetry",
      ],
    },
    stack: ["Java 21", "Spring Boot", "MongoDB", "Redis", "RabbitMQ", "AWS", "Next.js"],
    liveUrl: "https://e-geree.mn",
    featured: true,
  },
  {
    slug: "octagon-exchange",
    name: { mn: "Octagon Exchange", en: "Octagon Exchange" },
    kind: "work",
    role: { mn: "Exchange API, банкны интеграц, frontend", en: "Exchange API, bank integrations, frontend" },
    period: { from: "2021-10", to: "2026-08" },
    summary: {
      mn: "Крипто валютын биржийн API, банкны орлого / зарлагын автоматжуулалт, арилжааны болон нэвтрэлтийн веб.",
      en: "Crypto exchange API, automated bank deposits and withdrawals, trading and identity web apps.",
    },
    highlights: {
      mn: [
        "Хаан, Голомт, ХХБ-тай банкны API интеграц ба cron сервисүүд",
        "Захиалга, хэтэвч, 2FA, WebSocket ханшийн урсгал",
        "trade.octagon.mn, id.octagon.mn Next.js апп-ууд",
      ],
      en: [
        "Bank API integrations and cron services for Khan, Golomt and TDB",
        "Orders, wallets, 2FA and WebSocket price streams",
        "Next.js apps for trade.octagon.mn and id.octagon.mn",
      ],
    },
    stack: ["Java", "Spring Boot", "MongoDB", "Redis", "WebSocket", "Next.js"],
    liveUrl: "https://trade.octagon.mn",
    featured: true,
  },
  {
    slug: "mnpost",
    name: { mn: "MnPost", en: "MnPost" },
    kind: "work",
    role: { mn: "Backend хөгжүүлэгч", en: "Backend developer" },
    period: { from: "2024-09", to: null },
    summary: {
      mn: "Шуудан, логистикийн үйлчилгээний backend ба удирдлагын веб.",
      en: "Backend and admin web app for a postal and logistics service.",
    },
    highlights: {
      mn: ["RabbitMQ мессеж урсгал, 2FA, удирдлагын API", "Next.js 13 удирдлагын frontend"],
      en: ["RabbitMQ messaging, 2FA and admin APIs", "Next.js 13 admin frontend"],
    },
    stack: ["Java 17", "Spring Boot", "MongoDB", "RabbitMQ", "Next.js"],
    liveUrl: "https://mnpost.mn",
    featured: false,
  },
  {
    slug: "yesh",
    name: { mn: "yesh.mn", en: "yesh.mn" },
    kind: "work",
    role: { mn: "Full-stack", en: "Full-stack" },
    period: { from: "2021-03", to: "2025-10" },
    summary: {
      mn: "ЭЕШ-д бэлтгэх онлайн сургалтын платформ: тест, даалгавар, багшийн систем, веб ба мобайл апп.",
      en: "Test-prep platform for the national entrance exam: tests, assignments, teacher tools, web and mobile apps.",
    },
    highlights: {
      mn: ["mobile-api, teacher-api Spring Boot сервисүүд", "Next.js веб ба React Native апп"],
      en: ["Spring Boot mobile-api and teacher-api services", "Next.js web and React Native app"],
    },
    stack: ["Java", "Spring Boot", "MongoDB", "Next.js", "React Native"],
    liveUrl: "https://yesh.mn",
    featured: false,
  },

  // ---------- Хувийн / OSS ----------
  {
    slug: "ub-bus-tracker",
    name: { mn: "УБ Автобус", en: "UB Bus" },
    kind: "personal",
    role: { mn: "iOS апп, ганцаараа", en: "iOS app, solo" },
    period: { from: "2026-08", to: "2026-08" },
    summary: {
      mn: "Улаанбаатарын нийтийн тээврийн бодит цагийн iOS апп: ойролцоох буудлууд, автобус хэдэн минутын дараа ирэх, газрын зураг дээр хөдөлж буй автобус.",
      en: "Real-time iOS app for Ulaanbaatar public transport: nearby stops, minutes until arrival, buses moving live on the map.",
    },
    highlights: {
      mn: ["SwiftUI + MapKit, GPS-ээр хамгийн ойрын 5 буудал", "Чиглэл, буудлаар хайх, дуртай чиглэл хадгалах"],
      en: ["SwiftUI + MapKit, nearest 5 stops via GPS", "Search by route or stop, save favourite routes"],
    },
    stack: ["Swift", "SwiftUI", "MapKit"],
    featured: true,
  },
  {
    slug: "music-mixer",
    name: { mn: "Music Mixer", en: "Music Mixer" },
    kind: "personal",
    role: { mn: "Full-stack, ганцаараа", en: "Full-stack, solo" },
    // TODO(Тэргэл): Хугацаа ба repo URL (git түүх байхгүй).
    period: { from: "2026-07", to: "2026-07" },
    summary: {
      mn: "Нэг дуу оруулаад хоолой, бөмбөр, басс, хөгжим гэсэн 4 stem-д AI-аар салгаж, тус бүрийн дууг тохируулан синхрон тоглуулдаг веб апп.",
      en: "Upload a song, split it into vocals, drums, bass and other stems with AI, then mix and play them back in sync.",
    },
    highlights: {
      mn: ["Demucs (htdemucs) source separation, FastAPI async job", "Next.js + Web Audio API 4-stem синхрон миксер"],
      en: ["Demucs (htdemucs) source separation behind an async FastAPI job", "Next.js + Web Audio API four-stem synced mixer"],
    },
    stack: ["Python", "FastAPI", "Demucs", "Next.js", "Web Audio API"],
    featured: true,
  },
  {
    slug: "zamch",
    name: { mn: "Замч", en: "Zamch" },
    kind: "personal",
    role: { mn: "Full-stack, ганцаараа", en: "Full-stack, solo" },
    // TODO(Тэргэл): Live URL ба repo URL.
    period: { from: "2026-05", to: "2026-07" },
    summary: {
      mn: "Монголын аяллын замын мэдээлэл: явахаасаа өмнө замын нөхцөл, зогсоол, чиглэлээ мэдэх.",
      en: "Road-trip information for Mongolia: know the road conditions, stops and route before you leave.",
    },
    highlights: {
      mn: ["Next.js 16, Tailwind 4, Supabase", "Leaflet газрын зураг, замын дагуух буудлын тооцоолол"],
      en: ["Next.js 16, Tailwind 4, Supabase", "Leaflet maps with corridor-based stop lookup"],
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Leaflet"],
    featured: false,
  },
  {
    slug: "smart-hr",
    name: { mn: "Smart HR", en: "Smart HR" },
    kind: "personal",
    role: { mn: "Мобайл апп", en: "Mobile app" },
    period: { from: "2026-08", to: "2026-08" },
    summary: {
      mn: "React Native дээр хийсэн хүний нөөцийн мобайл апп.",
      en: "Human-resources mobile app built with React Native.",
    },
    highlights: {
      mn: ["React Native 0.8x, TypeScript, react-navigation"],
      en: ["React Native 0.8x, TypeScript, react-navigation"],
    },
    stack: ["React Native", "TypeScript"],
    featured: false,
  },
  {
    slug: "clickup-telegram-bot",
    name: { mn: "ClickUp → Telegram бот", en: "ClickUp → Telegram bot" },
    kind: "personal",
    role: { mn: "Python бот", en: "Python bot" },
    // TODO(Тэргэл): Хугацааг шалгах.
    period: { from: "2026-05", to: "2026-05" },
    summary: {
      mn: "ClickUp-ийн таскийн өөрчлөлтийг Telegram руу мэдэгдэл болгон илгээдэг бот.",
      en: "Bot that forwards ClickUp task changes to Telegram as notifications.",
    },
    highlights: {
      mn: ["ClickUp API, Telegram Bot API"],
      en: ["ClickUp API, Telegram Bot API"],
    },
    stack: ["Python"],
    repoUrl: "https://github.com/Bttlg/ClickUp-Telegram-Bot",
    featured: false,
  },
  {
    slug: "spring-boot-initializer",
    name: { mn: "spring-boot-initializer", en: "spring-boot-initializer" },
    kind: "personal",
    role: { mn: "Template", en: "Template" },
    // TODO(Тэргэл): Хугацааг шалгах.
    period: { from: "2022-01", to: "2022-01" },
    summary: {
      mn: "Шинэ Spring Boot төсөл эхлүүлэх зориулалттай эхлэлийн template.",
      en: "Starter template for bootstrapping new Spring Boot projects.",
    },
    highlights: {
      mn: ["Gradle, Spring Boot суурь бүтэц"],
      en: ["Gradle and Spring Boot base structure"],
    },
    stack: ["Java", "Spring Boot", "Gradle"],
    repoUrl: "https://github.com/Bttlg/spring-boot-initializer",
    featured: false,
  },
];
```

- [ ] **Step 8: `skills.ts`, `education.ts`, `index.ts` бичих**

`src/content/skills.ts`:
```ts
import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    id: "backend",
    label: { mn: "Backend", en: "Backend" },
    items: ["Java", "Spring Boot", "Spring Cloud", "Spring Security / JWT", "MongoDB", "Redis", "RabbitMQ", "gRPC", "WebSocket", "REST / OpenAPI", "MapStruct", "Feign", "Resilience4j"],
  },
  {
    id: "frontend",
    label: { mn: "Frontend", en: "Frontend" },
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "React Query", "react-hook-form", "socket.io", "Chart.js / Recharts", "next-intl"],
  },
  {
    id: "mobile",
    label: { mn: "Мобайл", en: "Mobile" },
    items: ["React Native", "Swift / SwiftUI", "MapKit", "Firebase"],
  },
  {
    id: "infra",
    label: { mn: "Cloud / Infra", en: "Cloud / Infra" },
    items: ["AWS (S3, SQS, SNS)", "Azure Blob", "Docker", "GitHub Actions", "OpenTelemetry", "Prometheus"],
  },
  {
    id: "tools",
    label: { mn: "Бусад", en: "Other" },
    items: ["Git", "Gradle", "Python / FastAPI", "Web Audio API"],
  },
];
```

`src/content/education.ts`:
```ts
import type { Education } from "./types";

// TODO(Тэргэл): Боловсролоо нэмэх. Хоосон байхад нүүр ба CV дээр section гарахгүй.
// Жишээ:
// {
//   school: { mn: "МУИС, Мэдээллийн технологийн сургууль", en: "National University of Mongolia, School of IT" },
//   degree: { mn: "Программ хангамжийн бакалавр", en: "B.Sc. in Software Engineering" },
//   period: { from: "2017-09", to: "2021-06" },
// },
export const education: Education[] = [];
```

`src/content/index.ts`:
```ts
import { experience } from "./experience";

export { profile } from "./profile";
export { experience } from "./experience";
export { projects } from "./projects";
export { skills } from "./skills";
export { education } from "./education";
export { ui } from "./ui";
export type { Localized, Period, Profile, Experience, Project, SkillGroup, Education, UiDict, Ui } from "./types";

/** Earliest "YYYY-MM" across all experience entries; drives the "N+ years" fact. */
export const experienceStart: string = experience.map((e) => e.period.from).sort()[0];
```

- [ ] **Step 9: Тест ногоон болсныг шалгах**

Run: `npx vitest run src/content/content.test.ts && npm run typecheck && npm run lint`
Expected: бүх тест PASS (parity, url, period, featured, experienceStart = `2021-03`), typecheck/lint цэвэр. Хэрэв parity тест унавал алдааны path-ыг дагаж MN/EN массивын урт эсвэл хоосон string-ийг засах.

- [ ] **Step 10: Commit**

```bash
git add src/content
git commit -m "feat: add typed bilingual content model and draft content

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Дизайн token, root layout, `/` redirect хуудас, 404, favicon

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/app/page.tsx` (солино), `src/app/page.test.tsx`, `src/app/not-found.tsx`, `src/app/not-found.test.tsx`, `src/app/icon.svg`

**Interfaces:**
- Consumes: `LOCALES`, `DEFAULT_LOCALE`, `localePath` (`@/lib/i18n`), `REDIRECT_SCRIPT`, `SITE_URL`, `profile`, `ui`.
- Produces: `.fade-up` CSS класс, print CSS, root `metadata.metadataBase`. Бусад task энэ файлуудыг өөрчлөхгүй.

- [ ] **Step 1: `/` хуудас ба 404-ийн тест бичих**

`src/app/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "./page";
import { REDIRECT_SCRIPT } from "@/lib/redirect-script";

describe("/ redirect page", () => {
  it("links to both locales", () => {
    render(<Page />);
    expect(screen.getByRole("link", { name: "Монгол" })).toHaveAttribute("href", "/mn/");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/");
  });
  it("ships the redirect script inline", () => {
    const { container } = render(<Page />);
    const script = container.querySelector("script");
    expect(script?.innerHTML).toBe(REDIRECT_SCRIPT);
  });
  it("has a no-JS meta refresh fallback to /mn/", () => {
    render(<Page />);
    const meta = document.head.querySelector('meta[http-equiv="refresh"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute("content")).toBe("0;url=/mn/");
  });
  it("is not indexed and points canonical at /mn/", () => {
    expect(metadata.robots).toMatchObject({ index: false });
    expect(metadata.alternates).toMatchObject({ canonical: "/mn/" });
  });
});
```

`src/app/not-found.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
import { ui } from "@/content";

describe("404 page", () => {
  it("shows both languages with links home", () => {
    render(<NotFound />);
    expect(screen.getByText(ui.mn.notFound.title)).toBeInTheDocument();
    expect(screen.getByText(ui.en.notFound.title)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `${ui.mn.notFound.home} →` })).toHaveAttribute("href", "/mn/");
    expect(screen.getByRole("link", { name: `${ui.en.notFound.home} →` })).toHaveAttribute("href", "/en/");
  });
  it("asks robots not to index", () => {
    render(<NotFound />);
    expect(document.head.querySelector('meta[name="robots"][content="noindex"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/app`
Expected: FAIL — `page.tsx` `metadata` export байхгүй / линк олдохгүй; `not-found.tsx` файл байхгүй.

- [ ] **Step 3: `globals.css`-ийг бүтнээр бичих**

`src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-canvas: #09090b;
  --color-surface: #18181b;
  --color-border: #27272a;
  --color-fg: #f4f4f5;
  --color-muted: #a1a1aa;
  --color-accent: #34d399;
}

@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-canvas);
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Keyboard focus is always visible, in accent. */
:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.fade-up {
  animation: fade-up 0.5s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .fade-up {
    animation: none;
  }
}

@media print {
  @page {
    size: A4;
    margin: 14mm;
  }
  html {
    color-scheme: light;
  }
  body {
    background: #fff !important;
    color: #000;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
}
```

- [ ] **Step 4: Root layout-д `metadataBase` нэмэх**

`src/app/layout.tsx` (бүтэн):
```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: `/` redirect хуудас бичих**

`src/app/page.tsx`:
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_LOCALE, LOCALES, localePath } from "@/lib/i18n";
import { REDIRECT_SCRIPT } from "@/lib/redirect-script";
import { profile, ui } from "@/content";

export const metadata: Metadata = {
  title: `${profile.name.mn} · ${profile.name.en}`,
  description: profile.tagline.en,
  robots: { index: false, follow: true },
  alternates: { canonical: localePath(DEFAULT_LOCALE) },
};

/**
 * "/" has no locale. The inline script picks one (saved > browser > mn) and
 * replaces the URL before paint; the meta refresh covers no-JS visitors.
 */
export default function RootRedirectPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <meta httpEquiv="refresh" content={`0;url=${localePath(DEFAULT_LOCALE)}`} />
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <p className="font-mono text-sm text-accent">{ui.mn.hero.prompt}</p>
      <h1 className="text-3xl font-bold tracking-tight">
        {profile.name.mn} <span className="font-normal text-muted">/ {profile.name.en}</span>
      </h1>
      <nav className="flex gap-6 font-mono" aria-label="Language">
        {LOCALES.map((locale) => (
          <Link
            key={locale}
            href={localePath(locale)}
            lang={locale}
            hrefLang={locale}
            className="text-fg underline-offset-4 hover:text-accent hover:underline"
          >
            {ui[locale].langName}
          </Link>
        ))}
      </nav>
    </main>
  );
}
```

- [ ] **Step 6: 404 хуудас ба favicon бичих**

`src/app/not-found.tsx`:
```tsx
import Link from "next/link";
import { LOCALES, localePath } from "@/lib/i18n";
import { ui } from "@/content";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <meta name="robots" content="noindex" />
      <h1 className="font-mono text-6xl font-bold text-accent">404</h1>
      {LOCALES.map((locale) => (
        <div key={locale} lang={locale} className="mt-8">
          <h2 className="text-2xl font-semibold text-fg">{ui[locale].notFound.title}</h2>
          <p className="mt-1 text-muted">{ui[locale].notFound.body}</p>
          <Link
            href={localePath(locale)}
            className="mt-2 inline-block font-mono text-accent underline-offset-4 hover:underline"
          >
            {ui[locale].notFound.home} →
          </Link>
        </div>
      ))}
    </main>
  );
}
```

`src/app/icon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#09090b"/>
  <text x="32" y="44" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="36" font-weight="700" fill="#34d399">T</text>
  <rect x="44" y="40" width="8" height="4" fill="#34d399"/>
</svg>
```

- [ ] **Step 7: Тест ногоон, build амжилттай**

Run: `npx vitest run src/app && npm run lint && npm run typecheck && npm run build`
Expected: тестүүд PASS; `out/index.html` дотор `http-equiv="refresh"` ба `location.replace` string байгаа (`grep -c 'http-equiv="refresh"' out/index.html` → 1); `out/404.html` дотор «Хуудас олдсонгүй» байгаа; `ls out/icon*.svg` нэг файл өгнө (Next нэрэнд hash нэмж болно).

- [ ] **Step 8: Commit**

```bash
git add src/app
git commit -m "feat: dark theme tokens, root layout, locale redirect page and 404

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: `[lang]` layout, Nav, LangSwitch, Footer, Section, Chip, Icon

**Files:**
- Create: `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx` (түр), `src/components/Nav.tsx`, `src/components/Nav.test.tsx`, `src/components/LangSwitch.tsx`, `src/components/LangSwitch.test.tsx`, `src/components/Footer.tsx`, `src/components/Section.tsx`, `src/components/Chip.tsx`, `src/components/Icon.tsx`

**Interfaces:**
- Consumes: `@/lib/i18n`, `@/lib/site`, `@/content`.
- Produces:
  - `Nav({ lang: Locale })`, `Footer({ lang: Locale })`, `LangSwitch({ lang: Locale })` (client)
  - `Section({ id: string; title: string; label?: string; children; className? })` — `label` default = `id`, mono `// {label}` гарчгийн дээр
  - `Chip({ children })`
  - `Icon({ name: IconName; className?: string })`, `type IconName = "github" | "linkedin" | "mail" | "external" | "print" | "arrow"`
  - `src/app/[lang]/layout.tsx`: `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, `<div lang={lang}>` → Nav, `<main>`, Footer

- [ ] **Step 1: LangSwitch ба Nav тест бичих**

`src/components/LangSwitch.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const usePathname = vi.fn<() => string>();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

import { LangSwitch } from "./LangSwitch";

describe("LangSwitch", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("links to the same sub-path in the other locale", () => {
    usePathname.mockReturnValue("/mn/cv/");
    render(<LangSwitch lang="mn" />);
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/cv/");
    expect(screen.queryByRole("link", { name: "MN" })).toBeNull();
    expect(screen.getByText("MN")).toHaveAttribute("aria-current", "true");
  });

  it("links home when on the locale root", () => {
    usePathname.mockReturnValue("/en/");
    render(<LangSwitch lang="en" />);
    expect(screen.getByRole("link", { name: "MN" })).toHaveAttribute("href", "/mn/");
  });

  it("remembers the chosen locale", () => {
    usePathname.mockReturnValue("/mn/");
    render(<LangSwitch lang="mn" />);
    fireEvent.click(screen.getByRole("link", { name: "EN" }));
    expect(localStorage.getItem("locale")).toBe("en");
  });
});
```

`src/components/Nav.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/" }));

import { Nav } from "./Nav";
import { ui } from "@/content";

describe("Nav", () => {
  it("renders brand, section anchors, CV link and language switch", () => {
    render(<Nav lang="en" />);
    expect(screen.getByRole("link", { name: ui.en.brand })).toHaveAttribute("href", "/en/");
    expect(screen.getByRole("link", { name: ui.en.nav.projects })).toHaveAttribute("href", "/en/#projects");
    expect(screen.getByRole("link", { name: ui.en.nav.cv })).toHaveAttribute("href", "/en/cv/");
    expect(screen.getByRole("link", { name: "MN" })).toHaveAttribute("href", "/mn/");
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/components`
Expected: FAIL — `./LangSwitch`, `./Nav` олдохгүй.

- [ ] **Step 3: Chip, Icon, Section бичих**

`src/components/Chip.tsx`:
```tsx
import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
```

`src/components/Icon.tsx`:
```tsx
export type IconName = "github" | "linkedin" | "mail" | "external" | "print" | "arrow";

const PATHS: Record<IconName, string> = {
  github:
    "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 1 0 0-4z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
  external: "M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  print:
    "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6M6 14h12v8H6z",
  arrow: "M5 12h14m-7-7 7 7-7 7",
};

export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
```

`src/components/Section.tsx`:
```tsx
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  /** Mono label shown as `// label`; defaults to the id. */
  label?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, label = id, children, className = "" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      <p className="font-mono text-sm text-accent">{`// ${label}`}</p>
      <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: LangSwitch, Nav, Footer бичих**

`src/components/LangSwitch.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, localePath, stripLocale, type Locale } from "@/lib/i18n";

/** MN | EN toggle. Links to the same sub-path in the other locale and remembers the choice. */
export function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? "/";
  const sub = stripLocale(pathname);

  return (
    <div className="flex items-center font-mono text-sm" role="group" aria-label="Language">
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center">
          {index > 0 && (
            <span className="px-1.5 text-border" aria-hidden="true">
              |
            </span>
          )}
          {locale === lang ? (
            <span className="text-fg" aria-current="true">
              {locale.toUpperCase()}
            </span>
          ) : (
            <Link
              href={localePath(locale, sub)}
              hrefLang={locale}
              lang={locale}
              className="text-muted hover:text-accent"
              onClick={() => {
                try {
                  localStorage.setItem("locale", locale);
                } catch {
                  // storage may be unavailable (private mode); the link still works
                }
              }}
            >
              {locale.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
```

`src/components/Nav.tsx`:
```tsx
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { ui } from "@/content";
import { LangSwitch } from "./LangSwitch";

const SECTION_IDS = ["about", "skills", "experience", "projects", "contact"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const home = localePath(lang);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-canvas/80 backdrop-blur print:hidden">
      <nav
        aria-label={t.nav.label}
        className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href={home} className="font-mono text-sm font-semibold text-fg hover:text-accent">
          {t.brand}
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-4 font-mono text-sm text-muted md:flex">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <Link href={`${home}#${id}`} className="hover:text-fg">
                  {t.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={localePath(lang, "/cv")}
            className="rounded-md border border-border px-2.5 py-1 font-mono text-sm text-fg hover:border-accent hover:text-accent"
          >
            {t.nav.cv}
          </Link>
          <LangSwitch lang={lang} />
        </div>
      </nav>
    </header>
  );
}
```

`src/components/Footer.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";

export function Footer({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 py-8 print:hidden">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {profile.name[lang]}
        </p>
        <p>
          {t.footer.builtWith} ·{" "}
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: `[lang]` layout ба түр нүүр хуудас бичих**

`src/app/[lang]/layout.tsx`:
```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LOCALES, hasLocale, localePath } from "@/lib/i18n";
import { profile } from "@/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

type Params = Promise<{ lang: string }>;

// Static export: only the locales from generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const name = profile.name[lang];
  const title = `${name} — ${profile.title[lang]}`;
  const description = profile.tagline[lang];

  return {
    title: { default: title, template: `%s · ${name}` },
    description,
    alternates: {
      canonical: localePath(lang),
      languages: {
        mn: localePath("mn"),
        en: localePath("en"),
        "x-default": localePath("mn"),
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "mn" ? "mn_MN" : "en_US",
      url: localePath(lang),
      siteName: name,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div lang={lang} className="flex min-h-screen flex-col">
      <Nav lang={lang} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 break-words sm:px-6">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
```

`src/app/[lang]/page.tsx` (түр; Task 8-д бүтнээр солигдоно):
```tsx
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { profile } from "@/content";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <h1 className="py-20 text-4xl font-bold">{profile.name[lang]}</h1>;
}
```

- [ ] **Step 6: Тест ногоон, build-д `/mn/`, `/en/` гарч байгааг шалгах**

Run: `npx vitest run src/components && npm run lint && npm run typecheck && npm run build && ls out/mn out/en`
Expected: тестүүд PASS; `out/mn/index.html`, `out/en/index.html` байна; `grep -c 'lang="en"' out/en/index.html` ≥ 1; `grep -c 'hreflang="en"' out/mn/index.html` ≥ 1.

- [ ] **Step 7: Commit**

```bash
git add src/app src/components
git commit -m "feat: locale layout with nav, language switch and footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Hero, About, Skills, SocialLinks

**Files:**
- Create: `src/components/SocialLinks.tsx`, `src/components/SocialLinks.test.tsx`, `src/components/Hero.tsx`, `src/components/About.tsx`, `src/components/About.test.tsx`, `src/components/Skills.tsx`

**Interfaces:**
- Consumes: `Section`, `Chip`, `Icon`, `ui`, `profile`, `skills`, `experienceStart`, `yearsSince`, `localePath`.
- Produces: `SocialLinks({ lang: Locale; showLabels?: boolean })`, `Hero({ lang })`, `About({ lang; now?: Date })`, `Skills({ lang })`.

- [ ] **Step 1: SocialLinks ба About тест бичих**

`src/components/SocialLinks.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content")>();
  return { ...actual, profile: { ...actual.profile, linkedin: "" } };
});

import { SocialLinks } from "./SocialLinks";
import { profile, ui } from "@/content";

describe("SocialLinks", () => {
  it("renders email and GitHub, hides LinkedIn when empty", () => {
    render(<SocialLinks lang="en" showLabels />);
    expect(screen.getByRole("link", { name: ui.en.contact.email })).toHaveAttribute("href", `mailto:${profile.email}`);
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("href", profile.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "LinkedIn" })).toBeNull();
  });

  it("uses aria-labels when labels are hidden", () => {
    render(<SocialLinks lang="mn" />);
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.queryByText("GitHub")).toBeNull();
  });
});
```

`src/components/About.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { profile, ui, experienceStart } from "@/content";

describe("About", () => {
  it("renders paragraphs and a computed years fact", () => {
    const startYear = Number(experienceStart.slice(0, 4));
    render(<About lang="mn" now={new Date(startYear + 5, 11, 31)} />);
    profile.about.mn.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
    expect(screen.getByText(ui.mn.about.yearsValue.replace("{n}", "5"))).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.mn.sections.about })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/components/SocialLinks.test.tsx src/components/About.test.tsx`
Expected: FAIL — модулиуд олдохгүй.

- [ ] **Step 3: SocialLinks бичих**

`src/components/SocialLinks.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { Icon, type IconName } from "./Icon";

interface Item {
  key: string;
  href: string;
  label: string;
  icon: IconName;
  external: boolean;
}

/** Email, GitHub and (when set) LinkedIn. Shared by Hero, Contact and CV. */
export function SocialLinks({ lang, showLabels = false }: { lang: Locale; showLabels?: boolean }) {
  const t = ui[lang];
  const items: Item[] = [
    { key: "email", href: `mailto:${profile.email}`, label: t.contact.email, icon: "mail", external: false },
    { key: "github", href: profile.github, label: "GitHub", icon: "github", external: true },
  ];
  if (profile.linkedin) {
    items.push({ key: "linkedin", href: profile.linkedin, label: "LinkedIn", icon: "linkedin", external: true });
  }

  return (
    <ul className="flex flex-wrap items-center gap-4">
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            aria-label={showLabels ? undefined : item.label}
            className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-accent"
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {showLabels && <span>{item.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Hero, About, Skills бичих**

`src/components/Hero.tsx`:
```tsx
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { SocialLinks } from "./SocialLinks";

export function Hero({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <section aria-labelledby="hero-title" className="fade-up relative pt-20 pb-12 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <p className="font-mono text-sm text-accent">{t.hero.prompt}</p>
      <h1 id="hero-title" className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
        {profile.name[lang]}
      </h1>
      <p className="mt-3 font-mono text-lg text-muted">{profile.title[lang]}</p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.tagline[lang]}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="rounded-md bg-accent px-4 py-2 font-medium text-canvas hover:opacity-90"
        >
          {t.actions.viewProjects}
        </a>
        <Link
          href={localePath(lang, "/cv")}
          className="rounded-md border border-border px-4 py-2 font-medium text-fg hover:border-accent"
        >
          {t.actions.viewCv}
        </Link>
        <a href="#contact" className="px-2 py-2 font-medium text-muted hover:text-fg">
          {t.actions.contactMe} →
        </a>
      </div>
      <div className="mt-8">
        <SocialLinks lang={lang} />
      </div>
    </section>
  );
}
```

`src/components/About.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { yearsSince } from "@/lib/dates";
import { profile, ui, experienceStart } from "@/content";
import { Section } from "./Section";

/** `now` is injectable for tests; at build time it is the build date. */
export function About({ lang, now = new Date() }: { lang: Locale; now?: Date }) {
  const t = ui[lang];
  const years = yearsSince(experienceStart, now);
  const facts = [
    { label: t.about.years, value: t.about.yearsValue.replace("{n}", String(years)) },
    ...profile.facts.map((f) => ({ label: f.label[lang], value: f.value[lang] })),
  ];

  return (
    <Section id="about" title={t.sections.about}>
      <div className="grid gap-8 md:grid-cols-[1fr_220px]">
        <div className="space-y-4 leading-relaxed text-muted">
          {profile.about[lang].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="space-y-3 font-mono text-sm">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-muted">{fact.label}</dt>
              <dd className="text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
```

`src/components/Skills.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { skills, ui } from "@/content";
import { Section } from "./Section";
import { Chip } from "./Chip";

export function Skills({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="skills" title={t.sections.skills}>
      <dl className="space-y-6">
        {skills.map((group) => (
          <div key={group.id} className="grid gap-2 sm:grid-cols-[140px_1fr]">
            <dt className="font-mono text-sm text-fg">{group.label[lang]}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
```

- [ ] **Step 5: Тест ногоон, lint/typecheck**

Run: `npx vitest run src/components && npm run lint && npm run typecheck`
Expected: PASS, 0 exit.

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "feat: hero, about and skills sections with social links

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Experience timeline, ProjectCard, Projects

**Files:**
- Create: `src/components/Experience.tsx`, `src/components/ProjectCard.tsx`, `src/components/ProjectCard.test.tsx`, `src/components/Projects.tsx`, `src/components/Projects.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Chip`, `Icon`, `formatPeriod`, `experience`, `projects`, `ui`, `Project` төрөл.
- Produces: `Experience({ lang })`, `ProjectCard({ project: Project; lang: Locale })`, `Projects({ lang })`, `sortFeaturedFirst(list: Project[]): Project[]` (Projects.tsx-ээс export, CV-д дахин ашиглана).

- [ ] **Step 1: ProjectCard ба Projects тест бичих**

`src/components/ProjectCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { ui, type Project } from "@/content";

const base: Project = {
  slug: "demo",
  name: { mn: "Демо", en: "Demo" },
  kind: "personal",
  role: { mn: "Ганцаараа", en: "Solo" },
  period: { from: "2025-01", to: null },
  summary: { mn: "Тайлбар", en: "Summary" },
  highlights: { mn: ["a", "b", "c", "d"], en: ["a", "b", "c", "d"] },
  stack: ["Next.js", "TypeScript"],
  featured: false,
};

describe("ProjectCard", () => {
  it("renders name, role, period, summary, at most 3 highlights and stack chips", () => {
    render(<ProjectCard project={base} lang="en" />);
    expect(screen.getByRole("heading", { name: "Demo" })).toBeInTheDocument();
    expect(screen.getByText("Solo")).toBeInTheDocument();
    expect(screen.getByText("Jan 2025 – Present")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("renders no links when urls are missing", () => {
    render(<ProjectCard project={base} lang="en" />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders live and source links as safe external links", () => {
    render(
      <ProjectCard
        project={{ ...base, liveUrl: "https://demo.example", repoUrl: "https://github.com/x/demo" }}
        lang="mn"
      />,
    );
    const live = screen.getByRole("link", { name: ui.mn.actions.live });
    expect(live).toHaveAttribute("href", "https://demo.example");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: ui.mn.actions.source })).toHaveAttribute(
      "href",
      "https://github.com/x/demo",
    );
  });
});
```

`src/components/Projects.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Projects, sortFeaturedFirst } from "./Projects";
import { projects, ui, type Project } from "@/content";

describe("sortFeaturedFirst", () => {
  it("puts featured first and keeps original order otherwise", () => {
    const mk = (slug: string, featured: boolean): Project => ({
      slug,
      name: { mn: slug, en: slug },
      kind: "work",
      role: { mn: "r", en: "r" },
      period: { from: "2024-01", to: null },
      summary: { mn: "s", en: "s" },
      highlights: { mn: [], en: [] },
      stack: [],
      featured,
    });
    const sorted = sortFeaturedFirst([mk("a", false), mk("b", true), mk("c", false), mk("d", true)]);
    expect(sorted.map((p) => p.slug)).toEqual(["b", "d", "a", "c"]);
  });
});

describe("Projects", () => {
  it("splits work and personal projects into two groups", () => {
    render(<Projects lang="en" />);
    const work = screen.getByRole("region", { name: ui.en.sections.work });
    const personal = screen.getByRole("region", { name: ui.en.sections.personal });
    expect(within(work).getAllByRole("article")).toHaveLength(projects.filter((p) => p.kind === "work").length);
    expect(within(personal).getAllByRole("article")).toHaveLength(
      projects.filter((p) => p.kind === "personal").length,
    );
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/components/ProjectCard.test.tsx src/components/Projects.test.tsx`
Expected: FAIL — модулиуд олдохгүй.

- [ ] **Step 3: Experience бичих**

`src/components/Experience.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import { experience, ui } from "@/content";
import { Section } from "./Section";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

export function Experience({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="experience" title={t.sections.experience}>
      <ol className="relative border-l border-border pl-6">
        {experience.map((entry) => (
          <li key={entry.id} className="relative pb-10 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[29px] h-3 w-3 rounded-full border-2 border-accent bg-canvas"
            />
            <p className="font-mono text-xs text-muted">{formatPeriod(entry.period, lang, t.cv.present)}</p>
            <h3 className="mt-1 text-lg font-semibold text-fg">
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-accent"
                >
                  {entry.company[lang]}
                  <Icon name="external" className="h-3.5 w-3.5 text-muted" />
                </a>
              ) : (
                entry.company[lang]
              )}
            </h3>
            <p className="font-mono text-sm text-accent">{entry.role[lang]}</p>
            <p className="mt-2 text-muted">{entry.summary[lang]}</p>
            {entry.highlights[lang].length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {entry.highlights[lang].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.stack.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 4: ProjectCard ба Projects бичих**

`src/components/ProjectCard.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import { ui, type Project } from "@/content";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

const MAX_HIGHLIGHTS = 3;

export function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  const t = ui[lang];
  const highlights = project.highlights[lang].slice(0, MAX_HIGHLIGHTS);

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface/60 p-5 transition-colors hover:border-accent/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">{project.name[lang]}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{formatPeriod(project.period, lang, t.cv.present)}</span>
      </div>
      <p className="mt-1 font-mono text-xs text-accent">{project.role[lang]}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary[lang]}</p>
      {highlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
      {(project.liveUrl || project.repoUrl) && (
        <div className="mt-auto flex gap-5 pt-5 font-mono text-sm">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg hover:text-accent"
            >
              {t.actions.live}
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg hover:text-accent"
            >
              {t.actions.source}
              <Icon name="external" className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
```

`src/components/Projects.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { projects, ui, type Project } from "@/content";
import { Section } from "./Section";
import { ProjectCard } from "./ProjectCard";

/** Stable sort: featured projects first, original order otherwise. */
export function sortFeaturedFirst(list: Project[]): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
}

function Group({ id, title, items, lang }: { id: string; title: string; items: Project[]; lang: Locale }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={`${id}-title`} className="mt-10 first:mt-0">
      <h3 id={`${id}-title`} className="font-mono text-sm text-muted">
        {title}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((project) => (
          <ProjectCard key={project.slug} project={project} lang={lang} />
        ))}
      </div>
    </section>
  );
}

export function Projects({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const work = sortFeaturedFirst(projects.filter((p) => p.kind === "work"));
  const personal = sortFeaturedFirst(projects.filter((p) => p.kind === "personal"));

  return (
    <Section id="projects" title={t.sections.projects}>
      <Group id="projects-work" title={t.sections.work} items={work} lang={lang} />
      <Group id="projects-personal" title={t.sections.personal} items={personal} lang={lang} />
    </Section>
  );
}
```

- [ ] **Step 5: Тест ногоон, lint/typecheck**

Run: `npx vitest run src/components && npm run lint && npm run typecheck`
Expected: PASS. (`getByRole("region", { name })` нь `<section aria-labelledby>`-той ажиллана.)

- [ ] **Step 6: Commit**

```bash
git add src/components
git commit -m "feat: experience timeline and project cards

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Contact, JSON-LD, нүүр хуудсыг угсрах

**Files:**
- Create: `src/components/Contact.tsx`, `src/lib/jsonld.ts`, `src/lib/jsonld.test.ts`, `src/components/JsonLd.tsx`
- Modify: `src/app/[lang]/page.tsx` (бүтнээр солино)

**Interfaces:**
- Consumes: бүх section компонентууд, `SocialLinks`, `profile`, `ui`, `SITE_URL`, `localePath`.
- Produces: `Contact({ lang })`, `personJsonLd(lang: Locale): Record<string, unknown>`, `JsonLd({ lang })`; бүтэн нүүр хуудас.

- [ ] **Step 1: jsonld тест бичих**

`src/lib/jsonld.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { personJsonLd } from "./jsonld";
import { profile } from "@/content";

describe("personJsonLd", () => {
  it("describes a Person with url and sameAs", () => {
    const ld = personJsonLd("en");
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe(profile.name.en);
    expect(ld.jobTitle).toBe(profile.title.en);
    expect(ld.url).toBe("https://bttlg.github.io/en/");
    expect(ld.email).toBe(`mailto:${profile.email}`);
    const sameAs = ld.sameAs as string[];
    expect(sameAs).toContain(profile.github);
    if (!profile.linkedin) expect(sameAs).toHaveLength(1);
    else expect(sameAs).toContain(profile.linkedin);
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/lib/jsonld.test.ts`
Expected: FAIL — `./jsonld` олдохгүй.

- [ ] **Step 3: jsonld, JsonLd, Contact бичих**

`src/lib/jsonld.ts`:
```ts
import { localePath, type Locale } from "./i18n";
import { SITE_URL } from "./site";
import { profile } from "@/content";

/** schema.org Person for the home page. */
export function personJsonLd(lang: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name[lang],
    jobTitle: profile.title[lang],
    description: profile.tagline[lang],
    url: `${SITE_URL}${localePath(lang)}`,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, ...(profile.linkedin ? [profile.linkedin] : [])],
    address: { "@type": "PostalAddress", addressLocality: profile.location[lang] },
  };
}
```

`src/components/JsonLd.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/jsonld";

export function JsonLd({ lang }: { lang: Locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(lang)) }}
    />
  );
}
```

`src/components/Contact.tsx`:
```tsx
import type { Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { Section } from "./Section";
import { SocialLinks } from "./SocialLinks";

export function Contact({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="contact" title={t.sections.contact}>
      <p className="max-w-2xl leading-relaxed text-muted">{t.contact.body}</p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-6 inline-block font-mono text-xl text-fg underline-offset-4 hover:text-accent hover:underline"
      >
        {profile.email}
      </a>
      <div className="mt-6">
        <SocialLinks lang={lang} showLabels />
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Нүүр хуудсыг угсрах**

`src/app/[lang]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <JsonLd lang={lang} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Skills lang={lang} />
      <Experience lang={lang} />
      <Projects lang={lang} />
      <Contact lang={lang} />
    </>
  );
}
```

- [ ] **Step 5: Тест, lint, typecheck, build**

Run: `npm run test && npm run lint && npm run typecheck && npm run build`
Expected: бүгд PASS; `grep -c 'application/ld+json' out/en/index.html` → 1; `grep -c 'id="projects"' out/mn/index.html` → 1.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: contact section, Person JSON-LD and assembled home page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: CV хуудас (print-friendly)

**Files:**
- Create: `src/components/cv/CvDocument.tsx`, `src/components/cv/CvDocument.test.tsx`, `src/components/cv/PrintButton.tsx`, `src/app/[lang]/cv/page.tsx`

**Interfaces:**
- Consumes: `profile`, `experience`, `projects`, `skills`, `education`, `ui`, `formatPeriod`, `sortFeaturedFirst`, `hasLocale`, `localePath`.
- Produces: `CvDocument({ lang: Locale; data?: CvData })`, `interface CvData { profile; experience; projects; skills; education }`, `defaultCvData: CvData`, `PrintButton({ label: string })` (client).

- [ ] **Step 1: CvDocument тест бичих**

`src/components/cv/CvDocument.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CvDocument, defaultCvData } from "./CvDocument";
import { ui, type Education } from "@/content";

const sampleEducation: Education = {
  school: { mn: "МУИС", en: "NUM" },
  degree: { mn: "Бакалавр", en: "B.Sc." },
  period: { from: "2017-09", to: "2021-06" },
};

describe("CvDocument", () => {
  it("renders header, summary, experience, projects and skills", () => {
    render(<CvDocument lang="en" />);
    expect(screen.getByRole("heading", { level: 1, name: defaultCvData.profile.name.en })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.cv.summary })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.sections.experience })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.cv.featuredProjects })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: ui.en.sections.skills })).toBeInTheDocument();
  });

  it("hides education when empty and shows it when present", () => {
    const { unmount } = render(<CvDocument lang="mn" data={{ ...defaultCvData, education: [] }} />);
    expect(screen.queryByRole("heading", { name: ui.mn.sections.education })).toBeNull();
    unmount();

    render(<CvDocument lang="mn" data={{ ...defaultCvData, education: [sampleEducation] }} />);
    expect(screen.getByRole("heading", { name: ui.mn.sections.education })).toBeInTheDocument();
    expect(screen.getByText("МУИС")).toBeInTheDocument();
    expect(screen.getByText("2017.09 – 2021.06")).toBeInTheDocument();
  });

  it("lists featured projects before the rest", () => {
    render(<CvDocument lang="en" />);
    const names = screen.getAllByTestId("cv-project").map((el) => el.textContent);
    const expected = [...defaultCvData.projects]
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 6)
      .map((p) => p.name.en);
    expect(names).toEqual(expected);
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/components/cv`
Expected: FAIL — `./CvDocument` олдохгүй.

- [ ] **Step 3: CvDocument ба PrintButton бичих**

`src/components/cv/CvDocument.tsx`:
```tsx
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { formatPeriod } from "@/lib/dates";
import {
  profile,
  experience,
  projects,
  skills,
  education,
  ui,
  type Profile,
  type Experience,
  type Project,
  type SkillGroup,
  type Education,
} from "@/content";
import { sortFeaturedFirst } from "@/components/Projects";

export interface CvData {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
}

export const defaultCvData: CvData = { profile, experience, projects, skills, education };

const MAX_CV_PROJECTS = 6;
const MAX_CV_HIGHLIGHTS = 3;

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/**
 * Light "paper" document: white background and zinc text regardless of the
 * site's dark theme, so it prints correctly and reads like a CV on screen.
 */
export function CvDocument({ lang, data = defaultCvData }: { lang: Locale; data?: CvData }) {
  const t = ui[lang];
  const p = data.profile;
  const featured = sortFeaturedFirst(data.projects).slice(0, MAX_CV_PROJECTS);

  return (
    <article
      lang={lang}
      className="mx-auto max-w-[210mm] rounded-lg bg-white p-8 text-zinc-900 shadow-xl sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none"
    >
      <header className="border-b border-zinc-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{p.name[lang]}</h1>
        <p className="mt-1 text-lg text-zinc-600">{p.title[lang]}</p>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600">
          <span>{p.location[lang]}</span>
          <a href={`mailto:${p.email}`} className="underline-offset-2 hover:underline">
            {p.email}
          </a>
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {stripScheme(p.github)}
          </a>
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              {stripScheme(p.linkedin)}
            </a>
          )}
        </p>
      </header>

      <CvSection title={t.cv.summary}>
        <p>{p.about[lang][0]}</p>
      </CvSection>

      <CvSection title={t.sections.experience}>
        {data.experience.map((entry) => (
          <div key={entry.id} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {entry.company[lang]} <span className="font-normal text-zinc-600">· {entry.role[lang]}</span>
              </h3>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(entry.period, lang, t.cv.present)}</span>
            </div>
            <p className="mt-1 text-zinc-700">{entry.summary[lang]}</p>
            {entry.highlights[lang].length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-zinc-700">
                {entry.highlights[lang].slice(0, MAX_CV_HIGHLIGHTS).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <p className="mt-1 font-mono text-xs text-zinc-500">{entry.stack.join(" · ")}</p>
          </div>
        ))}
      </CvSection>

      <CvSection title={t.cv.featuredProjects}>
        {featured.map((project) => (
          <div key={project.slug} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                <span data-testid="cv-project">{project.name[lang]}</span>{" "}
                <span className="font-normal text-zinc-600">· {project.role[lang]}</span>
              </h3>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(project.period, lang, t.cv.present)}</span>
            </div>
            <p className="mt-1 text-zinc-700">{project.summary[lang]}</p>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {project.stack.join(" · ")}
              {project.liveUrl && <> · {stripScheme(project.liveUrl)}</>}
              {project.repoUrl && <> · {stripScheme(project.repoUrl)}</>}
            </p>
          </div>
        ))}
      </CvSection>

      <CvSection title={t.sections.skills}>
        {data.skills.map((group) => (
          <p key={group.id}>
            <span className="font-semibold">{group.label[lang]}:</span> {group.items.join(", ")}
          </p>
        ))}
      </CvSection>

      {data.education.length > 0 && (
        <CvSection title={t.sections.education}>
          {data.education.map((entry) => (
            <div key={`${entry.school.en}-${entry.period.from}`} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p>
                <span className="font-semibold">{entry.school[lang]}</span>
                <span className="text-zinc-600"> · {entry.degree[lang]}</span>
              </p>
              <span className="font-mono text-xs text-zinc-500">{formatPeriod(entry.period, lang, t.cv.present)}</span>
            </div>
          ))}
        </CvSection>
      )}
    </article>
  );
}
```

`src/components/cv/PrintButton.tsx`:
```tsx
"use client";

import { Icon } from "@/components/Icon";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-sm text-fg hover:border-accent hover:text-accent print:hidden"
    >
      <Icon name="print" />
      {label}
    </button>
  );
}
```

- [ ] **Step 4: CV route бичих**

`src/app/[lang]/cv/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, localePath } from "@/lib/i18n";
import { ui } from "@/content";
import { CvDocument } from "@/components/cv/CvDocument";
import { PrintButton } from "@/components/cv/PrintButton";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: ui[lang].cv.title,
    alternates: {
      canonical: localePath(lang, "/cv"),
      languages: {
        mn: localePath("mn", "/cv"),
        en: localePath("en", "/cv"),
        "x-default": localePath("mn", "/cv"),
      },
    },
  };
}

export default async function CvPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="py-10 print:py-0">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton label={ui[lang].actions.print} />
      </div>
      <CvDocument lang={lang} />
    </div>
  );
}
```

- [ ] **Step 5: Тест, lint, typecheck, build**

Run: `npm run test && npm run lint && npm run typecheck && npm run build && ls out/mn/cv out/en/cv`
Expected: PASS; `out/mn/cv/index.html`, `out/en/cv/index.html` байна; `grep -c 'rel="canonical" href="https://bttlg.github.io/en/cv/"' out/en/cv/index.html` → 1.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: print-friendly CV page generated from site content

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: OG зураг, sitemap, robots

**Files:**
- Create: `src/app/[lang]/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/sitemap.test.ts`, `src/app/robots.ts`, `src/app/robots.test.ts`

**Interfaces:**
- Consumes: `LOCALES`, `hasLocale`, `localePath`, `SITE_URL`, `SITE_HOST`, `profile`, `@fontsource/inter` woff файлууд (`node_modules/@fontsource/inter/files/inter-latin-700-normal.woff`, `inter-cyrillic-700-normal.woff`).
- Produces: `/mn/opengraph-image` ба `/en/opengraph-image` (1200×630 PNG, build үед), `/sitemap.xml` (4 URL, hreflang alternates), `/robots.txt`.

- [ ] **Step 1: sitemap ба robots тест бичих**

`src/app/sitemap.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists both locales of home and cv with hreflang alternates", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url).sort();
    expect(urls).toEqual([
      "https://bttlg.github.io/en/",
      "https://bttlg.github.io/en/cv/",
      "https://bttlg.github.io/mn/",
      "https://bttlg.github.io/mn/cv/",
    ]);
    const home = entries.find((e) => e.url === "https://bttlg.github.io/mn/");
    expect(home?.alternates?.languages).toEqual({
      mn: "https://bttlg.github.io/mn/",
      en: "https://bttlg.github.io/en/",
    });
    expect(home?.priority).toBe(1);
  });
});
```

`src/app/robots.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows everything and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://bttlg.github.io/sitemap.xml");
  });
});
```

- [ ] **Step 2: Тест унаж байгааг шалгах**

Run: `npx vitest run src/app/sitemap.test.ts src/app/robots.test.ts`
Expected: FAIL — модулиуд олдохгүй.

- [ ] **Step 3: sitemap, robots бичих**

`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const SUBPATHS = ["/", "/cv"] as const;

function absolute(locale: Locale, sub: string): string {
  return `${SITE_URL}${localePath(locale, sub)}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return SUBPATHS.flatMap((sub) =>
    LOCALES.map((locale) => ({
      url: absolute(locale, sub),
      changeFrequency: "monthly" as const,
      priority: sub === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absolute(l, sub)])),
      },
    })),
  );
}
```

`src/app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: OG зураг бичих**

`src/app/[lang]/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCALES, hasLocale } from "@/lib/i18n";
import { SITE_HOST } from "@/lib/site";
import { profile } from "@/content";

export const alt = "Tergel Ganbold — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// Satori needs real font data; @fontsource/inter ships static woff subsets.
// Latin and Cyrillic are separate files, registered under separate family
// names and listed in fontFamily so both scripts render.
const FONT_DIR = join(process.cwd(), "node_modules/@fontsource/inter/files");

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "mn";
  const [latin, cyrillic] = await Promise.all([
    readFile(join(FONT_DIR, "inter-latin-700-normal.woff")),
    readFile(join(FONT_DIR, "inter-cyrillic-700-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#09090b",
          color: "#f4f4f5",
          fontFamily: '"Inter", "InterCyrillic"',
        }}
      >
        <div style={{ fontSize: 28, color: "#34d399" }}>$ whoami</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, letterSpacing: -2 }}>{profile.name[lang]}</div>
        <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 16 }}>{profile.title[lang]}</div>
        <div style={{ fontSize: 24, color: "#a1a1aa", marginTop: 56 }}>{SITE_HOST}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: latin, weight: 700, style: "normal" },
        { name: "InterCyrillic", data: cyrillic, weight: 700, style: "normal" },
      ],
    },
  );
}
```

- [ ] **Step 5: Тест, build, OG файл үүссэнийг шалгах**

Run: `npm run test && npm run lint && npm run typecheck && npm run build && find out -name 'opengraph-image*' && cat out/sitemap.xml && cat out/robots.txt`
Expected: тест PASS; `out/mn/opengraph-image*.png` ба `out/en/opengraph-image*.png` (нэрэнд hash байж болно) байна; `out/mn/index.html` дотор `property="og:image"` байна; sitemap-д 4 `<loc>`, `xhtml:link rel="alternate" hreflang="en"`; robots.txt дотор `Sitemap: https://bttlg.github.io/sitemap.xml`.

Хэрэв `opengraph-image.tsx` static export-д build алдаа өгвөл (жишээ нь `generateStaticParams` export-ыг хүлээж авахгүй): эхлээд `generateStaticParams` функцийг файлаас хасаад дахин build. Тэр ч болохгүй бол PNG-г нүдээр шалгах: `open out/mn/opengraph-image*.png` — кирилл текст харагдах ёстой.

- [ ] **Step 6: Commit**

```bash
git add src/app
git commit -m "feat: build-time OpenGraph image, sitemap and robots

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Export шалгалт, OG зургийн postbuild, GitHub Actions deploy, README

**Files:**
- Create: `scripts/postbuild-og.mjs`, `scripts/verify-export.mjs`, `.github/workflows/deploy.yml`
- Modify: `package.json` (`build` script), `.nvmrc`, `README.md`

**Interfaces:**
- Consumes: `out/` (Task 10-ын build): `out/{mn,en}/opengraph-image` (өргөтгөлгүй PNG; `og:image`/`twitter:image` meta нь `https://bttlg.github.io/<lang>/opengraph-image?<hash>`), `out/{mn,en}/index.html` доторх `hrefLang="…"` (Next camelCase-аар бичдэг).
- Produces: `npm run build` = `next build && node scripts/postbuild-og.mjs` → `out/{mn,en}/opengraph-image.png` + HTML meta нь `.png`-г заана; `npm run verify-export` (дутуу бол exit 1); `npm run check` бүтэн pipeline; `main` push бүрт GitHub Pages deploy; `.nvmrc` = `24`.

2026-09-06 controller ruling-ууд (ledger): (1) GitHub Pages Content-Type-ийг файлын өргөтгөлөөр тогтоодог тул өргөтгөлгүй OG зураг `application/octet-stream` болж social crawler-ууд хүлээж авахгүй — postbuild алхмаар `.png` хуулбар үүсгэж HTML-ийг дахин бичнэ; (2) Next 16 `hrefLang` гэж camelCase-аар render хийдэг тул шалгалт case-insensitive; (3) Vitest 5 / jsdom 30 нь Node ≥22.12 шаарддаг тул `.nvmrc` = `24`.

- [ ] **Step 1: postbuild-og бичиж, `build` script ба `.nvmrc`-г шинэчлэх**

`scripts/postbuild-og.mjs`:
```js
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
```

`package.json` — зөвхөн `build` script-ийг солих:
```json
"build": "next build && node scripts/postbuild-og.mjs",
```

`.nvmrc`:
```
24
```

Run: `npm run build && ls out/mn/opengraph-image* && grep -o 'og:image" content="[^"]*"' out/mn/index.html`
Expected: `out/mn/opengraph-image` ба `out/mn/opengraph-image.png` хоёулаа байна; og:image нь `https://bttlg.github.io/mn/opengraph-image.png?<hash>`.

- [ ] **Step 2: verify-export бичих**

`scripts/verify-export.mjs`:
```js
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
```

- [ ] **Step 3: Шалгалтыг ажиллуулах (унах ба ногоон)**

Run: `rm -rf out && npm run verify-export; echo "exit=$?"`
Expected: `Static export check failed` ба `exit=1`.

Run: `npm run build && npm run verify-export`
Expected: `postbuild-og: copied 2 images to .png, rewrote N HTML file(s)` дараа `Static export OK ...`, exit 0.

- [ ] **Step 4: GitHub Actions workflow бичих**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

env:
  NEXT_TELEMETRY_DISABLED: "1"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run check
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 5: README-г бүтэн болгох**

`README.md`:
````markdown
# tergel portfolio

Тэргэл Ганболдын танилцуулга сайт — https://bttlg.github.io/

Next.js 16 (static export) · Tailwind CSS 4 · Vitest · GitHub Pages.

## Хөгжүүлэлт

Node **24** шаардлагатай (`.nvmrc`; Vitest 5 / jsdom 30 нь Node ≥ 22.12 шаарддаг).

```bash
nvm use              # .nvmrc-ийн Node 24
npm install
npm run dev          # http://localhost:3000 → /mn/ руу redirect
npm run test:watch   # Vitest
npm run check        # lint + typecheck + test + build + export шалгалт (CI-тай ижил)
```

`npm run build` нь `next build`-ийн дараа `scripts/postbuild-og.mjs`-г ажиллуулж OG зургийг `opengraph-image.png` нэрээр хуулна (GitHub Pages өргөтгөлөөр Content-Type тогтоодог).

## Агуулга засах

Бүх текст `src/content/` дотор:

| Файл | Юу |
|---|---|
| `profile.ts` | нэр, гарчиг, tagline, холбоо барих, «Миний тухай» |
| `experience.ts` | ажлын туршлага (timeline) |
| `projects.ts` | төслүүд (`kind: 'work' | 'personal'`, `featured`) |
| `skills.ts` | ур чадварын бүлгүүд |
| `education.ts` | боловсрол (хоосон бол section гарахгүй) |
| `ui.ts` | nav, section гарчиг, товчны бичвэр |

`// TODO(Тэргэл)` comment-той мөрүүд баталгаажуулах шаардлагатай баримтууд. Монгол/англи хоёулаа заавал байх ёстой — дутуу бол `tsc` ба `npm test` унана.

## Deploy

`main` салбарт push хийхэд `.github/workflows/deploy.yml` build хийж GitHub Pages-д байршуулна. Repo Settings → Pages → Source нь **GitHub Actions** байх ёстой.

## Бүтэц

- `src/app/page.tsx` — `/`: хэл сонгож `/mn/` эсвэл `/en/` руу redirect
- `src/app/[lang]/` — нүүр, `cv/`, OG зураг
- `src/components/` — UI компонентууд (`cv/` доор CV)
- `src/lib/` — i18n, огноо, redirect script, SEO туслахууд
- `scripts/` — postbuild OG хуулбар, export шалгалт
````

- [ ] **Step 6: Бүтэн `npm run check`**

Run: `npm run check`
Expected: lint → typecheck → test (бүх файл PASS) → build (postbuild-og мессежтэй) → `Static export OK`. Exit 0.

- [ ] **Step 7: Commit**

```bash
git add scripts .github README.md package.json .nvmrc
git commit -m "ci: OG image postbuild, export verification and GitHub Pages deploy workflow

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Browser-оор шалгах, remote ба анхны deploy

**Files:** өөрчлөлт байхгүй (олдсон асуудлыг засвал тухайн файлд).

**Interfaces:**
- Consumes: бүтэн сайт (`npm run dev` эсвэл `out/`-г static server-ээр).
- Produces: нүдээр батлагдсан MN/EN/CV/404/redirect; Тэргэлийн зөвшөөрлөөр `Bttlg/Bttlg.github.io` руу push, Actions ногоон, `https://bttlg.github.io/` амьд.

- [ ] **Step 1: Static export-ыг локал серверээр үзэх**

Run: `npm run build && npx serve out -l 3999` (эсвэл `python3 -m http.server 3999 -d out`)

Browser-оор дараахыг шалгах (Claude Browser эсвэл өөрийн browser):
1. `http://localhost:3999/` → шууд `/mn/` руу очно (browser хэл `en` бол `/en/`). Хуудсан дээр хоёр хэлний линк харагдана.
2. `/mn/` — Hero, Тухай (туршлагын жил тоо зөв), Ур чадвар chip-үүд, Туршлагын timeline, Төслүүд (Ажлын / Хувийн), Холбоо барих. Nav-ийн anchor-ууд scroll хийнэ. Кирилл фонт Inter/JetBrains Mono-оор харагдана (fallback биш).
3. `EN` дарахад `/en/` руу орно, `localStorage.locale === 'en'`; дараа `/` руу орвол `/en/` руу үсэрнэ.
4. `/en/cv/` — цагаан цаас, бүх section; «Print / PDF» → print preview A4, nav/footer/товч байхгүй, дэвсгэр цагаан.
5. `/en/cv/` дээр `MN` дарахад `/mn/cv/` руу орно.
6. `/nonexistent/` → serve-ийн 404 нь `404.html`-ийг өгнө (`serve` нь `404.html`-г автоматаар ашигладаг); хоёр хэлний текст, линкүүд ажиллана.
7. Mobile өргөн (375px): anchor цэс нуугдаж CV + MN|EN үлдэнэ, карт нэг баганад, урт үг хуудсыг хэвтээ scroll хийхгүй.
8. `view-source:` дээр `<link rel="alternate" hreflang="en">`, `og:image`, JSON-LD байгаа.

Асуудал олдвол засаж, холбогдох тест нэмж (боломжтой бол), `npm run check` ногоон болгож commit хийх.

- [ ] **Step 2: Тэргэлээс remote/push зөвшөөрөл авах**

Тэргэлд дараах алхмуудыг хийсэн эсэхийг асуух (энэ нь тэдний GitHub account дээр хийгдэх ажил):
1. GitHub дээр `Bttlg/Bttlg.github.io` нэртэй **хоосон public repo** үүсгэсэн (README, .gitignore, license сонгохгүй).
2. Repo Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Дараа нь push хийх зөвшөөрөл тодорхой авах. Зөвшөөрөлгүйгээр Step 3-ыг хийхгүй.

- [ ] **Step 3: Remote нэмж push хийх (зөвшөөрлийн дараа)**

```bash
git remote add origin https://github.com/Bttlg/Bttlg.github.io.git
git push -u origin main
```

Expected: push амжилттай; GitHub Actions «Deploy to GitHub Pages» ажиллаж (`build` → `deploy`) ~2–4 минутад ногоон болно.

- [ ] **Step 4: Live сайтыг шалгах**

Run: `curl -sI https://bttlg.github.io/ | head -1 && curl -s https://bttlg.github.io/mn/ | grep -o '<title>[^<]*</title>' && curl -sI https://bttlg.github.io/en/cv/ | head -1 && curl -sI https://bttlg.github.io/sitemap.xml | head -1`
Expected: `HTTP/2 200` бүгдэд; title-д «Тэргэл Ганболд». Browser-оор `https://bttlg.github.io/` нээж redirect ажиллаж байгааг батлах.

Actions унавал: Actions таб дээрх log-ийг уншиж, локал `npm run check`-тэй харьцуулан засах (ихэвчлэн `next/font/google` сүлжээ эсвэл Node хувилбар).

- [ ] **Step 5: Тэргэлд эцсийн тайлан**

Юу амьд болсон, ямар URL, `TODO(Тэргэл)` тэмдэглэгээтэй ямар баримтуудыг (нэрийн бичилт, компанийн нэр, албан тушаал, он сар, LinkedIn, боловсрол, Music Mixer/Замч линк, PoweredMN) засах хэрэгтэйг жагсаах. Засвар бүр `src/content/` дотор хийгдэж, `main`-д push хийхэд автоматаар deploy болно гэдгийг сануулах.
