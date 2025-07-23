<div align="center">

[English](README.md) | [한국어](../ko/README.md) | [日本語](../ja/README.md) | [简体中文](../zh/README.md)

### MoleQ | SaaS Boilerplate Precursors

[![GitHub stars](https://img.shields.io/github/stars/yourusername/vite-saas-boilerplate?style=social)](https://github.com/yourusername/vite-saas-boilerplate/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/vite-saas-boilerplate?style=social)](https://github.com/yourusername/vite-saas-boilerplate/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/vite-saas-boilerplate/ci.yml?branch=main)](https://github.com/yourusername/vite-saas-boilerplate/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/yourusername/vite-saas-boilerplate)](package.json)

[Documentation](https://github.com/yourusername/vite-saas-boilerplate/wiki) | [Demo](https://vite-saas-demo.vercel.app) | [Report Bug](https://github.com/yourusername/vite-saas-boilerplate/issues) | [Request Feature](https://github.com/yourusername/vite-saas-boilerplate/issues)

</div>


## Description

MoleQ is a modern, production-ready SaaS boilerplate built with Vite and React, designed for rapid development and scalability. This comprehensive starter kit includes authentication, payment processing, database integration, and deployment configurations for Cloudflare Workers.

## Motivation

This project enables AI-driven development with minimal overhead — not a boilerplate, just a few configs, instructions, prompts and ideas.

Why it be called "Precursors"? Because it does not provide any opinionated structure or components.

Designed for flexibility, it empowers users to build freely without constraints.

## Key Features

- **Modern Tech Stack** - Vite, React, TypeScript, TailwindCSS
- **Authentication** - Auth0, Passkeys, WebAuthn support
- **Payment Integration** - Stripe SDK with subscription management
- **Database** - SQLite with Drizzle ORM
- **Deployment Ready** - Cloudflare Workers, Pages, D1, KV
- **Testing Suite** - Vitest, Pactum for API testing
- **AI Integration** - OpenAI GPT-4 API, agent SDK
- **Internationalization** - i18next for multi-language support
- **Data Visualization** - Chart.js, React Table
- **UI Components** - Radix UI, Framer Motion animations


You can check full tech stack: [from here](.idea/tech_stack.yaml)

## Installation

<details><summary>Prerequisites</summary>

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Cloudflare account (for deployment)

</details>

<details><summary>Quick Start</summary>

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vite-saas-boilerplate.git
   cd vite-saas-boilerplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration

4. **Run database migrations**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

</details>


## Usage

<details><summary>Development Commands</summary>

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format

# Database operations
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

</details>

<details><summary>Frontend Development</summary>

The frontend is built with Vite and React, featuring:

```tsx
// Example component with authentication
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1>Welcome, {user?.name}!</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
```

</details>

<details><summary>API Development</summary>

The API is built with Cloudflare Workers:

```typescript
// Example API handler
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

<details><summary>Deployment</summary>

Deploy to Cloudflare:

```bash
# Deploy API
pnpm deploy:api

# Deploy Frontend
pnpm deploy:frontend

# Deploy everything
pnpm deploy
```

</details>

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

<details><summary>Development Workflow</summary>

1. Fork/Clone or fetch the repository: `git clone <repo-url>` or `git fetch --prune`
2. Create worktree (with explicit branch name): `git worktree add -b feature/123 .worktrees/feature/123 origin/main`
   - This creates a new branch `feature/123` in the worktree directory.
   - For full expression, `git worktree add -b <prefix>/<version> .worktrees/<prefix>/<user>/<name>/<date>/<version> <remote>/<remote-branch>`
   - The prefixes can be `develop`, `feature`, `fix`, `release`, etc.
3. Make your changes following our coding standards: `$editor .worktrees/feature/123`
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/123`
8. Open a Pull Request: `gh pr create`

(Optional):
9. Merge main into your branch: `git switch main`, `git merge feature/123`
10. Prune old branches: `git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. Clean up worktrees: `git worktree prune`
12. Rebase long-lived branches: `git rebase origin/main`
13. Reset workspace: undo_commit.. `git reset HEAD~1 --hard`, undo_staging.. `git reset --`
14. Clean up workspace: `git clean -fd`

Common Combinations:

* New Feature: create worktree, code, test, push
* Code Review: rebase onto main, run linters, open PR
* Major Update: branch from release, update version, merge back to main

For more details, see our [Git Flow Rules](.github/instructions/git-flow-rules.instructions.md).

</details>

<details><summary>Code Standards</summary>

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

For more details, see our [Project Rules](.idea/project_rules.yaml).

</details>

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [React](https://reactjs.org/) - UI library
- [Cloudflare](https://cloudflare.com/) - Edge computing platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com/) - Accessible component primitives
- [Stripe](https://stripe.com/) - Payment processing
- [Auth0](https://auth0.com/) - Authentication platform
- [OpenAI](https://openai.com/) - AI integration

---

<div align="center">
Made with ❤️ by the community
</div>
