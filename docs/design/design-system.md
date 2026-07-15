# Design System

## Status and authority

This document defines the implementation-facing visual and interaction system. It cannot change the approved Figma structure, labels, order or visibility. When sources conflict, the project priority rules apply and the conflict is recorded in `docs/open-questions.md`.

Confirmed color and typography values come from `docs/brand/brandbook-extraction.md`. Research candidates from `ui-ux-pro-max` remain evidence for interaction and composition, not permission to invent missing brand rules.

The theme is explicitly light. Page and content surfaces remain white or within the confirmed cool-gray scale. A dark button or local control does not create a dark section theme.

## Stack decision

The repository contained no application stack when researched. The empty-project architecture from the brief is adopted:

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS v4
- Server Components by default
- Motion for UI transitions
- GSAP and ScrollTrigger only for justified pin/scrub choreography
- MapLibre or an equivalent open-source renderer as a lazy client leaf

Static copy, headings, links and verified facts render on the server. Sliders, tabs, map synchronization, video controls and motion remain isolated client leaves. Do not mark a full page or section client-side solely for one interaction.

## Semantic token architecture

Use three layers: primitive, semantic and component. Only semantic and component tokens may be used by application components.

### Confirmed brand palette and semantic colors

| Token                    | Meaning                                  | Confirmed value |
| ------------------------ | ---------------------------------------- | --------------- |
| `--color-brand-orange`   | Logo orange, route and controlled accent | `#FF5100`       |
| `--color-brand-black`    | Logo dark and primary text               | `#2D2A26`       |
| `--color-gray-7`         | Cool Gray 7                              | `#97999C`       |
| `--color-gray-5`         | Cool Gray 5                              | `#B1B3B6`       |
| `--color-gray-3`         | Cool Gray 3                              | `#D1D3D4`       |
| `--color-gray-1`         | Cool Gray 1 and subtle surface           | `#E8E8E8`       |
| `--color-page`           | Global light page surface                | `#FFFFFF`       |
| `--color-surface`        | Raised light content surface             | `#FFFFFF`       |
| `--color-surface-subtle` | Quiet grouping and skeleton surface      | `#E8E8E8`       |
| `--color-text`           | Primary readable text                    | `#2D2A26`       |
| `--color-text-secondary` | Secondary readable text                  | `#2D2A26`       |
| `--color-border-subtle`  | Decorative divider only                  | `#D1D3D4`       |
| `--color-border-control` | Required control boundary                | `#2D2A26`       |
| `--color-action`         | Default primary action fill              | `#2D2A26`       |
| `--color-on-action`      | Text/icon on primary action              | `#FFFFFF`       |
| `--color-focus-on-white` | Focus ring on white only                 | `#FF5100`       |
| `--color-focus-on-gray`  | Focus ring on gray surfaces              | `#2D2A26`       |

The brandbook does not assign semantic error, success or warning roles. Do not infer those meanings from orange or a gray. Select any additional functional colors as project accessibility tokens, document them separately and do not attribute them to the brandbook. This preserves OQ-002.

### Contrast calculations and restrictions

Ratios use the WCAG relative-luminance formula.

| Foreground | Background |  Contrast | Decision                                             |
| ---------- | ---------- | --------: | ---------------------------------------------------- |
| `#2D2A26`  | `#FFFFFF`  | `14.28:1` | Passes AAA for text                                  |
| `#FFFFFF`  | `#2D2A26`  | `14.28:1` | Passes AAA for text                                  |
| `#2D2A26`  | `#E8E8E8`  | `11.65:1` | Passes AAA for text                                  |
| `#2D2A26`  | `#D1D3D4`  |  `9.50:1` | Passes AAA for text                                  |
| `#2D2A26`  | `#B1B3B6`  |  `6.79:1` | Passes AA for text                                   |
| `#2D2A26`  | `#97999C`  |  `5.00:1` | Passes AA for text                                   |
| `#FF5100`  | `#FFFFFF`  |  `3.27:1` | Passes non-text `3:1`; fails normal text `4.5:1`     |
| `#FFFFFF`  | `#FF5100`  |  `3.27:1` | Large text only; prohibited for normal button labels |
| `#2D2A26`  | `#FF5100`  |  `4.37:1` | Fails normal text `4.5:1`; large text only           |
| `#97999C`  | `#FFFFFF`  |  `2.86:1` | Fails text and critical UI contrast                  |

