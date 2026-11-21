Reviewed: cut/1c-p5-words at 4f09194c44c84f8f4e09b9592f53bd35e98794c9 (the custodian's filing note, 2026-11-21: P5's single gate, attempt 1 (ADV-2026-11-16-10 R1 (b)); Read 1, Bash 71, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-21T06:10:39Z to 2026-11-21T06:21:54Z by its transcript; the report below byte for byte from its hand-back of 12813 bytes, sha256 0dafe9e8704909552fb7dadb3d50c442623871bdf427b24a7557b093a8c34ae2, with seven clock times of its check 5 written as <t> by the custodian, with this note in its first line and one final newline; its F1 to F4 went to the advisor unreworded and were ruled in ADV-2026-11-21-07), gate, reviewer
Gate: reviewer on P5 at 4f09194c
Verdict: FAIL
Reviewed: cut/1c-p5-words @ 4f09194c44c84f8f4e09b9592f53bd35e98794c9 (base H0 af3cd53cc8dff9e3022e309df5dd3f9b52556e3f)

The gate fails on three clauses of the ruled words that the code at H does not support (F1 to F3). Under the ruling's item 22 they go to the advisor unreworded. A fourth clause (F4) is only partly true. The code side is closed: P5 changes one string, and the run ties to H. One conflict to flag: my definition's wording-blocks rule would have me write replacement words, because these are not the human's sentences. The brief and the ruling's item 22 route an untrue clause to the advisor unreworded. That ruling is later and specific to this piece, so I followed it and wrote no replacement words. The custodian can decide otherwise.

Brief: read whole, sha256 a19fa13bea789ec8f6f11f5a14684841d2e1238956d8ecac79967b6691627a20. Start state:
- `rev-parse HEAD` gives 4f09194c44c84f8f4e09b9592f53bd35e98794c9.
- The porcelain is empty.
- `ls-remote` for refs/heads/cut/1c-p5-words gives the same id.
- The branch holds one commit over H0.

## The five checks

**1. Out-of-scope and Scope** (read Amendment 70 first, then `git diff --stat` and `--numstat` H0..H).
- **Files:** exactly the four Scope names:
  - KNOWN-LIMITATIONS.md: 35 lines added, 7 removed
  - MANUAL-WALKTHROUGH.md: 12 added, 4 removed
  - surfaceRegistry.ts: 2 added, 2 removed
  - kernel/README.md: 1 added, 1 removed
