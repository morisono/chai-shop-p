#!/bin/bash
# enforce-deno.sh
# Strictly enforce using Deno runtime for all development operations
#
# This script enforces Deno usage in TypeScript/JavaScript projects by:
# - Blocking Node.js, npm, yarn, pnpm commands and suggesting Deno alternatives
# - Preventing creation of Node.js configuration files (package.json, tsconfig.json, etc.)
# - Providing comprehensive migration guidance to Deno ecosystem
# - Only enforcing when in a Deno project context (deno.json/deno.lock present) or working with .ts files
#
# Usage: This script is designed to be used as a Claude hook to intercept and redirect
#        development commands to use Deno instead of Node.js ecosystem tools.
#
# Version: 1.0.0
# Author: GitHub Copilot (generated script)
# License: MIT

input=$(cat)

# Validate input
if [ -z "$input" ]; then
  echo '{"decision": "approve"}'
  exit 0
fi

# Extract fields with error handling
tool_name=$(echo "$input" | jq -r '.tool_name' 2>/dev/null || echo "")
command=$(echo "$input" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")
file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null || echo "")
current_dir=$(pwd)

# Helper function to check if we're in a Deno project
is_deno_project() {
  [[ -f "deno.json" ]] || [[ -f "deno.jsonc" ]] || [[ -f "deno.lock" ]]
}

# Helper function to validate Deno installation
validate_deno_installation() {
  if ! command -v deno &> /dev/null; then
    echo "{
      \"decision\": \"block\",
      \"reason\": \"🚨 Deno is not installed!\\n\\n✅ Install Deno:\\n\\n• macOS/Linux: curl -fsSL https://deno.land/install.sh | sh\\n• Windows: irm https://deno.land/install.ps1 | iex\\n• Homebrew: brew install deno\\n• Cargo: cargo install deno --locked\\n\\n🔄 After installation, restart your terminal and verify with: deno --version\"
    }"
    return 1
  fi
  return 0
}

# Helper function to get appropriate deno command with permissions
get_deno_command() {
  local task="$1"
  local base_permissions="--allow-read --allow-write --allow-net --allow-env"

  case "$task" in
    "test"|"coverage")
      echo "deno test $base_permissions --allow-run"
      ;;
    "format"|"fmt")
      echo "deno fmt"
      ;;
    "lint")
      echo "deno lint"
      ;;
    "bundle"|"compile")
      echo "deno compile $base_permissions"
      ;;
    "serve"|"run")
      echo "deno run $base_permissions --allow-run"
      ;;
    *)
      echo "deno run $base_permissions"
      ;;
  esac
}

