"use client";

import { useRouter } from "next/navigation";
import { Photo } from "@/lib/unsplash";

export default function ImageCard({ photo }: { photo: Photo }) {
  const router = useRouter();
  return (
    <div
      className="mb-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all"
      onClick={() => {
        router.push(`/edit?image=${encodeURIComponent(photo.urls.regular)}`);
      }}
    >
      <img
        src={photo.urls.small}
        alt={photo.alt_description || ""}
        className="rounded-lg"
      />
    </div>
  );
}
