*Custodian's filing note (2026-09-26): the architect gate's attempt-1 report for PLAN node `data-plane-stream-registry-bound`, reviewed at cut/data-plane-stream-registry-bound @ b6d1664, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: BLOCK (record only). `cut/data-plane-stream-registry-bound` @ `b6d1664`.** The code, the seams, the caller rule, ADR-010 rule 6, principles 7 and 8, §2 item 6 and all fifteen §8 items pass. One row of Amendment 1 fails by name: row 5, under round 15 (c). The fix is one appended sentence. This is record-correction round 1 of 2.

## 1. Blocking

**B1. Amendment 1, row 5: a tool claim that does not name the tool.**
- **Rule:** round 15, clause (c). The gate fails by name "a tool claim without the tool's commit".
- **Defect:** row 5 says `cargo fmt --check` is not clean at `522493a` ("seven files of the crate") and at `e061cb1`.
  - It names the two tree revisions but not the rustfmt that produced the result.
  - rustfmt's output depends on its version. The worker's report says no `rustfmt.toml` pins one (`state/consults/2026-09-26-stream-registry-bound-worker-report.md:16`).
  - No cited run contains the "seven files" count. Line 16 of the report says only that the touched files and untouched sibling files show diffs that were already there.
  - The row's closing reference (report lines 13–23) is attached to "the worker's clippy run and the other suites", not to the fmt claim.
