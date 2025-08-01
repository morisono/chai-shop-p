<d[English](../en/README.md) | [한국어](../ko/README.md) | [日本語](README.md) | [简体中文](../zh/README.md)v align="center">

[English](../README.md) | [한국어](../ko/README.md) | [日본語](README.md) | [简体中文](../zh/README.md)

### Taj Chai Web Shop | SaaS ボイラープレート前駆体

[![GitHub stars](https://img.shields.io/github/stars/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/morisono/chai-shop-p?style=social)](https://github.com/morisono/chai-shop-p/network/members)
[![Build Status](https://img.shields.io/github/actions/workflow/status/morisono/chai-shop-p/ci.yml?branch=main)](https://github.com/morisono/chai-shop-p/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/morisono/chai-shop-p)](package.json)

[ドキュメント](https://github.com/morisono/chai-shop-p/wiki) | [デモ](https://vite-saas-demo.workers.dev) | [バグ報告](https://github.com/morisono/chai-shop-p/issues) | [機能リクエスト](https://github.com/morisono/chai-shop-p/issues)

</div>


## 説明

Taj Chai Web Shopは、ViteとReactで構築されたモダンでプロダクション対応のSaaSボイラープレートで、迅速な開発とスケーラビリティを目的として設計されています。この包括的なスターターキットには、認証、決済処理、データベース統合、Cloudflare Workersの展開設定が含まれています。

## 動機

このプロジェクトは最小限のオーバーヘッドでAI駆動開発を可能にします — ボイラープレートではなく、わずかな設定、指示、プロンプト、アイデアだけで済みます。

なぜ「前駆体（Precursors）」と呼ばれるのか？独断的な構造やコンポーネントを提供しないためです。

柔軟性を重視して設計されており、ユーザーが制約なく自由に構築できるようにサポートします。

## 主な機能

- **モダンな技術スタック** - Vite、React、TypeScript、TailwindCSS
- **認証** - Better Auth、パスキー、WebAuthnサポート
- **決済統合** - サブスクリプション管理機能付きStripe SDK
- **データベース** - Drizzle ORMを使用したSQLite
- **デプロイメント対応** - Cloudflare Workers、Pages、D1、KV
- **テストスイート** - Vitest、APIテスト用Pactum
- **AI統合** - OpenAI GPT-4 API、エージェントSDK
- **国際化** - 多言語サポート用i18next
- **データビジュアライゼーション** - Chart.js、React Table
- **UIコンポーネント** - Radix UI、Framer Motionアニメーション


完全な技術スタックを確認できます：[こちらから](.github/prompts/essential/tech_stack.yaml)

## インストール

<details><summary>前提条件</summary>

- Node.js 18+ またはBun
- pnpm（推奨）またはnpm
- Cloudflareアカウント（デプロイ用）

</details>

<details><summary>クイックスタート</summary>

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/vite-saas-boilerplate.git
   cd vite-saas-boilerplate
   ```

2. **依存関係をインストール**
   ```bash
   pnpm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.example .env.local
   ```
   設定に合わせて`.env.local`を編集してください

4. **データベースマイグレーションを実行**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **開発サーバーを起動**
   ```bash
   pnpm dev
   ```

アプリケーションは`http://localhost:5173`で利用できます

</details>


## 使用方法

<details><summary>開発コマンド</summary>

```bash
# 開発サーバーを起動
pnpm dev

# プロダクション用ビルド
pnpm build

# テストを実行
pnpm test

# リンティングを実行
pnpm lint

# コードをフォーマット
pnpm format

# データベース操作
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

</details>

<details><summary>フロントエンド開発</summary>

フロントエンドはViteとReactで構築されており、以下の機能を提供します：

```tsx
// 認証機能付きコンポーネントの例
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1>ようこそ、{user?.name}さん！</h1>
      <Button onClick={logout}>ログアウト</Button>
    </div>
  )
}
```

</details>

<details><summary>API開発</summary>

APIはCloudflare Workersで構築されています：

```typescript
// APIハンドラーの例
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

<details><summary>デプロイメント</summary>

Cloudflareにデプロイ：

```bash
# APIをデプロイ
pnpm deploy:api

# フロントエンドをデプロイ
pnpm deploy:frontend

# すべてをデプロイ
pnpm deploy
```

</details>

## 貢献

貢献を歓迎します！詳細については[貢献ガイドライン](CONTRIBUTING.md)をご覧ください。

<details><summary>開発ワークフロー</summary>

1. リポジトリをフォーク/クローンまたは取得してください：`git clone <repo-url>` または `git fetch --prune`
2. ワークツリーを作成してください（明示的なブランチ名で）：`git worktree add -b feature/123 .worktrees/feature/123 origin/main`
   - これにより、ワークツリーディレクトリに新しいブランチ `feature/123` が作成されます。
   - 完全な表現では、`git worktree add -b <prefix>/<version> .worktrees/<prefix>/<user>/<name>/<date>/<version> <remote>/<remote-branch>`
   - プレフィックスは `develop`、`feature`、`fix`、`release` などが可能です。
3. コーディング標準に従って変更を行ってください：`$editor .worktrees/feature/123`
4. テストを実行してください：`pnpm test`
5. リンティングを実行してください：`pnpm lint`
6. 変更をコミットしてください：`git commit -m 'Add amazing feature'`
7. ブランチにプッシュしてください：`git push origin feature/123`
8. プルリクエストを開いてください：`gh pr create`

（オプション）：
9. mainをブランチにマージしてください：`git switch main`、`git merge feature/123`
10. 古いブランチをプルーンしてください：`git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. ワークツリーをクリーンアップしてください：`git worktree prune`
12. 長期ブランチをリベースしてください：`git rebase origin/main`
13. ワークスペースをリセットしてください：コミット取り消し.. `git reset HEAD~1 --hard`、ステージング取り消し.. `git reset --`
14. ワークスペースをクリーンアップしてください：`git clean -fd`

一般的な組み合わせ：

* 新機能：ワークツリー作成、コーディング、テスト、プッシュ
* コードレビュー：mainにリベース、リンター実行、PR作成
* メジャーアップデート：リリースからブランチ、バージョン更新、mainにマージ

詳細については、[Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)をご覧ください。

</details>
10. 古いブランチをプルーンしてください：`git branch --merged | grep -v 'main\|feature' | xargs git branch -d`
11. ワークツリーをクリーンアップしてください：`git worktree prune`
12. 長期ブランチをリベースしてください：`git rebase origin/main`
13. ワークスペースをリセットしてください：コミット取り消し.. `git reset HEAD~1 --hard`、ステージング取り消し.. `git reset --`
14. ワークスペースをクリーンアップしてください：`git clean -fd`

一般的な組み合わせ：

* 新機能：ワークツリー作成、コーディング、テスト、プッシュ
* コードレビュー：mainにリベース、リンター実行、PR作成
* メジャーアップデート：リリースからブランチ、バージョン更新、mainにマージ

詳細については、[Git Flow Rules](.github/instructions/git-flow-rules.instructions.md)をご覧ください。

</details>

<details><summary>コード標準</summary>

- 型安全性のためのTypeScriptの使用
- ESLintとPrettierの設定に従う
- 新機能のテストを記述
- 必要に応じてドキュメントを更新
- 従来のコミットメッセージに従う

詳細については、[Project Rules](.github/prompts/essential/project_rules.yaml)をご覧ください。

</details>

## ライセンス

このプロジェクトはApache-2.0ライセンスの下でライセンスされています - 詳細については[LICENSE](LICENSE)ファイルをご覧ください。

## 謝辞

- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [React](https://reactjs.org/) - UIライブラリ
- [Cloudflare](https://cloudflare.com/) - エッジコンピューティングプラットフォーム
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Radix UI](https://radix-ui.com/) - アクセシブルなコンポーネントプリミティブ
- [Stripe](https://stripe.com/) - 決済処理
- [Better Auth](https://better-auth.com/) - 認証プラットフォーム
- [OpenAI](https://openai.com/) - AI統合

---

<div align="center">
コミュニティが❤️で作りました
</div>
