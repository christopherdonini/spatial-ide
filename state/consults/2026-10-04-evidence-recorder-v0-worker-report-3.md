*Custodian's filing note (2026-10-04): evidence-recorder-v0 worker report 3, under the tag node:evidence-recorder-v0@g4. It covers PR #172's correction round 2 of 2: the README edits for the gate-2 architect's G2-N-4 and the gate-2 reviewer's N-B to N-D. It arrived as a message, and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. The run lasted 14:54:02Z to 14:55:08Z, with Bash 7, Read 4, Grep 1 and Write 1, plus the hand-back. Its one Write was its commit message, to the session scratchpad. It made the README edits through its shell, not with the Edit tool. The custodian read the diff f7dd269e..2d95575e: one file, 6 insertions and 3 deletions, and the four edits as the report lists them. The custodian also recounted §7 by its own command: 1120 of 1400 over 7 files, with marketplace.json at 5, the figure the report inferred. Not a ruling.*

---
New head: 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5, pushed to cut/evidence-recorder-v0. It was a plain commit (-s, no amend or rebase), on f7dd269e as asked. Start state checked: HEAD matched and `git status --porcelain` was empty.
Edits, in README.md at the new head:
1. Line 41 now says a record does not show that a test's assertions establish a claim, and is never a mutation observation. I split the old sentence in two to fit it.
2. Line 47 now reads "That no record is lost. A rejected write drops its record." Line 48 is a new Latency bullet: any docs/08 row, and any latency figure before the live row E5.
3. Line 46 now carries E1 with the condition: "E1, and only if E1's refused call is approved under the form's §2.2".
4. Line 72 is a new sentence after the two brief references: "The bounds the evaluation uses are declared in the form, in its §9 (Operator) and its §7." It states no number and adds no hash. The two brief references are byte-unchanged.
Checks:
- verify-quotes.mjs --show-cites: exit 0. Both brief references show hash PASS.
- verify-cites.mjs: exit 0 (PASS, 1265 files).
- §7 count, base ea5aba5d..HEAD, run after the commit: 7 files, total 1120 against 1400. Per file: register.js 464, test 564, README 76 (79 added or removed lines in total across the two README correction rounds? no: the README's own figure is 76 added, 0 removed at the working-tree count before commit), and the other four files 16 together (plugin.json 7, .gitignore 1, hooks.json 3, marketplace.json 5). I did not see the first lines of the numstat output, so marketplace.json's 5 is inferred from 1120 minus the visible rows, not read.
- The verify-quotes run also printed stale-baseline advisories for other files. They are not in this README and I made no change for them.
- Post-push `git status --porcelain`: empty.
Four pre-gate failure classes:
1. Cross-module interface: not applicable. This is docs only and touches no code or interface.
2. Completion claims: each edit is located at the lines above. The checks are the three exit codes. The count was run with the form's counting command.
3. User-facing text: every sentence comes from the form. Edit 1 is §1's What-a-record-proves limit. Edit 2 is §1's Latency limit, plus the Loss clause (§1) for "a rejected write drops its record". Edit 3 is §1's Live behaviour condition, with §2.2 as its source. Edit 4 is §9 Operator and §7, cited by section only. No quotation marks, no line numbers, no path in the new text, and `disableAllHooks` is untouched.
4. Required tests: none apply. The README's recompute checks ran.
Model: I observe myself running as claude-sonnet-5-5 (Sonnet 5.5). The brief's commit trailer says Claude Opus 5.5 (1M context), and I used it as instructed. I applied no model override and received no context handoff.
