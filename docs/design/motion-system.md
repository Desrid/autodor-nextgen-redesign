# Motion System

## Status and authority

This document defines motion behavior for the Infrastructure Atlas direction. It is subordinate to the approved Figma structure, labels, order and visibility in `docs/source-audit/figma-structure.md`. Motion cannot add a section, change a label, reorder content, make hidden content visible or conceal critical information.

Design read: a public-infrastructure service homepage for drivers and institutional audiences, using a trust-first cinematic editorial language. Motion communicates network continuity, selection, hierarchy and feedback. It is never used as a decorative technology effect.

Fixed project dials:

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 8`
- `VISUAL_DENSITY: 4`

Motion intensity 8 is concentrated in the road-network hero and one future-projects narrative. Routine reading, contacts, legal content and service access stay calm.

## Principles

1. Every animation must communicate hierarchy, storytelling, feedback or a state transition.
2. User input interrupts animation immediately. The interface never queues a long sequence after a new selection.
3. Critical copy, links, road names, controls and facts exist in semantic HTML before enhancement.
4. Main-page scrolling remains native. No smooth-scroll replacement, global scroll interception or raw `window` scroll listener is allowed.
5. Continuous animation uses `transform` and `opacity`. Layout changes use CSS layout or Motion FLIP, not frame-by-frame width or height animation.
6. Text and interactive controls do not parallax. Readability does not depend on motion timing.
7. The page uses one light theme. Video and map transitions cannot create a full-section dark-theme inversion.
8. No custom cursor, magnetic pointer, decorative coordinates, looping marquee, pulsing utility or constantly moving car is permitted.
9. No animation is allowed on the logo or order asset.
10. Reduced-motion and data-saving modes are first-class experiences, not emergency overrides.

## Ownership by technology

| Layer                                         | Owner                                        | Allowed use                                                  | Explicit exclusions                                                    |
| --------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Focus, pressed and simple hover feedback      | CSS                                          | Color, outline, opacity and short transform feedback         | No `transition: all`; no animated focus-ring travel                    |
| Slider, tabs, disclosure and shared selection | Motion                                       | Interruptible UI state transitions in isolated client leaves | No page-level provider; no continuous React state updates              |
| Road and project map camera                   | MapLibre API                                 | `fitBounds` or verified selection framing                    | No decorative orbit, fly-through or map movement on page scroll        |
| Future-project narrative                      | GSAP + ScrollTrigger                         | One desktop-only pin/scrub sequence in `1767:7508`           | No second pinned sequence; no mobile pinning; no text-splitting plugin |
| Video                                         | Native media element                         | Muted loop, controlled playback, poster-first loading        | No sound, no autoplaying slide changes, no canvas playback             |
| Basic entry observation                       | IntersectionObserver or Motion `whileInView` | Sparse one-time grouped reveals                              | No per-frame scroll state in React                                     |

Three.js and React Three Fiber are not part of this system. They require a new ADR and proof that video, CSS and MapLibre cannot achieve the required result.

## Motion tokens

Tokens are implementation contracts. Components may use a slower token only when the interaction explicitly requires it.

### Duration

| Token                         |   Value | Use                                                  |
| ----------------------------- | ------: | ---------------------------------------------------- |
| `--motion-duration-instant`   |   `0ms` | Reduced-motion state changes                         |
| `--motion-duration-press`     | `100ms` | Press acknowledgement                                |
| `--motion-duration-fast`      | `160ms` | Utility appearance, icon and focus-adjacent feedback |
| `--motion-duration-base`      | `240ms` | Disclosure, tab and service state                    |
| `--motion-duration-slow`      | `420ms` | Media and panel continuity                           |
| `--motion-duration-cinematic` | `700ms` | Rare hero media settle after readiness               |

Exit durations are 65 to 75 percent of the corresponding enter duration. Exit never blocks the next user action.

### Easing

| Token                    | CSS / Motion value              | Use                     |
| ------------------------ | ------------------------------- | ----------------------- |
| `--motion-ease-enter`    | `cubic-bezier(0.16, 1, 0.3, 1)` | Content and panel entry |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)`    | Selection continuity    |
| `--motion-ease-exit`     | `cubic-bezier(0.4, 0, 1, 1)`    | Fast outgoing state     |
| `--motion-ease-linear`   | `linear`                        | GSAP scrub only         |