Consequences:

- Use dark buttons with white labels for routine primary actions.
- Use orange on white for route lines, focus rings, selected outlines, large display text and icons that meet the non-text `3:1` requirement.
- Do not use white or dark small text on orange fills. The dark pairing misses `4.5:1` by `0.13` and is still a fail.
- Do not use any confirmed cool gray as normal text on white. Secondary hierarchy uses the dark text color with size, weight and spacing.
- Orange focus is valid on white, but its `2.67:1` contrast on `#E8E8E8` fails. Gray surfaces use the dark focus ring or a two-layer ring with white separation.
- `#D1D3D4` borders are decorative. Inputs and other boundaries required to identify a control use the dark border or another verified `3:1` treatment.

### Stable spacing tokens

| Token        | Value  | Typical use                      |
| ------------ | ------ | -------------------------------- |
| `--space-1`  | 4 px   | optical micro-gap                |
| `--space-2`  | 8 px   | target separation, compact gap   |
| `--space-3`  | 12 px  | label-to-control                 |
| `--space-4`  | 16 px  | mobile gutter, component padding |
| `--space-6`  | 24 px  | card/control group               |
| `--space-8`  | 32 px  | subsection separation            |
| `--space-12` | 48 px  | compact section separation       |
| `--space-16` | 64 px  | standard section separation      |
| `--space-24` | 96 px  | large section separation         |
| `--space-32` | 128 px | cinematic desktop separation     |

Use `clamp()` between named steps for viewport scaling. Do not introduce arbitrary one-off spacing values.

### Typography roles

The brandbook confirms Montserrat and Arial roles. Use official font files or another validated licensed source. Prefer `next/font/local` for Montserrat when the official files are present; record an alternative source in an ADR.

| Role                  | Fluid intent                            | Constraints                                                            |
| --------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| Display               | Montserrat Bold                         | Large but controlled; hero maximum two lines                           |
| H1                    | Montserrat Bold                         | One per page, exact approved wording                                   |
| H2                    | Montserrat Bold                         | Preserve Figma text and hierarchy                                      |
| H3                    | Montserrat Bold                         | No decorative heading level skips                                      |
| Body L                | Montserrat Regular                      | Maximum 65 characters per line where possible                          |
| Body                  | Montserrat Regular                      | Minimum 16 px mobile, line height 1.5 to 1.7                           |
| Supporting subheading | Arial Regular                           | Use only in the supporting role documented by the brandbook            |
| Running header/footer | Arial Regular                           | Use only where the approved composition calls for it                   |
| Lead/callout/note     | Arial Italic                            | Confirmed secondary italic role; avoid decorative overuse              |
| Label                 | Montserrat Regular                      | Sentence case, never sole color cue                                    |
| Data                  | Montserrat Regular with tabular figures | Localized formatting; verify numeral support in the supplied font file |

### Shape and layer rules

- Content surface candidate: 16 px radius.
- Compact control candidate: 8 px radius.
- Pill radius: only for clear buttons, chips or segmented controls.
- Borders organize; shadows are reserved for overlays and active drag layers.
- Proposed radius values are design decisions subject to brandbook reconciliation, not extracted brand rules.
- Layer scale: base 0, sticky header 20, local overlay 40, modal 80, toast 100. No arbitrary z-index values.

## Grid and responsive behavior

| Viewport    | Layout response                                                                        |
| ----------- | -------------------------------------------------------------------------------------- |
| 1920        | Full editorial grid, constrained reading columns, intentional negative space           |
| 1440        | Primary desktop composition; all fixed controls visible without crowding               |
| 1024        | Compact desktop/tablet; header overflow moves only into approved "Ещё" behavior        |
| 768         | One-column transition for high-variance layouts; maps pair with list or drawer         |
| 390 and 375 | Primary phone art direction, 16 px minimum gutter, 44 px targets                       |
| 320         | No horizontal page overflow; long labels wrap outside buttons, not inside primary CTAs |

General rules:

