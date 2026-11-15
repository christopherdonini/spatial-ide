Reviewed: PR #300 at 1b71dd6c2a966dab864337fed33d58883be226ed (base 72842b52), gate 1, reviewer
cut/clippy-deny-warnings-workspace-12a @ 1b71dd6c2a966dab864337fed33d58883be226ed

Verdict: PASS WITH NOTES

The packet's sha256 is ef1cde666ac96ba3da3b2be810233aa1db0d59945a9ff41c012d8d12152e3a62, equal to the brief's. The form's sha256 at main is d503e5c8…a130d31, equal to the packet's. The worker report's is 78050f62…6819b58 and the architect draft's is 10423493…11550cc, both equal to the packet's. The worktree HEAD is 1b71dd6c and its tracked porcelain was empty before I started. D: had 194G free (`df -h /d`, rc 0).

## Findings

### Correctness: none
Every one of the 21 deleted lines has an equivalent replacement (check 2). Every fn under an allow is byte-identical. The case strings and every assertion message are unchanged. No test name changes. The macro set in the changed lines is identical: assert! and assert_eq!.

### Evidence: none
The clippy run, the suite, all four mutations, cfg-boundary, L7, the governance checks and CI were all re-run or read by me at 1b71dd6c. Every result agrees with the form's predictions and with the worker's figures.

### Documentation (each must be fixed before the merge; none blocks)

D1. The worker report's OPEN-C sentence is untrue (packet, known finding 1). I confirm the custodian's reading.
- The sentence, at the filed report line 21: "All 13 are in engine files that no slice names, so OPEN-C's red-line item goes to the human in the closing message."
- My count of the head and base JSON shows all 13 outside rows in the seven files of the 12b row (architect draft, table row 12b). Zero rows lie in a file no slice names.
- So OPEN-C's red line is not reached. This is not the human's wording.
- Closure: the custodian's withdrawal, in its next ledger entry as the packet states, lands before the merge. The filed report stays as written.

D2. The worker report calls its M12 panic line byte-copied, but it is not.
- Report line 42 reads "Each failing line is byte-copied from the run's output." Line 43 quotes `thread 'the_type_walk_agrees_with_the_binder_over_the_p0_matrix' panicked at engine\tests\filter_type_admission.rs:1667:5:`.
- The worker's own `c12a-m12.out` line 51 reads `thread 'the_type_walk_agrees_with_the_binder_over_the_p0_matrix' (68176) panicked at engine\tests\filter_type_admission.rs:1667:5:`. The thread id was dropped from inside the span.
- The M16, M17 and M26 quotes are clean sub-line spans.
- The outcome is unaffected: my own M12 run shows the same panic site and message.
- Closure: one appended note in the custodian's filing record of the report, saying the thread id was elided. No edit to the filed bytes.

D3. A note only, not an untrue sentence: the const's effective reach has narrowed.
- The Out-of-scope line ("keeps 65536, `pub(crate)` and its two readers") and N5 ("`pub(crate)` visibility") are literally true of the declared visibility, and the token is kept.
- Inside the private `mod windows_watch`, the const is now reachable only from `crate::watch`, not crate-wide.
- `git grep WATCH_BUFFER_BYTES` at 1b71dd6c over `*.rs`, `*.toml`, `*.mjs` and `*.ts` finds only watch.rs:126 (the const), :222 and :250 (the two readers), plus a comment at engine/tests/source_watch_adapter.rs:276. No reader is lost.
- No change needed. If the gate wants it exact, these replacement words for the form's own sentence (not the human's wording) would do it: "keeps 65536, its declared `pub(crate)` and its two readers, its reach now the `watch` module". The clause check:
  - 65536: watch.rs:126 at the head.
  - declared `pub(crate)`: watch.rs:126.
  - two readers: :222 and :250, byte-equal to the base's.
  - reach: `mod windows_watch` at :102 is not `pub`.

D4. A note only: one added line carries a non-ASCII byte.
- Check 9's scan finds 21 added lines: 0 with CR, 0 with a tab, 1 with a non-ASCII byte.
- That line is the moved doc line `    /// The declared buffer size for each handle's `ReadDirectoryChangesW` call (§7), DWORD-aligned.`, and the byte is the `§`.
- It is the base line's own byte, carried as N5 requires ("doc words" unchanged). No new non-ASCII text.

