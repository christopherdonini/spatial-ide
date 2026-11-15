*Custodian's filing note (2026-11-11): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-11 (17:40Z) (`state/directives/2026-11-11-seven-platform-runs-read-hourly-filed-as-consults-307-review-into-its-gate-round-stall-report-beside-the-reads.md`, line 7); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-11/INDEPENDENT-REVIEW-PR-307-2026-11-11.md` (31311 bytes, sha256 6fe4b15e2267a692e268c2fb10b691b8ea30493219a586228f19bdf45f76671a; modified 2026-11-11T22:25:12Z; the folder holds no index file at this reading): session sesn_012jzzCN8dhfarakgHhFxgrR, agent spatial-ide-indipendent-reviewer-agent (claude-fable-5-1, effort high; the agent's own system prompt), US$ 16.43, about 1048 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It reviewed #307 at 190c6c80788eff296d8ddb998db43c5055d6e820 (R3-1 and R3-3; 1e4a7b6fca29bc59866182719edcc67461ec7553 first), merge base e3fb4a97ebef726f77a5e2609b8fada32a6b1208, main being at 572416aa73b1c0f2aaa479ad3476a4829c14d26a (its own first lines say); #307's head is still 190c6c80 at this filing (by git ls-remote), R3-2 not yet pushed. From 572416aa to main at 8b5e3d21, 8 commits changed no file outside state/, governance/ and site/ (by git diff --name-only), so its readings of product, docs and KNOWN-LIMITATIONS files hold at this filing; its readings of governance and state records are read again before any node rests on them. It is filed under state/drafts/, not state/consults/: it carries 18 rooted path:line cites that do not hold on main as written (14 into files absent from main, 4 past a file's end, by my script's count), most into a branch's files; state/drafts/ is where such cites stay advisory, as for the 2026-11-05 filing `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md`. By that direction its findings go into #307's gate round: gate 1's second attempt, over R3's head, carries it in its packet (correctness C1 and C2, evidence E1 and E2, three documentation items, the notes).*

---

# Independent review of open #307 (1c step 1, save), 2026-11-11

