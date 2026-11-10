Reviewed: PR #245 at 0f93c12264879535ac40de1d87f0139bc927fbf5, gate 1, reviewer
(cut/questions-mirror-item-count @ 0f93c12264879535ac40de1d87f0139bc927fbf5)
Verdict: FAIL

The fail rests only on the words of two sentences. Under AUTONOMY.md §31 and the 2026-10-11 directive, item 2, the code's Correctness and Evidence are closed. Neither sentence is the human's wording, so the worker applies the words below with no re-gate, and the PR body lists them. All Evidence checks reproduce.

## Correctness (wording only, §31: replacement words given)

**C1. The `countItems` doc comment states two limits the code does not hold** (`scripts/hooks/questions-mirror.mjs:46-49` at the head; form §8 item 6). This is a worker's doc comment, not the human's wording.
- Second limit, byte-copied: ` * question whose own text holds a paragraph opening with the next item's number is counted one high. */`
  - This is untrue. My probe (scratch `qmic-g1r-limits.mjs`, rc=0) ran the shipped `countItems` at H:
    - (A) item 1 holds a paragraph `2. `, 3 real items: count 3. That is right, not one high.
    - (B) last item 2 holds `3. ` and `4. `: count 4, two high.
    - (C) last item 3 holds `4. `: count 4.
- First limit: "counts 0" is not guaranteed.
  - (D) is a file with `Item <n>` items and a paragraph-opening `1. `/`2. ` answers list. It counts 2.
- Ordinary use can reach both cases: a question text with a blank-line numbered list, on a round over 4096 code points.
- Replacement words (the whole comment; it grows from 4 lines to 5, so the mjs numstat becomes 16/6 = 22 ≤ 30 and the total 66 ≤ 120):
```
/** Item count = the numbered items `1. `, `2. `, ... each opening a paragraph (the first line or a line after
 * an empty line), counted in order from 1. Best-effort, for the summary line only. Two limits: a file
 * whose items are not numbered `<n>. ` at a paragraph's start (some hand-written ones) is not counted by
 * its items, and reads 0 unless another paragraph opens `1. `; and a paragraph inside a question's text
 * that opens with the next number in the sequence is counted as an item, so the count can read high. */
```
- Clause check:
  - "counted in order from 1": `expected = 1` and the equality test (mjs:51, :54).
  - "not counted by its items": only a line that matches `^(\d+)\. ` with `afterEmpty` increments (mjs:54).
  - "reads 0 unless another paragraph opens `1. `": the first increment needs a paragraph-opening `1. `. In I1 at H, rounds 1 and 32 read 0; probe D reads 2.
  - "counted as an item": mjs:54 compares only to `expected` (probes B, C).
  - "can read high": probes B and C. Probe A, which reads right, is allowed by "can".
  - Both limits stay within §1's two may-not-claim bullets.

**C2. The PR body's red-line sentence claims more than the §7 pattern does.** This is the worker's wording.
- Byte-copied: "The hook's header now lists a question as red-line when its text opens with the marker, possibly after one leading label ending `. ` or ` — `."
- The lead `[^.—\n]*?` (mjs:128) rejects any label that holds `.`, `—` or a line break.
- My probe (scratch `qmic-g1r-redprobe.mjs`, rc=0) ran the shipped hook in dry-run on four questions, and the header read `RED LINE items: 3, 4.`:
  - item 1, `AUTONOMY.md section 25 — RED LINE (a scope change)`, was not listed;
  - item 2, `Item 5. F — RED LINE (two labels)`, was not listed;
  - item 3, `Do we proceed — RED LINE items stay held?`, was listed;
  - item 4, `OPEN-1 — RED LINE (a ruling)`, was listed.
- Ordinary use can reach this: a label naming a file.
- Replacement words: "The hook's header now lists a question as red-line when its text opens with the marker, possibly after one leading label that holds no `.`, `—` or line break and ends `. ` or ` — `; a question whose label holds one of those (a file name such as `AUTONOMY.md`, say) is not listed."
- Clause check:
  - The lead class and the terminator are as stated (mjs:128).
  - Probe items 1 and 2 are not listed; item 4 is listed.
  - All 28 marker-bearing questions in rounds 36 to 73 are listed (I2 reader rows below).
- The same overstatement sits in the form's §1 claim 3. That text is the architect's, and the form is append-only. Words for an amendment the custodian appends: "§1 claim 3 is bounded by §7's red-line lead: a leading label that holds `.`, `—` or a line break is not read, so a question such as `AUTONOMY.md section 25 — RED LINE (a scope change)` is not listed; a question such as `Do we proceed — RED LINE items stay held?` is listed, its first clause read as the label." Its clause check is the same probe (items 1 and 3).

## Evidence
None. Everything below reproduces.

## Documentation (must fix before the merge)

**D1. `scripts/hooks/README.md:254` is now stale for n = 1 and n = 0.** It gives the summary as `(`Question round <n> — <k> items; full text attached (copy-paste ready)`)`. The README is outside §7's two files, so §8 item 5 and I4 rule out an in-PR edit without an appended scope amendment (class 9) made before the edit; otherwise the fix is routed as a node. Words either way: "(`Question round <n> — <k> items; full text attached (copy-paste ready)`, with `1 item;` for one item and no count when the file has no paragraph-opening `<n>. ` item)". Clause check: the three branches of mjs:63.

