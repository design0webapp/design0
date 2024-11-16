import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=${error.message}`,
      );
    }
    console.log("auth callback new user:", data.user);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}`);
}
