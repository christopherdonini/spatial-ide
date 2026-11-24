Reviewed: branch cut/colour-by-refill-keeps-the-view at d636c3b6a952779a9ef2652cfd891541d3d53339, PR 365 (draft), in the branch worktree C:/dev/wt/cbr, read only, with the diff in the scratch folder; the records at main cdfebef1eecdda586cd7c9aca41941447b453a99 in D:/wt/read-1124c (the custodian's filing note, 2026-11-24: the architect's build gate, attempt 4 of the architect rows for this node, node:colour-by-refill-keeps-the-view@build-gate-architect-1, the second gate section 9 of the form names, dispatched at 2026-11-24T03:16:43Z; its run: Read 39, Grep 26, Glob 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T03:16:47Z to 2026-11-24T03:29:18Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T03:29:18Z. Its first line carries the branch and head after the verdict, which the brief did not ask for; the verdict is PASS WITH NOTES. The CI reading it cites is the custodian's, as the brief gave it. Filed below the rule from its hand-back, 23920 bytes, sha256 2a11a8d201da4c87299c2fa5a7cc96b9ae6499749ad9b067333fd0e0934c9f07, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES (cut/colour-by-refill-keeps-the-view @ d636c3b6a952779a9ef2652cfd891541d3d53339)
Reviewed: C:/dev/wt/cbr @ d636c3b6a952779a9ef2652cfd891541d3d53339
REPORT PATH: state/consults/gates/2026-11-24-colour-by-refill-keeps-the-view-build-gate-architect.md

There are no Correctness findings and no Evidence findings against the head. There are two Documentation findings, D-A1 and D-A2. Both must be fixed in PR 365 before the merge, and neither needs another gate. Two points the form's text does not settle go to the advisor as open questions, OQ-1 and OQ-2. Unless a cite names another place, branch cites are read in C:/dev/wt/cbr at d636c3b6 and record cites in D:/wt/read-1124c at cdfebef1. Where the form's 0bcf5434 line numbers have moved, the tree is authoritative and I name the move. I worked by reading only and ran nothing.

## 1. docs/01

- **Never block the canvas (derived rule 1).** Holds.
  - The change adds no wait and no loop. It adds one conditional write (`WorkingCanvas.tsx`, line 1667 at d636c3b6) and passes one argument along (`App.tsx`, lines 1803 and 2147; `candidateArmSession.ts`, line 1770).
  - The refill's own work is unchanged: the clear at CAS:1765/:1769, the untiled look at :1811, and the terminal plan at :1521-1535.
  - The piece makes no fps claim.
- **Principle 7 (cancellable, streaming, progress-reporting).** Holds. Every relevant line is unchanged:
  - the clear's cancellation of in-flight streams (`manager.clearAll()`, CAS:1765);
  - the supersede of an earlier look at its mint (:1335-1337);
  - the `query-issued` status (:1808) and scan liveness (:1810);
  - the operator's Cancel (`relinquishFill`; the diff has no hunk near it).
- **Derived rule 2 (display reprojection only through a visible view transform).** Holds.
  - Nothing is reprojected or converted. Keeping the camera means not writing it.
  - `boxOf` in the e2e script is harness arithmetic in the data's own metres. It is not product code.
- **Principle 8.** Holds. The plan is still logged (CAS:1533), and the camera writes are unchanged.
- **ADR-006 class.** Unchanged. The refill records no step (`App.tsx`, line 2139: "No step is recorded"). The Colour-by `style.set` step is `handleStyleCommit`'s, which the diff does not touch.
- **docs/10 and docs/08.** No protocol or data-plane change and no performance claim.

## 2. ADR-010, ADR-018, ADR-028

- **ADR-010.** Holds.
  - Rule 1: `fitAnchorRef` and `lastQueriedRef` hold authoritative boxes. Both are cleared (WC:1666, :1668), so no earlier generation's box crosses into the new one.
  - Rule 3: the frame origin is recentred only by a fit (`fitToExtent`, WC:1431; doc at :477). While the flag stands, no fit runs (WC:1587, :1822). So the refill's geometry is narrowed against the standing origin by the unchanged f64 path.
  - Rule 5: the map is visibly cleared (CAS:1769) before it is refilled. Nothing stale is served.
- **ADR-018.** Holds.
  - Read as the form's §5 line: the clear cancels as before. At the head the clear is CAS:1765 (it was :1740 at 0bcf5434; the line moved and the code did not change).
  - Read as ADR-018 §5 itself: no interrupt is cited as a bound. The piece times nothing, and the e2e waits are declared harness bounds (`colour-refill.mjs`, line 20 at d636c3b6).
- **ADR-028.** Holds.
  - The reissue still sets up a new generation: `untiledLookGeneration` is raised at :1754, `frameEstablished = false` at :1771, `hasPlanned = false` at :1774 and `latestUnionedExtent = null` at :1783. None of these lines is in the diff.
  - M-S2 and M-S3 guard that the keep-camera path keeps them (row 886).
  - Amendment 4's late-batch drop is the generation term at :1349.
  - Decision 1's single render origin is kept.

## 3. Concurrency (read at the head)

- **A Colour-by change during a refill.** The new reissue raises the generation (CAS:1754). The earlier look's batches are dropped (:1349). Its terminal is not current (:1377), so it freezes no frame (:1455), emits no status (:1500) and plans nothing (:1522). The camera: WC:1667 leaves the flag, and WC:1666 clears the anchor again.
- **A change while a query is minting.**
  - The earlier look returns `{ kind: "superseded" }` at :1335-1337, and its ticket is cancelled. The retry wrapper retries only on `throttled` (`App.tsx`, line 280). `reportViewportOutcome` (:1599-1616) makes no fit call.
  - **If the minting query is an Apply's:** `applyFilter` gets `not-applied` (App:399). There is then no commit and no App reset (:394-396). The flag stays false from the Apply's own session reset (CAS:1770), so the refill's first batch fits. This is §2.4 (i). It is named as not covered at App:2139 and CAS:255-256, under AUTONOMY §31 (inside one request round trip). It is the same at the base.
- **A change as a generation ends.** JavaScript runs one task at a time, so there are only two orders:
  - The terminal runs first: it is current, it plans (:1521-1535, then `hasPlanned` at :1588), and the reissue then cancels that plan (:1765) and resets the flag (:1774).
  - The reissue runs first: the terminal has `wasCurrent` false (:1377) and does nothing.
- **Two changes in a row.** The effect fires once per distinct column while the not-held status stands (App:2146). Each change is case 1 or case 2, depending on where the earlier one is. Each passes `keepCamera`, and keepCamera never writes the flag.
- **What the tests reach:**
  - The flag half: RK-C1 and RK-C4.
  - That the session passes the option and changes nothing else: RK-S1, M-S2 and M-S3.
  - The supersede: PR 358's MW1-MW7 and FE1-FE3 (`candidateArmSession.mintWindow.test.ts`).
- **Races no single test reaches with `keepCamera`:**
  - two keep-camera refills in a row through the real App;
  - an Apply and then a refill before the Apply's first batch, through the real App (RK-C4 covers only the canvas half);
  - §2.4 (b), (c) and (f).
  
  Each is reached only by putting tested parts together, and the diff changes none of those mechanisms. §2.4 marks (a), (g) and (h) unchanged and names (i) as not covered. These are notes, not failures.

## 4. Seam rule

Each of §2.1's interfaces is the same at the base and the head, apart from §2.2's optional parameter:

| Interface | Base (e4e6493d) | Head (d636c3b6) |
|---|---|---|
| `resetFitForNewGeneration` signature | WC:193 | WC:198 |
| its body | :1660-1664 | :1665-1669 |
| `reissueUnrestricted` signature | CAS:254 | CAS:258 |
| its body | :1738 | :1742 |
| the reset call in it | :1766 | :1770 |
| `issueQueryRef` type | App:1056 | App:1058 |
| candidate binding | :1801 | :1803 |
| the effect's `attempt` | :2145 | :2147 |

- At 0bcf5434 the form cites CAS :1718-1787 and :1745 for the body and the reset call; PR 358's lines account for the move.
- The return type, with PR 358's `superseded` outcome, is unchanged.
- Product caller: only App:2147. The baseline binding (`issueViewportQuery`, App:1960) is unedited and takes three arguments. Nothing is test-only and there is no new `pub` item.
- End-to-end from the real shape:
  - RK-A1 drives the real App and the real session, with a stand-in typed `WorkingCanvasHandle` and no cast.
  - E-RK1 drives the shipped app.
  - The e2e imports exist at the head: `lib.mjs` lines 33, 151, 378, 407, 633 and 642, and `residencyTrace.mjs` line 207.

## 5. §8, item by item

1. **No product caller:** clear. App:2147 is the caller.
2. **The reset changed without the option:** clear. WC:1667 clears the flag unless `keepCamera` is true, and RK-C5 guards it.
3. **`applyFilterWith` or the open passing `keepCamera`:** clear. App:1127 and :1836 pass nothing, and neither do the `queryWithFilter` hooks (:1813, :1977).
4. **The baseline arm or `tileViewportStreamManager.ts` edited:** clear. Neither is in the diff.
5. **A test encoding an interface the head lacks:** clear (§4 above).
6. **A mutation recorded from a `verify-mutation` run:** clear. Row 886 observed each mutation, and the M-F1 comment says "Not observed in this commit".
7. **A class 9 addition, or code before its amendment:** clear. Amendment 7 is a Scope addition, not one on a standing rule. Row 886 read its commit 06dde5c0 at 20:41:26Z, before commit 5 at 21:25:47Z.
8. **A test-text span pinned at a branch commit, or named without its id:** clear. Amendment 7 cites RF10 at ":855 at the head" and names that head (da55b7a6) in its item 1. The record comment at `WorkingCanvas.test.ts`, line 854 at d636c3b6, names the full id. Item 51's comment pins code, not test text, at 39d096e9 (note N-2).
9. **The words outside the words commit, or merged unruled:**
   - Clear. Row 886 found them landed only in 95d9621c. The file lists of 480445f9, c60660bd and d636c3b6 do not include `KNOWN-LIMITATIONS.md` or `MANUAL-WALKTHROUGH.md`.
   - None of the three is on main. At cdfebef1 the old item 51 clause, the old item 61 span and the old AC12 third cell each occur once.
10. **An app string changed:** clear.
11. **Amendment 4's AC12 merge bullet:** nothing to act on yet. Main's AC12 third cell at cdfebef1 still equals the base's, checked on two spans that together cover it.

## 6. Evidence

- **§4 and the register.** All eleven rows exist at the head. Each row's assertion is what Amendment 2's row says, and each `it` title begins with its id.
  - Row 886 observed P0 at 8329a53c: RK-C1, RK-S1 and RK-A1 red; the guards green.
  - Row 886 observed M-C1 to M-C5, M-S1 to M-S3, M-A1 to M-A3, RF10 and M-F1 at 2095a7ac, each failing exactly its set.
  - Product code at the head differs from 2095a7ac only in comment lines (check 8), so those observations hold at the head.
- **§5.**
  - The predictions held.
  - The falsification line "any declared-unchanged test goes red" fired: RF10 at da55b7a6. Amendment 7 handles it, and the closing amendment records it as class 2 (row 886, D-7).
  - Declared unchanged: the clear (CAS:1765), the baseline arm, the strings, and the wire and kernel apart from the fixture all hold.
- **E-RK1 (series 2 report, row 893) against Amendment 4 item 5 and Amendment 8.**
  - Run 1, at P0 with the fix commit's suite: exit 1 at (a) only, with the planned box equal to the fit box (44112 against a span of 102.42). That is the row's own reason, as ADV-2026-11-24-01 item 2 asks.
  - Run 2, at c60660bd: exit 0, 3/3, edge difference 0, 300000 features resident.
  - Run 3, with M-A1: red at (a) only.
  - Both client sizes are recorded, and the input count and the away-from-fit check come before (a) (`colour-refill.mjs`, lines 227 and 243 at d636c3b6), as Amendment 4 item 5 and Amendment 6 item 7 ask.
  - That run 1 used c60660bd's file is corroborated two ways. Row 893 recomputed the 25/11 diff stat. And run 1 reached its asserts, which P0's own copy of the file cannot do (row 893, check 2). The tester recorded no blob hash (note N-3).
- **The three VOID runs** (0 and 0b at 8329a53c, d1 at 2095a7ac) are given with their commits and end lines in the series report. Row 893 matched those lines byte for byte. That is what ADV-2026-11-24-01 item 3 asks.
- **Does the evidence carry §1's claim?**
  - The camera is kept: RK-C1 and E-RK1.
  - The waiting fit stands: RK-C4.
  - The anchor and the last-queried box are reset: RK-C2 and RK-C3.
  - The map is cleared: RK-A1.
  - The view is filled at the kept camera: RK-S2 and E-RK1 (a) and (b).
  - Apply, Clear and the open are as before: RK-A2, RK-C5 and the shell's suite (1609 passed at 2095a7ac; at 480445f9, one `noticeDeterminism` timeout under cargo's lock, then a pass when re-run alone).
  - Outstanding: §4's no-regression e2e series (`open-fills-fit-view`, `colour`, `attributes`, `filter-panel`, `reopen`, `regression`). No report records it. §4 places it "at the final candidate", and ADV-2026-11-16-06 item 2 (d) asks for "one series report for each PR, at the final candidate". See OQ-1.

