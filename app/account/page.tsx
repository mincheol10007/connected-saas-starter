import Link from "next/link";

import { requireUser } from "@/lib/auth";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("plan,polar_order_id,updated_at")
    .eq("user_id", user.id)
    .maybeSingle();
  const plan = entitlement?.plan === "pro" ? "Pro" : "Free";

  return (
    <section className="card stack">
      <h1>계정</h1>
      {checkout === "success" && plan === "Free" && (
        <p className="muted">결제가 끝났습니다. webhook 반영까지 잠시 기다린 뒤 새로고침하세요.</p>
      )}
      {checkout === "success" && plan === "Pro" && <p className="success">결제와 webhook 반영이 완료됐습니다.</p>}
      <p><strong>사용자</strong> {user.email}</p>
      <p><strong>요금제</strong> <span className="badge">{plan}</span></p>
      <p><strong>마지막 주문</strong> {entitlement?.polar_order_id ?? "없음"}</p>
      <p><strong>마지막 반영</strong> {entitlement?.updated_at ?? "없음"}</p>
      <div className="row">
        {plan === "Free" && <Link className="button" href="/pricing">Pro 결제</Link>}
        <form action="/auth/signout" method="post">
          <button className="button secondary" type="submit">로그아웃</button>
        </form>
      </div>
    </section>
  );
}
