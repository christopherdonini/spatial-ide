*Custodian's filing note (2026-09-26): the reviewer gate's attempt-1 report for PLAN node `engine-source-change-watcher` at ee6fa38, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text, as returned at 04b3680, except six rooted cites to files that exist only on the branch, on this file's lines 11, 17, 34, 36, 135, 191. On 2026-09-26 a script rewrote each of the six to the reviewer's worktree path, `C:\dev\wt\source-change-watcher\` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed; `git diff 04b3680` on this file shows the six tokens and this sentence. Its gate-log record is in `state/gate-log.json` (commit dfdc8fb).*

---

**Reviewer gate, attempt 1: `engine-source-change-watcher` @ ee6fa38 (worktree C:\dev\wt\source-change-watcher, diff `origin/main...HEAD`, base 4e8d007, merge-base 4b08267). Verdict: FAIL.**

Every suite is green and every mutation I applied was observed. Seven blocking findings remain. The tree is clean: `git status --porcelain` and `git diff` are both empty. Cargo used this worktree's own targets. C: had 24 GB free at the end. No process I started is still running: after the runs, the only spatial-ide-shell, WebView2 and node processes were the ones present before I started (Google Drive's WebView2 and the Codex node processes). I killed nothing. Two `node --test scripts/plan/verify-test-claims.test.mjs` processes (PIDs 33192/50840, later 21556/43000) came from another session's parent process and were left alone.

## Blocking

**B1. `C:\dev\wt\source-change-watcher\engine\src\watch.rs:323-324` vs `:430-437`: a race between re-issuing a read and disarming it can hang `close_dataset`.** Rule: docs/01 principle 7 (never block; every operation cancellable).
- After a completion with a non-matching name, the watch thread re-issues `ReadDirectoryChangesW` and waits in `GetOverlappedResult(bWait=TRUE)`. It never re-checks `disarming`.
- If `SourceWatch::drop`'s `CancelIoEx(h.raw, null)` lands between that completion and the re-issue, the new read is never cancelled. `Drop` then blocks in `join()` until some later change in the directory matches or overflows.
- `close_dataset` drops the watch synchronously (`kernel/src/skp.rs`, `close_dataset`), so the close hangs. Any change to a file beside the source (a "sibling") opens this window.
- Fix: after `issue_read` succeeds, re-check `disarming` and `CancelIoEx` the handle's own read.

**B2. `C:\dev\wt\source-change-watcher\engine\src\watch.rs:577` and `:600`: `.expect("spawn the parent/grandparent watch thread")` on a fallible product path.** Rule: checklist 1.
- A failed spawn panics inside `SkpHost::open_dataset`.
- If the grandparent spawn fails, the parent thread and its handle are already running and leak. `Handle` has no `Drop` of its own; only `SourceWatch` does.
- Fix: return `ChecksOnly { reason }` and disarm and join whatever already started.

**B3. `kernel/src/skp.rs:1073`: a coverage loss can surface as `engine.source_changed`.** Rule: §8 item 3 ("anywhere").
- The race: the watch thread sets `fired` (`swap`), then blocks on the latch that admission holds. Admission then sees `recorded == None` and `!resolves_unchanged()`, and refuses with a hardcoded `EngineError::SourceChanged`, even when the pending signal is `CoverageLost`.
- The same race leaves a stale `invalidated` entry, and logs a false "session ended for a dataset" line (`:1027`) for an open that was never admitted.
- §2b step 2's wording prescribes this code, so the preregistration contradicts itself. The architect must rule which governs.
- A remedy exists inside the registered interfaces: release the guard, drop (join) the watch, then re-read the latch's recorded signal and map it by kind.

**B4. At 9fbe6bd the wire fixtures changed on the Rust side only.** Rule: §8 item 13; §2c "Fixtures … updated in the same commit as each addition" (SKP-V0 §4 item 13 condition (iii); ADR-029 Decision 6, block-on-sight 6).
- 9fbe6bd bumps the Rust literal to `skp/0.5` and changes every shared JSON fixture plus `fixtures.rs`.
- The TypeScript literal (`types.ts`, still `skp/0.4` at 9fbe6bd) and `fixtures.test.ts` change only in b20bebc. At 9fbe6bd, `fixtures.test.ts`'s `expect(req.skp).toBe(SKP_VERSION)` fails.
- `protocol/skp/SKP-V0.md:265` then calls `skp/0.5` "a further instance of this rule". That is false: the version was assembled across commits. Condition (iii) failed, so it is not an instance.
- Squash-merging would conflict with the E5 pin at 4137f4d (see the note under the figures). So this needs a record row, not a squash.

**B5. `C:\dev\wt\source-change-watcher\frontends\shell\src\admission\DescribeSummary.tsx:77` and `:84`: two new operator strings are unmarked.** `<dt>Source watch</dt>` and `<dt>Structural checks</dt>` lack `[P6 placeholder]`. Rule: §8 item 9 (§7: "each new operator string starts `[P6 placeholder]`").

**B6. `C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:349-353` (A6's doc comment) states a rate and a speed comparison.** It reads "529 655 touches in 10 s", "zero signals in 10 s", "this adapter's re-issue loop drains far faster than any of these could generate volume, on this hardware". Rule: §8 item 11; §1 (no duration); checklist 5 (no docs/08 row). Fix: keep "throughput attempts produced no overflow" and drop the figures and the comparison.

**B7. SH7's and SH8's registered mutations fail no vitest test, and the recorded mutations were replaced without disclosure.** Rule: §4 (SH7/SH8 mutation "the entry skips `notifySessionEnded`"); §9; the seam rule.
- SH7 applied at ee6fa38 (`App.tsx:1162`, `endSessionForReason` returns true without calling the baseline manager's `notifySessionEnded`): `npx vitest run` rc=0, 1086/1086 passed.
- SH8 applied (the same change at `:1167`, candidate manager): rc=0, 1086/1086 passed.
- The tests record a different mutation instead: `viewportStreamManager.test.ts:799` ("make `notifySessionEnded` a no-op"). This is not in the worker's deviation list.
- The candidate entry is reached only by the E2E, because the default arm is candidate. The baseline entry is proven by nothing.

## Suites (all at ee6fa38)

| Suite | Exit | Result |
|---|---|---|
| `cargo test -p spatial-engine -p spatial-kernel -p spatial-skp` | 0 | 646 passed, 0 failed, 40 ignored (pre-existing `#[ignore]`s) |
| `cargo test` in frontends/shell/src-tauri | 0 | 57 + 2 passed |
| `npm run verify` | 0 | vitest 72 files / 1086 tests; every check PASS |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` (tool @ 7d24ed1, on main) | 0 | 84/84 new tests carry a recorded mutation naming them |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 291/291 |
| verify-cites | 0 | PASS |
| verify-quotes | 0 | PASS |
| verify-test-claims | 0 | PASS |
| `timeout 120 node scripts/plan/verify.mjs --offline` | 0 | PASS |
| `queue.mjs --check` | 0 | current |
| `site.mjs --check` | 0 | current |

**Record defect (non-blocking for the code):** verify-mutation (tool @ 7d24ed1) runs no mutation. It only checks that a mutation is recorded within 500 characters of the test name. Amendment 3 item 5 treats its run as "the observation of record for every mutation in rows 2–5", which it cannot be. The real observations are the runs below.

**E2E**, `frontends/shell/e2e/source-watch-idle.mjs`, one run from this worktree's build, rc=0:
- W1–W4 PASS.
- F0 PASS: `viewport_query` count unchanged at 5.
- F1 PASS: block shown, code chip `engine.source_changed`, no `engine.` prefix in the sentence.
- F2 PASS: resident vertices 0, features 0.
- F3 PASS: hover refused.
- Fixture sha256 unchanged (fd0c74ab…fb49).
- Report: `source-watch-idle-1790384908073.json`, sha256 6baa6da2dd900649c6365291de898a5399f43d7ca63ca74b4237c56c79864db1.

I also ran the registered E2E mutation (listener never registered), then reverted it; `git diff` was empty afterwards. rc=1. **W4 failed by name** (".canvas-session-ended did not appear within 60000ms"), so F0–F3 never ran. §4 predicted "F1 and F2 fail by name"; the observed failing step is W4 (record note). Report `source-watch-idle-1790385006817.json`, sha256 f6d48cd0f97636579606ce1dacf54a3afe746a58bae84577e0d0bd6fd926ff6a.

## Observations the closing amendment cites (all @ ee6fa38)

- **H1:** A8 under "drop the grandparent watch" (`is_volume_root` forced true) FAILED: `renaming_the_watched_directory_succeeds_and_signals_change` panicked at `source_watch_adapter.rs:79`, "no signal arrived within 10s". The parent's own handle delivered nothing for its own rename within the harness bound, so H1 holds as observed.
- **H2:** A1 passed (workspace run).
- **H3:** A6 under "treat a 0-byte success as no events" FAILED: `a_forced_overflow_signals_coverage_lost` timed out at `:79`. The overflow arrived as a 0-byte success; no `ERROR_NOTIFY_ENUM_DIR` followed within the bound.
- **H5:** A13 passed.
- **H4:** stays open.

## Mutations applied, run and reverted (each revert left `git diff` empty)

**E7:**
- §4's registered mutation (look the reference up after the guard, in `end_generation`) → `a_pending_drop_inside_close_emits_once_with_its_session_reference` FAILED.
- The second (swap `forget_dataset` ahead of `cancel_all_for_dataset`) → FAILED.
- The mutation the worker labels "registered" is actually E1's ("remove the enqueue from `SessionInvalidator::end_generation`"). It also FAILED. The label is wrong: §4 registers "look the reference up after the guard" for E7.

**E8:**
- `enqueue` reads the reference from `GenerationRegistry` → `an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference` FAILED.
- `enqueue` skipped when the `invalidated` map is empty (my stand-in for "`ended_reason(dataset)` is None", since `enqueue` takes no dataset) → FAILED.

**K6:**
- Catalog clause: dropping `catalog.remove` in step 1 → `a_signal_between_arming_and_admission_refuses_the_open` FAILED at `:287`, "…no catalog entry behind".
- Recorded mutation (skip steps 1 and 2) → FAILED at `:277`.

**K5** (drop the OpenRecord insert) → FAILED at `:236` (ChecksOnly where Watching was expected).

**Amendment 1's kernel test** (one shared reference) → FAILED at `:506`.

**A7's fold** (`names_match_folds_case`, `a == b`) → FAILED. **A3, A10 and A11** as recorded → each FAILED.

**SH5:**
- §4's registered mutation, adding `engine.source_coverage_lost` to `isRetryableRefusal`: rc=0, **no test fails**. It is an equivalent mutant, because `isSessionEndedRefusal` is checked before the retry check.
- The worker's replacement (drop the coverage-lost disjunct) → 3 FAILED: "a coverage-lost refusal is not retryable either…", "also matches the real thrown coverage-lost refusal…", "an engine.source_coverage_lost pre-check refusal also ends the session".

**SH12–SH16:**
- SH12 → SH12 and SH13 FAILED.
- SH13 → SH13, SH14 and "notifySessionEnded ends the session exactly as a terminal does" FAILED.
- SH14 → SH14 FAILED.
- SH15 → SH15 FAILED.
- SH16 → SH16 FAILED.

**Two of SH1–SH11:**
- SH6 (accept extra members) → "refuses an added member" FAILED.
- SH9 (skip the comparison) → "drops an event whose session does not match…" FAILED.
- SH7 and SH8 as registered: no failure (B7).

## Figures

**Count** (§21c). Command: `git diff --numstat origin/main...HEAD`, summed `$1+$2` per module, excluding the preregistration, `SKP-V0.md`, `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`, `site/`, `CUSTODIAN-QUEUE.*` and `PLAN.yaml`. The protocol row includes the JSON fixtures (39 lines, 12 files).

| Module | Lines | Files | Budget (§7) |
|---|---|---|---|
| engine | 1,365 | 6 | 1,100 |
| kernel | 2,404 | 15 | 2,000 |
| protocol | 230 (312 incl. `SKP-V0.md`) | 17 (18) | 450 |
| src-tauri | 24 | 1 | 80 |
| shell incl. e2e | 1,962 | 26 | 1,200 |
| **Total** | **5,985 across 65 files** (6,067 / 66 incl. `SKP-V0.md`) | | **4,830 across ≤ 55 files** |

- The worker's figures all match.
- Phase 1's engine figure of 1,848 is 1,365 plus 483, the preregistration's length at 4137f4d (`git show 4137f4d:engine/SOURCE-WATCHER-PREREGISTRATION.md | wc -l`). The preregistration was counted by mistake; the engine code is identical.
- Fold-in commits: d90837d carries the `viewportStreamManager.ts` guards mixed with the §2d groundwork; e372848 adds 205 lines.

**Withdrawn E5 comment** (the dashed rule through "…never built."): `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:2626-2644 @ 4137f4d sha256:c0483b8ed3ec3e47424345548e458b484d44a2aba310a3470f6b7a9d7ffac31a`. Computed with `git show 4137f4d:kernel/src/skp.rs | sed -n '2626,2644p' | sha256sum`, LF bytes, no CR present. Lines 2627–2644 without the rule hash to c9a531722a10156a9545ae9db3fe7be1c4ccb29c76e1d8effd214f27e9a2a955. **4137f4d is not on main**, so round 15 (e) cannot be met until it is: merge with history, not a squash.

## Checks

- **Amendment 4:** preregistration lines 530–565 and consult lines 132–167 (consult at 001115f, on main) both hash to 473a7d27cda7a487774d5ea4109d077fa8981602dad22b32649e3b9bb666aa8f. The appended block adds one blank separator line on top of those. The preregistration is append-only since 596511b (zero deleted lines). Amendment 1's ruling matches `DECISIONS-PENDING.md` byte for byte.
- **SKP-V0.md:**
  - Main's 2026-09-24 note (main 726–748) equals the branch's 742–764, sha 2c064f36…, directly after the unchanged `skp/0.4` entry (branch 711–741, sha 1e0a74b4…).
  - The second note (branch 811–820) equals the between-phases consult's 89–98, sha 42269b96…. The S4 paragraph equals consult line 104, at `SKP-V0.md:160`; "All four are" is at `:162`.
- **skp/0.5 fixtures:** fail (B4).
- **Caller grep:** every symbol in the §4 list has a product caller. Exception: `WATCH_BUFFER_BYTES` is `pub` and re-exported (`engine/src/lib.rs:135`) with no caller outside its own module (nit).
- **LF:** all 75 changed files have zero CR bytes; `file` finds no CRLF.
- **PLAN.yaml:** changed on the branch only by 596511b (the preregistration commit: gate and evidence lines) and the merges. The phase-2 commits do not touch it.
- **Declared unchanged:** empty diff for both lockfiles, `package.json`, the src-tauri `Cargo.toml` and capabilities, publish, `protocol/data-plane` and `engine/src/dataset.rs`. The only `windows-sys` feature added is `Win32_System_IO`.

## §8 items 1–24

| # | Result | Evidence |
|---|---|---|
| 1 | pass | No timers or polling; blocking overlapped wait only. |
| 2 | pass | `descriptor.rs` +42/-0; `dataset.rs` untouched. |
| 3 | **FAIL** | B3. |
| 4 | pass | Only `DescribeSummary` rows added. |
| 5 | pass | Coverage fixed in `OpenRecord`; no generation on the wire. |
| 6 | pass | No reload, re-arm or restored generation. |
| 7 | pass | Lockfiles unchanged; one feature added. |
| 8 | pass (nit) | `WATCH_BUFFER_BYTES` re-export. |
| 9 | **FAIL** | B5. |
| 10 | pass | Engine and kernel messages state their own facts. |
| 11 | **FAIL** | B6. |
| 12 | pass | Empty publish diff. |
| 13 | **FAIL** | B4. |
| 14 | pass | `cfg(not(windows))` returns `ChecksOnly`. |
| 15 | pass | Real traits, `PlatformWatch` seam, E2E. B7 is a coverage gap, not an imagined interface. |
| 16 | pass | `open_directory` shares all three modes; A9 passes. |
| 17 | pass | `try_send` after the guard; the reference comes from `EndReport`. |
| 18 | pass | `enqueue` is called only from `end_generation`. |
| 19 | pass, with S3 | Theoretical leak in the decode-error path. |
| 20 | pass | `deny_unknown_fields`, two members. |
| 21 | pass | Ruled by Amendment 1. |
| 22 | pass | A2-1 folded; A5-1 is in `protocol/data-plane`, not this code. |
| 23 | pass | Both guards observed; the end never bumps the generation. |
| 24 | pass | SH15 and SH16 observed. |

## Worker deviations

- **SH11 with delta 4's S3:** acceptable. Delta 4 mandates it, but see S2.
- **Amendment 4's code in d90837d, after 2a7f830:** acceptable, since the amendment precedes the code. The budget row must name both d90837d and e372848 and state that d90837d is mixed.
- **SH12 description corrected:** acceptable. The registered mutation, applied as written, fails.
- **SH5 corrected:** acceptable only as a class-2 row. The registered mutation is an equivalent mutant (observed); the replacement is the SH3/SH4 mutation. SH5 has no discriminating mutation of its own, the same as A7.
- **K5's CoverageLost injection:** acceptable (optional delta 11); its recorded mutation fails.
- **K6's catalog-only assertion:** acceptable under Amendment 3 item 4; the mutation fails.

## Suggestions (non-blocking)

- **S1.** Fix B3's side effects (the stale `invalidated` entry and the false log line) with a third latch state, "Refused".
- **S2.** `App.test.ts:1409` checks SH11's S3 assertion against `App.tsx`'s source text, not the logged line. The regex passes any spelling other than `event.session`. Extract the line builder and assert on its output.
- **S3.** `C:\dev\wt\source-change-watcher\frontends\shell\src\skp\events.ts:25` puts `JSON.stringify(payload)` into the log message for a payload that is not an object. That contradicts its own doc ("never the raw payload") and §8 item 19 in principle.
- **S4.** `listenDatasetSessionEnded(...)` at `App.tsx:1190` has no `.catch`.
- **S5.** E10 (`session_end_event.rs:309`) has no timeout wrapper: under its registered mutation it hangs rather than fails.

## Nits

- `watch.rs:352`: the SAFETY comment says `read_unaligned`; the code uses `from_ne_bytes`.
- `source_watch_adapter.rs:413`: stale `a7_` name. A7's comment also keeps the "every rename scenario" generalisation the architect withdrew.
- `liveTicketSet.ts:71`: stale `skp.rs:797-803`/`:840-846` cites in a doc block this diff edits.
- `SKP-V0.md:265`: the new paragraph sits before "the second instance" paragraph.
- The E2E prints elapsed milliseconds (W4 "after 4ms").

**Gate-log note:**
@ ee6fa38 reviewer FAIL (B1 disarm/re-issue race hangs close_dataset; B2 expect() on thread spawn; B3 coverage loss → engine.source_changed via resolves_unchanged, §2b step 2 vs §8 item 3; B4 one-sided skp/0.5 fixtures at 9fbe6bd and false SKP-V0 §4 item 13 note; B5 unmarked DescribeSummary labels; B6 rate/timing claim in A6 comment; B7 SH7/SH8 registered mutations uncaught, replacement undisclosed); suites green (cargo ws/tauri, npm verify, scripts 291/291, verify-* ok); E2E F0–F3 PASS (6baa6da2…); H1/H3 observed by mutation, H2/H5 passing, H4 open; §21c 5,985 lines/65 files.

Files: C:\dev\wt\source-change-watcher\engine\src\watch.rs, C:\dev\wt\source-change-watcher\kernel\src\skp.rs, C:\dev\wt\source-change-watcher\frontends\shell\src\admission\DescribeSummary.tsx, C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs, C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md, C:\dev\wt\source-change-watcher\frontends\shell\src\App.tsx, C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts, C:\dev\wt\source-change-watcher\frontends\shell\e2e\out\source-watch-idle-1790384908073.json
