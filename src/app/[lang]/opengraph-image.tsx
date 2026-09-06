import { ImageResponse } from "next/og";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCALES, hasLocale } from "@/lib/i18n";
import { SITE_HOST } from "@/lib/site";
import { profile } from "@/content";

// Satori (the OG-image renderer) doesn't support WebP, so the avatar is
// only embedded here when a JPEG copy exists. That copy lives outside
// `public/` (in `assets/`) so it never gets published as a standalone file
// in the static export — it's only ever inlined as a data URL below.
// Neither file is required — the layout degrades to text-only when there's
// no photo yet.
const AVATAR_JPG_PATH = join(process.cwd(), "assets/avatar-og.jpg");

async function avatarDataUrl(): Promise<string | null> {
  if (!existsSync(AVATAR_JPG_PATH)) return null;
  const bytes = await readFile(AVATAR_JPG_PATH);
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

export const alt = `${profile.name.en} — ${profile.title.en}`;
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
  const [latin, cyrillic, avatar] = await Promise.all([
    readFile(join(FONT_DIR, "inter-latin-700-normal.woff")),
    readFile(join(FONT_DIR, "inter-cyrillic-700-normal.woff")),
    avatarDataUrl(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 80,
          background: "#09090b",
          color: "#f4f4f5",
          fontFamily: '"Inter", "InterCyrillic"',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 28, color: "#34d399" }}>$ whoami</div>
          <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, letterSpacing: -2 }}>{profile.name[lang]}</div>
          <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 16 }}>{profile.title[lang]}</div>
          <div style={{ fontSize: 24, color: "#a1a1aa", marginTop: 56 }}>{SITE_HOST}</div>
        </div>
        {avatar && (
          // Satori (this route's offline renderer) needs a plain <img>; next/image doesn't apply here.
          <img
            src={avatar}
            width={270}
            height={480}
            style={{ borderRadius: 28, objectFit: "cover", border: "5px solid #34d399" }}
            alt=""
          />
        )}
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
