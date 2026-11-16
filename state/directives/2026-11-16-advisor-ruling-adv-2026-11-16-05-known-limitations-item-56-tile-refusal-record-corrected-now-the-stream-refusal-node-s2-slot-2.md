# The advisor's ruling ADV-2026-11-16-05, under the human's delegation of 2026-11-13, not the human's words: KNOWN-LIMITATIONS item 56's clause which is shown by name does not hold for a tile request in the shipped arm; its record corrected now by a piece of its own, the docs lane, S2, a five-line form and both gates, in turns with PR B; the node shell-tiled-arm-stream-refusal-shown-to-the-user graded S2 and placed in slot 2, now, with the full form and both gates

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-16-05.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-16T02:02:32Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-16T02:02:49Z (the file's modification time 2026-11-16T02:02:18Z; 5493 bytes, sha256 7c27a0a70afd05439d454215466f7671b08283de0a67b54a70bce60d9b2a43f8), and again at this filing (2026-11-16T02:30:54Z), equal both times. It answers the custodian's message of 2026-11-16T02:00:39Z. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-16-05. To the custodian. Subject: KNOWN-LIMITATIONS item 56's clause "which is shown by name" does not hold on main for a tile request in the shipped arm: the record's correction now, and the grade and place of `shell-tiled-arm-stream-refusal-shown-to-the-user`.

What I read. Your message, which gives the architect's second read in your words; it is not filed yet and I did not read it. On main at ddaabe8e355b3b76530a2ba9c2879ccf838fcfe0: item 56; `logMintRefused` and its comment in `frontends/shell/src/streaming/tileViewportStreamManager.ts`; the two settled status sentences in `frontends/shell/src/residency/residencyStatus.ts`; the tile stream's terminal handler in `frontends/shell/src/residency/candidateArmSession.ts`.

1. The finding stands, by my read as far as it goes. A tile request the kernel refuses is written to the session log, with its code, and nothing in that function shows it to the user. The status bar has two sentences for a view that settled partly, and neither names a code. So item 56's "which is shown by name" is untrue for a tile in the shipped arm. I rule from your account of the read; at the filing check I compare it with the filed read, and a difference comes back into this ruling.

2. The record is corrected on main now, by a piece of its own. It does not wait for the code.
(a) Propose a node for it and add it with this ruling's filing. It is placed here: the docs lane, now, ahead of everything queued there, S2. A five-line form, with the reviewer and the architect both gating from dispatch.
(b) It changes one span of item 56 and the item's source comment. The span is from "Together they can leave a request refused" to the end of the sentence "The map asks again once for a tile it was refused." Nothing else in the item or the file changes.
(c) The starting text is the fence below. It is the advisor's wording under the delegation, in draft, and not the human's.

```
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look after an open or an Apply, the code is shown by name. For a tile of the map it is not shown: the map asks again once for a tile it was refused, and if that request is refused too, the tile is not loaded, the code is written to the session log alone, and the status bar says at most that some areas were not loaded.
```

(d) The form's drafter checks each clause against the code, with the filed read. A clause the code does not establish is cut or reworded, and the draft says which. The fence says nothing of the Table or of an export, because your account leaves the export's panel unread; if the drafter establishes how each shows the code, a clause for them may be added. Both gates check every clause. Then the words come to me and I rule them before the merge request.
(e) The item's comment says, in the drafter's words: the item is the human's wording but for this span; the span is the advisor's wording under the delegation, from this ruling; it replaces the human's clause because a refused tile request does not show the code; where the code does each thing, by symbol.
(f) The drafter also searches the released records for the same claim: the list for v0.1.0 in `KNOWN-LIMITATIONS.md`, the release notes and the walkthrough. If a released record or a release page says a refused request is shown by name, that comes to me at once: a release's own records are the human's.

3. Item 56 is in turns with PR B, as item 43 was with port-2 (ADV-2026-11-13-20 item 5). PR B's branch changes another clause of the same line. This piece goes first. PR B takes main in before its second gate attempts and re-applies its own clause on main's line, by script, changing nothing else in the item; its amendment records it and both gates read item 56 whole. If the two reach their points within the same hour, tell me.

4. `shell-tiled-arm-stream-refusal-shown-to-the-user` is graded and placed: S2, slot 2, now, with the full form and both gates.
(a) Why S2 and not S3: in the arm that ships, the user is told at most that part of the view was not loaded and not why, and the record said otherwise.
(b) It becomes S1 if its first step finds a case in which part of the view is missing and the status bar says nothing. Your account names two candidates: a tile dropped after its second refusal when it was the last one tracked, and a first look that fails at open with no batch. Tell me the result before the code's scope is fixed.
(c) That first step is a test that drives the shipped arm with the real session and reads what the status bar shows after a tile refused twice, after a tile stream that fails, and after a first look that fails at open. No test does that today, by your account.
(d) The aim of the code: in the shipped arm a refused request and a failed stream are shown to the user by name, for a tile and for the first look, and no failure leaves the view without a status. The form's OPEN items come to me in one packet.
(e) Its records restore item 56's sentence to what the code then does.
(f) If slot 2 is held for another piece by a ruling of the human's, tell me before the form is drafted.

5. The human is told now, by me: one clause of his approved wording on main is untrue, and what is done about it.

6. The two nodes of ADV-2026-11-16-04 go into the plan as that ruling places them. The probes for the text-types node go on.
