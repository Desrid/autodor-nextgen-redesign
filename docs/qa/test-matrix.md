# Матрица тестирования

Дата формирования: **2026-07-15**. Последний production-прогон: **2026-07-15**. Эта матрица описывает release-gate. Наличие тестового файла без успешного запуска не является доказательством.

## Автоматизированные наборы

| Набор                 | Назначение                                                                               | Команда                                                                |
| --------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Unit / data contracts | Порядок дорог, node-id, проверенные источники, запрет публикации неподтверждённых данных | `npm test`                                                             |
| Requirements E2E      | 17 строк Google Sheets, порядок Figma, интерактивные контракты                           | `npx playwright test e2e/requirements.spec.ts`                         |
| Accessibility E2E     | axe WCAG A/AA, skip link, landmarks, alt, keyboard focus, overflow                       | `npx playwright test e2e/accessibility.spec.ts`                        |
| Resilience E2E        | no-JS, no-WebGL, reduced motion, assets, links, console/runtime errors                   | `npx playwright test e2e/resilience.spec.ts`                           |
| Media E2E             | WebM/MP4, pause, media failure/poster and Save-Data fallback                             | `npx playwright test e2e/media.spec.ts`                                |
| Visual regression     | Full-page reduced-motion snapshots at every configured viewport                          | `npx playwright test e2e/visual.spec.ts`                               |
| Smoke                 | SSR shell и базовый axe                                                                  | `npx playwright test e2e/smoke.spec.ts`                                |
| Static gates          | ESLint, TypeScript strict, production compilation, formatting                            | `npm run lint`, `npm run typecheck`, `npm run build`, `npm run format` |

## Фактический итог автоматизации

- Полная Playwright-матрица: **206 passed, 26 намеренных project-scoped skipped, exit 0**, 8 профилей, 232 теста.
- Visual regression: **8/8** эталонных full-page снимков прошли.
- Unit/component/data: **4 файла, 16 тестов passed**.
- Static gates: ESLint, TypeScript strict, Prettier check и production build — **passed**.
- Повторный post-patch smoke/axe/media: **27 passed, 6 намеренных skipped, exit 0** на `desktop-1440`, `mobile-390`, `mobile-390-reduced-motion`.
- Responsive hero preload contract: **1 passed, exit 0**; HTML содержит mobile AVIF preload, network log подтверждает один запрос без double-fetch.
- Один параллельный diagnostic-run дал нестабильный focus timeout; тот же тест прошёл отдельно и в последовательном контрольном наборе. Это не скрыто, но release evidence основано на воспроизводимом sequential-run.
- Lighthouse latest median (`mobile-preload-1..3`): Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP **2666 мс**. Бюджет LCP `< 2500 мс` не выполнен, поэтому общий release verdict — **BLOCKED**.

## Трассировка требований 1–17

