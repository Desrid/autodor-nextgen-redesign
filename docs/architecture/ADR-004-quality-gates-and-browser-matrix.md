# ADR-004: Quality gates and browser matrix

- Status: accepted
- Date: 2026-07-15
- Owners: Frontend Architecture, QA

## Context

The release gate requires strict typing, linting, unit and browser tests, accessibility
automation, visual evidence and validation at seven exact viewport widths.

## Decision

Use ESLint 9.39.5 with the Next.js 16.2.10 Core Web Vitals and TypeScript flat configs. ESLint 10.7.0 was checked but is not used because the React, import and jsx-a11y plugins bundled by `eslint-config-next@16.2.10` declare support through ESLint 9.
Use Vitest 4.1.10 with jsdom for unit and component tests. Use Playwright 1.61.1 with
axe-core 4.12.1 for browser, keyboard, touch, reduced-motion and accessibility checks.

Playwright defines these Chromium projects:

- 1920 x 1080
- 1440 x 900
- 1024 x 768
- 768 x 1024 with touch
- 390 x 844 with touch
- 375 x 812 with touch
- 320 x 568 with touch
- 390 x 844 with touch and reduced motion

Firefox and WebKit are added to the release-candidate job after the full interaction
surface exists. The required width matrix runs first on Chromium to keep WIP feedback
bounded. Release evidence must still include the cross-browser matrix from
`docs/qa/test-matrix.md`.

CI runs lint, typecheck, Vitest, production build and Playwright. Browser failures retain
screenshots, video and traces for 14 days. The workflow never pushes, merges or deploys.

## Lockfile gate

Network access was unavailable during scaffold creation, so this change does not claim
an installation or a generated lockfile. The initial CI skeleton uses exact versions
with `npm install`. Once registry access is available, the root agent will generate and
review `package-lock.json`; the workflow must then switch to `npm ci` before release.

## Official references

- [Next.js ESLint guide](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Vitest guide](https://vitest.dev/guide/)
- [Playwright test configuration](https://playwright.dev/docs/test-configuration)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
