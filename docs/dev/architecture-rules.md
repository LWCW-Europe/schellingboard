# Architecture rules

Conventions that only live in a document decay. These are the ones the build
checks, and where each kind belongs.

Two mechanisms, split by what they can see:

| Mechanism            | Sees                   | Good for                                      |
| -------------------- | ---------------------- | --------------------------------------------- |
| ESLint               | one file at a time     | banned calls, banned syntax, required shapes  |
| `dependency-cruiser` | the whole module graph | cycles, layer boundaries, "X may not reach Y" |

Run them with `make lint` and `make arch`; `make precommit` runs both.

## ESLint: rules about code inside a file

Most single-file rules need no plugin. `no-restricted-syntax` takes
[esquery](https://github.com/estools/esquery) selectors, so a rule is one
selector plus the sentence you want the author to read:

```js
{
  selector: "NewExpression[callee.name='Date'][arguments.length=0]",
  message: "`new Date()` reads an ambient clock. …",
}
```

Scope it with a config block listing the enforced areas in `files`. The
ambient-clock ban (ADR 0004) is the worked example: it covers `app/`, `db/`,
`emails/`, `model/` and `utils/`.

Exempt a line, not a file, with `eslint-disable-next-line <rule> -- <reason>`.
A file-wide `ignores` entry would stop checking the other hundred lines too,
and an exemption is usually one call in an otherwise ordinary file. The `--`
reason is mandatory: it is what the next reader has instead of this page.

**Gotcha:** route-group and dynamic-segment paths need `**`. Flat config globs
are minimatch, which reads `[eventSlug]` as a character class, so a literal
`app/(site)/[eventSlug]/kiosk.tsx` silently matches nothing — and a `files`
entry that matches nothing looks exactly like one that works.

When a selector can't express the rule, write a local rule inline — flat config
takes a plugin object literally, so there is no package to publish and no build
step:

```js
const local = {
  rules: {
    "my-rule": {
      create(context) {
        /* … */
      },
    },
  },
};
export default tseslint.config({
  plugins: { local },
  rules: { "local/my-rule": "error" },
});
```

Because `projectService` is on, such rules get the TypeScript type checker, not
just the syntax tree.

## dependency-cruiser: rules about the module graph

ESLint reads one file at a time, so it cannot see a cycle or a layer violation
three hops out. `.dependency-cruiser.cjs` holds those. A rule is a `from` set,
a `to` set, and the reason:

```js
{
  name: "domain-stays-pure",
  severity: "error",
  comment: "why this edge is wrong, and what to do instead",
  from: { path: "^model/" },
  to: { path: "^(app|db)/" },
}
```

`dependencyTypesNot: ["type-only"]` would narrow a rule to runtime edges only —
a useful escape valve mid-migration, when a shared type is still declared on the
wrong side of a boundary. Neither layer rule uses it: an import the compiler
erases still points the wrong way, and a boundary that holds only at runtime is
one nobody can reason about from the import list.

The direction that matters is inward. `db/` and `app/` are adapters and may
depend on `model/`; `model/` may not depend on them. Types follow the same
direction: an entity type is domain vocabulary and belongs in `model/`, where
both adapters can import it. A type that only means something to the database —
a row shape, a driver's handle — stays in `db/` and is used only inside `db/`.
The repository ports belong in the centre too, next to the types they speak in;
`db/` is then adapters and row shapes only.

We are not there yet. `db/repositories/interfaces.ts` still holds the entity
vocabulary alongside the ports, and 62 files outside `db/` import their domain
types from it. `CONTACT_TYPES` moving to `model/guest.ts` is the first instance
of the fix; issue #965 has the inventory and the order to do the rest in.

`make arch-graph` renders the graph to `arch-graph.svg` (needs graphviz), which
is usually faster than arguing about where a boundary should go.

## Adding a rule

1. Write it, and **check that it fails** on a file that violates it — a
   mis-scoped rule reports success and enforces nothing.
2. Fix the violations it finds, or list them as exemptions with the reason.
   Prefer fixing: an exemption granted at introduction tends to be permanent.
3. Put the reason in the rule's `message`/`comment`, not only in a doc. The
   person who hits it is reading the error, not this page.
