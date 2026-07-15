# ADR-005: Dependency and license governance

- Status: accepted
- Date: 2026-07-15
- Owners: Frontend Architecture, Release Management

## Context

The site must remain reviewable, avoid secret or binary leakage, and justify every
runtime dependency against performance and licensing constraints.

## Registry snapshot

Versions and package metadata were verified against the npm registry by the
orchestrator on 2026-07-15. Exact dependencies were installed locally and recorded in
`package-lock.json`; the quality gates remain the authority for compatibility.

| Package              | Version | License    | Role and cost note                                                                                |
| -------------------- | ------: | ---------- | ------------------------------------------------------------------------------------------------- |
| next                 | 16.2.10 | MIT        | Framework and build output; npm package unpacked size 155,058,895 bytes is not client bundle size |
| react / react-dom    |  19.2.7 | MIT        | Required application runtime                                                                      |
| typescript           |   6.0.3 | Apache-2.0 | Build-time type checking only; compatible with the current Next.js lint parser                    |
| tailwindcss          |   4.3.2 | MIT        | Build-time CSS generation                                                                         |
| @tailwindcss/postcss |   4.3.2 | MIT        | Build-time PostCSS integration                                                                    |
| eslint               |  9.39.5 | MIT        | Static analysis only; compatible with the current Next.js plugin peer ranges                      |
| vitest               |  4.1.10 | MIT        | Test environment only                                                                             |
| @playwright/test     |  1.61.1 | Apache-2.0 | CI and local browser testing only                                                                 |
| @axe-core/playwright |  4.12.1 | MPL-2.0    | Test-only accessibility analysis                                                                  |
| @vitejs/plugin-react |   6.0.3 | MIT        | Test-only React/TSX transform for Vitest 4 and Vite 8                                             |
| postcss override     |  8.5.19 | MIT        | Build-only security override shared by Next, Tailwind and Vite; no browser runtime                |

Supporting type definitions, jsdom, Testing Library, Prettier and the matching Next.js
ESLint config are development-only dependencies pinned exactly in `package.json`.

Lighthouse `13.4.0` (Apache-2.0) was installed only as a transient local audit tool.
Its JSON evidence is retained under `docs/qa/lighthouse/`; the package and its transitive
dependencies were removed from `package.json` and `package-lock.json` before handoff.

## Dependency gate

Every new package change must include:

1. official documentation and repository links;
2. current license and compatibility with project distribution;
3. unpacked size plus a measured production client-bundle delta when runtime code ships;
4. reason native platform or an existing dependency is insufficient;
5. server/client boundary and lazy-loading strategy;
6. lockfile change, vulnerability review and tests;
7. entry in the asset or license registry when applicable.

Exact versions are used so WIP installs do not drift. Automated update tooling may open
reviewed dependency pull requests, but it cannot merge them or relax the release gate.

## PostCSS security override

The latest stable Next.js available on the audit date, `16.2.10`, declares an exact nested dependency on PostCSS `8.4.31`, which is affected by `GHSA-qx2v-qp2m-jg93`. The upstream fix exists in PostCSS `8.5.10+`, but only a Next.js canary contained it at the audit date. The project therefore uses npm's top-level `overrides` field to resolve every PostCSS consumer to `8.5.19` instead of moving production to an unapproved canary. `npm ls postcss --depth=2` confirms that Next, Tailwind and Vite use the same overridden version. After removing the transient Lighthouse tool, both `npm audit` and `npm audit --omit=dev` report zero vulnerabilities. Build and browser checks must be repeated after any change to this override.

## Official references

- [npm package specification](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [Next.js repository](https://github.com/vercel/next.js)
- [React repository](https://github.com/facebook/react)
- [Playwright repository](https://github.com/microsoft/playwright)
- [Vitest repository](https://github.com/vitest-dev/vitest)
