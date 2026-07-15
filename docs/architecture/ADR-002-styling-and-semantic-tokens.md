# ADR-002: Styling and semantic tokens

- Status: accepted
- Date: 2026-07-15
- Owners: Frontend Architecture, Design System

## Context

The page requires a custom identity grounded in the approved brandbook. Importing a
generic component theme would add CSS and visual assumptions while still requiring
extensive overrides. Brand colors and typography cannot be guessed.

## Decision

Use Tailwind CSS 4.3.2 through `@tailwindcss/postcss` 4.3.2, plus semantic CSS custom
properties defined by the design system. Tailwind utilities may express layout and
responsive rules, but application components consume semantic color and component
tokens rather than raw arbitrary brand values.

No third-party visual component system is installed. Accessible primitives may be
evaluated per component when native HTML cannot satisfy the interaction, but only one
primitive family may be adopted project-wide.

The foundation stylesheet includes only normalization, viewport stability, global focus
treatment, the skip link, a documented z-index scale and a reduced-motion safety net.
It does not pre-empt brandbook colors, fonts, radii or section composition.

## Consequences

The Tailwind package and PostCSS plugin are build-time dependencies and add no runtime
JavaScript. Generated CSS cost still depends on authored utilities and is measured in
the production build. Brand extraction can update tokens without rewriting component
structure.

## Official references

- [Tailwind CSS installation with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)
- [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
