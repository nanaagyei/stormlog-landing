import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogMarkdown } from "@/components/blog/blog-markdown";
import { PostTableOfContents } from "@/components/blog/post-table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ReadingActions } from "@/components/blog/reading-actions";
import { getBlogPost, getBlogPostSlugs } from "@/lib/blogs";
import { notFound } from "next/navigation";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blogs/${post.slug}`,
      images: [{ url: post.thumbnail, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.thumbnail],
    },
  };
}

function PostNavCard({
  label,
  post,
}: {
  label: string;
  post: NonNullable<ReturnType<typeof getBlogPost>>["previousPost"] | NonNullable<ReturnType<typeof getBlogPost>>["nextPost"];
}) {
  if (!post) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.06] px-5 py-5 text-sm text-muted-foreground">
        No {label.toLowerCase()} article.
      </div>
    );
  }

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block rounded-xl border border-white/[0.06] bg-surface px-5 py-5 transition-all hover:border-white/[0.12] motion-reduce:transition-none"
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
        {label}
      </p>
      <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {post.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-foreground">
        Read
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
      </span>
    </Link>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <div className="relative">
        <section className="relative px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to blog
            </Link>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="rounded-md border border-emerald/20 bg-emerald-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-emerald">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-muted-foreground/60">
                  <Clock3 className="size-3" />
                  {post.readTimeLabel}
                </span>
                <span className="font-mono text-muted-foreground/60">{post.author}</span>
                <ReadingActions slug={post.slug} />
              </div>

              <h1 className="mt-6 max-w-4xl font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.description}
              </p>

              <div className="relative mt-8 overflow-hidden rounded-xl border border-white/[0.06]">
                <div className="relative aspect-[16/8]">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 75vw, 100vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
            <div className="min-w-0">
              <PostTableOfContents
                headings={post.headings}
                collapsible
                className="sticky top-20 z-20 mb-6 lg:hidden"
              />

              <article
                id="blog-article-content"
                className="rounded-xl border border-white/[0.06] bg-surface px-5 py-8 sm:px-7 sm:py-10 lg:px-10"
              >
                <BlogMarkdown content={post.content} />
              </article>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <PostTableOfContents headings={post.headings} />
            </aside>
          </div>
        </section>

        <section className="relative px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 md:grid-cols-2">
              <PostNavCard label="Previous article" post={post.previousPost} />
              <PostNavCard label="Next article" post={post.nextPost} />
            </div>

            {post.relatedPosts.length > 0 ? (
              <div className="mt-10">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/50">
                  Related
                </span>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {post.relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
