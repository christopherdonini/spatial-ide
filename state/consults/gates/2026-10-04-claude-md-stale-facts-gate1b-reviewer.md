# PR #171 gate 1b — reviewer (single gate, scoped)
Reviewed: cut/claude-md-stale-facts @ 605a45c4b788d5bb62c099b79c742ca809927615

Tag: node:claude-md-stale-facts@g1. Scope: the change since gate 1 (5607bf60, PASS,
`state/consults/gates/2026-10-04-claude-md-stale-facts-gate1-reviewer.md`). Gate 1's other results
stand on its report.

## Verdict

**PASS** at 605a45c4b788d5bb62c099b79c742ca809927615. No S1 (blocking) findings. No S2. No nits.

## Checks

### 1. The diff since gate 1 is exactly one span on CLAUDE.md line 8

- `git rev-parse HEAD` in `C:/dev/wt/claude-md` → 605a45c4b788d5bb62c099b79c742ca809927615; equals
  `origin/cut/claude-md-stale-facts` after `git fetch origin` (rc 0); `gh pr view 171` headRefOid
  is the same id.
- `git diff 5607bf60 605a45c4` (rc 0): one hunk, CLAUDE.md line 8 only. `git diff --stat` (rc 0):
  `1 file changed, 1 insertion(+), 1 deletion(-)`.
- Mechanical proof that the line-8 change is that one span and nothing else: line 8 at 5607bf60,
  with the single substitution `open a 5 GB GeoParquet → filter in SQL` → `open a GeoParquet →
  filter in SQL` applied, is `cmp`-identical to line 8 at 605a45c4 (cmp rc 0). The old span occurs
  once in the old line; `5 GB` occurs zero times in the new line (grep rc 1).
- Every other line: CLAUDE.md with line 8 deleted hashes the same at both commits
  (sha256 4f646421775747457a617da77afefd4ae902844ce8f543e16ebaf828a42cd915), and `diff` of the two
  exits 0.
- Line hashes (LF, whole line): `CLAUDE.md:8 @ 5607bf60 sha256:95167d4b97eac03577bb6543f3b360e7c99326a22ae443883f6e5d5d23712130`;
  `CLAUDE.md:8 @ 605a45c4 sha256:0f7444f493b416448db26a90e3fb123a0d21c688e7b9c229368cceaca8f63816`
  (both branch commits, not on main; named here as the reviewed commits, not as record pins).
- `git diff --numstat origin/main...origin/cut/claude-md-stale-facts` (rc 0) → `5	5	CLAUDE.md`.
- `wc -l CLAUDE.md` → 38.
- `git log --oneline origin/main..HEAD`: 5607bf60, 605a45c4. 605a45c4 carries a Signed-off-by
  trailer.

### 2. The new wording matches RELEASE-0.1.md §1; the rest of line 8 is unchanged

- `RELEASE-0.1.md` §1 is the heading at line 24. Lines 26-27 joined contain, byte-for-byte, the
  sub-line span `open a GeoParquet → filter in SQL → style it → publish a static interactive bundle`
  (grep -o over the joined lines, rc 0). Span carried by its lines' hash:
  `RELEASE-0.1.md:26-27 @ ea5aba5d120ee173d32c786a53b291ec83ff3d71 sha256:3ad1502a7628933255c438fc13f6b2b03137b547d0b26572b5042ffe420bb85b`
  (origin/main; the same hash at 605a45c4 — the branch does not touch the file). The new
  CLAUDE.md:8 contains the same span (count 1). No size is stated in either.
- The 2026-09-07 note: the parenthesised bold span from `(**note, 2026-09-07` to `corrigendum**)`
  extracted from line 8 hashes identically at both commits
  (7e4555bc4b5cee1027e209a706961c0c92538b78be6d685f528e2367797d13a0).
- The ADR-011 sentences (from `**ADR-011**` through the second following full stop) hash identically
  at both commits (86b3dccd1848f5585886e5d8e11038035e4183a0c30f62a046d10fa9919f52d5); both
  extractions non-empty.
- Since the whole line outside the one span is cmp-identical (check 1), every other fact and rule
  sentence on line 8 is as gate 1 checked it.

### 3. CI

- `gh run view 37203978153` (rc 0): Governance CI — plan, queue, site; event workflow_dispatch;
  headSha 605a45c4b788d5bb62c099b79c742ca809927615; status completed, conclusion success.
  - job `test · verify:plan · queue/site drift` (111441230603): success, 52s.
  - job `cfg boundary (PORTABILITY R2)` (111441230804): success, 6s.
  - Annotations are runner notices only (Node.js 20 deprecation; ubuntu-latest label migration).
- `gh pr checks 171` (rc 0):
  - `every commit is signed off`: pass (run 37203973057).
  - `no profile path in the range`: pass (run 37203973061).

### 4. Verify scripts on the branch, in C:/dev/wt/claude-md

| command | rc | summary line |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | verify:cites PASS — 1254 files; 39 loose references advised |
| `node scripts/plan/verify-quotes.mjs` | 0 | verify:quotes PASS — 117 checked, 86 verified, 30 baselined, 1 advisory, 0 errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | verify:test-claims PASS — 488 claimed tests across 118 files |
| `node scripts/plan/verify.mjs` | 0 | verify:plan PASS — PLAN.yaml agrees with the repository |

No advisory line in any of the four outputs names CLAUDE.md (grep -c → 0 for each); the advisories
are pre-existing and outside this PR's diff.

### 5. Worktree state

`git status --porcelain` in `C:/dev/wt/claude-md` → empty (rc 0), before and after the runs. Nothing
was committed, rebased or sent to the remote.

## Findings

- S1: none.
- S2: none. Gate 1's S2-1 is taken as described (one span, RELEASE-0.1.md §1's wording, no size);
  gate 1's S2-2 is taken (run 37203978153, success at the head).
