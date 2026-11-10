*Custodian's filing note (2026-11-06): the e2e continuation's report for `publish-filter-sentence-under-whole-dataset` (U12, slot 2; the five-line form `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`), run under the harness approval of 2026-10-11, item 1, extracted by script from its SubagentHandback call, unchanged. Unique calls 41, equal to the notification's; run 2026-11-06T05:37:52Z to 2026-11-06T06:09:41Z by its transcript. The e2e log's first line, step lines and rc line, the branch head on origin and the five CI runs on it were read against the report's. A report, not Authority.*

---

Built: publish-filter-sentence-under-whole-dataset at 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831

Brief sha256 matched e6d59d5c...10d2 (13882 bytes). The first worker's report was read from the main checkout (it is not on the branch). Part 1 of the gate-round rulings and both directives were read.

**Start state.**
- Checkout C:/dev/wt/pfs: HEAD and origin's branch both 1af71af05b52a8c74e3d2f544a5a7362fb8fd461, porcelain empty.
- .cargo/config.toml sha256 6889110645ec...e35f and the form sha256 73138cc1...5a3b, both as the brief gives.

**Merge.**
- Commit 3f5b0ff2, `--no-ff --signoff -F` the message file, no conflict.
- HEAD^1 is 1af71af05b52a8c74e3d2f544a5a7362fb8fd461 and HEAD^2 is 0c84b816416bc1611649cf91415d9fc69f3693a6.
- The message file had one `@`, in the first trailer line.
- `git diff --name-only 0c84b816...HEAD` names exactly the eight Scope files: KNOWN-LIMITATIONS.md, MANUAL-WALKTHROUGH.md, e2e/README.md, e2e/publish.mjs, publish.rs, PublishPanel.test.ts, PublishPanel.tsx, types.ts.
- The two diffs (2c72923e..1af71af0 and 0c84b816..HEAD, over the eight files, `index ` and `@@` lines dropped) are each 375 lines. `cmp` returned 0.

**Fixture and verify-bundle.**
- `generate_the_filter_fixture`: rc=0, `test result: ok. 1 passed; 0 failed`. filter-zoned.parquet is 409872 bytes, porcelain still empty.
- `cargo build -p spatial-kernel --example verify-bundle --locked`: rc=0.

**Exe build.** rc=0. Its last lines: `Finished dev profile [unoptimized + debuginfo] target(s) in 5m 33s`, then `copied exe`. The exe is spatial-ide-shell-pfs.exe, 90871808 bytes, mtime 2026-11-06 06:46:45 +0100.

**The e2e, once, unmutated, at 3f5b0ff2.** rc=0. First log line: `worktree C:/dev/wt/pfs head 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831 start 2026-11-06T05:46:57Z`.
- OPEN PASS (655ms).
- APPROVED' PASS (2896ms): bundle verified (2000 rows, 1 partitions), 2 audit lines.
- REFUSED' PASS (71ms): wrong phrase refused, no bundle directory, no `.staging-*` debris, audit pair intent+outcome refused.
- EXPIRED' SKIP: no TTL-shortening knob exists for PENDING_ATTEMPT_TTL (600s); the property is unit-tested instead.
- FILTERED' PASS (2297ms): `filter_scope null under whole-file with the filter on; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000)`.
- Last two log lines: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` and `rc=0 end 2026-11-06T05:47:18Z`.
- App-down output: `killed tree 55656`, `killed tree 6828`, `port 9223 free`, `port 5400 free`.
- app.err.log has 2 lines in total, so first and last 20 are the same: `[spatial-ide-shell] session log: ...session-1793944024.log` and `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`.
- Reports copied to `<H>/out/`: tauri.e2e.conf.json, verify-approved-1793944034700.json and verify-filtered-1793944037601.json, each as `pfs-e2e-publish1.rep.<name>`.
- Afterwards no vite or spatial-ide-shell process was running (a CIM command-line check), and the checkout's porcelain was empty.

**Harness disclosure.**
- The run used the port-5400 harness under the human's approval of 2026-10-11, item 1, applied to U12 by the directive of 2026-11-06, item 1.
- Overlay: a debug exe built with a TAURI_CONFIG overlay adding CDP on 9223 and mapping localhost:5180 to 127.0.0.1:5400.
- Vite on 127.0.0.1:5400 with --strictPort. The npx shim was first on PATH for that run only.
- No tracked file changed for it and nothing was committed for it.
- It wrote only to `<H>/out/` (I created that folder with mkdir), D:/wt-targets/pfs (target and exes), the checkout's gitignored `target/` and `frontends/shell/e2e/out/`, and the app's own per-user folders.

**CI on 3f5b0ff2.** All five completed with success:
- 42170523331 Product CI — Rust workspace
- 42170523309 Ported notices
- 42170523265 Rust fmt
- 42170523325 Governance CI — plan, queue, site
- 42170523359 Product CI — shell

I pushed with rc=0. Origin's branch equals HEAD.

**Checks at 3f5b0ff2.**
- Shell crate `cargo test --locked`: rc=0. Results: `72 passed; 0 failed`, `2 passed; 0 failed`, and two empty suites.
- `npm run verify` in frontends/shell: rc=0. `Test Files 109 passed (109)`, `Tests 1446 passed (1446)`.
- `cargo fmt --all -- --check`: rc=0.
- Shell crate fmt check: rc=0.
- `verify.mjs --offline`: rc=0, `verify:plan PASS`.
- `verify-cites.mjs`: rc=0, `PASS ... 2676 file(s) resolves. (162 loose reference(s) advised above.)`.
- `verify-quotes.mjs`: rc=0, `PASS — 138 checked, 107 verified, 30 baselined, 1 advisory ... 0 ruling-cite errors`.
- `verify-test-claims.mjs`: rc=0, `PASS — all 738 claimed test(s) across 235 file(s)`.

**Size.** The `numstat` over the eight Scope files is 129 insertions and 71 deletions, 200 lines against the declared 150. This is an overrun, class 6, reported and not trimmed. publish.rs is 84/39 of it.

**Stop rules.** None met. There was no exit 90, no hold refusal and no second suite run. No tracked file changed apart from the merge commit.

**Hold lines.** All were shared holds, project SpatialIDE, cores 0-7, affinity FF, each followed by `MACHINE_RELEASED`. Six cargo holds, one `npm run verify` hold, and one each for the exe build and the e2e. Their what-texts all start `pfs:`. No exit code 96 to 99.

**Background shells.** None of mine are left running; every hold-wrapped command and wait loop I started completed. Other node and bash processes on the machine are not mine.

**Final state.** HEAD is 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831 and origin's branch is the same. `git status --porcelain` is empty. No PR action taken.

**Model.** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it, no override, no context handoff.

**Off-scope, not done.** No fix was owed. The two M-1/M-3-style mutations from the first worker's report were not re-observed, as the brief did not ask for it.
