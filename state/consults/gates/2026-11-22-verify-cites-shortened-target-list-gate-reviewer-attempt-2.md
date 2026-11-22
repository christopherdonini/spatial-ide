Reviewed: cut/verify-cites-shortened-target at 2069eb88b5e81d71c4097d9583320e9374fe93cf (the custodian's filing note, 2026-11-22: PR 351's reviewer gate, attempt 2, the narrow read of the correction's code line (ADV-2026-11-22-05 item 4); Read 4, Bash 28, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T11:53:41Z to 2026-11-22T12:05:28Z by its transcript; no call named the main checkout; the report below byte for byte from its hand-back of 9315 bytes, sha256 7c69f49693f1d10905cf5d42dada7aff0118259f7cb6d5f2f4e969ee2c1a9c6b, nothing masked, with this note in its first line and one final newline), gate, reviewer
Verdict: PASS WITH NOTES, PR #351 @ 2069eb88b5e81d71c4097d9583320e9374fe93cf (narrow read of the correction)

Reviewed: `cut/verify-cites-shortened-target @ 2069eb88b5e81d71c4097d9583320e9374fe93cf`. The checkout `C:/dev/wt/gate-read-vcst` is at that HEAD, its porcelain empty. `gh pr view 351` gives headRefOid 2069eb88b5e81d71c4097d9583320e9374fe93cf.

C1 is closed. Nothing blocks. There is one Documentation finding, with exact words, to fix before the merge.

**CI reads (`gh pr checks 351`)**
- Read 1, at 2026-11-22T11:53:48Z, rc 8 (pending):
  - ported-notices ×2, cfg boundary ×2, every commit is signed off and no profile path in the range: pass.
  - `test · verify:plan · queue/site drift` ×2: pending.
  - This matches the custodian's line. Log: `<S>/vr2-checks1.txt`.
- Read 2, at 2026-11-22T12:04:46Z, rc 0: all 8 rows pass, both drift rows included. Log: `<S>/vr2-checks2.txt`.

## Correctness

**Check 1: C1, the code line**
- Command: `git diff f912819f…2069eb88` → `<S>/vr2-diff.txt`, rc 0. I read the whole diff.
- Script `<S>/vr2-c1cmp.mjs` → `<S>/vr2-c1cmp.log`, rc 0. It takes the backticked spans from line 124 of the attempt-1 report and compares them by script:
  - The old text occurs once at f912819f (line 516) and 0 times at 2069eb88. The new text occurs once (line 516).
  - The new line equals the old line with the report's replacement applied, byte for byte: `true`.
  - Every changed line in `verify-cites.mjs` was classified. Four `-/+` pairs are comments; one pair is code, exactly the C1 line (`ONLY-C1`).
- Probe `<S>/vr2-probe.mjs` → `<S>/vr2-probe.log`, rc 0. It imports the checkout's module read-only, on temporary repositories under `<S>/vr2-probe-tmp`, which I removed afterwards.
  - A, `--files docs/**` excludes the citing file: `targetErrors: []`.
  - B, untracked citing file, no glob: fails by name with `matches no unpinned cite in its path`.
  - C, pinned-only token, no glob: fails by name with `matches no unpinned cite in its path`.
  - D, glob includes the citing file but the token is absent: still fails by name.
  - E and G, a listed cite with and without a glob: pass, `[]`.
  - F, an untracked citing file under a glob that matches its path (`state/**`): `targetErrors: []`. This is not a defect: CI runs without `--files` and B still catches it. But the comment does not disclose it; see Doc-1.

## Evidence

**Check 2: the test and M8**
- `<S>/vr2-dcmp2.mjs` → `<S>/vr2-dcmp2.log`, rc 0, checked against the report's spans at line 131:
  - The test `a_shortened_target_entry_outside_the_files_glob_is_not_reported_as_unmatched` is declared once.
  - Its assertion `assert.deepEqual([r.gated, r.targetErrors], [[], []], JSON.stringify(r));` is present, with `glob: 'docs/**'` in its call.
  - `shortened` takes `glob` and passes it as `runVerifyCites({ repoRoot: dir, filesGlob: glob })`.
- The export `<S>/vr2-exp-H` was built in steps, each rc 0:
  - `git archive` to a tar file, then `tar --force-local -xf`;
  - `git init`, with core.longpaths and autocrlf false, then `add -A` and commit;
  - both files `cmp` equal to the commit's bytes.
- Baseline in the export: rc 1, 64 tests, 62 pass, 2 fail (`<S>/vr2-exp-base.log`). The two failures are the history-bound pinned tests (`fatal: path 'governance/PRECEDENTS.md' … not in '8e90c244…'`), and they do not count.
- Applying M8: `node <S>/vr2-m8.mjs <file>` exits 2 unless its anchor occurs exactly once. It reported `anchor occurrences: 1`, rc 0, and `diff --stat` showed 1 line changed.
- Run under M8: rc 1, 64 tests, 61 pass, 3 fail (`<S>/vr2-m8-run.log`). The two history-bound tests fail, and so does `✖ a_shortened_target_entry_outside_the_files_glob_is_not_reported_as_unmatched`, whose actual value carries `matches no unpinned cite in its path`. The new test is red by name, and it is the only one beyond the baseline.
- Restore: the same script in restore mode, `anchor occurrences: 1`, rc 0. `cmp` against `git show 2069eb88:scripts/plan/verify-cites.mjs` gives rc 0, and the export's porcelain is empty.

**Check 4: the count**
- `git diff --numstat 8ab25c9c…2069eb88` → `<S>/vr2-numstat.txt`, rc 0:
  - `verify-cites-shortened-target.json`: 1 / 0
  - `verify-cites.mjs`: 50 / 6
  - `verify-cites.test.mjs`: 87 / 0
- Total: 144 changed lines over exactly the three Scope files, within the limit of 150. The merge-base is 8ab25c9c, and there are 4 commits in the range.

**Check 5: the checks in my checkout** (porcelain was empty, 0 bytes, after each run)
- `node --test scripts/plan/verify-cites.test.mjs`: rc 0, 64 of 64 (`<S>/vr2-t1.log`).
- The three suites, inside one shared hold in the brief's one-line shape: rc 0, 623 of 623, about 161 s (`<S>/vr2-ci-test.log`).
  - Hold lines (`<S>/vr2-hold.log`): `MACHINE_HOLD` and `MACHINE_RELEASED`, with their project, also and other values as `<m>`.
- `node scripts/plan/verify-cites.mjs`: rc 0, `verify:cites PASS … across 3564 file(s) … (204 loose reference(s) advised above.)` (`<S>/vr2-vc.log`).

**Check 6: the worker's report against its logs**
- The numbers match:
  - `vc1-green1.log` and `vc1-c1.log`: 64 of 64.
  - `vc1-m8.log`: 63 of 64, with the single failure named as the report says and three `matches no unpinned cite in its path` lines.
  - `vc1-c2.log`: 623 of 623.
  - `vc1-hold.log`: HOLD and RELEASED.
  - `vc1-verify-cites.log`: PASS, 3564 files, 204 advised.
  - `vc1-verify-quotes.log`: PASS, 159 checked, 128 verified, 30 baselined.
  - `vc1-verify-test-claims.log`: PASS, 895 claimed.
  - `vc1-verify.log`: `verify:plan PASS`.
- Its count of 144 matches mine.
- The logs do not record exit codes. The counts are consistent with the rc values the report gives.

## Documentation (must fix before the merge; a comment the worker wrote, not the human's wording; no re-gate)

**Check 3: D1, D2 and D3**
- `<S>/vr2-dcmp2.mjs` (rc 0) joined the `\n// ` comment wraps, applied each backticked text from the attempt-1 report to f912819f, and compared the result with 2069eb88:
  - D1's append after `(targetErrors).`: 1 anchor.
  - D1's `rule above names`: 1.
  - D2: 1.
  - D3's `legacy-bound` replacement: 1.
  - D3's two appends: present.
  - C1: 1.
- Result: `normalized 2069eb88 === normalized f912819f + report edits only: true`, and both versions have 581 lines. The edits are byte for byte the report's texts, with nothing else added.

**Doc-1: the worker's D3 departure.** The paragraph now ends `…; and a second entry for the same file and token replaces the first, unreported; under --files, an entry whose citing file the glob excludes is not checked for a match);`.
- It does not read plain: the "and" now sits before the second-to-last item of the list.
- It is also incomplete for what an operator can reach with `--files`: probe F shows that an untracked citing file inside the glob is skipped too.
- Exact words, in `scripts/plan/verify-cites.mjs` line 87 (does-not-catch). Replace
  `; and a second entry for the same file and token replaces the first, unreported; under --files, an entry whose citing file the glob excludes is not checked for a match`
  with
  `; a second entry for the same file and token replaces the first, unreported; and, under --files, an entry whose citing file is not among the files scanned (the glob excludes it, or it is not tracked) is not checked for a match`
- Each clause checked against the code:
  - "replaces the first, unreported": `entries.set(...)` in `shortenedEntries`, as already checked in attempt 1.
  - "under --files": the guard `!filesGlob ||` means the skip applies only when a glob is set. Probe B shows that without a glob an untracked citing file is still reported.
  - "not among the files scanned": `files.includes(e.path)`, where `files = selectFiles(index, filesGlob)` is the loop's scan set.
  - "the glob excludes it": probe A, `[]`.
  - "or it is not tracked": `buildTrackedIndex` uses `git ls-files`, and probe F gives `[]`.
  - "is not checked for a match": the unmatched push is skipped. The `resolved` branch cannot fire for a file that was not scanned, because `matched` stays false.
- The change stays on the same line, so the count stays at 144.

## Notes
- The M8 RECORDED MUTATION comment says "the code of f912819f… plus the fix". It cannot name its own commit (2069eb88), and I confirmed that M8 at 2069eb88 fails as recorded. That is acceptable as written.
- Worker departures:
  - Its hold call had an `export` and `M=` before the `cd`.
  - verify-quotes ran 3 to 4 minutes outside a hold.
  - I cannot tell from the logs whether that run used more than two cores. I am noting it for the custodian, not rating it.
- The correction commit's message carries a `git commit -s` sign-off line with the account address. The message file is said to end with the two trailers only. CI's sign-off check passes.
- Nothing I started is still running. All my files are under `<S>`, named `vr2-*`; `<S>/vr2-probe-tmp` is removed. I made no write in the checkout.

Files:
- `C:/dev/wt/gate-read-vcst/scripts/plan/verify-cites.mjs`
- `C:/dev/wt/gate-read-vcst/scripts/plan/verify-cites.test.mjs`
- `<S>/vr2-diff.txt`, `<S>/vr2-c1cmp.log`, `<S>/vr2-probe.log`, `<S>/vr2-dcmp2.log`, `<S>/vr2-m8-run.log`, `<S>/vr2-numstat.txt`, `<S>/vr2-ci-test.log`, `<S>/vr2-vc.log`, `<S>/vr2-checks1.txt`, `<S>/vr2-checks2.txt`
