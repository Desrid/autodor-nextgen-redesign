# Design Read

## One-line read

Reading this as: a full visual overhaul of a public-infrastructure service homepage for drivers and institutional audiences, with a trust-first cinematic editorial language, leaning toward a custom semantic system on Next.js, not a decorative technology showcase.

## Mode and constraints

Mode: redesign-overhaul. The visual language may be rebuilt from zero, while approved information architecture, labels, visibility and order remain unchanged.

The quiet constraint that governs every aesthetic choice is public accessibility. A driver on a weak mobile connection, a keyboard user, a partner looking for documents and a journalist checking facts must all reach the same verified content. Immersion is allowed only when it strengthens orientation, scale or confidence.

### Fixed dials

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 8`
- `VISUAL_DENSITY: 4`

Variance 8 applies to section composition and media cropping, not to content order or navigation predictability. Motion 8 applies to a few high-value transitions, not to every card. Density 4 keeps service access direct and gives major infrastructure media enough space.

## Audience jobs

| Audience                       | Primary job                                                | Design response                                                                                   |
| ------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Driver                         | Find a road, calculate or pay, understand current offers   | Fast header access, road-to-map synchronization, direct service labels, resilient mobile controls |
| Partner and supplier           | Reach procurement, SME support, subsidiaries and contacts  | Stable navigation, clear institutional groupings, real URLs, no motion gate                       |
| Investor and state institution | Understand network scale, projects and verified statistics | Evidence-first data treatment, accessible charts, source-linked facts                             |
| Media                          | Find current news, important information and media         | Clear dates, bento hierarchy without text overload, direct source links                           |
| Broad public                   | Understand social obligations and contact the company      | Plain language, predictable reading order, FAQ-first chat, high contrast                          |

## Art direction A: Infrastructure Atlas

Recommended.

### Core idea

The page behaves like a living national road atlas. Large aerial and ground-level infrastructure media establish scale. A disciplined editorial grid and clear service actions keep the experience credible. The route line is a functional connective device used in maps, slider progress and project chronology, never as decorative coordinates.

### Visual grammar

- One consistent light theme with white, `#E8E8E8` and the confirmed cool-gray scale as supporting surfaces.
- Brand orange `#FF5100` carries route, selection and controlled focus hierarchy. It is not a default small-text button background.
- Brand black `#2D2A26` carries all essential text and routine primary actions.
- Large asymmetric media crops balanced by strict text columns.
- Montserrat Bold leads headings; Montserrat Regular carries body copy. Arial Regular and Arial Italic stay in the supporting roles documented by the brandbook.
- Map and media share selection state, but critical content remains in semantic HTML.
- Photography shows real roads, construction, bridges, tunnels, landscape and people at useful working scale.
- Sparse boundaries, minimal elevation, no glass layer on routine controls.

### Section rhythm

- Hero: asymmetric media and road network selector, with actions visible in the initial viewport.
- Services: two-row expanding system with six exact items; touch uses explicit disclosure.
- Loyalty: horizontal offer rail with visible controls and quiet status.
- News: five-item bento with one dominant verified story and four supporting items.
- Important information: one large, calm institutional announcement without false urgency.
- Gallery: full-bleed horizontal media rail without an invented heading.
- Contacts: accessible tab system over an institutional directory layout.
- Statistics: editorial figures plus restrained charts and text alternatives.
- Subsidiary services: non-news bento based on service categories, never empty cells.
- Social obligations: two balanced commitments, stacked in source order on mobile.
- Future projects: map plus semantic timeline, with list and static-map fallback.
- Footer: dense but ordered institutional grid with consistent government-logo alignment.

### Motion language

- Road selection morphs the route highlight and crossfades media to communicate geographic continuity.
- One justified pinned sequence may be used in the hero or future-projects block, not both by default.
- Section entry uses subtle grouped reveals; routine reading content does not float or parallax.
- Motion collapses to instant state changes and posters under reduced motion.

### Risk controls

- Route-line motifs cannot become fake technical decoration.
- Aerial media cannot reduce legibility or dominate service tasks.
- Map and video are progressive enhancements, never content gates.

## Art direction B: Cinematic Road Journal

Alternative.

### Core idea

The page is a premium editorial journey through the road network. Full-width filmic media, strong typographic pacing and chapter-like transitions emphasize the human and engineering story of infrastructure.

### Visual grammar

- Light editorial canvas with large full-bleed media intervals.
- Typography leads more sections; the map appears as a precise functional counterpoint.
- Media sequencing favors ground-level travel, construction detail and changing geography.
- Section transitions feel like cuts between documentary chapters.
- Controls remain conventional and high contrast even when placed near media.

### Strengths

- Strong emotional perception of scale and movement.
- Excellent platform for original video and photography.
- Clear distinction from a typical government portal.

### Risks

- More dependent on consistently excellent media production.
- Higher LCP and mobile data risk.
- Editorial pacing can delay urgent service access.
- Repeated full-bleed chapters can flatten functional differences between blocks.

## Internal comparison

| Criterion                              | Infrastructure Atlas        | Cinematic Road Journal                               |
| -------------------------------------- | --------------------------- | ---------------------------------------------------- |
| Driver task speed                      | Strongest                   | Adequate if shortcuts remain persistent              |
| Institutional trust                    | Strongest                   | Strong, but media quality becomes a trust dependency |
| Map integration                        | Native to the whole concept | Concentrated in map-specific blocks                  |
| Accessibility resilience               | Strongest                   | Requires more aggressive media fallbacks             |
| Performance resilience                 | Stronger                    | Higher media and sequencing cost                     |
| Premium expression                     | Precise and technological   | More emotional and editorial                         |
| Compatibility with fixed varied blocks | Strongest                   | Risk of repeating chapter compositions               |

## Recommendation

Proceed with Infrastructure Atlas. Borrow only the documentary photography discipline and carefully selected cinematic cuts from Cinematic Road Journal. Do not combine both into alternating theme sections. The page keeps one light theme and one visual system.

### Confirmed brand expression

- Primary accent: Pantone Orange 021 C, `#FF5100`.
- Primary dark: Pantone Black C, `#2D2A26`.
- Supporting scale: `#97999C`, `#B1B3B6`, `#D1D3D4`, `#E8E8E8`.
- Headings: Montserrat Bold.
- Body: Montserrat Regular.
- Supporting subheadings and running header/footer roles: Arial Regular.
- Leads, callouts and notational roles: Arial Italic.

The page stays light. Dark `#2D2A26` may be used for controls and text, but not for a full section theme inversion.

White text on orange reaches only `3.27:1`; dark text on orange reaches `4.37:1`. Neither passes `4.5:1` for normal-size text. Use `#2D2A26` actions with white labels (`14.28:1`) and reserve orange for large text, route lines, focus on white, icons and selected outlines that require `3:1` non-text contrast.

The extracted PDF does not define the order treatment, a full photo style or a digital component system. Use the approved Figma order asset without reconstruction, and treat the media/digital direction in this document as a project design decision rather than a brandbook rule. OQ-001 and OQ-002 remain unchanged.

## Anti-slop controls

- No centered dark gradient hero.
- No AI-purple, cyberpunk HUD, decorative coordinates, random glow or fake engineering labels.
- No custom cursor and no car used as a cursor.
- No repeated three-equal-card rows.
- No identical bento composition for news and subsidiary services.
- No hover-only expansion.
- No fake numbers or urgency.
- No decorative scroll prompt, section numbering or repeated eyebrow labels.
- No div-built fake UI or generic stock stand-ins.
- No motion without a hierarchy, feedback, storytelling or state-transition purpose.
