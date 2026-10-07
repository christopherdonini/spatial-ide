# PR #186 gate 1 — reviewer
Reviewed: cut/kernel-close-races-followups @ 78e52eea6460f9eb0dcffa3af3cb37a25b1f85ca

Base 99f4c437e81ad3286a9f388ea466e3f76d322556 (the merge base with origin/main at review time). Governing form: `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, with Amendment 1. Gated under the proportional rule (`AUTONOMY.md` §22 as amended by #180; the product-first direction, section 2).

## Verdict

**PASS.** Correctness: no finding. Evidence: no finding. Documentation: two findings, D1 and D2, each must-fix in this pull request before the merge; neither causes a correction round or a re-gate.

## Correctness — no finding

- **Every hunk** (`git diff -U0 99f4c437 78e52eea` over `*.rs` and `*.ts`, every changed line that is not `//`, `///`, `*` or `/**`): one pair only, the C6 T1 assertion message, `isSourceChangedTerminal` to `isSessionEndedTerminal`. The condition is unchanged, and the new name is the shell's exported `isSessionEndedTerminal` in `frontends/shell/src/streaming/liveTicketSet.ts` at the base. Every other hunk is a comment, SKP-V0 text or README text (§8 items 1 and 3).
- **Protocol paths:** `git diff --stat origin/main...HEAD -- protocol/skp/src protocol/skp/tests protocol/data-plane` is empty (§8 item 4). The diff's seven paths are §7's six plus `liveTicketSet.ts` (Amendment 1, item 1).
- **Caller rule (§8 item 2):** no `pub`, `pub(crate)`, option, callback or code path added; the count of `pub fn`/`pub struct`/`pub(crate)` lines in `kernel/src/skp.rs` is 38 at both commits.
- **C1 at the base:** the sink's `Admitted` arm is reachable only after this call's admission minted the generation under the latch and set `Admitted` (both admission arms of `SkpHost::open_dataset`: `SessionRef::mint`, `mint_for_open`, then `*guard = LatchState::Admitted`), and the same `session` is returned on `OpenDatasetResponse.session`. The named test exists in `ticket_drop_under_lock_regression`. No text about an unheld reference beyond that test name, which the form permits (§8 item 6).
- **C2 at the base:** `SkpHost::generations` has one product caller, the `serve(DataPlaneConfig { .. })` call inside `run`'s `.setup` closure in `frontends/shell/src-tauri/src/lib.rs`; every other caller is a test in `kernel/src/skp.rs`.
- **C5 and P3 at the base:** the product callers of `terminal_detail_of` are exactly `EngineSourceFactory::create_from_raw_params`, `EngineSourceFactory::liveness_refusal` (its `EndedBySourceChange` and `EndedByCoverageLoss` arms) and `EngineSource::next_into`, all in `kernel/src/lib.rs`. P3 holds.
- **P4 at the base:** the form's grep at 99f4c437 finds the catalog map, `Catalog::get` and `remove`, the return of `viewport_query_resolve`, publish-job parameters in `publish.rs`, a `pool_poll.rs` comment and SKP-V0's old sentence; no stream or ticket-registry entry holds one. P4 holds; the falsifier does not fire.
- **C9:** the in-place sentence states the catalog form's reading and nothing beyond it (§8 item 10); note (i) is accurate at the base (the `skp/0.3` bullet names `EngineSource::next_into`; three product functions call `terminal_detail_of`); the `skp/0.3` bullet and the `:266` token are not edited; no literal, key, value, code or command changes (§8 item 5).
- **§8 items 9, 14 and 15:** no single-site prefix claim remains in the seven files; no zero-copy, number or timing text; no `cfg`, ignore or path literal.

## Evidence — no finding

**W-1, re-made at the base** (worktree detached at 99f4c437, mutation applied, test run alone by name, reverted):

| Mutation | Run | Failing assertion | Reverted |
|---|---|---|---|
| `engine/src/envelope.rs`, `BatchEnvelope::build`: the `attribute_columns` `md.insert(..)` (`engine/src/envelope.rs:242-251 @ 99f4c437 sha256:fb992a0f1e3d7f0c6bb71c30ef0c324ea866a29e8818c4afaa71542b58437965`) wrapped in `if crate::trace::is_enabled() { .. }` | `cargo test --locked --features spatial-engine/fixture -p spatial-kernel --test wire_bytes_invariant wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`: rc 101, 0 passed, 1 failed, 1 filtered out | the per-frame byte comparison (`kernel/tests/wire_bytes_invariant.rs:427-431 @ 99f4c437 sha256:9eedfbe55ccc8314940e94b95cd608fd64ac0a224ad9cda8af0bb08a1ace308b`); the run's panic text is the message the branch comment carries, at frame 1, tag 16 | yes (`git checkout -- engine/src/envelope.rs`; porcelain empty; HEAD back at 78e52eea) |

