Reviewed: PR #275 at 077681ed74fe50c4f8f26017978ed0bcc6ca40d2 (base ab9b52ab), gate 1, reviewer
Verdict: PASS WITH NOTES

**Findings**

- **Correctness:** none.
- **Evidence:** none.
- **Documentation (fix before the merge):** none.

**Notes (no fix needed, nothing blocks)**

- N1, which tree P4 ran over. §5 P4 says "over one clean tree at the base". My run used my export, a clean tree at 0f6800fc. That tree is B's tree except for the two Scope files. The worker's report says "over one tree" and does not name it. P4 compares two checkers over the same tree, so the tree's commit does not change the result. My counts match the worker's (see check 3). This is recorded, not raised as a finding.
- N2, how I ran things.
  - The test file calls `git show 40b04b46:…`, so it cannot run in a plain archive. To make the export work I ran `git init` in it, added an alternates file pointing read-only at the repository's object store, set HEAD and the index to 0f6800fc, and set `core.longpaths true` in the export's own config only. Without that last setting, seven long-named files under state/directives/ showed as modified. With it, the export's porcelain was empty before the runs, after the mutations, and after the base-copy removal.
  - The harness moved four long commands to the background after 180 s: the base no-flag run, both `--show-cites` runs and the worktree `verify-quotes`. One of my wait loops was moved too. I waited for each with foreground loops that sleep 5 s per turn and stop at a deadline under 170 s. At most two node processes ran at once. Every one finished with its exit code printed (all listed below).

**Check 1: the diff** (`git diff ab9b52ab...077681ed`, rc 0; `git diff --numstat`, rc 0)

- **Commits.** Three: d8369ef8 (the fix, plus T3's expected figure), 0f6800fc (T1 and T2, +20), 077681ed (comments only; `git diff 0f6800fc 077681ed` touches only the test file's comments).
- **The change.** It is at scripts/plan/verify-quotes.mjs:1085-1090 at the head. The single-candidate branch reads the text once (`candText`) and splits it. It computes `count = lines.length - (candText === '' || candText.endsWith('\n') ? 1 : 0)`, which is the same formula as countOf (`git show ab9b52ab:scripts/plan/verify-cites.mjs`, lines 278-281). The guard is `c.startL < 1 || c.startL > count`. The note prints `${count}`. The in-range branch is unchanged. The only comment added is the inline `// verify-cites' countOf` on the count line; no comment line was added.
- **Nothing else changed.**
  - No export or signature changes.
  - Header (lines 65-70) and docstring (lines 1047-1053) are unedited. I read them at the head, and they are now true as worded.
  - verify-cites.mjs is unchanged: an empty diff, rc 0.
  - main and B are byte-equal on the three files: `git diff --name-only ab9b52ab f975d609` over them is empty, rc 0.
- **Size.** `git diff --numstat`: 5/3 on verify-quotes.mjs and 25/6 on verify-quotes.test.mjs. That is 39 lines over 2 files against §7's 70. No overrun.
- **Tests.**
  - Among existing tests, only T3 changed: its assertion went from 4 to 3, and its RECORDED MUTATION comment was replaced (178-179 at the head).
  - No test was removed. The count went from 68 at B to 70.
  - T1 is at 191 with its comment at 190; T2 is at 202 with its comment at 201.

**Check 2: tests and mutations on the export** (`git archive 0f6800fc`, `tar --force-local -xf`, rc 0 both)

- **Script versions by sha256.**
  - 0f6800fc's verify-quotes.mjs is c1364f7d03c789c5b7d89a8e9895e6826d2f974a0b67538b18fc7d84a724fb48. This equals the head's, and the export's copy matched it.
  - B's verify-quotes.mjs is 0ed37450c9879c8ebeed61380c8548a78844e94ca306497ae462a8e22bf5f173.
- **Harness.** My own script, vq-g1r-mut.mjs, using the TAP reporter. It writes each variant, runs `node --test scripts/plan/verify-quotes.test.mjs`, restores the original bytes and checks their sha256. Each substitution had to match exactly once. Overall rc 0.

