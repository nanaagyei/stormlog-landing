"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Github, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
] as const;

function isActive(pathname: string, href: (typeof PRIMARY_LINKS)[number]["href"]) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function BlogHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 right-0 left-0 z-50 mx-auto w-full px-4 sm:top-6 sm:px-6">
        <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2.5 sm:px-4">
          <Link
            href="/"
            className="shrink-0 rounded-full px-3 py-2 font-heading text-base font-semibold tracking-tight text-cool-white transition-colors hover:text-white"
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
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/[0.08] text-cool-white"
                      : "text-muted-foreground hover:text-cool-white"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-sm text-cool-white transition-all hover:border-violet/40 hover:bg-white/[0.04]"
            >
              <BookOpen className="size-4" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-sm text-muted-foreground transition-all hover:border-white/15 hover:bg-white/[0.04] hover:text-cool-white"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-full border border-white/[0.08] p-2.5 text-muted-foreground transition-colors hover:text-cool-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      {mobileOpen ? (
        <div className="fixed top-20 right-4 left-4 z-50 rounded-[28px] border border-white/[0.08] bg-[#09122a]/95 p-4 shadow-[0_24px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1.5">
            {PRIMARY_LINKS.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    active
                      ? "bg-white/[0.08] text-cool-white"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-cool-white"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.href === "/" ? (
                    <Home className="size-4" />
                  ) : (
                    <BookOpen className="size-4" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-sm text-cool-white"
            >
              <BookOpen className="size-4" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-sm text-muted-foreground"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
