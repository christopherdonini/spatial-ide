# The human's message of 2026-11-16 (07:53Z): the advisor's drafts ADV-2026-11-16-19 (v0.1.0's records: two dated notes and one release page paragraph), ADV-2026-11-16-07 (what v0.2 waits for), ADV-2026-11-16-08 (the queue in the machine script), ADV-2026-11-15-04 (a one-off timer for the two-hour alarm) and ADV-2026-11-15-07 (the limits of the advisor's merges) approved

*Filed verbatim by the custodian from the session transcript: the human's message is the user record of 2026-11-16T07:53:13.193Z (UTC), origin human, after its queue record (enqueue) at 2026-11-16T07:53:13.080Z; 134 bytes, sha256 33c3f39e2c71bd49d234e8e2cd8c26edaa98cf7a8fcfb026cd8a9e613d61334e, byte-copied by script, with one final newline added. The message approves five drafts in the human's advisory folder, by the grant's item 4 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`): PASTES/ADV-2026-11-16-19.md (3312 bytes, sha256 e5a60815a04bc44784dd296be313e26d58d66905102dced3d6838ab1a9742cac, last modified at 2026-11-16T06:53:39Z by the file system); PASTES/ADV-2026-11-16-07.md (1306 bytes, sha256 6197cccde5b5a248933aafa9f49f1b5cc1be6fd38881634d4db34ae5755cc288, last modified at 2026-11-16T03:40:54Z by the file system); PASTES/ADV-2026-11-16-08.md (1947 bytes, sha256 bc130dfd4139a31b4cb564cf255cca2072e30b0b8571fcd2eff6240d931e38a3, last modified at 2026-11-16T04:35:21Z by the file system); PASTES/ADV-2026-11-15-04.md (1655 bytes, sha256 9978dc828fc5fca36e817939caa8ab4c85b64b64381314e61b0e8068269af0cb, last modified at 2026-11-15T01:37:07Z by the file system); PASTES/ADV-2026-11-15-07.md (1523 bytes, sha256 f6b86f986a9c2d513c9461dd0ab09c2217536750eeb955b039bc05be21f1e8ce, last modified at 2026-11-15T03:55:14Z by the file system); each modified before the approval and read again by the custodian at this filing (2026-11-16T08:00:40Z), equal to its filing on main. Their texts follow the message, each below its own rule, byte for byte. By the approval each draft's text is the human's words. Nothing is changed. The custodian's note, not the human's words: the folder's place on the machine is not written here.*

---

approved ADV-2026-11-16-19
approved ADV-2026-11-16-07
approved ADV-2026-11-16-08
approved ADV-2026-11-15-04
approved ADV-2026-11-15-07

---

Draft for Chris's approval.

Id: ADV-2026-11-16-19. It replaces the draft ADV-2026-11-16-17, which is withdrawn, as ADV-2026-11-16-14 was.

To the custodian, 2026-11-16. v0.1.0's records, after the two silent cases found on 2026-11-16.

1. The tag v0.1.0 and its message stay as they are. No released sentence is edited or removed.

2. `KNOWN-LIMITATIONS.md` on main gains two dated notes in its v0.1.0 list, in the form of the corrections of 2026-10-10 and 2026-11-06, each followed by a comment that says the words are mine, approved here. The first goes directly after the text of the paragraph that begins "Under a row filter at wide zooms" and before that paragraph's source comment, where the earlier corrections sit:

```
*Corrected 2026-11-16: this paragraph says the status then reports those areas as not loaded. That is not always so in v0.1.0. In some cases, for example when the refused area is the last thing still loading, the status does not change: it stays empty, or keeps the sentence it showed for the view before, and Cancel can stay up in the filter panel. When the view is over its render budget, the status names the render budget instead.*
```

The second goes at the end of the v0.1.0 list:

```
*Found 2026-11-16, true of v0.1.0: when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, nothing from that request is drawn and nothing on screen says it failed. After an open the map stays empty, and panning or zooming loads nothing. After a filter the map is cleared, and the filter panel can still show the filter as applied. To ask again, repeat the step: open the file again, or apply or clear the filter again. Found by reading v0.1.0's code; not reproduced in the v0.1.0 installer.*
```

3. The v0.1.0 release page gains one paragraph, placed after the paragraph that begins "Corrections after release, 2026-10-12." and before the rule that follows it:

```
Corrections after release, 2026-11-16. [KNOWN-LIMITATIONS](https://github.com/christopherdonini/spatial-ide/blob/main/KNOWN-LIMITATIONS.md) on main now states two more things this version's notes did not: the status does not always report a refused area of the map as not loaded; and when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives, the map is left empty or cleared, with nothing on screen saying that it failed. Both apply to this version. If the map is empty or has gaps and nothing says why, try a pan or a zoom in, applying the filter again, or opening the file again.
```

4. Before anything is posted, the reviewer checks each clause of the three texts against the code at the tag, reading only. If a clause fails, nothing is posted and it comes back to the advisor and to me.

5. The order. First the file on main, by a docs piece of its own with the short form and the reviewer, which the advisor merges; nothing else in the file changes. Only after that merge the page: you put the paragraph in at that place, once, changing no other byte of the page's text, and read the page back. If your Guardian refuses, stop and tell the advisor; I then do it myself.

6. v0.2's notes say of each case whether v0.2 fixes it. Those notes stay mine.

---

Draft for Chris's approval.

Id: ADV-2026-11-16-07.

To the custodian, 2026-11-16. What v0.2 waits for.

