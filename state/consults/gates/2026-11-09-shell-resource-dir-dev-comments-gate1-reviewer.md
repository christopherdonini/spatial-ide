Reviewed: PR #304 at 96d439b14abcbee26d1c8d3ff46e143fd0f4249c (base c42cfd60), gate 1, reviewer
Branch and commit: cut/shell-resource-dir-dev-comments @ 96d439b14abcbee26d1c8d3ff46e143fd0f4249c

Verdict: PASS

## Findings by class

**Correctness: none.** Every token in both files is unchanged. Every changed line is a comment line inside the Scope spans. Every clause holds at the head (check 4).

**Evidence: none.** I re-ran every check at the head and each reproduces. I recomputed every figure in the worker's report from its raw files.

**Documentation: none must-fix.**

**Notes.** These are preferences, not acceptance conditions (Part 1, item 6):
- N1. 1e mirror, head publish.rs:1598-1601. In "(as `commands.rs` passes when `app.path().resource_dir()` returns an error, and the dev-tree path does not hold the viewer either)", the second clause could be misread as a condition on when commands.rs passes `None`. On that misreading it is false: commands.rs:323 passes `None` on any `Err`, whatever the dev-tree path holds. The natural reading, two facts about the test's setup (`None`, and `|_| false` at :1602), is true. These are the architect's draft words, adopted by the worker; they are not the human's. This is not blocking, so I give no replacement words.
- N2. My own deviation from the brief. My first Bash call redirected `git rev-parse` into `/tmp/x`, which is outside the scratch folder. I deleted it in my next call, and `ls` confirms it is gone. Nothing else was written outside scratch and the cargo target.

## Checks 1 to 12

**1. Out-of-scope line, first.**
- `git diff --name-only c42cfd60...96d439b1`, rc 0: exactly `frontends/shell/src-tauri/src/commands.rs` and `frontends/shell/src-tauri/src/publish.rs`.
- `--numstat`, rc 0: 2/2 and 15/14, 33 in total, against 60.
- §21a, clause by clause:
  - ADR: no file under docs/.
  - Security: nothing but comments changes (check 2), so no exposure surface, dependency, hook or capability. The suppression's tokens are equal.
  - Wire: nothing under protocol/.
  - Guarantee: the token streams are equal, so no property changes.
  - No string the app shows changes (strings are tokens and are equal).
- All four categories are untouched, so the single gate applies.

**2. Comment-only, by my own scripts** (srdc-g1r-lex.mjs, srdc-g1r-tok.mjs and srdc-g1r-dl.mjs, all in the scratch folder).
- The Bash tool collapsed `\\` to `\` inside my first quoted heredoc. The `od -c` check caught it, and I rewrote the lexer with no backslash character in its source; a char-code count shows 0.
- Self-tests, base against itself, rc 0: publish.rs 6198 tokens, commands.rs 869.
- Token negatives on scratch copies of base publish.rs, each rc 1, each naming the first differing token:
  - an identifier, `tried` to `tried2` at :1510;
  - a string holding `//`, `"publish://progress"` with one character changed, at :912;
  - the ` — ` remedy string, `Spatial` to `spatial`, at :1528;
  - an `assert!` argument, `assert!(!err.contains(` to `assert!(err.contains(`, at :1608.
- Real run, base against head, rc 0 and EQUAL: 6198 = 6198 and 869 = 869.
- Comment-line check over `git diff -U0 c42cfd60...96d439b1 -- <both files>`: rc 0, plus=17, minus=16, not-comment 0. Each diff line's text also matches its file's line (mismatch 0).
- Comment-line negatives, each rc 1:
  - a code line, `p.is_dir()` to `p.is_file()` at head :1420;
  - a string-continuation line beginning `//`, head :1529 made `         // or the install is incomplete"`. The script classifies it as code.

