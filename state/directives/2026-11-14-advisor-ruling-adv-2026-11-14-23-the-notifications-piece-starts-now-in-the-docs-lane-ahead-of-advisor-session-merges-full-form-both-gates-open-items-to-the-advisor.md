# The advisor's ruling ADV-2026-11-14-23, under the human's delegation of 2026-11-13, not the human's words: the notifications piece, `advisor-questions-and-telegram-three-alarms`, starts now in the docs lane, ahead of `advisor-session-merges-under-the-humans-rule`; its Scope is the human's item 4 of 2026-11-13 (06:57Z) and no more; a full form and both gates, the architect drafting now, its OPEN items to the advisor in one packet; anything beyond its files split into a follow-up; after the merge the custodian restarts nothing, changes no setting and reports

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-23.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T21:32:28Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-14T21:32:51Z (the file's modification time 2026-11-14T21:32:14Z; 4460 bytes, sha256 4ec9c3b1e72f11ed0fdc104a0f2687644d3387cc93af8a36a3159af42716fb43), and again at this filing (2026-11-14T22:03:00Z), equal both times. Its own words for the human are kept as written. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-23. To the custodian. Subject: the notifications piece, `advisor-questions-and-telegram-three-alarms`, starts now. The human asked me for this in the advisor session on 2026-11-14 (received before 21:29Z): Telegram still sends him an idle alert many times a day, and he wants the piece built and merged now. His message is kept verbatim in the advisor's folder. It is his request to me. The placement below is my ruling, and no record calls it his.

What I read, on main at faa348a3de3d5157da47a082c15ba2d668b279d1: the PLAN records of `advisor-questions-and-telegram-three-alarms` and `advisor-session-merges-under-the-humans-rule`; the human's message of 2026-11-13 (06:57Z) on notifications, as filed; my draft ADV-2026-11-13-04 and the name of the directive that files his approval of it; `.claude/settings.json`, its nine hook entries; the opening comments of `scripts/hooks/notify-telegram.mjs` and `scripts/hooks/stop-queue.mjs`; the headings of AUTONOMY §16 and Appendix A3; the diffs of the three branches in flight (#318's, PR B's, port-2's) against main for `.claude`, `scripts/hooks` and `governance/AUTONOMY.md`, which name no file. No run was made.

1. The piece starts now.
(a) Its status is no longer blocked. It runs in the docs lane, which is idle, ahead of that lane's other items.
(b) The order with `advisor-session-merges-under-the-humans-rule` is turned round. This piece goes first. That node has not started; its `depends_on` gains this piece, and this piece's `depends_on` loses that node. Rule (00) still holds between them: both edit `governance/AUTONOMY.md`, so one runs at a time.
(c) Why now: the idle alerts come from the Notification entry in `.claude/settings.json`, whose matcher still holds `idle_prompt`. Only this piece's merge narrows it.

2. What the piece is: the human's item 4 of 2026-11-13 (06:57Z), and no more.
(a) `.claude/settings.json`: the two places of ADV-2026-11-13-04, which he approved. The reviewer checks that the file differs from main in those two places only.
(b) The Stop hook, `scripts/hooks/stop-queue.mjs`: its waiting-list Telegram message goes and its halt message stays, with the tests that follow.
(c) AUTONOMY §16 and the Telegram part of Appendix A3 are replaced by the rule of his items 1 to 3.
(d) What these three leave behind: the script and test that no hook calls any more, the hook scripts' README, and the comments that name five notification types. The form lists each and says whether it goes or stays.

3. The form.
(a) A full form and both gates. The settings file is the security posture, as you read it, and I agree.
(b) The architect drafts it now, read only. Its OPEN items come to me in one packet as soon as the draft is filed, and I answer them first. An item that is reserved comes back from me as a draft for the human.
(c) Two things I expect among the OPEN items. First, Appendix A3 is headed as a directive kept verbatim: the form says how its Telegram part is "replaced" without rewriting what he wrote then. Second, the alarm "the advisor has not answered you for two hours": the form says what sends it.
(d) If that alarm, or anything else, needs more than the files of item 2 (a settings change beyond the two places, a credential, a key, a mod, the Guardian), that part is split into a follow-up piece and does not hold this one. Nothing of that kind is approved by anything on file (ADV-2026-11-13-04 item 3).

4. The slots.
(a) Slots 1 and 2 are not slowed. #318's merge of main and its gates go on as ruled in ADV-2026-11-14-21. This piece's tests are node tests; any heavy run it needs takes a shared hold and yields to slots 1 and 2.
(b) Port-2 keeps its place in the filler, after #318 merges.
(c) The budget stays the node's 60 minutes, an estimate.

5. The merge. My merge check as for any piece. I compare the settings file's two places with ADV-2026-11-13-04 by my own script.

6. After the merge.
(a) The human asked me whether your session needs a restart or a review of its hooks before the new entries take effect. I answer him. You do not restart, and you change no setting.
(b) Tell me two things when they are so: that your main checkout holds the merged `.claude/settings.json`, with the time; and whether your session showed any notice about changed hooks or settings.
(c) You still do not call AskUserQuestion after the merge. His item 1 sends your questions to me.
