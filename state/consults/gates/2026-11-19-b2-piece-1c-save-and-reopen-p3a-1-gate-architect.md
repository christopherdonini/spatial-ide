Reviewed: PR #334 at c905c7ea06cbe9e354c346e3a7777c3a2546bd85, gate, architect
Branch: `cut/b2-piece-1c-p3a-1` @ c905c7ea06cbe9e354c346e3a7777c3a2546bd85 (H). Merge base B = 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d.

Verdict: PASS WITH NOTES

The code's Correctness and Evidence are closed. There are two Documentation findings, D1 and D2. Each comes with replacement words below and must be fixed before the merge. Neither sentence is the human's wording, so the worker applies the words with no re-gate and the PR body lists them. The advisor's items are A1 and A2, in the last section.

Gaps in my reads: I have no shell, so I ran nothing and recomputed no hash. Every run result below is the worker's (its two reports) and stays unconfirmed until the reviewer's runs.
- The tests file's diff (`git diff B...H -- kernel/tests`). I read H's file at lines 1–260 and 930–1169 instead.
- The diffs of each of the five commits, and the bodies of their messages (the reports give only the subjects).
- The PR body.
- CI at H.
- `project_save_crash.rs` and the rest of the shell.
- docs/02, docs/08, docs/10, ADR-006 and `docs/PREREGISTRATION-TEMPLATE.md` (classes 8 and 9).
- ADR-036 beyond its Amendment 1 item 3.
- PLAN.yaml.

## Findings

**Correctness: none.**

**Evidence: none that blocks.** These are owed at the merge, not at this gate:
- CI at H on three platforms. Off Windows, K-O24 has not yet run at H (Amendment 37 item 9, item 7).
- One E-SAVE run (Amendment 36 item 13).
- The reviewer's re-observation of the mutations.

**Documentation (must-fix before the merge):**

**D1. The residual in `remove_stale_temps`'s doc is narrower than the code** (`kernel/src/project/store.rs:201-207` at H).
- The doc says "into one empty folder".
- A first save checks only that `project.spatial` is absent (`kernel/src/project/mod.rs:278-280` at H). It does not check that the folder is empty.
- A later save whose file is missing goes ahead too: `read_existing` gives `None` on NotFound (`mod.rs:281` and `mod.rs:536-538` at H).
- The usual case is a folder that holds the data. The sentence names only a subset of that case. It claims no guarantee, so this is Documentation, not Correctness.
- The word "empty" comes from Amendment 30 item 4 (b). That item is not edited (see O8).

Replacement for lines 201-207:
```
/// Remove the temp files a crash left in `folder`, after a successful rename: the files named by
/// exactly the pattern ([`is_temp_name`]), and nothing else. Not excluded: two saves of different
/// identities into one folder that holds no `project.spatial`, between `Projects::save`'s check of
/// the folder and the rename. Each holds only its own identity's open lock ([`ProjectLock`]),
/// which does not exclude the other: the one that renames first can remove the other's temp here,
/// and the other's rename then fails as [`SaveError::RenameKeepsFailing`]; if the other renames
/// before that removal, its project file replaces the first one's.
```
Clause check (all at H):
- **"after a successful rename":** the call is in the `Ok(())` arm (`store.rs:155-164`).
- **"exactly the pattern … nothing else":** `store.rs:212-216`.
- **"two saves of different identities into one folder that holds no `project.spatial`":** `mod.rs:278-281` and `mod.rs:536-538`.
  - Two saves of one identity cannot overlap. In one `Projects` the `saved` mutex is held for the whole save (`mod.rs:254`). The identity is minted inside the first save (`mod.rs:263`), so no other process holds it at P3a-1.
- **"between … check of the folder and the rename":** from `mod.rs:278`/`281` to `store.rs:155`.
- **"each holds only its own identity's open lock":**
  - a first save takes it at `mod.rs:333-334`, before the replace at `mod.rs:344`;
  - a later save's lock is the saved entry's (`mod.rs:132`);
  - the lock is per identity (`store.rs:240-244`).
