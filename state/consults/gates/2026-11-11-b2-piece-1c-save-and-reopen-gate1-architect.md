Reviewed: PR #307 at 791e7e9edb52328b7c430012c9a3a5e1105de8a2 (the custodian's filing note, 2026-11-11: gate 1, attempt 1, the architect, beside the reviewer, PLAN node b2-piece-1c-save-and-reopen, step 1; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #307 at 791e7e9edb52328b7c430012c9a3a5e1105de8a2 (base e3fb4a97), gate 1, architect
Verdict: FAIL

I have no shell, so I cannot show the packet's sha256 (b4178a2e…d396c48d). I read the packet whole with the Read tool. I start no shell and leave no background shell. Every cite below is `@ 791e7e9e` (in C:/dev/wt/b2c) unless it is marked `@ B` (the main checkout, whose files outside `state/`, `governance/` and `site/` are B's) or `@ main` (the form on main, 87db050a). Everything in this report is my own words, except text in backticks that I copied from the file cited.

## Findings by class

### Correctness (each one blocks)

**C-1. ADR-022's "Note 2026-11-05" is missing. This is red-line text.**
- Requirement: the human ruled that ADR-022's note lands with this PR. Form Amendment 4 (form:1143 @ main) records this as class 5 and gives the pattern: appended after Amendment 2, the way ADR-026 carries its Note 2026-11-05. The ruling is the 2026-11-06 directive whose file name ends `…-kl-178.md`, item text at line 21. The note's words are in the 2026-11-05 directive whose file name ends `…-8b-d3.md`, item 3, line 18. PLAN node `adr-notes-stale-statements-and-indices` is marked done by this merge.
- Evidence: `docs/adr/ADR-022-style-v0-as-the-single-style-model.md` ends with Amendment 2 at lines 80–81. A Grep of that file for `2026-11-05`, `Note` and `after #240` finds nothing, at the head and at B. In `docs/adr`, only ADR-013, ADR-021 and ADR-026 carry that date.
- Closure: append the human's note as a `## Note 2026-11-05` section, byte-copied by script from the directive item, before merge. The reviewer recomputes the bytes. These are the human's words, so I give no replacement text.

**C-2. OPEN-4 (A)'s owner statement (S18) cannot be reached in the shipped app, and `Carried`/`Why` reach no product caller.**
- Requirements:
  - The human's ruling OPEN-4 (A), quoted in the form at form:809 @ main, says the owner's statement tells the operator that the project will not find that file on another machine.
  - The form places this at save: §2.3 at form:232, §2.8 at form:356 and §2.12 S18 at form:512, all @ main.
  - §8 item 9 (form:723 @ main) and the seam rule (no `pub` item without a product caller) also apply.
- Evidence:
  - `Projects::save` returns `Saved{…, carried}` (kernel/src/project/mod.rs:307-311).
  - `save_project` drops `carried` and builds `SaveProjectResponse{project, history_mark}` only (mod.rs:330-340).
  - The wire has no member for it: protocol/skp/src/v0/commands.rs:736-739, SKP-V0.md:1324, and frontends/shell/src/skp/types.ts:352-355.
  - The shell has no S18 (frontends/shell/src/project/saveProject.ts:30-41).
  - `resolver::Carried`, `resolver::Why` and `Saved::carried` are `pub`, and their only readers are tests: kernel/tests/project_save.rs:34, :360, :412-413, :443 and :766-767. A Grep of the head finds no other reader.
  - No amendment or record discloses the gap. A Grep for `S18` or `OPEN-4` in the form finds only §2.3, §2.12 and the OPEN section.
- Reachable by ordinary use: in-folder data whose name holds a character the canonical form refuses but Windows allows (U+007F–9F, kernel/src/dataset_ref.rs:577-615), or more than 64 segments.
- Closure, by a class-9 amendment declared before any code: add a response member that carries the judgment, add the shell's S18, and add one end-to-end test from the real shape (kernel `judge` → reply → notice). Or the human rules a deferral (see For the human, item 1).

**C-3. `store::OPEN_LOCK` is `pub` and has no caller of any kind.**
- Requirement: §8 item 9. Amendment 16 item 1 (form:1456 @ main) names `from_bytes` as "the one exception".
- Evidence: `pub const OPEN_LOCK: &str = "open.lock";` (kernel/src/project/store.rs:41). A Grep of *.rs, *.ts, *.tsx and *.mjs at the head finds no other occurrence, not even in a test.
- Closure: remove it in step 1. Step 2 adds it together with the lock that uses it (§2.7, form:346 @ main).

