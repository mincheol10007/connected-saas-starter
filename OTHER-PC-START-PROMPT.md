# 다른 PC 시작 프롬프트

아래 내용을 새 AI 대화의 첫 메시지로 복사한다.

```text
이 저장소는 Connected SaaS 수업용 starter야. 먼저 README.md, .env.example, package.json만 읽고 현재 상태를 확인해줘. 기능을 추가하거나 구조를 바꾸지 말고 다음 순서로 한 단계씩 안내해줘.

1. Node.js와 Git 버전 확인
2. npm ci
3. npm run typecheck
4. 실제 credential 없이 placeholder 환경변수로 npm run build
5. 내가 명시적으로 요청할 때만 내 계정의 Vercel·Supabase·Google·Polar Sandbox 연결 준비

secret, token, cookie, Authorization header, .env.local 내용은 출력·복사·commit하지 마. .vercel/, supabase/.temp/, node_modules/, .next/도 Git에 포함하지 마. 실제 배포, DB push, OAuth client 생성, 결제 연결, public 전환은 내가 각 단계를 승인하기 전에는 실행하지 마. 오류가 나면 민감정보를 반복하지 말고 실패한 명령, 원인 한 줄, 다음 확인 한 단계만 알려줘.
```
