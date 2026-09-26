*Custodian's filing note (2026-09-26): the reviewer gate's attempt-1 report for PLAN node `data-plane-stream-registry-bound`, reviewed at cut/data-plane-stream-registry-bound @ b6d1664, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**`cut/data-plane-stream-registry-bound` @ b6d1664daeb979542afa67c6fd8d905c7e1aba44 — FAIL (reviewer gate, attempt 1).**

The code is correct. All five mutations reproduce, the test-first prediction reproduces, and every suite is green except fmt, which Amendment 1 row 5 records. The two blocking findings are both record-precision defects that one small correction commit can fix.

## 1. Blocking

**B1 — the mutation records carry bare `:line` cites. This fails §8 item 15 and the round-14 root-cause rule ("A record never carries a bare `:line` into a file the same commit edits").**
- **Where:** the five "Declared excerpt (copied by script)" blocks added in `e061cb1`, each at its `panicked at …:L:C` line:
  - C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:632
  - C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:687
  - C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs:208
  - C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs:245
  - C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs:299
- **Why they fail:** `e061cb1` edits both files and adds these cites. Amendment 1 row 3 names these records "the observation of record".
- **T1–T3 locations (`:208:5`, `:233:9`, `:285:5`):** they resolve at `2b99551`, the commit the header names. `e061cb1`'s own inserted comments shift them. At HEAD, test-file line 208 is the excerpt comment itself.
- **T4 and T5 locations (`server.rs` `:642:18` and `:686:9`):** these do not resolve at `2b99551` at all.
  - At `2b99551`, line 642 is the uptime `.expect(`, and line 686 is `been up longer",`.
  - The real sites at `2b99551` are the `expect("recorded above")` at line 639 and T5's `assert!(` at line 693.
  - The recorded numbers belong to the uncommitted mutated tree. Nothing in the header says so; it reads "run at 2b99551".
