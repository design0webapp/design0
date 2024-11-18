"use server";

import { getUser, updateCredit } from "@/lib/store/user";

const BACKEND_URL = process.env.BACKEND_URL;
const MOCK_MODE: boolean = process.env.MOCK_MODE === "true";

export interface EditImageResponse {
  error?: string;
  url?: string;
}

export async function editImage(
  image: string,
  polygons: number[][][],
  prompt: string,
): Promise<EditImageResponse> {
  "use server";

  // check user and credits
  const { data: user, error: getUserError } = await getUser();
  if (getUserError) {
    console.log("getUserError:", getUserError);
  }
  if (!user) {
    return { error: "user not found" };
  }
  if (user.credit < 2) {
    return { error: "not enough credits" };
  }

  let retUrl: string;
  if (MOCK_MODE) {
    // if mock mode, sleep 5 seconds and return the original image
    await new Promise((resolve) => setTimeout(resolve, 5000));
    retUrl = image;
  } else {
    // call backend
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
      console.error(
        "call /api/image/edit failed:",
        resp.status,
        await resp.text(),
      );
      return { error: "failed to edit image" };
    }
    const data = await resp.json();
    retUrl = data.url;
  }

  // update user credit
  const { error: updateError } = await updateCredit(
    user.id,
    Math.max(user.credit - 2, 0),
  );
  if (updateError) {
    console.log("updateError:", updateError);
  }

  return { url: retUrl };
}
