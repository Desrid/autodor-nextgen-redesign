# Map system

- Status: source-gated specification
- Date: 2026-07-15
- Applies to: road network `1767:7102`; future projects `1767:7508`
- Architecture: [ADR-006](../architecture/ADR-006-map-and-webgl.md)

## Design intent

The map communicates the scale and continuity of the federal road network without
turning the homepage into a navigation application. It is a precise visual companion to
the approved road slider and future-project timeline. Text, selection and actions remain
clear before the map loads, after it fails and when WebGL is unavailable.

The system follows the persisted `ui-ux-pro-max` transportation research: semantic list
and map are synchronized, touch never depends on hover, focus is visible, and every
dynamic state has a nearby recovery path. The result remains a light, trustworthy public
infrastructure interface rather than a dark HUD.

## Source boundaries

### Road network

The nine production labels and node IDs are defined in `app/data/roads.ts`:

| Order | Road                          | Figma node  | Verified facts                          | Geometry    |
| ----: | ----------------------------- | ----------- | --------------------------------------- | ----------- |
|     1 | М-1 «Беларусь»                | `1767:7111` | extent, class, lanes, speed, detail URL | unavailable |
|     2 | М-3 «Украина»                 | `1767:7112` | extent, class, lanes, speed, detail URL | unavailable |
|     3 | М-4 «Дон»                     | `1767:7113` | extent, class, lanes, speed, detail URL | unavailable |
|     4 | М-11 «Нева»                   | `1767:7114` | extent, class, lanes, speed, detail URL | unavailable |
|     5 | М-12 «Восток»                 | `1767:7115` | extent, class, lanes, speed, detail URL | unavailable |
|     6 | А-113 ЦКАД                    | `1767:7116` | extent, class, lanes, speed, detail URL | unavailable |
|     7 | А-289                         | `1767:7117` | extent, class, lanes, speed, detail URL | unavailable |
|     8 | А-105 Москва-Домодедово       | `1767:7118` | extent, class, lanes, speed, detail URL | unavailable |
|     9 | А-107 Московское малое кольцо | `1767:7119` | extent, class, lanes, speed, detail URL | unavailable |

All geographic drawing is blocked until a coordinate source passes ADR-006. Do not
infer road paths from names, screenshots or a generic routing service.

### Future projects

Figma verifies three card positions (`1767:7511/7513/7515`) and timeline labels 2026,
2027, 2028, 2029 and 2030 (`1767:7537/7535/7534/7538/7536`). The official securities
prospect approved 21 April 2025 independently verifies three project names and states
that construction work on them will be completed by 2030.

All three data records are therefore `verified` for title, source URL and the common
label «К 2030 году». The timeline remains the approved visual scale; only its 2030
point is a source-backed project milestone. Exact route geometry remains unavailable,
so the Figma map is a clearly labelled static presentation fallback rather than
verified geodata.

## Composition

### Road-network hero `1767:7102`

- Preserve the Figma block and road order.
- The active road media/facts panel is primary; the map is a supporting layer.
- Keep the four fixed actions from `1767:7163–7167` outside the map so they remain
  available in fallback states.
- Desktop may place the verified map beside or behind the active panel only within the
  approved hero bounds. Content contrast must not depend on the basemap.
- At 768 px and below, render facts and road controls before the map. The map uses a
  bounded aspect ratio and never traps vertical page scrolling.
- At 320–390 px, short road labels may form a horizontally scrollable tablist with
  visible previous/next controls and an announced position such as “2 из 9”. The page
  itself must not overflow horizontally.

### Future projects `1767:7508`

- Preserve heading `1767:7509`, three-card capacity, map `1767:7517` and timeline
  `1767:7520`.
- Do not render fabricated cards to fill capacity. While all three records are blocked,
  keep the section structure and show a neutral source-unavailable state suitable for
  editorial review; production publication remains blocked by the release gate.
- Once facts exist, the selected card and selected marker share one ID. Timeline
  activation filters or selects only records whose dates are separately verified.
- On mobile, cards and dates precede the optional map so every project remains usable
  without WebGL.

## Visual language

The map uses the confirmed brand tokens but not brand color alone:

| Element                | Treatment                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Basemap                | light neutral, reduced POI density, readable place labels; provider and style require license review |
| Inactive verified road | `#2D2A26` core at reduced opacity with a light casing                                                |
| Active verified road   | `#FF5100` core plus contrasting dark/light casing and increased width                                |
| Keyboard-selected road | active treatment plus a persistent labelled DOM state; never color-only                              |
| Future project point   | simple geometric marker with ordinal or icon and visible project label                               |
| Map controls           | white or `#E8E8E8` surfaces, `#2D2A26` icons/text, two-layer focus ring where needed                 |
| Error/loading overlay  | opaque light surface adjacent to, not floating indefinitely over, the fallback                       |

Orange is valid for non-text UI against white but not for normal white-on-orange text.
Controls therefore use dark text or dark button surfaces as defined in the master design
system. Route line contrast must be checked against the actual licensed basemap at all
supported zoom levels; casing provides shape separation when the basemap changes.

No terrain, 3D buildings, animated traffic, pulsing markers, decorative coordinates,
glow, fake engineering labels or custom cursor are allowed.

## Interaction model

### Selection

One section-local state value is authoritative:

```ts
type RoadSelection = {
  selectedRoadId: RoadId;
  changeSource: "keyboard" | "pointer" | "programmatic";
};
```

The implementation may keep `changeSource` in a ref when it is needed only to choose an
instant or animated camera transition. Continuous camera or pointer values never enter
React state.

