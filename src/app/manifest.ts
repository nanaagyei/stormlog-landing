import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stormlog — Real-time GPU Memory Profiling",
    short_name: "Stormlog",
    description:
      "Open-source GPU memory profiling for PyTorch and TensorFlow. Real-time monitoring, leak detection, diagnostics, and exportable timelines across CLI, Python API, and Textual TUI.",
    start_url: "/",
    display: "standalone",
    background_color: "#030816",
    theme_color: "#030816",
    orientation: "portrait-primary",
    scope: "/",
    id: "/",
    icons: [
      {
        src: "/images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["developer tools", "productivity"],
  };
}
