import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogPostPreview } from "@/lib/blogs";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ post, featured = false, className }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group block overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#071126]/88 shadow-[0_24px_90px_rgba(1,3,10,0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
    >
      <article
        className={cn(
          "grid h-full gap-0",
          featured ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
        )}
      >
        <div className="relative min-h-[240px] overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
            sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040812] via-[#040812]/15 to-transparent" />
        </div>

        <div className="flex h-full flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-cool-white/58">
            <span className="rounded-full border border-violet/20 bg-violet/10 px-3 py-1 text-violet">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock3 className="size-3.5" />
              {post.readTimeLabel}
            </span>
          </div>

          <h2
            className={cn(
              "mt-5 font-heading font-semibold tracking-tight text-cool-white",
              featured ? "text-3xl sm:text-4xl" : "text-2xl"
            )}
          >
            {post.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {post.description}
          </p>

          <div className="mt-6 flex items-center gap-3 text-sm text-cool-white/82">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{post.readTimeMinutes} min</span>
          </div>

          <div className="mt-auto pt-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-sm text-cool-white transition-colors hover:border-violet/35 hover:text-white">
              Read article
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
