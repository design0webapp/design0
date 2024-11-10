"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserInfo() {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase.from("users").select("*").single();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data,
  };
}
