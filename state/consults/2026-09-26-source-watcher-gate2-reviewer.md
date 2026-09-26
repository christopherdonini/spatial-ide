*Custodian's filing note (2026-09-26): the reviewer gate's attempt-2 report for PLAN node `engine-source-change-watcher` at 68f5c56, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text, as returned, except 2 rooted cites to lines that exist only on the branch, on this file's lines 45, 51. A script rewrote each to the reviewer's worktree path, `C:\dev\wt\source-change-watcher\` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed.*

---

**Reviewer gate, attempt 2: `engine-source-change-watcher` @ 68f5c56. Verdict: FAIL.**

Scope: worktree C:\dev\wt\source-change-watcher, diff `origin/main...HEAD` (origin/main = merge-base = b5a8812). The fix round is 2daf371..f280f76.

All of gate 1's findings are fixed as the ruling shaped them. Every suite is green, every mutation you listed fails as it should, and the E2E passes. Two small findings still block, and each needs a one-line fix.

State at the end:
- The tree is clean: `git status --porcelain` and `git diff` are both empty, HEAD is 68f5c56.
- Cargo used the worktree's own targets. CARGO_TARGET_DIR was unset.
- C: had 22 GB free at the end.
- Nothing I started is still running. The only remaining node/WebView2 processes are the ones there before I began (Codex's node and node_repl, Google Drive's WebView2), matched by command line. I killed nothing.

## Blocking

**R1. `C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs:244-246`: a quote attributed to §2b that §2b does not contain.**
- **Rule:** round 10 ("a quote marked verbatim that does not match its source byte-for-byte is a gate failure by name").
- **The defect:** K6's doc says `resolves_unchanged()` is deliberate "belt-and-suspenders on the sink's asynchronous callback" and labels that "§2b's own words".
- **Evidence:** `grep -i belt` finds nothing in `engine/SOURCE-WATCHER-PREREGISTRATION.md`, at HEAD or at any of its branch commits (596511b, d5d262e, 09104f4, 2a7f830, 2daf371). §2b step 2 actually reads "If `resolves_unchanged()` is false, refuse as `engine.source_changed`." (line 150). The phrase's only other occurrence is the kernel's own code comment (`kernel/src/skp.rs:1074`).
- **History:** it came in at 43ec01d and both gates missed it at gate 1. d99e71d rewrote this paragraph and carried the quote forward on a new `+` line, so it is in this round's diff.
- **Fix:** drop the quotation marks and "§2b's own words", or attribute the phrase to `kernel/src/skp.rs`'s comment.

**R2. `C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md:1509` (Part Q, row Q2) does not reach B5's two new placeholders.**
- **Rule:** §9 (operator rows cover "the wording of every §7 placeholder"); §7's placeholder row names "the checks-only row; the degraded row".
- **The defect:** 05cceb6 made the two `DescribeSummary.tsx` labels (`:79`, `:86`) `[P6 placeholder]` strings. Q2 tells the operator which files to search, and `DescribeSummary.tsx` is not among them.
- **Evidence:** I grepped the branch diff for every product file that adds a `[P6 placeholder]` string. Every one is in Q2's list except `frontends/shell/src/admission/DescribeSummary.tsx`. Q1 does not show these rows either: they appear only on checks-only or degraded, and a Windows sitting shows neither.
- **Fix:** add `frontends/shell/src/admission/DescribeSummary.tsx` (the two `<dt>` labels) to Q2's list. The log is still blank, so this is an in-scope edit.

## 1. Gate-1 findings: each fixed? (checked at f280f76 and confirmed unchanged at 68f5c56)

The fix round is one commit per fix-list item: item 1 = 2daf371, 2 = d99e71d, 3 = c2e6483, 4 = 24a00bf, 5 = aed6312, 6 = 8a39720, 7 = 054168b, 8 = 2993c99, 9 = bab88a2, 10 = 8fbb1c6, 11 = 8bcedeb, 12 = 05cceb6, 13 = 8e592f0, 14 = 2353236, 15 = ea58ee2, 16 = 71dedc4, 17 = f1ddfa9, 18 = 1fc6353. Item 19 is the suites.

**Amendment 5:**
- Preregistration lines 567–580 hash to ce1367eeb22fac6614a969d4e69ba8c7ce43b5fa8344834ff18747de1d51b3a5. That equals the fix ruling's lines 176–189 (the ruling is on main, filed at f2316db).
- Its three span hashes recompute at 04b3680, which is on main: 6d3806b0…, 8d884afa…, 7c5d951c….
- The preregistration is unchanged from 2daf371 to HEAD.

**My gate-1 findings**

| Finding | Fixed? | Where | Proof |
|---|---|---|---|
| B1 (race) | Yes | `C:\dev\wt\source-change-watcher\engine\src\watch.rs:333-350` | By reading, per Amendment 5 item 4 (below). |
| B1 (`PendingRead` Drop) | Yes | `watch.rs:222-241`: `CancelIoEx(self.handle, self.overlapped)` (its own OVERLAPPED, never null), then `GetOverlappedResult(bWait=1)` | By reading. On a read that has already completed, the cancel returns not-found and the wait returns at once. |
| B2 | Yes | `watch.rs:598-673`: no `expect`. A failed P spawn closes P, drops G's pending read and closes G. A failed G spawn builds and drops a `SourceWatch` holding only P (disarm, join, close), then closes G. | By reading, per Amendment 5 item 4. std's failed spawn drops the closure, so the captured `PendingRead` is cancelled and synchronised. |
| B3 / K15 | Yes | `kernel/src/skp.rs:1080-1116`, one refusal path: the latch stays PreAdmission; release, `catalog.remove`, `drop(watch)`, re-lock, then map by kind; if nothing is recorded, fall back to coverage-lost with a `[P6 placeholder]` detail. `ArmedWatch::resolves_unchanged` states the contract (`watch.rs:46-48`). | By test: K15 (`skp.rs:2978`) asserts the code, no catalog entry, empty `live` and `invalidated`, and no event. K6's comment is updated. |
| B4 | Yes | `SKP-V0.md:278-282` is byte-identical to the ruling's lines 43–47 (sha bf76751f…) and sits after "…as `skp/0.2` and `skp/0.3` did." The old `:265` paragraph is deleted. Item 10 (`:250-254`) now reads "minted per dataset-session generation (§3's third rule), a value kind that is not a handle". | By reading. |
| B5 | Yes, but see R2 | `DescribeSummary.tsx:79,86` | By reading. No test matches the label text. |
| B6 | Yes | `C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:349-352`: no figures or comparison left. The `a7_` name and the generalisation are fixed. | By reading. |
| B7 | Yes | `App.tsx:702-722`: `dispatchSessionEndedToOwner(reason, forDataset, {baseline: Pick<…>, candidate: Pick<…>, endSessionDirectly})`. `endSessionForReason` is one call (`:1182`). | By test: SH7 (`viewportStreamManager.test.ts:851`, a real manager wired to the exported `endSessionForDataset`) and SH8 (`tileViewportStreamManager.test.ts:1552`). |

**Architect's gate-1 findings**

| Finding | Fixed? | Where | Proof |
|---|---|---|---|
| B1 | Yes | Two exact-equality pins, `typed_terminal_codes.rs:208` and `:255`; `terminalShapes.ts` names both. | By test. Checked by script: both Rust literals are byte-equal to the two TS constants. |
| B2 | Yes | The line is built in `routeDatasetSessionEndedEvent` (`App.tsx:742-750`); the source-scan test is deleted. | By test. SH11 asserts on the real output. My extra variant (the line built from `deps.admittedSession`) also fails, on the regex. |
| B3 | Yes | E7 doc (`skp.rs` ~2811) records §4's mutation; "look the reference up after the guard" matches §4:288. | By test. |
| B4 | Yes | Covered by my B4 row above. | By reading. |

**Advisories:** all fixed.
- 1 is fixed by the K15 shape.
- 2: `skp.rs:1036`.
- 3: `WATCH_BUFFER_BYTES` is `pub(crate)` and the re-export is gone.
- 4: the KNOWN-LIMITATIONS comments. Every fragment marked byte-exact is present in the preregistration (grep -F, one hit each), and the rest are labelled paraphrase.
- 5a: src-tauri `lib.rs:290-294`. 5b: `App.tsx:1218-1226`.

**Suggestions:** all fixed.
- S3: `events.ts:25-29`.
- S5: E10 now has `run_with_timeout`. I applied its mutation (`try_send` → `send`): it failed bounded, "did not return within 5s", rather than hanging.

**Nits:** all fixed. The `liveTicketSet.ts` cites (`:1237-1250`, `:1289-1313`, `:1638`) resolve exactly at HEAD. The E2E prints no elapsed ms.

**Caller grep:** no new `pub` item or export. The two exports whose signatures changed have product callers at `App.tsx:1182` and `:1204`.

## 2. Mutations: applied, run, reverted

After each revert, `git status` was empty.

| Mutation | Result | Compared with the recorded comment |
|---|---|---|
| K15 registered (refusal path hardcodes `SourceChanged`) | FAILED at skp.rs:2994, left "engine.source_changed", right "engine.source_coverage_lost" | Matches. |
| K15 second (`*guard = Admitted` before `drop(guard)`) | FAILED. It prints "the advisory source watcher signalled coverage-lost", meaning the sink's Admitted arm ran from the watch's Drop. Then the re-lock panicked: "internal error: entered unreachable code: this call is the only place the latch is ever admitted". The mark assertion is never reached. | Matches the recorded comment, not the ruling's prediction ("fails on the mark"). That is a class-1 prediction miss for the closing amendment. |
| My extra probe (same mutation, re-lock's `unreachable!` → `None`) | FAILED at `:3009`, "must leave no invalidated mark" | Shows K15's mark assertion does discriminate. |
| E7 registered (`enqueue` re-reads `live` by dataset) | FAILED, "one event, carrying the open's own reference: Timeout" | Message matches. The recorded path "kernel\skp.rs:2870" is a transcription slip; it prints `kernel\src\skp.rs`. |
| Pin 1 (drop `[P6 placeholder]` from the Display, `error.rs:401`) | FAILED, left/right as recorded | Record says "1 failed"; observed 2. The pre-check pin shares the Display. |
| Pin 2 (coverage-lost pre-check mapped to `SourceChanged`) | FAILED at `:285`, as recorded | Matches, 1 failed. |
| SH7 (delete the baseline `notifySessionEnded`) | FAILED on `onSuperseded` at `:890`, "called 1 times, but got 0 times" | Record says "1 failed"; observed 2. The App.test sibling "tries the baseline manager first" also fails. |
| SH8 (delete the candidate `notifySessionEnded`) | FAILED on `cancelMock` 'sh_1' at `:1580` | Record says "1 failed"; observed 2. The sibling "falls to the candidate manager" also fails. |
| SH11 (`${event.session}` in the line) | FAILED: "expected 'dataset_session_ended: dropped for an…' not to contain 'sr_aaaa…'" | Matches exactly. |
| Regression: A7 fold (`a == b`) | `names_match_folds_case` FAILED at watch.rs:704 | Still discriminates. |
| Regression: SH9 (skip the comparison) | FAILED: "expected vi.fn() to not be called at all" | Still discriminates. |

## 3. Suites (all @ 68f5c56)

| Suite | rc | Result |
|---|---|---|
| `cargo test -p spatial-engine -p spatial-kernel -p spatial-skp` | 0 | 649 passed, 0 failed, 40 ignored (646 + K15 + 2 pins) |
| `cargo test --locked` in src-tauri | 0 | 57 + 2 passed |
| `npm run verify` | 0 | 72 files, 1087 tests; every check PASS |
| `verify-mutation --base origin/main --head HEAD` (tool @ 7d24ed1) | 0 | 89/89 |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` | 0 | 311/311 |
| verify-cites (@ 7104cd3) | 0 | PASS |
| verify-quotes (@ f9444a4) | 0 | PASS |
| verify-test-claims (@ b82941e) | 0 | PASS |
| `verify.mjs --offline` (@ db9d20b) | 0 | PASS |
| `queue.mjs --check` (@ deb56ed) | 0 | current |
| `site.mjs --check` (@ f9444a4) | 0 | current |

