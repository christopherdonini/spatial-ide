Reviewed: PR #265 at bf9c8463ce49f17850c532819fe003a8b16a8eef (base 60bb2d4f), gate 1, reviewer
Branch and commit reviewed: cut/governance-hash-ref-leading-dot-path @ bf9c8463ce49f17850c532819fe003a8b16a8eef
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. One Documentation finding must be fixed before the merge. It needs no re-gate.

## Correctness
None.

## Evidence
None.

## Documentation (fix before the merge, no re-gate)

**D1. The grammar comment leaves out the rule for an interior segment that starts with a dot.**
- **Where:** `scripts/plan/hashRefGrammar.mjs:12-14` at bf9c8463.
- **What is wrong:** The comment says how a path *starts* and says that a `.` or `..` segment is not a path. The code at :16 also refuses any interior segment whose leading dot is not followed by a letter, digit or underscore. That part goes unstated. I ran the base and head grammars on these shapes:
  - `a/.-b.md:3` and `a/.+b.md:3`: read whole at the base, read nowhere at the head.
  - `..x/y.md:3`: read as `x/y.md` at the base, nowhere at the head.
- The comment is not false, but it understates what the code refuses. The Change line covers the shape ("reads a path segment that begins with a dot only when a letter, digit or underscore follows that dot").
- The form's Out-of-scope parenthetical lists the changed shapes and has the same gap. The form is append-only and needs no amendment: the Change line covers the shape, and the identical real-tree outputs (check 2d) carry the guarantee.
- **Fix:** replace lines 12-14 with these words (the worker's wording, not the human's, so the worker applies them with no re-gate and the PR body lists them):
```
// A path segment, first or interior, that starts with a dot needs a letter, digit or underscore after the dot
// (`.github/`), and a path's first character is otherwise a letter, digit or underscore; nothing is read as a path
// (or, for verify-quotes, a bare `:line`) directly after a path character. So a `.` or `..` segment is not a path,
// and `./x`, `../x`, `.:3` and `sub/../x` bind nowhere.
```
- **Each clause checked against the code:**
  - "segment, first or interior, that starts with a dot needs a letter, digit or underscore after the dot": `(?:\\.(?=[A-Za-z0-9_]))?` for the first segment and `/(?!\\.(?![A-Za-z0-9_]))` for interior ones (:16). Observed: `.x1/y.md:3` and `a/.github/y.md:3` read whole; `a/.-b`, `a/.+b` and `..x` read nowhere.
  - "a path's first character is otherwise a letter, digit or underscore": `[A-Za-z0-9_]` after the optional dot (:16). An interior segment that does not start with a dot keeps `+`, `-` and empty segments: `a/+b.md:3` and `a//b.md:3` read the same at the base and the head. The words claim nothing about those.
  - "nothing is read as a path (or, for verify-quotes, a bare `:line`) directly after a path character": `NOT_AFTER_PATH_CHAR` (:15) sits before `pathPart` (:27), so it also guards the bare form. Observed: `see .:3` gives a bare `:3` at the base and nothing at the head.
  - "`.` / `..` not a path; the four shapes bind nowhere": `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` passes at the head. M2, M3 and M4 each fail it (check 2c).

## Check 1: the diff, Out-of-scope read first (§21d)
- `git diff --numstat 60bb2d4f...bf9c8463` exited 0:
  - `scripts/plan/hashRefGrammar.mjs`: 6 added, 1 deleted.
  - `scripts/plan/verify-test-claims.test.mjs`: 44 added, 0 deleted.
  - Total: 51 lines in 2 files, against a budget of 110. The files are exactly the Scope's two.
- No existing test was changed: the test-file hunk only appends after the last existing test, with 0 deletions.
- The record commit is comments only: `git diff 850efbd8 bf9c8463` exited 0 and shows 8 added lines, all `// RECORDED MUTATION` comment lines.
- The `git merge-base` of origin/main and HEAD is 60bb2d4f.
- The Out-of-scope line names no §21a category as touched (ADR none, security none, wire none, guarantee none touched). The diff agrees: no `protocol/`, no ADR, no dependency, no exposure surface. The single gate stands.

## Check 2: behaviour, in the scratch clone `C:/dev/wt/hrdot-g1r`
The clone was made from the worktree and checked out at bf9c8463 (rc 0).

**(a) Both new tests pass at the head.**
- `node --test --test-name-pattern=...` exited 0, 2 of 2 passing.
- The grammar's sha256 is 2049d23606cc040738a40fbe3cd9886637570fd5574abf4023ce1752206656e2, equal to `git show HEAD:` of the same file.

**(b) Both fail against B's grammar.** I swapped in B's grammar with `git show 60bb2d4f:`; the run exited 1.

| Test | Actual | Expected | Matches the line? |
|---|---|---|---|
| `a_leading_dot_path_pin_resolves_in_both_checkers` | `{ quotes: 2, claims: 0 }` | `{ quotes: 0, claims: 1 }` | yes |
| `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` | `[{0,1},{0,1},{0,0},{0,0}]` | four `{ quotes: 1, claims: 0 }` | yes |

At the base, T1's two findings are both "unresolvable path "github/workflows/X-PREREGISTRATION.md"": the dot is dropped, as note 4 predicts. The file was restored with `git checkout` (rc 0), sha256 2049d236… again.

**(c) M1 to M4, each alone and in turn.**
- My first scripted attempt applied nothing: the Bash tool collapsed the backslashes in the match strings, the script exited 2, and the tests ran unmutated and passed. I record nothing from that attempt.
- I then rewrote the script without literal backslashes (`String.fromCharCode(92)`). Each mutation was applied by a single exact replacement, both tests were run, and the file was restored with `git checkout`.
- Every restore gave rc 0 and sha256 2049d236…. The clone's porcelain was empty afterwards.

