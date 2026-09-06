import type { Locale } from "@/lib/i18n";
import { profile, ui } from "@/content";
import { Section } from "./Section";
import { SocialLinks } from "./SocialLinks";
import { Reveal } from "./Reveal";
import { staggerDelay } from "@/lib/stagger";

export function Contact({ lang }: { lang: Locale }) {
  const t = ui[lang];

  return (
    <Section id="contact" title={t.sections.contact}>
      <Reveal delay={staggerDelay(1)}>
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
      </Reveal>
    </Section>
  );
}
