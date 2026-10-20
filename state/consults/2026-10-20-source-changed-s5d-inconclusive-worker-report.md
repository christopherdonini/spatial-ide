*Custodian's filing note (2026-10-20): the worker's report for `source-changed-post-route-s5d-race` option (a), under `frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md` and its Amendment 1, in C:/dev/wt/s5di from 71f5ebbb; the head 0e281e0793e159e8f24d47e3f8d6e9cf2c981045, pushed. The run 2026-10-20T16:23:57Z to 16:33:20Z by its transcript (Bash 32, Read 1, Write 1); its one SubagentHandback call, at 16:33:19Z. The custodian matched each of its claims to a call and its result in the transcript. Filed after PR #232's click, because main was frozen when it returned. Extracted by script; one final newline added if absent; nothing else changed.*

---

S5d option (a) is built on `cut/source-changed-s5d-inconclusive` in `C:/dev/wt/s5di`. Head is 0e281e0793e159e8f24d47e3f8d6e9cf2c981045, pushed to origin (push rc 0, ordinary, not forced). Porcelain is clean. I ran no e2e suite and did not start the app.

**Commits** (all `-s -F`):
- 217d6e8e: `e2e/s5dVerdict.mjs`, `e2e/s5dVerdict.test.mjs` (T1 to T7), and the `package.json` `test:s5d-verdict` script plus its place in `verify`.
- 287b2bec: comments only, the M1 to M8 record in the test header, naming 217d6e8e.
- 61bf1c08: `e2e/source-changed.mjs`. It has the import, `initRefusalDetails` on the post route before the layout (exit 1 if it throws), runStep's INCONCLUSIVE, the results type and summary width, S5d's body over `s5dVerdict`, and exit `anyFail ? 1 : anyInconclusive ? 3 : 0`. The D-H, D11 and D9 words were copied by script from the form's lines 99-119, 137-141 and 152-159; D9 is indented 4 and its dashed rules are kept.
- 0e281e07: the `e2e/README.md` post-route line (line 243), copied by script from the form.

**Tests.** T1 to T7 pass at the head. `npm run verify` has rc 0, with vitest 100 files and 1391 tests passed, plus the residency, citation-integrity, export-elapsed and s5d-verdict tests (the last shows `pass 7`). The CI governance globs give 483 tests, 483 pass, rc 0. `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs --show-cites` (on the 5 changed files) and `verify-test-claims.mjs` all have rc 0. The cite listing for my files shows the 5 record pins at the right lines. `npm ci` ran in `renderer/bundle-viewer` and `frontends/shell` (both rc 0). The `npm ci`, `verify` and governance runs were each inside a shared hold; the four verify scripts ran outside one.

**Mutations.** Each was applied alone to `s5dVerdict.mjs` at 217d6e8e, the test run, the failure read by name, then reverted with porcelain `""` each time. None used `verify-mutation`.

| Mutation | Fails | Predicted | Also failing |
|---|---|---|---|
| M1 | T2, T3 | T2, T3 | none |
| M2 | T5 | T5 | none |
| M3 | T2, T3, T6, T7 | T2, T3 | T6, T7 |
| M4 | T6 | T6 | none |
| M5 | T7 | T7 | none |
| M6 | T4 | T4 | none |
| M7 | T1, T2, T3, T5, T6 | T1 | T2, T3, T5, T6 |
| M8 | T5 | T5 | none |

The test header records the extra failures for M3 and M7. My batch script's M8 pattern did not match, so I ran M8 with a separate slice-based script; the result above is that run.

**§7 figures** (`git diff --numstat 71f5ebbb...HEAD -- frontends/shell` excluding the form):

| File | Count | Ceiling |
|---|---|---|
| `s5dVerdict.mjs` | 57 | 80 |
| `s5dVerdict.test.mjs` | 67 | 100 |
| `source-changed.mjs` | 96 (52 added, 44 removed) | 100 |
| `package.json` | 3 | 3 |
| `README.md` | 2 | 4 |
| Total | 225 | 287 |

My first pass at `source-changed.mjs` was 103, so I tightened the precondition block to get under 100. There is no overrun.

**Strings and comments added:**
- `s5dVerdict.mjs`: the harness-failure messages (`s5dVerdict: harness failure: …`) and the C1, R, C3 and C2 messages, which are §2.4 D8's texts. The rule-1 and PASS texts keep the driver's current wording.
- `source-changed.mjs`: the precondition error `source-changed: <message>`, and the D-H, D11 and D9 words.
- `README.md`: the one line from §2.4.
- `s5dVerdict.test.mjs`: the test names, the record constants with their pins, and the mutation record.

**Differences from the form, interpretations only:**
- `unreadablePrefix` is `{` plus the text after the doubled `{{` in the Rust format string. It is `{the source could not be re-read: `, and T6 depends on that.
- Rule-1 FAIL (class null) does not get the ` Evidence:` suffix, since the form says its text is kept. The refusal verdicts do.
- Each record constant is pinned per line, at `245cb051d157650f0633e86e2279b69f054e2bba`, rather than as the form's combined line ranges.

**Seam proof.** `s5dVerdict.mjs` reads the real `kernel/src/skp.rs` and `engine/src/descriptor.rs` text, and T5 and T6 use those real files. The seam is not yet proven end to end; that is the custodian's e2e.

**Caller grep.** `S5dInconclusive`, `initRefusalDetails` and `s5dVerdict` are all imported and called in `source-changed.mjs`. `readRefusalDetails` is called by `initRefusalDetails`.

**Pre-gate self-check:**
- Cross-module code uses the interface the other side exposes, read before writing: `skp.rs:1501-1505` and `:1619-1624`, `descriptor.rs:331-337`, and `tileViewportStreamManager.ts:273-281` for the line shape.
- Every completion claim above points to a run or a test; none is a bare claim.
- Messages state the behaviour implemented in this commit.
- The tests reach their intended assertions: T5 and T6 assert on the real-file details, and each mutation fails its named test.

**Not done, noticed:** the e2e runs, including the P count and the `refusalDetails` path through the app, are untested until the custodian's runs.

**Model:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`). There was no model override and no context handoff.
