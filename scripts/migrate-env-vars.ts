/**
 * migrate-env-vars.ts
 *
 * Standardizes environment variable names and removes Replit-specific
 * references from route files.
 *
 * Run from the project root:
 *   npx tsx scripts/migrate-env-vars.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

const replacements: [string, string][] = [
  // Env var renames
  ["AI_INTEGRATIONS_OPENAI_API_KEY", "OPENAI_API_KEY"],
  ["AI_INTEGRATIONS_OPENAI_BASE_URL", "OPENAI_BASE_URL"],
  // Auth references
  ["Replit authentication", "Clerk authentication"],
  // Proxy references
  ["Replit AI proxy", "OpenAI API"],
  ["OpenAI via Replit proxy", "OpenAI API"],
];

const targetFiles = [
  "server/routes.ts",
  "server/replit_integrations/chat/routes.ts",
];

let totalChanges = 0;

for (const relPath of targetFiles) {
  const absPath = join(ROOT, relPath);
  let content: string;
  try {
    content = readFileSync(absPath, "utf8");
  } catch {
    console.error(`  SKIP ${relPath} (file not found)`);
    continue;
  }

  let fileChanges = 0;
  for (const [from, to] of replacements) {
    const count = content.split(from).length - 1;
    if (count > 0) {
      content = content.replaceAll(from, to);
      fileChanges += count;
      console.log(`  ${relPath}: replaced "${from}" -> "${to}" (${count}x)`);
    }
  }

  if (fileChanges > 0) {
    writeFileSync(absPath, content);
    console.log(`  ✓ Updated ${relPath} (${fileChanges} replacements)\n`);
    totalChanges += fileChanges;
  } else {
    console.log(`  – ${relPath}: already up to date\n`);
  }
}

console.log(`Done. ${totalChanges} total replacements across ${targetFiles.length} files.`);
