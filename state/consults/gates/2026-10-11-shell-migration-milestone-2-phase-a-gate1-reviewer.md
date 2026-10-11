# PR #212 gate 1 — reviewer
Reviewed: cut/shell-migration-milestone-2-phase-a @ c08cb809db97b2a4ab6e7cbbfad1fb822cd5a299

**Verdict: PASS.** There are no Correctness or Evidence findings. Four Documentation findings must be fixed in this PR before the merge (D1 to D4). Each comes with replacement words under `AUTONOMY.md` §31(a)/(d). None of them is the human's wording or a red-line text, so no answer from the human is needed.

## What I ran and checked
- **Head.** `git -C C:/dev/wt/mm2a rev-parse HEAD` returned c08cb809db97b2a4ab6e7cbbfad1fb822cd5a299. The worktree is clean. The merge base with origin/main is 86f60365 (= B).
- **`npm run verify`** (in frontends/shell, inside a shared hold that was released, no 96–99): rc 0. 84 files and 1213 tests passed. residency-trace 76 passed, citation-integrity 30 passed.
- **Governance scripts at c08cb809** (`scripts/plan` was last changed at c813c6ab, so these are the tools at that commit):
  - `verify.mjs` PASS.
  - `verify-cites` PASS: 1775 files, 37 loose advisories.
  - `verify-quotes` PASS: 121 checked, 90 verified, 30 baselined.
  - `verify-test-claims` PASS: 545 claimed tests.
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 457 pass, 0 fail.
- **§7.** The form's numstat command against B reproduces the report exactly: App.tsx 169/112 (101/44 with `-w`), and 1,170 in total. The App.tsx overrun (281 against 220) is recorded as class 8 in Amendment 4 item 1.
- **The form is append-only.** Commits 485dfbcb, 038a8c26 and 4e3e6ce3 each only add lines to the form, so §7 is not edited.
- **The worker report's filing hash.** I recomputed the sha256 from line 5 to the end and it matches the filing note (40312849…a33b).
- **Amendment 4 item 2's cite** resolves: section 2 items 1 and 2 of state/consults/2026-10-09-shell-migration-milestone-2-amendment-1-architect-draft.md are A10's reach and the late cancel. The file is tracked.
- **Mutations recomputed** at X = deab7dc9, in my own detached worktree C:/dev/wt/rev212-scratch. Its node_modules was a junction to mm2a's. The worktree is now removed, the junction was removed first, and mm2a's node_modules is intact. Baseline: 5 files, 18 tests green.
  - **UA2** (drop `!entry.closed`): UA2 failed with "closes after two drains: expected [ 'ds_a', 'ds_a' ] to deeply equal [ 'ds_a' ]". RA1 also failed. Matches the record.
  - **UA3** (`selectAdmitted` reads `drawOrder[0]`): failed with "expected { dataset: 'ds_b', …(2) } to be { dataset: 'ds_a', …(2) }". Matches.
  - **RA1** (drop `consumers.length === 0`): failed with "after the first admission: expected [ …(2) ] to deeply equal [ Array(1) ]". Matches.
  - **RA2** (`filter: view.filter` on rebind): failed with "the filter is reset: expected <p class="filter-active"></p> to be null". Matches.
- **No change under `canvas/`.** The diff touches 10 files, all on §2.7's may-edit list. There is no dependency or lockfile change.
- **UA6's rule holds.** Workspace value imports are only `../style/document` and `./viewTransitions`. style/document imports only renderer/style-ts.
- **The caller rule.** Every new value export has a product caller in App.tsx or in the reducer: initialWorkspaceState, workspaceReducer, selectDrawnViews, selectAdmitted, selectClosable, styleTransitions and applyViewTransition.
- **§8 for phase A.** Items 1, 2, 5, 12, 13, 16 to 24 are clean. Phase B's items do not apply.

## Correctness — none blocking
The points the brief asked me to judge:

