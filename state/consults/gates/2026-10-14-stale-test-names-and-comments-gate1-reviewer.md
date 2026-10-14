Reviewed: PR #220 at ec6de56fc9aa91cf363b7fd33c89fd9dbf4033f4 (base a5666a49); cut/stale-test-names-and-comments @ ec6de56fc9aa91cf363b7fd33c89fd9dbf4033f4
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. Every rewritten sentence holds against its cite at the head. E1 to E8 hold, and the class 8 and class 2 deviations are recorded in Amendment 3. There are three Documentation findings. Fix them before the merge; they need no re-gate. No finding blocks, so the wording-block procedure does not apply.

## Correctness

None. I checked every rewritten sentence against the code at ec6de56f:
- **F2 (rename).** `engine/tests/identity.rs:139-142` passes by its exact name and still reports the candidate list (`:168`).
- **F2r and OPEN-2.** The caller grep finds exactly three callers of `candidate_columns()`, all in tests: `session_identity.rs:205` in the fn at `:181`; `identity.rs:168` in the fn at `:139`; `b1_projection_hostile_names.rs:751` and `:755` in the fn at `:733`. Every other match is the field or a wire-key string, so there is no product caller. `engine/src/identity.rs:253-255` names those same three tests.
- **D2.** `admission-remediation.mjs:537-538` expects `engine.crs_undeclared` on the plain open. The generator's name and body are unchanged (`manual_walkthrough_fixtures.rs:563-577`).
- **H4.** `skp_filter_cancellation.rs:176` uses the human's words (the directive's line 14), against `:147` and `:185`.
- **F7 and OPEN-3 (c).**
  - ADR-018:3 is Accepted, and item 2 (`:56-59`) scores the budget on the pair.
  - `cancel_quiescent` is reported beside the budget with no budget attached, as ADR-018:59 requires.
  - The only remaining use of acknowledged is inside the docs/08 quotation at `first_batch_factorial.rs:1289-1290`.
