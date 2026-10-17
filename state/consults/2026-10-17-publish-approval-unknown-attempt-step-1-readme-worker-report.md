*Custodian's filing note (2026-10-17): the README worker's report for `publish-approval-unknown-attempt-under-load`'s first step (PR #227, its form's §1.8), in C:/dev/wt/ua1 from 71b71372; the head 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2, pushed. Filed on PR #227's architect gate D4. The run 2026-10-17T20:04:46Z to 2026-10-17T20:08:13Z by its transcript (Read 3, Bash 5, Edit 6, Write 1); its one SubagentHandback call, at 20:08:12Z. Extracted by script; 12 path:line cite(s) de-rooted, each now `line N of <path> (on the branch)`; one final newline added; nothing else changed. The message's sha256 as handed back is adafd0b6b4e07569bc2c2992667510ac554a42326ffc3ddaeaa7205c4e971d52; this file's, from line 5 to the end, is a028f0532c9c087a4981ccc7fa33a56ae3fb79cddaf35f23663c50e34b9c3a6b.*

---

The README lines of §1.8 are written and pushed, but the step now totals 154 changed lines, over §7's 150. I did not trim any other file.

**Commit and publish**
- The head was 71b71372 and the tree was clean when I started.
- One commit, 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2, signed off, naming the form. It changes only `frontends/shell/e2e/README.md` (+3/-3).
- `git push -u origin cut/unknown-attempt-step-1` exited 0. Final `git status --porcelain --untracked-files=all` prints nothing.

**Checks**
- `npm run test:export-elapsed` in `frontends/shell`: exit 0, 5 tests pass, 0 fail.
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: exit 0, PASS.
- `node scripts/plan/verify-test-claims.mjs`: exit 0, PASS.
- I ran these without `--show-cites`, and none of the three printed a cite-content listing. The advisories they printed are in older files, not in the README.

**Size**
- `git diff --numstat origin/main...HEAD`, this form excluded:

| File | Lines |
|---|---|
| `product-ci-shell.yml` | 2+2 |
| `README.md` | 3+3 |
| `exportElapsed.mjs` | 54 |
| `exportElapsed.test.mjs` | 35 |
| `publish.mjs` | 17+13 |
| `selection.mjs` | 13+9 |
| `package.json` | 2+1 |

- That is 154. The form's 148 had the README at 0, so the README added 6 changed lines.

**Clauses and the lines that hold them** (all in `frontends/shell/e2e/`)
- **Publish entry, figure:** `APPROVED'`, `REFUSED'` and `FILTERED'` end their line with `prepare-to-execute` and the whole ms from the prepare's outcome to the execute's send, on a monotonic clock.
  - It is a reading, not a docs/08 measurement.
  - Held by `elapsedTail` (`line 34-36 of exportElapsed.mjs (on the branch)`), the `performance.now()` stamps in `pairEvaluate` (`line 52 of exportElapsed.mjs (on the branch)`), the `runStep` note (`line 598 of publish.mjs (on the branch)`) and the header comment (`line 5 of exportElapsed.mjs (on the branch)`).
- **Publish entry, INCONCLUSIVE:** it reads INCONCLUSIVE with exit 3 when `unknown-attempt` comes back and U exceeds the TTL, and FAIL otherwise.
  - The TTL is read from `publish.rs` at run start; other outcomes are judged by the step's own assertions.
  - Held by `verdict` (`line 26-29 of exportElapsed.mjs (on the branch)`), `pairRead` (`line 38-43 of exportElapsed.mjs (on the branch)`), `initTtl` (`line 609 of publish.mjs (on the branch)`) and the exit code at `line 651 of publish.mjs (on the branch)`.
- **Selection entry, figure:** `E-EXPORT`, `E-SCOPE`, `E-ASK`, `E-ASK-STATEMENT` and `E-ASK-TWO` end their line with one figure per pair.
  - Held by `line 824-831 of selection.mjs (on the branch)` and `elapsedTail`.
- **Selection entry, exit code:** INCONCLUSIVE gives exit 3 unless a step failed.
  - Held by `line 833 of selection.mjs (on the branch)`: a FAIL sets 1, and an INCONCLUSIVE sets `exitCode || 3`.
- **Selection entry, narrowed sentence:** when the export ended before the ask was read, `startExportThenOpen` checks the outcome first. An `unknown-attempt` reads by the figure, and any other outcome gives a FAIL line carrying the word inconclusive.
  - Held by `line 628 of selection.mjs (on the branch)`, where `pairRead` runs before the class-2 throw.
  - The README says that an `unknown-attempt` read only after the ask was seen standing is not checked. That is §1.6's named gap; I did not find a check on that path.
  - The `E-ASK-TWO` clause for an ask or open not standing is kept (`line 729 of selection.mjs (on the branch)`).
- **Selection entry, millisecond figures:** the old figures still bound waiting, and the `prepare-to-execute` figure is a reading and not a bound on waiting. This follows §1.1 and §1.8.

**Differences from the form**
- The 154 total is the only one.
- The README names `E-EXPORT`, `E-SCOPE` and the ask steps as the steps that carry the figure, which matches §0 F6.

**Off-scope, not done:** none noticed.

**Self-check**
- Cross-module code: none; docs only.
- Completion claims: each clause above points to a line I read.
- User-facing messages: the README describes behaviour present at the head.
- Required tests: not applicable beyond the five passing.
- Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No model override and no context handoff.
