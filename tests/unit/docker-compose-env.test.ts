import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

/**
 * docker-compose.yml is the one file in the repository whose only user is a
 * self-hoster: no target builds it, no test runs it. Its failure mode is
 * silent — a variable the app has started reading is documented and set in the
 * self-hoster's `.env`, but never reaches the container, so the feature just
 * doesn't work and nothing says why. These are the cheapest checks that catch
 * that, and they run with every `make test`.
 */

const ROOT = path.join(__dirname, "../..");

function read(relative: string): string {
  return readFileSync(path.join(ROOT, relative), "utf8");
}

/** Variables docker-compose.yml takes from the environment, `${LIKE_THIS}`. */
function interpolatedVars(yaml: string): Set<string> {
  return new Set(
    [...yaml.matchAll(/\$\{([A-Z_][A-Z0-9_]*)/g)].map((m) => m[1])
  );
}

/** Variables `.env.docker.example` offers, one `NAME=` per line. */
function exampleVars(env: string): Set<string> {
  return new Set([...env.matchAll(/^([A-Z_][A-Z0-9_]*)=/gm)].map((m) => m[1]));
}

/** Variables the Configuration reference lists, one per table row. */
function documentedVars(markdown: string): Set<string> {
  return new Set(
    [...markdown.matchAll(/^\| `([A-Z_][A-Z0-9_]*)`/gm)].map((m) => m[1])
  );
}

// Documented variables that deliberately do not reach the container through
// compose. Adding a variable to the reference table means deciding which side
// of this line it falls on.
const NOT_PASSED_BY_COMPOSE: Record<string, string> = {
  DATABASE_URL:
    "the Dockerfile defaults it to /data/data.db, and compose sets that literally rather than from the environment",
  SB_UPLOADS_DIR:
    "the Dockerfile defaults it to /data/uploads, inside the volume",
  SB_ENABLE_DEV_TOOLS:
    "a staging/demo switch, deliberately not offered in a production deployment",
};

describe("docker-compose.yml stays in sync with its documentation", () => {
  const compose = interpolatedVars(read("docker-compose.yml"));
  const example = exampleVars(read(".env.docker.example"));
  const documented = documentedVars(
    read("docs/public/self-hosting/configuration.md")
  );

  it("offers exactly the variables it reads in .env.docker.example", () => {
    // Both directions matter: a variable compose reads but the example omits
    // is one nobody knows to set, and one the example offers but compose never
    // reads is one that silently does nothing.
    expect([...example].sort()).toEqual([...compose].sort());
  });

  it("passes through every documented variable, or says why not", () => {
    const missing = [...documented].filter(
      (name) => !compose.has(name) && !(name in NOT_PASSED_BY_COMPOSE)
    );
    expect(missing).toEqual([]);
  });

  it("has no stale exemptions", () => {
    const stale = Object.keys(NOT_PASSED_BY_COMPOSE).filter(
      (name) => !documented.has(name) || compose.has(name)
    );
    expect(stale).toEqual([]);
  });
});
