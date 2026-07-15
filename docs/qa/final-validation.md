# Независимая финальная валидация

- Дата и время повторной приемки: **2026-07-15 18:48 MSK (UTC+03:00)**
- Проверяемый commit: **`4406decadb265a31792d6b03872318b8b5b5f3e1`**
- Ветка: **`codex/foundation-source-audit`**
- Draft PR: **https://github.com/Desrid/autodor-nextgen-redesign/pull/1**

## Решение

**BLOCKED — merge в `main`, release-candidate и production release запрещены.**

Два accessibility-дефекта предыдущей приемки исправлены и независимо закрыты: production axe чист на desktop, mobile и reduced-motion. Однако обязательные release gates по-прежнему не выполнены: median LCP выше бюджета, R08 и R16 имеют `SOURCE-GAP`, отсутствуют NVDA/200% zoom/реальное мобильное тестирование, не закрыты production rights, preview/field CWV и финальный live-link audit. Accessibility-исправления не дают права снять эти внешние блокеры.

## Что перепроверено в новом SHA

- Diff `9cc6fd0..4406dec`: только accessibility CSS/semantics и согласование QA/traceability документов; структура страницы, факты, media и data contracts не менялись.
- `.future-projects time` теперь имеет светлый `var(--color-page)` фон и фирменную оранжевую рамку вместо текста `#2D2A26` на сплошном `#FF5100`.
- `.tariff-chart` теперь использует `role="group"` вместо `role="img"`; четыре tooltip buttons остаются самостоятельными focusable controls.
- Независимый `npm.cmd run build`: PASS, Next.js 16.2.10 production compilation и 5 routes generated.
- Независимый production Playwright:
  `e2e/accessibility.spec.ts` на `desktop-1440`, `mobile-390`, `mobile-390-reduced-motion` — **17 passed, 1 ожидаемый desktop touch-only skip, exit 0**.
- В каждом из трех профилей тест `has no automatically detectable WCAG A/AA violations` прошел без retries; `color-contrast` и `nested-interactive` больше не воспроизводятся.
- QA counts исправлены: `docs/qa/test-matrix.md` теперь фиксирует **5 файлов / 19 Vitest tests**, а также отдельный post-validator accessibility pass 17/1/0.
- `docs/qa/accessibility.md` больше не противоречит фактическому состоянию: fixes и повторный production pass зафиксированы отдельно; manual validation по-прежнему честно pending.

Production server для независимого контроля был поднят локально на `127.0.0.1:3100`; Playwright использовал `PLAYWRIGHT_BASE_URL` и один CI worker. После прогона сервер остановлен. Worktree до обновления этого отчета был чистым.

## Gate-by-gate проверка