Spring presets:

| Token            | Stiffness | Damping |  Mass | Use                                 |
| ---------------- | --------: | ------: | ----: | ----------------------------------- |
| `spring-control` |     `420` |    `36` | `0.8` | Button and compact control feedback |
| `spring-snap`    |     `300` |    `32` | `0.9` | Slider snap after drag              |
| `spring-layout`  |     `260` |    `30` |   `1` | Service FLIP expansion              |

Springs are disabled in reduced-motion mode. No bouncy overshoot is allowed on institutional controls.

### Distance and scale

| Token                        |   Value | Use                              |
| ---------------------------- | ------: | -------------------------------- |
| `--motion-shift-xs`          |   `4px` | Icon and compact feedback        |
| `--motion-shift-sm`          |   `8px` | Utility and tooltip entry        |
| `--motion-shift-md`          |  `16px` | Section group reveal             |
| `--motion-shift-lg`          |  `24px` | Maximum desktop narrative reveal |
| `--motion-scale-press`       |  `0.98` | Button press                     |
| `--motion-scale-media-start` | `1.015` | Subtle hero media settle         |
| `--motion-scale-adjacent`    | `0.985` | Optional gallery adjacency cue   |

No content animation may travel more than 24 px. Hero media may settle from 1.015 to 1 to hide readiness discontinuity, but never continuously zoom.

### Stagger

- Compact control group: 24 ms.
- Service row: 40 ms, maximum 160 ms total.
- Section content: 60 ms, maximum 240 ms total.
- Stagger is used only for initial hierarchy. Repeated slider navigation changes the state as a unit.

## Capability modes

The same semantic component supports four modes.

| Mode           | Activation                                                 | Media                                                     | Motion and map behavior                                                                 |
| -------------- | ---------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Full           | No reduction preference, `saveData` false, runtime healthy | Poster first, then eligible video                         | Motion transitions; one desktop future-project GSAP sequence; MapLibre enhancement      |
| Reduced motion | `prefers-reduced-motion: reduce`                           | Static poster by default; explicit play remains available | No scrub, pin, parallax, automatic media playback, smooth scrolling or spring overshoot |
| Reduced data   | `navigator.connection?.saveData === true` where supported  | Do not request video; responsive poster only              | No GSAP import; static map or lightweight list; short CSS feedback only                 |
| Degraded       | JS, media, WebGL or library failure                        | Poster or image fallback                                  | Semantic list, native controls and direct links remain complete                         |

Mode decisions are progressive enhancements. Do not guess from a device name, operating system or user agent. Runtime feature failure must downgrade locally without disabling unrelated content.

For viewport widths below 768 px, video begins on a poster with an explicit play control. If the user starts playback and data saving is off, it may loop until paused, the slide changes, the page becomes hidden or the media leaves the active state.

## Global lifecycle rules

- Pause active video when `document.visibilityState !== "visible"`.
- Pause outgoing road media before switching `src` or poster.
- Only one video may decode or play at a time.
- Cancel in-flight Motion controls when a new selection arrives.
- Recalculate GSAP measurements on font readiness, image readiness and responsive breakpoint changes, then use `ScrollTrigger.refresh()` once. Do not refresh on every resize frame.
- Never store scroll position, pointer coordinates or video current time in React state.
- Any `ResizeObserver`, `IntersectionObserver`, media listener, visibility listener or timer must be removed on unmount.
- The browser Back/Forward Cache must not resume hidden video unexpectedly. Reconcile playback state on `pageshow`.

## Choreography by block

### Header - `1767:6576`

Purpose: confirm navigation state and keep institutional access predictable.

