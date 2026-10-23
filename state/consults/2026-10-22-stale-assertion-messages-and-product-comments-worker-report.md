*Custodian's filing note (2026-10-22): the docs lane's piece 2 by a worker, at b24e5281 on its branch from B 4b26d279: the seven spans in four files, 34 lines against §7's 39 (OPEN-2's yes). The run 12:54:29Z to 13:38:52Z by its transcript (Bash 30, Read 1, Write 8); its claims were read against that transcript's calls before filing, and the custodian recounted the numstat at B...H. Extracted by script from its SubagentHandback call, with the scratch-folder path written as a placeholder, the machine script's path written from the home folder (`~/Development/Claude/machine/machine.ps1`), and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d1f5eb796e1b439877d72ea685d9572accfb7bd8ffd10ba7f1f0d5255a3e0b97.*

---

Built: stale-assertion-messages-and-product-comments at b24e5281aef6da8b744de3ca840e9ffc10503cb6

**B and the push.** B is 4b26d27905dd93d5c7453da67ee0d93ec8d4313e, and the worktree was clean at B. The commit is on branch cut/stale-assertion-messages-and-product-comments, with `git add` of the four files only and `git commit -s -F` (rc=0). The subject and the two trailer lines are as briefed. The push (its own Bash call) printed rc=0, and origin/<branch> equals HEAD.

**Step 1 (cites re-read at B).**
- A script took every non-state `path:line @ 39182e74… sha256` pin in the form and recomputed it against `git show B:<path>`. Result: ok=100, bad=4, skipped (state/) 12.
- The 4 mismatches are all PLAN.yaml pins (4497-4513, 4512 twice, 2353-2368). PLAN.yaml changed between C and B, and the pins are historical. No source or doc file the rows rest on changed between C and B, since `git diff --name-only C B` outside state/ lists only PLAN, queue, site, DECISIONS-PENDING and three forms.
- Class 3 rows for the custodian: none for any file the rows rest on. The 4 PLAN.yaml pins in the form's Authority and §2.5 paragraphs no longer match the tree. Per the form, the pin is historical and B's tree is authoritative. This does not touch a span I edited.
- No invalidator: every cited fact is unchanged, because the files are byte-identical to C.

**Edits.** One node script took each "As it stands" block from the form's fences (indent stripped), asserted it occurs exactly once at the expected line, and replaced it with the "New text" block. For §2.3 the old spans are the file's lines 100-102, 1143 and 1145-1146, because the form gives no fenced old text for them. Each was found once at the expected line. Spans (old text → new text, as in the commit):
- M1 `engine/tests/session_identity.rs`:193: the 3-line "PROPOSED … Amendment 1's, not the accepted ADR's … here treats the amendment as binding" message became the 2-line "the third what-was-checked value, naming the basis. ADR-016 Amendment 1 item 1 \ (Accepted) adds it to the two §6 values settled at the ADR's acceptance".
- M2 `frontends/shell/e2e/regression.mjs`:1830: `(residencyStatus.ts:429-430)` became `(residencyStatus.ts's SETTLED_PARTIAL_WITHIN_BUDGET_TEXT)`.
- §2.3 `regression.mjs`:100-102: `error.rs:244`, `dataset.rs:1017` and `(`dataset.rs:1009`)` became the name-only form.
- §2.3 `regression.mjs`:1143: `fitToExtent` … `WorkingCanvas.tsx:1227` became `WorkingCanvas.tsx`'s `fitToExtent`.
- §2.3 `regression.mjs`:1145-1146: `residency-harness.mjs:1971-1977`/`:1952` became "in `runFieldSequenceIdentityCheck`'s doc comment".
- C1 `crsAssertionState.ts`:9-11: the `@testing-library` pointer became the "so that it is unit-tested as plain functions, with no mount … without rendering `App`" text.
- B1 `buildLayers.ts`:31-34: the ADR-023 premise (4 lines) became the 5-line "shell's style documents are literal-only … `StyleDocumentV0` has no `match` variant … `skp/0.6` … the shell requests none" text.
- Full old and new bytes are in `git show b24e5281`. The new text equals the form's blocks by construction (same-script extraction). LF line ends and final newlines are kept, and there are no CR bytes in the diff.

