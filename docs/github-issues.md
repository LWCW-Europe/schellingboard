# Creating and Reading GitHub Issues

This repo uses two conventions beyond GitHub's built-in issue fields: an **Issue Type**
(`Task` / `Bug` / `Feature`) and a custom single-select **Priority** field (`Urgent` / `High` /
`Medium` / `Low`). No labels are used — type and Priority carry that information instead.

Neither field is exposed by `gh issue create`/`gh issue edit`/`gh issue view` — both require the
GraphQL API (`gh api graphql`).

## Reading an issue's type and priority

`gh issue view --json` doesn't expose either field. Use REST instead:

```bash
gh api repos/LWCW-Europe/schellingboard/issues/123 --jq \
  '{type: .type.name, priority: (.issue_field_values[]? | select(.issue_field_name=="Priority") | .single_select_option.name)}'
```

## IDs needed for mutations

Repo id, issue type ids, and the Priority field/option ids (stable, but re-fetch if unsure):

```bash
gh api graphql -f query='
{ repository(owner: "LWCW-Europe", name: "schellingboard") {
    id
    issueTypes(first: 10) { nodes { id name } }
} }'

gh api graphql -f query='
{ repository(owner: "LWCW-Europe", name: "schellingboard") {
    issueFields(first: 20) { nodes { ... on IssueFieldSingleSelect { id name options { id name } } } }
} }'
```

Known values as of 2026-07-22 (double-check if a query above disagrees):

| Name             | ID                    |
| ---------------- | --------------------- |
| Repo             | `R_kgDOO4ASpA`        |
| Type: Task       | `IT_kwDODU0pG84Bqq5u` |
| Type: Bug        | `IT_kwDODU0pG84Bqq5v` |
| Type: Feature    | `IT_kwDODU0pG84Bqq5w` |
| Priority field   | `IFSS_kgDOAhz4lg`     |
| Priority: Urgent | `IFSSO_kgDOA7KbIA`    |
| Priority: High   | `IFSSO_kgDOA7KbIQ`    |
| Priority: Medium | `IFSSO_kgDOA7KbIg`    |
| Priority: Low    | `IFSSO_kgDOA7KbIw`    |

## Creating an issue with type and priority set

```bash
gh api graphql -f query='
mutation($repo: ID!, $title: String!, $body: String!, $type: ID!, $prioField: ID!, $prioOpt: ID!) {
  createIssue(input: {
    repositoryId: $repo, title: $title, body: $body, issueTypeId: $type,
    issueFields: [{ fieldId: $prioField, singleSelectOptionId: $prioOpt }]
  }) { issue { number url } }
}' \
  -f repo=R_kgDOO4ASpA \
  -f title="Issue title" \
  -f body="$(cat body.md)" \
  -f type=IT_kwDODU0pG84Bqq5w \
  -f prioField=IFSS_kgDOAhz4lg \
  -f prioOpt=IFSSO_kgDOA7KbIw
```

## Changing type/priority on an existing issue

Get the issue's node id first (`number` is not a valid GraphQL id):

```bash
gh api graphql -f query='{ repository(owner: "LWCW-Europe", name: "schellingboard") { issue(number: 123) { id } } }'
```

Then:

```bash
# Type
gh api graphql -f query='
mutation($issue: ID!, $type: ID!) {
  updateIssueIssueType(input: { issueId: $issue, issueTypeId: $type }) { issue { number } }
}' -f issue=<issue node id> -f type=<type id>

# Priority
gh api graphql -f query='
mutation($issue: ID!, $field: ID!, $opt: ID!) {
  setIssueFieldValue(input: { issueId: $issue, issueFields: [{ fieldId: $field, singleSelectOptionId: $opt }] }) { issue { number } }
}' -f issue=<issue node id> -f field=IFSS_kgDOAhz4lg -f opt=<priority option id>
```

## Body format conventions

Match existing issues' style:

- Sections as needed, in this rough order: `## Overview` / `## Current behavior` / `## Proposed
behavior` (or `## Proposed change`/`## Proposed fix`) / `## Why` / `## Impact` / `## Notes`
- Small bugs/tasks can just be a short paragraph — headers aren't mandatory.
- Reference file:line for code-specific bugs (e.g. `` `app/actions/user-auth.ts:130` ``).
- Keep it succinct; this is a scheduling app issue tracker, not a spec document.
