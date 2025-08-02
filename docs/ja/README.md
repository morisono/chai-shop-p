<div align="center">

[English](../README.md) | [한국어](../ko/README.md) | [日本語](README.md) | [简体中文](../zh/README.md)

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

   **フロントエンド設定:**
   ```bash
   cd apps/frontend/
   cp .env.example .env.local
   ```

   **バックエンド設定:**
   ```bash
   cd apps/backend/
   cp .env.example .env.local
   ```

   **データベース設定:**
   ```bash
   cp db/.env.example db/.env.local
   ```

   **インフラストラクチャ設定:**
   ```bash
   cp infra/.env.example infra/.env.local
   ```

   各`.env.local`ファイルを具体的な設定で編集してください。

4. **データベース環境を設定**

   `db/.env.local`で以下を設定:
   ```bash
   # データベース設定
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

   # 開発用モック認証ユーザー
   # 開発テスト用の認証情報:
   # admin@dev:temp123 (管理者ロール)
   # user@dev:temp123 (ユーザーロール)
   # manager@dev:temp123 (マネージャーロール)

   # 監査設定
   AUDIT_BATCH_SIZE=100
   AUDIT_FLUSH_INTERVAL=5000
   AUDIT_RETENTION_DAYS=2555
   ```

   **オプション: Cloudflare Hyperdriveの設定（本番環境推奨）**

   1. Hyperdrive接続を作成:
      ```bash
      DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
      npx wrangler hyperdrive create my-first-hyperdrive --connection-string=$DATABASE_URL
      ```

   2. 上記コマンドから返されたHyperdrive IDで`wrangler.toml`を更新してください。

   詳細については、[Hyperdriveドキュメント](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)を参照してください。

5. **インフラストラクチャ環境を設定**

   `infra/.env.local`で以下を設定:
   ```bash
   # 環境設定
   ENVIRONMENT=development

   # Cloudflare設定
   CF_ACCOUNT_ID=your-cloudflare-account-id
   CF_KV_NAMESPACE=your-kv-namespace-id
   CF_API_TOKEN=your-cloudflare-api-token
   CF_R2_ACCESS_KEY_ID=your-r2-access-key
   CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
   CF_R2_BUCKET=auth-storage
   CF_WORKERS_API_TOKEN=cf-workers-api-token

   # 外部ログ（本番用）
   CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
   CF_LOGPUSH_TOKEN=your-logpush-token
   SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
   SPLUNK_TOKEN=your-splunk-token

   # 監視とアラート
   ALERT_WEBHOOK=https://alerts.example.com/webhook

   # Supabase設定
   SUPABASE_URL=supabase-url
   SUPABASE_ANON_KEY=supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
   SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
   ```

6. **フロントエンド環境を設定**

   `apps/frontend/.env.local`で以下を設定:
   ```bash
   # Better Auth設定
   VITE_BETTER_AUTH_URL=http://localhost:3001

   # アプリケーション設定
   VITE_APP_NAME=Your App Name
   VITE_NODE_ENV=development

   # バックエンドAPI URL
   VITE_API_URL=http://localhost:3001

   # フロントエンド設定
   VITE_FRONTEND_URL=http://localhost:5173

   # OAuthリダイレクトURL（クライアント側参照用）
   VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
   VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
   VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
   VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

   # 開発設定
   VITE_DEV_MODE=true
   ```

7. **バックエンド環境を設定**

   `apps/backend/.env.local`で以下を設定:
   ```bash
   # アプリケーション設定
   APP_NAME=Your Saas Name
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # サーバー設定
   PORT=3001
   HOST=0.0.0.0
   LOG_LEVEL=info
   APP_VERSION=1.0.0
   COOKIE_DOMAIN=localhost

   # データベース設定
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Better Auth設定
   BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
   BETTER_AUTH_BASE_URL=http://localhost:3001
   BETTER_AUTH_DOMAIN=better-auth-domain

   # OAuthプロバイダー
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   X_TWITTER_CLIENT_ID=your-x-twitter-client-id
   X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

   # Stripe設定（開発 - テストモード）
   STRIPE_SECRET_KEY=sk_***
   STRIPE_PUBLISHABLE_KEY=pk_***
   STRIPE_WEBHOOK_SECRET=whsec_***

   # セキュリティ設定
   SESSION_TIMEOUT=900
   REFRESH_TOKEN_LIFETIME=86400
   SECURITY_LEVEL=low
   DEBUG_AUTH=true
   MFA_REQUIRED=false

   # AI設定
   OPENAI_API_KEY=openai-api-key
   ANTHROPIC_API_KEY=anthropic-api-key
   GEMINI_API_KEY=gemini-api-key
   DEEPSEEK_API_KEY=deepseek-api-key

   # レート制限設定
   RATE_LIMIT_GLOBAL_MAX=100
   RATE_LIMIT_GLOBAL_WINDOW=60
   RATE_LIMIT_SIGNIN_MAX=5
   RATE_LIMIT_SIGNUP_MAX=3
   ```