| Gate                                       | Статус                                  | Проверяемое доказательство                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remote и критическая изоляция              | PASS                                    | Единственный remote — `origin https://github.com/Desrid/autodor-nextgen-redesign.git`; ветка `codex/foundation-source-audit`; HEAD точно равен `4406decadb265a31792d6b03872318b8b5b5f3e1`.                                                                                                                                                                                             |
| Figma hierarchy и node-id traceability     | PASS                                    | Сохранена цепочка `1767:4852 → 1767:6571 → 1767:6575`, полный аудит 2724 узлов/188 text/21 hidden и screenshot `docs/source-audit/screenshots/figma-1767-6575.png`. Новый diff структуру не меняет.                                                                                                                                                                                    |
| Видимый порядок Figma                      | PASS                                    | DOM-порядок и ранее прошедший R01-R14 остаются неизменными: header `6576`, roads `7102`, services `7168`, loyalty `7270`, news `7305`, important `7328`, media `7339`, contacts `7368`, statistics `7415`, subsidiary services `7456`, social `7501`, future `7508`, footer `7539`.                                                                                                    |
| Hidden documents                           | PASS                                    | `1767:7498` не является visible section; «Документы» доступны через меню.                                                                                                                                                                                                                                                                                                              |
| 17 строк Google Sheets                     | **BLOCKED**                             | Матрица содержит ровно 17 строк, но R08 остается `IMPLEMENTED / SOURCE-GAP`, R16 — `SOURCE-GAP / LOCAL PASS`. Все 17 требований не имеют полного green status.                                                                                                                                                                                                                         |
| 10 references / 7+ domains                 | PASS                                    | Ровно 10 записей, 10 уникальных доменов, 20 desktop/mobile screenshots; пять требуемых тематических пар покрыты.                                                                                                                                                                                                                                                                       |
| Brandbook extraction                       | PASS WITH RELEASE RISK                  | 10 страниц разобраны; цвета, шрифты, clear space, 40 мм, фон/контраст и запреты извлечены. PDF не содержит орден и digital rules; OQ-001 требует production-одобрения Figma exports или официального master-asset.                                                                                                                                                                     |
| Факты и ссылки                             | **BLOCKED**                             | R09/R13 подкреплены официальными источниками и unit contracts. Но R08 не имеет обязательных phone+email для всех ДЗО: четыре `phone=null`, шесть `email=null`, часть ссылок ведет на общий реестр. Финальный live external-link audit не выполнен.                                                                                                                                     |
| R09 official evidence                      | PASS                                    | Scope ограничен тарифами конкретного участка М-12 Исаметово — Асяново; 325/456/586/846 ₽ и источники `136321`/`141463` сохранены.                                                                                                                                                                                                                                                      |
| R13 official evidence                      | PASS WITH LIMIT                         | Три названия и общий ориентир «К 2030 году» привязаны к официальному проспекту, стр. 36; geometry честно недоступна, карта — static presentation fallback.                                                                                                                                                                                                                             |
| Media registry, prompts, LFS, fallbacks    | PASS WITH RELEASE RISK                  | 4 generated masters, 48 AVIF/WebP derivatives, 9 WebM+9 MP4, prompts/checksums/posters/alts; source PNG и videos в Git LFS. WebM→MP4, poster, pause, Save-Data, reduced-motion, no-JS/no-WebGL fallbacks сохранены. Final publication rights review остается незавершенным.                                                                                                            |
| Два car preview state                      | PASS WITH SOURCE GAP                    | `?car=on/off` реализованы и протестированы; pointer статичен. Отдельный Figma node для машинки не найден, поэтому R16 остается source-gap.                                                                                                                                                                                                                                             |
| TODO/lorem/production placeholders/secrets | PASS                                    | Production TODO/FIXME/HACK/lorem/placeholder UI и типовые token/private-key signatures не найдены в первом validator pass; новый diff их не добавляет.                                                                                                                                                                                                                                 |
| Responsive / touch / overflow              | **BLOCKED**                             | Automated viewport matrix и visual baselines существуют; независимый post-fix pass подтвердил overflow и 44 px targets на mobile. Обязательный real-device touch/zoom/gesture pass не выполнен.                                                                                                                                                                                        |
| Axe WCAG A/AA                              | PASS                                    | Новый SHA: 3/3 профиля без автоматически обнаруживаемых нарушений. A11Y-01 color contrast и A11Y-02 nested interactive закрыты независимо.                                                                                                                                                                                                                                             |
| WCAG 2.2 AA overall                        | **BLOCKED / MANUAL PENDING**            | Axe green не заменяет NVDA+Chromium, 200% zoom/reflow, real-device touch, ручную проверку contrast/focus и meaningful reading order; они не выполнены.                                                                                                                                                                                                                                 |
| Reduced motion / keyboard / no hover-only  | PASS AUTOMATED / MANUAL PENDING         | Accessibility suite green на reduced-motion; focus names, landmarks, skip link, overflow и image alternatives прошли. Полный ручной keyboard/SR protocol не закрыт.                                                                                                                                                                                                                    |
| Format/lint/typecheck/unit/build           | PASS                                    | Root evidence: format/lint/typecheck green, Vitest **5 файлов / 19 tests** green. Hard Validator независимо повторил production build green и post-fix accessibility suite exit 0.                                                                                                                                                                                                     |
| QA artifacts и достоверность отчетов       | PASS FOR CURRENT FIX / HISTORICAL LIMIT | Устаревшие 4/16 и прежний axe-green conflict исправлены: текущие документы явно разделяют исходную матрицу, post-patch набор и независимый 17/1/0 pass. Старые локальные traces не являются release evidence для нового SHA.                                                                                                                                                           |
| Lighthouse / Core Web Vitals               | **BLOCKED**                             | Последний committed trio неизменен: Perf 97/97/97, A11y 100/100/100, BP 100/100/100, SEO 100/100/100; LCP 2666/2668/2659 ms, median **2666 ms**. Бюджет `<2500 ms` нарушен на 166 ms. INP field data отсутствует.                                                                                                                                                                      |
| npm dependency audit                       | PASS                                    | Первый независимый live `npm audit --omit=dev` и полный `npm audit`: 0 vulnerabilities; dependency files новый SHA не меняет.                                                                                                                                                                                                                                                          |
| CI                                         | **BLOCKED / BROWSER PENDING**           | GitHub Actions run `29429608987` для точного SHA: `quality = COMPLETED / SUCCESS` (checkout+LFS, npm ci, format, lint, 19 unit, build, typecheck); `browser = IN_PROGRESS`, на момент отчета выполняется Chromium install, полный E2E еще не завершен. Pending нельзя считать green. Приватный check-runs endpoint недоступен валидатору без auth; статус подтвержден Release Manager. |
| Deployment / preview / field evidence      | **BLOCKED**                             | Preview URL не предоставлен; deployment-based field CWV/INP и production link verification отсутствуют.                                                                                                                                                                                                                                                                                |