| Mutation | Mutated line | Test rc | Failing test, by name | Actual | Other test |
|---|---|---|---|---|---|
| M1 | `const PATH = '([A-Za-z0-9_](?:…` | 1 | `a_leading_dot_path_pin_resolves_in_both_checkers` | `{ quotes: 2, claims: 0 }` | passes |
| M2 | `const NOT_AFTER_PATH_CHAR = '';` | 1 | `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` | `[{0,1},{0,1},{0,0},{0,1}]` | — |
| M3 (Amendment 1's worded shape) | dot lookahead and first character both widened to `[A-Za-z0-9_./+-]` | 1 | the same test | `[{0,0},{1,0},{1,0},{1,0}]` (the `./` entry resolves) | — |
| M4 | interior becomes `|/)*` | 1 | the same test | `[{1,0},{1,0},{1,0},{0,0}]` (`sub/../` resolves) | — |

Each actual equals the words of its RECORDED MUTATION comment and of Amendment 1.

**(d) The settlement's proof, on the real tree in the clone.**

| Script | At the head | At B (detached checkout of 60bb2d4f) | `diff` of the two outputs |
|---|---|---|---|
| `verify-test-claims.mjs` | rc 0 | rc 0 | rc 0, 0 bytes |
| `verify-quotes.mjs` | rc 0 | rc 0 | rc 0, 0 bytes |

Both verify-quotes runs end in "131 checked, 100 verified, 30 baselined, 1 advisory … 0 hash-reference errors (2 hash-baselined) … 879 ruling cites resolved". The findings are identical.

## Check 3: the words and the constitution check

**The grammar comment against the Change line.** Consistent, apart from D1's omission.

**The PR body against the head:**
- "2 files, 51 lines of 110": confirmed.
- Both tests fail at the base and pass at the head, and M1 to M4 fail by name, recorded at 850efbd8: confirmed (checks 2a to 2c).
- The checkers' findings are identical: confirmed (check 2d).
- 570 tests and the four verify scripts pass: confirmed (check 4).
- Rule (00): `gh pr list --state open` gave rc 0. Only #265 touches the two files, and no open PR touches `protocol/`.

**The three verify-cites residuals of OPEN-2 (A).** I probed each in a temporary repo built from the head's `verify-quotes.mjs`:
- **Residual 1** (a dot-led cite is read dotless as a loose, unmatched reference): `extractCitations` gives `github/workflows/x.yml:3`, target "unresolved". `TOKEN_RE` in `verify-cites.mjs` is unchanged. Confirmed.
- **Residual 2** (a bare `:line` after a dot-led pin binds dotless and fails closed): a paragraph pinning `.github/workflows/x.yml:3` and then a bare `:5` gave exactly one hash finding, for the bare ref: "unresolvable path "github/workflows/x.yml"". The dot-led pin itself passed. Confirmed.
- **Residual 3** (no hash mark for a dot-led cite in the listing): `listCiteContents` returns `hashMark: null` for that cite. Confirmed.

**Cite, vocabulary and red-line scan of the added lines:**
- The scan exited 0.
- Its only hit is the T1 fixture's template-literal `sha256:${hash}`, which also shows the pattern can match.
- There are no path:line cites, no hash pins, no verbatim marks, no "done"/"discharged" claims, no red-line text and no operator-visible strings.
- The RECORDED MUTATION comments name the full code commit id. No comment calls a verify-mutation run an observation.
- Main merges PRs with merge commits (d511f06e, 9a2a9df4, a39738a0), so 850efbd8 stays reachable from main after the merge.

**Records on main.**
- Amendment 1 is class 2, written after results, and carries no hash reference.
- The worker's two reports agree with my runs.
- The settlement says the OPEN-2 (A) residuals are "disclosed in the closing record". The PR body discloses them now. The closing record is the custodian's, at done.

## Check 4: the suite, the verify scripts and CI

**At the head in the worktree** (`C:/dev/wt/hrdot`, read only):

| Command | Exit | Result |
|---|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | 570 tests, 570 pass, 0 fail |
| `verify.mjs --offline` | 0 | verify:plan PASS |
| `verify-cites.mjs` | 0 | PASS, 2458 files, 75 loose advised |
| `verify-test-claims.mjs` | 0 | PASS, 687 tests across 210 files (47 planned, 11 superseded, 17 withdrawn) |
| `verify-quotes.mjs` | 0 | PASS; output identical by `diff` (rc 0) to the clone's head run |

The suite ran under a shared hold:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:25572 also=bash.exe:23528 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:25572 affinity=FF (cores 0-7)`

**CI:** `gh pr checks 265` exited 0, with 8 of 8 checks passing. `gh run view` gave rc 0 for each run, and every run's headSha is bf9c8463ce49f17850c532819fe003a8b16a8eef:

| Run | Workflow | Event |
|---|---|---|
| 40671333018 | Governance CI | push |
| 40672879712 | Governance CI | pull_request |
| 40672879939 | DCO sign-off | pull_request |
| 40672879651 | Exposure scan | pull_request |
| 40671332926 | Ported notices | push |
| 40672879964 | Ported notices | pull_request |

## Closing state
- `C:/dev/wt/hrdot` porcelain is empty (0 bytes) and HEAD is bf9c8463.
- `C:/dev/wt/hrdot-g1r` is removed: `ls` reports "No such file or directory".
- Scratch files are all `hrdot-g1r-*` in `<the session scratch folder>/`.
- No commit, push or PR action was made, and no cargo ran.
