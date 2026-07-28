# Единый orchestration и design harness

## Назначение

Harness удерживает все работы в `codex/all-blocks-changes`, не даёт агентам молча менять порядок и источники Figma, сериализует тяжёлые проверки и создаёт воспроизводимый отчёт для каждого handoff.

Главная дизайн-точка истины: Figma `1767:6575`. В коде остаются ровно 13 видимых секций в утверждённом порядке. `1767:7498` не становится отдельной секцией. Проект сохраняет одну светлую тему, брендовые `#FF5100` и `#2D2A26`, дials `8 / 8 / 4`, WCAG 2.2 AA, native page scroll и degraded paths для reduced motion, no-JS, no-WebGL, Save-Data и media failure.

## Роли и file leases

- Integration owner владеет общей веткой и shared-файлами.
- Block agent получает один блок, Figma node, список разрешённых файлов и baseline SHA.
- Validator не редактирует код и не обновляет snapshots.
- Одновременно можно менять разные component-local/data/test/assets файлы.
- `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/data/home-content.ts`, configs, lockfiles, CI, общие E2E и QA-документы меняются только последовательно integration owner.

Если status показывает пересечение, агент останавливается и передаёт diff интегратору. Запрещено обходить конфликт новой веткой.

## Команды

```powershell
npm.cmd run harness:scope
npm.cmd run harness:preflight
npm.cmd run harness:block -- --block=statistics
npm.cmd run harness:changed
npm.cmd run harness:quick
npm.cmd run harness:functional
npm.cmd run harness:visual
npm.cmd run harness:release
```

`harness:scope` классифицирует dirty tree. Shared CSS/layout/config/dependency изменения всегда повышают scope до полного release harness. `harness:block` проверяет формат, lint, unit, typecheck и три browser-профиля назначенного блока. `harness:changed` сам выбирает block или full. Отчёт сохраняется в `.artifacts/harness/latest.json`.

Baseline обновляется только отдельной осознанной командой после просмотра diff:

```powershell
npx.cmd playwright test --grep "@visual" --update-snapshots --workers=1
```

## Gate-уровни

1. Preflight: точная ветка, `git diff --check`, Figma order/node IDs, hidden documents, design dials, light theme, R01-R17, viewports, reduced-motion и print contracts.
2. Block: targeted format/lint/unit/typecheck и desktop/mobile/reduced-motion E2E.
3. Functional: production build, все не-визуальные browser tests, axe, keyboard, touch, resilience, media и requirements.
4. Visual: Windows snapshots для full page и header states. Linux functional job исключает все `@visual`.
5. Release: functional плюс visual. Результат не является release approval, пока `manual-gates.json` содержит `pending` или `blocked`.

Harness использует `.artifacts/harness/.lock`. Удалять живой lock или запускать параллельные build/Playwright процессы в одном worktree нельзя.

Production harness требует собственный `node_modules` внутри канонического worktree. Junction или symlink на зависимости другого checkout блокируется заранее, потому что Next/Turbopack не собирает проект с зависимостями за пределами filesystem root.

## Единый интерактивный preview

Общий preview проекта всегда доступен по `http://localhost:3001` и обслуживает только worktree `codex/all-blocks-changes`. `npm.cmd run dev` уже включает `--webpack --hostname localhost --port 3001`.

Агенты не запускают собственные dev-серверы и не используют порт 3000. Они редактируют канонический worktree, а работающий Next.js dev-server подхватывает изменения через Fast Refresh без ручного перезапуска. Playwright использует изолированный тестовый сервер и не подключается к общему preview.

## Design contract

`.tools/harness/config.mjs` является машинно-читаемым manifest:

- Figma root и node для каждой секции;
- утверждённый порядок и hidden section;
- фиксированные design dials, theme и brand colors;
- восемь viewport/motion profiles;
- обязательные E2E suites;
- block-to-files/unit/E2E mapping.

`.tools/harness/design-contract.mjs` проверяет manifest против `app/page.tsx`, design docs, traceability, Playwright config и R01-R17. Новый visible block, смена node ID, потеря viewport или fallback-контракта должны завершать preflight ошибкой.

## Handoff-контракт

Каждый агент передаёт:

1. block и Figma node;
2. baseline SHA и branch;
3. разрешённый scope и фактически изменённые файлы;
4. `git diff --name-status` и `git diff --check`;
5. выполненную harness-команду и путь отчёта;
6. browser profiles, skips/retries и visual diff status;
7. source gaps, manual gates и непройденные проверки;
8. подтверждение, что commit/push/PR/merge не выполнялись без отдельного разрешения.

Старый зелёный отчёт нельзя переносить на новый SHA или dirty tree.

## Текущие release-блокеры

На 2026-07-27 visual baselines старше интеграционного HEAD и незакоммиченного statistics/layout/CSS pass. Последняя median LCP равна 2666 мс при бюджете ниже 2500 мс. Также не закрыты R08/R16 source gaps, NVDA, 200% reflow, real-device touch, asset rights/live links и field CWV. Их состояние хранится в `docs/qa/manual-gates.json`.