- Header appearance is static. No entrance cascade on page load.
- Menus and search panels use opacity plus 8 px vertical shift over 160 ms.
- Focus moves into an opened modal or menu only when the component contract requires it; closing restores focus to the trigger.
- Sticky-state styling may change after the hero boundary using IntersectionObserver. It uses a 160 ms color or opacity transition and does not resize the header.
- Mobile menu opens over 240 ms without animating its height. The panel translates from its logical edge; reduced motion is instant.

### Hero and road network - `1767:7102`

Purpose: show national-network scale while preserving immediate road and service selection.

#### Initial state

1. Server-render the first verified road name, facts, link, poster and four fixed actions from `1767:7164-7167`.
2. Display the poster immediately. Video is never the LCP dependency.
3. If full mode permits playback, request only the active road video after the poster and critical content are stable.
4. On `canplay`, crossfade video opacity from 0 to 1 over 420 ms while the poster remains behind it. The media settles from scale 1.015 to 1 over 700 ms.
5. If video is unavailable after a bounded attempt or emits an error, retain the poster and expose no broken control state.

There is no hero scroll pin. The user can reach the fixed road actions without passing through a narrative sequence.

#### Road selection

All nine verified labels remain in source order:

1. `1767:7111` - М-1 «Беларусь»
2. `1767:7112` - М-3 «Украина»
3. `1767:7113` - М-4 «Дон»
4. `1767:7114` - М-11 «Нева»
5. `1767:7115` - М-12 «Восток»
6. `1767:7116` - А-113 ЦКАД
7. `1767:7117` - А-289
8. `1767:7118` - А-105 Москва-Домодедово
9. `1767:7119` - А-107 Московское малое кольцо

On a selection request:

1. Stop and reset the outgoing video.
2. Immediately update `aria-selected`, the accessible road heading and the polite selection announcement.
3. Crossfade the outgoing media to the next poster over 160 ms. The new text panel enters as a unit over 240 ms with no character or word splitting.
4. Frame the selected road through the map renderer API. Map motion lasts at most 700 ms and is skipped for reduced motion.
5. Request and play the new video only after the poster is present and the media is still the active selection.

Do not animate the slide index, name, verified facts or fixed actions off-screen. A rapid second selection cancels step 3 to step 5 and starts from the current visual state.

#### Input contract

- Previous and next buttons are always visible and at least 44 by 44 CSS pixels.
- ArrowLeft and ArrowRight move one road. Home and End move to the first and last road. Selection does not unexpectedly move focus.
- Pointer drag uses horizontal intent only after an 8 px dead zone. Commit at 48 px displacement or 0.45 px/ms release velocity, then snap with `spring-snap`.
- Native vertical page movement wins when vertical intent is greater.
- Touch uses the same semantic selection state. No content is hover-only.
- The road slider does not auto-advance. The pause control governs active background media, not slide selection.
- Pausing is persistent for the page session. Focus, hover, visibility changes and pointer-down may temporarily pause but never resume after a user-selected pause.

#### Route and map continuity

The route line changes only when selection changes. A 420 ms opacity crossfade or renderer-native route interpolation may be used when topology is compatible. Never morph unrelated SVG path commands or draw a fake route. Road geometry must come from verified geospatial data.

The map and media share the same selected road ID. They do not maintain independent indices.

#### Fallback

- Reduced motion: instant selection, poster only by default, instant map framing or static map.
- Reduced data: no video request and no GSAP bundle.
- No WebGL: static verified map image plus the complete road list.
- No JavaScript: all nine road names and destination links remain available as a semantic list; the first poster remains visible.

### Services - `1767:7168`

Purpose: reveal useful supporting information while keeping all six tasks scannable.

- Desktop hover or focus expands one item through Motion `layout` FLIP over 240 ms with `spring-layout` settling. Do not animate grid-track width frame by frame.
- Expansion begins after 80 ms of stable hover to avoid accidental pointer flyover. Focus expansion is immediate.
- The active item media, if present, scales from 1.015 to 1 while the additional copy fades in over 160 ms.
- Moving focus inside the expanded item does not collapse it.
- Pointer exit collapses after 120 ms only when focus is not inside.
- Touch uses an explicit disclosure button. First tap expands; a separate link performs navigation when needed. No hover emulation.
- At widths below 768 px, the two-row composition becomes a source-ordered disclosure list. Only transform and opacity animate; content height changes are native or instant.
- Loading, error and disabled states do not shimmer indefinitely. A skeleton shimmer, if used, stops after three cycles and is removed in reduced motion.

