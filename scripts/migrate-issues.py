#!/usr/bin/env python3
"""Give every issue/PR number of the legacy repo the same number in the new repo.

Open issues are transferred (keeping author, comments, reactions); everything else
becomes a closed stub linking to the original. The new repo itself is the only state:
each run continues at the first free number, so it can be stopped and re-run any time.

Needs `gh auth login`. Standard library only.
"""

import argparse
import json
import subprocess
import sys
import time
import urllib.error
import urllib.request

API = "https://api.github.com"
# GitHub's secondary limit is 500 content-creating requests/hour and 80/minute.
WRITE_INTERVAL = 3600 / 450
STUB_MARKER = "<!-- migration-stub -->"


class AmbiguousWrite(Exception):
    pass


class GitHub:
    def __init__(self, token, dry_run):
        self.token = token
        self.dry_run = dry_run
        self.last_write = 0.0

    def request(self, method, path, body=None, *, write=False, allow_404=False):
        if write and self.dry_run:
            print(f"    [dry-run] {method} {path}")
            return None
        url = path if path.startswith("http") else API + path
        for attempt in range(8):
            if write:
                time.sleep(max(0.0, self.last_write + WRITE_INTERVAL - time.monotonic()))
                self.last_write = time.monotonic()
            req = urllib.request.Request(
                url,
                method=method,
                data=json.dumps(body).encode() if body is not None else None,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                    "User-Agent": "schellingboard-issue-migration",
                },
            )
            try:
                with urllib.request.urlopen(req, timeout=60) as resp:
                    raw = resp.read()
                    return json.loads(raw) if raw else None
            except urllib.error.HTTPError as e:
                text = e.read().decode(errors="replace")
                if e.code in (403, 429) and is_rate_limited(e.headers, text):
                    # A rate-limited request was rejected outright, so retrying is safe.
                    wait = rate_limit_wait(e.headers, attempt)
                    print(f"    rate limited, sleeping {wait:.0f}s", flush=True)
                    time.sleep(wait)
                    continue
                if e.code == 404 and allow_404:
                    return None
                if e.code >= 500:
                    if write:
                        raise AmbiguousWrite(f"{method} {path}: HTTP {e.code}") from e
                    time.sleep(2**attempt)
                    continue
                raise RuntimeError(f"{method} {path}: HTTP {e.code}: {text}") from e
            except (urllib.error.URLError, TimeoutError) as e:
                if write:
                    raise AmbiguousWrite(f"{method} {path}: {e}") from e
                time.sleep(2**attempt)
        raise RuntimeError(f"{method} {path}: giving up after retries")

    def get(self, path, **kw):
        return self.request("GET", path, **kw)

    def paginate(self, path):
        sep = "&" if "?" in path else "?"
        page, items = 1, []
        while True:
            batch = self.get(f"{path}{sep}per_page=100&page={page}")
            items += batch
            if len(batch) < 100:
                return items
            page += 1

    def graphql(self, query, variables=None, *, write=False):
        for attempt in range(8):
            data = self.request(
                "POST", "/graphql", {"query": query, "variables": variables or {}}, write=write
            )
            if data is None:
                return None
            errors = data.get("errors")
            if not errors:
                return data["data"]
            if any(err.get("type") == "RATE_LIMITED" for err in errors):
                time.sleep(rate_limit_wait({}, attempt))
                continue
            raise RuntimeError(f"GraphQL error: {errors}")
        raise RuntimeError("GraphQL: giving up after retries")


def is_rate_limited(headers, text):
    return (
        "retry-after" in headers
        or headers.get("x-ratelimit-remaining") == "0"
        or "rate limit" in text.lower()
    )


def rate_limit_wait(headers, attempt):
    if "retry-after" in headers:
        return int(headers["retry-after"]) + 1
    if headers.get("x-ratelimit-remaining") == "0":
        return max(1, int(headers["x-ratelimit-reset"]) - time.time() + 5)
    return min(60 * 2**attempt, 900)


def die(msg):
    sys.exit(f"ERROR: {msg}")


def is_pr(item):
    return "pull_request" in item


