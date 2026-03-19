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
    if (headings.length === 0) {
      return;
    }

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio
          );

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.2, 0.5, 1],
      }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headingIds, headings.length]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "glass-panel rounded-[28px] border border-white/[0.08] p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-cool-white/60">
          <List className="size-4 text-violet" />
          On this page
        </div>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-cool-white"
            aria-expanded={open}
            aria-controls="blog-mobile-toc"
          >
            {open ? "Hide" : "Show"}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                open ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
        ) : null}
      </div>

      <nav
        id={collapsible ? "blog-mobile-toc" : undefined}
        className={cn("mt-4", collapsible && !open ? "hidden" : "block")}
        aria-label="Table of contents"
      >
        <ol className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block rounded-2xl px-3 py-2 text-sm transition-colors",
                  heading.level === 3 ? "ml-4" : "",
                  activeId === heading.id
                    ? "bg-white/[0.08] text-cool-white"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-cool-white"
                )}
                onClick={() => {
                  if (collapsible) {
                    setOpen(false);
                  }
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
