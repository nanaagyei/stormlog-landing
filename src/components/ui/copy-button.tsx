"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  displayText?: string;
  className?: string;
}

export function CopyButton({ text, displayText, className }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg border border-white/6 bg-surface",
        "px-4 py-2.5 font-mono text-sm",
        "transition-all hover:border-white/20 hover:bg-surface-2",
        className
      )}
      aria-label={`Copy "${text}" to clipboard`}
    >
      <span className="text-emerald">$</span>
      <span className="text-foreground">{displayText || text}</span>
      {copied ? (
        <Check className="ml-1 size-3.5 text-emerald" />
      ) : (
        <Copy className="ml-1 size-3.5 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
      )}
    </button>
  );
}
