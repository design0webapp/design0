import Search from "@/components/search";
import { fetchImages } from "@/lib/backend";
import ImageCard from "@/components/image-card";
import { CommonNavbar } from "@/components/common-navbar";

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    query: string | undefined;
  };
}) {
  const images = await fetchImages(searchParams.query);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <CommonNavbar pageName={null} />
      <div className="flex-1 px-2 py-24 mx-auto w-[64rem] max-w-full flex flex-col items-center">
        <h1 className="text-4xl font-black">Welcome to Design0!</h1>
        <h2 className="mt-3 text-md font-semibold mb-6">
          Effortless Design for Everyone.
        </h2>
        <Search query={searchParams.query} />
        <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-3">
          {images.images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      </div>
    </main>
  );
}
