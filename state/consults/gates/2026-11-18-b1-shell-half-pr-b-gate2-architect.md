Reviewed: PR #327 at d1d3a29f28e6ac813a269bdd2e44d0e2f03687a7 (the custodian's filing note, 2026-11-18: the architect, PLAN node b1-shell-half, milestone 4's PR B, gate attempt 2 at the corrected head after the main take-in, under its form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, Amendments 24 to 27) and ADV-2026-11-15-24 item 7 (d); dispatched at 2026-11-18T09:23:56.668Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (6062 bytes, sha256 2d01cccbef9ed93fa9523df2730359533eeae1fb98632b5aa9c56b09f2941436); the run 2026-11-18T09:24:03.937Z to 2026-11-18T09:39:06.435Z by its transcript, 100 calls (Read 58, Grep 37, Glob 4, SubagentHandback 1), 1 errored, model claude-opus-5-5; it writes nothing; its gaps in reading are its own list; the custodian re-read C-1 at the head and it holds; received at 2026-11-18T09:39:06.435Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 16105 bytes, sha256 11c1ab2283dd66a22d2d1c84ecf9b9bd55fe4a8a17a99c11cfaf4d1159336340, with this note added in its first line), gate 2, architect (cut/b1-shell-half-pr-b @ d1d3a29f28e6ac813a269bdd2e44d0e2f03687a7)

Verdict: FAIL

Under AUTONOMY §22: Correctness FAIL on one finding (C-1). Evidence PASS. Documentation: findings D-1 to D-5, each must-fix before the merge, with no re-gate. Apart from C-1, the correction closes C1, C2 and C3 of my first attempt. Under Part 1 item 6 of the 2026-11-05 directive, the re-gate for C-1 is C-1's fix and whatever that fix adds.

Gaps in my reads:
- ADR-023 §11 items 2-9.
- stepRecorder.ts. I located it with Glob only and did not read it.
- viewTransitions.ts beyond the lines Grep showed me (:8, :34-40, :89-91, :126, :172-195).
- The e2e README colour entry. The tool omitted its long line at :864, so I saw only :859.
- The test bodies of PB-U1-3, U6, U8-U11 and R1-R4.
- Part 1's items other than item 6, checked comment by comment against the 57-file diff.
- ADV-2026-11-15-19 and -20.
- matchGroups.ts at N.
- The comments of KL items 54 and 65, re-read for whose wording each is.
- Main's changes between 619a7cc9 and B2, other than KNOWN-LIMITATIONS.
- The PR body.
- CI. I take the reviewer's reading of it.
- The packet's sha256. I have no shell, so I did not verify it, and I computed no hash and made no byte comparison by script.

**Correctness**

C-1. After Colour by, a Fill colour change or Reset leaves a status line that says the map is still coloured by the column.
- The cause, in StylePanel.tsx at N:
  - handleFillColor sets `endedHereRef.current = true;` (:176) and ends the match (:177).
  - handleReset does the same (:238-240).
  - Neither calls setLine.
  - The effect at :109-114 skips its clear while that flag is set: `if (ended && !endedHereRef.current) setLine(null);` (:112).
  - So the line set at :216 ("[P6 placeholder] Coloured by ${column}: …") stays on screen (:343-344). Meanwhile the legend is gone and the map draws one colour.
- How it is reached: ordinary use. Apply Colour by, then pick a Fill colour or click Reset.
- Why it is in scope: the correction added the endedHereRef design (:105-113), which is what keeps the line. Its comment at :106 says the panel's own ends set the line, "so this effect leaves the line as their own code sets it". For Fill colour and Reset, their code sets none.
- The worker's report disclosed it. No ruling I read accepts it.
- Fix:
  - Delete endedHereRef (:108, :113, :176, :229, :238) and the second sentence of the comment at :106, so the effect clears the line on every end of a match. handleOneColour keeps its `setLine(null)` (:233).
  - Add one test, in StylePanel.test.tsx beside PB-U15: Colour by applied, then (a) a Fill colour change and (b) Reset, each followed by the assertion that `.style-colour-line` is empty.
  - Record the mutation, putting the flag back, as observed failing.

**Evidence**

