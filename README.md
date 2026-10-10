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
- `ui.js`: menu and project filters, independent of the globe/CDN.
- `case-studies/`: twelve static, directly addressable product overview pages.
- `CONTENT-REVIEW.md`: content provenance, outstanding review and image-slot instructions.

## Intentional limitations

Case-study overviews document product context, not verified feature-level ownership or outcome claims. Product art is explicitly decorative. No CV or LinkedIn action appears until a real PDF or exact verified profile URL is supplied. A carousel was omitted to keep the hero focused and avoid duplicating the product gallery.

Three.js remains pinned to the original CDN version. Inter is loaded through Google Fonts with system fallbacks. No analytics, visitor-data storage or contact backend has been introduced.

## Browser acceptance checks before merging

The development environment's in-app browser could inspect the existing live site but could not reach local preview servers (timeouts/refused connections). Direct local-file navigation is unsupported. Automated browser QA and screenshots of the changed site were therefore unavailable in this run.

Before merging, preview the branch locally and inspect 375px, 768px and 1440px widths; verify no horizontal overflow, mobile menu, project filters, direct case-study links, contact channels, keyboard Tab/Enter/Escape behavior, reduced motion and globe pause/resume. Check the browser console and confirm that the sphere renders and rotates without text overlap. Try WebGL/CDN failure and JavaScript disabled: content and product links must remain available.

After merge, wait for the existing “pages build and deployment” workflow to succeed. Open the public URL, verify the new hero and a case-study page, and repeat the essential interaction checks. Static validation and DOM-level regression checks do not replace these browser checks.
