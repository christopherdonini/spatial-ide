*Custodian's filing note (2026-11-08): the worker's two reports for `publish-filter-sentence-mark-comment-and-adr-024-note`, the docs lane, words only under U12's form's Amendment 2 (`governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`), from its hand-backs byte for byte, each saved with one final newline: first `Stopped` at check 7 (3479 bytes, sha256 70690f1c8b00f9b8be053945023efd3c7e00510b281559d47308a57cf1fcd01e); then, after the custodian's correction message (1067 bytes, received at 2026-11-08T09:38:14.372Z by its transcript), `Built` at 554ade81 (3950 bytes, sha256 8475d26f57869c1cdfe6efc36c8387227b2d2d882f6d0e5683dddbb3f839f9e6). Its brief was given by file (10893 bytes, sha256 371e893f5c4577c6253cc147a5631ecba259c711355112777db256eaeb8a15c1). Dispatched at 2026-11-08T09:36:32.396Z by its transcript; the run went to 2026-11-08T09:49:13.192Z (claude-sonnet-5-5; unique calls: Read 1, Bash 17, Write 1, the hand-backs 2, 21 in all). The stop was the custodian's brief error: the brief allowed `npm ci` in frontends/shell only, and the shell's typecheck and tests build renderer/bundle-viewer first, which needs its own install. It is the second such omission (the first was area A's phase 1). The correction allowed that install and the re-run of checks 7 to 9. Checked by the custodian at origin: the branch at 554ade81fbd887d545cb9638bb79fda86a54b1a8, one commit on e13fa13b; against it, 23 changed lines in three files (ADR-024 6/0, publish.rs 6/4, types.ts 4/3); the three files' sha256 at the head equal the brief's; draft PR #298, opened at 2026-11-08T09:50:33Z. One record error, the worker's: the commit body names "round 25" as the ruling's source. The ruling is the human's of 2026-11-06 (15:59Z), recorded by U12's form's Amendment 2; round 25 (2026-09-26) is a routing ruling that U12's form cites in its notes. The commit is not amended; the PR body says so. A report, not Authority.*

---

Stopped: the mark comment and ADR-024's note, check 7 failed (`npm run typecheck` and `npm test` exit 1). Checks 1 to 6 passed and the commit exists, but I did not run 8 and did not push.

**Worktree:** fetch rc=0. `origin/main` is e13fa13bea35ae173907cac8ac53698b01c3f614. `git worktree add -b cut/publish-filter-sentence-mark-comment-and-adr-024-note C:/dev/wt/markc e13fa13b…` gave rc=0. `npm ci` in `frontends/shell` gave rc=0, with only the esbuild allow-scripts warnings.

**Span files:** all five match the given sizes and sha256 by command.
- `mark-rs-old.txt`: 347 bytes, 39e3be19…
- `mark-rs-new.txt`: 472 bytes, f36793ab…
- `mark-ts-old.txt`: 266 bytes, 65281bd6…
- `mark-ts-new.txt`: 386 bytes, 8a3a355b…
- `mark-adr024-append.txt`: 585 bytes, c8521d6d…

**Script and hashes after:** `markw-apply.mjs` exited 0. Each old span occurred exactly once, and ADR-024 ended in LF and had no heading. The three hashes match the given ones.
- `publish.rs`: aca5680e…4d
- `types.ts`: dd974e61…87
- ADR-024: e53008fd…38beb

**Numstat:** exactly 6/0 ADR-024, 6/4 `publish.rs`, 4/3 `types.ts`, and no other file. The porcelain showed only those three files.

**Check 3:** CR count is 0 in all three files. The two source files have no added line over 100 characters. The only added lines over 100 are two in ADR-024: the italic line naming the directive, and the note line.

**Check 4:** the filter for `+`/`-` lines in the `git diff -U0` of the two source files, excluding `///` and `*` lines, printed nothing.

**Check 5:** `cargo fmt … -- --check` exited 0 with an empty output file.

**Commit:** 554ade81fbd887d545cb9638bb79fda86a54b1a8, made with `git commit -s -F`. The subject is as given: "docs: publish-filter-sentence-mark-comment-and-adr-024-note, the human's words: the mark's source comment in publish.rs and types.ts (N-3), ADR-024's dated note (N-2)". The message file's only `@` is on the first trailer line (grep showed line 5 only). The porcelain is empty after the commit.

**Check 7**, in one shared hold, run in `frontends/shell`:
- `npm run typecheck`: rc=1. Last line: "buildViewerFirst: C:\dev\wt\markc\renderer\bundle-viewer\node_modules not found -- run `npm ci` in renderer/bundle-viewer first (frontends/shell's build reads its dist-metafile.json)."
- `npm test`: rc=1, same last line. It produced no test-file or test counts.
- `npm run test:citation-integrity`: rc=0. Last line: "== 30 passed, 0 failed ==".
- `npm run verify:adr-index`: rc=0. Last line: "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line".