- **Once-only close, and no close of a live handle.** `selectClosable` requires no consumer and not closed. The close effect dispatches `resource.closed` after issuing the close, and the next run excludes that resource. UA2's mutation and RA1's mutation, both recomputed, fail on a double close and on a live close respectively.
- **The order on a reopen.** I added logging to the mock manager's constructor and `stop`, in my scratch copy only. Both reopens recorded `open:new, stop, close:old, start`, with and without `<StrictMode>`. So the order is stop the old session, close the old handle, start the new one, as at base. It holds because the close effect is declared before the `[admitted]` effect. RA1 does not pin this; see D2.
- **The `[admitted]` effect's dependency identity.** It is stable: the entry spreads keep the same `admitted` reference, and UA1 asserts `.toBe(b)`. RA1 and RA2 pin it end to end. Probe: making `selectAdmitted` return `{ ...a }` fails both, because the effect re-runs and closes the live handle. My logged run showed exactly one start and one stop per handle across Apply, a style edit and the layout actions.
- **StrictMode.** The product mounts App under `React.StrictMode` (src/bootstrap.tsx). App mounts with no admitted dataset, so the double-invoked `[admitted]` effect returns early. The reducer is pure (`nextViewNumber` lives in the state, 4(c)), so its double invocation is safe. RA1 and RA2 pass under `<StrictMode>` in my probe.
- **4(e), App's unmount no longer calls `closeDataset`: not a Correctness issue.** The product never unmounts the root. bootstrap.tsx calls `createRoot(...).render` once, and no non-test file under src calls `unmount()`. A WebView close does not run React effect cleanups, so base's unmount close was unreachable in the shipped app. The change is consistent with Amendment 1 B3, which releases a consumer at the run's outcome and never on unmount. Residual hazard: S1.

## Evidence — none blocking
- **e2e.** I did not run any e2e suite, as briefed. The port-5400 harness is disclosed in 4(g). It keeps the `localhost:5180` origin through the host-resolver rule, and the changes are state plumbing with unchanged canvas props, so I accept H3 on the report's 14 suites at B and at head.
- **Residency-harness variance (one of six runs).** I found no mechanism in the diff that could cause it: the logged order shows no extra effect runs. The custodian's solo re-run, offered in Amendment 4 item 5, is the right check.
- **EXPORT-TODAY's H4 conclusion** rests on three things in the report:
  - Cancel was showing during the export;
  - the open returned at 19:53:02.232Z, before the audit outcome at 19:53:06Z;
  - the panel was gone after the open.

  That is consistent with A7's first branch.

## Documentation — must fix before the merge
- **D1. Amendment 4 item 4(d) cites the wrong section.** It says the reader of `generationEnded` is phase B's, "which §2.5 names". The form names that reader in §2.3: its generation-end trigger bullet names `resource.generationEnded`. workspaceState.ts's header comment at c08cb809 correctly says section 2.3. Words for an appended correction: "Amendment 4 item 4(d) names §2.5 as the section naming generationEnded's reader. The section is §2.3, whose generation-end trigger is `resource.generationEnded`. The proof is §2.3's trigger bullet and the header comment of frontends/shell/src/workspace/workspaceState.ts at c08cb809."
- **D2. Amendment 4 item 4(e) over-credits RA1.** It says "A reopen's order is unchanged (RA1)", but RA1 asserts only that the new open comes before the old close. It does not observe the stop or the start. Moving the close effect after the `[admitted]` effect, which starts the new session before the old handle closes, passed App.workspace, App.layout and App.test: 83 passed, in my probe at deab7dc9. The order does hold (see the reopen-order bullet under Correctness). Either:
  - extend RA1's mock to log `stop` and the manager's construction, and assert the order, with the effect swap as its observed mutation; or
  - append: "Amendment 4 item 4(e)'s (RA1) covers only the new open before the old close. The stop–close–start order rests on the close effect's place before the `[admitted]` effect in frontends/shell/src/App.tsx at c08cb809, which no test pins. The gate-1 reviewer's report records the probe that observed it."
