# Public Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Hugo-compatible public blog repo with a tested Obsidian-to-Hugo publisher script.

**Architecture:** The repo owns both the static site source and the publishing automation. Obsidian remains the drafting source under `/home/ben/vault/Human/Public Blog/`; only notes with `should_publish: true` are exported to Hugo `content/writing/<slug>/index.md`.

**Tech Stack:** Hugo static site, Node.js publisher script, Node built-in test runner, Cloudflare Pages.

---

### Task 1: Site Scaffold

**Files:**
- Create: `hugo.toml`
- Create: `layouts/_default/baseof.html`
- Create: `layouts/index.html`
- Create: `layouts/writing/list.html`
- Create: `layouts/writing/single.html`
- Create: `assets/css/main.css`
- Create: `content/_index.md`
- Create: `content/writing/hello-world/index.md`

- [x] Create a minimal Hugo site without external theme dependencies.
- [x] Add a single `writing` section that can display both posts and lab notes.
- [x] Add sample content for local build validation.

### Task 2: Publisher Tests

**Files:**
- Create: `package.json`
- Create: `scripts/publisher.test.mjs`
- Create: `scripts/publisher.mjs`

- [x] Write failing tests first for slug creation, export, source reset, existing slug reuse, and validation.
- [x] Run `npm test` and confirm failure before implementation.
- [x] Implement the minimal publisher behavior.
- [x] Run `npm test` and confirm success.

### Task 3: Documentation And Cloudflare

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `wrangler.toml`

- [x] Document the draft frontmatter contract.
- [x] Document minibot cron usage.
- [x] Add Cloudflare Pages configuration notes.

### Task 4: Verification

**Files:**
- Modify files as needed based on verification output.

- [x] Run `npm test`.
- [x] Check `hugo version`; if unavailable locally, document that local Hugo verification was skipped.
- [x] Initialize git repository after files are present.
