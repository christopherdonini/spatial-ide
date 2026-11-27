Reviewed: PR 359, the branch cut/console-stream-lane at 8b8c38815a5fbc1e41e392366784a7c1c51a5783, in C:/dev/wt/console67 (the custodian's filing note, 2026-11-23: the reviewer's narrow read of the Console piece's one test-code commit under its form's Amendment 3, with the recount, as ADV-2026-11-23-02 item 3 names it, node:console-stream-lane-limitation-67@a3-reviewer-narrow, dispatched at 2026-11-23T06:25:23.328Z; its run: Bash 19, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T06:25:25Z to 2026-11-23T06:30:47Z by its transcript. Filed below the rule from its hand-back, 7215 bytes, sha256 bfafbc5ced400d3e67e26d83938de230a62df91b2c58ab56455470f93a96dcc9, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS
Reviewed: C:/dev/wt/console67 @ 8b8c38815a5fbc1e41e392366784a7c1c51a5783

The form text was read with `git show origin/main:governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` (origin/main = 54710d4cd39880a0ea075658263dcdc6f048bdc4). I read §7, Amendment 2's "D5, the estimate", and Amendment 3's T1 New text and its "What is committed, and what is not".

**1. T1, the fill: holds.**
- The fill matches T1's New text. It is `command-bar.mjs:466` at 8b8c3881: `await page.evaluate(() => { for (let i = 0; i < 128; i++) document.querySelector(".console-disclosure").click(); });`. That is one `page.evaluate`, 128 DOM `.click()` calls, and no `page.click`. The only other new line is the comment at `:465`.
- It sits after card A's wait: `waitCommitted` is at `:463` and its check at `:464`. It sits before R0, which is at `:467`.
- R0's line is unchanged. The `text0`/`label0`/`parseLabel` line at `:467` is byte-identical to `:465` at 12251bc8, and the diff shows it as context.
- Between the wait's check (`:464`) and R0 (`:467`) there is only the comment and the fill. The fill reads only `.console-disclosure` and clicks only it.
- The drawer ends open, as T1 says:
  - Every poll of `waitCommitted` (`:375`) goes through `readRecordStepRows`, which opens the drawer if it is closed (`:355-358`).
  - The click handler records one `console.togglePanelExpanded` per click and flips the drawer with a functional updater: `ConsolePanel.tsx:80` `recordNamed("gui-action", "console.togglePanelExpanded");` and `:81` `setExpanded((v) => !v);`.
  - So the 128 updates, batched by React 18 (`package.json:63-64`), apply in order and end at open.
- If the node is missing, `.click()` on null throws, the evaluate rejects, and stepAnd fails by name.
- Note, not a finding: R0's label freshness after the burst depends on `consoleLabel`'s two-frame wait (`:381`) and `coalesceOncePerFrame` (`ConsolePanel.tsx:58-60`). A stale read could not pass silently: either N₀ ≠ 2M, which is the S11 stop T1 names (N₀ is recorded in the step's note), or the existing ΔO check at `readAddedRows` fails by name.

**2. The override cleared: holds.**
- `console.mjs:1005` at 8b8c3881 replaces `await page.setViewportSize({ width: 1280, height: 800 }).catch(() => {});` (12251bc8 `:1005`) with `await (async () => { const cdp = await page.context().newCDPSession(page); await cdp.send("Emulation.clearDeviceMetricsOverride"); })().catch(() => {});`.
- This is the same CDP call that `layout.mjs:264` makes (`await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});`, with its session opened at `layout.mjs:233`). It is also the pattern at `export-view.mjs:149`/`:157`.
- Differences from layout.mjs: the session is opened inside the caught wrapper rather than before the try, and there is no `sleep(400)`. The first is a strictly safer catch scope. The second matters only if a later step reads the viewport, and none does (below).
- It cannot hide the run's error. The error is already caught into `failure` and `out.stopped` (`:1001-1003`). The whole new expression, session creation included, is wrapped in `.catch(() => {})`. `if (failure) throw failure;` follows the finally (`:1010`).
- A rejection cannot stop the finally before `writeFileSync` (`:1006-1008`). A hang (a promise that never settles) would stall it. The old `setViewportSize` line had the same property, so this is not a regression and not graded.
- No later step relies on the viewport the old line set:
  - The rest of stepMeasure does mkdir, fixture hashes, the hash compare and the return string (`:1006-1014`).
  - The next step is REGRESS' (`:1248`). `stepRegress` (`:1143-1157`) spawns `e2e/regression.mjs` and `e2e/admission-remediation.mjs`. Neither file contains `setViewportSize`, `innerWidth` or `DeviceMetrics` (grep, no match).
  - main's finally (`:1263-1271`) writes the ledger only.
- MEASURE' itself sets the size per run at `measureRun` (`:950`) and checks it (`:956`), so nothing in it relied on the old restore either.
- Evidence note, not a finding: no run here shows the clear taking effect on the attached WebView2. Proof rests on the same mechanism `layout.mjs:264` already uses. The tester's MEASURE' run is where it would be observed; I ran no e2e row, as the brief orders.

**3. Nothing else: holds.**
- `git show --stat 8b8c3881` shows two files: `frontends/shell/e2e/command-bar.mjs | 2 ++` and `frontends/shell/e2e/console.mjs | 2 +-`.
- `git diff --numstat 12251bc8 8b8c3881` gives 2/0 and 1/1. No product line changed. T2, T3 and the M-CB3 mutation are absent from the commit.

**4. The count: 831, not class 8.**
- Base `B = git merge-base origin/main 8b8c3881` = 1f72b1f76101fa25a359bbaa58272c1223e5ae96. I ran `git diff --numstat B...8b8c3881` over §7's fourteen files.

| File | Lines (added + deleted) |
|---|---|
| README.md | 2+2 |
| command-bar.mjs | 61+48 |
| console.mjs | 208+16 |
| reopen.mjs | 1+1 |
| ConsolePanel.tsx | 8+7 |
| collapsedCountSync.test.ts | 53+13 |
| collapsedCountSync.ts | 10+5 |
| consoleViewModel.test.ts | 54+1 |
| consoleViewModel.ts | 15+0 |
| recorder.test.ts | 139+1 |
| recorder.ts | 107+36 |
| surfaceRegistry.test.ts | 25+1 |
| surfaceRegistry.ts | 15+2 |
| KNOWN-LIMITATIONS.md | not yet changed |

- **Total 831** over 13 files.
- Beside Amendment 2's D5 ("about 790 lines, within 850"): 41 lines over D5's estimate, and within §7's declared ceiling of 850 by 19. Not a class 8 finding.
- KNOWN-LIMITATIONS.md is still to come; at §7's estimate of 8 the projection is 839, still under 850.
- `git diff --name-only B...8b8c3881` names exactly the 13 files above and no other path.

**5. Runs.**
- `node --check frontends/shell/e2e/command-bar.mjs`: exit 0.
- `node --check frontends/shell/e2e/console.mjs`: exit 0.
- `npm run verify` in `frontends/shell`, in a shared hold: exit 0.
  - The hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF ... also=<m>`; the release line was `MACHINE_RELEASED project=<m> ...`.
  - Disclosure: my call added `echo MACHINE_EXIT rc=$rc` before `exit $rc`, so the `MACHINE_EXIT rc=0` line is my echo, not the script's. The rc it prints is the command's.
  - Counts: typecheck, check:dev-origin, check:origin-event and verify:adr-index PASS (34 ADRs); build OK; check:dist-clean and check:dist-notice PASS; vitest 123 test files passed (123), 1582 tests passed (1582); test:residency-trace 76 passed, 0 failed; test:citation-integrity 30 passed, 0 failed; test:export-elapsed 5 tests, 5 pass, 0 fail; test:s5d-verdict 7 tests, 7 pass, 0 fail.
- `git status --porcelain` at the end: empty output.

**Findings by grade.**
- Correctness: none.
- Evidence: none blocking. Item 2's note (the clear's effect is not yet observed in a run) is for the tester's MEASURE' record.
- Documentation (must-fix before merge): none. A note for whoever writes the uncommitted patches: T3's `command-bar.mjs:465`/`:466` cites are pinned at 12251bc8. At 8b8c3881, R0 and card B's `sendCondition` are at `:467`/`:468`, so the patch places its 200 clicks by content, not by the 12251bc8 line numbers. T2's `console.mjs` cites (`:725-754`) are above `:1005` and do not move.

Model: Opus 5.5 (claude-opus-5-5).
