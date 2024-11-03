"use server";

const BACKEND_URL = process.env.BACKEND_URL;

interface Image {
  id: string;
  url: string;
  category: string;
  description: string;
}

interface ImagesResponse {
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
  }
  return await resp.json();
}
