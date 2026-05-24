# benpearson.dev

Hugo source for `benpearson.dev`, with a repo-owned publisher script that exports selected Obsidian notes into the public site.

## Content Workflow

Draft in Obsidian under:

```text
/home/ben/vault/Human/Public Blog/
```

Use this frontmatter contract:

```yaml
---
title: "Readable Public Title"
should_publish: true
content_type: lab # post or lab
summary: "Short summary for listings."
tags:
  - ai
---
```

On first publish, the script derives `slug` from the filename and writes it back to the Obsidian note. Later publishes reuse the existing `slug`, so renaming the Obsidian file does not change the public URL.

After a successful publish, the script sets `should_publish: false`. To overwrite an existing public page, set `should_publish: true` again.

## Publish From Minibot

Run from this repo:

```bash
npm run publish:vault
```

A cron job on `minibot` can run that command, then commit and push changes if the working tree changed. Keep credentials in the local machine account; do not store secrets in this repo.

## Development

Run publisher tests:

```bash
npm test
```

Build the Hugo site:

```bash
hugo --minify
```

Hugo is not vendored. Install it locally or let Cloudflare Pages provide it during builds.

## Cloudflare Pages

Suggested build settings:

- Build command: `hugo --minify`
- Build output directory: `public`
- Environment variable: `HUGO_VERSION` set to a current extended Hugo release
