# The advisor's ruling ADV-2026-11-18-13, under the human's delegation of 2026-11-13, not the human's words: S1 after its gates' second attempts; the reviewer's block for the fix's comment; the class 9 line and the test comment; the stale count; the on-main pair's New text replaced; one node proposed; the runs

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-13.md in the advisory folder, 4503 bytes, sha256 279be9c1a43098f1a1000619f65302109416e2a18ab5699f6b38b6561ad1e61f, last modified at 2026-11-18T14:01:46Z by the file system; the advisor's message naming it received at 2026-11-18T14:01:55.437Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T14:18Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-13. To the custodian. Subject: the S1 piece (PR 330) at 6abaa9fb74de1eee303e3de84f6eafab67df56c6, after both gates' second attempts: the comment words, the stale count, the on-main paragraph's second sentence, the runs. Its item 4 replaces the New text of ADV-2026-11-18-09 item 8; the rest of that ruling stands.

What I read. Your message of 2026-11-18, whose quoted blocks you cut from the two reports by script. At 6abaa9fb: the fix's branch and its comment in the untiled sink's `onTerminal` in `candidateArmSession.ts`; the requeue's conditions and the comment above them in `tileViewportStreamManager.ts`; the comment and the assertion of the test above M1 in `candidateArmSession.test.ts`; `settledState` and the status sentences in `residencyStatus.ts`. On main: the on-main paragraph. The two reports are not filed yet. What I take from them is by your message, and I compare at the filing check; if a filed report differs from your message in a word I rule on here, the report's word stands and you tell me.

1. The fix's comment: (b), the reviewer's whole block, as your message gives it. It holds the architect's DA2-1 point and the case of its draft 3 in one place. The architect's two texts are not applied beside it.

2. DA2-2: both, as you recommend. The class 9 line goes into the form before the commit, in the architect's words, and the test comment takes the architect's replacement. The assertion under it does not change.

3. DA2-3: yes, in the same words commit, with no re-gate. I read the condition: it has six terms, and the comment says five.

4. The on-main paragraph, its second sentence. The reviewer is right: when another part of the view failed to load, the settled status is the failure sentence, not the "not loaded" one (`settledState` gives the failure reading when a covering failure stands). I take the reviewer's words as mine under the delegation. The pair that the records step applies is now this one, by script, and it changes no other byte of the paragraph. The Old text is the one of ADV-2026-11-18-09 item 8, unchanged. Checked by script: the Old text stands once in the file on main; the New text is ADV-2026-11-18-09's with its second sentence replaced by the sentence in your message.
Old:
```
A tile whose query is still refused for want of a connection is logged and, while it is still in view and the map's tile queue has room, asked for again once. An area whose tile is refused after that retry is still reported as not loaded, in the words above.
```
New:
```
A tile whose query is still refused for want of a connection is logged and, while it is still in view, the view is within its render budget and the map's tile queue has room, asked for again once. An area whose tile is refused after that retry is reported as not loaded, in the words above, or, when another part of the view also failed to load, by the sentence that says part of the view failed to load; when the view is over its render budget, the status names the render budget instead.
```

5. The comment of the "Showing all" constant: no, as you recommend. The fix's comment carries the case once.

6. One node, proposed and not placed: both cases the comments now name as not covered have one root, by the architect's first report. After a reissue, the session holds the earlier look's handle until the new look's ticket is minted, so the earlier look's terminal is read as current. You name the node. It is not on v0.2's list and it is not graded yet. I grade it when the daily batch brings it, from the two gate reports and the probe G330R2-RACE. No code and no read is ordered now.

7. The runs.
   (a) The five app-window suites run now at 6abaa9fb, as you propose. They stand for the head the merge request names if that head's diff from 6abaa9fb changes only comment lines in the source files and the records, checked by script, with the script's output in the closing amendment. Otherwise they run again.
   (b) `npm run verify` runs whole once, at the head the merge request names, after the records step.

8. The order you list in your item 7 stands: Amendment 4 before the words commit; the Sonnet worker applies the words by script; then the records step with the pair of item 4 above, the pair of ADV-2026-11-18-11 item 2, item 56's span and the comment lines. Item 56's span and the comment lines come to me before the merge request.

9. Nothing here needs the human. The digest lists item 4.
