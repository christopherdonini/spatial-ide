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

## `verify-test-claims.mjs` — the claimed-test-exists check (§6a), planned and SUPERSEDED claims

`node scripts/plan/verify-test-claims.mjs [--quiet]` scans every tracked preregistration and ADR for
a claimed test name and confirms a test of that name exists (see the module's own header comment for
the recognizer and the PLANNED/BINDING split). **SUPERSEDED** (`TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md`;
the human, round 14 item 2): a claim at line L of file F that does not exist in the current tree is
reported advisory, never a binding finding, when F's own text carries a matching row that (a) pins a
hash reference to `F:L` (or a range containing L) — `` `path:a[-b]` @ <rev> sha256:<hex> ``, DERIVED
FROM the reference grammar `verify-quotes.mjs`'s `HASH_REF_RE` uses (round 12's "quote by reference")
as it stands on `governance/verify-quotes` @ 1254cddd4c3b47c9431375874ad327754ef038e9 (round 15(c): a
tool claim names the tool's commit); only an explicit path equal to F's own repo-relative path is
recognized, not a bare `:line` — (b) carries the word `superseded` on that same line, outside any
backtick span (single **or double**); (c) the hash recomputes against `git show <rev>:F`'s own lines
a..b, the blob's bytes as committed (not normalized to LF — a CRLF-committed blob hashes with its own
CRs), so a marker cannot be forged without the historical bytes; (d) those same historical bytes
CONTAIN the claimed name — a pin that merely hashes a line it already has, without ever naming the
claim, exempts nothing it was written to explain; and (e) `<rev>` is shown to be an ancestor of
`origin/main` (refused, not merely unproven, when it is not — a commit that lives only on an unmerged
branch can become unreachable from every fetched ref after a squash- or rebase-merge, which would
silently evaporate the exemption and turn `main` red on an already-landed piece; SKIPPED, with a
printed note, when `origin/main` does not resolve in the scanned tree at all). All five conditions
must hold or the claim stays binding (or planned); a superseded claim is printed under its own
heading, the same way the planned set is, and never counts toward the exit code. See
`supersededSpans` and `findSupersededSpan` in the module.

**The boundary** (byte-copied from the architect gate report, attempt 1, 2026-09-18, PROPOSED item 1):

> SUPERSEDED means **renamed**: the pinned historical span must itself contain the claimed name, and
> the replacement name must be claimed and exist elsewhere in the same record. The check proves only
> the first half mechanically — that this line, at that commit, carried this name. That the obligation
> moved rather than vanished is proven by the record's own rows and read by the gate, not by this
> tool; a claim marked superseded with no replacement anywhere in the file is a defect this check does
> not catch, disclosed here.

**WITHDRAWN** (round 20 item 1): a claim reads the same reference grammar again, this time marked
`withdrawn-test` (never a bare `withdrawn`, which already means something else on a round-15(g)
withdrawal row) and restricted to one pinned line. Every `withdrawn-test` row is checked on its own
(round 21 item 2), whatever the state of the claim on its pinned line and whatever its node's status: an
unresolvable `ruling:`, a missing `carrier:`, or an unresolvable carrier each fails the run by name,
naming the row and the unresolved citation (or "no carrier"). The gate reads two distinct semantic
halves here, same as SUPERSEDED's own boundary above: this tool proves only that the named ruling and
carrier citations *resolve* to a RULED block or an entry line in the current `DECISIONS-PENDING.md` —
never that the cited ruling actually *names the removal*, and never that the named carrier actually
*carries the evidence* the withdrawn test once did. Both of those readings are the gate's, not this
check's. **Outside this tool's reach** (rider (b)'s own boundary): `PLAN.yaml`'s acceptance text, the
gate log and commit messages are not scanned — a claim's evidence can live there, and the gate reads it,
not this check. **`carrier:` accepts only a ledger citation** — `round N, item M` or `entry K`, resolved
the same way `ruling:` is; it never accepts a path, a section number or any other reference into a
preregistration or ADR, however the evidence is actually carried there.

## `health.mjs` — the health strip's **machine** facts (§5, §15)

`node scripts/plan/health.mjs [--plan <path>] [--out-dir <site-dir>]` writes `site/data/health.json`
— machine facts only, and the file says so (`source: "the custodian's machine"`): drift (`verify.mjs`
run in `--offline` mode, per §5's own wording), disk free (**both drives** — `(Get-PSDrive C).Free`
and `(Get-PSDrive D).Free` with total `.Used + .Free`, via PowerShell on Windows; D: is omitted, not
an error, on a machine without it; `df` for the repo filesystem elsewhere. Shape: `disk_free:
{drives: [{drive, bytes, total}, ...]}` on Windows, `{raw}` on `df`. The human, 2026-09-14: "the
health strip reports both drives"), stray process counts (`cargo`/`node`/`spatial-ide-shell`, by
name only — **this never kills anything**), and waiting-on-human ages (computed from each node's own
`dates.opened`). Always timestamped (`generated_at`).

Three governance metrics (the human, 2026-09-14: "median ready→done hours and gate first-pass rate";
the human, 2026-09-18, the record cap's point (4), paraphrased: a record-round count per piece,
target zero)
— operational counts, **not** docs/08 product perf, and labelled as such:

- `median_opened_to_done: {days, n}` (`medianOpenedToDone(plan)`, pure): the median of
  (`dates.done` − `dates.opened`) over `done` nodes that carry both. The plan records **dates, not
  timestamps**, so this is at **day resolution** and is labelled "median opened→done (day
  resolution, N nodes)" — it is deliberately **not** stored as, or called, "hours": the plan has no
  finer source and inventing one would be a fabricated number. `days` is `null` when nothing
  qualifies.
