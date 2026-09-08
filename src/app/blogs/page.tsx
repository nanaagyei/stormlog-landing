import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_SERIES } from "@/data/blogs";
import { BlogCard } from "@/components/blog/blog-card";
import { formatPublished, getSeriesPosts, getStandalonePosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read Stormlog articles covering setup guides, walkthroughs, artifacts, and distributed diagnostics for GPU memory debugging workflows.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Stormlog Blogs",
    description:
      "Explore launch notes, setup guides, walkthroughs, and distributed diagnostics articles for Stormlog.",
    url: "/blogs",
    images: [
      {
        url: "/new-meta.png",
        width: 3840,
        height: 2080,
        alt: "Stormlog blogs — GPU memory profiling articles and guides",
      },
    ],
  },
};

export default function BlogsPage() {
  const seriesPosts = getSeriesPosts();
  const standalonePosts = getStandalonePosts();

  return (
    <div className="relative">
      <section className="relative px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Technical writing for teams tracing memory issues in real workloads.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse the full Stormlog story, from the launch overview and setup
              guide to deeper walkthroughs on artifacts, leak analysis, and
              distributed diagnostics.
            </p>
          </div>

          {/* The series reads as a path, not a feed: numbered, in order, with an
              explicit entry point. Numbering is earned here because part 4
              assumes part 3 — the sequence is the information. */}
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              {BLOG_SERIES.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A {seriesPosts.length}-part sequence, written to be read in order.
              Each part also stands on its own if you already know where your
              problem is.
            </p>

            <ol className="mt-6 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-surface">
              {seriesPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2 sm:gap-5 sm:px-6 sm:py-5"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-deep font-mono text-xs font-semibold text-emerald">
                      {post.series?.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-dim">
                        <time dateTime={post.publishedAt}>
                          {formatPublished(post.publishedAt)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTimeLabel}</span>
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-muted-dim transition-colors group-hover:text-emerald"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {standalonePosts.length > 0 && (
            <div className="mt-14">
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                Release notes
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                What shipped, and how to use it.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {standalonePosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