- **D3. The PR body is missing two things.**
  - §9 requires verify-cites, verify-quotes and verify-test-claims, each named with its commit. The PR body names none of them. Add: "Governance scripts at c08cb809 (the tools at that commit): verify.mjs, verify-cites, verify-quotes and verify-test-claims exit 0."
  - The producer-ahead exemption for `resource.generationEnded` requires the PR body and PLAN.yaml to name its consumer. Neither does. Add to both: "`resource.generationEnded` is written in phase A with no reader. Its consumer is phase B's selection end (§2.3), proven by UB4, RB4 and E-GEN."
- **D4. §3's fixture sha256s were not recorded.** §3 requires each fixture's sha256 before and after the run. The report records none for phase A's runs: the base and head suites, and EXPORT-TODAY's 100k-happy-path.parquet and filter-zoned.parquet. Amendment 4's class 2 list does not disclose this. It does not bear on H4, which rests on the audit times and the UI reads. Append: "§3's fixture sha256s were not recorded for phase A's runs (the base and head suites, and EXPORT-TODAY's 100k-happy-path.parquet and filter-zoned.parquet). Class 2; H4's outcome rests on the audit times and the UI reads, not on fixture bytes."

## Suggestions
- **S1. Acquire and release are asymmetric.** `admit` acquires the view's consumer, but the `[admitted]` cleanup releases it. On every product path that release does nothing:
  - on a reopen, `admit` already removed the consumer;
  - on unmount, the dispatch goes to an unmounted reducer.

  If that effect ever re-ran without a rebind (dev Fast Refresh, or a dependency added later), the live resource would be left with no consumer. The close effect would then close the live handle while the setup restarts on it. Base had the same hazard, because its cleanup closed directly. Make the setup re-acquire idempotently when phase B adds the export consumer.
- **S2. `admit` silently keeps an old entry.** `known ?? {...}` reuses an existing entry and drops the new `Admitted`. A closed entry would also stay closed for good. This is unreachable today, because handles are 128-bit CSPRNG values (`mint_hex_id`, protocol/skp/src/v0/handles.rs) and are never re-issued. Refuse or assert instead.
- **S3. Closed resource entries are never pruned.** Each keeps its `Admitted` and describe response for the whole session.
- **S4. No test drives App's `resource.generationEnded` dispatch.** The report says so in its item 5. Phase B's RB4 and E-GEN should start from the real `dataset_session_ended` route.
- **S5. The RA harness renders without `<StrictMode>`, though the product renders under it.** My probe passed under StrictMode, so wrapping is cheap.

## Nits
- **N1. UA4's union `it` has a tautological runtime `expect`.** The real proof is tsc over the `Record<ViewTransition["action"], true>` literal, because tsconfig includes src and `npm run verify` typechecks. Say so in the comment.
- **N2. Some exported types have no importer outside their module:** `FilterApplyTransition`, `StyleSetTransition`, `ResourceEntry` and `ResourceKey`. They are types and do not act, so the caller rule does not bite.
- **N3. Several `it`s carry no observed mutation of their own:** UA2's second, UA3's second, UA4's first two, and the sanity `it`s in UA5 and UA6. Each row still has its one mutation, as the form asks.
- **N4. The close effect's dependency list is `[workspace.resources]`, but its body reads `workspace`.** It is correct, because `selectClosable` reads only `resources`. A one-line comment would save the next reader the check.

Files: C:/dev/wt/mm2a/frontends/shell/src/App.tsx, C:/dev/wt/mm2a/frontends/shell/src/workspace/workspaceState.ts, C:/dev/wt/mm2a/frontends/shell/src/workspace/viewTransitions.ts, C:/dev/wt/mm2a/frontends/shell/src/App.workspace.test.tsx, C:/dev/wt/mm2a/frontends/shell/e2e/selection.mjs, C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendment 4).
