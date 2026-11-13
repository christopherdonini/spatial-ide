*Custodian's filing note (2026-11-13): the worker's report for PR #312's ADV-2026-11-13-03 item 1 sentence (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-03-312-timing-case-sentence-in-item-64s-comment-reviewer-checks-it-once.md`), from its hand-back (2488 bytes, sha256 8e2175fa52345c9279cadf29c837bc00a70fecb951304a16a84eb89ba120ccfc), below the rule; a final newline is added and nothing else is changed. Its brief by file (7633 bytes, sha256 f0aa9494bb945206cbcac084f9df4703cd0f140651b466fc30824221b5477e5d); the run 09:01:53Z to 09:12:40Z by its transcript, 19 calls (Read 1, Bash 14, Write 2, TaskStop 1, SubagentHandback 1), model claude-sonnet-5-5. Two calls errored, which the report does not name (the custodian's brief did not ask for them): at 09:10:11Z a TaskStop, a tool the worker does not have; at 09:10:13Z a Bash call the harness blocked, a sleep before a read. Its commit b71de27086e3b75f41265915116f72ad70e1482a was checked by its reviewer's one check (`state/consults/gates/2026-11-13-known-limitations-first-look-partial-view-gate-reviewer-sentence-check.md`).*

---

Inserted: known-limitations-first-look-partial-view at b71de27086e3b75f41265915116f72ad70e1482a

Starting checks: worktree HEAD equals 013d8c9bd24dce2a610f996821bd4cd0a33cee18; porcelain empty; origin's branch equals the same head after fetch.
Inputs: kfl3-insert.txt 669 bytes, sha256 924e2004...54a1 (matches); kfl3-expected.md 160900 bytes, sha256 9c58ee79...5096 (matches); KNOWN-LIMITATIONS.md 160231 bytes, sha256 fa4b24fb...f7ba (matches).

Change: the anchor count was 1. The script's byte comparison with kfl3-expected.md was equal. `git diff --numstat` showed `1	1	KNOWN-LIMITATIONS.md`, and that file alone. New sha256 9c58ee79e701a7fc09b467735ca9ce7d812853e294d89a873ef8ffe342485096.

Checks, each to its own file:
- verify-cites: exit 0. Last line: verify:cites PASS — every rooted (in-tree) path:line reference across 2926 file(s) resolves. (192 loose reference(s) advised above.)
- verify-quotes: exit 0. Last line: verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors.
  - It ran inside a shared hold, backgrounded after 180 s. Hold line: MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:51364 (also= elided). MACHINE_RELEASED followed, and the call exited 0.
- verify --offline: exit 0. Last line: verify:plan PASS — governance\PLAN.yaml agrees with the repository.
- profile-path-scan --staged: exit 0, "profile-path-scan: clean".
- profile-path-scan --message: exit 0, "profile-path-scan: clean". `grep -n '@'` on the message file found line 7 only, the Co-Authored-By line.

Commit: subject "docs: KNOWN-LIMITATIONS item 64's source comment, the first look's timing case named (the advisor's words)", made with `git commit -s -F`. Full id b71de27086e3b75f41265915116f72ad70e1482a, 1 file changed, 1 insertion, 1 deletion.
Push: `git push origin cut/known-limitations-first-look-partial-view` ran in its own call, exit 0. After a fetch, origin's branch equals HEAD (b71de270...), and the porcelain is empty.

Background shells left: none of the shells I started is still running. One of my own wait loops was moved to the background and finished with exit 0 before the commit. I did not touch the PR or CI.
Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override, no context handoff.
Scratch files are in `<S>`, named kfl3-*, apart from the brief.
