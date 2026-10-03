*Custodian's filing note (2026-10-03): the scoped read for PR #167's gate-3 landing condition C5 (and the record half of C4), by a reviewer, written to this path itself through its shell as its brief permitted, and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is c659ba68539508c9b3366465f07ec9be738d075b676e906556b60f4037e54826, computed by the custodian. It equals the reviewer's returned sha256.*

---

VERDICT: PASS
Reviewed cut/subagent-write-audit-script @ 20526b86883f255c2bd293888490b9a9506e1007. PR #167, scoped read for C5.

Scoped read only (items 1 to 4 of the custodian's brief); not a full gate. Main checkout at 35a51025d9fe480d07ac4844575496518b2319b5 (= origin/main after fetch). Nothing was changed.

## 0. Head

- `git fetch origin; git rev-parse HEAD origin/cut/subagent-write-audit-script` (in C:/dev/wt/write-audit): both `20526b86883f255c2bd293888490b9a9506e1007`. Worktree clean.

## 1. The reduction's bytes: PASS

- `git diff --stat f1e39550 20526b86`: `scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md | 14 ++++++++++++++`, 1 file, 14 insertions, 0 deletions. One commit in range (20526b86).
- Pure append: the form at f1e39550 is 83 lines; at 20526b86 it is 97. `cmp` of the f1e39550 file against the first N bytes of the 20526b86 file (N = byte size at f1e39550): identical. Line 84 at 20526b86 is a lone `\n` (the blank line); lines 85-97 are the block. File ends in `\n`.
- Architect report on main: fences at lines 97 and 111 (`grep -n '^```'`), inside Judgment 6 ("**6. Landing conditions and the reduction.**", line 88), after "The reduction, for the custodian to append exactly as written:".
- `sed -n 98,110p state/consults/gates/2026-10-03-subagent-write-audit-script-gate3-architect.md | sha256sum` (at 35a51025): `433b57a3ca56026c9272b547fefa15f713315323a78f1ab61c5df3da3f2e5938`
- `git show 20526b86:scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md | sed -n 85,97p | sha256sum`: `433b57a3ca56026c9272b547fefa15f713315323a78f1ab61c5df3da3f2e5938`
- Equal. Both files are LF (`file`: no CRLF).

## 2. Paths and anchors on main: PASS

`git cat-file -e HEAD:<path>` at 35a51025, all present:
- `state/directives/2026-09-18-record-cap.md`
- `state/consults/gates/2026-10-03-subagent-write-audit-script-gate3-architect.md` (anchor "S1": `## S1 (blocking)`, line 12)
- `state/consults/gates/2026-10-03-subagent-write-audit-script-gate3-reviewer.md`
- `state/consults/gates/2026-10-03-subagent-write-audit-script-gate2-reviewer.md` (anchor: `## Checklist results`, line 23; item 1, line 25: "1. S1-3 (gate 1) is resolved.")
- `state/consults/2026-10-03-subagent-write-audit-script-worker-report-5.md` (anchor: `## Live runs at head f1e39550 (--session e12d1b11-44e2-419b-9288-452e5556bf9f)`, line 19)
- `state/gate-log.json`
- `DECISIONS-PENDING.md` (the routed entry heading "OPEN 2026-10-03 — the write-audit form's unclassed "Mutations added" bullet" is present, cited by heading)

Not on main, by design: `scripts/hooks/subagent-write-audit.test.mjs` is the piece's own file. The reduction names it only at commits; `git cat-file -e` succeeds at 8173b1e6 and at f1e39550. 8173b1e6 is not yet an ancestor of origin/main, so the post-merge pin is correctly deferred to the PLAN node.

`state/gate-log.json` at 35a51025, records with node `subagent-write-audit-script`, attempt 3:
- index 369: gate `architect`, attempt 3, verdict PASS, "@ f1e39550, PR #167, ...gate3-architect.md"
- index 370: gate `reviewer`, attempt 3, verdict FAIL, "@ f1e39550, PR #167, ...gate3-reviewer.md"

## 3. C4, the record half: PASS

- `PLAN.yaml` at 35a51025, line 3779 `id: subagent-write-audit-script`, line 3789 `merge: merge-commit`.
- Line 3797 `id: subagent-write-audit-post-merge-pin`, `status: blocked`, `depends_on: [subagent-write-audit-script]`.
- `gh pr view 167`: OPEN, not draft, headRefOid 20526b86883f255c2bd293888490b9a9506e1007. The body says: "**The class-3 row (round 25, item 2 (d)):** line 5 of `scripts/hooks/subagent-write-audit.test.mjs` at 8173b1e6, superseded at 18715e4b. ... **So please merge with a merge commit, which keeps 8173b1e6 reachable from main. Do not squash.**" It closes with "Please merge with a merge commit, not a squash or rebase."
- `git show 8173b1e6:scripts/hooks/subagent-write-audit.test.mjs | sed -n 5p` gives `// scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md (Tests+mutation line, T1-T8). Each test`
- `git show 18715e4b -- scripts/hooks/subagent-write-audit.test.mjs` replaces exactly this line (hunk `@@ -2,7 +2,7 @@`, the `-` line above). The `+` line equals line 5 at f1e39550: `// scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md (T1 to T7 are the form's Tests+mutation line; T8 to T10 come from its Amendments). Each test`
- `git merge-base --is-ancestor 8173b1e6 18715e4b`: true. `git diff --quiet 8173b1e6 18715e4b~1 -- <test file>`: no change, so line 5 at 18715e4b~1 is the 8173b1e6 line.

## 4. CI at 20526b86: PASS

`gh pr checks 167` (second read; on the first read the two `test · verify:plan · queue/site drift` jobs were pending). rc=0:
- cfg boundary (PORTABILITY R2): pass, 7s (run 37132530187)
- cfg boundary (PORTABILITY R2): pass, 8s (run 37132532713)
- every commit is signed off: pass, 5s (run 37132532731)
- no profile path in the range: pass, 9s (run 37132532689)
- test · verify:plan · queue/site drift: pass, 1m11s (run 37132530187)
- test · verify:plan · queue/site drift: pass, 1m9s (run 37132532713)

`gh run view <id> --json headSha`: all four runs are at headSha 20526b86883f255c2bd293888490b9a9506e1007, all completed success.
