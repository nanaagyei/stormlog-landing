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
        "group block overflow-hidden rounded-xl border border-white/[0.06] bg-surface transition-all hover:border-white/[0.12] motion-reduce:transition-none",
        className
      )}
    >
      <article
        className={cn(
          "grid h-full gap-0",
          featured ? "lg:grid-cols-[1fr_1.1fr]" : ""
        )}
      >
        <div className="relative min-h-[200px] overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
            sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
        </div>

        <div className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-md border border-emerald/20 bg-emerald-muted px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-emerald">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-muted-foreground/60">
              <Clock3 className="size-3" />
              {post.readTimeLabel}
            </span>
          </div>

          <h2
            className={cn(
              "mt-4 font-heading font-semibold tracking-tight text-foreground",
              featured ? "text-2xl sm:text-3xl" : "text-xl"
            )}
          >
            {post.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>

          <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted-foreground/50">
            <span>{post.author}</span>
            <span className="size-0.5 rounded-full bg-white/20" />
            <span>{post.readTimeMinutes} min</span>
          </div>

          <div className="mt-auto pt-5">
            <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
              Read
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
