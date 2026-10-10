*Custodian's filing note (2026-10-10): `e2e-stale-expectations-reaim`'s worker report 2, the worker-high run 2026-10-10T11:18:14Z to 2026-10-10T14:14:58Z by its transcript, on `cut/e2e-stale-expectations-reaim`, head ef1cc519c913a2bbc5d28a86530c579fae0f3ed6, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 0e61ef68f01c4af0fcbf9db67dc6a31ecb78a9d1eb35c912db1c6c2942169bed. It stopped on I6-prime: a confound from the main merge the custodian's brief ordered, not a fixture.rs change.*

---

# Report: e2e-stale-expectations-reaim (slot 1), second build

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

**Headline. I stopped on I6′ (§5 and Amendment 2 item 10). It is a confound from the main merge, not a fixture.rs change.**
- Item 6 T2 shows 11 keys whose sha256 sets differ between b8ad22ff and H.
- All 11 are tests whose own source main changed after b8ad22ff, and the merge you ordered brought those changes in.
- I did not work around it. I ran no pre-merge T2 and did not change the comparison. T2's src-tauri half at H and M13 are not run.
- Items 2, 3 and 8 are done and published. Item 6 is partial. Details are in "Item 6".

## Commits
- 71702f90: the signed-off merge of origin/main (f0fccfaf) into the branch. No conflicts.
- 52228d5b: fix: console GROUP' asserts the grouping rule inside its window, with the ruled not-exercised name (Amendment 2 item 2). Only `console.mjs`.
- ef1cc519: docs: the e2e README's GROUP' description follows Amendment 2 item 2.
- **Published.** HEAD is ef1cc519c913a2bbc5d28a86530c579fae0f3ed6, equal to origin/cut/e2e-stale-expectations-reaim. `git status --porcelain` is empty. No force, no rebase, no pull request.
- The merge is the only way main's files entered the branch. Nothing tracked was added to the piece.

## §7 counts (`git diff --numstat origin/main...HEAD`; `b8ad22ff...HEAD` gives the same per-file figures)
| File | Count | Ceiling |
|---|---|---|
| `console.mjs` | **235** (174+61) | 220, with item 8's 290 |
| `admission-remediation.mjs` | 146 (100+46) | 220 |
| `source-changed.mjs` | 142 (134+8) | 170 |
| `regression.mjs` | 74 (60+14) | 120 |
| `manual_walkthrough_fixtures.rs` | 80 (58+22) | 90 |
| `fixture.rs` | 23 (20+3) | 40 |
| code and tests total | 700 | 860 |
| `README.md` | 36 (28+8) | 40 |
| `MANUAL-WALKTHROUGH.md` | 32 | 60 |
| `KNOWN-LIMITATIONS.md` | 2 | 2 |

- Files: 9.
- **Item 8:** `console.mjs` is 235, which is at most 290. It is above 220, so it is a **class-8 row for the custodian**: `budget overrun, §7 not edited`; 220, 235, reason item 8. I edited no §7 line and trimmed nothing.

## GROUP′ (item 2)
- The code follows item 2: the DOM-read items, the window, `GROUP_CALLS = 3`, and the steps in the order poll/presence, capacity, `group`, `split run`, step 6 (c), `parse`. It reports the step-7 figures on a pass.
- Step 6 (c)'s name is in the source as `GROUP': grouping not exercised`.
  - A script took it from line 6 of the round-71 directive, using the regex `fails by name as "([^"]+)"`, and substituted it for a placeholder.
  - Line 6's sha256 recomputed to 0f013aece65a21799561fa99a90381306d2ac23b93f606a604add1a4382e79fe, which equals A2.R1.
  - I did not type the name.
- Offline sanity check:
  - A stubbed-page harness in my scratch folder ran the real step source on synthetic item lists. It is not committed.
  - Results: a lone ×3 group passes. The shape [×2 vq, ×2 log lines, vq] passes, so a log line between rows ends the run and passes.
  - Adjacent singles fail as `split run`. Singles separated by log lines fail as `grouping not exercised`. A wrong header fails as `group`.
- Other edits: the header comment, and the README's GROUP′ paragraph.

