"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(image: string) {
  "use server";

  // Get current user
  const { data: user, error: getUserErr } = await getAuthUser();
  if (getUserErr) {
    return { error: "USER_NOT_FOUND" };
  }

  // Convert base64 to buffer
  const buffer = Buffer.from(image.split(",")[1], "base64");

  // Generate unique filename
  const filename = `${uuidv4()}.png`;
  const filePath = `${user!.id}/${filename}`;

  const supabase = createClient();
  // Upload to storage
  const { error: uploadErr } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      contentType: "image/png",
      upsert: false,
    });
  if (uploadErr) {
    return { error: uploadErr.message };
  }
  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);
  return { url: publicUrl };
}
