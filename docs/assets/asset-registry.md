# Asset Registry

## Scope and status legend

This registry covers project-bound generated raster media for the **Infrastructure Atlas** direction. These images are original AI-generated source assets; they are not official photographs of a named road, project or location and must not be used as factual evidence. They contain no official logo reconstruction.

Status values:

- `source generated`: project-local master exists, but delivery formats and crops are pending;
- `optimized`: responsive AVIF/WebP derivatives and crops exist;
- `blocked`: a source or rights requirement prevents use.

## Official identity exports from Figma

The files below come directly from the user-approved Figma source `MBbnwSbrgu3uv4Nb2TFNmY`. The footer assets were exported as editable SVG from their exact source nodes on 2026-07-17; they are used as supplied and are not manually reconstructed.

| Purpose                                   | Figma node-id | Repository file                            | Size                       | SHA-256                                                                                                                                                            | Status                                                     |
| ----------------------------------------- | ------------- | ------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Header logo with order                    | `1767:6578`   | `public/brand/autodor-logo-with-order.png` | `287 x 40`, `10,312` bytes | `0f4a5c22737b6c94c269e691c7940a2a22e79911b671e8f15ff7061f3537696b`                                                                                                 | Exported; preserve aspect ratio and clear space            |
| Footer logo without order                 | `1767:7543`   | `public/brand/autodor-logo-footer.svg`     | `241 x 38`, `16,433` bytes | `edcb2bb68620ac9ee5267276ea10eb9e7fe1232b96b1fe2c742c0459e1da1f0e`                                                                                                 | Exact SVG export; preserve the Figma crop and aspect ratio |
| Future-projects static map fallback       | `1767:7518`   | `public/brand/autodor-network-map.svg`     | `1600 x 760`, vector       | Re-drawn from `https://russianhighways.ru/about/` official development-network map; labels and legend retained; presentation fallback only, not navigation geodata |
| Rutube footer button                      | `1767:8067`   | `public/brand/social-rutube.svg`           | `48 x 48`, `1,040` bytes   | `32fdd554afc233becafa7a643985dbfa3ba12f485c250ea2f65df82f86fb4409`                                                                                                 | Exact SVG export for the first visible social slot         |
| VK footer button                          | `1767:8071`   | `public/brand/social-vk.svg`               | `48 x 48`, `1,996` bytes   | `70866b9be7d7bbfedd38b8969f9692f45200c286583653621fc4736d32d28f92`                                                                                                 | Exact SVG export for the second visible social slot        |
| OK footer button                          | `1767:8075`   | `public/brand/social-ok.svg`               | `48 x 48`, `1,807` bytes   | `928518a7d99e12d0a6cc6c2a5ea80e2da082240ca5f2bda65e405ae3eee2f55c`                                                                                                 | Exact SVG export for the third visible social slot         |
| MAX footer button                         | `1767:8082`   | `public/brand/social-max.svg`              | `48 x 48`, `1,086` bytes   | `305f59a6a0512f9262a7aaaf54aaead9aa5114df62218a4217360c6d00a8092f`                                                                                                 | Exact SVG export for the fourth visible social slot        |
| Government of the Russian Federation mark | `1767:8087`   | `public/brand/government-rf.svg`           | `72 x 64`, `36,084` bytes  | `13d827ee74d4b1d8e6ad5a69afb4fca63942070239f7211e5c8d19e8361a0274`                                                                                                 | Exact SVG export for the footer government row             |
| Ministry of Transport emblem              | `1767:8250`   | `public/brand/mintrans-rf.svg`             | `59 x 64`, `269,481` bytes | `b7fb9505bb9b2e88ee3f8368831d9dfacfea8e8b0f430c6ba790978285bfde5e`                                                                                                 | Exact SVG export for the footer government row             |
| Construction Complex of Russia mark       | `1767:9203`   | `public/brand/construction-rf.svg`         | `103 x 64`, `12,817` bytes | `867eec780d75b74ef0cbf89425fa21ae704aba45092e21af61372993cb002547`                                                                                                 | Exact SVG export for the footer government row             |

## Generated raster sources

