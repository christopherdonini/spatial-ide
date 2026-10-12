*Custodian's filing note (2026-10-10): crs-undeclared-message-wording worker report 1, the worker-high run 23:23:07Z to 23:57:05Z by its transcript, on cut/crs-undeclared-message-wording, C1 185dc9b3, head fb95bec09e194016c44340414ad23109ae372bb0, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is caf3a3c2c96456f38f6d627a89a06e0f75c7a71011369ac4a1a9b127ba6e66a4. The OPEN-1 comment count is the form's Amendment 2 (class 8).*

---

REPORT: crs-undeclared-message-wording (slot 2) — built under its form; every run came out as predicted

Result: the piece is built and published, and nothing fired a stop. T-1 passes at H and fails under M-1. The four named e2e steps failed by message check at C1 and pass at H. All five suites pass. The tree is clean.

COMMITS (branch cut/crs-undeclared-message-wording; signed off; Co-Authored-By trailer on each)
- C1 = 185dc9b3. It changes the five places other than error.rs: the two e2e constants, formatRefusal.test.ts, v0-error-example.json line 3, and walkthrough row B2.
- H = fb95bec0. In engine/src/error.rs it changes the Display arm's second sentence, OPEN-1 (A)'s doc comment, and adds T-1 (OPEN-2 (A)).
- Both are pushed. origin/cut/crs-undeclared-message-wording is fb95bec0.
- B = `git merge-base origin/main H` = 496fdd7f.

THE NEW TEXT AND HOW IT WAS COPIED
- Method: wording.mjs in the scratchpad's crs/ folder reads line 33 of the directive file, strips the three leading spaces, and splits at "({detail}). ". It fills {detail} as each place does and edits the files by exact-once replacement. Nothing was typed.
- Line 33 has no trailing whitespace. Its sha256 matches the form's pin (6fab951e5e8386de3008ac3f5640185edb64fc7632e23482f0b0567602148964).
- The new second sentence is byte-copied by script from the directive file's line 33. Its sha256 is 29ce7a6e0600e6a895b81913a01061163606b57a871c3b3fdb72b0d919e1d0c6. It is identical in every place:
  "GeoParquet's OGC:CRS84 default is applied only when the crs key is absent in a file of version 1.0.0 or 1.1.0; otherwise assert a CRS to open the file (docs/05, no silent conversion)"
- Verification: check-places.mjs and check-t1.mjs in the scratchpad re-evaluate each place and compare it to line 33 with its own detail filled. All seven match:
  - regression.mjs constant: 308 bytes
  - admission-remediation.mjs constant: 308 bytes
  - formatRefusal.test.ts crsUndeclared().message: 268 bytes (detail "no `crs` key")
  - v0-error-example.json message: 308 bytes
  - MANUAL-WALKTHROUGH.md row B2: 308 bytes
  - error.rs Display arm, continuations folded: 308 bytes
  - T-1 expected string: 308 bytes
- The first clause is untouched. The e2e constants and the two Rust strings were split into several literals. The check evaluates the joined text, not the source lines.

T-1 AND M-1
- T-1 is `the_crs_undeclared_message_is_the_human_wording_byte_for_byte`, in a new `#[cfg(test)] mod tests` at the end of error.rs. It calls `crate::crs::admit(None, None, None).unwrap_err()` and asserts `to_string()` equals the full message. Its doc names the directive's path and item 5, with no path:line.
- At H, `cargo test -p spatial-engine --lib` shows `error::tests::the_crs_undeclared_message_is_the_human_wording_byte_for_byte ... ok`.
- M-1 was observed at fb95bec0. I replaced the three new Display-arm lines with the old line, taken by script from `git show 185dc9b3:engine/src/error.rs`, line 285. I ran `cargo test -p spatial-engine --lib the_crs_undeclared_message`. It gave `FAILED` for that test name, panicking at engine\src\error.rs:453:9 on "assertion `left == right` failed". left held "This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent conversion)" as the second sentence, and right held the new sentence. Result: 0 passed, 1 failed, exit 101.
- I reverted with `git checkout -- engine/src/error.rs`. `git status --porcelain` was then empty.

