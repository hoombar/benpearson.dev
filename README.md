# benpearson.dev

Hugo source for `benpearson.dev`.

## Content Workflow

Write posts directly as Hugo page bundles:

```text
content/writing/my-post-slug/
|-- index.md
|-- hero.webp
`-- screenshot.webp
```

Use this frontmatter contract:

```yaml
---
title: "Readable Public Title"
slug: my-post-slug
content_type: post # post or lab
summary: "Short summary for listings."
date: 2026-05-25
draft: true
tags:
  - example
---
```

Keep generated or experimental posts as `draft: true`. Preview drafts locally with `hugo server -D --port 1313`. To publish a post, remove `draft: true` or set it to `false`, then commit and push.

### Images And Other Post Media

Store post media in the same page bundle as `index.md`. Commit those files with the post so Cloudflare Pages has them during the Hugo build.

Reference media with relative Markdown paths:

```markdown
![Home Assistant dashboard](dashboard.webp)
```

Prefer optimized `.webp` files for screenshots and photos. Keep original, uncompressed assets outside this repo.

### Mermaid Diagrams

Use standard fenced Mermaid blocks:

````markdown
```mermaid
flowchart TD
  A[Draft] --> B[Publish]
```
````

Hugo renders these as Mermaid diagrams and loads Mermaid only on pages that include a Mermaid block.

## Development

Run tests:

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
- Environment variable: `HUGO_VERSION=0.147.5`
- Production branch: `main`