## 7. The words, clause by clause

**Item 51** (`KNOWN-LIMITATIONS.md`, line 466 at d636c3b6). This is not the human's wording: the item is the advisor's under the delegation, and this sentence is the piece's draft for the advisor. Every clause holds.

| Clause | Where the code does it |
|---|---|
| `If you apply Colour by on a column the map is not already coloured by while the status bar says that attributes were not held,` | App:2146 |
| `the map is cleared` | CAS:1765, :1769 |
| `and, once its first data load completes, filled again for the view it shows;` | CAS:1774, then the Completed terminal plans `shownViewportBbox()` (:1521-1535). A pan during the load plans instead (:1529), and that is still the view shown. |
| `the view does not move,` | WC:1667; the fit runs only with the flag false (:1822) |
| `unless the map was still waiting to move the view to the first features after an open, an Apply, a Clear or any other change of the filter,` | The flag is false only at mount (:1022) and after a plain reset (:1667). Plain resets come from the open (App:1836 → CAS:1770), an Apply or a Clear (App:1127 → CAS:1770; App:1140), a card change (App:2170) and a refused Apply's recovery (App:378). It is set true only at :1588, :1654 and :1823. |
| `and then it moves to the first features that arrive, as it would have.` | WC:1822-1824 |
| `The status bar still says that attributes were not held.` | App:862; the only writer is :2376, which only sets it |

