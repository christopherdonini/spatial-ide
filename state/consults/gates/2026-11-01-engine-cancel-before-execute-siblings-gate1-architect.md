Reviewed: PR #273 at 5317510c3f7b06bf647932ae4b3d77bb91fb96e4 (base e3fb936a), gate 1, architect
Verdict: FAIL
Branch: cut/engine-cancel-before-execute-siblings @ 5317510c3f7b06bf647932ae4b3d77bb91fb96e4

I read the files at the head in the worktree C:/dev/wt/ecbs, and the governing texts on main at 0f6c62a4. I have no shell, so I recomputed no sha256 and no numstat, and I did not read PR CI or the worker's scratch mutation logs. Where a check depends on one of those, I say so.

The code is correct: no Correctness finding. The verdict fails on one Evidence item (E1). E1 closes on a cited run or a recorded deviation. No code changes.

## Evidence (blocking)

**E1. The kernel half of the "unchanged and green before and after" set has no run behind it.**
- The form's Tests+mutation line (form, five-line block, the Tests+mutation line) names three kernel files: kernel/tests/skp_filter_cancellation.rs, kernel/tests/publish_cancellation.rs and kernel/tests/indexed_budgets.rs.
- The worker's report (`state/consults/2026-11-01-engine-cancel-before-execute-siblings-worker-report.md`, its "Checks at head" list) records only `cargo test -p spatial-engine`, the fixture compile, fmt, clippy -p spatial-engine and the node verifiers. No kernel test run is recorded at the base or at the head.
- kernel/tests/indexed_budgets.rs:670 is `#[ignore]` (a release-only measurement harness). CI's `cargo test --workspace --locked` (.github/workflows/product-ci-rust.yml:234) compiles that file and runs none of its harness. So "green" cannot be shown for it by CI.
- Fix, two parts:
  - (a) Cite PR #273's `cargo test --workspace (windows-latest)` check at 5317510c, if it is green, in the PR body as the "after" for the two non-ignored files, and main's check at e3fb936a as the "before". I could not read either.
  - (b) For indexed_budgets.rs, do one of two things. Run its harness once (release, `--ignored`, under a shared hold). Or append a class 2 row saying that it was compiled and not run, the line's "green" reduced to that.
- If (a) is green and (b) is recorded, E1 closes with no code change.

## Documentation (must-fix before the merge, no re-gate)

**D1. The README sentence's "the last three" can be read as the list's last three items, which would include the tested index scan.**
- Where: engine/README.md:61-63 at the head.
- The list has five items for six sites. "The last three" is true only when counted by site.
- The wording is not the human's: OPEN-3 (b) ruled that a sentence be added, not its words. The worker applies these words and the PR body lists them.
- Replacement words:

> The six other sites that bind a token to a connection — `cancellable` (the four open-path reads), the
> identity scan, the index build's scan, the row-group metadata read and the two `layout.rs` statements —
> run their statement through the same guard; no test observes that routing at the row-group metadata
> read or at either `layout.rs` statement.

- Clause check:
  - "six other sites that bind a token": `attach` at engine/src/dataset.rs:1688 and :2011, engine/src/index.rs:335, engine/src/rowgroup.rs:344, and engine/src/layout.rs:349 and :452. The seventh, dataset.rs:2184 (`lease_for_stream`), is the producer's, which the paragraph already covers.
  - "the four open-path reads": `cancellable` callers at dataset.rs:1432, 1708, 1738 and 1814 only.
  - "run their statement through the same guard": dataset.rs:1689 and 2012-2017, index.rs:337-339, rowgroup.rs:345-347, and layout.rs:350-355 and 453-458. At layout.rs:449-451 the prepare comes before the attach, so the guarded call is the executing one, as `execute_guarded`'s own doc (cancel.rs:183-184) defines it.
  - "no test observes that routing…": the `is_executing` callers are only engine/tests/cancel_execute_window.rs, dataset.rs:2201, and cancel.rs:315 through dataset.rs:2229 and index.rs:941. None reaches rowgroup.rs or layout.rs. The only existing `RowGroupIndex::build` test calls (engine/tests/first_batch_and_pruning.rs:564 and :904) pass a fresh `CancelToken` and never cancel.
  - The sentence is consistent with the human's words for these three sites ("routed through the guard, cancellation there unobserved", settlement, OPEN-1) and claims no more.

**D2. The Change line's "the owner's-index Cancellation row are brought into line" is not in the diff.**
- engine/README.md:543 is unchanged. Its numstat is 3/0, all at lines 61-63.
- OPEN-3 (b) left the blockquote. It did not withdraw the row clause.
- Fix (the worker's row, not the human's wording): replace engine/README.md:543 with:

> - Cancellation → `spatial_engine::CancelToken` · pinned by `engine/src/cancel.rs::tests::an_interrupt_on_an_idle_connection_is_not_latched`, `engine/tests/cancel_execute_window.rs::a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`, `engine/src/dataset.rs::tests::a_cancellable_open_read_runs_inside_the_execute_window`, `engine/src/dataset.rs::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`, `engine/src/index.rs::tests::a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`

  (indented two spaces, as at :543).
- Clause check: the three added tests exist at dataset.rs:2198, dataset.rs:2212 and index.rs:913, each in a `mod tests`.
- Also record the row on the "Last verified at" line (README:536) at the fixing commit, in that line's existing form.
- The count then rises above Amendment 1's 216. Amendment 1 stays true as pinned at 5317510c. Append one class 6 row with the new numstat at the new head.
- The alternative: record in the PR body that the row clause is dropped, as a deviation.

**D3. Amendment 1 is silent on §36's size condition.**
- §36 sets §25 (e) aside for a filler that fits a five-line form under §21c's size (AUTONOMY §36, the human's rule). Amendment 1 argues only from §21b. It also cites the counting note by date instead of by round and item.
- My reading is that no Correctness issue follows:
  - §25 (e) tests the form a piece is dispatched on.
  - At dispatch the estimate was about 115 (form, Notes, "Size estimate").
  - §21b's size-overrun clause (round 5, item 2) keeps the five-line form.
- The record should still say this. The custodian appends a class 1 row; the words are the custodian's, not the human's:

> Amendment 2 — 2026-11-01 — class 1, a reading of Amendment 1 (written after this piece's tests and mutations were seen). §36's size condition held at dispatch (the Notes' size estimate, about 115 lines); the overrun is §21b's mid-piece size case (round 5, item 2), which keeps the five-line form, and §25 (e) reads the form a piece is dispatched on, so its set-aside under §36 stands.

- Clause check:
  - "about 115": the form's Notes, "Size estimate".
  - "§21b's mid-piece size case keeps the five-line form": governance/AUTONOMY.md:345 on main.
  - "§25 (e) reads the form dispatched on": the Round 25 rule as this gate's definition states it ("a piece dispatched on a five-line form whose `Out-of-scope` line named a §21a category").
- If the human reads §36's condition as continuing past dispatch, that is a question for the human, not a fix here.

## Notes (no action)

- **N1.** The new `cancellable` paragraph (dataset.rs:1680-1682) says "is re-raised while it runs". That fails only if the OS refuses the re-interrupter thread. The refusal is discarded at cancel.rs:154-159, which already records it. Ordinary use does not reach this, so it is named here under §31 and does not block.
- **N2.** kernel/tests/indexed_budgets.rs:819/883 aims its cancel ladder at the `DuckDbScan` announcement, which stays outside the guard (index.rs:336). A cancel landing there is now refused at step 2 before the scan starts. Any re-run of that ladder is a new measurement. Nothing is claimed here, consistent with the Out-of-scope line.
- **N3.** The index.rs:357 string literal carries a run of spaces where a `\` continuation is missing. It is pre-existing (main index.rs:355) and outside this piece.

## Check 1: the constitution and the ADRs

- **docs/01 principle 7:** strengthened. At each of the six sites, a cancel set before step 2 now refuses the statement (cancel.rs:197-198 at the head), where before it ran to its end.
- **ADR-006:** unchanged. Five sites are reads. Site 5 (layout.rs:349) is the fixture-feature harness COPY; its class and error path are unchanged.
- **docs/05:** line 83 ("Streaming, cancellable queries") holds.
- **Parent form:** its six siblings (governance/forms/engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md, §0 sibling bullet and §2 item 4) are exactly this piece's six sites, and the `attach` grep at the head shows no seventh unguarded product site.
- **The guard is untouched:** `execute_guarded` and the re-interrupter are byte-identical to main. I compared cancel.rs:132-213 at the head with main's cancel.rs:120-201.
- **ADR-018:** item 5 holds, since no time bound is claimed in code, the README or the form. Item 1's "stops advancing" is the reading the Out-of-scope line states. No instant is stamped at the new sites, and none is claimed.
- **docs/08:** no figure is claimed.
- **Caller rule:**
  - `into_result` (pub(crate), cancel.rs:86) has six product callers.
  - `test_support::cancel_when_executing` (cancel.rs:297-324) is `#[cfg(test)]` and absent from the shipped build, so it is test support, not a product item.
  - `is_executing` keeps the instrument-accessor exemption. Its doc (cancel.rs:217-227) names all four callers and why, and the repo grep finds no other caller.
- **No cross-module seam:** no kernel, protocol or SKP file is edited, and kernel/src/skp.rs's open path sees the same `Cancelled` outcome.
- **Strings:** none added or changed; the format strings moved into closures verbatim (layout.rs:353, :456).

## Check 2: the five lines against the head

- **Scope:** six files, all named. The count is 216 per the worker's numstat; I did not recompute it. That is an overrun, recorded as class 6 by Amendment 1 (see D3).
- **Change:** all six wrapped:
  - dataset.rs:1689, dataset.rs:2012-2017, index.rs:337-339, rowgroup.rs:345-347, layout.rs:350-355 and layout.rs:453-458;
  - `into_result` at cancel.rs:83-93;
  - the counter increment inside the closure (dataset.rs:2014);
  - the `is_executing` doc updated;
  - the README blockquote untouched (README:52-56).
  - The row clause is unmet (D2).
- **Tests+mutation:**
  - T-A (dataset.rs:2198), T-B (dataset.rs:2212) and T-C (index.rs:913) exist and assert as the line says. T-B and T-C assert `saw_window` first, then `Err(Cancelled)`.
  - The helper spins on a done flag and `TEST_LIVENESS_DEADLINE` and times nothing (cancel.rs:303-322).
  - Only `saw_window` discriminates under the mutations. `Err(Cancelled)` would also come from the existing post-detach check. This matches the Notes' "What they do not add".
  - The kernel half is unevidenced (E1).
- **Out-of-scope:**
  - ADR: not touched.
  - Security: not touched.
  - Wire: not touched, with no kernel, SKP or MCP file in the diff.
  - Guarantee: touched, under §36 with §25 (e) set aside (OPEN-2 (a)).
  - stream.rs, the four steps and the re-interrupter are unchanged; no dependency is added.

## Check 3: the claim

- The three untested sites carry no comment, doc or claim in code: rowgroup.rs:344-352 and layout.rs:349-360 and 449-462 are code only.
- The README claims for them only what D1 checks.
- The settlement's words match the ruling's phrase byte for byte: settlement lines 111-113 against `state/directives/2026-10-30-270-readme-r1-r3-d5-open-1-class-1-269-clicked-4a-7a-rulings.md:17`.

## Check 4: the records

- **Settlement:** it references the ruling by path and line, not the ledger, and records OPEN-1 (a), OPEN-2 (a), OPEN-3 (b) and OPEN-4 (a) as ruled.
- **Amendment 1:**
  - Its first line states that it was written after the results.
  - Class 6 is right for a short-form overrun (template §10 class 6; AUTONOMY.md:345).
  - Its precedent resolves: state/consults/gates/2026-10-03-subagent-write-audit-script-gate1-reviewer.md:12-15, S1-1, class 6 for a short-form overrun.
  - It names the counting commit by full id.
- **RECORDED MUTATION lines:** dataset.rs:2194-2196, dataset.rs:2208-2210 and index.rs:909-911.
  - Each names the full commit 2ccac3d1a8b3def9fa16c861d71623ab2ad1e200, the mutation, and the assertion that failed by name.
  - None calls a `verify-mutation` run an observation.
  - T-B's line claims only the `saw_window` failure, consistent with the report's disclosure that admission's return under the mutation was not observed.
  - I could not read the mutation logs; the transcript is their evidence.

## Check 5: the docs, clause by clause

- **`is_executing` (cancel.rs:215-227):** "only callers are the test suite". The grep finds them at cancel_execute_window.rs:100 and :126, dataset.rs:2201, and cancel.rs:315 (called from dataset.rs:2229 and index.rs:941). The four named tests exist. The "why" names the four routed sites, each tested by one of them. True.
- **`into_result` (cancel.rs:84-85):** `Cancelled` becomes `EngineError::Cancelled` and `Ok`/`Err` pass through unchanged (cancel.rs:87-91). True.
- **`cancellable`'s new paragraph (dataset.rs:1680-1682):**
  - A cancel between attach (:1688) and the guard's step 2 load is refused at cancel.rs:197-198.
  - A cancel after step 2 finds `in_execute` set and spawns the re-interrupter, which re-raises while the closure runs with the slot bound (cancel.rs:152-175; detach comes only after the guard, dataset.rs:1690).
  - True, with N1 named.
- **Identity comment (dataset.rs:2006-2007):** the increment is at :2014 inside the closure, so a step-2 refusal is not counted, consistent with the counter's doc at dataset.rs:66-67 ("exactly once per call to `run_identity_scan`"). True.
- **README sentence:** true counted by site. Ambiguous counted by list item (D1).

Relevant paths:
- C:/dev/wt/ecbs/engine/src/cancel.rs
- C:/dev/wt/ecbs/engine/src/dataset.rs
- C:/dev/wt/ecbs/engine/src/index.rs
- C:/dev/wt/ecbs/engine/src/rowgroup.rs
- C:/dev/wt/ecbs/engine/src/layout.rs
- C:/dev/wt/ecbs/engine/README.md
- C:/dev/wt/ecbs/kernel/tests/indexed_budgets.rs
- C:/dev/spatial-ide/governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md
