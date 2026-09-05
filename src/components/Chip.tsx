import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
