Reviewed: PR #236 at 5e922915419fff578d862ae1a47aefa39c955ba2 (base 677ecd12), gate 1, reviewer
Verdict: FAIL
Branch: cut/publish-approval-ttl-ten-minutes @ 5e922915419fff578d862ae1a47aefa39c955ba2

The code passes every check I ran. The FAIL rests on one sentence in a doc comment, and the fix is the replacement words below. Under AUTONOMY §31 (d) that sentence is not the human's wording, so the worker applies the words with no re-gate and the PR body lists them.

## Correctness (blocks)

**C1. A kernel doc comment now states a limit the code no longer has.**
- **Where:** kernel/src/permission/grant.rs:412 at 5e922915. The diff does not touch this file, and the form's §2 survey of places that state the TTL does not list it.
- **What is wrong:** the line describes the grant `boundary::execute` just used as having its own 120 s lifetime. Byte-copied:
  `    /// it would also have expired naturally on its own 120 s-class lifetime. Matches on the SAME`
- **Why it is untrue after the PR:**
  - The shell's publish grant takes `PENDING_ATTEMPT_TTL`, now 600 s (frontends/shell/src-tauri/src/publish.rs:588-598 and :69 at the head).
  - The CLI's default grant is 300 s (`DEFAULT_GRANT_TTL`, kernel/src/bin/publish-bundle.rs:98).
  - So the 120 s figure matches no grant. An operator who waits 3 minutes sees the grant still valid. §31 (g) makes an untrue claim of a limit a Correctness finding.
- **Replacement words, for the same line:**
  `    /// it would also have expired naturally at the end of its own declared lifetime. Matches on the SAME`
- **Clause check:**
  - "expired naturally": `prune_expired` drops `g.expired(now)` (grant.rs:403-407).
  - "its own declared lifetime": `PublishGrant::new` takes `lifetime: Duration` and refuses anything above `MAX_GRANT_LIFETIME` (grant.rs:262-271). The shell passes `PENDING_ATTEMPT_TTL` (publish.rs:598) and the CLI passes its `grant_ttl`.
  - The new words state no number, so they cannot go stale again.
- **Scope:** kernel/src/permission/grant.rs is not in Scope. Adding it makes 9 files against the form's "8 files besides this form" and adds 2 changed lines. Before that commit, the custodian records this as a class 6 amendment (budget deviation, Scope not edited), the same as Amendment 3. The piece is already under both gates, so no route changes. Total with this fix is about 91, plus the ADR note's lines, against 120.

## Evidence (none blocking)

- **E-a. Run 1's FILTERED' FAIL** (E1 record, Amendment 4).
  - The machine rule has a timing-sensitive failure from a shared run re-run "alone on the machine". Run 2 was in its own shared hold, not alone.
  - Not blocking: the diff touches no filter path. A names-only diff over types.ts, lib.rs, commands.rs, protocol/, kernel/, engine/, package.json and Cargo.toml is empty. `filter_scope` is still `filter_active.then(...)` at publish.rs:651.
  - Recorded so the custodian can weigh whether a run alone is owed.
