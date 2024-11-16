"use server";

const BACKEND_URL = process.env.BACKEND_URL;

export interface EditImageResponse {
  url: string;
}

export async function editImage(
  image: string,
  polygons: number[][][],
  prompt: string,
): Promise<EditImageResponse> {
  "user server";

  const resp = await fetch(`${BACKEND_URL}/api/image/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: image,
      polygons: polygons,
      prompt: prompt,
    }),
  });
  if (resp.status != 200) {
    console.error(resp.status, await resp.text());
    throw new Error("Failed to edit image");
  }
  return await resp.json();
}
