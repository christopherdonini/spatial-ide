# The advisor's ruling ADV-2026-11-16-09, under the human's delegation of 2026-11-13, not the human's words: KNOWN-LIMITATIONS item 56, PR 328, the words after the reviewer's gate: C1 stands; four pairs, applied exactly in one commit; the optional words on a partly loaded tile not added; case C and the queue-full case of D4 to the stream-refusal node; the released records clear

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3): PASTES/ADV-2026-11-16-09.md, received 2026-11-16T04:40:07Z, read 2026-11-16T04:40:40Z, 3887 bytes, sha256 ca72cbb48e3cbc96d7174764c99c2d7af6226259bec9396d5e0bbfcc5e42b02a.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-16-09. To the custodian. Subject: KNOWN-LIMITATIONS item 56, PR 328 at 6f98980e9a9fc77b28a577a61b0852544817c4bb: the words after the reviewer's gate (gate-log row 767, FAIL on words only).

What I read. On main at a9ef4f3c351b4eb0742abaa92887773fe81ff871: the reviewer's gate report, whole. At the PR's head: lines 481 and 482 of `KNOWN-LIMITATIONS.md`; the status sentences in `frontends/shell/src/residency/residencyStatus.ts`; the requeue test in `frontends/shell/src/streaming/tileViewportStreamManager.ts`.

1. C1 stands, by my own read. When a view settles partly and is over budget, the status bar's sentence says areas are not drawn to stay within the render budget and that the render budget is full. So "at most that some areas were not loaded" is untrue as I worded it. The words are the reviewer's replacement, which the gate checked clause by clause.

2. The worker makes four replacements on the branch, each old text found exactly once, in one commit, and changes nothing else. Old and new are the fences below, in pairs.

Pair 1, in the item's paragraph. Old:

```
and the status bar says at most that some areas were not loaded.
```

New:

```
and the status bar never names it: at most it says that some areas were not loaded, or that areas are not drawn to stay within the render budget.
```

Pair 2, in the item's comment. Old:

```
(draft checked against the code at the branch's head; nothing in it cut)
```

New:

```
(draft checked against the code at the branch's head; its last clause, on the status bar, is as ADV-2026-11-16-09 rules it after the reviewer's finding C1)
```

Pair 3, in the item's comment: the reviewer's D1, D2 and D4 together. Old:

```
The Table and an export are not said to show the code in the span: the export panel's path was not established to. The rest of this comment is the human's approved wording as it stood. Approved in
```

New:

```
The span says nothing of the Table or of an export: how the export panel shows the code was not established. Not covered (§31c): a tile refused just after a pan has filled the map's queue (MAX_QUEUED_TILES, in mintAndStart's requeue test) is not asked for again; that needs a camera change inside the refused request's round trip. The rest of this comment stands as it was before this change: the item's wording was approved in
```

Pair 4, in the item's comment: the reviewer's D3. Old:

```
through reportViewportOutcome and formatRefusal in App.tsx
```

New:

```
through reportViewportOutcome in App.tsx and formatRefusal (frontends/shell/src/admission/formatRefusal.ts)
```

3. The reviewer's optional words on a tile already partly loaded are not added. "The tile is not loaded" stands in its plain reading.

4. The span is the advisor's wording under the delegation, as ruled here and in ADV-2026-11-16-05. The rest of the item is the human's and unchanged.

5. Closing. The gate's only blocking finding was wording. With the four pairs applied exactly and nothing else changed after 6f98980e, the form records the closing, the PR body lists the four pairs, and the merge request follows. I check those three things myself at the merge check.

6. For `shell-tiled-arm-stream-refusal-shown-to-the-user`, from the same report. Its test step, now running, also reads what the status bar says when a tile is refused twice while the view is over budget: by the reviewer's read the bar then gives the render budget as the reason for a tile that was refused. If the tester's brief cannot take it now, it is the first line of the node's next step. The queue-full case of D4 is recorded in the node's notes.

7. The released records: clear. The reviewer's check and my read of the v0.1 release record's line agree that none says a refused request is shown by name. Nothing of ADV-2026-11-16-05 item 2 (f) goes to the human.