None blocks.
- Flag 1's run evidence and the packet's §4 path: the report named as the series at 6f95993e (state/consults/2026-11-16-b1-shell-half-pr-b-head-series-tester-report.md) is the series at 6f7e744c. The 6f95993e series is the unfiled <S>/s327c-tester-report.md. This is a packet locator error; no claim of the PR rests on it.

**Documentation**

Each is must-fix before the merge. None is the human's wording, so the worker applies my words and the PR body lists them.

- D-1. tableSource.ts:44 at N: "a number each `start` changes, 0 before any".
  - The claim is untrue after `end` or `dispose`: start returns at :120 before `this.request++` at :122.
  - Words: "The request this result belongs to: a number each `start` made before `end` or `dispose` changes, 0 before any (a wait compares it with the one its own `start` gave)."
  - Clause check: "each start made before end or dispose changes" rests on :120-122. "0 before any" rests on EMPTY_TABLE at :52 and the field at :106. "a wait compares" rests on categoryCases.ts:64 and :70 at N.
- D-2. StylePanel.tsx:103 at N: "it cancels a stream it issued and leaves a joined one running".
  - The guard also leaves alone a stream it issued that a later `start` has superseded.
  - Words: "it cancels a stream it issued while the source still holds that request, and leaves a joined or superseded one running."
  - Clause check: both clauses rest on categoryCases.ts:61-64 and :70 at N, and on the abandon doc at :23.
- D-3. App.tsx:2054 at N: "(after One colour, that is none)".
  - An open, a Fill colour change and Reset also make the column none.
  - Words: "(when no match is set, as after One colour or an open, that is none)".
  - Clause check: "when no match is set … none" rests on :2056 (`view?.style.fillMatch?.column ?? null`) and :2059. "after an open" rests on workspaceState.ts:155 at N.
- D-4. Two class 8 overruns named in the correction worker's report have no class 8 row in Amendments 24-27 as I read them:
  - workspaceState.ts, 26 lines against 10;
  - StylePanel.test.tsx and Legend.test.tsx together, 259 against 250.
  - Fix: record each as class 8 in the closing amendment, with §7's own command. Leave §7 unedited. I have no shell, so the sizes are the worker's, not measured by me.
- D-5. The records step of Amendment 25 items 8-9 has not run at N. The form's order was: amendment, correction worker, records worker, gates. ADV-2026-11-15-24 item 7 (c) asks for the same order.
  - Still owed:
    - the sentence that an open ends Colour by;
    - item 4's On-main re-read (ADV-2026-11-15-24 item 6 (b));
    - the KL and walkthrough words drafted below.
  - Fix: the records worker runs before the merge, on the advisor's rulings on those drafts.

**Observation**

- O-1. Two places answer `unknown-attempt` (for the flag 1 diagnosis, not a finding against PR B):
  - the host, at publish.rs:787-789 at N (`store.take` misses);
  - the frontend itself, at PublishPanel.tsx:547-549 at N, when `attemptIdRef.current` is null. That ref is set by a passive effect (:534-536) after the prepare's `setState` commits, and runPrepareWithDestination returns its outcome after that `setState` (:479), not after the commit.
  - Whether an e2e execute can land before that effect runs is a timing question inside one round trip. The outcome alone does not tell the two places apart. My reading only; I did not establish it.
- O-2. colour.mjs:38 at N hard-codes the main checkout's fixture path. A worktree run reads main's fixture. The sha256 check before and after guards against a change, not against which fixture is read.
- O-3. The Table's own Cancel (TableTab.tsx:133 at N) and its effect cleanup (:66) cancel a request Colour by made, whenever the Table shows the Filtered scope. OPEN-C (b) covers only Colour by's Cancel (form, OPEN-C (b)), so this is not code of the same kind. It belongs in item 54's words: see draft A.

**Checks**

1. C1, C2 and C3.
   - C1 closed. The class C rows are at surfaceRegistry.ts:200-213 at N. They are recorded at the action, before any outcome: StylePanel.tsx:200 (after the guard at :199 and before the wait at :201) and :228.
     - The guard's conditions are the Apply button's disabled conditions (:332), so its early return is not reachable from the UI.
     - Every outcome after :200 keeps the row.
   - C2 closed.
     - The guard is at categoryCases.ts:61-64 and :70 at N. PB-U9 (vi) shows it holds on the Table path I gave.
     - Other paths:
       - On a no-op start after end or dispose, `own` names an earlier request. The cancel it then makes is harmless: cancel at tableSource.ts:171-180 finds a null handle and a phase that is not loading. See D-1 for the doc.
       - The reverse direction, the Table cancelling a request Colour by made, is O-3, which is wording.
     - No new path of the same kind.
   - C3 closed in substance.
     - workspaceState.ts:153-158 at N ends the match at every open. So item 65's last sentence is now true.
     - The advisor's words are still owed (D-5; drafts B and C).
