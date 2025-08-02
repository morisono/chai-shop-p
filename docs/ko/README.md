<div align="center">

[English](../README.md) | [한국어](README.md) | [日본語](../ja/README.md) | [简体中文](../zh/README.md)

### Taj Chai Web Shop | SaaS 보일러플레이트 전구체

[![GitHub stars](https://img.shields.io/github/stars/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/morisono/chai-shop-p/ci.yml?branch=main)](https://github.com/morisono/chai-shop-p/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/morisono/chai-shop-p)](package.json)

[문서](https://github.com/morisono/chai-shop-p/wiki) | [데모](https://vite-saas-demo.workers.dev) | [버그 신고](https://github.com/morisono/chai-shop-p/issues) | [기능 요청](https://github.com/morisono/chai-shop-p/issues)

</div>


## 설명

Taj Chai Web Shop은 Vite와 React로 구축된 현대적이고 프로덕션 준비가 완료된 SaaS 보일러플레이트로, 빠른 개발과 확장성을 위해 설계되었습니다. 이 포괄적인 스타터 키트에는 인증, 결제 처리, 데이터베이스 통합, Cloudflare Workers를 위한 배포 구성이 포함되어 있습니다.

## 동기

이 프로젝트는 최소한의 오버헤드로 AI 기반 개발을 가능하게 합니다 — 보일러플레이트가 아니라, 단지 몇 가지 설정, 지침, 프롬프트, 아이디어만으로.

왜 "전구체(Precursors)"라고 불리는가? 독단적인 구조나 컴포넌트를 제공하지 않기 때문입니다.

유연성을 위해 설계되어 사용자가 제약 없이 자유롭게 구축할 수 있도록 지원합니다.

## 주요 기능

- **현대적인 기술 스택** - Vite, React, TypeScript, TailwindCSS
- **인증** - Better Auth, 패스키, WebAuthn 지원
- **결제 통합** - 구독 관리가 포함된 Stripe SDK
- **데이터베이스** - Drizzle ORM을 사용한 SQLite
- **배포 준비 완료** - Cloudflare Workers, Pages, D1, KV
- **테스트 도구** - API 테스트를 위한 Vitest, Pactum
- **AI 통합** - OpenAI GPT-4 API, 에이전트 SDK
- **국제화** - 다국어 지원을 위한 i18next
- **데이터 시각화** - Chart.js, React Table
- **UI 컴포넌트** - Radix UI, Framer Motion 애니메이션


전체 기술 스택을 확인할 수 있습니다: [여기에서](.github/prompts/essential/tech_stack.yaml)

## 설치

<details><summary>사전 요구사항</summary>

- Node.js 18+ 또는 Bun
- pnpm (권장) 또는 npm
- Cloudflare 계정 (배포용)

</details>

<details><summary>빠른 시작</summary>

1. **저장소 복제**
   ```bash
   git clone https://github.com/yourusername/vite-saas-boilerplate.git
   cd vite-saas-boilerplate
   ```

2. **의존성 설치**
   ```bash
   pnpm install
   ```

3. **환경 변수 설정**

   **프론트엔드 설정:**
   ```bash
   cd apps/frontend/
   cp .env.example .env.local
   ```

   **백엔드 설정:**
   ```bash
   cd apps/backend/
   cp .env.example .env.local
   ```

   **데이터베이스 설정:**
   ```bash
   cp db/.env.example db/.env.local
   ```

   **인프라스트럭처 설정:**
   ```bash
   cp infra/.env.example infra/.env.local
   ```

   각 `.env.local` 파일을 특정 설정으로 편집하세요.

4. **데이터베이스 환경 설정**

   `db/.env.local`에서 다음을 설정:
   ```bash
   # 데이터베이스 설정
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

   # 개발용 모의 인증 사용자
   # 개발 테스트용 인증 정보:
   # admin@dev:temp123 (관리자 역할)
   # user@dev:temp123 (사용자 역할)
   # manager@dev:temp123 (매니저 역할)

   # 감사 설정
   AUDIT_BATCH_SIZE=100
   AUDIT_FLUSH_INTERVAL=5000
   AUDIT_RETENTION_DAYS=2555
   ```

   **선택사항: Cloudflare Hyperdrive 설정 (프로덕션 권장)**

   1. Hyperdrive 연결 생성:
      ```bash
      DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
      npx wrangler hyperdrive create my-first-hyperdrive --connection-string=$DATABASE_URL
      ```

   2. 위 명령에서 반환된 Hyperdrive ID로 `wrangler.toml`을 업데이트하세요.

   자세한 내용은 [Hyperdrive 문서](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)를 참조하세요.

5. **인프라스트럭처 환경 설정**

   `infra/.env.local`에서 다음을 설정:
   ```bash
   # 환경 설정
   ENVIRONMENT=development

   # Cloudflare 설정
   CF_ACCOUNT_ID=your-cloudflare-account-id
   CF_KV_NAMESPACE=your-kv-namespace-id
   CF_API_TOKEN=your-cloudflare-api-token
   CF_R2_ACCESS_KEY_ID=your-r2-access-key
   CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
   CF_R2_BUCKET=auth-storage
   CF_WORKERS_API_TOKEN=cf-workers-api-token

   # 외부 로깅 (프로덕션용)
   CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
   CF_LOGPUSH_TOKEN=your-logpush-token
   SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
   SPLUNK_TOKEN=your-splunk-token

   # 모니터링 및 알림
   ALERT_WEBHOOK=https://alerts.example.com/webhook

   # Supabase 설정
   SUPABASE_URL=supabase-url
   SUPABASE_ANON_KEY=supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
   SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
   ```

6. **프론트엔드 환경 설정**

   `apps/frontend/.env.local`에서 다음을 설정:
   ```bash
   # Better Auth 설정
   VITE_BETTER_AUTH_URL=http://localhost:3001

   # 애플리케이션 설정
   VITE_APP_NAME=Your App Name
   VITE_NODE_ENV=development

   # 백엔드 API URL
   VITE_API_URL=http://localhost:3001

   # 프론트엔드 설정
   VITE_FRONTEND_URL=http://localhost:5173

   # OAuth 리다이렉트 URL (클라이언트 측 참조용)
   VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
   VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
   VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
   VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

   # 개발 설정
   VITE_DEV_MODE=true
   ```

7. **백엔드 환경 설정**

   `apps/backend/.env.local`에서 다음을 설정:
   ```bash
   # 애플리케이션 설정
   APP_NAME=Your Saas Name
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # 서버 설정
   PORT=3001
   HOST=0.0.0.0
   LOG_LEVEL=info
   APP_VERSION=1.0.0
   COOKIE_DOMAIN=localhost

   # 데이터베이스 설정
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Better Auth 설정
   BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
   BETTER_AUTH_BASE_URL=http://localhost:3001
   BETTER_AUTH_DOMAIN=better-auth-domain

   # OAuth 제공업체
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   X_TWITTER_CLIENT_ID=your-x-twitter-client-id
   X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

   # Stripe 설정 (개발 - 테스트 모드)
   STRIPE_SECRET_KEY=sk_***
   STRIPE_PUBLISHABLE_KEY=pk_***
   STRIPE_WEBHOOK_SECRET=whsec_***

   # 보안 설정
   SESSION_TIMEOUT=900
   REFRESH_TOKEN_LIFETIME=86400
   SECURITY_LEVEL=low
   DEBUG_AUTH=true
   MFA_REQUIRED=false

   # AI 설정
   OPENAI_API_KEY=openai-api-key
   ANTHROPIC_API_KEY=anthropic-api-key
   GEMINI_API_KEY=gemini-api-key
   DEEPSEEK_API_KEY=deepseek-api-key

   # 속도 제한 설정
   RATE_LIMIT_GLOBAL_MAX=100
   RATE_LIMIT_GLOBAL_WINDOW=60
   RATE_LIMIT_SIGNIN_MAX=5
   RATE_LIMIT_SIGNUP_MAX=3
   ```

8. **데이터베이스 마이그레이션 실행**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # 데이터베이스 스키마 푸시
   pnpm db:seed # 초기 데이터로 데이터베이스 시드
   ```

9. **개발 서버 시작**
   ```bash
   pnpm dev
   ```

애플리케이션은 `http://localhost:5173`에서 사용할 수 있습니다

### 대안: 로컬 PostgreSQL 데이터베이스

1. **PostgreSQL 설치**: 운영 체제에 맞는 [공식 설치 가이드](https://www.postgresql.org/download/)를 따르세요.

2. **PostgreSQL 시작**: PostgreSQL 서비스가 실행 중인지 확인하세요.

3. **데이터베이스 생성**: 다음 명령을 사용하여 새 데이터베이스를 생성하세요:
   ```bash
   createdb auth_db
   ```

4. **환경 변수 설정**: 로컬 데이터베이스 연결 세부 정보로 `db/.env.local` 파일을 업데이트하세요:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
   ```

5. **데이터베이스 마이그레이션 실행**: 다음 명령을 실행하여 데이터베이스 스키마를 설정하세요:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # 데이터베이스 스키마 푸시
   pnpm db:seed # 초기 데이터로 데이터베이스 시드
   ```

6. **개발 서버 시작**: 다음 명령으로 개발 서버를 시작하세요:
   ```bash
   pnpm dev
   ```

애플리케이션은 `http://localhost:5173`에서 사용할 수 있습니다

</details>

## 환경 변수 마이그레이션 가이드

### 최신 변경사항 (v0.2.0)

**⚠️ 주요 변경사항**: 환경 변수가 더 나은 컴포넌트 분리와 보안을 위해 재구성되었습니다.

<details><summary>이전 버전에서의 마이그레이션</summary>

**이전 구조 (deprecated - v0.1.x):**
```bash
# 단일 .env 파일의 모든 변수
DATABASE_URL=...
CF_ACCOUNT_ID=...
GOOGLE_CLIENT_ID=...
BETTER_AUTH_SECRET=...
# ... 모든 다른 변수가 혼재
```

**새로운 구조 (현재 - v0.2.0+):**

**프론트엔드 환경 (`apps/frontend/.env.local`):**
```bash
# Better Auth 설정
VITE_BETTER_AUTH_URL=http://localhost:3001

# 애플리케이션 설정
VITE_APP_NAME=Your App Name
VITE_NODE_ENV=development

# 백엔드 API URL
VITE_API_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173

# OAuth 리다이렉트 URL (클라이언트 측 참조용)
VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

# 개발 설정
VITE_DEV_MODE=true
```

**백엔드 환경 (`apps/backend/.env.local`):**
```bash
# 애플리케이션 설정
APP_NAME=Your Saas Name
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# 서버 설정
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0
COOKIE_DOMAIN=localhost

# 데이터베이스 설정
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Better Auth 설정
BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
BETTER_AUTH_BASE_URL=http://localhost:3001
BETTER_AUTH_DOMAIN=better-auth-domain

# OAuth 제공업체
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_TWITTER_CLIENT_ID=your-x-twitter-client-id
X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

# Stripe 설정 (개발 - 테스트 모드)
STRIPE_SECRET_KEY=sk_***
STRIPE_PUBLISHABLE_KEY=pk_***
STRIPE_WEBHOOK_SECRET=whsec_***

# 보안 설정
SESSION_TIMEOUT=900
REFRESH_TOKEN_LIFETIME=86400
SECURITY_LEVEL=low
DEBUG_AUTH=true
MFA_REQUIRED=false

# AI 설정
OPENAI_API_KEY=openai-api-key
ANTHROPIC_API_KEY=anthropic-api-key
GEMINI_API_KEY=gemini-api-key
DEEPSEEK_API_KEY=deepseek-api-key

# 속도 제한 설정
RATE_LIMIT_GLOBAL_MAX=100
RATE_LIMIT_GLOBAL_WINDOW=60
RATE_LIMIT_SIGNIN_MAX=5
RATE_LIMIT_SIGNUP_MAX=3
```

**데이터베이스 환경 (`db/.env.local`):**
```bash
# 데이터베이스 설정
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# 개발용 모의 인증 사용자
# 개발 테스트용 인증 정보:
# admin@dev:temp123 (관리자 역할)
# user@dev:temp123 (사용자 역할)
# manager@dev:temp123 (매니저 역할)

# 감사 설정
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555
```

**인프라스트럭처 환경 (`infra/.env.local`):**
```bash
# 환경 설정
ENVIRONMENT=development

# Cloudflare 설정
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_KV_NAMESPACE=your-kv-namespace-id
CF_API_TOKEN=your-cloudflare-api-token
CF_R2_ACCESS_KEY_ID=your-r2-access-key
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CF_R2_BUCKET=auth-storage
CF_WORKERS_API_TOKEN=cf-workers-api-token

# 외부 로깅 (프로덕션용)
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# 모니터링 및 알림
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase 설정
SUPABASE_URL=supabase-url
SUPABASE_ANON_KEY=supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
```

**마이그레이션 단계:**

1. **기존 설정 백업:**
   ```bash
   # 이전 설정 백업
   cp .env .env.backup.v0.1.x
   cp .env.local .env.local.backup.v0.1.x
   ```

2. **새로운 디렉터리별 구조 생성:**
   ```bash
   # 프론트엔드 설정
   cd apps/frontend/
   cp .env.example .env.local

   # 백엔드 설정
   cd ../backend/
   cp .env.example .env.local

   # 데이터베이스 설정
   cd ../../db/
   cp .env.example .env.local

   # 인프라스트럭처 설정
   cd ../infra/
   cp .env.example .env.local
   cd ..
   ```

3. **변수를 적절한 파일로 마이그레이션:**
   - **프론트엔드 변수**: `VITE_*` 변수를 `apps/frontend/.env.local`로 이동
   - **백엔드 변수**: 인증, 서버, API 변수를 `apps/backend/.env.local`로 이동
   - **데이터베이스 변수**: `DATABASE_URL`과 감사 설정을 `db/.env.local`로 이동
   - **인프라스트럭처 변수**: Cloudflare와 Supabase 변수를 `infra/.env.local`로 이동

4. **스크립트와 설정 참조 업데이트:**
   - 데이터베이스 스크립트는 `db/.env.local`에서 읽기
   - 인프라스트럭처 스크립트는 `infra/.env.local`에서 읽기
   - 프론트엔드 빌드 프로세스는 `apps/frontend/.env.local`에서 읽기
   - 백엔드 애플리케이션은 `apps/backend/.env.local`에서 읽기

5. **설정 로딩 확인:**
   ```bash
   # 프론트엔드 설정 테스트
   cd apps/frontend && pnpm dev:client

   # 백엔드 설정 테스트
   cd apps/backend && pnpm dev:server

   # 데이터베이스 연결 테스트
   pnpm db:studio
   ```

**⚠️ 사용 중단된 변수 (v0.1.x 설정에서 제거):**

v0.1.x의 다음 변수들은 현재 사용 중단되었으며 제거해야 합니다:
- `BETTER_AUTH_AUDIENCE` (`BETTER_AUTH_DOMAIN`으로 대체)
- `SESSION_SECRET` (`BETTER_AUTH_SESSION_SECRET`으로 이름 변경)
- `PUBLIC_STRIPE_*` (`PUBLIC_` 접두사를 제거하도록 이름 변경)
- 루트 레벨 `DATABASE_URL` (`db/.env.local`로 이동)

**하위 호환성:**

마이그레이션 중에 v0.1.x 배포와의 호환성을 유지해야 하는 경우:

1. 배포 설정에서 이전 변수를 임시로 유지
2. CI/CD 파이프라인에서 환경별 오버라이드 사용
3. 사용 중단된 변수를 제거하기 전에 스테이징 환경에서 철저히 테스트
4. 새로운 파일 위치를 참조하도록 배포 스크립트 업데이트

</details>

## 사용법

<details><summary>개발 명령어</summary>

```bash
# 개발 서버 시작
pnpm dev

# 프로덕션용 빌드
pnpm build

# 테스트 실행
pnpm test

# 린팅 실행
pnpm lint

# 코드 포맷팅
pnpm format

# 데이터베이스 작업
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

</details>

<details><summary>프론트엔드 개발</summary>

프론트엔드는 Vite와 React로 구축되었으며, 다음 기능을 제공합니다:

```tsx
// 인증이 포함된 컴포넌트 예제
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1>환영합니다, {user?.name}님!</h1>
      <Button onClick={logout}>로그아웃</Button>
    </div>
  )
}
```

</details>

<details><summary>API 개발</summary>

API는 Cloudflare Workers로 구축되었습니다:

```typescript
// API 핸들러 예제
import { createHandler } from '@/utils/handler'

export const getUserProfile = createHandler(async (request, env) => {
  const userId = await validateAuth(request)
  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first()

  return Response.json(user)
})
```

</details>

<details><summary>배포</summary>

Cloudflare로 배포:

```bash
# API 배포
pnpm deploy:api

# 프론트엔드 배포
pnpm deploy:frontend

# 전체 배포
pnpm deploy
```

</details>

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](CONTRIBUTING.md)을 참조하세요.

<details><summary>개발 워크플로우</summary>

1. 저장소를 포크/클론하거나 가져오세요: `git clone <repo-url>` 또는 `git fetch --prune`
2. 워크트리를 생성하세요 (명시적 브랜치 이름으로): `git worktree add -b feature/123 .worktrees/feature/123 origin/main`
   - 워크트리 디렉토리에 새 브랜치 `feature/123`을 생성합니다.
   - 완전한 표현으로는 `git worktree add -b <prefix>/<version> .worktrees/<prefix>/<user>/<name>/<date>/<version> <remote>/<remote-branch>`
   - 접두사는 `develop`, `feature`, `fix`, `release` 등이 가능합니다.
3. 코딩 표준을 따라 변경사항을 만드세요: `$editor .worktrees/feature/123`
4. 테스트를 실행하세요: `pnpm test`
5. 린팅을 실행하세요: `pnpm lint`
6. 변경사항을 커밋하세요: `git commit -m 'Add amazing feature'`
7. 브랜치에 푸시하세요: `git push origin feature/123`
8. 풀 리퀘스트를 열어주세요: `gh pr create`

(선택사항):
9. main을 브랜치로 병합하세요: `git switch main`, `git merge feature/123`
10. 이전 브랜치를 정리하세요: `git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. 워크트리를 정리하세요: `git worktree prune`
12. 장기 브랜치를 리베이스하세요: `git rebase origin/main`
13. 워크스페이스를 리셋하세요: 커밋 취소.. `git reset HEAD~1 --hard`, 스테이징 취소.. `git reset --`
14. 워크스페이스를 정리하세요: `git clean -fd`

일반적인 조합:

* 새 기능: 워크트리 생성, 코딩, 테스트, 푸시
* 코드 리뷰: main으로 리베이스, 린터 실행, PR 열기
* 주요 업데이트: 릴리스에서 브랜치, 버전 업데이트, main으로 병합

자세한 내용은 [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)를 참조하세요.

</details>
10. 이전 브랜치를 정리하세요: `git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. 워크트리를 정리하세요: `git worktree prune`
12. 장기 브랜치를 리베이스하세요: `git rebase origin/main`
13. 워크스페이스를 리셋하세요: 커밋 취소.. `git reset HEAD~1 --hard`, 스테이징 취소.. `git reset --`
14. 워크스페이스를 정리하세요: `git clean -fd`

일반적인 조합:

* 새 기능: 워크트리 생성, 코딩, 테스트, 푸시
* 코드 리뷰: main으로 리베이스, 린터 실행, PR 열기
* 주요 업데이트: 릴리스에서 브랜치, 버전 업데이트, main으로 병합

자세한 내용은 [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)를 참조하세요.

</details>

<details><summary>코드 표준</summary>

- 타입 안전성을 위해 TypeScript 사용
- ESLint 및 Prettier 구성 준수
- 새로운 기능에 대한 테스트 작성
- 필요에 따라 문서 업데이트
- 관례적인 커밋 메시지 준수

자세한 내용은 [Project Rules](.github/prompts/essential/project_rules.yaml)를 참조하세요.

</details>

## 라이선스

이 프로젝트는 Apache-2.0 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 감사의 말

- [Vite](https://vitejs.dev/) - 빠른 빌드 도구
- [React](https://reactjs.org/) - UI 라이브러리
- [Cloudflare](https://cloudflare.com/) - 엣지 컴퓨팅 플랫폼
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Radix UI](https://radix-ui.com/) - 접근 가능한 컴포넌트 프리미티브
- [Stripe](https://stripe.com/) - 결제 처리
- [Better Auth](https://better-auth.com/) - 인증 플랫폼
- [OpenAI](https://openai.com/) - AI 통합

---

<div align="center">
커뮤니티가 ❤️로 만들었습니다
</div>