| ID          | Purpose                                                         | Source and rights                                                                                                                                                                                                                                         | Prompt and settings                                                                                 | Original size                                                                              | Final formats and crops                                       | Poster                         | Alt text                                                                            | Optimization status                                                                |
| ----------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `media-001` | Hero / road-network atmospheric source: federal motorway aerial | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/federal-highway-aerial-hero.md`; built-in mode; wide landscape composition requested | `1713 x 918` PNG, `2,720,488` bytes; `public/media/source/federal-highway-aerial-hero.png` | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Desktop AVIF `960` derivative  | A modern divided motorway crossing a broad forested landscape, viewed from above.   | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-002` | Gallery / infrastructure feature: bridge and viaduct            | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/bridge-viaduct.md`; built-in mode; wide landscape composition requested              | `1536 x 1024` PNG, `2,540,377` bytes; `public/media/source/bridge-viaduct.png`             | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | A long motorway bridge crosses a broad river between wooded banks.                  | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-003` | Gallery / road-network feature: tunnel portal                   | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/tunnel-portal.md`; built-in mode; wide landscape composition requested               | `1536 x 1024` PNG, `3,401,834` bytes; `public/media/source/tunnel-portal.png`              | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | A divided motorway approaches two modern tunnel portals in a forested rock cutting. | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-004` | Gallery / construction story: active motorway works             | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/road-construction.md`; built-in mode; wide landscape composition requested           | `1672 x 941` PNG, `2,733,771` bytes; `public/media/source/road-construction.png`           | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | Road-building machinery and a small crew work on a new motorway carriageway.        | **Optimized**; visual scene review passed; responsive derivative manifest recorded |

### News card sources — Figma `1767:7305`

The five images below were generated for the five source-verified news records on 2026-07-17. They are contextual images, not documentary photographs of the reported people, locations or events. The UI does not show a media-type label; the alternative text and this registry preserve the non-documentary status where a location or named event could otherwise be inferred.

| ID         | News context                      | Repository file                                      | Prompt file                                          | Bytes       | SHA-256                                                            |
| ---------- | --------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `news-001` | Government infrastructure meeting | `public/media/news/government-meeting-patriotic.png` | `prompts/media/news-government-meeting-patriotic.md` | `1,814,327` | `b788ef07d53a76fdb5f73366635dafb0a9ccfdaed476146c5a2dd80756385831` |
| `news-002` | Perm regional road development    | `public/media/news/perm-development.png`             | `prompts/media/news-perm-development.md`             | `2,531,696` | `f2f592652b2eda2d1ae98238f859449d0f7c42b2ef182d3ff441dda2ccc8fa95` |
| `news-003` | MADI engineering graduates        | `public/media/news/madi-graduates.png`               | `prompts/media/news-madi-graduates.md`               | `1,828,525` | `1aacc4514fef6f87e5b38ed88823b0389610b3853fe5d0da8f4f5a7bd1c68638` |
| `news-004` | Pskov roadside tourism services   | `public/media/news/pskov-roadside.png`               | `prompts/media/news-pskov-roadside.md`               | `2,847,094` | `33638aff7ca727574f824a8e5e07d23d7fae367edbf09b02225d5fa66054388e` |
| `news-005` | Ring-road traffic volume          | `public/media/news/ckad-traffic.png`                 | `prompts/media/news-ckad-traffic.md`                 | `2,829,111` | `9f01d641ee646260f38c371bf9eb1ef5565805d06b8c3ea3ef343e4d01356be3` |

The earlier `public/media/news/government-meeting.png` source is retained as a superseded, unreferenced version; the current first card uses `government-meeting-patriotic.png`.

## Loyalty rail card imagery

The six images below are original AI-generated contextual photographs for `1767:7270`; they are not factual depictions of an offer, named road, T-pass device or payment infrastructure. They retain the shared no-logo/no-text constraint and are served through Next Image with responsive `sizes`.

| Card              | Repository file                                       | SHA-256                                                            | Alt text                                                          |
| ----------------- | ----------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `large-families`  | `public/media/loyalty/large-families-road-trip.png`   | `BDA94BEFFE34C862E99148001FA16E2C9BE942302EFEB6B9C651C6B6E144A5B4` | Автомобиль едет по скоростной дороге среди лесистых холмов.       |
| `bonus-discount`  | `public/media/loyalty/bonus-discount-transponder.png` | `D15842CB0830A33ACE1B04EEA6015ED99961F63155AA3C60BF304ADF281ED63F` | Транспондер в салоне автомобиля на фоне пункта оплаты.            |
| `earn-points`     | `public/media/loyalty/earn-points-motorway.png`       | `E5EEC1E25D2A321F361CB0023C3E5A9CFD0B70BE0E2ED5762852524B68888EBA` | Вид сверху на многополосную дорогу среди зелёного леса.           |
| `discount-levels` | `public/media/loyalty/discount-levels-console.png`    | `CA9A6D6DF9E86423E6397DA112FD1A12EEEFA709658AF721EAA73179D58230B2` | Транспондер и банковская карта на центральной консоли автомобиля. |
| `flexible-period` | `public/media/loyalty/flexible-period-road-trip.png`  | `80A6EB8B844FE4E0ADB998405A97BE963193A2FDE29A86B042BBE0B4C6959C13` | Автомобиль у зоны отдыха рядом со скоростной дорогой.             |
| `points-lifetime` | `public/media/loyalty/points-balance-dashboard.png`   | `E45AD5D941F1652180C0DB850443499085D88F92895D74DC08B744C8C9617905` | Вид из автомобиля на вечернюю скоростную дорогу.                  |

Prompt set: `prompts/media/loyalty-program.md`.

## Source master checksums

| File                                                  | SHA-256                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `public/media/source/federal-highway-aerial-hero.png` | `845b44ebf3e762447d80e8f8cffe4f9c3f18dc03cd5175d5209ecd8c886dfb58` |
| `public/media/source/bridge-viaduct.png`              | `c336ac979144597b1f5957f18f78cecc5750028d465be403b9a3c71e15a03def` |
| `public/media/source/tunnel-portal.png`               | `c1edf7aa313f188e22e41897e1db76240a98c6391449c59722d4819ae4968c98` |
| `public/media/source/road-construction.png`           | `ea400fd3b275521c6340c51ee2179d151c9227be02024e2368f88328dafe24b5` |

## Non-destructive crop candidates

Coordinates are measured in source pixels as `x, y, width, height`. They are QA starting points, not generated derivatives. Every proposed mobile crop was visually checked to retain the main infrastructure subject; final crops still require responsive-layout review with real UI overlays.

| Source                            | Desktop wide candidate          | Mobile 4:5 candidate |
| --------------------------------- | ------------------------------- | -------------------- |
| `federal-highway-aerial-hero.png` | `40, 0, 1632, 918` (`16:9`)     | `490, 0, 734, 918`   |
| `bridge-viaduct.png`              | `0, 80, 1536, 864` (`16:9`)     | `359, 0, 819, 1024`  |
| `tunnel-portal.png`               | `0, 80, 1536, 864` (`16:9`)     | `359, 0, 819, 1024`  |
| `road-construction.png`           | `0, 0, 1672, 941` (near `16:9`) | `460, 0, 753, 941`   |

## Optimized delivery manifest

- Encoder: Sharp/libvips; AVIF quality `55`, effort `4`; the mobile hero LCP derivatives use AVIF quality `42` after visual review (`720` derivative: `40,787` bytes); WebP quality `80`, smart subsampling enabled.
- Output: `48` responsive derivatives across four source images, two aspect directions, three widths and two formats.
- Largest generated AVIF: `161,588` bytes; largest generated WebP: `234,634` bytes.
- Machine-readable dimensions, file sizes and SHA-256 checksums: `public/media/optimized/manifest.json`.
- Reproducible command: `node .tools/optimize-media.mjs`.

## Road hero motion loops

These nine six-second, silent `960 x 540`, 24 fps loops are project-created motion derivatives of the generated raster masters above. They use a restrained horizontal camera move and are **not documentary footage of the named road**. The active road receives one loop; posters and all critical text remain available when video, JavaScript, data saving or motion are disabled.

| Road / file stem | Generated master                  | Final formats                               | Poster                                       | Alternative / factual treatment                                  | Status    |
| ---------------- | --------------------------------- | ------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- | --------- |
| `m-1`            | `federal-highway-aerial-hero.png` | VP8 WebM `154,910` B; H.264 MP4 `185,749` B | matching optimized hero picture              | video is decorative; poster states that the scene is generalized | Optimized |
| `m-3`            | `road-construction.png`           | VP8 WebM `145,989` B; H.264 MP4 `162,599` B | matching optimized road-construction picture | video is decorative; poster states that the scene is generalized | Optimized |
| `m-4`            | `bridge-viaduct.png`              | VP8 WebM `138,038` B; H.264 MP4 `142,915` B | matching optimized bridge picture            | video is decorative; poster states that the scene is generalized | Optimized |
| `m-11`           | `federal-highway-aerial-hero.png` | VP8 WebM `152,964` B; H.264 MP4 `182,430` B | matching optimized hero picture              | video is decorative; poster states that the scene is generalized | Optimized |
| `m-12`           | `tunnel-portal.png`               | VP8 WebM `141,593` B; H.264 MP4 `174,858` B | matching optimized tunnel picture            | video is decorative; poster states that the scene is generalized | Optimized |
| `a-113`          | `bridge-viaduct.png`              | VP8 WebM `146,289` B; H.264 MP4 `142,794` B | matching optimized bridge picture            | video is decorative; poster states that the scene is generalized | Optimized |
| `a-289`          | `road-construction.png`           | VP8 WebM `153,995` B; H.264 MP4 `170,120` B | matching optimized road-construction picture | video is decorative; poster states that the scene is generalized | Optimized |
| `a-105`          | `federal-highway-aerial-hero.png` | VP8 WebM `154,910` B; H.264 MP4 `185,749` B | matching optimized hero picture              | video is decorative; poster states that the scene is generalized | Optimized |
| `a-107`          | `tunnel-portal.png`               | VP8 WebM `147,909` B; H.264 MP4 `175,982` B | matching optimized tunnel picture            | video is decorative; poster states that the scene is generalized | Optimized |

Prompt and motion intent: `prompts/media/video-prompts.md`. Reproduction: `node .tools/prepare-video-sources.mjs`, then `node .tools/create-road-loops.mjs <ffmpeg>` and `node .tools/transcode-road-mp4.mjs <full-ffmpeg>`. WebM was encoded with the Playwright-provided FFmpeg/libvpx build (`LGPL-2.1` distribution); MP4 was transcoded with the untracked `@ffmpeg-installer/win32-x64@4.1.0` development binary (`GPLv3`, libx264). Encoder binaries are not committed or shipped with the site.

### Motion loop checksums

| File                            | SHA-256                                                            |
| ------------------------------- | ------------------------------------------------------------------ |
| `public/media/video/a-105.mp4`  | `439c0d0d32aa9256476132f1963bc5113d26aadd88c59cfb7dfbe5a5bd9fb5fa` |
| `public/media/video/a-105.webm` | `781cd6395daa8e329534b19bafcafc67a2bac58c337f969e063a60acbae55ec4` |
| `public/media/video/a-107.mp4`  | `90f3470e5edc1e3bdbb32053878775ce2fcacdec4ca59d4dbec015d0fb59a24d` |
| `public/media/video/a-107.webm` | `787bc412d42ed9509c03bf9fb785d06f39f47ef7cb7ba8c43e465cd325d0c584` |
| `public/media/video/a-113.mp4`  | `6aca64c5e0bd38f2f2b22a86b698114072110b6e7ba9b63a87910982c22da1e0` |
| `public/media/video/a-113.webm` | `44b3ece5f1c7f1f50f6d75564426beaee12398f9215622f2e27e7788e9b5fd33` |
| `public/media/video/a-289.mp4`  | `7353a91a78f3a3811c0fc6d8e8af05f6f4df329f65e89628380eacdc8aa6212a` |
| `public/media/video/a-289.webm` | `ff5e6e2435e22b08ed0bb742fb3423e0279d47e389ae8c5806ba81c3cdbf5a1f` |
| `public/media/video/m-1.mp4`    | `439c0d0d32aa9256476132f1963bc5113d26aadd88c59cfb7dfbe5a5bd9fb5fa` |
| `public/media/video/m-1.webm`   | `b8cc362d7c80525fa16ab4aa2a3b5361c57c2d904d3df672dd4a885cbbf9a5f5` |
| `public/media/video/m-11.mp4`   | `8628f312c88a9460e2651c2a18a7466a98afa8249aa401f37adffb4eff9dd86a` |
| `public/media/video/m-11.webm`  | `3fa4349d2a53adf20826471291d2ebb77ce57a7b516b4be84f73e386e0b9900a` |
| `public/media/video/m-12.mp4`   | `45ce8cda0021834db4228fadbc08c95d4707dd53ef0283863e870e69c953438b` |
| `public/media/video/m-12.webm`  | `bd14509809d1c4976f7df053c0955cb983e67f88943065c29ba8a484675e9013` |
| `public/media/video/m-3.mp4`    | `337d1cb4ab559401eba44ebcfb43d282776119ddada6e109311a892c15f64f29` |
| `public/media/video/m-3.webm`   | `c0a9b92f1247f0c5f57d95cd300e2371b12eadbacead7029e75aac9d2d218bba` |
| `public/media/video/m-4.mp4`    | `237b7483c0263cd651c2ee93789ee68a3988066c963b1bccede59c19da7e6fc3` |
| `public/media/video/m-4.webm`   | `7ec9a526164231641a5ea32185d0599666ed9228e6f0d81c0228b636b36036ea` |

## Media integrity rules

- Do not label any generated scene as a real named motorway, bridge, tunnel or active project.
- Never use generated pixels to reconstruct an official logo, order, government mark, road sign or factual map.
- Keep source masters immutable; create optimized derivatives as separate files.
- Visual QA must reject malformed lane markings, duplicated vehicles or machinery, implausible structures, unsafe work practices, unintended text, logos or watermarks.
- Before release, record checksums, derivative dimensions, encoder settings, file weights and the final license/legal decision.
