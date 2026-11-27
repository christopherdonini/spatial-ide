*Filed by the custodian: the worker's second report of milestone 5 PR A's build, node:shell-migration-milestone-5@pr-a-worker-1, from its stop to the end, at 12a9aa9853b25f88deb79c6cc8af1843537f1d37 on `cut/shell-migration-milestone-5-pr-a` (no PR), dispatched at 2026-11-23T22:24:17Z; its run: Bash 350, Read 27, Write 26, Edit 3, SubagentHandback 2, by unique call ids, 8 calls errored; model claude-sonnet-5-5, from 2026-11-23T22:24:22Z to 2026-11-24T00:56:00Z by its transcript; 4 calls named the main checkout (a Read of its own agent definition there; 3 Bash calls reading committed files of main at 4c278842 by git show, which reads no working tree, which change nothing); its first report was handed back at 2026-11-23T23:23:06Z and is filed as `state/consults/2026-11-23-shell-migration-milestone-5-pr-a-build-worker-report-stop-1.md`; this one at 2026-11-24T00:56:00Z. The report below from its hand-back, 15363 bytes, sha256 42efc2a763de85fa67e9ba878aab20a21d7c08857fc7a0717d7ff488e075dd59, byte for byte, nothing masked, with one final newline added. Its findings F1 to F3 went to the advisor, whose ruling ADV-2026-11-24-02 is filed separately. It is evidence for the build gates and the closing amendment, not a gate.*

---

REPORT: shell-migration-milestone-5 PR A (node:shell-migration-milestone-5@pr-a-worker-1), second run, from the stop to the end. Not a stop: the build is complete to the brief's step 7. Three findings need the custodian or advisor before the gates (F1 to F3 below).

BRANCH AND HEAD
- Worktree D:/wt/m5a, branch cut/shell-migration-milestone-5-pr-a. Head 12a9aa9853b25f88deb79c6cc8af1843537f1d37, equal to origin's (each push in its own call, output below). Base 6bc401267d2ea4532215397b79264869b4c83570. `git status --porcelain` is empty.
- Commits this run, in order. Each message ends with the single trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and was made with `git commit -s -F <file outside the repo>`; I typed no Signed-off-by line and no email.
  - a17db128abecd0764977cf0ba5bfc44e48ae898f feat: the product wiring (App.tsx, canvas/WorkingCanvas.tsx, canvas/limits.ts, layout/StudioLayout.tsx, layout/contributions.ts, styles.css) and the three class-9 test files. Pushed: `021d125a..a17db128`.
  - 73d72493 test: the mutation observations of the 23 planned mutations, the three item 3 (e) mutations and the three item 3 (f) guard mutations, as comments only (0 non-comment added lines, 0 removed). Pushed: `a17db128..73d72493`.
  - b9594a2f docs: KNOWN-LIMITATIONS items 77, 78, 79 (KL-A, KL-D, KL-E), the S-12 and S-13 statements in surfaceRegistry.ts, and the e2e README entry. Pushed: `73d72493..b9594a2f`.
  - 12a9aa98 test: 16 more mutations, comments only (reason in "verify-mutation" below). Pushed: `b9594a2f..12a9aa98`.
- Earlier commits of the first run: e572348b (P0 tests, package.json scripts, the two e2e suites) and 021d125a (conditions.ts, conditionsConstants.ts, ConditionView.tsx, ProblemsTab.tsx).

THE THREE TEST FILES, as the ruling allows (ADV-2026-11-23-37 item 2, item 3 (a) to (d); form Amendment 9, read)
- App.table.test.tsx: the expected tab list gained "Problems". One line.
- App.test.ts: two pins moved and nothing else. `setViewportRefusal\(formatRefusal\(e\.skpError\)\);` became `display: \{ kind: "refusal", refusal: formatRefusal\(e\.skpError\) \},`. `setViewportRefusal\(null\);` became `const target = viewTargetNow();` plus `if (target !== null) dispatchConditions({ type: "ownerClear", route: "viewport-refusal"`. Both pin lines of product code. The `isSessionEndedRefusal` pin at the next line is unchanged and still matches.
  - Disclosure: the ruling's item 2 names one pin ("the pinned one"). The file pinned two lines that PR A replaces (the raise and the clear), and I moved both. Say so if the advisor meant one.
