# flush.mjs keeps each rewritten field line's own line ending (PLAN node `flush-crlf-field-rewrite`) — preregistration

**Authority:** PLAN node `flush-crlf-field-rewrite`, placed third in the governance lane by `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md`, item 3. It was routed by `state/consults/2026-10-02-stop-hook-stale-continuity-architect-draft.md:331` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:f6269fd1dc13d22e67f21fc8f45b7c4a07669a226996a4dfac080b02289fbb5d (open point 8).
**Drafted by** the architect agent on the custodian's brief, read at main cfbf1e80. It is committed before any code, as the node's gate file, and is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Form: full** (AUTONOMY.md §21a, a property currently under test; §25(e)). The size is under §21c's threshold and does not decide the form.
- The writer's documented contract is at `scripts/hooks/flush.mjs:14-24` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:fff2590b02da3fcb93ac918b24bb27c8d166b907c241d46af857991699bb39bd. Its property "a known field is replaced exactly once, nothing else touched" is asserted by `flush: a known field is replaced exactly once, nothing else touched` (`scripts/hooks/flush.test.mjs:82-94` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:1b1e9982b248c2f4c38cf728ea4bcb93084e51692198f1b8cfc9581e4cdb344a).
- §2 changes the line that carries out that replacement (`scripts/hooks/flush.mjs:183-185` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:2c503dc095985822966a7a09d3db4194a5f0a6a3a77faa01cdee0c28c544a672). It also widens the documented contract by one clause, which states a property. §21a's fourth category reads "any property currently under test" (`AUTONOMY.md:327` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95), so an Out-of-scope line could not assert "none of the four", and §25(e) applies (`AUTONOMY.md:482` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669; template `docs/PREREGISTRATION-TEMPLATE.md:176` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917).
- The precedent is the same reading in `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:e7a079c8e1ffd12cabd7d56ba82f7db336851f9cb31dd86251ed0157125f5a0d. The node's summary proposes the short form. This form supersedes that proposal, and the node's summary and gate line move with the commit that adds this form.
- No other category applies. There is no ADR, no wire or MCP surface, no security posture and no new exposure surface: the file written is the same file, at the same path, by the same CLI.

## §0. Disclosure
- **Reasoned from code at cfbf1e80. Nothing was run.**
- **The defect.**
  - `updateBlockFields` splits the text on LF only: `const lines = text.split('\n');` (`scripts/hooks/flush.mjs:160` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:8500f19d19ac972c6d5c29e4529b20922839c10c74cf7b6048ef457f791eaa7a).
  - On a CRLF text each element therefore keeps a trailing CR. The block is still found, because `findBlockRange` compares `l.trim()` to the heading and `trim` removes the CR (`scripts/hooks/flush.mjs:86-98` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:32dd1fbe956030249a514515203ba616680486300b340927a3d6dbac1cf8f214). A field line `position: old` + CR still matches `^position:\s`.
  - The matched element is then replaced by `${key}: ${updates[key]}` with no CR, and the text is joined on LF (`scripts/hooks/flush.mjs:183-186` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:3b2538fe4ab73dc9d74a5b9030d84f7e052867783a2ba08febffb9437f4c4763). The CLI writes that text back unchanged (`scripts/hooks/flush.mjs:271` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:06b3f22dd94fc9df8d3fa660b45a7e4b35de117f29916f8a9c7a8cd715cbb9ee, `scripts/hooks/flush.mjs:279` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:260ff48c5f3e811cba6b9936b4a3c22386d1bd52ca868d7d811392bc7a42537b).
  - Result: in a CRLF ledger, every line the flush writes ends LF and every other line ends CRLF.
- **Why it is rare.** `.gitattributes` checks every text file out LF (`.gitattributes:5` at cfbf1e80194afa1db8182b868e28d0c52df77b82, sha256 d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c). The ledger is CRLF only when some other tool rewrote the working-tree file. PORTABILITY R1 (`state/directives/PORTABILITY-2026-09-30.md:33` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:30a3545525a654f3c8f53e844a5d87a0b6d3038374104d4c1fcf0252633b1a22) is the reason a writer's output must not depend on that by accident.
- **The cap is unaffected, before and after.** `blockSizes` measures `extractSessionContinuityBlock(text)` (`scripts/hooks/flush.mjs:113-127` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:1ae93e68214813bbf003b7bb2fe695419a66c90644efe8ff09f8cbb464e7ef92), which splits on `\r\n|\r|\n` and joins on LF (`scripts/hooks/session-resume.mjs:45-57` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:caf853e267567e86835e1384a2194996f20400b657ea58e091d0d410d228069f). A CR byte is never counted, and `BlockCapError.block` and the refused-block scratch file are LF.
- **The consumers of the written file**, read for the seam:
  - `extractSessionContinuityBlock`, above;
  - `parseSessionContinuity` (`scripts/hooks/precompact-flush.mjs:61-79` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:e125ab7b5b05587721486dc2ab197dadcf63d7e9488bbbf80db95005b58910c4), which splits on `\r\n|\r|\n` and is imported by `session-resume.mjs`, `stop-queue.mjs`, `scripts/plan/measure-reads.mjs` and the guardian's `continuity.mjs`.
  - All of them already read a CRLF or mixed ledger correctly. The defect is in the bytes on disk, not in any reader's result.
  - `stop-queue.mjs` reads git blobs, which `.gitattributes` makes LF. It only names the flush CLI in its message and does not call it.
- **Callers of `updateBlockFields` and of the CLI:**
  - the CLI's own `main` (the product caller: the custodian's flushes, as named by stop-queue's message and by `rotate-cut-state.mjs`'s "Next:" line);
  - `scripts/hooks/flush.test.mjs`;
  - `scripts/plan/rotate-cut-state.test.mjs`, which calls `updateBlockFields` on the real ledger and spawns the CLI.
  - Every one of these passes LF text.
  - `.claude/settings.json` runs `precompact-flush.mjs` and never runs `flush.mjs`.
- **Other writers of `state/CUT-STATE.md`.**
  - In `scripts/hooks/`, `flush.mjs:279` is the only one. `precompact-flush.mjs` writes `.claude/state/` JSON and JSONL, `stop-queue.mjs` writes its caches, and `questions-mirror.mjs` writes round files and a JSONL. None of them writes the ledger.
  - Outside `scripts/hooks/`, `scripts/plan/rotate-cut-state.mjs` writes the ledger (`scripts/plan/rotate-cut-state.mjs:116` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:96d59fe6e1a8e9dd6f0f608e99cdbaca0d0aa8c54ac5eed34f1bc9cc91b6446a). It builds the ledger from the HEAD blob (`scripts/plan/rotate-cut-state.mjs:103` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:e4d82ec8da8a59c37ceb4c067824d526962b6c707679c06c43c39ddc3dda275c), splits on `\r\n|\r|\n` and joins LF, and its doc states the output is "LF, one final newline" (`scripts/plan/rotate-cut-state.mjs:53-68` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:ea7835342cdeecca622dd46205866a0a43f64aa9e7e78e4b788864126955c949). Its output is uniformly LF, not mixed, and it refuses a dirty tree. It does not have this defect.
  - Named, not widened: this piece does not change it.
- **The existing suite does not pin the written line's terminator.**
  - `/^position: NEW POSITION$/m` and the CLI round trip's `/^position: CLI WROTE THIS$/m` both pass when a CR precedes the LF, because a multiline `$` matches before a CR.
  - The byte loop in `scripts/hooks/flush.test.mjs:82-94` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:1b1e9982b248c2f4c38cf728ea4bcb93084e51692198f1b8cfc9581e4cdb344a skips the rewritten line.
  - That is why §4 asserts exact bytes.
- **Reuse index** (the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c), byte for byte from the brief:
```text
$ node tools/reuse.mjs line ending preservation
No prior art recorded for "line ending preservation". Research it before planning an implementation.
$ node tools/reuse.mjs crlf rewrite
No prior art recorded for "crlf rewrite". Research it before planning an implementation.
```
  Both are misses, so no prior art is used.
- **Fixture drive:** nothing is measured. No docs/08 figure is claimed.

## §1. May and may not claim
- **May claim:**
  1. Each field line `updateBlockFields` rewrites keeps the terminator of the line it replaces: a line that ended CRLF is written CRLF, and a line that ended LF is written LF (T1 (a), (b)).
  2. On an LF text the output is byte-identical to cfbf1e80's output for the same updates (T1 (c), and every existing test unchanged).
  3. No byte outside the rewritten values changes (T1's exact equalities).
  4. The CLI, run on a CRLF copy of the real ledger, leaves no LF without a CR before it, and session-resume prints the same block as it does for the LF write (T2).
- **May not claim:**
  - anything about a CR-only ledger. Today it is not split into lines and is refused as having no block. That is unchanged and untested here.
  - any normalization of lines the update does not target. A mixed ledger stays mixed.
  - anything about what git stores. Normalization on commit is `.gitattributes`' business.
  - any change to `rotate-cut-state.mjs`, to the readers, or to the cap's measure.
- **Unchanged:**
  - the eight `SESSION_CONTINUITY_FIELDS` and their order;
  - every refusal and its message (zero fields, unknown label, not exactly once, non-string, newline in value, no block);
  - the cap of 6144 bytes, its measure, the `BlockCapError` message and `.block`, and the refused-block scratch file and its rules;
  - the CLI's arguments, its `flushed_at` and `tip` defaults, its stdout line, and exit codes 0 and 1;
  - `findBlockRange`, `blockFieldLabels`, `blockSizes`, `parseArgs` and `cutStatePath`;
  - every existing test and its recorded mutations MC1 to MC7;
  - `session-resume.mjs`, `precompact-flush.mjs`, `stop-queue.mjs`, `rotate-cut-state.mjs` and the README.
  - ADR-006 does not apply (repository tooling). No ADR is cited or amended. No operator-visible string changes.
- **Seams:**
  - **The CLI into `updateBlockFields`:** the existing call, unchanged.
  - **The written file into its readers:** `extractSessionContinuityBlock` and `parseSessionContinuity`, read as they are (§0). T2 proves this seam end to end from the real ledger's shape through session-resume's `buildOutput`.
  - **No new export, option or code path** beyond the one terminator expression.

## §2. The change
1. **The rewrite in `updateBlockFields`.**
   - **Before:** the matched element becomes `${key}: ${value}`.
   - **After:** the matched element becomes `${key}: ${value}` followed by a CR exactly when the element it replaces ends with a CR. The terminator is decided per line, from that line alone.
   - The split, the join, the checks and their order are unchanged.
2. **The contract comment** (`scripts/hooks/flush.mjs:14-24` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:fff2590b02da3fcb93ac918b24bb27c8d166b907c241d46af857991699bb39bd) gains one bullet. It states may-claims 1 and 3 and nothing else. It makes no claim about CR-only text or normalization.

## §3. Fixtures / corpus — predictions
- **P1:** at the head, every test in `scripts/hooks/flush.test.mjs` and `scripts/plan/rotate-cut-state.test.mjs` passes with no edit. Both pass only LF text.
- **P2:** at cfbf1e80's code, T1 fails at (a) and (b) and passes (c), and T2 fails at its no-bare-LF assertion. This is observed by running the new tests against the base line. That run is M1.
- **P3:** no test outside T1 fails under M3 (§4). If one does, it is recorded by name as a class 2 result.

## §4. Tests and mutations
Each mutation is observed by applying it, running the named test, recording the failure by name with its commit, and reverting it. The record goes in a `RECORDED MUTATION` comment beside the existing MC1 to MC7. A `verify-mutation` run is not an observation.
- **T1, new: `flush: a CRLF ledger keeps CRLF on every field line it writes, and an LF ledger is byte-identical`.** It uses `u = { flushed_at, tip, position }`.
  - (a) `fixtureBlock()` with every LF made CRLF, updated by `u`, equals `fixtureBlock(u)` with every LF made CRLF. This is exact string equality.
  - (b) a fixture in which only the `tip` line ends CRLF, updated by `{ tip, position }`, equals `fixtureBlock` of those values with only the `tip` line ending CRLF.
  - (c) `fixtureBlock()` updated by `u` equals `fixtureBlock(u)`.
  - M1: the CR dropped, as cfbf1e80's line does. Fails (a).
  - M2: the terminator taken from the file (a CR whenever the text holds CRLF). Fails (b).
  - M3: a CR appended to every written line. Fails (b) and (c).
- **T2, new: `flush CLI: a CRLF copy of the real ledger keeps CRLF on every line, and session-resume prints the same block as for the LF write`.**
  - Two temporary projects, each with `state/CUT-STATE.md`: one holds the real ledger with every line end made CRLF, and the other holds the real ledger LF.
  - The CLI runs on each with `--field` `flushed_at`, `tip` and `position` given explicitly.
  - The CRLF file holds no LF without a CR before it.
  - `buildOutput` gives the same text up to `\n\nResume facts:` for both projects (the slice the existing C5 test uses).
  - M1 fails T2.

## §5. Predictions · unchanged · invalidators · falsification
- **Predictions:** §3, and every test in §4 green at the head.
- **Unchanged:** §1.
- **Invalidators:**
  - I1: any existing test needs an edit to pass, meaning the LF output moved.
  - I2: T2's two printed blocks differ, meaning a reader does not read the CRLF write as the LF one. That is routed, not absorbed.
  - I3: any file beyond §7 is needed. That is routed, not absorbed.
  - I4: a §21a category other than the fourth is found.
- **Falsification:** a field line written by the head whose terminator differs from the one of the line it replaced.

## §6. Instruments
- None beyond the suite. P2 is one run of T1 and T2 against the base line (M1), named by its commit (round 15 (c)).

## §7. Declared values and ceilings
- The terminator rule is §2.1, per line.
- **Files:**
  - `scripts/hooks/flush.mjs`, at most 8 lines;
  - `scripts/hooks/flush.test.mjs`, at most 60 lines;
  - total at most 68 lines, by `git diff --numstat B...HEAD` over those two paths.
  - The form and PLAN's gate line are exempt (§21c). An overrun is class 8, and this section is never edited.
- **Budget:** 60 minutes (the node carries 30).

## §8. Block-on-sight
1. Any existing test's assertion edited.
2. A new export, option or CLI flag.
3. A byte changed on a line the update does not target, including normalization of a mixed file.
4. The contract comment claiming more than §1's may-claims 1 and 3.
5. A mutation recorded as observed by a `verify-mutation` run.
6. A diff outside §7.

## §9. Gates
- Architect and reviewer.
- Suites: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, verify-cites, verify-quotes, verify-test-claims, verify:plan. Branch CI is read before gating.
- No operator row.
- Platform section (template `docs/PREREGISTRATION-TEMPLATE.md:177` @ cfbf1e80194afa1db8182b868e28d0c52df77b82 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0): not required. The piece adds or changes no OS-dependent feature; the writer is plain Node `fs` with no OS boundary. Its effect is that the output is the same whatever terminator the file has.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

## §10 Amendment 1 — at the commit: the pins, the human's OPEN-1 and OPEN-2, the budget (OPEN-3), rule (00) by the branch diffs (class 1); written by the custodian

*Written by the custodian at the commit that adds this form. References only: the architect's drafting consult `state/consults/2026-10-23-flush-crlf-field-rewrite-architect-draft.md` (its rule (00) and OPEN items); the human's ruling `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its paragraph headed Forms ahead.*

