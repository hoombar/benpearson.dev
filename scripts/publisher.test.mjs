import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { publishFromVault } from "./publisher.mjs";

async function tempWorkspace() {
  const root = await mkdtemp(path.join(tmpdir(), "publisher-"));
  const workspace = {
    root,
    vaultDir: path.join(root, "vault", "Human", "Public Blog"),
    siteDir: path.join(root, "site"),
  };
  await mkdir(workspace.vaultDir, { recursive: true });
  await mkdir(workspace.siteDir, { recursive: true });
  return workspace;
}

test("publishes eligible note, derives slug, and resets source flag", async () => {
  const { vaultDir, siteDir } = await tempWorkspace();
  await writeFile(
    path.join(vaultDir, "My First Lab Note.md"),
    `---
title: "My First Lab Note"
should_publish: true
content_type: lab
summary: "A short note."
tags:
  - ai
---

# My First Lab Note

Body text.
`,
    { flag: "wx" },
  );

  const result = await publishFromVault({ vaultDir, siteDir });

  assert.deepEqual(result.published.map((item) => item.slug), ["my-first-lab-note"]);
  const exported = await readFile(path.join(siteDir, "content", "writing", "my-first-lab-note", "index.md"), "utf8");
  assert.match(exported, /slug: my-first-lab-note/);
  assert.match(exported, /content_type: lab/);
  assert.match(exported, /Body text\./);

  const source = await readFile(path.join(vaultDir, "My First Lab Note.md"), "utf8");
  assert.match(source, /slug: my-first-lab-note/);
  assert.match(source, /should_publish: false/);
});

test("reuses existing slug when the Obsidian filename changes", async () => {
  const { vaultDir, siteDir } = await tempWorkspace();
  await writeFile(
    path.join(vaultDir, "Renamed Draft.md"),
    `---
title: "Stable URL"
slug: stable-url
should_publish: true
content_type: post
---

Updated body.
`,
    { flag: "wx" },
  );

  const result = await publishFromVault({ vaultDir, siteDir });

  assert.deepEqual(result.published.map((item) => item.slug), ["stable-url"]);
  const exported = await readFile(path.join(siteDir, "content", "writing", "stable-url", "index.md"), "utf8");
  assert.match(exported, /Updated body\./);
});

test("skips notes without should_publish true", async () => {
  const { vaultDir, siteDir } = await tempWorkspace();
  await writeFile(
    path.join(vaultDir, "Private Draft.md"),
    `---
title: "Private Draft"
should_publish: false
content_type: lab
---

Not public.
`,
    { flag: "wx" },
  );

  const result = await publishFromVault({ vaultDir, siteDir });

  assert.deepEqual(result.published, []);
});

test("rejects eligible notes with invalid content_type", async () => {
  const { vaultDir, siteDir } = await tempWorkspace();
  await writeFile(
    path.join(vaultDir, "Bad Type.md"),
    `---
title: "Bad Type"
should_publish: true
content_type: diary
---

Body.
`,
    { flag: "wx" },
  );

  await assert.rejects(
    () => publishFromVault({ vaultDir, siteDir }),
    /content_type must be "post" or "lab"/,
  );
});

test("rejects two eligible notes that resolve to the same slug", async () => {
  const { vaultDir, siteDir } = await tempWorkspace();
  await writeFile(
    path.join(vaultDir, "First Draft.md"),
    `---
title: "First Draft"
slug: shared-slug
should_publish: true
content_type: lab
---

First body.
`,
    { flag: "wx" },
  );
  await writeFile(
    path.join(vaultDir, "Second Draft.md"),
    `---
title: "Second Draft"
slug: shared-slug
should_publish: true
content_type: lab
---

Second body.
`,
    { flag: "wx" },
  );

  await assert.rejects(
    () => publishFromVault({ vaultDir, siteDir }),
    /Slug conflict for shared-slug/,
  );
});
