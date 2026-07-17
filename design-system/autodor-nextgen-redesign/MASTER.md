# Autodor Nextgen Redesign: master design system research

Status: research baseline, not a brandbook extraction.

This file persists the `ui-ux-pro-max` research for the project. The Python launcher required by the skill was unavailable in the current Windows environment. The same bundled datasets were queried directly from the skill package. No zero-result query is presented as a match.

## Input

- Product: public infrastructure and highway network homepage
- Audiences: drivers, partners, investors, media, state institutions
- Desired language: premium, immersive, light, trustworthy, accessible
- Implementation stack: Next.js App Router, React, TypeScript strict, Tailwind CSS v4
- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 8`
- `VISUAL_DENSITY: 4`

## Design Read

Reading this as: a full visual overhaul of a public-infrastructure service homepage for a mixed mass and institutional audience, with a trust-first cinematic editorial language, leaning toward a custom semantic design system on Next.js and Tailwind rather than a stock component theme.

## Database query log

| Research area      | Dataset                           | Strongest useful matches                                                                             | Applied consequence                                                                        |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Product model      | `products.csv`                    | Government/Public Service, Government Portal/Civic Services, Public Transit Guide, Road Trip Planner | Plain-language service access, AAA-oriented baseline, map and route affordances            |
| Visual style       | `styles.csv`                      | Trust & Authority, Minimalism & Swiss Style, immersive styles only with performance caveats          | Trust and hierarchy form the base; cinematic media is a controlled layer                   |
| Accessibility      | `ux-guidelines.csv`               | contrast, focus, keyboard, alt, ARIA, headings, reduced motion, skip links                           | WCAG 2.2 AA is a component contract, not a QA-only pass                                    |
| Navigation         | `ux-guidelines.csv`               | sticky navigation, active state, deep links, keyboard order                                          | One-line desktop header, overflow in the approved "Ещё" group, stable anchors              |
| Maps               | `products.csv`                    | Public Transit, Logistics/Delivery, Ride Hailing/Transportation                                      | Map is synchronized with a semantic road/project list and never the only navigation path   |
| Responsive         | `ux-guidelines.csv`               | mobile first, `dvh`, 44 px targets, no hover dependency                                              | Single-column mobile reading order, visible controls for every gesture                     |
| Typography         | `typography.csv` plus brandbook   | Corporate Trust research; Montserrat Bold/Regular and Arial Regular/Italic confirmed by brandbook    | Use the confirmed families and roles; do not substitute a research font                    |
| Color              | `colors.csv` plus brandbook       | Public-service contrast research; orange, dark neutral and four cool grays confirmed by brandbook    | Keep one light system with orange as a controlled brand accent                             |
| GSAP               | `motion.csv`                      | Complex Scroll Reveal, standard/subtle parallax, stagger                                             | At most one or two pinned sequences, scoped triggers, transform/opacity only, full cleanup |
| Loading and errors | `ux-guidelines.csv`, `motion.csv` | skeleton, nearby error, `aria-live`, retry                                                           | Every dynamic block receives loading, empty, error, stale and static fallback states       |
| Next.js            | `stacks/nextjs.csv`               | Server Components, client leaves, `next/image`, `next/font`, loading/error boundaries                | Static content is server-rendered; map, slider and motion are isolated client leaves       |

There was no exact highway-specific map design-system match. Highway interaction recommendations are therefore synthesized only from the broader transportation matches and the project brief.

## Chosen foundation

Custom semantic tokens plus accessible primitives. Do not ship the default appearance of a generic component library. Use native semantic HTML first; introduce Radix primitives only where focus management and interaction complexity justify the dependency.

### Confirmed brand tokens

The colors and typography below come from `docs/brand/brandbook-extraction.md`. The page remains light. White and light gray surfaces carry the primary content; dark full-section theme inversions are not part of this system.

```css
:root {
  --brand-orange: #ff5100;
  --brand-black: #2d2a26;
  --brand-gray-7: #97999c;
  --brand-gray-5: #b1b3b6;
  --brand-gray-3: #d1d3d4;
  --brand-gray-1: #e8e8e8;
  --surface-page: #ffffff;
  --surface-raised: #ffffff;
  --surface-subtle: var(--brand-gray-1);
  --text-primary: var(--brand-black);
  --text-secondary: var(--brand-black);
  --border-subtle: var(--brand-gray-3);
  --border-control: var(--brand-black);
  --action-primary: var(--brand-black);
  --action-primary-text: #ffffff;
  --focus-on-white: var(--brand-orange);
  --focus-on-gray: var(--brand-black);
}
```

`--text-secondary` intentionally uses the same dark value as primary text. Hierarchy comes from Montserrat weight, type size and spacing because none of the confirmed cool grays reaches `4.5:1` against white.

### Verified contrast pairings

Ratios use the WCAG relative-luminance formula.

| Foreground | Background |     Ratio | Allowed use                                              |
| ---------- | ---------- | --------: | -------------------------------------------------------- |
| `#2D2A26`  | `#FFFFFF`  | `14.28:1` | All text and controls                                    |
| `#FFFFFF`  | `#2D2A26`  | `14.28:1` | Primary button text and icons                            |
| `#2D2A26`  | `#E8E8E8`  | `11.65:1` | All text on subtle surfaces                              |
| `#2D2A26`  | `#D1D3D4`  |  `9.50:1` | All text                                                 |
| `#2D2A26`  | `#B1B3B6`  |  `6.79:1` | All text                                                 |
| `#2D2A26`  | `#97999C`  |  `5.00:1` | All text                                                 |
| `#FF5100`  | `#FFFFFF`  |  `3.27:1` | Non-text UI, focus ring, route line, large text only     |
| `#FFFFFF`  | `#FF5100`  |  `3.27:1` | Large text only, not normal button copy                  |
| `#2D2A26`  | `#FF5100`  |  `4.37:1` | Large text only; fails the normal-text `4.5:1` threshold |