- Use CSS Grid for macro-layout and intrinsic sizing for components.
- Do not encode complex percentage math in flex widths.
- Use `min-height: 100dvh` for immersive viewport panels.
- Maintain source order in the DOM. Visual reordering cannot alter reading or focus order.
- Main scroll remains native. Avoid nested vertical scroll regions.

## Navigation architecture

- Provide a visible skip link to `main`.
- Desktop navigation is one line and at most 80 px high.
- Use the exact approved labels. Overflow belongs only in the approved "Ещё" control.
- Current page or section state uses more than color alone.
- Sticky header reserves scroll margin for anchor targets and never covers focused content.
- Search, language, account, procurement and SME support retain explicit accessible names.
- Mobile menu traps focus only while open, closes with Escape and returns focus to its trigger.
- Deep links and anchor IDs remain stable for SEO and sharing.

## Block-level system in fixed order

| Block                 | Node                | Layout family                     | Core interaction contract                                                         |
| --------------------- | ------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| Header                | `1767:6576`         | Institutional one-line navigation | Keyboard-complete menu, search, language and account controls                     |
| Hero and road network | `1767:7102`         | Asymmetric cinematic atlas        | Road slider synchronized with map and media; buttons, keyboard, drag/swipe, pause |
| Services              | `1767:7168`         | Six-item two-row expansion field  | Hover and focus may enrich; touch opens explicit disclosure                       |
| Loyalty               | `1767:7270`         | Horizontal offer rail             | Buttons, keyboard, swipe, loading and empty states                                |
| News                  | `1767:7305`         | Five-item editorial bento         | Real dates and links; one dominant story, no text overload                        |
| Important information | `1767:7328`         | Single institutional feature      | Calm hierarchy, no invented urgency                                               |
| Media gallery         | `1767:7339`         | Full-bleed visual rail            | No invented heading; accessible labels and visible controls                       |
| Contacts              | `1767:7368`         | Tabbed institutional directory    | Roving focus, stacked mobile fallback, direct phone/email links                   |
| Statistics            | `1767:7415`         | Editorial data field              | Keyboard tooltips, accessible summary and text/table alternative                  |
| Subsidiary services   | `1767:7456`         | Service-cluster bento             | Exact content count, no empty cells, composition distinct from news               |
| Documents             | `1767:7498`, hidden | No separate visual block          | Preserve approved menu access only                                                |
| Social obligations    | `1767:7501`         | Two-part commitment composition   | Two columns desktop, exact sequence mobile                                        |
| Future projects       | `1767:7508`         | Map plus semantic timeline        | Three verified projects, keyboard route, static fallback                          |
| Footer                | `1767:7539`         | Institutional logo and legal grid | Consistent logo alignment, real links and contact content                         |
| Back to top           | `1767:9223`         | Floating utility                  | Accessible label, appears without covering content                                |
| Chat                  | `1767:9225`         | Floating help entry               | FAQ first, then form; no visible forbidden label                                  |
| Car preview state     | specified behavior  | Optional pointer-adjacent preview | Two explicit preview states; never replaces the system cursor                     |

## Component state contract

Every interactive component defines:

- default
- hover where applicable
- focus-visible
- active/pressed
- selected/current
- disabled
- loading
- empty
- error with recovery
- reduced motion
- touch behavior
- no-JS or static fallback when the component carries critical content

Do not use hint text as the only label. Async buttons disable repeated submission and keep their accessible name stable. Errors appear near the source and are announced with `aria-live` or `role="alert"` as appropriate.

## Maps and geospatial interaction

- Treat MapLibre/WebGL as progressive enhancement.
- Keep roads and projects in structured data rendered to an accessible DOM list.
- Selecting a road from the slider, list or map updates one shared semantic selection state.
- Map markers and routes have keyboard-reachable equivalents outside the canvas.
- Do not depend on hover, precise pointer targeting or color alone.
- Provide a static image and text list fallback for no-WebGL, reduced data, errors and print.
- Avoid trapping page scroll or browser zoom gestures.
- Announce selection changes in a polite live region without reading every map movement.

## Motion system boundary

`MOTION_INTENSITY: 8` means high craft, not high frequency.

