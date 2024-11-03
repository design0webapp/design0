"use client";

import { Image } from "@/lib/backend";
import { useRouter } from "next/navigation";

export default function ImageCard({ image }: { image: Image }) {
  const router = useRouter();
  return (
    <div
      className="mb-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-all"
      onClick={() => {
        router.push(`/edit?image=${encodeURIComponent(image.url)}`);
      }}
    >
      <img src={image.url} alt={image.description} className="rounded-lg" />
    </div>
  );
}
