*Custodian's filing note (2026-10-04): evidence-recorder-v0 worker report 2, under the tag node:evidence-recorder-v0@g3. It covers PR #172's correction round 1 of 2: the README edits for the gate-1 architect's S2-1 and the gate-1 reviewer's S2-2. It arrived as a message, and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. The run lasted 14:26:37Z to 14:27:52Z, with Bash 7, Read 1, Edit 5 and Write 1, plus the hand-back. Its writes were five Edits to the README in the worktree and one Write of its commit message to the session scratchpad. The custodian read the diff d48bedc4..609ab945: one file, 11 insertions and 3 deletions, and the four edits as the report lists them. Not a ruling.*

---
New head: 609ab94515d34a4f88583188b338abc6867f53d6 (on d48bedc4 start, clean tree confirmed). Pushed to origin/cut/evidence-recorder-v0, rc=0, no amend/rebase/force. Only tools/mods/spatial-evidence-recorder/README.md changed.
Edits (README lines now):
1. Not-claim limits: line 3 (subagent line qualified as unclaimed live before E3); line 45 (Coverage bullet now says every form in the form's §2.2 not-approved table is not recorded); line 46 (live behaviour before its E-row: Guardian chain order E1, subagent usage E3, agent listing at turn end E3); line 50 (loading limit).
2. Pruning age: line 37 (day folders older than 30 days).
3. Off-switch: line 65 (disableAllHooks is not the way, it also stops the repository's settings hooks).
4. Acceptance and stop: section at line 67 onward, the two :55-59 and :61-64 @ 884fc727 references byte-copied from the form's §9. No other hash reference.
Checks: verify-quotes --show-cites rc=0 (PASS; both README refs listed as hash: PASS; I also recomputed both with git show 884fc727 | sed | sha256sum and they match d3c294b2... and 648fffdd...). verify-cites rc=0 (PASS, 1263 files). The form's §7 count, base ea5aba5d..head 609ab945: marketplace.json 5, plugin.json 7, .gitignore 1, README 73, hooks.json 3, register.js 464, recorder.test.ts 564, total 1117 against 1400, 7 files.
git status --porcelain after the push: empty.
Pre-gate classes: (1) cross-module: none touched, docs only. (2) completion claims: each edit is listed with its line, and the two hashes recompute. (3) user-facing messages: the README states only what the form already says, no new behaviour. (4) tests: no test added or changed; the checks reached their PASS lines and the manual hash recompute.
Off-scope noticed: none acted on. verify-quotes prints 2 stale baseline entries (engine/LOD-PREREGISTRATION.md), unrelated.
Model: Sonnet 5.5 (claude-sonnet-5-5); no override. No context handoff received or produced.
