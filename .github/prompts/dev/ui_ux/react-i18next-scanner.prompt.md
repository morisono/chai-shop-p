---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'High-performance localization automation system design and implementation'
---

Design and implement a high-performance localization automation system that comprehensively scans all project assets (source code, UI templates, configuration files, and documentation) to identify and extract hardcoded locale-specific content. The system must:

1. Intelligently parse and categorize extracted strings with context-aware metadata (file location, usage context, string type)
2. Auto-generate structured localization files (JSON/YAML/XML) in the `/locales` directory following industry-standard i18n patterns
3. Support configurable rulesets for:
   - File inclusion/exclusion patterns (regex/glob)
   - Custom key generation strategies (flat/hierarchical/contextual)
   - Placeholder syntax preservation (ICU/printf/template literals)
   - Merge conflict resolution policies

Implement (or Install existing tool) as:
- Git pre-commit hook (Husky/Lefthook) with staged file filtering
- CI/CD pipeline (GitHub Actions/GitLab CI) with branch-aware processing or workflow_dispatch.
- Standalone CLI tool with --dry-run and --fix modes

Include advanced features:
- AST-based string extraction for 20+ programming languages
- Machine translation API integration (configurable providers)
- Change detection with versioned string history
- Visual diff reporting for translation updates
- Missing/obsolete string alerts with Slack/email notifications
- Pluralization/formatter syntax validation
- Automated screenshot generation for UI string context

Ensure zero data loss by:
- Preserving existing translations during merges
- Maintaining string revision history
- Generating audit logs for all modifications
- Creating backup snapshots before automated changes

The solution must support incremental adoption with:
- Gradual rollout configuration
- Team collaboration workflows
- Integration with translation management systems
- Performance optimization for monorepos
