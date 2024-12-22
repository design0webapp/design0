"use server";

import { createApi } from "unsplash-js";
import { Basic } from "unsplash-js/src/methods/photos/types";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export async function trackDownload(url: string) {
  console.log("tracking download", url);
  await unsplash.photos.trackDownload({
    downloadLocation: url,
  });
}

export async function listPhotos(
  page: number,
  perPage: number,
): Promise<Basic[]> {
  const resp = await unsplash.photos.list({
    page,
    perPage,
  });
  if (resp.status != 200) {
    console.error(resp.status, resp.type);
    throw new Error("Failed to list photos");
  }
  return resp.response?.results ?? [];
}

export async function searchPhotos(
  query: string,
  page: number,
  perPage: number,
): Promise<Basic[]> {
  const resp = await unsplash.search.getPhotos({
    query,
    page,
    perPage,
  });
  if (resp.status != 200) {
    console.error(resp.status, resp.type);
    throw new Error("Failed to search photos");
  }
  return resp.response?.results ?? [];
}
