# Public Blog Design

## Goal

Create a public Hugo site for `benpearson.dev` that supports polished essays and lower-friction lab notes drafted in Obsidian, then exported into a separate public repository by a repo-owned script.

## Content Model

Drafts live in `/home/ben/vault/Human/Public Blog/`. A note is eligible for publishing only when its frontmatter contains `should_publish: true`.

Published content uses a single Hugo section, `content/writing/`, with `content_type: post` or `content_type: lab` to express the reader promise:

- `post`: polished, edited, shareable article.
- `lab`: working note, experiment log, implementation note, or rough idea worth sharing.

The Obsidian folder stays flat by default. The `content_type` frontmatter controls presentation and filtering rather than requiring separate draft folders.

## Publishing Flow

The public site repo contains the publisher script under `scripts/`. `minibot` checks out the repo and runs the script from cron.

The script reads only `/home/ben/vault/Human/Public Blog/`, finds Markdown files with `should_publish: true`, exports them to `content/writing/<slug>/index.md`, and then sets `should_publish: false` in the source note after a successful export.

On first publish, if `slug` is missing, the script derives one from the Obsidian filename and writes it back to the source note. Future publishes use the existing `slug` so Obsidian renames do not change public URLs.

## Safety

The script fails closed when required frontmatter is missing, when `content_type` is not `post` or `lab`, or when a generated slug conflicts with an existing different source. The script does not scan or mutate any other vault folder.

## Site

The site is Hugo-based, Cloudflare Pages-friendly, and intentionally minimal. The initial repo includes layouts, a writing list, RSS, sample content, and documentation. Theme dependencies are avoided at first to keep the repo portable.
