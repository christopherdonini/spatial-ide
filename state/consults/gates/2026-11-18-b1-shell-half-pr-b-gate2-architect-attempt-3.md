Reviewed: PR #327 at bdf918e1dcf7669a52e583131d645ef748c8855d (the custodian's filing note, 2026-11-18: the architect, PLAN node b1-shell-half, milestone 4's PR B, gate 2 attempt 3 at the corrected head, limited to C-1's fix and what it adds by the advisor's ruling ADV-2026-11-18-04 item 1, under its form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, Amendments 24 to 27, and Amendment 28's text not yet filed); dispatched at 2026-11-18T11:31:16.069Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (7110 bytes, sha256 90a08d44d74505f986f66345e44d8bc90d041a98a620b1ed450d78a44af4e70d); the run 2026-11-18T11:31:20.652Z to 2026-11-18T11:38:14.717Z by its transcript, 41 calls (Read 26, Grep 12, Glob 2, SubagentHandback 1), 1 errored, model claude-opus-5-5; it writes nothing; received at 2026-11-18T11:38:14.717Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 13129 bytes, sha256 94564fbf86a3562fbf4118d9a3cfeaa78614c28ffe08fe318f9bfb6712decf1a, with this note added in its first line and one final newline), gate 2, architect, attempt 3 (cut/b1-shell-half-pr-b @ bdf918e1dcf7669a52e583131d645ef748c8855d)

Verdict: PASS WITH NOTES

Under AUTONOMY §22: Correctness PASS, because C-1 is closed and the fix opens no new path of the same kind. Evidence PASS. Documentation has four findings, D-A to D-D. Each must be fixed before the merge, with no re-gate. None of them is the human's wording, so the worker applies my words below and the PR body lists them. No finding blocks.

