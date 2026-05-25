import { execFile } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
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
  assert.match(html, /src="\/img\/profile\.png"/);
  assert.match(html, /https:\/\/github\.com\/hoombar/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/ben-pearson-2a320a75\//);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /class="social-icon" aria-hidden="true"/);
  assert.match(html, /Recent Writing/);
});

test("desktop sidebar has a fixed maximum width", async () => {
  const css = await readFile(path.join(process.cwd(), "assets", "css", "main.css"), "utf8");

  assert.match(css, /grid-template-columns:\s*280px minmax\(0, 1fr\)/);
});

test("homepage spacing is compact", async () => {
  const css = await readFile(path.join(process.cwd(), "assets", "css", "main.css"), "utf8");

  assert.match(css, /\.hero\s*{[^}]*padding:\s*44px 0 34px/s);
  assert.match(css, /font-size:\s*clamp\(2\.2rem, 5\.2vw, 4\.15rem\)/);
  assert.match(css, /\.section-header\s*{[^}]*margin-top:\s*18px/s);
  assert.match(css, /\.profile-link\s*{[^}]*margin-bottom:\s*18px/s);
});
