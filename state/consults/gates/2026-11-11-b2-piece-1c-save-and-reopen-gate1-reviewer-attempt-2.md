Reviewed: PR #307 at 1e4a7b6fca29bc59866182719edcc67461ec7553 (the custodian's filing note, 2026-11-11: gate 1, attempt 2, the reviewer, beside the architect, PLAN node b2-piece-1c-save-and-reopen, step 1; over R2 alone, dispatched at 17:06Z before the human's ruling of 17:17Z, under which gate 1's second attempt is completed over R2 and the rulings' code together; below, the hand-back, one final newline added and one change: its scratch folder's path, in its last paragraph, written as `<S>`)
Reviewed: PR #307 at 1e4a7b6fca29bc59866182719edcc67461ec7553 (base e3fb4a97), gate 1 attempt 2, reviewer
Branch and commit: cut/b2-piece-1c-save-and-reopen @ 1e4a7b6fca29bc59866182719edcc67461ec7553
Verdict: PASS WITH NOTES

This attempt is scoped to R2. All of my attempt-1 findings (C2, D1 to D6, H1) are closed at H. All six mutations were killed at their predicted tests. I have no Correctness or Evidence finding. Three count words are still wrong after W5. They are Documentation findings and must be fixed before the merge.

**The PR cannot merge until the human rules on C-2 and C1 (Amendment 18 item 2) and their code is gated.** Nothing at H pre-empts either ruling:
- `SaveProjectResponse` gains no member; commands.rs changes only in its doc comment.
- `kernel/src/session_history.rs` is not in the correction diff.
- The mod.rs change is the W4 doc comment only.
- The PR body says S18 is missing until C-2 closes, and that the PR does not merge before both rulings.

## Findings by class

### Correctness (blocking)
None.

### Evidence (blocking)
None.

### Documentation (must fix before the merge; none is the human's wording)

These are siblings of attempt-1 D4/W5: counts this piece made untrue that W5 did not list. R2 disclosed two of them (packet flag 1). The third, DOC-2, nobody named before. Under Part 1 item 4, a disclosed unfixed sibling sends the piece back to the worker before a gate. That is for the custodian to note; it is not a gate finding. By the wording-blocks rule, the worker applies these words with no re-gate and the PR body lists them.

**DOC-1.** `frontends/shell/src/console/surfaceRegistry.ts:76 @ 1e4a7b6f` says "A seventh command changes `skp/client.ts`, this list, and …". There are now seven.
- Replacement: change "A seventh command changes" to "An eighth command changes".
- Clause check: `CLASS_A_ROWS` holds seven rows (lines 82-88). The same comment, lines 78-80, calls `record_step` the sixth and `save_project` the seventh, so the next addition is the eighth.

**DOC-2.** `frontends/shell/src/skp/client.ts:56 @ 1e4a7b6f` says "which of the six commands this was."
- The file has 6 distinct `call("…")` literals at B and 7 at H (`git show` + `grep -o`, counted), so this piece made the sentence untrue.
- Replacement: "which of the seven commands this was."
- Clause check: `deriveSkpCommandSetFromClient` finds seven names. The test "…sites are exactly the seven named commands" passes at H. M-W5-1 (below) removes `save_project` from that set, and the test then fails with 6 against 7.

**DOC-3.** `frontends/shell/src/console/surfaceCompleteness.test.ts:203 and :206 @ 1e4a7b6f`: the identifier `expectedSix` holds seven names.
- Replacement: rename it `expectedSeven` at both occurrences.
- Clause check: the array literal at line 203 has seven entries.
- This is a test-text edit, class 3 by named exception, as W5 was.

### Notes (non-blocking)
- `surfaceRegistry.ts:91-92` now reads "The eight binding-local commands … (NEXT-CUT.md's "7 + dev seam")". The parenthesis is a citation of the original count, so it is history. A reader may still stumble on it.
- Item 62's comment names its code spans "at that commit" (88a35355). At H, R2's edits have shifted the lines below `mod.rs:177` (+1) and `store.rs:41` (-1). The comment says the spans are the commit's, so it does not read them as current. They stay resolvable on main only through a merge commit, which the PR body asks for.
- M-R2-1 fails both new cases, not only the ok case that R2's report shows (check 10).
- `dialog.ts:25-26` names the form by bare file name, as `dialog.test.ts` does. It is not rooted, so verify-cites does not check it.

