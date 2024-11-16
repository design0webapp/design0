"use server";

import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/helpers";

export async function signIn(email: string, password: string) {
  "use server";

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data,
  };
}

export async function signUp(email: string, password: string) {
  "use server";

  const callbackURL = getURL("/auth/callback");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data,
  };
}

export async function signOut() {
  "use server";

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: "success",
  };
}

export async function getUser() {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return {
      error: error.message,
    };
  }
  return {
    data: data.user,
  };
}
