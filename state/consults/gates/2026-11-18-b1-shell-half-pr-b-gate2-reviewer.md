Reviewed: PR #327 at bdf918e1dcf7669a52e583131d645ef748c8855d (the custodian's filing note, 2026-11-18: the reviewer, PLAN node b1-shell-half, milestone 4's PR B, gate 2 attempt 2 at the corrected head, whole since H1 with its mutations re-applied, by the advisor's ruling ADV-2026-11-18-04 item 1, under its form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, Amendments 24 to 27, and Amendment 28's text not yet filed); dispatched at 2026-11-18T11:29:06.500Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (14396 bytes, sha256 d875c80b3f217a09ef1974e4ac52979c75559d22d1df986e28693ca750327be0); the run 2026-11-18T11:29:11.696Z to 2026-11-18T12:09:24.028Z by its transcript, 117 calls (Bash 87, Read 28, Grep 1, SubagentHandback 1), 2 errored, model claude-opus-5-5; its mutation runs are in its Bash calls; it writes nothing in the tree; received at 2026-11-18T12:09:24.028Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 27725 bytes, sha256 71306ac9a2ebced228e7b5e0ba01bd508b6b1f270784c60560abd208007e8927, with this note added in its first line and one final newline), gate 2, reviewer, attempt 2
Verdict: PASS WITH NOTES

Branch: `cut/b1-shell-half-pr-b` @ bdf918e1dcf7669a52e583131d645ef748c8855d (H2). The base is B = 0372c5a304ae38213d2ee9f2cf0799b143339a77; main = 0e4148bfcb2462165eb8f6eecb8646ddbae16c41.

Under AUTONOMY §22, Correctness and Evidence have no open finding. C-1 is closed. Every recorded mutation failed its test; the eight mutations the brief's list left out and my one probe failed too, and every revert was clean. CI at H2 is green, and the four light runs exit 0. Documentation has D-1 to D-5, each must-fix before the merge. None of them is the human's wording, so none needs a re-gate.

## Findings

### Correctness
None.
- **C-1 is closed** (`frontends/shell/src/style/StylePanel.tsx` at H2).
  - :111 `if (ended && waitRef.current === null) setLine(null);` clears the line on every end of a match while no wait runs.
  - :229 `if (waitRef.current === null) setLine(null);` does the same for One colour.

### Evidence
None.
- Check 5 ran 30 recorded mutations, the 8 recorded ones the brief's list did not name, Amendment 28's (i) to (iii), and one probe of mine. All failed, and every revert left the diff empty and the sha256 equal to H2's.
- CI: all 15 checks pass, every run at head H2.

### Documentation (each must-fix before the merge; none is the human's wording)

