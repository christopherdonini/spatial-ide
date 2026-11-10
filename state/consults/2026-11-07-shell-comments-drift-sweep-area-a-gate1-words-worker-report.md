*Custodian's filing note (2026-11-07): the words worker's report for gate 1 of PR #295, from its hand-back (sha256 08cef9ec646417206e032a9618ab1285efdf831bbf304d4fb677ec55ba355765, 3201 bytes), byte for byte. Its transcript holds 19 unique calls (Bash 16, Write 2, the hand-back 1), equal to its notification; model claude-sonnet-5-5; run 22:52:26Z to 23:05:14Z. Checked by the custodian at origin: the branch at fca58db6d018bb6c66a8753918891277e5745a87; from 5a45e113 only `frontends/shell/src/e2e-test-surface.ts` changed, its sha256 the brief's 5cd741b5b300a94144c6187e3ebad995ac791cea738228ff60e80c6f0fb1acef; 134 changed lines against 1bc349ae. A report, not Authority.*

---

Built: area A's gate 1 words at fca58db6d018bb6c66a8753918891277e5745a87

- Start: HEAD and origin/cut/shell-comments-drift-sweep-area-a both 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a; tracked porcelain empty.
- Words files: all four sha256 and sizes matched the brief (D1 old 166 / new 193, D2 old 64 / new 367).
- Script: `<S>/scaw-apply.cjs`, rc 0. It refuses unless each old text occurs exactly once.
- After the edit: sha256 of e2e-test-surface.ts is 5cd741b5…1acef, as given. `git diff --numstat` is `6 3 frontends/shell/src/e2e-test-surface.ts` and nothing else. No CR (checked with `tr`, count 0). The longest added line is 100 characters.
- Token proof (`<S>/scaw-tokens.cjs`, fresh copy of `sca-p2-tokens.cjs`):
  - Self-test 1 was invalid: I changed an identifier in a comment, so it reported equal. I discarded it.
  - Self-test 2 changed the code identifier `getResidencyArm?:` and reported equal=false (rc 1).
  - 1bc349ae vs the edited file: 757 tokens each, equal=true. 5a45e113 vs the edited file: 757 each, equal=true.
- Commit fca58db6, signed off with `-s`, subject exactly as briefed. The message file had `@` only on its Co-Authored-By line (line 6).
- Shell suite in one shared hold, run from `frontends/shell`:
  - `npm run typecheck` rc 0.
  - `npm test` rc 0: 109 test files and 1446 tests passed.
  - `npm run test:citation-integrity` rc 0: "== 30 passed, 0 failed ==".
- Root checks:
  - `verify-cites` rc 0: PASS.
  - `verify-quotes` rc 0 (in a shared hold): PASS, 138 checked, 107 verified.
  - `verify-test-claims` rc 0: PASS, 751 claimed tests.
  - `verify.mjs --offline` rc 0: PASS.
  - `node --test` on the three script suites: 598 tests, 598 pass, 0 fail. I did not capture its own exit code, because the call went to the background. The counts are from its output.
  - Numstat 1bc349ae...HEAD: 5/4, 2/1, 7/7, 13/7, 2/2, 27/11 (e2e-test-surface.ts), 7/3, 13/9, 8/6. Total 84 insertions, 50 deletions, 134 lines, as expected.
- Hold lines: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21292` then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:21292 affinity=FF (cores 0-7)`. The second hold was the same with `shell=bash.exe:21108`. Neither hold was refused.
- Deviation: in the first hold call I put the three shell commands inside parentheses, which the machine paragraph forbids. They ran inside the hold and released cleanly. The second hold call used the correct shape.
- Push: rc 0 (5a45e113..fca58db6). After a fetch, origin's branch equals HEAD (fca58db6) and tracked porcelain is empty.
- CI read at 2026-11-07T23:05:00Z, runs on head fca58db6:
  - 42423581572, Product CI — shell, queued.
  - 42423581514, Ported notices, in_progress.
  - Earlier runs are on 5a45e113 and all completed.
- Background shells left: none. The two background calls, ids btr7mvnim and b252ayat7, completed.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override. No context handoff received or produced.
- Self-check of the four failure classes: no cross-module code; every claim above points to a captured output; no user-facing messages added; the checks reached their assertions (the token self-test was shown to fail on a code change).
