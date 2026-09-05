"use client";

import { Icon } from "@/components/Icon";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 font-mono text-sm text-fg hover:border-accent hover:text-accent print:hidden"
    >
      <Icon name="print" />
      {label}
    </button>
  );
}
