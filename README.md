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
node check_interactions.cjs
git diff --check
```

GitHub Actions runs the static and interaction checks on main and pull requests. Existing branch-based GitHub Pages publishing deploys main.

The optional original-image check requires Pillow, pypdf and the private source ZIP:
`python verify_original_assets.py --source-zip "PATH/portfolio_final_images_for_codex.zip" --legacy-source-zip "PATH/portfolio_v2_complete_inputs.zip" --mobile-source-dir "PATH/crm"`.
The source documents are not published in the repository.

## Site structure

- `index.html`: positioning, experience, six selected products, expertise, research, education and contact.
- `projects.html`: seventeen product areas with category filters.
- `case-studies/`: seventeen case routes; substantial cases for documented major products and shorter factual overviews for less-documented work.
- `styles.css`: the approved navy/light gallery design and responsive layouts.
- `main.js`: the unchanged Three.js globe and motion controls.
- `ui.js`: navigation, filters and accessible native image dialogs with full-size links.
- `assets/manifest.json`: thirty-three original image slots, native dimensions, descriptive captions and provenance hashes.
- `ASSET-MAPPING.json`: company, role, product summary and image assignments.
- `CONTENT-REVIEW.md`: source decisions, publication verification and factual questions omitted from public copy.

## Content and dependencies

Portfolio V3 positions Mirmorsal as a hands-on Senior Product Manager and Product Leader across FinTech, B2B SaaS and AI. The Master CV supplies career dates and documented delivery outcomes; owner corrections establish Riskotik ownership at Top Fast Technology. Product capabilities are grounded in the product presentation and interface examples. Public copy distinguishes actual delivery outcomes from intended product value.

V5 uses the specifically assigned ZIP references, retained original product assets and three owner-assigned CRM mobile originals. Lossless WebP conversion preserves every decoded pixel and native dimension. The 7208 × 5400 mobile composition is intentionally retained at full resolution (9.86 MB); gallery previews load lazily. No stock or reconstructed screenshots. No CV download button is shown because the available CV is DOCX, not PDF.

Three.js uses the existing pinned CDN version. Inter loads through Google Fonts with system fallbacks. There is no analytics, visitor-data storage or contact backend.

## Browser review

Check mobile and desktop text flow, navigation, filters, direct case routes, gallery controls, keyboard behavior and globe pause/resume. Static and DOM tests validate structure and interactions; they do not replace browser rendering or assistive-technology checks. V5 is authorized for publication to the same GitHub Pages URL after validation.