### Loyalty - `1767:7270`

Purpose: browse current offers without urgency or automatic pressure.

- Use native horizontal scroll snap with visible previous and next controls.
- No autoplay and no infinite loop.
- Button navigation scrolls one card group over 240 ms. Reduced motion uses instant scrolling.
- Loading uses reserved card geometry. Empty and error states enter without animation and keep the destination link available.

### News - `1767:7305` and important information - `1767:7328`

Purpose: reveal editorial hierarchy, not turn content into a showreel.

- News uses one grouped entrance when 25 percent of the bento enters the viewport: opacity and up to 16 px translate, once only, with 60 ms stagger.
- Individual news cards use only press feedback and media scale to 1.015 on hover-capable devices.
- Important information changes slides only through explicit controls. Outgoing copy fades in 120 ms; incoming copy appears in 240 ms.
- Dates, links and urgency state never animate independently.

### Media gallery - `1767:7339`

Purpose: give controlled breadth to real road and construction imagery without adding the hidden heading.

- Preserve the absent visible heading from `1767:7340-7341`.
- Use native horizontal overflow and scroll snap. Do not convert vertical wheel input into horizontal movement.
- Drag or swipe is direct manipulation. Controls scroll by one logical item and remain visible.
- A selected frame may settle from scale 0.985 to 1 over 420 ms. Avoid parallax, coverflow, tilt and hover trails.
- No autoplay, marquee or endless clone loop.
- Captions and alt text remain stable while media moves. Focused items are fully brought into view without clipping the focus ring.
- Reduced motion uses instant `scrollIntoView` or `scrollTo` behavior.

### Contacts - `1767:7368`

Purpose: communicate a clear tab state.

- The tab indicator uses a 240 ms shared-layout transition only when it does not obscure focus.
- The panel content crossfades over 160 ms. Panel height changes are not animated.
- Arrow keys, Home and End update tabs according to the accessibility contract. Manual or automatic activation must be chosen after latency testing and documented in the component.
- On mobile, the source-ordered stacked or disclosure fallback replaces lateral animation.

### Statistics - `1767:7415`

Purpose: clarify verified categories, not dramatize numbers.

- Charts may reveal once through opacity and a transform-based clipping mask over 420 ms.
- Do not count numbers up from zero. The final verified value is present immediately in text.
- Tooltip entry uses 160 ms opacity and 4 px shift. Keyboard and pointer behavior are equivalent.
- Reduced motion and print show the final chart plus the complete text/table equivalent.

### Subsidiary services - `1767:7456` and social obligations - `1767:7501`

Purpose: communicate grouping and link feedback.

- Use sparse once-only grouped reveals at 16 px maximum.
- Do not use the same stagger geometry as the news bento.
- Social-obligation panels do not swap sides, overlap or parallax. Mobile preserves Figma source order.

### Future projects - `1767:7508`

Purpose: connect three verified projects to the approved 2026-2030 timeline and map.

This is the sole GSAP-owned narrative sequence.

#### Full desktop mode

- Activation requires viewport width at least 1280 px, no reduced-motion preference, data saving off and all semantic project content already rendered.
- The outer narrative wrapper is pinned with `start: "top top"`, `pin: true`, `pinSpacing: true` and an end distance derived from the three project panels. Maximum pinned travel is three viewport heights.
- Project panels remain in DOM order and are not duplicated. Their visual layers crossfade and translate no more than 24 px as scroll progress moves between the three discrete states.
- The timeline selection changes at explicit labeled thresholds. Years 2026-2030 remain readable at all times and never act as invented project dates.
- Map selection changes only at the discrete project thresholds. MapLibre owns camera movement; GSAP never animates canvas or map coordinates.
- The final state releases the pin cleanly before the footer region.

