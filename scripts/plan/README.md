# scripts/plan — plan-as-data tooling

The custodian's work system's data half (`AUTONOMY.md` §1–§6, §9–§10, §15). Node's standard
library only — **no dependency is added anywhere here**; that is a red line
(`AI_DEVELOPMENT.md`'s custodian section), not a style preference.

## What the custodian may and may not change (AUTONOMY.md §1)

**May:** append `proposed` nodes to `PLAN.yaml`; move a node to `in-progress` when its branch
opens; move a node to `done` when its evidence verifies **and** `felt_verdict` is false; bump
`generation`; update `dates`.

**May not (the human only):** change any lane's `priority`; set `order` on a `proposed` node; mark
`done` any node with `felt_verdict: true`; delete a node. `docsOnly.mjs` (below) enforces the lane
priority and felt-verdict halves of this mechanically for the PR-delegation case (§9); nothing
here enforces the rest — it is a discipline the custodian's own workflow keeps, not a lock this
tooling can hold by itself.

## The declared YAML subset (`yamlSubset.mjs`)

`PLAN.yaml` is not general YAML. The declared grammar (AUTONOMY.md §1, quoted):

> two-space indentation; `key: value` scalars (unquoted plain strings, `"double-quoted"` strings
> with JSON escapes, integers, `true`/`false`, `null`); block lists of scalars or of maps (`- `
> items); flow lists `[a, b]`; flow maps `{k: v, k2: v2}`; `#` comments; **no** multi-line scalars,
> anchors, tags or nested flow inside flow.

`parseYamlSubset(text, source)` parses exactly this and nothing more, rejecting every other
construct — tabs, odd indentation, anchors/aliases/tags, block scalars (`|`/`>`), nested flow,
document markers, malformed lines, duplicate keys — with the offending line number
(`YamlSubsetError.line`). See `yamlSubset.test.mjs` for the full rejection list.

## `plan.mjs` — load, validate, derive

- `loadPlan(path)` reads and parses a plan file, validates it (see below), and returns the parsed
  object with a non-enumerable `_meta` (`{ path, text, hash }`, `hash` = sha256 of the raw file).
  Throws `PlanFileMissingError` (ENOENT) or `PlanValidationError` (`.errors`, an array of
  human-readable strings).
- `validatePlan(plan)` (exported separately for an already-parsed object): ids unique and
  kebab-case; every `depends_on`/`lane`/`phase` reference exists; no dependency cycles; `status` is
  one of the six (`done | in-progress | ready | blocked | proposed | unscheduled`);
  `needs_human.kind` is one of `none | sight | ruling | sitting | click`, with `minutes` present
  (a non-negative number) whenever `kind != none`; `done` requires non-null `evidence`;
  `felt_verdict: true` + `done` requires `verdict: {by: "human", cite: "..."}`.
- `deriveStates(plan, { smallFirst })` re-derives, live, which non-terminal nodes (status not
  `done`/`in-progress`/`proposed`/`unscheduled`) are `ready`, waiting on the human, or blocked on
  an unmet dependency — the recorded `ready`/`blocked` value is never trusted, only `depends_on`
  and `needs_human` are. Returns `{ ready, waitingOnHuman, blockedOnDeps }`, each ordered by lane
  `priority`, then `order`, then `id` (`smallFirst: true` orders `ready` by `budget_minutes`
  ascending instead — §10, "near the daily cap: prefer small nodes").
- `deriveStatusMap(plan)` — a `Map` from node id to its derived recorded status (`ready`/`blocked`)
  for every node eligible for derivation; used by `verify.mjs`'s status-agreement check.
- `nodeComparator(plan)`, `indexById(list)`, `prioritiesApproved(plan)`, `computePlanHash(text)` —
  small shared helpers reused by `queue.mjs`/`site.mjs`/`verify.mjs`.

Run `node scripts/plan/plan.mjs [path]` directly for a one-line sanity check (defaults to
`PLAN.yaml` at the repo root).

## `queue.mjs` — the generated queue (§2)

`node scripts/plan/queue.mjs [--plan <path>] [--out-dir <dir>] [--check]` writes
`CUSTODIAN-QUEUE.md` and `CUSTODIAN-QUEUE.json` (same content) next to the plan file by default.
Header carries the plan's sha256 and the generation time, plus a "seeded, pending approval" note
when `priorities_approved` is not `true` at the plan's top level. Sections, in order: **1. Next**
(the first ready node); **2. Ready**; **3. Waiting on the human** (grouped `click`, `sight`,
`ruling`, `sitting`, total minutes on the heading); **4. Blocked on dependencies** (with the
blocking ids); **5. In progress** (with evidence); **6. Proposed / unscheduled** (never queued).

`--check` regenerates in memory and exits 1 if the committed files differ — the drift check. The
generation timestamp is normalized out of the comparison first (`normalizeGeneratedTimestamp`), so
only real content drift fails; re-running the exact same plan a moment later never does.

## `verify.mjs` — CI's own check (§6)

`node scripts/plan/verify.mjs [--plan <path>] [--site-dir <dir>] [--offline]`:

1. Parses and validates `PLAN.yaml` (`loadPlan`).
2. **Status agreement**: recorded `ready`/`blocked` must equal the live derivation. Every `done`
   node's evidence must verify: `{pr: N}` — `gh api repos/{owner}/{repo}/pulls/N`, `.merged ===
   true` (skipped, not failed, under `--offline`); `{adr: "ADR-NNN"}` — the file exists under
   `docs/adr/` and its own Status line reads Accepted; `{tag: "..."}` — `git tag --list` lists it;
   `{release: "..."}` — `gh release view` finds it (skipped under `--offline`); `{commit: "..."}`
   — `git merge-base --is-ancestor <commit> origin/main`; `{path: "..."}` — a tracked file
   (`git ls-files --error-unmatch`); `{log: "..."}` — must ALSO be a tracked path (§12's archive
   requirement — a pointer into an untracked directory never verifies). `felt_verdict: true` +
   `done` additionally requires `verdict.by: "human"` and a `verdict.cite` that is found, verbatim,
   inside `DECISIONS-PENDING.md`.
3. **Drift**: regenerating `CUSTODIAN-QUEUE.md/.json` (`queue.mjs`'s own `checkQueueDrift`) and
   `site/` (`site.mjs`'s own `checkSiteDrift`) must produce no diff.

`--offline` skips the two GitHub-only checks (PR-merged, release-published) and says so on stderr;
every other check still runs. Exits 1 with every failure listed, one per line.

## `site.mjs` — the landing page (§5)

`node scripts/plan/site.mjs [--plan <path>] [--out-dir <dir>] [--repo owner/name] [--check]`
writes `site/index.html` (self-contained: inline CSS/JS; the only external resources are the
GitHub Actions workflow badge image and hyperlinks — no CDN, no external script), `site/data/
plan.json`, and `site/.nojekyll`. Reads `site/data/health.json` (machine facts, written by
`health.mjs`) and `site/data/build-health.json` (build-time facts, written by `buildHealth.mjs`
inside the Pages build) if present, for the health strip's two groups.

Swimlanes per lane, `done` nodes on the left with dates and evidence links, `ready`/`in-progress`/
`blocked`/`proposed` on the right with SVG dependency arrows drawn between nodes in the *same*
lane (a cross-lane dependency is shown as a text "after: &lt;dependency title&gt;" note instead,
linked to that node's anchor — no dependency-graph layout library is added). Lanes made up entirely
of `unscheduled` nodes render muted, with no checkmarks, the phase cite shown (§1: "visible, not
active"). Two panels: "Waiting on you" (each item's need-type chip and minutes, the estimated total
and the unestimated count on the heading) and "Shipped …" — a **static** list of `done` nodes within
seven days of the newest `dates.done` **in the plan** (never the wall clock: the page must render
the same bytes on every run or the drift check would fail a day later for nothing), which the inline
JS narrows to the viewer's own last visit when it runs. Node ids are metadata: the visible label is
the title, the id lives in the `id="node-<id>"` anchor and a `title="<id>"` attribute. Responsive
down to phone width (a single `@media (max-width: 480px)` breakpoint collapses the two-column
layout).

**Refuses to generate** (exit 1, naming the node, field, and matched text) when a node's `title` or
`summary` contains a duration/rate/percentage pattern — `site.mjs`'s own `METRIC_RE`, verbatim:
`/\d+(\.\d+)?\s*(ms|milliseconds?|secs?|seconds?|mins?|minutes?|hrs?|hours?|fps|%|x\b)/i` — without
a `measurement: {results: "...", row: "..."}` field — the mechanical form of "no performance
numbers except those carrying a docs/08 measurement" (§5).

## `health.mjs` — the health strip's **machine** facts (§5, §15)

`node scripts/plan/health.mjs [--plan <path>] [--out-dir <site-dir>]` writes `site/data/health.json`
— machine facts only, and the file says so (`source: "the custodian's machine"`): drift (`verify.mjs`
run in `--offline` mode, per §5's own wording), disk free (`(Get-PSDrive C).Free` via PowerShell on
Windows, `df` elsewhere), stray process counts (`cargo`/`node`/`spatial-ide-shell`, by name only —
**this never kills anything**), and waiting-on-human ages (computed from each node's own
`dates.opened`). Always timestamped (`generated_at`).

It runs **no `gh` command and makes no network call**, and it has no `--offline` flag any more:
CI on main, open PRs and the latest release are build-time facts, read from GitHub's API inside the
Pages build by `buildHealth.mjs` (the human, 2026-09-14: "read GitHub's API at Pages build time,
not `gh` on the dev machine"). The strip renders the two sources as two labelled groups, each with
its own timestamp; no row mixes them.

## `buildHealth.mjs` — the health strip's **build-time** facts (§5, §15)

`node scripts/plan/buildHealth.mjs [--out-dir <site-dir>] [--repo owner/name]` reads GitHub's REST
API with Node's global `fetch` (no dependency, no `gh`) and writes `site/data/build-health.json`:
`{built_at, source, repo, ci, open_prs, latest_release}` — the latest `product-ci-rust.yml` run on
`main` (conclusion, status, head sha, created-at, run URL), the open-PR count with the oldest one's
age, and the newest published release (tag, published-at, URL, `prerelease`) — read from the
**list** endpoint `GET /repos/{slug}/releases?per_page=5`, newest first, taking the first entry that
is not a draft, because GitHub's `releases/latest` **excludes pre-releases** and this repository's
only release (v0.1.0) is one: that endpoint answers 404 and the strip would say "none published",
which is false. An empty list or HTTP 404 (releases disabled) → `null`; the page marks a pre-release
as one ("v0.1.0 (pre-release, 2026-09-13)").

Slug: `GITHUB_REPOSITORY`, else the git remote (`ghRepoSlug` from `verify.mjs`). Auth:
`Authorization: Bearer` from `GITHUB_TOKEN`/`GH_TOKEN` when set, with `Accept:
application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28` and a `User-Agent`. **A 403
answered to the token is retried once anonymously** (the repository is public), and each fact
records which reach it used (`auth: "token" | "anonymous"`) — a narrowly-scoped Actions token can
then never blank the strip silently. Any other failure becomes `{error: "<HTTP status or message>"}`
on that one fact and **the page renders that error text — never a bare "unknown"**. Exit 0 even
when facts carry errors (the page reports them); exit 1 only on a write failure or a bad argument.

`site/data/build-health.json` is **gitignored**: it is generated inside the Pages build
(`pages.yml`'s "build-time health facts from GitHub's API" step, between the `verify:plan` gate and
the generator) and never committed. `governance-ci.yml` runs it once into `$RUNNER_TEMP` as a smoke
step, which also shows the scoped token's reach in the log.

**Run order matters:** `site.mjs` bakes both data files' content into the committed
`site/index.html`. Running `health.mjs` alone changes `site/data/health.json` but leaves the
previously-generated `site/index.html` describing the *old* machine facts — stale until `site.mjs`
runs again. **Chosen: document the order, not couple the scripts.** On the custodian's machine
always run `node scripts/plan/health.mjs && node scripts/plan/site.mjs` together, health first,
before committing either output; `site.mjs --check`'s own drift check (`verify.mjs` runs it) catches
a forgotten re-run as a failure, so this is a documented discipline with a mechanical backstop, not
merely a convention. `buildHealth.mjs` is **not** part of that local pair: `checkSiteDrift` always
renders with the build facts absent, so the committed page never depends on a file that exists in
the Pages build and nowhere else, and the drift check cannot be made to fail by one. In the Pages
build the order is `buildHealth.mjs` then `site.mjs`, which is what `pages.yml` runs. The scripts are
decoupled **in invocation** — neither health script invokes `site.mjs`, and none of them writes
another's output — but not in imports: `buildHealth.mjs` imports the `CI_BADGE_WORKFLOW` constant
from `site.mjs` (and `ghRepoSlug` from `verify.mjs`), so the workflow whose badge the page shows and
the workflow whose run it reports can never drift apart.

## `docsOnly.mjs` — the mechanical docs-only verdict (§9)

`node scripts/plan/docsOnly.mjs <base> <head>` (git refs) verifies mechanically that every path
changed between them is documentation (`*.md` anywhere, `docs/**`, `site/**`, `CUSTODIAN-QUEUE.*`,
or `PLAN.yaml` itself), that no touched ADR's Status line changed, that no code path changed
(`*.rs *.ts *.tsx *.mjs *.js *.json *.yml *.yaml *.toml *.html *.css`, lockfiles — `PLAN.yaml` is
the one named exception), and — if `PLAN.yaml` is among the changed paths — that it changes no
lane's `priority` and no `felt_verdict` node's `status`. Exit 0/1 with the offending paths and
reasons listed.

**This script does not check CI or the drift checks** — §9 also requires those to be green, which
the custodian verifies separately (e.g. `gh pr checks`) before treating a result of this script as
license to merge.

## Fixtures (`fixtures/`)

`two-nodes.yaml` / `two-nodes-human-only.yaml` — the two-node plan for §3's Stop-hook dry run (one
ready node, one human-blocked node; the second fixture has the ready node already `done`).
`valid-plan.yaml` — a broader plan exercising ordering, `smallFirst`, every derived state, and a
`felt_verdict` done node. `invalid-*.yaml` — one structural violation each, for `plan.test.mjs`.

## Known environment quirk (Windows, this Node build)

`node --test scripts/plan scripts/hooks` (the exact form `governance-ci.yml` runs, and what CI
uses on `ubuntu-latest`) does **not** discover test files when given a bare directory argument on
this machine's Node 24.18.1/Windows combination — it fails with `MODULE_NOT_FOUND` trying to
`require()` the directory path itself, on both Git Bash and `cmd.exe`. An explicit glob does work:
`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`. This did not reproduce via
`node --test <file>` for any single file, or via glob, only via a bare directory argument — use the
glob form for a local run on Windows; `governance-ci.yml`'s own `ubuntu-latest` runner uses the
literal directory-argument form as specified.
