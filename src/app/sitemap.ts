import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stormlog.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllBlogPosts();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      // Real publish date, not build time — `new Date()` told crawlers every
      // article changed on every deploy.
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
