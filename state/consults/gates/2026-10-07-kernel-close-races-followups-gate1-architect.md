# PR #186 gate 1 — architect
Reviewed: cut/kernel-close-races-followups @ 78e52eea6460f9eb0dcffa3af3cb37a25b1f85ca

**Verdict: pass with notes.** There are no Correctness or Evidence findings. The three Documentation findings below must be fixed in this PR before the merge. Under `AUTONOMY.md` §22 as amended by #180, they cause no correction round and no re-gate.

I read the branch files in `C:/dev/wt/kcrf` at the head and main's records in `C:/dev/spatial-ide`. I ran no command, so I recomputed no hash and ran no diff. The §7 numstat, the W-1 re-make, the full-diff hunk classification and the hash recomputation belong to the reviewer (§9).

## Documentation (must-fix before the merge)

**D-1 (low) — `protocol/skp/SKP-V0.md`, the 2026-10-07 dated note, item (ii), lines 1022–1024 at 78e52eea.**
- The note says the corrected sentence "now states what the catalog's `remove` documents".
- `Catalog::remove`'s doc (`kernel/src/lib.rs`, `Catalog::remove`) documents only the stream half and the lease half: a live stream holds no `Arc<Dataset>`, and the lease keeps the pool alive.
- It does not document the half that says a ticket's registry entry holds the dataset by name. That fact belongs to `TicketState` in `kernel/src/skp.rs`.
- The sentence's basis, by this form's §1 and Amendment 1 item 2, is the catalog form's §1 item 3 reading.
- Fix: attribute the sentence to the catalog form's §1 reading, or name both sources by item.
- The sentence in §1 is correct as it stands. It matches §1's may-claim reading and nothing more (§8 item 10 is clean). Only the attribution in the note is over-broad.

**D-2 (low) — `kernel/src/skp.rs`, `TicketLiveness`'s doc, line 539 at 78e52eea (C4).**
- The quotation marks are gone, and the passage is a faithful paraphrase of `engine/ADMISSION-PREREGISTRATION.md:742-744`.
- But the lead-in "as the ADMISSION form words it" presents the paraphrase as that form's wording.
- C4 allows byte-identical text or *unquoted paraphrase*. The paraphrase should not be introduced as the source's own words.
- Fix: change "words it" to "records it" or similar. This is a one-line change inside the ceiling.

**D-3 (low) — `frontends/shell/src/streaming/liveTicketSet.ts`, `isSessionEndedRefusal`'s doc, lines 70–72 at 78e52eea (C10's repointed sentence).**
- The worker rewrote this sentence. It now says the pre-check's thrown `SkpCallError` comes "from `SkpHost::viewport_query`'s own live-generation check".
- The first refusal after a change does not come from there. It comes from `viewport_query`'s R-D2 pre-check arm: the `open_engine_stream` refusal in `viewport_query_mint` that ends the generation on `EngineError::SourceChanged`.
- C6 names that same arm in `session_generation.rs`, and T1's step 3 exercises it.
- The live-generation check only answers later queries.
- The sentence sits in a file this piece edits for a routed item, so §0's scope rule puts it in scope.
- Fix: name both arms by item, with no line. The file is at 12 of its ≤ 16 lines, so there is room.

## §8, item by item

1. **Product non-comment lines.** I read every changed region: C1–C5 in `skp.rs`, C8, and C10. Each change is in a `//`, `///` or `/** */` comment. The reviewer confirms the complete hunk set.
2. **The caller rule.** No new `pub` or `pub(crate)` item, option, callback or path.
3. **Tests.** Every assertion condition and test name is unchanged. The only message change is C6's T1 message, which now names `isSessionEndedTerminal`. That is the current name (`liveTicketSet.ts`, `isSessionEndedTerminal`).
4. **Paths.** The reports name 7 files, all on §7's list plus Amendment 1 item 1's `liveTicketSet.ts`. The form itself is unchanged on the branch. `protocol/skp/src/`, `protocol/skp/tests/` and `protocol/data-plane/` are reported empty; the reviewer confirms.
5. **SKP-V0.** 13 insertions and 2 deletions: the in-place sentence (2/2) plus one note (11 lines). No literal changes, and the `skp/0.3` bullet is untouched.
6. **Unheld references.** No comment states anything about a reference no client holds. The only such words are in the test name `the_close_race_mints_no_generation_so_no_unheld_reference_exists`, which C1 explicitly allows to be named.
   - Nothing calls ADR-035's Note 2026-09-25, SKP-V0 §3's third rule or the 2026-09-25 note historical.
   - C1 is consistent with the third rule's first branch: for a generation that a successful `open_dataset` creates, the reference is returned on `OpenDatasetResponse.session`. The code confirms this: `SessionRef::mint` → `mint_for_open` → `OpenDatasetResponse { session }`.
   - C1 states that the arm runs after the mint. It does not state which generation `end_generation` ends.