1. **The pins.** The draft's 24 line cites, read at main cfbf1e80, are pinned above by script at cfbf1e80194afa1db8182b868e28d0c52df77b82, each over its lines joined with a final newline; 1 of them, into a path starting with a dot, is written as at a commit with its sha256 in words, the form verify-quotes' grammar admits. The 11 cited files are the same at the commit that adds this form.
2. **The human's rulings:** OPEN-1 (A), the full form; OPEN-2 (A), the terminator decided per line. §2 stands as drafted, and M2 stays a mutation.
3. **The budget (OPEN-3)** is 60 minutes, as §7 gives it; the node carries it from this commit, and its gate line names this form.
4. **Rule (00), by the branch diffs at this commit** (`git diff --name-only origin/main...<branch>`): none of `cut/bundle-redaction-scan` at 2fc01f59, `cut/walkthrough-row-f7-cli-refusal` at abc900f2, `cut/b2-piece-1c-save-and-reopen` at 7109aeb2, `cut/covering-case-collision-binds-other-column` at b0637a7f, `cut/port-2-macos-l1-and-app-dirs` at fb162627 names this piece's two files or this form, and none is under `protocol/`. Port-2's prepared change, uncommitted in its worktree at this commit, names 15 paths, none under `scripts/hooks/`. #245 and #247 are merged.
5. **Next:** the code, T1 and T2, the mutations M1 to M3 and P2's base-line run, by one worker on `cut/flush-crlf-field-rewrite` from this commit; then the PR and both gates.

