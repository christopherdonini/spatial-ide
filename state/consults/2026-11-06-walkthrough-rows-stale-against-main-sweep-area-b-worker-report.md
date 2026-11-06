*Custodian's filing note (2026-11-06): the worker's report for `walkthrough-rows-stale-against-main-sweep-area-b` (the docs lane's first piece; the form `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`), built at 6c6d4564b9bcb33382dbf4ccb3c516d554277f79 on its branch, PR #283. The run 2026-11-05T23:45:45.703Z to 2026-11-06T00:05:06.431Z by its transcript (claude-sonnet-5-5; unique calls Bash 38, Read 4, Edit 23, Write 2, Monitor 1 and the hand-back, 69, equal to the notification's). Extracted by script from the hand-back message in that transcript (5528 bytes, sha256 bd3e27ed1b44b0331d4478a5faf092efea16c41031ed0c576738510d16a21bbd), unchanged. Under Part 1 item 4 of the human's rulings of 2026-11-05 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`) the custodian read it before the gate: its five disclosures name no unfixed sibling and no gap in the change, so none went back to the worker; they are in the review packet's section 5. The one span it flagged for whose words (472e8839) the custodian checked by git, as the packet's section 2 records. A report, not Authority.*

---

Built: walkthrough-rows-stale-against-main-sweep-area-b at 6c6d4564b9bcb33382dbf4ccb3c516d554277f79

- **Start state:** worktree C:/dev/wt/wrb on cut/walkthrough-rows-stale-against-main-sweep-area-b. HEAD was 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 (= B) and the porcelain was empty. The brief file's sha256 matched 65ca5a7e…26fe.
- **Whose words (OPEN-6 (a)):** I traced each old span with `git log -S` on its exact text. Plain `git log -L` over the line ranges returned 79 to 142 commits per range, because the line ranges drift, so it could not separate authors. Every commit is one account, so authorship cannot tell human from agent. I therefore read each introducing commit's trailer.
  - A3 old span: 76ee453e, Co-Authored-By Claude Sonnet 5.
  - B3 and the B2'/B3' row: 76ee453e and 14c659f9 (Claude Fable 5).
  - J1 (B8), J2 (B3) and J3 (B2): 6039cf78 (Claude Fable 5).
  - The Part L preamble, L1 and L5: 472e8839 (Claude Fable 5.1).
  - N9 (B9): 9eb52ac1 (Claude Sonnet 5).
  - No span is shown to be the human's typed words, so none is held. The J3 Judge sentence (OPEN-7) is not the human's either.
  - The 472e8839 message does say the human described the zoom-out cycling "verbatim" and that entry 42 carries the human's expectation "verbatim". The edited L-spans are the commit's own rows, not those quotes, so I read them as the commit's words. You may want to check this.
- **Commit:** 6c6d4564 `docs: walkthrough-rows-stale-against-main-sweep-area-b -- rows B1 to B5, B7 to B10 in MANUAL-WALKTHROUGH.md` (one commit, `-s`). The message file had `@` only in the first trailer line, shown by grep before committing.
- **Edits made:** B1 (both parts), B2, B3, B4 (the Part H dated pointer), B5 (two dated notes), B7 (preamble, L1 step, L5 step), B8, B9 (three spans), B10 (A3, both insertions). `<merge date>` is written as 2026-11-05 (`date -u +%F`). F2 and Part F are untouched, and there is no hunk at or after the Result log heading (line 987 at B and at H).
- **Clause checks:** I re-read the code at B for every clause and none failed, so there was no STOP. Files read: RefusalBlock.tsx, formatRefusal.ts, AdmissionPanel.tsx, StylePanel.tsx, App.tsx, stepRecorder.ts, client.ts, types.ts, ConsolePanel.tsx, surfaceRegistry.ts, residencyArm.ts, residencyTileSizeLevel.ts, candidateArmSession.ts, tileViewportStreamManager.ts, tileGridConstants.ts, e2e-test-surface.ts, admitDataset.ts, dataPlaneClient.ts, DescribeSummary.tsx, the e2e scripts and KNOWN-LIMITATIONS.md lines 202 and 232 to 280.
- **New spans against the row table:** my script (scratchpad wrb-evidence.mjs) checked each new span against the form text with the date substituted.
  - All 15 spans and the three additions are byte-identical to the form's words (B7 against its `> ` blockquote).
  - One difference: B10b is the form's insertion `; **CRS provenance**`, placed after `**License** "not declared"` and before `. No refusal panel appears.`. The script's literal match against the form returned false for it because of that placement, not because of different words.
- **Evidence script output** (exit code 0, "EVIDENCE OK"), all PASS:
  - 3 additions and 13 spans are each present once at H, and each old span is once at B.
  - With every span and addition reverted, the file at H is byte-identical to B.
  - 11 hunks, none at or after the Result log heading, and the text from that heading on is byte-identical.
  - Content checks, each present once inside its new span: `getResidencyTileSizeLevel()` (B7), `.crs-assertion-form` (B1 part 2), `columns, filter, limit}` (B3), `record_step` (J3 span and the pointer).
  - Whole-file counts at H are higher for three strings: `.crs-assertion-form` 2, `columns, filter, limit}` 2 (HEXLIM'), `record_step` 9. The form's "present once" is therefore met within the new span, not across the whole file.
  - Seven absence patterns, each checked with `grep -cF`: at B 1 line each with rc=0, at H 0 lines each with rc=1.
  - `git diff --name-only B...HEAD` lists only frontends/shell/MANUAL-WALKTHROUGH.md.
- **Push:** `git push -u` returned rc=0, and origin's branch equals HEAD (6c6d4564…).
- **CI on the head:** run 42132652967 (Ported notices), success, head 6c6d4564. Run 42132652931 (Product CI — shell), success, head 6c6d4564. These are the only two runs on the branch.
- **Size:** `git diff --numstat B...HEAD` is 16 added and 16 deleted (32 lines, 1 file) against the 90-line ceiling. There is no overrun.
- **Checks at head (exit codes):**
  - verify.mjs --offline: rc 0, "verify:plan PASS".
  - verify-cites.mjs: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2660 file(s) resolves."
  - verify-quotes.mjs: rc 0, "verify:quotes PASS — 138 checked, 107 verified, 30 baselined".
  - verify-test-claims.mjs: rc 0, "verify:test-claims PASS — all 733 claimed test(s)".
- **Stop rules:** none met. Disclosures:
  - Note 1 and note 2 go after the NET' row and the FIND' row, as the form says. Note 1 therefore sits between the regression table and the A10 paragraph that follows it.
  - The date "2026-11-05" is the UTC date from `date -u +%F`. It differs from the harness's local date of 2026-11-06.
  - The `-s` sign-off line was added by git.
- **Housekeeping:** the porcelain is empty and nothing else was written in the worktree. All background tasks I started have exited, and I killed nothing. There was no cargo or npm run.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No model override and no context handoff.
