*Custodian's filing note (2026-10-23): the form for `flush-crlf-field-rewrite`, drafted ahead of its turn by the architect, read only at main cfbf1e80 (the governance lane's third, after #245 and #247, by the human's item 3 of the weekend message). The run 13:03:52Z to 13:08:44Z by its transcript (Grep 22, Read 14; no Write, Edit or Bash). Nothing is committed from it until its turn; its OPEN-1 (the form) and OPEN-2 (the terminator for a mixed file) are put to the human, and OPEN-3 (the budget) is set at the form's commit. The harness flagged one instruction-shaped pattern in its hand-back, a mention of the project's hook settings file; it is a statement of which hook that file runs, not an instruction. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is b84713c65b70f7125f133cd1f37dbee1922afc74c714f23fa414e0a7accd5432.*

---

Drafted: flush-crlf-field-rewrite, at main cfbf1e80

Everything below was read in the main checkout, whose HEAD is cfbf1e80. None of the files cited by line were in the session's porcelain list, so each one is as committed at cfbf1e80. `PLAN.yaml` and `state/CUT-STATE.md` are modified in the working tree, so they are cited by node id or by path only, never by line. I have no shell, so this draft carries no sha256 anywhere. The custodian pins the line cites by script in Amendment 1.

---

# flush.mjs keeps each rewritten field line's own line ending (PLAN node `flush-crlf-field-rewrite`) — preregistration

**Authority:** PLAN node `flush-crlf-field-rewrite`, placed third in the governance lane by `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md`, item 3. It was routed by `state/consults/2026-10-02-stop-hook-stale-continuity-architect-draft.md:331 @ cfbf1e80` (open point 8).
**Drafted by** the architect agent on the custodian's brief, read at main cfbf1e80. It is committed before any code, as the node's gate file, and is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Form: full** (AUTONOMY.md §21a, a property currently under test; §25(e)). The size is under §21c's threshold and does not decide the form.
- The writer's documented contract is at `scripts/hooks/flush.mjs:14-24 @ cfbf1e80`. Its property "a known field is replaced exactly once, nothing else touched" is asserted by `flush: a known field is replaced exactly once, nothing else touched` (`scripts/hooks/flush.test.mjs:82-94 @ cfbf1e80`).
- §2 changes the line that carries out that replacement (`scripts/hooks/flush.mjs:183-185 @ cfbf1e80`). It also widens the documented contract by one clause, which states a property. §21a's fourth category reads "any property currently under test" (`AUTONOMY.md:327 @ cfbf1e80`), so an Out-of-scope line could not assert "none of the four", and §25(e) applies (`AUTONOMY.md:482 @ cfbf1e80`; template `docs/PREREGISTRATION-TEMPLATE.md:176 @ cfbf1e80`).
- The precedent is the same reading in `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8 @ cfbf1e80`. The node's summary proposes the short form. This form supersedes that proposal, and the node's summary and gate line move with the commit that adds this form.
- No other category applies. There is no ADR, no wire or MCP surface, no security posture and no new exposure surface: the file written is the same file, at the same path, by the same CLI.

## §0. Disclosure
- **Reasoned from code at cfbf1e80. Nothing was run.**
- **The defect.**
  - `updateBlockFields` splits the text on LF only: `const lines = text.split('\n');` (`scripts/hooks/flush.mjs:160 @ cfbf1e80`).
  - On a CRLF text each element therefore keeps a trailing CR. The block is still found, because `findBlockRange` compares `l.trim()` to the heading and `trim` removes the CR (`scripts/hooks/flush.mjs:86-98 @ cfbf1e80`). A field line `position: old` + CR still matches `^position:\s`.
  - The matched element is then replaced by `${key}: ${updates[key]}` with no CR, and the text is joined on LF (`scripts/hooks/flush.mjs:183-186 @ cfbf1e80`). The CLI writes that text back unchanged (`scripts/hooks/flush.mjs:271 @ cfbf1e80`, `scripts/hooks/flush.mjs:279 @ cfbf1e80`).
  - Result: in a CRLF ledger, every line the flush writes ends LF and every other line ends CRLF.
