# Танилцуулга (portfolio) вебсайт — дизайн spec

> **2026-09-06 засвар:** Сайтын эзэмшигч Баттулга Батжаргал (GitHub Bttlg). Анхны ноорогт өөр хүний git commit-ууд андуурч тооцогдсон; §6.3 / Task 3 доторх туршлагын тоо баримт хуучирсан, бодит агуулга нь `src/content/` дотор.

- **Огноо:** 2026-09-05
- **Төлөв:** батлагдсан (brainstorming-ийн дараа), хэрэгжүүлэх төлөвлөгөө хараахан гараагүй
- **Эзэмшигч:** Баттулга Батжаргал (GitHub `Bttlg`)
- **Repo:** `personal/portfolio` → GitHub `Bttlg/Bttlg.github.io`
- **Live URL:** `https://bttlg.github.io/`

---

## 1. Зорилго, хамрах хүрээ

### 1.1 Зорилго

Баттулгын өөрийгөө танилцуулах, бүх төрлийн үзэгчид (ажил олгогч/HR, freelance үйлчлүүлэгч, хөгжүүлэгчид, гадаадын уншигч) рүү чиглэсэн хувийн вебсайт. Нэг хуудсан дээр *хэн бэ · юу хийж чадах вэ · юу хийсэн бэ · хэрхэн холбогдох вэ* гэдгийг 2 минутын дотор ойлгуулах.

### 1.2 v1-д орох

- Хоёр хэл: монгол (`/mn/`, default) ба англи (`/en/`).
- `/` хаяг: хэл сонгож redirect хийх хуудас.
- Нүүр хуудас (Hero, About, Skills, Experience, Projects, Contact).
- `/[lang]/cv/` print-friendly CV хуудас (browser-оос PDF болгож хадгалах).
- Хоёр хэлтэй 404 хуудас.
- SEO: metadata, hreflang, OpenGraph зураг, sitemap, robots, JSON-LD.
- Статик export → GitHub Pages, GitHub Actions-аар автомат deploy.
- Автомат тест (Vitest) + lint + type-check + export шалгалт.
- MN/EN агуулгын **ноорог** (repo-уудаас олдсон баримтад тулгуурлана; тодорхойгүй зүйл `TODO(Баттулга)` comment-той).

### 1.3 v1-д орохгүй (дараа нэмэх боломжтой)

- Блог / MDX нийтлэл.
- Төсөл тус бүрийн тусдаа хуудас (`/projects/[slug]`). Content model нь үүнд бэлэн байх ёстой.
- Contact form (зөвхөн `mailto:`), backend, CMS.
- Цайвар theme / theme toggle (dark-only).
- Analytics.
- Custom domain (хожим `public/CNAME` + DNS-ээр нэмэгдэнэ).

---

## 2. Шийдвэрийн бүртгэл

| Асуудал | Шийдвэр | Шалтгаан |
|---|---|---|
| Framework | Next.js 16.2.x App Router, `output: 'export'` | Баттулгын бусад төслүүдтэй (zamch, next-generation, e-geree-v2) ижил стек; дараа блог/дэлгэрэнгүй хуудас нэмэхэд амар |
| Hosting | GitHub Pages, repo `Bttlg.github.io` | Үнэгүй, цэвэр URL (basePath хэрэггүй), GitHub Actions-аар deploy |
| Хэл | MN default, EN хоёр дахь; `app/[lang]` segment | Хэрэглэгчийн сонголт. Static export-д proxy/redirect ажиллахгүй тул `/` дээр client-side хэл сонголт |
| Дизайн | Бараан, минимал, dev-style, toggle-гүй | Хэрэглэгчийн сонголт; theme-гүй тул код бага |
| Төслүүд | Нүүр хуудсан дээрх дэлгэрэнгүй карт (case study + live линк), тусдаа хуудасгүй | v1 хурдан; model нь дараа өргөтгөхөд бэлэн |
| CV | Сайтын өгөгдлөөс `/cv` хуудас үүсгэх, print CSS | Нэг эх сурвалж (content), PDF хадгалах шаардлагагүй |
| Холбоо барих | И-мэйл, GitHub, LinkedIn | Хэрэглэгчийн сонголт. LinkedIn URL хоосон бол харагдахгүй |
| i18n сан | Ашиглахгүй, өөрийн `Localized<T>` төрөл | Хоёр хэл, статик; сан илүү |
| Фонт | Inter + JetBrains Mono (`next/font/google`, `latin` + `cyrillic`) | Geist кирилл дэмждэггүй |
| UI kit / icon сан | Ашиглахгүй; inline SVG icon | Хэрэгцээ бага, bundle жижиг |
| Тест | Vitest + @testing-library/react + jsdom | Хурдан, Next 16-тай нийцтэй |
| Package manager | npm (Node 24 LTS) | Машин дээр байгаа нь; Vitest 5 engines |

