import { CommonNavbar } from "@/components/common-navbar";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL("/about");
  return {
    alternates: {
      canonical: url,
    },
  };
}

export default async function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={"About Us"} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-4">
          <img src="/logo.webp" alt="Design0 Logo" className="w-12 h-12" />
          <h1 className="text-4xl font-bold">Design0 Team</h1>
        </div>
        <p className="text-lg text-center max-w-full mt-2 px-4">
          ✨ Empowering everyone to become a fashion designer through
          cutting-edge AI technology.
        </p>
        <p className="text-lg text-center max-w-full mt-2 px-4">
          🎨 Transform your creative ideas into stunning designs with just a few
          clicks!
        </p>
      </div>
    </main>
  );
}
