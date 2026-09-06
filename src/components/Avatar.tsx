import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { profile } from "@/content";

export const AVATAR_SRC = "/avatar.webp";

/** Portrait-ratio photo (9:16 intrinsic), optionally glowing and floating. */
export function Avatar({
  lang,
  className = "",
  imgClassName = "rounded-2xl",
  decorated = true,
  priority = false,
}: {
  lang: Locale;
  className?: string;
  imgClassName?: string;
  decorated?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${decorated ? "avatar-glow animate-float" : ""} ${className}`}>
      <Image
        src={AVATAR_SRC}
        alt={profile.name[lang]}
        width={640}
        height={1137}
        priority={priority}
        sizes="(min-width: 768px) 260px, 220px"
        className={`h-auto w-full object-cover ring-1 ring-white/10 ${imgClassName}`}
      />
    </div>
  );
}