## 4. E2E

- **Run:** `frontends/shell/e2e/source-watch-idle.mjs`, once, rc=0. The app was launched from `C:\dev\wt\source-change-watcher\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe`, created 13:15:27, before any mutation.
- **Steps:** W1–W4 PASS.
  - F0 PASS: `viewport_query` count unchanged at 5.
  - F1 PASS: code chip `engine.source_changed`, no `engine.` prefix in the sentence.
  - F2 PASS: resident vertices 0, features 0.
  - F3 PASS: hover refused, no id.
  - Fixture sha256 unchanged (fd0c74ab…fb49).
- **Report:** `source-watch-idle-1790421338030.json`, sha256 5d7882c069880b8ec8bd9575d0c5eec7f19bf2793cbc9911bdba5dc1a4008262.
- **Teardown:** the script tore the app down, and the process list confirms nothing remains.

## 5. §21c figures @ 68f5c56

Command: `git diff --numstat origin/main...HEAD`, summing `$1+$2` per module. Excluded, as at gate 1: the preregistration, `SKP-V0.md`, `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`, `site/`, `CUSTODIAN-QUEUE.*`, `PLAN.yaml`.

| Module | Lines | Files | Gate 1 |
|---|---|---|---|
| engine | 1,432 | 6 | 1,365 |
| kernel | 2,691 | 15 | 2,404 |
| protocol | 230 (315 incl. `SKP-V0.md`) | 17 (18) | 230 |
| src-tauri | 28 | 1 | 24 |
| shell incl. e2e | 2,094 | 26 | 1,962 |
| **Total** | **6,475 across 65 files** (6,560 / 66 incl. `SKP-V0.md`) | | 5,985 / 65 |

