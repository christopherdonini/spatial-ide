Reviewed: PR #248 at 197d81ea607027f26511d9df39f44aea8d726fb5, gate 1, architect
Verdict: FAIL
Branch: cut/flush-crlf-field-rewrite @ 197d81ea607027f26511d9df39f44aea8d726fb5 (B = 1f669f21efade02fa4f26a97da5d48cb06f8bd47; main 5328670b6fef9da62277c86587e9384c7f4844f9)

The code change is correct, and §2, §4 and §8 are met. The gate fails on one Evidence finding, and the fix is about five lines of test. Separately, one sentence in a comment claims more than the code does: that needs new words only, with no re-gate.

## Correctness

**C1. Words only (§31): the contract comment claims a guarantee the code does not give in every case.**
- **Where:** `scripts/hooks/flush.mjs:23-24` at the head. The bullet ends "and no byte outside the rewritten values changes".
- **What is wrong:** the matcher at `flush.mjs:172` is `^${key}:\s`, so it accepts any whitespace character after the colon. The rewrite at `flush.mjs:187` always writes `${key}: ` with one space. So a field line hand-edited to `position:<TAB>old` comes back as `position: new`. The tab is not part of the value, and it changes.
- **Is it reachable?** Yes, by a hand edit of the working-tree ledger. That needs no timing, dev switch or instrumented build, so it is not exempt.
- **Behaviour is unchanged:** cfbf1e80 did the same.
- **Whose words:** not the human's. The worker applies the words below with no re-gate, and the PR body lists them.
- **Replacement for lines 23-24:**
  ```
  //   - a rewritten field line is written as `<label>: <value>` and keeps the line ending of the line
  //     it replaces (CRLF stays CRLF, LF stays LF); every other line is left byte for byte.
  ```
- **Clause check against the head:**
  - "written as `<label>: <value>`": `:187` writes `${key}: ${updates[key]}`, one colon and one space. The separator the old line had (whatever `\s` matched at `:172`) is not kept. True.
  - "keeps the line ending of the line it replaces": `:187` adds `'\r'` exactly when `lines[at].endsWith('\r')`, and the LF comes back from the `:162` split / `:189` join. A last line with no terminator gets none. True.
  - "(CRLF stays CRLF, LF stays LF)": T1 (a) and (b) prove it (`flush.test.mjs:306-314`). True.
  - "every other line is left byte for byte": `:185-188` assigns only `lines[lineForKey[key]]`, and `split('\n')` and `join('\n')` are inverses. T1's exact equalities and the existing test at `flush.test.mjs:82-94` prove it. True.
  - §8 item 4: these words state may-claim 1 and a narrower may-claim 3. They say nothing about CR-only text or normalization (§2.2).
- **The form needs the same narrowing:** its §1 may-claim 3 has the same over-breadth. Record it in one class 1 row (a gate finding is a post-result record, round 15 (g)) reading: "§1 may-claim 3 is read as the contract bullet at the head states it: a line other than the rewritten field lines is left byte for byte, and a rewritten line is written `<label>: <value>` with its old terminator; the separator after its colon is not kept (`updateBlockFields`'s rewrite)." That row is my wording, not the human's. It cites by function name, not by line, because the same commit edits `flush.mjs` (round 14).

## Evidence

**E1. Blocks: §1's Seams bullet claims T2 proves the written-file-into-readers seam for both readers. T2 proves it for `extractSessionContinuityBlock` only.**
- **What T2 compares:** the slice of `buildOutput` before `\n\nResume facts:` (`scripts/hooks/flush.test.mjs:331`, `:337`).
- **Where `parseSessionContinuity` goes:** `buildOutput` calls it (`scripts/hooks/session-resume.mjs:107`), but its result reaches only `resumeLine` (`session-resume.mjs:76-96`, `:114`), which is the part T2 cuts off.
- **The product reader left unasserted:** `precompact-flush.mjs:94-99` and `:193` read the working-tree ledger through `parseSessionContinuity`, which is the file this piece writes. No test asserts that reader on the CRLF write.
- **Reading alone says it is correct:** it splits on `\r\n|\r|\n` and trims values (`precompact-flush.mjs:61-79`). But the seam rule (round 4) asks for an end-to-end proof, not a reading. Claiming a proof the evidence lacks is an Evidence finding (directive 2026-10-05, section 2).
- **Fix (i), recommended.** Add to T2 in `flush.test.mjs` (5 lines; the file goes to 46 of 60 and the total to 51 of 68, so §7 holds):
  - after line 9: `import { parseSessionContinuity } from './precompact-flush.mjs';`
  - after `const printed = {};`: `const parsed = {};`
  - after `const written = …`: `parsed[name] = parseSessionContinuity(written);`
  - after the last assertion: `assert.deepEqual(parsed.crlf, parsed.lf);` and `assert.equal(parsed.lf.tip, 'feed1234');`

  Record this in one class 1 row: the assertion was added on this gate's finding. It is a seam proof, not a mutation kill: M1 does not fail it, because the reader normalizes. The reviewer at gate 2 checks only these lines and their run.
- **Fix (ii), if (i) is declined.** A class 1 row cutting the Seams bullet back to what T2 proves (round 15 (b)): "T2 proves the written file into `extractSessionContinuityBlock` through `buildOutput`; `parseSessionContinuity` is called on the same file but its result reaches only the Resume facts line, which T2 does not compare; that reader is read (§0), not proven." That leaves the round-4 seam rule unmet for `parseSessionContinuity`, which is why I recommend (i).

