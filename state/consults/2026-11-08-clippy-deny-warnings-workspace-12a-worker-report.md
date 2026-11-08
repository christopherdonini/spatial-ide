*Custodian's filing note (2026-11-08): the worker's report for the filler slot's clippy 12a (`clippy-deny-warnings-workspace`, entry 12), from its hand-back byte for byte (5719 bytes, sha256 53ff020a4102001c6a1d2a81d35bcfd70a5f1958d6ee4c91ae636d042f817c3c), saved with one final newline. Its brief was given by file (11153 bytes, sha256 e3b838d92fd45d0c8700f05c740f3e13878f010a5c3f7f433b63d6ec907d8e9a). Dispatched at 2026-11-08T10:17:05.852Z by its transcript; the run went to 2026-11-08T11:41:49.593Z (claude-sonnet-5-5; unique calls: Read 2, Bash 60, Write 2, Monitor 1, the hand-back, 66 in all). Checked by the custodian at origin: the branch at 1b71dd6c, one commit on 72842b52; eight files, all under engine, 21 insertions and 21 deletions. L7, which the report leaves to the custodian, read in the finished Linux job of the PR's push run (42476849029) at the head: its build step warns only on the two kernel tests' `peak_working_set` field, and no line names `WATCH_BUFFER_BYTES`; main's Linux job at 6a95b13a warned that the constant is never used. The clippy rows, the tests and the mutations are the report's, for the two gates to re-run. Draft PR #300 opened at 2026-11-08T11:42:26Z. A report, not Authority.*

---

Built: clippy-deny-warnings-workspace 12a at 1b71dd6c2a966dab864337fed33d58883be226ed

**Worktree.** origin/main was 72842b52e534e1ca5642357ad33a0e05cdebbc4b. The form's sha256 at that commit is d503e5c8dc3c26a7e6e7dc08aadee17cf57fede4d9521230057441fd2a130d31. Branch cut/clippy-deny-warnings-workspace-12a is in C:/dev/wt/c12a, with its target at D:/wt-targets/c12a.

**Base.**
- HEAD was 72842b52. clippy 0.1.97 (8bab26f4f6 2026-07-14), rustc 1.97.1 (8bab26f4f 2026-07-14).
- The clippy JSON run exited 0 and took 17m42s cold. Raw 29, distinct 26.
- In the eight Scope files there were exactly the form's thirteen rows:
  - rowgroup.rs:331 too_many_arguments
  - stream.rs:2346 if_same_then_else, stream.rs:2462 too_many_arguments, stream.rs:3857 type_complexity
  - trace.rs:637 and trace.rs:658 explicit_auto_deref
  - filter_type_admission.rs:1267 redundant_pattern_matching
  - fixture_generation.rs:126, :127 and :143 needless_borrows_for_generic_args
  - identity.rs:321 and :324 unnecessary_get_then_check
  - publish_stream.rs:534 needless_range_loop
- Outside the eight there were 13 rows, all in engine/tests (admission_p4_corpus, admission_property_campaign x4, import_layout_5gb_digest, import_layout_5gb_fixtures x3, import_layout_digest, import_layout_fixtures, lod_tier_measurements x2). They were recorded and not fixed.
- Of the 13 outside rows, only engine/tests/admission_property_campaign.rs:556 etc. matter for OPEN-C. All 13 are in engine files that no slice names, so OPEN-C's red-line item goes to the human in the closing message.
- cfg-boundary exited 0. Last line: `cfg-boundary: 18 sites in 6 files, 0 outside every boundary`.

