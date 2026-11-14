*Custodian's filing note (2026-11-11): the worker's report on P2 and P3 of piece 1c's step 1, from its second brief, given by file (11907 bytes, sha256 15c00ef9c95e9d62b51c6dc0ad96c29e24bc8152b943acd38b6f21ca1a5fe040). Dispatched at 06:00:13Z by its transcript; the run went to 08:02:44Z (claude-sonnet-5-5; unique calls from that dispatch: Read 28, Bash 214, Grep 4, Edit 4, Write 8, the hand-back, 259 in all; its context compacted twice). Two calls errored: a heredoc the shell could not parse, and an Edit the tool refused before a Read of its file. Its push ran after `cd` in one compound call, where the brief gave the push a call of its own. The report below was extracted by script from the hand-back in that transcript (14957 bytes, sha256 95d0d145c8c77f80007ab4bb52514772e17ae4b059992a6f5dd089eb4537e517) and is unchanged; one final newline is added. The custodian checked by script: the branch on origin and the worktree at 41c32190, the porcelain empty; each commit's sign-off is git's own; §2.11's command at B = e57d75e1 recomputed, 51 files and 6029 lines, each group the form names by path as reported; the test totals summed from its logs, 1065 and 1070 passed, none failed. Its line cites are into the branch at 41c32190.*

---

Built: b2-piece-1c-save-and-reopen P2 and P3 at 41c32190b81eff94afeff54ba18c184789b23092

All of it is pushed. One decision is yours: the shell's renderTruth test blocked the two save_project request fixtures (departure 3 below). Several size groups are over their ceilings and nothing was trimmed.

**Start state**
- Worktree `C:/dev/wt/b2c` on `cut/b2-piece-1c-save-and-reopen`, at 7eb5aa71de4891718af82fffb8e7bbd2e90e0984.
- The form on main has sha256 d65dae5356c846e2c7c40ff1a6a6cece70849ab5d884163d0757ab5518638009.
- I did not merge main.

**Commits**

1. **P2: ffc039d1c171a803af5f9c6451457595c28ed93a**
   - Subject: `feat: skp/0.13 adds save_project and a categorical match on record_step's fillColor`.
   - 36 files, +1357/-155. It holds:
     - the literal bump and `save_project`'s request, response and five codes (`commands.rs`, `error.rs`, `mod.rs`, `SKP-V0.md`);
     - the whole `record_step` widening: wire, kernel check, dependencies, reader, `differs`;
     - the protocol and conformance fixtures, and the three shell literal sites.
   - Checks:
     - `cargo fmt --check` exit 0.
     - clippy `--all-targets --locked` (with `--features spatial-engine/fixture`) exit 0, 8 distinct warnings, the same set as P1 (renderer 2, kernel lib 5, publish-bundle 1). My first run had a 9th, in a fixtures.rs line I wrote (a mangled `replace`). I fixed it before the commit.
     - `cargo test --locked --features spatial-engine/fixture`: exit 0, 1065 passed, 0 failed, 66 ignored.
     - `npm run verify` in `frontends/shell`: exit 0 on the tree after departure 3 (the first run failed on `renderTruth.test.ts`).
   - The full cargo run was on a tree that differed from the commit by test-only edits in `protocol/skp/tests/fixtures.rs` and the removal of two data files. On the final tree I re-ran `cargo test -p spatial-skp` (exit 0; 32 + 1 + 27 passed, 0 failed) and `cargo clippy --all-targets -p spatial-skp` (0 warnings). The full workspace run on the exact P2 tree was not repeated. P3's full run covers the final tree.

2. **P3: 41c32190b81eff94afeff54ba18c184789b23092**
   - Subject: `feat: the kernel's save_project handler maps each save refusal to its SKP code`.
   - Files: `kernel/src/project/mod.rs`, `kernel/src/session_history.rs`, new `kernel/tests/project_save_skp.rs`. 3 files, +485/-5. One commit.
   - `Projects::save_project` does the version check, the catalog lookup, the live check, then `workspace_of`, then `save`.
   - `skp_error_of` is one exhaustive `match` over all nine `SaveFailure` variants with no wildcard arm. `FolderRequired` maps to `skp.project_folder_not_given`.
   - `FolderRequired`'s `Display` is now `no folder was given, and this open of the dataset has no project to save to`.
   - A new `pub(crate) fn host` on `StepRecorder` gives the handler the host.
   - Checks:
     - fmt exit 0.
     - clippy exit 0, 8 distinct warnings, all in lines that existed before P2 or P3.
     - `cargo test --locked --features spatial-engine/fixture` exit 0, 1070 passed, 0 failed, 66 ignored.
     - `npm run verify` was not re-run, since P3 touches no `frontends/` file.

