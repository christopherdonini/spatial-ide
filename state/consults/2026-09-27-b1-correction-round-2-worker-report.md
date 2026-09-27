*Custodian's filing note (2026-09-27): the B1 correction-round-2 worker's hand-back (the gate-2 findings; head `0b517d9` on `cut/b1-engine-projection`, local), transcribed from the hand-back message with the harness's two-space indent removed. It is a worker report, not a gate report. Its path-and-line cites are into the branch; they are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the worker's text.*

---

B1 correction round 2 (PLAN `b1-engine-kernel-half`) is done, with no STOP. One verify tool fails on this branch, see Suites. Worktree `C:/dev/wt/b1-projection`, branch `cut/b1-engine-projection`. Local only, tree clean, nothing pushed.

**Commits:** head `0b517d9`, C = `ca3d7ae`.
- `a472add`: the X2 test.
- `ca3d7ae` (C): all code, tests and in-code docs.
- `a30007c`, `d0631fe`: RECORDED MUTATION comments only. `d0631fe` fixes four line cites I first wrote from the mutated file.
- `fd9036f`: SKP-V0.md.
- `0b517d9`: Amendment 8. It is append-only: +125/−0 since `e3430d2`.

**Items.** Each mutation was applied, run, observed failing by name at C, and reverted. Lines are at C.
1. **X2:** `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction` fails at `kernel/tests/skp_projection.rs` line 845 when the restriction runs before `resolve_projection`. R2-B3's own form was observed at `a472add` (fails at :848). At C that form no longer compiles, because after item 7 the loop reads the admitted projection. So at C I ran the same semantic mutation, with each name's type read from `file_schema()`.
2. **X6:** the X6 test now reads `StreamPlan::for_publish` (extracted, `stream.rs` line 580) and compares `TaggedBatch::assemble` bytes, with a NULL inside every Utf8 window. The plan declaring `true` fails at `stream.rs` line 2787, at 8/3. The null-buffer drop fails the decoded-equality test at line 2824.
3. **X7:** E-14's small runs now assert `Arc::ptr_eq`. Removing the 64-byte term fails at `stream.rs` line 2612; removing compaction fails at line 2578 and in the live test at line 2906.
4. **Boolean probe (class 2):** compaction changes a non-null Boolean's IPC bytes at 8/3, 0/10 and 40/20, and not at 3/5. This is pinned in the X6 test, which passes at C. Both H3 docs now say what was observed.
5. **X3:** new K-5 case (MultiType, identity mapped to `i64`, `skip_uniqueness_check = true`, via `Catalog::open_cancellable`). Removing the `ID_COLUMN` arm fails at `skp_projection.rs` line 595.
6. **C-a:** a refused dictionary now falls through to the final arm. Restoring the old text fails `a_refused_dictionary_takes_the_final_arms_text_and_no_text_of_its_own` at `attributes.rs` line 818.
7. **C-b:** new `AdmittedProjection::source_types` (`attributes.rs` line 346); its product caller is `publish/mod.rs` line 492. Carrying the emitted type instead fails at `attributes.rs` line 847.
8. **C-c:** publish's identity text is byte-identical to main at `46ff585` (rendered and compared by script). The rewording is in `ProjectionError`'s Display only, which is what the wire renders. Putting it into publish's `From` fails at `attributes.rs` line 871.
9. **False comments:** re-recorded from runs at C.
10. **X5:** `LargeUtf8` and `Utf8View` added; dropping them fails at `predicate.rs` line 1283. The identifier splits are joined.
- **Re-observed at C:** X4 fails at `attributes.rs` line 777. X12 fails at `skp_projection.rs` line 277, `live_projection.rs` line 177 and `stream.rs` line 2928.
- **E-15 (X10):** "compact the whole chunk", as I realized it, **survives**. This is recorded in the X10 row.
- **Docs 11–14:** in `fd9036f` (SKP-V0) and `ca3d7ae` (the SKP_VERSION doc, `flush`'s comment, and `skp.rs` now citing round 7, item 1).

**Suites at `0b517d9`:**
- cargo workspace (one run): 768 passed, 0 failed, 40 ignored, 78 targets, exit 0, 12 min 42 s.
- `tsc --noEmit` exit 0. vitest: 72/72 files, 1090/1090 tests.
- node --test: 314/314.
- verify.mjs, queue --check, site --check: all exit 0. verify-quotes PASS (109 checked). verify-test-claims PASS (289 claims).
- **verify-cites exit 1.** All 17 failures are Amendment 8's hash-pinned cites into the two gate-2 reports, which exist on main at `cec34b8` but not in this branch. With the two reports in a temporary index it passes. To clear it, merge main into the branch. I did not merge: main adds `protocol/skp/tests/conformance`, which is new code, and merging was outside the brief.
- clippy: 38 warnings, none on a line I added.

**Self-check:**
- Interfaces: the new K-5 case uses `IdentityDeclaration`'s real `pub` field (`engine/src/identity.rs` line 167). Caller grep: `source_types()` has one product caller, `kernel/src/publish/mod.rs` line 492.
- Completion claims: every Amendment 8 cell was checked by script. Each line cite matches the assertion at its commit, each report hash was recomputed at `cec34b8`, and each test name exists.
- Messages: the new wire identity message is the one seen in the X3 run.
- Tests: every mutation fails at the named assertion.

**Not done:**
- A2's nit that SKP-V0 §4 item 3 speaks for `skp/0.5`.
- `cargo fmt` baseline drift.
- The two `node.exe` processes running are not mine; they predate this work.

Model: Opus 5.5 (escalated by your brief). No context handoff. Scratch `C:/dev/b1-r2-scratch` is deleted.
