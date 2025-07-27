---
description: Shell Command Guardrails
applyTo: "**"
---

* Use only the vscode tasks of this project to run, build and test the application.

* Avoid using `npm`, `npx`, `pnpm`, `ng` and other direct commands and try to use the provided vscode tasks instead.

* Avoid using commands like `cd /path/to/project/` since we are already in the project directory.

* Avoid using commands like `mv`, `rm`, `cp`, or any other commands that modify the filesystem directly, as these can lead to unintended consequences in the project structure. Alternatively, use `git` commands to manage files and directories, such as `git mv`, `git rm`, or `git add`.

* Avoid using commands that would require permissions or interactions from the user.

* Avoid creating files with similar names to the one editing, just update itself instead. Backups are not necessary because of the Git system.

* After changes are done, make sure to start the app via `npm: build` task from the tasks.json or package.json file to test if it compiles correctly.

* Always create new files/folders under the appropriate directory instead of placing them in the root.
