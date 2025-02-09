"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listPhotos, searchPhotos, trackDownload } from "@/lib/unsplash";
import { Basic } from "unsplash-js/src/methods/photos/types";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function ImageCard({ photo }: { photo: Basic }) {
  const router = useRouter();
  return (
    <div
      className="mb-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all relative"
      onClick={() => {
        trackDownload(photo.links.download_location);
        router.push(`/edit?image=${encodeURIComponent(photo.urls.regular)}`);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.urls.small}
        alt={photo.alt_description || ""}
        className="rounded-lg bg-muted object-cover"
        width={400}
        height={(400 / photo.width) * photo.height}
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/30 backdrop-blur-sm rounded-b-lg">
        <div className="text-xs text-white">
          Photo by{" "}
          <a
            href={
              photo.user.links.html + "?utm_source=Design0&utm_medium=referral"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            {photo.user.name}
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com?utm_source=Design0&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            onClick={(e) => e.stopPropagation()}
          >
            Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StartFromUnsplash() {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<Basic[]>([]);

  useEffect(() => {
    listPhotos(1, 24)
      .then(setPhotos)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (query.trim().length > 0) {
        const photos = await searchPhotos(query, 1, 24);
        setPhotos(photos);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-[48rem] max-w-full flex space-x-2">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(event) => {
            event.preventDefault();
            setQuery(event.currentTarget.value);
          }}
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {isLoading ? (
        <LoaderCircle className="mt-8 text-gray-600 animate-spin" />
      ) : (
        <div className="mt-8 columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-3">
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </>
  );
}
