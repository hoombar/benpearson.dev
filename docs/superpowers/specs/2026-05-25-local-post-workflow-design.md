# Local Post Workflow And Blog Skill Design

## Goal

Support local experimentation with Hugo blog posts while keeping publishing controlled. The site repository is the only content workflow target, Cloudflare Pages builds from GitHub, and a separate personal skill helps generate draft posts in Ben's preferred writing style.

## Scope

This work covers two related pieces:

- Add direct Hugo authoring documentation to this repository.
- Create a reusable personal skill in `~/dev/claude-skills` for generating `benpearson.dev` draft posts.

This work does not change the site layout, Cloudflare account state, DNS records, or existing Obsidian publisher behavior. The new workflow bypasses Obsidian entirely.

## Repository Workflow

Posts are authored directly as Hugo page bundles:

```text
content/writing/<slug>/
`-- index.md
```

Each generated or hand-written post should use frontmatter compatible with the current writing layouts:

```yaml
---
title: "Readable Public Title"
slug: readable-public-title
content_type: post
summary: "Short listing summary."
date: 2026-05-25
draft: true
tags:
  - example
---
```

Drafts default to `draft: true`. Local preview uses `hugo server -D --port 1313`, which includes drafts. Production builds use `hugo --minify`, which excludes draft content unless the draft flag is removed or set to `false`.

## Cloudflare Pages Workflow

Cloudflare Pages should connect directly to the GitHub repository and build on pushes to `main`.

Recommended Cloudflare settings:

- Framework preset: Hugo, or no preset with explicit settings.
- Production branch: `main`.
- Build command: `hugo --minify`.
- Build output directory: `public`.
- Environment variable: `HUGO_VERSION=0.147.5`.
- Custom domain: `benpearson.dev`.

Because drafts are excluded from normal Hugo production builds, generated draft posts can be committed and pushed without appearing publicly. Publishing a post is an explicit edit to remove `draft: true` or set `draft: false`, followed by commit and push.

## Personal Skill Workflow

The blog-generation skill should live outside this repo in `~/dev/claude-skills`, not under the Hugo project. The skill is agent behavior rather than site content, and keeping it separate avoids coupling Cloudflare builds to personal agent tooling.

The skill should trigger when Ben asks to generate, draft, shape, or prepare a post for `benpearson.dev`. It should:

- Read the Hugo repository conventions before writing content.
- Use style guidance stored with the personal skill, not in Obsidian, as the tone-of-voice reference.
- Ask for the topic, angle, intended `content_type`, tags, and source material if missing.
- Create a Hugo page bundle at `content/writing/<slug>/index.md`.
- Set `draft: true` by default.
- Avoid committing, pushing, or publishing unless Ben explicitly asks.
- Remind Ben to preview locally with `hugo server -D --port 1313`.

## Boundaries

The skill may create or modify files in the Hugo repository when explicitly generating a post. It should not read from or write to Obsidian as part of this workflow. It should treat its bundled style guidance as a reference, not as content to overwrite.

## Testing And Verification

Repository documentation changes should be verified with the existing test suite:

```bash
npm test
```

The skill should be developed using the writing-skills TDD workflow: baseline pressure scenarios without the skill, then the skill, then repeat scenarios to verify that agents create draft Hugo bundles with appropriate frontmatter and do not publish without explicit instruction.

## Open Questions Resolved

- Direct Hugo authoring replaces Obsidian publishing for this workflow.
- Cloudflare Pages should connect directly to GitHub.
- Generated posts should default to `draft: true`.
- The personal skill should live in `~/dev/claude-skills`, with this repo retaining only authoring and deployment documentation.
- Tone-of-voice guidance should live with the personal skill, not in Obsidian.
