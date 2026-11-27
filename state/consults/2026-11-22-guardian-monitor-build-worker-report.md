*The build worker's report for the node guardian-checks-monitor-commands (the form `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md`, sections 2 to 4), in C:/dev/wt/guardian-monitor from 1c0d3db6e97e1013849b9dae89f11f04fb069679, main merged in at 16c0079a5138bcc17672f6ac25beabe48c9c61d3, to b6d8835810e36249097744cff509b59ae8e9771c, pushed; PR 357, a draft. Filed by the custodian below the rule from its hand-back in its transcript, 7423 bytes, sha256 5c03c68dcf92b2d4bb5adea14df0589339b27a3c2ebfce89eb24fb58ae2b06b6, byte for byte, with one final newline added. Its run: Bash 27, Read 6, Grep 1, Edit 20, Write 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-22T15:47:42Z to 2026-11-22T15:53:41Z by its transcript; 0 calls named the main checkout; no compaction. Its claims are checked at the gates, not here.*

---

Done. Both commits are pushed, and the worktree is clean.

- Merge commit: 16c0079a5138bcc17672f6ac25beabe48c9c61d3. The numstat after it was exactly `1 0 tools/mods/spatial-guardian/hooks/register.js`.
- First commit: 727dc2fb0dd2d648922cdd1bda7b4fcdb42624f7. Second commit: b6d8835810e36249097744cff509b59ae8e9771c.
- Counts, insertions plus deletions against the merge base: 109 at the first commit (README 22, register.js 10 including the P0b line, tests 77) and 139 at the second (tests 107). The files are `<S>/gmb-count-1.txt` and `<S>/gmb-count-2.txt`.
- `claude --version`: 2.1.330 (Claude Code).
- `claude plugin test`: 76 pass, 0 fail at the baseline. At the first commit it was 82 pass, 0 fail, which is 76 plus the six new tests. At the second commit it was 82 pass, 0 fail.

**Built**
- `register.js`: `Monitor: e.command` is in `logRefusal`'s target map, and the comment above `decideShell` now names Monitor. A watch with no command needed no code.
- `guardian.test.ts`: M-T1 to M-T6 on fixtures M-F1 to M-F6. They use `v1`, `answerWrites`, `sha256`, `expectPassed` and the existing worlds.
  - M-T1 to M-T4 check the log line as section 3 says: the seven fields in order, `tool: 'Monitor'`, `agent: 'main'`, `target_sha256` equal to the command's sha256, the rule's reason, and no command text in the line.
  - M-T5 and M-T6 check that the call reaches the engine once, unchanged, and writes no log line.
  - The event is `{ tool, description, timeout_ms, command, ws }`, with `command` left out for M-F6. `ws` is an inert string, because its real type is unknown and assumed.
- `README.md`: edited as listed below.

**Mutations**
Each was applied by one anchored `node -e` command, run, and reverted by the allowed checkout. After each revert `diff --quiet` printed 0.
- MU1 (the Monitor registration line removed), `<S>/gmb-mu1.txt`: 78 pass, 4 fail. Failing names:
  - `M-T1 a Monitor force-push is refused by G1 and logged with the tool Monitor`
  - `M-T2 a Monitor merge is refused by G7 and logged with the tool Monitor`
  - `M-T3 a Monitor plugin install is refused by G8 and logged with the tool Monitor`
  - `M-T4 a Monitor clean of the main checkout is refused by G9 and logged with the tool Monitor`
- MU2 (`Monitor: e.command, ` dropped from the map), `<S>/gmb-mu2.txt`: the same four names fail, 78 pass, 4 fail. The failure shows `target_sha256: "unavailable"`.
- MU3 (the Monitor handler made to `refuse($, e, cache, CATCH_VERDICT)`), `<S>/gmb-mu3.txt`: 76 pass, 6 fail. Failing names:
  - `M-T5 a harmless Monitor command reaches the engine unchanged and writes no log line`
  - `M-T6 a Monitor watch with no command reaches the engine unchanged and writes no log line`
  - and also M-T1 to M-T4, which the same mutation turns red. That goes beyond the prediction, and the `// RECORDED MUTATION:` comments on M-T5 and M-T6 say so.