- **F4.** Checked against `document.ts:18-22`, `commands.rs:441-447` (`skp/0.6`) and `client.ts:122`. `client.ts:122` is the shell's only `columns:` value.
- **F3a (C-1's words).**
  - Four suites mock `./canvas/WorkingCanvas`. They are the only `App` mounts.
  - `App.layout.test.tsx:136-141` records mounts and unmounts in an effect on the `dataset` prop.
  - `App.lateResult.test.tsx:331` records props by dataset.
- **F3b.** `App.tsx:1910` renders `AdmissionPanel` unconditionally. `App.layout.test.tsx` does not mock it: its five `vi.mock` calls are at `:64`, `:105`, `:109`, `:121` and `:130`.
- **F3d.**
  - Only `WorkingCanvas.wiring.test.tsx:61,108` imports and renders the real component. The other importers take types only.
  - `style` is `DEFAULT_STYLE_STATE` throughout that file (`:105`).
- **F10a and F10c.** Checked against `residencyStatus.ts:423-428`, the constant at `:434-435`, and entry 45's RULED block.
- **F10b.** Checked against `hoverRepickConstants.ts:36-41` and `:56` (`true`), and entry 75 (1), B3.
- **OPEN-1.** Checked against piece d's sentence at `kernel/src/lib.rs:40-44` and `kernel/CANCELLATION-AND-TRACING.md` §7 (spill at `:208`).
- **OPEN-3 (a).** Checked against ADR-013 Amendment 1, Accepted: items 2 and 4 (`:265-292`), and the Consequences of the clarification at `:324`.
- **OPEN-3 (b).** Checked against ADR-016 Amendment 1 item 1 (`:180-210`). It carries both the corpus-verified clause and the bare-word unique clause, and it rules out snapshot claims.

## Evidence

None. All runs are at ec6de56f in `C:/dev/wt/stn`, recorded under E1 to E8 below.

## Documentation (must-fix before the merge; no re-gate)

**D-1. `frontends/shell/src/App.test.ts:53` is 101 columns, against §2.0 (g)'s 100.** This is new text from bceac904 and was outside C-1's lines. Replace lines 52-56 with the five lines below.
- The words are unchanged: I checked by script that the joined text compares equal (cmp rc 0).
- The widest line is 99 columns.
- The file's count stays at 19.
- This is not the human's wording, so it is applied with no re-gate and listed in the PR body.
```text
// directly, without rendering `<App />`. `admitAndResetStaleUiState` is exported from `App.tsx`
// specifically so this reset sequencing -- the actual bug fix -- is testable on its own terms.
// `App` is mounted elsewhere in this package (`App.layout.test.tsx`, `App.lateResult.test.tsx`),
// with `react-dom/client` and `act`, and `WorkingCanvas` stood in because deck.gl's `Deck` needs a
// WebGL context jsdom does not provide.
```

**D-2. The PR body is stale at the head.**
- It names the change as at f73eb803 and gives the count as 122 lines.
- §7 says H is named in the PR body. H is ec6de56f, and the count there is 128 lines over 18 files.
- Under AUTONOMY §31 (d), the PR body must also list the gate's words applied with no re-gate: C-1, D-1, D-2 and D-3 of gate 1, and D-1 above.

**D-3. The closing record.**
- Amendment 3 item 1 gives the count at f73eb803. The closing amendment records the head's count by reference to the numstat at ec6de56f, without restating Amendment 3.
- Gate 1's D-4 (a) and (b) are not yet in the form. They are custodian items under the record cap.

## E1 to E8

- **E1. Holds.** Command: `git diff -U0 a5666a49...ec6de56f`, filtered by awk to non-comment lines (README prose excluded).
  - Only three lines changed outside comments: the fn line, the `Watchdog::new` call, and the `describe` line.
  - The label call is 1 line removed and 3 added. Class 2, Amendment 3 item 2 (a).
  - The other non-comment changes are the README prose under OPEN-1.
- **E2. Holds.**
  - At H, under a shared hold:
    - `cargo test -p spatial-engine -- --list`: rc 0, 460 tests. The new name is listed and the old name is absent.
    - `-p spatial-kernel -- --list`: rc 0, 391 tests.
    - `-p spatial-renderer -- --list`: rc 0, 32 tests. Both match the worker's B counts.
    - `npx vitest list src/residency/residencyStatus.test.ts`: rc 0. The enclosed test's full name carries the new title.
  - B is re-read, not rebuilt. A script diffing every Rust `fn` name under engine, kernel and renderer between a5666a49 and ec6de56f shows the one rename only. A diff of every `describe`/`it`/`test` title under `frontends/shell/src` shows the one `describe` title only.
- **E3. Holds.** CARGO_TARGET_DIR=D:/wt-targets/stn, CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8, under a shared hold.
  - `cargo test -p spatial-engine --test identity --test admission_instruments`: rc 0 (8 passed, 1 passed).
  - `cargo test -p spatial-renderer --test style_shell_agreement`: rc 0 (1 passed).
  - `cargo test -p spatial-kernel --tests --no-run`: rc 0.
- **E4. Holds.**
  - `cargo fmt --all -- --check`: rc 0.
  - `cargo doc --no-deps -p spatial-engine`: rc 0, 18 warnings. They are in `predicate.rs`, `stream.rs`, `lod.rs`, `geoparquet.rs`, `dataset.rs`, `cancel.rs` and `attributes.rs`, none of which the diff touches. None is in `engine/src/identity.rs`, the only engine source file changed.
  - So H's warnings are a subset of B's. That is a re-read; B was not rebuilt.
- **E5. Holds.** Run under a shared hold.
  - `npx vitest run` over the six touched files: rc 0, 6 files and 256 tests passed.
  - `npm run typecheck`: rc 0.
  - `node --check e2e/regression.mjs`: rc 0.
- **E6. Holds.** The tools are at the head ec6de56f; the last commit touching scripts/plan is c813c6ab.
  - verify-cites rc 0, verify-quotes rc 0, verify-test-claims rc 0 (562 claimed), verify.mjs rc 0.
  - `queue.mjs --check` and `site.mjs --check` are current, both rc 0.
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 457 of 457 pass.
- **E7. §4 items 1 to 6 hold, with Amendment 2 item 13's corrected sets.**
  1. The list: E2.
  2. `cargo test -p spatial-engine --test identity <new name> -- --exact`: rc 0, 1 passed.
  3. `git grep -l` for the old name and the old label at ec6de56f (rc 0) finds only the form and ten `state/` records. Outside `state/` it finds only the form.
  4. The new name is in exactly eight files: `engine/tests/identity.rs`, `engine/tests/admission_instruments.rs`, `engine/src/identity.rs`, the form, `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json`, and the architect draft under `state/consults`.
  5. The caller grep of `.claude/agents/reviewer.md:24`, run by me: `git grep -n 'candidate_columns()'` (rc 0) gives the three test callers above and no product caller.
  6. verify-test-claims: rc 0 at H. The done commit is not yet made.
  - At origin/main 50cc228e, no file this PR touches has changed since the base, and `git merge-tree` is clean (rc 0).
- **E8. Holds.** `gh pr checks 220`: rc 0, every check passes. Both runs are on headSha ec6de56f (push and pull_request), confirmed with `gh run view`.

## §8, item by item

1. **Pass.** The non-comment lines are E1's three; the label line is recorded as class 2.
2. **Pass.** No assertion, assertion message, app string or literal changed, other than the label and the `describe` title. The routed assertion message at `session_identity.rs:193` is untouched.
3. **Pass.**
   - 18 paths: §2.1's 14 plus Amendment 1's 4. Nothing is under scripts/plan.
   - The OPEN rows landed in f73eb803, after Amendment 1.
4. **Pass.** No sentence claims more than its cite. C-1's words are applied.
5. **Pass.** The status words in touched lines are Accepted for ADR-018, ADR-013 Amendment 1 and ADR-016 Amendment 1. ADR-023 is no longer named.
6. **Pass.**
7. **Pass.**
   - `git show --stat 9dbb4cc3`: its parent is a5666a49, it is first in the range, and it holds only `engine/tests/identity.rs`, `engine/src/identity.rs` and `engine/tests/admission_instruments.rs`, with the rename and the two references.
   - No commit leaves the references split.
   - The old name and label survive outside `state/` only in the form.
8. **Pass.** The generator is unchanged, and no fixture changed.
9. **Pass.**
   - A script found no new `path:line` in any added line; the pattern was first tested against a positive sample.
   - 433413a is named in words, not pinned, as accepted in deviation (d).
   - `engine/src/identity.rs:253-255` and `admission_instruments.rs:67` are over 100 columns, but each carries one test path whole, which §2.0 (g) allows.
10. **Pass.**
   - Every added line with a double quote carries a quoted span that was already there.
   - The span at `engine/tests/session_identity.rs:121-122` matches `git show 433413a:docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md` line 110 byte for byte, with its line break at the same place as at the base. The draft file is unique at 433413a, and 433413a is on main.
   - H4 carries the human's count.
11. **Pass.**
12. **Pass.** Amendment 2 item 9.
13. **Pass.** Recorded as class 8 in Amendment 3 item 1, and §7 is unedited.
   - §7 at the head (`git diff --numstat a5666a49...ec6de56f`) is 128 lines over 18 files, against 186 and 20.
   - Each file is within its ceiling, OPEN additions included, except `engine/tests/identity.rs` at 6 against 4. That is the class 8 entry.
   - `kernel/src/lib.rs` and `kernel/README.md` are at 4 against 4. `CrsAssertionForm.test.ts` and `pickResolution.test.ts` are at 6 against 6. `App.test.ts` is at 19 against 34.
14. **Pass.** Amendment 1 records class 9 before code.
15. **Pass.**

**Gate 1's words at ec6de56f, byte for byte.** Each compared with `cmp` against `state/consults/gates/2026-10-14-stale-test-names-and-comments-gate1-architect.md`:
- C-1 (gate lines 15-19 against `App.test.ts:59-63`): rc 0.
- D-1 (gate lines 58-60 against `kernel/src/lib.rs:21-23`): rc 0.
- D-2 (gate lines 68-70 against `kernel/README.md:276-278`): rc 0.
- D-3: `engine/src/identity.rs:253` ends with a backtick and a comma.

**Heavy runs.** Two shared holds, both granted and both released (MACHINE_RELEASED). No timing-sensitive failure.