**C-4. The console does not record the picker's invoke, which breaks the recorder's own contract and principle 8.**
- Requirements:
  - docs/01 principle 8: logged and inspectable.
  - The recorder's contract (frontends/shell/src/console/recorder.ts:4-6): `A bounded in-memory log of every request the shell actually sent`.
  - The class-B row exists (frontends/shell/src/console/surfaceRegistry.ts:131-138).
- Evidence:
  - `pickProjectFolder` calls `invoke` directly (saveProject.ts:26-28).
  - The sibling picker records its name before the invoke (frontends/shell/src/skp/dialog.ts:11-22).
  - App.tsx is already in `RECORD_NAMED_ALLOWLIST` (frontends/shell/src/console/soleCaptureSite.test.ts:55), and App supplies `pickFolder` (frontends/shell/src/App.tsx:877-882).
  - No report claims the row was seen. P5's report discloses the gap, and Amendment 16 item 5 hands it to this gate.
- Closure:
  - In App's `pickFolder`, wrap the `pickProjectFolder()` call in `recordNamed("binding-command", "binding_pick_project_folder")`, resolving it as dialog.ts:12-21 does. No allowlist edit is needed.
  - Add one App-level test that a first save leaves that row in the recorder.
  - Declare both by amendment before the code.

**C-5. KNOWN-LIMITATIONS item 62 contains an untrue claim of a limit. Replacement words are supplied; the words are not the human's.**
- Evidence: KNOWN-LIMITATIONS.md:503 says that a save failing at the replace leaves both files and that `the next save of that open is a first save again`. That holds only for a first save:
  - a later save writes only `locations.json` (folders.json is written only `if first`, mod.rs:284-294);
  - a later save's open stays in `saved`, which is pushed only at the first save (mod.rs:238-239 and 296-304).
- Closure: the worker applies the words in W1 below. Amendment 17 item 3's second bullet (form:1493 @ main) records the same overstatement. It is append-only, so it stays, and the PR body notes it as superseded.

### Evidence

None separate from C-2 and C-4, whose closures include tests.

### Documentation (every item must be fixed before merge; none blocks)

**D-1. The `withheld` definition leaves out the no-step case and the record move.** Not the human's wording. Text at commands.rs:741-743 and SKP-V0.md:1338. The code maps `NoStepRecorded` and an `adopt_project` failure to `withheld` (mod.rs:345-363 and 333-336). Words W2 and W3.

**D-2. `SaveFailure::MachineRecordRefused`'s doc names only folders.json** (mod.rs:177). `locations.json` also produces it (mod.rs:281 and 485-488). Words W4.

**D-3. `skp.project_file_refused`'s message** (protocol/skp/src/v0/error.rs:205), `the project file would break a rule its reader holds: {path}: {rule}`, is untrue when the cause is `MachineRecordRefused` (the path is `folders.json` or `locations.json`, mod.rs:428). It is inexact when the cause is an existing file the reader refuses (mod.rs:263 and 424). The text reaches the operator inside S4, so it stays under P6 and I supply no binding words. A suggestion, my own wording: `a rule a reader holds refused the save: {path}: {rule}`.

**D-4. Counts this diff made untrue.** None is the human's wording. Test-name edits are class 3 by named exception.
- surfaceRegistry.ts:12, :28, :32 and :75 say "six" SKP commands. There are now seven (lines 81-89).
- surfaceRegistry.ts:91 says "seven binding-local commands". There are now eight, plus the dev seam (lines 98-167).
- surfaceRegistry.ts:70 says "not eight independent strings". Nine rows now use the constant (a Grep counts 9).
- surfaceCompleteness.test.ts:23, :111-112, :198, :200 and :205 say six.
- actionRegistry.test.ts:132 says "twelve ids". There are now thirteen.
- Amendments 11 item 3 and 12 item 1 disclosed these counts "for R1", and R1 did not fix them.
- Words W5.

**D-5. kernel/README.md does not list this piece's form among its preregistrations** (kernel/README.md:390), yet its last-verified line (:361) claims every pointer the step adds. Amendment 17 item 3 discloses the omission. Closure: add `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` to that list.

**D-6. Item 62's comment says its pins "follow on main after the merge", and no piece is placed to do that (flag 4).** The comment is KNOWN-LIMITATIONS.md:504. The line spans are correct at 88a35355, which equals the head for those files: mod.rs:237-246, 277-295, 296-304, 484-501 and 505-520; store.rs:14-15 and 57-64; log.rs:370-381; lib.rs:453-462; and the removals at store.rs:118, :150 and :183 and mod.rs:519. Naming them at a commit id without a hash is allowed (round 25, item 2). Closure: either place a PLAN node, or delete the promise using W6. If the merge is not a merge commit, 88a35355 does not reach main (§9 asks for a merge commit).