- **Why it is rare.** `.gitattributes` checks every text file out LF (`.gitattributes:5 @ cfbf1e80`). The ledger is CRLF only when some other tool rewrote the working-tree file. PORTABILITY R1 (`state/directives/PORTABILITY-2026-09-30.md:33 @ cfbf1e80`) is the reason a writer's output must not depend on that by accident.
- **The cap is unaffected, before and after.** `blockSizes` measures `extractSessionContinuityBlock(text)` (`scripts/hooks/flush.mjs:113-127 @ cfbf1e80`), which splits on `\r\n|\r|\n` and joins on LF (`scripts/hooks/session-resume.mjs:45-57 @ cfbf1e80`). A CR byte is never counted, and `BlockCapError.block` and the refused-block scratch file are LF.
- **The consumers of the written file**, read for the seam:
  - `extractSessionContinuityBlock`, above;
  - `parseSessionContinuity` (`scripts/hooks/precompact-flush.mjs:61-79 @ cfbf1e80`), which splits on `\r\n|\r|\n` and is imported by `session-resume.mjs`, `stop-queue.mjs`, `scripts/plan/measure-reads.mjs` and the guardian's `continuity.mjs`.
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
  - Outside `scripts/hooks/`, `scripts/plan/rotate-cut-state.mjs` writes the ledger (`scripts/plan/rotate-cut-state.mjs:116 @ cfbf1e80`). It builds the ledger from the HEAD blob (`scripts/plan/rotate-cut-state.mjs:103 @ cfbf1e80`), splits on `\r\n|\r|\n` and joins LF, and its doc states the output is "LF, one final newline" (`scripts/plan/rotate-cut-state.mjs:53-68 @ cfbf1e80`). Its output is uniformly LF, not mixed, and it refuses a dirty tree. It does not have this defect.
  - Named, not widened: this piece does not change it.
- **The existing suite does not pin the written line's terminator.**
  - `/^position: NEW POSITION$/m` and the CLI round trip's `/^position: CLI WROTE THIS$/m` both pass when a CR precedes the LF, because a multiline `$` matches before a CR.
  - The byte loop in `scripts/hooks/flush.test.mjs:82-94 @ cfbf1e80` skips the rewritten line.
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
2. **The contract comment** (`scripts/hooks/flush.mjs:14-24 @ cfbf1e80`) gains one bullet. It states may-claims 1 and 3 and nothing else. It makes no claim about CR-only text or normalization.

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
- Platform section (template `docs/PREREGISTRATION-TEMPLATE.md:177 @ cfbf1e80`): not required. The piece adds or changes no OS-dependent feature; the writer is plain Node `fs` with no OS boundary. Its effect is that the output is the same whatever terminator the file has.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

---

**Rule (00)**, read from the forms on main at cfbf1e80. I could not read the branches or the PR bodies.
- This piece's paths: `scripts/hooks/flush.mjs` and `scripts/hooks/flush.test.mjs`. It touches no `protocol/`, no wire fixture and no lockfile.
- **#241** `cut/bundle-redaction-scan`, **#244** `cut/walkthrough-row-f7-cli-refusal`, **#246** `cut/b1-shell-half-pr-a`, piece 1c `cut/b2-piece-1c-save-and-reopen`, and covering-case (stopped before code): no form names `scripts/hooks/flush*`. A search of each form for `scripts/hooks` finds only suite commands and cites into other forms.
- **#245** `cut/questions-mirror-item-count`: `scripts/hooks/questions-mirror.mjs`, its test, and `scripts/hooks/README.md` (its Amendment 3). This is disjoint from this piece, which edits no README. The node already depends on it. Its test T11 copies every top-level `.mjs` of `scripts/hooks/` into its test project, so this change is copied and is inert there.
- **#247** `cut/verify-cites-pin-resolution-and-line-zero`: `scripts/plan/verify-cites.mjs` and its test. Disjoint.
- **port-2** `cut/port-2-macos-l1-and-app-dirs`: §7's sixteen files (`PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ cfbf1e80`). None is under `scripts/hooks/`.
- The custodian confirms these with `git diff --name-only origin/main...<branch>` at the commit that adds this form, and records the result in Amendment 1.

**OPEN items**
- **OPEN-1, the form.**
  - (A) Full form, as drafted.
  - (B) The five-line form, with an Out-of-scope line asserting none of the four. That line is true only if "any property currently under test" means a property whose current test outcome changes. On that reading, LF output is byte-identical and no current assertion moves.
  - Recommend (A). The rewritten line carries out the tested "nothing else touched" property, and the contract comment gains a guarantee clause. #245's form read the same category the same way. Under round 25 item 2 (e), a five-line form whose Out-of-scope line a gate reads as naming category 4 fails by name.
- **OPEN-2, the terminator for a mixed file.**
  - (A) Per line, as drafted.
  - (B) Per file: CRLF on every written line whenever the text holds a CRLF.
  - Recommend (A). It decides each line from that line's own bytes and never contradicts the line it replaces. (B) is M2.
- **OPEN-3, budget.** 60 minutes against the node's 30. The custodian sets it in the commit that adds the form.

**What I could not settle**
- The branch diffs and the PR bodies, as said under rule (00).
- Every sha256, since I have no shell.
- Whether any existing test fails under M3 (P3 predicts none; I reasoned it from the `m`-flag `$` and the skipped-line loop, and ran nothing).
- Whether `rotate-cut-state.test.mjs`'s seeded path (its call to `updateBlockFields` on the real ledger) stays byte-identical. I reasoned it from LF input and did not run it.