## Checks

**Start.** `git -C C:/dev/wt/b2c rev-parse HEAD` gives 1e4a7b6fca29bc59866182719edcc67461ec7553 (rc 0), on branch cut/b2-piece-1c-save-and-reopen. The porcelain with `--untracked-files=no` is 0 bytes, and the full porcelain is empty too. D: has 194G free (`df -h /d`, rc 0). Packet sha256 6148b811…6cffc6efbe2ccf60743… recomputed: 6148b811e54be31a865d636393b0f7accf86a035fcdc29b67602cebb6cd66152, 4841 bytes, matching the brief. Main is at 572416aa73b1c0f2aaa479ad3476a4829c14d26a. Since B, main has changed only governance (4 files), site (2) and state (6), by `git diff --name-only`, rc 0.

1. **Scope.**
   - The correction diff (`git diff --numstat 791e7e9e 1e4a7b6f`, rc 0) has 14 files, identical to the packet's list. Each is named in Amendment 18 item 1:
     - KNOWN-LIMITATIONS.md (W1, W6)
     - ADR-022 (the note)
     - surfaceRegistry.ts, surfaceCompleteness.test.ts and actionRegistry.test.ts (W5)
     - e2e-test-surface.ts (D3)
     - saveProject.ts, dialog.ts and dialog.test.ts (the picker)
     - kernel/README.md (D-5)
     - mod.rs (W4)
     - store.rs (OPEN_LOCK)
     - SKP-V0.md (W3)
     - commands.rs (W2)
   - Two commits: b06bbbba (parent 791e7e9e) and 1e4a7b6f (parent b06bbbba).
   - The §2.11 counting command, by its own text with B...H, rc 0: **75 files, 7,328 lines**, equal to the packet. At B...791e7e9e it gave 73 and 7,249.
   - Groups (my awk `1c-g1a2r-groups.awk`; nothing ungrouped):

     | Group | Lines | Ceiling |
     |---|---|---|
     | adr | 51 | 80 |
     | e2e | 444 | 320 |
     | fixtures, protocol tests and literal | 539 | — |
     | kernel product | 3,206 | 1,350 |
     | kernel tests | 1,547 | 1,000 |
     | probe | 144 | 150 |
     | protocol product | 408 | 320 |
     | records | 51 | 120 |
     | renderer | 123 | 200 |
     | shell product | 328 | 380 |
     | shell tests | **421** | 380 |
     | src-tauri | 66 | 100 |

   - The class 8 size is recorded in Amendment 19 item 2. It is not a finding.