**Item 61** (`KNOWN-LIMITATIONS.md`, line 507 at d636c3b6). The sentence is the human's wording, by its comment (line 508). The changed span is the drafter's, and ADV-2026-11-23-18 items 4 and 5 route it to the advisor. Every clause of `Zoom to layer frames the union of every batch the map has held since the open, or since the last Apply, Clear or other change of the filter, or since Colour by last cleared the map (item 51), and that union is never made smaller.` holds:
- the open and an Apply or a Clear: the resets above clear the anchor (WC:1666);
- a card change: App:2170;
- Colour by: App:2147 → :1803 → CAS:1770 → WC:1666, with no condition;
- the union: WC:1819 (the code is unchanged).

Item 61's third sentence, which omits the card change, goes to the advisor unreworded (Amendment 2 item 5, as Amendment 4 item 1 changes it).

**AC12** (`frontends/shell/MANUAL-WALKTHROUGH.md`, line 1998 at d636c3b6, the third cell). This is not the human's wording: ADV-2026-11-23-18 item 8 has the architect draft it and the advisor approve it. Every clause holds:
- `The map is cleared`: CAS:1765, :1769.
- `and, once its first data load completes, fills again for the view you had;`: CAS:1521-1535.
- `the view does not move.`: in the row's steps, the open's fit (WC:1823) or a saved view (:1654) set the flag before the not-held wait ends.
- `The status bar still says that some features' attributes were not held (KNOWN-LIMITATIONS item 51).`: App:862 and :2376.
- The rest of the cell is instructions.

