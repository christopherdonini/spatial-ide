*Custodian's filing note (2026-10-22): the architect's draft of piece 1c's form's Amendment 1, read only at main e6dfe624. The run 22:35:37Z to 22:53:21Z by its transcript (Read 35, Grep 38, Glob 2; no Write, Edit or Bash). The amendment is committed to `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` with Annexes A and B, each rebuilt by script from its sources and equal byte for byte to the architect's; its 47 line cites are pinned by script at e6dfe624819a838c7f6a7ce63229b3d66912a6a0. Three edits by the custodian, in the committed text only: item 3's bare line numbers are written as pins into the words draft; item 3 (d)'s inline copy of OPEN-M2's sentence is replaced by a pointer to Annex A item 3's last sentence; C-4's and C-5's two ledger pins are replaced by references to the ledger by entry (round 14 (a′)). OPEN-A1 (F1's wording, red-line text) and OPEN-A2 (the widening's placement) are the human's, on Monday 2026-10-26. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is e0e9e336fa63ff7bec495b4c23b27945c813a9c9bed2bfb3db58a5d0e5c5f1da.*

---

Drafted: b2-piece-1c-save-and-reopen, Amendment 1, at main e6dfe624

I read everything in the main checkout at e6dfe624. I have no shell, so this report gives no sha256 anywhere: the custodian pins every `path:line @ e6dfe624` by script. I read code on branches only through the records named here. The brief's PR A file list is taken as given.

---

## Amendment 1 (the text for the form's §10)

```markdown
## Amendment 1 — written after O0 (B)'s attempt and the probe's local control run were seen, before any product code: the order (class 1); the human's approval, O0 waiting and step 1 up to the resolver (class 5); the two ADR texts as they land; F1's reader refusal and five more additions, a scope addition (class 9); OPEN-17 (b) (class 5); rule (00) at this dispatch (class 1); four corrections (class 3); the superseded index

*Written by the custodian before any product code. Drafted by the architect, read only at main e6dfe624 (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-amendment-1-architect-draft.md`). It holds references and the approved ADR texts only. The texts are reproduced in Annexes A and B, by script, because the worker applies them byte for byte. Every `path:line @ e6dfe624` is pinned by the custodian's script to the full commit id and its sha256 before commit; e6dfe624 is a commit on main. The human's rulings are cited by directive path and item, and none is reproduced. Self-references are by section and item.*

1. **The order (class 1).** The human's order (1) (`state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:8 @ e6dfe624`, item 1) happened as ruled:
   - PR #240 merged at e8f110bb2dfd0233b7593ff31be95af02504c757 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:561 @ e6dfe624`);
   - then the acceptance commit 7cf76f9f92dee75086d7da1e196a6eda6a6b84b2 changed the Status line (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3 @ e6dfe624`) and `docs/README.md`'s row (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:564 @ e6dfe624`).
   §2.10's paragraph for the other order does not apply. This form's ADR-036 cites are found again at each step's base by the bytes of their passage (the header's Pins).

