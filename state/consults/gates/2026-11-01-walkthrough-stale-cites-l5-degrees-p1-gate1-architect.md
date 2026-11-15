Reviewed: PR #274 at 1a251a153406f4e6a9000ed1e24cec9f19efbc66, gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/walkthrough-stale-cites-l5-degrees-p1 @ 1a251a153406f4e6a9000ed1e24cec9f19efbc66. Every line cite below is read at that commit in the worktree C:/dev/wt/wsc. Outside the walkthrough, that tree is B's (12ba6974849b86ebda0cd8b93fa99dc254135b41). I have no shell, so this report carries no sha256 and no diff. Each line was compared by Read against main's copy at C:/dev/spatial-ide (b84a2b26).

## Findings by class

**Correctness:** none. Every clause of the four new spans is true of the code it names at B (check 1).

**Evidence:** nothing is open against this gate. E1 to E3 belong to the reviewer (form §9). One gap is the reviewer's to close: the worker's report did not run the `queue.mjs` / `site.mjs` currency checks that §5 E2 predicts. Its own line 31 says so. E3 (PR CI) is not visible to me.

**Documentation (must be fixed before the merge):** both findings below are in text this diff keeps byte-identical, and both are outside its four spans. Editing them here would fire §8 items 1 and 3, and widening the node is what OPEN-3 (a) declined. So the fix is a record line, not a walkthrough edit.
- D-1. Row L1 keeps the quote `entry 36's own "re-earn at settle" rule`. Form §2.1 (W-L1) directs the gate to resolve it against entry 36. It does not resolve. Entry 36 (in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, cited by entry number) does not contain "re-earn". Neither that archive nor `governance/DECISIONS-PENDING.md` contains "re-earn" anywhere (Grep, 0 matches in each). The quote is not marked verbatim and is not presented as the human's words, so it stays Documentation.
- D-2. Row L1 keeps `(entry 43: a truncated within-budget settle is silent by design)`. This is stale since F2: the `settled-partial` branch sends `settled: "partial"` (`frontends/shell/src/residency/candidateArmSession.ts:799-806`), and `residencyStatusText` renders that as string 6 (`frontends/shell/src/residency/residencyStatus.ts:462`, constant at `:434-435`). The same cell's new pointer "(L5 below has the account)" now leads to a row that says string 6. The deviation paragraph's "a silent truncated settle (entries 36/43 — by design, recorded)" (`frontends/shell/MANUAL-WALKTHROUGH.md:831-832`) is the same fact. Form §2.2 declares that paragraph historical and not touched.
- **Replacement words** (§31). These are not the human's wording: they are a PR-body line, the gate's own words. The worker applies them with no re-gate: "Gate 1 (architect), outside the diff, recorded for the human's review beside OPEN-3's two lines and not edited here (form §8 items 1 and 3): row L1's kept quote "re-earn at settle", attributed to entry 36, occurs in neither entry 36 nor the ledger or its 2026-10-20 archive; row L1's kept parenthetical "(entry 43: a truncated within-budget settle is silent by design)" is stale since F2, whose `settled-partial` branch sends `settled: "partial"`, rendered as string 6, as row L5 says."
- **Clause check of those words:**
  - "occurs in neither entry 36 nor the ledger or its 2026-10-20 archive": Grep `re-earn` over both files, 0 matches. Entry 36 read from its heading.
  - "row L1's kept parenthetical … is stale since F2": `candidateArmSession.ts:784-806` (F2's own comment and the branch).
  - "rendered as string 6": `residencyStatus.ts:462`, `:434-435`.
  - "as row L5 says": `MANUAL-WALKTHROUGH.md:819`, its bracket and its new span.
  - Both quoted spans are byte-copied from `MANUAL-WALKTHROUGH.md:815`.
- **Not a finding, named:** the new L5 clause says a truncated within-budget settle "was silent before F2". It drops the "no failure recorded" qualifier that its cite carries (`candidateArmSession.ts:786`). Before F2, a truncated settle that had a failure already got string 5. The clause is history that no operator can observe in the shipped app, so under §31 it does not block. The old span made the same claim.

## Check 1: each §2.1 clause against the code at B

**W-L5** (`MANUAL-WALKTHROUGH.md:819`):
- "until a within-budget fill settles, `emitResidencyStatus` sends no status": true.
  - `emitResidencyStatus` (`candidateArmSession.ts:713`) returns from the over-budget branch at `:725-756`.
  - The `settled-partial-failure` (`:775-783`) and `settled-partial` (`:799-807`) branches need a settled reading (`settledState`, `residencyStatus.ts:330-336`).
  - A not-settled reading returns at `:840`.
  - The clause names that function only. Other dispatchers (the Cancel path, and `handleViewportChange`'s clear at `:1498-1506`) are outside it, and L5 has no Cancel.
- "except one `candidate-fill-progress` while the complete status it sent last is still standing": true.
  - The flag is set only beside the `settled: "complete"` dispatch (`:842-847`).
  - It is cleared at `:754`, `:781`, `:805`, by a fresh generation (`:1669`), and by `relinquishFill` (`:1788`).
  - The clear fires once and resets the flag (`:836-839`).
  - "still standing" is the flag's own documented meaning (`:508-516`).
- "`nextResidencyStatus` reduces that event to no status": true.
  - `residencyStatus.ts:204-205` returns `null`. The sticky guard at `:176-181` covers only the within-budget and over-budget kinds.
  - App threads the event through it (`App.tsx:1643`).
  - No `.residency-status` element is rendered while the status is null (`App.tsx:2349-2352`).
- "silent before F2, which … entry 43 recorded as silence representing state, the class entry 36 ruled against": true.
  - Entry 43, read in the archive, records the silence and sets it against entry 36's "silence and staleness never represent state". Entry 36's RESOLVED text carries that phrase.
  - The code's history is at `candidateArmSession.ts:784-798`.
- "since F2, `emitResidencyStatus`'s `settled-partial` branch sends `settled: "partial"`": true (`:799-806`). Truncation makes `isFillComplete` false (`:671`), and with no failure the reading is `settled-partial` (`residencyStatus.ts:334-335`).
- "which `residencyStatusText` renders as string 6": true (`residencyStatus.ts:450`, `:462`, `:434-435`). The constant's literal matches L5's existing string-6 quote by Read. A byte-for-byte proof is §4 item 4, the reviewer's script.
- The span claims nothing beyond these. It does not say that every within-budget fill emits `candidate-fill-progress` (§8 item 4), and it does not claim the L5 re-check is discharged.

**W-L1** (`:815`): "until a within-budget fill settles it sends no status (L5 below has the account)". This is true under the first and third clauses of W-L5. L1 has no Cancel. The one possible clear reduces to no status, so the operator sees none.

**W-P1** (`:1476`): true.
- "the `logSessionEvent` call in `establishFrameFromExtent`": `candidateArmSession.ts:1229`, inside the function that opens at `:1209`.
- "that writes the `candidate-grid-frame-established` event": `:1230`. It is the only call that passes that literal; the mention at `:1400` is a comment.
- `DEFAULT_RESIDENCY_ARM` still holds at `residencyArm.ts:50` (`= "candidate"`). That retained span is unchanged.

**W-FN** (`:808`): "`parcel`'s grid cell in `engine/src/fixture.rs`" is true.
- The layout is `(id % cols, id / cols)` at `engine/src/fixture.rs:1260`, rising from `y_lo` (`:1264-1266`).
- The default `GeometryMode::Polygon` (`:571`) calls `parcel` (`:1061-1062`).
- `polygons-100k` is regenerated with `..Default::default()` (`engine/tests/common/mod.rs:87`).

## Check 2: the ruled words

The directive (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, line 22) rules "Walkthrough L5/P1: OPEN-1 yes, OPEN-2 yes." Those yeses approve the words of the 2026-10-23 draft's §2.3 and §2.4 (`state/consults/2026-10-23-walkthrough-stale-cites-l5-degrees-p1-architect-draft.md`, read). The head carries them unchanged:
- W-FN `(`parcel`'s grid cell in `engine/src/fixture.rs`)`, at `:808` with no rewrap.
- W-L1 `until a within-budget fill settles it sends no status (L5 below has the account)`, at `:815`, with the trailing entry-36 span kept.

Both equal form §2 (W-FN, W-L1). §8 item 8 holds.

## Check 3: §8 item by item

1. Holds. Lines 808, 815, 819 and 1476 differ from main only in their named spans, compared by Read. Lines 768-835 and 1455-1494 otherwise read the same. The whole-file count rests on the custodian's numstat `4 4` and the reviewer's §4 items 1-2; I cannot diff.
2. Holds. One file. No code, test, string or `scripts/` change.
3. Holds. The only new quotation is `settled: "partial"`, byte-equal to `candidateArmSession.ts:803`. String 6 in L5's bracket, L1's entry-36 span and the probe are unchanged. (The entry-36 span's own resolution is D-1.)
4. Holds (check 1).
5. Holds. The new spans name paths without lines. `residencyArm.ts:50` in P1 is retained text, not new. The PR adds no pin.
6. Holds. The points Part P's P1 (`:1639`) is identical to main.
7. Holds. No result log and nothing under `state/` is in the diff.
8. Holds (check 2).
9. Holds. 8 lines against a ceiling of 8, and §7 is not edited (the form is not in the PR).
10. Holds. No scope addition.
11. Holds. The worker's report and the PR record name no mutation run.

§5 authorship invalidator: it does not fire. The custodian's git check (the filing note) finds a Claude Co-Authored-By trailer on all six commits behind the replaced spans. No span is the human's own wording.

## Check 4: the record

- Amendment 1 records OPEN-3 (a) as a finding taken under the 2026-10-31 direction, item 4. Its two stale lines (the test comment about `relinquishFill`, and the bare self-lines in the partial-branch comment, `candidateArmSession.ts:788-791`) are left for the human, and no node is placed or widened.
- It records the `depends_on` re-chain as the custodian's reading, for the human's review. That re-chain landed on main in 12ba6974, not in this PR.
- The PR changes one file inside the four ruled spans. It touches neither stale line, nor PLAN.yaml, nor any code. Nothing in it goes beyond that record. D-1 and D-2 are new outside-diff findings, and the record line above carries them in the same "recorded, not widened" form.