- App.lateResult.test.tsx:
  - The two `onCanvasRefusal` calls now pass "vertex-ceiling" (item 4).
  - The three N8 assertions are replaced. Each opens Problems through the strip's own `.attention-others` button and does not set state (a). Each finds the expected condition by its text among the `.canvas-refusal` elements and asserts it is there exactly once (`toHaveLength(1)`), and inside `#activity-panel-problems` (b). Each asserts the older condition still stands and is the first: `.canvas-refusal` first element contains "ProducerFailed" in test 1, and `.admission-refusal-code` is `engine.no_covering_bbox` in tests 2 and 3 (c).
  - No other assertion was removed or loosened. The lines expecting nothing shown on B after A's late callbacks are byte for byte (d). The diff is 38 lines added and 5 removed; the removals are the two call lines and the three assertions.

SUITES (every command in its own hold; one command per hold except the F5 deviation below)
- `npx tsc --noEmit`: exit 0.
- `npm run build` in frontends/shell (TMP and TEMP on D:/wt-data/m5a, CARGO_TARGET_DIR D:/wt-targets/m5a): exit 0. The real NOTICE.txt was generated.
- `npx vitest run`, run after the real build and before the commit: exit 0. 132 files passed, 1666 tests passed. The seven notice tests passed.
- `npm run verify` in frontends/shell, at b9594a2f: exit 0. This ran typecheck, check:dev-origin, check:origin-event, verify:adr-index, build, check:dist-clean, check:dist-notice, vitest (132 files, 1666 tests), residency-trace (76 passed, 0 failed), citation-integrity (30 passed, 0 failed), export-elapsed and s5d-verdict. 12a9aa98 changed only comment lines after it.
- `cargo fmt --all --check`: exit 0, empty output (no Rust file is in the diff).
- `node scripts/plan/verify.mjs`: PASS.
- `node scripts/plan/verify-cites.mjs`: PASS (3743 files; 237 loose references advised, none mine).
- `node scripts/plan/verify-test-claims.mjs`: PASS (901 claimed tests).
- `node scripts/plan/verify-quotes.mjs` (the form CI runs): PASS (944 ruling cites resolved, 0 errors).
- `node scripts/plan/verify-quotes.mjs --show-cites <the 28 changed files>`: FAIL, exit 1. See F2.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0, 623 tests, 623 pass, 0 fail.
- verify-mutation: its header says it is a heuristic checklist that does not run mutations. Its first run over BASE...HEAD exited 1: 16 of 41 new tests had no mutation naming them. They were sibling tests sharing a C-id with a recorded one. I gave each of the 16 its own mutation (observed, below). The second run exited 0: "all 41 new test(s) have a recorded mutation naming them". This is not an observation; the observations are the driver runs below.

MUTATIONS OBSERVED (applied, run on the named test file, reverted, restored bytes compared with `git show HEAD:<path>` in the driver and `git status` clean after each; the driver and logs are in D:/wt-data/m5a/mut-driver*.mjs and D:/wt-data/m5a/mut/, outside the repo)
Run at a17db128abecd0764977cf0ba5bfc44e48ae898f, each failing its own named test (vitest exit 1):
- C-U1, C-U2, C-U3, C-U4, C-U5, C-U6, C-U6a, C-U7, C-U7a, C-U7b, C-U7c, C-U8 (conditions.test.ts): all FAILED.
- C-R1 (ConditionView.test.tsx), C-R2 (ProblemsTab.test.tsx), C-R3 (StudioLayout.test.tsx), C-K1 (limits.test.ts), C-K2 (WorkingCanvas.wiring.test.tsx): all FAILED.
- C-A1, C-A2, C-A3, C-A4, C-A5, C-A6 (App.conditions.test.tsx): all FAILED.
- That is the 23.
- Item 3 (e), one mutation per replaced N8 assertion, each FAILED with `AssertionError: expected [] to have a length of 1 but got +0`, which is the exactly-once check:
  - E-1: `onCanvasRefusal` adapter returns before the dispatch. Fails the "A's ended -> reopen sequence ... (baseline arm)" test.
  - E-2: baseline `onFailureTerminal` does not raise (`if (target !== null)` became `if (target === null)`). Fails "the human's full ended -> reopen -> old SUCCESS sequence ... (baseline arm)".
  - E-3: baseline `onFailureTerminal` raises under the generation "stale-generation". Fails "the human's full ended -> reopen -> old engine.source_changed REJECTION sequence ... (baseline arm)".
