import { NextResponse } from "next/server";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "POLAR_ACCESS_TOKEN",
  "POLAR_WEBHOOK_SECRET",
  "POLAR_PRODUCT_ID",
  "APP_INSTANCE_ID",
] as const;

export function GET() {
  const configured = Object.fromEntries(required.map((name) => [name, Boolean(process.env[name])]));
  const ready = Object.values(configured).every(Boolean);

  return NextResponse.json(
    {
      ok: ready,
      environment: process.env.VERCEL_ENV ?? "development",
      configured,
    },
    { status: ready ? 200 : 503 },
  );
}
