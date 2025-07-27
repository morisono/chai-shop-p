---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Implement react-i18next localization throughout the project'
---

Implement react-i18next throughout the entire project by scanning all components to identify and replace hardcoded language-specific UI text. Extract these strings into a centralized dictionary with locale-specific translations.

1. Systematically scanning all components to identify hardcoded language-specific text
2. Extracting and organizing all strings into a structured YAML dictionary with locale-specific translations (docs/en/System/PrimaryForm.yaml, docs/zh/System/PrimaryForm.yaml, etc.)
3. Configuring a robust i18n instance with dynamic translation loading based on user language preferences
4. Replacing all static text with t() function calls while maintaining proper namespace organization
5. Implementing TypeScript support for translation keys to ensure type safety
6. Setting up language detection with fallback chains and persistence
7. Creating comprehensive unit tests to verify translation functionality and validate full internationalization coverage via automated testing.
8. Establishing end-to-end tests to validate UI rendering across all supported locales
9. Integrating with CI/CD to ensure translation completeness during builds
10. Documenting the internationalization pattern for future component development

Ensure the solution supports:
- Dynamic language switching without page reload
- Pluralization and interpolation
- Contextual translations
- Missing key handling with fallbacks
- Accessibility considerations for RTL languages
- Performance optimization through code splitting and lazy loading of locale files