**D-7. The PR body is not in the packet.** Before merge it must:
- name `from_bytes`'s consumer (step 2's reopen under M1) and its gate (K-O10);
- say that `recover`'s consumer is still open and is step 3's (§9 asks for "closed", which step 1 cannot truthfully state);
- list the P6 strings S1–S7, S22 and S23, and say that S18 is missing until C-2 closes.

### Notes (do not block)

- `LAYOUT_INDENT` and `LAYOUT_KEY_SEPARATOR` are `pub` (renderer/src/canonical.rs:171-173). Their only callers are inside canonical.rs, so `pub(crate)` would be enough.
- `stage` and `Staged` are `pub`. They have a product caller (`replace`, store.rs:156-158), and a crash test uses them (kernel/tests/project_save_crash.rs:36).
- surfaceRegistry.ts:136 says the folder comes from `the picker's own answer`, `never a script's`. The exception is an instrumented build, where `e2eSaveProjectToFolder` supplies it (App.tsx:877-882). That is a dev-only case: name it in that row's source comment.
- A second save click while one is in flight is dropped with no notice (App.tsx:2065 and saveProject.ts:95). This is disclosed in the doc comment.
- `save_project_panicked` (frontends/shell/src-tauri/src/commands.rs:173) is not in SKP-V0 §11.4's code table. It follows record_step's precedent at line 151.

## Checks 1 to 13

1. **§8, item by item.**
   - Item 1: holds. The project-file scan `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name` is at kernel/tests/no_generation_in_persisted_artifacts.rs:922.
   - Item 2: the open-path half is step 2's. At save, `judge` follows no link and holds no handle (kernel/src/project/resolver.rs:63-119).
   - Item 3: holds. A temp file is created with create_new, written, synced, then renamed (store.rs:105-152). The reply comes after that. Only names matching the exact pattern are removed (store.rs:169-186).
   - Item 4: no lock in step 1. See C-3.
   - Item 5: the first-folder refusal holds (mod.rs:248-258). The question is step 2's.
   - Item 6: only `Lineage::NotKept` is written (mod.rs:272), and a kept lineage is refused (mod.rs:259-264).
   - Item 7: the ADR texts are approved (check 3 and check 4).
   - Item 8: kernel messages state facts (mod.rs:181-202 and error.rs:168-217). No refusal is silent. A picker cancel shows nothing, which is the operator's own act.
   - Item 9: fails, by C-2 and C-3. Flag 2: Amendment 16 item 1 is a record that item 9 allows "as ruled". The human delegated `from_bytes` to the custodian (2026-10-23 directive, line 20, read earlier in this run). Amendment 16 names the consumer and its gate, PLAN.yaml:5705 notes the question, and the PR body must name both (D-7). It does not go to the human.
   - Item 10: no new dependency. No `cfg` in the product code under kernel/src/project/; the only hits are `#[cfg(test)]`. The data directory comes from the existing `data_dir` (store.rs:26 and 56-59). The lock diffs are empty (packet).
   - Item 11: no undo claim (SKP-V0.md:1344) and no figure ("No timing claim is made", store.rs:30).
   - Item 12: overruns are recorded as class 8 (Amendments 9, 13, 15 and 17). Amendment 14 is class 9 and was declared before its code. No verify-mutation run is called an observation: the P2/P3 report says so at line 108, the O1 report at line 97 and the P5 report at line 51.
   - Item 13: see check 10.
   - Item 14: holds (check 4).
   - Item 15: holds (resolver.rs:15-16).
2. **ADR-006.**
   - `save_project` is class 2. The transactional unit is `project.spatial`, replaced whole or not at all.
   - The machine-store files and the history's moves are written outside that unit. SKP-V0.md:1343-1344 declares this, and item 62 discloses what stays on failure.
   - `binding_pick_project_folder` mutates nothing.
3. **ADR-036.**
   - Amendment 1 at docs/adr/ADR-036-…md:241-281 matches Annex A (compared earlier in this run).
   - The code follows it: identity in mod.rs:57 and 87-107 and store.rs:49-54; store layout in store.rs:14-15 and 56-64; folders.json in store.rs:188-243; the view as HexF64 in mod.rs:392-408.
