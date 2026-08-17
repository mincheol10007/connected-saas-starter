import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <span className="badge">자가 연결 실습</span>
      <h1>작은 SaaS를 실제 URL까지 연결합니다.</h1>
      <p className="muted">
        Google 로그인, 사용자별 데이터, Sandbox 결제, Preview와 Production을 한 번에 확인합니다.
      </p>
      <div className="row">
        <Link className="button" href="/login">Google로 시작</Link>
        <Link className="button secondary" href="/dashboard">대시보드</Link>
      </div>
    </section>
  );
}
