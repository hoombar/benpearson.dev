# Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persisted accessible light/dark/system theme selector to the Hugo site.

**Architecture:** Theme state is handled by a focused JavaScript module in `assets/js/theme-toggle.js`, with CSS variables selected by `data-theme` and `prefers-color-scheme`. Hugo layout adds a native select control and a small inline preflight script to avoid theme flash.

**Tech Stack:** Hugo, CSS custom properties, vanilla JavaScript, Node built-in test runner.

---

### Task 1: Theme Logic

**Files:**
- Create: `assets/js/theme-toggle.js`
- Create: `scripts/theme-toggle.test.mjs`

- [x] Write failing tests for stored explicit theme, system fallback, and invalid stored values.
- [x] Run `npm test` and confirm the new tests fail because the module is missing.
- [x] Implement exported pure helpers plus browser wiring.
- [x] Run `npm test` and confirm the tests pass.

### Task 2: Hugo And CSS Wiring

**Files:**
- Modify: `layouts/_default/baseof.html`
- Modify: `assets/css/main.css`

- [x] Add preflight head script.
- [x] Add labelled native theme selector in the header.
- [x] Load the deferred theme script.
- [x] Define light, dark, and system palettes using CSS custom properties.

### Task 3: Verification

**Files:**
- Modify files as needed based on verification.

- [x] Run `npm test`.
- [x] Run Hugo build using local `/tmp/opencode/hugo` if available.