Gaps in my reads:
- The records-step commits 95b6beb7 and 332c58b8, and H2's merge diff. For StylePanel.tsx I read the whole file at H2. For App.tsx and tableSource.ts I read only the lines cited below. For the rest I rely on the locator's statement that the merge adds nothing in style/, App.tsx or tableSource.ts.
- StylePanel.test.tsx at H2 beyond :20-99, the grep hits at :5, :97-243, and the diff's new side for PB-U16 and PB-U17.
- PB-U15's body.
- The mutation scripts themselves. I read their diffs (<S>/s327e-mut-i-diff.txt, -ii-, -iii-) and the run logs' failure lines (<S>/s327e-run-mut-*.txt).
- clickEffect's transitions.
- AdmissionPanel.tsx, admitDataset.ts and session_history.rs (the worker's item 4 read). For item 4 I read kernel/src/skp.rs:1120 at H2 and protocol/skp/src/v0/handles.rs:19-23 at H2.
- Any project-load path.
- Vitest, typecheck and CI. I ran nothing and have no shell, so I made no byte or hash comparison by script. "Byte for byte" below means by my reading.
- The form at H2 beyond the Amendment 27 heading. I read Amendment 27 whole in the main checkout, at :2693-2708, plus the headings of Amendments 25-27. Amendment 28 is not yet in the form at H2.

**Correctness**

None.

**Evidence**

None blocks.

**Documentation** (must fix before the merge; not the human's wording, so the worker applies these words)

D-A. The comment above the match effect, StylePanel.tsx:105-106 at H2. ADV-2026-11-18-08 item 3 leaves this comment to the gates.
- My judgement: it must change. Its first sentence presents the effect as being for ends "other than by the panel" and gives the same-key open as the reason for it. That branch has no product caller. Since C-1's fix, the effect's product callers are the panel's own Fill colour and Reset ends: StylePanel.tsx:174 and :234-235 at H2 set no line.
- Replacement for both lines:
  `// Every end of a match clears the Colour by line, except while a wait runs: the line is then the wait's, and the wait's outcome, or its Cancel, sets it. The Fill colour and Reset leave the line to this effect, and One colour applies the same rule itself;`
  `// an open under the same dataset key also ends a match from outside the panel (`resource.admitted`), but the shipped app does not admit a file again under its key (ADV-2026-11-18-08 item 3), so PB-U15 and PB-U17 (c) test that branch as code.`
- Clause check (all at H2):
  - "every end … except while a wait runs": StylePanel.tsx:108-112.
  - "the wait's outcome, or its Cancel": :202-213 and :216-222.
  - "Fill colour and Reset leave the line to this effect": :174 and :234-235 call no setLine.
  - "One colour applies the same rule itself": :229.
  - "an open under the same key ends a match": workspaceState.ts:155, which ends the match at every admit.
  - "does not admit again under its key": App.tsx:2505 (the panel is keyed by `admitted.dataset`), kernel/src/skp.rs:1120 (`DatasetHandle::mint()` at each open) and handles.rs:19-23 (OS CSPRNG).

D-B. Amendment 28 (the text at <S>/s327e-amendment-28.md, sha256 a79789f5…), its heading and its first sentence.
- (1) In the heading, "and the correction after it" names no commit. Words: "and the correction after it, to e00d7b1fd85a07c14a152d77f658e38d2beda7aa".
  - Clause check: e00d7b1f is the last code commit (the brief's list; the worker's second report).
- (2) "the first scope is not held complete under the view's filter" is too narrow: a stopped scope is also reused. Words: "the first scope is not held, completed or stopped, under the view's filter".
  - Clause check: categoryCases.ts:59-62 at H2.

D-C. Amendment 28, the rule bullet.
- The current text says: "While a wait runs, the waiting line and Cancel stay, and the wait's outcome sets the line when it ends."
- This is untrue for an open, the fourth end it names. Under the same key the open ends the wait at once, and Cancel goes. Under another key (the only open the product makes) the panel is made anew. The amendment's own open bullet says so.
- Replacement for the bullet: "- The rule, for all four ends of a match (the Fill colour, Reset, One colour and an open): with no wait running, the end clears the line (C-1). While a wait runs, the Fill colour, Reset and One colour leave the waiting line and Cancel to the wait, and the wait's outcome, or its Cancel, sets the line when it ends; an open ends the wait at once (the bullet on an open, below)."
- This still states the rule once for four ends, as ADV-2026-11-18-08 item 1 asks.
- Clause check (all at H2):
  - "no wait, the end clears": StylePanel.tsx:111 and :229. A new panel's line starts null (:96), keyed at App.tsx:2505.
  - "leave the waiting line and Cancel": the guards at :111 and :229. Cancel renders on `waiting` (:330), which only :200, :205 and :220 change.
  - "outcome, or its Cancel": :202-213 and :221.
  - "an open ends the wait at once", same key: App.tsx:1451-1452 → tableSource.ts:195-197 and :171-178 (phase cancelled, emit) → categoryCases.ts:49-53 → StylePanel.tsx:206.
  - "an open ends the wait at once", another key: StylePanel.tsx:104 (abandon on unmount).

D-D. Amendment 28, the Mutations bullet. The last bullet cites "Mutation (i)", but no mutation is numbered (i) in the amendment, and the test comments number PB-U17's mutations (1) and (2).
- Replacement for the Mutations bullet: "- Mutations: (i) PB-U16's, the panel's own-end flag put back; (ii) PB-U17's first, the effect clearing the line whether or not a wait runs; (iii) PB-U17's second, One colour's handler clearing it unconditionally (the test's comment numbers (ii) and (iii) as (1) and (2))."
- Clause check: <S>/s327e-mut-i-diff.txt, -ii-diff.txt and -iii-diff.txt (evidence), against StylePanel.test.tsx:222-223 and :241-242 at H2.

**Observation**

- O-1. No recorded mutation reaches PB-U16 (b). PB-U17 (b), Reset during the wait, is not reached by any recorded mutation either: (ii) fails at (a) before it, and under (iii) it passes on the way to (d). For both, mutations of their own are proposed under check 2.
- O-2. The observations of mutations (i) and (ii) were made on the C-1 fix's StylePanel.tsx: blob 47103ce7 by the mutation diffs, before 8a048a6c and e00d7b1f. That was before PB-U17 had (d); the logged title lacks "One colour". By my reading both still fail where named at H2, because PB-U16 is unchanged and (a) runs first in PB-U17. The reviewer's re-application at H2 (ADV-2026-11-18-04 item 1) is the proof.
- O-3. The commit message of d6da721f says PB-U17's open "leave the waiting line and Cancel". This is untrue for (c), which asserts Cancel is gone and the line is the cancelled line (StylePanel.test.tsx at H2, case (c)). The message cannot change without a rewrite. Neither the PR body nor Amendment 28 may repeat it; Amendment 28's open bullet is correct.
- O-4. PB-U16 and PB-U17 carry no OBSERVED AT lines, as for PB-U13 and PB-U15 in my attempt 2. The observations are the worker's run logs, and Part 1 item 9 keeps mutation observations the gates' own.

**Checks**

1. C-1 closed. The effect is at StylePanel.tsx:108-112 at H2; the handlers are at :174, :216-222, :224-230 and :232-236. For each end of a match:
   - With no wait running:
     - Fill colour and Reset: the effect clears the line (:111).
     - One colour: it clears the line at :229, and the effect clears it as well.
     - Open: under the same key the effect clears the line. Under another key the panel is made anew (App.tsx:2505), so the line is null (:96).
     - Cancel is hidden in every case (`waiting` false, :330). No wait is running, so no wait's end applies.
   - While a second wait runs:
     - Fill colour, Reset and One colour: the line stays LINE_WAITING and Cancel stays (guards at :111 and :229).
     - The wait's end sets the line. On rows the match is applied over `styleRef.current` (:210) with the counts line (:213). Otherwise one of the lines at :206, :207 or :209 is shown.
     - Cancel sets "Cancelled. Nothing was applied." (:221).
     - Open, same key: dispose → cancel → phase cancelled → the outcome sets the cancelled line (:206), and :205 hides Cancel.
     - Open, another key: unmount → abandon (:104).
   - This matches ADV-2026-11-18-04 item 3 and ADV-2026-11-18-08 items 1 and 3.
   - No new path of the same kind:
     - LINE_WAITING is set only at :201, with waitRef set at :199.
     - waitRef and `waiting` are set together (:199-200) and cleared together (:204-205, :218-220). So no waiting line is left without a wait, and no line says the panel waits when nothing waits.
     - The only outside end I found is the same-key admit. The other style dispatches I found are the panel's own (App.tsx:2033-2036), and transit's callers at :1979-2006 are tool, mode, click, pin and selection. clickEffect is unread.
2. What the fix adds.
   - PB-U16: (a) and (b) are each preceded by an assertion that the line contains "Coloured by tag", so neither passes vacuously. In (b) the scope is reused and no wait runs.
   - PB-U17:
     - (a) asserts the waiting line and Cancel after the Fill colour change, and the fill colour and match of the wait's apply (this rests on :210).
     - (b) asserts the waiting line after Reset, then Cancel's line, no edits, and cancel("sh_3").
     - (d) asserts One colour's null match, the waiting line, then the re-apply.
     - (c) asserts the cancelled line, no Cancel, no edits or viewport_query, and cancel("sh_7"). (c) does not test the wait guard: under (ii) it still passes, as the worker states. Its claim is the open's outcome, which it does test.
   - Each assertion would fail if its claim were false.
   - The mutation diffs are the changes the test comments describe: (i) at :222, (ii) and (iii) at :241-242 at H2. The run logs fail at the cases the comments name: (i) at PB-U16 (a), (ii) at PB-U17 (a), (iii) at PB-U17 (d).
   - ADV-2026-11-18-08 item 4: PB-U16 (b) is not covered by another recorded mutation. Part 1 item 3 (one mutation per new or changed test) is met, so this does not block.
   - Proposed for the reviewer: (i′), the flag put back but set only in handleReset, which should fail at PB-U16 (b); and (iv), `setLine(null)` in handleReset, which should fail at PB-U17 "(b) after Reset during the wait". Both are my predictions, not observed.
3. D-1, D-2 and D-3: each is my words exactly.
   - D-1 at tableSource.ts:44 at H2: the whole sentence is my words. The widened region equals them.
   - D-2 at StylePanel.tsx:103 at H2: my words end with the only full stop.
   - D-3 at App.tsx:2054 at H2.
4. Amendment 28, clause by clause:
   - The opening sentence fails narrowly (D-B).
   - The rule bullet fails for the open (D-C).
   - The outcome bullet holds (:206-213).
   - The open bullet holds (App.tsx:1451-1452, tableSource.ts:195-197, App.tsx:2505, StylePanel.tsx:104).
   - The same-key line holds. It has no product caller (skp.rs:1120 and handles.rs:19-23 at H2). The effect itself has product callers (Fill colour, Reset), so the caller rule is met.
   - The tests bullet holds.
   - The Mutations bullet and the mutation (i) line hold, apart from the numbering (D-D).
   - The amendment was first drafted before the code (the first worker report's step 1) and rewritten after e00d7b1f. That is within Part 1 item 1 as ADV-2026-11-18-04 item 3 orders.
5. Discharge claims and verbatim quotes:
   - The three commit messages (<S>/s327e-msg1.txt, -msg2.txt, -msg3.txt) and the added comments carry no "done" or "discharged" clause, and no passage marked as the human's, the advisor's or a doc's.
   - msg2's "taken byte for byte" holds by my reading (check 3).
   - msg3's "No other behaviour changes" holds: one line, StylePanel.tsx:229.
   - msg1's open clause is O-3.
   - Part 1 items 1-9 against the added comments: no finding beyond D-A.

**Drafts for the advisor** (mine, not the human's words)

- E. One point to confirm, not a finding. A Reset or One colour clicked during a running wait does not stop it: when the rows arrive, the match is applied over the style as it then is. Amendment 28's outcome bullet says this; ADV-2026-11-18-08 rules only the line. Draft sentence for the form, if the advisor confirms: "A Reset or One colour during a running Colour by wait does not stop it: when the rows arrive the match is applied over the style as it then is; Cancel stops the wait."
  - Clause check (at H2):
    - "does not stop it": handleReset (:232-236) and handleOneColour (:224-230) leave waitRef alone.
    - "applied over the style as it then is": :210 (`styleRef.current`).
    - "Cancel stops the wait": :216-222 and categoryCases.ts:68-70.
