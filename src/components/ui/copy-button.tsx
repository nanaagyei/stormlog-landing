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
      onClick={() => copy(text)}
      className={cn(
        "group glass-panel flex items-center gap-3 rounded-full",
        "px-5 py-3 font-mono text-sm",
        "transition-all hover:border-violet/40 hover:bg-white/[0.04]",
        className
      )}
      aria-label={`Copy "${text}" to clipboard`}
    >
      <span className="text-violet">$</span>
      <span className="text-cool-white">{displayText || text}</span>
      {copied ? (
        <Check className="ml-2 size-4 text-teal" />
      ) : (
        <Copy className="ml-2 size-4 text-muted-foreground transition-colors group-hover:text-violet" />
      )}
    </button>
  );
}