4. **ADR-022.**
   - Amendment 2 at ADR-022:80-81 matches Annex B. Annex B is built from three of the human's lines, not the two §9 names (form:745 @ main; Amendment 1 item 1 C-2 corrects §9). The text matches the three-line construction.
   - Decision 3: the layout is written only by `to_line_oriented_string` (canonical.rs:178-221). The kernel's writer calls it. The hashes go through `sha256_hex` (mod.rs:374).
5. **Principles.**
   - 4 holds: the bar entry is at layout/actionRegistry.ts:78, the class-A row at surfaceRegistry.ts:88.
   - 5 holds: `save_project` is SKP, and the folder is a request field.
   - 7 holds as declared: the save runs on `spawn_blocking` (src-tauri/src/commands.rs:154-174), and the form says it is not cancellable (form:156 @ main; SKP-V0.md:1346).
   - 8 fails on two points, the judgment (C-2) and the picker (C-4).
6. **R9 and the view.**
   - The file holds `crs` from the admission (mod.rs:366-376) and the centre and zoom as HexF64.
   - A coordinate below 1e-6 is never a JSON number, so it stays bit-exact.
   - Proof: E-SAVE's READBACK-VIEW (frontends/shell/e2e/project.mjs:20-21) and mutation m-view, observed at 1c807fc6 (project.mjs:33-36).
7. **Seams.**
   - shell → `save_project` → kernel → file: touched. The TS type matches the Rust struct (types.ts:339-355 and commands.rs:732-739). E-SAVE is the real-shape proof. The rule fails at C-2.
   - writer → canonical: touched, and holds. `a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open` is at project_save.rs:259.
   - kernel → `SkpHost`: touched as a read only. The save reads the catalog entry and runs the live check (mod.rs:322-327). Reopen is step 2's.
   - resolver → engine path: `judge` reads `ds.path()` (mod.rs:268). K-O1 is step 2's.
   - `recover` → recovery: not touched. `recover` (kernel/src/session_history.rs:1087) has only test callers. Nothing at the head claims it is closed (a Grep of the records finds no such claim). Flag 8 holds as stated.
8. **Round 8 and 1b's OPEN-6.**
   - Step 1 adds no consumer.
   - Left for step 2: `from_bytes`, OPEN_LOCK if it moves there, K-O1 and K-O10, and the view write path (Amendment 12 item 2).
   - Left for step 3: `recover` (K-C3).
9. **Protocol.** `skp/0.13` (protocol/skp/src/v0/mod.rs:123) carries `save_project`, `skp.project_folder_not_given` and the FillColorMatch widening (commands.rs:556-624) in one commit, ffc039d1 (Amendment 9 item 1). This agrees with OPEN-7-1 (a) and Amendment 8. The wire change and its version agree.
10. **Strings, quotes and mutations.**
    - S1, S2, S3, S5, S6, S7 and S23 state only what the code does: saveProject.ts:30-41 and src-tauri/src/commands.rs:273.
    - S4 carries D-3's message. S18 is missing (C-2).
    - Quotes: the only passages in the diff presented as quotations are ADR-036 Amendment 1 and ADR-022 Amendment 2, and both match their sources.
    - Mutations: E-SAVE's three name their step, their failure and commit 1c807fc6 (project.mjs:26-42).
11. **Records.**
    - Item 62: wrong in one clause (C-5). Its other clauses are true: the path (store.rs:56-64 and log.rs:370-381), locations.json at every save (mod.rs:282), folders.json at a first save (mod.rs:284-293), a new identity per open (mod.rs:240-245), and nothing removing the folders (the Grep of `remove_` finds only temp-file removals).
    - Part AD (frontends/shell/MANUAL-WALKTHROUGH.md:2007-2026) is true: the picker title is at src-tauri/src/commands.rs:273, the member order at kernel/src/project/file.rs:170-175.
    - kernel/README.md:32-34 and 375-400 are true, and every test named exists (Grep). D-5 is its one gap.
    - The e2e/README entry (frontends/shell/e2e/README.md:826-840) is true.
    - Doc comments in kernel/src/project/: D-1 and D-2. Also, mod.rs:20-21 says `project.spatial` is the only file written in the folder. The temp file is written there too, through `replace`, which the sentence names, so I make no finding.
