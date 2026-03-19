import Link from "next/link";
import type { Element, RootContent } from "hast";
import type { Components } from "react-markdown";
import { MarkdownAsync } from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/blog/code-block";
import { resolveBlogHref } from "@/lib/blogs";

interface BlogMarkdownProps {
  content: string;
}

function getNodeText(node: RootContent | Element | undefined): string {
  if (!node) {
    return "";
  }

  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((child) => getNodeText(child)).join("");
  }

  return "";
}

function getPreLanguage(node: Element | undefined) {
  const preLanguage =
    typeof node?.properties?.["data-language"] === "string"
      ? node.properties["data-language"]
      : undefined;
  const codeChild = node?.children.find(
    (child): child is Element => child.type === "element" && child.tagName === "code"
  );
  const classNames = Array.isArray(codeChild?.properties?.className)
    ? codeChild.properties.className
    : [];
  const languageClass = classNames.find(
    (className): className is string =>
      typeof className === "string" && className.startsWith("language-")
  );

  return preLanguage ?? languageClass?.replace("language-", "") ?? undefined;
}

const markdownComponents: Components = {
  a: ({ href = "", children, node, ...props }) => {
    void node;
    const resolvedHref = resolveBlogHref(href);
    const isExternal =
      resolvedHref.startsWith("http://") ||
      resolvedHref.startsWith("https://") ||
      resolvedHref.startsWith("mailto:") ||
      resolvedHref.startsWith("tel:");

    if (resolvedHref.startsWith("#") || isExternal) {
      return (
        <a
          href={resolvedHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={resolvedHref} {...props}>
        {children}
      </Link>
    );
  },
  pre: ({ children, node }) => {
    const hastNode = node as Element | undefined;
    const code = getNodeText(hastNode).replace(/\n$/, "");
    const language = getPreLanguage(hastNode);

    return (
      <CodeBlock code={code} language={language}>
        {children}
      </CodeBlock>
    );
  },
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-[24px] border border-white/[0.08] bg-[#071126]/82">
      <table>{children}</table>
    </div>
  ),
};

const prettyCodeOptions = {
  keepBackground: false,
  theme: "github-dark-default",
  onVisitLine(element: Element) {
    if (element.children.length === 0) {
      element.children = [{ type: "text", value: " " }];
    }
  },
};

export async function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-prose">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["blog-heading-anchor"],
                ariaLabel: "Link to section",
              },
              content: [{ type: "text", value: "#" }],
            },
          ],
          [rehypePrettyCode, prettyCodeOptions],
        ]}
        components={markdownComponents}
      >
        {content}
      </MarkdownAsync>
    </div>
  );
}
