# Shared integration branch

- Treat `codex/all-blocks-changes` as the single integration branch for this project.
- Do not create, switch to, or commit work on another branch unless the user explicitly asks.
- Before editing, run `git status --short --branch` and inspect any uncommitted changes that overlap the files you need.
- Before handing work off, run a conflict check against the current branch state (`git diff --check` at minimum) and resolve any overlap with changes from other blocks.
- Preserve unrelated untracked files, caches, logs, and user artifacts; never stage them unless the user explicitly asks.
- Keep the interactive local preview running through the project dev-server command when the user asks to review the site.