---

## 3. Технологи ба хувилбарууд

| Зүйл | Хувилбар |
|---|---|
| Node.js | 24.x LTS (`.nvmrc` = `24`; 2026-09-06 шийдвэр: Vitest 5 / jsdom 30 нь Node ≥22.12 шаарддаг) |
| Next.js | `^16.2` |
| React / React DOM | `^19.2` |
| TypeScript | `^5`, `strict: true` |
| Tailwind CSS | `^4` (`@tailwindcss/postcss`) |
| Vitest | сүүлийн stable хувилбар |
| @testing-library/react, @testing-library/jest-dom, jsdom | сүүлийн |
| ESLint | `eslint-config-next` (Next 16-ийн flat config) |

Next.js API-г бичихээсээ өмнө `node_modules/next/dist/docs/` доторх баримтыг унших (Next 16-д өөрчлөлт их).

---

## 4. Хавтасны бүтэц

```
portfolio/
├── .github/workflows/deploy.yml
├── .gitignore  .nvmrc  README.md
├── next.config.ts  package.json  tsconfig.json
├── postcss.config.mjs  eslint.config.mjs
├── vitest.config.ts  vitest.setup.ts
├── public/
│   ├── .nojekyll              # GitHub Pages _next/ хавтсыг үл тоохгүй байлгах
│   └── favicon.svg
├── scripts/
│   └── verify-export.mjs      # build-ийн дараа out/ доторх файлуудыг шалгана
├── docs/superpowers/specs/
└── src/
    ├── app/
    │   ├── layout.tsx         # root: <html lang="mn">, фонт, globals.css
    │   ├── page.tsx           # "/" хэл сонгож redirect
    │   ├── not-found.tsx      # 404 (хоёр хэл) → out/404.html
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── globals.css
    │   └── [lang]/
    │       ├── layout.tsx     # generateStaticParams, dynamicParams=false, Nav+Footer
    │       ├── page.tsx       # нүүр
    │       ├── opengraph-image.tsx
    │       └── cv/page.tsx
    ├── components/
    │   ├── Nav.tsx  LangSwitch.tsx  Footer.tsx  Section.tsx  Icon.tsx
    │   ├── Hero.tsx  About.tsx  Skills.tsx  Experience.tsx
    │   ├── Projects.tsx  ProjectCard.tsx  Contact.tsx
    │   └── cv/CvDocument.tsx  cv/PrintButton.tsx
    ├── content/
    │   ├── types.ts  profile.ts  experience.ts  projects.ts
    │   ├── skills.ts  education.ts  ui.ts  index.ts
    └── lib/
        ├── i18n.ts            # locales, hasLocale, otherLocale, localePath, stripLocale
        ├── redirect-script.ts # "/" дээр ажиллах inline script (string)
        ├── dates.ts           # formatPeriod, yearsSince
        └── site.ts            # SITE_URL, нэр, default metadata тогтмолууд
```

Тест файлууд эх файлынхаа хажууд `*.test.ts(x)` нэртэй байрлана.

Path alias: `@/*` → `./src/*`.

---

## 5. Routing ба i18n

### 5.1 Locale тодорхойлолт (`src/lib/i18n.ts`)

```ts
export const LOCALES = ['mn', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'mn';
export function hasLocale(x: string): x is Locale;
export function otherLocale(l: Locale): Locale;
export function stripLocale(pathname: string): string;      // '/en/cv/' → '/cv/'
export function localePath(l: Locale, sub = '/'): string;   // ('en','/cv') → '/en/cv/'
```

`localePath` үргэлж trailing slash-тай буцаана (`trailingSlash: true`-тэй нийцүүлэх).

### 5.2 Route-ууд ба export болох файлууд

