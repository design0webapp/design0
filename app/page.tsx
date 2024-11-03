import Search from "@/components/search";
import { fetchImages } from "@/lib/backend";

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
    <div className="px-2 py-24 mx-auto w-[64rem] max-w-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black">Welcome to Design0!</h1>
      <h2 className="mt-3 text-md font-semibold mb-6">Design with no pain.</h2>
      <Search query={searchParams.query} />
      <div className="mt-10 columns-1 sm:columns-2 md:columns-3 gap-3">
        {images.images.map((image) => (
          <div
            key={image.id}
            className="mb-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all"
          >
            <img
              src={image.url}
              alt={image.description}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
