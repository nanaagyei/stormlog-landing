"use client";

import Link from "next/link";
import { ChevronDown, List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BlogHeading } from "@/lib/blogs";
import { cn } from "@/lib/utils";

interface PostTableOfContentsProps {
  headings: BlogHeading[];
  collapsible?: boolean;
  className?: string;
}

export function PostTableOfContents({
  headings,
  collapsible = false,
  className,
}: PostTableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.2, 0.5, 1] }
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [headingIds, headings.length]);

  if (headings.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-surface p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
          <List className="size-3.5 text-emerald" />
          On this page
        </div>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-expanded={open}
            aria-controls="blog-mobile-toc"
          >
            {open ? "Hide" : "Show"}
            <ChevronDown
              className={cn(
                "size-3 transition-transform",
                open ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
        ) : null}
      </div>

      <nav
        id={collapsible ? "blog-mobile-toc" : undefined}
        className={cn("mt-3", collapsible && !open ? "hidden" : "block")}
        aria-label="Table of contents"
      >
        <ol className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  heading.level === 3 ? "ml-4" : "",
                  activeId === heading.id
                    ? "bg-emerald-muted text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
                onClick={() => {
                  if (collapsible) setOpen(false);
                }}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
