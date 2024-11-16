"use server";

const UNSPLASH_URL = "https://api.unsplash.com/";

export interface Photo {
  id: string;
  slug: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    bio: string | null;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export async function listPhotos(
  page: number,
  per_page: number,
): Promise<Photo[]> {
  const resp = await fetch(
    `${UNSPLASH_URL}/photos?page=${page}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );
  if (resp.status != 200) {
    console.error(resp.status, await resp.text());
    throw new Error("Failed to list photos");
  }
  return await resp.json();
}

export async function searchPhotos(
  query: string,
  page: number,
  per_page: number,
): Promise<Photo[]> {
  const resp = await fetch(
    `${UNSPLASH_URL}/search/photos?query=${encodeURI(query)}&page=${page}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );
  if (resp.status != 200) {
    console.error(resp.status, await resp.text());
    throw new Error("Failed to search photos");
  }
  const data = await resp.json();
  return data.results;
}