## Checks 1 to 11

1. **The Out-of-scope line, at the head.**
   - Name list: `git diff --name-only 72842b52...1b71dd6c` (rc 0) lists exactly the eight Scope files.
   - Size: numstat (rc 0) gives 1/0, 4/1, 2/2, 5/5, 2/6, 3/3, 2/2, 2/2, a total of 42, against the budget of 80.
   - Cargo files: a diff limited to Cargo.toml, Cargo.lock, engine/Cargo.toml, `**/Cargo.toml` and clippy.toml is empty (rc 0, 0 bytes). The tree at 1b71dd6c holds 0 clippy.toml files.
   - My script `c12a-g1r-hunks.mjs` (rc 1, only because of D4) over the -U0 diff:
     - no string literal in an added line that is absent from the deleted lines;
     - no `unsafe`;
     - the added `pub` lines are exactly the deleted `pub` lines (the moved const);
     - no `cfg` in any changed line;
     - no `[lints]` or clippy.toml text;
     - exactly three `#[allow` lines added.
   - ADR: envelope.rs is not in the diff. Wire: no SKP, data-plane or MCP file. Security: the const keeps its value and readers (D3). Guarantee: `attr_row_bytes` is byte-identical, and no test is renamed.
   - The line names no §21a category as touched.
   - Each clause holds as the line states it.

2. **The diff against the Change line and N1.** Script `c12a-g1r-diffcheck.mjs`, rc 0, fails 0. It was written by heredoc, not the Write tool (see the gaps).
   - Rows 1 to 3:
     - Each signature is unique at the base and the head.
     - The fn text is equal at base and head: `build` 43 lines, `attr_row_bytes` 55 lines, `flush` 119 lines.
     - The line above each fn at the head is its allow, and the line above that equals the base's.
     - rowgroup.rs at the head, minus its one allow line, equals the base.
     - stream.rs at the head, with its three inserted lines dropped and `[Case; 8]` restored, equals the base. This also proves the case strings unchanged.
   - Row 4: `type Case` occurs once, at head :3856, inside `the_where_composition_matrix_matches_the_declared_rule_exactly` (:3838). `Case` appears on 2 lines only.
   - L7:
     - The base's :71-73 equals the head's :124-126 but for a four-space indent.
     - The const is inside `mod windows_watch` (:102-799), and `#[cfg(windows)]` precedes the mod.
     - The two readers, :222 and :250, are unchanged.
     - The cfg attribute texts and count are equal at base and head: base 88, 92, 105, 726; head 84, 88, 101, 726.
     - The `use super::{…}` line drops only `WATCH_BUFFER_BYTES`.
     - The head, with the moved block restored, equals the base.
   - Row 12: the head file equals the base file with the 7-line nest replaced by the single condition, and nothing else in `is_declared_cast` changes. The `&&` form calls `int_info` once, in the same order, and no `else` was lost.
   - Rows 5-6, 13-15, 16-17 and 26, read from the hunk listing:
     - rows 5-6: only the `*` dropped;
     - rows 13-15: only the `&` dropped;
     - rows 16-17: `!md.contains_key("id_js_exact")` and `assert!(!md.contains_key("id_verified_rows"))`, the message "unverified width must not read as exact" kept as context;
     - row 26: the `enumerate()` loop, `bound.to_bits()` and `"bound {i}"` kept.
   - The 21 deleted lines and what replaced each:
     - stream :3857, the long array type: `[Case; 8]`.
     - trace :637 and :658: the same lines without the `*`.
     - watch :71-74: the same three lines plus their blank, re-inserted at :124-127.
     - watch :107: the `use` line without the name.
     - filter_type_admission :1266-1271: the 2-line single condition (the closing `}` is kept as context).
     - fixture_generation :126, :127 and :143: the same lines without the `&`.
     - identity :321 and :324: the `contains_key` forms.
     - publish_stream :534-535: the `enumerate` pair.
   - No fn, `#[test]` or `#[ignore]` line was deleted.