- Item 3 (f), the three guards, observed again at a17db128 and recorded as dated lines `OBSERVED 2026-11-24` beside the 2026-09-23 lines, which stay:
  - G-3, the `onResidentCeilingExceeded` guard removed: FAILED, `AssertionError: expected <div class="residency-status" …(1)></div> to be null`.
  - G-1, the `onFailureTerminal` guard removed: NOT FAILED. vitest exit 0, 1 passed.
  - G-2, the `onCanvasRefusal` guard removed: NOT FAILED. vitest exit 0, 1 passed.
- 16 sibling mutations, run at b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e, each FAILED on the sibling named and are recorded in 12a9aa98:
  - S-1 (C-A2 same kind raised again), S-2 (C-A3 Dismiss recorded), S-3 (C-A3 resolved outcome clears), S-4 (C-A3 successful open clears), S-5 (C-A3 reopen notice).
  - S-6 (C-K2 unarmed push), S-7 to S-10 (four C-R1 siblings), S-11 to S-13 (three C-R2 siblings), S-14 (C-U8 record-notice batch), S-15 and S-16 (two C-R3 siblings).

FINDINGS
- F1 (needs the advisor): two of the three item 3 (f) guards are no longer pinned by that test. At PR A's head, removing the `onFailureTerminal` guard (G-1) or the `onCanvasRefusal` guard (G-2) leaves "A's ended -> reopen sequence ..." passing. The 2026-09-23 lines said FAILED. The likely reason, read in conditions.ts and not tested apart: A's late raise carries A's generation, which the store drops before it takes a place (`raise`, first line). I recorded this as it was observed ("NOT FAILED ... Probable reason ..."). I did not add an assertion, because item 3 (d) and the Scope allow none beyond the replacements. The guards still stand as defence in depth, and the store's drop covers the DOM effect.
  - Two further guards behave the same way. They are the `forDataset !== admittedDatasetRef.current` guards in the resolved and rejected arms of `reportViewportOutcome`, which this file's recorded mutations at about lines 470 and 501 name. Removing either (X-1, X-2, run at a17db128 with the whole App.lateResult.test.tsx) leaves all 22 tests passing. I did not edit those lines or add records for them, since they are outside item 3 (f). They are disclosed so the gates know the 2026-09-23 "FAILED" lines at those tests are stale at this head.
  - Is a guard that nothing pins an item 3 condition "that cannot be met as written"? I read (f) as "observe again and add dated lines", which is met. If the advisor wants the pins restored, that needs a new Scope line.
