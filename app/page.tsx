import { CommonNavbar } from "@/components/common-navbar";
import { Metadata } from "next";
import { getURL } from "@/lib/helpers";
import StartFromUnsplash from "@/components/start-unsplash";
import { FileSearch2, ImageUp } from "lucide-react";
import StartFromUpload from "@/components/start-upload";
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const url = getURL();
  return {
    alternates: {
      canonical: url,
    },
  };
}

export default async function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <CommonNavbar pageName={null} />
      <section className="px-2 py-10 sm:py-12 md:py-16 xl:py-20 text-center bg-neutral-100">
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tighter">
          Welcome to Design0 🎨
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-neutral-600 font-light">
          Effortless Image Editor for Everyone
        </p>
        <div className="mt-8 animate-bounce">
          <span className="text-2xl">↓</span>
        </div>
      </section>
      <section className="px-2 md:px-12 xl:px-20 py-10 md:py-16 mx-auto max-w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-8 flex items-center justify-center gap-2">
          <ImageUp className="w-8 h-8 md:w-10 md:h-10" />
          Upload Image to Edit
        </h2>
        <StartFromUpload />
      </section>
      <Separator className="my-4" />
      <section className="px-2 md:px-12 xl:px-20 py-10 md:py-16 mx-auto max-w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-8 flex items-center justify-center gap-2">
          <FileSearch2 className="w-8 h-8 md:w-10 md:h-10" />
          Search Photo to Edit
        </h2>
        <StartFromUnsplash />
      </section>
    </main>
  );
}