**Read, not findings:**
- §8 item 3, read literally, also catches T14 (b) and (c). §4 orders both, so I read §8 item 3 against T14 (a) and T13; both of those start from hook-written or committed text.
- M15 and M18 are the same edit, recorded against different tests (T14 and T13). Both are true.
- My own shell environment carries both Telegram variables: 2 by name, values not printed. Every run here excluded them: I2 and both probes built the child environment explicitly, and the test file deletes the two variables at :17-18 before `childEnv`.

## What I checked (command → exit code)

1. **Diff.**
   - `git diff c7e94a85…0f93c122` → 0. Two files: `questions-mirror.mjs` and `questions-mirror.test.mjs`.
   - `git log c7e94a85..0f93c122` → 0. Two commits: f5570106 and 0f93c122.
   - Main has not changed either file since B: `git diff --name-only c7e94a85 origin/main -- <2 files>` → 0, empty.
   - No new export. No round file edited: `git diff --stat B H -- state/questions` → 0, empty.
   - Caller grep (`git grep countItems|buildSummary|full text attached`) → 0. The only product caller is `mirrorRound`.
   - The PR body's gates claim resolves to item 1 of the 2026-10-23 weekend OPEN-items directive.
2. **Mutations.**
   - My applier is scratch `qmic-g1r-mut.mjs`; it exits 2 unless its anchor occurs exactly once. My runner is `qmic-g1r-mut.sh`. Each run: porcelain shown before, apply, `node --test scripts/hooks/questions-mirror.test.mjs`, `git checkout`, porcelain shown after.
   - Baseline at H → 0, 19/19 pass.
   - For every mutation below: apply rc=0, test rc=1, checkout rc=0, porcelain `[]` before and after.

     | Mutation | Failing test(s) | Line | Observed |
     |---|---|---|---|
     | M15 | T14 | (a) | `5 items` against `4 items` |
     | M15 (also) | doc-path test, T13 | | |
     | M16 | T14 | :376 | `5 items` against `3 items` |
     | M17 | doc-path test | :65 | `0 items` |
     | M18 | T13 | :356 | `2 items` |
     | M18 (also) | doc-path test, T14 | | |
     | M19 | T15 | first match | message `round 52`, header `none` |
     | M20 | T15 | :393 | `RED LINE items: 1.` |
     | M21 | T14 | :377 (CRLF) | the n = 0 text |

   - All seven match the worker's record at f5570106. The mjs is the same at f5570106 and at H. None was observed by a `verify-mutation` run.
3. **I1 and I2.**
   - I read the worker's `qmic-i1.mjs` and `qmic-i2.mjs` and did not run them.
   - My own script, scratch `qmic-g1r-i12.mjs`:
     - At H → 0.
     - At B → 0, against B's `scripts/` tree from `git archive c7e94a85` (→ 0) and `tar` (→ 0). Its `questions-mirror.mjs` is identical to `git show B:` (diff → 0).
   - Child environment keys: `CUSTODIAN_TELEGRAM_DRY_RUN,PATH,Path,SYSTEMROOT,SystemRoot,TEMP,TMP`; token false, chat id false, dry-run=1.
   - Each of the 38 runs per commit: status 0, one dry-run line, q = k, and its temporary project removed (0 left).
   - Against the filed record, column by column: I1 at B, I1 at H, I2 at B and I2 at H each diff → 0 (74, 74, 39 and 39 lines). The four block sha256s recompute equal (3f8cd3b7…, acb38597…, fc4b2a2d…, 12d2a10e…).
   - Against §3: 55 files change and 18 stay the same, each delta as in the table; hook-written mismatches 0. I2 at H equals §3's list table, with 13 rounds differing from their committed headers (45, 46, 52 to 59, 61 to 63).
   - Reader step: all 28 item questions in rounds 36 to 73 that hold `RED LINE` hold it in their lead, and all are listed (for example `Round 59, item 2 — RED LINE`, `OPEN-2 and OPEN-3 — RED LINE`). No invalidator is met.
4. **§7.** `git diff --numstat B...H` → 0: mjs 15/6 = 21 ≤ 30; test 41/3 = 44 ≤ 90; total 65 ≤ 120.
5. **Pins.** All 19 `path:line @ 769c39af… sha256` pins recompute OK (`git show rev:path | sed -n a,bp | sha256sum`). 769c39af is a commit on origin/main (`merge-base --is-ancestor` → 0).
6. **Suites at H** (in the worktree; porcelain `[]` after):
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside `<M> hold shared -Project SpatialIDE` (MACHINE_HOLD granted, MACHINE_RELEASED), with both Telegram variables unset → 0. 545 tests, 545 pass, 0 fail. No parity misread; the `not judged` lines are diagnostics on passing tests.
   - `verify.mjs` → 0 (PASS).
   - `verify-cites.mjs` → 0 (2241 files; 112 advisory).
   - `verify-quotes.mjs` → 0 (131 checked, 0 errors).
   - `verify-test-claims.mjs` → 0 (624).
   - `queue.mjs --check` → 0.
   - `site.mjs --check` → 0.
7. **CI.**
   - `gh pr checks 245` → 0: 8 rows, all pass.
   - `gh run list --branch cut/questions-mirror-item-count` → 0. Its six runs at head sha 0f93c12264879535ac40de1d87f0139bc927fbf5 all succeeded: 39936664501, 39936664442, 39936664499, 39936664428, 39926449308 and 39926449373. The Governance CI run at f5570106 was cancelled and superseded.

The worktree was left clean at 0f93c122, porcelain `[]`. My scratch files all start `qmic-g1r-`. Nothing was committed or pushed, and no PR action was taken.