|  ID | Node / источник               | Проверяемый результат                                                         | Автотест                                                    | Ручная проверка                                     | Release status |
| --: | ----------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- | -------------- |
| R01 | `1767:6576`                   | Header, утверждённая навигация, доступ к документам, keyboard                 | `requirements: R01`                                         | Логотип с орденом, mobile menu, focus return        | AUTO PASS      |
| R02 | `1767:7102`                   | 9 дорог в точном порядке, slider/tab, static fallback                         | `requirements: R02`; `resilience: no-WebGL/no-JS`           | drag/swipe, video pause, poster, touch              | AUTO PASS      |
| R03 | `1767:7168`                   | 6 сервисов, доступная подпись, содержание не hover-only                       | `requirements: R03`                                         | desktop hover/focus, mobile tap, пояснение оплаты   | AUTO PASS      |
| R04 | `1767:7270`                   | Loyalty rail с реальными карточками либо честным empty/source state           | `requirements: R04-R07`                                     | loading/error/retry, swipe                          | AUTO PASS      |
| R05 | `1767:7305`                   | Ровно 5 новостей, даты и ссылки                                               | `requirements: R04-R07`; links/assets                       | Визуальный порядок bento                            | AUTO PASS      |
| R06 | `1767:7328`                   | Один актуальный important state без искусственной срочности                   | `requirements: R04-R07`                                     | announcement и empty state                          | AUTO PASS      |
| R07 | `1767:7339`                   | Media rail, alt, отсутствие видимого придуманного заголовка                   | `requirements: R04-R07`; accessibility images               | crops 1920→320, keyboard/swipe                      | AUTO PASS      |
| R08 | `1767:7368`                   | Tabs: Arrow/Home/End, panel semantics, контакты                               | `requirements: R08`                                         | phone/mail/«Подробнее», focus order                 | SOURCE GAP     |
| R09 | `1767:7415`                   | Тарифы I–IV только для подтверждённого участка М-12; table/text equivalent    | `statistics.test.ts`; `requirements: R09-R10`               | tooltip keyboard/SR, chart not color-only           | AUTO PASS      |
| R10 | `1767:7456`                   | ДЗО без пустых карточек, реальные ссылки                                      | `requirements: R09-R10`; links                              | Отличие от news bento                               | AUTO PASS      |
| R11 | `1767:7498`, hidden           | Нет отдельной секции; ссылка в меню сохранена                                 | `requirements: section order/R11`                           | Видимость в mobile/desktop menu                     | AUTO PASS      |
| R12 | `1767:7501`                   | Ровно 2 обязательства в исходном порядке                                      | `requirements: R11-R14`; responsive                         | 2 columns desktop, последовательность mobile        | AUTO PASS      |
| R13 | `1767:7508`                   | 3 verified projects, «К 2030 году», Figma order; static map fallback          | `map-data.test.ts`; `requirements: R11-R14`; no-WebGL/no-JS | project links keyboard, no false geometry claim     | AUTO PASS      |
| R14 | `1767:7539`                   | Footer landmark, контакты, legal/government links                             | `requirements: R11-R14`; links                              | logo without order, logo alignment/wrap             | AUTO PASS      |
| R15 | `1767:9225`                   | Chat opens FAQ, Escape closes, focus restores, forbidden visible label absent | `requirements: R15`                                         | collision at 320/375/390                            | AUTO PASS      |
| R16 | Sheet `C21`, Figma source gap | `?car=on` shows pointer, `?car=off` removes it                                | `requirements: R16`                                         | pointer does not obscure content; not custom cursor | SOURCE GAP     |
| R17 | `1767:9223`                   | Back-to-top keyboard activation and top position                              | `requirements: R17`                                         | focus visibility and floating-controls collision    | AUTO PASS      |

## Viewport matrix

Playwright runs Chromium with Russian locale and Moscow timezone for every configured viewport.

| Project                     |    Viewport | Input model      | Required checks                                      |
| --------------------------- | ----------: | ---------------- | ---------------------------------------------------- |
| `desktop-1920`              | 1920 × 1080 | mouse + keyboard | Full editorial grid, hover, max-width, section order |
| `desktop-1440`              |  1440 × 900 | mouse + keyboard | Primary desktop composition, fixed utilities         |
| `desktop-1024`              |  1024 × 768 | mouse + keyboard | Compact nav, no clipping/overflow                    |
| `tablet-768`                |  768 × 1024 | touch + keyboard | Layout transition, tabs/rails, no hover dependency   |
| `mobile-390`                |   390 × 844 | touch + keyboard | Main phone art direction, touch targets, collisions  |
| `mobile-375`                |   375 × 812 | touch + keyboard | iPhone-like narrow layout, safe wrapping             |
| `mobile-320`                |   320 × 568 | touch + keyboard | Minimum supported width, no horizontal page overflow |
| `mobile-390-reduced-motion` |   390 × 844 | touch + keyboard | No autoplay/scrub/smooth scroll; all content remains |

## Manual acceptance matrix

These checks are not replaced by axe or screenshots:

- Complete keyboard-only pass: skip link, header menus, sliders, services, tabs, charts, future projects, chat, back-to-top.
- Screen reader pass: NVDA + Chromium on Windows; landmarks, heading outline, active tab/slide, live announcements, tables.
- Touch pass on a real mobile device: 44 × 44 targets, drag/swipe cancellation, fixed-control collisions, browser zoom.
- Media failure: block images/video requests; poster or semantic copy remains and the page does not collapse.
- Slow network: Fast 3G/4× CPU in DevTools; priority hero remains comprehensible, below-fold media does not compete with LCP.
- Visual regression at all seven widths after font and media stabilization.
- External-link audit against the live source immediately before release; automated tests validate targets and local responses but do not treat a transient third-party outage as product correctness.

На 2026-07-15 NVDA, реальное мобильное устройство и deployment-based field CWV **не выполнены**. Эти ручные пункты остаются release blockers, даже при зелёной автоматизации.

## Evidence policy

Release evidence must include command, timestamp, environment, exit code and artifact path. Screenshots or HTML reports belong under `.artifacts/qa/` and must not be described as passing unless the command exited successfully.