def close_reason(item):
    if item is None:
        return "not_planned"
    if is_pr(item):
        return "completed" if item["pull_request"].get("merged_at") else "not_planned"
    return "not_planned" if item.get("state_reason") in ("not_planned", "duplicate") else "completed"


def stub_body(n, item, old):
    if item is None:
        text = (
            f"Placeholder that keeps issue numbers aligned with the legacy repository "
            f"https://github.com/{old}, which has no issue or pull request #{n}."
        )
    else:
        kind = "pull request" if is_pr(item) else "issue"
        user = item["user"]
        text = (
            f"This {kind} lives in the legacy repository: {item['html_url']}\n\n"
            f"Opened by [{user['login']}]({user['html_url']}) on {item['created_at'][:10]}."
        )
    return f"{STUB_MARKER}\n{text}"


class Migration:
    def __init__(self, gh, old, new):
        self.gh, self.old, self.new = gh, old, new

    def check_repos(self):
        old_repo = self.gh.get(f"/repos/{self.old}")
        new_repo = self.gh.get(f"/repos/{self.new}")
        if old_repo["full_name"] != self.old:
            die(f"{self.old} redirects to {old_repo['full_name']}; pass --old {old_repo['full_name']}")
        if old_repo["owner"]["login"] != new_repo["owner"]["login"] and not self.gh.dry_run:
            die("issues can only be transferred between repos of the same owner; move the old repo first")
        self.new_repo_id = new_repo["node_id"]
        self.new_owner = new_repo["owner"]["login"]

    def sync_labels(self):
        existing = {label["name"] for label in self.gh.paginate(f"/repos/{self.new}/labels")}
        for label in self.gh.paginate(f"/repos/{self.old}/labels"):
            if label["name"] not in existing:
                print(f"  creating label {label['name']!r}")
                self.gh.request(
                    "POST",
                    f"/repos/{self.new}/labels",
                    {k: label[k] for k in ("name", "color", "description") if label.get(k)},
                    write=True,
                )

    def load_issue_fields(self):
        data = self.gh.graphql(
            """query($login: String!) { organization(login: $login) { issueFields(first: 50) {
                 nodes { ... on IssueFieldSingleSelect { id name options { id name } } } } } }""",
            {"login": self.new_owner},
        )
        self.fields = {
            f["name"]: (f["id"], {o["name"]: o["id"] for o in f["options"]})
            for f in data["organization"]["issueFields"]["nodes"]
            if f
        }

    def next_free_number(self, new_items):
        numbers = sorted(new_items)
        if numbers != list(range(1, len(numbers) + 1)):
            missing = sorted(set(range(1, max(numbers) + 1)) - set(numbers))
            die(f"{self.new} has gaps at {missing[:10]}; numbers can no longer line up")
        n = len(numbers) + 1
        # The list endpoint can lag behind a write made just before a restart.
        while self.gh.get(f"/repos/{self.new}/issues/{n}", allow_404=True):
            n += 1
        return n

    def reconcile_stubs(self, new_items, old_items):
        for n, stub in sorted(new_items.items()):
            if not (stub.get("body") or "").startswith(STUB_MARKER):
                continue
            original = old_items.get(n)
            if original and not is_pr(original) and original["state"] == "open":
                print(f"  WARNING: #{n} was reopened in {self.old} after its stub was created; handle by hand")
            elif stub["state"] == "open":
                print(f"  closing stub #{n} left open by an interrupted run")
                self.close(n, original)

    def close(self, n, item):
        self.gh.request(
            "PATCH",
            f"/repos/{self.new}/issues/{n}",
            {"state": "closed", "state_reason": close_reason(item)},
            write=True,
        )

    def create_stub(self, n, item):
        title = item["title"] if item else f"Placeholder #{n}"
        print(f"#{n}: stub for {'gap' if item is None else 'PR' if is_pr(item) else 'closed issue'}: {title}", flush=True)
        created = self.gh.request(
            "POST",
            f"/repos/{self.new}/issues",
            {"title": title, "body": stub_body(n, item, self.old)},
            write=True,
        )
        if created is None:
            return
        if created["number"] != n:
            die(f"stub meant for #{n} was created as #{created['number']}; stopping")
        self.close(n, item)

    def transfer(self, n, item):
        print(f"#{n}: transferring open issue: {item['title']}", flush=True)
        data = self.gh.graphql(
            """mutation($issue: ID!, $repo: ID!) {
                 transferIssue(input: {issueId: $issue, repositoryId: $repo, createLabelsIfMissing: true}) {
                   issue { number } } }""",
            {"issue": item["node_id"], "repo": self.new_repo_id},
            write=True,
        )
        if data is None:
            return
        got = data["transferIssue"]["issue"]["number"]
        if got != n:
            die(f"#{n} was transferred but became #{got}; stopping")
        self.restore_type_and_fields(n, item)

    def restore_type_and_fields(self, n, item):
        moved = self.gh.get(f"/repos/{self.new}/issues/{n}")
        if item.get("type") and (moved.get("type") or {}).get("name") != item["type"]["name"]:
            print(f"    restoring type {item['type']['name']}")
            self.gh.request("PATCH", f"/repos/{self.new}/issues/{n}", {"type": item["type"]["name"]}, write=True)
        current = {
            v["issue_field_name"]: (v.get("single_select_option") or {}).get("name")
            for v in moved.get("issue_field_values") or []
        }
        for value in item.get("issue_field_values") or []:
            name = value["issue_field_name"]
            option = (value.get("single_select_option") or {}).get("name")
            if value["data_type"] != "single_select":
                print(f"    WARNING: cannot restore {value['data_type']} field {name!r}; set it by hand")
                continue
            if current.get(name) == option:
                continue
            if name not in self.fields or option not in self.fields[name][1]:
                print(f"    WARNING: {self.new_owner} has no {name}={option}; set it by hand")
                continue
            print(f"    restoring {name}={option}")
            field_id, options = self.fields[name]
            self.gh.graphql(
                """mutation($issue: ID!, $field: ID!, $opt: ID!) {
                     setIssueFieldValue(input: {issueId: $issue,
                       issueFields: [{fieldId: $field, singleSelectOptionId: $opt}]}) { issue { number } } }""",
                {"issue": moved["node_id"], "field": field_id, "opt": options[option]},
                write=True,
            )

    def run(self, limit):
        self.check_repos()
        self.sync_labels()
        self.load_issue_fields()
        done = 0
        while True:
            old_items = {i["number"]: i for i in self.gh.paginate(f"/repos/{self.old}/issues?state=all")}
            new_items = {i["number"]: i for i in self.gh.paginate(f"/repos/{self.new}/issues?state=all")}
            self.reconcile_stubs(new_items, old_items)
            start, last = self.next_free_number(new_items), max(old_items, default=0)
            if start > last:
                print(f"Up to date: {self.new} has #1..#{start - 1}.")
                return
            todo = last - start + 1
            print(f"Migrating #{start}..#{last} ({todo} numbers, roughly {todo * 2 * WRITE_INTERVAL / 3600:.1f}h)")
            for n in range(start, last + 1):
                if limit is not None and done >= limit:
                    print(f"Stopped after --limit {limit}.")
                    return
                item = old_items.get(n)
                if item and not is_pr(item) and item["state"] == "open":
                    self.transfer(n, item)
                else:
                    self.create_stub(n, item)
                done += 1
            if self.gh.dry_run:
                return
            # Loop again: issues may have been opened in the old repo while this ran.


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--old", default="schellingboard/schellingboard-legacy")
    parser.add_argument("--new", default="schellingboard/schellingboard")
    parser.add_argument("--dry-run", action="store_true", help="print what would happen, write nothing")
    parser.add_argument("--limit", type=int, help="stop after migrating this many numbers")
    args = parser.parse_args()

    token = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, check=True).stdout.strip()
    try:
        Migration(GitHub(token, args.dry_run), args.old, args.new).run(args.limit)
    except AmbiguousWrite as e:
        die(f"{e}\nThe write may or may not have happened. Re-run; the script re-checks the new repo.")
    except KeyboardInterrupt:
        die("interrupted; re-run to continue")


if __name__ == "__main__":
    main()
