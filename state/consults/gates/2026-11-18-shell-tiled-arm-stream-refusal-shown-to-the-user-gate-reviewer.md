Reviewed: PR #330 at 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3 (the custodian's filing note, 2026-11-18: the reviewer, PLAN node shell-tiled-arm-stream-refusal-shown-to-the-user, S1, its gate attempt 1 under its form (`governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`), the full form's two gates by ADV-2026-11-16-06; dispatched at 2026-11-18T11:00:40.779Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (12068 bytes, sha256 554a799849a8620e0a6df275bd3b4cb1f32a277a0d84a768b2a466b600b7bf07); the run 2026-11-18T11:00:45.312Z to 2026-11-18T11:26:24.461Z by its transcript, 139 calls (Read 28, Bash 102, Grep 8, SubagentHandback 1), none errored, model claude-opus-5-5; it writes nothing in the repository; received at 2026-11-18T11:26:24.461Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 19595 bytes, sha256 f0bc40ddac9de704ec1b67753f477290c605dab037fb9b346f831c8d470bea9e, with this note added in its first line and one final newline), gate, reviewer
Branch: cut/shell-tiled-arm-stream-refusal-s1 @ 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3
Verdict: FAIL

The gate fails on one Correctness finding, C-1. Everything else checked holds: the counts, the W1 and W2 words, the seam, the §11 items, P-base, all 12 mutations, the light runs and CI. Rulings and the form were read at origin/main. That was ef7fab68 at the start of the gate and 0e4148bf at the end. `git diff --name-only` between the two touches none of the seven paths.

# Findings

## Correctness (blocks)

**C-1. A tile dropped while an Apply's first look is still running leaves the view with no status once the look completes. The scan does end.**

Where:
- `frontends/shell/src/residency/candidateArmSession.ts:1456 at F`. The S1 branch is gated `terminal.kind !== "Completed"`, and nothing else re-emits on the untiled `Completed` terminal.
- `frontends/shell/src/residency/candidateArmSession.ts:1063-1066 at F`. At the drop, `emitResidencyStatus()` reads not-settled because `untiledStreamHandle` is still set, so it emits nothing.

What it contradicts:
- The form's §3 claim, quoted from my own summary of it (a paraphrase): "When the last tracked tile is dropped after a refusal or a failed dataPlaneAttach, the bar settles to an existing sentence and the scan ends."
- ADV-2026-11-16-13 item 1 (byte-copied): "The S1 piece ensures that a tile dropped after a refusal, and a first look whose stream fails, never leave the view without a status, and that the scan ends."
- ADV-2026-11-16-12 item 3 (byte-copied): "no refusal and no failure leaves the view without a status".

Proof: three reverted probes in the refusal test file, run in holds (shown under Mutations, as P1 and P2). Each test does the same steps: open, pan, tile completes; `reissueUnrestricted(null, null)`; pan into tile 0,0 during the reissued look; then one of the cases below; then the look's batch and a `Completed` terminal.

| Probe | Case | Printed after the mark |
|---|---|---|
| G330R-SIB | tile refused twice, `trackedTileCount` 0 | `G330R-SIB {"text":null,"scan":"idle","events":[],"scanEvents":[{"kind":"reset"}]}` |
| G330R-PRE | the tile's stream ends `ProducerFailed` | `G330R-PRE {"text":null,"scan":"idle","events":[],"scanEvents":[{"kind":"reset"}]}` |
| G330R-CTL | the tile completes normally (control) | `G330R-CTL {"text":null,"scan":"idle","events":[],"scanEvents":[{"kind":"reset"}]}` |

So the gap is not specific to a refusal. A `Completed` current first look after a plan never re-emits. In the refusal and failure cases this leaves an unloaded area unreported, which is the case S1 exists to close.

- Reachable in ordinary use: Apply on a file whose first look takes a moment, pan while it loads, and a connection refusal or stream failure on a tile. No dev-only switch or instrumented build is needed.
- The form does not disclose this case. Grepping it for `Completed` gives only §2.2's condition list (:72), §8's overlap note (:273) and §9's W1 clause check (:296).

Fix, for the advisor to place (Part 1 directive item 4: a disclosed unfixed sibling goes back to the worker):
- (a) In the untiled sink's `onTerminal`, when `wasCurrent && !wasSelfCancelled && terminal.kind === "Completed" && hasPlanned && !relinquishedReEmitted`, call `emitResidencyStatus()`. G330R-SIB and G330R-PRE become the tests. This is the `Completed` path, which form §8 gives to `open-first-look-fills-fit-view` ("This piece's branch is non-`Completed` only", form :273). So it needs the advisor's ruling to move the region, or a form amendment.
- (b) Or the advisor narrows S1's claim to drops while no first look is running, and names the case, with these probes, as part of the `open-first-look-fills-fit-view` gate. The §3 claim, the TVSM doc (D-1) and KNOWN-LIMITATIONS (D-2) then say so.

