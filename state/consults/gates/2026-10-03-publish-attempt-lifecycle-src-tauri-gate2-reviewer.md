*Custodian's filing note (2026-10-03): the gate-2 reviewer for PR #165 wrote this report to this path itself, under the 2026-10-03 trial directive (part 1, reports to files), and returned its verdict, its two blocking findings, the path and the sha256. It is committed as written, below the rule. The sha256 of the text below the rule (from the line after the rule's following blank line to the end), 2ef2f0012472aca22b6fcfbef07fbf25051639ce9843a4a2c796f45052ebf7a6, was checked equal to the hand-back before this note was added.*

---

VERDICT: FAIL
Reviewed cut/publish-attempt-lifecycle-src-tauri @ bfd68af79dd126684d99e337bf8a6c352937f194. PR #165, gate 2, reviewer.

Scope: correction round 1 only, the four commits b125721, d0184eb, 0391787 and bfd68af over 4d92733. Everything said below about a cited span is paraphrase unless it is marked as quoted. Nothing is pinned by hash at a branch commit; spans on the branch are named by file and section, function or amendment item at bfd68af.

## S1 (blocking)

1. **Amendment 1's superseded index (item 7) is not accurate for `frontends/shell/MANUAL-WALKTHROUGH.md`.** A correction round must end with a superseded index (round 12, item (e)), and the custodian's check 4 asks for an accurate one.
   - The index names the "Before R1" notes and the last sentences of row R1's step cell as superseded at b125721 (paraphrase).
   - Row R1's step cell (column 2) is unchanged between 4d92733 and bfd68af: I split the row on its cell separators and hashed each cell, and the step cell's bytes are identical at both commits (648 characters). The sentence b125721 changed, the "repeat with a larger viewport" advice, sits in the Expected outcome cell (column 3), as its next-to-last sentence. The cell's last sentence, that row G9 is unchanged, did not change.
   - The "Before R1" notes are not superseded either. b125721 only inserts one bullet (the `publish-bundle.exe` build note). No existing line there changed.
   - Worker report 2 also calls it the step cell, and the amendment appears to have inherited that.
   - Fix: append a correction of at most three sentences (round 12, item (d)). The superseded span is the next-to-last sentence of R1's Expected outcome cell. The "Before R1" notes gained a bullet and lost nothing.

2. **Amendment 1 item 4's Reason does not reconcile with its own Declared and Final figures.** A class 8 amendment records the declared figure, the final figure and the reason (`docs/PREREGISTRATION-TEMPLATE.md` class 8, round 25, item 2 (a)).
   - The Reason bullet says, in paraphrase, that the round adds 55 lines over 4 files to the 694 that gate 1 counted. But 694 + 55 is 749, not the 715 the Final bullet records, and 715 is correct.
   - What happened: by §7's command, the count rose by 21, from 694 at 4d92733 to 715. Insertions went from 657 to 675, and deletions from 37 to 40.
   - The round's own diff over the four files is 55 lines (35 insertions and 20 deletions), but 17 of the 20 lines it deletes are lines the piece itself had added. Those cancel out of the count against base ff57832.
   - So the bullet's sum cannot be resolved against §7's command.
   - Fix: in the same appended correction, state the Reason as the figure the command gives: +21 over 4d92733, by the same command, at 0391787.

## Checklist results

**1. The diff**
- `git log 4d92733..bfd68af` shows exactly b125721, d0184eb, 0391787 and bfd68af, and each is signed off.
- `git diff --stat 4d92733..bfd68af` touches 5 files: `KNOWN-LIMITATIONS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `frontends/shell/src-tauri/src/commands.rs`, `frontends/shell/src-tauri/src/publish.rs` and the form.
  - That is four of §7's five files, plus the form's §10 (§8 item 1's exemption).
  - `lib.rs` is untouched.
- Per commit:
  - b125721 touches the four files and no others.
  - d0184eb touches only `publish.rs` (T4).
  - 0391787 touches only `publish.rs`, two comment lines.
  - bfd68af touches only the form.
- **b125721 is comments and docs only.** For `publish.rs` and `commands.rs`, I stripped the full-line `//`, `///` and `//!` comments and the trailing `//` comments at 4d92733 and at b125721, dropped the blank lines, and diffed what was left. `diff` gave rc 0 for both files, so no code changed.
- **§8 items 3 and 10.** I grepped every changed `.rs` line in 4d92733..bfd68af for `cfg`, string literals, `log::`, `tracing`, `println`, `eprintln` and `Display`.
  - The only hit is the old M4 comment line that 0391787 removes.
  - No UI string, Display, log line or `cfg` was added or changed.

