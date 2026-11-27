Reviewed: main at 0f2078423378fb3f35346a6db9be5833ba0569b9, the Console form `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` as committed, in the detached read checkout C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate, attempt 1, node:console-stream-lane-limitation-67@form-gate-architect-1, dispatched at 2026-11-22T17:25:05.486Z; its run: Read 45, Glob 5, Grep 24, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T17:25:08Z to 2026-11-22T17:39:52Z by its transcript; no call named the main checkout. Filed below the rule from its hand-back, 22458 bytes, sha256 19296a4d5543007754e4985a09bd5ff124533bcb62d2129dea8945767c81df11, byte for byte except that the one scratch-folder path in its list of files read is written as <S>, and with one final newline added. FAIL. Its words for C1, E1 and D1 to D7 go into the form's Amendment 1 with the architect's two additions, then attempt 2 on it alone, by ADV-2026-11-22-28 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-28-the-console-form-after-its-gate-amendment-1-then-attempt-2-the-five-open-items-as-recommended-the-stop-accounted-for-now.md`).)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1122 @ 0f2078423378fb3f35346a6db9be5833ba0569b9
REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-form-gate-architect.md

Tag `node:console-stream-lane-limitation-67@form-gate-architect-1`. Branch main (detached read worktree). Form: `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` at 0f207842. I read everything only and ran nothing. Code cites are at 0f207842. The form is append-only, so every fix below goes into a §13 amendment, with the old text named as superseded. None of the sentences below is the human's wording. All of them are architect drafts or advisor rulings under the delegation.

The verdict blocks on one Correctness finding and one Evidence finding. Everything else is Documentation: each item must be fixed before the merge, and none needs a re-gate.

---

## Correctness

**C1. §2.3 item 7, GROUP's capacity check, does not meet its ruled meaning (ADV-2026-11-22-26 item 1).**

The ruled meaning is that no row GROUP' reads that was recorded since its baseline can have been evicted. GROUP' reads every row in its style window, which runs from the first `style.set` `record_step` row to the last (`frontends/shell/e2e/console.mjs:701-706`, `:737-738`). That window can hold stream rows as well as other-kind rows.

The check has two branches:
- **Branch 1, R ≤ M.** This is sound for both rings. R is the label's total (count plus dropped, `console.mjs:247`), so R ≤ M means at most M entries of any kind came since the baseline.
- **Branch 2, ΔO ≤ N_base − M.** This protects only the other ring. Suppose more stream entries than the stream ring held at the baseline arrive after the baseline, for example from a late load. Branch 2 still passes, yet a stream separator inside the window has been evicted. The style rows on either side of it then join into one group (VL3), and "grouping exercised" can pass because of the eviction rather than because of real grouping. That is §8 item 8 ("GROUP' … deciding on rows a ring may have dropped").

The arithmetic for the fix is symmetric. The other ring holds at most M, so the stream ring also held at least N_base − M at the baseline.

The fix (test code, in Scope; M-G1 still fails it, because ΔO > N_base − M):

```text
     - **The check:** let R = label total − baseline total, and ΔO = the other kind's drops since the baseline. The check passes when R ≤ M (at most M entries of any kind came since the baseline, so the other ring still holds every one of them). It also passes when ΔO ≤ N_base − M: the other ring held at least N_base − M at the baseline, because the stream ring holds at most M, and it evicts oldest first.
```
```text
     - **The check:** let R = label total − baseline total, ΔO and ΔS = the other and the stream kind's drops since the baseline, and N_base = the held count at the baseline. The check passes when R ≤ M (at most M entries of any kind came since the baseline, so each ring still holds every entry of its own kind recorded since). It also passes when ΔO ≤ N_base − M and ΔS ≤ N_base − M: each ring held at least N_base − M at the baseline, because the other ring holds at most M, and each evicts its own oldest first.
```
```text
     - **Failure:** otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and <ΔO> entries of the other kind were dropped, more than the <N0 - M> the other ring held at least`.
```
```text
     - **Failure:** otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and the drops since then, <ΔS> of the stream kind and <ΔO> of the other, are not both within the <N0 - M> each ring held at least`.
