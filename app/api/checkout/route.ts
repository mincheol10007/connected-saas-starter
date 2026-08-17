import { Polar } from "@polar-sh/sdk";
import { NextResponse } from "next/server";

import { getSiteUrl, requireEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.redirect(`${getSiteUrl()}/login`, { status: 303 });
  }

  const polar = new Polar({
    accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
    server: "sandbox",
  });
  const checkout = await polar.checkouts.create({
    products: [requireEnv("POLAR_PRODUCT_ID")],
    externalCustomerId: data.user.id,
    customerEmail: data.user.email,
    successUrl: `${getSiteUrl()}/account?checkout=success`,
    returnUrl: `${getSiteUrl()}/pricing`,
    metadata: { app_instance_id: requireEnv("APP_INSTANCE_ID") },
  });

  return NextResponse.redirect(checkout.url, { status: 303 });
}
