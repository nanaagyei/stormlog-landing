"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Github, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blogs" },
] as const;

function isActive(pathname: string, href: (typeof PRIMARY_LINKS)[number]["href"]) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BlogHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-white"
          >
            Stormlog
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {PRIMARY_LINKS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-[13px] transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="size-3.5" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-3.5" />
              GitHub
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-white/[0.06] p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-14 z-50 border-b border-white/[0.06] bg-[#09090b]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {PRIMARY_LINKS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white/[0.04] text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.href === "/" ? <Home className="size-3.5" /> : <BookOpen className="size-3.5" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 border-t border-white/[0.06] pt-3">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-sm text-foreground"
            >
              <BookOpen className="size-3.5" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-sm text-muted-foreground"
            >
              <Github className="size-3.5" />
              GitHub
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