2. **O0 and the resolver (class 5).** On item 5 of `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md` and the Slot 2 line of `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md`.
   - **O0 (B) did not dehydrate.** The OneDrive client was not running. The file was removed at once, and the probe was not run on it (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-o0-b-attempt-custodian.md:6-10 @ e6dfe624`).
   - **The probe.** It is `spikes/b2-1c-onedrive-probe/` at a88d01863f65eb1290f762f8a3f03db4b9e43a0c on `cut/b2-piece-1c-save-and-reopen`, named by its commit with no hash (round 15 (e)). Its local control run (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-step-1-probe-worker-report.md:49-67 @ e6dfe624`) is not O0, and it tests neither H1 nor H5.
   - **O0 waits** for the human's own file on Monday 2026-10-26 (OPEN-6 (A)). Its result is recorded by an amendment of its own before any resolver code.
   - **Waits for O0 (H1):**
     - the resolver, all of §2.5: `judge` at save (step 1; §2.3's carrying rule calls it) and `check_inside` at reopen (step 2);
     - every step 1 path that calls `judge`: the save orchestration in `kernel/src/project/mod.rs`, with the carrying rule, the saved-here mark, the first-save record move, the OPEN-16 refusal, the kept-lineage refusal and `folders.json`'s `first`;
     - the tests that need that orchestration: K-S1 to K-S5, K-S8 to K-S12, K-S13 (item 5) and G3.
   - **Proceeds now (step 1 up to the resolver):** commits N2 to N7 of item 6, and nothing else.
   - **What this narrows.** The header's O0 condition, §2.13's step 1 row, §3's last two O0 bullets and I4's O0 clause now read as follows: product code before O0's amendment is I4 only where it is the resolver or calls it.
   - **§8 item 7 is met.** The human gave the approval in item 5, before step 1's PR opens.

3. **ADR-036's appended amendment, as it lands (Annex A).** The source is section 1 of the words draft (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:22-62 @ e6dfe624`), as approved. Only these bytes change:
   - **(a) The heading's date.** `<date of the human's approval>` becomes `<DATE>`: the UTC date (`date -u +%F`) of the commit that appends it.
   - **(b) The `clauses` bullet of item 1** (:28). After `A clause carries no id.` come one space and OPEN-F1 (a)'s two sentences: a sub-line span of the words draft's :187, carrying that line's hash.
   - **(c) The `view` bullet of item 1** (:30). After `spans on the canvas.` come one space and OPEN-V3 (a)'s sentence (sub-line span of :183).
   - **(d) Item 3's closing paragraph** (:49). After `is the only one.` come one space, OPEN-M1 (a)'s sentence (sub-line span of :191), one space and OPEN-M2 (a)'s sentence. The M2 sentence is new words of the architect's and carries option (a) only: `An open whose answer is the same project, and which would make \`folders.json\` hold more than 256 folders, is refused by name, and no folder is forgotten to make room.`
   - **(e) Item 6's closing paragraph** (:62). After `§9's bounds on a session history stand.` come one space and OPEN-C1 (a)'s sentence (sub-line span of :200).
   - **Unchanged:** OPEN-V1 (a) and OPEN-V2 (a) are the drafted text (:31 and :30).
   - **Where it lands:** at the end of the file after `## Consequences`, after one blank line. ADR-036's `**Amended:**` header lines are not touched: the acceptance said nothing else in the file changes (`state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8 @ e6dfe624`). `docs/README.md` is not regenerated.
   - **When:** in step 1's first commit after the probe (N2), before the writer.

4. **ADR-022 Amendment 2, as it lands (Annex B).** It follows the human's reading (a) (`state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10 @ e6dfe624`).
   - **Its body is built from three source lines,** each a sub-line span carrying its line's hash:
     - `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15 @ e6dfe624`: from `Amendment 2 (b2-piece-1c-save-and-reopen):` through `docs/11's obligations are ` (trailing space included), and from `Consequence (a) stands` to the end;
     - `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10 @ e6dfe624`: the quoted span that stays;
     - `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:12 @ e6dfe624`: the span after `my words in place of the earlier one: `.
   - **Not the human's:** the joining `. ` after `lifecycle` and the one space before `Consequence`.
   - **Superseded and not carried:** the second message's change (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14 @ e6dfe624`).
   - **The heading** is the custodian's (§2.10), in the form of Amendment 1's heading (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73 @ e6dfe624`).
   - **Where and when:** at the end of ADR-022, in the same commit as Annex A, before any code that writes a style into a project file.

5. **Scope addition (class 9), on item 5 of the 2026-10-23 directive named in item 2, declared before any of its code.** §7 is not edited. Each addition counts in its step's §2.11 groups, and an overrun is class 8. Every new test's mutation is observed under §4's rule.
   - **F1 (step 1): the reader refusal.**
     - *§2.* The project-file reader (`kernel/src/project/file.rs`) refuses a `workspace` whose `filter` is not what its enabled clauses combine to (Annex A item 1). The code is `skp.project_file_refused` (§2.2), naming the member path `workspace.filter` and the rule.
     - *The interface it is written against.* The kernel's combination is written against the shell's `combineClauses` (`frontends/shell/src/workspace/filterClauses.ts:31-40 @ e6dfe624`). The shell's own state always meets the rule (`frontends/shell/src/workspace/viewTransitions.ts:108-119 @ e6dfe624`).
     - *What it claims.* §2.3's pre-write check applies the same rule, but this addition claims the reader's refusal only.
     - *§3.* F5 gains four hand-built files:
       - two enabled clauses and one disabled, with the bracketed join (accepted);
       - the same with the texts joined without brackets (refused);
       - no enabled clause and a non-null `filter` (refused);
       - one enabled clause, with `filter` its text byte for byte (accepted).
     - *§4.* U-R7 `the_project_file_reader_refuses_a_filter_that_is_not_its_enabled_clauses_combined` (`kernel/src/project/file.rs`, `mod tests`). Mutation: the comparison removed.
     - *§9, the seam.* E-SAVE makes two enabled clauses and one disabled before it saves. The kernel's reader then reads back the shell's own join, in its real shape.
     - *§5.* `filterClauses.ts` and `viewTransitions.ts` are read only. A changed combination at the step's base is I1.
     - *§8.* Item 16: a `workspace` read or written whose `filter` is not its enabled clauses combined.
   - **V1 (step 1): its claim had no test.** Annex A item 1 claims that every finite view value is kept exactly and that no save is refused for one.
     - U-V1 `a_view_value_outside_the_number_grammar_round_trips_bit_exact_as_hexf64` (`file.rs`, `mod tests`): centre x = 5e-7, y = −0.0 and zoom = 1e15, each written and read back bit for bit. Mutation: the view numbers written through `write_double`.
     - U-V2 `a_view_number_in_any_other_spelling_or_not_finite_is_refused_by_name`: a JSON number, an uppercase hex string and a NaN pattern, each refused with `project_file_refused` naming its member path. Mutation: the view members read as JSON numbers.
     - The codec is `spatial_skp::v0::HexF64` (`protocol/skp/src/v0/codec.rs:38-63 @ e6dfe624`), already a kernel dependency (`kernel/Cargo.toml:21 @ e6dfe624`), so no new dependency is added (I6).
     - *§8.* Item 17: a `view` number written through the canonical number grammar.
   - **V3 (step 2): a view saved in another space.**
     - *§2.* `opened` carries `workspace.view` only when the saved `view.crs` equals the reopened dataset's admitted space in all three members: identifier, provenance and definition. Otherwise `workspace.view` is the named state `{"state":"saved-in-another-space","basis":<text naming both identifiers>}`, and the shell applies no view. This changes the response only, and nothing is written.
     - *§4.* K-O9 `a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it` (`kernel/tests/project_reopen.rs`): F1 is saved, its `view.crs.definition` is replaced by another sha256 with the identifier kept, and the file is laid out again by the writer's function. Mutation: the spaces compared by `identifier` only.
     - *Shell.* `a view saved in another space is not applied and the owner says so`. Mutation: the view applied regardless.
     - *P6.* S19.
     - *§8.* Item 18: a view applied across spaces, or spaces compared by identifier alone.
   - **M1 (steps 1 and 2): the format of `folders.json`.**
     - *§2.* `folders.json` is written in Annex A item 3's shape through `to_canonical_string`. The first save writes `first` and an empty `same` (step 1), and an answer `same` appends to `same` (step 2).
     - *At reopen (step 2).* A `folders.json` the strict reader refuses, or one that holds more than 256 folders (Annex A item 6), refuses the open with a new code, `project_machine_record_refused` (the file's name and the rule). §2.2 gains it, and the file is not rewritten.
     - *§4.* K-S13 `the_first_save_records_its_folder_as_first_in_folders_json` (step 1, `kernel/tests/project_save.rs`, after O0). Mutation: `folders.json` not written at the first save.
     - *§4.* K-O10 `a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (step 2; cases: a duplicate key, and 257 folders). Mutation: a refused file replaced by a fresh one.
     - *P6.* S21.
     - *§8.* Item 19: a known folder forgotten, reset or pruned.
   - **M2 (step 2): the 257th folder.**
     - *§2.* An answer `same` that would take `folders.json` past `MAX_KNOWN_FOLDERS` (§7, 256) refuses the open with a new code, `project_known_folders_full` (the identity and the count). §2.2 gains it, and the file is unchanged.
     - *§4.* K-O11 `a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten`: 256 folders are written by the store's writer, and a 257th folder is answered `same`. The test asserts the code and the file's unchanged bytes. Mutation: the oldest `same` entry dropped to make room.
     - *P6.* S20.
     - *§8.* Item 19.
   - **C1 (step 2): lineage-file bounds.**
     - *§2.* The lineage reader (§2.4 step 6, item D) checks the file's size before it reads, and each line against §9's line bounds (`kernel/src/session_history.rs:43-45 @ e6dfe624`), with a file bound of 33,554,432 bytes. A file over either bound is named in `opened.lineage` as refused over its bound, is not read further, and is never cut back (ADR-036 §8).
     - *§4.* K-L5 `a_lineage_file_over_its_bounds_is_named_and_not_read` (`kernel/tests/project_reopen.rs`). Cases: a file extended by `set_len` to 33,554,433 bytes, and a step line of 262,145 bytes, each beside a hand-built project whose member records a lineage. Mutation: the file-size check removed.
     - *§8.* Item 20: a lineage file read past a bound.
   - **V2 adds nothing.** It adds no refusal, behaviour or test: its shape is W's, carried by K-S1 and K-O1.
   - **The strings.** S19 to S21 are owner placeholders. None is the human's, and each states only the consequence.

6. **OPEN-17 (b), the custodian's answer, in the human's reading (class 5).** The sources are milestone 4's form, Amendment 1 item 4 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:743 @ e6dfe624`) and Amendment 5 item 3 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1128 @ e6dfe624`). For step 1, this replaces §2.14's milestone-4 order and its redaction dispatch sentence, and §9's commit-plan order.

   | §2.11 group | Now, or waits for what |
   |---|---|
   | O0's probe | Committed at a88d0186. Its run waits for the human's file (item 2). |
   | ADR text | Now (N2). |
   | renderer | Now (N3). |
   | protocol product | Waits for the version bump (any field change is a new version string, `protocol/skp/SKP-V0.md:299-303 @ e6dfe624`). The bump waits for PR A's merge. |
   | fixtures and protocol tests | Wait, with the bump (P2). |
   | version literal | Waits for PR A. `frontends/shell/src/skp/types.ts` and `client.test.ts` are PR A files, and `frontends/shell/src/admission/admitDataset.test.ts:85 @ e6dfe624` also holds the literal. |
   | kernel product | Now, except `resolver.rs` and the orchestration (O0) and the `save_project` handler (the bump). |
   | kernel tests | Now: U-L1, U-I1, U-C1, U-R1 to U-R7, U-V1, U-V2, K-S6 and K-S7. The rest wait for O0 (item 2). |
   | src-tauri | Not a PR A path: PR A changes no file there; milestone 4 leaves `src-tauri/**` unedited by every PR (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:401-402 @ e6dfe624`); and OPEN-17 (b) lists it among the groups that proceed (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:727 @ e6dfe624`). It is disjoint by file from #241, which edits `publish.rs` and `tauri.conf.json`. In fact it waits for the bump, because the binding's `save_project` takes the protocol's request type. |
   | shell product and shell tests | Wait for PR A's merge. |
   | e2e | Waits for PR A (`package.json` is shared). |
   | records | `kernel/README.md` waits for #241's merge. The KNOWN-LIMITATIONS item and the walkthrough Part are separate paths, numbered and lettered at R1's base. |

   **The commit order.** Each commit passes `cargo fmt --check`, clippy with `-D warnings`, and `cargo test --locked --features spatial-engine/fixture`. A `pub` item that only tests use at an intermediate commit gets its product caller later in the same PR. Nothing is silenced with `allow(dead_code)`.
   - **Now:**
     - N0: the probe, a88d0186.
     - N1: main merged into the branch at or after this amendment's commit (a merge, never a rebase).
     - N2: Annexes A and B.
     - N3: `renderer/src/canonical.rs` gets `to_line_oriented_string`, its module-doc paragraph, §7's indent unit and separator at the site, and U-L1. The existing items stay byte-identical.
     - N4: `kernel/src/dataset_ref.rs` gets the bind-time bound (U-I1), ruling 9's canonical-form widening (U-C1) and its current Status line. `kernel/src/lib.rs` gets its current Status line.
     - N5: `kernel/src/project/{mod,strict_json,file}.rs`, and `pub mod project` in `lib.rs`: the strict reader, and the writer, which writes through N3, and reader under Annex A's rules. Tests: U-R1 to U-R7, U-V1 and U-V2.
     - N6: in `kernel/src/session_history.rs`, `read_line` goes through the strict reader (OPEN-19), and the file gets its current Status line. 1b's suites pass, and any edit to a 1b test is I3.
     - N7: `kernel/src/project/store.rs`: the identity, the machine store's paths, the atomic replace (temp pattern, `write_all`, `sync_all`, the bounded rename, temp cleanup), and the writer and reader of `folders.json`. Tests: K-S6 and K-S7, against that replace (H6).
   - **After O0's amendment:**
     - O1: `judge` and the orchestration, with K-S1 to K-S5, K-S8 to K-S13 and G3, and the current Status line of `kernel/tests/no_generation_in_persisted_artifacts.rs`.
   - **After PR A merges:**
     - P1: main merged into the branch.
     - P2: the bump, in one commit. It holds:
       - the literal at `protocol/skp/src/v0/mod.rs:115 @ e6dfe624`;
       - `save_project`'s request, response and step 1 codes (`commands.rs`, `error.rs`, `SKP-V0.md` with its change log and its Status lines);
       - the protocol and conformance fixtures with their tests;
       - every literal site, found again at P1's base: `frontends/shell/src/skp/types.ts:15 @ e6dfe624`, `frontends/shell/src/skp/client.test.ts:29 @ e6dfe624` (and its lines 59, 86 and 91 at the same commit), and `frontends/shell/src/admission/admitDataset.test.ts:85 @ e6dfe624` (and its lines 93, 145 and 167).
       Both `cargo test` and `npm run verify` pass on this commit, because the shell's fixture test reads the protocol fixtures (`frontends/shell/src/skp/__tests__/fixtures.test.ts:510-523 @ e6dfe624`).
     - P3: the kernel's `save_project` handler (after O1 and P2).
     - P4: `frontends/shell/src-tauri/src/{commands,lib}.rs`: `save_project` on `spawn_blocking`, and `binding_pick_project_folder`.
     - P5: the shell product and its tests.
     - P6: the e2e work: `e2e/project.mjs`, the `package.json` script line and its `e2e/README.md` entry, with E-SAVE as item 5 amends it.
   - **After #241 merges:**
     - R1: main merged into the branch, then the records: `kernel/README.md` (its Status lines and the owner's index at that base), the KNOWN-LIMITATIONS items, and the Part, at a letter no piece in flight holds.

7. **Rule (00) at this dispatch (class 1).** It is checked path by path against step 1's §2.11 paths. At most one piece touches `protocol/`, and that piece is step 1.
   - **#241** (24 paths, `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ e6dfe624`):
     - shared: `kernel/README.md`, so R1 follows #241's merge;
     - `KNOWN-LIMITATIONS.md`: separate items;
     - `src-tauri`, `renderer/` and `kernel/src/`: disjoint by file;
     - `engine/src/fixture.rs`: 1c only calls it, and a changed `write_geoparquet` at a base is I1.
   - **#242** (`scripts/plan/**`, `.github/workflows/governance-ci.yml`): disjoint. After it merges, Annex A's round + item cites must resolve (item 9).
   - **#243** (`frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-220 @ e6dfe624`: `engine/tests/session_identity.rs`, `e2e/regression.mjs`, `admission/crsAssertionState.ts`, `canvas/buildLayers.ts`): disjoint. PR A waits on it.
   - **#244** (`frontends/shell/MANUAL-WALKTHROUGH.md`, Parts F and G): disjoint as separate Parts. Step 1's Part is a new letter.
   - **PR A** (507197c125179e002eb28fe961e44348466ff66e, its 53 files as briefed):
     - shared files: `skp/client.ts`, `skp/types.ts`, `skp/client.test.ts`, `App.tsx`, `console/surfaceRegistry.ts` and `package.json`. Step 1 edits none of them before PR A merges (item 6);
     - separate paths: the e2e README entries, the KNOWN-LIMITATIONS items and the walkthrough Parts;
     - read by step 1 and edited by PR A: `workspace/workspaceState.ts`, `workspace/viewTransitions.ts` and `style/document.ts`, so step 1 re-reads them at P1's base (I1).
   - **`adr-020-appended-note`** (ADR-020 and its form): disjoint. Neither piece changes a Status line.
   - **`record-step-style-match-widening`** (proposed; `protocol/` and `kernel/src/session_history.rs`): it shares both paths with step 1, so it is not dispatched while step 1 is in progress. Its placement is the human's (OPEN-A2).

8. **Corrections (class 3).**
   - **C-1.** §2.10's quoted ADR-022 Amendment 2 carries the second message's provenance clause, which the human's reading (a) replaced. The text that lands is Annex B. Proof: `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10 @ e6dfe624`.
   - **C-2.** §9's architect bullet checks ADR-022 Amendment 2 "against the human's two lines", but the text rests on three. It is checked against the three lines item 4 names. Proof: item 4's span list.
   - **C-3.** §2.10 and §2.14 call the block's PR in progress. It merged at e8f110bb. Proof: `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:561 @ e6dfe624`.
   - **C-4.** §2.14 calls the redaction scan "in progress, stopped at O0", with its paths at its form's ad921f55 pin. It is PR #241, awaiting R2 and the click, and its paths are its Amendment 3 item 10. Proof: `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ e6dfe624`, `state/CUT-STATE.md:9 @ e6dfe624`.
   - **C-5.** §2.14 calls the governance lane's piece a draft, "ready", and milestone 4 "blocked", with its form "not committed" and four shared files. The first is PR #242. The second is committed, and its §2.9 names six shared files, with PR A at 507197c1 waiting for #243. Proof: `state/CUT-STATE.md:183 @ e6dfe624`, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:461-465 @ e6dfe624`, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1129 @ e6dfe624`.

9. **Round + item cites in Annexes A and B.** These are `round 69, item 4` (Annex A item 1) and `round 69, item 1` (Annex A item 2). Both resolve in the RULED block "question round 69" (RULED 2026-10-08) of the tracked archive `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`. The added sentences and Annex B carry none. This amendment itself cites round 15 (a) and round 15 (e), which resolve in the same archive.

10. **Before commit (round 15 (a)).** The custodian rebuilds Annexes A and B by script from the sources that items 3 and 4 name, and compares each with the text below. The custodian then resolves each clause of this heading against items 1 to 9, and STOPS on a mismatch.

**Superseded index:**
- the header's O0 condition, §2.13's step 1 row, §3's last two O0 bullets and I4's O0 clause: by item 2;
- §2.10's ADR-022 quote: by item 4 and C-1;
- §2.10's other-order paragraph: by item 1 (it does not apply);
- §2.10's and §2.14's "in progress" for the block: by C-3;
- §2.14's redaction bullet: by C-4 and item 6;
- §2.14's governance and milestone 4 bullets: by C-5 and item 6;
- §9's commit-plan order for step 1: by item 6;
- §9's ADR-022 bullet: by C-2;
- §2.2's code list, §2.12's strings, §3's F5, §4's step 1 and step 2 tables, E-SAVE and §8: added to by item 5.

Nothing above is edited.
```

---

## The ADR texts, whole (Amendment 1's Annexes A and B)

**Annex A: ADR-036's appended amendment.** I reproduced it from my Read, not by script, with item 3's five changes. The custodian rebuilds it by script and marks it as reproduced.

```markdown
## Amendment 1 — piece 1c: the `workspace` member, which save a lineage file is from, the machine store, a steps file's locators, the session record after the first save, and the reader's ceilings (b2-piece-1c-save-and-reopen, <DATE>)

Appended after acceptance, from piece 1c's form (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, §2.10), landing no later than its writer (§11). The words are the architect's, approved by the human.

1. **The project file's `workspace` member** (§11; piece 1c's OPEN-10, OPEN-11 and OPEN-12). It is `{"filter":…,"clauses":[…],"style":…,"view":…}`, with these four members in this order:
   - `filter`: the filter applied when the project was saved, in `filter.apply`'s form (§6), `{"predicate":<text>,"dialect":"duckdb-expr/0"}`, or `null` where none was applied.
   - `clauses`: the filter clauses in their order, each `{"text":<text>,"enabled":<true|false>}`. A text is kept byte for byte as typed. A clause carries no id. `filter` is what the enabled clauses combine to: `null` when none is enabled; the one enabled clause's text, byte for byte; otherwise each enabled clause's text inside one pair of brackets, joined by ` AND `, in list order. A reader refuses a `workspace` whose `filter` differs.
   - `style`: an ADR-017 §5a style document, whatever the dataset's geometry, with its members in the order of §5a's canonical form (ADR-022 Amendment 2). A reader refuses a document the renderer refuses.
   - `view`: the map view, `{"crs":…,"centre":[<x>,<y>],"zoom":<z>}`. `crs` names the space of the dataset the view was saved over, in `dependencies.crs`'s form (§6). `centre` is the point at the middle of the canvas, x then y, in that space's coordinates. `zoom` is the base-2 logarithm of the number of logical (CSS) pixels that one unit of those coordinates spans on the canvas. A reopen applies `view` only when its `crs` equals, member for member, the space the dataset is admitted in at the reopen; otherwise the view is not applied, and the reader says so.
   - **How `view`'s numbers are written.** Each of the three is a string of 16 lowercase hex digits, the big-endian IEEE-754 bit pattern of the value: the form SKP gives a bit-critical scalar (`HexF64`, `protocol/skp/SKP-V0.md` §3; ADR-004's amendments of 2026-08-03). A reader refuses any other spelling, and a pattern that is not a finite value. §2's number grammar cannot write a value with 0 < |v| < 1e-6 or |v| ≥ 1e15; written this way, every finite value, these included, is kept exactly as held: nothing is rounded, and no save is refused for it.
   - **The analysis settings** are reserved by name. Version 1's `workspace` has no member for them; adding one changes the shape and comes with a `version` step (§3).
   - **A selection made by clicking is not saved:** `workspace` has no member for it (round 69, item 4; §11 reserves a selection scope by name).
   - As §11 states, this amendment completes version 1 and is not a version step.

2. **Which save a project file and a lineage file are from** (§8; the human's ruling 4 of 2026-10-09 and its note for piece 1c's form; round 69, item 1). Where the project file's `lineage` member records a lineage, a reader compares the folder's lineage file with the member, in this order:
   1. If the lineage file's header line and its first `steps` step and withheld lines, each with its LF, have the member's `sha256`, those lines are the project's lineage. If lines follow them, the reader reads none of those lines as the project's, and says that the lineage file holds lines after the save the project file records.
   2. Otherwise, if the previous lineage file kept for the project on this machine (item 3) has the member's `sha256` and `steps`, it is the project's lineage, and the reader says that the folder's lineage file is not the one the project file records.
   3. Otherwise, the reader reads no lineage file as the project's lineage, and names the project file and the lineage file as from different saves, or names the lineage file as missing.

   Where the member is the state `not-kept` and the folder holds a lineage file, the reader does not read it, and names it as from a different save. A writer that replaces a lineage file first keeps a copy of the file it replaces, as `previous-lineage.jsonl` in the project's machine folder (item 3), until the project file that records the new one is written, so that §1's rule that nothing else in the folder belongs to the format still holds.

3. **The machine store for a saved project** (§1, §4, §9). Under the per-user data directory that holds §9's sessions, a saved project has a folder `spatial-ide/projects/<record>/`, where `<record>` is the project identity's 32 hex characters. It holds:
   - `locations.json`, in §9's `spatial-locations` format: where this machine found each dataset the project names;
   - `folders.json`: the project folders this machine has opened the identity from, by absolute path, and the answer to §4's question for each;
   - `open.lock`, held under an exclusive lock while the project is open, so that a second open of the same identity, in this process or another, is refused by name. The lock must be one that the operating system releases when the process holding it ends, so that a crash never leaves the project locked;
   - `previous-lineage.jsonl`, only while item 2's writer keeps it.

   None of these is ever in a project folder, nothing in them is copied into a project file or a steps file (§2), and the end of a session clears none of them. Two files this ADR defines hold an absolute path: `locations.json`, wherever it is kept, and `folders.json`. This widens §9's sentence that `locations.json` is the only one. `folders.json` is one canonical JSON document, `{"format":"spatial-folders","version":1,"first":<absolute path>,"same":[<absolute path>…]}`: the folder §4 calls the first folder, and each folder for which the answer was the same project. An open whose answer is the same project, and which would make `folders.json` hold more than 256 folders, is refused by name, and no folder is forgotten to make room.

4. **The locators a steps file's header carries** (§5, §6). In a lineage file's header, each dataset entry carries the locators that the project file's entry for the same dataset carries, under §5's rule for a project file. In a session history's header, each dataset entry carries the `machine-recorded` locator only. Like §5's rule, this binds the writer.

5. **A session history's record after the first save** (§9; piece 1c's OPEN-18). At a project's first save, the session's history moves to the project's record: `<record>` becomes the project identity's 32 hex characters, and the header's `project` is the project's URI, which §6's header already admits. The kept lines are carried over under that header, and the `unsaved-` record is then removed. Where an `unsaved-` record's first step is also in a project's record, as after a crash between the two, recovery offers the project's record only.