The success case (G330R-CTL: no status after Apply plus a pan) is outside S1's scope. It is for the advisor as a separate finding.

## Evidence (blocks)

None.

## Documentation (must fix before the merge)

**D-1. The TVSM doc claims more than the handler does.** None of these sentences is the human's wording, so the worker applies the replacement words.

`frontends/shell/src/streaming/tileViewportStreamManager.ts:110 at F` reads:
> Its one product caller is `candidateArmSession.ts`, which settles its status and its scan.

The handler does not settle the status when a first look is running (C-1). Replacement:
> Its one product caller is `candidateArmSession.ts`, which re-syncs its scan and, when no tile is still tracked, recomputes its status.

Clause check:
- "re-syncs its scan": `syncScanLiveness();` at candidateArmSession.ts:1064 at F. M-A3 fails SR-A1..A4 and APP-SR2 without it.
- "when no tile is still tracked, recomputes its status": `if (manager.trackedTileCount === 0) emitResidencyStatus();` at :1065. M-A2 fails without it.
- The words claim no settled result, so they hold in the C-1 case.

The test comment at `frontends/shell/src/streaming/tileViewportStreamManager.test.ts:1139 at F` ends:
> so the session can settle its status and its scan.

Replacement:
> so the session can re-sync its scan and recompute its status.

The same clause check applies.

**D-2. Records clause, Amendment 1 item 4: KNOWN-LIMITATIONS.md:192 on main.**

- origin/main 0e4148bf, sha256 ad05f51aa6fabb4c18127c4e5a6d193cd627c65391ab85ca08edf875c38785b0.
- It is the human's wording: its source comment at :193 reads "The human's wording, approved in governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-BEHAVIOURS-AND-GRADED-ITEMS-PREREGISTRATION.md Amendment 2".
- The PR does not touch the file.

Even after this merges, two sentences are not wholly true at F:
- "asked for again once": F adds `!this.overBudgetFlag && // S1 (OPEN-1 (a))` at tileViewportStreamManager.ts:991. Over budget there is no retry (TM-D3, SR-C2).
- "still reported as not loaded, in the words above":
  - Within budget it holds: `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` at residencyStatus.ts:442-443 at F (SR-A1..A4; APP-SR2 at :248).
  - Over budget the status gives the over-budget sentence plus `SETTLED_PARTIAL_SUFFIX` (:422, "the render budget is full"), per SR-C and SR-C2.
  - In the C-1 case nothing is reported.

Replacement words, if C-1 is fixed by (a):
> On `main` (not the v0.1.0 artifact above), the map's own load no longer exhausts the connections that check filters: the engine gives that check four of its own, sized for the map's three tile streams and one untiled query. A tile whose query is still refused for want of a connection is logged and, while it is still in view, the view is within its render budget and the map's tile queue has room, asked for again once. An area whose tile is refused after that retry is reported as not loaded, in the words above; when the view is over its render budget, the status names the render budget instead. The case that can still be refused is item 56's.

If C-1 is placed out by (b), add before the last sentence:
> If that happens while the map is still loading after an Apply, the status can stay empty once loading ends.

Clause check:
- First sentence: unchanged from the human's words.
- "logged": unchanged by this diff (the base pins in :193's comment).
- "still in view", "queue has room": the existing conditions at :993-995 at F (`membership.has(tileKey)`, `this.queue.length < MAX_QUEUED_TILES`).
- "within its render budget": :991 at F. M-C2 fails SR-C2 (:351) and TM-D3 (:1190).
- "not loaded, in the words above": :443 at F.
- "names the render budget": :422 at F, via SR-C and SR-C2.
- (b) sentence: probe G330R-SIB.
- No case needs request-level timing or a dev switch.

Because this is the human's wording, the human answers yes, their own words, or accepted as it stands (AUTONOMY §31).

## Observation

- **O-1.** The form's W1 cite RB-S1 (App.selection.test.tsx:799) opens a different file (b.parquet), not the same path. The clause "Open the file again" still holds: AdmissionPanel.tsx has no same-path guard, and a success calls `onAdmitted` with a new handle.
- **O-2.** The SR-B3 partial-failure sentence is not cleared on the next plan. This is a pre-existing property of the existing sentences, not new here.
- **O-3, departures from worker report 2:**
  - My M-D4 removed `!this.stopped` at the viewport-query site only (:1006), as §4 words it. The worker did both sites. TM-D4 fails either way.
  - My M-B3 was `&& false`, the same as the worker's.
  - Worker report 2's M-A1 list adds SR-A3 and TM-D3. My M-A1 run reproduces SR-A3; TM-D3 does not fail in it (TM-D1 fails twice, at :1164 and :1192, the second being TM-D1's own non-retryable check).
  - My two probe insertions (P1, P2) are my own departure, applied and reverted the same way as a mutation.

