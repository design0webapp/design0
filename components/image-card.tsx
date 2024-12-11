"use client";

import { useRouter } from "next/navigation";
import { Basic } from "unsplash-js/src/methods/photos/types";
import { trackDownload } from "@/lib/unsplash";

export default function ImageCard({ photo }: { photo: Basic }) {
  const router = useRouter();
  return (
    <div
      className="mb-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all relative"
      onClick={async () => {
        await trackDownload(photo.links.download_location);
        router.push(`/edit?image=${encodeURIComponent(photo.urls.regular)}`);
      }}
    >
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
