Reviewed: PR #300 at 1b71dd6c2a966dab864337fed33d58883be226ed (base 72842b52), gate 1, architect
(branch and commit: `cut/clippy-deny-warnings-workspace-12a @ 1b71dd6c2a966dab864337fed33d58883be226ed`)

Verdict: PASS WITH NOTES

Every sentence here is mine (the architect's) unless it sits in backticks as code from the file cited. I have no shell, so I cannot show the packet's sha256 (the brief gives 9596 bytes, sha256 ef1cde66…). I compute no hash and ran no cargo, git, gh or node command. I leave no background shell. I read the rulings (Part 1, items 1 to 9) first, then the packet, the form, the worker's report, my draft, the head files, the count files and the cfg-boundary files.

## Findings by class

**Correctness:** none.

**Evidence:** none that blocks.
- Part 1 item 9 keeps mutation observations as the gates' own. I can make none: I have no shell. My reading of M12, M16, M17 and M26 is the code at the head plus the worker's failing lines. The reviewer's re-run is the observation.
- I could not read the L7 Linux log myself. The custodian's filing note records the read at the head (job of run 42476849029). The code at the head makes it structural: the const now exists only under `#[cfg(windows)]` (check 4).

**Documentation:** none in this PR's diff.
- The packet's known finding 1 is the worker's report saying the 13 outside rows are "in engine files that no slice names". That is untrue, and I confirm it is untrue (check 2).
- The report is a filed hand-back on main, outside this PR's eight files, and its disposition stands: the custodian's next ledger entry withdraws the item. Nothing in this PR has to change for it.

**Notes (preferences, no acceptance condition):**
- N-a: Row 2's fn-level allow covers every arm of `attr_row_bytes`. A future arm that repeats a cost by mistake would also be silent. My draft accepted that scope under OPEN-3 (c), and I keep it.
- N-b: `WATCH_BUFFER_BYTES` still reads `pub(crate)`. Inside the private `mod windows_watch` its effective reach is now the `watch` module only. No reader is lost: a Grep finds only `engine/src/watch.rs:222` and `:250 @ 1b71dd6c`, plus a comment at `engine/tests/source_watch_adapter.rs:276`. The form's "keeps … `pub(crate)`" is true as written. This needs no action.

## Checks

**1. Out-of-scope's four categories.** All four hold.
- **ADR: none.**
  - The packet's numstat names only the eight files, and `engine/src/envelope.rs` is not among them.
  - I read `engine/src/envelope.rs:199-223 @ 1b71dd6c`. The `id_verified_rows` and `id_js_exact` inserts are conditional at :214-216 and :221-223, as the form's M16 and M17 pins describe.
- **Security: none.**
  - `engine/src/watch.rs:126 @ 1b71dd6c` reads `pub(crate) const WATCH_BUFFER_BYTES: usize = 65536;`. Its two readers are :222 (`Box<[u8; WATCH_BUFFER_BYTES]>`) and :250.
  - Nothing ADR-020 (origin admission), ADR-009 (licence) or ADR-021 (row filter) governs is touched. Row 12 edits a test oracle in the filter-admission suite, `is_declared_cast` (`engine/tests/filter_type_admission.rs:1266-1268 @ 1b71dd6c`). The edit is an equivalence (check 5), so the admitted set the oracle checks is unchanged.
- **Wire: none.** No protocol/ file, no envelope key and no envelope value is touched.
- **Guarantee: none.**
  - `attr_row_bytes` is byte-identical under its allow (`engine/src/stream.rs:2323-2378 @ 1b71dd6c`). stream.rs's numstat of 4/1 is the two allows, the alias line and the rewritten `let cases`, with the old `let cases` as the one deletion.
  - No test is renamed, and every message is kept: `"unverified width must not read as exact"` at identity.rs:322, `"bound {i}"` at publish_stream.rs:535, and trace.rs:639 and :660.
- **The route still applies.**
  - Size: 8 files, 42 lines, against §21c's ≤ 8 files and ≤ 150 lines (`governance/AUTONOMY.md:350 @ 1b71dd6c`).
  - None of §21a's four categories is touched (:317-327). "Any property currently under test" is met only through test-side rewrites, and those keep their strength by M12, M16, M17 and M26.
  - §36 (:692) holds: no string a user sees, no red-line text, and the packet's rule (00) list shows no branch writing the eight files. So §25 (e) stays set aside.

**2. The slicing against my draft.** The packet's reading holds.
- 12a is my table's 12a row plus L7 (draft :29).
- The 13 outside rows are in `admission_p4_corpus.rs`, `admission_property_campaign.rs`, `import_layout_5gb_digest.rs`, `import_layout_5gb_fixtures.rs`, `import_layout_digest.rs`, `import_layout_fixtures.rs` and `lod_tier_measurements.rs` (head count file, lines 4-16). That is exactly the 12b row's seven files (draft :30).
- 13 is also the 12b row's count: rows 7-11 (five) plus 18-25 (eight).
- The base and head OUTSIDE lists are equal line for line (base count lines 17-29, head lines 4-16).
- So no row lies in a file no slice gives. OPEN-C's red line is not reached, and nothing from OPEN-C goes to the human.

**3. The allows.**
- Rows 1 to 3 each have one item-level attribute with no comment:
  - `engine/src/rowgroup.rs:331 @ 1b71dd6c`, above `pub fn build(` (:332; signature :333-341, 8 parameters, unchanged);
  - `engine/src/stream.rs:2323 @ 1b71dd6c`, above `fn attr_row_bytes`;
  - `engine/src/stream.rs:2463 @ 1b71dd6c`, above `fn flush(` (10 parameters, :2465-2474).
- The code under each is unchanged, by the numstat arithmetic above (rowgroup.rs is 1/0). This is N7 item 1 and my OPEN-3 (c), as taken.
- **The identical arms are a design, not a defect.**
  - The blocks that repeat are `BooleanArray` → 1 and `Int8`/`UInt8` → 1 (:2347-2352).
  - The fn costs each type family in its own arm, and it states the intent at :2362-2363 ("its own 4-byte arm, not folded into the 8-byte Int64/Float64 one").
  - Boolean's 1 byte for a bit-packed value is an over-count in the direction the fn's own rounding sentence accepts (:2331-2332). Its only requirement is that the cost depends on row content alone.
  - Folding the two arms gives the same values, so the allow hides no wrong cost.

**4. L7 against OPEN-2 (A).** It holds.
- The const and its two doc lines now sit inside `#[cfg(windows)] mod windows_watch` (:101-102) at `engine/src/watch.rs:124-126 @ 1b71dd6c`. The words are unchanged and only the indent is new.
- The `use super::{…}` line at :103 now lists `ArmOutcome, ArmedWatch, WatchSignal, WatchSink` only.
- Off Windows the item is not compiled, so no `dead_code` can be raised for it.
- The value table row still holds: `governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:392 @ 1b71dd6c` (`65536, DWORD-aligned`, per handle, overflow is `CoverageLost`) is in §7 (:388), which the doc's "(§7)" names.
- No OS-cfg site is added, moved or removed (PORTABILITY R2, `state/directives/PORTABILITY-2026-09-30.md:35-47`; watch.rs is the "File watching" boundary).
  - The three sites are :84, :88 and :101 at the head, against :88, :92 and :105 at the base. That is a shift of 4 lines from the deleted block above them.
  - Both cfg-boundary files end `cfg-boundary: 18 sites in 6 files, 0 outside every boundary`.
  - The test pins the count per file, not lines: `scripts/plan/cfg-boundary.test.mjs:84 @ 1b71dd6c` has `"engine/src/watch.rs": 3`.

**5. Row 12 under OPEN-A (a).**
- `if in_division && int_info(from).is_some() && (to == "FLOAT" || to == "DOUBLE") { return true; }` (:1266-1268) is equivalent to the nest it replaces.
  - The nest had no `else` at any level.
  - `int_info` (:1208-1222) is a pure match.
  - `&&` tests the three conditions in the nest's order, and the next statement (:1269) is reached in exactly the same cases.
- M12 flips the middle conjunct. That makes integer-into-DOUBLE under `/` fall to `fb <= 32` (:1288-1289), so 64-bit operands become undeclared. The worker's kill line is `90 B-T1 counterexample(s)` at :1667, which is the form's :1671 minus the 4 removed lines.
- M12 is the mutation that observes the change. Its re-observation is the reviewer's.

**6. The owner's index under OPEN-B (a).**
- `engine/README.md` is not in the diff.
- The index rule ("Updated in the PR of every piece that changes what a pointer points to", `engine/README.md:535 @ 1b71dd6c`) is not triggered.
  - Every pointer at :538-567 is a path or `file::test` name. No pinned test in the eight files is renamed: `identity.rs::a_duplicate_id_column_…`, `publish_stream.rs::a_publish_partition_…` and `filter_type_admission.rs::each_corpus_row_…` are untouched.
  - `WATCH_BUFFER_BYTES` (`engine/src/watch.rs`) at :567 is still true.
- The pending line is this form's addition to :557. That the PR body names it is the packet's statement; I could not read the PR body.

**7. N7's records and N5's list.**
- PORT-1 :66 (`governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:66 @ 1b71dd6c`) is unedited.
  - It is a historical pin @ d310206: the pin is authoritative for port-1's claim, and the tree is authoritative for watch.rs after 12a.
  - 12a claims no warning-free Linux build (packet known finding 3).
- The misattached doc at `engine/src/stream.rs:2299-2304 @ 1b71dd6c` is unedited and still runs into `decode_dictionary_chunk_column`'s doc.
- N5 at the head:
  - only the eight files changed (packet numstat);
  - the code under each allow, the test names, assertions and messages, and the case strings are unchanged (stream.rs's one deletion is the old `let cases` line);
  - the const's name, value, visibility token and doc words are unchanged;
  - the three cfg sites are unchanged (shifted by 4 lines only);
  - no `pub` signature changed;
  - the value table row is still true.

**8. Comments.** The diff's only changed comment lines are watch.rs's two moved doc lines (:124-125), and each clause holds at the head:
- (a) "The declared buffer size for each handle's `ReadDirectoryChangesW` call (§7)" is true. :250 sizes each `issue_read` buffer by it, :263 passes `buffer.len()` to the call, and §7 is the form section that declares it.
- (b) "DWORD-aligned" is true of the value: 65536 is a multiple of 4.
- (c) "Overflow past it is [`WatchSignal::CoverageLost`], never silently dropped" is true. A 0-byte completion emits `CoverageLost` (:343-349). The link resolves through :103's `WatchSignal`.

The comment at stream.rs:3857-3859 now sits between the new alias (:3856) and `let cases` (:3860). Its words are unchanged and it still describes `cases`. I have no replacement words to give.

## For the human (marked as such)

- Nothing from OPEN-C reaches you (check 2).
- On your return you review the settlement's takes: OPEN-1 (A), OPEN-2 (A), OPEN-3 (c), OPEN-A (a), OPEN-B (a) and OPEN-C (a). Each holds at the head as checks 2 to 6 read it.
- No sentence in this diff is your wording or red-line text.

## The packet's gaps (Part 2, section C)

- The diff was a locator only. I rebuilt the hunks from the numstat and reads at the head. The base side of the 16 hunks inline (7770 bytes) would have let me show byte-identity directly rather than by arithmetic.
- The PR body text, which check 6 needs, was not given. The packet states it, and I have no shell.
- The L7 log result was a locator only, and I have no shell. I took the result from the custodian's filing note on the worker's report.

Paths:
- C:/dev/wt/c12a/engine/src/watch.rs
- C:/dev/wt/c12a/engine/src/stream.rs
- C:/dev/wt/c12a/engine/src/rowgroup.rs
- C:/dev/wt/c12a/engine/tests/filter_type_admission.rs
- C:/dev/spatial-ide/governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md
- <S>/c12a-head.count
- <S>/c12a-cfg-head.txt
