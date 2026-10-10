# Portfolio V4 UI/UX review

Baseline: main `1376aa8`. Scope: presentation and navigation feedback only.
HTML structure, factual copy, metadata, routes, contacts, original assets and Three.js code are preserved. Existing HTML pages version their shared CSS/UI asset URLs to avoid stale browser/CDN copies after publication.

## Findings before implementation

- High: collection-page gallery notes/captions inherited pale dark-theme text against the light background. Explicit light-theme text now fixes contrast.
- Medium: navigation was approximately 13px; project descriptions approximately 14px; several category, role and image labels were 10–12px. Shared readable type tokens now govern these components.
- Medium: Contact appeared active regardless of reading position. Homepage section navigation now identifies the current section and supports hover/focus feedback.
- Medium: small card actions, inconsistent heading sizes and weak interactive outlines. Main controls now have 44px minimum heights, consistent card headings and contrasting boundaries/focus indicators.
- Medium: case text could span 780px with no separation between consecutive paragraphs. Text now uses a 68ch maximum width, responsive body type and paragraph spacing; the role section has a restrained gold marker.
- Low: superseded Phase 2/3 CSS and repeated breakpoint rules made changes fragile. Component rules and media queries are consolidated; unused generated-art and placeholder styles are removed.

## Implementation

- Inter remains the preferred typeface. Hero H1 retains its original desktop/mobile sizing. Section headings use a 32–52px fluid scale; card/service headings 22–28px; body 16–18px; card copy 15.5px; navigation 14px; supporting labels 12–14px.
- Reusable 4/8px spacing steps, fluid gutters, consistent card/grid padding, calmer section rhythm and readable metadata.
- Native screenshots remain unchanged and uncropped, with scale-down/contain presentation and intrinsic dimensions. Portrait/composite galleries and full-size viewing remain available.
- Navy, off-white, blue and restrained gold remain. Light-section captions use dark muted text. Focus colors account for both light cards and dark gallery surfaces. Reduced motion, pause control and native dialog semantics remain.
- Mobile navigation begins at 900px to prevent the enlarged desktop navigation colliding with the brand at tablet widths. Its overlay is positioned below the actual header height.
- No framework, dependency, image conversion, content rewrite, route change or additional publication directory.

## Verification boundaries

`check_site.py` checks 22 pages, content/metadata/links, all 32 image mappings and core colors. `check_interactions.cjs` checks menu/filter/lightbox behavior and current-section feedback. `check_ui.py` checks CSS consolidation, type/spacing invariants, image fitting, target sizes, responsive alignment and additional contrast pairs. The existing GitHub validation workflow runs all three.

Browser checks and deployment evidence are recorded separately in the delivery report. Automated checks do not constitute a complete WCAG conformance certification or assistive-technology audit. Guidance: https://www.w3.org/TR/WCAG22/.