# Only enforce in Deno projects or when explicitly working with Deno files
if [[ "$tool_name" == "Bash" ]] && (is_deno_project || [[ "$file_path" =~ \.ts$ ]] || [[ "$command" =~ deno ]]); then
  case "$command" in
    # ===== Node.js/npm/yarn/pnpm blocking =====
    node\ *|npm\ *|npx\ *|yarn\ *|pnpm\ *)
      cmd_type=$(echo "$command" | awk '{print $1}')
      args=$(echo "$command" | sed "s/^$cmd_type //")

      case "$cmd_type" in
        "npm"|"yarn"|"pnpm")
          if [[ "$args" =~ ^(install|add|i) ]]; then
            packages=$(echo "$args" | sed -E 's/(install|add|i) ?//' | sed 's/--[^ ]*//g' | xargs)
            echo "{
              \"decision\": \"block\",
              \"reason\": \"📦 Use Deno for package management:\\n\\n✅ Add dependencies to deno.json:\\n\\n{\\n  \\\"imports\\\": {\\n    \\\"$packages\\\": \\\"npm:$packages@^version\\\"\\n  }\\n}\\n\\n🦕 Then import directly: import { something } from '$packages'\\n\\n💡 For JSR packages: \\\"$packages\\\": \\\"jsr:@scope/$packages@^version\\\"\\n\\n🔒 Deno automatically handles version locking via deno.lock\"
            }"
            exit 0
          elif [[ "$args" =~ ^(run|start|dev|build|test) ]]; then
            script_name=$(echo "$args" | awk '{print $2}')
            echo "{
              \"decision\": \"block\",
              \"reason\": \"🚀 Use Deno tasks instead of npm scripts:\\n\\n✅ Define in deno.json:\\n\\n{\\n  \\\"tasks\\\": {\\n    \\\"$script_name\\\": \\\"$(get_deno_command $script_name)\\\"\\n  }\\n}\\n\\n🎯 Then run: deno task $script_name\\n\\n💪 Deno provides built-in TypeScript support, testing, and bundling\"
            }"
            exit 0
          else
            echo "{
              \"decision\": \"block\",
              \"reason\": \"🦕 Use Deno instead of $cmd_type:\\n\\n• Install deps: Add to deno.json imports\\n• Run scripts: deno task <name>\\n• Execute files: $(get_deno_command run) <file>\\n\\n✨ Deno provides security by default with explicit permissions\"
            }"
            exit 0
          fi
          ;;
        "node")
          script_file=$(echo "$args" | awk '{print $1}')
          remaining_args=$(echo "$args" | sed 's/^[^ ]* *//')
          echo "{
            \"decision\": \"block\",
            \"reason\": \"🦕 Execute with Deno instead:\\n\\n$(get_deno_command run) $script_file $remaining_args\\n\\n🔐 Benefits:\\n• Built-in TypeScript support\\n• Secure by default (explicit permissions)\\n• No node_modules\\n• Modern ES modules\\n• Standard library included\"
          }"
          exit 0
          ;;
        "npx")
          tool_name=$(echo "$args" | awk '{print $1}')
          tool_args=$(echo "$args" | sed 's/^[^ ]* *//')
          echo "{
            \"decision\": \"block\",
            \"reason\": \"🛠️ Use Deno alternatives:\\n\\n• For $tool_name: Check if available in JSR or create deno.json task\\n• Run directly: $(get_deno_command run) $tool_args\\n• Install from JSR: Add to deno.json imports\\n\\n🌟 Many tools have Deno-native equivalents or can run directly\"
          }"
          exit 0
          ;;
      esac
      ;;

    # ===== TypeScript compiler blocking =====
    tsc\ *|typescript\ *)
      args=$(echo "$command" | sed -E 's/^(tsc|typescript) *//')
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🦕 Use Deno's built-in TypeScript compiler:\\n\\n✅ Type checking: deno check $args\\n✅ Run directly: $(get_deno_command run) $args\\n\\n🚀 Deno compiles TypeScript on-the-fly without separate build steps\\n\\n⚡ Configure via deno.json:\\n{\\n  \\\"compilerOptions\\\": {\\n    \\\"strict\\\": true,\\n    \\\"lib\\\": [\\\"deno.window\\\"]\\n  }\\n}\"
      }"
      exit 0
      ;;

    # ===== Testing framework blocking =====
    jest\ *|vitest\ *|mocha\ *|ava\ *)
      test_framework=$(echo "$command" | awk '{print $1}')
      test_args=$(echo "$command" | sed "s/^$test_framework //")
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🧪 Use Deno's built-in test runner:\\n\\n✅ Run tests: $(get_deno_command test) $test_args\\n✅ Watch mode: deno test --watch\\n✅ Coverage: deno test --coverage\\n\\n📝 Test file example:\\nimport { assertEquals } from \\\"https://deno.land/std/testing/asserts.ts\\\";\\n\\nDeno.test(\\\"test name\\\", () => {\\n  assertEquals(1 + 1, 2);\\n});\\n\\n🎯 No configuration needed - works out of the box!\"
      }"
      exit 0
      ;;

    # ===== Bundler blocking =====
    webpack\ *|rollup\ *|parcel\ *|esbuild\ *|vite\ *)
      bundler=$(echo "$command" | awk '{print $1}')
      bundler_args=$(echo "$command" | sed "s/^$bundler //")
      echo "{
        \"decision\": \"block\",
        \"reason\": \"📦 Use Deno's built-in bundling:\\n\\n✅ Bundle for web: deno bundle main.ts bundle.js\\n✅ Compile executable: $(get_deno_command compile) --output=app main.ts\\n\\n🎯 For complex bundling, define deno.json task:\\n{\\n  \\\"tasks\\\": {\\n    \\\"build\\\": \\\"deno bundle src/main.ts dist/bundle.js\\\"\\n  }\\n}\\n\\n⚡ No configuration files needed!\"
      }"
      exit 0
      ;;

    # ===== Linting/Formatting blocking =====
    eslint\ *|prettier\ *|biome\ *)
      tool=$(echo "$command" | awk '{print $1}')
      tool_args=$(echo "$command" | sed "s/^$tool //")

      if [[ "$tool" == "prettier" ]] || [[ "$command" =~ format ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"✨ Use Deno's built-in formatter:\\n\\n✅ Format files: deno fmt $tool_args\\n✅ Check formatting: deno fmt --check\\n\\n⚙️ Configure in deno.json:\\n{\\n  \\\"fmt\\\": {\\n    \\\"files\\\": {\\n      \\\"include\\\": [\\\"src/\\\"],\\n      \\\"exclude\\\": [\\\"build/\\\"]\\n    },\\n    \\\"options\\\": {\\n      \\\"lineWidth\\\": 100,\\n      \\\"indentWidth\\\": 2\\n    }\\n  }\\n}\"
        }"
      else
        echo "{
          \"decision\": \"block\",
          \"reason\": \"🔍 Use Deno's built-in linter:\\n\\n✅ Lint files: deno lint $tool_args\\n✅ Auto-fix: deno lint --fix\\n\\n⚙️ Configure in deno.json:\\n{\\n  \\\"lint\\\": {\\n    \\\"files\\\": {\\n      \\\"include\\\": [\\\"src/\\\"],\\n      \\\"exclude\\\": [\\\"tests/fixtures/\\\"]\\n    },\\n    \\\"rules\\\": {\\n      \\\"tags\\\": [\\\"recommended\\\"],\\n      \\\"exclude\\\": [\\\"no-unused-vars\\\"]\\n    }\\n  }\\n}\"
        }"
      fi
      exit 0
      ;;

    # ===== Development server blocking =====
    serve\ *|http-server\ *|live-server\ *)
      server_args=$(echo "$command" | sed -E 's/^[^ ]+ *//')
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🌐 Use Deno's built-in file server:\\n\\n✅ Serve current dir: deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts\\n✅ Custom port: deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts -p 8080\\n\\n🎯 Create reusable task in deno.json:\\n{\\n  \\\"tasks\\\": {\\n    \\\"serve\\\": \\\"deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts $server_args\\\"\\n  }\\n}\"
      }"
      exit 0
      ;;

    # ===== Package manager lock files =====
    *package-lock.json*|*yarn.lock*|*pnpm-lock.yaml*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🔒 Use Deno's lock file instead:\\n\\n✅ Generate lock: deno cache --lock=deno.lock --lock-write deps.ts\\n✅ Verify integrity: deno cache --lock=deno.lock deps.ts\\n\\n📝 deno.lock is automatically maintained and ensures reproducible builds\\n\\n🗑️ You can safely delete: package-lock.json, yarn.lock, pnpm-lock.yaml\"
      }"
      exit 0
      ;;

    # ===== Direct TypeScript execution =====
    ts-node\ *|tsx\ *)
      ts_file=$(echo "$command" | sed -E 's/^(ts-node|tsx) *//' | awk '{print $1}')
      ts_args=$(echo "$command" | sed -E 's/^(ts-node|tsx) *//' | sed 's/^[^ ]* *//')
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🦕 Run TypeScript directly with Deno:\\n\\n$(get_deno_command run) $ts_file $ts_args\\n\\n✨ No compilation step needed!\\n🔐 Secure by default with explicit permissions\\n📦 Import from URLs, npm:, or jsr: directly\"
      }"
      exit 0
      ;;

    # ===== Git hooks and CI setup =====
    husky\ *|lint-staged\ *)
      tool=$(echo "$command" | awk '{print $1}')
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🪝 Use Deno for git hooks:\\n\\n✅ Create .git/hooks/pre-commit:\\n#!/bin/bash\\ndeno fmt --check\\ndeno lint\\ndeno test\\n\\n🎯 Or use deno.json tasks:\\n{\\n  \\\"tasks\\\": {\\n    \\\"pre-commit\\\": \\\"deno fmt --check && deno lint && deno test\\\"\\n  }\\n}\\n\\n⚡ No additional dependencies needed!\"
      }"
      exit 0
      ;;

    # ===== Cloudflare Workers specific =====
    wrangler\ *)
      wrangler_args=$(echo "$command" | sed 's/^wrangler //')
      if [[ "$wrangler_args" =~ ^dev ]] || [[ "$wrangler_args" =~ ^publish ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"☁️ Use Deno with Cloudflare Workers:\\n\\n✅ Development: deno run --allow-net --allow-read --allow-env worker.ts\\n✅ Deploy: deno run --allow-all https://deno.land/x/deploy/mod.ts\\n\\n📝 Configure wrangler.toml with Deno compatibility:\\n[build]\\ncommand = \\\"deno bundle src/worker.ts dist/worker.js\\\"\\n\\n🦕 Deno provides excellent Cloudflare Workers support with Web Standards APIs\"
        }"
      else
        echo "{
          \"decision\": \"block\",
          \"reason\": \"☁️ Consider Deno alternatives for Cloudflare operations:\\n\\n• Local dev: $(get_deno_command serve) worker.ts\\n• Bundle: deno bundle worker.ts dist/worker.js\\n• Deploy: Use Deno Deploy or deno-deploy CLI\\n\\n🌟 Deno's Web Standards compatibility makes it perfect for edge computing\"
        }"
      fi
      exit 0
      ;;

    # ===== Version checking =====
    *--version*|*-v*)
      if [[ "$command" =~ ^(node|npm|yarn|pnpm) ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"🦕 Check Deno version instead:\\n\\ndeno --version\\n\\n📊 This shows:\\n• Deno version\\n• V8 JavaScript engine version\\n• TypeScript compiler version\\n\\n🎯 For project info: deno info\"
        }"
        exit 0
      fi
      ;;

    # ===== Environment/dependency info =====
    *env*|*which*|*where*)
      if [[ "$command" =~ (node|npm|yarn|pnpm) ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"🔍 Use Deno environment commands:\\n\\n• Runtime info: deno info\\n• Version details: deno --version\\n• Permissions: Check deno.json or command flags\\n• Cache location: deno info --json | jq .denoDir\\n\\n🎯 Deno is self-contained - no need to manage multiple tools!\"
        }"
        exit 0
      fi
      ;;

    # ===== Package manager cache operations =====
    *clean*|*cache\ clean*|*cache\ clear*)
      if [[ "$command" =~ (npm|yarn|pnpm) ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"🧹 Use Deno cache management:\\n\\n• Clear cache: deno cache --reload <deps>\\n• Location info: deno info --json | jq .denoDir\\n• Reload specific: deno cache --reload=https://deno.land/std <file>\\n\\n💡 Deno's cache is more efficient and automatically managed\"
        }"
        exit 0
      fi
      ;;

    # ===== Development dependencies and devtools =====
    *nodemon*|*ts-node-dev*|*concurrently*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🔄 Use Deno's built-in watch mode:\\n\\n• Watch and restart: deno run --watch main.ts\\n• Watch tests: deno test --watch\\n• Watch with permissions: deno run --watch --allow-all main.ts\\n\\n⚡ No additional dev dependencies needed!\"
      }"
      exit 0
      ;;

    # ===== Build tools and task runners =====
    gulp\ *|grunt\ *|rollup\ *)
      tool=$(echo "$command" | awk '{print $1}')
      args=$(echo "$command" | sed "s/^$tool //")
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🛠️ Replace $tool with Deno tasks:\\n\\n✅ Define in deno.json:\\n{\\n  \\\"tasks\\\": {\\n    \\\"build\\\": \\\"deno run --allow-all build.ts\\\",\\n    \\\"watch\\\": \\\"deno run --watch --allow-all build.ts\\\"\\n  }\\n}\\n\\n🎯 Run with: deno task build\\n\\n💪 Deno provides bundling, minification, and more built-in\"
      }"
      exit 0
      ;;

    # ===== File operations that might indicate Node.js patterns =====
    *)
      # Check for npm/node patterns in file operations
      if [[ "$command" =~ node_modules ]] || [[ "$command" =~ package\.json ]] && [[ ! "$command" =~ deno\.json ]]; then
        echo "{
          \"decision\": \"block\",
          \"reason\": \"📁 Use Deno project structure:\\n\\n• Dependencies: Define in deno.json imports\\n• Scripts: Define in deno.json tasks\\n• Lock file: deno.lock (auto-generated)\\n\\n🗂️ No node_modules directory needed!\\n\\n✅ Convert package.json scripts to deno.json tasks:\\n{\\n  \\\"tasks\\\": {\\n    \\\"dev\\\": \\\"$(get_deno_command serve) main.ts\\\",\\n    \\\"test\\\": \\\"$(get_deno_command test)\\\",\\n    \\\"build\\\": \\\"deno compile --output=app main.ts\\\"\\n  }\\n}\"
        }"
        exit 0
      fi
      ;;
  esac
