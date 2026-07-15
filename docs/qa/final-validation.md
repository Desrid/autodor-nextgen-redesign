# Независимая финальная валидация

Дата и время: **2026-07-15 18:39 MSK (UTC+03:00)**  
Проверяемый commit: **`9cc6fd08f8f66e757b0cc6c99b43a21c43b5158c`**  
Ветка: **`codex/foundation-source-audit`**  
Draft PR: **https://github.com/Desrid/autodor-nextgen-redesign/pull/1**

## Решение

**BLOCKED — merge в `main`, release-candidate и production release запрещены.**

Статические проверки и основная функциональная трассировка сильны, но обязательные release gates не закрыты: воспроизводятся две серьёзные WCAG-ошибки axe, LCP выше бюджета, два требования остаются в статусе `SOURCE-GAP`, отсутствует обязательная ручная приемка NVDA/200% zoom/реального мобильного устройства, контакты ДЗО неполны, а browser CI на момент проверки не завершён. Текущие QA-документы содержат устаревшие green-утверждения, противоречащие независимому production-прогону.

## Методика и среда

- Проверен только текущий checkout и опубликованный SHA; старые репозитории и предыдущие концепции не читались.
- Remote, ветка, HEAD и рабочее дерево проверены командами `git remote -v`, `git branch --show-current`, `git rev-parse HEAD`, `git status --short`.
- Структура проверена сопоставлением `docs/source-audit/figma-structure.md`, `docs/requirements/traceability-matrix.md`, server-rendered `app/page.tsx`, data contracts и production E2E.
- Выполнены `npm.cmd run format`, `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`.
- Выполнен production Playwright-контроль requirements/accessibility/resilience/media на `desktop-1440`, `mobile-390`, `mobile-390-reduced-motion` с `CI=true`, одним worker и текущим production build.
- Выполнены `npm.cmd audit --omit=dev` и полный `npm.cmd audit` с live-доступом к npm registry.
- Lighthouse-метрики независимо извлечены из трёх committed JSON `docs/qa/lighthouse/mobile-preload-1..3.json`.
- Выполнен поиск production `TODO`, `FIXME`, `HACK`, `lorem ipsum`, placeholder-контента и типовых сигнатур секретов. Упоминания placeholders в source-аудите Figma являются доказательством того, что макетные тексты не приняты за факты, а не production placeholders.
- GitHub API без авторизации вернул `404` для приватного check-runs endpoint. На момент фиксации отчета оркестратор подтвердил `quality = green`, `browser = running`; browser check не считается пройденным до фактического green.

Первый локальный non-CI прогон использовал `next dev` и дал cross-origin HMR-шум; его результат не использован как acceptance evidence. Решение основано на повторном production-прогоне с `CI=true` и `next start`.

## Gate-by-gate проверка