7. **Line cites.**
   - C2's `:689`, C3's `:266` ×2, C6's line cites, C7's `:350`, and C10's three skp.rs line cites are all repointed by item.
   - The `ADMISSION-PREREGISTRATION.md:742-744` token stays, as C4 requires.
   - No ledger line cite remains: round 4 item 1 and entry 91 (a) are cited by round/item and entry.
   - The other three line tokens in `liveTicketSet.ts` (`skp/client.ts:58-65`, `ADMISSION-PREREGISTRATION.md:221`, `tileViewportStreamManager.ts:316`/`:324`) resolve correctly at the head, so none is stale.
8. **Quotation marks.** None remain around non-identical text. C7's quoted assertion message matches the `assert!` format text in `wire_bytes_invariant.rs`, with `i=1` and `tag 16` as observed.
9. **Site lists.** C5 lists the sites, with no "only" and no count. C8 and C10 give no site list and no count. C9 (i)'s count is stated at a named 40-hex commit on main, as C9 allows.
   - At the head, the only non-test callers of `terminal_detail_of` are `next_into`, `create_from_raw_params` and `liveness_refusal` (two arms) in `kernel/src/lib.rs`. `publish/error.rs` mentions it only in a doc comment. The other callers are tests.
   - P3 holds at base: the product sources are unchanged on the branch, since every edit is a comment.
10. **`close_dataset` text.** It adds no property beyond the reading. See D-1 for the note's attribution.
11. **C7's comment.** It names the base commit 99f4c437… in full, carries no line number, and does not call a `verify-mutation` run an observation. Worker report 1 says no `verify-mutation` run was used.
12. No ADR, declared-unchanged form or `KNOWN-LIMITATIONS.md` is edited.
13. No record hash is pinned at a branch commit. The T1 test-text span is named with its commit (2d75b57b) in worker report 1.
14. None of the three appears: no zero-copy, no number, no timing assertion.
15. No `cfg`, ignore or path literal.
16. Only the three index lines change. The index is 38 lines, under the 60-line cap.

## Specific checks

- **C9 placement.** It is correct.
  - The form's anchor (after `:979-985` @ a1109023) was the end of §8 when the form was drafted. MP-1's `skp/0.9` entry merged after that.
  - Under the form's own Reference-form rule, the pin is historical and the tree at the base governs the edit. §8 says "only added to below".
  - So the note belongs after the newest entry, just before `## 9.`. Placing it between the 2026-10-05 note and `skp/0.9` would have inserted it above a later entry.
  - Its shape (a blockquote dated note, with no literal change and an empty data-plane diff) follows the 2026-10-02 precedent.
- **C9's in-place sentence against the catalog form's §1 item 3.** It matches.
  - The catalog form's §1 item 3 says a live stream holds no `Arc<Dataset>` and a lease keeps the pool alive until released.
  - The by-name half is true at the head: `TicketState::Pending` and `TicketState::Redeemed` carry `dataset: String`, and `PendingBuilt` holds no `Arc<Dataset>`.
  - P4: grepping for `Arc<Dataset>` finds no holder on a stream path; the only hits are `Catalog`'s map and `publish.rs` parameters.
- **C1–C6** were each verified against the code by item.
  - C2's caller is the `ticket_only(..., host.generations())` call inside `serve(DataPlaneConfig {..})` in `run`. Every other `generations()` call is in tests.
  - C6's targets all exist by item: `fixture`, `touch_modification_time`, `prune_locked`'s condition 1, `StreamRegistry::redeem`, and the `open_engine_stream` arm.
- **Round 25.**
  - Class 8: no overrun. Reported 112 lines over 7 files, against ≤ 168 over 7; every file is within its row.
  - Class 9: C10 is declared by Amendment 1 item 1. That amendment was on main before the branch existed, and no C10 code predates it.
  - The mutation wording is clean. The test-text span is class 3 by named exception.
- **Verbatim quotes and discharge claims.** The diff adds no quotation of the human's words and no amendment, so there is no "discharged" or "done" clause to resolve.
- **Owner's index.** Lines 350, 374 and 376 at the head carry lead-data's replacement lines, as far as I could read them; the custodian's byte check stands.
  - 20 `kernel/*-PREREGISTRATION.md` files exist, and each is named once across lines 374–375.
  - No Interfaces row moves. That is right, because the diff adds no test, item or heading.
  - "Last verified at 2d75b57b" names a branch commit. The merge commit keeps it reachable, since the form requires a merge commit. 78e52eea changes no pointer target.

## Observation (no action owed in this PR)

C7 requires W-1 on a `git archive <base>` export. Worker report 1 says only that the mutation was "applied on the unmodified base, HEAD 99f4c437…" and does not state how the base was exported. The evidence of record for W-1 is the reviewer's re-make at the base (§9). The closing record should cite that re-make.

## ADR

None owed.
