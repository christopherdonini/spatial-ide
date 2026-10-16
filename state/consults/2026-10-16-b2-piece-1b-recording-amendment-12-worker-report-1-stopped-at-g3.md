*Custodian's filing note (2026-10-16): the first worker's report for `b2-piece-1b-recording`'s Amendment 12 (route (a) for ADR-022, the human's typed word), in C:/dev/wt/1b at a542097e2017751fef164912431847ae6292c35d. The run 2026-10-16T18:50:49Z to 2026-10-16T18:51:11Z by its transcript (Bash 3, Read 1, Edit 1); its one SubagentHandback call, at 18:51:10Z. It ran the one git restore the human's word covers; the file was then the base's bytes, unstaged. Its Edit was refused by Guardian G3, and it stopped as briefed. **The error was the custodian's brief:** it gave `old_string` as the file's last line without the final newline, and G3 counts an Edit to an accepted ADR as an append only when `old_string` occurs once, ends the file and begins `new_string` (the Edit branch of `g3Refuses` in the Guardian's `hooks/register.js`, read by the custodian, not changed; its test `G3 allows an Edit that only appends at the end of a filed preregistration` uses an `old_string` with the final newline). The custodian checked the worktree after the stop: HEAD a542097e, porcelain one modified line for the ADR, the file's sha256 the base's. A second worker, on a fresh brief with that `old_string` and no second restore, finished: `state/consults/2026-10-16-b2-piece-1b-recording-amendment-12-worker-report-2.md`. Extracted by script; 0 rooted path:line cite(s) de-rooted; nothing else changed. The message's sha256 as handed back is 774b3b9852562c544d4df8cc5fedd673049395691529979edd6cc6c32d7f3fbe; this file's, from line 5 to the end, is 774b3b9852562c544d4df8cc5fedd673049395691529979edd6cc6c32d7f3fbe.*

---

STOPPED at Step 2: Guardian refused the Edit. Nothing is committed or pushed.

Guardian's words, exactly: spatial-guardian G3: refused, because an accepted ADR or a filed preregistration changes only by appending.

I did not try another route, as instructed.

State left in C:/dev/wt/1b:
- Branch cut/b2-piece-1b-recording, head a542097e2017751fef164912431847ae6292c35d. `git fetch origin` exited 0, and the head matched with an empty porcelain before I started.
- Step 1 ran: `git restore --source=31e25f15a8639fe69f843b1802034ea27d76b0fa -- docs/adr/ADR-022-style-v0-as-the-single-style-model.md` exited 0. `git diff --exit-code 31e25f15a8639fe69f843b1802034ea27d76b0fa -- <that file>` exited 0 with no output. `sha256sum` printed fa3a411cb9d661b1890c31a2a68ed345cd9929aad6c8bc53c0bec3fc7b0573e0, as expected.
- The ADR file is therefore restored to the base's bytes and sits as an unstaged modification against a542097e. The Amendment 1 append was refused. Step 3 and the commit were not run.
- Porcelain should now show only ` M docs/adr/ADR-022-style-v0-as-the-single-style-model.md`. I did not re-run `git status` after the refusal.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
