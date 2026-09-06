"use client";

import { Icon } from "@/components/Icon";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="pressable inline-flex h-9 items-center gap-2 rounded-md bg-surface/60 px-3 font-mono text-sm text-fg shadow-pill hover:bg-surface hover:shadow-card print:hidden"
    >
      <Icon name="print" />
      {label}
    </button>
  );
}
