# PR #199 gate 1 — architect
Reviewed: cut/wire-bytes-invariant-trace-flag-race @ 17f0e1aaa2574a2b4704bbc92582233b36a1433b

**Verdict: pass with Documentation findings.** Correctness: no finding. Evidence: no finding. Documentation: four findings (D1–D4). Each must be fixed in this PR before the merge, with no re-gate.

I read the head from the branch ref (`.git/refs/heads/cut/wire-bytes-invariant-trace-flag-race` = 17f0e1aa) in the worktree. I have no shell, so I could not run the diff (the file set and the 23/0 numstat), recompute any hash or check that the worktree is clean. Those are left to the reviewer under §9.

## §2, against the cited sites as built
- **Lock (C1).** The lock is at `kernel/tests/wire_bytes_invariant.rs:183-187`. It is a file-local static with a private `serial()` that recovers a poisoned lock through `into_inner`. It is placed after `collect_frames` (which ends at :166) and above the first test (:189). Its shape matches `kernel/tests/trace_spans.rs:145-149`. It adds no `pub` item and no interface.
- **Placement and guard lifetime (C2).** `    let _serial = serial();` is the first statement of each body, at `kernel/tests/wire_bytes_invariant.rs:191` and `:398`. The binding is named, so the guard lives to the end of the body. The `guard` locals are declared after it (`:201`, `:407`), so they drop first, during unwinding too. `TraceGuard`'s Drop clears `ENABLED`, then `CURRENT` (`engine/src/trace.rs:353-358`). So the flag is off and the slot is empty before the lock is released.
- **The engine interface consumed.** `is_enabled` (`engine/src/trace.rs:320`), `start` returning an Option that refuses while the slot is occupied (`:329-339`), and Drop (`:353-358`) are as 0.3 reads them. No product caller of `start` exists: a search of `engine/src`, `kernel/src` and `protocol` finds it only in `engine/src/trace.rs`'s own `mod tests` (from `:555`). `kernel/tests/watch_support` declares no test and names no trace item, so the binary still holds only the two tests (0.4).
- **Cross-run stamping.** `batch_full` is marked after the cancelled check and before `tx.send` (`engine/src/stream.rs:2540-2570`). `next_into` ends only on a disconnected `recv` (`:782-797`). The argument holds as written. It stays conditional on the TAG_TERMINAL link that §1 disclaims. The same condition covers the cross-test half of 0.5 (d). §1 does not name that half separately, but nothing in the PR body claims it, so there is no finding.
- **Macro expansion.** I read tokio-macros 2.7.2's `src/entry.rs` (the crates.io source at the locked version; `Cargo.lock:2084-2085`): `:474-476` selects `Builder::new_multi_thread()`, and `:518-519` read `                .expect("Failed building the Runtime")` / `                .block_on(#body_ident);`. The body runs under `block_on` on the test thread, so the second invalidator does not fire. tokio 1.53.1 is at `Cargo.lock:2068-2069`.
- **`clippy::await_holding_lock`.** §2 predicted these warnings, and no allow attribute was added. No workflow runs clippy: the only match under `.github/workflows` is a comment (`rust-fmt.yml:14`). There is no finding.

## §8, item by item
1. Clear. The form and Amendment 1 are in the base. Items a and b are `done` with PRs 197 and 198 (`PLAN.yaml:3342`, `:3347`, `:4249`, `:4254`).
2. Clear on the tree. Engine `trace.rs` and `stream.rs` match the form's pinned content at the cited lines. The report says the code diff is one file. The brief says 17f0e1aa adds only the two READMEs, which §7 allows. The reviewer confirms both with `git diff --stat`.
3. Clear (C2 above).
4. Clear. `start`'s refusal, `ENABLED` and `CURRENT` are as pinned, and neither test tolerates a refused start (`.expect` at `:207` and `:413`).
5. Clear. The reported numstat is 23 added and 0 deleted, so no existing line was edited. The test names, assertions, messages, collectors, fixtures, module header and recorded-mutation comment (`:390-395`) are as pinned.
6. Clear in the file and in CI. The run environment is covered under D3.
7. Clear.
8. Clear. The doc (`:168-182`) uses symbol names only.
9. Clear. See §1 below.
10. Clear. The two proposed nodes exist (`PLAN.yaml:4315`, `:4333`), as item 6 of the ruling and Amendment 1 require.
11. Clear on all four round-25 items. 23 is under 40, so there is no class 8 and no edit to §7. There is no scope addition. The record says plainly that no mutation was a `verify-mutation` run. Every branch-line cite names b47d96d2, and none is pinned by a hash.

