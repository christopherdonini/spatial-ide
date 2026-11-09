Reviewed: PR #304 at 165e07f2b902ce4a1537db012be3f05c16f63f7b (from 96d439b1; base c42cfd60), OPEN-B (a) scoped check, reviewer
Verdict: PASS WITH NOTES
Branch: cut/shell-resource-dir-dev-comments @ 165e07f2b902ce4a1537db012be3f05c16f63f7b

**Summary:** both reworded spans match the architect's words byte for byte, every token is unchanged, and every clause holds against the code at the head. Formatting, the two targeted tests and the full suite pass, and CI is green at the head. There are no Correctness or Evidence findings. The only findings are two wrong line cites in the worker's report.

## Findings, by class

**Correctness: none.**

**Evidence: none.**

**Documentation (must be fixed before the merge; neither blocks).** Both are in the worker's report (`<S>/hb-srdc2.md`, sha256 919212c4…). That report is filed byte for byte, so the fix belongs in its filing note, not in the report.
- **D1.** The report says, of the `None` clause: "The comment is in `resolve_viewer_dir` at :1528-1531."
  - At 165e07f2, lines 1528 to 1531 are code: `let remedy = if resource_dir.is_some() { … } else {`.
  - The comment that says `commands.rs` passes `None` only on a `resource_dir()` error is at publish.rs lines 1523 to 1527. Its clause is on lines 1526 and 1527.
  - Closure: the filing note gives 1523 to 1527.
- **D2.** The report says: "The test asserts that string and `!err.contains("reinstall Spatial IDE")` (:1605-1608)."
  - The string assertion is at lines 1605 to 1608. The negated `reinstall` assertion is at line 1609.
  - Closure: the filing note gives 1605 to 1609.

Every other sentence of the report that I checked is true.

## Checks 1 to 8

The first check was the packet's sha256, 6fefda5e…8ebb8a. It matches, and the packet is 5983 bytes.

**1. The commit and its spans**
- `git log --format='%H %P' 96d439b1..165e07f2` (rc 0) gives one commit, 165e07f2…, whose parent is 96d439b14abcbee26d1c8d3ff46e143fd0f4249c.
- `git diff --name-only` (rc 0) lists `frontends/shell/src-tauri/src/publish.rs` only.
- My script, `srdc-g1s-spans.mjs`, reads the architect's words from the form's OPEN-B (a) lines at main 8e4fdb07 (form sha256 7006b48d…, matching the packet). It takes the code spans and turns the form's escaped backticks back into plain ones. Then it checks:
  - two hunks, `-1403,1` and `-1599,3`, both inside the spans at P (1403, and 1598 to 1601);
  - head lines 1403 and 1404 equal the words for (ii);
  - head lines 1599 to 1601 equal the words for (i), indented 8 spaces;
  - the 4 added lines equal the words minus the first (i) line, which was already identical at P (P:1598 is the same as H:1599);
  - every line outside the spans is equal between P and H.
- Negative self-test: one word changed, gives SPANS-BAD, rc 1. The real run gives SPANS-OK, rc 0.
- `git diff --numstat c42cfd60...165e07f2` (rc 0) gives commands.rs 2/2 and publish.rs 15/14, 33 in all, within 60. B...P was also 33: this commit replaces lines that were already in the branch's diff.

**2. Comment-only (my own scripts)**
- **Lexer** (`srdc-g1s-lex.mjs`):
  - P against P gives rc 0, 6198 tokens (446 strings, 8 chars, 15 lifetimes).
  - The three negatives each give rc 1, each failing at the changed token:
    - `dev_tree_viewer_dir` changed to `dev_tree_viewer_dirx`;
    - `built` changed to `bilt` inside the ` — ` refusal string;
    - `assert!(!err.contains(` changed to `assert!(err.contains(`.
  - P against H gives TOKENS-EQUAL, rc 0, 6198 tokens on each side.
