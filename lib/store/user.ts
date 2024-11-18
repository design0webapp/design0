"use server";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types_db";

export async function getUser(): Promise<{
  error?: string;
  data?: Tables<"users">;
}> {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .maybeSingle();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data,
  };
}

export async function updateCredit(
  userId: string,
  newCredit: number,
): Promise<{
  error?: string;
  data?: Tables<"users">;
}> {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      credit: newCredit,
    })
    .eq("id", userId)
    .single();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data,
  };
}
