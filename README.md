# Mirmorsal Madani — product portfolio

Buildless HTML, CSS and JavaScript for https://morimdn.github.io/mirmorsal-madani-portfolio/ .

## Local development

Run `python -m http.server 8000` from this directory and open `http://localhost:8000/`.
No build or package installation is required. The published GitHub Pages site is the primary review destination.

## Validation

```sh
python check_site.py
python check_ui.py
node --check main.js
node --check ui.js
node --check product-images.js
node --check product-network.js
node check_product_images.cjs
node check_interactions.cjs
node check_intro.cjs
git diff --check
```

GitHub Actions runs the static and interaction checks on main and pull requests. Existing branch-based GitHub Pages publishing deploys main.

The optional original-image check requires Pillow, pypdf and the private source ZIP:
`python verify_original_assets.py --source-zip "PATH/portfolio_final_images_for_codex.zip" --legacy-source-zip "PATH/portfolio_v2_complete_inputs.zip" --mobile-source-dir "PATH/crm"`.
Private reference documents are not published; the owner-approved CV PDF is public.

## Site structure

- `index.html`: positioning, experience, a thirteen-project in-place explorer, expertise, research, education and contact.
- `projects.html`: thirteen product areas with category filters.
- `case-studies/`: thirteen case routes; substantial cases for documented major products and shorter factual overviews for less-documented work.
- `styles.css`: the approved navy/light gallery design and responsive layouts.
- `main.js`: section keyboard stepping and progressive case-study loading.
- `ui.js`: navigation, filters and accessible native image dialogs with full-size links.
- `assets/manifest.json`: thirty-three original image slots, native dimensions, descriptive captions and provenance hashes.
- `ASSET-MAPPING.json`: company, role, product summary and image assignments.
- `CONTENT-REVIEW.md`: source decisions, publication verification and factual questions omitted from public copy.

## Content and dependencies

Portfolio V3 positions Mirmorsal as a hands-on Senior Product Manager and Product Leader across FinTech, B2B SaaS and AI. The Master CV supplies career dates and documented delivery outcomes; owner corrections establish Riskotik ownership at Top Fast Technology. Product capabilities are grounded in the product presentation and interface examples. Public copy distinguishes actual delivery outcomes from intended product value.

V5 uses the specifically assigned ZIP references, retained original product assets and three owner-assigned CRM mobile originals. Lossless WebP conversion preserves every decoded pixel and native dimension. The 7208 × 5400 mobile composition is intentionally retained at full resolution (9.86 MB); gallery previews load lazily. No stock or reconstructed screenshots. The later owner-approved PDF is available through Download CV in the Hero.

The Hero software architecture uses inline SVG, with no WebGL or external JavaScript dependency. Inter loads through Google Fonts with system fallbacks. Product appearance preferences are stored locally in the browser. There is no analytics or contact backend.

## Browser review

Check mobile and desktop text flow, navigation, filters, direct case routes, gallery controls, keyboard behavior and globe pause/resume. Static and DOM tests validate structure and interactions; they do not replace browser rendering or assistive-technology checks. V5 is authorized for publication to the same GitHub Pages URL after validation.

## Original product images and motion

`product-images.js` adds Original, Ocean and Amber controls to the actual product screenshots, including full-size viewing. Chromatic RGB matrices retain neutral UI brightness while mapping colored areas into complementary accents rather than a monochrome luminance map. They do not independently recolor interface components or turn dark designs into genuine light themes. Original is the default, removes all filters, and every original image URL and byte remains intact. Reconstructed interfaces and Code preview have been removed.

`product-network.js` makes the Hero leadership network draggable with mouse and touch, with live SVG connections, bounded node positions, keyboard arrow movement, Home/reset controls and pause/resume. Automatic movement is capped at 30 fps, stops offscreen/in background and is disabled for reduced motion; manual movement remains available.

The homepage project explorer loads full content from the existing case-study routes. Its structure is preserved. Section boundaries use mandatory native CSS snapping with Page Up/Down support; tall sections retain internal reading space. About has been removed, navigation and section numbering updated. The owner-supplied original PDF is available through Download CV in the Hero.

Palette controls stay pinned below the header while scrolling product case content or the project-card collection. Ocean and Amber use blue/copper and gold/violet chromatic transformations. Swatches use complementary blue/copper and gold/violet accents against navy. The project section uses a subdued slate gradient instead of the near-white background. Original bypasses filters. Previous Blue/Gold saved selections migrate to the corresponding new palettes.

Final implementation: SVG chromatic matrices replace the grayscale luminance maps. Each RGB row sums to one so neutral pixels retain their brightness. Colored pixels map into opposing blue/copper or gold/violet accents, preserving image geometry and original assets. This is a whole-image color transformation, not independent semantic component theming.

Professional polish: all thirteen existing cases include a concise three-part summary above the detail content. Nine use Problem / My role / Outcome or value; four context-focused products use Product focus without implying direct ownership or measured results. A decorative 2 px gold reading line sits below the header, updates via a batched frame and ResizeObserver, and leaves layout untouched. Summary spacing, link underline offsets and focus rings share existing tokens. Product structure, source images, palette transforms, network, portrait, CV and research content remain intact.