- **Precedent:** the repo's one other excerpt of this kind (`engine/tests/lod_tier_builder.rs`, the mutation comment above its test) qualifies its numbers with "this file's line numbers at that commit".
- **Fix:** a class-3 test-text correction (round 14's named exception). Either strip the `:L:C` from the five `panicked at` lines, or qualify each ("line numbers of the mutated tree at 2b99551" for T4 and T5; "at 2b99551" for T1–T3). Record it as an appended row.

**B2 — Amendment 1 row 5 makes a tool claim without the tool's commit. This fails round 15 (c).**
- **Where:** C:\dev\wt\stream-registry-bound\protocol\data-plane\STREAM-REGISTRY-BOUND-PREREGISTRATION.md:278.
- **Why it fails:** "`cargo fmt --check`: not clean at `522493a` … and at `e061cb1` …" is a statement about rustfmt's behaviour, and its truth depends on the rustfmt version. The row names only the code commits, not rustfmt's version.
  - The worker's report names rustfmt 1.9.0 at report line 16.
  - The mutation records name `rustc 1.97.1 (8bab26f4f 2026-07-14)`, so the convention is already followed elsewhere in this piece.
- **Fix:** append one correction sentence naming `rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14)`, the version I reproduced the claim with.

## 2. Test-first run (§4)

Setup: `server.rs` at `8dbaec5` plus the two constants only, and the test file at HEAD (T1–T3 code identical to `2b99551`). Run with `cargo test -p spatial-data-plane --test stream_registry_bound`, rc 101.

| Test | Predicted | Observed |
|---|---|---|
| T1 `the_registry_retains_at_most_the_declared_count_of_finished_streams` | fail, 200 ≠ `MAX_TERMINAL_RECORDS` | FAILED at its count `assert_eq!`: left 200, right 64 |
| T2 `a_live_stream_is_never_pruned_at_the_count_ceiling` | fail on its count assertion | FAILED at the `snapshot().len()` `assert_eq!`: left 73, right 65 (`MAX+9` vs `MAX+1`) |
| T3 `a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer` | pass | ok |

This matches the worker report at `state/consults/2026-09-26-stream-registry-bound-worker-report.md:11 @ 370b2ba` exactly. Reverted; `git status --porcelain` was empty afterwards.

## 3. Mutations (each applied by me, run, reverted; porcelain empty after each)

| # | Mutation as applied | Named test | Result |
|---|---|---|---|
| M1 | removed the `while terminals.len() > MAX_TERMINAL_RECORDS` loop in `prune_locked` | T1 | FAILED: left 200, right 64. T2 also failed (73 vs 65) |
| M2 | count loop replaced by `streams.remove(0)` plus dropping that id's terminal (oldest by admission, live or terminal) | T2 | FAILED on "the live entry must never be pruned while it has no terminal record"; T1 passed |
| M3 | `adapter_ws::drive`: the `abort_handle` / `timeout(PEER_DRAIN_TIMEOUT, reader)` block replaced by `reader.abort();` | T3 | FAILED on "the producer still observes a cancel sent during its own drain"; T1 and T2 passed |
| M4 | `record_terminal`, after its prune, retains away its own id from both `terminals` and `streams` | T4 | FAILED at `.expect("recorded above")`, the backdating lookup of `aging`, before any retention `assert!`. **Row 3's claim is confirmed.** T5 also failed at its own lookup |
| M5 | removed the age `retain` in `prune_locked` | T5 | FAILED on "older than the declared age, so it is pruned" |

## 4. Hash table (Amendment 1)

All recomputed with `git show 370b2ba:state/consults/2026-09-26-stream-registry-bound-worker-report.md | sed -n '<a>,<b>p' | sha256sum`. `370b2ba` is on main (round 15 (e) holds). Each reference sits contiguous on one line.

| Row | Span | Recomputed | Match | Span covers the row |
|---|---|---|---|---|
| 1 | 7-9 | e7170bef…ab19 | yes | yes (the two commits) |
| 2 | 11 | 3fe69c2e…84fb | yes | yes (the test-first run) |
| 3 | 25-32 | 2fb37437…bdc1 | yes | yes (M1–M5, with line 29 stating M4's early panic) |
| 5 | 13-23 | 675840a5…b576 | yes | yes (suites and clippy; line 16 also holds the worker's fmt claim) |

- **Row 4:** `git diff --numstat 522493a...e061cb1 -- <the two files>` gives 224/19 for `server.rs` and 327/0 for the test file, so 243 + 327 = 570. Correct. Class 2 resolves: round 23, item 4, "O2 and O4–O9 as recommended", and O7's recommendation is class 2 (`state/consults/2026-09-25-test-claims-followups-form.md`, its O7 bullet).
- **Row 5, fmt:** `rustfmt --check --edition 2021` (rustfmt 1.9.0-stable 8bab26f4f6) on `git archive` extracts of the crate:
  - at `522493a`: 7 files dirty (`adapter_ws`, `server`, `session`, `transport`, `wire`, `candidate_a`, `no_transport_leakage`);
  - at `e061cb1`: the same 7 plus `stream_registry_bound.rs`. The row is correct apart from B2.
- **Row 5, CI:** `.github/workflows/product-ci-rust.yml` at `370b2ba` runs only `cargo build --workspace --tests --locked` and `cargo test --workspace --locked`. No workflow under `.github/` runs fmt or clippy. Correct.
- **Append-only:** `git diff 8dbaec5 HEAD` on the form is a single `@@ -266,3 +266,13 @@` hunk with zero deletions.

## 5. Suites (worktree target, `CARGO_TARGET_DIR` unset, rustc 1.97.1)

| Suite | rc | Result |
|---|---|---|
| `cargo test -p spatial-data-plane` | 0 | 24 + 11 + 4 + 5 + 3 passed; T1–T5 ran |
| `cargo test -p spatial-kernel` | 0 | 32 binaries, 248 passed, 0 failed, 28 ignored. The five §4 kernel seam tests (`h2_*` ×2, `h3_*`, `superseded_query_cancel_while_a_second_stream_continues`, `the_admission_slot_is_released_when_the_stream_ends_not_when_the_peer_leaves`) all ok |
| `cargo clippy -p spatial-data-plane --all-targets` | 0 | 0 warnings |
| `cargo fmt --check` (§9) | not clean | as row 5 records; see S1 |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 311/311 |
| `verify-cites.mjs` | 0 | PASS, 759 files |
| `verify-quotes.mjs` | 0 | PASS (109 / 78 / 30 / 1 advisory) |
| `verify-test-claims.mjs` | 0 | PASS, 237 claims |
| `verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS, all 5 new tests named |
| `verify.mjs --offline` | 0 | PASS |

- **CR bytes:** 0 in all 9 changed files at HEAD.
- **Tree and processes:** the tree is clean, and no cargo, rustc or test binaries were left running.

## §2 and §8, item by item (all hold)

**§2, against `server.rs`:**
- **Constants and floors:** both constants and both compile-time floors are present, in the file's existing `const _` form.
- **One `Mutex`:** a single `Mutex<StreamRegistryState>` holds `streams` and `terminals`; `refusals` stays an atomic outside it.
- **Prune placement:** `prune_locked` runs only at the end of `record` and `record_terminal`. No read calls it.
- **Age:** `elapsed() > TERMINAL_RECORD_MAX_AGE`, the kernel's `>`.
- **Count:** `terminals.remove(0)`, evicting the earliest terminal record.
- **Live entries:** only evicted terminal ids leave `streams`, so no live entry is ever removed.
- **Reads:** `snapshot` and `terminals` keep their signatures and order.
- **`handle`'s `pump::spawn` `Err` arm (C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:520-536):** it records `ProducerFailed(detail)` with the same string it sends. By reading, the two returns after `record` (the `Err` arm and the fall-through after `drive`) both reach `record_terminal`.
- **Struct doc:** carries every statement §2 item 7 requires.

**§8:**
- **Items 1 and 2:** the M4 and M2 results above.
- **Item 3:** `handle`'s diff touches only the `Err` arm, so admission is unchanged.
- **Item 6:** the only new `pub` items are the two constants, and `lib.rs` is unchanged. The caller rule is met: `prune_locked` is their product reader.
- **Item 7:** there is no clock hook, and the only `cfg(test)` is the tests module.
- **Item 10:** T1–T3 use the real `serve`, a loopback `tokio_tungstenite` client, and ids parsed from the OPEN payload. That matches `adapter_ws::drive`'s `format!("{} {}", operation, stream)`.
- **Items 11 and 12:** the three-dot stat covers only §7's two files, the form, `PLAN.yaml` and the generated set. There is no Cargo change.
- **Item 13:** `candidate_a.rs` and `kernel/` are untouched.
- **Item 14:** the detail string is reused, so there is no new operator-visible string.
- **Item 15:** fails, as B1.

## 6. Suggestions

- **S1 (for the architect).** §9 says `cargo fmt --check` must be "green before either gate", and it is not.
  - Amendment 1 row 5 records the situation (not clean on main either, and CI runs no fmt step), but does not resolve the requirement.
  - The piece does add new fmt-dirty code: 6 hunks in the new test file, and new hunks in `prune_locked`, `snapshot`, the `Err` arm and T5.
  - Whether a recorded pre-existing red discharges a §9 suite is the architect's ruling, not mine.
- **S2.** Two T4 assertions are never observed failing under any mutation:
  - the retention assertion "the entry at its own terminal must survive it" (row 3 discloses this);
  - "younger than the declared age, so it is kept", which no mutation reaches at all.

  A tightened-age mutation, for example comparing against `TERMINAL_RECORD_MAX_AGE - 2 s`, would discriminate the second one. Not required by §4.
- **S3.** T4 and T5 backdate with `Instant::now().checked_sub(~300 s)`. That fails, rather than hangs, on a host up for less than 5 minutes; the kernel's tests carry the same risk. It is worth knowing for freshly booted CI runners.

## 7. Nits

- **N1.** The five mutation header lines run to about 120 columns. Round 15 (d)'s long-line allowance covers only hash references.
- **N2.** The struct doc says "exactly as the kernel's own `StreamRegistry` acts". The kernel also sweeps from `sweep_expired` at the top of `viewport_query`, before the lease. §2 item 7's "as in the kernel" is the accurate strength.

## 8. Gate-log note

Reviewer gate attempt 1 for `data-plane-stream-registry-bound` at `b6d1664`: FAIL on two record-precision defects; the code, tests and seams pass.
- **What was reproduced:** §4's test-first prediction (T1 200≠64, T2 73≠65, T3 ok) and all five mutations. M4 fails T4 at its backdating lookup, as Amendment 1 row 3 states. All four Amendment 1 hashes match at `370b2ba`, and row 4's 243 + 327 = 570 and row 5's fmt and CI facts check out.
- **Suites:** data-plane and kernel tests (248 passed), clippy, node 311/311, and verify-cites, -quotes, -test-claims, -mutation and `--offline` are all rc 0, with zero CR bytes.
- **Blocking:** (B1) the five script-copied mutation excerpts carry bare `panicked at …:L:C` locations, added by `e061cb1` into the files it edits (§8 item 15; round 14). The T4 and T5 locations belong to the uncommitted mutated tree, not the `2b99551` the header names. (B2) Amendment 1 row 5's fmt claim does not name the rustfmt version (round 15 (c)).
- **Fix:** one class-3 test-text correction to the five excerpt lines, plus one appended correction row naming rustfmt 1.9.0-stable (8bab26f4f6), with a superseded index. That is within the record cap's two correction rounds.
- **For the architect:** whether row 5's record discharges §9's "fmt green" requirement (S1).
