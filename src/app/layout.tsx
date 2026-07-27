import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Co-op DSA Tracker | Minimal Progress Tracker",
  description: "A premium, minimal DSA progress-tracking website for two people studying together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-[#F7F8FA] text-[#111827] antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
