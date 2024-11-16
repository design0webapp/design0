"use client";

import { getURL } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/client";

export async function signInByGoogle() {
  const redirectURL = getURL("/auth/callback");

  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectURL,
    },
  });
}
