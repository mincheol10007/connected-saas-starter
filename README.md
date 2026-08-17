# Connected SaaS Starter

자기 GitHub·Vercel·Supabase·Google·Polar 계정을 연결해 보는 수강생용 Next.js starter다. 기능 코드를 새로 작성하기보다 준비된 앱을 자기 project에 연결하고 실제 URL에서 확인한다.

## 준비물

- Node.js 20 이상과 Git
- GitHub, Vercel, Supabase, Google, Polar Sandbox 계정

## 처음 시작하기

```powershell
git clone https://github.com/mincheol10007/connected-saas-starter.git
cd connected-saas-starter
npm ci
Copy-Item .env.example .env.local
npm run dev
```

`.env.local`의 빈 값은 수업에서 자기 계정의 값으로 채운다. 다른 PC에서 AI와 함께 시작할 때는 [OTHER-PC-START-PROMPT.md](./OTHER-PC-START-PROMPT.md)의 프롬프트를 복사한다.

## 연결 전 코드 확인

```powershell
npm run typecheck
npm run build
```

외부 서비스를 연결하지 않은 상태의 build 검증에는 실제 credential 대신 일회성 placeholder 환경변수를 사용한다. placeholder는 로그인·결제·배포가 작동한다는 뜻이 아니다.

## 보안 규칙

- 실제 secret, token, `.env.local`을 commit하거나 채팅·캡처에 붙이지 않는다.
- `.vercel/`, `supabase/.temp/`, `node_modules/`, `.next/`를 commit하지 않는다.
- 각 서비스의 project와 credential은 자기 계정에서 직접 만든다.
- 실제 연결 절차는 수업 가이드를 따른다.