## 6. §8 items 1–24, this round's diff

| # | Result | Evidence |
|---|---|---|
| 1 | pass | No timer or polling in product code. E10's timeout is test-only. |
| 2 | pass | descriptor, dataset, `kernel/src/lib.rs` and publish are untouched in the round. |
| 3 | pass | Fixed by K15, and the fallback is coverage-lost. The mint-race `unwrap_or(ObservedChange)` is an advisory 7 matter, routed out by the ruling. |
| 4 | pass | Only the `<dt>` text changed. |
| 5 | pass | |
| 6 | pass | |
| 7 | pass | Lockfiles, `Cargo.toml`s and `package.json` are unchanged in the round. |
| 8 | pass | No `pub` item added; one narrowed. |
| 9 | pass (see R2) | New strings are marked: the two spawn reasons, the K15 fallback, the two labels. |
| 10 | pass | "signalled {reason}", "emit failed: {e}". |
| 11 | pass | A6 and E2E fixed. |
| 12 | pass | |
| 13 | pass | B4 corrected; no fixture changes. |
| 14 | pass | |
| 15 | pass | SH7/SH8 use real managers and real exports; K15 implements the real trait; the pins run through a real `SkpHost`. |
| 16–18 | pass | Unchanged. |
| 19 | pass | SH11 and S3. |
| 20–22 | pass | |
| 23–24 | pass | Unchanged; the `dispatchSessionEndedToOwner` refactor does not touch the guards. |

