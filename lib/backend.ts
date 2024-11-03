"use server";

const BACKEND_URL = process.env.BACKEND_URL;

export interface Image {
  id: string;
  url: string;
  category: string;
  description: string;
}

export interface ImagesResponse {
  images: Image[];
}

export async function fetchImages(
  query: string | undefined,
): Promise<ImagesResponse> {
  "use server";

  let resp: Response;
  if (query == undefined) {
    // get random images
    resp = await fetch(`${BACKEND_URL}/api/image/random?limit=12`, {
      method: "GET",
    });
  } else {
    // get search results
    resp = await fetch(
      `${BACKEND_URL}/api/image/search?query=${query}&limit=12`,
      {
        method: "GET",
      },
    );
  }
  if (resp.status != 200) {
    console.error(resp.status, await resp.text());
    throw new Error("Failed to fetch images");
  }
  return await resp.json();
}

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
