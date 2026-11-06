*Custodian's filing note (2026-11-06): gate 1's words for PR #285 (`publish-filter-sentence-under-whole-dataset`, U12), the architect's D-1, D-2 and D-3 and the reviewer's D-2, applied by a worker on `cut/publish-filter-sentence-under-whole-dataset` at 3f5b0ff2, head 6628e071, from the brief by path and sha256 (e444888e), whose ten words files the custodian's script built from the head's bytes and the gate reports' words, the reviewer's sentence wrapped into two doc lines, whitespace only; Part 1 item 2 of the human's rulings of 2026-11-05, no re-gate. The custodian's check by git: one commit over the four files, each file's sha256 on disk equal to the one the custodian computed in advance, numstat 1/1, 2/2, 1/1 and 2/1. Unique calls 17, equal to the notification's; run 07:18:57Z to 07:30:14Z by its transcript. Extracted by script from its SubagentHandback call, unchanged. PR #285's checks all pass at 6628e071 (14). A report, not Authority.*

---

Built: publish-filter-sentence-under-whole-dataset words at 6628e0714b7ae6a78ca733893269d6d2709b8bb8

- Start state: HEAD and origin/cut/publish-filter-sentence-under-whole-dataset were both 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831, and the porcelain was empty.
- Ten words files: every sha256 matched the brief, and the byte counts matched too. This was checked by `sha256sum` and `wc -c` before any edit.
- Script: `<S>/pfs-w-apply.mjs`, exit 0. Each of the 5 old texts was found exactly once, and the script found no CR in any of the four files.
- Hashes on disk: all four match the brief.
  - MANUAL-WALKTHROUGH.md: 8d8bcfb4...d56d
  - e2e/README.md: bcd23be5...8f02
  - publish.rs: f6e8b57e...3076
  - KNOWN-LIMITATIONS.md: e8620a41...3c48
- numstat: matches exactly: 2/2 MANUAL-WALKTHROUGH.md, 1/1 e2e/README.md, 2/1 publish.rs, 1/1 KNOWN-LIMITATIONS.md. No other file changed.
- CR count in the four files: 0 each.
- `cargo fmt --check`: exit 0.
- `npm run verify` (shared hold): exit 0.
  - vitest: `Test Files  109 passed (109)`, `Tests  1446 passed (1446)`.
  - Node suites, last line of each:
    - residency-trace: `== 76 passed, 0 failed ==`
    - citation-integrity: `== 30 passed, 0 failed ==`
    - export-elapsed and s5d-verdict: `ℹ duration_ms ...`, as the node test runner prints it. Each shows `ℹ pass 5`/`ℹ fail 0` and `ℹ pass 7`/`ℹ fail 0` above that.
- `cargo test --lib` (second shared hold, jobs 8, threads 8, target D:/wt-targets/pfs): exit 0, `test result: ok. 72 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 7.99s`.
- Commit: 6628e071, `docs: publish-filter-sentence-under-whole-dataset, gate 1's words (the architect's D-1, D-2 and D-3, the reviewer's D-2)`.
  - 4 files changed, 6 insertions, 5 deletions.
  - It was signed with `-s`. The message file had no `@` outside the Co-Authored-By trailer line.
- Verify scripts at the new head (all exit 0; `verify-quotes` and `verify-test-claims` ran in a backgrounded shell and their rc is from its output):
  - `verify.mjs --offline`: `verify:plan PASS — ... agrees with the repository.`
  - `verify-cites`: PASS, 2676 files, 162 loose references advised.
  - `verify-quotes`: PASS, 138 checked, 107 verified, 30 baselined, 0 errors.
  - `verify-test-claims`: PASS, 738 claimed tests across 235 files.
- Hold lines (the `also=` field is elided):
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:55816`
  - `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:55368`
  - Both were released.
- Push: exit 0. After it, HEAD and origin/cut/publish-filter-sentence-under-whole-dataset were both 6628e0714b7ae6a78ca733893269d6d2709b8bb8, and the porcelain was empty. I did not wait for CI.
- Background shells: the two verify-script shells (bgnc70wnl and bp4buu0gu) both completed on their own. None is left running, and I killed nothing.
- Model: Sonnet 5.5 (claude-sonnet-5-5).