## 7. LF

All 75 changed files have 0 CR bytes at HEAD, and `file` finds no CRLF in any of the round's 20 files.

## 8. f280f76

It is only what it claims: one `// Mutation: see …` comment line in `App.test.ts:1351` and two comment lines above `racing_coverage_loss_arm` (`skp.rs:1891-1892`). No behaviour changes.

The merge 68f5c56 touches no file outside the branch's own diff set plus the regenerated `site/`, queue and `PLAN.yaml`. The round never touched `PLAN.yaml`.

## Suggestions (non-blocking)

- **S1.** `watch.rs:654-672`: if the grandparent spawn fails after P's thread started, P may already have called the sink. The kernel's ChecksOnly arm (`skp.rs:1128-1139`) ignores a recorded signal. The descriptor checks remain the backstop, but consider refusing by kind when the latch already holds a signal.
- **S2.** verify-mutation @ 7d24ed1 counts a `#[cfg(test)] fn` as a test. f280f76 works around that with a comment; this is a candidate for the weekly ledger list.
- **S3.** The closing amendment's observation of record should carry the observed failure counts from table 2 (SH7, SH8 and pin 1 each fail 2 tests, not 1).

## Nits

- `watch.rs:341-343`: the reason given for "never null" is off. Only one read is ever outstanding per handle.
- `watch.rs:460-462` (pre-existing): a null `CancelIoEx` cancels I/O from every thread in the process, not "this thread".
- `watch.rs:223`: the ruling flagged the PendingRead follow-on "beyond B2"; it is not "reviewer B2's".
- `WATCH_BUFFER_BYTES` (`watch.rs:71`) is unused off Windows, so it will raise a dead_code warning there.
- `App.tsx:1218`: the `.catch` also catches a throw from the `.then` body, and would then log it as "registration failed".
- E7's recorded path is `kernel\skp.rs`; it prints `kernel\src\skp.rs`.

**Gate-log note:**
@ 68f5c56 reviewer FAIL (R1 K6 doc source_watch_ordering.rs:244-246 quotes "belt-and-suspenders on the sink's asynchronous callback" as §2b's own words — absent from §2b, round 10; R2 Part Q Q2 omits DescribeSummary.tsx's two new [P6 placeholder] labels, §9); gate-1 B1–B7 and architect B1–B4 fixed as ruled (K15/pins/E7/SH7/SH8/SH11 mutations observed, K15 second fails by unreachable! not on the mark — mark discriminates under a re-lock-tolerant probe; B1/B2 read); suites green (cargo 649+59, npm 1087, scripts 311/311, verify-* ok, verify-mutation 89/89 @ 7d24ed1); E2E F0–F3 PASS (5d7882c0…); §21c 6,475 lines/65 files; LF clean.

Files:
- C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs
- C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\wt\source-change-watcher\frontends\shell\src\admission\DescribeSummary.tsx
- C:\dev\wt\source-change-watcher\engine\src\watch.rs
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\App.tsx
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md
- C:\dev\wt\source-change-watcher\frontends\shell\e2e\out\source-watch-idle-1790421338030.json
