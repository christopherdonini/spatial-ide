Reviewed: PR #262 at 1043a783db52adc4b1ec874f3837908adf72a236 (base 07445119), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/verify-cites-past-end-bound @ 1043a783db52adc4b1ec874f3837908adf72a236

Brief: sha256 ad11af2fe71da6c2027ab05a2c975ad39e7ecd9f3b9b93cb70d5c8556364032e by `sha256sum`, which matches. `wc -l` gives 36 because the file has no final newline.

## Correctness
None. The code, the list and the CI wiring do what the Change line and R1 to R3 say. Checks 2 to 4 below show it.

## Evidence
None. All seven tests pass at the head. All seven fail against B's checker. Every mutation result matches its RECORDED MUTATION comment. The enumeration reproduces exactly. The suite, the four verify scripts and CI are green at the head.

## Documentation (must be fixed before the merge; no re-gate)

**D1. The PR body places R5 in the workflow's header. It is not there.**
- The PR body says "R4 and R5 in governance-ci.yml's header" and "governance-ci.yml: header comments only".
- R5 is at `.github/workflows/governance-ci.yml:138` at the head. That is a comment inside the `plan` job's steps (the job starts at line 127), directly above `- uses: actions/checkout@v4`. Note 5 places it there itself ("appended after … :136").
- These are the worker's words, not the human's. Replacement words:
  - For the "The words" paragraph: *R1, R2 and R3 in verify-cites.mjs's comments; R4 in governance-ci.yml's header; R5 in the comment above the plan job's checkout step, where note 5 places it.*
  - For the change paragraph's last sentence: *governance-ci.yml: comments only (R4 in the header, R5 above the plan job's checkout step); no step, trigger or permission changes.*
- Clause check against the head:
  - R4 sits in the header (head lines 22-24). My script found it directly after "scripts/evidence passes, ".
  - R5 is head line 138. It directly follows B's line 136 (`# clone just could not see them.`) and precedes the checkout step in job `plan`.
  - Both workflow hunks change comment lines only. The diff touches no step, trigger or permission.
- For the human, with no replacement words: the form's Scope line says "(header comments only)" for this file. That line is Draft B's, adopted under the human's OPEN-1 (B) ruling. It is append-only, so it is not to be edited. The Out-of-scope line's "the workflow's steps, triggers and permissions unchanged" holds.

