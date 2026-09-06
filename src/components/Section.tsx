import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  title: string;
  /** Mono label shown as `// label`; defaults to the id. */
  label?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, label = id, children, className = "" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      {/* Only the header reveals here; each section reveals its own body so
          staggered children aren't nested inside (and mushed by) an outer
          reveal, and a tall body can't delay the heading. */}
      <Reveal>
        <p className="font-mono text-sm text-accent">{`// ${label}`}</p>
        <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}