12. **Flags 3, 5, 6 and 7.**
    - Flag 3: C-4.
    - Flag 5: the probe's Cargo.toml (spikes/b2-1c-onedrive-probe/Cargo.toml:1-8) has no dependencies, is its own workspace and adds no lockfile. That is not a dependency red line. It carries no `license` field. Root Cargo.toml:35-36 writes the field out for excluded crates; this probe is not one of them. I note this for the custodian and make no finding.
    - Flag 6: package.json:41 adds a script only. Nothing new is installed.
    - Flag 7: the departures in Amendments 9 item 3, 12, 13, 14 and 15 item 4 are each recorded in the right class. Amendment 14 item 6's security-posture analysis states that the posture is unchanged and changes nothing. None of the departures needed the human.
13. **Scope.** Every file in the packet's numstat falls in §2.11's groups or in an amendment's additions. admitDataset.test.ts and client.test.ts each hold 4 `skp/0.1x` literals, matching their 4/4 numstat. Class 8 is recorded.

## Replacement words (none is the human's wording)

- **W1, KNOWN-LIMITATIONS.md:503.** Replace the sentence that begins `Both files are written before` with:
  "Both files are written before `project.spatial` is replaced. A first save that fails after the store folder is made leaves that folder and any file it wrote there, and the next save of that open is a first save again, which makes another identity and another folder. A later save that fails at the replace leaves the `locations.json` it wrote."
  - Clause 1 holds at mod.rs:282-295.
  - Clause 2 holds at mod.rs:279-294 (no removal) and 296-304 (push only after the replace).
  - Clause 3 holds at mod.rs:244 and saveProject.ts:111 (the picker asks again).
  - Clause 4 holds at mod.rs:282 and 295.
- **W2, commands.rs:741-743.** "Whether the session history took the `saved-here` mark. The project file was written in both cases; `withheld` says that the history holds no recorded step for the dataset, that the recorded steps do not reach the saved workspace, or that the history could not take the record move or the line."
  - Clause check: mod.rs:306, 349-361 and 333-336; the no-step meaning is at mod.rs:147.
- **W3, SKP-V0.md:1338, last sentence.** "`withheld` means the history holds no recorded step for the dataset, the recorded steps do not reach the saved workspace, or the history could not take the record move or the line." Same check as W2.
- **W4, mod.rs:177.** "`locations.json` or `folders.json` could not be written in its format; the refusal names the file." Clause check: mod.rs:281 and 485-488; store.rs:212-216 and 292.
- **W5.**
  - surfaceRegistry.ts:12, :28, :32 and :75: "six" becomes "seven".
  - surfaceRegistry.ts:91: "The seven binding-local commands" becomes "The eight binding-local commands".
  - surfaceRegistry.ts:70: "eight" becomes "nine".
  - surfaceCompleteness.test.ts:23, :111, :198 and :205: "six" becomes "seven".
  - surfaceCompleteness.test.ts:112 and :200: "a seventh" becomes "an eighth".
  - actionRegistry.test.ts:132: "the twelve ids: the eight of milestone 2 and, for milestone 3," becomes "the thirteen ids: the eight of milestone 2; for milestone 3,". Then, before `", () => {`, add "; and project.save (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 12 item 1)".
  - Clause check: the rows and the list are at surfaceRegistry.ts:81-89 and 98-167; the expected list is at surfaceCompleteness.test.ts:203.
  - The observed-failure comment at actionRegistry.test.ts:130 stays: it is history at ca98a85d.
- **W6, KNOWN-LIMITATIONS.md:504.** Replace "so they are named in words, with no hash, and their pins follow on main after the merge." with "so they are named in words at that commit, with no hash." Clause check: the spans are verified in check 11.

## For the human

1. **C-2.** OPEN-4 (A) is your ruling. Either step 1 carries S18 (a wire member plus the notice, by class 9), or you rule it deferred to step 2 and it is disclosed on the form. If the custodian reads OPEN-7-1 (a) as fixing `skp/0.13`'s wire to the one commit ffc039d1, a second `skp/0.13` commit also needs your word.
2. **Form §1** (form:156 @ main) describes the save as "one bounded write, one flush and one rename". The code does up to three file writes, a read of the existing file and up to five rename attempts (mod.rs:259-295 and store.rs:133-152). The approved form is append-only, so this is for your sight only.
3. **C-1** is your typed words. Closure is a byte-copy, with no decision needed.

## The packet's gaps (one line each)

- The PR body: base B, the P6 list, the from_bytes consumer and `recover`'s status.
- No pointer to ADR-022's owed Note 2026-11-05 (C-1).
- The Part 1 rulings directive and the OPEN-4 (A) text were not cited in the packet.
- `session_history.rs` (643/87) carries no flag. I read it only at `default_root`, `recover` and the save's two calls (mod.rs:345-363).
- CI state at H, with its read time.

Model: Opus 5.5 (claude-opus-5-5).
