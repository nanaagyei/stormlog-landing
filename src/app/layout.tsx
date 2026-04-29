import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { clashGrotesk, satoshi, jetbrainsMono } from "@/lib/fonts";
import { GsapProvider } from "@/lib/gsap-provider";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stormlog.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Stormlog — Real-time GPU Memory Profiling for PyTorch & TensorFlow",
    template: "%s | Stormlog",
  },
  description:
    "Open-source GPU memory profiler for PyTorch and TensorFlow. Real-time allocation monitoring, leak detection, OOM prevention, exportable diagnostics, and an interactive TUI — all from a single pip install.",
  keywords: [
    "GPU memory profiler",
    "PyTorch profiler",
    "TensorFlow profiler",
    "CUDA memory",
    "memory monitoring",
    "leak detection",
    "OOM prevention",
    "out of memory",
    "machine learning",
    "deep learning",
    "MLOps",
    "GPU profiling",
    "memory profiling",
    "Textual TUI",
    "GPU diagnostics",
    "training debugging",
    "memory allocation",
    "nvidia-smi alternative",
    "pip install stormlog",
  ],
  authors: [
    { name: "Stormlog", url: "https://github.com/Silas-Asamoah/stormlog" },
  ],
  creator: "Stormlog",
  publisher: "Stormlog",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
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
      "See GPU memory before it breaks your training. Open-source profiler with real-time monitoring, leak detection, and exportable diagnostics for PyTorch and TensorFlow.",
    images: [
      {
        url: "/new-meta.png",
        width: 3840,
        height: 2080,
        alt: "Stormlog — Real-time GPU memory profiling dashboard showing CLI, TUI, and diagnostics interface",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stormlog — Real-time GPU Memory Profiling",
    description:
      "See GPU memory before it breaks your training. Open-source profiler for PyTorch & TensorFlow with real-time monitoring, leak detection, and exportable diagnostics.",
    images: [
      {
        url: "/new-meta.png",
        width: 3840,
        height: 2080,
        alt: "Stormlog — Real-time GPU memory profiling dashboard",
      },
    ],
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
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stormlog",
    url: baseUrl,
    description:
      "Open-source GPU memory profiler for PyTorch and TensorFlow. Real-time allocation monitoring, leak detection, OOM prevention, and exportable diagnostics.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Stormlog",
      url: "https://github.com/Silas-Asamoah/stormlog",
    },
    image: `${baseUrl}/new-meta.png`,
    screenshot: `${baseUrl}/new-meta.png`,
    featureList: [
      "Real-time GPU memory monitoring",
      "Memory leak detection",
      "OOM prevention",
      "Exportable diagnostics",
      "Interactive TUI",
      "PyTorch support",
      "TensorFlow support",
      "CLI interface",
      "Python API",
    ],
    softwareRequirements: "Python 3.8+, NVIDIA GPU with CUDA",
    installUrl: "https://pypi.org/project/stormlog/",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${clashGrotesk.variable} ${satoshi.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <GsapProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-emerald focus:px-4 focus:py-2 focus:text-deep focus:text-sm"
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