The attempt-3 gate's point on the second cell is carried to the advisor (Amendment 6 item 6).

**The e2e README entry** (`frontends/shell/e2e/README.md`, lines 912-918 at d636c3b6). These are the worker's words. Every clause holds:
- ``node e2e/colour-refill.mjs [--fixture <path>]``: script lines 40-42.
- ``made by `cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures generate_the_colour_refill_fixture -- --ignored --nocapture` into this checkout's `target/fixtures/manual-walkthrough```: `dir()` (`manual_walkthrough_fixtures.rs`, line 26) and script line 42.
- ``through `window.__SPATIAL_E2E__.openPath```: line 124.
- `waits for the open's first look to plan`: line 127.
- `zooms out by the mouse wheel until the status bar says that attributes were not held`: lines 138-142.
- `pans by pointer`: lines 148-152.
- ``applies Colour by `zone` through the Style tab``: lines 171-175.
- Asserts (a), (b) and (c): lines 178-194.
- `the fixture's sha256, before and after the run`: lines 168, 195-197 and 209.
- The exit codes and the VOID list: lines 201-208, 212-216, 222 and 228-232; the list says "among others".
- `It is operator-run and not in CI or in `npm run verify`.`: no `package.json` or workflow change.
- The "What it proves not" line holds.