6. **The reader's ceilings, by number** (§2, bounded readers). A reader refuses, by name and without truncating:
   - a project file over 1,048,576 bytes;
   - a dataset entry with more than 8 locators;
   - a string over 4,096 bytes, in a project file or in a dataset entry, except a CRS assertion's `definition_json`, which is bounded at 65,536 bytes, the engine's own bound on a CRS definition;
   - a `project-relative` `at` of more than 64 segments;
   - a `folders.json` that holds more than 256 folders.

   An array in a project file has no ceiling of its own: the file's size bounds it. §9's bounds on a session history stand. §9's line bounds apply to every steps file, and a lineage file is at most 33,554,432 bytes.
```

**Annex B: ADR-022 Amendment 2.** It is reproduced from my Read, not by script. The custodian rebuilds it by script from the three lines item 4 names; the words draft's filing note records a rebuild that came out equal. Everything below the heading is the human's, apart from the two joining spans item 4 names.

```markdown
## Amendment 2 — style persistence granted for the project file (2026-10-22, the human)
Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, and save and reopen for the lifecycle. Provenance does not yet travel with the project file. The lineage member stays a named state until a later piece writes it; the saved-here mark says only that the saved style is the one the session's recorded steps reach, and those steps are kept in the session history on this machine while it lasts. Consequence (a) stands, and the lineage is not granted by this amendment.
```

It follows Amendment 1's layout, with no blank line after the heading (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-74 @ e6dfe624`).

