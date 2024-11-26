import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import React from "react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Design0",
  description: "Effortless Design for Everyone.",
  authors: [{ name: "Hantian Pang", url: "https://github.com/ppaanngggg" }],
  creator: "Hantian Pang",
  publisher: "Hantian Pang",
  robots: "follow, index",
  icons: { icon: "/favicon.ico" },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased min-h-screen flex flex-col",
          inter.className,
        )}
      >
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