**Literal sites**
- Changed (`skp/0.12` to `skp/0.13`, the version in force):
  - `protocol/skp/src/v0/mod.rs`, `SKP_VERSION`.
  - `frontends/shell/src/skp/types.ts:15`.
  - `frontends/shell/src/skp/client.test.ts:31,72,99,104`.
  - `frontends/shell/src/admission/admitDataset.test.ts:85,93,145,167`.
  - The 10 request fixtures under `protocol/skp/tests/data/`, and the conformance fixtures. The renumbered unsupported-future-version row is now `skp/0.14`.
  - The `skp_version_is_skp_0_13` assertion.
  - `SKP-V0.md`, where the in-force statements are §4 item 3 and §11.1.
- Left as history, because they say where something landed:
  - `SKP-V0.md:15,229,526,1105,1127,1134,1148,1264`.
  - `commands.rs:5` and `:514`, `error.rs:117`, `mod.rs:110,114`.
  - `fixtures.rs:385`.
  - `conformance/README.md:61-66`.
  - `types.ts:290,299,305`, `client.ts:137`, `surfaceRegistry.ts:78`.
  - `src-tauri/src/commands.rs:8`. This is out of scope and unedited.
  - The `AMBIGUITIES.md` A9 and conformance README entries gained their `skp/0.13` sentences, following the established pattern.
- Changed files that mention a `skp/0.1x` literal: 25, against the ceiling of 30.

**New tests**
- W-P1 `record_step_admits_a_match_on_fill_color_only`, in `commands.rs`, `mod tests`.
- W-F1 `the_record_step_fill_match_fixture_decodes_and_re_encodes_byte_for_byte`, in `protocol/skp/tests/fixtures.rs`. It uses the new fixture `v0-record_step-request-style-set-fill-match.json`.
- U-W1 `the_history_reader_admits_a_fill_color_match_and_refuses_one_on_another_property`, in `session_history.rs`, `mod tests`.
- K-W1 `a_recorded_fill_color_match_names_its_column_and_type_and_recover_chains`, in new `kernel/tests/record_step_match.rs`.
- K-W2 `a_match_the_style_model_refuses_against_the_open_is_refused_by_name_and_writes_nothing`, same file.
- K-W3 `a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match`, in `kernel/tests/project_save.rs`.
- Not named by the form, added by me:
  - `save_project_requests_and_response_round_trip_and_its_codes_are_what_the_constructors_build`, in `fixtures.rs`.
  - `skp_version_is_skp_0_13`, renamed from `skp_version_is_skp_0_12`.
  - P-U1 `each_save_failure_maps_to_its_own_code_with_the_kernels_text` and P-U2 `the_folder_required_text_is_what_a_client_is_shown_for_it`, in `project/mod.rs`, `mod tests`.
  - P-S1 `a_save_project_request_saves_and_the_reply_names_the_identity_and_the_mark`.
  - P-S2 `each_refusal_of_a_save_project_request_has_its_code_and_writes_nothing`.
  - P-S3 `a_save_on_a_dataset_whose_generation_ended_is_refused_with_the_ends_code`.
  - P-S1 to P-S3 are in `kernel/tests/project_save_skp.rs`.

**Mutations**

All were observed at 41c32190b81eff94afeff54ba18c184789b23092. Each was applied, the named test run alone, then reverted with `git checkout -- <file>`, and the porcelain printed `[]` after each. The first line of each entry is the failing line byte-copied.

1. W-P1: a match admitted on `outlineColor`, in `commands.rs`.
   - `thread 'v0::commands::tests::record_step_admits_a_match_on_fill_color_only' (56024) panicked at protocol\skp\src\v0\commands.rs:1094:13:` then `a match on `outlineColor` must be refused`.
