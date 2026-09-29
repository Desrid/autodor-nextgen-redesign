# Figma fidelity audit — 2026-09-28

Status: implementation applied; full browser acceptance pending. This is not a pixel-perfect completion report.

Canonical checkout: `C:/Users/Даниил/.codex/visualizations/2026/07/27/019fa319-b4a4-78f2-b6e4-8a09c0d55013/autodor-statistics-worktree`, branch `codex/all-blocks-changes`, HEAD `c9f4923d3ff541e74156b8dd8edfe6a62135ffd2`. Approved Sites v3 baseline remains the implementation base. No branch switch, commit, deployment, snapshot update, or preview restart was performed.

Existing dirty work preserved: `app/page.tsx`, `app/home-figma.css`, `next-env.d.ts`, OpenSpec change, existing Figma assets, preview logs. Application edits were applied with a branch guard and exact pre-edit file hashes. The unrelated foundation-source-audit checkout was used only for ignored source/QA staging artifacts.

## Source coverage

[Figma concept page](https://www.figma.com/design/o2qoBC7fJlivEo8QSIxR5g/?node-id=27-10810). Both connected integrations were verified as Designer WP, designer@webpractik.ru. The file contains the concept page and a UI-Kit page (`1:32`), including typography, colors, logos, grid, header, hero, media, contacts, loyalty, statistics and service variants.

| Route         | Section / frame           | Canvas      |
| ------------- | ------------------------- | ----------- |
| `/`           | `251:12155` / `27:10811`  | 1920 × 8612 |
| `/about`      | `276:7974` / `276:7975`   | 1920 × 7538 |
| `/road-users` | `276:15363` / `276:15364` | 1920 × 4006 |
| `/account`    | `276:18453` / `277:43852` | 1920 × 1608 |

The route frames are 1920px desktop canvases; no mobile route frames were found on this concept page. Mobile sizes must use the existing responsive behavior and be checked at 375/390, 768 and the harness matrix. UI-Kit samples are not mobile route mockups.

Detailed child-node design contexts and screenshots were obtained for all public sections and account sidebar/dashboard/footer/debt alert. Large frames returned sparse contexts and were inspected through their children. Component screenshots are reference evidence, not page backgrounds. The video poster is an isolated media-layer export (`282:57291`) without UI overlays.

## Measured layout contract

Desktop content width 1464px at x=228; header x=50,y=20,1820×88; content starts y=132. Section gaps 64px; heading/content gap 48px; common section headings Montserrat 64/72, weight 500, tracking 0. Source light/black weights (300/900) were missing from the font import and have been added.

| Home section        | Source      | Top y | Height |
| ------------------- | ----------- | ----: | -----: |
| Hero                | `146:7421`  |   132 |    720 |
| Services            | `274:17065` |   916 |    744 |
| Loyalty             | `163:7835`  |  1724 |    705 |
| News                | `258:20502` |  2493 |    704 |
| Important           | `253:12984` |  3261 |    420 |
| Media               | `244:11618` |  3745 |    448 |
| Contacts            | `205:12128` |  4257 |    576 |
| Statistics          | `232:9228`  |  4897 |    558 |
| Subsidiary services | `251:11964` |  5519 |    704 |
| Social              | `251:12156` |  6287 |    504 |
| Future projects     | `262:31224` |  6855 |   1224 |
| Footer              | `253:17404` |  8143 |    469 |

| About section | Source      | Top y | Height |
| ------------- | ----------- | ----: | -----: |
| Hero          | `282:57242` |   132 |    640 |
| Video         | `282:57310` |   796 |    480 |
| Foundation    | `282:57375` |  1300 |    394 |
| Today         | `282:57520` |  1758 |    456 |
| History       | `284:26762` |  2278 |    922 |
| Activities    | `299:26193` |  3264 |   1228 |
| Structure     | `300:37045` |  4556 |    943 |
| Compliance    | `300:39298` |  5563 |    744 |
| Contacts      | `308:41112` |  6371 |    634 |
| Footer        | `276:8323`  |  7069 |    469 |

| Road users section | Source      | Top y | Height |
| ------------------ | ----------- | ----: | -----: |
| Hero               | `535:34200` |   132 |    720 |
| Calculator         | `441:41282` |   916 |   1050 |
| Rules              | `346:44376` |  2030 |    674 |
| Loyalty            | `277:52669` |  2768 |    705 |
| Footer             | `276:15371` |  3537 |    469 |

## Applied differences

- Public header uses measured outer gutters, 88px shell, 24px corners and source shadow. Footer uses the source surface/shadow, 1646px inner frame, logo size and 14px contact text.
- Home uses original Figma images for loyalty, news, important stories, first four gallery images, subsidiary services and social commitments. Service rows now follow the concept order: legal account/store/plate payment, then calculator/app/MAX. Initial service titles are at the bottom with a divider; disclosure, hover and destinations remain implemented. News, services, loyalty, contact and social typography was corrected.
- About hero uses the original construction image and source scrim. Copy starts at 80,245. The 650×363 white quote begins at 782,245, with side-by-side quote mark/text, 18/24 paragraph, 24/28 bold name and original 314×416 portrait. The mission uses a vertical rule. The isolated original media poster replaces the auto-playing preview; the existing modal/player remains available.
- Foundation date, 4-column facts, activities (7/5 columns, then 4/4/4; 380/300/300px rows), company diagram and compliance bento were aligned to source dimensions. Diagram surfaces/order and typography were corrected. Contacts now use a white card, source map background, highlighted building, pin and entrance SVG.
- Road-user hero uses the original promotion image, measured road typography, status/help cards and promotion CTA. Calculator shell is 890px tall, with a 370px translucent form, 56px controls and source corner sizes. Photo toll-plaza view is initial, with the original photo, 514px shell and 4×296px lane descriptions; the schematic switch remains available. Loyalty styling matches the shared source.
- Account was inspected as part of the latest full-document request. No account implementation changes have been made; browser comparison is pending. Public CSS selectors are scoped to the three public routes.

## Checks and acceptance limits

- `harness:preflight` passed before implementation.
- Typecheck passed after the new gallery src fallback was corrected and again after the final service-row refinement.
- Scoped ESLint passed with --max-warnings=0 after the promotion arrow correction.
- Unit run after updating old asset-path expectations: 95 passed, 4 failed, 99 total. Remaining failures are three HeaderNav focus-restoration expectations and NewsGrid's old list-role expectation. Their implementations/tests were not changed in this task. Final targeted regression run after the service-row refinement: 6 test files, 34 tests passed.
- `harness:changed` passed branch guard and design contract (13 visible sections, 8 viewports, R01–R17). It stops at formatting of pre-existing `next-env.d.ts`; that file is preserved per AGENTS.md. All task-authored files passed the changed-files formatting check at this stage.
- `git diff --check` passed after removing the introduced whitespace.
- Original history map PNG export returned 404; the existing interactive map remains. Exact map styling and all dynamic-map states are not accepted yet.
- Shared preview subsequently became unavailable: browser navigation timed out; curl to 127.0.0.1:3001 failed to connect and no listening entry was observed on port 3001. Request to start the project preview is pending because the user's AGENTS.md instructions prohibit agent restarts. No server has been started or stopped.
- Full-height after screenshots, 375/390/768/1440/1920 overflow checks, account comparison, keyboard/reduced-motion/print verification, functional E2E and Windows `@visual` acceptance remain pending. Old snapshot baselines were not updated.

Source context/asset manifests and before screenshots are in the ignored `.artifacts/figma-alignment` staging folder in the foundation checkout. Source section measurements above are Figma coordinates, not verified after-change browser coordinates.

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
