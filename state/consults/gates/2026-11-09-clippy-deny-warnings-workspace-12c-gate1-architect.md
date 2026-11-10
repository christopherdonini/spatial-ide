Reviewed: PR #303 at 1889a28a69698be2f87e519668d634c2e52cdd19 (base f703b720), gate 1, architect
Verdict: PASS WITH NOTES

All words below are mine, the architect's, unless they sit in backticks as code, which is byte-copied from the file cited. Branch: `cut/clippy-deny-warnings-workspace-12c` @ 1889a28a69698be2f87e519668d634c2e52cdd19. I have no shell, so I cannot show the packet's sha256 (10000 bytes, 11ea286c… as the brief gives it). I ran no cargo, git or gh, and I leave no background shell. Before anything else I read the Part 1 rulings, items 1 to 9 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`).

## Findings by class

**Correctness: none.**

**Evidence: none that blocks.** One limit applies to this gate. Part 1 item 9 says mutation observations stay the gates' own. I cannot re-observe M36 to M38, the guard runs or the suite at the head. For them I read the worker's output files and the two Linux logs. Re-running them at the head is the reviewer's half of this gate.

**Documentation: one finding, must-fix before the merge. It is a record on main, not a line in the PR's diff. This is not the human's wording.**
- D1. The custodian's filing note in `state/consults/2026-11-09-clippy-deny-warnings-workspace-12c-worker-report.md` (line 1, the note) says the exit codes of the guard runs and the mutations are in the worker's output files. That does not hold for the six files I read whole: `<S>/c12c-g34.txt`, `c12c-g40.txt`, `c12c-g41.txt`, `c12c-m36.txt`, `c12c-m37.txt` and `c12c-m38.txt`. Each holds the panic line, the message line, `test result: FAILED…` and cargo's `error: test failed, to rerun pass …`. None prints an exit code.
  - Replacement words for that clause (mine): "the guard runs' and the mutations' output files hold each run's panic line, its message and cargo's `error: test failed` line; they print no exit code, which the report states."
  - Clause check: the panic line, the message and the `error: test failed` line are present in all six files (g34 :11-12 and :21; g40 :11-12 and :21; g41 :11-12 and :21; m36 :12-13 and :22; m37 :12-13 and :22; m38 :12-13 and :22). No line in any of them prints an rc. The report states rc 101 for each (worker report :50 and :55).
  - The record is append-only, so the custodian decides how the correction is carried.

**Notes (preferences, not conditions):**
- N-a. The form's Tests+mutation line expects the -D exit "from rows 27-32 in kernel/src", and its N3 holds the reading that clippy lints only the package `-p` names. Both are now observed untrue for clippy 0.1.97 (8bab26f4f6 2026-07-14) (`<S>/c12c-ver.txt`, worker report :9). The -D run checked the workspace path dependencies and stopped at `could not compile \`spatial-renderer\` (lib) due to 2 previous errors` (`<S>/c12c-deny.txt`:30). The line was marked recorded, not claimed, and the rc matched the 101 expected, so this is not an Evidence defect. The worker report (:46) already records the real stop. If the done commit appends a closing amendment, it can cite that report line by reference.
- N-b. Rule (00): `cut/b1-close-nul-names` shares kernel/tests/publish.rs (packet §6). The packet calls it a record branch kept by the human's ruling of 2026-09-30, item 2, not a piece in flight. I agree that is not an overlap under rule (00).

## Checks

