import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_VAULT_DIR = "/home/ben/vault/Human/Public Blog";
const VALID_CONTENT_TYPES = new Set(["post", "lab"]);

export async function publishFromVault({ vaultDir = DEFAULT_VAULT_DIR, siteDir = process.cwd() } = {}) {
  const entries = await readdir(vaultDir, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const published = [];
  const seenSlugs = new Map();

  for (const fileName of markdownFiles) {
    const sourcePath = path.join(vaultDir, fileName);
    const original = await readFile(sourcePath, "utf8");
    const note = parseMarkdownWithFrontmatter(original, sourcePath);

    if (note.frontmatter.should_publish !== true) {
      continue;
    }

    validatePublishableNote(note.frontmatter, sourcePath);

    const slug = note.frontmatter.slug || slugify(path.basename(fileName, ".md"));
    const conflictingSource = seenSlugs.get(slug);
    if (conflictingSource) {
      throw new Error(`Slug conflict for ${slug}: ${conflictingSource} and ${sourcePath}`);
    }
    seenSlugs.set(slug, sourcePath);

    const nextFrontmatter = {
      ...note.frontmatter,
      slug,
      should_publish: false,
    };

    const exportFrontmatter = {
      ...note.frontmatter,
      slug,
      should_publish: false,
      source_path: sourcePath,
    };

    const outputDir = path.join(siteDir, "content", "writing", slug);
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.md"), formatMarkdown(exportFrontmatter, note.body));
    await writeFile(sourcePath, formatMarkdown(nextFrontmatter, note.body));
    published.push({ sourcePath, slug });
  }

  return { published };
}

function validatePublishableNote(frontmatter, sourcePath) {
  if (!frontmatter.title) {
    throw new Error(`${sourcePath}: title is required`);
  }

  if (!VALID_CONTENT_TYPES.has(frontmatter.content_type)) {
    throw new Error(`${sourcePath}: content_type must be "post" or "lab"`);
  }
}

function parseMarkdownWithFrontmatter(content, sourcePath) {
  if (!content.startsWith("---\n")) {
    throw new Error(`${sourcePath}: YAML frontmatter is required`);
  }

  const end = content.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error(`${sourcePath}: YAML frontmatter is not closed`);
  }

  const rawFrontmatter = content.slice(4, end);
  const body = content.slice(end + 5).replace(/^\n/, "");
  return {
    frontmatter: parseSimpleYaml(rawFrontmatter),
    body,
  };
}

function parseSimpleYaml(yaml) {
  const data = {};
  const lines = yaml.split("\n");
  let currentListKey = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentListKey) {
      data[currentListKey].push(parseScalar(listMatch[1]));
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!keyValueMatch) {
      throw new Error(`Unsupported frontmatter line: ${line}`);
    }

    const [, key, rawValue = ""] = keyValueMatch;
    if (rawValue === "") {
      data[key] = [];
      currentListKey = key;
    } else {
      data[key] = parseScalar(rawValue);
      currentListKey = null;
    }
  }

  return data;
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function formatMarkdown(frontmatter, body) {
  return `---\n${formatSimpleYaml(frontmatter)}---\n\n${body.trim()}\n`;
}

function formatSimpleYaml(data) {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []\n`;
        return `${key}:\n${value.map((item) => `  - ${formatScalar(item)}`).join("\n")}\n`;
      }
      return `${key}: ${formatScalar(value)}\n`;
    })
    .join("");
}

function formatScalar(value) {
  if (typeof value === "boolean") return String(value);
  const text = String(value);
  if (/^[a-z0-9][a-z0-9-]*$/i.test(text)) return text;
  return JSON.stringify(text);
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  publishFromVault()
    .then((result) => {
      for (const item of result.published) {
        console.log(`Published ${item.slug}`);
      }
      if (result.published.length === 0) {
        console.log("No notes marked should_publish: true");
      }
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
