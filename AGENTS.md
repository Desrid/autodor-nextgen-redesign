# Shared integration branch

- Treat `codex/all-blocks-changes` as the single integration branch for this project.
- Do not create, switch to, or commit work on another branch unless the user explicitly asks.
- Before editing, run `git status --short --branch` and inspect any uncommitted changes that overlap the files you need.
- Before handing work off, run a conflict check against the current branch state (`git diff --check` at minimum) and resolve any overlap with changes from other blocks.
- Preserve unrelated untracked files, caches, logs, and user artifacts; never stage them unless the user explicitly asks.
- Keep the interactive local preview running through the project dev-server command when the user asks to review the site.
- The single shared interactive preview is `http://localhost:3001` and must serve the `codex/all-blocks-changes` worktree. Agents edit that worktree and rely on Fast Refresh; they must not start per-agent preview servers or use port 3000.

# Sole approved design baseline

- The only approved working UI is the pre-statistics design from commit `47061b889049672d30e7edda67b383cea20bb46a` (`Improve header navigation and search`), restored in this worktree.
- Treat the current `codex/all-blocks-changes` working tree as authoritative even when Git shows intentional differences from branch HEAD `00997f6`.
- The deletion of `app/components/StatisticsBlock.tsx` and `app/components/StatisticsBlock.test.tsx`, plus the rollback of the statistics data, page, CSS, tests, and documentation, is intentional. Do not restore these files from branch HEAD.
- Do not import or copy UI files from `codex/foundation-source-audit`, another worktree, an unreachable Git tree, a backup, or an agent-local branch.
- Do not reintroduce the verified-Sheets statistics redesign or create an alternative statistics implementation unless the user explicitly requests it after this baseline was established.
- All agents must edit this same worktree and see their changes through `http://localhost:3001`. A task that cannot be completed without another branch, worktree, preview port, or dev-server process must stop and escalate to the integration owner.
- Only the integration owner may change this baseline. Before editing shared UI, agents must acknowledge this section in their handoff and name the exact leased files.

# Orchestration harness

- The integration owner is the only agent allowed to edit shared files: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/data/home-content.ts`, shared configs, lockfiles, CI, shared E2E suites, and QA/traceability documents.
- Give every parallel agent an explicit file lease. If `git status --short --branch` shows an overlapping path, stop and hand the conflict to the integration owner.
- Run `npm.cmd run harness:preflight` before editing. It must confirm `codex/all-blocks-changes`, a clean `git diff --check`, the approved Figma section order, node IDs, R01-R17 coverage, viewport matrix, light-theme lock, and reduced-motion/print contracts.
- Before a block handoff, run `npm.cmd run harness:block -- --block=<name>`. Supported names are printed by the command. A change to a shared file escalates to `npm.cmd run harness:changed`.
- Harness runs are serialized with `.artifacts/harness/.lock`. Never delete a live lock or run a second build/Playwright job against the same worktree.
- Visual tests are tagged `@visual`; functional browser runs must exclude them, and Windows visual runs must include all of them.
- Harness evidence is written to ignored `.artifacts/harness/latest.json`. Record the baseline SHA, dirty file list, commands, failures, skipped manual gates, and the Figma node in every handoff.
- Do not reuse an old green report after the branch, dirty tree, design contract, assets, CSS, layout, or content changed. Updating screenshot baselines always requires human review and an explicit update command.
- `npm` is the canonical package manager. Do not change `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package-lock.json`, or `next-env.d.ts` as incidental tool churn.
- Release stays blocked while any entry in `docs/qa/manual-gates.json` is `pending` or `blocked`; CI green is necessary but not sufficient for release.
