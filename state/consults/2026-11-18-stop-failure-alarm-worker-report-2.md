Built: stop-failure-alarm, worker (second report, covering only the work since my last report) (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-18T23:32:29Z to 23:37:24Z by its transcript, Bash 12, Read 3, Edit 2, none errored; 5557 bytes, sha256 00d0514bd23b8492cb827984e21c5ff46c6a2b34264b852cd1977d2584e514c1; below byte for byte, with this note and one final newline)
Result: Step 5 and the step 6 runs are done and pushed. The full run shows the one expected failure, `the_notification_hook_matches_only_the_two_quota_types`, and no other.

Commit 2: 74ba9d352fe0101c14136769a9c46718d8cef125, "docs: the stop alarm's words in AUTONOMY section 38 and the hooks README (stop-failure-alarm)".
- `git show --stat`: governance/AUTONOMY.md (+8) and scripts/hooks/README.md (+16), 24 insertions, 0 deletions.
- The scan before the commit gave `profile-path-scan.mjs --staged` rc=0, "clean". The commit used `-s -F <S>/sfa-msg2.txt` and was rc=0.
- Push in its own call: `c756afab..74ba9d35  cut/stop-failure-alarm -> cut/stop-failure-alarm`, rc=0.
- The AUTONOMY.md append was an Edit whose old_string ended the file, final newline included. Nothing above it moved (0 removed).
- I wrote the message file with printf in Bash, not the Write tool. The bytes are the specified text.

Step 6 runs, at 74ba9d35:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc=1, tests 611, pass 610, fail 1, cancelled 0. The one failure is `the_notification_hook_matches_only_the_two_quota_types` and no other.
- `node scripts/plan/verify-test-claims.mjs`: rc=0, "verify:test-claims PASS — all 834 claimed test(s) across 275 file(s)…".
- `node scripts/plan/verify-cites.mjs`: rc=0, "verify:cites PASS — every rooted (in-tree) path:line reference across 3278 file(s) resolves. (196 loose reference(s) advised above.)".
- `node scripts/hooks/profile-path-scan.mjs --staged` after the last commit: rc=0. That is a scan of nothing staged. The staged scan before each commit gave rc=0.
- `git diff --numstat origin/main...HEAD`: settings.json 12/1; AUTONOMY.md 8/0; README.md 16/0; fixture 9/0; notify-stop-failure.mjs 70/0; notify-stop-failure.test.mjs 65/0. Excluding the settings file, my five files are 168 added and 0 removed against the ceiling of 235 and 0. The diff names exactly six files.
- `git status --porcelain` is empty and HEAD is 74ba9d35.

The new words, byte-copied from the files:

governance/AUTONOMY.md, appended at the end of §38:
```
### Part C. The stop alarm (2026-11-18; the human's approval of ADV-2026-11-18-06, `state/directives/2026-11-18-the-humans-message-adv-2026-11-18-06-approved-a-stop-failure-hook-that-tells-the-human-when-a-turn-ends-on-a-service-error.md`, items 1 to 3; the words are the worker's draft, not the human's)

- **(ix) The StopFailure hook.** `.claude/settings.json` has a `StopFailure` entry with no matcher, so every error type the event names is covered. It runs `scripts/hooks/notify-stop-failure.mjs` (approval item 1).
- **(x) What it sends.** The script sends one message through `sendTelegramDeduped` of `scripts/hooks/telegram.mjs`: that the session stopped on an error, the `error` value, the `error_details` value when present, and the basename of `cwd`. A repeat with the same `error` value, within ten minutes and under the same project root, is not sent (approval item 2).
- **(xi) What it never does.** It does not send `last_assistant_message` or any other field, and no such field is in the dedupe key. The script reads no token variable and prints none; `telegram.mjs` reads the token and the chat id from the environment only. In a cloud session it exits at once. It always exits 0, on bad input and on a failed send too (approval item 2).
- **(xii) The third quota type.** The `Notification` entry's matcher gains `quota_auto_resume_fired`, so the human also hears when the app goes on by itself after a reset. It names three types where (iv) names two (approval item 3).
- **(xiii) Not proven.** That the app raises the StopFailure event when a usage limit is reached is not proven (approval item 6).
```

scripts/hooks/README.md, appended at the end:
```
## StopFailure — `notify-stop-failure.mjs`

Added by the human's approval of ADV-2026-11-18-06 (items 1 to 3; `AUTONOMY.md` §38 Part C). The
hook listens for the StopFailure event, with no matcher, so every error type the event names is
covered. It reads the hook's JSON from stdin and sends one Telegram message through
`sendTelegramDeduped` (`telegram.mjs`): that the session stopped on an error, the `error` value, the
`error_details` value when present, and the basename of `cwd`. A repeat with the same `error`
value within ten minutes, under the same project root, is not sent.

It never sends `last_assistant_message` or any other field, and none is in the dedupe key. It reads
no token variable and prints none. In a cloud session it exits at once. It always exits 0.

Not proven (the approval's item 6): that the app raises this event when a usage limit is reached.
`notify-stop-failure.test.mjs` runs the script on the documentation's example input
(`fixtures/stop-failure-input.json`), every run a dry run.
```

Done that the brief does not name:
- Every command had an rc shown, except that the `verify-test-claims` rc was first lost in a backgrounded chain. I re-ran it alone (rc=0).
- The full run and `verify-cites` ran as one chain moved to the background by the harness's 120 s timeout. I polled its output file and did not start a second copy. The chain's own `vcrc=0` is in that output at line 12.
- The words do not state check (d).
- I did not touch `scripts/hooks/hooks.test.mjs` or `.claude/settings.json`, and no Telegram message was sent.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override and no context handoff.