2. W-F1: `rename(serialize = "unmatched")` on `on_unmatched`.
   - `thread 'the_record_step_fill_match_fixture_decodes_and_re_encodes_byte_for_byte' (64208) panicked at protocol\skp\tests\fixtures.rs:463:5:` then `assertion `left == right` failed: v0-record_step-request-style-set-fill-match: re-encoding changed the bytes`.
3. `save_project_requests_and_response_round_trip…`: `rename = "dataset_handle"` on `SaveProjectRequest::dataset`.
   - `panicked at protocol\skp\tests\fixtures.rs:507:33:` then `a first save: does not deserialize: unknown field `dataset`, expected one of `skp`, `dataset_handle`, `folder`, `workspace``.
4. `skp_version_is_skp_0_13`: the literal set back to `skp/0.12`.
   - `panicked at protocol\skp\tests\fixtures.rs:640:5:` then `left: "skp/0.12"` and `right: "skp/0.13"`.
5. U-W1: `outlineColor` given the match shape in the registry.
   - `panicked at kernel\src\session_history.rs:1915:52:` then `outlineColor is given a match`.
6. K-W1: the returned `referenced` list left empty.
   - `panicked at kernel\tests\record_step_match.rs:149:5:` then `left: Array []` and `right: Array [Object {"name": String("zone"), "type": String("Utf8")}]`.
7. K-W2: the `spatial_renderer::compile` call removed.
   - `panicked at kernel\tests\record_step_match.rs:190:9:` then `assertion `left == right` failed: a column the file lacks: this step could not be written and flushed to the session history: `nosuchcolumn` is not a file column (skp.session_history_unwritable)`, with `left: "skp.session_history_unwritable"` and `right: "skp.style_value_not_admitted"`.
8. K-W3: `Reached::note` does not note a match.
   - `panicked at kernel\tests\project_save.rs:660:9:` then `assertion `left == right` failed: [("civic", "#ff0000"), ("park", "#00ab00")]`, with `left: Some(Written)` and `right: Some(Withheld(WorkspaceDiffers("style")))`.
9. P-U1: `FolderUnusable` mapped to `project_folder_holds_project`.
   - `panicked at kernel\src\project\mod.rs:594:13:` then `assertion `left == right` failed: the project folder cannot be read: the disk said no`, with `left: "skp.project_folder_holds_project"` and `right: "skp.project_file_unwritable"`.
10. P-U2: the old `Display` text restored.
    - `panicked at kernel\src\project\mod.rs:620:9:` then `left: "the dataset has not been saved and no folder was given"`.
11. P-S1: centre read as y, x.
    - `panicked at kernel\tests\project_save_skp.rs:160:5:` then `left: [1200000.25, 2600000.5]` and `right: [2600000.5, 1200000.25]`.
12. P-S2: the version check removed.
    - `panicked at kernel\tests\project_save_skp.rs:192:43:` then ``called `Result::unwrap_err()` on an `Ok` value: SaveProjectResponse { project: "spatial://project/d6efa232eb7fa789d5ca2fb564012d06", history_mark: Withheld }``.
13. P-S3: the live check removed.
    - `panicked at kernel\tests\project_save_skp.rs:261:10:` then ``called `Result::unwrap_err()` on an `Ok` value: SaveProjectResponse { project: "spatial://project/6cef3d6241bc09cbb3b1d1c013b2f513", history_mark: Withheld }``.

I used `verify-mutation` for none of these. The new conformance rows are data inside existing tests and have no per-row mutation.

**Counting command**
- The command as the brief gives it, `…43a39222ebe6fbe1352c2268ef54521921028b66...HEAD`, lists 1001 files. 43a39222 is an ancestor of HEAD, so the three-dot range counts everything main added between it and the P1 merge. That output is not the step's own diff, so the group totals below do not come from it. It is saved as `<S>/b2c-p3-numstat.txt`.
- For the step's own diff I used the same command with base `e57d75e191ea35fe44c3a26887d73b82f4b53262`. That is the P1 merge's main parent and the merge-base, as in my P1 report. It lists 51 files, 5819 added and 210 deleted (6029 lines). It is saved as `<S>/b2c-p3-numstat-main.txt`.
- Group totals are added plus deleted lines. Which fixture files sit in the literal group and which in the fixtures group is my assignment, since the form does not split them.