**D-1. Amendment 28, its first sentence** (the worker's draft `<S>/s327e-amendment-28.md`, unfiled).
- The sentence reads: "A second Colour by waits when a match stands, Apply is clicked again, and the first scope is not held complete under the view's filter."
- That condition is wrong in two ways:
  - A **stopped** result under the same filter, and a completed one at the row limit, are reused with no wait (categoryCases.ts:59 at H2). Yet `resultIsComplete` (tableSource.ts:54-56 at H2) calls exactly those results not complete.
  - A source that has ended starts nothing (tableSource.ts:120 at H2), so `check()` settles at once as `ended`.
- Replacement words are under Drafts, B.

**D-2. Amendment 28, the outcome bullet.**
- The bullet reads: "on rows, the match is applied over the style as it then is, … and the line names the column and its counts."
- Rows are not enough. When the filter changed (StylePanel.tsx:207 at H2), or the rows hold no value of the column (:209), nothing is applied.
- Replacement words are under Drafts, C.

**D-3. StylePanel.tsx:105-106 at H2, the comment above the effect** (ADV-08 item 3 leaves this to the gates; my judgment is that it should say there is no product caller).
- Its first sentence, "A match ended other than by the panel clears the Colour by line", is left over from the ref-flag version. The effect now clears the line on every end, the panel's own included.
- It names the same-key case without saying that the case has no product caller:
  - App keys the slot by `admitted.dataset` (App.tsx:2505 at H2).
  - `dataset` is the kernel's `DatasetHandle::mint()` (kernel/src/skp.rs:1120 at H2), 16 CSPRNG bytes (protocol/skp/src/v0/handles.rs:19-21 at H2).
  - The only dispatch of `resource.admitted` is App.tsx:1186 at H2, inside `handleAdmitted`, whose only caller is AdmissionPanel.tsx:263.
- Replacement words are under Drafts, D.

**D-4. §7's class 8 rows at the final head** (check 3).
- (a) `frontends/shell/src/workspace/workspaceState.test.ts` is **19 of 4** and is recorded nowhere: not in Amendment 15, Amendment 18, the closing-rows draft or the architect's D-4.
  - Its ceiling is the session-end draft's B-T row (`workspaceState.test.ts` 4), carried by Amendment 12 item 13.
  - It was 2 (1 + 1) at H1. PB-U14 (fb9a825a) added the rest. Amendment 25 item 5 declares the file but no lines.
  - Fix: one class 8 row in the closing amendment, counted by §7's command.
- (b) The closing-rows draft's row 3 reads 259. At H2 it is `StylePanel.test.tsx` 316 + `Legend.test.tsx` 58 = **374 of 250**. The draft says it will be read again; the closing amendment must carry 374.

**D-5. Recorded mutations that fail tests their comments do not list** (the same class as the first attempt's D4/D5).
- m01 (PB-R2, `App.colour.test.tsx:211-215` at H2) also fails **PB-R5**.
- m19 (PB-U8, StylePanel.test.tsx:111) also fails PB-U13, PB-U15, PB-U16 and PB-U17.
- m20 (PB-R3, :128) also fails PB-U13 and PB-U17.
- m23 (PB-U9 (v), categoryCases.test.ts:125) also fails PB-U9 (vi).
- m22's comment lists all three failures it produces.
- Fix, under the record cap: one line in the closing amendment that names these extra failures by reference to this report's check 5. No comment edit is needed.

### Observation
- **O-1.** Two comments still name 895d1142: item 4's On-main comment (KNOWN-LIMITATIONS.md:81 at H2) and item 59's (KNOWN-LIMITATIONS.md:500 at H2).
  - Each names `applyColourBy`, `fillColorValue` and `toStyleDocument`. All three are present and do what is said at 895d1142 (an ancestor of H2) and at H2 (StylePanel.tsx:210; document.ts:141, :162).
  - They are not untrue at H2. ADV-03 item 10 covers items 51, 54, 56, 65 and 66, not 4 or 59.
- **O-2.** One colour during a wait is followed by the wait applying its match (:210). This is as ADV-08 item 1 rules, so it is not a finding.
- **O-3.** An open ends Colour by with no step recorded (App.tsx:1167-1169; workspaceState.ts:155 at H2). The session record's last style step can still hold the match. Nothing restores from the record yet (item 4's On-main paragraph says so), so an operator meets no consequence today.
- **O-4.** PB-U16 (b) (ADV-08 item 4).
  - My probe `probe-ib`, the flag put back in Reset alone, fails PB-U16 at (b) and PB-U17 at (a). So (b) can fail on its own.
  - Recorded mutation (i) fails PB-U16 only at (a), as Amendment 28 says. That satisfies one mutation per test (Part 1).
  - My judgment: (b) does not need its own recorded mutation. The closing amendment may cite this probe by reference.
- **O-5.** The recorded-mutation comments of the tests new since 572bb917 carry an Expected line and no OBSERVED line: PB-R5 (App.colour.test.tsx:309), PB-U13 (StylePanel.test.tsx:154), PB-U15 (:183), PB-U16 (:222), PB-U17 (:241), PB-U9 (vi) (categoryCases.test.ts:147), PB-U14 (workspaceState.test.ts:225) and completeness (surfaceCompleteness.test.ts:264). This report's check 5 observes each of them at H2.
- **O-6.** Item 4's On-main paragraph (the human's) holds clause by clause at H2 (check 7). It does not say that an open ends Colour by; item 65 (P3 new) says it. Its "also" leaves the release paragraph's "keeps the style" to be read for main. An optional draft is under Drafts, A.

