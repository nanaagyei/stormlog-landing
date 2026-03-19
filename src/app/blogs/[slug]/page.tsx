import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogMarkdown } from "@/components/blog/blog-markdown";
import { PostTableOfContents } from "@/components/blog/post-table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
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

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blogs/${post.slug}`,
      images: [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
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
      <div className="rounded-[28px] border border-dashed border-white/[0.08] px-5 py-6 text-sm text-muted-foreground">
        No {label.toLowerCase()} article.
      </div>
    );
  }

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block rounded-[28px] border border-white/[0.08] bg-[#071126]/88 px-5 py-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-cool-white/55">
        {label}
      </p>
      <h3 className="mt-3 font-heading text-xl font-semibold text-cool-white">
        {post.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {post.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm text-cool-white">
        Read article
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
      </span>
    </Link>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <div className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.18),transparent_56%)]" />
          <div className="absolute top-12 left-[12%] h-44 w-44 rounded-full bg-violet/18 blur-[120px]" />
          <div className="absolute top-52 right-[10%] h-56 w-56 rounded-full bg-cyan/10 blur-[140px]" />
          <div className="absolute inset-0 opacity-50 grid-bg" />
          <div className="absolute inset-0 opacity-35 noise-overlay" />
        </div>

        <section className="relative px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-cool-white transition-colors hover:border-violet/35"
            >
              <ArrowLeft className="size-4" />
              Back to blogs
            </Link>

            <div className="mt-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-cool-white/58">
                  <span className="rounded-full border border-violet/20 bg-violet/10 px-3 py-1 text-violet">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {post.readTimeLabel}
                  </span>
                  <span className="text-muted-foreground">{post.author}</span>
                </div>

                <h1 className="mt-6 max-w-5xl font-heading text-4xl font-semibold tracking-tight text-cool-white sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
                  {post.title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {post.description}
                </p>

                <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#071126]/82 shadow-[0_30px_110px_rgba(1,3,10,0.48)]">
                  <div className="relative aspect-[16/8]">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 75vw, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040812] via-transparent to-transparent" />
                  </div>
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
                className="sticky top-24 z-20 mb-6 lg:hidden"
              />

              <article
                id="blog-article-content"
                className="glass-panel rounded-[36px] px-5 py-8 sm:px-7 sm:py-10 lg:px-10"
              >
                <BlogMarkdown content={post.content} />
              </article>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
              <PostTableOfContents headings={post.headings} />
            </aside>
          </div>
        </section>

        <section className="relative px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="glass-panel rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
              <div className="grid gap-4 md:grid-cols-2">
                <PostNavCard label="Previous article" post={post.previousPost} />
                <PostNavCard label="Next article" post={post.nextPost} />
              </div>

              {post.relatedPosts.length > 0 ? (
                <div className="mt-10">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-cool-white/55">
                    Related posts
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-cool-white sm:text-3xl">
                    Continue through the rest of the Stormlog blog.
                  </h2>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {post.relatedPosts.map((relatedPost) => (
                      <BlogCard key={relatedPost.slug} post={relatedPost} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
