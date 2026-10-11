# PR #212 gate 1 — architect
Reviewed: cut/shell-migration-milestone-2-phase-a @ c08cb809db97b2a4ab6e7cbbfad1fb822cd5a299

**Verdict: pass with notes.** I found nothing under Correctness or Evidence that blocks. Six Documentation findings (D1 to D6) must be fixed in this PR before the merge. None needs a re-gate.

Line cites into `frontends/shell` are read at c08cb809. The form's Amendment 4 and PLAN.yaml were read on main at 4e3e6ce3. Neither is part of this branch, so I cite them by amendment and item, or by node, not by line.

## Correctness: none

- **Seam 4 against §2.1 and plan §6.1.**
  - The three identities are kept apart.
  - `ViewState` and `ResourceEntry` have the shape §2.1(a) gives.
  - `admitted` is a selector, and the same `Admitted` object is stored. `resource.generationEnded` and `resource.closed` rebuild the entry around that same object, so the `[admitted]` effect never restarts on them (`src/workspace/workspaceState.ts:106-128`).
  - The close runs once, with the guard at `workspaceState.ts:150-155`.
  - The order on a reopen is unchanged. React runs every cleanup before any setup, so the old session stops, then `closeDataset(old)` runs (`src/App.tsx:1305-1310`), then the new session starts. RA1 asserts open-B before close-A.
  - ADR-010 rule 1 holds: the map is still keyed on the handle (`App.tsx:1838`).
  - ADR-006 holds: no transition is logged or undoable.
- **Cross-module seams.**
  - `closeDataset(dataset: string)` (`src/skp/client.ts:130-132`) is called with the resource key, which is `Admitted.dataset` (`src/admission/admitDataset.ts:11-18`). The argument is the same one as at the base.
  - RA1's mock uses the real types (`OpenDatasetResponse`, `CloseDatasetResponse`) and runs through the real App.
  - The real app exercises the new path in two places:
    - EXPORT-TODAY's reopen;
    - the source-changed suites, which drive the `generationEnded` dispatch (`App.tsx:1185`) and pass unedited at head.
- **The caller rule.**
  - Every value export has a product caller in App.tsx (lines 76-84).
  - `applyViewTransition` is called by the reducer.
  - `resource.generationEnded` has a writer and no phase A reader. The second exemption covers it: the human ruled OPEN-10's two PRs, and §2.3 names the reader (its trigger bullet), gated by UB4, RB4 and E-GEN. D3 covers the naming.
- **Amendment 4, item 4 (a) to (g).** All seven are properly recorded deviations, and none is a Correctness or Evidence issue.
  - (a) is what the caller rule requires: §2.4's other names have no state in phase A.
  - (e) is not Correctness. `bootstrap.tsx:25-29` mounts App once. StrictMode's simulated unmount happens at mount, before any dataset is open. A page reload never ran React cleanup at the base either. The only leak is under hot reload in dev.

## Evidence: nothing blocks

- **H3, no visible change.**
  - The DOM order, the keys and the strings are unchanged. The canvas is wrapped in `drawnViews.map`, which yields one element at `App.tsx:1833-1907`, ahead of `HoverReadoutView`.
  - All 14 suites are identical step for step at B and at head.
  - Nothing under `canvas/` changed.
- **4(g), the e2e harness.** B and head ran under the same method, so H3 is a like-for-like comparison. I accept it as evidence. Its disclosure is part of D6.
- **EXPORT-TODAY: H4 holds.**
  - The open returned at 19:53:02.232Z, and the host's outcome was success at 19:53:06Z. The audit times are whole seconds, so the gap is about 4 s or more.
  - The panel, its progress and its Cancel left the screen, and no line on the page mentioned the old export.
  - Under A7's first branch, B3 is built in phase B. Under A10 and B9, no B3 code is written before the human's typed word on A10's reach (a red line) and on the late-cancel statement. Amendment 4 item 2 records this correctly.
- **The residency-harness outlier.** It is 1 run in 6, and the harness claims no verdict. It is not a finding.
- **Advisory.** The close after a reopen has no e2e assertion. Phase B's E-GEN could read the class-A `close_dataset` console row (`src/console/surfaceRegistry.ts:84`) at no cost.