None of the four texts is on main (§5, item 9).

## 8. Commits after the reviewer's build gate

- **480445f9.** Six files, +10/−10.
  - Every changed line is comment or doc text but one: the console label at `colour-refill.mjs`, line 144 at d636c3b6 (D-5's fourth pair).
  - Row 893 read that line through `git diff 8329a53c 480445f9 -- <file>` (its check 3).
- **c60660bd.** Code, in `colour-refill.mjs` only, +23/−9. Row 893 read the whole commit.
- **d636c3b6.** Two doc comments only, +2/−2 (the D-F1 report), and no code line.
  - It came after row 893 and needs no read.
  - Lines 81 and 88 at d636c3b6 match row 893's D-F1 New texts, read side by side.

## 9. §7 and the Scope

My count from `<S>/cbr-diff-d636c3b6.txt`, added/deleted per path:

| Path | Added | Deleted |
|---|---|---|
| `KNOWN-LIMITATIONS.md` | 3 | 3 |
| `MANUAL-WALKTHROUGH.md` | 1 | 1 |
| `e2e/README.md` | 10 | 0 |
| `colour-refill.mjs` | 235 | 0 |
| `App.colourRefill.test.tsx` | 247 | 0 |
| `App.tsx` | 7 | 5 |
| `WorkingCanvas.test.ts` | 2 | 1 |
| `WorkingCanvas.tsx` | 9 | 4 |
| `WorkingCanvas.wiring.test.tsx` | 108 | 0 |
| `refillKeepsView.test.ts` | 249 | 0 |
| `candidateArmSession.ts` | 7 | 3 |
| `manual_walkthrough_fixtures.rs` | 46 | 0 |
| **Total** | **924** | **17** |

That is 941 changed lines over 12 paths, the same as the custodian's count. All 12 are §7's eleven plus Amendment 7's file, and nothing is outside Scope. 941 is under the 980 ceiling, so there is no class 8.

## 10. CI

PR 365's checks at d636c3b6: 14 of 14 passing, by the custodian's reading at 2026-11-24T03:09:47Z. I have no shell and did not read them myself.

## Documentation findings, must fix before the merge

Neither text is the human's wording: both are source comments. The worker applies the words below with no re-gate, and the PR body lists them (AUTONOMY §31).

**D-A1.** `KNOWN-LIMITATIONS.md`, line 467 at d636c3b6. The comment attributes the item to the advisor's ruling ADV-2026-11-18-03. The Colour-by sentence and the one after it are now this piece's draft, not yet ruled.

Clause check of the New words:
- §2.6's item 51 draft holds both sentences.
- Amendment 2's D3 changes it.
- ADV-2026-11-23-18 item 5 has the drafts land in the words commit and be ruled from the filed text.

Old:
```text
ruled in ADV-2026-11-18-03 (its pairs P5, P6 and P7 changed three sentences of the item);
```
New:
```text
ruled in ADV-2026-11-18-03 (its pairs P5, P6 and P7 changed three sentences of the item); the sentence that begins "If you apply Colour by on a column" and the sentence after it are the draft in governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md §2.6 as that form's Amendment 2 D3 changes it, landed for the advisor's ruling from the filed text (ADV-2026-11-23-18 item 5);
```

**D-A2.** `KNOWN-LIMITATIONS.md`, line 508 at d636c3b6. It has two problems:
- It calls the whole item "The human's wording", although the span the piece added is not.
- Its code list does not support the added span.

Clause check of the New words:
- The fourth sentence's old text was ` or Clear` (the diff's line 20).
- D4 is Amendment 2 item 4's.
- ADV-2026-11-23-18 item 4 includes the span, and item 5 sets the route.
- A card change: App:2170 → :1127 → CAS:1770 and App:1140.
- Colour by: App:2146-2147 → :1803 → CAS:1770 → WC:1666, with no condition.

