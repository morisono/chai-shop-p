<div align="center">

[English](../README.md) | [한국어](../ko/README.md) | [日本語](../ja/README.md) | [简体中文](README.md)

### MoleQ | SaaS 样板项目前驱

[![GitHub stars](https://img.shields.io/github/stars/yourusername/vite-saas-boilerplate?style=social)](https://github.com/yourusername/vite-saas-boilerplate/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/vite-saas-boilerplate?style=social)](https://github.com/yourusername/vite-saas-boilerplate/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/vite-saas-boilerplate/ci.yml?branch=main)](https://github.com/yourusername/vite-saas-boilerplate/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/yourusername/vite-saas-boilerplate)](package.json)

[文档](https://github.com/yourusername/vite-saas-boilerplate/wiki) | [演示](https://vite-saas-demo.vercel.app) | [报告错误](https://github.com/yourusername/vite-saas-boilerplate/issues) | [功能请求](https://github.com/yourusername/vite-saas-boilerplate/issues)

</div>


## 描述

MoleQ 是一个基于 Vite 和 React 构建的现代化、生产就绪的 SaaS 样板项目，专为快速开发和可扩展性而设计。这个全面的启动器套件包括身份验证、支付处理、数据库集成和 Cloudflare Workers 的部署配置。

## 动机

该项目以最小的开销实现 AI 驱动的开发 — 不是样板代码，只需少量配置、指导、提示和想法。

为什么称为"前驱（Precursors）"？因为它不提供任何固定的结构或组件。

设计注重灵活性，使用户能够无约束地自由构建。

## 主要特性

- **现代技术栈** - Vite、React、TypeScript、TailwindCSS
- **身份验证** - Auth0、通行密钥、WebAuthn 支持
- **支付集成** - 带订阅管理的 Stripe SDK
- **数据库** - 使用 Drizzle ORM 的 SQLite
- **部署就绪** - Cloudflare Workers、Pages、D1、KV
- **测试套件** - Vitest、用于 API 测试的 Pactum
- **AI 集成** - OpenAI GPT-4 API、智能体 SDK
- **国际化** - 多语言支持的 i18next
- **数据可视化** - Chart.js、React Table
- **UI 组件** - Radix UI、Framer Motion 动画


您可以查看完整的技术栈：[从这里](.idea/tech_stack.yaml)

## 安装

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

更多详情，请参阅我们的 [Project Rules](.idea/project_rules.yaml)。

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
- [Auth0](https://auth0.com/) - 身份验证平台
- [OpenAI](https://openai.com/) - AI 集成

---

<div align="center">
由社区用 ❤️ 制作
</div>
