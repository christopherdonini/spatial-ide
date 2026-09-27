*Custodian's filing note (2026-09-27): the exposure-profile-paths worker's answer to gate 1's reviewer finding E4 (how `41d0341` was committed), given after gate 1 at the custodian's question and transcribed from the hand-back message with the harness's two-space indent removed. It is the worker's statement; git cannot show it. Everything below the rule is the worker's text.*

---

Answer to gate 1 reviewer's question on 41d0341:

(a) is true: `.githooks/pre-commit` did not exist on disk when 41d0341 was committed — that commit's own message states the hooks were "not yet written, since the piece stops before step 2." `.githooks/commit-msg` at that time also had no scanner call yet (added later in `ccdccfd`). So 41d0341's added lines were never scanned by any hook at commit time — there was no scanner call in either hook to refuse them, not a bypass.

No `--no-verify` was used anywhere in this session, and no other commit on the branch bypassed a hook: every commit from `ccdccfd` onward (once the scanner was actually wired into both hooks) went through them normally and was not refused.

No environment value or profile-naming path is included above.