- **Diff-line classifier** (`srdc-g1s-cl.mjs`, per-line code and comment marking, with strings counted as code):
  - Negative A, the code line `|_| false` changed to `|_| true`, gives rc 1.
  - Negative B, `//` put inside the refusal string, gives rc 1.
  - The real run over `-U0 96d439b1 165e07f2` gives plus=4, minus=4, not-comment=0, rc 0.

**3. Clause check against the code at 165e07f2**
- **(ii)** "Every candidate tried is named in the refusal when none holds."
  - `candidates` is built at lines 1489 to 1493: the packaged candidate only when `Some`, then the dev-tree candidate.
  - The loop at lines 1495 to 1499 returns on the first one that holds. So when none holds, every candidate was tried.
  - `tried` at lines 1512 to 1522 maps every candidate to a string that starts with its label. The dev-tree value is suppressed when the caller passed a resource directory, but its label stays. The strings are joined with ", or ".
  - The `Err` at lines 1534 to 1536 carries them. True.
  - The sentence before it, at lines 1400 to 1403, still holds: the order keys only on what the caller passes, and `bundled_viewer`'s check at line 1421 is `p.is_dir()`.
  - "When none holds" excludes the other refusals of `bundled_viewer` (the unreadable directory at 1422 to 1428, the build record at 1429), which come after a candidate holds. No overreach.
- **(i), the mirror test's three lines**
  - "`resource_dir` is `None`": true. Line 1602 calls `resolve_viewer_dir(None, |_| false)`.
  - "as `commands.rs` passes when `app.path().resource_dir()` returns an error": true. commands.rs lines 323 and 556 pass `app.path().resource_dir().ok().as_deref()`, and `.ok()` turns an `Err` into `None`. `bundled_viewer` hands it straight to `resolve_viewer_dir` at line 1421.
  - "the dev-tree path does not hold the viewer either": true. With `|_| false` the dev-tree path does not hold; with `None` it is the only candidate.
  - "the remedy is the developer one, the `else` arm": true. With `resource_dir.is_some()` false, the `else` arm at lines 1531 and 1532 gives "run `npm run build` in renderer/bundle-viewer first". The test asserts that string (1605 to 1608) and the absence of "reinstall Spatial IDE" (1609). "Developer" matches the code comment at line 1523 ("developer-context only when it was not").
  - "The mirror of the test above": true. The test above (1571 to 1595) passes `Some(resource)` with `|_| false` and asserts both labels and the reinstall remedy, with no `npm run build`. This test passes `None` with the same predicate and asserts the reverse: the dev-tree label, no packaged label, the npm remedy, no reinstall.
- **Block-on-sight 5 as Amendment 1 rewords it** ("an OPEN-B line edited other than to the architect's words"): not tripped, because the added bytes equal the words (check 1).
  - Block-on-sight 4 and 6 are not tripped either: there is no tauri claim, no code fence and no intra-doc link.
  - No untrue clause, so no replacement words.
- **Amendment 1's verbatim quote of the ruling** (`srdc-g1s-quote.mjs`, rc 0): it is a byte-exact prefix of the directive's line 9. The only text left out is the closing " #303: clicked.", which carries no condition on #304.

**4. Formatting and tests** (`CARGO_TARGET_DIR=D:/wt-targets/srdc`, each in its own shared hold; D: had 213G free)
- `cargo fmt … -- --check --color never`: rc 0, empty output.
- `cargo test … --locked --lib resolver_tests::no_resource_directory_at_all`: rc 0, "2 passed; 0 failed; … 71 filtered out", as predicted.
- `timeout 3600 cargo test … --locked`: rc 0. There are 4 `test result:` lines: 73 (lib), 0 (main), 2 (`sole_caller_scan`) and 0 (doc-tests). That is 75 passed, 0 failed, and no FAILED or panicked line.
- Neither run recompiled. The worker's build at the head was fresh, and the worktree file is byte-equal to the 165e07f2 blob (`cmp` rc 0).

