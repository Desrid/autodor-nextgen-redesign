# Asset Registry

## Scope and status legend

This registry covers project-bound generated raster media for the **Infrastructure Atlas** direction. These images are original AI-generated source assets; they are not official photographs of a named road, project or location and must not be used as factual evidence. They contain no official logo reconstruction.

Status values:

- `source generated`: project-local master exists, but delivery formats and crops are pending;
- `optimized`: responsive AVIF/WebP derivatives and crops exist;
- `blocked`: a source or rights requirement prevents use.

## Official identity exports from Figma

Both files below are lossless node screenshots exported on 2026-07-15 from the user-approved Figma source `MBbnwSbrgu3uv4Nb2TFNmY`. They are used as supplied and are not manually reconstructed.

| Purpose                                   | Figma node-id | Repository file                            | Size                        | SHA-256                                                            | Status                                                                               |
| ----------------------------------------- | ------------- | ------------------------------------------ | --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Header logo with order                    | `1767:6578`   | `public/brand/autodor-logo-with-order.png` | `287 x 40`, `10,312` bytes  | `0f4a5c22737b6c94c269e691c7940a2a22e79911b671e8f15ff7061f3537696b` | Exported; preserve aspect ratio and clear space                                      |
| Footer logo without order                 | `1767:7542`   | `public/brand/autodor-logo-footer.png`     | `287 x 40`, `5,792` bytes   | `8b134e98faf0f57c1369fd2a54a05034339b31af1348a5f730f848c2bc8a4f03` | Exported; preserve aspect ratio and clear space                                      |
| Future-projects static map fallback       | `1767:7518`   | `public/brand/future-projects-map.png`     | `736 x 463`, `80,978` bytes | `902207f669365376d6a3bca4cdf50dc0ba77d0a967206238d1e1f1722ea5256f` | Exported; source labels retained; use as presentation fallback, not verified geodata |
| Government of the Russian Federation mark | `1767:8087`   | `public/brand/government-rf.png`           | `72 x 64`, `4,654` bytes    | `5f3e7df7633365b2a2ea3347b6a309c7fc653ff129631488652844d79864d833` | Exported for footer identity row                                                     |
| Ministry of Transport emblem              | `1767:8250`   | `public/brand/mintrans-rf.png`             | `59 x 64`, `7,919` bytes    | `d546e422d207bc5907a62fbdda7bc4b656028577a687c9b47eb8b716eee8dd3e` | Exported for footer identity row                                                     |
| Moscow Construction Complex mark          | `1767:9203`   | `public/brand/moscow-construction.png`     | `103 x 64`, `2,830` bytes   | `dbdd805a1b972cc7b04f83e1b78114ab690499b9d983f1e72724742b9e58d73c` | Exported for footer identity row                                                     |

## Generated raster sources

| ID          | Purpose                                                         | Source and rights                                                                                                                                                                                                                                         | Prompt and settings                                                                                 | Original size                                                                              | Final formats and crops                                       | Poster                         | Alt text                                                                            | Optimization status                                                                |
| ----------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `media-001` | Hero / road-network atmospheric source: federal motorway aerial | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/federal-highway-aerial-hero.md`; built-in mode; wide landscape composition requested | `1713 x 918` PNG, `2,720,488` bytes; `public/media/source/federal-highway-aerial-hero.png` | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Desktop AVIF `960` derivative  | A modern divided motorway crossing a broad forested landscape, viewed from above.   | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-002` | Gallery / infrastructure feature: bridge and viaduct            | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/bridge-viaduct.md`; built-in mode; wide landscape composition requested              | `1536 x 1024` PNG, `2,540,377` bytes; `public/media/source/bridge-viaduct.png`             | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | A long motorway bridge crosses a broad river between wooded banks.                  | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-003` | Gallery / road-network feature: tunnel portal                   | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/tunnel-portal.md`; built-in mode; wide landscape composition requested               | `1536 x 1024` PNG, `3,401,834` bytes; `public/media/source/tunnel-portal.png`              | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | A divided motorway approaches two modern tunnel portals in a forested rock cutting. | **Optimized**; visual scene review passed; responsive derivative manifest recorded |
| `media-004` | Gallery / construction story: active motorway works             | Built-in OpenAI image generation, generated for this repository on 2026-07-15. Project-created synthetic media; provenance retained here. Final publication rights review remains a release responsibility. Not a documentary record of a named location. | `prompts/media/road-construction.md`; built-in mode; wide landscape composition requested           | `1672 x 941` PNG, `2,733,771` bytes; `public/media/source/road-construction.png`           | AVIF + WebP: desktop `640/960/1440`, mobile 4:5 `320/480/720` | Not applicable for still image | Road-building machinery and a small crew work on a new motorway carriageway.        | **Optimized**; visual scene review passed; responsive derivative manifest recorded |

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
