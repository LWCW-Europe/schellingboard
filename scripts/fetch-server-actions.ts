// Refreshes scripts/load-test/server-actions.json with the ids of the server
// actions the load test drives. Next recompiles each action to a fresh id, so
// the file must be regenerated against the manifest of the server the test
// will hit:
//
//   bun scripts/fetch-server-actions.ts        # ids of a dev build (make dev)
//   bun scripts/fetch-server-actions.ts --manifest .next/server/server-reference-manifest.json # a production build
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The five actions the load test exercises, named after the keys
// scripts/load-test/server-actions.ts exports.
const WANTED = [
  { key: "selectUserActionId", exportedName: "selectUserAction" },
  {
    key: "createProposalCommentActionId",
    exportedName: "createProposalComment",
  },
  { key: "createSessionCommentActionId", exportedName: "createSessionComment" },
  { key: "createProfileCommentActionId", exportedName: "createProfileComment" },
  { key: "updateProfileActionId", exportedName: "updateProfileAction" },
];

const OUTPUT = path.resolve(__dirname, "load-test/server-actions.json");

function main(): void {
  const manifestFlag = process.argv.indexOf("--manifest");
  const manifestPath =
    manifestFlag !== -1 && process.argv[manifestFlag + 1]
      ? path.resolve(process.argv[manifestFlag + 1])
      : path.resolve(
          __dirname,
          "../.next/dev/server/server-reference-manifest.json"
        );

  if (!fs.existsSync(manifestPath)) {
    console.error(
      `Cannot find the server-actions manifest at ${manifestPath}.`
    );
    console.error(
      "Start the server once (make dev) so Next compiles the actions, then retry."
    );
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    node?: Record<string, { exportedName?: string }>;
  };

  const found = new Map<string, string>();
  for (const [id, entry] of Object.entries(manifest.node ?? {})) {
    if (!entry.exportedName) continue;
    for (const wanted of WANTED) {
      if (
        entry.exportedName === wanted.exportedName &&
        !found.has(wanted.key)
      ) {
        found.set(wanted.key, id);
      }
    }
  }

  const missing = WANTED.filter((w) => !found.has(w.key));
  if (missing.length > 0) {
    console.error(
      `The manifest at ${manifestPath} does not export ${missing
        .map((w) => w.exportedName)
        .join(", ")} — is it stale?`
    );
    process.exit(1);
  }

  const ids = Object.fromEntries(WANTED.map((w) => [w.key, found.get(w.key)]));
  fs.writeFileSync(OUTPUT, JSON.stringify(ids, null, 2) + "\n");
  console.error(`Wrote ${OUTPUT} from ${manifestPath}`);
}

main();