The cause looks like the worktree having no `renderer/bundle-viewer/node_modules`. The brief allows only `npm ci` in `frontends/shell`, so I did not install anything. The failure is not from the comment or ADR change. To go on, the custodian has to either allow `npm ci` in `renderer/bundle-viewer` or decide how check 7 is met.

**Hold lines:** `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:75764 …`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:75764 affinity=FF (cores 0-7)`. No 96 to 99 code.

**Not done:** check 8 and the push. The branch exists only locally, at 554ade81. Nothing is pushed.

**Background shells left:** none. I started none.

**Model:** Sonnet 5.5, claude-sonnet-5-5, as the harness reports it.

**Scratch files:** `markw-apply.mjs`, `markw-c7.sh`, `markw-msg.txt` and the `markw-c7-*.txt` outputs are in the scratch folder.

---

Built: the mark comment and ADR-024's note at 554ade81fbd887d545cb9638bb79fda86a54b1a8

This supersedes my earlier Stopped report. The custodian's correction cleared the stop, and every check now passes.

- **Worktree:** `origin/main` was e13fa13bea35ae173907cac8ac53698b01c3f614. The worktree is `C:/dev/wt/markc`, branch `cut/publish-filter-sentence-mark-comment-and-adr-024-note`. `npm ci` in `frontends/shell` gave rc=0.
- **Span files:** all five match their given sizes and sha256 (347, 472, 266, 386 and 585 bytes). I showed this by command.
- **Script:** `markw-apply.mjs` exited 0. Each old span occurred exactly once. ADR-024 ended in LF and had no heading.
- **Hashes after:** the three match the given ones. `publish.rs` is aca5680e…, `types.ts` is dd974e61…, ADR-024 is e53008fd….
- **Numstat:** 6/0 ADR-024, 6/4 `publish.rs`, 4/3 `types.ts`, and nothing else.
- **Checks 3 and 4:** no CR in any of the three files. The source files have no added line over 100 characters. The only added lines over 100 are two in ADR-024. Only `///` and `*` lines changed in the two source files.
- **Check 5:** `cargo fmt -- --check` exited 0 with no output.
- **Commit:** 554ade81, signed off with `-s`. The subject is "docs: publish-filter-sentence-mark-comment-and-adr-024-note, the human's words: the mark's source comment in publish.rs and types.ts (N-3), ADR-024's dated note (N-2)". The message file's only `@` is on the first trailer line.
- **Correction step 1:** `npm ci` in `renderer/bundle-viewer` gave rc=0. HEAD and the porcelain were unchanged afterwards.
- **Check 7, rerun in one shared hold at 554ade81, in `frontends/shell`:**
  - `npm run typecheck`: rc=0. The output ends with `tsc --noEmit`; the run printed a blank line last.
  - `npm test`: rc=0. 109 test files passed (109), 1446 tests passed (1446).
  - `npm run test:citation-integrity`: rc=0. "== 30 passed, 0 failed ==".
  - `npm run verify:adr-index`: rc=0. "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line".
- **Check 8, from the worktree root:**
  - `verify-cites`: rc=0. "verify:cites PASS — every rooted (in-tree) path:line reference across 2757 file(s) resolves. (176 loose reference(s) advised above.)"
  - `verify-quotes`, in a shared hold: rc=0. "verify:quotes PASS — 151 checked, 120 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 920 ruling cites resolved, 0 ruling-cite errors."
  - `verify-test-claims`: rc=0. "verify:test-claims PASS — all 756 claimed test(s) across 243 file(s) exist or are planned, superseded or withdrawn (43 planned, 14 superseded, 17 withdrawn, advisory)."
  - `verify.mjs --offline`: rc=0. "verify:plan PASS — C:\dev\wt\markc\governance\PLAN.yaml agrees with the repository."
  - The `node --test` suite: rc=0. 598 tests, 598 pass, 0 fail.
  - `git diff --numstat e13fa13b...HEAD` gave three lines: 6/0 ADR-024, 6/4 `publish.rs` and 4/3 `types.ts`. The total is 16 added and 7 removed, over 3 files.
- **Holds:** the shell-suite hold printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:78836 …` and `MACHINE_RELEASED … shell=bash.exe:78836`. The `verify-quotes` hold printed `shell=bash.exe:80444 …` and `MACHINE_RELEASED … shell=bash.exe:80444`. No 96 to 99 code.
- **Push:** `git push -u origin cut/publish-filter-sentence-mark-comment-and-adr-024-note` gave rc=0, as a new branch. `HEAD` and `origin/cut/publish-filter-sentence-mark-comment-and-adr-024-note` are both 554ade81fbd887d545cb9638bb79fda86a54b1a8, and the porcelain is empty. I opened no PR and did not wait for CI.
- **Not run:** the Rust suite of `frontends/shell/src-tauri`, as the brief says. CI runs it.
- **Background shells left:** none. The `verify-quotes` hold ran in the harness's background and finished with exit 0.
- **Model:** Sonnet 5.5, claude-sonnet-5-5, as the harness reports it.
