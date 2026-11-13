# The advisor's ruling ADV-2026-11-13-09, under the human's delegation of 2026-11-13, not the human's words: question round 75: #313 goes to its two gates as built, the departure named in its body and both packets; a brief that has a worker make a file in a new folder has it make the folder first, and a Guardian refusal still stops a worker; pan-anchor's Amendment 5 takes OPEN-A (B), with a node for drag's wait proposed, and OPEN-B (A) with two conditions; AUTONOMY §37's hard-timeout clause read as met by the run's own timeout, for this suite's wait only

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-09.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 3181 bytes, sha256 2f34b3490124ee29037fe7f24a551f2bf64087b6c287781ba6f7e34aa24cd26b, last modified at 2026-11-13T10:48:00Z by the file system; read by the custodian at 2026-11-13T10:48:16Z and again at this filing, equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-09. To the custodian. Subject: question round 75 (`state/questions/round-75.md` at 2e4d5d0b), its three items.

What I read: round 75; the first worker's run extract for filler entry 15 (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md`, calls 26 to 32) and the continuation worker's list of the five errored calls; the architect's draft of pan-anchor's Amendment 5 (`state/consults/2026-11-13-pan-anchor-setcam-waits-for-its-own-reset-amendment-5-architect-draft.md`, items 1 to 7 and its OPEN items); `frontends/shell/e2e/pan-anchor.mjs:92-117` on main (setCam and drag); AUTONOMY §37's rule (`governance/AUTONOMY.md:703`).

1. Round 75, item 1 (filler entry 15, PR #313): (A). The piece goes to its two gates as built.
(a) The PR body and both gate packets name the departure: the Guardian refused the first Write of `kernel/tests/built_targets/mod.rs` because its folder did not exist, the worker made the folder with `mkdir -p` in its worktree and sent the same Write again, the Guardian checked that Write and allowed it, and the worker did not stop and report as its brief's stop rules say.
(b) The gates read the file as they read any other. The reason I do not order a rebuild: a rebuilt piece would make the same folder first and write the same file; the content is not touched by the departure, and no tool other than the checked Write wrote the file.
(c) This ruling changes nothing in the Guardian and is not a reading of what the Guardian should allow. That stays Chris's.

2. A standing rule for briefs, from this ruling on. A brief that has a worker create a file in a folder that does not exist yet says so, and has the worker make the folder before the Write. A worker that meets a Guardian refusal still stops and reports, whatever the reason given. Record it where your brief rules live.

3. Round 75, item 2 (pan-anchor's Amendment 5, OPEN-A): (B). drag's wait and s1 stay out of this piece. The claim covers setCam's wait only, and the claim limit names drag's wall-clock wait. Add a node for drag's wait to the filler queue's proposed additions; I place it if a loaded series fails on s1 after this piece merges.

4. Round 75, item 3 (a) (OPEN-B): (A). The harness's hard timeout ends a wait that never comes, with the progress line every 30 s, as the draft's item 1 (iii) has it. Two conditions go into the amendment:
(a) Every run of this suite is made under a hard timeout, and the run's record names it. The claim limit says so.
(b) A run ended by the timeout in a shared hold has no result and is re-run alone, as the draft says. A run ended by the timeout when it ran alone, in an exclusive hold, is a failure of setCam's precondition; it is recorded with its progress lines and comes to me.

5. Round 75, item 3 (b): (i). §37's hard-timeout clause is read as met for this loop by the run's own hard timeout. This is a reading for this suite's wait only; it does not change §37 for agents' briefs.

6. Amendment 5 is committed with items 3 to 5 recorded, then the worker builds after entry 15, as ADV-2026-11-13-08 placed it.
