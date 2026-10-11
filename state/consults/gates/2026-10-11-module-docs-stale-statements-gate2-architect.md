# PR #209 gate 2 — architect (C-1's sentences)
Reviewed: cut/module-docs-stale-statements @ 1c3b4dbec38dca866b004493e52957f359101002

**Verdict: pass with notes.** I found no Correctness or Evidence finding, so C-1 is discharged at all three sites. D-3's rotation clause also holds. There is one Documentation finding (D-1): fix it before the merge, with no re-gate. One observation outside this round's scope (O-1) goes to the custodian. Every other verdict from gate 1 carries forward (Amendment 2, item 4).

## Correctness
None.

## Evidence
None.

## Documentation (fix before the merge; no re-gate)

**D-1. One comment line runs well past the file's wrap width.**
- engine/src/lib.rs:57 is about 145 columns. It holds the end of the C-1 sentence group: "reproducibility grade (ADR-005). The tier builder (`lod::build_tiers`) writes a derived, non-authoritative tier cache: a directory per source".
- Every other `//!` line in the file wraps at 100 columns, and rustfmt does not reflow comments, so `cargo fmt --check` cannot catch this.
- Fix: rewrap lines 56-58 to 100 columns, changing whitespace only.

## Observation for the custodian (outside this round's scope; not a finding at this head)

**O-1. A second "writes nothing" sentence about the stream is unchanged at B.**
- It reads "derived output, it writes nothing, so no transaction boundary and no undo machinery is owed". It sits at:
  - kernel/src/lib.rs:21;
  - kernel/README.md:276.
- This is the same literal overreach as C-1, now about 20 lines above the corrected sentence. In ADR-006's sense it is still true: DuckDB's transient spill is not a workspace mutation or a class-3 effect.
- My gate 1 passed lines 17-29 for ADR-006 classing. This piece did not rewrite the sentence, so §1 does not bind it here, and Amendment 2, item 4 confines this round to item 1's sentences.
- Recommend that a later docs-lane piece qualify it the same way (for example, "writes no workspace state or file of its own"). Adding it to this piece would be a class 9 scope addition, and §7's file budget has no room (gate 1, §8 item 13).

## Per-site ruling

**1. engine/README.md:93-96. Holds.**
- **"The stream code in this module opens no file for writing."**
  - Every non-test write call in engine/src lies outside the stream code:
    - lod.rs:1098, 1152, 1236 and 1397, which is the tier builder, named separately at :97;
    - fixture.rs and layout.rs, which are test support and feature-gated (layout.rs:39);
    - watch.rs:207, which opens a directory handle with `FILE_LIST_DIRECTORY` access only.
  - stream.rs has no write call before its `#[cfg(test)]` module at :2640.
  - The publish window's `create_dir` and style-file write, which stream.rs:199-201 mentions, belong to the kernel's publish path, not to this module.
- **"DuckDB's default spill … is not configured off by the engine."**
  - Engine connections are `Connection::open_in_memory()` (pool.rs:432).
  - They are configured only by `CONFIGURE_SQL` (pool.rs:185-187), which sets three settings, none of them spill-related.
  - A grep finds no `temp_directory`, `memory_limit` or `max_temp_directory_size` in the Rust sources of engine/, kernel/, protocol/ or frontends/, outside kernel/tests.
  - DuckDB's default does spill (the reviewer's gate 1, C-1, its config.hpp, config.cpp and database.cpp reads).
- **"such as a large sort's"** is supported by CANCELLATION-AND-TRACING.md:207-208 and by the `ORDER BY` at stream.rs:1474.

**2. engine/src/lib.rs:53-57. Holds**, on the same evidence as site 1.
- "The stream is a pure transformation (ADR-006); it claims no reproducibility grade (ADR-005)" carries the earlier classing unchanged. It names no ADR status.

**3. kernel/src/lib.rs:38-42. Holds.**
- **Audit log, "creates its directory, appends to its file, and rotates it (`rotate_if_needed`)":**
  - log.rs:133 is `create_dir_all`;
  - :144-147 and :218 open with `create`/`append`;
  - :141 calls `rotate_if_needed`, defined at :407-434. It renames generations 1-3, renames the live log to `.1` and deletes `.4`, which "rotates it" fairly covers.
- **"The kernel's own stream code opens no file for writing":**
  - every kernel/src write call outside publish/, the audit log and the `publish-bundle` test code is in skp.rs's test module (:2656 onward, under `#[cfg(test)]` from :2314);
  - lib.rs has none.
- **"not configured off by the engine"** names the right owner: the connection is the engine's, and `Lease::connection()` is `pub(crate)` (RESULTS.md:2061).

## Section cites (check 2)
- **kernel/CANCELLATION-AND-TRACING.md §7** ("Known limits", :178). Its last bullet (:207-208) states that the `temp_directory` control "remains unimplemented and unreachable" and that a sort "can still spill somewhere unrecorded". That is what all three sites attribute to it.
- **kernel/RESULTS.md, "### §5d is partially measurable, and the reason is a design decision"** (:2058). It says neither setting is set anywhere, both stand at DuckDB's defaults, and the control "was never implemented" (:2067-2075). That is what the sites attribute to it. The head's code still matches (pool.rs:185-187).

## §2.0 and §8 (check 4)
- **No bare `path:line`:** all three sites cite by file and section.
- **No quotation marks** appear in any of the three sentence groups.
- **No ADR status is named:** ADR-005 and ADR-006 are cited only for class and grade.
- **No exposure text:** none of the three sentence groups touches C8.
- Amendment 2, item 1 is satisfied as written: the claim is limited to the engine's and the kernel's own stream code, the spill is named by section, and no code changed.

## Files read (worktree C:/dev/wt/mdocs unless noted)
- Main checkout, C:/dev/spatial-ide:
  - state/consults/gates/2026-10-11-module-docs-stale-statements-gate1-architect.md
  - state/consults/gates/2026-10-11-module-docs-stale-statements-gate1-reviewer.md
  - state/consults/2026-10-11-module-docs-stale-statements-worker-report-2.md
  - kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:440-495
  - main's kernel/src/lib.rs:15-44 and engine/src/lib.rs:38-62, for B's text
- engine/README.md:85-109
- engine/src/lib.rs:40-69
- engine/src/pool.rs, by grep (:185-210, :431-438)
- engine/src/stream.rs:185-209, plus a grep for `ORDER BY`, the entry points and `#[cfg(test)]`
- engine/src/watch.rs:100-224
- engine/src/layout.rs:1-40
- greps over engine/src and kernel/src for write calls, and across the Rust sources for the DuckDB settings
- kernel/src/lib.rs:1-60
- kernel/src/permission/audit/log.rs:125-154 and :395-439
- kernel/CANCELLATION-AND-TRACING.md:178-211, plus a heading grep
- kernel/RESULTS.md:2056-2100
- a grep for "writes nothing" over engine/ and kernel/ (this is where O-1 came from)
