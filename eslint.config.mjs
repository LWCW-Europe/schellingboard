import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

// eslint-config-next bundles its own typescript-eslint, so it registers
// @typescript-eslint from a different module instance than our top-level dep.
// Strip that registration here so tseslint.configs.recommendedTypeChecked
// below is the sole registrar — one instance, no flat-config plugin conflict.
function dropTsPlugin(configs) {
  return configs.map((cfg) => {
    if (!cfg.plugins?.["@typescript-eslint"]) return cfg;
    const { "@typescript-eslint": _, ...rest } = cfg.plugins;
    return { ...cfg, plugins: rest };
  });
}

// "Now" enters at the request boundary and is passed down; reading an ambient
// clock deeper in silences the dev fake clock. See docs/dev/adr/0004-dev-fake-clock.md.
// Zero-argument forms only — `new Date(iso)` parses, it does not read a clock.
const noAmbientClock = [
  {
    selector: "NewExpression[callee.name='Date'][arguments.length=0]",
    message:
      "`new Date()` reads an ambient clock. Take `now` from serverNow(), requestNow(req) or EventContext.now and pass it down (ADR 0004).",
  },
  {
    selector:
      "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    message:
      "`Date.now()` reads an ambient clock. Take `now` from serverNow(), requestNow(req) or EventContext.now (ADR 0004). For elapsed time, use performance.now().",
  },
  {
    selector:
      "CallExpression[callee.object.name='DateTime'][callee.property.name=/^(now|local|utc)$/][arguments.length=0]",
    message:
      "Luxon's DateTime.now()/local()/utc() read an ambient clock. Use DateTime.fromJSDate(now) with the request's clock (ADR 0004).",
  },
];

export default tseslint.config(
  {
    // `site/` is the generated docs site (see docs/dev/documentation.md);
    // its JS comes from docmd, not from us. The Playwright output below is
    // likewise not ours — and the trace viewer bundle inside the html report
    // is big enough to run eslint out of heap, so an E2E run would otherwise
    // leave `make lint` crashing until the report is deleted.
    ignores: [
      "tailwind.config.ts",
      ".dependency-cruiser.cjs",
      ".next/**",
      "**/*.mjs",
      ".jj/**",
      "site/**",
      "coverage/**",
      "docs/dev/attendance-model/.venv/**",
      "playwright-report/**",
      "blob-report/**",
      "test-results/**",
      ".flake-hunt/**",
      ".e2e-docker/**",
      ".claude/worktrees/**",
    ],
  },
  ...dropTsPlugin(coreWebVitals),
  ...dropTsPlugin(nextTypescript),
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ["db/repositories/sqlite/*.ts"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    files: [
      "app/**/*.{ts,tsx,js,jsx}",
      "db/**/*.{ts,js}",
      "emails/**/*.{ts,tsx,js,jsx}",
      "model/**/*.{ts,js}",
      "utils/**/*.{ts,js}",
    ],
    // Exemptions are per-line `eslint-disable-next-line no-restricted-syntax`
    // comments carrying their own reason, not file-wide ignores here: a file
    // that legitimately reads the real clock once still has every other line
    // checked. Two kinds survive — the fake clock itself and the pieces that
    // turn real time into effective time, and reads that are real-time by
    // design per ADR 0004 (auth cookie age, login and email throttles,
    // cache-busting `?v=` stamps). Elapsed time uses performance.now().
    rules: {
      "no-restricted-syntax": ["error", ...noAmbientClock],
    },
  }
);
