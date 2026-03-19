"use client";

import Link from "next/link";
import { BookOpen, Github, Package, TriangleAlert } from "lucide-react";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { MAINTAINERS } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/[0.08] bg-[#060d1d]/88 px-6 py-10 shadow-[0_24px_100px_rgba(1,3,10,0.5)] backdrop-blur-2xl sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-cool-white">
              Stormlog
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Real-time GPU memory profiling for PyTorch and TensorFlow with
              CLI, Python API, diagnostics artifacts, exportable timelines, and
              an interactive TUI.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.22em] text-cool-white/55">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#overview" className="transition-colors hover:text-cool-white">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition-colors hover:text-cool-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#workflow" className="transition-colors hover:text-cool-white">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/#tui" className="transition-colors hover:text-cool-white">
                  TUI showcase
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="transition-colors hover:text-cool-white">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.22em] text-cool-white/55">
              Resources
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={EXTERNAL_LINKS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cool-white"
                >
                  <BookOpen className="size-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cool-white"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cool-white"
                >
                  <Package className="size-4" />
                  PyPI package
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-cool-white"
                >
                  <TriangleAlert className="size-4" />
                  Issues
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-[0.22em] text-cool-white/55">
              Maintainers
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {MAINTAINERS.map((maintainer) => (
                <li key={maintainer.github}>
                  <a
                    href={`https://github.com/${maintainer.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-cool-white"
                  >
                    {maintainer.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Evidence-rich GPU memory debugging, shipped in the open.</p>
          <p>&copy; {new Date().getFullYear()} Stormlog contributors.</p>
        </div>
      </div>
    </footer>
  );
}
