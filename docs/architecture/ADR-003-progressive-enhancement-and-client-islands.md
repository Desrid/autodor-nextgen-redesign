# ADR-003: Progressive enhancement and client islands

- Status: accepted
- Date: 2026-07-15
- Owners: Frontend Architecture, Motion, Map and WebGL

## Context

The approved experience includes sliders, controlled video, synchronized maps and
advanced motion. Loading these capabilities globally would work against mobile
performance, reduced-motion support and no-JavaScript access.

## Decision

Keep the initial runtime limited to Next.js and React. The following registry-verified
candidates are deferred until a source-backed component consumes them:

| Candidate      | Verified version | License                    | Intended boundary                     | Bundle implication                                                              |
| -------------- | ---------------: | -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| Motion         |          12.42.2 | MIT                        | UI state transitions in client leaves | Import from `motion/react`; no page-level provider by default                   |
| GSAP           |           3.15.0 | Standard no-charge license | Isolated pin or scrub choreography    | Load only for a justified sequence; clean up every context                      |
| MapLibre GL JS |           5.24.0 | BSD-3-Clause               | Road network and future-project maps  | Lazy-load renderer, styles and map data; provide static HTML and image fallback |

Three.js and React Three Fiber are not selected. They require a separate evidence-based
ADR demonstrating that CSS, video and MapLibre cannot deliver the approved interaction.

Each enhanced component must meet these conditions:

- semantic server-rendered content exists before hydration;
- static and error fallbacks preserve every critical fact and action;
- motion honors `prefers-reduced-motion` and data-saving behavior;
- video is muted, inline, controllable and poster-backed;
- maps are keyboard reachable and have a textual list equivalent;
- dynamic imports keep the library out of routes that do not use it;
- production bundle analysis is attached to the pull request that adds the dependency.

## Consequences

The scaffold contains no unused motion or mapping runtime. Feature agents must add a
dependency and its lockfile change together with the consuming component, tests,
fallback and measured build delta.

## Official references

- [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [Motion for React](https://motion.dev/docs/react)
- [GSAP React guidance](https://gsap.com/resources/React/)
- [MapLibre GL JS documentation](https://maplibre.org/maplibre-gl-js/docs/)
