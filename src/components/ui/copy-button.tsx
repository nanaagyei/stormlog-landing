"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  displayText?: string;
  className?: string;
  /**
   * `primary` gives the command the weight of a filled CTA. Used where copying
   * the install line is the page's main action rather than a convenience.
   */
  tone?: "default" | "primary";
}

export function CopyButton({
  text,
  displayText,
  className,
  tone = "default",
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();
  const primary = tone === "primary";

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border font-mono transition-all",
        primary
          ? "border-emerald bg-emerald px-5 py-3 text-sm text-deep hover:brightness-110"
          : "border-white/6 bg-surface px-4 py-2.5 text-sm hover:border-white/20 hover:bg-surface-2",
        className
      )}
      aria-label={`Copy "${text}" to clipboard`}
    >
      <span className={primary ? "text-deep/60" : "text-emerald"}>$</span>
      <span className={primary ? "text-deep" : "text-foreground"}>
        {displayText || text}
      </span>
      {copied ? (
        <Check aria-hidden="true" className={cn("ml-1 size-3.5", primary ? "text-deep" : "text-emerald")} />
      ) : (
        <Copy aria-hidden="true" className={cn("ml-1 size-3.5 transition-colors", primary ? "text-deep/60 group-hover:text-deep" : "text-muted-dim group-hover:text-muted-foreground")} />
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
