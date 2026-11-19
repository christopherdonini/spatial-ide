# The advisor's ruling ADV-2026-11-18-28, under the human's delegation of 2026-11-13, not the human's words: the first look's words: KNOWN-LIMITATIONS items 64 and 51 and five places of the manual walkthrough, nine Old and New pairs applied by script in one commit; both gates check every clause; four rows join the operator sitting queue

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-28.md in the advisory folder, 12244 bytes, sha256 bc575d2d3b0995476e8d533d44a3cd493a4d73591be530e76fbf1b0ba064784b, last modified at 2026-11-18T23:53:07Z by the file system; the advisor's message naming it received at 2026-11-18T23:53:14.629Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T23:58:54Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-28. To the custodian. Subject: the first look's words: KNOWN-LIMITATIONS items 64 and 51, and five places of the manual walkthrough (ADV-2026-11-13-02 item 2 (b); the form's section 10.1 and 10.2).

What I read. The worker's uncommitted drafts in the piece's worktree, against both files at 47693664. The form's sections 2.5, 3 and 10. Items 18, 51 and 61 of KNOWN-LIMITATIONS. S7's E-FL lines. Each Old text below occurs once in its file at 47693664; a script checked it.

1. These words replace the worker's drafts. They are applied by script, pair by pair, in one commit of the two files. A pair whose Old text is not found once is a stop.

2. Why the drafts are not taken as they are.
   (a) Item 64 said "ends" where a failed or cancelled first look plans nothing: "completes". It said the view fills "as far as the render budget allows", which leaves out a truncated view: the clause goes, and the status sentence carries it.
   (b) The walkthrough drafts kept expectations that were sighted on the strip view while saying that Zoom to layer no longer frames the strip. Nothing after Zoom to layer has been sighted on that fixture since the change. The rows now say what changed by reading, keep what was sighted as sighted before the change, and leave the rest to the next sitting.
   (c) By KNOWN-LIMITATIONS item 61 the open fits the first batch that carries geometry, not the strip. The strip note no longer says the open fits the strip.

3. KNOWN-LIMITATIONS.md, four pairs.

K1, item 51's text. Old:
````
, the map is cleared, the view moves to fit the first features that arrive, and the map then shows at most the first 10,000 rows the file returns under the filter, until the next pan or zoom; the status bar still says
````
New:
````
, the map is cleared and the view moves to fit the first features that arrive; the status bar still says
````

K2, item 51's comment. Old:
````
The clause on the first 10,000 rows goes when the first-look node (open-first-look-fills-fit-view) merges, with item 64's words (ADV-2026-11-14-18 item 4).
````
New:
````
The clause on the first 10,000 rows went with item 64's words, in open-first-look-fills-fit-view (ADV-2026-11-14-18 item 4; ADV-2026-11-18-28).
````

K3, item 64's line, whole. Old:
````
64. **After a file opens, until the first pan or zoom, the map shows at most the first 10,000 rows the file returns, and the status line says nothing about it.**
````
New:
````
64. **Retired by open-first-look-fills-fit-view.** When the first data load of an open completes, the map asks for the tiles of the view it then shows, with no pan or zoom. When that filling settles, the status line says whether everything in view is shown. The number is kept so that references to it still resolve.
````

K4, item 64's comment line, whole. Old:
````
    <!-- The human's wording, approved in their message of 2026-11-12 (21:15Z), item 3 (b) (state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:15); the number is the next after item 63. open-first-look-fills-fit-view withdraws this item when it merges (the same item 3 (b)). Where the code does this, at the base: frontends/shell/src/canvas/WorkingCanvas.tsx:1426-1436 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:4e950f29d68ce12589f5617a916ac2e9337fff10604903513f53a4b24d4ea171 (the open's fit moves the camera and reports no viewport); frontends/shell/src/residency/candidateArmSession.ts:68-79 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320 (tile planning starts at the first viewport report, a real pan or zoom); frontends/shell/src/canvas/WorkingCanvas.tsx:1595-1610 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:db124d8ee357eca7b6e7f5a1cf1b9379183a438dee3e598a968be1a266b30274 (Zoom to layer reports one, so it counts as a zoom); frontends/shell/src/canvas/tileGridConstants.ts:185 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:61c4f5a8d589f14a8f542eb00fe28e216fb08f39d63081b68417f3e95da2996b (the untiled first look's row limit, 10,000); engine/src/stream.rs:1718-1725 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:15d970a4039ffe0e07a53040cf8825598908bd8305f965ae76f7f51c6f620515 (that query has no filter and no order, so its rows are the first the scan returns); frontends/shell/src/residency/residencyStatus.ts:330-336 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:3d84bc8cf37f351430d098d1e8748565cb62683776c6a13afb70d34299d28400 and frontends/shell/src/residency/candidateArmSession.ts:839-845 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:57c9a2f7bc7220a4d4595b915d54d2d0c1d9ebb6505c0f53010e0c5c42f2e646 (the residency status is not set before a plan has run, unless the first look's rows pass the render budget or the operator presses Cancel); frontends/shell/src/App.tsx:2418-2423 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:1cb373bcf44931cb824ae02f0dd5f2be90a9656d2659e5630c562da0a9a1ae07 (the status line shows the residency status only when it is set). Not covered: an Apply or a Clear, which the reading behind this item did not reach. A timing case, named under AUTONOMY §31 (c): a pan or zoom whose viewport report arrives before the first look's query has ended plans no tiles, because the grid frame is set only when that query ends (frontends/shell/src/streaming/tileViewportStreamManager.ts:518 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:cf3ebe08ef1d0ad21476b499ee3875f1126924bd59ebd65fc262fcf4248f1ac2; frontends/shell/src/residency/candidateArmSession.ts:1408-1410 @ bb8835c6701826f38030c51a095a8f83e7a3c52a sha256:2dabb9ae1075327efa077c0a839a0ac13727faff30f6d06556b464e901287ab1), and nothing plans when it ends, so the map keeps showing the first look's rows until the next pan or zoom. A pan or zoom reported less than the viewport debounce (VIEWPORT_QUERY_MIN_INTERVAL_MS, 120 ms) before that query ends is handled after it ends and plans tiles. -->
