import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import GithubSlugger from "github-slugger";
import { BLOG_AUTHOR, BLOG_POSTS, type BlogRegistryEntry } from "@/data/blogs";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "articles");
const WORDS_PER_MINUTE = 220;

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogPostPreview extends BlogRegistryEntry {
  author: string;
  readTimeMinutes: number;
  readTimeLabel: string;
}

export interface BlogPost extends BlogPostPreview {
  content: string;
  headings: BlogHeading[];
  previousPost: BlogPostPreview | null;
  nextPost: BlogPostPreview | null;
  relatedPosts: BlogPostPreview[];
}

const BLOG_LINK_ALIASES: Record<string, string> = {
  "../distributed-diagnostics": "/blogs/distributed-diagnostics",
  "../distributed-diagnostics/": "/blogs/distributed-diagnostics",
  "./distributed-diagnostics": "/blogs/distributed-diagnostics",
};

const readArticleFile = cache((articleFile: string) =>
  fs.readFileSync(path.join(ARTICLES_DIRECTORY, articleFile), "utf8")
);

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/[#>*_|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(markdown: string) {
  const wordCount = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return {
    readTimeMinutes,
    readTimeLabel: `${readTimeMinutes} min read`,
  };
}

function cleanHeadingText(rawText: string) {
  return rawText
    .replace(/\s+#+$/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function stripLeadingTitle(markdown: string) {
  return markdown.replace(/^#\s+.+(?:\r?\n)+/, "").trimStart();
}

function extractHeadings(markdown: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const slugger = new GithubSlugger();
  const lines = markdown.split(/\r?\n/);
  let fenceMarker: "```" | "~~~" | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      const currentMarker = trimmed.startsWith("```") ? "```" : "~~~";
      fenceMarker = fenceMarker === currentMarker ? null : currentMarker;
      continue;
    }

    if (fenceMarker) {
      continue;
    }

    const match = /^(#{2,3})\s+(.*)$/.exec(trimmed);

    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = cleanHeadingText(match[2]);

    if (!text) {
      continue;
    }

    headings.push({
      id: slugger.slug(text),
      text,
      level,
    });
  }

  return headings;
}

function getPreview(entry: BlogRegistryEntry): BlogPostPreview {
  const markdown = readArticleFile(entry.articleFile);
  const readTime = estimateReadTime(markdown);

  return {
    ...entry,
    author: BLOG_AUTHOR,
    ...readTime,
  };
}

export const getAllBlogPosts = cache(() => BLOG_POSTS.map(getPreview));

export function getFeaturedBlogPost() {
  const posts = getAllBlogPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getBlogPostSlugs() {
  return BLOG_POSTS.map((post) => post.slug);
}

export function resolveBlogHref(href: string) {
  if (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  const [rawPath, hash = ""] = href.split("#");
  const normalizedPath = rawPath.replace(/\/$/, "");

  if (BLOG_LINK_ALIASES[normalizedPath]) {
    return `${BLOG_LINK_ALIASES[normalizedPath]}${hash ? `#${hash}` : ""}`;
  }

  const basename = path.basename(normalizedPath).replace(/\.md$/, "");
  const match = BLOG_POSTS.find((post) => {
    const articleBasename = post.articleFile.replace(/\.md$/, "");
    return post.slug === basename || articleBasename === basename;
  });

  if (!match) {
    return href;
  }

  return `/blogs/${match.slug}${hash ? `#${hash}` : ""}`;
}

export const getBlogPost = cache((slug: string): BlogPost | null => {
  const previews = getAllBlogPosts();
  const currentIndex = previews.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return null;
  }

  const currentPost = previews[currentIndex];
  const content = stripLeadingTitle(readArticleFile(currentPost.articleFile));
  const relatedPosts = currentPost.relatedSlugs
    .map((relatedSlug) => previews.find((post) => post.slug === relatedSlug) ?? null)
    .filter((post): post is BlogPostPreview => Boolean(post));

  return {
    ...currentPost,
    content,
    headings: extractHeadings(content),
    previousPost: previews[currentIndex - 1] ?? null,
    nextPost: previews[currentIndex + 1] ?? null,
    relatedPosts,
  };
});
