import localFont from "next/font/local";

export const clashGrotesk = localFont({
  src: "../app/fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash-grotesk",
  display: "swap",
  weight: "200 700",
});

export const satoshi = localFont({
  src: "../app/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});