| URL | Файл | `out/` |
|---|---|---|
| `/` | `app/page.tsx` | `index.html` |
| `/mn/`, `/en/` | `app/[lang]/page.tsx` | `mn/index.html`, `en/index.html` |
| `/mn/cv/`, `/en/cv/` | `app/[lang]/cv/page.tsx` | `mn/cv/index.html`, `en/cv/index.html` |
| `/mn/opengraph-image.png`, `/en/...` | `app/[lang]/opengraph-image.tsx` | build үед үүснэ |
| `/404.html` | `app/not-found.tsx` | `404.html` (GitHub Pages бүх олдохгүй хаягт үүнийг өгнө) |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | статик |

`app/[lang]/layout.tsx`:
- `export function generateStaticParams() { return LOCALES.map(lang => ({ lang })) }`
- `export const dynamicParams = false;` (static export-д заавал)
- `params`-аас `lang` авч `hasLocale` шалгана, буруу бол `notFound()`.
- Бүх контентыг `<div lang={lang}>` дотор ороож Nav, `<main>`, Footer-ийг render хийнэ. Root `<html lang="mn">` тогтмол; англи хуудсанд энэ wrapper `lang="en"` болно. Энэ нь HTML-ийн хувьд зөв (`lang` global attribute), JS шаардахгүй.

Root `app/layout.tsx` зөвхөн `<html>` + `<body>` (фонтын CSS variable класс, суурь өнгө). Nav/Footer энд байхгүй, учир нь `/` redirect хуудас ба 404-д тэдгээр хэрэггүй.

### 5.3 `/` redirect хуудас

`app/page.tsx` (Server Component):
- `metadata`: `title`, `robots: { index: false, follow: true }`, `alternates.canonical = '/mn/'`.
- JSX-д `<meta httpEquiv="refresh" content="0;url=/mn/" />` (React 19 `<head>` рүү hoist хийнэ) — JS-гүй fallback. HTML стандартаар meta refresh нь document бүрэн ачаалагдсаны дараа л ажиллах тул inline script түрүүлж гүйцэтгэгдэнэ.
- `<body>`-ийн эхэнд inline `<script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />`.
- Харагдах контент: нэр (MN/EN), "Монгол → /mn/" ба "English → /en/" гэсэн хоёр линк.

`src/lib/redirect-script.ts` дараах логикийг string хэлбэрээр export хийнэ (нэг эх сурвалж; тест нь энэ string-ийг `new Function`-аар fake `localStorage`/`navigator`/`location` өгч ажиллуулж шалгана):

```
saved = localStorage.getItem('locale')       // try/catch
if saved ∈ {mn,en}            → location.replace('/' + saved + '/')
else if navigator.languages/language эхнийх 'en'-ээр эхэлж байвал → '/en/'
else                          → '/mn/'
```

### 5.4 Хэл сэлгэх (`LangSwitch`, client component)

- `usePathname()`-аас одоогийн зам → `stripLocale` → `localePath(otherLocale(lang), sub)`.
- `next/link` ашиглана (нэг root layout тул client-side navigation).
- `onClick`-д `localStorage.setItem('locale', target)` (try/catch).
- Харагдах байдал: `MN | EN`, идэвхтэй нь тод.

---

## 6. Агуулгын модель (`src/content/`)

### 6.1 Төрлүүд (`types.ts`)

