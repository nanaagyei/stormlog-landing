import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { clashGrotesk, satoshi } from "@/lib/fonts";
import { GsapProvider } from "@/lib/gsap-provider";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stormlog.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Stormlog — Real-time GPU Memory Profiling",
    template: "%s | Stormlog",
  },
  description:
    "Stormlog gives PyTorch and TensorFlow teams real-time GPU memory visibility, leak detection, diagnostics, and exportable timelines across CLI, Python API, and Textual TUI workflows. Open-source and production-ready.",
  keywords: [
    "GPU memory profiler",
    "PyTorch",
    "TensorFlow",
    "CUDA",
    "memory monitoring",
    "leak detection",
    "OOM",
    "machine learning",
    "deep learning",
    "MLOps",
    "GPU profiling",
    "memory profiling",
    "Textual TUI",
  ],
  authors: [
    { name: "Stormlog", url: "https://github.com/Silas-Asamoah/stormlog" },
  ],
  creator: "Stormlog",
  publisher: "Stormlog",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Stormlog",
    title: "Stormlog — Real-time GPU Memory Profiling",
    description:
      "Open-source GPU memory profiling for PyTorch and TensorFlow. Monitor allocation, detect leaks, and ship evidence into debugging reviews and CI pipelines.",
    images: [
      {
        url: "/images/stormlog-dark.JPG",
        width: 1200,
        height: 630,
        alt: "Stormlog — Real-time GPU Memory Profiling for PyTorch and TensorFlow",
      },
      {
        url: "/images/stormlog-white.JPG",
        width: 1200,
        height: 630,
        alt: "Stormlog — Real-time GPU Memory Profiling for PyTorch and TensorFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stormlog — Real-time GPU Memory Profiling",
    description:
      "Open-source GPU memory profiling for PyTorch and TensorFlow. Monitor, detect leaks, and optimize.",
    images: ["/images/stormlog-dark.JPG"],
  },
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
  applicationName: "Stormlog",
};

export const viewport: Viewport = {
  themeColor: "#030816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${clashGrotesk.variable} ${satoshi.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <GsapProvider>
            <a
              href="#features"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-xl focus:bg-cyan focus:px-4 focus:py-2 focus:text-deep focus:text-sm"
            >
              Skip to content
            </a>
            {children}
          </GsapProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