| Gate                                          | Статус                          | Проверяемое доказательство                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remote и критическая изоляция                 | PASS                            | Единственный remote: `origin https://github.com/Desrid/autodor-nextgen-redesign.git`; HEAD равен проверяемому SHA; ветка `codex/foundation-source-audit`; до создания этого отчета worktree был чистым.                                                                                                                                       |
| Figma hierarchy и node-id traceability        | PASS                            | Аудит фиксирует `1767:4852 → 1767:6571 → 1767:6575`, 2724 узла, 188 text layers, 21 hidden state; секции и содержательные узлы имеют node-id. Сохранен `docs/source-audit/screenshots/figma-1767-6575.png`.                                                                                                                                   |
| Видимый порядок Figma                         | PASS                            | Production E2E `R01-R14: preserves the approved visible section order` прошел на трех контрольных профилях. DOM: header `1767:6576`, roads `7102`, services `7168`, loyalty `7270`, news `7305`, important `7328`, media `7339`, contacts `7368`, statistics `7415`, subsidiary services `7456`, social `7501`, future `7508`, footer `7539`. |
| Hidden documents                              | PASS                            | `1767:7498` не выводится отдельной секцией; ссылка «Документы» сохранена в «Ещё» и mobile menu; production E2E прошел.                                                                                                                                                                                                                        |
| 17 строк Google Sheets                        | **BLOCKED**                     | Матрица содержит ровно 17 строк, но R08 имеет `IMPLEMENTED / SOURCE-GAP`, R16 — `SOURCE-GAP / LOCAL PASS`. Следовательно статус всех 17 требований не green.                                                                                                                                                                                  |
| 10 references / 7+ domains                    | PASS                            | Ровно 10 numbered entries, 10 URL на 10 уникальных доменах, 20 screenshot-файлов: desktop+mobile для `01..10`; категории дорог, инфраструктуры, карт, geospatial и editorial покрыты. Lazyweb backend честно отмечен недоступным, вымышленного отчета нет.                                                                                    |
| Brandbook extraction                          | PASS WITH RELEASE RISK          | 10 страниц извлечены и визуально проверены; точные цвета, шрифты, clear space, 40 мм, фоны и запреты задокументированы. Документ относится к «Автодор — Платные Дороги» и не содержит орден/digital rules. OQ-001 требует production-одобрения Figma exports или официального master-asset; это остается незакрытым identity/rights риском.   |
| Факты, ссылки, отсутствие выдуманных значений | **BLOCKED**                     | R09 и R13 имеют явные официальные источники и unit contracts: публикации `136321`, `141463` и проспект, стр. 36. Однако R08 не содержит обязательные phone+email для всех ДЗО: четыре вкладки имеют `phone=null`, шесть — `email=null`, часть ссылок ведет на общий реестр. Финальный live external-link audit перед release не выполнен.     |
| R09 official evidence                         | PASS                            | UI ограничивает scope тарифами I–IV конкретного участка М-12 Исаметово — Асяново; значения 325/456/586/846 ₽ проверяются `statistics.test.ts`; две source links видимы.                                                                                                                                                                       |
| R13 official evidence                         | PASS WITH LIMIT                 | Ровно три названия и общий ориентир «К 2030 году» привязаны к официальному проспекту, стр. 36; geometry не выдается за факт, static Figma map помечена презентационной.                                                                                                                                                                       |
| Media registry, prompts, formats              | PASS WITH RELEASE RISK          | Реестр содержит purpose/source-rights/prompt/source size/formats/crops/poster/alt/optimization; 4 masters, 48 AVIF/WebP derivatives, 9 WebM+9 MP4 loops, checksums и reproduction scripts. Final publication rights review в самом реестре помечен незавершенным.                                                                             |
| Git LFS                                       | PASS                            | `.gitattributes` покрывает source PNG, MP4/WebM и крупные форматы; `git lfs ls-files` показывает 4 source PNG и 18 video-файлов как LFS objects.                                                                                                                                                                                              |
| Video/WebGL/data-saver fallbacks              | PASS                            | WebM→MP4, poster, pause, muted/playsinline, deferred activation, reduced-motion и Save-Data реализованы. Production media/resilience tests, no-JS и no-WebGL checks прошли на трех контрольных профилях.                                                                                                                                      |
| Два car preview state                         | PASS WITH SOURCE GAP            | `/?car=on` и `/?car=off` проходят production E2E; pointer статичен и не custom cursor. В Figma `1767:6575` отдельный node для машинки не найден, поэтому R16 закономерно остается source-gap.                                                                                                                                                 |
| TODO/lorem/production placeholders/secrets    | PASS                            | В production code не найдено TODO/FIXME/HACK/lorem/placeholder UI; типовые токены/ключи/private keys не найдены. Сгенерированное media явно маркируется как недокументальное, а макетные placeholders не публикуются как факты.                                                                                                               |
| Responsive / touch / overflow                 | **BLOCKED**                     | Автотесты 1920→320 и baselines присутствуют; контрольные overflow, 44 px targets и touch-without-hover прошли. Обязательный реальный mobile touch/zoom/gesture pass не выполнен.                                                                                                                                                              |
| Accessibility WCAG 2.2 AA                     | **BLOCKED**                     | Независимый axe production-прогон стабильно выявил 2 serious violations на desktop/mobile/reduced-motion: color contrast и nested interactive. NVDA, 200% zoom/reflow и ручная focus/contrast приемка также не выполнены.                                                                                                                     |
| Reduced motion / keyboard / no hover-only     | PASS AUTOMATED / MANUAL PENDING | Road tabs, contact tabs, chat, back-to-top, services details, reduced-motion и Save-Data contracts прошли в production E2E; полный NVDA/keyboard-only ручной протокол не закрыт.                                                                                                                                                              |
| Format/lint/typecheck/unit/build              | PASS                            | Независимо: Prettier pass; ESLint pass; TypeScript pass; Vitest **5 files / 19 tests pass**; Next 16.2.10 production build pass, 5 routes generated.                                                                                                                                                                                          |
| QA artifacts и достоверность отчетов          | **BLOCKED**                     | Lighthouse JSON и 8 visual baselines committed. Но `test-matrix.md` и `accessibility.md` утверждают axe green, что опровергнуто текущим production-прогоном. Они также фиксируют устаревшие **4 files / 16 tests**, тогда как текущий набор — **5 / 19**.                                                                                     |
| Lighthouse / Core Web Vitals                  | **BLOCKED**                     | Committed final trio: Perf 97/97/97, A11y 100/100/100, BP 100/100/100, SEO 100/100/100; LCP 2666/2668/2659 ms, median **2666 ms**. Обязательный бюджет `<2500 ms` нарушен на 166 ms. INP field data отсутствует без deployment.                                                                                                               |
| npm dependency audit                          | PASS                            | Live `npm audit --omit=dev`: 0 vulnerabilities; полный `npm audit`: 0 vulnerabilities.                                                                                                                                                                                                                                                        |
| CI                                            | **BLOCKED / PENDING**           | Workflow содержит checkout LFS, Node 24, install, format/lint/test/build/typecheck и полный Chromium E2E. Quality job сообщен green; browser job на момент отчета running. С учетом воспроизводимых axe failures browser gate не может считаться принятым до green нового SHA.                                                                |
| Deployment / preview / field evidence         | **BLOCKED**                     | Preview URL не предоставлен; deployment-based field CWV, INP и production link verification отсутствуют.                                                                                                                                                                                                                                      |

