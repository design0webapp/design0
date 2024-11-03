"use client";

import { redirect } from "next/navigation";

export default function EditPage({
  searchParams,
}: {
  searchParams: {
    image: string;
  };
}) {
  if (searchParams.image == undefined) {
    redirect("/");
  }

  return (
    <div className="px-2 py-24 mx-auto w-[64rem] max-w-full flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-black">Edit Image</h1>
      <img
        src={searchParams.image}
        className="max-w-full max-h-screen px-2 py-4"
      />
    </div>
  );
}