## §1
The PR body stays inside §1. It says the cause was read from code and not observed. It gives no rate and does not claim the race is absent. It claims no timing and no product change. It carries the Timing line, which states that no timing was introduced.

The M-0 difference raises no finding. The form's §4 names no commit for M-0; only R-0 is fixed at the branch point (§5). A leaked guard survives the lock's release at any thread count, so the outcome at the head is the outcome at the branch point. The worker's stated reason holds.

## Owner's index, against §9's bullet
- **kernel/README.md.** All four required changes are present: the Interfaces line in the persisted-artifact shape, pinned by the two tests of 0.4 (`kernel/README.md:367`); `trace` with its five items under Consumed (`:369`); the form (`:376`) and the design note (`:379`) under Governed by; and Last verified at (`:350`). The section runs from `:346` to `:386`, which is 41 lines.
- **engine/README.md.** The trace entry is present, with the limit by pointer and the two unit tests (`engine/README.md:513`). Both tests exist (`engine/src/trace.rs:735`, `:765`). Governed by is unchanged, and Last verified at is at `:499`. The section runs from `:495` to `:529`, which is 35 lines.
- The PR body's figures of 41 and 35 lines are correct.

## Documentation findings (must-fix before the merge)
- **D1. The PR body calls a correct pin stale.** Its Differences paragraph (paraphrased) says the form's pin for `TraceKey`'s Default derive is stale. The form claims only that `TraceKey` has a Default (§4, M-1); it does not say "derive". At the reviewed commit, `engine/src/trace.rs:767` reads `        let a = start(TraceKey::default()).expect("first starts");`, which shows a Default exists. The derive is at `:119`.
  - The fix: drop "stale" and say that the worker read the derive at `engine/src/trace.rs:119`. Alternatively, the reviewer recomputes the line's hash at 0c2be9cb. If it does not match the form's da031c27…, keep "stale" and cite the hash.
- **D2. C3's doc sits on the static, not on `serial()`.** The doc comment is attached to `static TRACE_SERIAL` (`kernel/tests/wire_bytes_invariant.rs:168-183`). `serial()` (`:185-187`) has none. Its content meets each of C3's points, and the placement matches the precedent (`kernel/tests/trace_spans.rs:138-145`). The PR body says, in paraphrase, that the `serial()` helper has its doc.
  - The fix: correct that sentence in the PR body and record the placement under Differences. Do not move the comment, because R-1's claim that the test file equals the head's would then become false.
- **D3. The run environment for R-0 and R-1 is missing from the PR body.** Both sets ran with `RUST_TEST_THREADS=8` and `CARGO_BUILD_JOBS=8` (worker report, Heavy commands). Any value of 2 or more still runs both tests concurrently, so the evidence stands.
  - The fix: state the environment in the PR body's Predictions.
- **D4. The PR body has a bare line cite, and it calls a correct cite a slip.** The PR body says the owner's-index update cites §9 rather than line 239 of the form. Citing the form by section is the correct form under round 14. The bare line number is the defect.
  - The fix: drop the line number, or pin it as `path:line @ <main commit> sha256:<hex>`.

**Disclosed, no action.** The update's paraphrase in quotation marks (`state/consults/2026-10-10-wire-bytes-invariant-trace-flag-race-owners-index-update.md:121`; the real line, `engine/README.md:516`, has bold markers) quotes README text, not the human's words. Its disclosure in the PR body suffices under the record cap.

No ADR is needed. The piece crosses no seam, adds no `pub` item, and is test-only, with no operation-class, docs/08 or roadmap impact.
