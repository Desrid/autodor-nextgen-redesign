# ADR-006: Map rendering, source admission and no-WebGL fallback

- Status: accepted
- Date: 2026-07-15
- Owners: Map and WebGL, Frontend Architecture, Accessibility
- Related: ADR-001, ADR-003, ADR-005

## Context

The approved homepage contains two geographic experiences:

- the road-network hero `1767:7102`, with nine roads in nodes `1767:7111–7119`;
- “Будущие проекты” `1767:7508`, with three cards `1767:7511/7513/7515`, map
  node `1767:7517` and timeline node `1767:7520`.

The current-site audit verifies textual characteristics and detail URLs for all nine
roads. It does not provide licensed route geometry. Figma verifies the presence of
three future-project cards and timeline labels 2026–2030. The official securities
prospect approved 21 April 2025 now verifies three project names and the common
milestone «К 2030 году», but it does not provide licensed coordinates.

Adding a map renderer before admitting a coordinate source would either ship an unused
dependency or encourage hand-drawn geography. Both outcomes violate the source and
performance requirements.

## Decision

### 1. The semantic content is the product; WebGL is an enhancement

Server Components render the road selector, selected-road facts, detail link and a
textual map equivalent. The future-project section renders only publishable verified
records. The first response and no-JavaScript response must contain every critical fact
and action.

The WebGL canvas is a synchronized visual layer. It never becomes the only way to select
a road or project, inspect a fact or follow a link.

### 2. MapLibre remains deferred

MapLibre GL JS is the selected candidate from ADR-003, but it must not be added to
`package.json` until all of the following exist in the same change:

1. a coordinate source with URL, retrieval date, owner, license, attribution and version;
2. WGS84 geometry or a documented, tested CRS transformation;
3. a geometry validation report for all published records;
4. a consuming lazy client leaf plus semantic server fallback;
5. measured production bundle and first-map transfer deltas;
6. unit, component, keyboard, reduced-motion, no-WebGL and error-state tests.

Screenshots, generated images and hand tracing are not valid coordinate sources. Figma
positions are composition, not geography. The Figma timeline years are scale labels;
the separately sourced 2030 milestone may be attached to the verified projects.

Three.js and React Three Fiber are rejected for these sections. The approved map use
case is two-dimensional, and an additional 3D runtime has no source-backed benefit.

### 3. Data contracts block unverified publication

`app/data/roads.ts` holds the nine approved road identities and current-site facts.
Every record currently has `mapGeometry.status = "unavailable"` and `geometry = null`.

`app/data/future-projects.ts` preserves the three Figma card slots in their approved
order and admits the title, source URL and 2030 milestone from the official prospect.
`getPublishableFutureProjects()` returns the three discriminated `verified` records.
Their geometry remains `unavailable` and `null`, preventing the static composition
from being mistaken for source-backed route data.

Geometry can change to `verified` only with source metadata, license and attribution in
the same object. A deadline can be populated only with its own authoritative source;
the geometry source does not implicitly verify a schedule.

### 4. Client boundary and shared selection

When the source gate is satisfied, use this boundary:

```text
RoadNetworkSection (Server Component)
├── semantic selector + facts + links (server HTML)
└── RoadMapEnhancementGate (small client leaf)
    └── dynamic import → RoadMapCanvas (MapLibre owner)
```

The section-local client controller owns one serializable `selectedRoadId`. The road
controls, media slide and map receive the value and an `onSelectRoad` callback. Do not
duplicate selection state, use a page-global store, or derive selection from continuous
scroll position.

Selection rules:

- DOM control activation updates the facts and, when ready, fits the verified geometry;
- a pointer-selected map feature updates the same `selectedRoadId`;
- map camera movement never changes selection by itself;
- focus stays on the control the user activated;
- camera transitions are cancelled or made instant for `prefers-reduced-motion`;
- an `aria-live="polite"` status may announce a changed road, but must not repeat the
  full facts panel.