- F2: `verify-quotes.mjs --show-cites <changed files>`, the brief's form, fails with 1 ruling-cite error: `frontends/shell/src/App.lateResult.test.tsx:659 — round 1, item 7 — question round 1's RULED block has no item 7`. Line 659 is an old, unchanged comment ("N8 residual correction round 1, item 7 probe"). It is read only because the file is now named explicitly. The bare CI form passes (944 cites resolved). I did not touch the line (item 3 (d)).
- F3: §7 count (below) is under the group ceilings and the total, but three files are over their own per-file ceilings. App.conditions.test.tsx is 534 against 480. conditionsConstants.ts is 26 against 20. package.json is 2 against 1, because two scripts, e2e:conditions and e2e:conditions-baseline, were added. Amendment 4's predicted overrun of about 3,730 was not reached.

§7 COUNT
Command: `git diff --numstat 6bc401267d2ea4532215397b79264869b4c83570...HEAD -- frontends/shell ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`. Figures are added plus removed, per file. Added only: P 525, T 1,304, E 402, total 2,231.
- A-P, 632 against 994.
  - App.tsx 202 (105 added, 97 removed), conditions.ts 224, ConditionView.tsx 70, ProblemsTab.tsx 34.
  - conditionsConstants.ts 26, StudioLayout.tsx 16, WorkingCanvas.tsx 10, limits.ts 10 (not a named row of the §7 table), contributions.ts 6.
  - surfaceRegistry.ts 6, styles.css 26, package.json 2.
- A-T, 1,317 against 1,480, with the three class-9 files counted here.
  - App.conditions.test.tsx 534, conditions.test.ts 275, ConditionView.test.tsx 178, ProblemsTab.test.tsx 130.
  - StudioLayout.test.tsx 81, WorkingCanvas.wiring.test.tsx 51, limits.test.ts 19.
  - App.lateResult.test.tsx 43, App.test.ts 4, App.table.test.tsx 2.
- A-E, 402 against 620: conditions.mjs 198, conditions-baseline.mjs 204.
- PR A total 2,351 against 3,094. No ceiling is overrun in total. The three per-file overruns are in F3.
- Records outside the count: KNOWN-LIMITATIONS.md +12 and e2e/README.md +17.

PRE-GATE SELF-CHECK, four classes
1. Cross-module interface real: every call site is written against the real file. `onCanvasRefusal(streamHandle, message, kind)` is in WorkingCanvas.tsx:1544-1547 and App.tsx:2481. `ceilingKindOf` is defined at canvas/limits.ts:134 and has one product caller, WorkingCanvas.tsx:1544. `attentionOthers` is passed at App.tsx:2264. ConditionView has product callers at App.tsx:2540 and conditions/ProblemsTab.tsx:28. ProblemsTab has one at App.tsx:2674. `CEILING_CODE[kind]` is at App.tsx:2481. C-A2 drives the captured real WorkingCanvasProps and C-K2 the real WorkingCanvas catch.
2. Completion claims evidenced: the suite, mutation and verifier results above all have logs in D:/wt-data/m5a/. Not run: the two e2e suites (e2e/conditions.mjs, e2e/conditions-baseline.mjs) are only syntax-checked, and the e2e README says so. I read no existing e2e suite against the strip and ran none; from reading the source only, `.canvas-refusal`, `.save-notice` and `.reopen-notice` still resolve because Problems is hidden, not removed. The one exception is a Playwright `.first().click()` at residency-harness.mjs:719. Nothing was measured and nothing is claimed about performance.
3. User-facing messages describe implemented behaviour: S-1, S-3, S-4, S-5, S-6 and S-10 are copied by script from ADV-2026-11-23-30, and the KL-A, KL-D and KL-E text is copied by script, then bolded at the first sentence only. The KNOWN-LIMITATIONS numbering is the only judgement call, in the KL note below. The "where the code does each clause" comments cite symbols I checked.
4. Required tests reach their assertion: every replaced N8 assertion and every new test failed under its mutation by assertion, not by import or setup failure. E-1 to E-3 fail at the exactly-once `toHaveLength(1)`. No sleep, retry, timeout change or skip was used.

NOTES
- KNOWN-LIMITATIONS numbers: base's last item is 75. I used 77, 78, 79 (KL-A, KL-D, KL-E), leaving 76 free as the brief and my first report planned. KL-B and KL-C are not written, as item 5 says (they land with PR B). I wrote no Part AF walkthrough draft.
- surfaceRegistry.ts (S-12, S-13): only the names changed. `layout.selectActivityTab` now says "Console, Notices, Table and Problems tabs". The two Dismiss statements say "the condition store's dismiss(id)" in place of the two setters.
- Package scripts: two were added where the form says "one script line"; see F3.
- Machine rule:
  - Every heavy command ran in one hold of the given shape (hold lines reported as `<m>`: the MACHINE_HOLD and MACHINE_RELEASED lines, each with `also=<m>` and `shell=<m>`; some also printed `MACHINE_WAITING <m>` first). No WAIT_TIMEOUT, no MACHINE_ERROR, no exit code 96 to 99. No run, book, cancel, `-TargetPid` or exclusive hold was used.
  - Disk (`df -m /c`, MB free) before each heavy step: 41463 (first run), then 44395, 44299, 44279, 44261, always over 40960.
  - Last heavy work finished before 00:56Z, far from the 04:00Z and 04:25Z limits.
- Deviations:
  - D1: the verify-quotes explicit-files hold used `$(cat <file>)` inside the command, which the brief's shape forbids. It ran fine, but I should have written the 28 paths out.
  - D2: the mutation driver is one node command per hold, and it spawns one vitest process per mutation inside it. Each hold still held one command.
  - D3: strings.mjs (outside the repo) reads the ruling from the read worktree C:/dev/wt/read-1123ag, where the brief allows reading and forbids writing or moving. I read nothing else there and never read the main checkout's working tree. I read the form and the rulings only through `git -C C:/dev/spatial-ide show 4c278842946746c2899082ee54b42382044858d1:<path>`.
- Files untouched: no PLAN file, generated file, or anything under governance/ or state/. No package.json change beyond the two form scripts, no lockfile, workflow or dependency. No PR opened. No `claude` command. No stash, rebase, amend, reset or force push.
- Context handoff: this run was resumed after a context compaction; the summary and the transcript carried the state. Model: claude-sonnet-5-5 (worker-high, no override).