**D2. "a commit that adds an entry fails by name" (PR body, change paragraph) is wider than the code.**
- The walk covers HEAD's first-parent history only, and `.slice(1)` exempts the oldest commit that changes the list.
- The list commit 7df4983f added all 13 entries, and its push run (40579595391) passed.
- A commit reached only through a merge's second parent is reported at the merge, not by its own id (R2 discloses this).
- These are the worker's words. Replacement: *The list may shrink; a commit on the first-parent history whose list holds an entry its first parent's list lacks fails by name (the list's first commit excepted), and the check fails by name in a shallow clone.*
- Clause check against `legacyListErrors`, scripts/plan/verify-cites.mjs:346-360 at the head:
  - It runs `git log --first-parent --reverse … -- LIST`, then `.slice(1)`.
  - For each commit it builds `keysAt(\`${c}^1\`)` and pushes an error for any key that set lacks. The error names `c.slice(0, 12)` and the entry.
  - It checks for a shallow clone first.
  - Test M6 asserts the commit and the entry. My M6 and M7 runs and the depth-1 CLI run below confirm the behaviour.

## Observations (for information; no finding, no effect on the verdict)
- **No test drives `main()` with a list error.** I ran the CLI at the head inside a depth-1 clone. It exited 1 and printed `verify:cites FAIL — 1 legacy-bound list error(s):` and then `  - shallow clone: the legacy-bound list's history cannot be read`. Its 13 gated findings were all "pinned commit <rev> not found", which any depth-1 clone gives, so they are unrelated to this piece. CI uses fetch-depth 0, and governance-ci is the only workflow that runs verify-cites.
- **`runVerifyCites` now calls git history on every call.** A repository with no commits would throw. Ordinary use cannot reach this.
- **`keysAt` treats any failure of `git show` other than a parse failure as an absent list.** For a first parent, that fails closed.

## Check 1: the diff
- `git diff --numstat 07445119...1043a783` (rc 0) shows the four Scope files: governance-ci.yml 3/1, verify-cites-legacy-bound.json 18/0, verify-cites.mjs 53/15, verify-cites.test.mjs 95/0. That is 185 lines, as Amendment 2 records.
- The merge base is 07445119. There are three commits:
  - eec3f1f6: 160 lines.
  - 7df4983f: +18, which makes 178 at the list commit, as Amendment 2 says.
  - 1043a783: 7/0. All 7 lines start with `+// RECORDED MUTATION (M[1-7]) at 7df4983f…, applied alone and reverted:`. There are no other changed lines, so the record commit is comments only.
- The workflow changes are comment lines only.
- The test diff adds only an import and new tests after the last existing test. No existing test is changed or removed.
- §21d, the Out-of-scope line read first: it names no §21a category as touched. There is no ADR line; only Node's standard library and git are used; nothing is under protocol/; no existing assertion changes. The route is closed by size anyway (Amendment 2): §21b's mid-piece clause, AUTONOMY.md:345 at the head, gives class 6, and 185 is over §21c's 150. Class 6 is correct, not class 8, because this is a five-line form.

## Check 2: the words
- One-off script `pb-g1r-words.mjs` (rc 0). It takes R1 to R5 from the form at main 89fae2d7 and compares each with the head text, comment markers stripped and lines joined:
  - Each of R1 to R5 appears once at the head and not at all at B.
  - R1 follows "(lines count from 1)." and precedes "PINNED FALLBACK".
  - R2 follows "same-basename siblings;" and precedes "and, by the tiering above".
  - R3 directly precedes `const LEGACY_LIST`.
  - R4 replaces its old clause, which appears once at B and not at the head.
  - R5 is head line 138, after B's line 136. B's old R1 text is gone.
- Note 5's pins and note 1/2's pins at dcd85569 were recomputed, ten in all: every one MATCHES. There is no drift between dcd85569 and B on the three files: `git diff --stat` is empty.
- Each clause check of note 5 is true at the head:
  - countOf is unchanged.
  - The tree bound is `maxL <= n.lines || (cite.oldBound === true && maxL <= n.pieces)` (line 278).
  - The pin bound is `maxL > lc.lines && !(cite.oldBound === true && maxL <= lc.pieces)` (line 316).
  - The reasons print `.lines` (lines 283, 289, 317).
  - The key is `[relPath, cite.raw]`, and `raw` is `m[0]` without its pin (line 177).
  - The failure conditions are as in D2.
  - R2: nothing reports unused entries; the walk covers commits; it reads along first parents.

## Check 3: behaviour, in the scratch clone C:/dev/wt/pb-g1r
- `git clone` rc 0. Checked out 1043a783 detached; not shallow.
- (a) `node --test` on verify-cites.test.mjs: rc 0, 43 of 43 pass, the seven new tests 37 to 43 among them.
- (b) With B's verify-cites.mjs swapped in: rc 1, 36 pass, 7 fail.
  - Tests 37, 38 and 39 (the three marked "fails at the base") fail with ERR_ASSERTION.
  - Tests 40 to 43 fail as well.
  - After restoring, the file's sha256 is 7ab4108c…f368b6f, equal to the head blob.
- (c) Mutations, by script `pb-g1r-mut.mjs`. Each was applied alone by an exact single-match replacement, the test file was run, and the original bytes were restored, each restore verified as 7ab4108ca1e95040b20047d166706b7de94d770282d24ead9aa364e0ff368b6f.
  - M1: rc 1, fails 3 tests: …just_past_the_end_of_a_newline_ended_file_fails, a_cite_to_line_1_of_an_empty_file_fails and a_cite_on_the_legacy_bound_list_passes_…_only_from_its_listed_file. This matches its comment and Amendment 1.
  - M2: rc 1, fails 2 tests: a_cite_to_line_1_of_an_empty_file_fails and an_out_of_range_reason_for_an_empty_file_counts_0_lines. My first M2 pattern did not apply, because the Bash tool collapsed `\\n`. I re-ran M2 alone with the backslash built by `String.fromCharCode(92)` (`pb-g1r-mut2.mjs`).
  - M3, M4, M5, M6 and M7: rc 1, each fails only its own test, as each comment says.
    - My M4 keyed only the lookup by the cite.
    - My M6 was `now.size > before.size`.
    - My M7 deleted the shallow-check line.
  - The file-top mutation (`<=` to `<`, per note 1): fails only an_exact_reference_to_the_last_line_of_a_file_is_in_range.
- (d) Enumeration at B, by script `pb-g1r-enum.mjs` (rc 0). B was checked out detached in the clone with no list in the tree. B's checker and the head's were imported from `git show` copies.
  - B: 0 gated, 75 advisory. The head with no list: 5 gated, 83 advisory.
  - 13 head-only findings (5 gated, 8 advisory). 0 base-only. 0 shared findings changed reason or tier.
  - All 13 name exactly one line above the file's true count. All 13 are under state/consults/, 7 of them under gates/.
  - The list file at the head has 13 entries, sorted by path then cite, and equals the head-only (path, cite) set both ways.
  - With the list in the tree, the head gives 0 gated, 75 advisory and 0 listErrors, equal to B's byte for byte in findings and order.
- The clone's porcelain was empty after each step. The clone is removed: `ls` rc 2.

## Check 4: suite, verify scripts and CI (in C:/dev/wt/pb, read only)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, under a shared hold: rc 0, tests 568, pass 568, fail 0, 172.9 s.
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "verify:cites PASS — … across 2442 file(s) resolves. (75 loose reference(s) advised above.)". There are no legacy-bound lines.
- `verify-test-claims.mjs`: rc 0, "PASS — all 684 claimed test(s) across 209 file(s) …".
- `verify-quotes.mjs`: rc 0, "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 878 ruling cites resolved, 0 ruling-cite errors." The harness moved this call to the background after 180 s. I waited for it with a foreground node wait of at most 540 s.
- `gh pr checks 262` (rc 0): 8 checks, all pass. `gh run view` for each of the 6 runs (40579595391, 40582521271, 40582521410, 40582521143, 40579595309, 40582521303): headSha 1043a783db52adc4b1ec874f3837908adf72a236 every time, completed/success.
- Both Governance CI logs print verify:cites PASS: the push run over 2442 files, the pull_request merge ref over 2444.

## Check 5: PR body and disclosures
- PR body figures:
  - 4 files; additions 169 plus deletions 16 = 185.
  - 13 entries, all in filed records.
  - The first three tests fail at the base.
  - M1 to M7 are recorded at 7df4983f.
  - The enumeration: 13 findings, 0 base-only, equal to B with the list.
  - 568 tests, and the four verify scripts pass.
  - All of these hold by my runs.
- The OPEN-4 sentence is the worker's and is for information. I did not re-run it.
- Rule (00): `gh pr list --state open` shows only #263 besides #262, and #263 touches none of the four files or protocol/.
- Disclosures:
  - M1 failing three tests: confirmed. Amendment 1's reason holds: the empty file splits into one piece, and the unlisted docs/b.md cite to line 4 of a three-line file has four pieces.
  - The overrun: 185 in total, per-file figures as in Amendment 2; 178 at 7df4983f.
  - The worker's base clone C:/dev/wt/pb-w-B: absent (`ls` rc 2).
  - The in-flight tips: information only, not re-run.
  - The garbled first draft: what git shows agrees, since the record commit is exactly the seven comment lines. The revert before the commit cannot be seen in git.

## Hold lines (this project's only)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:50280 also=bash.exe:2816 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:50280 affinity=FF (cores 0-7)`

## Final state
- C:/dev/wt/pb is at HEAD 1043a783db52adc4b1ec874f3837908adf72a236, and `git status --porcelain` printed 0 bytes (rc 0).
- C:/dev/wt/pb-g1r is gone (`ls` rc 2). The depth-1 clone inside it, which the brief does not list, went with it.
- My scratch files are named pb-g1r-*, in <the session scratch folder>/.
- No commit, push or PR action was made.