| Group | Total | Ceiling |
|---|---|---|
| O0 probe | 144 (3 files) | 150 |
| ADR text | 45 | 80 |
| renderer | 123 | 200 |
| protocol product | **407** (4 files) | 320 (over by 87) |
| fixtures and protocol tests | **467** (14 files) | 260 (over by 207) |
| version literal | 90 lines, 14 files | 130 lines, 30 files |
| kernel product | **3206** (8 files) | 1,350 (already over; class 8) |
| kernel tests | **1547** (5 files) | 1,000 (overrun accepted ahead); includes `project_save_skp.rs` at 265, which the form's file list does not name |
| shell product, shell tests | 0 beyond the literal sites | not applicable at P2/P3 |
| Step total | **6029** lines, 51 files | ≤4,790 lines, ≤77 files |

Nothing was trimmed. The kernel product total includes O1's earlier work, since the base is the main-side merge-base.

**Departures and additions the form does not name**

1. `StyleSetParams` is not a plain widened `FillColor`. `FillColor` keeps its `String` value, and a new `FillColorMatch { value: ColourMatch }` variant is added. Serde goes through a private `StyleSetWire` enum, with `from` and `into`, that admits the match on `fillColor` only. Widening `FillColor` itself would have forced edits to `kernel/tests/session_history.rs:111` and `session_history_crash.rs:61` (I3). Both are unedited.
2. The wire `view` has `centre` and `zoom` only; the kernel writes `crs` from the dataset's admission. A conformance row refuses a wire `crs`. `SKP-V0.md` §11.2 says so.
3. **The save_project request fixtures are not under `protocol/skp/tests/data/`.** I wrote them there first. The shell's `src/console/renderTruth.test.ts` reads every `v0-<command>-request*.json` there and failed with `no REQUEST_KEY_SETS entry for command "save_project"`. Fixing that means editing an existing shell test outside P2's list, which is the I3 stop. I removed the two files rather than edit it. Both requests are now held inline in the `fixtures.rs` test and as conformance rows `req-save-project` and `rej-save-project-view-with-crs`. The response and the five error fixtures stay under `tests/data/`.
   - Decision for you: when P5 adds a `save_project` entry to `REQUEST_KEY_SETS`, the request files can go in. Say if you would rather P2 had stopped on this.
4. `key_present` in `commands.rs` is generalised to any `Option<T>`, so `folder` and the workspace's `filter` stay required-but-nullable keys.
5. Extras beyond the form's list, apart from the tests named above: the five `v0-error-project_*.json` fixtures, `v0-save_project-response.json`, six new conformance rows (`req-record-step-fill-match`, `req-save-project`, `rej-record-step-match-on-fill-opacity`, `rej-save-project-without-folder`, `rej-save-project-view-with-crs`, `resp-save-project`), the `Prepared` struct, and `Bind` mapped to `project_file_refused` with path `$.datasets[0]`.
6. `SKP-V0.md` §11 states only behaviour that is now built.
7. `cargo fmt --all` was used, and the commits were made with `-s`; the `Signed-off-by` was added by git.
8. `verify-quotes --show-cites` on the changed files ended `PASS — 0 checked, 0 verified`.

**Holds**
- Each run used `hold shared -Project SpatialIDE`: the kernel check, the full cargo tests at P2 and at P3, `npm run verify` (twice), clippy (twice), the spatial-skp test runs, the P3 unit and seam run, and the 13 mutation runs. Each was released.
- Hold lines (`also=` elided) were printed for the foreground holds. Examples:
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:80524`
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:15840`
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:67952`
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:340`
- The background holds' lines went to their output files.
- No hold was refused (no exit 96 to 99).

**Push**
- `git push origin cut/b2-piece-1c-save-and-reopen` gave `7eb5aa71..41c32190`.
- `git rev-parse HEAD` and `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` both gave 41c32190b81eff94afeff54ba18c184789b23092.
- The porcelain printed `[]`.
- I opened no PR and did not wait on CI.

**Background shells**
- Every background command I started reported completed. I killed nothing, and left no process of mine running.
- A process listing by command line still shows bash.exe and one powershell.exe entries matching the worktree path (PIDs 53604, 60008, 72480 and 12772). I believe these are the shell tool's own sessions and not jobs I started, so I did not touch them.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as the harness reports it.