```ts
import type { Locale } from '@/lib/i18n';

export type Localized<T = string> = Record<Locale, T>;

export interface Period { from: string; to: string | null }  // 'YYYY-MM'; null = одоог хүртэл

export interface Profile {
  name: Localized; title: Localized; tagline: Localized; location: Localized;
  email: string; github: string; linkedin: string;      // linkedin '' бол харагдахгүй
  about: Localized<string[]>;                            // догол мөрүүд
  facts: { label: Localized; value: Localized }[];       // quick facts
}

export interface Experience {
  id: string; company: Localized; url?: string; role: Localized; period: Period;
  summary: Localized; highlights: Localized<string[]>; stack: string[];
}

export interface Project {
  slug: string; name: Localized; kind: 'work' | 'personal'; role: Localized; period: Period;
  summary: Localized; highlights: Localized<string[]>; stack: string[];
  liveUrl?: string; repoUrl?: string; featured: boolean;
}

export interface SkillGroup { id: string; label: Localized; items: string[] }
export interface Education { school: Localized; degree: Localized; period: Period }

export interface UiDict {
  brand: string;                       // Nav лого текст, хоёр хэлэнд ижил '~/bttlg'
  langName: string;                    // '/' ба 404 дээрх хэлний линкийн нэр: 'Монгол' / 'English'
  nav: Record<'label' | 'about' | 'skills' | 'experience' | 'projects' | 'contact' | 'cv', string>;
  sections: Record<'about' | 'skills' | 'experience' | 'projects' | 'work' | 'personal' | 'contact' | 'education', string>;
  actions: Record<'viewProjects' | 'viewCv' | 'contactMe' | 'live' | 'source' | 'print', string>;
  hero: Record<'prompt', string>;
  about: Record<'years' | 'yearsValue', string>;       // yearsValue: '{n}+ жил'
  contact: Record<'body' | 'email', string>;
  cv: Record<'title' | 'summary' | 'featuredProjects' | 'present', string>;
  notFound: Record<'title' | 'body' | 'home', string>;
  footer: Record<'builtWith', string>;
}
export type Ui = Record<Locale, UiDict>;
```

`Localized<T>` = `Record<Locale, T>` тул орчуулга дутуу бол `tsc` унана. `content/index.ts` бүгдийг нэг `content` объектоор export хийнэ.

### 6.2 Агуулгын нооргийн бодлого

- Эх сурвалж: `~/Documents/GitHub` доторх repo-уудын README, `settings.gradle`, `package.json`, git log-ийн огноо ба commit тоо.
- Мэдэхгүй/баталгаагүй зүйл (албан тушаалын нэр, компанийн албан нэр, яг сар, боловсрол, LinkedIn URL) бүрийн дэргэд `// TODO(Баттулга): ...` comment. **Сайт дээр placeholder/хуурамч текст хэзээ ч гарахгүй**: хоосон массив → section нуугдана; хоосон URL → линк нуугдана.
- Хүн бүрийн бус, зөвхөн Баттулгын өөрийн ажил орно. `mongolian-spellcheck-skill-master` нь өөр хүний (Tsagaanbayr1) repo тул **орохгүй**.

### 6.3 Ноорогт орох баримт

**Profile:** MN «Баттулга Батжаргал» (TODO: «Б. Баттулга» гэж бичих үү), EN «Battulga Batjargal». Гарчиг: «Full-stack хөгжүүлэгч» / «Full-stack Developer». Улаанбаатар, Монгол. Email `btjrglbttlg@gmail.com`, GitHub `https://github.com/Bttlg`, LinkedIn `''` (TODO). Туршлагын жил: хамгийн эрт `Experience.period.from`-оос build-ийн огноо хүртэл тооцно (2021-03 → «5+ жил»).

**Experience (git огноогоор, компанийн албан нэр/албан тушаал TODO):**

| id | Бренд | Хугацаа | Юу хийсэн (ноорог) | Стек |
|---|---|---|---|---|
| egeree | e-geree.mn — цахим гэрээний платформ | 2023-03 → одоо | Backend микросервисүүд (auth, notification, PDF generator, цахим гарын үсэг, ХУР/XYP интеграц, банкны төлбөр, SSO, 2FA), Next.js 13→16 frontend; backend-д 2400+ commit | Java 21, Spring Boot, Spring Cloud, MongoDB, Redis, RabbitMQ, AWS S3/SQS/SNS, Azure Blob, Next.js, OpenTelemetry |
| octagon | Octagon (octagon.mn) — крипто бирж | 2021-10 → 2026-08 (TODO: дууссан эсэх) | Exchange API, банкны интеграц (Хаан, Голомт, ХХБ), trade/id/nft Next.js frontend-үүд | Java 17/21, Spring Boot, MongoDB, Redis, WebSocket, Next.js 13 |
| yesh | yesh.mn — ЭЕШ бэлтгэлийн платформ | 2021-03 → 2025-10 (TODO) | mobile-api, teacher-api backend; web (Next.js 12); mobile апп | Java 21, Spring Boot, MongoDB, Next.js, React Native |
| smart-transport | Smart Transport mobile | 2024-04 → 2024-07 | React Native мобайл апп | React Native, Firebase |
| poweredmn | PoweredMN | 2022-05 → 2023-01 | Next.js вебсайт | Next.js 13 |

