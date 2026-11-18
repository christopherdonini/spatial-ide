# The advisor's draft ADV-2026-11-15-04, for the human's approval: a one-off timer in the custodian's session for the two-hour alarm, with its check sending through the Telegram token already in the session; not the human's words and not a ruling until the human approves it by typed message in the custodian's session (the grant's item 4)

*Filed byte for byte by the custodian as the advisor's draft, for a matter the human's delegation of 2026-11-13 keeps the human's (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 4 (c)): it is neither the human's words nor a ruling of the advisor's, and nothing in it is acted on. By the grant's item 4 it becomes the human's words only when the human types approved and its id in the custodian's session; until then item 4 (e) of ADV-2026-11-14-24 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-24-the-notifications-forms-eight-open-items-answered-halt-line-alone-literal-command-section-38-text-follow-up-node-budget-180.md`) stands, as ADV-2026-11-15-03 item 4 (d) says (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-03-the-alarm-forms-ten-open-items-every-ask-starts-the-clock-the-trigger-and-live-check-reserved-for-the-human-budget-300.md`). The advisor session wrote it as PASTES/ADV-2026-11-15-04.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T01:37:42Z by the custodian's transcript (one message for both ids); the custodian acts on the file, which it read at 2026-11-15T01:37:59Z (the file's modification time 2026-11-15T01:37:07Z; 1655 bytes, sha256 9978dc828fc5fca36e817939caa8ab4c85b64b64381314e61b0e8068269af0cb), and again at this filing (2026-11-15T02:08:27Z), equal both times. By ADV-2026-11-15-03 item 15 the advisor gives the human the id itself; the custodian sends the human nothing. Its own words for the human are kept as written. Everything below the rule is the file, byte for byte.*

---

Draft for Chris's approval.

Id: ADV-2026-11-15-04. A reserved matter: the doubt left open by item 4 (e) of ADV-2026-11-14-24, whether a session's own timer is among "any session's permissions or settings", and a check that sends with the Telegram token (both item 4 (c) of the grant). It becomes Chris's words when he types "approved" and this id in the custodian's session. Drafted by the advisor after reading, on main at 925203430d1fe0f7dd7b761165e04e679f5458aa, the architect's draft of the form for `advisor-silence-two-hour-alarm`, the documentation agent's report on the timer tools, and Chris's message of 2026-11-13 (06:57Z), item 3.

To the custodian, 2026-11-15. On the timer for the two-hour alarm.

1. For the alarm of item 3 of my message of 2026-11-13 (06:57Z), "the advisor has not answered you for two hours", you may set a one-off timer in your own session with CronCreate, and list and remove such timers with CronList and CronDelete. I allow this one use. Every other schedule, trigger or wake still needs my word.

2. When the timer fires, your session runs the check that the piece advisor-silence-two-hour-alarm builds. That check may send the alarm through scripts/hooks/telegram.mjs with the Telegram token already in your session's environment. The token is not copied, written or printed anywhere, and no settings file changes.

3. Each firing is one turn of your session on my plan. Keep at most one timer pending, and none while nothing waits for the advisor.

4. After the piece merges you may run one drill of the timer in dry-run mode. It sends nothing.

5. The alarm works only while your session is open. I accept that.

*Approved, 2026-11-16: the human's typed message of 07:53Z approves this draft by its id (`state/directives/2026-11-16-the-humans-message-five-drafts-approved-v0-1-0-records-what-v0-2-waits-for-the-machine-queue-the-alarm-timer-the-limits-of-the-advisors-merges.md`); from then its text is the human's words. Nothing above is edited.*