- **Smallest fix:** append one row after row 5 (append-only; do not edit row 5):
  `6. **Class 3, row 5's tool:** row 5's `cargo fmt --check` results are <the worker's | the custodian's> runs under rustfmt 1.9.0, toolchain rustc 1.97.1 (8bab26f4f 2026-07-14); `state/consults/2026-09-26-stream-registry-bound-worker-report.md:13 @ 370b2ba sha256:<hex>`.`
  - If the seven-file count came from the custodian's own run, the row says so.
  - If it did not, the row reduces the count to what report line 16 proves (round 15 (b)'s reduction).
  - The reviewer recomputes the hash, then re-runs `cargo fmt --check -p spatial-data-plane` at `522493a` and at `e061cb1` under that rustfmt and confirms the file lists.

## 2. Notes (non-blocking)

- **N1. Row 4's class.**
  - "Class 2, round 23, item 4, O7" resolves: the RULED block's "O2 and O4–O9 as recommended", and O7's text at `state/questions/round-23.md:34`.
  - But O7 was ruled as one of the markers of the test-claims follow-ups form (item 4's heading). Using it here is precedent, not a general ruling.
  - The template's route when no class fits is a finding to the human (`docs/PREREGISTRATION-TEMPLATE.md:98-99`), and #129's class 8 is that route. The PR body should say "class 2 on O7's precedent, pending #129".
  - Class 2 asks for "the reason and the evidence" (template:106-109), and row 4 gives no reason. The only reason on record is report line 36, which also carries the short-form label "Class 6" and quotes class 6's heading with a lowercase "budget" (the template has "**Budget deviation, Scope not edited**", template:125). Referencing it would bring both along.
  - Under the record cap this is not required for a pass.
- **N2. The mutation records under §8 item 15.**
  - Each record has a panic location of the form `path:line:col`, e.g. `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:632` and `C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs:208`.
  - These are script-copied run output: evidence, not references. They are headed "run at 2b99551" with the mutation applied.
  - For T4 and T5, the line numbers are those of the mutated `server.rs`, not of `2b99551` as committed.
  - This is not a bare cite under §8 item 15 or round 14.
  - The reviewer should confirm that each "Declared excerpt" is one contiguous span of the captured output, with no unmarked internal elision (round 11).
- **N3. Test threads.** The suites ran with `--test-threads=1` (report:14-15). §9 names the plain command, and CI runs `cargo test --workspace --locked` in parallel (`.github/workflows/product-ci-rust.yml:221`). The reviewer should run T1–T5 with default threads or read the branch's CI.
- **N4. §9's fmt and clippy line was my drafting defect.** "As CI runs it" is false: no workflow runs `cargo fmt` or `cargo clippy` (checked across `.github/workflows/`), which row 5 correctly records.
  - The worker chose to leave the new test file not rustfmt-clean (report:16). No gate enforces fmt, so it is not a block.
- **N5. T4 and T5 need the monotonic clock to be about 301 s past its origin** (`checked_sub(..).expect(..)`, `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:653-658` and `:707-712`). This is the kernel's precedent shape.
  - Paraphrase: the expect text states that condition as a fact and mixes process uptime with machine uptime.
  - Test-only text; no fix required.
- **N6. §2's seam table omits one reader:** the `refusals()` read in `kernel/tests/concurrency_in_situ.rs:410`, inside `the_admission_slot_is_released_when_the_stream_ends_not_when_the_peer_leaves`.
  - `refusals` is untouched: still an `AtomicU64` outside the mutex, with the same body. §4 lists that test as existing and green.
  - No risk.
- **N7. A defect already on main, out of scope for this piece (ledger finding).** `protocol/data-plane/src/server.rs:356` on main: the operator-visible crowded-start detail string contains two runs of 22 spaces, from a lost `\` continuation.
  - §8 item 14 forbids changing that string in this piece, so it needs a separate cut.

**Notes 1 and 2 for the PR: the built code matches both.**
- **Note 1:**
  - The struct doc says the data plane's cancel reads nothing from this registry (`C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:140-141`).
  - `drive` and the drain are unchanged.
  - T3 proves that a CANCEL sent during the drain is still observed by the producer.
  - T4 proves there is no drop at the terminal.
  - So the ruling's instruction is honoured. Its reason, answering a late cancel, belongs to the kernel's registry, not this one.
- **Note 2:** at the ceiling, `prune_locked` evicts the earliest terminal record (`:203-205`). No admission path reads the registry, and `refusals` is unchanged.

## 3. §8, item by item (all pass)

1. **No entry is removed by its own `record_terminal`.** The terminal is pushed at `:175` and pruned at `:180`. It is the newest record and just stamped, so the count step cannot reach it (floor `:115`) and it is not over-age. T4 fails by name under M4.
2. **No live entry is removed.** `streams.retain` at `:207` removes only ids taken from `terminals` at `:197` and `:204`.
3. **Admission is unchanged.** `refusals.fetch_add` at `:453` is intact, and the registry never refuses a stream.
4. **Reads do not prune.** `snapshot`, `terminals`, `refusals` and `active` (`:211-228`) take the lock and clone only.
5. **Signatures and order are unchanged.** `snapshot()` keeps admission order (`retain` preserves order), and `terminals()` keeps record order with the `Instant` dropped.
6. **The only new `pub` items are the two constants.** `StreamRegistryState`, `TerminalRecord` and `prune_locked` are private. `lib.rs:50-53` does not re-export the constants.
7. **No injectable clock and no `#[cfg(test)]` branch in product logic.** T4 and T5 backdate the record under the registry's own lock, as the kernel's precedent does.
8. **Durations:** the only durations are declared constant values. `HANG_BOUND` is labelled a hang bound (`stream_registry_bound.rs:24-26`), and the 5 ms sleeps are poll intervals, not claims.
9. **No claim that this registry answers a cancel.** `:140` and `:106` state the opposite.
10. **Real shape:** the tests use the real `serve`, a loopback socket, a `tokio_tungstenite` client, and ids read from OPEN. The id parse (`:148-151`) matches `adapter_ws.rs:89-92`.
11–13. **Files, Cargo and existing tests:** the numstat covers only the two files. The reviewer's `git diff --stat` is the proof that nothing else changed.
14. **No new string.** The `Err` arm keeps its detail text (`:531`, identical to main `:447`).
15. **No byte figure.** The mutation-record line numbers are covered by N2.

**The other gate items (all pass):**
- **ADR-010 rule 6:** both constants are declared with compile-time floors (`:115-116`), and the eviction strategy is stated in the struct doc.
- **Principle 7:** the prune is O(≤ 65) under a lock that never spans an `await`.
- **Principle 8:** the bound is documented, and `snapshot().last()` still names the newest stream.
- **Seam table:** each reader's actual interface on main matches its row.
  - The `snapshot().last()` readers are `end_to_end.rs:360/396/419/424`, `candidate_a.rs:310/465/469`, `slice_budgets.rs:536/567/610` and `indexed_budgets.rs:936/957/1342`. Each reads before the client closes, so the stream it reads is live and admitted last.
  - The other readers are `candidate_a.rs:532/546` (`snapshot().len()`, `refusals()`) and `candidate_a.rs:607-622` (`terminals()`), plus `concurrency_in_situ.rs:300-302` (`len() == 3` and index `[1]`, well under 64).
- **Caller rule:** each constant has a product reader, `prune_locked` (`:196` and `:203`). The test readers do not count toward the rule.
- **§2 item 6, by reading:** after `record` at `:508` there are exactly two exits.
  - The `Err` arm computes the detail once (`:531`), drains (`:532`), then records `ProducerFailed(detail)` (`:534`).
  - The normal path records at `:552`.
  - There is no other return or `?` between.
- **Discharge claims:** there are none. Amendment 1 and the diff's comments contain no "discharged" or "done" clause.

## 4. Amendment 1, row by row

- **Row 1: pass.** Lines 7–9 of the report are the commits. The reviewer recomputes the hash and checks that `2b99551` alone carries the fix and T1–T5.
- **Row 2: pass.** Report line 11 matches §4's test-first predictions: T1 at 200 ≠ 64, T2 at 73 ≠ 65 (that is, +9 not +1), T3 passing.
- **Row 3: pass.** The T4 record's excerpt (`server.rs:622-634`) fails with "recorded above", the `expect` of the backdating lookup (`:648-652`). That lookup comes before the retention assertions (`:666-673`).
  - The property of not dropping at the terminal is still discriminated, because T4 fails by name under M4.
  - Only the retention assertion's own discrimination is unobserved, which is what the row says.
- **Row 4: pass, with N1.** 243 + 327 = 570 against the declared 450. §7 is not edited. The reviewer recomputes the numstat.
- **Row 5: BLOCK (B1).** The CI half is verified: `product-ci-rust.yml` runs only `cargo build` (`:210`) and `cargo test` (`:221`).

## 5. Gate-log line

`data-plane-stream-registry-bound attempt 1 @ b6d1664 — architect BLOCK (record only): B1 Amendment 1 row 5's cargo fmt --check result names no rustfmt version or run (round 15 (c)), fix = one appended class-3 row naming rustfmt 1.9.0 / rustc 1.97.1 (8bab26f4f) and whose run, or reduce the seven-file count to report:16; N1 row 4 class 2 is O7's precedent (piece-scoped), pending #129, no reason carried; N2 the excerpts' panic line numbers are run output from the mutated tree, not cites; N3 suites ran single-threaded, read the branch CI; N4 §9's fmt/clippy premise was a drafting defect; N7 the crowded-start string on main has lost-continuation spaces (ledger); code, §8 items 1–15, seams, the caller rule, ADR-010 rule 6, principles 7 and 8 and §2 item 6 pass; notes 1 and 2 match the built code; record round 1 of 2.`

Files:
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\STREAM-REGISTRY-BOUND-PREREGISTRATION.md`
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs`
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs`
- `C:\dev\wt\stream-registry-bound\state\consults\2026-09-26-stream-registry-bound-worker-report.md`
- `C:\dev\spatial-ide\.github\workflows\product-ci-rust.yml`
- `C:\dev\spatial-ide\state\questions\round-23.md`