The future-project section uses the same model with `selectedProjectId` only after at
least one verified project exists.

### 5. Lazy-load and capability gate

The semantic fallback is always rendered. The enhanced renderer may be requested only
after the section approaches the viewport and a verified geometry dataset is present.
The client gate checks WebGL support before importing MapLibre.

For a detected data-saving preference, keep the fallback and offer an explicit
“Загрузить интерактивную карту” action. Reduced motion does not remove the map, but it
does remove animated camera flights and pulsing or continuously animated layers.

The MapLibre import must live behind `next/dynamic` in a Client Component. Renderer CSS
and map data are loaded at the same boundary, not in the root layout. Only one WebGL map
context may be mounted at a time; destroy it and observers on unmount.

### 6. Keyboard and assistive-technology equivalent

Road/project selection is implemented with native buttons or a correctly associated
tablist and panels. With a tablist, Left/Right, Home and End move the roving focus and
activate the corresponding panel. Every target is at least 44 × 44 CSS px with 8 px
between adjacent targets.

The canvas is not a required keyboard surface. It is removed from the sequential focus
order and exposed as a visual duplicate because all selection and detail actions exist
in DOM controls. Optional zoom in, zoom out and reset actions are external labelled
buttons. Wheel zoom is disabled until the map receives an explicit pointer action, so
page scrolling is not trapped.

Map selection never relies on color alone: active DOM state includes text and
`aria-selected`/`aria-pressed`, while the visual route changes stroke width and casing as
well as color.

### 7. Static and failure behavior

Until verified geometry exists, the fallback is the semantic road list and facts panel;
do not create a decorative pseudo-map. A future static map image is allowed only if it
comes from an admitted map source and is registered with license and alt text.

At runtime, unsupported WebGL, context loss, tile/style failure, blocked third-party
requests, slow network and JavaScript failure all return to the same operable fallback.
An inline status explains that the interactive map is unavailable; recovery is a
labelled retry button that does not clear selection.

## Performance budgets for the consuming change

These are release budgets, not measurements of the current scaffold:

| Budget                         | Gate                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Initial homepage JavaScript    | MapLibre, its CSS and geometry contribute **0 B** before the lazy gate opens                                    |
| Map renderer chunk             | maximum **250 kB gzip** JavaScript and **50 kB gzip** CSS; attach measured build output                         |
| Overview geometry              | maximum **100 kB gzip** for the nine-road overview; load higher detail only on demand                           |
| First interactive map transfer | maximum **1.5 MB** after the gate opens, including style, fonts, sprites, overview data and first visible tiles |
| Main-thread responsiveness     | no map task over **50 ms** in the tested mobile trace; INP target remains below **200 ms**                      |
| Layout stability               | map container reserves final dimensions; map contribution to CLS is **0**                                       |
| WebGL contexts                 | maximum **1** mounted context on the homepage                                                                   |

If the selected renderer cannot meet these budgets, the static experience remains the
default and a follow-up ADR must justify a revised renderer or opt-in interaction.

## Consequences

- The current change ships trustworthy road and future-project facts without a map
  dependency.
- A visually richer map cannot proceed until coordinate licensing and attribution are
  resolved.
- No-JavaScript, no-WebGL, reduced-motion and data-saver paths are part of the primary
  component contract rather than late QA variants.
- Map selection stays synchronized without turning the page or server component tree
  into client code.

## Verification

- `app/data/map-data.test.ts` locks the nine-road order, node IDs, source dates and
  absence of invented geometry.
- The same tests lock three verified future-project records, their Figma order, the
  common 2030 milestone and the continued absence of invented geometry.
- The consuming implementation must add Playwright coverage for keyboard selection,
  map-load error, context loss, reduced motion, save-data opt-in and 320–1920 px layouts.

## Official references

- [MapLibre GL JS documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [MapLibre GL JS `Map` API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/)
- [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [WAI-ARIA Authoring Practices: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
