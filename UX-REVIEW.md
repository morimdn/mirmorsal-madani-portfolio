# Portfolio V4 UI/UX review

Baseline: main `1376aa8`. Scope: presentation and navigation feedback only.
HTML structure, factual copy, metadata, routes, contacts, original assets and Three.js code are preserved. Existing HTML pages version their shared CSS/UI asset URLs to avoid stale browser/CDN copies after publication.

## Findings before implementation

- High: no confirmed route, approved-content or original-asset blocker in the baseline checks.
- Medium: navigation was approximately 13px; project descriptions approximately 14px; several category, role and image labels were 10–12px. Shared readable type tokens now govern these components.
- Medium: Contact appeared active regardless of reading position. Homepage section navigation now identifies the current section and supports hover/focus feedback.
- Medium: small card actions, inconsistent heading sizes and weak interactive outlines. Main controls now have 44px minimum heights, consistent card headings and contrasting boundaries/focus indicators.
- Medium: case text could span 780px with no separation between consecutive paragraphs. Text now uses a 68ch maximum width, responsive body type and paragraph spacing; the role section has a restrained gold marker.
- Low: superseded Phase 2/3 CSS and repeated breakpoint rules made changes fragile. Component rules and media queries are consolidated; unused generated-art and placeholder styles are removed.

## Implementation

- Inter remains the preferred typeface. Hero H1 retains its original desktop/mobile sizing. Section headings use a 32–52px fluid scale; card/service headings 22–28px; body 16–18px; card copy 15.5px; navigation 14px; supporting labels 12–14px.
- Reusable 4/8px spacing steps, fluid gutters, consistent card/grid padding, calmer section rhythm and readable metadata.
- Native screenshots remain unchanged and uncropped, with scale-down/contain presentation and intrinsic dimensions. Portrait/composite galleries and full-size viewing remain available.
- Navy, off-white, blue and restrained gold remain. Contextual tokens support captions in light sections. Browser inspection confirmed that the existing collection-page supplemental gallery is on the dark body background and correctly retains pale text; this was not a baseline contrast failure. Focus colors account for both light cards and dark gallery surfaces. Reduced motion, pause control and native dialog semantics remain; explicit Tab/Shift+Tab boundary wrapping supplements the dialog.
- Mobile navigation begins at 900px to prevent the enlarged desktop navigation colliding with the brand at tablet widths. Its overlay is positioned below the actual header height.
- No framework, dependency, image conversion, content rewrite, route change or additional publication directory.

## Verification boundaries

`check_site.py` checks 22 pages, content/metadata/links, all 32 image mappings and core colors. `check_interactions.cjs` checks menu/filter/lightbox behavior and current-section feedback. `check_ui.py` checks CSS consolidation, type/spacing invariants, image fitting, target sizes, responsive alignment and additional contrast pairs. The existing GitHub validation workflow runs all three.

Browser checks and deployment evidence are recorded separately in the delivery report. Automated checks do not constitute a complete WCAG conformance certification or assistive-technology audit. Guidance: https://www.w3.org/TR/WCAG22/.

## 12 October 2026 refinements

Browser audit: all fifteen pages at 320, 375, 390, 430, 768, 1024 and 1440 px (105 combinations), after container-query fixes, with no document horizontal overflow or clipped tested headings, capability labels or interface values. The thirteen in-place project selections loaded their own complete case content and scene galleries, cleared busy state and produced no duplicate DOM IDs. Code lightbox opening/cycling, palette changes and switching back to original images were exercised. Keyboard focus, portrait behavior, filters and native dialog controls remain covered by regression checks. Product reconstructions are labeled demonstrations with sample data; originals remain separately available. GitHub profile README, professional bio, employer, location, website and LinkedIn link are published; portfolio and profile repositories are pinned. These are browser viewport checks, not physical-device certification.

Follow-up: the owner rejects reconstructed screenshots. Restore all original images and remove Code preview, offering only optional whole-image Original/Blue/Gold tonal effects with an unfiltered default. Native mouse dragging and keyboard movement were exercised in the actual browser: node displacement and connected SVG endpoints changed together, and Reset restored the layout. Full-size original viewing inherits the selected tonal palette without changing the original download URL. About is removed, section numbering now runs 01–05, native CSS scroll snapping is mandatory with snap-stop always, and the supplied PDF is linked as Download CV. Reduced motion disables automatic network movement and snapping; manual drag remains available.

Final browser checks: 105 page/viewport combinations again passed without document overflow, clipped tested headings or synthetic previews. Automatic edge movement changed between observations; mouse dragging changed a node by 48x35 px and updated its edge coordinates, and keyboard arrows changed its position by 8 px. Page Down reached Experience at the header offset, with computed scroll-snap-type y mandatory and snap-stop always. The actual Download CV action saved the PDF, whose bytes match both the uploaded source and the published asset.

Sticky palette refinement: Original plus coordinated Ocean (navy/teal/ivory) and Amber (charcoal/amber/cream) maps use the same original image files. Desktop gallery scrolling pins the bar under the header; selection changes preserve its position. At 320 px all three 44 px targets fit on one row under the label, with an approximately 87 px toolbar and no horizontal overflow. Sticky controls are scoped to case/project content, while lightbox controls remain static inside the dialog. Source-image URL preservation, stored-preference migration and existing network interactions are checked.

Final pinned-control browser checks: at all seven requested widths the gallery toolbar remained below the header (78 px top on mobile/tablet, 92 px on desktop), with no horizontal overflow. The compact mobile bar is approximately 87 px tall. In projects.html it stayed pinned at scrollY 1800 beside the lower cards; changing palettes did not return the reader to the top. Ocean and Amber mappings visibly recolor the original images, with Original restoring them.


Final implementation: SVG chromatic matrices replace the grayscale luminance maps. Each RGB row sums to one so neutral pixels retain their brightness. Colored pixels map into opposing blue/copper or gold/violet accents, preserving image geometry and original assets. This is a whole-image color transformation, not independent semantic component theming.

Professional polish: all thirteen existing cases include a concise three-part summary above the detail content. Nine use Problem / My role / Outcome or value; four context-focused products use Product focus without implying direct ownership or measured results. A decorative 2 px gold reading line sits below the header, updates via a batched frame and ResizeObserver, and leaves layout untouched. Summary spacing, link underline offsets and focus rings share existing tokens. Product structure, source images, palette transforms, network, portrait, CV and research content remain intact.
