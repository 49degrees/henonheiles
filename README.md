# Instability Is Not Transport

A complete interactive companion to **Geometric Thresholds in the Henon-Heiles System**. The supplied research draft is preserved in `research-paper.md`, including its complete appendix and original output.

## Run

1. `npm install`
2. `npm run dev`
3. `npm run build` for a production build in `dist/`.
4. `npm run preview` to inspect the production build.

No API keys or external services are required. Editorial fonts are OFL-licensed and inlined as base64 in `src/fonts.css`, so the art direction has no external requests and no binary asset dependencies. License texts ship in `public/fonts/`.

## Experience

- A full-bleed, formula-derived potential surface establishes the system. Opening parallax is directly coupled to native scroll position.
- A native sticky argument stage rotates toward configuration space, continuously expands the exact bounded well, and moves from a fixed to an adaptive threshold across four reading beats.
- Two additional native-scroll scenes carry that geometry across the paper: a growing bounded contour draws its exact D(E) curve, then a fixed-threshold marker moves relative to the maximum while a normalized marker holds at 50%.
- The opening surface tilts and moves with the reader, and the two analytical figures trace their actual curves while moving between the surrounding sections. The protocol illustration and concluding motif also follow the reader's position.
- The detailed essay includes the domain, identity, global-extremum proof, physical cubic branch, exact checks, monotonicity, limits, normalization, classical context, proposed passage protocol, limitations, and all 13 references.
- The research lab provides keyboard-operable energy, alpha, and beta controls, exact energy presets, threshold-region shading, a normalized-range gauge, all dependent numerical values, and an explicitly geometric attainability verdict.
- The complete paper opens in a native dialog with a contents list, accessible math, all proofs, code, and the original logged output. Escape closes the reader and restores focus.
- Reduced motion defaults to an unpinned static reading state with all four beats visible. Without JavaScript, a source-paper reading link is provided.
- The header control is labeled **MOTION ON / MOTION OFF** with matching `aria-pressed`, so its state is visible and announced. Pausing shows a `role="status"` notice reading "MOTION PAUSED · STATIC READING", which explains why the scroll choreography stopped. It also pauses automatically when the system requests reduced motion, and remains fully keyboard operable.

## Source Integrity

The named Markdown attachment was absent from the starter. `research-paper.md` was transcribed from the complete paper supplied in the brief, not reconstructed from a summary.

The draft has an explicit discrepancy: Eq. (7a) gives onset energies 0.0024295432 and 0.0084522915 for alpha = 0.05 and 0.10, consistent with the prose, while the original log prints 0.006024 and 0.010300 with inconsistent radii. The essay and reader flag this. The lab evaluates the equation; the original log is preserved, not silently corrected.

The theorem is implemented only for `0 < E < 1/6`. The lab stops at 0.1665. Graph endpoints at 1/6 are explicitly one-sided limits. The positive steep-ray excursion is kept separate from the maximum absolute excursion and the peak-to-peak range. Shading is a level-set inequality, not an area normalization or a probability.

## Project Map

- `src/App.tsx`: application entry and accessible navigation.
- `src/lib/geometry.ts`: pure numerical model shared by diagrams, controls, and tests.
- `src/hooks/useScrollProgress.ts`: passive native-scroll listeners, animation-frame throttling, and reduced-motion detection.
- `src/components/WellCanvas.tsx`: original device-pixel-ratio-aware potential mesh and continuously projected contour.
- `src/components/ScrollScenes.tsx`: opening, pinned argument, and concluding choreography.
- `src/components/MotionJourneys.tsx`: scroll-driven well-to-bound and fixed-versus-adaptive threshold scenes.
- `src/components/Charts.tsx`: formula-derived SVG charts and threshold geometry.
- `src/components/ResearchLab.tsx`: live controls, numeric editing, exact results, comparison, and attainability.
- `src/components/Article.tsx`: detailed editorial argument and references.
- `src/components/PaperText.tsx` and `PaperReader.tsx`: faithful full-text view and contextual source excerpts.
- `src/index.css`: art direction, responsive recomposition, reduced motion, and print states.
- `public/downloads/`: original appendix, preserved log, and a recomputed vector Figure 1.

## Verification

1. `npx playwright install --with-deps chromium` to set up browser tests.
2. `npx playwright test` to run numerical and browser tests. A local Vite server is started automatically if needed.
3. `npx tsc --noEmit` to check application types.
4. `node scripts/generate-figure.mjs` to regenerate the downloadable companion Figure 1.

Geometry tests check both cubic roots, the exact E = 1/12 and E = 9/64 values, the global bound on an interior-inclusive polar grid, monotonicity, the one-sided limit, fixed onsets, and adaptive normalization. Browser tests cover all dependent control values, keyboard editing and tabs, reversible pixel-identical scroll states, native wheel scrolling, reduced motion, source downloads, the full-paper reader, and phone/tablet page overflow.

The motion regression suite additionally checks that the contour and curve readouts follow the paper's equations, the threshold's status and position reverse correctly, the adaptive marker stays fixed, analytical charts follow scroll in both directions, and short screens can read the full scenes without clipping.

Automated Axe checks cover WCAG A/AA rules in the essay, live comparison, phone reading state, and complete paper. These are Chromium checks with emulated viewport sizes, not a claim of manual screen-reader or physical-device certification.

KaTeX provides accessible MathML and mathematical typesetting. React Markdown, remark-math, remark-gfm, and rehype-katex typeset the source document without allowing raw HTML. Animation itself uses no animation library: native sticky positioning and one animation-frame update per scroll event are sufficient, and avoid scroll hijacking or a heavy 3D engine.

The original Python appendix requires NumPy, SciPy, SymPy, and Matplotlib. It is supplied unchanged; the JavaScript application tests do not constitute a rerun of every original dynamical or symbolic check. The proposed passage experiment is not executed by this site.

## Final Motion Layer

- A fixed ink thread follows the whole essay. Its threefold wave comes from `sin(3phi)`, its amplitude comes from the exact `D(E)`, and its drawn length is the reader's native scroll position. On phones it becomes a bottom strip.
- A pinned equation relay hinges four exact states around one origin: `J + V3 = E`, the polar potential, the global absolute maximum, and `alpha(E) = beta D(E)`. A formula-derived well expands behind them while a ribbon drawn from `D(E)` records progress.
- The closing colophon contracts the one-sided escape contour into a point and reveals the credit **by Jasper Liu**. The footer repeats the credit at the literal end of the page.
- New code lives in `src/components/ScrollAtmosphere.tsx`, `EquationRelay.tsx`, and `Colophon.tsx`; regression coverage lives in `tests/final-experience.spec.ts` and `tests/final-accessibility.spec.ts`.
- The rendered interface is non-selectable: selection, copy, cut, paste, drag-copy, context-menu copy, and common clipboard shortcuts are blocked. This is a presentation-level guard, not DRM; browser developer tools and the intentionally preserved source downloads can still access underlying text. The lab's numeric controls remain keyboard-operable.