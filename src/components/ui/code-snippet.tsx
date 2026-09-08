"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeSnippetProps {
  code: string;
  label?: string;
  className?: string;
  /** Render without its own border when placed inside a card. */
  nested?: boolean;
}

export function CodeSnippet({
  code,
  label,
  className,
  nested = false,
}: CodeSnippetProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div
      className={cn(
        "group/snippet relative overflow-hidden bg-deep",
        // Standalone frames carry their own hairline and corners. Inside a card
        // they drop both and read as a flush inset panel; the deep-on-surface
        // tonal step separates them without nesting one card inside another.
        nested
          ? "-mx-5 border-y border-white/[0.06] sm:-mx-6 lg:-mx-8"
          : "rounded-lg border border-white/[0.06]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-dim">
          {label ?? "snippet"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-xs text-muted-dim transition-colors hover:text-foreground"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" className="size-3.5 text-emerald" />
              <span className="text-emerald">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-xs leading-relaxed text-foreground/90 sm:px-4 sm:text-[12.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
