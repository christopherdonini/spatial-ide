*Filed by the custodian: the worker-high's second, after it resumed on Amendment 50, hand-back (claude-opus-5-5), 20992 bytes, sha256 7eb8fbd4c6bbeb2143422865d56b30f8d0664967b132aca90047be217bdea43c, below the rule, byte for byte but for two hold-line project values as <m>, with one final newline added. Calls Bash 192, Edit 36, Read 30, Write 15, Grep 1, SubagentHandback 1, 5 errored, from 2026-11-19T21:49:24Z to 2026-11-19T23:03:22Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P3b-2 kernel, worker-high

The kernel half of P3b-2 is built and pushed: branch `cut/b2-piece-1c-p3b-2` at **8759491f30b346ea9e3be06aebc9ed7b61f276f7** (the push printed `65c4739a..8759491f`). Every head run passed, every mutation failed its test and was reverted cleanly, and I opened no PR. Three of my ceilings are over (class 8, counted below; nothing was cut or packed). There is no stop. I made five departures, listed at the end.

Scratch files are in `<S>`, the brief's scratchpad folder; I give only the `1cp3b2b-` names here.

**1. Step 0's list and the `saved` mutex's read.** These are unchanged from my first hand-back, which stopped at step 0.
- **Reopen refusals:**
  - `FileRefused`: `path` and `rule`.
  - `MachineRecordRefused`: `rule`.
  - `TargetRefused`: `segment`.
  - These carry no file bytes: `ProjectFileUnreadable`, `MachineStore` and `ProjectFileUnwritable` (OS text and fixed names); `FolderUnresolvable` (the request's own string); `PathNotUnicode` (no field).
  - The item 2 (e) exceptions: `Open(e)`, and the identity in `KnownFoldersFull`, `OpenElsewhere` and O3's `found`.
- **Reopen replies:** `workspace`, `view.basis` and `not_found.file_name`. ADV-2026-11-19-32 ruled these as: `basis` and `file_name` through the helper, and `workspace` an exception.
- **Save:** `FileRefused` and `MachineRecordRefused` (helper); `Bind` (kernel Debug text; helper applied anyway); `FolderHoldsProject` (the request's folder); `found` (identity).
- **The mutex:** `open_project` waits on `saved` in two places, at `release_ended` (step 3) and at the final `saved.lock()` before `saved.push`. Nothing that holds the catalog takes `saved`, so the lock order holds, and the binding runs on `spawn_blocking`.

**2. Commits** (base 65c4739a3055cb0544b2048e70d1816ba4ae2543), all pushed together in one `git push`:
- f00748214bf1df29d860dc05286e1812c60452c5 test: K-O27 and the save unit test's two places, before their code (1c P3b-2, the kernel half)
- 42a39bce4f9d45808983f557eb6053030bdb52a9 test: W-1 to W-7, open_project through the command, before its code (1c P3b-2, the kernel half)
- fec9acab3c1b2e0da39d658d5e748032626130c1 test: W-7's two rigs bound by their own names (1c P3b-2, the kernel half)
- 11963f374aeb83f0936895e4ffb217906717fa30 test: W-4 and W-7 edit the file as the writer lays it out; the rig releases the save's lock at its close (1c P3b-2, the kernel half)
- e47bc484e3efb2fc899b3a92ab9acdb00efb5def feat: open_project as an SKP command and a shell binding, with P-9's bound at the wire (1c P3b-2, the kernel half)
- 8759491f30b346ea9e3be06aebc9ed7b61f276f7 fix: allow too_many_arguments on the two publish-prepare bindings (1c P3b-2, the kernel half)

**3. P-base.** Each test commit, run in a hold:

| Commit | Log | rc | Result |
|---|---|---|---|
| f0074821 | `1cp3b2b-base1.log`, `-base1b.log` | 101 | lib: 192 passed, 1 failed, 1 ignored. U-P1 failed at mod.rs:1170 (left `"skp.project_file_refused"`, right `"skp.project_machine_record_refused"`). `project_save_skp`: 6 passed; K-O27 failed at project_save_skp.rs:595 ("A's bytes are unchanged: Ok(SaveProjectResponse{.., history_mark: Withheld, project_relative: Outside})") |
| 42a39bce | `-base2.log` | 101 | E0599 (no method `open_project_command`, project_reopen_skp.rs:166) and E0618 (project_reopen_skp.rs:632) |
| fec9acab | `-base3.log` | 101 | E0599 alone |
| 11963f37 | `-base4.log` | 101 | E0599 alone, project_reopen_skp.rs:168 |

**4. P-head.**
- **At e47bc484**, all rc 0:
  - `cargo test --locked -p spatial-kernel --no-fail-fast --lib` plus each focused target (`-head-kernel.log`):
    - lib: 193 passed, 1 ignored
    - `no_generation_in_persisted_artifacts`: 9
    - `project_lock_crash`: 2
    - `project_reopen`: 43
    - `project_reopen_skp`: 7
    - `project_save`: 23
    - `project_save_skp`: 7
    - `project_store`: 5
    - `session_history`: 13
    - `skp_admission`: 10
    - `skp_admission_remediation`: 7
    - `skp_cancel_terminal_without_credit`: 2
    - `skp_filter_cancellation`: 1
    - `skp_projection`: 14
  - `cargo test --locked -p spatial-skp` (`-head-skp.log`): lib 33, conformance 1, fixtures 29.
  - src-tauri `cargo test --locked` (`-head-tauri-test.log`): lib 76, main 0, `sole_caller_scan` 2.
  - Clippy, kernel and skp (`-head-clippy.log`), warnings by file, none in a file this part changed:
    - `kernel/src/bin/publish-bundle.rs` 1
    - `kernel/src/lib.rs` 2
    - `kernel/src/permission/boundary.rs` 1
    - `kernel/src/publish/mod.rs` 1
    - `kernel/src/skp.rs` 1
    - `engine/src/app_dirs.rs` 1
    - `renderer/src/canonical.rs` 1
    - `renderer/src/style.rs` 1
  - Clippy, src-tauri (`-head-tauri-clippy.log`): `src/publish.rs` 1, and `src/commands.rs` 2 (`too_many_arguments`, on `binding_publish_prepare` and `binding_publish_prepare_e2e_destination`). These two were already there, but `commands.rs` is a file this part changed, so 8759491f fixes them.
  - `cargo fmt --check`: root workspace rc 0 (`-p spatial-kernel -p spatial-skp`, and `--all`); src-tauri rc 0.
- **At 8759491f**, which differs from e47bc484 only by the two attribute lines in `commands.rs`:
  - src-tauri clippy rc 0, with `src/publish.rs` 1 left (`-head-tauri-clippy2.log`).
  - src-tauri test rc 0: 76, 0 and 2 (`-head-tauri-test2.log`).
  - src-tauri fmt rc 0.
  - I did not re-run the kernel and skp runs at 8759491f, because no file they build changed.

**5. Mutations**, at head 8759491f, one hold, `1cp3b2b-mutate.mjs` (`1cp3b2b-mut.out`, rc 0). Each was applied to `mod.rs` and its test run. Every test FAILED (rc 101), and after each revert `git diff --quiet` gave rc=0.

| Id | Change | Test | Failed at |
|---|---|---|---|
| W-1 (a) | clauses filtered by `enabled` | W-1 | project_reopen_skp.rs:288 |
| W-1 (b) | `recorder.reopened` removed | W-1 | :299 |
| W-2 | `req.answer.filter(\|_\| false)` | W-2 | :319, `{"question":{"kind":"copy-or-same"}}` |
| W-3 | `file_name` sent as the recorded path's `to_str()` | W-3 | :336 |
| W-4 (a) | `through_link` mapped to `target_segment_unresolvable` | W-4 | :362, the code |
| W-4 (b) | a segment refusal sends `format!("{folder}/{segment}")` | W-4 | :372, the path scan |
| W-4 (c) / W-7 | `bounded` returns its input | W-4 | :376, "`rule` is 100031 bytes" |
| | | W-7 | :632, the unbounded `\u{1}EEE…` identifier |
| W-5 (a) | the relink check deferred past the engine's open, with no close | W-5 | :528, at the **code** assertion (`engine.source`: "source: elsewhere/parcels.parquet is not a readable file"), not at the catalog: the engine refuses the relative path itself |
| W-5 (b) | `close()` not called | W-5 | :537, "(b): the catalog" |
| W-6 | `(Some(_), None) if false` | W-6 | :599, "the copy's project.spatial is unchanged" |
| K-O27 | `Ok(f) if false && f.project != project` | K-O27 | project_save_skp.rs:595 |

As expected, W-4 stops at its first bounded case ("number") and W-7 at (a). These were `cargo test` runs, not `verify-mutation` runs.

**6. Counts.** The command is §2.11's: `git diff --numstat 45ce89da…8759491f` with the form path and the listed files excluded (rc 0, `1cp3b2b-count-part2.txt`).
- **The part, per file** (added / deleted):
  - ADR-036: 6/0
  - src-tauri: `commands.rs` 41/8, `lib.rs` 1/0
  - shell TypeScript: `admitDataset.test.ts` 4/4, `saveProject.test.ts` 1/1, `client.test.ts` 4/4, `types.ts` 1/1
  - kernel: `mod.rs` 275/27, `store.rs` 11/5, `project_reopen_skp.rs` 648/0, `project_save_skp.rs` 45/0
  - protocol: `SKP-V0.md` 95/12, `commands.rs` 179/3, `error.rs` 171/5, `mod.rs` 12/2
  - protocol/skp/tests, 33 files, 700/82 in all:
    - `conformance/README.md` 7/0, `refusals-any-layer.json` 26/26, `refusals-at-deserialize.json` 74/20, `requests-accept.json` 45/17, `responses-accept.json` 77/0, `conformance/main.rs` 2/0, `fixtures.rs` 349/7
    - data fixtures: 15 request literals at 1/1 each; the 8 new error fixtures at 7-9/0; `v0-error-project_file_refused` 1/1; `opened-lineage` 19/0, `response-opened` 16/0, and the three `not_found`/`question` replies 1/0 each.
- **The part, by group, against Amendment 45 item 8:**

| Group | Count | Ceiling | Over by |
|---|---|---|---|
| protocol | 457/22 | 455 | 2 |
| protocol tests (fixtures and literal) | 700/82 | | |
| shell literal | 10/10 | | |
| fixtures + literal together | 710 | 580 | 130 |
| kernel product | 286/32 | 285 | 1 |
| kernel tests | 693/0 | 590 | 103 |
| src-tauri | 42/8 | 35 | 7 |
| records | 6/0 | 10 | none |
| **Total** | **2,194/154** | **1,955** | **239** |

  I did not re-split fixtures from literal: that split is the wire half's, already ruled in ADV-2026-11-19-31.
- **My commits** (65c4739a..8759491f), against my ceilings:

| Group | Count | Ceiling | Over by |
|---|---|---|---|
| kernel product (`mod.rs` 275/27, `store.rs` 11/5) | 286/32 | 285 | 1 (class 8) |
| kernel tests (`project_reopen_skp.rs` 648, `project_save_skp.rs` 45) | 693/0 | 590 | 103 (class 8) |
| src-tauri (`commands.rs` 41/8, `lib.rs` 1/0) | 42/8 | 35 | 7 (class 8) |
| records (ADR-036) | 6/0 | 10 | none |
| protocol docs (`SKP-V0.md` 2/2, protocol `commands.rs` 6/2; added by ADV-32 item 7) | 8/4 | none of mine names them | |

- **Lock-file check:** `git diff --quiet 45ce89da...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` gives rc=0.

**7. `pub` items added:**
- `kernel/src/project/mod.rs` `Projects::open_project_command` (line 888)
- `frontends/shell/src-tauri/src/commands.rs` `open_project` (line 202), with `lib.rs` line 558's handler entry
- `kernel/src/project/mod.rs` `SaveFailure::FileNamesAnotherProject { project, found }` (line 185)

There are no others.

**8. Copied texts and their checks.**
- `1cp3b2b-check.mjs` at the head: rc 0, 22 lines EQUAL (`1cp3b2b-check-head.log`).
  - ADV-2026-11-19-26's first fence matches `impl Display for OpenFailure` (the `FileRefused`, `OpenElsewhere`, `MachineStore` and `PathNotUnicode` arms and the rest), and `SaveFailure`'s new arm.
  - The second fence matches `store.rs` `stored_path`'s three texts and both nouns.
  - Amendment 43 item 9 (a), step 4's words, match the `Projects::open_project` doc; item 9 (b) matches the `OpenFailure::Cancelled` doc.
- `1cp3b2b-copycheck-head.mjs`: rc 0, 3 EQUAL (`1cp3b2b-copycheck-head.log`).
  - ADV-2026-11-19-30 item 2's New is in the `Projects::release_ended` doc (mod.rs, from line 247), and Old in no paragraph.
  - Item 3's New is in `close_dataset`'s doc (`commands.rs`, from line 117).
  - ADR-036 ends with ADV-26's third fence byte for byte, with 2026-11-19 in its slot (1,049 bytes). That is the UTC date; I took it from `date -u`.
- **The existing test edited** (ADV-32 item 1 (a)) is U-P1, `each_save_failure_maps_to_its_own_code_with_the_kernels_text`, in two places only:
  - the `MachineRecordRefused` case's code becomes `"skp.project_machine_record_refused"` (head line 1406);
  - `fields["file"]` replaces `fields["path"]` (head line 1432).
  - No `store.rs`, `file.rs` or `strict_json.rs` test pinned an old text.

**9. Doc sentences I wrote, byte-copied, with their code:**
- **mod.rs, `SaveFailure::FileNamesAnotherProject`:** "At a later save, the project file in the open's folder names another project: `project` is the open's identity and `found` the one the file names. The file is kept as it is." This rests on the `Ok(f) if f.project != project` arm in `Projects::save`.
- **mod.rs, `Projects::save` doc:** "refuses to replace a project file that names another project, one that records a kept lineage, and one the reader refuses, since each could hold what a rewrite would lose." Same arm.
- **mod.rs, `Projects::open_project` doc, step 2:**
  - "After the answer `copy` with no `relink`, step 5's lookup of the data runs here, before the lock, so that a `not_found` reply writes nothing." This rests on the O5 `found` match.
  - "`folders.json` is read here, before the lock: another process can replace it between this read and step 3's write."
- **mod.rs, step 3:** "A copy whose `project.spatial` cannot be replaced is refused, and leaves the new identity's machine folder with its `folders.json` and `open.lock`." This rests on the copy arm's `replace`.
- **mod.rs, step 5:** "A `relink`, checked at step 2, is used first, then the path step 2 found for a copy." This rests on `relinked` and `found.map_or_else(..)`.
- **mod.rs, O5's source comment:** "O5 (packet P-6 (ii)): a copy's data is looked up before its lock and its writes."
- **mod.rs, row 5's source comment:** "ADV-2026-11-19-26 item 3, row 5: this `skp.unknown_dataset`'s message offers "or never opened this session", which cannot be the case here: it needs a close, inside this call, of the handle `open_under` just returned, which the client has not received. Named, and not changed."
- **mod.rs, `Projects::open_project_command`:** "`open_project` (SKP-V0 §12), built as [`Projects::save_project`] is: the version, then [`Projects::open_project`], each [`OpenFailure`] mapped to its SKP code by [`open_error_of`], and the reply built from what the reopen returned. No reply carries a path; `not_found`'s `file_name` passes through [`bounded`]. It can wait on the `saved` mutex ([`Projects::release_ended`] and the entry it keeps), so a host calls it off its main thread."
- **mod.rs, `open_error_of`:** "Each way a reopen is refused, as its SKP code (SKP-V0 §12). One exhaustive `match` with no wildcard arm: a new [`OpenFailure`] or [`CheckRefused`] is a compile error here until it has a code. An engine refusal through `Open` keeps the engine's message; any other refusal names no path but the request's `folder` as sent. A reader's `path` and `rule` and a locator's `segment` pass through [`bounded`]."
- **mod.rs, `opened_of`:**
  - "The `opened` reply: the workspace in its wire form, whole, as the reader accepted it; the view's state; the check's names; and the two lineage facts, with no line and no rule text."
  - Inner comments: "The reader accepted the style only in ADR-017 §5a's canonical form, so it is written again and read as JSON without a refusal." and "The words are `differing_components`'s and `DatasetRef::check`'s own closed sets."
- **mod.rs, `lineage_refusal_of`:** "A lineage file's refusal on the wire: its line numbers, and no rule or reason text."
- **mod.rs, `view_state`:** "Each space's identifier in `basis` passes through [`bounded`]; its provenance is a closed word and its definition a hash, as the reader holds the saved space's and [`space_of`] builds the other's."
- **mod.rs, `skp_error_of`:** "A reader's `path` and `rule` pass through [`bounded`]."
- **mod.rs, `bounded`:** "A text taken from a file the kernel did not write, as it may reach the wire: every control character replaced by U+FFFD, then, past 256 bytes, cut at the last character boundary within them and marked with ` [cut]`, so that it is at most 262 bytes."
- **store.rs, `stored_path`:** "The rule names the path by `noun` and never prints it."
- **src-tauri `commands.rs`:**
  - The module doc gains ", and, from `skp/0.14`, `open_project`". The "This file contains no logic" sentence is not edited (Amendment 49 item 4 (c)).
  - The `open_project` binding: "**Runs on `spawn_blocking`**, as `save_project` does: the reopen reads and writes files, opens the data, and can wait on the mutex in [`Projects`] that a save or a release holds. On `opened` it starts the pool-lease poll as `open_dataset` does, under the same `cfg`."
- **protocol `commands.rs`:**
  - `ReopenView`: "In each identifier, every control character is replaced by U+FFFD, and one then over 256 bytes is cut on a character boundary within them and marked with ` [cut]`, so that it is at most 262 bytes."
  - `ReopenNotFound`: "Every control character in it is replaced by U+FFFD, and a name then over 256 bytes is cut on a character boundary within them and marked with ` [cut]`, so that it is at most 262 bytes."
- **SKP-V0.md §12.2:**
  - The basis line: "In each identifier in it, every control character is replaced by U+FFFD, and an identifier then over 256 bytes is cut on a character boundary within them and marked with ` [cut]`, so that it is at most 262 bytes."
  - The `file_name` line: "Every control character in it is replaced by U+FFFD, and a name then over 256 bytes is cut on a character boundary within them and marked with ` [cut]`, so that it is at most 262 bytes."

**10. Rows and not-covered lines, at the head.** All are true.
- **Item 13:**
  - (1) Amendment 36 item 9's two live opens: true. `skp.rs` is untouched, and an ended open stays bound and in the catalog, refused by `require_live`.
  - (2) `PathNotUnicode`: true. Every input arrives as UTF-8, and its arm maps to the no-path line.
  - (3) A cancel after the engine's open: true. The `OpenFailure::Cancelled` doc and SKP-V0 §12.3 state it.
- **Item 8, "Not covered through the command: `Cancelled`":** true. No W test reaches it, and its arm is one line (mod.rs:920).
- **Item 9 (a):**
  - `folders.json` read before the lock: true, and the doc names it.
  - A failed copy's `replace` leaves the new identity's folder: true, and the doc names it.
  - Step 4's clause: true. `dir = record_dir(&self.root, &project)` (line 721) follows `let project = file.project.clone()` (718), which is before `file.project = new.clone()` (755).
- **Item 9 (b):** true; the doc is copied by script.
- **Item 9 (d):** O5 is covered by W-6 under P-6 (ii), so it is not a not-covered line.
- **Amendment 49 item 4 (a), N4:** named, not covered, and true. `open_under` is at line 820 and `saved.push` at 865, so a `close_dataset` in between leaves the entry until the next release. No code or doc was changed for it.

**11. Hold lines**, masked. Every hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`. No hold showed a WAITING or ERROR line or a 96-99 code. The holds:
- base1 and base1b (rc 101), base2, base3, base4 (rc 101 each);
- dev1 and dev2 (working tree);
- kernel head, skp head, kernel and skp clippy (rc 0 each);
- src-tauri test, clippy, clippy2, test2 (rc 0 each);
- the mutations (rc 0).

No process I started is still running; cargo processes: 0.

**12. Notes the brief asks for.**
- **K-O27** sits in `project_save_skp.rs`, because it asserts the wire code.
- **The `expect` calls in `opened_of`:**
  - `to_canonical_string(..).expect(..)`: the reader accepted the style only in its canonical form.
  - `serde_json::from_str(..).expect(..)`: the input is canonical JSON.
- **The `unreachable!` calls in `opened_of`:** the last arm of the observed-word and admission-word maps, since both sets are closed at their source. A new word would panic in the reopen, which the binding's `spawn_blocking` turns into `protocol("open_project_panicked")`. This is a judgment for the reviewer.
- **The W-7 (b) platform note:** Windows caps a name at 255 UTF-16 units. W-7's name is 90 three-byte characters (90 units, plus `.parquet`, 278 bytes), the file is missing, and the name is recorded through `locations_to_bytes`.
- **The four pre-gate classes, as I read them:**
  - quoted texts: script-checked equal (item 8);
  - cites: no rooted path:line cite in a committed file;
  - scope: only my files, plus mutations reverted;
  - claims: each tied to a transcript call.
- **Model:** claude-opus-5-5 (Opus 5.5). No override.
- **Context handoffs:** this run continued across three context compactions, from the harness's summaries and the transcript.

**13. Departures, things not done, and stops.** There are no stops.
- **(a) Two test commits beyond the brief's plan:**
  - fec9acab fixes E0618, from W-7 shadowing `rig`.
  - 11963f37 fixes three test defects found only when the code ran:
    - W-4's three bounded cases and W-7 (a) searched for members without `": "`;
    - `Rig::saved` did not call `release_ended`, so W-5's lock check failed.
  - To commit 11963f37 before the feat commit, I copied `mod.rs`, `store.rs` and protocol `commands.rs` to `<S>/1cp3b2b-keep-*`, ran `git checkout --` on those three files, committed, ran base4, and copied them back (sha256 equal before and after). I did not use stash.
- **(b) 8759491f** is a fix commit outside the planned two (+2 src-tauri lines, inside the overrun counted above).
- **(c)** One hold, src-tauri clippy at e47bc484, was launched in foreground mode; the harness moved it to the background after 180 s.
- **(d)** After the push I ran `git fetch` of the branch to confirm the remote head. That is network use beyond the brief's push and `--locked` fetches.
- **(e)** The kernel and skp P-head runs were at e47bc484, not re-run at 8759491f (see section 4).
- **Overruns, class 8:** kernel product +1, kernel tests +103, src-tauri +7. The part is over on protocol, fixtures and literal, and the total (section 6).
- **Not done, as the brief directs:** no PR, no e2e or app-window runs, no full suites.
