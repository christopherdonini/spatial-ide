Reviewed: PR #302 at 10b695f92925b11ac5a4b911c9bdd9e9039c5c40 (base 75390735), gate 1, reviewer

Verdict: PASS

The diff does exactly what the Change line says. After my script reverses the declared edits, each of the seven head files equals its base file byte for byte. All checks ran with the expected exit codes, nothing is blocking, and the worktree's tracked porcelain is empty.

## Findings by class

- **Correctness:** none.
- **Evidence:** none.
- **Documentation:** none to fix before the merge.
- **One clause reading, not a finding:** the Out-of-scope line says "no new string". The only string literal with new bytes is row 9's format template, `"({} {} {}) {} {} {} {}"`. The Change line declares that template, and it renders the same text for any values (check 2, row 9). No user-facing string is added.

## Checks 1 to 11

**Before the checks**
- The packet's sha256 is 12ef5bc1…b8a1, equal to the brief's. The brief's sha256 is a53f6904…f438, also equal.
- The worktree HEAD is 10b695f9. Its porcelain was empty at the start.
- D: has 198G free (466G size; `c12b-g1r-df.txt`). That is above 40 GiB.
- Toolchain: clippy 0.1.97 (8bab26f4f6 2026-07-14), rustc 1.97.1 (8bab26f4f 2026-07-14).
- Every one of the worker's 18 raw outputs matches the packet's byte count and the first 16 hex of its sha256 (`c12b-g1r-rawhash.txt`).

**1. The Out-of-scope line** (`c12b-g1r-names.txt`, `c12b-g1r-numstat.txt`, `c12b-g1r-scan.out`; each rc 0)
- `git diff --name-only 75390735...10b695f9` lists exactly the seven Scope files. Cargo.toml, Cargo.lock and clippy.toml are not in the list.
- numstat matches the packet: 1/0, 6/6, 1/0, 3/2, 1/0, 1/0, 2/0. That is 23 lines against the budget of 60. There is one commit and 14 hunks.
- Added lines (15 in all): 0 contain `unsafe`, 0 `pub`, 0 cfg, 0 `[lints]`, 0 `use` or `extern`, and 0 are comments.
- ADR clause holds. No ADR file is touched. The campaign's seeded inputs are unchanged, by my digests B = H (check 4).
- Security clause holds. No product file is touched: all seven files are under engine/tests.
- Wire clause holds. No protocol, SKP or MCP file is touched.
- Guarantee clause holds. Guards, assertions, messages, test names and fixture constants are byte-identical, by check 2's reverse comparison. No release harness was run.
- I read the Out-of-scope line first (§21d). It names no §21a category as touched, so the five-line form stands.

**2. The diff against the Change line and N1**
- My script `c12b-g1r-cmp.mjs` (output in `c12b-g1r-cmp.out`) exited 1 on its first run. Its own escapes were wrong because the Bash tool collapsed a `\\`. I fixed that and showed the bytes with `od -c`. The second run exited 0 with FAILURES 0.
- **Method:** the script reverses only the declared edits in each head file and compares the result to the base file. The reversed text equals the base byte for byte in all seven files.
- **Row 7:** the head has one `#[allow(clippy::large_enum_variant)]` line (head :363), and the base has none. Its next line is `enum Observed {`. Removing the line gives the base file exactly.
- **Rows 8 and 10:** only the `*` is dropped. Each reversal occurs exactly once.
- **Row 9, argument expressions in order:**
  - Base: `r.pick(NUM_COLS)`, `r.pick(&["+", "-", "*", "/"])`, `num_lit(r)`, `r.pick(&["*", "+"])`, `r.below(5) + 1`, then `format!("{} {}", r.pick(&["<", ">", "="]), num_lit(r))`. The inner `format!` evaluates its two arguments in place, as the sixth argument, left to right.
  - Head: the same first five, then `r.pick(&["<", ">", "="])`, `num_lit(r)`.
  - So the head runs the same seven drawing expressions in the same order, which means the same draws.
  - The rendered text is also the same for any values. The base template `"({} {} {}) {} {} {}"`, with `"F G"` in its last slot, renders the same bytes as the head's `"({} {} {}) {} {} {} {}"` with F and G in its last two slots. No slot has a format spec.