## Documentation

None beyond C1's form row. One fact for the record: §0's bullet "The existing suite does not pin the written line's terminator" turned out false for `rotate-cut-state.test.mjs`. Amendment 2 item 1 already says that test pins the LF terminator, so no further row is needed (record cap).

## §8, item by item

1. **Existing test assertions edited: none.** I read the test file at B (lines 1-297) against the head (lines 1-183 and 187-300) and found them identical. The worker's numstat shows 41 added and 0 deleted.
2. **New export, option or CLI flag: none.** The export list and `parseArgs` are the same at B and at the head. The only new code is the local `at` and the ternary (`flush.mjs:186-187`).
3. **Bytes changed on lines the update does not target: none,** including in a mixed file. Only lines listed in `lineForKey` are assigned, and the split/join is LF-only and unchanged (`:162`, `:189`).
4. **Contract comment versus may-claims 1 and 3: it says nothing beyond them.** C1 narrows the wording to what the code does.
5. **A `verify-mutation` run recorded as an observation: none.** MC8 to MC10 (`flush.test.mjs:184-186`) say "applied alone and reverted". The worker's report says no `verify-mutation` tool was used, and the custodian's filing note confirms that from the transcript. I could not read that transcript.
6. **Diff outside §7: none, as reported.** Two files, 5 and 41 lines. My count from reading agrees: `flush.mjs` +4/-1 and the test file +41/-0. I could not run `git diff` (no shell).

## What I checked, with evidence

- **§2.1 at the head:**
  - The terminator is decided per line, from the replaced line alone (`flush.mjs:186-187`).
  - The split (`:162`), the join (`:189`), the checks and their order (`:141-183`) are identical to B (`:139-181`, `:160`, `:186`).
  - "No new code path beyond the one terminator expression" holds.
- **§2.2:** there is one new bullet (`flush.mjs:23-24`), on may-claims 1 and 3 only. It overstates in the tab case (C1).
- **§1 claims and limits:**
  - May-claim 1 is proven by T1 (a) and (b).
  - May-claim 2 holds: on LF text no element ends with a CR, so the output is the same as B's. T1 (c) and the unedited suite cover it.
  - May-claim 3 needs C1's narrowing.
  - May-claim 4 is proven by T2 (`:329`, `:337`).
  - The CR-only limit is unchanged: `findBlockRange` gets a single element and the update throws "no block".
- **§1 Unchanged list:** the refusals, the cap code, the CLI `main`, `findBlockRange`, `blockFieldLabels`, `blockSizes`, `parseArgs`, `cutStatePath` and MC1 to MC7 all read identical at B and at the head. The other named files are not in the diff, as reported.
- **The CLI into `updateBlockFields` seam:** unchanged (`flush.mjs:274-282`).
- **The written file into its readers:** the actual interfaces read are `session-resume.mjs:45-57`, `:99-116` and `precompact-flush.mjs:61-79`. The gap is E1.
- **§4, T1** (`flush.test.mjs:306-314`):
  - (a) is `crlf(fixtureBlock())` updated by `u`, equal to `crlf(fixtureBlock(u))`.
  - (b) is `onlyTipCrlf` updated by `{tip, position}`, equal to `onlyTipCrlf(fixtureBlock(t))`. `.` does not match LF, so only the tip line gets a CR.
  - (c) is the LF case.
  - All three use exact equality, under strict `deepEqual` over the three-element array. That matches §4.
- **§4, T2** (`:316-338`):
  - Real ledger, normalized to LF and copied as CRLF; the CLI runs with all three fields explicit.
  - Its no-bare-LF regex `(^|[^\r])\n` is right.
  - The block equality covers the slice up to `\n\nResume facts:`, starting at 0. That includes C5's slice, so it is at least as strong.
  - The extra `includes('position: new position')` and the inert `CUSTODIAN_TELEGRAM_DRY_RUN` env (no TELEGRAM reference in `flush.mjs`, `session-resume.mjs` or `precompact-flush.mjs`) cause no harm.
- **MC8 to MC10:** they match §4's M1 to M3 and the worker's report. MC10 names the rotate-cut-state test, and that test exists by that name (`scripts/plan/rotate-cut-state.test.mjs:261`).
- **Amendment 2 against §3 to §5:**
  - The mechanism holds. Under M3, `seeded` (`rotate-cut-state.test.mjs:202`) carries a CR on each field; the rotation writes LF; and `:222`'s "its fields are the eight seeded lines" fails.
  - P3 is recorded as a class 2 result, with §3 unedited. No invalidator is met: I1 is not met, because P1 holds unedited.
- **The round 25 item 2 failures:**
  - §7 overrun: none.
  - Class 9 scope addition: none.
  - A `verify-mutation` run called an observation: none (§4 says the opposite).
  - A branch-commit span hash: none (Amendment 2 names commits only).
  - Five-line form: not applicable.
- **Verbatim quotes in the form, resolved by reading:**
  - "any property currently under test" matches `AUTONOMY.md:327`.
  - "LF, one final newline" matches `scripts/plan/rotate-cut-state.mjs:53`.
- **PR body:** it agrees with the form, the report and the code.

## Not run (no shell)

- the suites;
- verify-cites, verify-quotes, verify-test-claims and verify:plan;
- `git diff` / `numstat`;
- recomputing any sha256;
- branch CI.

The worker's report gives rc 0 for each; I have not reproduced them. The reviewer recomputes them.