- **Budget:** 64 changed lines against the declared 100 (§21c's 150 lines and 8 files are not near).
- **Out-of-scope line:**
  - Nothing under `protocol/` and no ADR file changes.
  - The only code change is the effect string of `binding_pick_project_folder`, and no dependency is added.
  - The walkthrough strings stay `[P6 placeholder]`.
  - The line holds. It holds only because P5 changes words and no code. F2 is a cancellation statement that overstates, and it must be corrected so it does not stand as a cancel property the code lacks.
- **Tests+mutation line:** it says the check is "run by the worker and again by the reviewer". I ran no heavy command, as the brief orders (see D6).

**2. The blocks match the ruling byte for byte.**
- I read `chk-p5a.mjs` in the scratch folder and ran it at 4f09194c.
  - All 27 fences of items 8 to 20: old texts went 1→0 and new texts 0→1. Bad 0, rc 0, nothing outside Scope.
  - The ruling is LF and is the same at H0 and H (`git diff --quiet` over `state/`).
- What the script shows, and what it does not:
  - It does show what it claims: each fence's count across the four files, which are joined by NUL so no match can span two files.
  - Its OK test is symmetric (0→1 or 1→0), so it alone would not catch a reversed direction. I read the directions in its output, and they are right.
  - Its matches are not anchored to the start of a line.
  - It checks neither position nor other changes, so I checked both by reading:
- **Nothing else changed.** A node script compared each long changed line at H0 and H by common prefix and suffix.
  - Items 4 and 10 (lines 80 and 137): only the ruled sentence changed, with the final "." kept.
  - The comments of items 4 and 10 (lines 81 and 135): only the clause was added before ` -->`.
  - Item 62's comment: replaced whole.
  - Every other changed line is a ruled fence.
- **Placement:**
  - Item 69 follows item 68, and item 75 is the last line of the file.
  - Rows AD2 to AD5 follow AD1, and their four log rows follow AD1's log row.
  - The heading, intro, Before paragraph and log lead-in are each replaced where they stood.
  - The README and registry lines are replaced in place.
  - No item 69 to 75 existed at H0.

**3. Every clause of items 8 to 20 against the code at H.** Read first:
- `StepRecorder::{adopt_project, reopened, end_session, create}` and `copy_under` in kernel/src/session_history.rs, with `Projects::history`.
- `open_under` in kernel/src/skp.rs, and `open_inner`, `read_kv_metadata`, `probe_schema` and `cancellable` in engine/src/dataset.rs.
- `ConsoleRow` and `RefusalBlock`, `formatRefusal`, and `admitProject` in openProject.ts.
- `handleReopened` in App.tsx.
- `pickProjectFolder`'s two callers: App's `createProjectSaver` `pickFolder` and `AdmissionPanel.handleProjectPick`.
- For AD2 to AD5: `runAdmitPath`, `openLivenessText`, the Cancel button, `OPEN_PROJECT_*`, `project.open` / `open-project`, `PROJECT_FOLDER_PICKER_TITLE`, `QUESTION_*`, `OPEN_ELSEWHERE_OTHER_NOTICE`, `reopenRefusalPlace`, `close_dataset` → `release_ended`.

Then the rest:
- `Projects::{save, open_project}`, `asks`, `is_known`, `data_at`, `view_state`, `write_machine_file`, `skp_error_of`, `bounded`.
- In store.rs: `ProjectLock::try_lock`, `KnownFolders::{with_same, moved_to}`, `projects_root`, `record_dir`.
- `judge`, `check_inside` and `reached_through_link` in resolver.rs.
- `read_lineage`, `lineagePlaces`, and `reopenApply`.
- In saveProject.ts: `failureOf`, `notSavedNotice`, `MARK_WITHHELD_NOTICE`.
- `shownText.ts`.

Results:
- **Item 70:** true. Item 73: true. Item 71: true; `lineagePlaces` pushes S17 for every kept lineage, because `read_lineage` returns a non-null `previous_file` whenever the folder file is not recorded. Item 72: true.
- **Item 10's sentences:** true.
- **Item 4's new sentences:** true.
- **Item 19's string:** true for both call sites.
- **AD2 to AD5:** steps and outcomes match the code.
- **Item 69:** true.
- **Item 62:** true except F1.
- **Item 74:** true except F3 and F4.
- **Item 75:** true except F2.

**4. The comments** (items 69 to 75, item 62's rewrite, the clauses added for items 4 and 10).
- Each says it is the advisor's wording under the delegation, not the human's, and names ADV-2026-11-21-06 with its item.
- None quotes a ruling, form or report.
- Every symbol named exists at H, checked by grep: `Lineage::NotKept`, `handleRelink`, `fileNotFoundNotice`, `RELINK_CHOICE`, `user_data_dir`, and the rest.
- The two places the applier flagged:
  - **Item 62's `Place` / `ProjectLock` text:** the variants are right (`Known`, `Remember`, `Copy`). `try_lock`'s description is right (`create_dir_all`, then create with no truncate, never written). It is imprecise on the lock refusal (D5).
  - **`judge` in item 69's comment:** true as an "only when", but it leaves out the spelling condition (D7).
- Findings D1 to D5 and D7 follow. The comments of items 74 and 75 also carry F3 and F2.

**5. The run** (read `p5a-run.sh`, `p5a-rc.txt`, the four logs, `p5a-hb-1.md`, `p5a-commit.log`, the file mtimes and the reflog).
- **Return codes:** all four are 0 (bundle-viewer `npm ci` and `build`, shell `npm ci` and `verify`).
- **Ties to H:**
  - The four Scope files were last modified at <t> and <t> (<t>). `p5a-run.sh` was written at <t>, so every edit came before the run.
  - `verify` ended at <t>, and H was committed at <t>. The reflog shows nothing between H0 at <t> and H.
  - The porcelain is empty now.
  - So the run read H's tree.
- **The Console's tests pass:** vitest reports "Test Files 123 passed (123), Tests 1570 passed (1570)". src/ holds exactly 123 test files (the config includes `src/**/*.test.ts(x)`), so the eight in src/console are among them: surfaceRegistry, surfaceCompleteness, consoleLanguage, and the rest.
- **No formatter:** package.json has no format, prettier or eslint script, so the brief's statement holds.
- I do not doubt the run and reused it (ADV-2026-11-16-06).

## Findings

### Words found untrue (Correctness; each blocks; for the advisor, unreworded)

**F1. KNOWN-LIMITATIONS item 62** (ruling item 9), the clause "the line that says the project was not saved then shows a message that begins `open.lock:` and the operating system's error text".
- **The code:** in `Projects::save`, the `lock_refused` closure gives `SaveFailure::MachineStore { what: store::OPEN_LOCK, .. }`.
- `skp_error_of` maps that to `SkpError::project_file_unwritable(&detail)`, whose message is `the project could not be written: {detail}` (protocol/skp/src/v0/error.rs).
- The shell's `failureOf` takes `skpError.message`, and `notSavedNotice` wraps it.
- **What the operator sees:** `… The project was not saved: the project could not be written: open.lock: <OS text>`. Only the `detail` field begins with `open.lock:`.
- **Reach:** ordinary use (the store folder cannot be written).

**F2. Item 75** (ruling item 15), the clause "it reaches the engine's own queries during the open".
- **The code:** in `Dataset::open_inner` (engine/src/dataset.rs), `read_kv_metadata(conn, &path_str)` (the footer read) and `probe_schema(conn, &path_str)` run with no `CancelToken`.
- The token is first attached in `read_file_names`, then in `sanity_check` and `admit_identity`.
- The engine's own comment names "an uninterruptible prelude before `cancel.attach`".
- The form's H5 expects a Cancel to end the open "at the engine's next check, after the blocking read returns".
- **Effect:** the Cancel does not reach the first two queries. Those are the reads that meet an online-only file first.
- **Reach:** ordinary use. This is a cancellation statement (ADR-018 class).
- The item's comment repeats it: "cancellable … attaches the token's interrupt to the engine's DuckDB queries, so a cancel reaches them". That comment is the applier's, so it can be fixed without the advisor.

**F3. Item 74** (ruling item 14), the clause "each character that does not show, or that changes the direction of text, replaced by … U+FFFD".
- **The code:** `REPLACED` in frontends/shell/src/project/shownText.ts covers only Cc (U+0000–U+001F, U+007F–U+009F), U+061C, U+200E, U+200F, U+202A–U+202E, U+2066–U+2069, U+2028 and U+2029.
- **What is not replaced:** invisible characters such as U+200B, U+200C, U+200D, U+2060, U+FEFF and U+00AD. They reach the refusal block unchanged.
- **Reach:** ordinary use, through a hand-edited project file or a folder name holding one. This is a claim of a guarantee.
- The item's comment repeats it ("REPLACED (the characters that do not show …)").

**F4. Item 74**, the clause "The session log takes the same text". Partly true; it does not block on its own, but it goes with F1 to F3.
- **The code:** `admitProject` in openProject.ts logs `logSessionEvent("reopen-refused", \`${refusal.code}: ${refusal.message}\`)`.
- The log takes the bounded code and message. It does not take the fields the refusal block shows.

### Evidence
None. The run ties to H (check 5).

### Documentation (each must be fixed in this PR before the merge; none blocks)

- **D1. Item 4's added comment clause** says "The last sentence of the paragraph above is the advisor's wording". The ruled text in item 16 is two sentences ("Opening a saved project … not restored." and "Nothing restores them from the session record."). Item 21 asks the comment to say which sentences are the advisor's. As written, the first of the two reads as someone else's wording.
- **D2. Item 10's added comment clause** says "The last sentence of the On-main paragraph". The ruled replacement in item 17 is four sentences, the first a rewrite of "Nothing reads them back".
- **D3. Item 75's comment:** the `cancellable` overclaim. See F2; fix it with F2.
- **D4. Item 74's comment:** the `REPLACED` description. See F3; fix it with F3.
- **D5. Item 62's comment** says "the refusal built with what set to store::OPEN_LOCK in Projects::save and Projects::open_project (the folder or the lock could not be made or taken …)". In `Projects::open_project`, a held lock (`LockRefused::Held`) maps to `OpenFailure::OpenElsewhere`; only `LockRefused::Io` carries `OPEN_LOCK`. Also, "the only removals under kernel/src/project/ are of temporary files" needs "outside the test modules": resolver.rs and store.rs each call `remove_dir_all` in `#[cfg(test)]`.
- **D6. Form Amendment 70, Tests+mutation line:** "again by the reviewer" did not happen. The reviewer reused the applier's run under ADV-2026-11-16-06, by the brief. The closing amendment must record the reuse, or the custodian re-runs the check after the other piece's e2e runs.
- **D7. Item 69's comment:** its description of `judge` gives two of the three conditions. It leaves out the canonical spelling (`Why::NoCanonicalSpelling`) that the item's own sentence names.

### Not blocking (named for the source comments)
- **Item 19's effect text**, "the picker's own answer supplies the folder, never a script's", now also covers the reopen. In an instrumented (dev) build only, `takeSlot`/`e2eFolderRef` and `e2eSaveFolderRef` supply the folder. That is a dev-only switch, so it does not block; it should be named in the source comment.
- **AD5's "new empty folder inside OneDrive"** is not listed in the Before AD2 to AD5 paragraph.

Model: Opus 5.5 (claude-opus-5-5), as the harness gives it.
