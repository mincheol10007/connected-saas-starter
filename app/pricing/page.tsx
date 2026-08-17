import { requireUser } from "@/lib/auth";

export default async function PricingPage() {
  await requireUser();

  return (
    <section className="card stack">
      <span className="badge">Polar Sandbox</span>
      <h1>Pro로 전환</h1>
      <p>Free는 할 일을 3개까지, Pro는 제한 없이 만들 수 있습니다.</p>
      <p className="muted">실결제가 아닌 Sandbox test card만 사용합니다.</p>
      <div>
        <form action="/api/checkout" method="post">
          <button className="button" type="submit">Sandbox 결제 시작</button>
        </form>
      </div>
    </section>
  );
}
