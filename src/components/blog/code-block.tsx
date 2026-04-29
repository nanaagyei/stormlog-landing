"use client";

import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface CodeBlockProps {
  code: string;
  language?: string;
  children: ReactNode;
}

export function CodeBlock({ code, language, children }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-white/[0.06] bg-deep">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-white/[0.12] hover:text-foreground"
          aria-label={`Copy ${language || "code"} snippet`}
        >
          {copied ? <Check className="size-3 text-emerald" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
