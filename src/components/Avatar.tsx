import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { profile } from "@/content";

export const AVATAR_SRC = "/avatar.webp";

/**
 * Portrait-ratio photo (9:16 intrinsic). When `decorated`, it floats gently
 * and sits inside a thin "beam" frame: a 2px rim around which an accent light
 * travels (see `.beam-frame` in globals.css). Otherwise it renders plain —
 * the CV uses that.
 */
export function Avatar({
  lang,
  className = "",
  imgClassName,
  decorated = true,
  priority = false,
}: {
  lang: Locale;
  className?: string;
  imgClassName?: string;
  decorated?: boolean;
  priority?: boolean;
}) {
  const image = (
    <Image
      src={AVATAR_SRC}
      alt={profile.name[lang]}
      width={640}
      height={1137}
      priority={priority}
      sizes="(min-width: 768px) 260px, 220px"
      className={
        decorated
          ? // Opaque canvas backing + a radius 2px inside the frame's, so only
            // the frame's 2px rim of beam is visible around the photo.
            `block h-auto w-full bg-canvas ${imgClassName ?? "rounded-[calc(1rem-2px)]"}`
          : `h-auto w-full ${imgClassName ?? "rounded-lg"}`
      }
    />
  );

  if (!decorated) return <div className={className}>{image}</div>;

  return (
    <div className={`animate-float ${className}`}>
      <div className="beam-frame">{image}</div>
    </div>
  );
}
