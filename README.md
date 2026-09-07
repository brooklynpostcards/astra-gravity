# Astra Gravity

An interactive gravity playground: 1,800 particles, movable stars, and passing comets.

**[Play in your browser](https://brooklynpostcards.github.io/astra-gravity/)**

Drag the central star, select **Split the star** to form a binary, or **Send a comet** through the particle disk. Pause and resume whenever you like. Reduced-motion preferences start the simulation paused.

## Run locally

Open `index.html` in a modern browser. No installation or server is required.

## Files

- `index.html`: self-contained browser export, published by GitHub Pages.
- `astra-gravity.html`: original visualization fragment; requires its host's theme variables and control styles.
- `verify.cjs`: dependency-free script checks. Run with `node verify.cjs`.

The checks exercise startup, finite drawing coordinates, split/reunite, comet launches, dragging, pause, and reduced-motion behavior at two viewport widths using a simulated DOM and canvas. They do not replace browser visual checks.

This is an illustrative softened-gravity model. Particles do not attract each other, and the binary stars follow prescribed orbits.
