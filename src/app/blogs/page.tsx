import type { Metadata } from "next";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { getAllBlogPosts, getFeaturedBlogPost } from "@/lib/blogs";

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
        url: "/images/stormlog-preview.png",
        width: 1200,
        height: 630,
        alt: "Stormlog blogs",
      },
    ],
  },
};

export default function BlogsPage() {
  const posts = getAllBlogPosts();
  const featuredPost = getFeaturedBlogPost();
  const remainingPosts = posts.filter((post) => post.slug !== featuredPost.slug);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_55%)]" />
        <div className="absolute top-10 left-[8%] h-44 w-44 rounded-full bg-violet/15 blur-[120px]" />
        <div className="absolute top-40 right-[10%] h-56 w-56 rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-55 grid-bg" />
        <div className="absolute inset-0 opacity-40 noise-overlay" />
      </div>

      <section className="relative px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="glass-panel rounded-[36px] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-violet">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet/10 px-4 py-2">
                <Sparkles className="size-3.5" />
                Stormlog journal
              </span>
              <span className="inline-flex items-center gap-2 text-cool-white/50">
                <BookOpenText className="size-3.5" />
                5 launch articles
              </span>
            </div>

            <div className="mt-6 max-w-4xl">
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-cool-white sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                Technical writing for teams tracing memory issues in real workloads.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                Browse the full Stormlog story, from the launch overview and setup
                guide to deeper walkthroughs on artifacts, leak analysis, and
                distributed diagnostics.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cool-white/55">
                  Featured article
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-cool-white sm:text-3xl">
                  Start with the story behind the product.
                </h2>
              </div>
            </div>

            <BlogCard post={featuredPost} featured />
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cool-white/55">
                  All posts
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-cool-white sm:text-3xl">
                  Explore every Stormlog article.
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-muted-foreground md:inline-flex">
                Static pages
                <ArrowRight className="size-4 text-violet" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {remainingPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