Nothing above is edited.

## §10 Amendment 2 — the build: P3 falsified, M3 fails one rotate-cut-state test besides T1 (class 2); written after the results were seen

*Written by the custodian after the build's results were seen, before the gates. References only: the worker's report `state/consults/2026-10-23-flush-crlf-field-rewrite-worker-report.md`; the head 197d81ea607027f26511d9df39f44aea8d726fb5; the mutations observed at 8bfc3e69.*

1. **P3 is falsified.** M3 (a CR appended to every written line) fails T1 at (b) and (c), as §4 predicts, and also `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`, at its eight-fields assertion: the seeded flush writes LF lines, and that test reads them. The test pins the LF terminator for the flush the rotation path runs. It is recorded in the test file's MC10.
2. **As predicted:** P1 (every existing test of both files green at the head, unedited); P2 (M1 fails T1 at (a) and (b), passes (c), and fails T2 at its no-bare-LF assertion); M2 fails T1 at (b) only; §7 at 5 and 41, 46 in all, against 8, 60 and 68.
3. **Class 2:** §3 to §5 are not edited, no test is changed by this result, and no invalidator is met. The gates read the observation.
4. **Next:** the PR (draft) and both gates (§9).

Nothing above is edited.

## §10 Amendment 3 — gate 1: both FAIL; correction round 1, E1's seam assertion and C1's words (class 1); written after the reports were seen