- **Row 11:**
  - In the base, the `.filter(|&b| b <= end)` and `.last()` lines appear once. In the head they are replaced by one `.rfind(|&b| b <= end)` line. Nothing else in `splice` differs, by the whole-file equality.
  - It is the site the form places at :556. The base row is `double_ended_iterator_last` at 556:27-560:28. The worker's pre-commit `filter_next` row is at 557:27-561:33 (my count of `c12b-pre.json`). It starts on the same `boundaries` expression at column 27, one line lower because row 9 adds a net line.
  - `rfind` yields the same element. It returns the last element satisfying the predicate, which is what `filter(..).last()` returns. The closure is pure, and the chain makes no draw.
- **Rows 19 and 20:** `log.as_str(),` occurs twice and replaces `&log as &str,` twice. Both give the same `&str` of the same `String`, so `std::fs::write` writes the same bytes.
- **Rows 18 and 21 to 25:** each fn named in the Change line has exactly one `#[allow(clippy::assertions_on_constants)]` line, and the base has none.
  - The allow sits directly above its `fn` line, after `#[ignore …]` where there is one: digest :394, 5gb_fixtures :337, layout_digest :460, layout_fixtures :246, lod :252.
  - At `five_gb_build` (lod :486) it follows a blank line, because that helper has no attributes.
  - Removing these lines gives the base file exactly, so every guard's expression and message is unchanged.
- **Every deleted line (8) and what replaced it:**
  - `*r.pick(&[" ", …])` → `r.pick(&[" ", …])`
  - `"({} {} {}) {} {} {}",` → `"({} {} {}) {} {} {} {}",`
  - `format!("{} {}", r.pick(&["<", ">", "="]), num_lit(r))` → `r.pick(&["<", ">", "="]),` + `num_lit(r)`
  - `let t: &str = *r.pick(SPLICE_TOKENS);` → the same without `*`
  - `.filter(|&b| b <= end)` + `.last()` → `.rfind(|&b| b <= end)`
  - `&log as &str,` ×2 → `log.as_str(),` ×2
- No test name, assertion, `#[ignore]` string or message changes.

**3. Clippy at the head** (each command in its own shared hold)
- JSON run: rc 0, output in `c12b-g1r-head.json`. My counting script `c12b-g1r-count.mjs` exited 0:
  - head: raw 0, distinct 0, so 0 rows in the seven files and 0 outside. The build finished with success=true and 276 artifacts.
  - The worker's `c12b-base.json` has sha256 8ae89c2a6cdb2daa…, equal to the packet's first 16 hex. It counts raw 13, distinct 13: all 13 in the seven files at N1's lines, 0 outside.
  - The rows outside the seven files are equal between head and base by (lint, file, span, message): 0 and 0.
- `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings`: **rc 0**. This is recorded, not claimed (OPEN-C (a)); output in `c12b-g1r-deny.txt`.

**4. The observations** (each run in its own shared hold; the scratch fn's sha256 was 281cb9f7c431ed5dbbb6108b4e764d7a3f7fea7492e53fd0475ea67ccb3bbe58 before each use, equal to the packet's)

| Run | rc | Output sha256 | Lines | Compared with |
|---|---|---|---|---|
| Base | 0 | 380ed68576fba852df7ab6a6cebaef69f339a1686cf96b694e513c5a43957af8 | 2500 | the packet's digest: equal |
| Head | 0 | 380ed68576fba852df7ab6a6cebaef69f339a1686cf96b694e513c5a43957af8 | 2500 | my base digest: `cmp` rc 0 |
| M9 | 0 | 3abb6400d41fec7161fcae4d4846256ef479ccc2d4b2bbc7bf68710609b7b4c9 | 2500 | the head: differs on 2127 lines, first at line 23 |

