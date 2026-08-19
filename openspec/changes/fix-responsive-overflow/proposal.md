## Why

Live QA on 2026-08-17 found root-level horizontal overflow on the mobile home
page and the desktop account page. This conflicts with the Autodor responsive
contract and makes parts of the UI inaccessible without horizontal page scrolling.

## What Changes

- Prevent home-page horizontal rails from increasing the document scroll width at
  a 390px viewport while preserving their intended internal scrolling behavior.
- Keep `/account` license-plate status content inside the desktop workspace at a
  1440px viewport.
- Add focused browser regression checks for both verified overflow cases.

## Capabilities

### New Capabilities

- `responsive-layout`: The responsive layout keeps visible page content within the document viewport while explicit component rails retain local scrolling.

### Modified Capabilities

Нет.

## Impact

- Expected implementation scope: home rail styles/components and `app/account/page.css`.
- No API, content-model or dependency change is expected.
