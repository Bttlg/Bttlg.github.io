import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-white/4 px-2 py-0.5 font-mono text-xs text-muted ring-1 ring-inset ring-white/6">
      {children}
    </span>
  );
}