The sequence must be abandoned if it produces layout instability, delays access to the footer, traps keyboard navigation or exceeds the mobile performance budget. A CSS sticky map with normally scrolling project cards is the preferred fallback and is acceptable as the production choice.

#### GSAP lifecycle contract

- Implement in one dedicated client leaf such as `FutureProjectsNarrative.client.tsx`.
- Dynamically import GSAP and ScrollTrigger only after capability checks pass and the section approaches the viewport.
- Register ScrollTrigger once inside the client module.
- Create all tweens and triggers inside `gsap.context(() => { ... }, rootRef)`.
- Use `gsap.matchMedia()` for the 1280 px condition and call both match-media revert and context revert on unmount.
- Kill pending tweens, observers and delayed calls during cleanup.
- Use `invalidateOnRefresh: true`; derive end distance from measured content, not a magic pixel count.
- Do not call React state setters on every `onUpdate`. Use threshold callbacks for three discrete selections, Motion values outside React render, or direct DOM transforms within the scoped context.
- `scrub` may be `0.6` to `1`; continuous easing is `none`.
- Do not use SplitText, MorphSVG or another licensed plugin without a separate license ADR.

#### Tablet, mobile and fallback

- Below 1280 px: no pin and no GSAP import. Map may be sticky through CSS only where it does not create a nested scroll region.
- Below 768 px: project cards and timeline are a single source-ordered column. Map is static or opens as an explicit optional enhancement.
- Reduced motion, reduced data, no WebGL and JS failure: three project cards, the 2026-2030 timeline and static map remain fully available.

### Footer - `1767:7539`

The footer has no cinematic entrance. Government logos, legal links and contact information are stable. Link feedback uses the standard 160 ms token. The future-project pin must always release before the footer can enter the viewport.

### Floating utilities - `1767:9223` and `1767:9225`

Purpose: provide persistent utility without competing with content.

- Back to top and chat use a fixed dock that respects safe-area insets and never overlaps cookie, media or form controls.
- The dock appears after the hero boundary with opacity and 8 px translate over 160 ms. It hides or repositions when the footer intersection would create a collision.
- No bob, bounce, glow, pulse or attention loop.
- Back to top uses smooth scrolling only in full mode. Reduced motion moves instantly. After activation, focus is placed on the main page heading or the top landmark according to the tested focus strategy.
- Chat opens its FAQ-first panel over 240 ms and moves focus into the dialog. Closing restores focus to the chat trigger. The forbidden visible label is not introduced.
- On mobile, utilities remain at least 44 by 44 CSS pixels and are stacked with an 8 px gap above `env(safe-area-inset-bottom)`.

### Car preview states - requirement 16

The two preview states are presentation variants, not continuous animation modes.

- `with-car`: a static, clearly non-system pointer marker may sit beside the approved heading or route selection. It must not follow the pointer, replace the OS cursor, travel during scroll, cover text or imply map position.
- `without-car`: identical layout and functionality with the marker omitted.
- A one-time 160 ms opacity entry is allowed in full mode. Reduced motion is static.
- Tests compare both states at 1440, 390 and 320 px and verify no focus, hit-target or text obstruction regression.

## Media playback contract

Every road loop and future media implementation must provide:

- `muted`, `playsInline`, `loop` and no audio track in the encoded file;
- an explicit pause/play control with a stable accessible name;
- a responsive AVIF poster and WebP fallback;
- no preload beyond `metadata` until the road becomes active, with `preload="none"` preferred for inactive roads;
- a visible poster while the video is not ready or cannot play;
- pause on hidden page, outgoing slide, user pause, media error and component unmount;
- no automatic resume after a user pause;
- no request in reduced-data mode;
- captions or a concise equivalent description if a video conveys information beyond atmospheric movement.

Atmospheric loops contain no unique factual information, so the poster alt text and road copy carry the meaning. If documentary footage contains information that is not present in the surrounding copy, provide a transcript or equivalent description.

## Responsive motion matrix

