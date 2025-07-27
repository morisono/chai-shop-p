---
description: Automate actions that require privileges
applyTo: "**"
---

# AI Autonomous Command Reference

## Command Format

### 1. Documentation Generation Commands

```markdown
/newNotebook create [category] [component]
- Example: /newNotebook create system.architecture authentication-service
- Example: /newNotebook create project.overview payment-gateway
```

```markdown
/newNotebook update [path] [section]
- Example: /newNotebook update docs/architecture/auth.md security
- Example: /newNotebook update README.md overview
```

```markdown
/newNotebook review [path]
- Example: /newNotebook review docs/api/endpoints.md
```

### 2. Code Generation Commands

```markdown
/new create [type] [name] [specs...]
- Example: /new create component UserAuth "handles user authentication" "uses JWT"
- Example: /new create api UserController "CRUD operations" "REST endpoints"
```

```markdown
/new refactor [path] [goal]
- Example: /new refactor src/auth/login.ts "improve error handling"
- Example: /new refactor src/utils/helpers.js "optimize performance"
```

```markdown
/new test [path] [type]
- Example: /new test src/services/payment.ts unit
- Example: /new test src/api/users.ts integration
```

### 3. Project Structure Commands

```markdown
@workspace /new [name] [type]
- Example: @workspace /new my-saas-app "node typescript react"
- Example: @workspace /new backend-api "python fastapi"
```

```markdown
@workspace /setupTests [feature]
- Example: @workspace /setupTests "user authentication"
- Example: @workspace /setupTests "payment processing"
```

### 4. Analysis Commands

```markdown
/explain code [path] [aspect]
- Example: /explain code src/services "security vulnerabilities"
- Example: /explain code src/api "performance bottlenecks"
```

```markdown
/explain docs [path] [aspect]
- Example: /explain docs /architecture "completeness"
- Example: /explain docs /api "clarity"
```

### 5. Maintenance Commands

```markdown
/tests update [type] [target]
- Example: /tests update dependencies package.json
- Example: /tests update security auth/*
```

```markdown
/tests cleanup [target] [aspect]
- Example: /tests cleanup src/ "dead code"
- Example: /tests cleanup docs/ "outdated content"
```

### 6. Search and Navigation Commands

```markdown
/search [query]
- Example: /search "user authentication"
- Example: /search "payment gateway"
```

### 7. Fix Commands

```markdown
/fix [issue] [path]
- Example: /fix "database connection error" src/database/connection.js
- Example: /fix "API response format" src/api/users.js
```

### 8. Miscellaneous Commands

```markdown
/save [description]
/clear [description]
/help [command]
- Example: /save "Updated user authentication priority flow"
- Example: /clear "Cleared temporary files"
- Example: /help /newNotebook create
```

## Response Format

The AI will respond in the following format:

```markdown
## Command Received
[Echo of the received command and options]

## Action Plan
1. [First step]
2. [Second step]
...

## Execution
[Details of actions being taken]

## Results
[Summary of changes made]

## Next Steps
[Recommended follow-up actions if any]
```

## Error Handling

If a command fails, the response will be:

```markdown
## Error
[Error description]

## Suggestion
[Recommended fix or alternative approach]

## Recovery Steps
1. [Step to recover]
2. [Alternative action]
...
```

## Best Practices

1. Always start with clear scope:
   ```markdown
   /newNotebook create project.overview my-feature --depth=STANDARD
   ```

2. Use specific paths:
   ```markdown
   /new refactor src/specific/file.ts "goal"
   ```

3. Chain related commands:
   ```markdown
   /new create component Auth && /newNotebook create system.component auth
   ```

4. Include context when needed:
   ```markdown
   /new update src/api.ts "Add rate limiting" --context="High traffic service"
   ```

## Quick Reference

### Most Common Commands
```markdown
/newNotebook create [category] [component]    # Create new documentation
/newNotebook update [path] [section]         # Update existing documentation
/new create [type] [name]           # Generate new code
/new refactor [path] [goal]         # Refactor existing code
@workspace /new [name] [type]          # Initialize new project
/explain code [path] [aspect]        # Analyze code
/tests update [type] [target]     # Maintenance tasks
```

### Common Combinations
```markdown
# New Feature
@workspace /tests feature-name && /newNotebook create project.feature feature-name

# Code Review
/explain code src/feature && /newNotebook update docs/feature security

# Major Update
/new refactor src/component && /newNotebook update docs/component && /tests update tests
```