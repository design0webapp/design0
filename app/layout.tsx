import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Design0",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased min-h-screen", inter.className)}>
        {children}
      </body>
    </html>
  );
}
