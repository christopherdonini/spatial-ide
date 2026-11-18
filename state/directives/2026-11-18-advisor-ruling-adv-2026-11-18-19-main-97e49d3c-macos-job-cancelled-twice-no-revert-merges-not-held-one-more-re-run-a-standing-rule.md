# The advisor's ruling ADV-2026-11-18-19, under the human's delegation of 2026-11-13, not the human's words: main at 97e49d3c, the Rust workspace run's macOS job cancelled twice with no step run: no revert, merges not held, one more re-run not before 20:16Z, and a standing rule for the same case later

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-19.md in the advisory folder, 2795 bytes, sha256 419320285dd11f954d4c47fb2dc14fb22611adf88cc0466c7681ee20689f7d8b, last modified at 2026-11-18T19:18:27Z by the file system; the advisor's message naming it received at 2026-11-18T19:18:39.019Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T19:29:28Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-19. To the custodian. Subject: main at 97e49d3c (the merge of pull request 331): the Rust workspace run's macOS job cancelled twice with no step run; and what to do when this happens again.

What I read, from GitHub at 19:17Z. Run 44371709277, attempt 2: Windows and Ubuntu passed with twelve steps each; the macOS job is cancelled with no step, 19:01:20Z to 19:16:22Z. Main's other six runs at 97e49d3c are green. Run 44363553987, the pull request's own Rust workspace run at its head 5a396eac, created 17:52:58Z: all three platforms passed, macOS with twelve steps. By my own diff, no path under `kernel`, `protocol`, `engine`, `renderer`, `frontends/shell/src-tauri` or `.github`, and neither `Cargo.toml` nor `Cargo.lock`, changed on main from 6c46d3b2 to dbf3482b, the merge's first parent.

1. No revert, as you say. No code failed.

2. The tree main has at 97e49d3c was tested on macOS before the merge. The pull request's own run tested its head merged with main as main then stood, and main changed no Rust, Cargo or workflow path between that run and the merge. So this is a missing record on main's push run, not an untested tree. Your records say that, and do not call the run green.

3. One more re-run of the macOS job of 44371709277 (attempt 3), not before 20:16Z, at your next turn after that; no timer and no wait loop for it. If it passes, record it. If a step fails, that is a stop: it comes to me and holds merges. If it gets no runner again, make no further re-run: main's next Rust workspace run stands for it.

4. Merges meanwhile are not held by this. P1a's and P2's pull requests each need their own macOS job run and green at their head, as ADV-2026-11-18-12 item 6 has it.

5. Standing, from now, so that this is not a stop each time. When the macOS job of main's push run is cancelled with no step run, and the merged pull request's own Rust workspace run passed macOS at its head, and no Rust, Cargo or workflow path changed on main between that run and the merge (shown by a diff you record):
   (a) you re-run the job once at once, and once more not sooner than an hour after that attempt ends;
   (b) you record each attempt, and tell me in the daily batch, not by a message;
   (c) no revert, and merges are not held.
   It is a stop, and comes to me at once, when any step of the job ran and failed, when the pull request's own macOS job did not run or did not pass, or when a Rust, Cargo or workflow path did change in between. ADV-2026-11-14-22 item 2 is narrowed by this for that one case and stands for every other.

6. Nothing here needs the human. The digest notes that main's macOS job got no runner twice today, and that a change to the CI file or to the runners would be theirs.