**Fixes** (each as N1 gives it):
- Rows 1 and 3: `#[allow(clippy::too_many_arguments)]` on `build` and `flush`.
- Row 2: `#[allow(clippy::if_same_then_else)]` on `attr_row_bytes`.
- Row 4: fn-local `type Case`, and `[Case; 8]`.
- Rows 5 and 6: dropped the `*`.
- L7: the const and its two doc lines moved into `mod windows_watch`, and dropped from that module's `use super::{…}`.
- Row 12: the single condition.
- Rows 13 to 15: dropped the `&`.
- Rows 16 and 17: `!md.contains_key(..)`.
- Row 26: `for (i, bound) in union.iter().enumerate()`.
- `cargo fmt --all` exited 0. `git diff --name-only` named only the eight files.

**Commit.** 1b71dd6c, signed off, with the brief's subject. The message file had `@` only on the first trailer line.

**Head.**
- Clippy JSON run: exit 0. Raw 13, distinct 13, and 0 rows in the eight files. The outside rows diffed identical to the base's (diff exit 0, which compares lint, file, line:col and message).
- `cargo fmt --all -- --check`: exit 0, no output.
- `cargo test --workspace --locked`: exit 0, in one shared hold. 118 test-result lines, 1027 passed, 0 failed, 66 ignored.
- Mutations. Each was applied alone by a one-line edit whose old text occurs once, run with N3's command, exited 101, and was reverted with `git checkout`. Porcelain was empty after each revert. Each failing line is byte-copied from the run's output.
  - M12 (`int_info(from).is_some()` to `.is_none()`): `thread 'the_type_walk_agrees_with_the_binder_over_the_p0_matrix' panicked at engine\tests\filter_type_admission.rs:1667:5:` then `90 B-T1 counterexample(s); see the report above`. It was killed, not a survival.
  - M16 (engine/src/envelope.rs:221-223 replaced by the unconditional insert): `panicked at engine\tests\identity.rs:320:5:` then `unverified width must not read as exact`.
  - M17 (envelope.rs:214-216): `panicked at engine\tests\identity.rs:324:5:` then `assertion failed: !md.contains_key("id_verified_rows")`.
  - M26 (publish_stream.rs:527, `.max` to `.min`): `panicked at engine\tests\publish_stream.rs:535:9:` then `assertion `left == right` failed: bound 3`.
- cfg-boundary: exit 0, last line equal to the base's, with engine/src/watch.rs at 3 sites (:84, :88, :101). `node --test scripts/plan/cfg-boundary.test.mjs`: exit 0, 7 pass, 0 fail.
- `git diff --numstat 72842b52...HEAD`:
  - rowgroup.rs 1/0
  - stream.rs 4/1
  - trace.rs 2/2
  - watch.rs 5/5
  - filter_type_admission.rs 2/6
  - fixture_generation.rs 3/3
  - identity.rs 2/2
  - publish_stream.rs 2/2
  - Total 21+21 = 42, against the declared 80 (no overrun). `--name-only` lists exactly the eight files.
- The `node --test` governance suites (plan, hooks, evidence) from the worktree root: exit 0, 598 pass, 0 fail.
- verify-cites, verify-quotes (in a shared hold), verify-test-claims, `verify.mjs --offline` and forms-layout all exited 0. Each printed PASS.

**Hold lines** (`also=` elided): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>` was granted for each cargo call (base clippy, head clippy, workspace test, M12, M16, M17, M26) and for verify-quotes, each followed by `MACHINE_RELEASED`. No refusal.

**Push.** `git push -u origin cut/clippy-deny-warnings-workspace-12a` exited 0. origin's branch and HEAD are both 1b71dd6c2a966dab864337fed33d58883be226ed. Porcelain is empty.

**Not done, for the custodian.** No PR was opened. The Linux build-step log for L7 is yet to be read.

**Pre-gate self-check.**
- The cross-module classes do not apply: no cross-module seam was added.
- Every completion claim above points to a run in this transcript.
- No user-facing message text was added.
- Every required test reached its assertion, as the failing lines above show.

**Background shells left.** None running. Several were mine, all completed on their own. No process was killed.

**Model.** The harness reports Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

**Note.** The distinct total was 26 at both fbc905ec and this base. Scratch files are under `c12a-` names in the scratch folder.