---

## Clause checks (all read at e6dfe624)

**The heading's `<DATE>`.** The brief sets it. That is the only byte of section 1 that changes outside the five insertions.

**F1** (an approved sentence), against `frontends/shell/src/workspace/filterClauses.ts:35-40 @ e6dfe624`:
- None enabled gives `null`, matching `on.length === 0`.
- One enabled gives its text byte for byte, matching `on[0].text`.
- Otherwise each text is wrapped as `(…)` and the wrapped texts are joined with " AND " in list order, matching `.map(...).join(" AND ")` over `clauses.filter` order.
- Disabled clauses are left out, matching the `enabled` filter.
- The dialect comes from the `filter` bullet and matches `FILTER_DIALECT_DUCKDB_EXPR_0` (:39).
- "A reader refuses…" is U-R7's refusal. It cannot be reached from the shell's own state, because `filter.apply` sets one clause equal to the predicate and `filter.clauses.set` sets `filter = combineClauses(clauses)` (`frontends/shell/src/workspace/viewTransitions.ts:108-119 @ e6dfe624`). Only a hand-edited file reaches it.
- Two wording defects are open: OPEN-A1.

**V3** (approved):
- "`crs` equals, member for member": the members are identifier, provenance and definition (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:143-148 @ e6dfe624`).
- "admitted in at the reopen": the claims are declared again at reopen (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:113-115 @ e6dfe624`; the form's §2.4 step 4, `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:288-292 @ e6dfe624`).
- "not applied": nothing is reprojected, which fits docs/01 (CRS is a type; no silent conversion).
- Unequal definition hashes "decide nothing" (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:145 @ e6dfe624`). So the same space written two ways is not applied: it fails closed, and S19's basis names both identifiers.
- No reopen exists at main. K-O9 proves it in step 2.

**M1** (approved):
- "one canonical JSON document": written by `spatial_renderer::canonical::to_canonical_string`, inside the module (ADR-022 decision 3, `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45 @ e6dfe624`). This is §9's precedent (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:207 @ e6dfe624`).
- "the folder §4 calls the first folder" matches `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:77 @ e6dfe624` and the form's §2.4 step 2 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:278-283 @ e6dfe624`).
- "each folder for which the answer was the same project": a copy gets a new identity written to its own folder (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:77 @ e6dfe624`), so this identity's file holds only `first` and the folders answered `same`.
- The absolute paths are already allowed by item 3's widening sentence.

**M2** (new words, carrying (a) only):
- "more than 256 folders" is `MAX_KNOWN_FOLDERS` (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:706 @ e6dfe624`) and Annex A item 6's ceiling.
- "refused by name": `project_known_folders_full` (item 5), following §2's "refuses rather than truncates" (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:60 @ e6dfe624`).
- "no folder is forgotten" matches K-4 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:517 @ e6dfe624`).
- Only an answer `same` adds an entry: the first save writes `first`, and a copy mints a new identity.

**C1** (approved):
- "§9's line bounds": `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:208 @ e6dfe624` and `kernel/src/session_history.rs:43-45 @ e6dfe624` (262,144 and 1,048,576).
- "every steps file": the three purposes (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:125 @ e6dfe624`).
- "at most 33,554,432 bytes" equals `MAX_SESSION_HISTORY_BYTES` (:45).
- 1c writes no lineage (OPEN-8 (A)). It reads hand-built ones, in L1 to L4 and K-L5.

