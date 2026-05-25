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
  assert.match(html, /Recent Writing/);
});