| Layer                          | Tool                        | Purpose                                          |
| ------------------------------ | --------------------------- | ------------------------------------------------ |
| Control feedback               | CSS or Motion               | Press, focus-adjacent state, disclosure          |
| Slider and tab continuity      | Motion                      | Shared selection and content crossfade           |
| Section reveal                 | Motion `whileInView` or CSS | Sparse hierarchy reveal                          |
| One or two narrative sequences | GSAP ScrollTrigger          | Geographic storytelling with justified pin/scrub |
| Map camera                     | Map renderer API            | Selection framing, not decorative orbiting       |

Rules:

- Animate transform and opacity for continuous effects.
- GSAP sequences use scoped contexts and cleanup on unmount.
- Pinning starts at `top top`, remains limited and is tested on mid-tier mobile.
- Never use raw `window` scroll listeners.
- Text and interactive controls do not parallax.
- Reduced motion removes scrub, parallax, autoplay and magnetic behavior.
- Exit is shorter than enter; user input can interrupt all animation.
- SplitText or other licensed plugins require an explicit ADR and license check.

## Media behavior

- Hero media reserves dimensions and uses an optimized poster.
- Above-fold image receives intentional priority; below-fold media is lazy.
- Images use AVIF/WebP with responsive `sizes` and mobile art direction.
- Video uses WebM/MP4, `muted`, `playsinline`, poster, pause and data-saver behavior.
- No audio starts without user action.
- Generated or commissioned media cannot contain distorted road signs, markings or invented official symbols.
- Media failure leaves the heading, road name, facts and links visible.

## Accessibility acceptance

- WCAG 2.2 AA minimum; aim higher for body text and core controls.
- Text contrast at least 4.5:1; large text and non-text UI at least 3:1.
- Target size at least 44 by 44 CSS pixels.
- Logical heading hierarchy and landmark structure.
- Keyboard access for sliders, tabs, maps, charts, menus, chat and dialogs.
- Focus order equals DOM and reading order.
- Focus is restored after closing overlays and moved meaningfully after route changes.
- Every meaningful image has useful alt text; decorative images use empty alt.
- Video has pause and an equivalent description or transcript where content-bearing.
- Charts use patterns, labels or text in addition to color.
- Browser zoom remains enabled.

## Performance acceptance

- LCP target below 2.5 s on mobile.
- INP target below 200 ms.
- CLS target below 0.1.
- Lazy-load map, WebGL, below-fold video and heavy motion.
- Reserve media and async block dimensions.
- Do not preload every font or media variant.
- Avoid more than one heavy client feature becoming active in the same viewport.
- Provide low-capability behavior based on reduced motion, save-data and runtime failure, not device-name guessing.

## Loading, empty and failure matrix

| Feature             | Loading                         | Empty                                  | Error or degraded                      |
| ------------------- | ------------------------------- | -------------------------------------- | -------------------------------------- |
| Road media          | Poster and reserved frame       | Verified road text remains             | Poster plus road details and link      |
| Loyalty             | Geometry-matched offer skeleton | Plain explanation and destination link | Retry and stable fallback link         |
| News                | Five-cell reserved bento        | Explain no current items               | Retry and current-site destination     |
| Contacts            | Reserved tab panel              | Explain no matching organization       | Direct general contact fallback        |
| Statistics          | Text-first skeleton             | Explain no published data              | Source message, no invented value      |
| Future projects map | Static reserved map frame       | Project list remains                   | Static map or list with verified links |

## Final design review checklist

- Figma order and exact visible labels are preserved.
- Hidden documents block remains hidden as a section.
- Light theme is consistent.
- Brand colors and type roles match the extracted brandbook values.
- The page remains one consistent light theme.
- Normal-size white or dark text is never placed on `#FF5100`.
- OQ-001 order/logo conflict and OQ-002 digital/photo limitations remain unchanged.
- All six service items and all road items have equivalent touch and keyboard access.
- News and subsidiary service bento systems are visually distinct.
- No repeated layout family appears in consecutive sections without a functional reason.
- No hover-only content, fake metrics, temporary copy, decorative HUD text or custom cursor.
- Reduced motion, no-JS, no-WebGL, media error and slow-network paths remain usable.
- Responsive review covers 1920, 1440, 1024, 768, 390, 375 and 320 px.