P2 holds. This is an observation of the applied mutation; no `verify-mutation` run was used.

- **§7 count**, by its command at 78e52eea (`git diff --numstat $(git merge-base origin/main HEAD) HEAD`, merge base 99f4c437): `skp.rs` 25/18 = 43 (≤ 60), `session_generation.rs` 14/14 = 28 (≤ 40), `wire_bytes_invariant.rs` 2/1 = 3 (≤ 12), `formatTerminalRefusal.ts` 3/2 = 5 (≤ 10), `liveTicketSet.ts` 6/6 = 12 (≤ 16), `SKP-V0.md` 13/2 = 15 (≤ 24), `kernel/README.md` 3/3 = 6 (≤ 6). Total 112 over 7 files, against ≤ 168 over 7. No class 8.
- **Hashes recomputed:** all 58 `path:line @ rev sha256:` pins in the form match, each recomputed as sha256 over the cited whole lines at the named rev (git show, then sed, then sha256sum). Amendment 1's three ruling-line hashes match lines 6, 7 and 8 of `state/directives/2026-10-05-round-59-rulings.md` at ff6bdddc, the commit that adds it. The impact read's whole-file hash matches. Worker reports 1 and 2 match their filing notes' hashes (line 5 to the end).
- **Repointed cites, by item, at the base:** question round 4, item 1 (the RULED block of 2026-09-16 carries both the removed dead-ticket diagnosis and the class fix); `engine/ADMISSION-PREREGISTRATION.md:742-744` (unchanged since a1109023); SKP-V0 §5's `code` rule (§5 spans lines 318-336); `typed_terminal_codes.rs`'s `fixture` and `touch_modification_time`; the data plane's `factory.create` call in `protocol/data-plane/src/server.rs`; `SkpHost::viewport_query` with its `open_engine_stream` arm that ends the generation on `EngineError::SourceChanged` (in `viewport_query_mint`); `StreamRegistry::redeem`; `GenerationRegistry::prune_locked` and its doc's condition 1. All resolve. The two line tokens left on added lines (`engine/ADMISSION-PREREGISTRATION.md:742-744` in C4, `skp/client.ts:58-65` in `liveTicketSet.ts`) are carried, not new, and both resolve at the base (§8 item 7).
- **Index lines:** lines 350, 374 and 376 of `kernel/README.md` at 78e52eea are byte-identical to lead-data's replacement lines (lines 19, 35 and 51 of `state/consults/2026-10-07-kernel-close-races-followups-index-update.md`), and the base lines to its Current lines (its lines 13, 29 and 45). No other README line changes. The index is lines 346-383 (38 lines, cap 60). 20 `kernel/*-PREREGISTRATION.md` files exist. `Last verified at` names 2d75b57b, lead-data's checked commit; 78e52eea changes no pointer target.
- **UTF-8:** `iconv -f UTF-8 -t UTF-8` rc 0 on each of the seven files; `file` reports no CRLF.
- **Suites:** all green at 78e52eea (table below). P1: 869 passed, 0 failed, 43 ignored over 96 result lines, equal to worker report 1's numbers; this gate did not run the base suite, and the diff changes no test name or condition.

## Documentation — must-fix before the merge