**V1 and V2** (drafted text), re-checked at e6dfe624:
- the domain is `0` or `1e-6 <= |v| < 1e15` (`renderer/src/canonical.rs:33-38 @ e6dfe624`), refused at `renderer/src/canonical.rs:240-245 @ e6dfe624`, with −0.0 normalized (:238);
- `HexF64` is exact and refuses a non-finite value (`protocol/skp/src/v0/codec.rs:38-63 @ e6dfe624`), and the shell has `encodeHexF64` (`frontends/shell/src/skp/codec.ts:20 @ e6dfe624`);
- "one world unit is 2^zoom CSS pixels" (`frontends/shell/src/canvas/WorkingCanvas.tsx:577 @ e6dfe624`), in the source CRS (`frontends/shell/src/canvas/WorkingCanvas.tsx:81 @ e6dfe624`);
- U-V1 and U-V2 now carry the claim (item 5).

**Item 6's 65,536.** It is at `engine/src/crs.rs:40 @ e6dfe624`, and the 8 and 4,096 are at `kernel/src/dataset_ref.rs:42-45 @ e6dfe624`.

**Annex B:**
- "class 2 and atomic" matches `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:171 @ e6dfe624` and `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:219-226 @ e6dfe624`.
- "stays a named state" matches `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:246-249 @ e6dfe624`.
- "the saved-here mark says only…" matches the mark being withheld on a difference (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:238-241 @ e6dfe624`).
- "kept … on this machine while it lasts" matches `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:207-209 @ e6dfe624`.
- Every clause holds.

---

## OPEN items (the human's)

**OPEN-A1. The wording of F1's sentence.** The words are approved ADR text, so this is red-line wording and the human answers. It does not block: the ADR commit (N2) lands as approved.
- **Defect (i).** "the one enabled clause's text" makes `filter` a text, but the bullet above declares it an object.
- **Defect (ii).** In rendered Markdown, the code span with a space on each side of AND loses both spaces (CommonMark strips one space from each end), so the rule reads `AND` with no spaces.
- **(a)** Keep it as approved. The raw bytes are right.
- **(b)** Replace F1's first sentence with these words: "`filter` is what the enabled clauses combine to: `null` when none is enabled; otherwise a filter whose `predicate` is the one enabled clause's text, byte for byte, or, for two or more, each enabled clause's text inside one pair of brackets, joined in list order by a space, `AND` and a space." The second sentence is unchanged.
  - Clause check against `frontends/shell/src/workspace/filterClauses.ts:35-40 @ e6dfe624`: null for none; the predicate equals `on[0].text`; `(${text})` joined by `" AND "` in order; the dialect is given by the bullet above.
  - On a yes, one commit on the unmerged branch replaces the span before step 1's PR opens, and the PR body records it.
- **Recommend (b).** ADR-036 is an open format, read without the kernel (docs/14), and both defects mislead an implementer.

**OPEN-A2. Where `record-step-style-match-widening` goes.** It shares `protocol/` and `session_history.rs` with step 1, so rule (00) bars it beside step 1. PR B's merge depends on it.
- **(a)** After step 1 merges, as its own piece. PR B then waits for step 1 and for it.
- **(b)** Inside step 1, by class 9, carried by P2's version bump (one version). Its §2, §4, §5, §8 and §9 are declared by amendment before its code. PR B then waits for step 1 only.
- **Recommend (b).** The node's own title names it, it touches exactly step 1's files, and it saves one version step and one wait.

---

## What I could not settle

- **No sha256.** I have no shell. The custodian pins every cite and rebuilds Annexes A and B by script (item 10).
- **The brief's "(§2.5, step 2)".** `judge` is step 1's, because §2.3's carrying rule calls it at save. So the save orchestration and its tests wait for O0 as well (item 2). That is my reading of the human's words "up to the resolver". A narrower reading (only `check_inside` waits) would let K-S1 to K-S5 run before Monday. I did not take it, because H1 governs `judge`'s walk too.
- **`view.crs` on the wire.** The `sha256:` definition in `view.crs` is the kernel's to compute. The shell holds the definition text from `describe` but no hash, and should take none.
  - Recommendation: the `save_project` request's `view` carries `centre` and `zoom` only, and the kernel writes `crs` from the open's admitted space.
  - It is recorded in step 1's protocol dispatch amendment before P2.
  - It narrows §2.2's "shape of W" for the request.
- **What a move does to `folders.json`'s `first`.** Ruling 8 says only that "the folder memory is updated". This goes to step 2's dispatch amendment.
- **A refused `folders.json` has no remedy in the app** (K-4: the store is never pruned). S21's words and any remedy are the human's at P6 or a later piece's.
- **ADR-022's heading date.** I kept 2026-10-22, the date the human's messages are headed with; their receipts are 2026-10-21 UTC. It is the custodian's to set (§2.10). `<DATE>` would also do.
- **KNOWN-LIMITATIONS numbers and the Part letter** are set at R1's base, after #241's W6 and PR A's KL items and Part.
- **The branch commits as briefed.** I could not read e8f110bb, 7cf76f9f, a88d0186 or 507197c1 myself. I relied on the block form's Amendment 5, the probe report and the brief's PR A list.

Files:
- C:/dev/spatial-ide/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
- C:/dev/spatial-ide/docs/adr/ADR-022-style-v0-as-the-single-style-model.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/frontends/shell/src/workspace/filterClauses.ts
- C:/dev/spatial-ide/frontends/shell/src/admission/admitDataset.test.ts