| Run | rc | ok | not ok | Restored |
|---|---|---|---|---|
| 0f6800fc as is | 0 | 70 | 0 | equal |
| B's .mjs in place | 1 | 67 | T3 (actual "4 lines"), T1 (`(blank line)`), T2 (`(blank line)`) | equal |
| M1 (`c.startL > lines.length`) | 1 | 68 | T1, T2 (both `(blank line)`) | equal |
| M2 (`candText === '' \|\|` dropped) | 1 | 69 | T2 alone (`(blank line)`) | equal |
| M3 (note prints `${lines.length}`) | 1 | 67 | T3 and T1 ("4 lines"), T2 ("1 lines") | equal |
| Guard removed (`if (false) {`) | 1 | 67 | T1, T2, T3 (each `(blank line)`) | equal |

- **Against §4.** Each row matches §4's table cell by cell, and no other test failed.
- **The RECORDED MUTATION comments at the head.** All four name 0f6800fc0c86066f775c60b8bec113c9403e254f. Each names only the tests I saw fail: M1 names T1 and T2; M2 names T2 alone; M3 and the guard removal name all three. T3's comment records `(blank line)` under guard removal, which is what I observed. §8 item 5 is met.
- **§8 item 4.** No record calls a verify-mutation run an observation; the worker's report calls it "a floor".

**Check 3: P3 and P4** (over my export at 0f6800fc; B's checker was copied in as an untracked `scripts/plan/vq-g1r-vq-base.mjs` and removed afterwards)

- **P3, no flag.** Both checkers exit 0. `cmp` shows stdout identical (2 lines, rc 0) and stderr identical (36 lines, rc 0). That is 38 lines, the same as the worker's figure.
- **P4, `--show-cites`.**
  - Both exit 0, and stderr is identical (`cmp` rc 0).
  - My comparison script, vq-g1r-cmp.mjs, exits 0: 8808 rows in each, the same relPath:citeLine, target and hashMark on every row, and non-row lines equal.
  - It classifies 8800 rows identical, 8 class (i), 0 class (ii), 0 other. Class (i) here means the count is one lower at the head, the target file ends in a newline, and the head's figure equals the file's true count. A raw `diff` shows the same 8 lines.
  - All 8 are cites into governance/DECISIONS-PENDING.md (550 lines at B, 549 at the head) or state/CUT-STATE.md (490 at B, 489 at the head).
- **Agreement.** My counts match the worker's 8 and 0. Mine are over a clean 0f6800fc tree; the worker's tree is not named (N1).

**Check 4: verify scripts in C:/dev/wt/vq at 077681ed, and CI**

- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 596 tests, 596 pass, 0 fail (94 s).
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "verify:cites PASS … 2569 file(s)".
- `verify-quotes.mjs`: rc 0, "verify:quotes PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), …".
- `verify-test-claims.mjs`: rc 0, "all 708 claimed test(s) across 225 file(s)…".
- `verify-mutation.mjs`: rc 0, "all 2 new test(s) have a recorded mutation naming them". This is a floor, not an observation of a mutation.
- `gh pr checks 275`: rc 0, all 8 pass.
- `gh pr view`: head 077681ed…, draft, base main, open.
- `gh run view` on each of the six runs (rc 0 each): every head sha is 077681ed74fe50c4f8f26017978ed0bcc6ca40d2, and every run is completed/success.
  - 41636062742 (Governance CI, push)
  - 41637865267 (Governance CI, pull_request)
  - 41637865358 (DCO)
  - 41637865236 (Exposure scan)
  - 41636062353 and 41637865216 (Ported notices)

**Hold lines:** none. Only node, git and gh ran, with at most two node processes at once.

**Background shells and processes:** none left running. The four auto-backgrounded commands and the moved wait loop all completed with exit 0. A final process query found 0 node processes matching my commands.

**Cleanup:** C:/dev/wt/vq is at 077681ed with empty porcelain. The export folder and its tar are deleted (`ls` on the export path: no such file). My other vq-g1r-* scratch files stay in my scratch folder. Nothing was written anywhere else.