1. **Out-of-scope's four categories.**
   - ADR: none, holds. ADR-004 Amendment 4 names `kernel/tests/wire_bytes_invariant.rs` as its proof (docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:51-56 @ 1889a28a…). Its two tests keep their names (wire_bytes_invariant.rs:191, :399 @ 1889a28a…). Each gains one attribute line only (:190, :398), and numstat for the file is 2/0 (packet §1).
   - Security: none, holds. No product file is touched, and nothing ADR-020, ADR-009 or ADR-021 governs.
   - Wire: none, holds. No protocol/ path. `TRACE_SERIAL` and `serial()` are unchanged (:183-187).
   - Guarantee: none, holds.
     - The three guards are byte-identical under their allows (indexed_budgets.rs:567-574, slice_budgets.rs:465-472, support/mod.rs:341-349 @ 1889a28a…).
     - No release run is made and no figure is changed (kernel/RESULTS.md is not in the diff).
     - No test is renamed, and the Windows FFI is unchanged (check 5).
   - The route still holds: 17 lines over 7 files is within §21c (governance/AUTONOMY.md:350), with no exposure surface, dependency or user-visible behaviour. §36 (governance/AUTONOMY.md:692) sets aside §25 (e) for a filler. Even under §25 (e), the Out-of-scope line asserts none of the four categories, and the three rewritten assertions keep their strength (check 4), so N2's "nearest category" is not touched.

2. **The slicing.**
   - At the base, `<S>/c12c-base-count.txt`:2-13 lists N1's eleven rows in the seven files. At the head, `<S>/c12c-head-count.txt`:2 lists 0.
   - The eight rows outside the seven files have the same keys at the base (base-count :24-31) and at the head (head-count :13-20): publish-bundle.rs:149, lib.rs:414, lib.rs:489, boundary.rs:536, publish/mod.rs:839, skp.rs:277, canonical.rs:240, style.rs:10.
   - These are exactly the Windows read's rows 27 to 32, 44 and 45 (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:74-79, :91-92 @ 1889a28a…). They are also exactly my table's 12d row and its seven files (state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md:32 @ 1889a28a…). So OPEN-D's red line, a row in a file no slice gives, is not reached.
   - The renderer rows:
     - For 12c, nothing follows beyond N-a.
     - For 12d, nothing changes in the outline. Its Scope already holds canonical.rs and style.rs, and its claim is the workspace -D command (draft :147), which lints every member anyway.
     - When 12d's form is drafted, it should not carry N3's `-p` reading, and the base JSON it records (draft N5, :169-170) will list rows 44 and 45 inside its Scope.
     - The observation settles my draft's last unsettled item (draft :385): workspace path dependencies are linted under `-p`.
     - For 12e, nothing follows: its step is `--workspace`.

3. **The allows.**
   - Row 33: the allow is at statement level on `let gate_overall` (import_layout_factorial.rs:1858-1859 @ 1889a28a…).
   - Row 35: the allow is at statement level on `let art` (indexed_budgets.rs:1166-1167).
   - Rows 34, 40 and 41: each allow sits directly above its `fn refuse_debug` (indexed_budgets.rs:567; slice_budgets.rs:465, below the doc comment at :464; support/mod.rs:341). This is my section 3 form (i).
   - Rows 42 and 43: each allow sits between `#[tokio::test(flavor = "multi_thread")]` and `async fn` (wire_bytes_invariant.rs:189-191, :397-399).
   - None of the allows carries a comment (N7, item 1). The head JSON lists none of these rows, so no fallback was taken (packet §5 item 2; head-count :2).
   - OPEN-A: holding the guard across the awaits is the file's documented design, not a defect that the allow hides.
     - The file's doc says the hold across `.await` is deliberate, and why: `block_on` runs on the test's own thread, and the guard is never moved into a task (wire_bytes_invariant.rs:178-182).
     - The race piece's record argues the same (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:128-130 @ 1889a28a…).

4. **Rows 36 to 38 and row 39.**
   - The head has `assert!(!…)` with the same expression in each case (publish.rs:279, :280, :957 @ 1889a28a…). Each mutation site occurs once in kernel/src (bundle/mod.rs:874, :889, :890).
   - M37 panicked at publish.rs:279:5 (`<S>/c12c-m37.txt`:12-13).
   - M38 panicked at :280:5, which shows that :279 passed with `hashed` still false (`c12c-m38.txt`:12-13).
   - M36 panicked at :957:5 (`c12c-m36.txt`:12-13).
   - So each test reaches its rewritten line, and each line fails on `true`. The suite passing at the head (worker report :48) shows each still passes on `false`. `.unwrap()` is unchanged, so the strength is kept.
   - Row 39: `n` is the `usize` returned by `AtomicUsize::fetch_add` (scale_pass.rs:184, :190). `n.is_multiple_of(50)` (:191) equals `n % 50 == 0` for every usize, because the divisor is nonzero.

