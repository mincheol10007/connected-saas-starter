import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Connected SaaS Lab",
  description: "Google, Supabase, Polar, Vercel 연결 실습",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          <nav className="nav">
            <Link href="/">Connected SaaS</Link>
            <Link href="/dashboard">할 일</Link>
            <Link href="/pricing">결제</Link>
            <Link href="/account">계정</Link>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
