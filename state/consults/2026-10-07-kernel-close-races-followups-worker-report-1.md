*Custodian's filing note (2026-10-07): `kernel-close-races-followups`'s worker report 1, the build (C1 to C10 and W-1), by the worker (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 653ef58f6fd4cba601dd14063d0b5f1208f5a6241d77caff6a2953321b73884a. Write audit PASS: 3 Writes in the session's scratch folder, its edits made by shell in the worktree `C:/dev/wt/kcrf`, and no write in the main checkout or under the user's Claude folder. Its four stray log files (one beside its target folder, three in the shell's temporary folder) were removed by the custodian. Tool calls Read 1, Bash 63, Write 3, Monitor 1, SubagentHandback 1. Run window from the transcript: 2026-10-07T01:10:48.139Z to 01:58:41.703Z. The custodian checked: origin's branch head is 2d75b57b, the worktree is clean, and the numstat is 106 lines over 6 files.*

---

node:kernel-close-races-followups@g2 build report

**Commit:** 2d75b57b "docs: kernel-close-races-followups C1-C10 (comment and record text only; W-1 re-observed at 99f4c437)". One commit on cut/kernel-close-races-followups, pushed as an ordinary update (99f4c437..2d75b57b). `git status --porcelain` is empty.

**Sites edited.** The old/new text is in `git diff 99f4c437 2d75b57b`, in the files below.
- **C1** `kernel/src/skp.rs`, open_dataset's `Admitted` arm. It now says the arm is reached only after this call's admission minted the generation, under the latch and before it is set to `Admitted`, and that the generation carries the `SessionRef` returned on `OpenDatasetResponse.session`. It names `ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists` by test name. The lock-order sentence stays. It drops the bare "Amendment 1" and the "no client holds" clause.
- **C2** `SkpHost::generations` doc. The `:689` line is dropped; it now says `SkpHost::new` by name and "in `SkpHost::new`". The caller is named as the `serve(DataPlaneConfig { .. })` call in the shell `lib.rs`'s `run` setup, with no line.
- **C3** The two `SKP-V0.md :266` cites now point to §5's `code` rule, by section.
- **C4** `TicketLiveness` doc. Quotation marks removed. The text is attributed to the ADMISSION form at its kept `engine/ADMISSION-PREREGISTRATION.md:742-744` token, and the ruling is cited as question round 4, item 1.
- **C5** `terminal_detail_of` doc. `next_into` no longer reads as the only site. A new sentence lists `EngineSource::next_into` (mid-stream), `create_from_raw_params`, and the two dead-ticket arms of `liveness_refusal`, and says this function stays the one place the prefix is built.
- **C6** `kernel/tests/session_generation.rs`. Every row of the table is repointed by item with no line. The T1 message now names `isSessionEndedTerminal` (class 3, test-text claim correction; the condition is unchanged). The `:429` ADMISSION token was not in C6 and stays.
- **C7** `kernel/tests/wire_bytes_invariant.rs`. The self-line `…:350` is replaced by "Re-observed at 99f4c437e81ad3286a9f388ea466e3f76d322556: mutation applied, this test run alone by name, failure recorded, mutation reverted."
- **C8** `formatTerminalRefusal.ts` doc. `terminal_detail_of` builds the prefix, applied "wherever the kernel turns an engine refusal into a terminal's detail, mid-stream and at create time". No site list, no count.
- **C9** `protocol/skp/SKP-V0.md`. §1's `close_dataset` second sentence is replaced by: "A ticket's registry entry holds the dataset by name, and a live stream holds no `Arc<Dataset>`; a pool lease in flight keeps the pool alive until it is released." One dated note (2026-10-07) sits at the end of §8, before `## 9.`. It carries (i) the three product functions at commit 99f4c437e81ad3286a9f388ea466e3f76d322556, (ii) the in-place correction and why, and (iii) no literal change and an empty `protocol/data-plane/` diff.
- **C10** `liveTicketSet.ts`. The single-site claim is reworded as in C8. The skp.rs cites at `:1237-1250`, `:1289-1313` (the removed mint-race arm) and `:1638` are repointed by item (`SkpHost::viewport_query`, `terminal_detail_of`).

**W-1.**
- **Mutation:** in `engine/src/envelope.rs::BatchEnvelope::build`, the `attribute_columns` `md.insert(..)` was gated behind `if crate::trace::is_enabled() { .. }`.
- **Run:** applied on the unmodified base, HEAD 99f4c437e81ad3286a9f388ea466e3f76d322556. The test was run alone by name: `cargo test --locked --features spatial-engine/fixture -p spatial-kernel --test wire_bytes_invariant wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`.
- **Result:** the test FAILED.
- **Assertion:** "frame 1 (tag 16) differs between the traced and untraced projected runs — the projected schema metadata (`attribute_columns`) must ride the wire identically either way".
- **Reverted** with `git checkout engine/src/envelope.rs`. The envelope.rs mutation was never in the commit.
- No `verify-mutation` run was used.

**Checks, with exit codes:**
- `cargo test --workspace --locked --features spatial-engine/fixture`: rc 0. 869 passed, 0 failed, 43 ignored, summed over 96 "test result" lines.
- `cargo fmt --all --check`: rc 0.
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: rc 0 (Finished). Its existing warnings are in other files; none points into `skp.rs`, `session_generation.rs` or `wire_bytes_invariant.rs`. The only non-comment line changed in any `.rs` file is the T1 message.
- `npx tsc --noEmit` in `frontends/shell`: rc 0.
- `npm test` in `frontends/shell`: rc 0. 73 files and 1113 tests passed. `renderer/bundle-viewer` needed `npm ci` first (prebuild reads it), and so did the shell.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: rc 0. 446 pass, 0 fail.
- `verify.mjs`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS. Its 34 loose advisories are in files I did not edit.
- `verify-quotes.mjs`: rc 0, PASS.
- `verify-test-claims.mjs`: rc 0, PASS.
- Protocol paths: `git diff --stat origin/main...HEAD -- protocol/skp/src protocol/skp/tests protocol/data-plane kernel/README.md` is empty.

**§7 count** (`git diff --numstat $(git merge-base origin/main HEAD) HEAD`, at 2d75b57b), insertions/deletions, then total against the ceiling:
- `skp.rs` 25/18 = 43 (ceiling 60)
- `session_generation.rs` 14/14 = 28 (40)
- `wire_bytes_invariant.rs` 2/1 = 3 (12)
- `formatTerminalRefusal.ts` 3/2 = 5 (10)
- `liveTicketSet.ts` 6/6 = 12 (16)
- `SKP-V0.md` 13/2 = 15 (24)
- `kernel/README.md` 0
- Total 106 over 6 files, against ≤ 168 over 7.

**P3 and P4 at the base.**
- P3 holds. The product callers of `terminal_detail_of` are exactly `next_into` (`lib.rs:684`), `create_from_raw_params` (`:432`) and `liveness_refusal` (`:513`, `:526`).
- P4 holds. The `Arc<Dataset>` grep finds no stream-held clone.

**Deviations from the form:** none that change a ceiling or a binding item. One placement difference for you to judge: the base tree has the `skp/0.9` entry inside §8 after the 2026-10-05 note, so "the end of §8" put the new note after it, directly before `## 9.`. I classify this as the template §0 re-derivation at the base, not an amendment class.

**Heavy commands:** every one ran under a shared hold in the prescribed shape (cd, hold, one command, release): W-1 (cold build, 15m49s), cargo test, clippy, both `npm ci` runs, `npm test`, and `node --test`. No hold was refused. One early hold call was a mistake: I ran the hold alone without a command, which released with the shell. Nothing ran under it.

**Noticed, not done:**
- `liveTicketSet.ts` still carries `skp/client.ts:58-65`, `engine/ADMISSION-PREREGISTRATION.md:221` and `tileViewportStreamManager.ts:316/:324` line tokens. They are outside C10's wording and the skp.rs-cite scope, so they are left.
- `kernel/README.md` is untouched, as ordered.
- I wrote two log files outside the allowed paths: `D:/wt-targets/kcrf-w1.log` (a sibling of the target dir) and `/tmp/kcrf-verify-*.out`. They are build logs only.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced.
