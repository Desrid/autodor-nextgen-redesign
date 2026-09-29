# Apply status — 2026-09-28

Change: align-four-pages-with-figma. Первый этап главной применён; change не завершён и не архивирован.

## Scope

Пользователь исключил ЛК и попросил начать с главной. /account, AccountDashboard, AccountHeader и стили кабинета не изменяются. /about и /road-users остаются последующими этапами. Точная мобильная композиция главной и общая приёмка ещё открыты.

## Verified state

- Canonical branch: codex/all-blocks-changes, HEAD d95fb8f8930db2b213d08537d393b3120e512a3f, behind 4. Pull, switch, commit и deployment не выполнялись.
- Integration owner сохраняет согласованный baseline Sites v3. Точные файлы текущей UI-правки: app/page.tsx, app/home-figma.css, public/media/figma/home-road-background.png. Документы: только openspec/changes/align-four-pages-with-figma.
- В app/page.tsx добавлены только классы ограничения CSS и импорт. globals.css и компоненты других страниц сохранены.
- Ранее изменённый next-env.d.ts и все preview-логи сохранены, ничего не staged.
- harness:preflight PASS; 13 sections, 8 viewport profiles, R01-R17.
- Desktop-геометрия главной измерена из Figma и применена: контейнер 1464 px, секции 64 px, заголовки 64/72. Позиции заголовков и футера совпадают с извлечённым источником при 1920 px.
- Root overflow отсутствует на 375, 390, 768, 1440, 1920 px.
- npm run build PASS; preview http://localhost:3001 отвечает 200 и оставлен запущенным.

## Source

Official Figma MCP по-прежнему ограничен квотой View seat. Пользователь разрешил Desrid HTML to Figma. Bridge localhost:3055, канал i4qkxbug подключён. Через штатный read-протокол моста получены полное дерево и изображения главной, включая мобильный фрейм. В Figma ничего не изменено.

Desktop: 251:12155 → 27:10811 → 146:7412; 1920×8612. Mobile: 612:36023 → 617:76216; 375×13918. Детали измерений, ассеты, ограничения и проверки: home-fidelity.md. Доказательства: .artifacts/figma/align-home-20260928.

## Checks and remaining work

- harness:changed остановился на формате ранее изменённого next-env.d.ts; unrelated dirty-файл не исправлялся. Отчёт .artifacts/harness/latest.json.
- Full lint FAIL (включает dist и предупреждения существующего кода); eslint app/page.tsx --quiet PASS на ошибки.
- Unit: 90 PASS / 2 FAIL в неизменённых контрактах абсолютных URL. Typecheck: FAIL в неизменённом LoyaltyRail.client.test.tsx:50.
- Полный functional E2E остановлен после выявления старых ожиданий и проблем доступности. Полный PASS не заявляется.
- Целевые hero/media/services: 33 PASS, 14 SKIP, 1 FAIL — проверка ожидает прежний насыщенный hover-цвет, действующий UI использует мягкий оттенок; геометрические проверки этого сценария прошли.
- Windows @visual: 16 FAIL из 16. Header отличается от прежних эталонов; homepage tests получают таймаут на прокрутке img до сравнения снимка. Baseline не обновлён. Итоговый снимок сохранён отдельно: home-final.png.
- Source binding старого design contract, точная mobile fidelity, accessibility/manual gates, новые визуальные эталоны и последующие страницы остаются открытыми.

- Проверка взаимодействий браузером PASS: loyalty scroll, contacts click/ArrowDown, gallery open/Escape, future active-year 2027 → 2026. Итог .artifacts/figma/align-home-20260928/interaction-checks.json.

## Корректировка по замечаниям пользователя

Медиагалерея и футер возвращены к прежним стилям production Sites v3: удалены их переопределения в home-figma.css и специальный класс футера. Геометрия нижних секций из прежнего отчёта home-fidelity.md после этого возврата больше не является актуальной.
Лента лояльности обрезается по боковым границам контейнера, сохраняя пространство теней сверху/снизу. Проверены 768, 1440, 1920 px: до перелистывания, после перехода вперёд и назад видны только полные 2/3 карточки (погрешность округления менее 1 px), без фрагментов соседних карточек.
В браузере стили media/footer совпадают с исходными при отключении класса home-figma. Доказательства: revision-checks.json, loyalty-*-start/next.png, gallery-restored.png, footer-restored.png в .artifacts/figma/align-home-20260928.
Lease: app/page.tsx, app/home-figma.css и этот apply-status.md; одобренный baseline production Sites v3 сохранён. Account и unrelated next-env.d.ts не изменялись в этой корректировке.

## Update 2026-09-28

Applied source assets and scoped public visual corrections to the canonical branch. Full implementation/acceptance is incomplete pending shared-preview startup approval and browser comparison; see fidelity-audit.md. No preview process was stopped or restarted.

## UI-kit follow-up — 2026-09-28

This update supersedes the older runtime and validation status above. Public routes /, /about and /road-users were compared again against concept page 27:10810 and UI-kit page 1:32 using official Figma MCP design contexts and screenshots. Account remains excluded from implementation under the previous scope; a clarification about including it is pending.

- All six service illustrations now use original individual PNG/SVG layers and CSS composition for default and hover states: route 461:43853/461:43854, app 485:46913/485:46811, MAX 491:48140/491:48045, legal 506:48929/506:48906, store 514:31913/514:31874, plate 514:32450/514:32420. Component screenshots are not used as page assets. Expanded desktop cards measure 720px with two 348px siblings. Links, touch disclosure and keyboard behavior are preserved.
- Corrected loyalty default/hover surfaces, badges, typography, illustration scale and arrow default/hover/pressed/disabled styles; corrected news reveal geometry and typography, header navigation/utility states, and contact tab default/hover/selected states.
- Corrected media content height, footer geometry/typography and the extra 8px margin on the about page. At 1920px, measured full page heights are home 8612, about 7538 and road-users 4006, matching the source frames. Matching page height alone does not establish pixel-level fidelity.
- Removed a redundant manual hero preload that caused a hydration mismatch with Next Image's generated preload.
- Updated existing HeaderNav tests to await animated focus restoration and NewsGrid tests to use its actual labelled region role. All 23 unit test files and 99 tests pass; typecheck passes. Full lint still fails on existing generated dist files and existing warnings; the changed component files are checked separately.
- Browser evidence: .artifacts/figma-alignment/kit-verified (six default/hover pairs, loyalty/news states, keyboard contact/menu checks, touch disclosure), after (full desktop pages), and responsive (viewport matrix). Source contexts and 42 original UI-kit asset layers are retained in the same staging directory. No Git commit, publication or visual baseline update was performed. The shared preview remains running at http://localhost:3001.
- Existing mobile account overflow is recorded without changing excluded account code. Exact interactive-map fidelity, full snapshot/manual accessibility acceptance and exhaustive parity of every UI-kit variant remain open. This change is not archived or represented as fully accepted.

Tablet follow-up: constrained the about structure diagram to its container and reduced the loyalty heading at 768-1023px. Both previously observed public-route overflows at 768px are fixed. Final diff check passes. Scoped component ESLint passes. Full harness still stops only on pre-existing next-env.d.ts formatting.

## Services rollback requested by user

The Services block is restored from origin/codex/all-blocks-changes, including original artwork, card styles, row order, heading and local section geometry. Figma overrides for service cards and their heading are removed. Other public-route changes remain. The unused new illustration component/assets are retained as unstaged artifacts.