## Checks

**1. Start.**
- `ls-remote` gave H2, again at the end (12:04:51Z).
- `<W>` HEAD H2; porcelain 0 bytes.
- origin/main 0e4148bf; merge-base B.

**2. Paths.**
- B...H2 has 57 paths.
- `protocol/`, `kernel/src`, `engine/src` and `src-tauri/`: 0 paths. Lockfile or Cargo.toml: grep rc 1 (none).
- Every path is on §2.6 PR B's list or added to it by amendment:
  - the 33 listed files plus the two conditional ones (`types.ts`, `tableSource.ts`);
  - the session-end product and tests (Amendment 15 item 2's phase list; the session-end draft's nine);
  - OPEN-20 (a): `limits` and `values` with their tests, `decodeBatch.ts`, `WorkingCanvas.test.ts` (Amendment 12 item 13; Amendment 16 item 4);
  - the reveal entries (Amendment 12 item 13);
  - `surfaceCompleteness.test.ts` (Amendment 26);
  - `workspaceState.test.ts` (session-end; Amendment 25 item 5);
  - KNOWN-LIMITATIONS, MANUAL-WALKTHROUGH and e2e/README as records.
- Against main: `git diff --name-only B origin/main` gives 20 paths, none shared (grep rc 1).
- ADV-05 item 1 (b): the diff's list holds no publish, export, saveProject or src-tauri file (grep rc 1). The App.tsx lines that touch export are the StylePanel `exportHeld` prop only.
- H1..H2: 15 files, +327/-26, read whole.

**3. §7.**
- Command: `git diff --numstat B...H2 -- frontends/shell renderer/style-ts renderer/tests kernel/tests/manual_walkthrough_fixtures.rs` minus the three excluded records, rc 0. It covers 54 files, 2,916 + 199 = 3,115 lines.
- Groups:
  - B-P 1,030 of 1,752;
  - B-T 1,613 of 2,128;
  - B-E (`colour.mjs`) 472 of 590;
  - PR B 3,115 of 4,470.
  - Within those, the session-end product files are 67 of 71 and its nine tests 148 of 204.
- Over (none trimmed):

| Recorded in | File or group | Lines of ceiling |
|---|---|---|
| Amendment 18 item 1 | `values.ts` | 56 of 40 |
| Amendment 18 item 1 | OPEN-20 B-P group | 74 of 65 |
| Amendment 18 item 1 | `decodeBatch.ts` | 17 of 16 |
| Amendment 18 item 1 | `StudioLayout.test.tsx` | 67 of 60 |
| Amendment 15 item 3 (a) | `FeatureTab.tsx` | 17 of 15 |
| Amendment 15 item 3 (a) | `selection.ts` | 7 of 6 |
| Amendment 15 item 3 (a) | `App.test.ts` | 40 of 35 |
| Amendment 15 item 3 (a) | `pick.test.ts` | 21 of 20 |
| Amendment 15 item 3 (a) | `App.lateResult.test.tsx` | 53 of 40 |
| Closing-rows draft, row 1 | `style_agreement.rs` | 49 of 40 |
| Closing-rows draft, row 2 | `workspaceState.ts` | 26 of 10 (cumulative 25) |
| Closing-rows draft, row 3 | StylePanel.test + Legend.test | 374 of 250 (the draft reads 259; D-4 (b)) |
| Nowhere | `workspaceState.test.ts` | 19 of 4 (D-4 (a)) |

- From d1d3a29f to H2 the count changes only in App.tsx 1/1, buildLayers.test 1/0, StylePanel.test 118/3, StylePanel.tsx 4/9, tableSource.ts 1/1 and viewTransitions.test 1/0.

**4. StylePanel.tsx at H2.**
- With no wait running (Cancel hidden, because `waiting` is false):
  - Fill colour (:150, :174) clears the line through the effect (:111).
  - Reset (:234) clears it through the same effect.
  - One colour clears it at :229, and the effect at :111 as well.
  - An open under another key makes a new panel (App.tsx:2505), so its line is null.
