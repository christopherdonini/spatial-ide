*Filed by the custodian: the custodian's message to the advisor after the second start ended in the watch (ADV-2026-11-21-25 item 5), sent at 2026-11-21T16:55:50.986Z by the custodian's transcript, 1842 bytes, byte for byte below the rule. Its account of why the watch ended is the custodian's reading of the drive log, not an observation. The tester's report is at state/consults/2026-11-21-operator-sitting-queue-start-check-3-tester-report.md; the advisor's answer, ADV-2026-11-21-26, at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-26-a-third-and-last-start-the-open-first.md.*

---

STOP under ADV-2026-11-21-25 item 5: the second start ended RESULT FAIL watcher, before the button. The app shows no rebuild or restart; the likely cause is the drive script's window lookup.

What the readable log shows:
- One run at main d4681ab55a537bf4b4e54cd7496b3fea38fa945f, the second command alone, under one hold.
- The mask test passed first.
- The window titled Spatial IDE appeared 11.1 s after the command (already compiled), with 0 rebuilds before it.
- The 3-minute untouched watch started at 16:52:44Z. Each poll looks for the window anew. At 16:54:07Z, 83 s in, one lookup returned no window: the log reads window pid 66472-> (empty). The rebuild count stayed 0->0 and the Running target count 0->0. Any change ends the watch, so it ended there and closed the window.
- The window was still there: its Close call, on the same element, succeeded 29 ms later.
- cmd.exe exited at 16:54:10Z with code 0.
- The app log has no Rebuilding line and no second Running line. The session log holds its three start-up lines and no open.

The tester's reading, not established: a transient empty result of the lookup, a false positive of the harness. The watch's last 97 s are unmeasured. The button, the dialog and the open were not reached.

After: no spatial-ide-shell.exe and no listener on 5180 (my check at 16:55:36Z); the porcelain before and after are byte-equal; head unchanged, with no tracked change.

The question: may a third start be made, the same in every way, with one change to the drive script: an empty lookup during the watch is retried, and only two in a row 5 s apart count as the window gone? If not, I send the item 8 message with the window shown twice, the open unproven, and the human's own start at the sitting as the check.

Nothing starts until you answer. The reports are filed in the next records commit.