*Written by the custodian after both reports were seen. References only: `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate1-architect.md` (gate-log 601); `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate1-reviewer.md` (gate-log 602).*

1. **Both FAIL at 197d81ea607027f26511d9df39f44aea8d726fb5.** The architect: E1 (Evidence), §1's Seams bullet claims T2 proves the written file into both readers, and T2 asserts `extractSessionContinuityBlock`'s output only; and C1, the contract bullet's last clause. The reviewer: C1 alone, the same clause, observed by its probe (a tab after a field's colon is written back as one space). The code change and the mutations hold in both reports.
2. **C1, words only:** the architect's replacement for the contract bullet, which states the reviewer's clause too (every other line left byte for byte) and the separator written back; applied with no re-gate, and the PR body lists it. §1's may-claim 3 is read as narrowed to lines, in the words of the architect's C1, its last bullet; §1 is not edited.
3. **E1, the architect's fix (i):** T2 also reads both written files through `parseSessionContinuity` and asserts the two results equal and the tip read back, a seam proof added on this gate's finding, not a mutation kill (M1 does not fail it, since the reader normalizes). §7 is predicted at 5 and 46, 51 in all.
4. **Noted:** the reviewer's scripts suite failed in a shared run on the guardian parity test reading `not judged`, and that file passed alone; a timing-sensitive shared-run failure, not recorded as a failure.
5. **Next:** correction round 1, one commit by a worker on the branch; then the scoped re-gate, the architect on E1 and C1's lines, the reviewer on the new lines and their run.

