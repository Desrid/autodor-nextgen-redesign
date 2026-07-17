# Accessibility report

Target: **WCAG 2.2 AA**. Date: **2026-07-15**.

## Current verdict

**AUTOMATED PASS / MANUAL VALIDATION PENDING.** Axe, keyboard contracts, landmarks, image alternatives, 44 px touch targets, reduced motion and overflow checks passed across the production Playwright matrix. Lighthouse Accessibility is 100 in all three final mobile runs. WCAG 2.2 AA is not claimed as fully validated because NVDA, 200% zoom and a real-device touch pass were not completed.

## Acceptance criteria

### Structure and navigation

- One `main#main-content`, one `header`/banner and one `footer`/contentinfo landmark.
- First keyboard action exposes a visible skip link; activation moves focus to `main`.
- Heading levels follow the approved Figma hierarchy; the media gallery does not gain a visible heading absent from the final prototype.
- DOM order matches reading and focus order. CSS visual reordering cannot alter meaning.
- Documents remain reachable through the approved menu but do not render as a standalone section.

### Keyboard and focus

- Every action is operable by keyboard with a visible `:focus-visible` treatment.
- Menus and dialogs close on `Escape` and restore focus to their trigger.
- Road and contact tabs support Arrow keys, `Home` and `End`; selected state is exposed with ARIA.
- Sliders have named previous/next/pause controls and do not consume unrelated page keys.
- Map and chart interactions have equivalent semantic controls outside canvas/SVG.
- Back-to-top and chat remain reachable without covering the currently focused element.

### Touch and pointer

- Primary controls and floating utilities provide at least 44 × 44 CSS px targets with separation.
- Services and road details are not hover-only. Touch exposes the same information without emulated hover.
- Native page scroll and browser zoom remain available; maps and rails do not trap vertical gestures.
- The optional car pointer is content, not a custom system cursor, and never follows the pointer continuously.

### Perception and content

- Normal text contrast is at least 4.5:1; large text and critical non-text UI are at least 3:1.
- Confirmed brand orange `#FF5100` on white is restricted to non-text UI/large display use because the documented ratio is 3.27:1.
- Meaning is never conveyed by color alone. Charts include labels and a table/text equivalent.
- Meaningful images have concise Russian alt text; decorative images use `alt=""`.
- Video is muted and pausable, has a poster and equivalent description/transcript where it carries information.
- Error, loading and empty states remain named and understandable to assistive technology.

### Motion

- `prefers-reduced-motion: reduce` removes autoplay, scrub, parallax and smooth scrolling.
- Content never depends on completing an animation.
- User input can interrupt sliders and motion; no animation causes rapid flashing.

## Automated coverage

| Check                      | Tool / test                                  | Result                                               |
| -------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| WCAG A/AA detectable rules | axe in `e2e/accessibility.spec.ts` and smoke | PASS, 8 Playwright profiles                          |
| Skip link / landmarks      | Playwright keyboard assertions               | PASS                                                 |
| Tab keyboard model         | Playwright `requirements: R08`               | PASS; source contact completeness remains documented |
| Chat focus restoration     | Playwright `requirements: R15`               | PASS                                                 |
| Image alt and load state   | Playwright accessibility image test          | PASS                                                 |
| Reduced motion             | Playwright media emulation                   | PASS                                                 |
| Horizontal overflow        | All viewport projects                        | PASS, 1920→320                                       |
| 44 px touch targets        | Mobile/tablet Playwright profiles            | PASS                                                 |
| Type safety / lint         | TypeScript + ESLint                          | PASS                                                 |
| Lighthouse Accessibility   | `mobile-preload-1..3.json`                   | 100 / 100 / 100                                      |

Полная production Playwright-матрица завершилась с результатом **206 passed, 26 намеренных project-scoped skipped, exit 0**. Post-performance-patch последовательный smoke/axe/media контроль: **27 passed, 6 намеренных skipped, exit 0**.

После первого независимого validator pass исправлены два serious axe-дефекта: deadline badge получил светлый фон с фирменной оранжевой рамкой, а интерактивная диаграмма использует `role="group"` вместо семантически сворачивающего descendants `role="img"`. Повторный production accessibility-прогон на `desktop-1440`, `mobile-390` и `mobile-390-reduced-motion`: **17 passed, 1 ожидаемый desktop touch-only skip, exit 0**.

Automated tools cannot validate copy quality, reading order in all screen readers, meaningful alt text, usable gestures or focus visibility against every background. Those remain manual release checks.

## Незавершённые ручные проверки

- NVDA + Chromium: **NOT RUN**.
- 200% zoom и reflow с ручной проверкой порядка чтения: **NOT RUN**.
- Реальный мобильный touch/zoom/gesture pass: **NOT RUN**.
- Проверка контраста и focus visibility на каждом media-background человеком: **NOT RUN**.

Поэтому отчёт подтверждает качество автоматизированного покрытия, но не подменяет полную ручную WCAG-приёмку.

## Manual screen-reader protocol

1. Run production build in Chromium with NVDA.
2. Read landmarks and heading list before exploring visually.
3. Traverse header navigation, road slider, service items, contacts tabs, statistics equivalent, future-project list, footer and floating controls.
4. Confirm that tab/slide changes are announced once, not on every map camera move.
5. Disable images, block media, switch to 200% zoom and repeat at 320 CSS px equivalent width.
6. Record defects with WCAG criterion, element, reproduction steps, severity and screenshot/video evidence.

## Skill evidence

`ui-ux-pro-max` was consulted for its accessibility, touch, performance, responsive and motion priorities. Its Python search helper was unavailable in this Windows environment, so no database-search result is claimed; this report uses the skill's documented baseline plus the project requirements.