| Input                 | Result                                                                          |
| --------------------- | ------------------------------------------------------------------------------- |
| Road tab/button       | Select road, update facts and media, then fit verified geometry if map is ready |
| Previous/next         | Move exactly one item, wrap only if the approved slider behavior wraps          |
| Left/Right on tablist | Move roving focus and selection                                                 |
| Home/End on tablist   | Select first/last road                                                          |
| Map feature click/tap | Select the same road ID; do not move keyboard focus                             |
| Zoom/reset button     | Change camera only; selection remains stable                                    |
| Escape                | Close an open map popover, if one exists; never clear road selection            |

Hover may thicken a route or preview a label, but must not alter the committed road,
replace focus, or reveal the only details link. Touch selection is a single deliberate
tap; dragging the map does not select routes beneath the pointer.

### Camera

- Initial camera fits all admitted overview geometry with padding derived from the
  visible panel, not hard-coded desktop pixels.
- A road selection fits only verified geometry and respects safe padding at each
  breakpoint.
- Camera animations use a short ease-out transition and are skipped for reduced motion,
  keyboard rapid-repeat and repeated selection.
- User pan/zoom pauses automatic camera fitting until the next explicit road selection.
- Scroll zoom starts disabled. Cooperative or explicit activation prevents the map from
  hijacking page scroll.

### Popovers and detail

The primary facts panel is outside WebGL. If a map popover is later justified, it
duplicates only a short label and a link; it does not become the canonical fact surface.
It is dismissible, collision-aware, does not open on hover alone and does not create a
keyboard trap.

## State model

| State          | Visual map                                  | Semantic content                 | Action                                   |
| -------------- | ------------------------------------------- | -------------------------------- | ---------------------------------------- |
| `static`       | none, or a licensed registered static image | full road/project list and facts | normal links work                        |
| `eligible`     | reserved map region                         | full fallback remains            | lazy gate may start                      |
| `loading`      | fixed-size skeleton, no fake route          | full fallback remains operable   | announce “Карта загружается” politely    |
| `ready`        | synchronized renderer                       | same DOM list/facts              | map controls enabled                     |
| `save-data`    | fallback only                               | full list/facts                  | explicit “Загрузить интерактивную карту” |
| `unsupported`  | fallback only                               | full list/facts                  | short explanation, no retry loop         |
| `error`        | fallback plus local status                  | full list/facts                  | one retry action                         |
| `context-lost` | fallback restored immediately               | selection preserved              | retry recreates one context              |
| `empty`        | no pseudo-map                               | source-gap message               | no disabled mystery controls             |

Loading and error messages use `aria-live="polite"`. Focus is not moved when the map
loads, fails or recovers.

## Responsive and input rules

- Touch targets: minimum 44 × 44 CSS px with 8 px separation.
- Map height: bounded by section composition; never full-screen by default on mobile.
- Mobile panning: one-finger pan only after explicit map activation; page scroll remains
  the default gesture.
- Controls avoid safe-area and browser chrome collisions and remain reachable at 200%
  zoom.
- External zoom/reset controls are preferred over relying on canvas keyboard shortcuts.
- Pointer, keyboard and touch produce the same selected ID and fact panel.
- No content or action appears only on hover.

## Static/no-WebGL equivalent

The current production-safe equivalent is:

1. semantic ordered road controls in the exact Figma order;
2. one visible facts panel with route class, maximum lanes, maximum speed and extent;
3. a direct verified details link;
4. an accessible selection status;
5. for future projects, only source-verified cards and dates.

A static map asset must not be generated merely to occupy `1767:7517`. Admission
requires the same coordinate/license provenance as the interactive layer, an asset
registry entry, responsive crops and alt text. When the image conveys no additional
fact beyond the adjacent list, use empty alt and keep the full description in HTML.

## Performance and lifecycle

- Keep renderer code, CSS, styles and geometry out of the initial route bundle.
- Start the lazy gate near the viewport, never during LCP media fetch.
- Honour `saveData` when available and provide an opt-in load path.
- Use overview-simplified geometry; fetch detail only when selection and zoom require it.
- Avoid continuous React updates for `move`, `mousemove` or scroll events.
- Throttle non-React telemetry; visual updates stay inside MapLibre.
- Use one map instance, one resize observer and one intersection observer; clean all of
  them on unmount.
- On `webglcontextlost`, prevent cascading retries, destroy the instance and restore the
  fallback.
- Enforce the numeric budgets in ADR-006 with build output and a mobile performance
  trace in the release-candidate PR.

## Required verification before enabling MapLibre

- [ ] Coordinate source and license are recorded for every published geometry.
- [ ] Required attribution remains visible at all supported widths.
- [ ] All nine road geometries pass schema, coordinate-range and empty-geometry checks.
- [ ] Road selector, media and map always share the same selected ID.
- [ ] Keyboard tablist behavior passes Left/Right/Home/End tests.
- [ ] Pointer and touch map selection have a DOM-equivalent action.
- [ ] Map is not present in the initial JavaScript bundle.
- [ ] Unsupported WebGL, style error, tile error and context loss preserve all content.
- [ ] Reduced motion removes camera flights and continuous effects.
- [ ] Save-data path does not fetch map code, styles, tiles or geometry before opt-in.
- [ ] 1920, 1440, 1024, 768, 390, 375 and 320 px have no page overflow.
- [ ] 200% zoom, keyboard-only and screen-reader smoke tests pass.
- [ ] Performance budgets from ADR-006 pass on the agreed mobile profile.

## Current release status

**Interactive map implementation remains blocked by the geometry source gate.** The
three project names and common 2030 milestone are verified and rendered in semantic
HTML. MapLibre dependency and precise route rendering must still wait for licensed
coordinates; the existing static Figma image is presentation fallback only.
