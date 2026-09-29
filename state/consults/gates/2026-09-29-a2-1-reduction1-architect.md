*Custodian's filing note (2026-09-29): the architect's check of the gate-3 reduction commit of PR #143 (PLAN node `b1-close-nul-column-names`). Reviewed: cut/b1-close-nul-names-2 @ 720f930 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Verdict FAIL. The five prescribed edits are carried out, but two more false comment claims of the same kind remain (C1, C2), which the architect names as its own miss at gate 3. It prescribes a second reduction: two comment lines, whose pass condition the reviewer checks. The custodian applied it as c2ca7b4. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ 720f930 — **Verdict: FAIL**

I confirmed that HEAD is 720f930 on `cut/b1-close-nul-names-2` from the worktree reflog: its last entry is f4d81c5 → 720f930. I have no Bash, so the reviewer's diff remains the proof that 720f930 changes comment lines only.

## 1. The prescribed edits: all five are carried out

- **`b1_projection_hostile_names.rs`**
  - N-6's doc (`a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns`) no longer has the observation sentence. Its mutation line is true: `namespace_admit` inserts a name only when `filter_surrogate` returns `Ok`, and `filter_surrogate` calls `filterable_column_type`, which runs `not_addressable_for_field` first (`engine/src/predicate.rs`).
  - N-15's doc no longer has the observation sentence or the misattributed quote. Its remaining claims agree with 12.2's N-15 entry and with 12.4 item 29.
  - The module doc now says "Every fixture an N-test in this file writes". That is true: N-1, N-1a (all four fixtures), N-2, N-6, N-7, N-8, N-9, N-12 and N-15 (every case) each hash before and after.
  - The c37b427 reference has lost its sha256. That is fine.
- **`b1_projection_hostile_covering.rs`**: N-14's doc no longer credits the wording to R-S3. Its mutation line is true: `sanity_check` calls `covering_not_addressable_reason` before `field_path_exists` (`engine/src/dataset.rs`). The module doc's "every fixture this file writes" is true, since N-13 and N-14 hash every fixture they write.
- **`engine/src/fixture.rs`**: the "control and hostile alike" wording is gone. Keeping "unchanged since c37b427" is right, because the reviewer showed the local `write` identical.

## 2. Two false comment claims remain

Gate 3 should have found both, and did not. The miss is mine. They are the same kind as B3(a) and B3(b), so they block for the same reason: a done-claim that does not resolve (round 7), in test text.

- **C1: `sha256_file`'s doc in `engine/tests/b1_projection_hostile_names.rs`.** It still reads "every fixture this file writes is hashed before and after the test that uses it". The three control tests (`hostile_names_*`) hash nothing. This is B3(a)'s false sentence again, one screen below the module doc that 720f930 fixed.
- **C2: the section comment above the hostile writers in `engine/src/fixture.rs`.** It says `write_format_default_covering` is "for the one shape these functions do not cover". That is false. `write_p3_native_id` in `engine/tests/b1_nul_native_id_scan_once.rs` is a second local writer, for a shape `HostileColumn` cannot express (`UInt64` at position 3). Its own doc says so.

**The fix is a second reduction: one commit, comment lines only, not a correction round.**
- In `sha256_file`'s doc, change "every fixture this file writes" to "every fixture an N-test in this file writes".
- In `fixture.rs`, change "for the one shape these functions do not cover" to "for a shape these functions do not cover".
- Pass condition: the reviewer shows that the new commit's diff against 720f930 touches only those two `//` / `///` lines. I do not need to re-read it.

**Not blocking:**
- N-15's `///` block sits above the `//` comment and `type N15Case`, so rustdoc attaches it to the type alias, not to the test. This placement is older than this commit and makes no claim.
- N-15 says "the exported-name metadata key appears", but the test asserts `!metadata().is_empty()`. That holds while `spatial.exported_name` (§7) is the only key the engine sets.

## 3. Amendment 12

It does not pass yet. On the two-line commit above, with the reviewer's comment-only check, the piece passes under Amendment 12 with no further round:
- 12.1 (a)-(h), 12.3, and §8 items 25-34 passed on reading at f4d81c5.
- 720f930 is comment-only (the reviewer is confirming), so nothing it changes touches them.
- The reviewer's gate-3 mutation table at f4d81c5 is the observation of record.

## 4. Closing record (unchanged from gate 3, check 4)

- **12.1(d)'s site reference.** The projection row names `admit_projection_column`. The real single site is `attributes::check_geometry_and_identity`, which both `admit_projection` pass 2 and `admit_projection_column` call. The closing amendment records this as one reference to that symbol at the merge commit, with no prose.
- **Non-squash merge.** The PR body asks for one. 19f37da, 303dca0 and b4d7aa1 are named in records and must stay reachable from main.
- **`cloud/wave2-A2`.** Keep it on origin, or tag it, for c37b427. The form's appended correction, the module doc and `fixture.rs` all name that commit. It will never be on main, so no hash pin on main can replace those references.

No decision is missing, so there is no ADR skeleton.

Files:
- C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs
- C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs
- C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_native_id_scan_once.rs
- C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs
- C:\dev\wt\b1-close-nul-names\engine\src\predicate.rs
- C:\dev\wt\b1-close-nul-names\engine\src\dataset.rs
- C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\gates\2026-09-29-a2-1-gate3-architect.md
