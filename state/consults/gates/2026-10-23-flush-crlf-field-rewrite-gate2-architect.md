Reviewed: PR #248 at 9beca99e3c99862d86684fee2c6bd18cce89e92c, gate 2 (scoped), architect
Verdict: PASS
Branch: cut/flush-crlf-field-rewrite @ 9beca99e3c99862d86684fee2c6bd18cce89e92c (B = 1f669f21efade02fa4f26a97da5d48cb06f8bd47; main 384de54b938f37867d9dc7e3b762409a202c04ae)

Both of gate 1's findings are fixed at this head. The comment now carries my C1 words, byte for byte, and each clause is true of the code. T2 now proves the written file into both readers. Nothing blocks.

## Correctness
None.

## Evidence
None.

## Documentation
None.

## What I checked, with evidence

**1. C1: the contract bullet** (`scripts/hooks/flush.mjs:23-24` at the head)
- **The words match.** Head lines 23-24 read:
  ```
  //   - a rewritten field line is written as `<label>: <value>` and keeps the line ending of the line
  //     it replaces (CRLF stays CRLF, LF stays LF); every other line is left byte for byte.
  ```
  They match my gate 1 replacement character for character. A Grep for trailing whitespace in the file found nothing. A Grep for CR in the file found 0 occurrences.
- **"written as `<label>: <value>`".** The matcher at `:172` is `^${escapeRegExp(key)}:\\s`. The rewrite at `:187` writes `${key}: ${updates[key]}`, so the old separator is not kept. True.
- **"keeps the line ending of the line it replaces".** `:187` appends `'\r'` exactly when `lines[at].endsWith('\r')`. The LF comes back from the split at `:162` and the join at `:189`. True.
- **"(CRLF stays CRLF, LF stays LF)".** T1 (a) and (b) prove it (`scripts/hooks/flush.test.mjs:307-315`). True.
- **"every other line is left byte for byte".** Only `lines[lineForKey[key]]` is assigned (`:185-188`), and the split and join on `'\n'` are inverses. True.
- **Two cases I weighed, neither a finding:**
  - A bare CR inside an LF-delimited line is one line to this code. That falls under §1's CR-only may-not-claim, and §2.2 keeps the bullet silent on it.
  - The CLI decodes the file as UTF-8 before the call. That happens outside the bullet's subject, `updateBlockFields(text, updates)`. Both behave as they did at B.
- **§8 item 4 holds.** The bullet states may-claim 1, and may-claim 3 narrowed as Amendment 3 item 2 reads it.

**2. E1: T2's five added lines**, each where fix (i) placed it:
- `:10` — `import { parseSessionContinuity } from './precompact-flush.mjs';` comes directly after the session-resume import (B's line 9).
- `:321` — `const parsed = {};` comes directly after `const printed = {};` (`:320`).
- `:331` — `parsed[name] = parseSessionContinuity(written);` comes directly after `const written = fs.readFileSync(target, 'utf8');` (`:330`).
- `:341` — `assert.deepEqual(parsed.crlf, parsed.lf);`, and `:342` — `assert.equal(parsed.lf.tip, 'feed1234');`. Both come after the last existing assertion (`:340`).

**The seam is now proven.**
- The reader's actual interface is `scripts/hooks/precompact-flush.mjs:61-79`. It returns `{ flushedAt, tip, block }`, with `block` joined on LF and trimmed.
- `checkFreshness` calls that same export on the working-tree ledger (`precompact-flush.mjs:99`).
- T2 runs it on each file the CLI wrote, from the real ledger's shape. The deep equality covers all three members. `tip === 'feed1234'` shows that the reader found the block and read the written value; through the equality, it shows the same for the CRLF write.
- `extractSessionContinuityBlock` is still covered by `:340`.
- So §1's Seams bullet now holds for both readers, as Amendment 3 item 3 reads it.

**It stays a seam proof.**
- Nothing in the test text claims a mutation kill.
- MC8 (`:185`) still names T2 as failing under M1, and that is true through the no-bare-LF assertion (`:332`).
- The new assertions would not fail under M1, because the reader splits on `\r\n|\r|\n`. That matches Amendment 3 item 3.

**3. Nothing else moved.** I have no shell and could not read the gate 1 head's objects, so I compared by reading:
- **The head against B** (the main checkout; its two files are unchanged since B, per gate 1's reviewer).
  - `flush.mjs` at the head equals B plus the two bullet lines (`:23-24`), plus `const at` and the ternary (`:186-187`) in place of B's `:184`. That is still +4/−1, the same count as gate 1.
  - `flush.test.mjs` at the head equals B's lines 1-297 plus the import (`:10`), MC8 to MC10 (`:185-187`) and the T1/T2 region (`:303-343`).
- **The T1/T2 region against gate 1.**
  - It matches my gate 1 description of 306-338: the same lines shifted by +1 for the import, plus the four lines named above.
  - Gate 1's anchors all land where the five additions put them:
    - `:329` is now `:332`;
    - `:331` is now `:334`;
    - `:337` is now `:340`.
  - The flush.mjs anchors are unshifted: `:162`, `:172`, `:187`, `:189` and `:274-282`.
- **The counts** come to 5 and 46, 51 in all. That agrees with Amendment 3 item 3 and is within §7 (8, 60, 68).

## Not run (no shell)
- the suites;
- the verify scripts;
- `git diff` / numstat between 197d81ea and 9beca99e;
- byte comparison by tool;
- recomputing any hash;
- branch CI;
- the PR body's list of the C1 words.

The reviewer covers the run.
