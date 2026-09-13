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
plan.json`, and `site/.nojekyll`. Reads `site/data/health.json` if present (written by
`health.mjs`) for the health strip.

Swimlanes per lane, `done` nodes on the left with dates and evidence links, `ready`/`in-progress`/
`blocked`/`proposed` on the right with SVG dependency arrows drawn between nodes in the *same*
lane (a cross-lane dependency is shown as a text "after: `<id>`" note instead — no dependency-graph
layout library is added). Lanes made up entirely of `unscheduled` nodes render muted, with no
checkmarks, the phase cite shown (§1: "visible, not active"). Two panels: "Waiting on you" (each
item's kind and minutes, total on the heading) and "Shipped since your last visit" (computed
client-side from `localStorage`; first visit shows the last seven days). Responsive down to phone
width (a single `@media (max-width: 480px)` breakpoint collapses the two-column layout).

**Refuses to generate** (exit 1, naming the node, field, and matched text) when a node's `title` or
`summary` contains a duration/rate/percentage pattern (`\d+(\.\d+)?\s*(ms|s|min|hr|hour|fps|%|x)`
and friends) without a `measurement: {results: "...", row: "..."}` field — the mechanical form of
"no performance numbers except those carrying a docs/08 measurement" (§5).

## `health.mjs` — the health strip's data (§5, §15)

`node scripts/plan/health.mjs [--plan <path>] [--out-dir <site-dir>] [--offline]` writes
`site/data/health.json`: CI on main (the badge URL always; `gh run list --branch main --workflow
product-ci-rust.yml --limit 1`'s conclusion when reachable), drift (`verify.mjs` run in
`--offline` mode — its pass/fail is recorded here regardless of this script's own `--offline`
flag, per §5's own wording), disk free (`(Get-PSDrive C).Free` via PowerShell on Windows, `df`
elsewhere), stray process counts (`cargo`/`node`/`spatial-ide-shell`, by name only — **this never
kills anything**), open-PR ages (`gh pr list --json number,createdAt`), and waiting-on-human ages
(computed from each node's own `dates.opened`). Always timestamped (`generated_at`).

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