| Viewport | Hero                                            | Services                           | Gallery                 | Future projects                             | Utilities                 |
| -------: | ----------------------------------------------- | ---------------------------------- | ----------------------- | ------------------------------------------- | ------------------------- |
|     1920 | Poster-to-video, full controls, no hero pin     | Two-row FLIP expansion             | Native wide rail        | Eligible GSAP narrative                     | Fixed dock                |
|     1440 | Same with shorter travel                        | Two-row FLIP expansion             | Native rail             | Eligible GSAP only if measured content fits | Fixed dock                |
|     1024 | Poster-to-video, compact controls               | Focus/hover plus touch disclosure  | Native rail             | No GSAP; CSS sticky optional                | Fixed dock                |
|      768 | Poster-first, explicit mobile control if needed | Source-ordered disclosure          | Native rail             | No pin; list plus map                       | Collision-aware dock      |
|      390 | Poster default, user-started video only         | One-column disclosure              | Native swipe/controls   | Static map plus cards                       | Safe-area stack           |
|      375 | Same                                            | Same                               | Same                    | Same                                        | Same                      |
|      320 | Poster default, no clipped controls             | One-column, no horizontal overflow | One full focusable item | Text-first list                             | 44 px targets, no overlap |

## Performance budgets

- No motion library is required for server rendering or first meaningful content.
- GSAP and ScrollTrigger are excluded from the initial route chunk and are imported only near `1767:7508` when eligible.
- At most one video decodes at a time. Inactive road videos have no active `src` request where practical.
- Do not apply blur, grain or filter animation to scrolling media. Any static grain belongs to a fixed pointer-events-none layer and must pass repaint profiling.
- No single scroll task should exceed 50 ms on the target mobile profile.
- Motion must not worsen LCP beyond 2.5 s, INP beyond 200 ms or CLS beyond 0.1.
- Reserve all media, map and async panel dimensions before load.
- Remove `will-change` after finite animations; never set it on the page or long scrolling sections.

## Acceptance tests

### Automated

- Unit test capability-mode resolution for full, reduced motion, reduced data and degraded cases.
- Component test that rapid road changes leave exactly one selected road and no playing inactive video.
- Component test that user pause is not overridden by focus, hover or visibility changes.
- Keyboard tests for Arrow keys, Home, End, pause/play, gallery controls, service disclosure, tabs and floating utilities.
- Playwright test with `reducedMotion: "reduce"` proving no GSAP pin, no smooth scroll and no automatic video playback.
- Playwright test stubbing `navigator.connection.saveData` proving video and GSAP modules are not requested.
- Media error and WebGL failure tests proving posters, road links, project list and static map remain.
- Assert no raw `window.addEventListener("scroll", ...)` in motion components.
- Assert all GSAP contexts and observers are removed after route navigation.

### Visual and manual

- Review all required viewports: 1920, 1440, 1024, 768, 390, 375 and 320 px.
- Test keyboard-only reading through the full page while the future-project sequence is enabled.
- Test 400 percent zoom and browser text enlargement with no pinned-content obstruction.
- Test mid-tier mobile hardware for dropped frames, long tasks and accidental horizontal overflow.
- Verify every focus ring remains visible during and after transforms.
- Verify no video seam flashes, poster mismatch or white frame appears between road selections.
- Verify floating utilities never overlap the footer, chat panel, media pause or primary actions.
- Compare car and no-car preview states at desktop and phone widths.

## Release gates

Motion is not release-ready if any of the following is true:

- a road, fact, link or project is hidden behind playback, WebGL or GSAP;
- the road slider auto-advances or cannot be paused;
- the future-project sequence pins on reduced motion, reduced data, mobile or keyboard zoom layouts;
- more than one pinned narrative exists;
- an inactive video continues playing or decoding;
- smooth scrolling remains active under reduced motion;
- a service relies on hover;
- the gallery hijacks vertical scroll;
- a floating utility pulses, collides with content or lacks focus restoration;
- GSAP, observers, timers or media listeners leak after navigation;
- any animation changes approved structure, copy, visibility or source order.
