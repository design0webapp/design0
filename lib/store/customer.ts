"use server";

import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/types_db";

export async function insertCustomer(
  customerId: string,
): Promise<Tables<"customers">> {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert({
      customer_id: customerId,
    })
    .select()
    .single();
  if (error) throw Error(`insert customer error: ${error.message}`);
  return data;
}

export async function getCustomer(): Promise<Tables<"customers"> | null> {
  "use server";

  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select()
    .maybeSingle();
  if (error) throw Error(`get customer error: ${error.message}`);
  return data;
}