The orange focus ring passes `3:1` on white but only `2.67:1` on `#E8E8E8`. On gray surfaces use the dark focus token or a two-layer ring with a white separation stroke. Cool Gray 7 on white is `2.86:1`; none of the confirmed grays is valid for normal text on white.

### Confirmed typography

- Montserrat Bold: headings and display roles.
- Montserrat Regular: body copy.
- Arial Regular: subheadings and running header/footer roles documented by the brandbook.
- Arial Italic: leads, callouts and notational text documented by the brandbook.
- Load Montserrat through a validated licensed source. Prefer `next/font/local` once official files are present; record any alternative source in an ADR.

### Explicitly unresolved brand areas

- The order treatment is not described. Follow the approved Figma asset without redrawing or reconstructing it. OQ-001 remains unchanged.
- Full photo style, responsive logo rules, motion rules and a digital component system are not described. Project rules must not be attributed to the brandbook. OQ-002 remains unchanged.

## Stable non-brand foundations

### Layout

- Mobile-first content order must match the approved Figma order.
- Use a 12-column editorial grid from 1024 px upward.
- Use a single-column flow below 768 px, except local two-column micro-layouts that remain readable at 390 px.
- Container and gutters scale fluidly; no fixed viewport-width content.
- All full-bleed media reserves intrinsic aspect ratio to prevent CLS.
- Use `min-height: 100dvh`, never `100vh` for immersive panels.

### Spacing

Density 4 uses a 4 px base with semantic steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Component gaps stay compact; section rhythm stays generous. Larger values may scale with `clamp()` but must resolve to the same system.

### Typography roles

- Display: short section-defining statements, two lines maximum in the hero.
- Heading: descriptive, not poetic; preserve approved Figma wording exactly.
- Body: 16 px minimum on mobile, line height 1.5 to 1.7, 65 to 75 characters on desktop.
- Labels: sentence case by default. Avoid repeated uppercase tracking labels.
- Data: tabular figures, localized units and accessible text equivalents.
- Font family: Montserrat for headings and body; Arial for the confirmed supporting roles.

### Shape and elevation

- Prefer grouping by spacing and subtle boundaries before cards.
- Proposed project rule, subject to brand audit: 16 px radius for content surfaces, 8 px for compact controls, full radius only for clearly button-like actions.
- Use one low, tinted elevation level for overlays only. Avoid generic floating card shadows.

## Interaction contracts

- All functionality works with keyboard, touch and pointer.
- Touch targets are at least 44 by 44 CSS pixels with at least 8 px separation.
- Focus is always visible and never removed.
- Hover can enrich but never reveal the only access to content or action.
- Sliders provide previous/next buttons, pagination/status, keyboard navigation, swipe/drag and pause.
- Tabs use semantic tab roles, roving focus and a stacked fallback at narrow widths.
- Maps synchronize visual selection with a DOM list and preserve the same action outside WebGL.
- Charts provide a text summary and tabular or list alternative.

## Motion contract

- Motion communicates hierarchy, geographic continuity, state change or direct feedback.
- Motion transitions use Motion for component state and GSAP only for justified pin/scrub sequences.
- Never mix Motion and GSAP ownership of the same element.
- Use transform and opacity only for continuous animation.
- No raw scroll listeners and no React state for continuous scroll or pointer values.
- Complex pinned storytelling is limited to one or two sections and removed on mobile when it harms native scroll.
- Every animation has a `prefers-reduced-motion` static equivalent.
- Autoplay video is muted, `playsinline`, pausable and replaced by its poster for reduced motion or data saving.

## Loading, empty and error states

- Skeletons match the final geometry and reserve layout space.
- Empty states explain whether content is unavailable or truly absent.
- Errors are placed near the failed block and include retry when recovery is possible.
- Dynamic messages use `aria-live` without stealing focus.
- Map, WebGL, video and API failures leave critical text and links operable.

## Pre-flight locks

- Approved Figma structure, labels, order and visibility are immutable.
- Light theme remains consistent across the page.
- One verified accent family across sections: brand orange `#FF5100`, restricted by the contrast rules above.
- No custom cursor, AI-purple, decorative HUD labels, fake coordinates, glow or invented metrics.
- No repeated equal-card section families.
- No more than one marquee pattern.
- No horizontal page overflow at 320 px.
- Critical content remains present without JavaScript.