3. **Clippy at the head.**
   - Command: `cargo clippy --locked -p spatial-engine --all-targets --message-format=json`, in a shared hold, rc 0. stderr ends `Finished `dev` profile [unoptimized + debuginfo] target(s) in 7.83s`.
   - My `c12a-g1r-count.mjs` (rc 0), by the Windows read's rule:
     - head: raw 13, distinct 13, 0 in the eight files, 13 outside;
     - base (`c12a-base.json`, sha256 614bb37652ca1cda…, equal to the packet's first 16 hex): raw 29, distinct 26, 13 in the eight files (the form's thirteen, at the lines N1 gives), 13 outside.
   - The outside rows are equal at head and base by (lint, file, line:col, message): true.
   - All 13 are in 12b's files:
     - admission_p4_corpus.rs:363;
     - admission_property_campaign.rs:218, 270, 543, 556;
     - import_layout_5gb_digest.rs:395;
     - import_layout_5gb_fixtures.rs:318, 326, 338;
     - import_layout_digest.rs:461;
     - import_layout_fixtures.rs:247;
     - lod_tier_measurements.rs:253, 486.
   - 0 rows lie in a file no slice names.

4. **The mutations, at the head, each in a shared hold.** Each old text occurred exactly once (grep -c, or my `c12a-g1r-mut.mjs`). `git diff` was shown for each.
   - M12: rc 101. `thread 'the_type_walk_agrees_with_the_binder_over_the_p0_matrix' (16416) panicked at engine\tests\filter_type_admission.rs:1667:5:` / `90 B-T1 counterexample(s); see the report above`. 40 lines carry `in_division=true`, the first being `arith / then > 0 i8 col:BIGINT: undeclared cast column BIGINT -> DOUBLE (in_division=true)`. Killed, as predicted.
   - M16: rc 101. `thread 'skipping_the_uniqueness_check_is_recorded_rather_than_hidden' (55144) panicked at engine\tests\identity.rs:320:5:` / `unverified width must not read as exact`. As predicted.
   - M17: rc 101. `thread 'skipping_the_uniqueness_check_is_recorded_rather_than_hidden' (65348) panicked at engine\tests\identity.rs:324:5:` / `assertion failed: !md.contains_key("id_verified_rows")`. As predicted.
   - M26: rc 101. `thread 'a_batch_reports_the_bounds_of_the_rows_it_actually_carries' (5896) panicked at engine\tests\publish_stream.rs:535:9:` / `assertion `left == right` failed: bound 3`, with `left: 18442240474082181120` (0xfff0000000000000, the bits of NEG_INFINITY, as N3 predicts). As predicted.
   - After each: `git checkout -- <file>` rc 0, and `status --porcelain --untracked-files=no` 0 bytes.

5. **The suite.**
   - `cargo fmt --all -- --check`: rc 0, 0 bytes. I first ran it once outside a hold and without CARGO_TARGET_DIR (rc 0, 0 bytes). That broke the brief's every-cargo-call rule, so I re-ran it inside a shared hold with the target set (rc 0, 0 bytes).
   - `timeout 3600 cargo test --workspace --locked`, in one shared hold: rc 0. 118 `test result:` lines, all ok: 1027 passed, 0 failed, 66 ignored. There are 0 FAILED or panicked lines.
   - `test stream::tests::float32_costs_four_bytes_in_the_estimate ... ok` (out line 247) and `test a_forced_overflow_signals_coverage_lost ... ok` (out line 819).

6. **cfg-boundary.**
   - `node scripts/plan/cfg-boundary.mjs`: rc 0. Last line `cfg-boundary: 18 sites in 6 files, 0 outside every boundary`, equal to the last line of `c12a-cfg-base.txt`.
   - engine/src/watch.rs is at 3 sites: :84, :88 and :101 (base: :88, :92 and :105).
   - `node --test scripts/plan/cfg-boundary.test.mjs`: rc 0, tests 7, pass 7, fail 0.

7. **L7.** Read with `gh api --allow-escape-sequences .../jobs/<job>/logs`, rc 0 both, colour codes stripped by `c12a-g1r-l7.mjs`.
   - Head job 128720004328:
     - checkout `2026-11-08T11:41:34.8511969Z 1b71dd6c2a966dab864337fed33d58883be226ed` (after `git log -1 --format=%H`);
     - build step `##[group]Run cargo build --workspace --tests --locked` at log lines 365-404. Its only warnings are `warning: field `peak_working_set` is never read` (×2) and the two `spatial-kernel` summaries;
     - 0 lines in the whole log name `WATCH_BUFFER_BYTES`, and no line names watch.rs.
   - Main job 128687330874 (run 42466559424, headSha 6a95b13a75408854ae6bcb88825ae01d5dad147a):
     - checkout `6a95b13a75408854ae6bcb88825ae01d5dad147a`;
     - build step: `warning: constant `WATCH_BUFFER_BYTES` is never used`, `  --> engine/src/watch.rs:73:18`, and `warning: `spatial-engine` (lib) generated 1 warning`.

