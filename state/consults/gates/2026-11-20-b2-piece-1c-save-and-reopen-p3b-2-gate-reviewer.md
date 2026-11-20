Reviewed: PR #340 at ddd74c349091832ada443e78ae867fa4ad79371b (the custodian's filing note, 2026-11-20: the reviewer's gate of P3b-2; Bash 216, Read 22, SubagentHandback 1, one errored, model claude-opus-5-5, from 2026-11-20T00:34:20Z to 00:55:43Z by its transcript; the report below byte for byte from its hand-back of 13177 bytes, sha256 4341ddf07953dc863df8e72ece048779630a10d111bfc6cea077de9500d9b410, but for one masking by the custodian (one scratch-folder path as <S>), with this note in its first line and one final newline), gate, reviewer, attempt 1
Gate: PR #340, b2-piece-1c-save-and-reopen P3b-2, reviewer, at ddd74c349091832ada443e78ae867fa4ad79371b
Reviewed: cut/b2-piece-1c-p3b-2 @ ddd74c349091832ada443e78ae867fa4ad79371b (the work's last commit 63950d3668ea618988b2faa6aebb3da1d4aca9c8; base 45ce89da31f9c0e01dd1194de4e77cc38e78317d)
Verdict: FAIL

The fail is on wording only. Two doc sentences claim a limit or a state the code does not have (C-1, C-2). The code's correctness and evidence are closed. Replacement words for both are below, as AUTONOMY §31 asks. Both sentences are the workers' own wording (blame 65c4739a), not the human's. Both are marked `to the advisor`, as the brief orders for an untrue clause.

## 1. Scope

**`pub` items.** Every `pub` item added has a product caller, or is the pre-committed consumer named in Amendment 43 item 12 as Amendment 49 item 5 (b) widens it. No test-only caller.

**Files.**
- `git diff --name-only B...63950d36` gives 48 paths. All are inside Amendment 43 item 8 (a) as Amendment 49 item 8 and Amendment 50 item 7 widen it.
- `git diff --stat 63950d36 H -- kernel protocol frontends engine renderer` is empty, so H adds no code.
- Main's paths changed since B are records only.
- No lock-file diff.

**Counts** by §2.11's command at B...63950d36, adds plus deletes:

| Group | Count | Ceiling | Over? |
|---|---|---|---|
| protocol | 473 | 455 | over |
| fixtures | 632 | 390 | over |
| literal | 176 lines in 21 files | 190 / 22 | within |
| kernel product | 318 | 285 | over |
| kernel tests | 727 | 590 | over |
| src-tauri | 50 | 35 | over |
| records | 6 | 10 | within |
| total | 2,382 | 1,955 | over |

- The overruns stand as class 8 (ADV-2026-11-19-31, -33).
- My first literal count was 178. A false pairing in SKP-V0.md matched a §11.1 minus line with a §12.1 plus line; corrected by hand to 176.
- Kernel tests: ADV-33 read 693 at 8759491f; 63950d36 adds 52 and deletes 18.

**ADV-31 item 3 (fixtures).** Nothing in the fixtures group falls outside F-W1 to F-W3 and Amendment 43 item 8 (a)'s list. Nothing goes to the advisor.

## 2. ADV-2026-11-19-33 item 7 (opened_of)

**(i)** None of the four panics can be reached:
- the two `expect`s (`to_canonical_string`, `serde_json::from_str`);
- the two `unreachable!`s (the observed and admission words).

Every file the reader accepts passes through `file.rs`'s `style_document` canonical check and `space()`'s provenance and definition checks before `opened_of` runs. So the canonical round trip, and the closed word sets, hold for any file that reaches it.

**(ii)** If a reply did panic, only a session end followed by `release_ended`, or quitting, would free the lock. This is not a finding, because the panic cannot be reached. Note to the advisor, with a proposed shape: map each of the four to `SkpError::protocol` and release the open's lock before replying.

## 3. Concurrency

**What the binding waits on.**
- The binding is `async` and runs the command in `tokio::task::spawn_blocking`.
- A panic maps to `open_project_panicked`.
- It waits on `Projects`' `saved` mutex, then the catalog and generation locks, in that order, and on the engine's open.
- The project lock is a try-lock: a held lock gives `LockRefused::Held`, then `skp.project_open_elsewhere`. It does not wait.
- Nothing waits on the main thread.

**Stop 12** is not triggered.
- `release_ended`'s body is unchanged; only its doc changed.
- Its callers keep their order: `commands.rs` at line 141 at B, 142 at 63950d36; and `open_project`'s own call before `open_under`, at `mod.rs:732` at B, 774 at 63950d36.
- `close_dataset`'s body is unchanged; only its doc New was applied.

**N4** is named as Amendment 49 item 4 (a) asks. No finding.

## 4. P-9's bound at the wire

- `bounded` (`kernel/src/project/mod.rs`) is applied at exactly the named places.
- The exceptions are exactly `Open(e)`, the identity and the workspace.
- No text from a file the kernel did not write reaches the wire without the helper. No stop 10.

## 5. Doc words

**Byte-exact checks.**
- ADR-036 Amendment 4 matches ADV-26's third fence byte for byte. Only the date slot is filled, with 2026-11-19.
- ADV-30's two pairs: each New matches its fence byte for byte.
- Amendment 45 item 7's docs and Amendment 50 item 4 (e)'s docs are present and true.

**Worker sentences, clause by clause.** Four untrue clauses: C-1, C-2, D-1 and D-2 below.

## 6. Tests

**Declared tests.** Each declared test reaches its assertion. I checked this by reading, not by running unmutated:
- F-W1, F-W2 and F-W3 in `protocol/skp/tests/fixtures.rs`;
- K-O27 in `kernel/tests/project_save_skp.rs`;
- W-1 to W-7;
- U-P1's two places (the code `skp.project_machine_record_refused`, and `fields["file"]`).

**ADV-33 item 2 (iii).**
- fec9acab only renames the rig bindings (`rig` to `a` / `b`). 11963f37 moves the edit anchors to the writer's layout (`": "`, and one member a line). No assertion was removed or weakened. `Rig::edit` asserts that each anchor is found once, so the moved anchors are proven to hit.
- The rig's `self.projects.release_ended()` in `Rig::saved` (`project_reopen_skp.rs:140`) mirrors the shell's `close_dataset` hand-off. With it, no W row sees `open_project` free an ended lock itself. That property is K-O26's, in `kernel/tests/project_reopen.rs` from line 1875, with its two recorded mutations.

**ADV-34 item 3 (d).** W-7's doc says which case runs where, and why:
- (a) runs on every platform;
- (b1) is compiled everywhere but Linux, because of Linux's 255-byte name limit, which the doc states;
- (b2) runs on every platform.

**ADV-35 item 2.**
- Case (a) appears twice in W-7 at H, at lines 632-641 and 643-652. Both copies were skipped.
- Under W-4's mutation, (b1) failed at `kernel/tests/project_reopen_skp.rs:664` ("278 bytes: €…"). (b2) failed at `:679` (`"par\u{85}cels.parquet"`). Each was seen alone, in its own run on Windows, in a hold.
- The mutation was made by Bash and not committed. Its shape: `bounded` returns its input, via `if true { return text.to_string(); }` at the top of its body.

**The custodian's added check (2).** W-4 was run under the same mutation, with every case before `key` skipped (lines 404-479 and `number`):
- `key` failed at `:370`, control character in the message: `"the project file's reader refuses it: $.\u{1}: an unknown member"`.
- `word` failed at `:376`: "`rule` is 4123 bytes".
- Each was seen alone. No case passed under the mutation.

**The mutation runs.**
- Two runs of `cargo test --locked -p spatial-kernel --test project_reopen_skp`, each in a shared hold, each rc 101.
- Selection was by env-var guards added by Bash, not committed: G340R_CASE and G340R_W7.
- Hold lines: `MACHINE_HOLD shared project=<m> … also=<m>`, then `MACHINE_RELEASED project=<m>`.
- Reverted with `git checkout -- kernel/src/project/mod.rs kernel/tests/project_reopen_skp.rs`. Then `git diff --quiet` rc 0, and porcelain had 0 lines.

## 7. Clippy

**At H** (holds, both rc 0):
- Root, `-p spatial-kernel -p spatial-skp --all-targets`: every warning is in an unchanged file:
  - `kernel/src/lib.rs`, `skp.rs`, `permission/boundary.rs`, `publish/mod.rs` and `bin/publish-bundle.rs`;
  - `renderer/src/canonical.rs` and `style.rs`;
  - `engine/src/app_dirs.rs`.
- src-tauri, `--all-targets`: one warning, `large_enum_variant` at `src\publish.rs:359`, an unchanged file.
- No warning in a changed file.

**ADV-33 item 3, at 65c4739a** (hold, rc 0): yes, clippy gives the two warnings there.
- `too_many_arguments (9/7)` at `src\commands.rs:348` (`binding_publish_prepare`) and at `:600` (`binding_publish_prepare_e2e_destination`), plus the `publish.rs` one.
- Both functions have the same 9 arguments at B and at 65c4739a, and the diff does not touch them. The warnings come from before P3b-2. I did not run clippy at B; this is shown by the signatures. 8759491f's two `#[allow]` lines silence them.

**Switch and return.** I switched back to `cut/b2-piece-1c-p3b-2`. `rev-parse HEAD` = ddd74c349091832ada443e78ae867fa4ad79371b; porcelain is empty.

## 8. Runs

See "Runs reused and reproduced" at the end.

## Findings

### Correctness (blocking; wording only; not the human's wording; `to the advisor`)

**C-1.** `protocol/skp/SKP-V0.md:1433`, §12.3: "A project is open once at a time on this machine". This is a limit claim the code does not support.
- The lock is `open.lock` under `record_dir(&self.root, …)`, and `projects_root` is `<per-user data directory>/spatial-ide/projects`.
- So two users on one machine can each hold an open of the same project.
- An operator can reach this with a second Windows account.

Proposed words: "A project is open once at a time in one user's machine store: a reopen of a project whose lock another open holds is refused as `skp.project_open_elsewhere`."

Clause check:
- "one user's machine store": the per-user root, `store.rs`.
- "whose lock another open holds": `LockRefused::Held` → `OpenFailure::OpenElsewhere`, `mod.rs:776`.
- "refused as": `mod.rs:931`.

**C-2.** `protocol/skp/src/v0/commands.rs:796-798` (ReopenAnswer) and `:922` (ReopenQuestion): "the project is open elsewhere on this machine under another folder", and "the `same` project moved here".
- The question is asked on `asks(&known.first, &project)` (`mod.rs:1070-1085`). That holds when the first recorded folder still holds a file of the same identity, or a file that cannot be read or checked. Whether any open holds it is never checked.
- `Same` runs `with_same`, `store.rs:371`. That keeps `first` and records this folder beside it. The move is `moved_to`, which is the no-question path.

Proposed words for :796-798: "The answer to a `question` reply: the folder first recorded for this project in this user's machine store still holds its project file, or one that cannot be read or checked, and the client says whether this folder is a `copy` of it (a new identity) or the `same` project, recorded as another of its folders."

Proposed words for :922: "This folder is not one recorded for the project, and the folder first recorded for it still holds its project file, or one that cannot be read or checked; nothing was written. The client asks and calls again with an `answer`."

Clause check:
- "not one recorded": the `is_known` arm, line 734.
- "still holds … or cannot be read or checked": `asks`, lines 1072-1084.
- "nothing was written": `return Ok(Reopen::Question)` at line 737, before any write.
- "another of its folders": `with_same`.

### Evidence

None. Every recorded mutation I doubted fails where its doc says: (b1), (b2), W-4's `key` and `word`.

### Documentation, must-fix before the merge (worker wording; the worker applies these with no re-gate, and the PR body lists them)

**D-1.** `SKP-V0.md:1160`, "no change to the other seven commands", and `protocol/skp/src/v0/mod.rs:130`, "The other seven commands are unchanged". These are untrue: `save_project` gains `skp.project_file_names_another_project` (`Projects::save`'s new arm), and the changed messages reach the other commands too. `to the advisor`.

Proposed words:
- For 1160's last clause: "the other seven commands change only where these codes and messages reach them (`save_project` gains `skp.project_file_names_another_project`)."
- For mod.rs:130: "The other seven commands change only where these codes and messages reach them (`save_project` gains `skp.project_file_names_another_project`);"

**D-2.** `SKP-V0.md:1449`, the §12.4 row for `skp.project_machine_store_failed`: "`detail` is a file's fixed name, a colon and the error's text". The bindings at `frontends/shell/src-tauri/src/commands.rs:164/186/209` also send `detail` = "no per-user data directory is available", as `error.rs:287` itself says. `to the advisor`.

Proposed words: "this machine's store for the project could not be used; `detail` is a file's fixed name, a colon and the error's text, or `no per-user data directory is available` when the shell has none".

**D-3.** W-7 holds case (a) twice: `kernel/tests/project_reopen_skp.rs:632-641` and `643-652`, re-added by 63950d36. This is a harmless duplicate: it proves nothing less. Delete one copy.

### Notes

- `opened_of`'s doc clause "with no line" is ambiguous. Clarify it in the same pass.
- ADV-33 item 7 (ii): the proposed shape is in question 2.
- 8759491f's two `#[allow(clippy::too_many_arguments)]` sit on functions P3b-2 does not otherwise change (question 7).

## Runs reused and reproduced

Reused:
- CI at 63950d36, all three platforms (the suites, fmt, clippy jobs);
- the workers' runs and their recorded mutations for W-1 to W-6, K-O27 and U-P1.

Reproduced (Windows, shared holds):
- the root clippy at H;
- the src-tauri clippy at H;
- the src-tauri clippy at 65c4739a;
- two mutated runs of `project_reopen_skp.rs` (rc 101 each, as expected).

I did not run the unmutated suites myself. No process I started is still running. Scratch logs: <S>/g340r-clippy-root.log, g340r-clippy-tauri-H.log, g340r-clippy-tauri-65c.log, g340r-mut-a.log and g340r-mut-b.log, all in that scratchpad folder.

Model: claude-opus-5-5 (Opus 5.5).