Old:
```text
(§A R-61, U14; the number is the next after item 60). Where the code does this, at the base:
```
New:
```text
(§A R-61, U14; the number is the next after item 60). In its fourth sentence the words ", Clear or other change of the filter, or since Colour by last cleared the map (item 51)", in place of the human's " or Clear", are not the human's wording: they are the draft in governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md §2.6 as that form's Amendment 2 D4 changes it, landed for the advisor's ruling under the human's delegation of 2026-11-13 (ADV-2026-11-23-18 items 4 and 5). Where the code does this, at the base:
```
Old:
```text
which depends on the order the kernel returns rows. -->
```
New:
```text
which depends on the order the kernel returns rows. The added words, by symbol at the head of the branch cut/colour-by-refill-keeps-the-view: a card change reaches the same reset as an Apply through applyFilterWith in frontends/shell/src/App.tsx; Colour by, while attributes are not held, reaches resetFitForNewGeneration in frontends/shell/src/canvas/WorkingCanvas.tsx through issueQueryRef and reissueUnrestricted with { keepCamera: true }, which still clears the fit anchor. -->
```

When the advisor rules the words, both "landed for the advisor's ruling" clauses become the ruling's id. That is a words edit for the custodian before the merge.

## Open questions for the advisor

- **OQ-1.** Does "at the final candidate" (§4, the no-regression line) mean the head after main is merged in (§10)? If so, the six-suite series is still due and the merge request waits for it. If it means d636c3b6, the series is missing now, and that would be an Evidence finding.
- **OQ-2.** Is item 61's "The human's wording, approved in …" a verbatim mark under round 10? If it is, D-A2 is never documentation-only and would be a blocking Correctness or Evidence finding. Its remedy is still the words above, with no code change. I class it as Documentation because the comment carries no verbatim mark.

## Notes, not findings

- **N-1.** The races in §3 that only tested parts put together reach (named there).
- **N-2.** Item 51's comment pins code at the branch commit 39d096e9 under its lead "on main". The pins stay resolvable only if the PR merges by a merge commit (row 886 noted the same).
- **N-3.** The series report gives no blob hash for the suite file written over P0.

## The closing amendment must record (references and hashes only)

- Rows 886 and 893, this gate, and the advisor's ruling on the words.
- RF10 at da55b7a6 as class 2 (row 886, D-7).
- ADV-2026-11-23-23 item 2's two deviations.
- The series 2 report: runs 1, 2 and 3 and the three VOIDs (ADV-2026-11-24-01 item 3).
- The `noticeDeterminism` re-run at 480445f9.
- The §7 count: 941 over 12 paths at d636c3b6.
- The no-regression series report at the final candidate.
- The AC12 merge-check result and the main commit it names (Amendment 4 item 1, item 8).
- The CI reading at the final head.
- That the PR body lists N-1 to N-4, D-1 to D-6, D-F1, D-A1 and D-A2.
- The session-log finding filed under ADV-2026-11-24-01 item 6.

## Files read

- `<S>/brief-cbr-arch-1.md`; `<S>/cbr-diff-d636c3b6.txt`, whole.
- In C:/dev/wt/cbr at d636c3b6:
  - `frontends/shell/src/App.tsx`: 275-410, 1100-1149, 1599-1637, 1795-1844, 1940-1999, 2125-2173, and greps;
  - `src/residency/candidateArmSession.ts`: 1290-1589, 1700-1829, and grep;
  - `src/canvas/WorkingCanvas.tsx`: 160-199, 1800-1839, and greps;
  - `src/residency/candidateArmSession.mintWindow.test.ts`: test names;
  - `e2e/lib.mjs` and `e2e/residencyTrace.mjs` (185-226): exports;
  - `kernel/tests/manual_walkthrough_fixtures.rs`: `dir()`;
  - `engine/src/fixture.rs`: `text_for`;
  - `KNOWN-LIMITATIONS.md`: greps.
- In D:/wt/read-1124c at cdfebef1:
  - the form, whole, Amendments 1 to 8;
  - ADV-2026-11-23-18, ADV-2026-11-23-23, ADV-2026-11-24-01, and the ADV-2026-11-16-06 item 2 (d) line;
  - gates rows 886 and 893;
  - the build, commit-5, words-and-suite-fix and D-F1 worker reports;
  - the VOID (first 40 lines), diagnosis and series 2 tester reports;
  - `docs/01_Principles.md`, ADR-010 (rules), ADR-018 (§1-§6), and ADR-028 (Decision, Amendments 2 and 4);
  - main's `KNOWN-LIMITATIONS.md` and `MANUAL-WALKTHROUGH.md`: greps;
  - `state/directives/2026-11-24-*` and the session-log finding: listings.

Model: Claude Opus 5.5 (claude-opus-5-5).