- **Base:** `checkout 75390735 -- <file>` rc 0, then the fn appended. `git diff --stat 75390735` showed 50 insertions only. After the run, `checkout HEAD -- <file>` rc 0, and the porcelain was empty (0 bytes, with and without untracked files).
- **Head:** the fn appended at 10b695f9 (50 insertions).
- **M9:** made by `c12b-g1r-m9.mjs`. The old text occurred exactly once. The edit is in `c12b-g1r-m9.diff`: the template became `{6} {5}` and the last two arguments were swapped.
  - M9 was caught. My M9 output is byte-identical to the worker's `c12b-draws-M9.txt` (`cmp` rc 0).
  - Then `checkout -- <file>` rc 0, and the porcelain was empty.

**5. The guard runs**
- `cargo test --locked -p spatial-engine --no-run`: rc 0.
- Each pair ran in its own shared hold, and each exited with **rc 101**. Each output has exactly one `panicked at`, and each location is the line of its fn's `assert!(` at the head. Byte-copied whole lines (`c12b-g1r-guard-*.txt`):
  - 18: `thread 'the_5gb_cross_file_digest_correctness_pass' (77772) panicked at engine\tests\import_layout_5gb_digest.rs:396:5:` / `this phase's digests are compared for exact equality across files. Run with --release.`
  - 21: `thread 'generate_the_5gb_fixture_set' (67508) panicked at engine\tests\import_layout_5gb_fixtures.rs:339:5:` / `this phase writes/verifies fixtures other phases score against; a debug build's numbers are not measurements. Run with --release.`
  - 22: `thread 'the_cross_file_digest_correctness_pass' (67368) panicked at engine\tests\import_layout_digest.rs:462:5:` / `this phase's digests are compared for exact equality across files; nothing here is a timing, but every other pass in this family refuses a debug build on principle. Run with --release.`
  - 23: `thread 'generate_the_145mb_fixture_matrix' (63704) panicked at engine\tests\import_layout_fixtures.rs:248:5:` / `this phase writes fixtures other phases hash and time; a debug build's numbers (even the elapsed-time-only ones reported here) are not measurements. Run with --release.`
  - 24: `thread 'wall_time_arm_s_and_arm_p_over_polygons_100k' (61772) panicked at engine\tests\lod_tier_measurements.rs:254:5:` / `this test measures build wall time; a debug build's numbers are not measurements, and every other pass in this family refuses a debug build on principle. Run with --release.`
  - 25: `thread 'wall_time_arm_s_over_parcels_5gb' (61340) panicked at engine\tests\lod_tier_measurements.rs:488:5:` / `this helper is called by both wall-time measurements and an O1-O4 outcomes pass at 5 GB scale; a debug build's wall time is not a measurement, and every other pass in this family refuses a debug build on principle. Run with --release.`
- I launched the six hold calls in one batch, so they may have run at the same time, each inside its own shared hold. Each refusal fires on a constant at the first statement, so timing cannot affect it.

**6. The suite at the head**
- `cargo fmt --all -- --check`: rc 0, empty output.
- `timeout 3600 cargo test --workspace --locked` in one shared hold: **rc 0**, output in `c12b-g1r-wstest.out`.
  - 118 `test result:` lines: 1027 passed, 0 failed, 66 ignored, and 0 FAILED result lines.
  - `filter_admission_property_campaign` passed, at line 351: `test filter_admission_property_campaign ... ok`.

**7. The governance checks at the head** (run from the worktree root)

| Check | rc | Result |
|---|---|---|
| `node --test` on the three suites (shared hold) | 0 | tests 598, pass 598, fail 0 |
| `verify-cites.mjs` | 0 | PASS |
| `verify-quotes.mjs` (shared hold) | 0 | PASS: 152 checked, 0 errors |
| `verify-test-claims.mjs` | 0 | PASS |
| `verify.mjs --offline` | 0 | PASS |
| `forms-layout.mjs` | 0 | PASS |

