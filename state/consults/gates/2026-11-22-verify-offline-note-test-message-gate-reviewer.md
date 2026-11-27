Reviewed: cut/verify-offline-note-message at c3bd9798de2933c51811cb90df240c04da009361 (the custodian's filing note, 2026-11-22: PR 354's single gate under its five-line form, the reviewer alone; Read 2, Bash 18, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T13:19:14Z to 2026-11-22T13:22:25Z by its transcript; no call named the main checkout; no compaction; the report below from its hand-back of 8440 bytes, sha256 22bedf29b4f19703cf75443df21fe405dac2eb2a14965c893a9e7dcd09a0fbc8, byte for byte but for one mask: the profile root before the reviewer's own <u>, written with doubled backslashes in three quoted paths, is written as <u>; with this note in its first line and one final newline), gate, reviewer
Verdict: PASS WITH NOTES, PR #354 @ c3bd9798de2933c51811cb90df240c04da009361

(Reviewed: cut/verify-offline-note-message @ c3bd9798de2933c51811cb90df240c04da009361, base main @ 166ef0671a2b18069765de36b16c1ca3275f6f7e. All times are UTC from `date -u`.)

## Correctness

No findings.

- **Form unchanged on the branch.** `git -C C:/dev/wt/vont diff --quiet 166ef067 c3bd9798 -- governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-MESSAGE-PREREGISTRATION.md` gave rc=0. I read the form whole.
- **Check 1, the diff.**
  - `git -C C:/dev/wt/vont diff 166ef067...c3bd9798` gave rc=0. `--numstat` gave `2	2	scripts/plan/verify.test.mjs`, rc=0. That is one file and 4 changed lines, within the budget of 12.
  - The only changed lines are 272 and 273 of the head file. Both are the two `assert.ok` calls in the test that starts at line 267, `runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked`.
  - A node script compared `git show 166ef067:scripts/plan/verify.test.mjs` with `git show c3bd9798:scripts/plan/verify.test.mjs` (copies in <S>/vont-rev/base.mjs and head.mjs) and gave rc=0:
    - both files have the same number of lines, and only lines 272 and 273 differ;
    - on each of those lines the script found the added argument as an exact suffix and removed it, and the result was byte-identical to the base line (`272 stripped===base: true`, `273 stripped===base: true`).
  - So each call gains only a message argument, and neither condition changes. The test name, the prefix `makeTempDir('verify-offline-note-')` (one occurrence, by grep) and every other line are unchanged.
  - The first message is `` `notes runVerify returned: ${JSON.stringify(result.notes)}` ``, the notes as JSON.
  - The second message is `` `failures containing pr: ${JSON.stringify(result.failures.filter((f) => f.includes('pr')))}` ``. Its filter uses the same predicate as the condition, `f.includes('pr')`, so it prints exactly the failures that make the assertion fail.
  - The message arguments are evaluated after the condition. They only stringify arrays of strings, so they cannot throw or change the outcome.
  - `git -C C:/dev/wt/vont log --format=%B 166ef067..c3bd9798` holds one commit, `test: verify.test.mjs: the offline-note test's two assertions say what they saw`, with a `Signed-off-by:` trailer.
- **Check 5, the cause the finding records.** Nothing in the diff fixes or hides the cause (the random characters in the temporary folder's name). The prefix, the fixture, the `includes('pr')` predicate and the conditions are untouched. The change only adds text to the failure message, and M1 shows it still fails on a folder path that contains `pr`. That matches the form's Change line ("is not fixed here").

## Evidence

No findings.

- **Check 2, M1 re-observed in an export.**
  - **The brief's export command failed.** `git archive c3bd9798 scripts package.json` gave `fatal: pathspec 'package.json' did not match any files` (tar rc=2): there is no root package.json at c3bd9798 (`ls-tree` checked). I exported `scripts` alone into <S>/vont-rev (rc=0).
  - **The scripts-only baseline was red.** `timeout 300 node --test scripts/plan/verify.test.mjs` gave 24 tests, 17 pass, 7 fail, rc=1 (<S>/vont-rev-baseline.log). The failures came from the export's missing files (no docs/, fixture paths and so on).
  - **The whole-tree export was also red at first.** As the brief allows, I made a whole-tree export into <S>/vont-rev-full (`git archive c3bd9798 | tar -x`, rc=0). The run gave 13 pass and 11 fail, rc=1 (<S>/vont-rev-full-baseline.log), because `git ls-files -z` failed with `fatal: not a git repository`. The tests need a git index.
  - **What I changed in the export.** Inside <S>/vont-rev-full only, I ran `git init` and `git config core.longpaths true`, then `git add -A`. I made no commit. That gave 4027 indexed paths against 4073 in the tree at c3bd9798; I take the gap to be paths the export's own .gitignore matches.
    - A first `git add` without longpaths failed on a long file name, and that run gave 19 pass and 5 fail (<S>/vont-rev-full-baseline2.log).
  - **Baseline:** with the index in place, the run gave 24 tests, 24 pass, 0 fail, rc=0 (<S>/vont-rev-full-baseline3.log).
  - **M1 applied.** One anchored command: grep counted `'verify-offline-note-'` (anchor=1), and the command would have refused on any other count. sed then replaced it with `'verify-offline-note-pr-'`. Line 268 now reads `const dir = makeTempDir('verify-offline-note-pr-');`.
  - **M1 run:** `timeout 300 node --test scripts/plan/verify.test.mjs` gave 24 tests, 23 pass, 1 fail, rc=1 (<S>/vont-rev-m1.log).
    - The only failing test is the form's test.
    - It fails at the second assertion (`verify.test.mjs:273:10`), with `generatedMessage: false`.
    - The message lists five failures that contain pr, each with its folder path.
  - The message's first 300 characters, from <S>/vont-rev-m1.log line 38. The 300-character cut falls inside the profile segment of the third entry, written as <u>:
    `failures containing pr: ["queue drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-7n5cdC\\CUSTODIAN-QUEUE.md does not exist","queue drift: <u>\\AppData\\Local\\Temp\\verify-offline-note-pr-7n5cdC\\CUSTODIAN-QUEUE.json does not exist","site drift: <u>`
  - So M1 is re-observed. The run also shows the shape of the flake: the failures contain `pr` only through the folder path, and none is about PR evidence. I did not revert the export.
- **Check 3, the worker's claims against its logs.**
  - Baseline 24 of 24: shown. <S>/vont-base.log has `ℹ tests 24`, `ℹ pass 24`, `ℹ fail 0`.
  - C 24 of 24: shown. <S>/vont-c.log has tests 24, pass 24, fail 0.
  - M1 23 pass and 1 fail: shown.
    - <S>/vont-m1.log has tests 24, pass 23, fail 1. The failing test is the form's, at `verify.test.mjs:273:10`.
    - The message line in the report (<S>/vont-report.md line 10) is byte-identical to log line 38 with its leading spaces removed (node comparison, `true`).
  - After the restore, 24 of 24: shown. <S>/vont-after.log has tests 24, pass 24, fail 0.
  - CI scripts suite 623 of 623: shown. <S>/vont-ci.log has `ℹ tests 623`, `ℹ pass 623`, `ℹ fail 0`.
  - numstat `2 2`: my own numstat run (check 1) shows it; it is not a log claim.
  - None of the logs records an rc or the commit it ran at. The rc claims rest on the counts: `fail 0` matches rc=0, and `fail 1` matches rc=1. See N3.
- **Check 4, CI.**
  - `gh pr checks 354` gave rc=0, with 8 of 8 checks passing:
    - cfg boundary ×2;
    - every commit is signed off;
    - no profile path in the range;
    - ported-notices ×2;
    - test · verify:plan · queue/site drift ×2.
  - `gh pr view 354 --json headRefOid,isDraft` gave `headRefOid` c3bd9798de2933c51811cb90df240c04da009361 and `isDraft` true, rc=0.
  - My read time is 2026-11-22T13:21:44Z, at the same head as the custodian's read at 13:18:22Z.

## Documentation

No findings.

## Notes

- N1. The brief's export command (`archive c3bd9798 scripts package.json`) cannot run at this commit, because the repository has no root package.json. The scripts-only export also cannot reach a green baseline. Two things are needed: a whole-tree export, and a git index built inside it with `core.longpaths=true`. A future brief for verify.test.mjs mutations should say so.
- N2. PR #354 is still a draft (`isDraft: true`). It needs `gh pr ready` before the merge.
- N3. The worker's logs carry no rc and no commit id, so vont-base.log and vont-c.log cannot be told apart by their content. The counts are consistent with every claim, and my own export runs re-observe both the green head and M1.
- N4. The commit's `Signed-off-by:` trailer carries an email address, the standard `-s` / DCO form. CI's "every commit is signed off" passes on it. I am recording it only because it touches the custodian's standing rule against email in message files; it is not part of this form's checks.
- Files I wrote, all under <S>:
  - <S>/vont-rev/ (base.mjs, head.mjs, the scripts export);
  - <S>/vont-rev-full/ (the whole-tree export with its scratch index, M1 applied);
  - <S>/vont-rev-baseline.log, <S>/vont-rev-full-baseline.log, <S>/vont-rev-full-baseline2.log, <S>/vont-rev-full-baseline3.log, <S>/vont-rev-m1.log.
  - I made no write, commit, push or fetch in C:/dev/wt/vont or C:/dev/spatial-ide.

Model: Opus 5.5 (claude-opus-5-5)