8. **データベースマイグレーションを実行**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # データベーススキーマをプッシュ
   pnpm db:seed # 初期データでデータベースをシード
   ```

9. **開発サーバーを起動**
   ```bash
   pnpm dev
   ```

アプリケーションは`http://localhost:5173`で利用できます

### 代替案: ローカル PostgreSQL データベース

1. **PostgreSQL をインストール**: お使いのオペレーティングシステムに適した[公式インストールガイド](https://www.postgresql.org/download/)に従ってください。

2. **PostgreSQL を開始**: PostgreSQL サービスが実行されていることを確認してください。

3. **データベースを作成**: 以下のコマンドを使用して新しいデータベースを作成します:
   ```bash
   createdb auth_db
   ```

4. **環境変数を設定**: ローカルデータベース接続の詳細で `db/.env.local` ファイルを更新します:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
   ```

5. **データベースマイグレーションを実行**: 以下のコマンドを実行してデータベーススキーマを設定します:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   pnpm db:push # データベーススキーマをプッシュ
   pnpm db:seed # 初期データでデータベースをシード
   ```

6. **開発サーバーを開始**: 以下のコマンドで開発サーバーを起動します:
   ```bash
   pnpm dev
   ```

アプリケーションは `http://localhost:5173` で利用できます

</details>

## 環境変数マイグレーションガイド

### 最新の変更 (v0.2.0)

**⚠️ 重要な変更**: 環境変数は、より良いコンポーネント分離とセキュリティのために再構築されました。

<details><summary>以前のバージョンからの移行</summary>

**古い構造 (非推奨 - v0.1.x):**
```bash
# 単一の .env ファイルのすべての変数
DATABASE_URL=...
CF_ACCOUNT_ID=...
GOOGLE_CLIENT_ID=...
BETTER_AUTH_SECRET=...
# ... 他のすべての変数が混在
```

**新しい構造 (現在 - v0.2.0+):**

**フロントエンド環境 (`apps/frontend/.env.local`):**
```bash
# Better Auth 設定
VITE_BETTER_AUTH_URL=http://localhost:3001

# アプリケーション設定
VITE_APP_NAME=Your App Name
VITE_NODE_ENV=development

# バックエンド API URL
VITE_API_URL=http://localhost:3001
VITE_FRONTEND_URL=http://localhost:5173

# OAuth リダイレクト URL（クライアント側参照用）
VITE_GITHUB_REDIRECT_URL=http://localhost:3001/api/auth/callback/github
VITE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/google
VITE_APPLE_REDIRECT_URL=http://localhost:3001/api/auth/callback/apple
VITE_X-TWITTER_REDIRECT_URL=http://localhost:3001/api/auth/callback/x-twitter

# 開発設定
VITE_DEV_MODE=true
```

**バックエンド環境 (`apps/backend/.env.local`):**
```bash
# アプリケーション設定
APP_NAME=Your Saas Name
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# サーバー設定
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
APP_VERSION=1.0.0
COOKIE_DOMAIN=localhost

# データベース設定
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Better Auth 設定
BETTER_AUTH_SECRET=your-secret-key-here-use-openssl-rand-base64-32
BETTER_AUTH_BASE_URL=http://localhost:3001
BETTER_AUTH_DOMAIN=better-auth-domain

# OAuth プロバイダー
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
X_TWITTER_CLIENT_ID=your-x-twitter-client-id
X_TWITTER_CLIENT_SECRET=your-x-twitter-client-secret

# Stripe 設定（開発 - テストモード）
STRIPE_SECRET_KEY=sk_***
STRIPE_PUBLISHABLE_KEY=pk_***
STRIPE_WEBHOOK_SECRET=whsec_***

# セキュリティ設定
SESSION_TIMEOUT=900
REFRESH_TOKEN_LIFETIME=86400
SECURITY_LEVEL=low
DEBUG_AUTH=true
MFA_REQUIRED=false

# AI 設定
OPENAI_API_KEY=openai-api-key
ANTHROPIC_API_KEY=anthropic-api-key
GEMINI_API_KEY=gemini-api-key
DEEPSEEK_API_KEY=deepseek-api-key

# レート制限設定
RATE_LIMIT_GLOBAL_MAX=100
RATE_LIMIT_GLOBAL_WINDOW=60
RATE_LIMIT_SIGNIN_MAX=5
RATE_LIMIT_SIGNUP_MAX=3
```

**データベース環境 (`db/.env.local`):**
```bash
# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# 開発用モック認証ユーザー
# 開発テスト用の認証情報:
# admin@dev:temp123 (管理者ロール)
# user@dev:temp123 (ユーザーロール)
# manager@dev:temp123 (マネージャーロール)

# 監査設定
AUDIT_BATCH_SIZE=100
AUDIT_FLUSH_INTERVAL=5000
AUDIT_RETENTION_DAYS=2555
```

**インフラストラクチャ環境 (`infra/.env.local`):**
```bash
# 環境設定
ENVIRONMENT=development

# Cloudflare 設定
CF_ACCOUNT_ID=your-cloudflare-account-id
CF_KV_NAMESPACE=your-kv-namespace-id
CF_API_TOKEN=your-cloudflare-api-token
CF_R2_ACCESS_KEY_ID=your-r2-access-key
CF_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CF_R2_BUCKET=auth-storage
CF_WORKERS_API_TOKEN=cf-workers-api-token

# 外部ログ（本番用）
CF_LOGPUSH_ENDPOINT=https://logs.example.com/cloudflare
CF_LOGPUSH_TOKEN=your-logpush-token
SPLUNK_ENDPOINT=https://splunk.example.com/services/collector
SPLUNK_TOKEN=your-splunk-token

# 監視とアラート
ALERT_WEBHOOK=https://alerts.example.com/webhook

# Supabase 設定
SUPABASE_URL=supabase-url
SUPABASE_ANON_KEY=supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=supabase-service-role-key
SUPABASE_FUNCTIONS_URL=https://saas-app.supabase.co/functions/v1
```

**移行手順:**

1. **既存の設定をバックアップ:**
   ```bash
   # 古い設定をバックアップ
   cp .env .env.backup.v0.1.x
   cp .env.local .env.local.backup.v0.1.x
   ```

2. **新しいディレクトリ固有の構造を作成:**
   ```bash
   # フロントエンド設定
   cd apps/frontend/
   cp .env.example .env.local

   # バックエンド設定
   cd ../backend/
   cp .env.example .env.local

   # データベース設定
   cd ../../db/
   cp .env.example .env.local

   # インフラストラクチャ設定
   cd ../infra/
   cp .env.example .env.local
   cd ..
   ```

3. **変数を適切なファイルに移行:**
   - **フロントエンド変数**: `VITE_*` 変数を `apps/frontend/.env.local` に移動
   - **バックエンド変数**: 認証、サーバー、API変数を `apps/backend/.env.local` に移動
   - **データベース変数**: `DATABASE_URL` と監査設定を `db/.env.local` に移動
   - **インフラストラクチャ変数**: Cloudflare と Supabase 変数を `infra/.env.local` に移動

4. **スクリプトと設定参照を更新:**
   - データベーススクリプトは `db/.env.local` から読み取り
   - インフラストラクチャスクリプトは `infra/.env.local` から読み取り
   - フロントエンドビルドプロセスは `apps/frontend/.env.local` から読み取り
   - バックエンドアプリケーションは `apps/backend/.env.local` から読み取り

5. **設定読み込みを確認:**
   ```bash
   # フロントエンド設定をテスト
   cd apps/frontend && pnpm dev:client

   # バックエンド設定をテスト
   cd apps/backend && pnpm dev:server

   # データベース接続をテスト
   pnpm db:studio
   ```

**⚠️ 非推奨変数 (v0.1.x 設定から削除):**

v0.1.x の以下の変数は現在非推奨であり、削除する必要があります:
- `BETTER_AUTH_AUDIENCE` (`BETTER_AUTH_DOMAIN` に置き換え)
- `SESSION_SECRET` (`BETTER_AUTH_SESSION_SECRET` に名前変更)
- `PUBLIC_STRIPE_*` (`PUBLIC_` プレフィックスを除去するように名前変更)
- ルートレベル `DATABASE_URL` (`db/.env.local` に移動)

**後方互換性:**

移行中に v0.1.x デプロイメントとの互換性を維持する必要がある場合:

1. デプロイメント設定で古い変数を一時的に保持
2. CI/CD パイプラインで環境固有のオーバーライドを使用
3. 非推奨変数を削除する前にステージング環境で徹底的にテスト
4. 新しいファイル位置を参照するようデプロイメントスクリプトを更新

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
