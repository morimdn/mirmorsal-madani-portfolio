# Mirmorsal Madani — personal portfolio

Buildless HTML, CSS and JavaScript for the existing GitHub Pages site:
https://morimdn.github.io/mirmorsal-madani-portfolio/

## Local preview

Run `python -m http.server 8000` in this directory, then open `http://localhost:8000/`.
No build step, Docker, backend or runtime package installation is required.

## Validation

```sh
python check_site.py
node --check main.js
node --check ui.js
node check_interactions.cjs
git diff --check
```

The GitHub Actions validation workflow runs these checks on pull requests and main.
Existing branch-based GitHub Pages publishing remains unchanged.

## Structure

- `index.html`: hero, navigation, experience, product gallery, capabilities, research and contact.
- `styles.css`: responsive design tokens, light product gallery, dark sections and reduced-motion styles.
- `main.js`: original Three.js sphere, rings and particles, adapted to the hero with reduced rendering cost and pause controls.
- `ui.js`: menu, project filters and keyboard-operable native image lightbox, independent of the globe/CDN.
- `projects.html`: twenty distinct product areas and examples.
- `case-studies/`: twenty directly addressable pages, preserving all twelve original routes.
- `assets/`: twenty-nine owner-approved original screenshots, losslessly encoded as WebP with a provenance manifest.
- `ASSET-MAPPING.json`: project/image assignments and excluded sources.
- `CONTENT-REVIEW.md`: source decisions, unresolved evidence and privacy treatment.

## Intentional limitations

Phase 2 uses the supplied CV and genuine product artifacts. The homepage selects six products; collection and case pages contain detailed material. Supplied designs are labeled; Phase 3 restores every original screenshot with native dimensions and lossless pixel fidelity; source-supported outcomes are attributed to the CV, and missing outcomes are not invented. LinkedIn uses the exact supplied profile. The CV is DOCX only, so no PDF download action appears. The globe code is unchanged in Phases 2 and 3.

Three.js remains pinned to the original CDN version. Inter is loaded through Google Fonts with system fallbacks. No analytics, visitor-data storage or contact backend has been introduced.

## Browser acceptance checks before merging

The development environment's in-app browser could inspect the existing live site but could not reach local preview servers (timeouts/refused connections). Direct local-file navigation is unsupported. Automated browser QA and screenshots of the changed site were therefore unavailable in this run.

Before merging, preview the branch locally and inspect 375px, 768px and 1440px widths; verify no horizontal overflow, mobile menu, project filters, direct case-study links, contact channels, keyboard Tab/Enter/Escape behavior, reduced motion and globe pause/resume. Check the browser console and confirm that the sphere renders and rotates without text overlap. Try WebGL/CDN failure and JavaScript disabled: content and product links must remain available.

PR #1 is for review only. Do not merge or deploy until the owner approves. The current public URL shows the previously deployed site, not the revised branch. Static validation and DOM-level checks do not replace browser checks.

## Original image verification (Phase 3)

`python verify_original_assets.py --source-zip "PATH/portfolio_v2_complete_inputs.zip"` verifies all 29 asset slots against the original ZIP, including the page-11 embedded PDF image. This optional local provenance check needs Pillow and pypdf; the source ZIP remains outside the repository. The standard CI check uses only Python's standard library and verifies asset checksums, native dimensions, metadata and links. Full-resolution lossless images total about 9.13 MB; image loading is lazy except the case-study lead image. Shared SJI composites account for repeated sources, with explicit contextual captions. The current tree contains no masked derivative.