````
New:
````
    <!-- The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in ADV-2026-11-18-28, in the retirement form of item 18 (ADV-2026-11-13-02 item 2). The former item was the human's wording of 2026-11-12, item 3 (b) (state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md), which this node withdraws. Where the code does each clause, by symbol: the first look's Completed terminal plans the shown box, by calling handleViewportChange from the untiled sink in issueUntiledQuery, in frontends/shell/src/residency/candidateArmSession.ts, and the box is shownViewportBbox in frontends/shell/src/canvas/WorkingCanvas.tsx (the camera last written); no input is needed (e2e/open-fills-fit-view.mjs, check (a)); the render budget and its over-budget path are the plan's, and the sentence at the settle is settledState and residencyStatusText in frontends/shell/src/residency/residencyStatus.ts, sent through emitResidencyStatus in candidateArmSession.ts. Not covered, from section 3 of the form: a view over the render budget or truncated, where the partial sentences speak instead of the complete one; a failed first look, after which this change plans nothing (the failure's own sentences, from the step before this one, speak); a Cancel during the first look, after which no plan runs until the next pan or zoom and the Cancel's own status speaks; the status line saying nothing during the fill; an over-budget sentence from the first look standing during the fill; and a timing case named under AUTONOMY section 31 (c): a look's Completed terminal that arrives after a reissue but before the new look's ticket is minted is read as current, and can plan the pre-fit view under the new filter (untiled-reissue-holds-earlier-look-handle-until-mint). -->
````

In K4 the opening words are those of item 51's comment and the rest, from "Where the code does each clause", is the worker's draft unchanged.

4. frontends/shell/MANUAL-WALKTHROUGH.md, five pairs.

W1, Part L's strip note, three lines. Old:
````
the candidate arm's 10,000-row first look is a bottom STRIP of the layer, and "Zoom to layer" fits
that strip (the fit anchor is the union of what has rendered — DECISIONS-PENDING entry 42), not the
dataset. Every "at fit" expectation below means that strip view.
````
New:
````
the candidate arm's 10,000-row first look is a bottom STRIP of the layer. Since
open-first-look-fills-fit-view the open, when that first look completes, asks for the tiles of the view
it then shows, with no pan or zoom. "Zoom to layer" fits the union of what the map has held (the fit
anchor — DECISIONS-PENDING entry 42; KNOWN-LIMITATIONS item 61), not the dataset: after the open's fill
that is the strip and the tiles that fill loaded, which can be more than the strip. The rows below were
sighted when "at fit" meant the strip view; what they expect at fit is not sighted again since that change.
````

W2, L1. Old:
````
let the whole fill run to quiescence WITHOUT touching Cancel. | The button fits the rendered strip
````
New:
````
let the whole fill run to quiescence WITHOUT touching Cancel. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** The open now asks for the tiles of its own view when the first look completes, so tiles arrive, and that fill settles with a status sentence, before you click anything. Zoom to layer then frames the strip and the tiles the open's fill loaded, which can be more than the strip view this row was sighted on. Whether that view's covering set fits the render budget, and so which sentence speaks at its settle, is for the next sitting to record. **As sighted before the change:** The button fits the rendered strip
````

W3, L2. Old:
````
reopen the fixture, click **Zoom to layer** again — and this time
````
New:
````
reopen the fixture, click **Zoom to layer** again (**[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** tiles of the open's own fill arrive before the click, and the fill after the click can be shorter than it was, because the open's fill has loaded part of that view) — and this time
````

W4, L5. Old:
````
reopen, Zoom to layer) and watch the status line DURING the fill. | **[CORRECTED 2026-09-07
````
New:
````
reopen, Zoom to layer) and watch the status line DURING the fill. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** The open's own fill now runs and settles first, and its status sentence shows before the click. What this row expects is for the fill after the click. **[CORRECTED 2026-09-07
````

W5, A7. Old:
````
 — the same fit A4 produced, deterministically, regardless of what is currently loaded. |
````
New:
````
: the union of everything the map has held since the open (KNOWN-LIMITATIONS item 61). That includes the tiles the open's own fill loaded and anything loaded while you panned, so it can frame more than A4's fit. |
````

5. Both gates check every clause of these words against the code at the head. A clause a gate finds untrue is a Documentation finding with its replacement words, and it comes to me. K4's list of where the code does each clause, and its cases not covered, are the worker's and are checked the same way.

6. L1, L2, L5 and A7 join `operator-sitting-queue` as rows not sighted since this change.

7. The two readings. FIND's durations (21,603 ms at the base and 17,366 ms at the head in `filter-panel.mjs`; 29,050 ms and 39,473 ms in `regression.mjs`) go in the closing as read, one run each on a shared laptop, with no timing claim. Where the fill's lines fell against PC-E4's mark goes in the closing as an inference from the session log's times, in those words. Neither changes anything ruled.

8. The README's entries wait for Amendment 3, as ADV-2026-11-18-27 item 8 (b) says. Nothing here needs the human.