Nothing above is edited.

## §10 Amendment 4 — correction round 1 applied (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-10-23-flush-crlf-field-rewrite-correction-1-worker-report.md`; the head 9beca99e3c99862d86684fee2c6bd18cce89e92c.*

1. **Applied at 9beca99e3c99862d86684fee2c6bd18cce89e92c,** one commit on 197d81ea: C1, the contract bullet in the architect's words (+2 −2), and E1 fix (i), T2's five lines (+5); both taken from the architect's gate 1 report by script. T2 and the file pass, 20 of 20; the rotate-cut-state suite 9 of 9; the scripts suite 553 of 553. §7 at 5 and 46, 51 of 68.
2. **Next:** the scoped re-gate (Amendment 3 item 5), both gates, running at this head.

Nothing above is edited.

## §10 Amendment 5 — gate 2, the scoped re-gate: the architect PASS, the reviewer PASS WITH NOTES; the closing record (class 1); written after both reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate2-architect.md` (gate-log 604); `state/consults/gates/2026-10-23-flush-crlf-field-rewrite-gate2-reviewer.md` (gate-log 605); the head 9beca99e3c99862d86684fee2c6bd18cce89e92c.*

1. **Both pass at the head.** The reviewer's one note, D1, the PR body written for the gate 1 head, is fixed: the body names this head, the correction commit, 51 lines, Amendments 1 to 4, the C1 words as the architect's and the E1 assertion.
2. **The record is closed** for the human's click, a merge commit. §7 at 5 and 46, 51 of 68; no class 8.

Nothing above is edited.
