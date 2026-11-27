Reviewed: the merge commits of eight held pull requests, each a merge of main 4b9fd558d0437b3249e1bba58334a6d55074c199 into its branch, by full hash in the read worktree D:/wt/read-1124f, read only: 350 f7da17385558166e2210f129fcf611bf3cbe9431, 353 20a1610476819b9a13452ab0aa70f12d2afae7f6, 356 44fe6e789347d7a1cc583620706b78ae52642cf8, 358 13271dc70d784866d48fc8b8c3876b5c728426fe, 359 1b7c220b9f102088132ced998cfaaa32f1d04610, 360 2d0c6d36fedaf49fba1a638c690bd9a0d6499f29, 361 5eebf80f75d6be4844ac017bc639f0ad2e018528, 362 43f31bb21610f1dd6c9f05e4aa033de0aadcbee2. This is the custodian's filing note, 2026-11-27: the narrow read each merge-in gets before its pull request leaves draft (ADV-2026-11-26-15 item 4; ADV-2026-11-27-02 item 3 (a)), node:held-prs@prep-mergein-read. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 14 tool uses, 421820 ms, 79217 tokens; model opus. It handed back once; the custodian saved its report through the Write tool from the hand-back message, with the harness's two-space indent removed, at 2026-11-27T00:58:08Z (the saved file's modification time). Filed below the rule, 10690 bytes, sha256 9aba79dcaf8f564839f1464c0c02e88bdbfa5c0122588ee4aa2a7c93df731d3e, byte for byte, nothing masked. The reading condition on check 4 is taken as the brief meant it: the noreply attribution trailer is not an account address, so check 4 passes for all eight.

---

PASS ×8: cut/cancel-stamp-order @ f7da17385558166e2210f129fcf611bf3cbe9431 PASS · cut/property-testing-trial @ 20a1610476819b9a13452ab0aa70f12d2afae7f6 PASS · cut/shell-tests-temp-folder @ 44fe6e789347d7a1cc583620706b78ae52642cf8 PASS · cut/untiled-reissue-mint-window @ 13271dc70d784866d48fc8b8c3876b5c728426fe PASS · cut/console-stream-lane @ 1b7c220b9f102088132ced998cfaaa32f1d04610 PASS · cut/describe-failed-close @ 2d0c6d36fedaf49fba1a638c690bd9a0d6499f29 PASS · cut/opened-of-panic-frees-the-lock @ 5eebf80f75d6be4844ac017bc639f0ad2e018528 PASS · cut/command-bar-enter-after-applied @ 43f31bb21610f1dd6c9f05e4aa033de0aadcbee2 PASS

There is one reading condition on check 4, and it applies to all eight PRs. Besides the sign-off, each message has one other line with an address in it: the `Co-Authored-By: Claude … <noreply@anthropic.com>` attribution trailer. No message has a second copy of the account address. If the brief's "no other line naming an email" means any address at all, then all eight fail check 4 on that trailer and on nothing else.

How I worked: everything ran as `git -C D:/wt/read-1124f …`, read-only. `git fetch -q origin` gave rc=0, and `git rev-parse origin/main` printed 4b9fd558d0437b3249e1bba58334a6d55074c199. Nothing was checked out or written, and no node, npm or cargo was run. No hook refused a call.

Commands run for every PR:
- C1: `rev-list --parents -n1 <new>` and `rev-parse origin/<branch>`
- C2: `diff-tree --cc <new>` (line count and output); `merge-base 4b9fd558 <old>`; `diff 4b9fd558 <new> | patch-id --stable` against `diff <mb> <old> | patch-id --stable`; the file count on each side
- C3:
  - `diff --name-status <mb> 4b9fd558 -- . ':!state/' ':!governance/'`, and the overlap of the two sides' path lists (comm).
  - A cross-side cite scan. I took every `path:N[-M]` token in lines main added (mb..4b9fd558) that points into one of the PR's paths. I checked each token against that file's length in `<new>`. I also checked the reverse direction: cites in the PR's added lines that point into paths main changed. This is the same existence-and-bounds test verify-cites makes.
  - `diff --name-only 4b9fd558 <new> -- state governance site scripts/hooks tools` (printed 0 for all eight), so the PLAN, site and records trees in each merge are main's.
- C4: `log -1 --format=%B <new>`, plus counts of `^Signed-off-by:` lines and of lines containing `@`.

Main-side paths, judged once here (they recur below):
- `site/data/plan.json` and `site/index.html` (all eight): generated output (the shipped list, node boxes). The PLAN.yaml and site blobs in each `<new>` equal main's (count 0 above), and no PR touches either, so the site drift check sees main's state. This cannot fail on PR files.
- `scripts/plan/verify.test.mjs` (350, 353, 356): it only changes the offline-note test. The temp dir name and assertion messages change, and the assertion becomes the regex `/PR #\d|evidence \{pr: \d|\(gh release view\)/`. It runs on `fixtures/valid-plan.yaml` in a temp dir and never reads PR files.
- `tools/mods/spatial-guardian/{README.md,hooks/register.js,test/guardian.test.ts}` (350, 353, 356): `register.js` adds `on('tool.call', { tool: 'Monitor' }, …guardShell…)` and `Monitor: e.command` in the refusal-log target map. It is a hook module that is not part of any product build. Its new tests drive fixtures (for example `monitorRefused(on, $, 'git push --force origin HEAD:refs/heads/guardian-monitor-fixture', …)`) and read no PR file.
- `scripts/hooks/README.md` (353): two doc sentences on subagent compaction. Not executable.
- `scripts/plan/verify-cites.mjs`, `verify-cites.test.mjs` and `verify-cites-shortened-target.json` (353 only): these add the shortened-target pass. It only engages when `short.entries.get(JSON.stringify([relPath, cite.raw]))` hits, and the only new failure lines are `targetErrors` from list entries. In 353's tree the list has 0 `"commit"` entries, as it does at main (`"entries": []`). So for 353 every cite is scanned exactly as before. The new tests build their own trees (`gitTree({...})`, `runVerifyCites({ repoRoot: dir, …})`) and read no PR file.

---

**PR 350 · cut/cancel-stamp-order**
1. Parents: `f7da1738… 74c06805a61c64485d9bed90118c4aedfa27d9a5 4b9fd558d0437b3249e1bba58334a6d55074c199`; origin/cut/cancel-stamp-order = f7da1738… PASS.
2. `diff-tree --cc` printed only the commit id (1 line, no hunk). mb = 069b91e07b2a; merge-base(main, new) = 4b9fd558. Both patch-ids are `bb4fabc779b68377ad5afa0e9a9e6ffbcc570c82`, with 11 files on each side. PASS.
3. Main's side outside state/ and governance/: verify.test.mjs, the site files, the three guardian files. No overlap with the PR's 11 paths, and nothing can change PR code, tests or checks (see above). This PR's own file `scripts/plan/verify-cites-shortened-target.json` has 10 entries, so I checked them against main's side:
   - Main appended 32 lines to the citing form `governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md`. None of them adds or removes a `kernel/tests/skp_*.rs:` token (grep of ± lines printed nothing).
   - The other two citing consults are unchanged.
   - All three entry commits (16c89655…, b3beb0f7…, 1c13810f…) pass `merge-base --is-ancestor … <new>`.
   - Cross-side cite scan: no overrun.
   PASS.
4. Subject `chore: merge main into cut/cancel-stamp-order (preparation, ADV-2026-11-26-15 item 4)`; Signed-off-by: 1; lines with `@`: 2 (the sign-off and the noreply Co-Authored-By); trailer names Sonnet 5.5. PASS, subject to the reading condition above.

**PR 353 · cut/property-testing-trial**
1. `20a16104… 09ce1dfe8d6b05f2910ec9278c08a6839f55da36 4b9fd558…`; origin = 20a16104…. PASS.
2. cc: 1 line, no hunk. mb = 90bdeab78ea3. Both patch-ids are `604d231f81df2b8eafb5e46529fc0ef66d2b3dc2`, 8/8 files. PASS.
3. Main's side: scripts/hooks/README.md, the three verify-cites files, verify.test.mjs, the site files, the guardian files. No overlap with the PR's paths (Cargo.lock, protocol/data-plane, the shell package files, two property tests), and nothing can affect them (see the verify-cites note above). The cross-side scan flagged two main-added cites, and neither is new:
   - `Cargo.lock:4758-4766` in `state/consults/2026-11-22-shell-test-executables-manifest-design-note-architect.md`. It is a bare basename (LOOSE, so advisory), and it already overruns at main: main's root Cargo.lock has 2622 lines, against 2682 in `<new>`.
   - `src-tauri/Cargo.lock:4694-4695` in `state/consults/gates/…` points at a different file, and `state/consults/gates/` is advisory (`ARCHIVED_PREFIXES = ['state/drafts/', 'state/consults/gates/']`).
   PASS.
4. Subject matches; sign-off 1; `@` lines 2; Sonnet 5.5 trailer. PASS (reading condition).

**PR 356 · cut/shell-tests-temp-folder**
1. `44fe6e78… 88ce3c6575a81f248bcc0a203355c3a49a86ca30 4b9fd558…`; origin = 44fe6e78…. PASS.
2. cc: 1 line, no hunk. mb = 08783d073376. Both patch-ids are `239768c373f4e9d26362ee605c9f921bbcee08c5`, 2/2 files. PASS.
3. Main's side: verify.test.mjs, the site files, the guardian files. No overlap with commands.rs or publish.rs, and no effect. Cross-side scan: no overrun. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).
   - Observation, not a finding: this message alone carries `Co-Authored-By: Claude Opus 5.5` plus a `Claude-Session:` line. The other seven say Sonnet 5.5 and have no session line.
   - It was also committed later than the others (01:47:47+01:00, against 01:45:52 to 01:46:36). Check that the trailer names the model that made the commit.

**PR 358 · cut/untiled-reissue-mint-window**
1. `13271dc7… 7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd 4b9fd558…`; origin = 13271dc7…. PASS.
2. cc: 1 line, no hunk. mb = 8922b8435295. Both patch-ids are `c0901592a255c5a52809c3385dcec2c583aced49`, 3/3 files. PASS.
3. Main's side: the site files only. No effect. Cross-side scan (117 main-added KNOWN-LIMITATIONS.md cites and 41 candidateArmSession.ts cites, each checked): no overrun. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).

**PR 359 · cut/console-stream-lane**
1. `1b7c220b… 8b8c38815a5fbc1e41e392366784a7c1c51a5783 4b9fd558…`; origin = 1b7c220b…. PASS.
2. cc: 1 line, no hunk. mb = 1f72b1f76101. Both patch-ids are `8858c7356bed8a50c288c7eb3536b21dc4bd2409`, 13/13 files. PASS.
3. Main's side: the site files only. No effect. The cross-side scan flagged one cite, and it is not new: `frontends/shell/e2e/README.md:916` in `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-build-gate-reviewer.md`. It is in the advisory gates folder, and the README has 908 lines both at main and in `<new>`. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).

**PR 360 · cut/describe-failed-close**
1. `2d0c6d36… 8d1f2f4ee6cef58ef5975ebfc6c2d8790d2fbcfb 4b9fd558…`; origin = 2d0c6d36…. PASS.
2. cc: 1 line, no hunk. mb = 939bb764f106. Both patch-ids are `d870caddb07e0aa8b477958623d2e520bed068fd`, 5/5 files. PASS.
3. Main's side: the site files only. No effect. Cross-side scan: no overrun. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).

**PR 361 · cut/opened-of-panic-frees-the-lock**
1. `5eebf80f… 0922c90a38ad91bf7922cf9a6baf0f8ed1344397 4b9fd558…`; origin = 5eebf80f…. PASS.
2. cc: 1 line, no hunk. mb = 1938c1b50b84. Both patch-ids are `148e36d519a76a03d079520addb5c81268876eee`, 1/1 file. PASS.
3. Main's side: the site files only. No effect. Cross-side scan (86 main-added `kernel/src/project/mod.rs` cites, each checked): no overrun. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).

**PR 362 · cut/command-bar-enter-after-applied**
1. `43f31bb2… 3469e439159372f0d435262a2d9265ce2af824b5 4b9fd558…`; origin = 43f31bb2…. PASS.
2. cc: 1 line, no hunk. mb = 36b788ba6940. Both patch-ids are `60e5e63f53ae4d8f6d2093f8822206d5eea7a081`, 2/2 files. PASS.
3. Main's side: the site files only. No effect. Cross-side scan: no overrun. PASS.
4. Subject matches; sign-off 1; `@` lines 2. PASS (reading condition).

---

The custodian's locator holds as stated: the patch-ids are equal for all eight, no path overlaps, and outside state/ and governance/ main touched only tools/mods/, site/, scripts/plan/ and scripts/hooks/README.md.

Limits of this read:
- The cite scan checks existence and bounds only, as verify-cites does. It does not hash-check pinned spans, and it is not a run of verify-cites.
- That the sign-off came from `--signoff` is inferred from its being the only one and matching the committer's identity. I did not observe the command being run.
