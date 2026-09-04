/**
 * Architecture rules, checked by `make arch`. These are the constraints that
 * ESLint cannot see: ESLint looks at one file at a time, so it can ban a call
 * but not an edge in the module graph.
 *
 * See docs/dev/architecture-rules.md.
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "A cycle makes module init order significant and load-bearing, which breaks in ways " +
        "that depend on which file the bundler happens to enter first. Extract the shared " +
        "piece into a module both sides can depend on.",
      from: {},
      to: { circular: true },
    },
    {
      name: "domain-stays-pure",
      severity: "error",
      comment:
        "`model/` holds validation and domain rules; it must not reach into the web layer " +
        "or into persistence — not even for a type. Entity types belong here, where both " +
        "adapters can import them; a type that only means something to the database stays " +
        "in `db/` and is used only there.",
      from: { path: "^model/" },
      to: { path: "^(app|db)/" },
    },
    {
      name: "persistence-does-not-reach-up",
      severity: "error",
      comment:
        "`db/` is a driven adapter. If it needs something from the web layer, the dependency " +
        "is pointing the wrong way — pass the value in instead.",
      from: { path: "^db/" },
      to: { path: "^app/" },
    },
    {
      name: "no-unresolvable",
      severity: "error",
      comment: "A dependency that does not resolve is a broken import.",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-deprecated-core",
      severity: "error",
      comment: "Deprecated Node core module; these get removed.",
      from: {},
      to: { dependencyTypes: ["core"], path: "^(punycode|domain|sys)$" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: {
      path: "(^|/)(\\.next|coverage|site|playwright-report|test-results)/",
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      mainFields: ["module", "main", "types", "typings"],
    },
    reporterOptions: {
      dot: { collapsePattern: "^(app|db|model|utils|tests)/[^/]+" },
    },
  },
};
