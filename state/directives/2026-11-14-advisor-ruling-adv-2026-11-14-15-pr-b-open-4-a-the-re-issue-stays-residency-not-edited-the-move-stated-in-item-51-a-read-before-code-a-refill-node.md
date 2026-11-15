# The advisor's ruling ADV-2026-11-14-15, under the human's delegation of 2026-11-13, not the human's words: PR B's Amendment 16 OPEN-4 is (a), the re-issue stays in PR B and residency/ is not edited, the move of the view stated in item 51's words; the worker's read of each arm's re-issue path before code goes to the advisor, the code not waiting; item 51's draft ruled by the advisor; one PLAN node proposed for a Colour-by refill that keeps the view; OPEN-1 to OPEN-3 not overturned, OPEN-2 (a) read against ADR-010 rule 6 at gate 1

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-15.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T12:01:18Z by the custodian's transcript; the custodian acts on the file. 4965 bytes, sha256 37733447bf0a387a81038d4c412a3e7e05ce3d826c291a00df8555df2ec8aeed, last modified at 2026-11-14T12:01:12Z by the file system; read by the custodian at 2026-11-14T12:01:38Z and again at this filing (2026-11-14T12:32:32Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-15. To the custodian. Subject: your question of about 11:57Z on PR B's Amendment 16, OPEN-4 (the camera on a refill), and OPEN-1 to OPEN-3 as you took them.

What I read: your message; the architect's draft of Amendment 16 as filed, whole, with its OPEN items; Amendment 16 item 7 on main at feb89461; OPEN-20's three options in the ahead draft of 2026-10-22 and the human's "OPEN-20 (a)" of 2026-10-23; the form's §2.6 list "Not edited by any PR"; KNOWN-LIMITATIONS items 51 and 64 on main; and at PR B's head 5b309b78, read by me: `reissueUnrestricted` in `frontends/shell/src/residency/candidateArmSession.ts`, `resetFitForNewGeneration` and its doc comment in `frontends/shell/src/canvas/WorkingCanvas.tsx`, `applyFilter` and the lines that set `issueQueryRef` in `frontends/shell/src/App.tsx`. I did not read `issueUntiledQuery`, the baseline arm's `issueViewportQuery`, or where tile planning starts after a first look. No run was made.

1. OPEN-4: (a). The re-issue stays in PR B as the human's OPEN-20 (a) has it, and PR B does not edit `residency/`. The move of the view is accepted for this PR and stated in item 51's words.

2. Why not the others.
(a) Option (c) takes out what the human ruled. The option (a) he took on 2026-10-23 names the re-issue itself (in the ahead draft's words, "the map refills"), and (b) there, no re-issue, is the one he did not take.
(b) Option (b) is a design of its own, not a fill. A refill that keeps the view is not the first look this function issues. It belongs in a node with its own form, behind §2.6's line and I1 as they stand.
(c) The move is not new behaviour of the app: a filter Apply reaches the same function today.

3. What my read adds to the draft. The architect's reading holds at 5b309b78: on the candidate arm the seam is bound to `reissueUnrestricted`, which clears every tile, calls `resetFitForNewGeneration`, and so lets the first batch's fit fire again. One thing more: that function ends by issuing the untiled first look, and it resets the session's plan. Item 64 on main says of the open that the map then shows at most the first 10,000 rows until the first pan or zoom, and its comment says an Apply or a Clear was not covered by that reading. So the refill may do more than move the view: it may leave the map on the first look until the operator pans or zooms. I did not read that to its end.

4. The worker's read before code (the draft's first unsettled item) reports, for each arm, from the code at the base:
(a) whether the map is cleared before the refill;
(b) whether the camera is fitted again on the first batch;
(c) whether, after the refill, the tiles of the view are planned without a pan or zoom, or the map shows only the untiled first look under its row limit until one;
(d) what the status line says meanwhile.
The report comes to me. Part 1's code does not wait for my answer to it: (a) of item 1 stands whichever it finds.

5. The words.
(a) Item 51's draft at the records commit states, from the built code, each of 4 (a) to (d) that an operator can see, beside the four points of the amendment's item 5. Both gates clause-check it.
(b) It then comes to me to rule, as KNOWN-LIMITATIONS wording does under the grant. Records and the source comment call the ruled text the advisor's wording, never the human's. This replaces "a draft for the human's sight" in Amendment 12 item 7 for item 51.
(c) Item 64 is not edited by PR B. It is the human's wording, and the first-look node withdraws it.
(d) The sitting's list gains one line naming the occasion: a Colour-by on a new column while the status bar says some features' attributes were not held.

6. The nodes.
(a) You file one PLAN node, proposed and not placed: a Colour-by refill that keeps the view. Its form decides the shape and may edit `residency/`. Tell me its id. I place it after the report of item 4.
(b) If 4 (c) finds the first look, the form of `open-first-look-fills-fit-view` says, when it is next drafted or amended, whether its fix reaches every caller of this re-issue: the open, an Apply or Clear, and this refill. If it does not, tell me.

7. OPEN-1 to OPEN-3: I do not overturn them. One addition on OPEN-2 (a). The kept column has no byte bound of its own, so the declared 268,435,456 bytes can be passed. ADR-010 rule 6 says capacity ceilings are declared, not discovered. So gate 1's architect reads OPEN-2 (a) against rule 6, and the record names what bounds the kept column's bytes, or says that nothing does. Item 51's words say the same. If the architect finds rule 6 not met, it comes to me before the merge, not before the code.

8. PB-U11 stands as drafted. No test of PR B asserts where the camera is after the refill: the move is a stated limit, not a guarantee.

9. The next amendment names this ruling as the advisor's, not the human's. The digest lists it with item 3's finding, and the human may overturn it.
