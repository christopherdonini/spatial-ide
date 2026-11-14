*Custodian's filing note (2026-11-12): the D1 words worker's report for PR #309 (filler entry 3), from its hand-back (sha256 5965dd62f99529d533c36db137b31b388d3ab5cd0330076f32cd2b2952900806, 2792 bytes), byte for byte, one final newline added. Its brief by file (7291 bytes, sha256 4970d54982ed99bfa3e8bb8b41d9cc91c2ac5c52eaa72215fb49cf30c0cd7354). Its transcript holds 18 unique calls (Read 2, Bash 12, Write 2, Edit 1, the hand-back 1); model claude-sonnet-5-5; run 12:03:37Z to 12:15:14Z; three hold-shaped calls (`cargo fmt --all -- --check`, T1's run, `verify-quotes`), each held shared and released, none with a result marked as an error. The harness moved the `verify-quotes` hold call and the worker's first wait loop to the background; its wait loops each slept at least a second per turn under a hard timeout. Its brief gave hold calls a 3600 s timeout, above the Bash tool's 600 s maximum, the custodian's brief error. Checked by the custodian's script at origin: the branch at dd90df9674b0928bb782b4101f3ea1377e10a784, one commit on 588312e4; only `kernel/tests/source_watch_ordering.rs` changed, 2 added and 2 removed, the old head's file with the old words (99 bytes, sha256 094593e2dc79bcfb24c5304305ac2129f6ceeafd907da960f188be99e0c075f1) replaced by the words file (167 bytes, sha256 d244e57e77f8cc8412e2a2cbe4d1f5aba1d65aa6a83426fb63d9c5d48cf52b41) and no other byte; against the base a06a70dc, 115 lines over the six Scope files, as before, against the declared 120; the message the briefed subject and trailers with one sign-off. The reviewer's D1 words (gate-log 729, `state/consults/gates/2026-11-12-pre-admission-change-detail-braces-gate-reviewer.md`), two lines in place of lines 328 and 329, applied with no re-gate (Part 1, item 2).*

---

Words applied: PR #309 at dd90df9674b0928bb782b4101f3ea1377e10a784

Pre-checks: brief sha256 4970d549...cd7354 matched. HEAD was 588312e4dcf2f04f9ab0f0d05b5a03497825eca4, branch cut/pre-admission-change-detail-braces, porcelain empty. Old file 99 bytes sha 094593e2...075f1, new file 167 bytes sha d244e57e...52b41, both matched.

1. Script padb-w-replace.mjs (replace mode) exit 0: "occurrences 1", "old at lines 328 - 329", "replaced".
2. Same script (verify mode) exit 0: "head lines 682 now lines 682", "equals head with lines 328-329 replaced: true", "line327 equal: true".
3. Exit 0 each.
   - `git diff --numstat` gave `2	2	kernel/tests/source_watch_ordering.rs` only.
   - The numstat against a06a70dc for that file gave `13	0`.
   - The numstat against a06a70dc over six files totals 115.
   - New line 1: 72 cols, no CR, no tab, only U+2014. New line 2: 91 cols, no CR, no tab, ASCII only.
   - The file ends with one newline.
4. Each in its own shared hold.
   - `cargo fmt --all -- --check` exit 0.
   - The cargo test exit 0: "test a_signal_between_arming_and_admission_refuses_the_open ... ok" and "test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 15 filtered out".
5. `git commit -s -F` exit 0: [cut/pre-admission-change-detail-braces dd90df96], 1 file changed, 2 insertions(+), 2 deletions(-). Subject and trailers as the brief gave.
6. Each exit 0.
   - verify-mutation (self-check only): "verify:mutation PASS — all 1 new test(s) have a recorded mutation naming them."
   - verify-cites: "verify:cites PASS — every rooted (in-tree) path:line reference across 2891 file(s) resolves. (189 loose reference(s) advised above.)"
   - verify-quotes (in a shared hold): "verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors."
   - verify-test-claims: "verify:test-claims PASS — all 793 claimed test(s) across 256 file(s) exist or are planned, superseded or withdrawn (25 planned, 14 superseded, 17 withdrawn, advisory)."
   - verify.mjs --offline: "verify:plan PASS".
7. Push, in its own call: 588312e4..dd90df96. The next call showed HEAD and origin/cut/pre-admission-change-detail-braces both dd90df9674b0928bb782b4101f3ea1377e10a784, porcelain empty.

Hold lines (my project only, `also=` elided):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF
- MACHINE_RELEASED project=SpatialIDE affinity=FF (cores 0-7)
- Three hold/release pairs: fmt, test, verify-quotes.

Background shells left: none. The verify-quotes hold and a wait loop were moved to the background by the harness; both completed with exit 0.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