- **"can remove the other's temp":** temp names are random (`store.rs:117-120`), and the removal matches any of them (`store.rs:212-216`).
- **"the other's rename then fails as `RenameKeepsFailing`":** `store.rs:154-174`.
- **"its project file replaces the first one's":** `store.rs:155`.
- Every line is 100 columns or fewer. The line count is unchanged.

**D2. `Staged::commit`'s first sentence lost its qualifier with the link** (`store.rs:142-143` at H).
- "then flush the folder" is now unqualified.
- `sync_folder` flushes nothing where the folder cannot be opened, which its own doc says is always the case on Windows (`store.rs:183-192` at H).
- The removed link was the only route to that caveat from this `pub` doc.
- The module doc disclaims durability (`store.rs:13` at H), so no guarantee is claimed: Documentation.

Replacement for lines 142-145:
```
    /// Rename the temp file over `project.spatial`, trying again as declared, then flush the folder
    /// where the platform lets a program open it (`sync_folder`; where the open is refused,
    /// nothing is flushed), and remove the temp files a crash left. Once the rename has succeeded,
    /// the save stands: a flush that fails after it is written to standard error, as the error's
    /// kind only, and refuses nothing (D-16; the form's Amendment 30, item 3, O-8).
```
Clause check (all at H):
- **The rename and its retries:** `store.rs:154-171`.
- **"where … open it … where the open is refused, nothing is flushed":** `store.rs:188-191`. This states only what the code does, and adds no new claim about any platform.
- **The temps removed:** `store.rs:163`.
- **"a flush that fails … refuses nothing":** `store.rs:157-164`.
- `sync_folder` is written in backticks with no brackets, so rustdoc makes no link to the private item.
- Every line is 100 columns or fewer.
- By my count, `store.rs` comes to about 14 of 20 against B. The custodian recounts.

**Observations:**
- **O1. Note 4's row** (ADV-2026-11-19-05; Amendment 37 item 9) is true but incomplete. Every write comes after the lock (`mod.rs:338-343` at H), and no `?` after the lock cleans anything up. So a refusal at the project file also leaves `locations.json` and `folders.json` in the identity's folder. An ordinary user reaches this: K-O24's case is a project folder that refuses a new file. That was main's leftover already; P3a-1 adds `open.lock` to it. Draft A1 below.
- **O2. What the user is told changes.**
  - Before P3a-1, a machine store that could not be made failed at `create_dir_all`, and the message named "the project's machine folder" (`mod.rs:338`).
  - It now fails first in `try_lock` (`store.rs:241`), and the message names `open.lock` (`mod.rs:323-332`, `mod.rs:208` and `mod.rs:493` at H).
  - `Held` gives "open.lock: another handle holds it". Ordinary use cannot reach it at a first save (Amendment 36 item 6 (a)).
  - Draft A2 below.
- **O3. For P3a-2/P3b.** In D1's second branch, the losing save's `Projects` keeps a saved entry whose folder now holds the other identity's file. Its next save checks only the lineage and that the reader accepts the file (`mod.rs:281-287` at H). It does not check the file's `project`, so it overwrites the other project with no word to the user. This was so at main and is not P3a-1's to fix. Proposed: P3a-2 or P3b declares an identity check at a later save, or a "not covered" row for it.
- **O4. For P3b.** The lock is not freed at `close_dataset` or at a session end, by declaration (Amendment 36 item 1, "Not P3a's"). Once P3a-2 lands, a reopen in the same run of a project saved earlier would meet this process's own lock and be refused as `Held` until P3b frees it. P3a-2 has no shipped caller before P3b, so ordinary use does not reach this. P3b's declaring amendment orders the freeing no later than the binding of `open_project`. Separately, the module doc's "for each identity it saved first" (`mod.rs:23-24` at H) needs P3a-2's edit once a reopen registers its lock.
- **O5.** In the shipped app there is one `Projects`, managed for the app's lifetime (`frontends/shell/src-tauri/src/lib.rs:457-462` at H). So each first-saved open keeps one file handle until the app exits. The count is bounded by the number of opens, and P3b frees them at close. No perf claim is made (docs/08).
- **O6. K-O17's mutation also drops the registration.** `_lock` is not an `Option`, so `None` skips the push at `mod.rs:345`. Neither K-O17 nor K-S13 depends on the registration, so both fail for their stated causes.
- **O7. K-O24 cannot pass without reaching its assertions.**
  - It has no early return.
  - A deny entry that is not applied, or a read-only folder that still takes a file (a root runner), makes the save `Ok`, and the test fails at `expect_err` (`kernel/tests/project_save.rs:1160` at H).
  - A failed `icacls` fails at `project_save.rs:1146` at H.
  - A panic inside `save` would leave the deny entry, on the test's temp folder only. The next run's removal of that folder is argued (Amendment 37 item 3), not observed. This does not matter to the claim.
