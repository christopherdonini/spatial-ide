*Filed by the custodian: the custodian's message to the advisor after the start before the sitting ended at the dialog (ADV-2026-11-21-16 item 7: a failure comes to the advisor at once), sent at 2026-11-21T16:44:49.131Z by the custodian's transcript, 3271 bytes, byte for byte below the rule. Its account of the order of events after the dialog appeared is the custodian's reading of the drive log's time stamps against the drive script's order, not an observation (ADV-2026-11-21-25 item 8). The tester's report is at state/consults/2026-11-21-operator-sitting-queue-start-check-2-tester-report.md.*

---

STOP: the start before the sitting (ADV-2026-11-21-16 item 7, as ADV-2026-11-21-24 item 2 asks it) ended RESULT FAIL dialog. It comes to you at once, by item 7. The likely cause is our own test harness, not the app, but the log that would show it is lost.

**What was done.** One run by the tester, at main c4b5643b98be5d10f8b93251af8efc8c4fcae042, the commit that holds the replaced start paragraph, in the main checkout, under one shared hold. It typed the script's two commands as written, in order, and nothing else.

**What was shown:**
1. The viewer build: rc 0, 4.9 s.
2. The start: the window titled Spatial IDE appeared 5 min 44 s after the second command. The first start compiled the app, and the dev watcher rebuilt it 7 times on "File src-tauri\target\debug changed" before the window opened.
3. Nothing beyond the two commands was needed for the window: no install, no extra build, no extra file. So there is no finding for the script under item 2.
4. The Open GeoParquet… button was found and invoked. The app's own native file dialog appeared 3 s later.
5. After: the tracked tree is unchanged, and the porcelain before and after are byte-equal. My own check at 16:42:05Z found no spatial-ide-shell.exe process and no listener on 5180. Head is still c4b5643b with no tracked change.

**What failed, and why it is not known.** The drive script's mask function took a parameter named `$s`. PowerShell names are case-insensitive, so it masked every log line whole. The drive log keeps only its 12 timestamps, and the after-file keeps only its headings.
- Matching those stamps against the script's order, my reading is as follows. This is inference; none of it is seen in the log.
  - The file-name box was found.
  - Setting the fixture path in it threw, which ended the dialog step.
  - The window was closed 12 ms later, and the dev command exited 2.4 s after that.
- A likely cause is that the element found by AutomationId 1148 is the dialog's file-name combo box, not the edit box inside it that takes the value. This is not established.
- Whether `filter-zoned.parquet` opens is unknown. The app's session log holds its three start-up lines and no open.

**Two notes for the script, no change asked:**
- The first start took about 6 minutes to show a window. The script says only that it takes much longer than later starts.
- The first command prints "scan-dist: reviewed row app.js local-filesystem-path 7291: not found". The timing run printed the same line. Both runs ended rc 0 with "all reviewed". The human will see this line.

**The question.** May the tester make one more start on the same commit with the drive script's two defects fixed, and nothing else changed? The two fixes:
- the mask parameter renamed;
- the path set on the edit box inside the file-name box, or typed into it if it has no value pattern.

The script itself needs no replacement. Under item 2, a further start follows a replacement of the script, so this one is yours to allow; it is also a launch other than the suites' own (ADV-2026-11-21-05 item 8). Until you answer, no start is made and nothing merges that ADV-2026-11-21-16 item 6 holds.

The tester's report, the drive script and the logs stay in my scratch folder. They are filed in the next records commit.