- **D1. `liveTicketSet.ts` drops the mint-race arm instead of repointing it.** Line 71 of `frontends/shell/src/streaming/liveTicketSet.ts` at 78e52eea names only the live-generation check of `SkpHost::viewport_query` as the source of the synchronous refusal. The base text named that check and its mint-race arm (`frontends/shell/src/streaming/liveTicketSet.ts:71-72 @ 99f4c437 sha256:8ca46f797ddc1e3d23d3174d3962319f0961367270389922d5725ca74cff6f3d`). That arm still exists at the base as the refusal in `SkpHost::viewport_query_attribute` when `attribute_ticket` returns false, and it refuses `engine.source_changed` or `engine.source_coverage_lost` synchronously (`kernel/src/skp.rs:1491-1505 @ 99f4c437 sha256:6a1a0ac3192ff591a9adc299b0a84b4ac126eccc5daae3c80a0a6627bdcf095d`); it is also present at a1109023. The form's §0 bullet that calls it removed rests on a wrong premise: close-races replaced the mint inside the live check (`live_or_mint` became `live_generation`) and changed this arm's fallback, but kept the arm. Fix: repoint it by item (`SkpHost::viewport_query_attribute`, its arm when `attribute_ticket` returns false), within the 4 lines left on the file's 16. The form is append-only and is not edited.
- **D2. SKP-V0's new note, item (ii), names the wrong source.** Line 1024 of `protocol/skp/SKP-V0.md` at 78e52eea says the corrected sentence states what the catalog's `remove` documents. The doc of `Catalog::remove` (`kernel/src/lib.rs:224-230 @ 99f4c437 sha256:903958bb27fc7792aac39cab4311884e408c8a8737167a08a9b064a713824639`) covers the live-stream and pool-lease clauses only. The first clause, that a ticket's registry entry holds the dataset by name, is a fact of `TicketState` (`kernel/src/skp.rs:124-127 @ 99f4c437 sha256:1b9a0a5a4e208b355b2551ff2e683b2d9ed2f7e7de113d08adf104017c081a2e`), and the catalog form's intake row attributes it there (`kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:29 @ a1109023 sha256:da692aff50432dc1c4a533d18057f91fb4f2c43f96d341cb757e1789f014a0a2`). Fix: name both sources, or name the catalog form's reading, within the 9 lines left on the file's 24. The note is new in this pull request, so the edit comes before the merge and does not break append-only.

## Notes, no action

- The new SKP-V0 note sits after the `skp/0.9` entry, under its heading, directly before §9. The 2026-10-02 and 2026-10-05 notes sit the same way under `skp/0.8`, at the end of §8 at their time. Worker report 1 discloses the placement.
- Worker report 2 did not re-run numstat after its commit; this gate's count is above.

## Commands

| Command | Commit | rc | Hold |
|---|---|---|---|
| `git fetch origin`; `git diff 99f4c437...78e52eea`; the non-comment-line scan; the protocol-path stat | 78e52eea | 0 | no |
| hash recomputation (58 form pins, 3 ruling lines, the impact read, 2 worker reports, the spans in W-1, D1 and D2) | as named | 0 | no |
| P3: `git grep -n terminal_detail_of 99f4c437`; P4: the form's `Arc<Dataset>` grep at 99f4c437 | 99f4c437 | 0 | no |
| W-1: `cargo test --locked --features spatial-engine/fixture -p spatial-kernel --test wire_bytes_invariant wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`, mutation applied | 99f4c437 | 101 (the expected failure) | shared |
| `cargo test --workspace --locked --features spatial-engine/fixture`: 869 passed, 0 failed, 43 ignored | 78e52eea | 0 | shared |
| `cargo fmt --all --check` | 78e52eea | 0 | no |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: 43 warnings, none on an added line (the one in `skp.rs` is at its line 277, unchanged) | 78e52eea | 0 | shared |
| `npm ci` in `renderer/bundle-viewer`, then in `frontends/shell` | 78e52eea | 0, 0 | shared |
| `npx tsc --noEmit` (shell) | 78e52eea | 0 | no |
| `npm test` (shell): 73 files, 1113 tests passed | 78e52eea | 0 | shared |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 446 pass, 0 fail | 78e52eea | 0 | shared |
| `node scripts/plan/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`, `verify.mjs`, `queue.mjs --check`, `site.mjs --check` | 78e52eea | 0 each | no |
| `iconv -f UTF-8 -t UTF-8` on the seven files | 78e52eea | 0 each | no |
| `gh pr checks 186`: 13 lines, all pass; runs 37560509421 and 37560442141 both have head SHA 78e52eea | 78e52eea | 0 | no |

Every cargo command set `CARGO_TARGET_DIR=D:/wt-targets/kcrf`, and every held one also set `CARGO_BUILD_JOBS=8` (and `RUST_TEST_THREADS=8` for tests). No hold was refused. The `node --test` call wrote its output to a scratch log and printed its tail after the release, where the prescribed shape ends with `exit $rc`. The worktree ends clean at 78e52eea.