5. **L35 and L42.**
   - Each non-Windows stub's `Counters` now holds only `working_set` and `private_usage`, inside the unchanged `#[cfg(not(windows))] mod procmem` (indexed_budgets.rs:205-215; slice_budgets.rs:182-192 @ 1889a28a…). `sample()` still returns `None`.
   - The Windows `#[repr(C)]` structs keep `pub peak_working_set` (indexed_budgets.rs:172; slice_budgets.rs:148), and their FFI is at :184-202 and :161-179.
   - Numstat (indexed 2/1, slice 1/1) leaves no other changed line in either file.
   - No cfg attribute is added or removed (packet §1: 0 cfg lines).
   - The non-Windows behaviour is unchanged, so this is not a materially changed OS-dependent feature under R3 (state/directives/PORTABILITY-2026-09-30.md:49). cfg-boundary excludes tests/ paths (scripts/plan/cfg-boundary.mjs:10, :47 @ 1889a28a…). N4's reading holds.
   - Linux: the `cargo build --workspace --tests --locked` step compiled spatial-kernel and finished with no warning line, in both runs: `<S>/c12c-ci-linux-129243243090.log`:375-381, which fetched 1889a28a (:94, :108), and `c12c-ci-linux-129243973831.log`:390-396, the merge 9d94998 of 1889a28a into ea92b0fb (:121). Neither log has a line naming `peak_working_set` or `never read`.

6. **The owner's index under N7: holds.**
   - kernel/README.md is not in the diff, and no pointer's target moves.
   - The pointers' test names exist at the head: `the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares` at publish.rs:1193, and the two wire-bytes tests that kernel/README.md:378 names at wire_bytes_invariant.rs:191 and :399.
   - The preregistration list at kernel/README.md:387 does not yet name 12c's form. That stays lead-data's after-merge update.

7. **N5's records: "named, not amended" is right for each.**
   - The engine cites `kernel/tests/slice_budgets.rs:472-486` and `:472` (engine/tests/common/mod.rs:31, :61; engine/tests/lod_tier_builder.rs:9 @ 1889a28a…) land at the head on the same bytes as at main:
     - :472 is `refuse_debug`'s closing brace, and :486 is `let canary_start`;
     - the fixture write is at :497-511.
     - So they were stale before 12c, and 12c shifts them by 0.
   - kernel/RESULTS.md:4711 and :4721 are historical run output. Row 39 is a one-for-one line, so they are unaffected.
   - In WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE, :131 records what that piece did. From 12c's merge on, the tree is authoritative for the current state, and the pin for what that piece claimed.
   - M-1 (:148-152) mutates `serial()`, which 12c leaves unchanged, so its premise stands.

8. **Comments.** The packet counts 0 changed comment lines. My reading of each changed line at the head agrees: 7 allows, 3 assertions, 1 condition and 2 deletions. Nothing to check.

## For the human

Nothing. No sentence here is the human's wording or red-line text, and OPEN-D's red line is not reached (check 2).

## The packet's gaps

- The packet gives no exit codes, applied diffs or porcelain for M36 to M38 or the guard runs. The output files do not carry them either (D1), so rc 101 and the reverts rest on the report's statements alone.
- The diff is given only as a git locator, which I cannot run. I read every changed site at the head and relied on the packet's numstat for "no other line changed".
- CI status is not given (by design). I read only the two Linux logs. The status of the other checks is the custodian's history (the filing note's 15:48:54Z read).

Files read for this gate: C:/dev/spatial-ide/governance/forms/kernel/CLIPPY-DENY-WARNINGS-WORKSPACE-12C-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-11-09-clippy-deny-warnings-workspace-12c-worker-report.md, C:/dev/spatial-ide/state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md, and the seven Scope files plus kernel/src/bundle/mod.rs under C:/dev/wt/c12c.