2. **Attempt-1 findings at H.**
   - **C2: closed.** `git grep -n OPEN_LOCK 1e4a7b6f -- '*.rs' '*.ts' '*.tsx' '*.mjs'` gives rc 1, and the same for `open\.lock`.
   - **D1: closed** by W2/W3, verified against the code (`mod.rs:345-363 @ 1e4a7b6f`):
     - `adopt_project`'s `Err` and the append's `Err` become `HistoryUnwritable`;
     - `NoStep` becomes `NoStepRecorded`;
     - `Differs` becomes `WorkspaceDiffers`.

     My attempt-1 caveat still stands: `written` can name a mark in another project's record until C1 is ruled.
   - **D2: closed.** `pickProjectFolder` is in `skp/dialog.ts:27-37` with `recordNamed("binding-command", "binding_pick_project_folder")`. A `git grep` of every `invoke("binding_…")` in src finds 9 sites, each beside a `recordNamed` in the same function. The recorder.ts "every binding-command call site" sentence is true again.
   - **D3: closed** (check 4).
   - **D4: closed** for the names and comments W5 lists (check 4). Its siblings are DOC-1 to DOC-3.
   - **D5: closed.**
     - `gh pr view 307` (rc 0; head 1e4a7b6f, updated 2026-11-11T17:04:39Z, draft) has the body line "**`KnownFolders::from_bytes`'s consumer:** step 2's reopen under M1, with its gate K-O10 (Amendment 16 item 1; Amendment 18 item 3). This PR adds it before that consumer."
     - PLAN.yaml at 572416aa, the node `b2-piece-1c-save-and-reopen`'s summary, says "KnownFolders::from_bytes's consumer is step 2's reopen under M1, its gate K-O10 (Amendment 16 item 1; Amendment 18 item 3)."
   - **D6: closed** (W6, check 4).
   - **H1: closed.** The directive `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md` (the human's message, item on piece 1c) delegates it: "KnownFolders::from_bytes: yours to settle before step 1's PR opens."
     - Amendment 16 item 1 settled it before the PR opened.
     - Its consumer and gate are named in the PR body and in PLAN.
     - So the round 8 exemption's naming condition holds through the human's own delegation.

3. **ADR-022's note** (`1c-g1a2r-adr022.js`; backslashes shown by `grep -F`; rc 0):
   - H equals b06bbbba for the file. The old file ends with LF, and the sizes are 6785 and 7216.
   - The prefix equals 791e7e9e's bytes.
   - The suffix equals "\n## Note 2026-11-05\n\n" + ADR-026's italic line (the line after ADR-026's own `## Note 2026-11-05` and its blank line, read at H) + "\n\n" + the item-3 ADR-022 bullet's text inside its quotation marks (read from the directive at 572416aa, inside item 3, 152 characters) + "\n".
   - Output: `ADR022-NOTE-OK`.