**§4 items.** Rc values come from my scratch rc file.
1. `cargo test -p spatial-engine --test session_identity`: rc=0, 18 passed, 0 failed.
2. `cargo test -p spatial-engine -- --list`: rc=0 at B and at H, 509 lines each, `cmp` identical (rc 0).
3. `npx vitest list`: rc=0 at B and at H, 1375 lines each. Raw order differs (first diff at line 269, a nondeterministic order of whole file groups). The sorted lists have identical md5 (450ea39092f3a88ff4f6713126ae1394 both). Judged identical as a set, and I did not rerun it.
4. `cargo fmt --all -- --check`: rc=0.
5. In `frontends/shell`:
   - vitest run of the three files: rc=0, 3 files, 43 tests passed.
   - `npm run typecheck`: the first run got rc=1 before tsc, because `renderer/bundle-viewer/node_modules` was missing (`pretypecheck` prerequisite). I ran `npm ci` there, then `npm run typecheck` again: rc=0.
   - `node --check e2e/regression.mjs`: rc=0.
   - I ran `npm ci` in `frontends/shell` and `renderer/bundle-viewer`. Both node_modules are untracked, and porcelain stayed clean.
6. Each pattern had its positive self-test at B and zero at H:
   - `429-430` in regression.mjs: B=1, H=0.
   - `PROPOSED ADR-016` in the Rust test: B=1, H=0.
   - `carries no attributes` in buildLayers.ts: B=1, H=0.
   - `testing-library` in crsAssertionState.ts: B=1, H=0.
   - The two literals are equal byte for byte (94 bytes), and the same extraction finds both at B.
   - Script rc=0.
7. Hunks = 7, and the changed files are exactly the four. Every changed line in P3 (6) and P4 (9) begins with ` *`. P1 lines 191-192 are byte-identical. P2 line 1830 differs only inside the parenthesis (masked equal, raw differs).
- E1: items 1 to 7 hold.
- E2: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` all exit 0 at H. The tools' commit is 49a7f532777a04aaca3b37e1034fdcd1771dabd0, the last commit touching `scripts/plan`, an ancestor of B. I did not run them in a done commit, since that is not mine.
- E3: `queue.mjs --check` and `site.mjs --check` exit 0, both current.
- E4: `node --test` of the three scripts suites, rc=0, 527 tests, 527 pass, 0 fail.
- E6: numstat is 5, 14, 6 and 9 for P1 to P4. That meets the prediction and the §7 ceilings (6, 15, 8, 10), and the total of 34 is within 39. §7 counts per file: session_identity.rs 5, regression.mjs 14, crsAssertionState.ts 6, buildLayers.ts 9.

**Differences from the form or brief.**
- The scratch folder was the session scratchpad. A write under `C:/dev/wt/samc-scratch` was refused, so all `samc-` files are in the scratchpad.
- To get the B lists I temporarily checked out the four files at B into the worktree, then restored them from HEAD. This is not in the commit.
- Each long command ran as `bash <script>` inside the hold.
- The hold's `<M>` was written as `~/Development/Claude/machine/machine.ps1`.
- No mutation was run. I did not use "observed a mutation" for any record.

**Process check.** No process I started is running. A process query for command lines naming the worktree or the target dir found only the query's own shells.

**Final state.** `git status --porcelain` is empty and HEAD is b24e5281aef6da8b744de3ca840e9ffc10503cb6, pushed. I took no PR action, ran no gate, and ran no `claude` command.

**Hold lines (SpatialIDE only).** Five holds were each granted and released:
- npm ci in frontends/shell
- cargo test --list and vitest list at B
- cargo test, list, fmt, vitest and typecheck at H
- npm ci in bundle-viewer, then shell typecheck
- node --test of the scripts suites

Each printed "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF" and then "MACHINE_RELEASED project=SpatialIDE … (cores 0-7)".

**Model.** Sonnet 5.5, claude-sonnet-5-5 as the harness reports it. No override, and no context handoff received or produced.

Scratch outputs are under `<the session scratch folder>/samc-*`.