## Console runs (all shared holds; not P1 claims)
- The exe was rebuilt at the merged head, because main changed `kernel/src/skp.rs`. It is `D:/wt-targets/k6/exes/spatial-ide-shell-reaim-h.exe`. The build was 6m20s, rc 0, in a hold.
- Each run: a fresh app by `run-suite.sh`, stopped by `app-down`. Port 9223 and port 5400 were free after each run.
- **c0, unmutated, at ef1cc519, rc 0.**
  - HEADER′, ECHO′, TWOCMD′, HEXLIM′ (5115 ms), REFUSAL′ (299 ms), CLASSB′, CLASSC′, COPYTRUNC′, UNCLASS′ and REGRESS′ (regression and admission both exit 0): PASS.
  - GROUP′ (1882 ms), PASS. Verbatim: `3 identical queryWithFilter calls -> window items (key, rows inside): ["×3 a:viewport_query x3"]; 1 group(s) show 2+ rows inside the window; 1 distinct text(s) among the 3 residential rows; R=9 <= 256`.
  - **Unobserved:** this window held one item. The multi-item (split) path did not occur live in my run.
- Mutation runs: see the next section. In each, every step other than GROUP′ passed, REGRESS′ included.

## Mutations (each applied alone to a clean ef1cc519 with a single exact-string edit, a shared console run, then `git checkout -- console.mjs` and a clean check)
No `verify-mutation` run is called an observation.
| # | Edit | Failure observed (byte-copied from the run log) | Clean check |
|---|---|---|---|
| M9 | the third call's predicate becomes `zone = 'commercial'` | `GROUP': presence: expected 3 residential untiled rows and no collapsed group in their window within 5000ms (polled every 100ms), found 2, held by items ["242:×3","242:×3"]; keys from the first found row to the last: ["a:viewport_query","a:viewport_query"]; console label total 297 (baseline 287, R=10)` | status `''`, diff empty |
| M9c | `MAX_CONSOLE_ENTRIES` 256 → 2 | `GROUP': capacity: 9 entries were recorded since the baseline (label total 296 - 287), more than the ring's 2` | same |
| M9n | `GROUP_CALLS` 3 → 1 | `GROUP': grouping not exercised: no group in the window shows two or more rows inside it; window items: ["single a:viewport_query x1"]` | same |
| M9g | step 6 (a) checks `×${N + 1}` | `GROUP': group: a group in the window reads "×3" for 3 row(s) of keys ["a:viewport_query"]; expected "×3", N >= 2, one key` (the message text is unmutated; the check is the mutated part) | same |
| M9s | the item read returns every group's rows as singles | `GROUP': split run: two adjacent items in the window share the key "a:viewport_query"; a run of consecutive identical entries forms one item` | same |

- All five were applied at **ef1cc519c913a2bbc5d28a86530c579fae0f3ed6**.
- None was committed or pushed. Each predicted name appeared.
- **M13 was not run** (see Item 6).

## Item 5 against `git diff b8ad22ff...H -- engine/src/fixture.rs`
- `fixture.rs` is unchanged since cf2434e6. `git diff --quiet cf2434e6 HEAD -- engine/src/fixture.rs kernel/tests/manual_walkthrough_fixtures.rs` exits 0.
- The diff has these hunks:
  - Doc-only: the `ForeignKeyColumn` text.
  - The declaration: `StringIdsBesideParcelKey` at line 548.
  - B1: the `schema` match, with the `StringIds | …` arm at 627.
  - B2: `if identity == …` at 634.
  - B3: the `generate` per-row arm at 1101-1104.
  - B4: the first-column arm at 1169.
  - B5: `if spec.identity == …` at 1174.
- The listed no-branch lines stand: the field at 465, the default at 563, the call at 937. No other `fixture.rs` line branches on the mode. The `write_hostile_*` writers do not read it. The list matches the diff.

## Item 6
Every heavy command was in a shared hold. None returned 96 to 99.

**The T4 list**, written before any item 6 run. It is saved in my scratch folder as `out/t4-list.txt`.
- No file of 1 GiB or more exists under the main checkout's `target/fixtures`. The largest are `slow-filter-scan.parquet` (766,186,557 B, T1) and `skp-filter-cancel-late-match.parquet` (385,097,191 B, a default test, T2).
- Item 12.2's reduced commands and sizes therefore have nothing to apply to. No file is "not hashed" for being large.
- The T4 entries:
  - `slice-budgets/polygons-100k.parquet` (151,812,642 B).
    - Producing command: the ignored `cargo test --release -p spatial-kernel --test slice_budgets -- --ignored --nocapture`.
    - That is a release-only measurement run that also writes an evidence artifact. I ran the same `FixtureSpec` through `make-fixture` instead: `cargo run -p spatial-engine --features fixture --example make-fixture --locked -- --out … --features 100000 --vertices 100 --holes-every 7`. This is a deviation from the form.
    - The output is 151,812,642 B, equal to the main file's size, at both commits.
  - `admission-remediation/bothneeded-temp.parquet` (4,711 B): **not covered**. No producer exists in the tree.
  - `first-batch/lever-b2-seam.parquet` (2,208,153 B): **not covered**, same reason.
  - `skp-admission-late-match-cancel.parquet` (39,656,337 B): **not covered**, same reason.
- Not T4, because `fixture.rs` did not write them: `100k-scratch-partN.parquet` (a hand copy), the two bundle directories, and `axistrap-paste.json`.
- After the base T1, T2 and T4 runs, I compared the main checkout's listing (names and sizes) with the base worktree's.
  - The only main names the runs did not reproduce were those three stale files, the non-`fixture.rs` files just named, and the four new fixture names (H only).
  - One size differed: `skp-admission-no-crs-actual.parquet`, 42721 in main against 43137 at the base. That is main's older on-disk copy. The base-against-H result for the key is below.

**T1** (`cargo test -p spatial-kernel --test manual_walkthrough_fixtures --locked -- --ignored --nocapture`, then `sha256sum`).
- Base: 19 passed. H: 21 passed.
- **Pass, 0 failures.**
  - All 19 base files have an H file with an equal sha256 under the rename map.
  - H adds `string-id-refused.parquet` (4b86c87ae3f6f236e06cdbb30b7c28176efe79f49ba151f19b7822f3aa7b1d46) and `no-crs-string-id-refused.parquet` (03bca99b42629df18684fc5444b891512070b7f55ff445e4d6f5368684c5a39f).
- Hash examples:
  - `no-id-column` equals `missing-identity-refused`: b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424.
  - `no-crs-no-id-refused` equals `bothneeded-refused`: 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8.
  - `slow-filter-scan`: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5.
- The 19 equal lines are in `out/h-t1.sha` and `out/base-t1.sha`; `t1cmp.mjs` prints each.

**T4: equal.** One key, `make-fixture | main`, with sha256 9ecd79242ac7d99e09f1989c8c124fd53dcd697689546ec6013949f806ca6043 at both commits.

**T2, workspace: I6′ FIRED.**
- Command: `cargo test --workspace --locked --no-fail-fast`. I added `--no-fail-fast` to CI's command so no binary is skipped.
- Base: 927 passed, 0 failed, 55 ignored. H: 927 passed, 0 failed, 57 ignored.
- The hash logs have 359 keys and 465 lines at each commit. The key sets are equal. 348 keys have equal multisets.
- **11 keys differ.** Failure name per the form: `fixture byte-identity: T2: <key>`.
  - `session_identity | a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded`
  - `session_identity | a_clean_stream_whose_source_changed_terminates_as_source_changed`
  - Nine `spatial_kernel | skp::ticket_drop_under_lock_regression::…` tests:
    - `a_pending_drop_inside_close_emits_once_with_its_session_reference`
    - `a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang`
    - `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`
    - `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`
    - `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard`
    - `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`
    - `cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`
    - `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`
    - `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang`
- **Cause, from `git diff b8ad22ff origin/main`; I ran nothing extra.**
  - Main commits ff7852fa, 7469a801 and be7eecb3 changed the fixtures those tests write.
    - `engine/tests/session_identity.rs` now passes `features: 5_000` and `features: 20_000` to `FixtureSpec`.
    - `kernel/src/skp.rs` now routes the nine tests to `drained_stream_fixture`, which uses 5,000 features instead of 50.
  - `fixture.rs` is not involved; the comparison precondition holds (rc 0, above).
  - My merge of origin/main put those changes into H. Comparing b8ad22ff against a merged H is confounded by main's own drift.
- **Not done, because I stopped:**
  - T2's src-tauri half at H. At the base it ran: 68 passed, 0 failed, rc 0, after the viewer and shell `npm ci` and `npm run build`.
  - M13.
- Options for you or the human:
  - Compare against a base that has the same main changes (for example f0fccfaf).
  - Or run T2 at cf2434e6, which has no main changes.
  - Or rule that these 11 are accepted.
- The H worktree still has `node_modules` and `target/fixtures` from my runs. They are ignored files.

**T3 (read only), before the first run and after the last.**
- 21 manifest entries (17 files plus 4 retired) and the 5 `DERIVATIONS.json` mutations all MATCH, with 0 mismatches.
- `MANIFEST.json` sha256 is 4b1fbca6c565ad4fd1c59d6d8f79927d20ed170611d448dbc8f39c13224af6b3, equal to A2.R27.
- All 34 files under the corpus are byte-identical before and after. `admission_p4_corpus` was not run.

**The hash-log patch.**
- It is one scratch file in my scratch folder. It has five hunks, all in `engine/src/fixture.rs`: the `Ok(facts)` arm of `write_geoparquet_cancellable`, the ends of `write_hostile_names`, `write_hostile_geometry_name` and `write_hostile_covering`, and a helper.
- Its sha256 is 21842089695a2e00e54492a8cea58c232a4e3412bb0cd6576b6c6099ce12a40f.
- The permission system did not refuse it. I did not run M13, so there was nothing to refuse there. I7′ did not fire.
- **Base worktree:**
  - The patch was applied with `git apply`.
  - After its runs I reverted it with `git apply -R`. `git status --porcelain` was empty, `git diff` was empty, and HEAD was b8ad22ff.
  - I then removed the worktree with `git worktree remove`.
  - **This was earlier than the form says.** I did it to keep C: above the floor. C: stayed at 37 GiB free or more throughout, and was 37.63 GiB at the end. I deleted no worktree file by hand.
- **H worktree:** I reverted the patch with `git apply -R`. `git status --porcelain` was empty and `git diff` was empty (0 bytes). HEAD was ef1cc519.
- The patch was never committed, pushed or applied anywhere else. Nothing was written to the main checkout's `target/fixtures`.

## Heavy commands (exit code, hold)
All holds were shared; all rc 0 unless stated.
1. Shell exe `cargo build`, 6m20s.
2. Console c0.
3. Console M9: rc 1, expected.
4. Console M9c: rc 1, expected.
5. Console M9n: rc 1, expected.
6. Console M9g: rc 1, expected.
7. Console M9s: rc 1, expected.
8. Base T1.
9. Base T4.
10. Base T2.
11. Base npm.
12. Base src-tauri test.
13. H T1.
14. H T4.
15. H T2.

- Not run: H src-tauri, M13, item 7's solo runs (yours).
- Light and unheld: the T3 hashing, comparison scripts, offline harness, `git` and `node --check`.

## §8 items 1 to 18
1. No product path was edited. The hash-log patch is on a product path but was temporary and reverted. `fixture.rs` is unchanged since cf2434e6.
2. No arm set or pinned.
3. No fixed sleep or frame count as a wait.
4. GROUP′ does not count headers.
5. No result log or dated README record edited. I changed the README's GROUP′ description only.
6. No recursive delete, no junction touched, no other link type, no elevation, no `mklink`.
   - `rm -f …/manual-walkthrough/*.parquet` is non-recursive, as the form says.
   - `git worktree remove` removed the base worktree, which held no junction.
7. Not applicable; I ran no source-changed suite.
8. The KNOWN-LIMITATIONS text was not touched by me.
9. No mutation was committed, pushed or left in place.
10. No refusal-message constant was written by hand.
11. No shared-run failure was recorded as a failure. The five mutation failures were predicted and named. GROUP′ passed in c0, and no timing failure appeared.
12. **I6′ was reached and not worked around.** I stopped.
13. No new dependency.
14. The patch was never committed, pushed or left in place, and was applied only in the two worktrees. M13 was never applied.
15. I ran no solo GROUP′ run.
16. Step 6 (c) is present in full, with its name script-copied (see GROUP′).
17. Nothing was written under the corpus, and `admission_p4_corpus` was not run.
18. The first GROUP′ code, 52228d5b, comes after the merge 71702f90, which carries f0fccfaf with the amendment.

## Differences from the form, and flags for you
1. **The main merge confounds T2** (above). It also affects item 7: `git diff --name-only cf2434e6 H` now lists 67 files, including `kernel/src/skp.rs` and `engine/tests/session_identity.rs`. Per item 7 that means window 2's passes do not stand for regression, admission and source-changed. Each of the three must run alone once more at H.
2. T2 runs used `--no-fail-fast`.
3. The `polygons-100k` producer was replaced by the equivalent `make-fixture` command (T4 above).
4. The base worktree was removed before the form's "when item 6 is done".
5. The exe used for my console runs is rebuilt at H. Your solo-run script pins cf2434e6 and the old exe name; update both.
6. I did not run the src-tauri tests at H, nor M13, because I stopped.

## Final state
- Branch `cut/e2e-stale-expectations-reaim`, HEAD ef1cc519c913a2bbc5d28a86530c579fae0f3ed6, published.
- `git status --porcelain` is empty; `C:/dev/wt/reaim-base` is gone.
- All logs, hash logs, scripts, the patch and the T4 list are in my scratch folder, under `out/` (`base-*`, `h-*`, `c0-console.log`, `m9*-console.log`, `t3-*`, `t4-list.txt`).
