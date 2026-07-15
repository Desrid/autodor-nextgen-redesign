# Media generation prompts

These prompts produce project-bound raster sources for the recommended **Infrastructure Atlas** art direction defined in `docs/design/design-read.md`.

Shared production constraints:

- photorealistic documentary infrastructure photography, not concept art;
- bright natural conditions compatible with the single light theme;
- believable road geometry, lane markings, structures, machinery and safety practice;
- wide desktop framing with a protected central crop corridor for portrait/mobile art direction;
- no text, logos, watermarks, readable road signs, license plates or invented official symbols;
- no cyberpunk, HUD overlays, glow, fantasy structures, excessive HDR or generic stock-photo staging.

The files in this directory preserve the exact prompts sent to the built-in `imagegen` workflow. Final source images live in `public/media/source/`; optimization into AVIF/WebP and final responsive crops is a separate production step.
