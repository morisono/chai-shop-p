<div align="center">

[English](../en/README.md) | [한국어](../ko/README.md) | [日本語](../ja/README.md) | [简体中文](README.md)

### Taj Chai Web Shop | SaaS 样板项目前驱

[![GitHub stars](https://img.shields.io/github/stars/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/morisono/chai-shop-p/ci.yml?branch=main)](https://github.com/morisono/chai-shop-p/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/morisono/chai-shop-p)](package.json)

[文档](https://github.com/morisono/chai-shop-p/wiki) | [演示](https://vite-saas-demo.workers.dev) | [报告错误](https://github.com/morisono/chai-shop-p/issues) | [功能请求](https://github.com/morisono/chai-shop-p/issues)

</div>


## 描述

Taj Chai Web Shop 是一个基于 Vite 和 React 构建的现代化、生产就绪的 SaaS 样板项目，专为快速开发和可扩展性而设计。这个全面的启动器套件包括身份验证、支付处理、数据库集成和 Cloudflare Workers 的部署配置。

## 动机

该项目以最小的开销实现 AI 驱动的开发 — 不是样板代码，只需少量配置、指导、提示和想法。

为什么称为"前驱（Precursors）"？因为它不提供任何固定的结构或组件。

设计注重灵活性，使用户能够无约束地自由构建。

## 主要特性

- **现代技术栈** - Vite、React、TypeScript、TailwindCSS
- **身份验证** - Better Auth、通行密钥、WebAuthn 支持
- **支付集成** - 带订阅管理的 Stripe SDK
- **数据库** - 使用 Drizzle ORM 的 SQLite
- **部署就绪** - Cloudflare Workers、Pages、D1、KV
- **测试套件** - Vitest、用于 API 测试的 Pactum
- **AI 集成** - OpenAI GPT-4 API、智能体 SDK
- **国际化** - 多语言支持的 i18next
- **数据可视化** - Chart.js、React Table
- **UI 组件** - Radix UI、Framer Motion 动画


您可以查看完整的技术栈：[从这里](../../.github/prompts/essential/tech_stack.yaml)

## 安装

<details><summary>前提条件</summary>

- Node.js 20+ 或 Bun
- pnpm（推荐）或 npm
- PostgreSQL 数据库
- Cloudflare 账户（用于部署）

</details>

<details><summary>快速开始</summary>

1. **克隆仓库**
   ```bash
   git clone https://github.com/morisono/chai-shop-p.git
   cd chai-shop-p
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **设置环境变量**

   **前端配置:**
   ```bash
   cd apps/frontend/
   cp .env.example .env.local
   ```

   **后端配置:**
   ```bash
   cd apps/backend/
   cp .env.example .env.local
   ```

   **数据库配置:**
   ```bash
   cp db/.env.example db/.env.local
   ```

   **基础设施配置:**
   ```bash
   cp infra/.env.example infra/.env.local
   ```

   使用您的具体配置编辑每个 `.env.local` 文件。

4. **配置数据库环境**

   在 `db/.env.local` 中设置:
   ```bash
   # 数据库配置
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

   # 开发模拟认证用户
   # 用于开发测试的凭据:
   # admin@dev:temp123 (管理员角色)
   # user@dev:temp123 (用户角色)
   # manager@dev:temp123 (管理员角色)

   # 审计配置
   AUDIT_BATCH_SIZE=100
   AUDIT_FLUSH_INTERVAL=5000
   AUDIT_RETENTION_DAYS=2555
   ```

   **可选: 配置 Cloudflare Hyperdrive（生产环境推荐）**

   1. 创建 Hyperdrive 连接:
      ```bash
      DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
      npx wrangler hyperdrive create my-first-hyperdrive --connection-string=$DATABASE_URL
      ```

   2. 使用上述命令返回的 Hyperdrive ID 更新您的 `wrangler.toml`。

   更多信息请参见 [Hyperdrive 文档](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)。

5. **配置基础设施环境**

   在 `infra/.env.local` 中设置:
   ```bash
   # 环境配置
   ENVIRONMENT=development

   # Cloudflare 配置
   CF_ACCOUNT_ID=your-cloudflare-account-id
   CF_KV_NAMESPACE=your-kv-namespace-id
   CF_API_TOKEN=your-cloudflare-api-token
   CF_R2_ACCESS_KEY_ID=your-r2-access-key
   CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
   CF_R2_BUCKET=auth-storage
   CF_WORKERS_API_TOKEN=cf-workers-api-token

   # 外部日志记录（用于生产）
   CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
   CF_LOGPUSH_TOKEN=your-logpush-token
   SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
   SPLUNK_TOKEN=your-splunk-token

   # 监控和警报
   ALERT_WEBHOOK=https://alerts.example.com/webhook

   # Supabase 配置
   SUPABASE_URL=supabase-url
   SUPABASE_ANON_KEY=supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
   SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
   ```

6. **配置前端环境**

   在 `apps/frontend/.env.local` 中设置:
   ```bash
   # Better Auth 配置
   VITE_BETTER_AUTH_URL=http://localhost:3001

   # 应用程序配置
   VITE_APP_NAME=Your App Name
   VITE_NODE_ENV=development

   # 后端 API URL
   VITE_API_URL=http://localhost:3001

   # 前端配置
   VITE_FRONTEND_URL=http://localhost:5173

   # OAuth 重定向 URL（用于客户端参考）
   VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
   VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
   VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
   VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

   # 开发配置
   VITE_DEV_MODE=true
   ```

7. **配置后端环境**

   在 `apps/backend/.env.local` 中设置:
   ```bash
   # 应用程序配置
   APP_NAME=Your Saas Name
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # 服务器配置
   PORT=3001
   HOST=0.0.0.0
   LOG_LEVEL=info
   APP_VERSION=1.0.0
   COOKIE_DOMAIN=localhost

   # 数据库配置
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Better Auth 配置
   BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
   BETTER_AUTH_BASE_URL=http://localhost:3001
   BETTER_AUTH_DOMAIN=better-auth-domain

   # OAuth 提供商
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   X_TWITTER_CLIENT_ID=your-x-twitter-client-id
   X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

   # Stripe 配置（开发 - 测试模式）
   STRIPE_SECRET_KEY=sk_***
   STRIPE_PUBLISHABLE_KEY=pk_***
   STRIPE_WEBHOOK_SECRET=whsec_***

   # 安全配置
   SESSION_TIMEOUT=900
   REFRESH_TOKEN_LIFETIME=86400
   SECURITY_LEVEL=low
   DEBUG_AUTH=true
   MFA_REQUIRED=false

   # AI 配置
   OPENAI_API_KEY=openai-api-key
   ANTHROPIC_API_KEY=anthropic-api-key
   GEMINI_API_KEY=gemini-api-key
   DEEPSEEK_API_KEY=deepseek-api-key

   # 速率限制配置
   RATE_LIMIT_GLOBAL_MAX=100
   RATE_LIMIT_GLOBAL_WINDOW=60
   RATE_LIMIT_SIGNIN_MAX=5
   RATE_LIMIT_SIGNUP_MAX=3
   ```

8. **运行数据库迁移**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # 推送数据库架构
   pnpm db:seed # 用初始数据填充数据库
   ```

9. **启动开发服务器**
   ```bash
   pnpm dev
   ```

应用程序将在 `http://localhost:5173` 上可用

### 替代方案: 本地 PostgreSQL 数据库

1. **安装 PostgreSQL**: 按照适用于您操作系统的[官方安装指南](https://www.postgresql.org/download/)进行操作。

2. **启动 PostgreSQL**: 确保 PostgreSQL 服务正在运行。

3. **创建数据库**: 使用以下命令创建新数据库:
   ```bash
   createdb auth_db
   ```

4. **配置环境变量**: 使用本地数据库连接详细信息更新您的 `db/.env.local` 文件:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
   ```

5. **运行数据库迁移**: 执行以下命令设置数据库架构:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # 推送数据库架构
   pnpm db:seed # 用初始数据填充数据库
   ```

6. **启动开发服务器**: 使用以下命令启动开发服务器:
   ```bash
   pnpm dev
   ```

应用程序将在 `http://localhost:5173` 上可用

</details>

## 环境变量迁移指南

### 最新更改 (v0.2.0)

**⚠️ 重大更改**: 环境变量已重新构建，以实现更好的组件分离和安全性。

<details><summary>从以前版本的迁移</summary>

**旧结构（已弃用 - v0.1.x）:**
```bash
# 单个 .env 文件中的所有变量
DATABASE_URL=...
CF_ACCOUNT_ID=...
GOOGLE_CLIENT_ID=...
BETTER_AUTH_SECRET=...
# ... 所有其他变量混合在一起
```

**新结构（当前 - v0.2.0+）:**

**前端环境 (`apps/frontend/.env.local`):**
```bash
# Better Auth 配置
VITE_BETTER_AUTH_URL=http://localhost:3001

# 应用程序配置
VITE_APP_NAME=Your App Name
VITE_NODE_ENV=development

# 后端 API URL
VITE_API_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173

# OAuth 重定向 URL（用于客户端参考）
VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

# 开发配置
VITE_DEV_MODE=true
```

**后端环境 (`apps/backend/.env.local`):**
```bash
# 应用程序配置
APP_NAME=Your Saas Name
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# 服务器配置
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0
COOKIE_DOMAIN=localhost

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Better Auth 配置
BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
BETTER_AUTH_BASE_URL=http://localhost:3001
BETTER_AUTH_DOMAIN=better-auth-domain

# OAuth 提供商
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_TWITTER_CLIENT_ID=your-x-twitter-client-id
X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

# Stripe 配置（开发 - 测试模式）
STRIPE_SECRET_KEY=sk_***
STRIPE_PUBLISHABLE_KEY=pk_***
STRIPE_WEBHOOK_SECRET=whsec_***

# 安全配置
SESSION_TIMEOUT=900
REFRESH_TOKEN_LIFETIME=86400
SECURITY_LEVEL=low
DEBUG_AUTH=true
MFA_REQUIRED=false

# AI 配置
OPENAI_API_KEY=openai-api-key
ANTHROPIC_API_KEY=anthropic-api-key
GEMINI_API_KEY=gemini-api-key
DEEPSEEK_API_KEY=deepseek-api-key

# 速率限制配置
RATE_LIMIT_GLOBAL_MAX=100
RATE_LIMIT_GLOBAL_WINDOW=60
RATE_LIMIT_SIGNIN_MAX=5
RATE_LIMIT_SIGNUP_MAX=3
```

**数据库环境 (`db/.env.local`):**
```bash
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# 开发模拟认证用户
# 用于开发测试的凭据:
# admin@dev:temp123 (管理员角色)
# user@dev:temp123 (用户角色)
# manager@dev:temp123 (管理员角色)

# 审计配置
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555
```

**基础设施环境 (`infra/.env.local`):**
```bash
# 环境配置
ENVIRONMENT=development

# Cloudflare 配置
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_KV_NAMESPACE=your-kv-namespace-id
CF_API_TOKEN=your-cloudflare-api-token
CF_R2_ACCESS_KEY_ID=your-r2-access-key
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CF_R2_BUCKET=auth-storage
CF_WORKERS_API_TOKEN=cf-workers-api-token

# 外部日志记录（用于生产）
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# 监控和警报
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase 配置
SUPABASE_URL=supabase-url
SUPABASE_ANON_KEY=supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
```

**迁移步骤:**

1. **备份现有配置:**
   ```bash
   # 备份旧配置
   cp .env .env.backup.v0.1.x
   cp .env.local .env.local.backup.v0.1.x
   ```

2. **创建新的目录特定结构:**
   ```bash
   # 前端配置
   cd apps/frontend/
   cp .env.example .env.local

   # 后端配置
   cd ../backend/
   cp .env.example .env.local

   # 数据库配置
   cd ../../db/
   cp .env.example .env.local

   # 基础设施配置
   cd ../infra/
   cp .env.example .env.local
   cd ..
   ```

3. **将变量迁移到适当的文件:**
   - **前端变量**: 将 `VITE_*` 变量移动到 `apps/frontend/.env.local`
   - **后端变量**: 将认证、服务器和 API 变量移动到 `apps/backend/.env.local`
   - **数据库变量**: 将 `DATABASE_URL` 和审计配置移动到 `db/.env.local`
   - **基础设施变量**: 将 Cloudflare 和 Supabase 变量移动到 `infra/.env.local`

4. **更新脚本和配置引用:**
   - 数据库脚本现在从 `db/.env.local` 读取
   - 基础设施脚本从 `infra/.env.local` 读取
   - 前端构建进程从 `apps/frontend/.env.local` 读取
   - 后端应用程序从 `apps/backend/.env.local` 读取

5. **验证配置加载:**
   ```bash
   # 测试前端配置
   cd apps/frontend && pnpm dev:client

   # 测试后端配置
   cd apps/backend && pnpm dev:server

   # 测试数据库连接
   pnpm db:studio
   ```

**⚠️ 已弃用的变量（从 v0.1.x 配置中删除）:**

v0.1.x 中的以下变量现已弃用，应删除:
- `BETTER_AUTH_AUDIENCE`（替换为 `BETTER_AUTH_DOMAIN`）
- `SESSION_SECRET`（重命名为 `BETTER_AUTH_SESSION_SECRET`）
- `PUBLIC_STRIPE_*`（重命名以删除 `PUBLIC_` 前缀）
- 根级别 `DATABASE_URL`（移动到 `db/.env.local`）

**向后兼容性:**

如果您需要在迁移期间保持与 v0.1.x 部署的兼容性:

1. 在部署配置中临时保留旧变量
2. 在 CI/CD 管道中使用环境特定覆盖
3. 在删除已弃用变量之前在暂存环境中彻底测试
4. 更新部署脚本以引用新的文件位置

</details>

<details><summary>前置要求</summary>

- Node.js 18+ 或 Bun
- pnpm（推荐）或 npm
- Cloudflare 账户（用于部署）

</details>

<details><summary>快速开始</summary>

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/vite-saas-boilerplate.git
   cd vite-saas-boilerplate
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **设置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   根据您的配置编辑 `.env.local`

4. **运行数据库迁移**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

应用程序将在 `http://localhost:5173` 可用

</details>


## 使用方法

<details><summary>开发命令</summary>

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 运行代码检查
pnpm lint

# 格式化代码
pnpm format

# 数据库操作
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

</details>

<details><summary>前端开发</summary>

前端使用 Vite 和 React 构建，具有以下特性：

```tsx
// 带身份验证的组件示例
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1>欢迎，{user?.name}！</h1>
      <Button onClick={logout}>退出登录</Button>
    </div>
  )
}
```

</details>

<details><summary>API 开发</summary>

API 使用 Cloudflare Workers 构建：

```typescript
// API 处理器示例
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

<details><summary>部署</summary>

部署到 Cloudflare：

```bash
# 部署 API
pnpm deploy:api

# 部署前端
pnpm deploy:frontend

# 部署所有内容
pnpm deploy
```

</details>

## 贡献

我们欢迎贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

<details><summary>开发工作流程</summary>

1. Fork/克隆或获取仓库：`git clone <repo-url>` 或 `git fetch --prune`
2. 创建工作树（使用明确的分支名）：`git worktree add -b feature/123 .worktrees/feature/123 origin/main`
   - 这会在工作树目录中创建新分支 `feature/123`。
   - 完整表达式为 `git worktree add -b <prefix>/<version> .worktrees/<prefix>/<user>/<name>/<date>/<version> <remote>/<remote-branch>`
   - 前缀可以是 `develop`、`feature`、`fix`、`release` 等。
3. 按照我们的编码标准进行更改：`$editor .worktrees/feature/123`
4. 运行测试：`pnpm test`
5. 运行代码检查：`pnpm lint`
6. 提交更改：`git commit -m 'Add amazing feature'`
7. 推送到分支：`git push origin feature/123`
8. 打开 Pull Request：`gh pr create`

（可选）：
9. 将 main 合并到您的分支：`git switch main`，`git merge feature/123`
10. 清理旧分支：`git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. 清理工作树：`git worktree prune`
12. 变基长期分支：`git rebase origin/main`
13. 重置工作空间：撤销提交.. `git reset HEAD~1 --hard`，撤销暂存.. `git reset --`
14. 清理工作空间：`git clean -fd`

常见组合：

* 新功能：创建工作树，编码，测试，推送
* 代码审查：变基到 main，运行检查器，打开 PR
* 主要更新：从发布分支，更新版本，合并回 main

更多详情，请参阅我们的 [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)。

</details>
10. 清理旧分支：`git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. 清理工作树：`git worktree prune`
12. 变基长期分支：`git rebase origin/main`
13. 重置工作空间：撤销提交.. `git reset HEAD~1 --hard`，撤销暂存.. `git reset --`
14. 清理工作空间：`git clean -fd`

常见组合：

* 新功能：创建工作树，编码，测试，推送
* 代码审查：变基到 main，运行检查器，打开 PR
* 主要更新：从发布分支，更新版本，合并回 main

更多详情，请参阅我们的 [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)。

</details>

<details><summary>代码标准</summary>

- 使用 TypeScript 确保类型安全
- 遵循 ESLint 和 Prettier 配置
- 为新功能编写测试
- 根据需要更新文档
- 遵循约定式提交消息

更多详情，请参阅我们的 [Project Rules](.github/prompts/essential/project_rules.yaml)。

</details>

## 许可证

本项目在 Apache-2.0 许可证下授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 致谢

- [Vite](https://vitejs.dev/) - 闪电般快速的构建工具
- [React](https://reactjs.org/) - UI 库
- [Cloudflare](https://cloudflare.com/) - 边缘计算平台
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Radix UI](https://radix-ui.com/) - 可访问的组件原语
- [Stripe](https://stripe.com/) - 支付处理
- [Better Auth](https://better-auth.com/) - 身份验证平台
- [OpenAI](https://openai.com/) - AI 集成

---

<div align="center">
由社区用 ❤️ 制作
</div>
