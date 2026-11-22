Reviewed: cut/guardian-monitor at b6d8835810e36249097744cff509b59ae8e9771c, PR 357, against `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md` (the custodian's filing note, 2026-11-22: section 7's reviewer after the build, node:guardian-checks-monitor-commands@gate-reviewer-1, the form read at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout; Bash 33, Read 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T16:01:34Z to 2026-11-22T16:09:05Z by its transcript; 0 calls named the main checkout; no compaction. Filed byte for byte below the rule from its hand-back, 12261 bytes, sha256 65402b6f2a9f9e016d810b41cce9bad8a07e31bf152951f6a70c0273ea46caf8, with one final newline added. Its D1 and D3 were applied at 269b0532bc1228fa0fac9be75afe062be02815de and its D2 is the form's Amendment 4, item 2.)

---

Verdict: PASS WITH NOTES — cut/guardian-monitor @ b6d8835810e36249097744cff509b59ae8e9771c (form read at main 466318621a13f00ae7b1114a4690582be42bdc94 in C:/dev/wt/read-1122)

Nothing blocks. I found no Correctness or Evidence finding. Three Documentation findings must be fixed before the merge (D1 to D3). The notes need no change.

## Checks

**1. The diff against section 2.**
- Commands: `git merge-base origin/main <head>`, then `git diff --numstat <base> <head>` and `git diff --numstat <base>...<head> -- tools/mods/spatial-guardian`.
- Result files: `<S>/gmr-mergebase.txt`, `<S>/gmr-numstat.txt`, `<S>/gmr-numstat-form.txt`, `<S>/gmr-diff.txt`, `<S>/gmr-log.txt`.
- The merge base is 466318621a13 (origin/main). Three files changed:
  - README.md: 11 inserted, 11 deleted.
  - hooks/register.js: 6 inserted, 4 deleted.
  - test/guardian.test.ts: 107 inserted, 0 deleted.
- The total is 139 changed lines, under the 200 ceiling.
- register.js has exactly three hunks:
  - the registration line, placed after `nudge` (so N1 stays first) and beside Bash, with `guardShell(..., false)` and the same `.catch`;
  - `Monitor: e.command` added to `logRefusal`'s map;
  - the comment above `decideShell`, three lines becoming four.
- Nothing else changed. The merge commit 16c0079a adds only the P0b line over main (`<S>/gmr-merge-numstat.txt`). Between 727dc2fb and the head, only the tests changed, 30 lines inserted (`<S>/gmr-c1-c2.txt`).

**2. The fixtures against section 3 and ADV-2026-11-22-12 item 2 (b).** I read them in `<S>/gmr-diff.txt`.
- `monitor()` builds `{ tool, description, timeout_ms, command?, ws }`. That is the four input fields plus the tool name.
- M-F6 lacks `command`, and the test checks this with `'command' in input === false`.
- No `agentId` is set, so the agent reads as `main`. That matches the Bash fields the handlers read: `e.tool`, `e.command` and `e.agentId`, in `logRefusal`, `agentKind` and `decideShell`.
- The commands of M-F1 to M-F5 match section 3's table byte for byte. M-F4 uses the `v1` world, as the existing G9 Bash tests do.
- For M-T1 to M-T4, `monitorRefused` asserts:
  - the reason;
  - zero calls reached;
  - one write;
  - `Object.keys` equal to the seven declared fields, in order;
  - the values `schema`, `rule`, `tool: 'Monitor'`, `agent: 'main'`, `target_sha256 = sha256(command)` and `reason`;
  - no command text in the line.

**3. Each mutation reproduced.**
- Method: one `node -e` command per mutation on the export, which exits 3 unless its anchor occurs once. After each run I restored the file with `git archive <head> <register.js> | tar -x` and compared it with `cmp` against `git show`, which returned 0 each time.

| Mutation | Apply and diff files | Test run file | Result |
|---|---|---|---|
| MU1 (the registration line removed) | `<S>/gmr-mu1-apply.txt`, `<S>/gmr-mu1-diff.txt` | `<S>/gmr-mu1-test.txt` | 78 pass, 4 fail, rc=1 |
| MU2 (`Monitor: e.command, ` removed) | `<S>/gmr-mu2-apply.txt`, `<S>/gmr-mu2-diff.txt` | `<S>/gmr-mu2-test.txt` | 78 pass, 4 fail, rc=1; each failure shows `target_sha256: "unavailable"` |
| MU3 (`guardShell($, e, next, cache, false)` replaced by `refuse($, e, cache, CATCH_VERDICT)`) | `<S>/gmr-mu3-apply.txt`, `<S>/gmr-mu3-diff.txt` | `<S>/gmr-mu3-test.txt` | 76 pass, 6 fail, rc=1 |

- MU1 and MU2 fail the same four tests:
  - `M-T1 a Monitor force-push is refused by G1 and logged with the tool Monitor`
  - `M-T2 a Monitor merge is refused by G7 and logged with the tool Monitor`
  - `M-T3 a Monitor plugin install is refused by G8 and logged with the tool Monitor`
  - `M-T4 a Monitor clean of the main checkout is refused by G9 and logged with the tool Monitor`
- MU3 fails those four plus:
  - `M-T5 a harmless Monitor command reaches the engine unchanged and writes no log line`
  - `M-T6 a Monitor watch with no command reaches the engine unchanged and writes no log line`
- The restore records are `<S>/gmr-mu{1,2,3}-restore.txt`.
- **MU3 also turning M-T1 to M-T4 red is not a finding.**
  - Section 4 declares MU3 for M-T5 and M-T6 and predicts only that they are "red by name". It predicts nothing about M-T1 to M-T4 under MU3.
  - The invalidator is "a mutation that does not turn its tests red", which does not apply here.
  - The extra reds follow from the code: `refuse` with `CATCH_VERDICT` returns `CATCH_REASON` with rule `catch`, so the assertions on G1's, G7's, G8's and G9's reasons fail.
- **The `// RECORDED MUTATION:` comments are true.**
  - The names in them match my failing names byte for byte.
  - The MU3 comments on M-T5 and M-T6 state the extra four reds.
  - Each names 727dc2fb as the commit observed, and register.js is the same there as at the head.
  - Each names 2.1.330, and `<S>/gmr-version.txt` shows `2.1.330 (Claude Code)`.

**4. The README lines against the code.**
- I checked each changed line in `<S>/gmr-diff.txt` and the full README in the export (`<S>/gmr-readme-grep.txt`).
- These lines match the code:
  - "Bash, Monitor and PowerShell" in the G1, G7 and G9 rows;
  - in the G6 row, that Bash and Monitor calls are not touched by G6 (`isPowerShell` is false for Monitor);
  - the sentence on the shell route;
  - the G8 bullet;
  - the clause on a watch with no command (`String(e.command ?? '')` gives an empty string, and M-T6 passes);
  - the M-E1 sentence;
  - the assumed-fields bullet.
- The G8 row and "Files" name no shells, and "The refusal log" stays true.
- **Judgment on the build line: the worker was right not to write "read at it".**
  - ADV-2026-11-22-12 item 2 (b) is the human's words. It names the README directly ("assumed, not read … the README … say so in those words").
  - Writing that Monitor's event shape was read at 2.1.330 would claim something P0 did not do (Amendment 1 item 2). That would be a Correctness finding.
  - So the wording follows the governing draft in substance.
  - But "read at no build" claims more than the evidence shows, and it is not the draft's words. The v0 form's Amendment 1 item (ii) (`governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md`, Amendment 1; `<S>/gmr-v0-monitor.txt`) located a Monitor entry in 2.1.288's type table, though it did not read its fields.
  - Replacement words are D1.

**5. The assumed-fields sentence.**
- Command: `grep -c -F` and `grep -o -F … | wc -l`. Result file: `<S>/gmr-sentence.txt`.
- The sentence occurs once in the draft's line 15, once in the whole draft, once in guardian.test.ts and once in README.md; `grep -o` counts two occurrences across the two files.
- It also occurs once in PR 357's body, which I read only (`gh pr view --json`, `<S>/gmr-pr-body.txt`).

**6. Validate.**
- `claude --version` printed `2.1.330 (Claude Code)` (`<S>/gmr-version.txt`).
- `claude plugin validate tools/mods/spatial-guardian` in the export exited 0 (`<S>/gmr-validate.txt`, `<S>/gmr-validate-rc.txt`).
- Both Monitor lines are present: `tool.call{tool=Monitor}` in the hooks list and `gating hook with .catch: tool.call{tool=Monitor}`.
- The other hook lines and the plugin warnings are byte-identical to Amendment 1's, apart from the export's path (`<S>/gmr-diff-am1-mine.txt`).
- Three non-hook lines differ because the export is not a git repository:
  - the export's run shows a `LICENSE_MISSING` problem;
  - it lacks the "repository root was taken to be…" note;
  - its "These plugin directory checks…" line is longer.
- Strict byte identity therefore cannot hold in an export.
- The worker's worktree run `<S>/gmb-validate.txt` has sha256 c8ecbacc46abb5d379b15e724b3a899a5b5e8b8e3d634616afb2464aacb71cd9, the hash Amendment 2 item 2 records (`<S>/gmr-gmb-validate-sha.txt`).
- My diff of that run against Amendment 1's block is exactly Amendment 2's two-line diff (`<S>/gmr-diff-am1-gmb.txt`).
- No types folder appeared after the tests and validate (`<S>/gmr-types-listing.txt`).

**7. The existing tests.**
- `claude plugin test tools/mods/spatial-guardian` at the head export: 82 pass, 0 fail, rc=0 (`<S>/gmr-test-head.txt`). The diff touches no existing test (107 lines inserted, 0 deleted), so the other 76 are unchanged. That matches the worker's baseline of 76 (`<S>/gmb-test-base.txt`).
- `node --test "scripts/hooks/*.test.mjs"` in C:/dev/wt/guardian-monitor at HEAD b6d88358 (`<S>/gmr-wt-head.txt`): 202 pass, 0 fail, rc=0, with the four parity tests passing (`<S>/gmr-hooks.txt`).
- `git status --porcelain --ignored` printed nothing before or after (`<S>/gmr-wt-status-before.txt`, `<S>/gmr-wt-status-after.txt`).

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation (each must be fixed before the merge):**

- **D1. README build line.** This is not the human's wording: it is a worker README line. The worker applies these words with no re-gate, and the PR body lists them.
  - Old (once in README.md, `<S>/gmr-oldtext-counts.txt`): `; Monitor's event shape was read at no build (see "What it does not claim").`
  - New: `; Monitor's event shape is assumed, not read: at 2.1.330 the engine wrote no type declarations into this folder (see "What it does not claim").`
  - Clause check:
    - "assumed, not read" is ADV-2026-11-22-12 item 2 (b).
    - "at 2.1.330 the engine wrote no type declarations into this folder" is the form's Amendment 1 item 2, and the export holds no `.claude-plugin/types/` after test and validate (`<S>/gmr-types-listing.txt`).
    - Nothing in the new words claims a read at any build.

- **D2. The README's departure from section 2 item 4 needs a record.**
  - Amendment 2 item 1 lets the draft govern only where sections 0, 3 and 5 differ from it. Section 2 item 4's "read at it" is set aside by the draft's item 2 (b), but no record says so.
  - Amendment 3 should carry one reference sentence: section 2 item 4's "and that Monitor's event shape was read at it" is superseded by ADV-2026-11-22-12 item 2 (b).

- **D3. README line 3 names moved form paths.**
  - The line this diff rewrites still names `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` and `tools/mods/GUARDIAN-V1-PREREGISTRATION.md`. Neither exists on main (`git cat-file -e` rc=128).
  - `governance/MOVED.tsv` maps them to `governance/forms/tools/` at a8ae51d9.
  - The stale paths predate this piece, but the file is in Scope.
  - Old (once): ``The forms are `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, `tools/mods/GUARDIAN-V1-PREREGISTRATION.md` and``
  - New: ``The forms are `governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md`, `governance/forms/tools/GUARDIAN-V1-PREREGISTRATION.md` and``
  - Clause check: both new paths exist at main 466318621a13 (`git cat-file -e` rc=0, `<S>/gmr-oldtext-counts.txt`).
  - Not the human's wording.

## Notes

- **N1. The validate check in an export.** As briefed, check 6 cannot be byte-identical in a folder that is not a git repository, because of the LICENSE and repository-root lines. Future briefs should name the worktree run, or accept the path and repository-root lines.
- **N2. `ws` beside `command`.** M-F1 to M-F5 carry `ws` next to `command`. Whether the installed Monitor input allows both together, and whether `ws` is a string, is not read. The decision reads only `tool`, `command` and `agentId`, so neither changes any verdict.
- **N3. The log tests check less than the existing one.** M-T1 to M-T4 skip three of the existing log test's checks: the ISO time, a single line ending in LF, and the file-path shape. These do not depend on the tool, and the existing test covers them. Section 3's list is met.
- **N4. R11 does not name Monitor.** If a report-only agent definition gains Monitor, G6 does not cover it. That is outside section 2 item 4's list and follows the draft's item 1 (a) (no G6 on Monitor). It is for the architect and the advisor.
- **N5. A possible types source.** The v0 form's types read at 2.1.288 took `<skill-root>/types/claude-code.d.ts`, which held a Monitor entry (`<S>/gmr-v0-monitor.txt`). P0 looked only at the mod copy's `.claude-plugin/types/`. The draft's item 2 (c) forbids further `claude` commands to look, so this is for the advisor: whether reading that file, if it exists at 2.1.330, would serve item 6.
- **N6. Commands and refusals.** No Guardian or harness refusal occurred. No `claude` command ran other than the three allowed ones, all in `<S>/gm-rev`.
