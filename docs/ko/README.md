<d[English](../en/README.md) | [한국어](README.md) | [日本語](../ja/README.md) | [简体中文](../zh/README.md)v align="center">

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
   ```bash
   cp .env.example .env.local
   ```
   설정에 맞게 `.env.local`을 편집하세요

4. **데이터베이스 마이그레이션 실행**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **개발 서버 시작**
   ```bash
   pnpm dev
   ```

애플리케이션은 `http://localhost:5173`에서 사용할 수 있습니다

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
