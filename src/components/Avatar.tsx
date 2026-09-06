import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { profile } from "@/content";

export const AVATAR_SRC = "/avatar.webp";

/** Round portrait with a slowly rotating accent ring. `size` in px. */
export function Avatar({
  lang,
  size = 208,
  ring = true,
  className = "",
}: {
  lang: Locale;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-block ${ring ? "avatar-glow animate-float" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      {/*
       * Full-circle rotating ring, absolutely positioned underneath the
       * photo. The photo (below) is inset by its own padding so a thin
       * band of this gradient stays visible all the way around — the ring
       * itself never needs to shrink, so its rotation always reads as a
       * perfect circle.
       */}
      {ring && <span aria-hidden="true" className="avatar-ring animate-spin-slow" />}
      <Image
        src={AVATAR_SRC}
        alt={profile.name[lang]}
        width={size}
        height={size}
        priority={ring}
        className="relative rounded-full object-cover"
        style={{ width: size, height: size, padding: ring ? 4 : 0, boxSizing: "border-box" }}
      />
    </div>
  );
}