```
```text
the check passes when R ≤ 128, or when the other kind's entries since the baseline number at most N_base − 128.
```
```text
the check passes when R ≤ 128, or when the other kind's entries since the baseline and the stream kind's drops since then each number at most N_base − 128.
```

W1 changes with the fix (see D1).

---

## Evidence

**E1. §4, M-CB3: the stated condition and its source are wrong, and the form does not yet show that the mutation fails every time (ADV-2026-11-22-26 item 2).**

My ruling: M-CB3 has no known pass case, so it may stay listed. It does rest on a reading that the build can check, and the form must state that reading correctly.

What is wrong now:
- **The cited source does not address the order.** Amendment 5 item 3 (i) of the first-look form is about the mark being read before `sendCondition` and about the step queue's own order. It says nothing about when a `record_step` is recorded relative to a tile request.
- **The stated condition is too strong.** Under M-CB3, in the ordinary state, L = min(M, ΔS). The last L rendered entries then leave out the oldest a′ entries recorded after R0, where a′ is the true number of other-kind entries recorded after R0. Write p_s for the held stream entries recorded after R0 and before card B's `record_step`, and f_o for the other-kind entries recorded after that `record_step`. The `record_step` is left out, and so F4 with n = 0 fires, exactly when p_s ≤ f_o. "Before its load's first tile request" is neither necessary nor the right test.
- **The claim "the last L entries are card B's load and R1's clicks" is inexact**, for the same reason.

What the code gives at 0f207842 (by reading):
- The step is enqueued only after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`, `:1072`).
- When no step is in flight, the same call sends and records it (`frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`).
- Tiles are asked for only at that look's Completed terminal (`KNOWN-LIMITATIONS.md` item 67's comment).

So only the untiled request comes before the `record_step`. That request is dropped once card B's load adds more than M stream entries; the filed run recorded 228 entries between R0 and R1 (first-look form, Amendment 6 item 4). In the ordinary state, therefore, p_s = 0.