2. The correction's other items.
   - 09bba48e holds: the open keeps the four other properties (workspaceState.ts:155 at N) and records no step (App.tsx:1167-1169 at N).
   - Each new test drives the real shape, and its assertions would fail if its claim were false:
     - PB-U13 and PB-U15: StylePanel.test.tsx:154-200 at N, a real StylePanel over a real TableSource.
     - PB-U9 (vi): categoryCases.test.ts:147-160, a real TableSource. Under the mutation it cancels [[sh_1],[sh_2]] and the phase is cancelled.
     - PB-U14: workspaceState.test.ts:225-239, the same key and another key, the full style asserted.
     - PB-R5: App.colour.test.tsx:294-336, through the openPath hook and the real applyStyleChange, buildLayers and decodeBatch. It checks a drawn fill of [66,133,244,180], a legend count of 0, no step for the open, and one step for the next outlineWidth commit.
   - surfaceCompleteness.test.ts:263-275 at N expects the three style rows. That is within Amendment 26.
   - The PB-U13 and PB-U15 comments carry no OBSERVED AT lines. The worker's report records those observations, and the form asks for no such line under Amendment 25.
3. The first attempt's gaps.
   - Read now:
     - The skp/types.ts hunk: StyleMatchValue, a client type with no new command (g327r-diff.txt:2702-2727).
     - package.json: one script line, `e2e:colour` (g327r-diff.txt:646-657). It is not a dependency.
     - colour.mjs's header, :5-20 at N. It claims no timing (:17-18).
     - viewTransitions.ts in part. styleTransitions (:174-195) records one fillColor step on a change or an end of the match (:178-183).
     - Part 1 item 6, applied to this attempt.
   - Still unread: those listed under Gaps.
4. §8.
   - Items 1-9, 11, 14-17 and 20: carried unchanged from my first attempt.
     - Item 1: the correction's three new files are declared by Amendments 25-26, and nothing under protocol/, kernel/src, engine/ or src-tauri/ is in B2...N.
   - Item 10: carried, with the O4 reading of Amendment 25 item 6. The correction issues a stream only when neither reusable nor joinable (categoryCases.ts:61-62), and there is still one handle (tableSource.ts:118-123).
   - Item 12: pass (viewTransitions.ts:174-195; App.tsx:1167-1169).
   - Item 13: pass. `request` has product callers at categoryCases.ts:64 and :70. `abandon` has them at StylePanel.tsx:104 and :222.
   - Item 18: Documentation, D-4.
   - Item 19: the surfaceRegistry statements at :200-213 match the fences of ADV-2026-11-16-01 by my reading. The byte check by script is the reviewer's, since I have no shell. I saw no line cite into the ledger and no bare self-line in the correction's text.
5. Flags 2, 3 and 4.
   - Flag 2: the completion's diff check from H1 to 6f95993e covered the e2e folder, matchGroups.ts, saveProject.ts, publish.rs and PublishPanel.tsx.
     - The correction touches StylePanel.tsx and App.tsx. Those are E3's and E4's, which were re-observed.
     - So M-PB-E1, E5, E2 and E2c stand at 6f95993e.
     - I did not read main's take-in up to N for them. The reviewer re-applies the mutations at N.
   - Flag 3: item 56's prose line at N (:487) differs from main's at B2 (:486 in the main checkout) only in PR B's pair 1, by my comparison of the two reads in this transcript, not by script. Its clauses:
     - "again after a Colour by … while the status bar says that attributes were not held" holds at App.tsx:2061 at N.
     - "on a different column" is imprecise: it also fires from no column (:2056-2059). See draft D.
     - "the Table's Filtered scope needs one more" leaves out Colour by's wait, which issues the Table's stream whether or not the Table is shown (categoryCases.ts:62; KL item 54 says so itself). See draft D.
   - Flag 4: this is check 3.
