# Milestone 5's second part, PR B: the architect's build-gate words applied, the worker's report at 42859420 (node:shell-migration-milestone-5@pr-b-architect-words)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/m5b from e958b913240d296b7229cd976831b205fc8adbde and pushed 42859420101bd5d17db7c16eff444a080ec5dd9a. By the facts script its records run from 2026-11-28T02:40:32Z to 2026-11-28T02:51:18Z, and 23 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 646481 ms and 28 tool uses. Its hand-back is below as received, with the harness indent removed: 2814 bytes, sha256 9852f12c0fe5348890f3ccf0e117a7122c7f6dade4401c927c99ccd406d5f748. Its brief forbade reading any file under a temp folder; by its own account it tried once, the read was refused, and it did not retry.*

---

42859420101bd5d17db7c16eff444a080ec5dd9a is pushed; every step completed, no stops. Model: Sonnet 5.5, no override, no handoff.

Commits (both pushed, each in its own call):
- 5dbb45f731e0798a6179e85a9adf595230ce8911 "fix: milestone 5 PR B, the architect's build-gate words applied by script (E-1, E-2, D-2 to D-7)"
- 42859420101bd5d17db7c16eff444a080ec5dd9a "docs: milestone 5 PR B, J-A1's recorded mutation observed again at the architect's build-gate words commit"

Start state: head e958b913240d296b7229cd976831b205fc8adbde, tree clean. The report was 18823 bytes with the sha256 you gave.

Script: D:/wt/m5b-logs/apply-words.mjs. It pulls each old/new from the report's lines by backtick delimiters. It counts every old first and writes nothing unless each stands once.
- Output: PRE showed old count 1 for all 15 pairs: E-1, E-2.1, E-2.2, E-2.3, E-2.88, E-2.README, D-2, D-3, D-4, D-5a, D-5b, D-6a, D-6b, D-6c and D-7. POST showed each new once and OK for all 15. Exit code 0.
- D-5b: its old text is a prefix of its new text, so one old occurrence remains inside the new. The script checked "old remaining" as the count of old inside new, so that case reads OK.
- The U+2014 bytes (e2 80 94) are present in the E-1 line.
- The diff was 8 files, 15 insertions and 16 deletions.
- Early script runs died on parsing before any write; the tree was clean until the counts passed.

J-A1 mutation:
- I applied it at 5dbb45f7: App.tsx line 2690 with `onCancelScan={() => applyScanEvent({ kind: "reset" })}`. Then I ran App.jobs.test.tsx.
- Failed: the J-A1 test. The assertion was "relinquishFill's own statement, the same as FilterPanel's Cancel gives: expected undefined to be 'Filling stopped — showing 3 features …'". That is the same failure text the record already carried.
- Reverted with git checkout; the tree was clean.
- Commit 2 changes only the commit id on the J-A1 OBSERVED line (line 235 of App.jobs.test.tsx), from 12f326aa… to 5dbb45f7…. The date and failure text are unchanged. No other record line changed.

Checks:
- `node --check frontends/shell/e2e/jobs.mjs`: 0.
- App.jobs.test.tsx alone: 3 passed, after the words and again after the record edit.
- `npm run verify` at 42859420: exit 0, log D:/wt/m5b-verify-2.log. It ran inside a shared hold, and the release ran. The log shows 135 test files, 1684 tests passed. It also shows 76 passed, 0 failed, then 30 passed, 0 failed, then node tests with fail 0.
- Disk before verify: C: 41922 MB, D: 24952 MB, both above the floors.

Departures: none from the brief.
- I tried to read the background task's output file under the temp folder once; the permission classifier denied it, and I did not retry.
- No app, e2e suite or dev server was started. No PR was opened. D-1 is not applied.
- `git status --porcelain` in D:/wt/m5b is empty.
