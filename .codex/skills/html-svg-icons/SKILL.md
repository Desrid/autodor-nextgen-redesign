---
name: html-svg-icons
description: Create, validate, optimize, and visually review consistent inline SVG UI icons in this React/Next.js repository. Use for new or changed interface pictograms; do not use for logos, illustrations, raster assets, or externally sourced icon packs.
---

# HTML SVG icons

Create UI icons as repository-owned vector code and keep them consistent with the existing `app/components/icons` catalog. Never use graphic editors, external AI services, PNG, raster-to-vector conversion, data URIs, SVG strings, or `dangerouslySetInnerHTML`.

## Workflow

1. Search `ACTION_ICONS`, `ICONS`, and nearby call sites for a semantic or visual equivalent. Reuse or extend it instead of creating a duplicate.
2. Read the contract below and the current `Icon.tsx` implementation. Add ordinary outline pictograms to `ACTION_ICONS`; use a separate component only when its API genuinely cannot fit the catalog, and export it from `app/components/icons/index.ts`.
3. Keep the geometry minimal, centered, and readable at 16 px. Do not add decorative strokes that do not change meaning.
4. Run formatting/linting and `npm run icons:check:file -- <path>` while iterating.
5. Run `npm run icons:optimize -- <path>` only for a standalone `.svg`. The optimizer preserves `viewBox`, accessibility, stroke semantics, and readable path data. TSX geometry is deliberately not rewritten.
6. Run `npm run icons:check` and `npm run icons:visual`. Inspect the generated `icon-showcase.png` under the ignored `test-results/` directory.
7. Report changed files, the icon's intended meaning, commands run, and any remaining visual uncertainty.

## SVG contract

- `viewBox` is exactly `0 0 24 24`.
- Outline icons use `fill="none"`, `stroke="currentColor"`, `strokeWidth={1.75}`, `strokeLinecap="round"`, and `strokeLinejoin="round"`.
- Rendered geometry, including half the stroke, stays inside the 2..22 safe area on both axes.
- Reusable components do not hardcode `width` or `height`; accept size through props, CSS, or a container.
- Do not use `<text>`, `<image>`, `<foreignObject>`, `<filter>`, `<mask>`, `<clipPath>`, `<linearGradient>`, or `<radialGradient>`.
- Do not use base64/data URIs, external URLs, inline `style`, random colors, or transforms. If a transform seems necessary, author the final coordinates instead.
- Use only enough paths and details to communicate the meaning. Keep optical stroke weight, round joins, and round caps consistent across the set.

The validator accepts React attribute spellings, recursively checks `.svg` and `.tsx`, reports `file:line [rule]`, and exits nonzero on violations. It verifies primitive bounds exactly and path bounds by parsing SVG path commands; arc bounds are sampled conservatively.

## Accessibility

- Decorative icons have `aria-hidden="true"` and `focusable="false"`.
- A meaningful standalone icon receives its accessible name through the component's `label` prop (or one nonconflicting `<title>`/`aria-label` in a standalone component).
- Never combine `aria-hidden` with `title` or `aria-label`, and never create competing `title` and `aria-label` values.
- An icon-only button owns its accessible name at button level, for example `<button aria-label="Закрыть">…</button>`.

The shared component implements these states:

```tsx
<Icon name="close" size={20} />
<Icon label="Закрыть панель" name="close" size={20} />
<button aria-label="Закрыть" type="button">
  <Icon name="close" size={20} />
</button>
```

To add a catalog icon, follow the existing definition shape:

```tsx
export const ACTION_ICONS = {
  // existing definitions
  routePoint: {
    group: "Маршрут",
    label: "Точка маршрута",
    paths: <path d="M12 3.5v17M5.5 12h13" />,
  },
} as const satisfies Record<string, InlineIconDefinition>;
```

## Commands

```bash
npm run icons:check
npm run icons:check:file -- app/components/icons/Icon.tsx
npm run icons:optimize -- path/to/Icon.svg
npm run icons:visual
```

`icons:visual` reuses or starts the shared preview on port 3001, opens `/icon-showcase` in headless Chromium, checks console/page errors, and writes a reproducible screenshot artifact without a pixel snapshot baseline. Standalone SVG optimization requires the optional `svgo` dev dependency; the current TSX catalog does not.

## Generation request template

```text
Создай outline-иконку [ИМЯ] для [СМЫСЛ/СЦЕНАРИЙ].
Стиль: 24×24, stroke 1.75, round linecap/linejoin, currentColor.
Она должна быть различима в 16 px.
Используй существующие паттерны набора и не добавляй лишних деталей.
```

## Completion checklist

- Existing analog searched; no duplicate introduced.
- Geometry is centered, sparse, safe at 16 px, and inside 2..22 with stroke.
- SVG and accessibility contracts pass for the changed file and full set.
- Formatter, lint, relevant unit tests, and typecheck pass.
- Visual showcase passes at 16/20/24 px on light/dark backgrounds and in button/text contexts.
- Only ignored directories contain screenshots and browser artifacts.