```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a = N₁ − N₀ (0 in the ordinary state), and L = min(M, ΔS). The last L entries are card B's load and R1's clicks. Card B's `record_step`, recorded before its load's tile requests, is not among them. Set {F4 with n = 0}. Whether the `record_step` is recorded before the load's first tile request is by reading only (Amendment 5 item 3 (i) of the first-look form); if it is not, a pass is a finding.
```
```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a reads N₁ − N₀ (0 in the ordinary state, both rings full), and L = min(M, ΔS). The entries rendered after R0 are the stream entries still held and every other-kind entry recorded after R0, so the last L leave out the oldest of them, as many as there are other-kind entries. Card B's `record_step` is left out, and the set holds, when the held stream entries recorded after R0 and before it number no more than the other-kind entries recorded after it (R1's clicks among them); in the ordinary state, where card B's load adds more than M stream entries, that holds when the `record_step` is recorded before the oldest stream entry still held. By reading at 0f2078423378: the step is enqueued after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`, `:1072`) and recorded in the same call when no step is in flight (`frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`), and tiles are asked for only at that look's Completed terminal (`KNOWN-LIMITATIONS.md` item 67's comment). Set {F4 with n = 0}. The build checks the reading: the unmutated E-AND run records, from its final reading, ΔS, a and the number of held stream entries recorded after R0 and before card B's `record_step`; if that number is above 0, M-CB3 is not run as evidence and goes to the advisor as a possible pass case (ADV-2026-11-22-26 item 2); a pass of a run made is a finding.
```

The unmutated run's new record is test output in `command-bar.mjs`, which is in Scope.

---

## Documentation (all must be fixed before the merge)

**D1. §2.4 W1: two problems.**
- The quoted clause spans the line break between `frontends/shell/e2e/README.md:279` and `:280`, so it is not byte-identical: the source has an LF where the quote has a space.
- The edit as drafted rewrites lines 279 and 280. ADV-2026-11-22-24 item 2 allows one line.

The replacement below keeps line 279 as it is and carries C1's check:

```text
- **W1, `e2e/README.md:280`.** The clause "the label's total may grow by at most the recorder's 256 so none of its own rows can have been evicted" becomes "the label must show that none of its own rows can have been evicted: its total grew by at most one ring's 128, or the entries of the other kind dropped since the baseline are at most its held count then less 128".
```
```text
- **W1, `e2e/README.md:280`, that line only** (line 279, which ends "and the label's total may grow", is kept). On line 280, "by at most the recorder's 256 so none of its own rows can have been evicted." becomes "by at most one ring's 128, or else each kind's drops since the baseline must be at most the baseline's held count less 128, so none of its own rows can have been evicted."
```

Clause check against C1's check:
- "may grow by at most one ring's 128" is R ≤ M.
- "each kind's drops since the baseline must be at most the baseline's held count less 128" is ΔO ≤ N_base − M and ΔS ≤ N_base − M.
- "so none of its own rows can have been evicted" is the ruled meaning: each ring held at least N_base − M.

W2 and W3 hold as drafted. I checked them against `reopen.mjs:155`, `:169`, `:175`, `:277`, `:158-166` and `:171-180`, and against `README.md:896` and `reopen.mjs:15`.

**D2. §4, M-CB2's drop sentence leaves out a condition.**
- Under the swap, the S₀ = 0 test reads O₀. If O₀ = 0 at R0, the swapped E-AND gives F7 and so does show the swap. "The other ring full at R0" does not imply O₀ > 0.
- The rest of the arithmetic checks out. With ΔS and ΔO both ≤ 128 = N₀ − M, the swapped L is ΔS + min(M, ΔO), which equals the true L of ΔO + min(M, ΔS), and step 4 passes either way.
- Outside that state, ΔS > 128 under the swap gives F2′. That is consistent with dropping M-CB2.
- VL2 under M-11 fails every time: it is a fixed snapshot in a deterministic unit test.

```text
No mutation of E-AND shows a swap of the label's two drop counts, because with the other ring full at R0 and at most 128 entries of each kind dropped between R0 and R1, §2.5's arithmetic gives the same L and the same decision whichever count is which; the label's order is covered by VL2 under M-11, whose fixed snapshot fails under the swap every time.
```
```text
No mutation of E-AND shows a swap of the label's two drop counts when both counts are above 0 at R0, the other ring is full there and at most 128 entries of each kind are dropped between R0 and R1, because §2.5's arithmetic then gives the same L and the same decision whichever count is which; the label's order is covered by VL2 under M-11, whose fixed snapshot fails under the swap every time.
```

**D3. §2.5: the discard rule and step 6 leave two cases open.**
- As written, a discarded reading could still click headers or count as final.
- If no reading is ever final, step 6 gives F4 "added 0", which states a count the suite could not tell. It still fails, so ADV-2026-11-22-20 item 1 holds, but under the wrong name.

```text
A pass that clicks nothing is final. Readings are two frames apart, bounded to 30 s. A reading is discarded unless the rendered entries, counting each closed group's ×N, sum to N₁.
```
```text
A reading is discarded, clicks nothing and is not final unless the rendered entries, counting each closed group's ×N, sum to N₁. A reading kept that clicks nothing is final. Readings are two frames apart, bounded to 30 s.
```
```text
6. If no final reading has its newest added row past `pending` within 30 s: F4 when added is empty (n = 0), else F3′.
```
```text
6. If no reading is final within 30 s: F3′. If final readings come but none has its newest added row past `pending` within 30 s: F4 when added is empty (n = 0), else F3′.
```

**D4. §2.5, R1: the form does not say that it moves the readings' start.**
- R1 now starts after card B's map settles. The advisor had moved the start to run during the load (first-look form, Amendment 5 items 3 (b) and 12, ADV-2026-11-19-09).
- The later start is sound under two rings: only ΔO matters, and a load adds no other-kind entry. The form should say so.

```text
**R1, the readings after card B's map settles** (`:484-487`). Each is one `page.evaluate` that:
```
```text
**R1, the readings after card B's map settles** (`:484-487`). This supersedes the start during the load (first-look form, Amendment 5 items 3 (b) and 12; ADV-2026-11-19-09): under two rings a load evicts no other-kind entry, so the decision needs only ΔO ≤ N₀ − M. Each is one `page.evaluate` that:
```

**D5. Statements in the fourteen files that become untrue are not all named (§8 item 11).**
- `recorder.ts:296-299` (`entries()`): "only the oldest ever leaves" is untrue under two rings.
- The docs of `push` (`recorder.ts:273-281`) and `droppedCount` (`:290-291`) describe one buffer and one counter.
- `collapsedCountSync.ts:8` says "(two numbers)"; it becomes three.
- `console.mjs:67-68` says "ring size", and `:241` gives the old label form.
- `console.mjs:829`: GROUP's PASS text "R=${R} <= ${MAX_CONSOLE_ENTRIES}" would be untrue on a branch-2 pass.

```text
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140, including :135-136, is rewritten.
```
```text
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140, including :135-136, is rewritten, and so are the docs of `push` (:273-281), `droppedCount` (:290-291) and `entries` (:296-299, whose "only the oldest ever leaves" is untrue under two rings). In `collapsedCountSync.ts`, "(two numbers)" (:8) becomes three. In `console.mjs`, the mirror's comment (:67-68) names each ring's size, `readConsoleLabel`'s doc (:241) follows L1, and GROUP's PASS text (:829) names the branch of the check that passed, with R, ΔS and ΔO.
```

**D6. §2.5: the byte-copied meaning has no reference in round 12 (b)'s form.**
- The copy itself matches `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md` line 12, a sub-line span, byte for byte.
- The hash given is the sha256 of the whole paste file, not of the cited line.
- I have no Bash, so the custodian's script computes the line hash and the reviewer recomputes it.

```text
**Its meaning.** The advisor's words, byte-copied from the ADV-2026-11-22-20 copy (sha256 d4c8856351288b6250ebee06a6e4b1e6e2f8a1b949dee9849cbbcf7477b83d8c), marked so:
```
```text
**Its meaning.** The advisor's words, byte-copied by script, marked so, a sub-line span carrying its line's hash (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md:12 @ 0f2078423378fb3f35346a6db9be5833ba0569b9 sha256:<line 12's hash, by the custodian's script>`):
```

**D7. §0.1 and §0.4: two draft sentences no longer match the committed form.**
- §0.1 still says the rulings are not on main, but the directives are on main at 0f207842.
- §0.4 points to the marker "pin: hash by the custodian", which the custodian replaced with pins at commit.

```text
None is on main yet. Each is filed under `state/directives/` before this form is committed, and §0.1 then names its path.
```
```text
Each was filed under `state/directives/` before this form was committed; the custodian's header line names each path.
```
```text
Ranges are reading aids, not pins, except where marked "pin: hash by the custodian".
```
```text
Ranges are reading aids, not pins, except the two pinned references of §0.2 and §2.1.
```

---

## What holds (checked)

**Cites.** Every §2.1 cite holds at 0f207842: `recorder.ts`, `client.ts`, `log.ts`, `dialog.ts`, `collapsedCountSync.ts`, `ConsolePanel.tsx`, `consoleViewModel.ts`, `surfaceRegistry.ts`, the slot cites in `AdmissionPanel.tsx` and `App.tsx`, `isInstrumentedBuild.ts`, and the readers in `console.mjs`, `command-bar.mjs` and `reopen.mjs`. So do the cites into `tauri.conf.json`, `layout.mjs` and `README.md`.

**The two pins** are the lines the form means:
- `KNOWN-LIMITATIONS.md:525-527` is item 67 whole: the bold line, the paragraph and the comment.
- `ConsolePanel.tsx:64-68` is the label's expression.

Both are at a commit on main and written on one line. §0.4 names the dispatch tree as authoritative, so no pin is read as current.

**Quotations** are byte-identical except W1 (D1): §0.1 "E-AND as drafted", §2.1's recorder doc, §2.5's meaning, W2, W3, `reopen.mjs:158`, and K3's "Not examined…". There is no line cite into the ledger and no bare self-line.

**Arithmetic** checks out:
- E-AND's L and a, exact when S₀ > 0, and its ordinary-state bound: a ≤ 128 when card B's own other-kind entries and their groups come to at most 62.
- GROUP' branch 1, and M-G1: R ≥ 200 > M, and ΔO > N_base − M.
- M-CB1: ΔO = max(0, N₀ − M + a − M) > N₀ − M because a > M. Its set is {F2′}, given S₀ > 0.
- The unit tests CL1 to CL5, VL1 to VL3, CC1 and CC2, with their figures at M = 128 and their reasons for being red at the base (M is imported, so it is 256 there).
- The estimate sums to 676, within the ceiling of 850.

**Rulings.**
- ADV-2026-11-22-20 item 1, case by case. F1, F6 and F7 fail by name where the suite cannot read or cannot split. F2′ fails exactly when a row card B added may be gone. F4 and F3′ fail by name. PASS needs exactly one `filter:`+`ZONE_AB` row at ok among the entries recorded after R0. No case passes where the suite cannot tell (D3 is only about names).
- ADV-2026-11-22-24 item 1's ordinary-state sentence is met by the bound in §2.5.
- S11 matches ADV-2026-11-22-26 item 3.
- Scope: fourteen files, the ceiling of 850, and three-dot counting, against ADV-2026-11-22-20 item 1, ADV-2026-11-22-22 item 3 and ADV-2026-11-22-24 item 2. The one exception is W1's line count (D1).
- §12's closed items match their rulings.
- The unit mutations M-1 to M-11 are deterministic, so none has a known pass case.
- L1, K1, K2, K3's requirements, R1 and R2 are true by clause against the code at 0f207842.

**Constitution.**
- docs/01: principle 4 (nothing synthesised), principle 7 and "Never block the canvas" (push is bounded and synchronous, and the drawer still renders at most 256).
- docs/02: the Console code stays in `console/`.
- docs/10: no wire change.
- ADR-024: the lane is chosen by kind and name only.
- ADR-006: no undo claim.
- ADR-010 rule 6: the ceiling is declared.

**Caller and seam rules.**
- `isStreamLaneName` is called by `push`, and `consoleLabelText` by `ConsolePanel`.
- The four seams are tested against the real shapes: SR1 and CL5 against the real registry and recorder, CC2 against a real recorder, VL1, VL2 and LABEL' against the label, and the label against the e2e readers.

**Round 25.** All of its rows are in §8 item 12. The five-line-form row does not apply.

## Notes (not findings)

1. **§12: unruled items.** OPEN-2, -3, -4, -7 and -8 carry recommendations but no ruling. They need the advisor's word before the build is dispatched.
2. **P5 and S7: a foreseeable stop.** `close_dataset` is sent from a workspace effect (`App.tsx:1645-1647`). If that row is recorded after P0, a run shows other-added = 1 and stops under S7, even though the row belongs to the open, not the load.
3. **GROUP's unmutated pass is not bounded.** It now needs R ≤ 128, and every poll's `expandAllGroups` clicks each closed group, up to 64 stream groups and more. The form predicts a pass but gives no bound like E-AND's.
4. **The 200 clicks of M-G1 and M-CB1.** As separate Playwright clicks they press on GROUP's 45 s step bound. A single `page.evaluate` loop of `.click()` is safer.
5. **Suites not run.** `colour.mjs` and `selection.mjs` read Console rows and are not in §9.3. They read only other-kind rows, so two rings are no risk to them.
6. **Docs lane.** `reopen.mjs:16`, "the ring's label", is outside W3's one line.

## Files read

- `<S>/brief-console-form-gate-1-final.md`
- In `C:/dev/wt/read-1122`:
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`
  - `state/consults/2026-11-22-console-stream-lane-full-form-architect-draft-5.md`
  - the directives of ADV-2026-11-22-17, -20, -22, -24 and -26, ADV-2026-11-21-15, ADV-2026-11-21-08, ADV-2026-11-19-08 and ADV-2026-11-19-16 under `state/directives/`
  - `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md`, Amendments 5 and 6
  - `KNOWN-LIMITATIONS.md` items 66 to 68
  - `frontends/shell/src/console/recorder.ts`, `ConsolePanel.tsx`, `collapsedCountSync.ts`, `consoleViewModel.ts:155-190`, `surfaceRegistry.ts:20-145`, `recorder.test.ts:70-119`, and `surfaceCompleteness.test.ts:175-196`
  - `frontends/shell/src/skp/client.ts:50-147`, `frontends/shell/src/workspace/stepRecorder.ts:30-79`, `frontends/shell/src/App.tsx` (lines 892-905, 1040-1162, 1450-1464, and grep hits), `frontends/shell/src/admission/AdmissionPanel.tsx:290-459`, and `frontends/shell/src/isInstrumentedBuild.ts`
  - `frontends/shell/e2e/console.mjs` (lines 20-385, 690-759 and 1000-1061), `command-bar.mjs:340-498`, `reopen.mjs` (lines 1-30 and 134-283), `colour.mjs:318-361`, `selection.mjs:640-689`, `layout.mjs:243-278`, and `README.md` (lines 274-281, 760-762 and 888-896)
  - `frontends/shell/src-tauri/tauri.conf.json:12-21`
  - `docs/01_Principles.md:1-24`
  - `docs/adr/ADR-010-render-frames-origins-boundaries.md` (grep)
  - `site/index.html` (grep)