**5. Bytes** (`srdc-g1s-bytes.mjs`; the tab negative gives rc 1, the real run rc 0)
- 4 added lines, no CR, no tab, widest 96 columns.
- publish.rs at the head ends in LF (`tail -c 1` shows `\n`) and has 0 CRs.

**6. The worker's deviation and the report**
- `git ls-tree -r --name-only 165e07f2 -- frontends/x` is empty (rc 0), and `test -e frontends/x` gives rc 1.
- `git rev-parse origin/cut/shell-resource-dir-dev-comments` gives 165e07f2…. `gh api …/branches/…` gives the same.
- The worktree reflog shows 96d439b1 then 165e07f2. The origin ref's reflog shows two pushes, 96d439b1 then 165e07f2, a fast-forward.
- All 16 raw files match the packet's byte counts and sha256 prefixes. `srdc2-u0.diff` and `srdc2-full.diff` are byte-equal to mine. `srdc2-bh.diff` is byte-equal to `git diff -U0 c42cfd60...165e07f2`.
- `srdc-g1s-report.mjs` (rc 0, REPORT-FIGURES-MATCH) confirms these report figures against the raw files and my numstat:
  - 869 and 6198 tokens;
  - plus=17, minus=16, not-comment=0;
  - 15/14 + 2/2 = 33;
  - 4/4 from P to the head;
  - 2 passed;
  - 73/0/2/0 = 75;
  - an empty fmt log;
  - the two hunk headers.
- Report sentences that are not true: D1 and D2 above.
- The report's "CR count … 0" has no raw file behind it. My check 5 confirms it.

**7. CI**
- `gh pr checks 304` (rc 0): 14 entries, all pass. The PR's head is 165e07f2…, still in draft.
- `gh run view` on each of the 10 runs (all rc 0): every one has headSha 165e07f2b902ce4a1537db012be3f05c16f63f7b and conclusion success. That includes Product CI — shell (42705583223 pull_request, 42705568102 push) and Rust fmt (42705583107, 42705567874).

**8. Porcelain afterwards**
- `git -C C:/dev/wt/srdc status --porcelain --untracked-files=no` is empty (0 bytes), and HEAD is still 165e07f2….

**One call to disclose:** I ran `node srdc-g1s-cl.mjs srdc-g1s-bh-u0.diff /dev/null /dev/null` with its output thrown away. Nothing above relies on it.

## For the human
Nothing. The architect's words check true clause by clause, and the ruling's quote resolves.

## The packet's gaps
- The packet did not say that the form's OPEN-B (a) writes the (i) words inside markdown code spans with escaped backticks, so "byte-equal" means after turning those back into plain backticks. I worked that out from the bytes.
- The packet did not say that `srdc2-bh.diff` is a `-U0` diff. It matches only `git diff -U0 c42cfd60...165e07f2`.
- There is no raw output for the worker's span check (`srdc2-spans.mjs`, its negative or real run), its CR count (`srdc2-cr.mjs`), or the fmt exit code. `srdc2-fmt.log` is empty, which does not record an exit code.
- It did not give the head's line numbers for `resolve_viewer_dir`, the two tests or the `else` arm. I read them at the head.

## Hold lines (this project's only; `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:18364 also=<elided> …` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:18364 affinity=FF (cores 0-7)` (fmt)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:19080 also=<elided> …` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:19080 affinity=FF (cores 0-7)` (targeted test)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:80396 also=<elided> …` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:80396 affinity=FF (cores 0-7)` (full suite)

## Background shells left
None. Every call ran in the foreground, and I started no background shell or process.

Scratch files are all in `<S>/` under `srdc-g1s-` names. The scripts are `srdc-g1s-spans.mjs`, `srdc-g1s-lex.mjs`, `srdc-g1s-cl.mjs`, `srdc-g1s-bytes.mjs`, `srdc-g1s-report.mjs` and `srdc-g1s-quote.mjs`; the main logs are `srdc-g1s-t1.log`, `srdc-g1s-full.log` and `srdc-g1s-runs.txt`. Nothing tracked was changed.