# Checks

**1. Start**
- HEAD F; porcelain 0 bytes; ls-remote shows F.
- df: C: 49G and D: 367G free, at 11:01:03 UTC.

**2. Diff**
- 7 files, all in §7. numstat: 251/0, 448/0, 37/1, 18/0, 26/2, 78/0, 10/0.
- Forbidden paths: none. Package and lock files: none.
- Main's change to the seven paths: none. merge-base = B.

**3. §7 counts**
- Product 10+38+28 = 76 of 120.
- Unit 251+448+18+78 = 795 of 1,010.
- Total 871 of 1,130. No overrun, so no class 8.

**4. Words, seam, regions, §11**
- W1 and W2 are byte-equal to the form's fences:
  - W1: 66 bytes, sha256 56e2345297f076ef47aa7e34b515e02d68c43e3c245ecf29f02a9cfadf8fe5de.
  - W2: 60 bytes, sha256 98b65a7300187a5fb99c1c7bfb20edb4bf03c7f24e3c28333e5bf77d657f4f71.
  - Each occurs once in ADV-13.
- W1/W2 clauses hold at F:
  - Frame null means the extent was null, so nothing is drawn.
  - The file can be reopened (no same-path guard).
  - W2's frame survives `reissueUnrestricted`, and a pan's plan clears it at :1542-1545.
- Seam: manager `onTileDropped(tileKey)` → session handler :1063 → `onResidencyStatusChange` → App `setResidencyStatus(... nextResidencyStatus ...)` at App.tsx:1676-1682 at F → `.residency-status` at :2420-2423. APP-SR1 and APP-SR2 start from App with the real `SkpCallError` shape (skp/client.ts:28-33).
- `onTileDropped` carries `tileKey` alone (TVSM.ts:112 at F). Its one product caller is candidateArmSession.ts:1063.
- §8 regions: non-`Completed` only (but see C-1).
- §11 items:
  - (1) App.tsx untouched.
  - (2) The only added string literals are W1 and W2.
  - (3) Nothing outside §7.
  - (4) candidateArmSession.test.ts is not in the diff.
  - (5) No added export.
  - (6) The signature is `(tileKey: string)`.
  - (7) No code or detail is shown to the user.
  - (8) `clearTile` appears only in a comment.
  - (9) `git diff --stat 3b013e58 00bead77` over the test files is empty.
  - (11) The P-base log's mtime (08:29:14) lies between the test commit and the product commit.
  - (12) None.

**5. Tests stand; predicted-fail at 3b013e58**
- P-base `<S>/srf-pbase.txt`: 15 failed and 111 passed.
- Each predicted test fails at its defect assertion. The controls and SR-B-guard pass. TM-D3 fails at :1190 (queuedCount 1 vs 0).
- No doubt, so nothing reproduced and no srf-g330r worktree was made.

**7. Series**

The series report at 00bead77 is reused, with no doubt and no re-run. Each claim rests on a call in that report:
- verify rc 0: 114 files, 1478 tests.
- Five e2e suites rc 0.
- verify, cites and quotes rc 0; node --test 606/606.

**8. Light runs**
- verify-test-claims rc 0: "812 claimed test(s) across 271 file(s)".
- verify.mjs --offline rc 0.

**9. Records**
- Amendment 1 item 4: see D-2.

**10. CI**
- Read Wed Nov 18 11:09:38 UTC 2026; all success.
- Every run's headSha is 00bead77…: 44290367043 DCO, 44290367153 Exposure scan, 43825347042 Ported notices (push), 44290367234 Ported notices, 43825347055 Product CI (push), 44290367030 Product CI.

**11. End**
- HEAD 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3; `<W>` porcelain 0 bytes; no srf-g330r worktree (count 0).
- df at 11:24:05 UTC: C: 49G, D: 367G free.
- The main checkout's porcelain is the same as the start snapshot (two untracked entries that were there before).

