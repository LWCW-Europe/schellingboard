import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
    ],
    environment: "node",
    pool: "forks",
    silent: "passed-only",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: ["tests/**"],
      // Slightly below actual coverage (see `make test-coverage`) so real
      // regressions fail while small refactors don't. Ratchet up over time.
      thresholds: {
        statements: 85,
        branches: 84,
        functions: 80,
        lines: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