- **O8. For the advisor.** D1 departs from Amendment 30 item 4 (b)'s word "empty" so that the doc meets the code. The form is not edited.

## Checks

1. **Design.** No finding.
   - Every hunk lies in Amendment 36 item 6 (a)'s regions or Amendment 37 item 8's addition:
     - the module doc;
     - `SavedProject`;
     - `save`'s doc and body;
     - `write_machine_file`'s doc;
     - `Staged::commit`'s and `remove_stale_temps`'s docs.
   - There is no added `pub` line in the product diff.
   - Every change stays inside `kernel/src/project`. There is no wire, protocol or MCP change, and the existing code `project_file_unwritable` is kept (`mod.rs:493`).
   - The lock lives in the saved entry (`mod.rs:132`, `mod.rs:347-353`), as P-9 (a) rules.
   - Departure (c) changes no behaviour. `SavedProject` is used only at `mod.rs:123`, `mod.rs:255` and `mod.rs:347`. The lookup now clones the same three values the old code took from the cloned entry (`mod.rs:255-259`).
   - Pre-committed producer: `ProjectLock` gets its product caller. The call chain is the shell's `save_project` (`frontends/shell/src-tauri/src/commands.rs:171` at H), then `Projects::save_project` (`mod.rs:380-382`), then the lock at `mod.rs:334`. The seam's tests, K-O17 and K-O24, are built from the real shape.
2. **The lock's rule.** No finding; for the "not covered" row, see O1.
   - The lock is taken after both documents are built (`mod.rs:304-319`) and before `create_dir_all` (`mod.rs:333-338`).
   - Nothing before the lock writes a file. `dataset_uri` is in memory only (`kernel/src/session_history.rs:275-278` at H).
   - `LockRefused` maps to `MachineStore` with `what: store::OPEN_LOCK` (`mod.rs:323-332`).
   - The lock is kept by the push and freed when `Projects` is dropped (`store.rs:253-257`).
   - A first save refused after the lock drops it at each `?` (`mod.rs:338-344`).
   - A refused or crashed first save leaves the identity's folder and `open.lock`, and also whichever documents were written. A crash also leaves a temp (O1).
   - **Two processes, or two `Projects`:** every first save mints a fresh identity, so two first saves never meet on one lock. A later save happens only in the `Projects` that holds the entry, so the lock settles nothing a user can see until P3a-2's reopen (K-O4).
   - **What the lock does not settle:**
     - the race between different identities in one folder (D1, O3);
     - freeing at close or at a session end (P3b, O4);
     - a later save that does not check the identity of the file it replaces (O3).
3. **The docs against the code.**
   - The module doc (`mod.rs:14-19` and `mod.rs:23-26`): true at H.
   - `save`'s doc (`mod.rs:234-240`): true at H.
   - `write_machine_file`'s doc (`mod.rs:548-550`): true at H, because 8 random bytes give 16 hex characters (`mod.rs:553-556`).
   - `_lock`'s doc (`mod.rs:130-131`): true at H.
   - The code comment (`mod.rs:320-322`): true at H, and it cites Amendment 36 item 6 (a) correctly.
   - `remove_stale_temps`: D1.
   - `Staged::commit`: D2.