# Mutations

Every mutation was applied in `<W>` by one anchored `node -e` (exactly one anchor match). The vitest set was the four §4 files: 126 tests unmutated. Every revert was `git checkout --`, with diff 0 bytes after and sha256 equal to `git show 00bead77:<file>`:
- candidateArmSession.ts acfae5f60054cb990353452b6d895abee50f89cc27d3fc89530f647533a72938
- tileViewportStreamManager.ts c15208bb8df1e49f279e8446b587458519fc469c521815abc62150a5ae2e2803
- residencyStatus.ts b08c1c14a5e1569f189de700eed3e1f73c2e91cf6a7689ff1077ddbaae242d77
- refusal test file 1aa73be034fbd97ad767fd1b046848108caffc30bd50d37f9cc3bb65fb1c0896

The table gives each mutation, its result, the failing tests and the byte-copied assertion lines.

| Id | Change | Result | Failing tests | Assertion lines |
|---|---|---|---|---|
| M-A1 | remove the call at TVSM :1006 | 7 failed / 119 | APP-SR2, SR-A1..A4, TM-D1 (×2) | App :248 `expect(q(".residency-status")?.textContent).toBe(PARTIAL);`; refusal :230, :250, :287 `expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);`; :268 `expect(p.text()).toBe(PARTIAL);`; TVSM.test :1164, :1192 `expect(onTileDropped.mock.calls).toEqual([[key]]);` |
| M-A2 | remove the handler's `emitResidencyStatus` | 5 failed | APP-SR2, SR-A1..A4 | the same lines as M-A1 |
| M-A3 | remove the handler's `syncScanLiveness` | 5 failed | SR-A1..A4, APP-SR2 | App :249 `expect(q(".filter-cancel")).toBeNull();`; refusal :232, :252 `expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });`; :269, :289 `expect(p.scanKind()).toBe("idle");` |
| M-C2 | over-budget guard removed | 2 failed | SR-C2, TM-D3 | refusal :351 `expect(p.session.manager.trackedTileCount).toBe(0);`; TVSM.test :1190 `expect(manager.queuedCount).toBe(0);` |
| M-B2a | | 4 failed | APP-SR1, SR-B2-open ×2, SR-B2-apply | App :218 `expect(q(".residency-status")?.textContent).toBe(W1);`; refusal :368 `expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-first-look-failed", frame: false });`; :390 the same with `frame: true` |
| M-B2b | `frame: true` | 3 failed | SR-B2-open ×2, APP-SR1 | App :218; refusal :368 |
| M-B2c | | 1 failed | SR-B2-apply | refusal :397 `expect(p.statusEvents.slice(panMark.s)[0]).toEqual({ kind: "candidate-fill-progress" });` |
| M-B3 | :1459 `} else if (manager.gridFrame !== null && untiledRowsSeen > 0) {` → `... && untiledRowsSeen > 0 && false) {` | 1 failed / 125 | "SR-B3: a first look failing after rows, before any plan: the failure sentence, and the scan ends" | refusal :410 `expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "partial-failure" });` — "AssertionError: expected { …(2) } to deeply equal { …(3) }" |
| M-BG | :1456 `if (wasCurrent && !wasSelfCancelled && ...` → `if (!wasSelfCancelled && ...` | 1 failed / 125 | "SR-B-guard: a self-cancelled, a session-ended and a superseded first-look terminal each emit no candidate-first-look-failed" | refusal :446 `expect(failedAfter(c, cMark.s)).toEqual([]);` — "AssertionError: expected [ { …(2) } ] to deeply equal []" |
| M-D2 | remove `if (!this.stopped) this.opts.onTileDropped?.(tileKey);` at TVSM :1035 (dataPlaneAttach site) | 1 failed / 125 | "TM-D2: a dataPlaneAttach failure drops the tile and calls onTileDropped once" | TVSM.test :1180 `expect(onTileDropped.mock.calls).toEqual([[key]]);` — "AssertionError: expected [] to deeply equal [ [ '0:0' ] ]" |
| M-D4 | TVSM :1006 `if (!this.stopped) this.opts.onTileDropped?.(tileKey);` → `this.opts.onTileDropped?.(tileKey);` | 1 failed / 125 | "TM-D4: control: a stale-epoch refusal and a stopped manager's refusal call no onTileDropped" | TVSM.test :1212 `expect(stopped.onTileDropped).not.toHaveBeenCalled();` — "AssertionError: expected "vi.fn()" to not be called at all, but actually been called 1 times" |
| M-RS | residencyStatus.ts :503 `return status.frame ? FIRST_LOOK_FAILED_TEXT : FIRST_LOOK_FAILED_NO_FRAME_TEXT;` → swapped | 5 failed / 121 | RS-F1 "reduces to its status; reads W1 without a frame and W2 with one; query-issued and candidate-fill-progress each clear it", APP-SR1, SR-B2-open (ProducerFailed), SR-B2-open (TransportFailed), SR-B2-apply | residencyStatus.test :593 `expect(residencyStatusText(status!)).toBe(frame ? W2 : W1);`; App :218 `expect(q(".residency-status")?.textContent).toBe(W1);`; refusal :369 `expect(p.text()).toBe(W1);`; :391 `expect(p.text()).toBe(W2);` |
| P1 (probe) | G330R-SIB and G330R-PRE inserted before the `case C` describe; refusal file only, verbose | 2 failed / 12 | the two probes | :334 and :354 `expect(p.text()).not.toBeNull();` — "AssertionError: expected null not to be null" |
| P2 (probe) | G330R-CTL inserted the same way | 1 failed / 12 | the probe | :331 `expect(p.text()).not.toBeNull();` |