6. Flag 1, by reading. No.
   - No file in B2...N edits PublishPanel.tsx, publish.rs, commands.rs or anything else under src-tauri. That rests on the gate-1 diff's 54 files plus the correction's three.
   - The PublishPanel slot is keyed `publish-${admitted.dataset}` (App.tsx:2549 at N). Nothing PR B changes remounts it.
   - App.tsx's hunks in the gate-1 diff leave handleExportRunning (:1211-1229) as it was, apart from the Table cancel at :1214, which was already there.
   - The host's attempt store (publish.rs:757-789 at N) and the frontend's ref (PublishPanel.tsx:533-554) are untouched. On the two places that answer unknown-attempt, see O-1.
7. Discharge claims and verbatim quotes.
   - The correction's comments carry no "done" or "discharged" clause that I found.
   - The closing amendment is still to come (D-5).
   - I found no quote marked as the human's that differs from its source by my reading, and no claim of a guarantee, a limit or a measurement without support, apart from the comments in D-1 to D-3.

**Drafts for the advisor** (mine, not the human's words; each clause checked at N)

- A. KL item 54, its Colour by sentence at :479.
  - Current text, byte-copied: "A request Colour by made is cancelled by Colour by's Cancel and when an export starts; Cancel on a request Colour by only joined cancels nothing but the wait."
  - Draft: "A request Colour by made is cancelled by Colour by's Cancel, when an export starts, when the session ends and when another file is opened, and, while the Table is shown with that scope, by the Table's Cancel and whenever a request the Table made would be; Cancel on a request Colour by only joined cancels nothing but the wait."
  - Clause check:
    - Colour by's Cancel: StylePanel.tsx:219-225; categoryCases.ts:70.
    - An export: App.tsx:1214.
    - Session end: TableTab.tsx:69-71 → tableSource.ts:183-193. I take the reach to a hidden Table on the item's own statement for the Table's requests; I did not read where the activity slot mounts.
    - Another file: App.tsx:1451-1452 → tableSource.ts:195-197.
    - While shown: TableTab.tsx:63-67 (the cleanup) and :133.
    - "only joined": categoryCases.ts:64.
  - Whose wording: per the item's comment at :480, not re-read by me.
- B. KL item 65, its last sentence at :518.
  - Draft: "A feature in a batch the map holds without the chosen column draws as Other, whatever its value, until that batch is replaced (item 51)."
  - This takes the reviewer's D6 point: a batch whose values are all NULL draws as No value.
  - Clause check: rowGroups in matchGroups.ts, as item 51's comment locates it. I did not read it at N; the reviewer to check.
- C. The open sentence (Amendment 25 items 8-9), to follow B in item 65.
  - Draft: "Opening a file ends Colour by: the map is drawn in the one fill colour, and the fill opacity, the outline colour and the outline width are kept."
  - Clause check: workspaceState.ts:108-111 and :153-158; PB-R5's drawn fill and its legend count of 0 (App.colour.test.tsx:294-336).
- D. KL item 56, PR B's pair 1 and the human's clause beside it.
  - Draft: "…which is issued at open, again after an Apply or Clear, and again when Colour by sets a column the map was not already coloured by while the status bar says that attributes were not held (item 51), so up to four; the Table's one stream, which its Filtered scope or a Colour by's wait issues, needs one more, and an export needs one."
  - Clause check:
    - "a column the map was not already coloured by" rests on App.tsx:2056-2061.
    - The Table's one stream rests on tableSource.ts:118-123.
    - Colour by's wait rests on categoryCases.ts:62.
  - Whose wording: the second clause replaces the human's clause "the Table's Filtered scope needs one more" (the item's comment: the human's wording, except the advisor's span).
- E. KL item 51 at :466.
  - (ii): "A feature in a batch the map holds without the column it is coloured by draws as Other until that batch is replaced." Clause check as B.
  - (iii): "If you apply Colour by on a column the map is not already coloured by while…". Clause check as D.
  - Whose wording: the advisor's draft (comment at :467).
- F. Walkthrough AC12 (frontends/shell/MANUAL-WALKTHROUGH.md:1995 at N).
  - "A Colour by on a new column" becomes "A Colour by on a column the map is not already coloured by".
  - Clause check as D. The rest of the row holds as written.