**Projects (work, featured):** e-geree.mn (`https://e-geree.mn`), Octagon exchange (`https://trade.octagon.mn`, `https://id.octagon.mn`), yesh.mn (`https://yesh.mn`). Live URL-уудыг хэрэгжүүлэх үед `curl`-ээр амьд эсэхийг шалгаж, үхсэн бол `liveUrl` орхино.

**Projects (personal):** УБ Автобус (iOS, SwiftUI, MapKit, бодит цагийн ETA; 2026-08; App Store-д тавиагүй, repo private → линкгүй), Music Mixer (FastAPI + Demucs + Next.js + Web Audio; 4 stem салгаж синхрон тоглуулах; TODO repo), Замч (Next.js 16, Монголын аяллын замын мэдээлэл; 2026-05→07; TODO live/repo), Smart HR (React Native; 2026-08), ClickUp-Telegram bot (Python; `https://github.com/Bttlg/ClickUp-Telegram-Bot`), spring-boot-initializer (Java; `https://github.com/Bttlg/spring-boot-initializer`), Data-transfer (Vue; `https://github.com/Bttlg/Data-transfer`).

**Skills (repo-уудаас батлагдсан):**
- Backend: Java, Spring Boot, Spring Cloud, Spring Security/JWT, MongoDB, Redis, RabbitMQ, gRPC, WebSocket, REST/OpenAPI (springdoc), MapStruct, Feign, Resilience4j
- Frontend: TypeScript, React, Next.js, Tailwind CSS, React Query, react-hook-form, socket.io, Chart.js/Recharts, next-intl
- Mobile: React Native (react-navigation, Firebase), Swift/SwiftUI, MapKit
- Cloud/Infra: AWS (S3, SQS, SNS), Azure Blob, Docker, GitHub Actions, OpenTelemetry, Prometheus
- Tools/Other: Git, Gradle, Python (FastAPI), Web Audio API

**Education:** `[]` (TODO comment-той жишээ). Хоосон тул нүүр ба CV дээр section гарахгүй.

---

## 7. Хуудас ба компонентууд

### 7.1 Нүүр `/[lang]/` — section дараалал