Every vitest exit 1 in this table is an expected failure under a mutation or probe. The diffs are in `<S>/g330r-<id>-diff.txt` and `<S>/g330r-probe-diff.txt`, `<S>/g330r-probe2-diff.txt`.

# Holds

Every hold is `hold shared -Project SpatialIDE`, one per run. The hold and release lines read `MACHINE_HOLD shared project=<m> ... also=<m>` and `MACHINE_RELEASED project=<m> ...`. There was no exit 96 to 99 and no refusal. Start and end times are `date -u`, UTC.

| Hold | Start | End | Note |
|---|---|---|---|
| mA1 | 11:10:15 | 11:10:39 | one MACHINE_WAITING line, masked `<m>` |
| mA2 | 11:11:16 | 11:11:33 | |
| mA3 | 11:12:02 | 11:12:29 | one MACHINE_WAITING line, masked `<m>` |
| mC2 | 11:13:01 | 11:13:17 | |
| mB2a | 11:13:42 | 11:13:58 | |
| mB2b | 11:14:29 | 11:14:44 | |
| mB2c | 11:15:14 | 11:15:31 | |
| mB3 | 11:15:58 | 11:16:15 | |
| mBG | 11:16:42 | 11:16:58 | |
| mD2 | 11:17:34 | 11:17:50 | |
| mD4 | 11:18:18 | 11:18:37 | |
| mRS | 11:19:24 | 11:19:56 | |
| probe | 11:21:03 | 11:21:16 | |
| probe2 | 11:22:59 | 11:23:15 | |

# Drafts for the advisor

1. **C-1's closure.** Either (a) the worker adds the current-`Completed`-after-plan `emitResidencyStatus()` in the untiled `onTerminal`, with G330R-SIB and G330R-PRE as its tests, and the advisor rules on the §8 region (the `Completed` path is given to `open-first-look-fills-fit-view`). Or (b) S1's §3 claim is narrowed to drops while no first look runs, by a form amendment, and the case is named in `open-first-look-fills-fit-view`'s gate with these probes. My recommendation is (a): the fix is one guarded call, and ADV-13 item 1's sentence is otherwise not met.
2. **The success-path gap (G330R-CTL).** After an Apply plus a pan during its first look, a fully successful load ends with no status. This is pre-existing and outside S1, and is a candidate item for the open-first-look node or for KNOWN-LIMITATIONS.
3. **KNOWN-LIMITATIONS.md:192.** The human's wording needs the D-2 words, or the human's own, before Amendment 1 item 4's records step can pass. The variant depends on draft 1.
4. **The RB-S1 cite (O-1).** It tests a different file. A same-path reopen test would match W1's words exactly; this is optional.

Background shells left: none. Every background hold run sent its completion notice before I went on, and I started no other process.

Model: Opus 5.5 (claude-opus-5-5).

Scratch files (all in `<S>`, prefix g330r-): the hold files `g330r-hold-<id>.txt`, logs `g330r-<id>.log`, diffs `g330r-<id>-diff.txt`, revert diffs `g330r-<id>-rev.txt` (all 0 bytes), plus `g330r-cas-F.ts`, `g330r-tvsm-F.ts`, `g330r-tvsmt-F.ts`, `g330r-rs-F.ts`, `g330r-kl-om.md`, `g330r-form.md`, `g330r-maindrift.txt`, `g330r-end-*.txt`.
