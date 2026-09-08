import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { BlogHeader } from "@/components/layout/blog-header";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BlogHeader />
      <main id="main-content" className="overflow-x-clip pt-20 sm:pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
