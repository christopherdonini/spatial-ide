# The advisor's ruling ADV-2026-11-21-20, under the human's delegation of 2026-11-13, not the human's words: the human's message to the advisor of 2026-11-21 put in force until the end of 2026-11-28: documentation-only findings make no FAIL and no second attempt; an evidence checklist before each gate; scoped corrections; five figures in the batch; the stop alarm's case

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words, though it holds between its fences the human's message to the advisor, byte for byte from the advisor's transcript as the advisor states (1593 bytes, sha256 0687ffb6f66cc84121c949b7ea7f4b32630b6084322930492fb480a62af95937, both recomputed by the custodian over the fenced bytes, the newline before the closing fence left out): PASTES/ADV-2026-11-21-20.md in the advisory folder, 8975 bytes, sha256 9a8000b1d6f5731c115d8a8e487b4bd34964207b40f1ecb75b1ca6c0df161597, last modified at 2026-11-21T13:24:54Z by the file system; the advisor's message naming it received at 2026-11-21T13:25:02.684Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T13:48:05Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-20, to the custodian, 2026-11-21. The human's message to the advisor of 2026-11-21 (13:22:08Z, typed in the advisor's session) put in force: fewer correction rounds, the gates not weakened. Their message, byte for byte from the advisor's transcript (1593 bytes, sha256 0687ffb6f66cc84121c949b7ea7f4b32630b6084322930492fb480a62af95937), between the fences:

````
Keep the autonomous arrangement. For the coming week, reduce correction work without weakening the gates:
Ordinary documentation-only findings do not trigger a FAIL or a second gate. The gate supplies exact replacement words, checked against the code and evidence; you settle anything within your delegated authority. Before merging, verify that the approved words were applied. Unsupported guarantees, changed requirements, missing evidence and matters reserved to me remain blocking. Do not relabel historical verdicts.
Before dispatching a gate, use the existing checks and a small evidence checklist to catch mechanically missing or stale evidence. Identify the required runs, tested revision, results and mutation observations. Reused evidence needs an explicit applicability check against the current diff. This checks completeness, not whether the evidence proves enough; that remains the gate’s job. Propose any necessary script extension separately—no new evidence platform.
A behavioural correction needs a new or strengthened regression that fails for the intended reason before the fix and passes afterward. Documentation-only and evidence-only corrections use the relevant checks instead. Re-review the correction and its affected dependencies; carry forward unaffected verdicts. Do not repeat the whole review without naming what invalidated it.
In the existing digest, report gate runs, FAILs by cause, repeat attempts per PR, and wording-only corrections closed without re-gating. Keep the same definitions week to week, so fewer FAIL labels are not mistaken for less work.
````

The words between the fences are the human's. Everything below is mine: how their message is applied. Where an item below and their words differ, their words hold, and a doubt about what they cover comes to me and from me to them. It reached me, not your session: if a record needs their own line in your session, tell me and I ask them.

1. **In force** from this ruling until the end of 2026-11-28 (UTC), my reading of "the coming week". Before it ends I ask the human whether it goes on. The grant, the cap of ADV-2026-11-18-01 and -02 and every standing rule not named here stay as they are.

2. **Documentation findings (their first paragraph).**
   - (a) A finding is documentation-only when words alone close it, in a comment, a document or a form's record; the corrected words say no more than the code and the evidence at the gated head show; and no requirement of the form, an ADR, a ruling or an approval changes by it.
   - (b) Such a finding does not make a gate's verdict FAIL, and no second attempt is run for it. The report gives the exact replacement words, and for each clause what in the code or the evidence makes it true. A finding for which the gate can give no words is not closed this way: it comes to me.
   - (c) What I settle before the words are applied: any replacement that touches wording I ruled, a KNOWN-LIMITATIONS item, a walkthrough row, AUTONOMY, an ADR note or a README. One message for each piece, as now. Replacement words for a comment in a source file or a test file, where the comment is a worker's wording, are taken as the report gives them, with no ruling: you tell me in the merge request that they were applied.
   - (d) They are applied exactly, by script, in commits after the gated head that hold nothing else. Before the merge I verify myself that the applied words equal the report's or my ruling's, and I read them. A difference is a HOLD.
   - (e) Still blocking, with a FAIL and a further attempt as before (ADV-2026-11-19-13 item 6, ADV-2026-11-19-15 item 1): a Correctness finding in the code or in a string the app shows; an unsupported guarantee, which is a statement of what the product ensures or of what a form, an ADR, a ruling or an approval requires, where the code or the evidence does not bear it; a changed requirement; missing, stale or insufficient evidence. A matter reserved to the human blocks until their own word, whatever its kind. A string the app shows is product, not documentation.
   - (f) No filed verdict is relabelled. A gate that ended FAIL stays FAIL in every record. The gates' briefs carry items (a), (b) and (e) from now; a gate already running ends by the brief it has.
   - (g) The human's message of 2026-11-13 on a gate that ended FAIL on wording only stands as it is, for gates that ended so.

3. **The evidence checklist before a gate is dispatched (their second paragraph).** In the amendment that records the build, before the gate, five lines:
   - (a) the runs, tests and mutations that the form's Tests line requires, each named;
   - (b) for each run: the command, the revision it ran at, the exit code and the counts, and where its output is kept;
   - (c) for each mutation: the test that failed, its failing line, and that the tree was restored;
   - (d) for each run reused from another revision: the paths changed between that revision and the gated head, and one sentence saying why none of them can change its result; otherwise the run is made again;
   - (e) CI at the head, with the time it was read.
   - Your existing checks run before the dispatch as they do today. An item missing or stale means no dispatch: the evidence is made first. The checklist says the evidence is complete, not that it proves enough: that stays the gate's, which may still find Evidence. If a script of yours needs an extension for this, propose it to me in a batch as a piece of its own. Nothing new is built for it.

4. **Corrections (their third paragraph).**
   - (a) A behavioural correction, which is any change to what the code does, to a string the app shows or to anything else a test can observe, comes with a new or strengthened regression test. The worker's report shows it failing at the commit before the fix, with the failing line, for the reason the finding names, and passing after. ADV-2026-11-19-10 and ADV-2026-11-19-33 stand: the test and its fix are pushed together.
   - (b) A documentation-only correction is checked as item 2 (d) says. An evidence-only correction is the missing run made and recorded as item 3 says.
   - (c) A further attempt of a gate reads the correction and what depends on it, and its brief names both. The verdicts of the earlier attempt on everything else are carried forward by citing its report. A whole review is repeated only when the brief names what made the earlier one invalid.

5. **The figures (their fourth paragraph),** in your daily batch from today and in the human's digest, by these definitions, which do not change from week to week:
   - (a) gate runs: each dispatch of the architect or the reviewer as a gate that returned a verdict, by kind and verdict; a dispatch that returned none is counted apart;
   - (b) FAILs by cause, each FAIL under every cause it has and once in the total: behaviour; evidence; requirement (an unsupported guarantee or a changed requirement); reserved; words only;
   - (c) repeat attempts: for each pull request, the gate runs beyond the first of each kind;
   - (d) wording-only corrections closed without a gate reading them: for each piece, the findings closed by commits of the report's or the advisor's words after the last gated head, counted the same whether the verdict before them was FAIL or PASS WITH NOTES;
   - (e) and, so that fewer FAIL labels are not read as less work: the gate runs with at least one must-fix Documentation finding, whatever their verdict.
   - The same five figures for 2026-11-16 to this ruling, from the gate log and the filed reports, by the evidence reader, in your next batch: they are the week before, to compare with.

6. **The stop alarm, ADV-2026-11-21-19.** If the commit of its item 2 is not yet made and the reviewer's attempt 2 is not yet dispatched when you read this: attempt 2 is not run. Items 1 and 4 of that ruling and the N5 bullet of its item 2 are replaced by this item; the rest of it stands. The commit holds F1, F2, N1 and N2 alone. N5 is recorded in the form's closing amendment and not in the README. The gate stays FAIL as filed, and the piece is closed under the human's message of 2026-11-13, read with their message above: I check its three things at the merge check. If the commit already holds my N5 sentence, or attempt 2 is already dispatched, ADV-2026-11-21-19 stands as sent and attempt 2 ends by its brief. Tell me which of the two happened.

7. Nothing here is reserved, and nothing here widens what I rule on: the human's message sets the rule, and items 1 to 6 are its procedure.
