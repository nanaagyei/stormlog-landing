import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { clashGrotesk, satoshi } from "@/lib/fonts";
import { GsapProvider } from "@/lib/gsap-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stormlog — Real-time GPU Memory Profiling",
  description:
    "Open-source GPU memory profiling tool for PyTorch and TensorFlow. Real-time monitoring, automatic leak detection, CLI, Python API, and interactive TUI.",
  keywords: [
    "GPU memory profiler",
    "PyTorch",
    "TensorFlow",
    "CUDA",
    "memory monitoring",
    "leak detection",
    "machine learning",
    "deep learning",
  ],
  openGraph: {
    title: "Stormlog — Real-time GPU Memory Profiling",
    description:
      "Open-source GPU memory profiling for PyTorch and TensorFlow. Monitor, detect leaks, and optimize.",
    type: "website",
  },
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
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-cyan focus:px-4 focus:py-2 focus:text-deep focus:text-sm"
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
