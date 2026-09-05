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