E2E RUNS
Each run used a fresh app on the exe built at that commit. All were under a shared hold, which was granted every time; no 96-99 code appeared.
- Exes under D:/wt-targets/k6/exes/:
  - spatial-ide-shell-crs-c1.exe, sha256 066018c0e67e01897b078a070fef6453b24cba79c17e0e95dee195201180a13c, built at 185dc9b3.
  - spatial-ide-shell-crs-h.exe, sha256 495d9c51e5fc6d5e2c6eb896e239695e56c8e6d3cd48aeff4afb06945ab40a3e, built at fb95bec0 with a clean tree.
- no-crs-refused.parquet already existed, with an explicit `"crs":null` and version 1.1.0. I did not regenerate it.
- Its sha256 was 5139b97bd43449d69feb23475ce7c12acc5054a0e7474b2d3349e75ca723d6e9 before and after every run.

| Run | Commit | Exit | Result |
|---|---|---|---|
| regression.mjs (M-2) | C1 | 1 | B2'/B3' FAIL: "refusal message mismatch". Expected showed the new sentence, Actual the old. 16 other steps PASS (A1', A3', A4', A5'/A6', A7', A8', A9', K6, K7, CURSOR', FIND', MP', PT', LN', ABSENTCRS', C2'/C3'). |
| admission-remediation.mjs (M-3) | C1 | 1 | ASSERT' FAIL: "refusal message mismatch". NOPERSIST' FAIL: "message mismatch". PASTED' and AXISTRAP' also FAIL; see below. |
| regression.mjs | H | 0 | B2'/B3' PASS. All 17 steps PASS. |
| admission-remediation.mjs | H | 0 | ASSERT' and NOPERSIST' PASS. All 11 steps PASS. |

- Admission at C1, the other steps: NODEF', MAP', DUPKEY', BOTHNEEDED', CONFLICT', CANCELOPEN' and OVERBOUND' PASS.
- PASTED' and AXISTRAP' failed at C1 as consequences of ASSERT' throwing at its message check. ASSERT' sets `ctx.catalogIdentifier` and `ctx.catalogDefinition` after that check. PASTED' read an undefined identifier ("missing field `identifier`"), and AXISTRAP' ran `JSON.parse` on an undefined definition ("\"undefined\" is not valid JSON"). §4 permits this. They are not named steps, and I recorded them and claim nothing for them.
- Run logs are in the scratchpad's crs/out/ folder.

SUITES AT H (fb95bec0), once each, each under a shared hold
- `cargo test -p spatial-engine --lib`: 203 passed, 0 failed, exit 0.
- `cargo test -p spatial-skp --test fixtures`: 24 passed, exit 0.
- `cargo test -p spatial-kernel --lib`: 153 passed, exit 0.
- `npx vitest run src/admission src/skp`: 17 files and 139 tests passed, exit 0.
- `cargo fmt --all --check`: exit 0. I ran it with no hold; it is a light command.
- The cargo suites used CARGO_TARGET_DIR=D:/wt-targets/cov with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. The shell exe builds used D:/wt-targets/k6.

§7 FIGURES (`git diff --numstat B...H`, per file: added/deleted)
| File | Added/deleted | Ceiling |
|---|---|---|
| engine/src/error.rs | 25/4 | 40 |
| regression.mjs | 4/2 | 10 |
| admission-remediation.mjs | 4/2 | 10 |
| formatRefusal.test.ts | 3/1 | 6 |
| v0-error-example.json | 1/1 | 2 |
| MANUAL-WALKTHROUGH.md | 1/1 | 2 |