4. **The tests against their claims.**
   - **K-O17:** fails on "taken", or on no line from the child (`project_save.rs:1117-1118` at H). The length assertion holds because `try_lock` never writes the file (`store.rs:243`).
   - **K-S13:** the exact list fails when `open.lock` is missing (`project_save.rs:974-978` at H).
   - **K-O24:** fails if the lock is kept (`project_save.rs:1167-1168` at H). It cannot pass vacuously (O7).
   - **T14:** unedited (`project_save.rs:1010-1047` at H). Its passing on Windows shows that nothing creating the identity's folder, `try_lock` included, runs before the documents are built. Mutation (b) shows that T14 detects such a folder. No test separates the lock from `create_dir_all`, or shows that the lock comes before the machine writes. That rests on reading `mod.rs:333-343`, and only `Held` or `Io` could make it visible.
5. **Class 8.** The worker's counts, 56/60, 9/20 and 127/130, agree with the hunks I read:
   - `mod.rs` 44/12, summed by region;
   - `store.rs` 8/1;
   - `project_save.rs` 125/2, made of 1 module-doc line, K-S13's 2/2, and lines 1048-1169.
   Nothing is outside the part's scope.
6. **The departures.** None needs more than its record.
   - Amendment 37 item 6 (a), (b) and (e) stand as recorded. (c) is checked under check 1. (d) is the reviewer's to confirm.
   - **`--lib` run whole:** the run was widened, not narrowed. Record only.
   - **The volume:** the clause's purpose is met for the deny half.
     - K-O24 at H passes only if staging a new file was refused on D:.
     - Under its mutation it failed at `:1168`, past the staging assertion at `:1162`, so on D: too.
     - The removal half is clean-up only. The reviewer's probe on D: covers it.
7. **Discharge claims and verbatim quotes.** I found no defect.
   - No comment in the diff presents a quote.
   - The cites "Amendment 36, item 6 (a)" and "Amendment 30, item 4 (a)" resolve.
   - The commit subjects claim no "done". I did not read the bodies (see Gaps).
   - The mutation lines record applied runs, not `verify-mutation` runs.

## Drafts for the advisor

**A1 — note 4's row** (the advisor's wording, ADV-2026-11-19-05 item 9). These are my words for the closing amendment's "not covered" row:
"A first save refused after the lock leaves the identity's folder in the machine store, with its `open.lock` and, where the save wrote them before its refusal, `locations.json` and `folders.json`; a refusal at the project file, a project folder that takes no new file among its causes, leaves all three. Nothing removes them."

Clause check (all at H):
- **The folder and `open.lock`:** `store.rs:240-244`.
- **The documents written before the replace:** `mod.rs:338-344`.
- **No clean-up on any `?` after the lock:** `mod.rs:338-344`. No product file under `kernel/src` removes a machine-store identity folder, by my search for `remove_dir` and `remove_file`.
- **"leaves all three" rests on the code, not on a test.** K-O24 asserts only that there is one identity folder (`project_save.rs:1163-1164`).

**A2 — what the user is told** (a closing line, P6 wording). My words:
"What the user is told changes for one case: a first save whose machine-store folder or `open.lock` cannot be made, opened or locked ends in `project_file_unwritable` with the detail `open.lock: ` and the operating system's error, where main named the project's machine folder; `Held` gives `open.lock: another handle holds it`, which ordinary use cannot reach at a first save. No shell string changes."

Clause check (all at H):
- **The mapping:** `mod.rs:323-332`.
- **The Display form:** `mod.rs:208`.
- **The code:** `mod.rs:493`.
- **`try_lock` creates the folder first:** `store.rs:241`. The later `create_dir_all`, at `mod.rs:338`, keeps main's `what`.
- **"No shell string changes":** no shell file is in the diff.
- **`Held` cannot be reached:** Amendment 36 item 6 (a).
