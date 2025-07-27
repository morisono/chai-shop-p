---
description: Git Flow Ruleset
applyTo: "**"
---

PrePRChecklist:
  - DesignDocument:
    * Create a design document in the appropriate `/docs/<lang>/<category>/..` directory and share the link for feedback.
  - PrototypeImplementation:
    * Develop a prototype in the `/proto` directory to validate design concepts before full implementation.
  - RebaseBeforePR:
    * Before creating a Pull Request (PR), rebase your branch with the latest main branch to resolve conflicts.

BranchStrategy:
  - FeatureBranchCreation:
    * Create feature branches from the main branch using the naming convention `<prefix>/<topic>-<index>.` (e.g. `feature/utils-1`)
      + Use a prefix like `feature/`, `bugfix/`, or `chore/` for the branch prefix name
  - AvoidDowntime:
    * Separate disruptive changes into distinct PRs and plan their releases to prevent downtime.

WorktreeStrategy:
  - WorktreeUsage:
    * Use Git worktrees to manage multiple branches simultaneously without needing to switch branches frequently.
    * Create a new worktree for each feature at `git worktree add .git/wt/<prefix>/(<user>/<date>/)<topic>-<index> -b <branch>`.
      + Example: `git worktree add .git/wt/feature/auth-pt1 feature/auth-pt1`
      + Example (full): `git worktree add .git/wt/feature/johndoe/20241001/auth-pt1 feature/auth-pt1`

UndoRedoStrategy:
  - UndoStaging:
    * Use `git reset --` to unstage changes without discarding them.
  - UndoCommit:
    * Use `git reset HEAD~1 --hard` to undo the last commit and discard changes.
  - CleanWorkspace:
    * Use `git clean -fd` to remove untracked files and directories from the workspace.
  - PruneWorktrees:
    * Use `git worktree prune` to clean up old worktrees that are no longer needed.

WorkspaceManagement:
  - WorkspaceIsolation:
    * Use separate workspaces for different features or topics to avoid conflicts.
    * Ensure that each workspace is self-contained and does not interfere with others.
  - CleanupAfterMerge:
    * After merging a feature branch, delete the branch to keep the repository clean.

CommitStrategy:
  - CommitGranularity:
    * Divide commits into logical units such as refactoring, adding unit tests, API modifications, and UI changes.
    * Avoid mixing mechanical changes (e.g., formatting or lint fixes) with functional code changes.
  - CommitCleanup:
    * Use squash, reset, or rebase to consolidate trivial commits and maintain a clean commit history.
  - NewFilesHandling:
    * For new files, include all necessary changes in a single commit to avoid issues like filename corrections across commits.

PRGuidelines:
  - DetailedDescription:
    * Include links to related issues, discussions, and design documents.
    * Clearly explain the purpose of the PR, what was tested, and any urgency for review.
  - VisualAids:
    * Attach screenshots or videos for UI changes to assist in the review process.
  - ReviewerAssignment:
    * Assign at least one primary reviewer and a secondary reviewer when possible.
  - AutomatedChecks:
    * Ensure that all Continuous Integration (CI) tests and linters pass before submitting the PR.

DeploymentMethods:
  - EnvironmentSeparation:
    * Deploy changes first to development and staging environments before production rollout.
    * Utilize feature flags to gradually introduce new functionality.
  - RollbackPlan:
    * Maintain clear rollback procedures in case deployment issues occur.
  - ContinuousIntegration:
    * Integrate automated testing and deployment pipelines (CI) for consistency and speed.
  - ScheduledReleases:
    * Plan deployments to minimize user impact, coordinating disruptive changes into planned release windows.

MergeStrategy:
  - SquashMerges:
    * Prefer squash merging to keep the main branch history clean and focused.
  - RebaseBeforeMerge:
    * Always rebase feature branches on the latest main branch before merging.

ReleaseManagement:
  - VersionTagging:
    * Tag releases using semantic versioning for clear traceability.
  - Documentation:
    * Update release notes and any related documentation with each merge into the main branch.
  - PostReleaseReview:
    * Conduct a review after each release to identify improvements and document any issues encountered.

CodeReview:
  - QualityStandards:
    * Adhere to established coding standards and best practices throughout the review.
  - AutomatedLinting:
    * Integrate and enforce automated linters and code formatters to catch style issues early.
  - FeedbackCycle:
    * Provide prompt and actionable feedback; address review comments before final merging.

FeatureFlags:
  - UsageGuidelines:
    * Implement feature flags for experimental or high-risk changes.
    * Ensure that feature flags can be quickly toggled off in case of issues.
    * Document all active feature flags within the project documentation.