- `gate_first_pass: {present, nodes, first_pass, rate}` (`gateFirstPassRate(log)`, pure): reads
  `state/gate-log.json` (below). For each node, its **first recorded gate attempt** across all its
  gates (earliest by date, then attempt, then log order) decides; rate = passed-first / nodes-with-
  any-record, always reported **with the N**. Absent file → `{present: false}` → the strip says "no
  gate log yet"; a present-but-empty log → "no gate records yet".
- `record_rounds: {present, byNode, total}` (`recordRoundCounts(log)`, pure): counts, per node, the
  number of DISTINCT gate attempts carrying `record: true` in `state/gate-log.json` (below) — an
  attempt gated twice (e.g. both reviewer and architect) carries the tag on both gate records but
  counts once for its node, never twice. A node with no `record: true` record is absent from
  `byNode` — it is never listed at zero. `total` is the sum of every node's count. The strip's
  "Record rounds per piece" row lists each non-zero node and its count, then the running total, and
  always states the target of zero. Absent file → `{present: false}` → the row says "no gate log
  yet", the same wording `gate_first_pass` uses; a present-but-empty log → `{present: true,
  byNode: {}, total: 0}`, rendered "none (total 0, target 0)" — unlike `gate_first_pass`'s "no
  gate records yet" for the same input, because a zero record-round count is the metric's own
  target, not a missing measurement.

It runs **no `gh` command and makes no network call**, and it has no `--offline` flag any more:
CI on main, open PRs and the latest release are build-time facts, read from GitHub's API inside the
Pages build by `buildHealth.mjs` (the human, 2026-09-14: "read GitHub's API at Pages build time,
not `gh` on the dev machine"). The strip renders the two sources as two labelled groups, each with
its own timestamp; no row mixes them.

### `state/gate-log.json` — the tracked gate history

The plan carries no gate history, so the gate first-pass metric reads a tiny tracked file the
custodian **appends to after each gate**: a JSON array of entries, one per gate attempt:

```json
[
  {"node": "<node-id>", "gate": "<gate path or name>", "attempt": 1, "verdict": "PASS", "date": "2026-09-14"},
  {"node": "<node-id>", "gate": "architect", "attempt": 2, "verdict": "PASS", "record": true, "date": "2026-09-18"}
]
```

`verdict` is `"PASS"` or `"FAIL"`; `attempt` counts from 1 for that node+gate; `date` is a plain
`YYYY-MM-DD`. `note` is optional free text (the gate report's summary). `record` is optional and
boolean: `true` marks an attempt whose round was dispatched, in whole or in leading part, to correct
or re-read the piece's record — the record-fidelity class: a quotation, a cite, a hash, an
amendment's form or ordering, or a scoped re-read of record text appended after the build's gate —
whatever else the round carried and whatever the verdict. A round dispatched for code, tests or
operator text is not tagged even when its findings touch an amendment. The custodian sets it by
hand from the dispatch when appending the record; henceforth the record's `note` names the round.
A piece's first gate attempt is never tagged, even when it fails on the record: the count is rounds
spent on the record, the quantity the directive's point (3) caps
(`state/directives/2026-09-18-record-cap.md`). Every gate of a tagged attempt carries the tag; the
metric counts the attempt once. **This predicate is the custodian's stated choice under the
directive, not the human's ruling — it is the human's to adjust at any time by a one-line note.**
The tags on records older than this paragraph were applied retroactively on 2026-09-18 from the
custodian's dispatches: records before 2026-09-17 carry no `note`, and two tagged notes
(`governance-verify-quotes` attempts 2 and 4) lead with build work and carry their record-led
reason only in the preceding attempt's findings — the retroactive set is disclosed here, not
re-derivable from the notes alone. The file is committed (plain text, diffable — a JSON array cannot carry
a top-of-file comment, hence this note). It ships seeded as `[]`. `health.mjs`'s `readGateLog`
treats an absent file as "no gate log yet" and a corrupt file as empty (degrade, never throw).

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
