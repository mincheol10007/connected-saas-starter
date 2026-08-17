import { signInWithGoogle } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="card stack">
      <h1>로그인</h1>
      <p className="muted">강사가 등록한 Google 테스트 사용자로 로그인하세요.</p>
      {error && <p className="error">로그인에 실패했습니다. OAuth URL 설정을 확인하세요.</p>}
      <form action={signInWithGoogle}>
        <button className="button" type="submit">Google로 로그인</button>
      </form>
    </section>
  );
}