8. **Governance checks, from the worktree root.**
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, in a shared hold: rc 0, tests 598, pass 598, fail 0.
   - verify-cites: rc 0, `verify:cites PASS — every rooted (in-tree) path:line reference across 2762 file(s) resolves. (176 loose reference(s) advised above.)`
   - verify-quotes, in a shared hold: rc 0, `verify:quotes PASS — 151 checked, 120 verified, 30 baselined, 1 advisory, …`
   - verify-test-claims: rc 0, PASS, 764 claims.
   - `verify.mjs --offline`: rc 0, PASS.
   - forms-layout: rc 0, PASS, 209 files.

9. **Bytes.** Added lines: 0 with CR, 0 with a tab, 1 with non-ASCII (D4, the moved `§`). All eight files end with LF at the head and hold no CR byte.

10. **CI.** `gh pr checks 300`, rc 0: all 18 checks pass. `gh run view` (rc 0 each) gives every one of the 12 runs the packet lists with headSha 1b71dd6c2a966dab864337fed33d58883be226ed and conclusion success.

11. **Porcelain afterwards:** `git -C C:/dev/wt/c12a status --porcelain --untracked-files=no` is 0 bytes, and HEAD is 1b71dd6c.

## For the human
None of mine. OPEN-C's red line is not reached: by check 3, every row outside 12a is in a file the 12b row names. That supports the custodian's withdrawal of its earlier item.

## The packet's gaps
- The brief asks for scripts written with the Write tool, which this agent does not have. I wrote them by quoted heredoc. The Bash tool refused `1 << 28` inside a heredoc and collapsed a `\\` in a regex, so I worked around both: `String.fromCharCode(92)`, and a plain number.
- The packet gives the M16 and M17 sites only by the form's e13fa13b pins. I found the blocks at the head by content: envelope.rs :214-216 and :221-223, unchanged.
- The brief's wait rule meets the harness's 180 s foreground limit: three of my capped wait loops went to the background and ended on their own caps.
- No fact needed for a finding was missing.

## Hold lines
All are SpatialIDE's own, with `also=` elided. For the mutation and suite holds I printed the PID as `<pid>` when reading the output.
- clippy JSON: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:52840` … `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:52840 affinity=FF (cores 0-7)`
- M12, M16, M17, M26: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>` … `MACHINE_RELEASED …`, once each, rc 101 each.
- fmt: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:59348` … `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:59348 affinity=FF (cores 0-7)`
- workspace test: `MACHINE_HOLD shared … shell=bash.exe:<pid>` … `MACHINE_RELEASED …`, rc 0.
- node --test: `MACHINE_HOLD shared … shell=bash.exe:62120` … `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:62120 …`
- verify-quotes: `MACHINE_HOLD shared … shell=bash.exe:80948` … `MACHINE_RELEASED …`, rc 0.
- No refusal; no exit code from 96 to 99.

## Background shells
- All of mine completed: the clippy run, M12, M16, M17, M26, the suite, verify-quotes, and three capped wait loops.
- No process runs from `D:\wt-targets\c12a` (Get-Process path filter, empty).
- None was killed.

Scratch files are all `c12a-g1r-*` in <S>/:
- the scripts: `c12a-g1r-diffcheck.mjs`, `c12a-g1r-hunks.mjs`, `c12a-g1r-count.mjs`, `c12a-g1r-l7.mjs`, `c12a-g1r-mut.mjs`;
- the outputs: `c12a-g1r-head.json`, `c12a-g1r-count.out`, `c12a-g1r-m12.out`, `c12a-g1r-m16.out`, `c12a-g1r-m17.out`, `c12a-g1r-m26.out`, `c12a-g1r-test.out`, `c12a-g1r-l7-head.out`, `c12a-g1r-l7-main.out`.