| # | Section | id (anchor) | Агуулга |
|---|---|---|---|
| 1 | `Hero` | — | mono prompt `$ whoami`, нэр (h1), гарчиг, tagline; CTA: «Төслүүд» (#projects), «CV» (/[lang]/cv/), «Холбоо барих» (#contact); GitHub·LinkedIn·Email icon |
| 2 | `About` | `about` | `profile.about` догол мөрүүд + quick facts (байршил, туршлагын жил, одоогийн чиглэл) |
| 3 | `Skills` | `skills` | `SkillGroup` бүр: mono label + chip жагсаалт |
| 4 | `Experience` | `experience` | Босоо timeline; entry бүр: компани (линктэй бол ↗), үүрэг, хугацаа (`formatPeriod`), тайлбар, highlight bullet, стек chip |
| 5 | `Projects` | `projects` | Дэд хэсэг «Ажлын» (`kind==='work'`) ба «Хувийн / OSS» (`kind==='personal'`); `featured` эхэнд. Карт = `ProjectCard` |
| 6 | `Contact` | `contact` | Урилга текст, `mailto:`, GitHub, LinkedIn (хоосон бол алга) |

`ProjectCard` props: `project: Project`, `locale: Locale`, `ui: UiDict`. Render: нэр (h3), үүрэг · хугацаа (mono, muted), summary, highlights (≤3 bullet), стек chip, доод хэсэгт «Live ↗» (`liveUrl` байвал) ба «Source ↗» (`repoUrl` байвал), гадаад линк бүр `target="_blank" rel="noopener noreferrer"`.

### 7.2 `Nav`

Sticky, blur дэвсгэр. Зүүн: mono лого текст `~/bttlg` (`ui[locale].brand`), `/[lang]/` рүү заана. Дунд/баруун: section anchor линкүүд (`#about`, `#skills`, `#experience`, `#projects`, `#contact`), «CV» линк, `LangSwitch`. Mobile дээр anchor-ууд нуугдаж зөвхөн CV + LangSwitch үлдэнэ (hamburger хэрэггүй; нэг хуудас scroll).

`/[lang]/cv/` дээр Nav-ийн anchor линкүүд `/[lang]/#about` хэлбэртэй байна (`Section` id-тай уялдана).

### 7.3 `Footer`

«© {year} {нэр}» · «Next.js + Tailwind, GitHub Pages» · GitHub линк. Он нь build үеийн он.

### 7.4 CV хуудас `/[lang]/cv/`

- `CvDocument` (Server Component): A4 өргөн (`max-w-[210mm]`), цагаан цаас дээр хар текст **print-д**; дэлгэц дээр сайтын бараан theme дотор цайвар «цаас» карт байдлаар харагдана.
- Дараалал: толгой (нэр, гарчиг, байршил, email, GitHub, LinkedIn), товч танилцуулга (`about[0]`), Туршлага (бүх `experience`, highlight-тай), Гол төслүүд (`featured` эхлээд, компакт: нэр · үүрэг · хугацаа · стек · 1–2 highlight), Ур чадвар (бүлэг бүр нэг мөр), Боловсрол (хоосон бол алга).
- `PrintButton` (client): `window.print()`. Print үед `Nav`, `Footer`, `PrintButton` нуугдана (`print:hidden`), дэвсгэр цагаан, линкийн URL-ыг харуулахгүй, `@page { size: A4; margin: 14mm }`.
- Хуудас доторх бүх текст `ui[locale].cv` ба content-оос ирнэ.

### 7.5 404 `app/not-found.tsx`

Root layout дотор render болно (Nav/Footer-гүй). Гарчиг «Хуудас олдсонгүй / Page not found», хоёр хэлээр нэг догол мөр, `/mn/` ба `/en/` линк. `robots: noindex`.

---

## 8. Дизайн систем

### 8.1 Token (`globals.css`, Tailwind 4 `@theme`)

```css
@import "tailwindcss";
@theme {
  --color-canvas: #09090b;    /* zinc-950 */
  --color-surface: #18181b;   /* zinc-900 */
  --color-border: #27272a;    /* zinc-800 */
  --color-fg: #f4f4f5;        /* zinc-100 */
  --color-muted: #a1a1aa;     /* zinc-400 */
  --color-accent: #34d399;    /* emerald-400 */
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
}
```

- `color-scheme: dark` `html` дээр. Дэвсгэрт нарийн dotted grid (`radial-gradient`, 24px), hero-д зөөлөн accent glow.
- Класс жишээ: `bg-canvas`, `bg-surface`, `border-border`, `text-fg`, `text-muted`, `text-accent`.
- Унших өргөн `max-w-3xl`, section хоорондын зай `py-20 sm:py-28`.
- Section гарчиг: mono, muted, `// about` хэлбэртэй жижиг label + sans том гарчиг.
- Chip: mono `text-xs`, `border-border`, `bg-surface`, rounded.
- Линк hover: accent underline offset.
- Хөдөлгөөн: зөвхөн CSS `fade-up` keyframe section гарч ирэхэд (`animation-timeline` биш, энгийн `@keyframes` + `animation-delay`); `@media (prefers-reduced-motion: reduce)` бүх animation-ыг унтраана.
- Focus ring: `outline-accent` — keyboard навигаци бүх интерактив элементэд.
- Контрастын шаардлага: WCAG AA (muted текст zinc-400 дэвсгэр zinc-950 дээр 7:1 орчим).

### 8.2 Фонт

`next/font/google`: `Inter({ subsets: ['latin','cyrillic'], variable: '--font-inter', display: 'swap' })`, `JetBrains_Mono({ subsets: ['latin','cyrillic'], variable: '--font-jetbrains-mono', display: 'swap' })`. Хоёулаа root layout-д `<html className>`-д.

---

## 9. SEO ба metadata

- `src/lib/site.ts`: `SITE_URL = 'https://bttlg.github.io'`, `metadataBase`.
- `[lang]/layout.tsx` `generateMetadata({ params })`: `title.default` = «Баттулга Батжаргал — Full-stack хөгжүүлэгч» / EN, `title.template` = `%s · Баттулга Батжаргал`, `description` (`profile.tagline`), `alternates: { canonical: '/mn/', languages: { mn: '/mn/', en: '/en/', 'x-default': '/mn/' } }`, `openGraph { type: 'website', locale: 'mn_MN' | 'en_US', url, siteName }`, `twitter { card: 'summary_large_image' }`, `robots { index: true }`.
- `[lang]/cv/page.tsx` өөрийн `title` («CV»), canonical `/[lang]/cv/`, alternates.
- `[lang]/opengraph-image.tsx`: `ImageResponse` 1200×630, бараан дэвсгэр, нэр, гарчиг, `bttlg.github.io`. Build үед статик үүсдэг (docs: «statically optimized»). Хэрэв static export-д асуудал гарвал `public/og.png` статик файл болгож `openGraph.images`-д заана — энэ fallback-ыг төлөвлөгөөнд алхам болгон оруулна.
- `sitemap.ts`: 4 URL (`/mn/`, `/en/`, `/mn/cv/`, `/en/cv/`) `alternates.languages`-тай. `robots.ts`: `allow: '/'`, `sitemap: SITE_URL + '/sitemap.xml'`.
- JSON-LD `Person` (`name`, `url`, `sameAs: [github, linkedin?]`, `jobTitle`, `address.addressLocality`) `[lang]/page.tsx`-д `<script type="application/ld+json">`.
- `favicon.svg` (mono `T` тэмдэг, accent өнгө).

---

## 10. Build, deploy, repo

### 10.1 `next.config.ts`

```ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
```

Static export-д хориотой зүйл (proxy, redirects/rewrites/headers config, server actions, cookies, ISR, dynamicParams=true) ашиглахгүй.

### 10.2 `package.json` scripts

| script | команд |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `lint` | `eslint .` |
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |
| `verify-export` | `node scripts/verify-export.mjs` |
| `check` | `npm run lint && npm run typecheck && npm run test && npm run build && npm run verify-export` |

### 10.3 `scripts/verify-export.mjs`

`out/` дотор дараах файлууд байгаа эсэхийг шалгаж, дутуу бол exit 1: `index.html`, `404.html`, `mn/index.html`, `en/index.html`, `mn/cv/index.html`, `en/cv/index.html`, `sitemap.xml`, `robots.txt`, `.nojekyll`. Нэмж `mn/index.html` дотор `lang="mn"`, `en/index.html` дотор `lang="en"` string байгааг, `index.html` дотор `http-equiv="refresh"` байгааг шалгана.

### 10.4 `.github/workflows/deploy.yml`

- Trigger: `push` → `main`, ба `workflow_dispatch`.
- `permissions: { contents: read, pages: write, id-token: write }`, `concurrency: pages`.
- Job `build`: `actions/checkout@v4` → `actions/setup-node@v4` (`node-version-file: .nvmrc`, `cache: npm`) → `npm ci` → `npm run check` → `actions/upload-pages-artifact@v3` (`path: out`).
- Job `deploy`: `needs: build`, `environment: github-pages`, `actions/deploy-pages@v4`.

### 10.5 Repo ба GitHub тохиргоо

- `personal/portfolio` нь одоо тусдаа git repo (`main` салбар). Эх хавтас `/Users/hades/Documents/GitHub` нь өөрөө git repo (remote `Bttlg/Zamch`) бөгөөд `personal/portfolio/`-г untracked гэж харж байна. **Тэндээс `git add` хийхгүй.** (Хүсвэл эх repo-ийн `.gitignore`-д `personal/portfolio/` нэмэх — энэ spec-ийн хамрах хүрээнд биш.)
- Баттулга GitHub дээр `Bttlg/Bttlg.github.io` нэртэй **хоосон public repo** үүсгэж, Settings → Pages → Build and deployment → Source: **GitHub Actions** болгоно.
- Remote нэмэх, анхны push нь нийтлэх үйлдэл тул тухайн үед Баттулгаас тодорхой зөвшөөрөл авна.
- `.gitignore`: `node_modules/`, `.next/`, `out/`, `coverage/`, `*.tsbuildinfo`, `.DS_Store`, `.env*`, `next-env.d.ts`.

---

## 11. Тест стратеги (TDD)

| Түвшин | Юуг | Хэрхэн |
|---|---|---|
| Unit | `i18n.ts`: `hasLocale`, `otherLocale`, `stripLocale`, `localePath` | Vitest, хүснэгтэн тест |
| Unit | `dates.ts`: `formatPeriod` (MN/EN, `to: null`), `yearsSince(from, now)` | now параметрээр өгнө |
| Unit | `redirect-script.ts`: saved > navigator > default; буруу saved утга үл тоох; localStorage throw хийвэл унахгүй | `new Function('window','localStorage','navigator','location', script)` fake объектуудтай |
| Content | localized талбар бүр mn/en хоёулаа хоосон биш string (recursive walker); `Project.slug` ба `Experience.id` давхардаагүй; `liveUrl/repoUrl/github/url` `https://` эхэлдэг; `featured` төсөл ≥ 1; `period.from` `YYYY-MM` формат, `to` null эсвэл `from`-оос хойш | Vitest, `content/index.ts`-ийг импортлоно |
| Component | `ProjectCard`: live/repo линк URL байвал л гарна, `rel="noopener noreferrer"`; `LangSwitch`: `/mn/cv/` дээр `/en/cv/` рүү заана (`usePathname` mock); `Contact`: linkedin `''` бол линк алга; `CvDocument`: education хоосон бол section алга, дүүрэн бол гарна | @testing-library/react + jsdom |
| Static | `tsc --noEmit`, `eslint .` | CI |
| Export | `next build` амжилттай + `verify-export.mjs` | CI (`npm run check`) |

Тест бичих дараалал: тест эхэлж (унана) → хэрэгжүүлэлт → ногоон → refactor. Server Component-уудыг `render()`-ээр шууд тестлэх боломжгүй бол (async) синхрон Server Component хэлбэрээр бичнэ (энэ сайтад өгөгдөл fetch хийхгүй тул бүх компонент синхрон байж болно; `params` await зөвхөн `page/layout` түвшинд).

---

## 12. Алдаа, хязгаарын тохиолдол

- Буруу locale (`/de/`): `dynamicParams=false` тул build-д route үүсэхгүй; GitHub Pages `404.html` өгнө.
- `localStorage` хориотой (private mode): redirect script try/catch, navigator → default `/mn/`.
- JS унтраалттай: meta refresh → `/mn/`; хуудсан дээр хоёр хэлний линк харагдана.
- Гадаад URL үхсэн: content тест зөвхөн формат шалгана; хэрэгжүүлэх үед нэг удаа `curl`-ээр амьд эсэхийг шалгаж, үхсэнийг орхино.
- Хоосон агуулга: `education: []`, `linkedin: ''`, `liveUrl`/`repoUrl` байхгүй → холбогдох UI гарахгүй.
- Урт монгол үг mobile дээр: `break-words`, chip-үүд `flex-wrap`.
- Print: A4 нэг-хоёр хуудас; урт highlight жагсаалт CV-д ≤3 болгож хязгаарлана.

---

## 13. Ирээдүйн өргөтгөл (v1-д хийхгүй, харин саад болохгүй байх)

- Блог: `src/app/[lang]/blog/[slug]/page.tsx` + MDX; nav-д «Blog» нэмэх.
- Төслийн хуудас: `Project`-д `body?: Localized<string[]>` нэмээд `/[lang]/projects/[slug]/`.
- Custom domain: `public/CNAME` + `SITE_URL` солих.
- Analytics: static-тэй нийцэх (Plausible/Umami) script.

---

## 14. Хэрэгжүүлэлтийн өндөр түвшний дараалал

Дэлгэрэнгүй алхмуудыг `writing-plans` skill-ээр тусдаа төлөвлөгөө болгон гаргана. Ерөнхий дараалал:

1. Scaffold: `create-next-app` (TS, Tailwind, `src/`, App Router, ESLint), `.nvmrc`, `.gitignore`, `next.config.ts` (export), Vitest тохиргоо, `public/.nojekyll`.
2. `lib/i18n.ts`, `lib/dates.ts`, `lib/redirect-script.ts` (TDD).
3. Content төрлүүд + content тест + MN/EN ноорог агуулга.
4. Root layout, фонт, дизайн token; `/` redirect хуудас; 404.
5. `[lang]/layout` + Nav/LangSwitch/Footer.
6. Нүүрийн section-ууд (Hero → Contact), ProjectCard (TDD).
7. CV хуудас + print CSS + PrintButton.
8. Metadata, OG image, sitemap, robots, JSON-LD, favicon.
9. `verify-export.mjs`, GitHub Actions workflow, README.
10. Бүтэн `npm run check`; browser-оор MN/EN/CV/404/redirect-ийг нүдээр шалгах; Баттулгаас зөвшөөрөл авч remote нэмж push хийх.