**8. Bytes**
- The added lines contain 0 CR, 0 tab and 0 non-ASCII bytes.
- Each of the seven files ends with 0x0a at the head and contains 0 CR bytes.

**9. The worker's report against its outputs** (`c12b-g1r-claims.mjs`, rc 0)
- All six quoted `panicked at` lines appear whole in the worker's `c12b-guard-NN.txt`, each with the quoted message as the next line and one `panicked at` per file.
- Digest B and digest H each have 2500 lines.
- H against M9 differs on 2127 lines, first at line 23. The quoted fragments are in H's line 23 (`G1 22 `, `((i64 / 0.1) + 3 > 1940`) and M9's line 23 (`((i64 / 0.1) + 3 < -630`).
- The suite figures (118 result lines, 1027 passed, 0 failed, 66 ignored), the 598 scripts tests and the base run's 9m 56s match the raw files.
- The 13 base rows and the 557:27 `filter_next` row match my count.
- I found no untrue sentence.
- One claim has no output file: that `cargo fmt --all` and `git diff --name-only` ran before the commit. It is not contradicted, because fmt and the name list both hold at the head.

**10. CI**
- `gh pr checks 302`: rc 0, all 18 checks pass.
- `gh run view <id> --json headSha,conclusion,workflowName,event` for all 12 run ids in the packet: each has headSha 10b695f92925b11ac5a4b911c9bdd9e9039c5c40 and conclusion success (`c12b-g1r-runs.txt`). That covers Product CI — Rust workspace, Governance CI, Product CI — shell, Exposure scan, Ported notices, Rust fmt and DCO sign-off on pull_request, and the five push runs.
- `gh pr view 302`: headRefOid 10b695f9, draft, OPEN.

**11. The porcelain afterwards**
- `git -C C:/dev/wt/c12b status --porcelain --untracked-files=no`: rc 0, 0 bytes. HEAD is still 10b695f9.

## For the human

- None. No sentence here is the human's wording and no red-line text is touched.
- The settlement's OPEN-1 (A) and OPEN-A to OPEN-D await the human's review on return, as the packet states. This gate does not change that.

## The packet's gaps

- The location of the Windows read's counting rule (:42); I took it from the form's N4.
- The head line numbers of the six guard `assert!` lines, needed to place each panic; I derived them.
- The machine script's path; the brief gave it.
- Otherwise none.

## Hold lines (`also=` elided)

All were granted; none was refused or returned 96 to 99.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:43112 also=… (commands started from now on inherit it; release when done)`: clippy JSON. Released: `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:43112 affinity=FF (cores 0-7)`.
- Each hold below ended with the matching `MACHINE_RELEASED project=SpatialIDE shell=<same> affinity=FF (cores 0-7)` line:
  - shell=bash.exe:35976: the -D run
  - shell=bash.exe:47056: digest B
  - shell=bash.exe:63760: digest H
  - shell=bash.exe:40348: M9
  - shell=bash.exe:60744: --no-run
  - shell=bash.exe:62264, :64604, :67240, :80356, :74736, :64460: guards 18, 21, 22, 23, 24, 25
  - shell=bash.exe:11168: the workspace suite
  - shell=bash.exe:70492: node --test
  - shell=bash.exe:42948: verify-quotes

## Background shells left

None.
- Three ran in the background and completed: the workspace suite (bnk311tlk), a bounded wait loop with a 5 s sleep and a 580 s cap that ended at its cap (bef6kib5m), and verify-quotes (bwq3opohz).
- `tasklist` shows no cargo.exe.
- I killed no process.

Everything is in <S>, under names starting `c12b-g1r-` (scripts `c12b-g1r-cmp.mjs`, `c12b-g1r-count.mjs`, `c12b-g1r-m9.mjs`, `c12b-g1r-claims.mjs`, `c12b-g1r-ws.mjs`).
