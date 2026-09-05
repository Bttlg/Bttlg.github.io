# bttlg portfolio

Баттулга Батжаргалын танилцуулга сайт — https://bttlg.github.io/

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

`// TODO(Баттулга)` comment-той мөрүүд баталгаажуулах шаардлагатай баримтууд. Монгол/англи хоёулаа заавал байх ёстой — дутуу бол `tsc` ба `npm test` унана.

## Deploy

`main` салбарт push хийхэд `.github/workflows/deploy.yml` build хийж GitHub Pages-д байршуулна. Repo Settings → Pages → Source нь **GitHub Actions** байх ёстой.

## Бүтэц

- `src/app/page.tsx` — `/`: хэл сонгож `/mn/` эсвэл `/en/` руу redirect
- `src/app/[lang]/` — нүүр, `cv/`, OG зураг
- `src/components/` — UI компонентууд (`cv/` доор CV)
- `src/lib/` — i18n, огноо, redirect script, SEO туслахууд
- `scripts/` — postbuild OG хуулбар, export шалгалт
