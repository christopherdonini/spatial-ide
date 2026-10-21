*Custodian's filing note (2026-10-21): the worker-high's report for connection-reuse-recycled-interrupt-flake, built from its full form in C:/dev/wt/crf from main b2df233db725d947c02c001b7d3f0f2db3d9bde6; the head 32c3e807f3f6e36184cb8071c7d4399127ff7f1c, pushed. The run 2026-10-20T23:47:11Z to 2026-10-21T00:51:12Z by its transcript (Bash 52, Edit 14, Read 8, Write 3); its one SubagentHandback call, at 00:51:11Z. Checked against the transcript: each mutation and run has its call and its output file, and the outcomes and panic lines match the report (M1 at the test file's line 185, M2 at line 202, R1 at line 180 in the throwaway worktree at b2df233d; R3's log shows 20 passing runs). The report's head-suite runs (12, 203, and 2 with 1 ignored) were made before the comments-only commit existed, on the working tree that 32c3e807 then committed; 32c3e807 adds 15 comment lines to 03345bfa and nothing else. The one refused call was a sed edit, refused by the harness; the worker made the mutation with the Edit tool instead. The verify scripts ran outside a hold; the brief named the cargo runs, R3 and the CI globs as heavy. Extracted by script; one final newline added; nothing else changed.*

---

Report: node:connection-reuse-recycled-interrupt-flake@g2 — built per the full form §2; pushed, not forced.

**Head and commits** (branch cut/connection-reuse-recycled-interrupt-flake, worktree C:/dev/wt/crf, base b2df233db725d947c02c001b7d3f0f2db3d9bde6)
- 03345bfa4224170aef340025300a45d78693722e — code and test commit (§2.1 to 2.4, W1 to W6).
- 32c3e807f3f6e36184cb8071c7d4399127ff7f1c — HEAD, comments-only commit. It records M1 to M3 and R1 to R3, each with its commit, in the changed test's header comment.
- Both were made with `git commit -s -F` on message files, with the two trailer lines. Push exit code 0 (b2df233d..32c3e807, an ordinary update). HEAD equals origin/cut/connection-reuse-recycled-interrupt-flake.

**Observations** (each applied by hand, the one test run alone by name with `--exact`, then reverted; none is a verify-mutation run)
- M1, at 03345bfa: `lease_for_stream`'s attach statement deleted. FAILED at the binding assertion (connection_reuse.rs:185) with its message. As predicted.
- M2, at 03345bfa: terminal Err arm `let _ = tx.send(Err(e));` replaced by `let _ = e;`. FAILED at the None arm (connection_reuse.rs:202) with the W6 message. As predicted.
- M3, at 03345bfa: producer's pre-prepare cancel check deleted. The test PASSED (exit 0), a survivor as predicted.
- R2, at 03345bfa, with the scratch line after `let f = stream.connection_facts();`: PASSED.
- R3, at 03345bfa, unforced: 20 runs, 20 passed (the run log shows "1 passed; 0 failed" 20 times). A count only.
- R1, at b2df233d, in a throwaway worktree, with the scratch line: FAILED at the live-token assertion (connection_reuse.rs:180) with its message. As predicted.
- The scratch line was never committed or pushed. Each tree was shown clean after its run. The throwaway worktree C:/dev/wt/crf-b and its target dir were removed.

**Suites and checks** (all at the head; all exit 0)
- `cargo test -p spatial-engine --test connection_reuse`: 12 passed (first run was at 03345bfa; re-run at 32c3e807, 12 passed).
- `cargo test -p spatial-engine --lib`: 203 passed.
- `cargo test -p spatial-kernel --test query_window_attribution`: 2 passed, 1 ignored.
- `cargo fmt --all --check`: exit 0.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 509 tests, 509 pass, 0 fail.
- `node scripts/plan/verify.mjs --offline`: PASS.
- verify-cites: PASS (2116 files; 89 loose references advised, none mine).
- verify-quotes: PASS (129 checked). verify-quotes with `--show-cites` over the three changed files: PASS, 0 checked.
- verify-test-claims: PASS (574 claimed tests).
- Every cargo command used CARGO_TARGET_DIR=D:/wt-targets/crf (R1's worktree used D:/wt-targets/crf-b), CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Each heavy command ran in a shared hold.

**§7 figures** (`git diff --numstat B HEAD`, B = merge-base origin/main HEAD = b2df233d, added/deleted)
- engine/src/stream.rs: 14/0, so 14 (ceiling 20), outside `mod tests` only.
- engine/src/dataset.rs: 9/3, so 12 (ceiling 14), comment lines only.
- engine/tests/connection_reuse.rs: 35/16, so 51 (ceiling 60).
- engine/README.md: 0 (ceiling 6). I left the owner's-index lines for lead-data.
- Total 77 changed lines (58 added, 19 deleted), ceiling 100. Non-generated files touched: 3 of the 4 named, plus the form, which I did not edit.

**Comments changed**
- engine/src/stream.rs: the new member's doc (W2).
- engine/src/dataset.rs: `lease_for_stream`'s doc, the clause after the bolded phrase (W1). I re-wrapped the two lines after it to keep them under 100 columns, with the same words.
- engine/tests/connection_reuse.rs: `matches_nothing`'s doc after the first paragraph (W4), the test's header comment (W3), the structural comment (W5), the None arm's message (W6), and the recorded M1 to M3 / R1 to R3 block (about 15 lines, no path:line cites).

**Differences from the form**
- The form does not say where the comments-only commit records the observations. I put them in the changed test's header comment, following the repo's earlier RECORDED MUTATION precedent in commit 1251fc3c.
- I wrote the observations as outcomes only, with no claim about CI's path or about which producer check stops the stream (§1).
- The cold builds in the two fresh target dirs (the first test run and R1) ran as background commands inside the hold, because a cold build may exceed the 600 s foreground cap. Every other heavy command ran in the foreground. Each cold build finished in well under 20 minutes.
- A `sed -i` mutation was denied once by the auto-mode classifier. I applied M1 to M3 with the Edit tool instead and reverted each with `git checkout -- <file>`.
- No shared-run timing failure occurred, and no hold was refused (no exit 96 to 99).

**Pre-gate self-check**
- Cross-module: the only seam is the engine-to-kernel compile. The kernel's three reads of ConnectionFacts (kernel/src/lib.rs:662-669) compile and pass `query_window_attribution`. No kernel file was edited.
- Completion claims: each rests on a run listed above.
- Messages: the W6 message describes behaviour implemented here (M2 shows it fires).
- Required tests: the changed test reaches its binding assertion and its terminal assertions (M1 and M2 fail at those lines).
- Caller rule: the new member has no product caller. It rests on the instrument-accessor exemption, and its doc carries W2's three declarations. The test file is its only reader.
- I wrote no verbatim quotes or hash references.

**Model:** claude-sonnet-5-5 (Sonnet 5.5). No override. No context handoff received or produced.

**Final porcelain** in C:/dev/wt/crf: empty (clean).
