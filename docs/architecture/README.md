# Architecture decisions

The application architecture is intentionally small at the foundation stage. Static
content remains server-rendered, while interaction, maps and cinematic media are added
as isolated client leaves only when a source-backed section requires them.

## Decision index

- [ADR-001: Next.js application foundation](./ADR-001-nextjs-application-foundation.md)
- [ADR-002: Styling and semantic tokens](./ADR-002-styling-and-semantic-tokens.md)
- [ADR-003: Progressive enhancement and client islands](./ADR-003-progressive-enhancement-and-client-islands.md)
- [ADR-004: Quality gates and browser matrix](./ADR-004-quality-gates-and-browser-matrix.md)
- [ADR-005: Dependency and license governance](./ADR-005-dependency-and-license-governance.md)

All decisions are subordinate to the source priority documented in the project brief:
Figma for structure, Google Sheets for behavior, the approved brandbook for identity,
and the current public website for facts and URLs.