**The assumed-fields sentence**
- It is "That a Monitor event has those fields is assumed, not read." I extracted it with `grep -o` from line 15 of the draft. It occurs once in `guardian.test.ts` and once in `README.md`.
- The comment above the tests leads in with "The Monitor event's fields, assumed: ...", naming the four input fields and the three event fields. The README's last "What it does not claim" bullet carries the same lead-in and sentence.

**README changes, before then after**
Long lines are shortened here to the changed span.
1. Line 3: "The forms are `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` and `tools/mods/GUARDIAN-V1-PREREGISTRATION.md`, and both govern this folder: v1 governs what it changes and adds, and v0 stays the form of every v0 rule." After: the list gains `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md`, "all three govern", and "the Monitor form governs the Monitor registration".
2. Line 5: "Built and tested against Claude Code 2.1.296 on Windows. ... claims about those builds only." After: "Built and tested against Claude Code 2.1.330 on Windows, the build of record. ... claims about those builds only; Monitor's event shape was read at no build (see "What it does not claim")."
3. G1 row: "Bash and PowerShell." becomes "Bash, Monitor and PowerShell."
4. G6 row: "its Bash calls are not touched by G6." becomes "its Bash and Monitor calls are not touched by G6."
5. G7 row: "Bash and PowerShell." becomes "Bash, Monitor and PowerShell."
6. G9 row: "Bash and PowerShell." becomes "Bash, Monitor and PowerShell."
7. First "What it does not claim" bullet: it gains the sentence "A Monitor call's refusal is not claimed live before M-E1 of the Monitor form's section 5."
8. Bullet on writes by other tools:
   - Before: "Writes by Bash, PowerShell or any tool other than the ones registered here, ... G2, G3 and G4 read no shell command, on either shell, so".
   - After: "Writes by Bash, Monitor, PowerShell ...", plus "A Monitor watch with no command holds nothing to read, so no rule reads it, and G6 is not applied to Monitor." and "G2, G3 and G4 read no shell command, on either shell, and no Monitor command, so".
9. G8 bullet: "by Bash or PowerShell, which stay allowed" becomes "by Bash, Monitor or PowerShell, which stay allowed".
10. Last bullet:
    - Before: "Any build other than 2.1.296 for the tested behaviour (...), macOS, Linux, any latency figure."
    - After: "Any build other than 2.1.330 ...", followed by the assumed-fields lead-in and sentence.
11. "The shell route": after "Guardian registers G1, G6, G7, G8 and G9 on it." I added "A Monitor command is read by the same shell decision as a Bash command, without G6."

The "Files" lines stayed true, so I changed none.

**Deviation from the form: build line**
Section 2, item 4 says the build line and last bullet should say Monitor's event shape was read at the build of record. Amendment 2, item 1 makes the draft govern, and the draft says assumed, not read. The README therefore says it was read at no build, since the engine wrote no types folder at 2.1.330.

**Other results**
- `node --test "scripts/hooks/*.test.mjs"`: exit 0, 202 pass, 0 fail (`<S>/gmb-hooks.txt`).
- `claude plugin validate` exit 0 (`<S>/gmb-validate.txt`). Its `register.js` hook lines:
  - `hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=Monitor}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}`
  - a `gating hook with .catch` line for each of Bash, Monitor, PowerShell, Write, Edit and NotebookEdit
  - `gating hook without .catch: tool.call`, for N1
- Final `git status --porcelain --ignored`: empty (`<S>/gmb-status.txt`).

**Pre-gate self-check**
- Cross-module seams: `decideShell` and `logRefusal` read `e.tool`, `e.command` and `e.agentId`, and the tests drive the real `register()` through `$.tool.call`.
- Completion claims: each claim has a result file in `<S>`.
- User-facing text: the README's Monitor claims describe behaviour in the code and the tests.
- Required tests: M-T1 to M-T4 reach their assertions, as the red MU1 and MU2 runs show. M-T5 and M-T6 reach theirs, as MU3 shows.

**Stops and off-scope**
No stops. `.claude-plugin/types/` was never written, and nothing outside the three Scope files changed. The caller grep for the new `Monitor` registration and map entry: the `register.js` registration is the P0b line, and the map entry is used by `logRefusal` on every refused Monitor call.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