**3. Scope spans.** `git diff --quiet f703b720 c42cfd60` over the two files gives rc 0, so the Scope's line numbers are the base's. Each hunk against its span:
- commands.rs `-320,2`: :320-321, which is the parenthetical at :320 plus the line note 1 replaces (the settlement's reading).
- publish.rs:
  - `-1400,3`: :1400-1402 (1a). The text before "—" is kept.
  - `-1508,2`: :1508-1509 (1b).
  - `-1523,4`: :1523-1526 (1c). "end user … can act on" is kept.
  - `-1562,2`: :1562-1563 (1e).
  - `-1598,3`: :1598-1600 (the mirror, as the settlement reads it).

No changed line lies outside its span.

**4. Clause by clause at the head.** By my script (srdc-g1r-words.mjs), the worker's words equal note 1's drafts word for word in all six blocks: 65, 21, 40, 19, 16 and 45 words. Only the wrapping differs, for example 1a's "keys only on / what".
- **1a** (publish.rs:1400-1403):
  - "keys only on what the caller passes": `resolve_viewer_dir(resource_dir, exists)` (:1484-1487), called with `|p| p.is_dir()` (:1420).
  - "not on how the app was built": no `cfg` in :1416-1537 (grep count 0). The only build-time input, `env!` at :1477, is the dev path's value, not the order.
  - "tried first": the push at :1489-1490, and the first existing candidate is returned at :1494-1497.
  - "the dev-tree path when that is not a directory or no resource directory is passed": the push at :1492 always happens, `exists` is `is_dir`, and with `None` it is the only candidate. True.
- **1b** (:1509-1510):
  - "keys on … `Some`": :1514 `resource_dir.is_some()`.
  - "passes whenever … `Ok` (its `.ok()`)": commands.rs:323 and :556 both `.ok().as_deref()`.
  - "however the app was built": :323 is in an un-cfg'd command. :556 exists only under `#[cfg(debug_assertions)]` (:535) and is identical.
  - True.
- **1c** (:1524-1526):
  - "keys on `resource_dir` alone": :1527.
  - "the same `Some`": :1514.
  - "passes `None` only when … returned an error": `.ok()` at :323 and :556.
  - True.
- **1d** (commands.rs:320-321):
  - "not this command's own error": `.ok()`, not `?`.
  - "gets `None`": :323.
  - "tries the dev-tree path only": publish.rs:1489-1492.
  - True.
- **1e first** (:1562-1563): commands.rs:323, publish.rs:1489-1492, and the call with `None` at :1565. True.
- **1e mirror** (:1598-1601): commands.rs:323, and `|_| false` at :1602. True, with N1's misreading noted.
- **OPEN-A (A).** No sentence states what tauri supplies on any platform. Every new clause is about what commands.rs passes or what publish.rs keys on.
- **Packet §5 item 3** (`read_build_record(&dir, resource_dir.is_some())` at :1428). It makes no changed sentence untrue. 1a speaks of "the order", 1b of "the suppression" and 1c of "the choice" (the remedy in `resolve_viewer_dir`). None claims to be the only `Some`-keyed decision, and :1428 also keys only on what the caller passes.
- **The only product callers** of `bundled_viewer` are commands.rs:323 and :556 (by grep). The other callers are tests (:3449, :3464).
- **Note 5's block-on-sight list:**
  1. Path outside the 2 files: none.
  2. Changed token: none.
  3. Clause untrue at the head: none.
  4. Sentence stating what tauri supplies: none.
  5. OPEN-B line edited: see check 5.
  6. Code fence or intra-doc link added: none (my script finds 0 "```", 0 "[`" and 0 "](" in the added lines).
  7. A red CI entry: none (check 11).

**5. OPEN-B held.**
- `Both paths are named in the refusal when neither holds.` occurs once at the head, whole on :1403. At the base it was the tail of :1402.
- `since there is no installed app to tell an end user to reinstall` occurs once at the head when the lines are joined with their comment prefixes stripped. It spans :1600-1601; at the base it was all on :1600.
- Both words are byte-unchanged. Both clauses sit on changed lines, and only their wrapping and line position moved, because note 1 replaces the lines they sit on. On the settlement's reading (the Scope is the lines note 1 replaces, and the clauses stay unchanged) this is not block-on-sight 5. It is listed below for the human.

**6. Formatting and tests, each in its own shared hold.** CARGO_TARGET_DIR was D:/wt-targets/srdc. D: had 197G free before the cargo checks.
- `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never`: rc 0, empty output.
- `cargo test … --locked --lib resolver_tests::no_resource_directory_at_all`: rc 0, "2 passed; 0 failed; … 71 filtered out". Both named tests ran.
- `timeout 3600 cargo test … --locked`: rc 0. There are 4 `test result:` lines, all ok, 0 FAILED:
  - lib: 73 passed;
  - main: 0;
  - sole_caller_scan: 2;
  - doc-tests: 0.
  - That is 75 passed and 0 failed in all.

**7. Governance checks at the head** (tools as at 96d439b1):
- `node --test` over the plan, hooks and evidence suites (in a hold): rc 0, 598 tests, 598 pass, 0 fail.
- verify-cites: rc 0, PASS (177 loose references advised).
- verify-quotes (in a hold): rc 0, PASS (152 checked, 0 errors).
- verify-test-claims: rc 0, PASS (780 claims).
- `verify.mjs --offline`: rc 0, PASS.

**8. Bytes** (srdc-g1r-bytes.mjs): rc 0. 17 added lines, 0 CR, 0 tab, widest 100 columns, none over 100. Both head files end with LF and contain 0 CR bytes.

**9. The worker's two errored calls.** Nothing follows for the piece's code or evidence:
- no figure in the report rests on them;
- every figure was reproduced by my own runs (checks 1, 2, 6, 7 and 10).

The failure to stop and report a harness block is a worker-conduct matter for the custodian, not a defect of the piece. I did not read the transcript (its path was not in the packet).

**10. The worker's report against its outputs** (srdc-g1r-raw.mjs, rc 0).
- All 20 listed raw files match the packet's byte counts and sha256 prefixes.
- Every figure in the report matches its raw file and my re-runs:
  - names and numstat 2/2 and 15/14;
  - tokens 6198/6198 and 869/869, EQUAL;
  - diff lines plus=17, minus=16, not-comment=0;
  - base and head resolver tests 2 passed;
  - full suite 73+0+2+0;
  - node --test 598/598/0;
  - all four verify PASS lines.
- The worker's srdc-real.diff and srdc-full.diff are byte-equal to my diffs.
- The line cites in its step 5 resolve at the head.
- No sentence found untrue. Two claims cannot be checked from the outputs: the hold count (8) and the wait-loop description. They need the transcript.

**11. CI.** `gh pr checks 304`: rc 0, all 14 entries pass. `gh run view` gives headSha 96d439b14abcbee26d1c8d3ff46e143fd0f4249c and conclusion success for all 10 runs, including Product CI — shell (42646898783 pull_request, 42646627186 push) and Rust fmt (42646898779, 42646627244). The other six are Governance CI (2), Ported notices (2), DCO and Exposure scan. The PR is open, a draft, at head 96d439b1.

**12. Porcelain afterwards.** `git -C C:/dev/wt/srdc status --porcelain --untracked-files=no` gives rc 0 with empty output. HEAD is still 96d439b1.

## For the human (OPEN-B is yours; no replacement words)

- OPEN-B (ii), publish.rs:1403.
  - The kept sentence "Both paths are named in the refusal when neither holds." now directly follows the new words "or no resource directory is passed".
  - With `None` the refusal names one path only: :1489-1492, and the assertion at :1604.
  - The new text puts the case where the kept sentence does not hold right beside it.
- OPEN-B (i), publish.rs:1600-1601.
  - The kept tail "since there is no installed app to tell an end user to reinstall" now follows the new words saying that `None` comes from a `resource_dir()` error.
  - The code does not show that no installed app exists in that case.
- Block-on-sight 5's literal wording ("An OPEN-B line edited"). Both clauses' lines are changed (re-wrapped) while their words are unchanged. I read this as within the ruled Scope (b) under the settlement's span reading. You may want to confirm that reading.

## The packet's gaps

- The worker's transcript path. It was needed to read the two errored calls myself (check 9) and to check the report's hold count and wait-loop description (check 10).
- The Scope spans' head-side line numbers. I derived them from the diff; no harm.
- Otherwise none.

## Hold lines (this project's only, `also=` elided)

- fmt: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:3608 also=(elided)` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:3608 affinity=FF (cores 0-7)`
- resolver tests: shell=bash.exe:78552, held and released, same form.
- full suite: shell=bash.exe:53332, held and released.
- node --test: shell=bash.exe:61756, held and released.
- verify-quotes: shell=bash.exe:28424, held and released. The harness moved this call to the background after 180 s. It completed with rc 0, and I waited for it with a bounded loop: 5 s per turn, capped at 100 turns, it ended at turn 25.

No hold was refused; there were no exit codes 96 to 99.

## Background shells left

None of mine. Two processes seen at the end are not mine and were not touched:
- a `timeout`/`cargo` pair started 17:20:28 local, after my last cargo run ended at 17:14:51;
- an orphaned bash running `sleep` loops, started 17:20:55.

I killed nothing.

Scratch files, all in <S> and named `srdc-g1r-*`: the scripts are srdc-g1r-lex.mjs, srdc-g1r-tok.mjs, srdc-g1r-dl.mjs, srdc-g1r-words.mjs, srdc-g1r-openb.mjs, srdc-g1r-bytes.mjs and srdc-g1r-raw.mjs; the logs are srdc-g1r-full.log, srdc-g1r-res.log, srdc-g1r-nodetest.log, srdc-g1r-quotes.log, srdc-g1r-runs.txt and srdc-g1r-checks.txt.
