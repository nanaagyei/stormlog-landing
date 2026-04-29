"use client";

import Link from "next/link";
import { BookOpen, Github, Package, TriangleAlert } from "lucide-react";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { MAINTAINERS } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr]">
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              Stormlog
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Real-time GPU memory profiling for PyTorch and TensorFlow.
              Open-source CLI, Python API, and interactive TUI.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/#overview" className="transition-colors hover:text-foreground">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition-colors hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="transition-colors hover:text-foreground">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/#tui" className="transition-colors hover:text-foreground">
                  TUI
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={EXTERNAL_LINKS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <BookOpen className="size-3.5" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <Github className="size-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <Package className="size-3.5" />
                  PyPI
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <TriangleAlert className="size-3.5" />
                  Issues
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
              Maintainers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {MAINTAINERS.map((maintainer) => (
                <li key={maintainer.github}>
                  <a
                    href={`https://github.com/${maintainer.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    {maintainer.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-6 font-mono text-xs text-muted-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Stormlog contributors</p>
          <p>GPU memory debugging, shipped in the open.</p>
        </div>
      </div>
    </footer>
  );
}
