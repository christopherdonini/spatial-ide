# The human's message of 2026-11-18 (20:27Z): the advisor's draft ADV-2026-11-18-06 (a StopFailure hook, so that the human is told when a turn of the custodian ends on an error from the service) approved

*Filed verbatim by the custodian from the session transcript: the human's message arrived while a turn was running, so it has no user record of its own; its queue record (enqueue) is at 2026-11-18T20:27:01.419Z (UTC) and its queued-command attachment, origin human, at 2026-11-18T20:27:01.414Z; 26 bytes, sha256 c2d40ba9aaac1962194335fb5c18b59fcceda1d19301237f7121b77ac1d21e33, byte-copied by script, with one final newline added. The message approves one draft in the human's advisory folder, by the grant's item 4 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`): PASTES/ADV-2026-11-18-06.md (2204 bytes, sha256 820f77ecab3224d2eeb0bdc64dec7d537d76d9feff9542b84f096ac5d22b63ad, last modified at 2026-11-18T10:20:03Z by the file system), modified before the approval and read again by the custodian at this filing (2026-11-18T20:40:31Z). Its text follows the message, below its own rule, byte for byte. By the approval the draft's text is the human's words. Nothing is changed. The custodian's note, not the human's words: the folder's place on the machine is not written here.*

---

approved ADV-2026-11-18-06

---

Draft for Chris's approval.

To the custodian, 2026-11-18.

On 2026-11-16 the account's usage limit stopped your session, and nobody was told for two days. The alarm listens only for the app's notices about its wait after a limit, and none came. I approve one change, so that I am told when a turn of yours ends on an error from the service.

1. A new hook on the app's StopFailure event, in the repository's `.claude/settings.json`, with no matcher, so that every error type the event names is covered. It runs a new script, `scripts/hooks/notify-stop-failure.mjs`.

2. The script sends one Telegram message through the existing module `scripts/hooks/telegram.mjs`, with that module's ten-minute window, keyed on the error type. The message says that the session stopped on an error, and gives the error type, the error details and the folder's name. It does not send the last assistant message, because that text can carry my account link. It reads no token and prints none. It does nothing in a cloud session, as the other hook does nothing there. It always exits 0.

3. The Notification hook's matcher gains `quota_auto_resume_fired`, so that I also hear when the app goes on by itself after a reset. Nothing else in the settings file changes.

4. AUTONOMY section 38 and `scripts/hooks/README.md` say what the new hook does, in the same pull request.

5. The live checks, each shown in the form before the merge request:
(a) the script's unit tests, with the input the app's documentation gives for this event; one of them shows that the last assistant message is in no text the script sends;
(b) one message sent at the laptop from a sample input, marked TEST, and my word in your session that it reached me;
(c) the settings file differs from main by the one new hook block and the one matcher value, and by nothing else;
(d) the existing tests of the hooks pass unchanged.

6. What is not proven: that the app raises this event when a usage limit is reached. Its documentation lists the error type `rate_limit` for the event, and the records of 2026-11-16 carry that type, but only the next limit will show it. The form says so.

7. It costs nothing. The advisor classes the piece and places it.