- During a second wait (Apply is enabled while a match stands, :327):
  - Fill colour, Reset and One colour leave LINE_WAITING and Cancel in place (:111 and :229 are guarded; Cancel is :330-334).
  - The wait's end sets the line at :206, :207, :209 or :213. On rows it applies over `styleRef.current` (:210).
  - An open under another key ends the wait by the unmount abandon (:104).
  - An open under the same key: dispose cancels the stream (tableSource.ts:195-199), so the line reads "[P6 placeholder] Cancelled. Nothing was applied." (PB-U17 (c), StylePanel.test.tsx:311).
- Amendment 28, clause by clause:
  - The first sentence is D-1 and the outcome bullet is D-2.
  - The rule bullet holds.
  - The same-key bullet holds as code, and the product never reaches it (D-3's grep).
  - "(i) fails PB-U16 at (a) and does not reach (b)" holds (n-i).
- ADV-04 item 3, and ADV-08 items 1 and 3, are met.

**5. Mutations.** Each was an anchored `node -e` edit that refused any anchor found other than exactly once. I ran vitest from `<W>/frontends/shell` and reverted each with `git checkout --`; every diff after was 0 bytes and every sha256 equal to H2's. The test names and assertion lines below are byte-copied.

m01 to m13 (11:36Z to 11:40:40Z):
- **m01**, viewTransitions.ts.
  - Diff: `-      out.push({ action: "style.set", params: { property: "fillColor", value } });` / `+ … value: next.fillColor } });`
  - Result: 4 failed, 1 passed.
  - PB-R2: `AssertionError: the intent, in the wire fixture's shape and order: expected { action: 'style.set', …(1) } to deeply equal { action: 'style.set', …(1) }`
  - PB-U11 (new column): `AssertionError: one re-issue of the first look beside one cases query: expected [ 1, 1 ] to deeply equal [ 2, 1 ]`
  - PB-U11 (no not-held): `AssertionError: the style was applied: expected undefined to be 'zone' // Object.is equality`
  - PB-R5: `AssertionError: the drawn fill under the match, a colour per feature: expected 'object' to be 'function' // Object.is equality` (D-5)
- **m02**, categoryCases.ts.
  - Diff: `case "stopped": case "cancelled":`
  - Result: 1 failed, 4 passed.
  - PB-R4: `AssertionError: the line after the cancel: expected '[P6 placeholder] Coloured by zone: 2 …' to contain 'Nothing was applied'`
- **m03**, App.tsx.
  - Diff: `-    reportViewportOutcome(requestViewportWithSingleRetry(attempt), dataset);` / `+    void attempt;`
  - Result: 1 failed, 4 passed.
  - PB-U11: `expected [ 1, 1 ] to deeply equal [ 2, 1 ]`
- **m04**, App.tsx.
  - Diff: the endSession dispatch takes `reason: "source-changed"`.
  - Result: 1 failed, 21 passed.
  - `AssertionError: the notice names the lost watch: expected '[P6 placeholder] The selection ended:…' to contain 'lost coverage'`
- **m05**, App.tsx.
  - Diff: `+  return "source-changed";`
  - Result: 2 failed, 114 passed.
  - `AssertionError: setSessionEnded's reason for a real coverage-lost detail: expected 'source-changed' to be 'coverage-lost' // Object.is equality`
  - SH7: `AssertionError: expected "vi.fn()" to be called with arguments: [ { kind: 'session-ended', …(1) } ]`
- **m06**, HoverReadoutView.tsx.
  - Diff: `+  return HOVER_SESSION_ENDED_TEXT;`
  - Result: 1 failed, 5 passed.
  - `AssertionError: the coverage-lost readout names the lost watch: expected 'The source file changed while it was …' to contain 'lost coverage'`
- **m07**, the `rowGroups` code (rows whose value matches no case get group 0).
  - Result: 2 failed, 32 passed.
  - PB-U3: `AssertionError: polygon datum 3 (row 2, zzz): expected [ 170, +0, +0, 128 ] to deeply equal [ 204, 204, 204, 128 ]`
  - PB-U10b: `AssertionError: the groups of the full block: expected [ +0, 2, +0, 1, +0 ] to deeply equal [ +0, 2, 3, 1, +0 ]`
- **m08**, buildLayers.ts.
  - Diff: `+  return { color, trigger: ++matchFillRevision };`
  - Result: 4 failed, 28 passed, as the 95b6beb7 comment at buildLayers.test.ts:658 records (the first attempt's D4 is resolved).
  - PB-U5: `AssertionError: the trigger after ten pans: expected { getFillColor: [ 17 ] } to deeply equal { getFillColor: [ 7 ] }`
  - PB-U12, three tests:
    - polygonal: `AssertionError: deck.gl's view of the getFillColor change for polygonal: expected { matchToOneColour: true, …(4) } to deeply equal { matchToOneColour: true, …(4) }`
    - point: the same assertion with "for point".
    - line: the same assertion with "getColor change for line".
- **m09**, buildLayers.ts (`triggersOf` gives `{}` for ONE_COLOUR_TRIGGER).
  - Result: 4 failed, 28 passed.
  - PB-U5: `AssertionError: the accessors a one-colour fill triggers: expected [] to deeply equal [ 'getFillColor' ]`
  - PB-U12, three tests: `expected { matchToOneColour: false, …(4) } to deeply equal { matchToOneColour: true, …(4) }`
- **m10**, limits.ts.
  - Diff: `+  const kept = null;`
  - Result: 1 failed, 4 passed.
  - PB-U10a: `AssertionError: the kept block: expected [ undefined, undefined, undefined ] to deeply equal [ [ 'tag' ], 'match', null ]`
- **m11**, matchGroups.ts.
  - Diff: `+ … || block.kept !== "projection") return null;`
  - Result: 1 failed, 1 passed.
  - PB-U10b: `AssertionError: the groups of the match block: expected [ 3, 3, 3, 3, 3 ] to deeply equal [ +0, 2, 3, 1, +0 ]`
- **m12**, pick.ts (the reason fixed to source-changed).
  - Result: 1 failed, 13 passed.
  - `AssertionError: the latched readout for coverage-lost: expected { kind: 'session-ended', …(1) } to deeply equal { kind: 'session-ended', …(1) }`
- **m13**, FeatureTab.tsx.
  - Result: 1 failed, 10 passed.
  - `AssertionError: the coverage-lost notice: expected '[P6 placeholder] The selection ended:…' to be '[P6 placeholder] The selection ended:…' // Object.is equality`

m14 to m29 (by 11:45:04Z):
- **m14**, StudioLayout.tsx: `"style"` becomes `"layer"`.
  - Result: 1 failed, 9 passed.
  - `/colour opens the Inspector …`: `AssertionError: the Inspector, its Style panel and its Layer panel: expected [ true, false, true ] to deeply equal [ true, true, false ]`
- **m15**, StudioLayout.tsx: `"table"` becomes `"console"`.
  - Result: 1 failed, 9 passed.
  - `AssertionError: Activity, its Table panel and its Console panel: expected [ true, false, true ] to deeply equal [ true, true, false ]`
- **m16**, actionRegistry.ts: the `layer.revealTable` entry removed.
  - Result: 1 failed, 36 passed.
  - `AssertionError: expected [ 'command.focus', …(13) ] to deeply equal [ 'command.focus', …(14) ]`
- **m17**, Legend.tsx: the legend sorted by its label.
  - Result: 1 failed, 1 passed.
  - PB-R1: `AssertionError: labels in the resolver's legend order: expected [ …(5) ] to deeply equal [ 'park', 'civic', …(3) ]`
- **m18**, StylePanel.tsx: `+  const candidates = columns.filter(() => true);`
  - Result: 1 failed, 6 passed.
  - PB-R1: `AssertionError: the chooser's options, the empty choice first: expected [ '', 'tag', 'area', 'day', …(3) ] to deeply equal [ '', 'tag', 'wide', 'view' ]`
- **m19**, StylePanel.tsx: `waitForFirstScope(source, null)`.
  - Result: 5 failed, 2 passed.
  - PB-U8: `AssertionError: viewport_query calls: dataset, bbox, bbox CRS, limit, filter, projection: expected [ Array(1) ] to deeply equal [ Array(1) ]`
  - Also: PB-U13 `expected '[P6 placeholder] The filter changed w…' to contain 'holds no value'`; PB-U15, PB-U16 and PB-U17 `TypeError: Cannot read properties of undefined (reading '0')` (D-5).
- **m20**, StylePanel.tsx: `wait?.abandon();` removed.
  - Result: 3 failed, 4 passed.
  - PB-R3: `AssertionError: the stream the apply issued: expected "vi.fn()" to be called with arguments: [ 'sh_1' ]`
  - Also PB-U13 (TypeError), and PB-U17 `(b) the stream the second wait issued: expected "vi.fn()" to be called with arguments: [ 'sh_3' ]` (D-5).
- **m21**, categoryCases.ts: sort by `localeCompare`.
  - Result: 1 failed, 6 passed.
  - PB-U2: `expected [ '', '～', '😀', 'a', 'b', 'B' ] to deeply equal [ '', 'B', 'a', 'b', '～', '😀' ]`
- **m22**, categoryCases.ts: `issuedHere = true`.
  - Result: 3 failed, 4 passed.
  - PB-U9 (i): `Error: Test timed out in 5000ms.`
  - PB-U9 (ii): `expected "vi.fn()" to be called 1 times, but got 2 times`
  - PB-U9 (v): `expected "vi.fn()" to not be called at all, but actually been called 1 times`
- **m23**, categoryCases.ts: `source.cancel();` with no condition.
  - Result: 2 failed, 5 passed.
  - PB-U9 (v): as in m22.
  - Also PB-U9 (vi): `expected [ [ 'sh_1' ], [ 'sh_2' ] ] to deeply equal [ [ 'sh_1' ] ]` (D-5).
- **m24**, document.ts: `on_null` dropped.
  - Result: 3 failed, 9 passed.
  - PB-U1: `the fill_color a fillMatch writes: expected { match: { column: 'zone', …(2) } } to deeply equal { match: { column: 'zone', …(3) } }`
  - Also the closed-at-construction test, and PB-U4.
- **m25**, document.ts: `when` lowercased.
  - Result: 1 failed, 11 passed.
  - PB-U4: `AssertionError: a case keeps its case: expected '#cccccc' to be '#123456' // Object.is equality`
- **m26**, style.ts: `|| arrowType.startsWith('Dictionary')`.
  - Result: 1 failed.
  - PB-U7: `AssertionError: admitsMatchKeyType(Dictionary(Int32, Utf8)): expected true to be false // Object.is equality`
- **m27**, workspaceState.ts: the reason fixed to source-changed.
  - Result: 1 failed, 14 passed.
  - `AssertionError: the notice a coverage-lost end leaves: expected { kind: 'ended', …(2) } to deeply equal { kind: 'ended', …(2) }`
- **m28**, viewTransitions.ts: `fillMatch: null` dropped.
  - Result: 2 failed, 8 passed, as viewTransitions.test.ts:110 records (the first attempt's D5 is resolved).
  - `a literal fill: expected [ '#112233', { column: 'zone', …(3) } ] to deeply equal [ '#112233', null ]`
  - `the match after the transitions toward the default: expected { column: 'zone', …(3) } to be null`
- **m29**, viewTransitions.ts: `|| prev.fillMatch !== null` dropped.
  - Result: 2 failed, 8 passed.
  - `the match ending at the same fillColor: expected [] to deeply equal [ '#112233' ]`, and the same toward-default assertion.

m30, Rust, in a shared hold (11:48:31Z to 11:49:24Z):
- Diff: `-    {"arrow_type": "Dictionary(Int32, Utf8)", "admitted": false}` / `+ … "admitted": true}`
- `cargo test -p spatial-renderer --locked --test style_agreement` exit 101; `test result: FAILED. 1 passed; 1 failed`.
- `the_match_key_rule_admits_exactly_the_vectors_admitted_rows`, at style_agreement.rs:166:9: `assertion `left == right` failed: admission of Dictionary(Int32, Utf8)`, `left: false`, `right: true`.
- Reverted: diff 0 bytes; sha256 ef634026… equal to H2's.

The eight recorded mutations the brief's list did not name (11:46Z to 11:48:08Z):
- **PB-R5**, App.tsx:1169 removed.
  - Result: 1 failed, 4 passed.
  - `AssertionError: the next commit's steps: expected [ { …(2) }, { …(2) } ] to deeply equal [ { …(2) } ]`
- **PB-U13 (1)**, the `recordNamed` call in `applyColourBy` removed.
  - `the Colour by row at the apply, before its outcome: expected [ +0, +0 ] to deeply equal [ 1, +0 ]`
- **PB-U13 (2)**, the one in `handleOneColour` removed.
  - `the One colour row before its commit, and the one commit: expected [ +0, 1 ] to deeply equal [ 1, 1 ]`
- **PB-U15 (1)**: `void ended;`
  - PB-U15 fails with `expected '[P6 placeholder] Coloured by tag: 2 d…' to be ''`, and PB-U16 fails at (a).
- **PB-U15 (2)**: `void offered;`
  - `Apply with the chosen column no longer offered: expected false to be true`
- **PB-U9 (vi)**: `if (issuedHere) source.cancel();`
  - `cancel calls after Colour by's Cancel, the Table's request among none of them: expected [ [ 'sh_1' ], [ 'sh_2' ] ] to deeply equal [ [ 'sh_1' ] ]`
- **PB-U14**: `const style = rebound.style;`
  - `the style after a later admission under the same dataset key: expected { fillColor: '#123456', …(4) } to deeply equal { fillColor: '#123456', …(4) }`
- **completeness**: a `style.setFillColor` class C row added.
  - Result: 2 failed, 12 passed.
  - `expected [ 'style.setFillColor', …(3) ] to deeply equal [ 'style.colourBy', …(2) ]`, and `expected false to be true`.

Amendment 28's mutations and my probe:
- **(i)**, five anchors (the flag put back).
  - Result: 1 failed, 6 passed.
  - PB-U16: `(a) the Colour by line after a Fill colour change: expected '[P6 placeholder] Coloured by tag: 2 d…' to be '' // Object.is equality`
- **probe-ib**, my own: the flag only in Reset.
  - Result: 2 failed.
  - PB-U16: `(b) the Colour by line after Reset: …`
  - PB-U17: `(a) after a Fill colour change during the wait: the line: expected '' to contain 'Reading the first features'`
- **(ii)**: `if (ended) setLine(null);`
  - PB-U17: `(a) after a Fill colour change during the wait: the line: expected '' to contain 'Reading the first features'`
- **(iii)**: `    setLine(null);` at :229.
  - PB-U17: `(d) after One colour during the wait: the line: expected '' to contain 'Reading the first features'`

**6. D-1, D-2 and D-3.** I checked the architect's "Words:" lines by script against the tree at H2:
- D-1 at tableSource.ts:44: present byte for byte, once in the file.
- D-2 at StylePanel.tsx:103: present byte for byte, once.
- D-3 at App.tsx:2054: present byte for byte, once.

**7. Records.**
- ADV-03's twelve pairs, by script: each New appears once at H2 (P10's New is "nothing"), and each Old 0 times.
- Item 10's comments are true by the symbols they name, as is P2's text at H2 (categoryCases.ts:70, tableSource.ts:195-199).
- The two comments that name 895d1142: O-1.
- Item 11: item 4's On-main paragraph holds clause by clause (workspaceState.ts:155 and :158; StylePanel.tsx:210; document.ts:162-172). Its omission is O-6.
- Item 12: AC6 to AC11 do not use Colour by, and AC12 colours after its open. None needs redrafting, which agrees with the draft's row 4.
- D4 and D5 were re-observed: m08 and m28, above.

**8. Light runs** (from `<W>`):
- `verify-test-claims` rc 0: 834 claims across 272 files.
- `verify.mjs --offline` rc 0.
- `verify-cites` rc 0: 3192 files.
- `verify-quotes`, in a shared hold, rc 0: 156 checked, 0 errors.

**9. Series report.** `<S>/s327h-series-report.md` was not there at 11:56:08Z (ls rc 2).

**10. CI** (read at 11:56:13Z).
- `gh pr checks 327` rc 0: 15 checks, all pass.
- `gh run view` gives headSha bdf918e1dcf7669a52e583131d645ef748c8855d for all ten runs: 44293781236, 44293781142, 44293781133, 44293781285, 44293781304, 44293771394, 44293781171, 44293771151, 44293781353 and 44293781136.

**11. End.**
- `<W>` HEAD H2, porcelain 0 bytes, left in place.
- `C:/dev/wt/m4b` HEAD H2, porcelain 0 bytes.
- df: C: 47G free; D: 367G free.

## Holds (shared, project masked)
1. m30's cargo test: requested after 11:48:31Z, released before 11:49:24Z. Exit 101 was the test's own; the script exited normally. Lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:68372 also=<m>`, then `MACHINE_RELEASED project=<m> …`.
2. verify-quotes: requested at about 11:56Z, held by 12:01:02Z, released between 12:04:51Z and 12:06:30Z, exit 0. Lines: `MACHINE_HOLD shared project=<m> … also=<m>`, then `MACHINE_RELEASED project=<m> …`.
- No exit 96 to 99.

## Drafts for the advisor
Each draft is my wording, not the human's, and each is checked against H2.

**A. Optional: item 4's On-main paragraph** (the human's wording; O-6).
- Now: "Opening a file also clears the filter cards, not the filter alone."
- Words: "Opening a file also clears the filter cards, not the filter alone, and ends Colour by (item 65); the other style properties are kept."
- Clause check:
  - "clears the filter cards": workspaceState.ts:158 at H2.
  - "ends Colour by": :155.
  - "the other style properties are kept": :155 spreads `rebound.style`; PB-U14 asserts it.

**B. Amendment 28, its first sentence** (the worker's; D-1).
- Words: "A second Colour by waits when a match stands, Apply is clicked again, and the Table's source holds no completed or stopped result for the view's filter and has not ended."
- Clause check:
  - Reused with no wait: categoryCases.ts:59 and :65 at H2.
  - Otherwise issued or joined, then waited on: :60-62.
  - An ended source settles at once: tableSource.ts:120 with `check()` at categoryCases.ts:51-53.

**C. Amendment 28, the outcome bullet** (the worker's; D-2).
- Words: "The wait's outcome, as for any wait: on rows under the view's filter that hold at least one value of the column that is not null, the match is applied over the style as it then is, so a Fill colour chosen during the wait stays the fill colour, and the line names the column and its counts. Otherwise the line says why nothing was applied."
- Clause check:
  - Nothing applied without rows: StylePanel.tsx:206.
  - Nothing applied if the filter changed: :207.
  - Nothing applied with no value: :209, where the cases are the distinct non-null values (categoryCases.ts:103).
  - Applied over the style as it then is: :210.
  - The line: :213.

**D. StylePanel.tsx:105-106, the comment** (the worker's; D-3).
- Words: "The effect on the match clears the Colour by line on every end of a match: the Fill colour, Reset and One colour end it from the panel, and an open (`resource.admitted`) from outside, which reaches this same panel only under the same dataset key (App keys the Style slot by dataset, and every open in the shipped app mints a new key, so that case has no product caller; PB-U15 and PB-U17 (c) test it as code). Except while a wait runs: the line is then the wait's, and the wait's outcome sets it."
- Clause check:
  - The effect: :108-112.
  - Fill colour: :150, :174.
  - Reset: :234, with DEFAULT_STYLE_STATE.fillMatch null at document.ts:92.
  - One colour: :226.
  - The open: workspaceState.ts:155.
  - The key: App.tsx:2505.
  - The sole dispatch: App.tsx:1186.
  - The mint: kernel/src/skp.rs:1120 and handles.rs:19-21.
  - The tests: StylePanel.test.tsx:296-314.
  - The wait guard: :111.

## Background shells left
None. bkaikzcrr, bmvsy2365, b5n4su71e, bh8oksbtj and bpfxu66r2 have all completed.

Model: claude-opus-5-5.