## Воспроизводимые accessibility blockers

### A11Y-01 — контраст deadline badge

- Axe rule: `color-contrast`, impact `serious`, WCAG 1.4.3.
- Элементы: три `<time datetime="2030">К 2030 году</time>` в `1767:7511`, `1767:7513`, `1767:7515`.
- CSS: `app/globals.css`, `.future-projects time`: `#2D2A26` на `#FF5100`.
- Измерено axe: **4.37:1**, требуется **4.5:1** для 16 px текста.
- Доказательство: `test-results/accessibility-has-no-autom-46105-ctable-WCAG-A-AA-violations-*/error-context.md` и traces текущего прогона.
- Исправление: сменить foreground/background в рамках semantic tokens или увеличить подтвержденный visual size/weight так, чтобы axe и ручной contrast audit прошли; затем переснять visual baselines.

### A11Y-02 — интерактивные кнопки внутри `role="img"`

- Axe rule: `nested-interactive`, impact `serious`, WCAG 4.1.2.
- Элемент: `.tariff-chart[role="img"]` содержит четыре focusable tooltip buttons.
- Код: `app/page.tsx`, контейнер диаграммы около строки 257 и buttons около строки 275.
- Причина: `role="img"` семантически сворачивает descendants, поэтому вложенные кнопки могут не объявляться и создавать проблемы фокуса.
- Исправление: убрать `role="img"` с интерактивного контейнера; дать диаграмме обычную group/region semantics с отдельным description, оставив каждую кнопку доступной, а таблицу — полноценным текстовым эквивалентом.

Обе ошибки воспроизводятся на `desktop-1440`, `mobile-390` и `mobile-390-reduced-motion`; retries 1/2 их не устраняют. Остальные requirements/media/resilience checks в этом production-наборе прошли или были ожидаемо project-scoped skipped.

## Actionable blockers до повторной приемки

1. Исправить A11Y-01 и A11Y-02; запустить полный production Playwright matrix и обновить QA-отчеты только по фактическому exit 0.
2. Достичь median mobile LCP `<2500 ms` в трех новых production Lighthouse runs при сохранении Perf ≥90, BP/SEO ≥95 и A11y без известных A/AA нарушений.
3. Закрыть R08 официальным реестром phone/email/link для каждой требуемой организации либо получить формальное business approval на честный неполный state; обновить traceability status.
4. Закрыть R16 node-id/source decision по машинке в Figma/Sheet и заменить `SOURCE-GAP` на проверяемое решение владельца продукта.
5. Провести и приложить NVDA+Chromium, 200% zoom/reflow, полный keyboard-only и реальный mobile touch/zoom/gesture pass.
6. Получить письменное production-одобрение Figma logo/order assets и финальную legal/rights приемку AI-generated media.
7. Выполнить финальный live link audit, настроить preview deployment и собрать field CWV/INP либо явно согласовать отдельный post-deploy gate.
8. Дождаться green browser CI на новом SHA; убрать противоречивые/устаревшие QA-числа и приложить фактические CI artifacts.

## Финальный вердикт Hard Validator

**BLOCKED.** Текущий SHA не разрешено merge’ить в `main` и нельзя объявлять release candidate. Повторная независимая приемка допустима только после закрытия всех восьми блоков выше с проверяемыми evidence и новым опубликованным commit SHA.
