*Custodian's filing note (2026-10-14): the worker's report for `shell-status-bar-one-height`, built in C:/dev/wt/sb1h from main f8bc2951 to the form as amended (Amendments 1 and 2); the head e1f92a974aa9ce77150be0b057160cec755bb910, pushed and checked by the custodian (porcelain empty; local equals origin). The run 2026-10-14T10:06:12Z to 2026-10-14T10:18:45Z by its transcript (Bash 34, Read 1, Write 1); its one SubagentHandback call, at 10:18:44Z. Extracted by script; 0 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is 853c2c421e2aa0be828096e0f4c6d37131375a53db6bdec1706034a819f36fad; this file's, from line 5 to the end, is 853c2c421e2aa0be828096e0f4c6d37131375a53db6bdec1706034a819f36fad. The e2e (every suite and E-STATUS-HEIGHT's mutation) is the custodian's, recorded separately.*

---

Built, pushed, clean porcelain; the only change you need to act on is the e2e observation (last section). Head e1f92a97 on cut/shell-status-bar-one-height, base f8bc2951 (fetched, head confirmed, porcelain was empty at start). Commits:
- 5bea403c feat: the change, SB1, SB2, E-STATUS-HEIGHT and Part Z.
- e1f92a97 test: SB1 and SB2 mutation records.
Model: Sonnet 5.5, no override, no handoff.

**Built, matching the form (Amendment 1 restated for OPEN-1 (d)); no class 2 deviations**
- §2.1 styles.css: the last grid row track and `.status-bar` height are `var(--status-h)`. The `min-height` and `max-height` are gone, and the `box-sizing` comment is updated.
- §2.2 layoutConstants.ts: `STATUS_BAR_HEIGHT_PX = 48` replaces `STATUS_BAR_MAX_HEIGHT_PX`, with its doc.
- §2.3 layoutState.ts: uses the renamed constant (the fit's chrome is still 216) and the two doc comments are updated.
- §2.4 StudioLayout.tsx: `--status-h` is set from the constant and `--status-max-h` is removed. The component doc names the form. There is no new state, observer, button, `recordNamed` call or focus stop.
- Part Z: rows Z0 to Z4 appended at the tail of MANUAL-WALKTHROUGH.md, with a blank result log.
- Not touched: e2e/README.md, KNOWN-LIMITATIONS.md, App.tsx, regionParts.tsx, state/, PLAN.yaml, the form. No existing test edited and no operator string added.
- I4 did not fire: jsdom reads the custom property that StudioLayout sets on `.app`.

**Tests and mutations**
- **SB1:** StudioLayout.test.tsx, a new describe block in its own mount harness. The mutation sets `--status-h` from `TOP_BAR_HEIGHT_PX`. Observed failure: `expected '40px' to be '48px'`.
- **SB2:** same block. The mutation sets `--status-h` to 48 px when `status.selectionEnded` has content and 24 px otherwise. Observed failures: SB2 `expected '48px' to be '24px'`, and SB1 also fails on `'24px'`.
- Each mutation was applied alone, run, read by name and reverted. The records in the test comments carry commit 5bea403c. No `verify-mutation` run was used as an observation.
- **E-STATUS-HEIGHT:** in `e2e/selection.mjs`, run after E-ASK-TWO and before E-DBLCLICK (still last), with its name in the header's step list. It follows S0 to S3, G1 and G2 as written. It records A's canvas height and B's scrollHeight against its clientHeight, without asserting them. The recorded-mutation comment gives the form's description and is marked NOT YET OBSERVED. It was syntax-checked with `node --check` only.

**Commands**
- `npm ci` in frontends/shell: rc 0.
- `npm ci` in renderer/bundle-viewer: rc 0. This is not on your list. `npm run verify` needs it, and I ran it under a shared hold.
- `npm run verify` in frontends/shell: rc 0. It ran under a shared hold. Vitest was 93 files and 1338 tests passed, the residency-trace suite 76 passed, and the citation-integrity suite 30 passed.
- `verify-cites`: rc 0 (38 advisory loose references, not mine). `verify-quotes`: rc 0. `verify-test-claims`: rc 0. `verify.mjs`: rc 0.
- `node --test scripts/plan scripts/hooks scripts/evidence`: rc 0, 457 pass and 0 fail.
- An earlier `npm run verify` attempt and an early redirect typo both failed with rc 1 before anything ran, and I fixed the cause each time.
- The final targeted vitest run of the layout test file passed 8 of 8.

**§7 budget (insertions plus deletions, merge base f8bc2951; ceilings from Amendment 1)**

| File | Lines | Ceiling |
|---|---|---|
| styles.css | 7 | 12 |
| StudioLayout.tsx | 7 | 10 |
| layoutConstants.ts | 4 | 6 |
| layoutState.ts | 10 | 10 |
| StudioLayout.test.tsx | 56 | 70 |
| selection.mjs | 52 | 110 (e2e group, with margin) |

- Total 136 against 218 over 6 files; no overrun.
- MANUAL-WALKTHROUGH.md, outside the count, is 21 against 30.

**Custodian: what to run in e2e**
- Run `npm run e2e:selection`, which carries E-STATUS-HEIGHT, and read the note it records. Predicted: the canvas is 712 px high at 1280 × 800 and the bar is 48 px in A, B and C. A result of INCONCLUSIVE at G1 or G2 means the notice did not wrap or the strip changed. It is class 2, never a pass.
- Run the other e2e suites too, because the map is 24 px shorter wherever the bar held one line (E-FOCUS and E-FLOOR are predicted unchanged).
- Observe the mutation: in styles.css put the status row back to `auto` and give `.status-bar` `min-height: 1.5rem; max-height: 48px` in place of `height: var(--status-h)`. Expected: E-STATUS-HEIGHT fails at S3 on the canvas height while the notice stands (B shorter than A). Record the failing step by name with the commit in the selection.mjs comment, replacing NOT YET OBSERVED, then revert.

**Off-scope notices, not done**
- Running vitest in a fresh worktree needs the generated NOTICE, which `npm run verify` produces. A bare `npx vitest` fails on the `NOTICE.txt?raw` import until then.

**Final porcelain:** empty. The branch is pushed and in sync.
