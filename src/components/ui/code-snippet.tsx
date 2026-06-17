"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  code: string;
  label?: string;
  className?: string;
}

export function CodeSnippet({ code, label, className }: CodeSnippetProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div
      className={cn(
        "group/snippet relative overflow-hidden rounded-lg border border-white/[0.06] bg-deep",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
          {label ?? "snippet"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald" />
              <span className="text-emerald">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[11.5px] leading-relaxed text-foreground/90 sm:px-4 sm:text-[12.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
