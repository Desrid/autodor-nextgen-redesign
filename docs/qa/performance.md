# Performance report

Date: **2026-07-15**. Measurement target: mobile production build.

## Current verdict

**BLOCKED: LCP budget not met.** Последняя серия из трёх Lighthouse 13.4.0 mobile-прогонов на production build дала median Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**, CLS **0** и TBT **50 мс**. Median LCP — **2666 мс**, что выше обязательного бюджета `< 2500 мс`; merge/release не разрешён.

## Budgets

| Metric                    |                                                        Budget | Measurement                                         |
| ------------------------- | ------------------------------------------------------------: | --------------------------------------------------- |
| Lighthouse Performance    |                                                          ≥ 90 | Lighthouse mobile, median of 3 runs                 |
| Lighthouse Accessibility  | As close to 100 as practical; zero known WCAG A/AA violations | Lighthouse + axe + manual audit                     |
| Lighthouse Best Practices |                                                          ≥ 95 | Lighthouse mobile                                   |
| Lighthouse SEO            |                                                          ≥ 95 | Lighthouse mobile                                   |
| LCP                       |                                                       < 2.5 s | Lighthouse + field RUM after deployment             |
| INP                       |                                                      < 200 ms | Field RUM; lab interaction proxy only before launch |
| CLS                       |                                                         < 0.1 | Lighthouse trace + visual review                    |
| Long tasks                |      No feature-blocking long task; investigate tasks > 50 ms | Performance trace                                   |

Lighthouse lab values are environment-dependent. A single desktop run, development server run or DevTools screenshot is not accepted as evidence.

## Architecture checks

- Static headings, facts, links and fallback content render on the server.
- Map/WebGL, sliders and motion are isolated client leaves and lazy-loaded below the critical path.
- WebGL failure keeps a static road/project representation and semantic lists.
- Hero media reserves intrinsic dimensions; one intentional above-fold poster may be prioritized.
- Below-fold images use responsive AVIF/WebP candidates, `sizes`, lazy loading and mobile art direction.
- Video uses poster, `muted`, `playsinline`, pause, lazy activation and reduced-motion/data-saver fallback.
- Font loading is limited to used weights; text remains visible during load.
- Continuous motion animates `transform` and `opacity`; no React scroll-position state or raw unthrottled window scroll listener.
- GSAP contexts, observers and timers are cleaned up on unmount.
- Layout works at 320 px without horizontal page overflow.

## Resilience and loading scenarios

| Scenario            | Expected result                                                        | Automated evidence                                         |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| JavaScript disabled | Critical roads, services, news and links remain in SSR HTML            | `resilience: critical content survives without JavaScript` |
| WebGL unavailable   | Static map/list remains; content and selection controls are usable     | `resilience: no-WebGL`                                     |
| Reduced motion      | No autoplay/scrub/parallax/smooth scroll                               | `resilience: reduced motion`                               |
| Missing media       | No broken local request; semantic text and reserved frame remain       | assets + response monitor                                  |
| Slow network        | Above-fold content appears before below-fold media; no layout collapse | Manual throttled trace                                     |
| Data/API empty      | Honest empty/source-gap state; no fake records                         | requirements R04/R09/R13                                   |
| Runtime error       | No uncaught errors or console errors                                   | `resilience: console/runtime errors`                       |

## Measurement procedure

1. Run `npm run build` and `npm run start`; never measure `next dev`.
2. Use a clean Chromium profile, mobile emulation, network/CPU throttling consistent across runs.
3. Capture three Lighthouse JSON reports; report the median and preserve all raw reports under `docs/qa/lighthouse/`.
4. Inspect the LCP element, request waterfall, main-thread tasks, CLS clusters and unused JavaScript before quoting the score.
5. Repeat at 390 and 320 widths with reduced motion and WebGL disabled.
6. After deployment, collect consent-compatible field metrics for LCP, INP and CLS; do not label lab INP as field INP.

Использованная команда с Lighthouse как временным локальным audit tool:

```powershell
npx lighthouse http://127.0.0.1:3000 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=docs/qa/lighthouse/mobile-preload-1.json
```

Каждый прогон записал валидный JSON, после чего CLI вернул exit 1 из-за известного для этой Windows-сессии `EPERM` при удалении временного Chrome profile. Метрики извлечены из полностью записанных JSON; ошибка cleanup не интерпретируется как ошибка аудита и явно сохранена в журнале handoff.

## Measurement record

| Artifact                |   Perf |    A11y |      BP |     SEO | FCP, ms |  LCP, ms |  SI, ms | TBT, ms |   CLS |
| ----------------------- | -----: | ------: | ------: | ------: | ------: | -------: | ------: | ------: | ----: |
| `mobile-preload-1.json` |     97 |     100 |     100 |     100 |     930 |     2666 |     930 |      49 |     0 |
| `mobile-preload-2.json` |     97 |     100 |     100 |     100 |     908 |     2668 |     908 |      58 |     0 |
| `mobile-preload-3.json` |     97 |     100 |     100 |     100 |     907 |     2659 |     907 |      50 |     0 |
| **Median**              | **97** | **100** | **100** | **100** | **908** | **2666** | **908** |  **50** | **0** |

## Gate result

| Metric                    |          Budget |        Final median | Status       |
| ------------------------- | --------------: | ------------------: | ------------ |
| Lighthouse Performance    |            ≥ 90 |                  97 | PASS         |
| Lighthouse Accessibility  |             100 |                 100 | PASS         |
| Lighthouse Best Practices |            ≥ 95 |                 100 | PASS         |
| Lighthouse SEO            |            ≥ 95 |                 100 | PASS         |
| LCP                       |        <2500 ms |             2666 ms | **FAIL**     |
| CLS                       |            <0.1 |                   0 | PASS         |
| TBT lab proxy             | low/no blocking |               50 ms | PASS         |
| INP                       |         <200 ms | no field deployment | NOT MEASURED |

Hero video activation was deferred by 4 seconds and disabled immediately for reduced-motion/Save-Data. This reduced the earlier TBT median from 599 ms to 50 ms and raised the latest Performance median to 97. The mobile hero AVIF was additionally reduced from 72,407 to 40,787 bytes; the `mobile-390` visual regression remained green. An explicit responsive AVIF preload was added; `e2e/performance.spec.ts` confirms that the preload and `<picture>` reuse one network request without double-fetch. LCP still exceeds the contract by 166 ms, so the overall performance release gate is **BLOCKED**.

Field Core Web Vitals remain unavailable before deployment; lab Lighthouse does not provide a field INP result.
