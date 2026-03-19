"use client";

import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  children: ReactNode;
}

export function CodeBlock({ code, language, children }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="group relative my-8 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#071126]/92 shadow-[0_24px_80px_rgba(1,3,10,0.5)]">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-cool-white/55">
          {language || "Code"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-violet/40 hover:text-cool-white",
            "motion-reduce:transition-none"
          )}
          aria-label={`Copy ${language || "code"} snippet`}
        >
          {copied ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