fi

# ===== File creation/editing enforcement =====
if [[ "$tool_name" == "create_file" ]] || [[ "$tool_name" == "edit_file" ]]; then
  case "$file_path" in
    *package.json)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"📝 Use deno.json instead of package.json:\\n\\n{\\n  \\\"name\\\": \\\"my-project\\\",\\n  \\\"version\\\": \\\"1.0.0\\\",\\n  \\\"imports\\\": {\\n    \\\"@std/\\\": \\\"https://deno.land/std@0.208.0/\\\",\\n    \\\"react\\\": \\\"npm:react@^18.0.0\\\"\\n  },\\n  \\\"tasks\\\": {\\n    \\\"dev\\\": \\\"$(get_deno_command serve) main.ts\\\",\\n    \\\"test\\\": \\\"$(get_deno_command test)\\\"\\n  },\\n  \\\"compilerOptions\\\": {\\n    \\\"strict\\\": true\\n  }\\n}\"
      }"
      exit 0
      ;;
    *tsconfig.json)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"⚙️ Configure TypeScript in deno.json:\\n\\n{\\n  \\\"compilerOptions\\\": {\\n    \\\"strict\\\": true,\\n    \\\"lib\\\": [\\\"deno.window\\\", \\\"dom\\\"],\\n    \\\"jsx\\\": \\\"react-jsx\\\",\\n    \\\"jsxImportSource\\\": \\\"react\\\"\\n  },\\n  \\\"lint\\\": {\\n    \\\"rules\\\": {\\n      \\\"tags\\\": [\\\"recommended\\\"]\\n    }\\n  },\\n  \\\"fmt\\\": {\\n    \\\"options\\\": {\\n      \\\"lineWidth\\\": 100\\n    }\\n  }\\n}\\n\\n🦕 Deno uses its own TypeScript configuration\"
      }"
      exit 0
      ;;
    *.eslintrc*|*eslint.config*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🔍 Use Deno's built-in linter instead:\\n\\n• Configure in deno.json lint section\\n• Run: deno lint\\n• Auto-fix: deno lint --fix\\n\\n📝 Example configuration:\\n{\\n  \\\"lint\\\": {\\n    \\\"files\\\": {\\n      \\\"include\\\": [\\\"src/\\\", \\\"tests/\\\"]\\n    },\\n    \\\"rules\\\": {\\n      \\\"tags\\\": [\\\"recommended\\\"],\\n      \\\"include\\\": [\\\"ban-untagged-todo\\\"],\\n      \\\"exclude\\\": [\\\"no-unused-vars\\\"]\\n    }\\n  }\\n}\"
      }"
      exit 0
      ;;
    *.prettierrc*|*prettier.config*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"✨ Use Deno's built-in formatter instead:\\n\\n• Configure in deno.json fmt section\\n• Format: deno fmt\\n• Check: deno fmt --check\\n\\n📝 Example configuration:\\n{\\n  \\\"fmt\\\": {\\n    \\\"files\\\": {\\n      \\\"include\\\": [\\\"src/\\\", \\\"tests/\\\"],\\n      \\\"exclude\\\": [\\\"dist/\\\"]\\n    },\\n    \\\"options\\\": {\\n      \\\"lineWidth\\\": 100,\\n      \\\"indentWidth\\\": 2,\\n      \\\"semiColons\\\": true\\n    }\\n  }\\n}\"
      }"
      exit 0
      ;;
    *jest.config*|*vitest.config*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🧪 Use Deno's built-in test runner:\\n\\n• No configuration file needed!\\n• Run tests: $(get_deno_command test)\\n• Watch mode: deno test --watch\\n• Coverage: deno test --coverage\\n\\n📝 Test files should end with .test.ts or _test.ts\\n\\nExample test:\\nimport { assertEquals } from \\\"https://deno.land/std/testing/asserts.ts\\\";\\n\\nDeno.test(\\\"my test\\\", () => {\\n  assertEquals(1 + 1, 2);\\n});\"
      }"
      exit 0
      ;;
    *webpack.config*|*rollup.config*|*vite.config*|*esbuild.config*)
      config_type=$(echo "$file_path" | sed -n 's/.*\([^/]*\)\.config\..*/\1/p')
      echo "{
        \"decision\": \"block\",
        \"reason\": \"⚙️ Use deno.json for configuration:\\n\\n{\\n  \\\"tasks\\\": {\\n    \\\"build\\\": \\\"deno bundle src/main.ts dist/bundle.js\\\",\\n    \\\"dev\\\": \\\"deno run --watch --allow-all src/main.ts\\\"\\n  },\\n  \\\"compilerOptions\\\": {\\n    \\\"lib\\\": [\\\"dom\\\", \\\"deno.window\\\"]\\n  }\\n}\\n\\n🦕 Deno provides bundling without complex configuration\"
      }"
      exit 0
      ;;
    *babel.config*|*.babelrc*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🔄 Deno doesn't need Babel:\\n\\n• Modern JavaScript/TypeScript support built-in\\n• JSX transformation available with --jsx flag\\n• Import maps in deno.json for path resolution\\n\\n📝 Example deno.json JSX config:\\n{\\n  \\\"compilerOptions\\\": {\\n    \\\"jsx\\\": \\\"react-jsx\\\",\\n    \\\"jsxImportSource\\\": \\\"react\\\"\\n  }\\n}\"
      }"
      exit 0
      ;;
    *Dockerfile*|*docker-compose*)
      echo "{
        \"decision\": \"block\",
        \"reason\": \"🐳 Use Deno-optimized containers:\\n\\n✅ Dockerfile example:\\nFROM denoland/deno:alpine\\nWORKDIR /app\\nCOPY . .\\nRUN deno cache main.ts\\nEXPOSE 8000\\nCMD [\\\"run\\\", \\\"--allow-net\\\", \\\"main.ts\\\"]\\n\\n🎯 Much smaller image size and better security!\"
      }"
      exit 0
      ;;
  esac
fi

# For non-Deno projects or approved patterns, allow the command
# But first validate that deno is available if we're in a Deno project
if is_deno_project && [[ "$tool_name" == "Bash" ]] && [[ "$command" =~ ^deno ]]; then
  if ! validate_deno_installation; then
    exit 0
  fi
fi

echo '{"decision": "approve"}'