**2. The gate-1 findings Amendment 1 item 2 claims, read against the code at bfd68af**
- **KNOWN-LIMITATIONS 30**, both S1-1s and the reviewer's S2-6.
  - The ceiling case is out of the "not cancelled" list and has its own sentence. That matches `RunningPublishes::on_exit_requested`, which calls `cancel_all` before answering `PreventAndDrain`, and the `lib.rs` run callback, which prevents the exit, awaits `wait_idle(EXIT_DRAIN_CEILING)` and then calls `app.exit(0)` whatever the outcome.
  - The cancel after the last cancel check is stated: the publish finishes and the audit records its normal outcome.
  - The macOS and Linux sentence is now marked, in the visible text, as a reading of the pinned Tauri sources and not an observation.
  - "(item 1)": main's item 1 at abd592b gives Linux L1 for the Cargo workspace, explicitly not the Tauri shell, and gives macOS no level yet. "The Tauri shell has no support level on macOS or Linux" is consistent with that.
  - `git merge-tree --write-tree origin/main bfd68af` merges cleanly (rc 0), with exactly one item 30.
  - There is one residual edge, below in S2-1.
- **Row R1**, the architect's S2-3 and the reviewer's N4.
  - The repeat advice now restarts from step 2 with a fresh destination and closes the window during `verifying-source`. The kernel's phase label `verifying-source` exists (`PublishPhase::VerifyingSource` in `kernel/src/publish/mod.rs`).
  - The new "Before R1" bullet uses the same build command as Part F's own pre-check (Part F's prose under F7, at bfd68af).
- **Comments and docs**, the architect's S2-1 and the reviewer's S2-2, S2-5, S2-7 and N1.
  - The `Authority` fallback comment in `execute_with_progress` is true. `GrantSet::add` (`kernel/src/permission/grant.rs`) refuses only when `len >= MAX_GRANTS` (64), and the set is fresh.
  - The `on_exit_requested` doc matches the swap of the once-flag.
  - The `DrainOutcome` doc matches `lib.rs`, which discards the value.
  - The `commands.rs` prepare-key doc matches `run_exclusive`: `try_insert`, then `remove` of the key it inserted only, and `None` without touching the running entry.
- **Routed** (item 5): the reviewer's S2-1, S2-4 and S2-8, and the architect's S2-2, are in PLAN node `publish-lifecycle-drain-followups` on origin/main. The reviewer's N3 and N5 and the architect's N1 to N5 are not claimed. That is consistent with item 2.

**3. T4 and M4 (class 4)**
- **T4 at bfd68af** joins thread A first and then calls `wait_idle(Duration::ZERO)`.
  - `run_exclusive` removes its key before it returns `Some`, so the `watch` count is already 0 at the wait. The `wait_for` predicate resolves on the first poll, before the zero timer is consulted.
  - No asserted value depends on a wall-clock bound.
  - T4 has no other duration, and there is no sleep.
- **M4, observed by me at bfd68af.**
  - I replaced `cancel_all`'s `g.values().for_each(CancelToken::cancel);` with a no-op (`let _ = &g;`) using perl, and ran T4 alone (`cargo test ... --lib exit_requested_cancels_a_running_publish_and_its_staging_directory_is_removed -- --exact publish::tests::...`).
  - rc 101: 1 failed, 64 filtered out, in 0.26 s.
  - The panic is at `src\publish.rs:3099:13`, which is the `panic!` in T4's `Refused` let-else.
  - The payload (paraphrase; it holds a user-profile path) begins with `got Some(Success {` and prints the success struct: bundle path, rows, partitions, bytes and style hash.
  - I reverted with `git checkout --`, and `git status --porcelain` was empty.
  - T4's test code is identical at d0184eb and bfd68af; 0391787 changes only the two `RECORDED MUTATION` comment lines.
- **M4's recorded text** names c92b17b, which is on main, and d0184eb, a branch commit named by id. It pins no hash. It places no text in quote marks, and its prose matches the payload. No record in the round calls a `verify-mutation` run an observation.

**4. Amendment 1**
- **Append-only.** Against 4d92733 the form has 35 insertions and 0 deletions, all after the §10 heading. Against ff57832 the figures are the same.
- **First line.** The heading and the first body line both carry the class 8 words `budget overrun, §7 not edited`. The body line states that it was written after gate 1's results and after the merge, marked as a post-result amendment, in the same shape as `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md` Amendment 1 on main.
- **References only.** There is no sha256 anywhere in the amendment. The branch commits are named by id only, and the PR asks for a merge commit, so they reach main.
- **§7 figure**, recounted with the form's own command (§7, "Counted by"):
  - ff57832...bfd68af gives 675 insertions and 40 deletions, 715 over 5 files: KNOWN-LIMITATIONS 19/0, MANUAL-WALKTHROUGH 33/0, commands.rs 28/24, lib.rs 26/2 and publish.rs 569/14.
  - ff57832...0391787 gives the same.
  - ff57832...4d92733 gives 657/37, which is 694.
  - The Declared and Final figures are correct; the Reason is S1-2. §7 is not edited.