- error.rs breakdown: Display arm 3 added and 1 deleted (ceiling 6); OPEN-1 comment 4 added and 3 deleted (ceiling 6); T-1 18 added (ceiling 28).
- Totals across the six files: 38 added, 11 deleted, 49 summed (code and tests ceiling 65).
- One ambiguity for the custodian: OPEN-1's comment is 4 added lines, which is within 6, but 7 if added and deleted are summed. Its minimal form is 4 lines because the path line alone is 98 columns and the §12d P6 clause stays. I trimmed nothing and edited no §7. If the sum counts, that is a class 8 overrun for the custodian to record.
- Six non-generated files are touched. The form and PLAN.yaml are not touched by me.

§8 ITEMS
1. Conditions hold. The form is committed and Amendment 1 is in it. PRs #202 (c6627398) and #204 (e17758b7) are both ancestors of HEAD.
2. All seven places match line 33 byte for byte (script outputs above).
3. The first clause, details, fields, codes, variants and raise sites are unchanged. The error.rs diff has no hunk on the first clause.
4. Only the six in-scope files changed. No place §2.1 marks out, and nothing in §5's unchanged list, was edited.
5. Only v0-error-example.json line 3's message value changed. The SKP literal and SKP-V0.md are untouched.
6. No different words and no paraphrase. Every wording byte came from line 33 by script.
7. No guidance string was added.
8. No path:line cite in any code comment. The two comments cite the directive path and "item 5" only.
9. No pub item, dependency, OS cfg, ignore, sleep, retry or timeout. The only cfg is `#[cfg(test)]` on the new test module.
10. There is no PR body, since I opened no PR. The string in this report is byte-copied by script and marked so.
11. Round 25: no §7 edit. No verify-mutation run is called an observation; M-1 was applied, run, recorded with commit fb95bec0, and reverted. No scope addition and no test-text span is pinned at a branch commit. The only open point is the OPEN-1 count ambiguity above.

Falsification: it did not fire. `git diff --quiet 142af722 B` exits 0 for geoparquet.rs, dataset.rs, crs.rs, kernel/src/skp.rs, error.rs, formatRefusal.test.ts and v0-error-example.json. So every 0.2 fact holds at B.

Invalidators: none fired. At C1 the only named-step failures were the message checks. At H no message check failed.

WHAT DIFFERED FROM THE FORM OR BRIEF
- The worktree branch started at 496fdd7f, the parent of 4fd3259a. 4fd3259a changes only PLAN.yaml, the CUSTODIAN-QUEUE files and the site files. B is therefore 496fdd7f. I did not rebase or merge.
- Environment setup was needed for the shell exe build, all git-ignored: `npm ci` in frontends/shell and renderer/bundle-viewer, `npm run build` in renderer/bundle-viewer for dist, and `npm run generate:notice`, which wrote a provisional NOTICE.txt. The e2e uses the vite dev server, so this does not affect it.
- Aborted C1 launch. I first started the C1 regression run before noticing the exe copy had been named crs-h.exe (EXETAG was not exported to the build script). I stopped it with app-down while the app was still waiting to mount, so no step ran. I then renamed the file to crs-c1.exe; its sha256 matches the build output. The recorded C1 regression run was a fresh launch of that exe.
- The hold's command shape changed once so that EXETAG reaches bash. Hold semantics are unchanged.
- The guardian (G1) refused one Bash call that combined a heredoc commit message with `git push`. I split it into a Write-file commit message, a commit, and a separate push.
- The scratchpad's crs/ folder is a copy of the reaim2 recipe with the worktree, exe names and an EXETAG parameter changed. The originals were not edited.

FINAL STATE
- HEAD is fb95bec09e194016c44340414ad23109ae372bb0, published and equal to origin/cut/crs-undeclared-message-wording.
- `git status --porcelain` is empty.
- No app, vite or hold of mine is running. Ports 9223 and 5400 hold only TIME_WAIT leftovers.
- I opened no PR and did not touch engine/README.md, the owner's index, or main.
- Model observed: Sonnet 5.5, no override, no context handoff.
