import type { Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";

export function Footer({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] print:hidden">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {profile.name[lang]}
        </p>
        <p>
          {t.footer.builtWith} ·{" "}
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
