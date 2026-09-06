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
            className="-m-2 inline-flex items-center gap-2 rounded-md p-2 font-mono text-sm text-muted transition-colors hover:text-fg"
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
