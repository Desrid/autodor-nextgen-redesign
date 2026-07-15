# ADR-001: Next.js application foundation

- Status: accepted
- Date: 2026-07-15
- Owners: Frontend Architecture

## Context

The repository started without an application stack. The homepage must expose critical
content without JavaScript, support progressive enhancement for media and maps, and keep
interactive code out of the initial bundle where possible.

## Decision

Use Next.js 16.2.10 App Router, React 19.2.7 and TypeScript 6.0.3 in strict mode. TypeScript 7.0.2 was checked but is not used because the TypeScript ESLint parser bundled by `eslint-config-next@16.2.10` declares support only below TypeScript 6.1.
React Server Components are the default. A file may use `"use client"` only when it
owns browser state, an interaction API or a client-only library. A server section must
not become a client component solely because one child is interactive.

The root layout owns document language, viewport metadata, the global stylesheet and a
skip link. The initial page renders an empty semantic `main` landmark so downstream
agents can add the approved sections without deleting invented visible content.

Node.js 24 and npm 11 are the supported build toolchain. Production builds use Next.js
standalone output. `next/image` is configured for AVIF and WebP; media source policy and
remote hosts are added only after the asset registry verifies them.

## Boundaries

- Server components own headings, copy, links, structured data and verified facts.
- Client leaves own tabs, sliders, map synchronization, video controls and motion.
- Data adapters return typed serializable values and do not leak remote response shapes
  into components.
- A section remains readable when a client leaf fails to hydrate.
- Scroll position is never stored in React state and raw window scroll listeners are not
  allowed.

## Consequences

The first response contains useful semantic HTML as content is added. Interactive
libraries can be split by section. Authors must design explicit loading, empty, error
and static fallback states at the component boundary.

## Official references

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [TypeScript compiler options](https://www.typescriptlang.org/tsconfig/)