## Закрытые замечания предыдущей приемки

### A11Y-01 — deadline badge contrast: CLOSED

- Было: `#2D2A26` на `#FF5100`, axe 4.37:1 при требовании 4.5:1.
- Стало: светлый page background, orange border и brand-black text.
- Evidence: axe `color-contrast` green на desktop/mobile/reduced-motion; visual meaning срока сохранен без зависимости только от цвета.

### A11Y-02 — buttons inside `role="img"`: CLOSED

- Было: четыре tooltip buttons внутри `.tariff-chart[role="img"]`, axe `nested-interactive` serious.
- Стало: `.tariff-chart[role="group"]` с доступным именем; buttons остаются самостоятельными интерактивными descendants, таблица остается текстовым эквивалентом.
- Evidence: axe `nested-interactive` green и focus/name tests green на трех профилях.

## Оставшиеся actionable blockers

1. Достичь median mobile LCP `<2500 ms` в трех новых production Lighthouse runs при сохранении Perf ≥90, BP/SEO ≥95 и отсутствии известных A/AA нарушений.
2. Закрыть R08 официальным phone/email/link реестром для каждой требуемой организации либо формальным решением владельца продукта о допустимом incomplete state.
3. Закрыть R16 Figma/Sheet source decision по машинке и заменить `SOURCE-GAP` на проверяемое решение владельца продукта.
4. Выполнить NVDA+Chromium, 200% zoom/reflow, полный keyboard-only и реальный mobile touch/zoom/gesture pass с evidence.
5. Получить production-одобрение Figma logo/order assets и финальную legal/rights приемку AI-generated media.
6. Провести финальный live-link audit, настроить preview deployment и собрать field CWV/INP либо согласовать отдельный post-deploy gate.
7. Получить фактический green browser CI на новом SHA и приложить CI artifacts.

## Финальный вердикт Hard Validator

**BLOCKED.** Accessibility regression gate для `4406dec` пройден, но SHA не разрешено merge’ить в `main` и нельзя объявлять release candidate до закрытия всех семи оставшихся блоков с проверяемыми evidence и повторной независимой приемкой.
