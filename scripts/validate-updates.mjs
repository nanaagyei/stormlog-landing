import { readFile } from "node:fs/promises";
import { validateUpdatesContent } from "./lib/validate-updates.mjs";
import { validateReleaseHistory } from "./lib/release-history.mjs";

const updates = JSON.parse(await readFile("src/data/updates.json", "utf8"));
const history = JSON.parse(await readFile("src/data/release-history.json", "utf8"));
const checks = [
  validateUpdatesContent(updates),
  validateReleaseHistory(history, updates.version),
];
const errors = checks.flatMap((check) => check.errors);
if (errors.length > 0) {
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log("Release content and history OK");
}