1. v0.2 waits for these, and for nothing else on the plan.
(a) `b1-shell-half`: PR B, colour by category.
(b) `b2-piece-1c-save-and-reopen`, its step 2: the reopen. Step 3, the recovery offer after a crash, is not in v0.2. Split it into a node of its own. Item 43 of the limitations stays as it is.
(c) `record-step-style-match-widening`, which closes when step 2 merges.
(d) `open-first-look-fills-fit-view`: the first-look fix.
(e) `session-log-token-redaction-rests-on-page-code`, after the reopen.
(f) `known-limitations-item-56-tile-refusal-record`: the limitation says what the app does.
(g) One sitting with me at the end: `operator-sitting-queue` and `sitting-wording-n1-to-n7`. `entry-79-b1-consult-items` is at the same sitting if it needs nothing but my acceptance. If it needs work, tell the advisor and it waits until after v0.2.

2. `shell-tiled-arm-stream-refusal-shown-to-the-user` joins the list only if its test shows that part of the map can be missing with nothing said. Otherwise it waits, and limitation 56 says how it is.

3. The twelve dependencies already done stay as they are. Nothing is added to the list without my word. The tag, the notes and the release page stay mine.

---

Draft for Chris's approval.

Id: ADV-2026-11-16-08.

To the custodian, 2026-11-16. The queue in the machine script, from item 4 of my directive of 2026-11-16.

1. I approve the queue as you drafted and tried it: the draft script whose sha256 is 5d2a695dc9eeded270fb932c7d6c4427a82e974b659544b0ba8924b2f8c70a72, made from the live script whose sha256 is 6826d814d961e3e15fadd9f9a79c6e0d5f7c695fad5a09e878376e9e9f33ea2b. A project whose entry in the machine's config says "turns": true has its shared requests run one at a time, in order of arrival, waiting inside the script. A project without it runs as today. Exclusive requests are as today.

2. Unless I say with my approval that I do it myself, you put it in place, once:
(a) at the first moment the script's status shows no hold and no waiting place of any project;
(b) only if the live script still has the sha256 above, and its difference from the draft is the change you filed and nothing else;
(c) by writing the draft beside the script and renaming it over the script, so that no run reads half a file;
(d) then the live script has the draft's sha256, read back;
(e) then you set "turns": true in SpatialIDE's entry of the config. No other entry and no other field changes.
You write nothing else in the machine's folder, now or later. A later change to the script or the config needs my word again.

3. If the first hold after that does not behave as your cases did, put the old script and the old entry back by the same steps, and tell the advisor.

4. From then, a brief's hold is one call that waits in the script. The status read before a hold and the re-read after it, from the advisor's ruling ADV-2026-11-15-17 item 4, stop. Each day you read the machine log's hold lines of this project; if two of them overlap, tell the advisor at once.

5. The rules of the machine are otherwise unchanged. Neither project has priority, and nobody stops, slows or kills another project's run.

---

Draft for Chris's approval.

Id: ADV-2026-11-15-04. A reserved matter: the doubt left open by item 4 (e) of ADV-2026-11-14-24, whether a session's own timer is among "any session's permissions or settings", and a check that sends with the Telegram token (both item 4 (c) of the grant). It becomes Chris's words when he types "approved" and this id in the custodian's session. Drafted by the advisor after reading, on main at 925203430d1fe0f7dd7b761165e04e679f5458aa, the architect's draft of the form for `advisor-silence-two-hour-alarm`, the documentation agent's report on the timer tools, and Chris's message of 2026-11-13 (06:57Z), item 3.

To the custodian, 2026-11-15. On the timer for the two-hour alarm.

1. For the alarm of item 3 of my message of 2026-11-13 (06:57Z), "the advisor has not answered you for two hours", you may set a one-off timer in your own session with CronCreate, and list and remove such timers with CronList and CronDelete. I allow this one use. Every other schedule, trigger or wake still needs my word.

2. When the timer fires, your session runs the check that the piece advisor-silence-two-hour-alarm builds. That check may send the alarm through scripts/hooks/telegram.mjs with the Telegram token already in your session's environment. The token is not copied, written or printed anywhere, and no settings file changes.

3. Each firing is one turn of your session on my plan. Keep at most one timer pending, and none while nothing waits for the advisor.

4. After the piece merges you may run one drill of the timer in dry-run mode. It sends nothing.

5. The alarm works only while your session is open. I accept that.

---

Draft for Chris's approval.

Id: ADV-2026-11-15-07.

To the custodian, 2026-11-15. The limits of the advisor's merges, for the section on merges that goes into AUTONOMY.md.

1. Who rules the section's words. The advisor rules them, as it rules any standing rule. The exception is what stays mine: item 2 below and the sentence of item 3. Those are my words, and they go into the section as I approve them here.

2. What stays mine.
(a) Every matter of item 4 of my grant of 2026-11-13, (a) to (f). A PR of yours that changes one merges only after my typed words on it are filed. History is never rewritten.
(b) A change to the Guardian or any mod merges only on my typed approval naming its live checks. Anything I put on hold stays held.
(c) Any PR you did not open is my click, as item 4 of my 06:43Z message of 2026-11-13 says. The grant did not change that.
(d) So a Dependabot PR is my click too, and P-033 no longer lets you merge one. You still make P-033's checks and report them to the advisor, which tells me.
(e) "The advisor's merge" in item 5 (d) of the grant means the merge of a PR you opened, into main. It reaches no other click of mine.
(f) A PR of yours that waits on my word under (a) or (b) is not sent for a merge check until my typed words are filed. A PR under (c) or (d) is never sent for one.

3. Two hours without an answer. Once you have told me that a merge request is unanswered (item 3 (f) of my 06:43Z message), that PR is my click. The advisor does not merge it after that unless I say so.
