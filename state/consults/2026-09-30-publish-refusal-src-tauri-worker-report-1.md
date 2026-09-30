# Consult — node 3's second piece, the worker's report (publish-refusal-codes-and-attempt-lifecycle, A4-1 and A4-3, g1)

*Custodian's filing note: the worker's hand-back for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the second piece (the A4-1 and A4-3 src-tauri lines, `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md`, the branch's first commit 4a2bb00), delivered as a message on 2026-09-30 (enqueued 19:30:02Z). Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at a633b02 on 855d826, cc9c9a1 and 55ce85e from 4a2bb00, each with one sign-off; `git diff --numstat 4a2bb00...HEAD` totals 120 over the two files the form names; the product hunks in `publish.rs` are the two arms the form's §2 names (each calling `refusal_detail`), their comments, and the module doc at three lines, with no string literal outside comments; Product CI (shell) succeeded on a633b02 and failed on 55ce85e (the P0 commit). Governance CI ran on the branch only at 4a2bb00 (the known failure: T1 and T2 did not exist yet); later pushes did not touch a path its filter watches. The report's line numbers are unpinned working pointers at the branch commits it names.*

---

node:publish-refusal-codes-and-attempt-lifecycle@g1 (second piece, A4-1 and A4-3 src-tauri). Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

BUILT, branch cut/publish-refusal-src-tauri, head a633b02, pushed. The commits after 4a2bb00 are:
- 55ce85e (commit B): T1 and T2, failing at base.
- cc9c9a1 (commit C): the two product arms and the module-doc correction.
- 855d826 (commit D): T3 and T4.
- a633b02: rustfmt of only the lines T1/T2 add. The rustfmt hunk count for publish.rs is 62 at 4a2bb00 and 62 at head, so the pre-existing 62 hunks are left untouched.
- Step 1: the three sites at 4a2bb00 match the form, with no deviation.

P0 (B, 55ce85e), T1 and T2 each failed by name on the assertion the form predicts:
- T1, `assertion left == right failed`: left `cancelled: no bundle exists under the destination name and the staging directory has been removed`, right `publish.cancelled: cancelled: no bundle exists ...`.
- T2, `no publish.engine prefix: source: open for hashing: The system cannot find the file specified. (os error 2)`.
- F2's `remove_file` succeeded, and T2 did not pass at B, so the form's invalid-run condition did not fire.

T3 and T4 input strings (byte-captured at C by a temporary eprintln, reverted, with `git diff --stat` showing only the C change after the revert):
- T1's string is `publish.cancelled: cancelled: no bundle exists under the destination name and the staging directory has been removed`.
- T2's string is `publish.engine: source: open for hashing: The system cannot find the file specified. (os error 2)`.
- T4's string is a Windows capture at cc9c9a1, and its test comment says so.
- T3 and T4 are in separate commit D. They pass at C and at head. The TS product code is unchanged, so they would pass at base too, which I did not run separately.

MUTATIONS (applied, test run, failure recorded, reverted; porcelain empty after each) at a633b02. None was a verify-mutation run.
- M1: deleted the `BoundaryError::Publish` arm. T1 failed at the equality assert (src\publish.rs:2246), left without the prefix.
- M2: restored `e.to_string()` at the pin-phase line. T2 failed with `no publish.engine prefix: source: open for hashing...` (src\publish.rs:2301).
- M3: replaced the dialog-settled refused arm's `formatPublishRefusal` call with a fixed `publish-refused`. T3 failed: `expected 'publish-refused' to be 'publish.cancelled'`.
- M4: the same bypass in the prepare-refused arm. T4 failed: `expected 'publish-refused' to be 'publish.engine'`.

CHECKS (exit codes read directly):
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` gave rc=0. Lib: 59 passed, 0 failed, including the 10 §5 declared-unchanged tests. `tests/sole_caller_scan.rs`: 2 passed.
- `cargo clippy ... --tests` gave rc=0 with 3 warnings and none new. The two commands.rs "too many arguments" warnings and the publish.rs:303 "large size difference between variants" on the `PrepareOutcome` enum all sit on code I did not touch.
- `npm run verify` in frontends/shell: rc=0, vitest 72 files and 1094 tests passed, citationIntegrity 30 passed.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` from C:/dev/spatial-ide: rc=0. I did not read a pass/fail summary line.

§8 (block-on-sight):
- Item 1: `git diff --stat 4a2bb00...HEAD` shows 2 files, `frontends/shell/src-tauri/src/publish.rs` (86 lines) and `frontends/shell/src/publish/PublishPanel.test.ts` (34 lines), 117 insertions and 3 deletions.
- Items 2, 4 and 5: grepping the added lines of the src-tauri diff for `pub `, `cfg` and `ignore` found nothing. The only `#[` hits are the two `#[test]` attributes.
- Item 2: the only added `"publish.` string literals are in the `mod tests` hunk (from line 2232). Product code composes no prefix and calls `refusal_detail` only.
- Item 7: no cfg, platform ignore or OS-keyed logic added.
- Item 4: no change to the outcome enums, the `OutcomeNotAudited` or `Cancelled` arms, or `ensure_pinned`.
- Comments: 2 lines at the execute arm, 1 line at the pin arm, and the module doc grew from 2 to 3 lines.

BUDGET (§7): `git diff --numstat 4a2bb00...HEAD -- frontends/shell/src-tauri/src frontends/shell/src` gives publish.rs 83+/3-, PublishPanel.test.ts 34+/0-. The total is 120 lines against the 170-line limit, in 2 files against the 2-file limit. No overrun.

CI on the branch:
- Product CI — shell a633b02: success.
- Product CI — shell 55ce85e (B): failure, the expected P0.
- Product CI — shell 4a2bb00: success.
- Governance CI — plan, queue, site: a run exists only for 4a2bb00 (failure, known). No Governance run appeared for 55ce85e or a633b02, possibly path-filtered. I did not investigate.

PRE-GATE SELF-CHECK (the four classes):
1. Cross-module: I read `PublishError::refusal_detail` (kernel/src/publish/error.rs:216), `From<EngineError> for PublishError` (error.rs:368), `BoundaryError::Publish`, and `PublishError` exported from `spatial_kernel::publish` (mod.rs:81). T3 and T4 feed the real strings into the real `nextStateFrom*` consumers.
2. Completion claims: each claim above points to a named test, log line or commit.
3. User-facing messages: no Display string changed. Only the code prefix, which `refusal_detail` already produces, is added at two arms. The panel label change is the one round 32 G1 accepted.
4. Every required test reaches its assertion: T1 and T2 failed at the assertion at B, and passed at C. T3 and T4 failed at their code assertions under M3 and M4.

OFF-SCOPE NOTICED, NOT DONE:
- The worktree needed build scaffolding that is gitignored and untracked: `npm ci` plus `node build.mjs` in renderer/bundle-viewer, and `npm ci` plus `npm run generate:notice` in frontends/shell. Without the two built outputs, the src-tauri build script fails.
- Full-machine clippy took 19 minutes because the kernel suite was building concurrently. I never had to re-run an existing test for timing.

STATE: `git status --porcelain` is empty, head a633b02 is pushed, and no PR is opened. I wrote nothing under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/, and did not edit the form or MANUAL-WALKTHROUGH.md. Nothing was touched under kernel/, protocol/ or engine/.