## Documentation: must fix before the merge

**D1. A comment states a mechanism the code does not have.** The comment at `src/App.tsx:1319` reads (byte-copied): `// This effect run's consumer of the dataset: released in its cleanup, which is what lets the close above run.`

On a reopen, `admit` has already removed the view from the old resource's consumers (`workspaceState.ts:93-95`). The release is then a no-op (`workspaceState.ts:123-126`). So the close runs because of the admission, not the release. An unmount's dispatch is dropped. This is not the human's wording, so under the wording-block rule (2026-10-11 direction, item 2d) the worker applies these words, with no re-gate, and the PR body lists them:

> // This effect run's consumer of the dataset, released in its cleanup. On a reopen `resource.admitted` has already moved the view to the new resource, so this release changes nothing and the close above runs because of the admission; the release covers a cleanup with no rebind, which phase A does not have (an unmount's dispatch is dropped).

Each clause checked against the code:
- "already moved": `workspaceState.ts:93-98`.
- "changes nothing": `workspaceState.ts:124-126`, together with `withResource` returning the state unchanged at line 114.
- "no rebind": the `[admitted]` dependency changes only through `admit` with a new key (`workspaceState.ts:143-146`).
- "dropped": React ignores a dispatch from an unmounted component.

**D2. Two class 2 deviations are not recorded.** Record both in one appended row.
- §2.1(b) says `activeFilterRef` is "written in the same function as today". The admission reset now writes it in an inline closure (`App.tsx:1016-1018`) instead of `commitActiveFilter`. The behaviour is equivalent.
- §2.1(b)'s sentence that the old dataset "is released and closed" describes a release that has no effect in any phase A path (see D1).

**D3. The second exemption needs its consumer named.** The PLAN.yaml node `shell-migration-milestone-2` and the PR body must name the consumer of `resource.generationEnded`: §2.3's selection end in phase B, gated by UB4, RB4 and E-GEN. Amendment 4 item 4(d) points at §2.5, but the form's named trigger is §2.3. The appended row cites §2.3; §2.5's generation also reads the flag.

**D4. The merge must keep commit X reachable.** Every mutation comment cites `deab7dc9…`, a commit on this branch. Add `merge: merge-commit` to the node (AUTONOMY.md §27) and merge with a merge commit. Milestone 1's node carries the key; this node does not.

**D5. §3's fixture hashes are not recorded.** The sha256 of `100k-happy-path.parquet` and of `filter-zoned.parquet` for the EXPORT-TODAY runs is missing. Record them, and state when they were taken if they were not taken before and after the run.

**D6. The PR body.** It must carry:
- B9's list of the base suites;
- EXPORT-TODAY's outcome (A7);
- the verify tools, each named with its commit (§9; round 15(c));
- 4(g)'s method, with the exact browser-argument overlay, so the gate can see it removes none of the shipped configuration's arguments.

## Notes on the seam phase B consumes (not findings)

- `consumers: readonly ViewId[]` (`workspaceState.ts:46`) and `consumer.released.consumer: ViewId` (line 63) must be widened for B3's operation consumer. That change belongs to phase B and counts within B-W.
- Closed resource entries are never removed, so there is one small entry per reopen.
- The known-key branch (`workspaceState.ts:77-78`) would keep the first `Admitted`. It cannot be reached, because handles are 128-bit random (`protocol/skp/src/v0/handles.rs:17-21`).

## §8, item by item, for phase A

| Items | Result |
|---|---|
| 1, 2, 5, 8, 12, 13, 16, 17, 18, 20, 21, 22, 24 | Clear |
| 19 | Clear, subject to D3 |
| 23 | Clear: every row has an observed mutation, recorded at X |
| 3, 4, 6, 7, 9, 10, 11, 14, 15, 25 to 33 | Phase B only |

**Amendment 4's class 8 record is right in form.** App.tsx is 281 lines against a ceiling of 220, the cause is stated, and §7 is not edited (its A-P row still reads 220). No discharge clauses and no verbatim quotes. No red-line text is in the diff.

## ADR skeleton

None needed.
