"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function finishCheckout(sessionId: string) {
  "use server";

  // update checkout and fetch checkout
  const { data: checkout, error: updateCheckoutError } = await supabaseAdmin
    .from("checkouts")
    .update({
      is_completed: true,
    })
    .eq("session_id", sessionId)
    .select()
    .maybeSingle();
  if (updateCheckoutError)
    throw Error(`update checkout error: ${updateCheckoutError.message}`);
  if (!checkout) throw Error(`checkout not found`);
  // get user credit
  const { data: user, error: fetchUserError } = await supabaseAdmin
    .from("users")
    .select("credit")
    .eq("id", checkout.user_id)
    .maybeSingle();
  if (fetchUserError)
    throw Error(`fetch user error: ${fetchUserError.message}`);
  if (!user) throw Error(`user not found`);
  // update user credit
  const { error: updateCreditError } = await supabaseAdmin
    .from("users")
    .update({
      credit: user.credit + checkout.credit,
    })
    .eq("id", checkout.user_id);
  if (updateCreditError)
    throw Error(`update credit error: ${updateCreditError.message}`);
}

export async function insertCheckout(
  priceId: string,
  quantity: number,
  credit: number,
  sessionId: string,
) {
  "use server";

  const supabase = createClient();
  const { error } = await supabase.from("checkouts").insert({
    price_id: priceId,
    quantity: quantity,
    credit: credit,
    session_id: sessionId,
  });
  if (error) throw Error(`insert charge error: ${error.message}`);
}