Provenance. An independent agent on the Claude Platform (claude-fable-5-1, effort high; agent `spatial-ide-indipendent-reviewer-agent`, the agent's own system prompt) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (origin/main was 572416aa when the run started). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_012jzzCN8dhfarakgHhFxgrR) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 1048 s active, US$ 16.43, last stop reason end_turn. Nothing below this line is edited.

---

I'll start by cloning the repository and fetching the pull request.

-----

The tip is still 1e4a7b6f. Now the form, amendments last-first.

-----

Now the diff: file list and sizes.

-----

Now the kernel code. Let me read the project module files in full.

-----

Now the session_history.rs diff — the largest changed existing file.

-----

Good. Now the TypeScript mirror and the shell save path.

-----

**Repository:** christopherdonini/spatial-ide · **PR #307** · **commit reviewed:** 1e4a7b6fca29bc59866182719edcc67461ec7553 (tip unchanged since the run started) · **merge base with origin/main:** e3fb4a97ebef726f77a5e2609b8fada32a6b1208

Form read from origin/main: `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 19 first, back to Amendment 1 and §0–§10; Annex A and Annex B rebuilt from the form and compared byte for byte with the ADR-036 and ADR-022 additions on the branch (both match; the ADR-022 Note 2026-11-05 matches the directive's item 3 text).

Already known to the maintainers, seen, not re-reported beyond this line: (a) `SaveProjectResponse` carries no member for `Saved.carried`, so S18 cannot be shown (`kernel/src/project/mod.rs:334-341`); (b) a second open of one file in one run marks the first project's record (`kernel/src/session_history.rs:413-417` matches by path and claims; `adopt_project` returns `Ok` at `:280-282` when the record already has a project).

## Correctness

**C1. A folder fsync that fails after a successful rename reports the save as not written, though `project.spatial` was replaced.** `kernel/src/project/store.rs:136-141`: on `rename` success, `sync_folder(&self.folder)?` runs before `return Ok(())`; `sync_folder` (`:161-166`) maps a failed `sync_all` on the directory to `SaveError::Unwritable { what: "the project folder" }`. `Projects::save` (`mod.rs:296`) then returns `Err(ProjectFileUnwritable)` before `saved.push` (`:297-305`) and before the history moves (`:307`). Concrete case (POSIX only; on Windows `File::open(folder)` fails and the branch is skipped): a first save into a folder on a filesystem whose directory `fsync`/`F_FULLFSYNC` returns an error (macOS SMB volumes, some FUSE/network filesystems on Linux). On disk: the new `project.spatial` is in place, `projects/<hex>/locations.json` and `folders.json` are written. Reply: `skp.project_file_unwritable` "the project could not be written: the project folder: …"; the shell shows S4. The open is not recorded as saved, so the next save asks for a folder again; the same folder is refused `skp.project_folder_holds_project`, a different folder mints a second identity for the same session. The guarantees stated at `protocol/skp/src/v0/error.rs:188-190` ("a refusal leaves the previous one in place"), `protocol/skp/SKP-V0.md:1343` ("A refusal leaves the previous file in place") and §11.3's "A refusal writes no project file" do not hold on this path. Confirmed by reading; not observed (no test exercises a failing directory sync). Fix shape: treat the folder sync's failure after a successful rename as non-fatal (or record the save before returning it), and word the two sentences to match.

**C2. A save made before any step leaves the later steps in an `unsaved-` record with `project: not-yet-saved`, for a project that exists.** `kernel/src/session_history.rs:274-278`: `adopt_project` returns `Ok(())` when `find` has no record. A `record_step` after the save then creates the record through `create` (`:354-365`), always as `unsaved-<hex>` with `project: None` (`:357`, `:404`), consulting nothing about the saved project. Concrete case: open → Save project (no step yet; the mark is withheld as `NoStepRecorded`) → apply a filter → crash. The machine holds `sessions/unsaved-…/history.jsonl` whose header says `not-yet-saved`, and `projects/<hex>/` with a project file; step 3's recovery, as §2.6 and ADR-036 §9 describe it, would offer this as a session that never saved. A second save in the same session repairs it (the record is then moved), but nothing before that does. Amendment 1 item 5 / Annex A item 5 state the move at the first save and do not address this order of events, so this may be a ruling rather than a code fix; the code path is confirmed by reading.

## Evidence

**E1. `Withheld::NoStepRecorded` is asserted nowhere.** SKP-V0 §11.2 and `HistoryMarkState`'s doc say `withheld` covers "the history holds no recorded step"; `kernel/src/project/mod.rs:358` maps it. K-S2, K-S3, K-S5, K-S10–K-S13 all save with no step and none asserts `history_mark` (`kernel/tests/project_save.rs:305-339` etc.); `grep NoStep` over `kernel/tests` finds nothing. A regression that wrote a mark with `after: null`, or returned `Written`, would pass every test here. One assertion on an existing no-step save closes it.

**E2. A later save over an existing file the reader refuses (`mod.rs:260-265`, `Err(e) => FileRefused`) and the `MachineStore` write failures (`:280-294`) have no test**; `each_save_failure_maps_to_its_own_code…` checks only the mapping from a hand-built variant. Not form-named; recorded as a gap, not a block.

Changed existing tests (each checked before/after): `admitDataset.test.ts`, `skp/client.test.ts`, `protocol/skp/tests/fixtures.rs::skp_version_is_skp_0_13` and the fixture files — literal `skp/0.12`→`skp/0.13` only; `surfaceCompleteness.test.ts:203` — `save_project` added to the fixed class-A list (Amendment 11); `actionRegistry.test.ts:132-142` — `project.save` added to the sorted id list (Amendment 12); `no_generation_in_persisted_artifacts.rs` — module doc and a new test only. No assertion weakened. `session_history.rs`'s `read_line` now parses through `strict_json` and adds `in_writers_form` (OPEN-19 (A)); its new test `recover_refuses_a_line_out_of_declared_order_or_off_canonical_spelling` asserts the added refusals; the depth 32 / 65,536-byte string bounds it introduces on history lines are the values Amendment 2 item 5 disclosed.

## Documentation (fix in this PR, no re-gate)

- `kernel/src/project/mod.rs:158`: `FolderRequired`'s doc comment still says "The dataset has not been saved", the wording Amendment 7 item 1 removed from the `Display` arm because the kernel does not know it (it keys by the open).
- `kernel/src/project/mod.rs:20-21`: "The only file written in a project folder is `project.spatial`" — `store.rs:108-113` also writes `project.spatial.tmp-<hex>` there.
- `protocol/skp/src/v0/error.rs:188-190` and `protocol/skp/SKP-V0.md:1343`: the "previous file in place" sentences, per C1.

## Notes

- One dataset in one project carries two `spatial://dataset/ref/` identities: the session record mints its own at the first step (`session_history.rs:253`, `:376`) and `Projects::save` mints another for the file (`mod.rs:245`), kept per open. ADR-036 §4 names one minting point ("when a dataset first enters a project"). Nothing in step 1 reads across the two by URI; a later piece that matches a record's `data.dataset` against the project file's entry will not match. Confirmed by reading.
- A later save reads the file found in the folder only for its `lineage` and reader-acceptance (`mod.rs:260-265`); it does not compare that file's `project` with the open's identity, so a foreign project file placed there mid-session is overwritten under this open's identity.
- `remove_stale_temps` (`store.rs:175-185`) removes every `project.spatial.tmp-<16 hex>` in the folder, including one a concurrent second process has staged and not yet renamed (step 1 has no open lock); that process then fails its rename five times with NotFound and reports `RenameKeepsFailing`. By the form's declared rule; noted for the step 2 lock.
- `KnownFolders::to_bytes` (`store.rs:220-242`) and `locations_json` (`mod.rs:485-502`) do not bound their path strings, while `from_bytes` refuses a string over 4,096 bytes (`FOLDERS_LIMITS`); a folder path over that length would be written at save and refused at step 2's read.
- Path judgment, read against §2.5 and ADR-036 §5: canonical P under canonical F, `at` from P's on-disk spelling, the text rule (device names, trailing dot/space, controls; the 32-name list matches the ADR), 64-segment bound, and the walk of the opened path from the first prefix that canonicalizes to F — a link above the folder is not a link "from F", a link below is refused, a file reached by a path that never passes through F (a symlink to the file from outside) is refused as through-link; a `symlink_metadata` error is treated as a link. No defect found.
- Wire types vs TypeScript mirror (`types.ts:314-355` against `commands.rs:669-752`): members, nullability (`folder`, `filter` present-and-nullable via `key_present`), `HexF64` view, `history_mark` literals all agree; the shell's `StepIntent` is not widened for the match, as Amendment 7 says.
- Error mapping `skp_error_of` (`mod.rs:416-431`) is exhaustive, each variant to a code in SKP-V0 §11.4 with the documented fields.
- Declared-unchanged list checked: no change under `engine/`, `protocol/data-plane/`, `kernel/src/permission/`, `renderer/` outside the appended function and its test; no lockfile or manifest change outside `spikes/`; ADR-036/ADR-022 changed only by the appended amendments and the Note.

## What I would run and why

- `cargo test --locked --features spatial-engine/fixture -p spatial-kernel` on Windows (junction arm of K-S4, `mklink /J`) and on Linux (symlink arm; `sync_folder` is live only there) — the suites the form names, plus `record_step_match.rs` and `project_save_skp.rs`.
- For C1: on Linux, `replace()` against a folder whose directory fsync fails (a FUSE mount, or `sync_folder` made injectable) to observe the `Err` with `project.spatial` already replaced.
- For C2: a kernel test open → `save` (no step) → `record_step` → read `sessions/`: expect `unsaved-*` with `not-yet-saved`.
- `npm run verify` and `node e2e/project.mjs` on Windows for the shell seam; `cargo test -p spatial-skp` for the conformance rows.

-----

The sandbox survived (clone, form and all notes intact), but the pull request's tip has moved since my first pass: it is now 190c6c80, not 1e4a7b6f. Reviewing the new tip, starting with what changed.

-----

The form on main has new amendments (20–23). Reading those first, then the two new commits.

-----

Now the two new commits in full.

-----

**Repository:** christopherdonini/spatial-ide · **PR #307** · **commit reviewed:** 190c6c80788eff296d8ddb998db43c5055d6e820 — the tip moved after the run started: 1e4a7b6f was reviewed in full first, then the two commits on top of it (c57f090b = R3-1, Amendment 20; 190c6c80 = R3-3, Amendment 22's words) at the new tip; R3-2 (Amendment 21) is not on the branch yet, as Amendment 23 records · **merge base with origin/main:** e3fb4a97ebef726f77a5e2609b8fada32a6b1208

Sandbox state survived the interruption; nothing was redone beyond fetching the moved tip and reading Amendments 20–23 and the two new commits. Form read from origin/main, last amendment (23) first. Annex A and Annex B compared byte for byte with the ADR-036 and ADR-022 additions (both match; the ADR-022 Note matches the directive's item 3).

Known to the maintainers, one line each: (a) the reply's missing judgment member is now closed at the tip by `project_relative` (`kernel/src/project/mod.rs:342`, `protocol/skp/src/v0/commands.rs:740`, `types.ts:353-360`, K-S14, P-U3, SH-9, E-SAVE's three steps) — no further report; (b) a second open of one file marks the first project's record (`session_history.rs:413-417` matches by path and claims; `adopt_project` returns `Ok` at `:280-282`) — still open at this tip, pending R3-2.

## Correctness

**C1. A folder fsync that fails after a successful rename reports the save as not written, though `project.spatial` was replaced.** `kernel/src/project/store.rs:136-141`: on `rename` success, `sync_folder(&self.folder)?` runs before `return Ok(())`; `sync_folder` (`:161-166`) maps a failed `sync_all` on the opened directory to `SaveError::Unwritable { what: "the project folder" }`. `Projects::save` (`mod.rs:297`) then returns `Err(ProjectFileUnwritable)` before `saved.push` (`:298-306`) and the history moves (`:308`). Concrete case (POSIX only; on Windows `File::open(folder)` fails and the branch is skipped — consistent with the suites passing there): a first save into a folder on a filesystem whose directory `fsync`/`F_FULLFSYNC` errors (macOS SMB volumes; some FUSE/network filesystems on Linux). On disk: the new `project.spatial` is in place, `projects/<hex>/locations.json` and `folders.json` are written. Reply: `skp.project_file_unwritable` "the project could not be written: the project folder: …"; the shell shows S4. The open is not recorded as saved, so the next save asks for a folder; the same folder is refused `skp.project_folder_holds_project`, a different one mints a second identity for the session. The guarantees at `protocol/skp/src/v0/error.rs:188-190` ("a refusal leaves the previous one in place"), `SKP-V0.md:1343` ("A refusal leaves the previous file in place") and §11.3's "A refusal writes no project file" do not hold on this path. Confirmed by reading; not observed (no test exercises a failing directory sync). Fix shape: treat a folder-sync failure after a successful rename as non-fatal (or record the save before returning it) and bring the two sentences to match.

**C2. A save made before any step leaves later steps in an `unsaved-` record with `project: not-yet-saved`, for a project that exists.** `session_history.rs:274-278`: `adopt_project` returns `Ok(())` when `find` has no record. A `record_step` after the save then creates the record through `create` (`:354-365`), always as `unsaved-<hex>` with `project: None` (`:357`, `:404`), consulting nothing about the saved project. Case: open → Save (no step; mark withheld `NoStepRecorded`) → apply a filter → crash. The machine holds `sessions/unsaved-…/history.jsonl` with a `not-yet-saved` header beside `projects/<hex>/` and the project file; step 3's recovery, as §2.6 and ADR-036 §9 describe it, would offer it as a session that never saved. A second save in the session repairs it; nothing before that does. Annex A item 5 states the move at the first save and does not address this order, so this may be a ruling rather than a code fix; the path is confirmed by reading.

## Evidence

**E1. `Withheld::NoStepRecorded` is asserted nowhere.** SKP-V0 §11.2 and `HistoryMarkState`'s doc say `withheld` covers "the history holds no recorded step"; `mod.rs:359` maps it. K-S2, K-S3, K-S5, K-S10–K-S13 and K-S14's four cases all save with no step and none asserts `history_mark`; `grep NoStep` over `kernel/tests` finds nothing. A regression writing a mark with `after` unset, or answering `Written`, passes every test here. One assertion on an existing no-step save closes it.

**E2. Untested paths, recorded not blocking:** a later save over an existing file the reader refuses (`mod.rs:261-266`, `Err(e) => FileRefused`) and the `MachineStore` write failures (`:281-295`); `each_save_failure_maps_to_its_own_code…` checks only the mapping from hand-built variants.

Changed existing tests, each checked before/after: `admitDataset.test.ts`, `skp/client.test.ts`, `fixtures.rs::skp_version_is_skp_0_13` and the fixture files — literal `skp/0.12`→`0.13` only; `surfaceCompleteness.test.ts` — `save_project` added to the fixed list (Amendment 11), identifier renamed `expectedSeven` (Amendment 22, class 3); `actionRegistry.test.ts:132-142` — `project.save` added (Amendment 12); `no_generation_in_persisted_artifacts.rs` — doc and a new test; P-S1 now asserts the reply with `project_relative: "outside"` (the rig's data is outside its folder) — asserts more, not less; the two shell mocks gained the member (Amendment 20 item 5). `read_line` now parses through `strict_json` with `in_writers_form` (OPEN-19 (A)); the depth 32 / 65,536-byte line bounds it introduces are the values Amendment 2 item 5 disclosed. No assertion weakened.

## Documentation (fix in this PR, no re-gate)

- `kernel/src/project/mod.rs:159`: `FolderRequired`'s doc comment still says "The dataset has not been saved", the claim Amendment 7 item 1 removed from the `Display` arm because the kernel keys by the open and cannot know it.
- `kernel/src/project/mod.rs:20-21`: "The only file written in a project folder is `project.spatial`" — `store.rs:108-113` also writes `project.spatial.tmp-<hex>` there.
- `protocol/skp/src/v0/error.rs:188-190` and `protocol/skp/SKP-V0.md:1343`: the "previous file in place" sentences, per C1.

## Notes

- One dataset in one project carries two `spatial://dataset/ref/` identities: the session record mints its own at the first step (`session_history.rs:253`, `:376`) and `Projects::save` mints another for the file (`mod.rs:246`), kept per open. ADR-036 §4 names one minting point. Nothing in step 1 reads across the two by URI; a later piece matching a record's `data.dataset` against the project file's entry will not match. Confirmed by reading.
- A later save reads the file found in the folder only for its `lineage` and reader-acceptance (`mod.rs:261-266`); it does not compare that file's `project` with the open's identity, so a foreign project file placed there mid-session is overwritten under this open's identity.
- `remove_stale_temps` (`store.rs:175-185`) removes every `project.spatial.tmp-<16 hex>` in the folder, including one a concurrent second process has staged (step 1 has no open lock); that process then fails its rename five times with NotFound. By the form's declared rule; noted for step 2's lock.
- `KnownFolders::to_bytes` (`store.rs:220-242`) and `locations_json` (`mod.rs:486-503`) do not bound their path strings, while `from_bytes` refuses a string over 4,096 bytes (`FOLDERS_LIMITS`): a folder path over that length is written at save and refused at step 2's read.
- Path judgment, read against §2.5 and ADR-036 §5 (`resolver.rs:63-119`): canonical P under canonical F; `at` from P's on-disk spelling; the text rule (the 32-name device list matches the ADR; trailing dot/space; controls U+0000–001F, U+007F–009F); the 64-segment bound; the walk of the opened path from the first prefix that canonicalizes to F — a link above the folder is not "from F", a link below is refused, a file reached by a path that never passes through F is refused as through-link, a `symlink_metadata` error counts as a link. The reply's map (`mod.rs:372-381`) is exhaustive. No defect found.
- Wire types vs TypeScript (`types.ts:314-360` against `commands.rs:669-770`): members, nullability (`folder`, `filter` present-and-nullable via `key_present`), `HexF64` view, `history_mark` and `project_relative` literals agree; `ProjectRelativeLocator` is closed with no `default`; the shell's `StepIntent` is not widened for the match, as Amendment 7 says.
- Error mapping `skp_error_of` (`mod.rs:418-433`) is exhaustive, each variant to a §11.4 code with the documented fields; `ProjectRelativeLocator` and `S18` landed as Amendment 20 items 2–4 name them (`saveProject.ts:29-31`, `:110-115`), shown for `no-canonical-spelling` only.
- Declared-unchanged list: no change under `engine/`, `protocol/data-plane/`, `kernel/src/permission/`, `renderer/` outside the appended function and its test; no lockfile or manifest change outside `spikes/`; ADR-036/ADR-022 changed only by the appended amendments and the Note. Lock diffs empty at both 1e4a7b6f and 190c6c80.

## What I would run and why

- `cargo test --locked --features spatial-engine/fixture -p spatial-kernel` on Windows (junction arms of K-S4 and K-S14, `mklink /J`) and on Linux (symlink arms; `sync_folder` is live only there), plus `cargo test -p spatial-skp` for P-U3 and the conformance rows.
- For C1: on Linux, `replace()` against a folder whose directory fsync fails (a FUSE mount, or `sync_folder` made injectable), expecting `Err` with `project.spatial` already replaced.
- For C2: open → `save` (no step) → `record_step` → list `sessions/`: expect `unsaved-*` with a `not-yet-saved` header.
- `npm run verify` and `node e2e/project.mjs` on Windows for the shell seam including the new INSIDE-OPEN/INSIDE-SAVE/NOTICE-S18 steps (which need a rebuilt app, per Amendment 20's m-s18 note).

-----

The sandbox is intact, the pull request's tip is still 190c6c80 and main has not moved since my second pass, so the review stands as completed; nothing was redone. The report follows.

**Repository:** christopherdonini/spatial-ide · **PR #307** · **commit reviewed:** 190c6c80788eff296d8ddb998db43c5055d6e820 — the tip moved after the run started: 1e4a7b6f was reviewed in full first, then the two commits above it at the new tip (c57f090b = R3-1, Amendment 20; 190c6c80 = R3-3, Amendment 22's words); R3-2 (Amendment 21) is not on the branch yet, as Amendment 23 records · **merge base with origin/main:** e3fb4a97ebef726f77a5e2609b8fada32a6b1208

Sandbox state survived both interruptions; nothing was redone beyond re-checking that the tip and main had not moved. Form read from origin/main, Amendment 23 first. Annex A and Annex B compared byte for byte with the ADR-036 and ADR-022 additions (both match; the ADR-022 Note matches the directive's item 3).

Known to the maintainers, one line each: (a) the reply's missing judgment member is closed at this tip by `project_relative` (`kernel/src/project/mod.rs:342`, `protocol/skp/src/v0/commands.rs:740`, `types.ts:353-360`, K-S14, P-U3, SH-9, E-SAVE's three new steps) — nothing further; (b) a second open of one file marks the first project's record (`session_history.rs:413-417` matches by path and claims; `adopt_project` returns `Ok` at `:280-282`) — still open at this tip, pending R3-2.

## Correctness

**C1. A folder fsync that fails after a successful rename reports the save as not written, though `project.spatial` was replaced.** `kernel/src/project/store.rs:136-141`: on `rename` success, `sync_folder(&self.folder)?` runs before `return Ok(())`; `sync_folder` (`:161-166`) maps a failed `sync_all` on the opened directory to `SaveError::Unwritable { what: "the project folder" }`. `Projects::save` (`mod.rs:297`) then returns `Err(ProjectFileUnwritable)` before `saved.push` (`:298-306`) and before the history moves (`:308`). Concrete case (POSIX only; on Windows `File::open(folder)` fails and the branch is skipped, consistent with the suites passing there): a first save into a folder on a filesystem whose directory `fsync`/`F_FULLFSYNC` errors (macOS SMB volumes; some FUSE/network filesystems on Linux). On disk: the new `project.spatial` is in place, `projects/<hex>/locations.json` and `folders.json` are written. Reply: `skp.project_file_unwritable` "the project could not be written: the project folder: …"; the shell shows S4. The open is not recorded as saved, so the next save asks for a folder; the same folder is refused `skp.project_folder_holds_project`, a different one mints a second identity for the session. The guarantees at `protocol/skp/src/v0/error.rs:188-190` ("a refusal leaves the previous one in place"), `SKP-V0.md:1343` ("A refusal leaves the previous file in place") and §11.3's "A refusal writes no project file" do not hold on this path. Confirmed by reading; not observed. Fix shape: treat a folder-sync failure after a successful rename as non-fatal (or record the save before returning it), and bring the two sentences to match.

**C2. A save made before any step leaves later steps in an `unsaved-` record with `project: not-yet-saved`, for a project that exists.** `session_history.rs:274-278`: `adopt_project` returns `Ok(())` when `find` has no record. A `record_step` after the save then creates the record through `create` (`:354-365`), always as `unsaved-<hex>` with `project: None` (`:357`, `:404`), consulting nothing about the saved project. Case: open → Save (no step; mark withheld `NoStepRecorded`) → apply a filter → crash. The machine holds `sessions/unsaved-…/history.jsonl` with a `not-yet-saved` header beside `projects/<hex>/` and the project file; step 3's recovery, as §2.6 and ADR-036 §9 describe it, would offer it as a session that never saved. A second save in the session repairs it; nothing before that does. Annex A item 5 states the move at the first save and does not address this order, so this may be a ruling rather than a code fix; the path is confirmed by reading.

## Evidence

**E1. `Withheld::NoStepRecorded` is asserted nowhere.** SKP-V0 §11.2 and `HistoryMarkState`'s doc say `withheld` covers "the history holds no recorded step"; `mod.rs:359` maps it. K-S2, K-S3, K-S5, K-S10–K-S13 and K-S14's four cases all save with no step and none asserts `history_mark`; `grep NoStep` over `kernel/tests` finds nothing. A regression writing a mark with `after` unset, or answering `Written`, passes every test here. One assertion on an existing no-step save closes it.

**E2. Untested paths, recorded not blocking:** a later save over an existing file the reader refuses (`mod.rs:261-266`, `Err(e) => FileRefused`) and the `MachineStore` write failures (`:281-295`); `each_save_failure_maps_to_its_own_code…` checks only the mapping from hand-built variants.

Changed existing tests, each checked before/after: `admitDataset.test.ts`, `skp/client.test.ts`, `fixtures.rs::skp_version_is_skp_0_13` and the fixture files — literal `skp/0.12`→`0.13` only; `surfaceCompleteness.test.ts` — `save_project` added to the fixed list (Amendment 11), identifier renamed `expectedSeven` (Amendment 22, class 3); `actionRegistry.test.ts:132-142` — `project.save` added (Amendment 12); `no_generation_in_persisted_artifacts.rs` — doc and a new test; P-S1 now asserts the reply with `project_relative: "outside"` (the rig's data is outside its folder) — asserts more, not less; the two shell mocks gained the member (Amendment 20 item 5). `read_line` now parses through `strict_json` with `in_writers_form` (OPEN-19 (A)); the depth 32 / 65,536-byte line bounds it introduces are the values Amendment 2 item 5 disclosed. No assertion weakened.

## Documentation (fix in this PR, no re-gate)

- `kernel/src/project/mod.rs:159`: `FolderRequired`'s doc comment still says "The dataset has not been saved", the claim Amendment 7 item 1 removed from the `Display` arm because the kernel keys by the open and cannot know it.
- `kernel/src/project/mod.rs:20-21`: "The only file written in a project folder is `project.spatial`" — `store.rs:108-113` also writes `project.spatial.tmp-<hex>` there.
- `protocol/skp/src/v0/error.rs:188-190` and `protocol/skp/SKP-V0.md:1343`: the "previous file in place" sentences, per C1.

## Notes

- One dataset in one project carries two `spatial://dataset/ref/` identities: the session record mints its own at the first step (`session_history.rs:253`, `:376`) and `Projects::save` mints another for the file (`mod.rs:246`), kept per open. ADR-036 §4 names one minting point. Nothing in step 1 reads across the two by URI; a later piece matching a record's `data.dataset` against the project file's entry will not match. Confirmed by reading.
- A later save reads the file found in the folder only for its `lineage` and reader-acceptance (`mod.rs:261-266`); it does not compare that file's `project` with the open's identity, so a foreign project file placed there mid-session is overwritten under this open's identity.
- `remove_stale_temps` (`store.rs:175-185`) removes every `project.spatial.tmp-<16 hex>` in the folder, including one a concurrent second process has staged (step 1 has no open lock); that process then fails its rename five times with NotFound. By the form's declared rule; noted for step 2's lock.
- `KnownFolders::to_bytes` (`store.rs:220-242`) and `locations_json` (`mod.rs:486-503`) do not bound their path strings, while `from_bytes` refuses a string over 4,096 bytes (`FOLDERS_LIMITS`): a folder path over that length is written at save and refused at step 2's read.
- Path judgment, read against §2.5 and ADR-036 §5 (`resolver.rs:63-119`): canonical P under canonical F; `at` from P's on-disk spelling; the text rule (the 32-name device list matches the ADR; trailing dot/space; controls U+0000–001F, U+007F–009F); the 64-segment bound; the walk of the opened path from the first prefix that canonicalizes to F — a link above the folder is not "from F", a link below is refused, a file reached by a path that never passes through F is refused as through-link, a `symlink_metadata` error counts as a link. The reply's map (`mod.rs:372-381`) is exhaustive. No defect found.
- Wire types vs TypeScript (`types.ts:314-360` against `commands.rs:669-770`): members, nullability (`folder`, `filter` present-and-nullable via `key_present`), `HexF64` view, `history_mark` and `project_relative` literals agree; `ProjectRelativeLocator` is closed with no `default`; the shell's `StepIntent` is not widened for the match, as Amendment 7 says. `open_dataset`'s cancel key dies at return (`skp.rs:1111-1119`), so K-S14's reuse of `"k"` across sequential opens is sound.
- Error mapping `skp_error_of` (`mod.rs:418-433`) is exhaustive, each variant to a §11.4 code with the documented fields; `ProjectRelativeLocator` and S18 landed as Amendment 20 items 2–4 name them (`saveProject.ts:29-31`, `:110-115`), shown for `no-canonical-spelling` only.
- Declared-unchanged list: no change under `engine/`, `protocol/data-plane/`, `kernel/src/permission/`, `renderer/` outside the appended function and its test; no lockfile or manifest change outside `spikes/`; ADR-036/ADR-022 changed only by the appended amendments and the Note. Lock diffs empty at both 1e4a7b6f and 190c6c80.

## What I would run and why

- `cargo test --locked --features spatial-engine/fixture -p spatial-kernel` on Windows (junction arms of K-S4 and K-S14, `mklink /J`) and on Linux (symlink arms; `sync_folder` is live only there), plus `cargo test -p spatial-skp` for P-U3 and the conformance rows.
- For C1: on Linux, `replace()` against a folder whose directory fsync fails (a FUSE mount, or `sync_folder` made injectable), expecting `Err` with `project.spatial` already replaced.
- For C2: open → `save` (no step) → `record_step` → list `sessions/`: expect `unsaved-*` with a `not-yet-saved` header.
- `npm run verify` and `node e2e/project.mjs` on Windows for the shell seam including the new INSIDE-OPEN/INSIDE-SAVE/NOTICE-S18 steps (which need a rebuilt app, per Amendment 20's m-s18 note).

-----

