import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);

test("homepage renders m10c-inspired sidebar shell", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "index.html"), "utf8");

  assert.match(html, /class="app-shell"/);
  assert.match(html, /class="site-sidebar"/);
  assert.match(html, /src="\/img\/profile\.jpeg"/);
  assert.match(html, /https:\/\/github\.com\/hoombar/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/ben-pearson-2a320a75\//);
  assert.match(html, /data-theme-toggle/);
  assert.doesNotMatch(html, /<select data-theme-toggle>/);
  assert.match(html, /class="social-icon social-icon-github"/);
  assert.match(html, /class="social-icon social-icon-linkedin"/);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /Recent Writing/);
});

test("sidebar keeps activities unlisted", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "index.html"), "utf8");
  const sidebar = html.match(/<aside class="site-sidebar">[\s\S]*?<\/aside>/)?.[0] ?? "";

  assert.doesNotMatch(sidebar, /href="\/activities\/"/);
  assert.doesNotMatch(sidebar, />Activities</);
});

test("homepage does not repeat the sidebar description as an eyebrow", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "index.html"), "utf8");
  const main = html.match(/<main class="app-container">[\s\S]*?<\/main>/)?.[0] ?? "";

  assert.doesNotMatch(main, /class="eyebrow"/);
  assert.doesNotMatch(main, /AI workflows, home automation, and useful experiments/);
});

test("theme toggle renders in the content pane", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "index.html"), "utf8");
  const sidebar = html.match(/<aside class="site-sidebar">[\s\S]*?<\/aside>/)?.[0] ?? "";
  const contentShell = html.match(/<div class="content-shell">[\s\S]*?<main class="app-container">/)?.[0] ?? "";

  assert.doesNotMatch(sidebar, /data-theme-toggle/);
  assert.match(contentShell, /class="content-toolbar"/);
  assert.match(contentShell, /type="button" class="theme-toggle"/);
  assert.match(contentShell, /data-theme-toggle/);
});

test("desktop sidebar has a fixed maximum width", async () => {
  const css = await readFile(path.join(process.cwd(), "assets", "css", "main.css"), "utf8");

  assert.match(css, /grid-template-columns:\s*280px minmax\(0, 1fr\)/);
});

test("homepage spacing is compact", async () => {
  const css = await readFile(path.join(process.cwd(), "assets", "css", "main.css"), "utf8");

  assert.match(css, /\.hero\s*{[^}]*padding:\s*18px 0 24px/s);
  assert.match(css, /font-size:\s*clamp\(2rem, 4\.4vw, 3\.45rem\)/);
  assert.match(css, /\.section-header\s*{[^}]*margin-top:\s*8px/s);
  assert.match(css, /\.profile-link\s*{[^}]*margin-bottom:\s*18px/s);
});

test("activity cards keep metadata away from card edge", async () => {
  const css = await readFile(path.join(process.cwd(), "assets", "css", "main.css"), "utf8");

  assert.match(css, /\.activity-card a\s*{[^}]*align-content:\s*start/s);
  assert.match(css, /\.activity-card a\s*{[^}]*padding:\s*18px 18px 28px/s);
});

test("Mermaid code blocks render as diagrams and load Mermaid", async () => {
  const contentDir = await mkdtemp(path.join(tmpdir(), "benpearson-content-"));
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));
  await mkdir(path.join(contentDir, "writing", "mermaid-post"), { recursive: true });
  await writeFile(
    path.join(contentDir, "writing", "mermaid-post", "index.md"),
    `---
title: "Mermaid Post"
content_type: lab
---

\`\`\`mermaid
flowchart TD
  A[Draft] --> B[Publish]
\`\`\`
`,
    { flag: "wx" },
  );

  await execFileAsync("/tmp/opencode/hugo", ["--contentDir", contentDir, "--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "writing", "mermaid-post", "index.html"), "utf8");

  assert.match(html, /<pre class="mermaid">\s*flowchart TD/);
  assert.match(html, /A\[Draft\] --&gt; B\[Publish\]/);
  assert.match(html, /mermaid@/);
  assert.match(html, /mermaid\.initialize\(\{ startOnLoad: true/);
});

test("plain code blocks render highlighted HTML without Hugo internals", async () => {
  const contentDir = await mkdtemp(path.join(tmpdir(), "benpearson-content-"));
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));
  await mkdir(path.join(contentDir, "writing", "code-post"), { recursive: true });
  await writeFile(
    path.join(contentDir, "writing", "code-post", "index.md"),
    `---
title: "Code Post"
content_type: lab
---

\`\`\`text
sensor.garmin_device_battery_level
\`\`\`
`,
    { flag: "wx" },
  );

  await execFileAsync("/tmp/opencode/hugo", ["--contentDir", contentDir, "--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "writing", "code-post", "index.html"), "utf8");

  assert.match(html, /<div class="highlight"><pre/);
  assert.match(html, /sensor\.garmin_device_battery_level/);
  assert.doesNotMatch(html, /\{\d+ \d+ <div class="highlight">/);
});

test("activities section renders searchable filters and activity cards", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "activities", "index.html"), "utf8");

  assert.match(html, /At Home Activities/);
  assert.match(html, /data-activity-search/);
  assert.match(html, /data-age-min/);
  assert.match(html, /data-duration-max/);
  assert.match(html, /data-indoor-filter/);
  assert.match(html, /data-outdoor-filter/);
  assert.match(html, /data-activity-card/);
});

test("activities JSON index is generated for client-side search", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const index = JSON.parse(await readFile(path.join(destination, "activities", "index.json"), "utf8"));

  assert.equal(index.length >= 200, true);
  assert.equal(typeof index[0].title, "string");
  assert.equal(typeof index[0].url, "string");
  assert.ok(Array.isArray(index[0].materials));
});

test("activity detail pages render metadata, materials, and SVG steps", async () => {
  const destination = await mkdtemp(path.join(tmpdir(), "benpearson-site-"));

  await execFileAsync("/tmp/opencode/hugo", ["--destination", destination], {
    cwd: process.cwd(),
  });

  const html = await readFile(path.join(destination, "activities", "paper-plate-owl", "index.html"), "utf8");

  assert.match(html, /Paper Plate Owl/);
  assert.match(html, /Ages /);
  assert.match(html, /Materials/);
  assert.match(html, /Illustrated Steps/);
  assert.match(html, /src="\/activities\/paper-plate-owl\/step-0\.svg"/);
});
