# PR #193 gate 1 — reviewer (single gate)
Reviewed: cut/adr-032-staleness-docs @ c75a057cd0348cf0c229730efa44e0ba825ea65d

**Verdict: PASS.** I found no Correctness, Evidence or Documentation findings. Nothing has to be fixed before the merge.

## Out-of-scope line (checked first)
The form is `scripts/plan/ADR-032-STALENESS-DOCS-PREREGISTRATION.md`. It was committed at be845ea3, which is an ancestor of c1a7d8ad, the worker commit's parent, and it is on main. Its Out-of-scope line is true for each of the four categories:
- **ADR:** the three-dot diff touches nothing under `docs/adr/`. The README change records an ADR status the human already ruled; it does not change one. The ruling is entry 119 item (2), as ADR-032's Status line says, and PR #103 carried it.
- **Security, wire and guarantee:** nothing touched.
- **Other ADRs in `docs/README.md`:** none moved. `git diff --word-diff=porcelain` shows the only changed tokens are inside the ADR-032 parenthetical.

Size: 12 changed lines in 2 source files (numstat: PLAN.yaml 5/5, docs/README.md 1/1). The bound is 12, so it is met exactly and §21c is not crossed.

## Diff (`origin/main...origin/cut/adr-032-staleness-docs`)
Six files change: `PLAN.yaml`, `docs/README.md`, `CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json` and `site/index.html`. Nothing else.

## Facts
- **The new parenthetical against ADR-032's Status line** (`docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5`):
  - "accepted 2026-09-23 on the human's word, as it stands" matches the Status line ("Accepted — 2026-09-23, on the human's word, as it stands").
  - "filed Proposed 2026-09-08 on DECISIONS-PENDING entry 59 = (a)" matches the Status line's filing clause.
  - (PR #103) is the carrier: `gh pr view 103` shows it MERGED 2026-09-24T00:36:11Z at b0032c80, and the ADR-032 file is among its files.
  - Nothing claims more than these sources. The removed open-decision and sequencing-note clauses are the ones the acceptance settled.
- **README style:** ADR-032 sits in line 27's `**Proposed:**` segment, like ADR-030, which carries the same shape "**accepted 2026-09-09** on the human's word, …, having been filed Proposed 2026-09-08". The new text follows that precedent: bold "accepted <date>", the human's word, then "having been filed Proposed".
- **The node `adr-032-decision`** (PLAN.yaml, `id: adr-032-decision`):
  - It reads status done, needs_human none/0, evidence `{pr: 103}`, done 2026-09-24.
  - Its summary names the acceptance and `accept-adr-032`. No other field changed.
  - `accept-adr-032` carries the same evidence `{pr: 103}` and done 2026-09-24, and the 2026-09-24 date agrees with PR #103's merge.
- **The merged hunks equal the worker's hunks.** I compared `git diff -U0 c1a7d8ad 7b7438e7 -- PLAN.yaml docs/README.md` against `git diff -U0 bc5df5e6 c75a057c -- PLAN.yaml docs/README.md`, stripped of headers: `cmp` rc=0, 12 lines.

## Merge commit c75a057c
- **Parents:** 7b7438e7 and bc5df5e6 (origin/main).
- **The merge brought in only main's commits.** The merge-base is c1a7d8ad, and the only main commit since then is bc5df5e6. The files the merge changes against its first parent are exactly the files main changed since the merge-base: the four generated files, `PLAN.yaml` (the summary of the node `adr-032-staleness-docs` only), `state/CUT-STATE.md` and the worker report.
- **The generated files equal a fresh run.** A fresh `node scripts/plan/queue.mjs` (rc=0) and `node scripts/plan/site.mjs` (rc=0) differ from the committed files only in the four `generated_at` timestamps. The plan_hash 62a725a3…6782 is the same, and it equals sha256(PLAN.yaml). I restored the four files with `git checkout --`.
- **Sign-offs:** 7b7438e7 and c75a057c both carry a Signed-off-by.

## Commands (all at c75a057c in C:/dev/wt/a32)
| Command | rc |
|---|---|
| `git status --porcelain` (start) | 0, clean |
| `git fetch origin` | 0 |
| `node scripts/plan/verify.mjs` | 0, PASS |
| `node scripts/plan/queue.mjs --check` | 0 |
| `node scripts/plan/site.mjs --check` | 0 |
| `node scripts/plan/verify-cites.mjs` | 0, PASS (37 loose advisories, pre-existing, under state/drafts) |
| `node scripts/plan/verify-quotes.mjs` | 0, PASS (121 checked, 90 verified, 30 baselined, 1 advisory) |
| `node scripts/plan/verify-test-claims.mjs` | 0, PASS (525 claims) |
| `node scripts/plan/cfg-boundary.mjs` | 0 (18 sites, 0 outside every boundary) |
| `node scripts/plan/queue.mjs` / `node scripts/plan/site.mjs` (fresh run) | 0 / 0 |
| `git checkout --` of the four generated files | 0 |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0, 457 pass, 0 fail |
| `gh pr checks 193` | 0 |
| `gh run view` ×4 | 0 |
| `gh pr view 193` / `gh pr view 103` | 0 / 0 |
| `git status --porcelain` (end) | 0, clean; HEAD c75a057cd0348cf0c229730efa44e0ba825ea65d |

`gh pr checks 193`, every line:
```
cfg boundary (PORTABILITY R2)	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818185282/job/113452116665	
cfg boundary (PORTABILITY R2)	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818189075/job/113452129347	
every commit is signed off	pass	6s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818188960/job/113452128428	
no profile path in the range	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818189054/job/113452128582	
test · verify:plan · queue/site drift	pass	1m12s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818185282/job/113452117139	
test · verify:plan · queue/site drift	pass	1m31s	https://github.com/christopherdonini/spatial-ide/actions/runs/37818189075/job/113452128812	
```
All four runs report headSha c75a057cd0348cf0c229730efa44e0ba825ea65d, completed, success. None was pending.

## PR body
The body already names c75a057c as the head, not 7b7438e7: "**Head:** c75a057c: the change at 7b7438e7, then origin/main merged in". This matches `headRefOid`. Its other claims also hold against the head: 12 of 12 lines, the six checks at exit 0, 457/457 tests, and ADR-032 not edited.

## Findings
- **Correctness:** none.
- **Evidence:** none.
- **Documentation:** none.

## Observation (not a finding, no change required)
The parenthetical cites PR #103 as the carrier, where ADR-032's own Status line cites the ruling (DECISIONS-PENDING entry 119 item (2)). Both are true, and the form's Change line prescribes "(PR #103)".

No machine hold was needed; nothing heavy ran.