- **Superseded index:** S1-1.
- **References on origin/main at abd592b:**
  - both gate-1 reports exist;
  - worker report 2 exists;
  - the PLAN node `publish-lifecycle-drain-followups` exists, status proposed, depends on `publish-attempt-lifecycle-src-tauri`;
  - 4d92733 and 4e3c8a8 are ancestors of origin/main;
  - 4e3c8a8's commit time, 2026-10-03T10:01:55+02:00, is 08:01:55Z, as item 1 says;
  - every finding id that item 2 and item 5 name (reviewer S2-1 to S2-9, N1, N2 and N4; architect S2-1 to S2-3) exists in the two gate-1 reports.
- **Item 6, the human's sight.** The fenced block in PR #165's body is byte-identical to `KNOWN-LIMITATIONS.md` lines 302-319 at bfd68af (`cmp` rc 0, 18 lines).

## Exit codes

All cargo commands used `CARGO_TARGET_DIR=D:/wt-targets/publish-lifecycle`, in the worktree at bfd68af.

| Command | rc | Notes |
|---|---|---|
| M4 applied, T4 alone | 101 | at T4's `Refused` let-else; reverted |
| `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` | 0 | 65 lib, 0 main, 2 `sole_caller_scan`, 0 doc; T4 and all nine §5 declared-unchanged `publish.rs` tests ok |
| `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` | 0 | |
| `cargo check --manifest-path frontends/shell/src-tauri/Cargo.toml --release --locked` | 0 | |
| the same, with `--features measure-build` | 0 | |
| `npm run verify` in `frontends/shell` | 0 | 72 files, 1096 tests; residency 76 passed; citation integrity 30 passed |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 408 passed, 0 failed |
| `node scripts/plan/verify-cites.mjs` | 0 | tool at 522e448d55e089b974e115e23f0c72bfc6e1120a |
| `node scripts/plan/verify-quotes.mjs` | 0 | tool at f9444a4d99a9087394c55d4b1d4c414a8b11f980 |
| `node scripts/plan/verify-test-claims.mjs` | 0 | tool at e9735d4749f094f03b69a8b570e8bf10f511c279 |
| `node scripts/plan/verify.mjs` (verify:plan) | 0 | tool at 260720226f136d1ec7d72da64656f07d29400ed7 |

- Each tool commit is the last commit that touches the file at bfd68af, and it is the same on origin/main abd592b.
- verify-cites, verify-quotes and verify-test-claims print only advisories, about files outside this diff.
- At the end, the worktree's `git status --porcelain` is empty. No cargo, rustc, test-binary or app process remains, and the app was not launched.

**PR #165 CI, at 2026-10-03T09:17:23Z.** Every run is completed and successful at bfd68af.
- Pull-request runs: Product CI — shell 37111533447, Governance CI 37111533338 (verify:plan, queue/site drift and the cfg boundary), Rust fmt 37111533332, Exposure scan 37111533331 and DCO 37111533345.
- Push runs: Product CI — shell 37111506564 and Governance CI 37111506456.
- Earlier: 0391787's push run Product CI — shell 37111247575 was cancelled, superseded by bfd68af's run. Its Rust fmt run, 37111247412, succeeded.
- Nothing is pending. GitHub's mergeability for #165 still read UNKNOWN; the local merge-tree against origin/main is clean.

## S2

1. **KNOWN-LIMITATIONS 30's ceiling sentence is universal, and one routed edge falsifies it.**
   - The sentence says the publish that has not stopped at 30 s was cancelled. An execute whose `try_insert` runs after `cancel_all` (the reviewer's gate-1 S2-1, the architect's S2-2) is registered uncancelled, and `wait_idle` then waits for it. If it outlasts the ceiling, it is a ceiling-case publish that was never cancelled. The same goes for the opening sentence's "the app cancels it".
   - This is narrow, and it is routed to `publish-lifecycle-drain-followups`. I am not blocking on it, because the gate-1 reports prescribed this wording.
   - That node's form should name KNOWN-LIMITATIONS 30 in its scope: either its fix makes the sentence true, or the item gains the qualifier.
2. **T4's `Drained` assertion now proves only that the registry is empty after the join.** The wake-on-last-removal path is T5's alone, and M5 does not touch T4. That is acceptable under §4, where each test has its own mutation. Amendment 1 item 3's phrase "asserts the drain" overstates what T4 now proves.
3. **Superseded index, T4 entry.** "T4's drain assertion, superseded at d0184eb" names a line that did not change (`assert_eq!(drained, DrainOutcome::Drained)`). What changed is the join order and the wait's argument. It can be folded into S1-1's correction.

## N

1. Amendment 1's heading and first body line repeat each other. One line carrying both markers would do.
2. The architect's gate-1 N1 still applies: "Only Windows has been exercised" holds at L1, but R1 has not run. The worker left it alone on purpose.
3. T5 keeps its two 60 s `wait_idle` bounds. They are outside this round, and they are liveness guards with no asserted duration.

Files:
- C:/dev/wt/publish-lifecycle/frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md
- C:/dev/wt/publish-lifecycle/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/wt/publish-lifecycle/KNOWN-LIMITATIONS.md
- C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/publish.rs
- C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/commands.rs
