import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
      <section className="relative px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-6xl">
          <div>
            <span className="mono-label">Stormlog journal</span>
            <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Technical writing for teams tracing memory issues in real workloads.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse the full Stormlog story, from the launch overview and setup
              guide to deeper walkthroughs on artifacts, leak analysis, and
              distributed diagnostics.
            </p>
          </div>

          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
                Featured
              </span>
            </div>
            <BlogCard post={featuredPost} featured />
          </div>

          <div className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
                All posts
              </span>
              <span className="hidden items-center gap-1.5 font-mono text-xs text-muted-foreground/40 md:inline-flex">
                Static pages
                <ArrowRight className="size-3" />
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
