*Custodian's filing note (2026-10-11): module-docs-stale-statements worker report 2, correction round 1 under the form's Amendment 2, the worker run 14:33:58Z to 14:49:53Z by its transcript, on cut/module-docs-stale-statements, head 1c3b4dbec38dca866b004493e52957f359101002, published; the C-1 sentences are the worker's words. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added. The sha256 of the report as handed back is 7349720b8e6c195a8aaae89c11d34a68a37205b7bf24b76b9ac399aacd01e96e.*

---

Correction round 1 on PR #209: all five changes are made and pushed, and one wording differs from your brief (change 5, below). Every run passed.

**Head and commits**
- New head: `1c3b4dbec38dca866b004493e52957f359101002`.
- Commit 1: `6a976e14fb2c989c97d7c0fae2c4d125c6420c60`, "docs: the stream sentences claim only the module's own code and name DuckDB's default spill (gate 1 C-1)".
- Commit 2: `1c3b4dbec38dca866b004493e52957f359101002`, "docs: the owner's-index lines, and gate 1's documentation findings (Amendment 2 item 3)".
- Both are `-s` with the Co-Authored-By trailer, pushed with `git push origin cut/module-docs-stale-statements` (117d8d5c..1c3b4dbe).
- Preconditions held: HEAD and origin were both 117d8d5c, and the tree was clean.

**1. C-1.** The old sentence was "The stream path writes nothing." at all three sites. The new text is below, with line breaks as in the files.
- **`engine/README.md`, in the "No registry, no lineage…" bullet (now about line 93).** The new text replaces the first sentence after the bold lead-in. The tier-builder sentence that follows is unchanged.
  > The stream code in this module opens no file for writing; DuckDB's default spill of intermediates, such as a large sort's, is not configured off by the engine (`kernel/CANCELLATION-AND-TRACING.md` §7; `kernel/RESULTS.md`, the subsection on §5d being partially measurable).
- **`engine/src/lib.rs`, lines 53-57.**
  > The stream code in this module opens no file for writing, and DuckDB's default spill of intermediates is not configured off by the engine (`kernel/CANCELLATION-AND-TRACING.md` §7; `kernel/RESULTS.md`, the subsection on §5d being partially measurable). The stream is a pure transformation (ADR-006); it claims no reproducibility grade (ADR-005).
- **`kernel/src/lib.rs`, lines 38-42.** This also carries D-3.
  > Besides the bundle, the permission boundary's audit log (`permission::audit`) writes: it creates its directory, appends to its file, and rotates it (`rotate_if_needed`). The kernel's own stream code opens no file for writing; DuckDB's default spill of intermediates is not configured off by the engine (`kernel/CANCELLATION-AND-TRACING.md` §7; `kernel/RESULTS.md`, the subsection on §5d being partially measurable).
- **What I checked first:**
  - `engine/src/pool.rs` sets only `autoinstall_known_extensions`, `autoload_known_extensions` and `enable_geoparquet_conversion`. No `temp_directory` or `memory_limit` is set anywhere in `engine/src` or `kernel/src`.
  - A grep for `File::create`, `OpenOptions`, `fs::write` and `create_dir` in `stream.rs` and `skp.rs` finds only test fixtures. The one non-test mention is a comment about the publish path's style file.
  - `kernel/CANCELLATION-AND-TRACING.md` §7 says a large sort "can still spill somewhere unrecorded"; the `kernel/RESULTS.md` subsection says `temp_directory` was never set.
  - `rotate_if_needed` is at `kernel/src/permission/audit/log.rs`.

**2. Owner's-index lines.**
- `kernel/README.md` §1.1: the preregistrations list now ends with `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md`.
- `engine/README.md` §2.1: the engine halves list ends with the same entry.
- A script took the old and new lines from the four fenced blocks in lead-data's update, and asserted each old line matched exactly once before replacing it. Both matched.

**3. D-2.** The `kernel/README.md` H2 row (line 335) used to say "at most one batch after the cancel is observed". It now says "at most one batch after the adapter's receipt of the cancel", which is the row's own wording.

**4. D-4 / D-1.** The `engine/README.md` attribute paragraph (about line 394) now begins "Of a projection's columns, only publish preflight refuses `Float32` and dictionaries, as ADR-017 §4's…".

**5. D-2 (reviewer).** In the note appended to `kernel/PERMISSION-BOUNDARY.md` (line 497), "permission-boundary section, first bullet" became `section headed "Publishing, and the trigger this file named in advance", first bullet`. The quoted span was copied from the `kernel/README.md` heading by script. This differs from the brief in one way: the brief called the first bullet C8. That section has no C8 label, and its first bullet is "No SKP message reaches it". I wrote "first bullet" without the label.

**Runs, all rc 0**
- **E1** (the diff of `*.rs` against B): 185 changed lines, 183 comment and 2 non-comment. The two non-comment lines are the renamed fn pair, `an_absent_crs_key_is_not_silently_ogc_crs84` to `an_absent_crs_key_is_not_a_declaration`. The count is 183, not the 180 the gate cited, because this round adds comment lines.
- **E7 (append-only):**
  - `kernel/PERMISSION-BOUNDARY.md`: 0 deleted lines, and lines 1-491 have sha256 `dfa0b4e8…c6cbf`, identical to B (491 lines).
  - `kernel/CANCELLATION-AND-TRACING.md`: 14 added, 0 deleted, and its prefix hash `dfaa9a44…b353` equals B's.
- **E5:** `cargo fmt --all -- --check` rc 0.
- **E4:** `cargo doc --no-deps -p spatial-engine -p spatial-kernel` in the `mdocs` worktree, under a shared hold, finished with 29 `warning` lines.
  - I also ran it at B in a temporary detached worktree (`mdocs-b`, with `CARGO_TARGET_DIR=D:/wt-targets/mdocs-b`). That run also finished rc 0 with 29 lines, and the sorted lines are identical (`cmp` rc 0). The temporary worktree is removed.
  - I compared the `warning` lines only. I did not compare the `-->` location lines.
  - The head run's own rc was not echoed, but cargo printed "Finished".
- **Governance:** `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify` all PASS, rc 0, with advisories only.

**Budget** (`git diff --numstat B...HEAD`): 210 added, 116 deleted, 326 changed lines against the 450 cap, in 16 files against 18. No file was added. Per file (added/deleted):
- `engine/README.md` 66/35
- `engine/src/crs.rs` 13/6
- `engine/src/dataset.rs` 3/3
- `engine/src/envelope.rs` 3/3
- `engine/src/geoparquet.rs` 17/13
- `engine/src/identity.rs` 6/6
- `engine/src/lib.rs` 29/16
- `engine/src/predicate.rs` 4/4
- `kernel/CANCELLATION-AND-TRACING.md` 14/0
- `kernel/PERMISSION-BOUNDARY.md` 10/0
- `kernel/README.md` 10/6
- `kernel/src/bundle/mod.rs` 1/1
- `kernel/src/lib.rs` 19/11
- `kernel/src/permission/boundary.rs` 2/2
- `kernel/src/permission/mod.rs` 5/4
- `kernel/src/publish/mod.rs` 8/6

I did not compare these per-file figures against the form's §7 table, only the totals.

**Final `git status --porcelain`:** empty.

**Not done as written:** only the C8 label in change 5, above. I did not edit `state/`, `PLAN.yaml` or the form.