- **E-b. The 601 s backdate in `a_pending_attempt_past_its_ttl_is_treated_as_unknown`** (publish.rs:1814; the architect draft's unsettled item 4).
  - `Instant::now() - 601 s` panics on Windows when uptime is under 601 s; before this PR the figure was 121 s.
  - Both CI runs at the head passed it. Run 39486583163, job 118848449517 logs "a_pending_attempt_past_its_ttl_is_treated_as_unknown ... ok"; run 39493287566 also passes.
  - So it is a named residual risk for a freshly booted machine, not a defect at the head.

## Documentation (must be fixed before the merge, no re-gate)

**D-1. The sentence's source comment does not record the gaps that form §1 names under §31 (c).**
- **Where:** frontends/shell/src/publish/PublishDialog.tsx:9 at 5e922915. §1 names two gaps "for the source comment": the clock starts at the stash, before the dialog mounts; and a last-instant Submit can be refused on the grant. The comment records neither. Byte-copied:
  `/** P6 placeholder (AUTONOMY.md section 31 f): the minutes are `PENDING_ATTEMPT_TTL`'s, pinned by `PublishDialog.test.ts` D2. */`
- **Replacement words, one line:**
  `/** P6 placeholder (AUTONOMY.md section 31 f): the minutes are `PENDING_ATTEMPT_TTL`'s, pinned by `PublishDialog.test.ts` D2. Named under section 31 c, not blocking: the 10 minutes run from the host's prepare, not from this dialog's mount (the attempt's clock starts at its stash in `publish.rs`, the grant's a moment earlier at its mint), a gap inside one request round trip; a Submit in the last instant can be refused on the grant rather than as `unknown-attempt`. */`
- **Clause check:**
  - "pinned by D2": PublishDialog.test.ts:220-225 asserts `APPROVAL_EXPIRY_MINUTES * 60` equals publish.rs's `from_secs`.
  - "run from the host's prepare … clock starts at its stash": publish.rs:658 sets `created_at: Instant::now()`, and :222 compares `created_at.elapsed() > PENDING_ATTEMPT_TTL`.
  - "not from this dialog's mount": the dialog renders only after `PrepareOutcome::Prompt` returns (publish.rs:662).
  - "the grant's a moment earlier at its mint": publish.rs:588-598 mints with `PENDING_ATTEMPT_TTL` before :658.
  - "refused on the grant rather than as unknown-attempt": execute takes the attempt first, and a miss returns `UnknownAttempt`. kernel/src/permission/boundary.rs:409-418 then re-checks the grant against a fresh clock. The grant was minted first, so it expires first.
- Not the human's wording (a doc comment), so §31 (d) applies. PublishDialog.tsx stays within its budget (7 of 15, then 9).

## The form's block-on-sight list (§3)

1. **Timer or time-driven state:** none added. The only `useEffect` hits in PublishDialog.tsx (lines 4, 145, 153) are in `usePublishPhase`, which the diff does not touch. No `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now` or `performance.now`.
2. **Literal form:** held. publish.rs:69 reads `pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs(600);`.
3. **Wire shape:** held. No `PublishPromptData` field and no binding shape changed (the names-only diff in E-a is empty).
4. **One sentence, confirming block only:** held. One `<p className="publish-dialog-expiry">` at PublishDialog.tsx:277, inside `state.kind === "confirming"`, directly after the instruction.
5. **ADR-024:** not checkable yet; the file is unchanged on the branch. At the append the custodian should check four things:
   - the diff is append-only after line 298;
   - the status line is untouched;
   - the heading is `## Appended note, <merge day>`;
   - the note line's sha256 (LF, with its newline) is f4018b1a149d07581184d7704447d3abae3c5d4633c1c2f2a357c2323fd7a6d6.
6. **Size overrun:** present and recorded. exportElapsed.test.mjs is 5 against 4 and publish.rs is 36 against 35, both as class 6 in Amendment 3. C1 adds a third, to be recorded the same way.

## Judging ADR-024's note now

I rebuilt the note by script from the two directives at the commits that add them (f2052681 and b2433b78):
- line 11 of the first directive, its two leading spaces removed;
- line 8's old clause replaced by its new one; the old clause occurs exactly once.

The result, with its newline and no CR, hashes to f4018b1a149d07581184d7704447d3abae3c5d4633c1c2f2a357c2323fd7a6d6, which matches Amendment 2 item 1.

Its claims against the head:
- **"600 s (10 minutes)":** true, publish.rs:69.
- **"not the 120 s that the Decision's binding_publish_prepare bullet states":** true, ADR-024:88-89.
- **The figure "read once when it opened":** the figure is read at prepare (publish.rs:607), just before the dialog opens, and shown static. The gap is inside one round trip.
- **"takes the same lifetime":** true, publish.rs:598.
- **"stays under MAX_GRANT_LIFETIME (20 minutes)":** true, 600 < 1200 (grant.rs:221 and :266-271).
- **"states the expiry in one sentence and adds no countdown":** true (block-on-sight 1 and 4).
- **"Nothing else … changes, … stays Proposed":** depends on block-on-sight 5.

It is red-line text and the human's wording; nothing in it needs replacing.

## Out-of-scope line, checked first (§21d)

- **Wire not touched:** true. Nothing under protocol/, `types.ts` and the Tauri commands are unchanged, and `PublishPromptData` gains no field.
- **Security (§21a letter) not touched:** true. No file governed by ADR-020, ADR-009 or ADR-021 is changed. 600 s is under `MAX_GRANT_LIFETIME`. The wider window for ADR-024's in-page-script limitation is the architect's reading.
- **ADR touched:** the note is pending (block-on-sight 5).
- **Guarantee touched:**
  - T1 asserts 600000.
  - Single use, expiry and the shared lifetime are unchanged: `take` and `insert` (publish.rs:208-226) are untouched, and the grant uses the same constant.
- **No dependency, no exposure surface, no countdown, no other string the app shows:** true. The only new string the app shows is `APPROVAL_EXPIRY_SENTENCE`. publish.mjs's note is e2e output, not the app's.
- The categories it names as touched take this form only by OPEN-1 (A), which sets §25 (e) aside (Amendment 1 item 1). That is the human's ruling, so it is not a §21d failure.
- Caller check: `APPROVAL_EXPIRY_MINUTES` and `APPROVAL_EXPIRY_SENTENCE` both have a product caller in the render (PublishDialog.tsx:11 and :277). The new Rust item is test-only.

## What I checked, with evidence

**1. Diff.** `git diff origin/main...HEAD` (three dots) in C:/dev/wt/ttl, rc=0: 7 files, 76 added and 13 deleted. `git log origin/main...HEAD` rc=0; the merge base is f2052681. Read whole against Scope, Change, Tests+mutation and §1 to §3. Commit 5e922915 against 42e6fc14 adds only the four `RECORDED MUTATION` comment lines.

**2. Mutations at 42e6fc1410447c331a4b213b02fdc220e834fc7a**, in my own throwaway worktree C:/dev/wt/rv236g1 (detached), each applied alone and reverted, with porcelain checked empty after each revert (0 bytes). No `verify-mutation` run was used.
- **Baseline:** `npm run test:export-elapsed` rc=0, 5 passed.
- **M1** (600 → 120): `npm run test:export-elapsed` rc=1, failing "✖ T1 the TTL read from the real publish.rs is 600000 ms".
- **M2** (the same 600 → 120, still applied):
  - The command was Amendment 3 item 2's full-path `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --lib publish::tests::a_pending_attempt_121s_old_is_still_taken_within_the_ttl -- --exact`.
  - It ran with CARGO_TARGET_DIR=D:/wt-targets/rv236g1, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8, inside a shared hold.
  - Result: rc=101, "test publish::tests::a_pending_attempt_121s_old_is_still_taken_within_the_ttl ... FAILED", with the panic "a pending attempt 121 s old is within the 600 s TTL and must be returned"; 0 passed, 1 failed, 67 filtered out.
- **M3** (the expiry paragraph line deleted): `npx vitest run src/publish/PublishDialog.test.ts -t "D1 renders the approval-expiry sentence verbatim while the dialog asks for the phrase"` rc=1, "× D1 …", "AssertionError: expected -1 to be greater than 1159".
- **M4** (600 → 300): the same command with D2's name, rc=1, "× D2 the expiry sentence's minutes are PENDING_ATTEMPT_TTL's, read from publish.rs", "AssertionError: expected 600 to be 300".

**3. M2's route to the observation (disclosure).** I wrapped each cargo call in `timeout 500` so that it ended inside the tool's 600 s limit and the release step always ran.
- **Attempt 1:** rc=124. The build failed on "resource path `..\src\generated\NOTICE.txt` doesn't exist" because the shell's `npm run build` had not run yet. I then ran it (rc=0, about 16 s, outside a hold).
- **Attempt 2:** rc=124 while the `libduckdb-sys` build script was compiling bundled DuckDB, which takes about 11 minutes.
- **Seeding:** I copied that registry crate's build-script output and fingerprint (unit libduckdb-sys-8d970cdd17e7d633, the same hash in both targets, 5.0 GB) from the worker's D:/wt-targets/ttl into my own target.
  - Attempt 3: rc=124, because the mtime order made cargo re-run the script.
  - Re-copied and touched. Attempt 4 is the observation above.
  - Only the path crates were compiled from my checkout; no source crate came from the worker's target.

**4. At the head, in the same worktree checked out at 5e922915** (porcelain empty), one shared hold for the npm steps, rc=0 each:
- the bundle viewer's `npm ci` and `npm run build`;
- `frontends/shell` `npm ci`;
- `npm run verify`: 100 test files, 1393 tests passed, and the export-elapsed suite passed 5 of 5.

Outside a hold (light):
- D1, verbose: rc=0, 1 passed.
- D2, verbose: rc=0, 1 passed.
- `npm run test:export-elapsed`: rc=0, "✔ T1 the TTL read from the real publish.rs is 600000 ms".

Then, in a shared hold, `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`:
- rc=0: the lib passed 68, main 0, sole_caller_scan 2;
- both `a_pending_attempt_past_its_ttl_is_treated_as_unknown` and `a_pending_attempt_121s_old_is_still_taken_within_the_ttl` read ok;
- the named test run alone (full path, `--exact`): rc=0, 1 passed.

The form's original §3 command (bare name with `--exact`) gave rc=0 with "0 passed … 68 filtered out", which confirms Amendment 3 item 2.

**5. Scope count.** The form's command, `git diff --numstat origin/main...HEAD -- . ':(exclude)frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md'`, gave rc=0: 7 files and 89 lines (76+13).

| File | Lines | Budget |
|---|---|---|
| MANUAL-WALKTHROUGH.md | 4 | 4 |
| e2e/README.md | 2 | 4 |
| exportElapsed.test.mjs | 5 | 4 (over) |
| publish.mjs | 11 | 12 |
| publish.rs | 36 | 35 (over) |
| PublishDialog.test.ts | 24 | 30 |
| PublishDialog.tsx | 7 | 15 |
| ADR-024 | 0 (pending) | 6 |

At 42e6fc14 the two over-budget files are 4 and 35, so each overrun is exactly its mutation comment. Amendment 3's figures match.

**6. Governance at the head**, in a shared hold, rc=0 each:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 509 passed, 0 failed;
- `verify.mjs --offline`: PASS;
- `verify-cites.mjs`: PASS (88 advisory);
- `verify-quotes.mjs`: PASS (129 checked, 0 hash-reference errors);
- `verify-test-claims.mjs`: PASS (573 claimed tests).

I also ran a no-commit merge of origin/main into my detached worktree (merge rc=0, then aborted, HEAD unchanged). On that merged tree verify-test-claims, verify-cites and verify-quotes each gave rc=0 and PASS.

**7. Hashes**, all from LF bytes at the commits named:
- **Amendment 1:** the first directive from line 6 at f2052681 hashes to bd5309138eb602d6426fdb85a1968b0c476ab822c8bfa3d45c4554ff4cd27ca0, a match. Its item 3 pin, PublishDialog.tsx:249 @ 0f0f55cf, matches cad94f92….
- **Amendment 2:** the second directive from line 6 at b2433b78 hashes to be7c45adb18959f3df4574d4f14d6e1fd873074dd56e1edf995360a72f2ae1ad, a match. Its item 2 pin, PublishDialog.tsx:247-249 @ 0f0f55cf, matches f58b79ad…. The composed note line matches f4018b1a….
- **Amendment 3:** all four commit ids resolve; they are parent-linked from f2052681.
- **Amendment 4 and the E1 record:**
  - The E1 record at 4731a9a9, whole file, hashes to 75350cb671261570429fccd149d1334ed773a2a9b53e6b2c934d9772a6c90f66, a match.
  - `sha256sum` of D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-ttl-5e922915.exe gives 525ac72d43661caf0a0f2f35f58581e3824ebbcc12c6facc69a09542c259ef3c, a match.
  - The three adding commits are ancestors of origin/main.
- **The form body:** a script over the form on origin/main checked all 47 `path:line @ rev sha256` pins (45 in the body and 2 in Amendments 1 and 2): rc=0, 47 OK, 0 bad.

**8. E1 record against §3.** Both runs show:
- `PENDING_ATTEMPT_TTL 600000ms`;
- OPEN, APPROVED' and REFUSED' passing;
- EXPIRED' skipping with a note naming 600s.

FILTERED' failed in run 1 and passed in run 2 (rc=0); see E-a.

**9. PR CI at the head:** every check passes, `typecheck · build · vitest · cargo test` among them on both runs (39486583163 and 39493287566).

## Process disclosures

- **Holds:** every heavy command ran inside a shared hold; no exit code was 96 to 99. To the line shape I added only `echo cmd_rc=$rc` after `rc=$?`.
- **Light runs outside a hold:** M1, M3, M4, the D1, D2 and T1 runs at the head, the form-command check, the shell `npm run build` at 42e6fc14, and the merged-tree verify scripts.
- **Clean-up:** the throwaway worktree C:/dev/wt/rv236g1 is removed with `git worktree remove --force` (rc=0, gone from `git worktree list`), and D:/wt-targets/rv236g1 is deleted. C:/dev/wt/ttl was never written to: its porcelain is empty and its HEAD is still 5e922915.
- **Never done:** no commit, push or PR action, and no process killed.