4. **Words** (`1c-g1a2r-words.js`, rc 0; W1 to W6 parsed by script from the architect's filed report at 572416aa, D3 from mine).
   - Each new text occurs exactly once at H, and each old text 0 times:
     - W1 (KNOWN-LIMITATIONS.md);
     - W2 (commands.rs, after stripping `///` and joining with one space);
     - W3 (SKP-V0.md);
     - W4 (mod.rs, joined the same way);
     - W6;
     - D3 (e2e-test-surface.ts).
   - W5: 13 substitutions, each new text once at H and its old text once at 791e7e9e and 0 times at H. The `actionRegistry.test.ts` name was built by applying W5's two edits to the old name.
   - Output: `WORDS-OK`.
   - Flag 1: three Documentation findings (DOC-1, DOC-3), plus DOC-2, which nobody named before.
   - Flag 3: not a finding. Amendment 18 item 1 adopts W5's wording. It holds: the expected array has 13 ids, `actionRegistry.ts` has 13 `id:` entries, and Amendment 12 item 1 is the bar's route to Save project.
   - Flag 5: not a finding. The added sentence is true of `dialog.ts:28-36`: `recordNamed` runs before `invoke`, `resolveOk` after it, and `resolveThrew` then rethrows `e` unchanged. It is also true of Amendment 18 item 1.
   - Flags 2 and 4, for completeness, are not findings:
     - Flag 2: the recording is inside the function every caller reaches; App.tsx:879 calls it through the re-export, and the recording is proven by M-R2-1 to M-R2-4.
     - Flag 4: Amendment 19 item 3 records the heredoc writes, and their bytes are clean (check 9).

5. **Mutations, by me** (`1c-g1a2r-mut.js`).
   - Predicted list:
     - M-R2-1: `dialog.ts` records `"binding_pick_file"`. Both new `dialog.test.ts` cases fail at `entry.command`.
     - M-R2-2: the catch calls `resolveOk()`. The threw case fails, expected 'ok' to be 'threw'.
     - M-R2-3 (mine): `return null` on success. The ok case fails at `expect(result)`.
     - M-R2-4 (mine): `throw new Error("wrapped")`. The threw case fails at `rejects.toBe(transportError)`.
     - M-W5-1 (mine; renamed test): `client.ts` `call (` with a space, so the scan drops `save_project`. Both tests in "class A: the seven SKP commands" fail.
     - M-W5-2 (mine; renamed test): delete the `project.save` entry from `ACTIONS`. "holds exactly the thirteen ids…" fails.
   - Baseline, unmutated, in a hold, rc 0: dialog.test.ts 5 passed; surfaceCompleteness.test.ts 14 passed; actionRegistry.test.ts 37 passed.
   - For each mutation the script confirmed the old text occurs exactly once, made the edit, showed `git diff` (rc 0), ran `vitest run <file>`, then ran `git checkout -- <file>` (rc 0) and showed the porcelain as `""`. All were killed as predicted; nothing failed elsewhere. Results, byte-copied:
     - **M-R2-1:** rc=1, "Tests 2 failed | 3 passed (5)". `FAIL  src/skp/dialog.test.ts > pickProjectFolder records binding_pick_project_folder (B2-1C Amendment 18) > records the command name and outcome ok, and returns the chosen folder unchanged`, then `AssertionError: expected 'binding_pick_file' to be 'binding_pick_project_folder' // Object.is equality`. The threw case fails with the same line.
     - **M-R2-2:** rc=1, 1 failed. `FAIL  … > records the command name and outcome threw, and rethrows the original error unchanged`, then `AssertionError: expected 'ok' to be 'threw' // Object.is equality`.
     - **M-R2-3:** rc=1, 1 failed (the ok case). `AssertionError: expected null to be '/projects/first' // Object.is equality`.
     - **M-R2-4:** rc=1, 1 failed (the threw case). `AssertionError: expected Error: wrapped to be Error: ipc failure // Object.is equality`.
     - **M-W5-1:** rc=1, 2 failed | 12 passed. `FAIL  src/console/surfaceCompleteness.test.ts > console/surfaceRegistry completeness scan (NEXT-CUT.md P2) > class A: the seven SKP commands > skp/client.ts's own call("<name>", ...) sites are exactly the seven named commands`, then `AssertionError: expected [ 'cancel', 'close_dataset', …(4) ] to deeply equal [ 'cancel', 'close_dataset', …(5) ]`. The registry-equals-derived test fails too.
     - **M-W5-2:** rc=1, 1 failed | 36 passed. `FAIL  src/layout/actionRegistry.test.ts > U5: the registry's ids and shortcuts are unique > holds exactly the thirteen ids: …`, then `AssertionError: expected [ 'command.focus', …(11) ] to deeply equal [ 'command.focus', …(12) ]`.

6. **Clippy and fmt.**
   - `cargo clippy --locked --workspace --all-targets --features spatial-engine/fixture --message-format=short`, warn-only, in a hold, with the target env set on the command: rc 0.
   - It gave 8 distinct diagnostics, the same 8 as at 791e7e9e:
     - renderer: `canonical.rs:303:20` and `style.rs:10:5`;
     - kernel: `permission/boundary.rs:536:26`, `publish/mod.rs:839:67`, `skp.rs:277:10`, `lib.rs:415:10`, `lib.rs:490:10` and `bin/publish-bundle.rs:149:12`.
   - None is on a line R2 added. None is in any file R2 touched (a grep for project/mod, project/store and v0/commands gives 0).
   - `cargo fmt --all -- --check`, in a hold: rc 0, 0 bytes of output.

7. **`npm run verify`** in frontends/shell, in a hold: rc 0. Vitest: "Test Files 111 passed (111)", "Tests 1455 passed (1455)". The scripts' node tests: fail 0.

8. **Governance checks at H**, from the worktree root:
   - verify-cites rc 0: "verify:cites PASS — every rooted (in-tree) path:line reference across 2847 file(s) resolves."
   - verify-test-claims rc 0: "verify:test-claims PASS — all 790 claimed test(s) across 253 file(s) exist or are planned, superseded or withdrawn".
   - verify.mjs --offline rc 0: "verify:plan PASS".
   - verify-quotes, in a hold, rc 0: "verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, … 0 hash-reference errors … 924 ruling cites resolved, 0 ruling-cite errors."

9. **Bytes** (`1c-g1a2r-bytes.js`, rc 0): 79 added lines, 0 CR and 0 tab. All 14 changed files at H end with LF and hold no CR. Output: `BYTES-OK`.

10. **R2's report against the code.** Each claim below is true at H:
    - `git grep OPEN_LOCK` finds nothing;
    - the `pickProjectFolder` body is as quoted;
    - the re-export, and the dropped `invoke` import;
    - the two case names;
    - ADR-022's sizes, 6785 to 7216;
    - commit 2 is +73/-28 over 13 files;
    - clippy has the same 8, none on R2's lines;
    - npm verify has 111 files and 1455 tests;
    - the size and all 12 group figures equal mine;
    - M-R2-2's failing line equals mine byte for byte.

    Not checked: the workspace tests' 1070/0/66 and the scripts suites' 598, which are the tester's. M-R2-1's report shows only the ok case's FAIL, while both cases fail. That is an omission, not an untrue claim. I found no untrue claim.

11. **CI.** Read at 2026-11-11T17:23:50Z: `gh pr checks 307` (rc 0) shows 18 checks, all pass. `gh run view --json headSha,conclusion,workflowName` (rc 0) shows all 12 runs at headSha 1e4a7b6fca29bc59866182719edcc67461ec7553, conclusion success:

    | Workflow | Runs |
    |---|---|
    | Product CI — Rust workspace | 43061195188, 43061207801 |
    | Rust fmt | 43061195473, 43061207812 |
    | Governance CI — plan, queue, site | 43061195217, 43061207874 |
    | DCO sign-off | 43061207969 |
    | Exposure scan | 43061207757 |
    | Ported notices | 43061195351, 43061207721 |
    | Product CI — shell | 43061195381, 43061208031 |

12. **Porcelain afterwards.** `git -C C:/dev/wt/b2c status --porcelain --untracked-files=no` gives 0 bytes (rc 0), and HEAD is still 1e4a7b6f.

## For the human
- C-2 and C1 stay with you (Amendment 18 item 2). Nothing at H pre-empts either ruling, and the PR cannot merge until both are ruled and their code is gated.
- Nothing else.

## The packet's gaps
- It did not point to the 2026-10-23 directive's from_bytes delegation, which H1's closure rests on.
- It named no mutation targets for the W5-renamed tests.
- It gave M-R2-1 and M-R2-2 only in prose, not as exact old and new text.
- It did not list the other count sentences in the shell outside W5 (DOC-2's `client.ts:56`).

## Hold lines (this project only; `also=` elided)

| Run | MACHINE_HOLD | MACHINE_RELEASED |
|---|---|---|
| vitest baseline | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:29704 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:29704 affinity=FF (cores 0-7) |
| six mutations | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:71596 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:71596 affinity=FF (cores 0-7) |
| clippy | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:33640 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:33640 affinity=FF (cores 0-7) |
| fmt | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:24580 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:24580 affinity=FF (cores 0-7) |
| npm run verify | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:58088 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:58088 affinity=FF (cores 0-7) |
| verify-quotes | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:48072 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:48072 affinity=FF (cores 0-7) |

No hold was refused, and no exit code from 96 to 99 appeared.

## Background shells left
None of mine. Three background tasks ran and each reported completed: npm verify bfebctf1i, verify-quotes by6zjxfr1, and one wait loop bzx9pg0mo (1 s per turn, 280 s cap). `ps -ef` at 17:31Z shows one `bash` with a `sleep` child (PID 58535). Its shell snapshot (`…1793214460044…`) differs from my session's (`…1793340554857…`), so I did not start it. I left it alone and killed nothing.

## Model
Opus 5.5 (claude-opus-5-5)

Scratch files (all `1c-g1a2r-*` in `<S>`), among them:
- 1c-g1a2r-mut-run.log
- 1c-g1a2r-mut-baseline.log
- 1c-g1a2r-words.out
- 1c-g1a2r-adr022.out
- 1c-g1a2r-bytes.out
- 1c-g1a2r-clippy.txt
- 1c-g1a2r-verify.txt
- 1c-g1a2r-vquotes.txt
- 1c-g1a2r-runs.txt
