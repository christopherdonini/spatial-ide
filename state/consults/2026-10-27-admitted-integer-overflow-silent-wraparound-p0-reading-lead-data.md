*Custodian's filing note (2026-10-27): lead-data's read-only reading of O1's second P0 against the form, filed at the REPORT PATH its brief named. Its result: P0 meets the three clauses of the human's pass criteria and §5's decidable predictions with no invalidator; W-1 takes the architect's replacement words, since L1 completed rather than ending in the fixed detail. Its blocking question goes to the human: P3 and T-c-ar-s Q3 on the statistics files completed equal to X with no error over data that overflows; does "every overflow ends in the fixed detail" accept that (else OPEN-4 (A))? Its question for the architect (whether the sefd run with both config entries absent counts as M1) waits for the human's answer. The run 21:58:35Z to 22:03:29Z by its transcript (Read 9, Grep 8, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 11e3d1c854ef39182780dad72e65c8e8ddaecb50ae41ad3b75d4614396351089.*

---

Read: O1 P0 against the form

Tag: node:admitted-integer-overflow-silent-wraparound@g1. lead-data, advising only: I grade, decide and write nothing. I cannot compute sha256 values, so I have not checked the brief's hash, and I cannot give a hash for this reading. The custodian computes it when filing.

Key to the short names below. Line numbers are from the main checkout as I read it, HEAD c59b2424 according to the session's start snapshot.
- F = engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md
- R2 = state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md
- R1 = state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-run-tester-high-report.md
- DR = state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md
- DA = state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md
- DD = state/directives/2026-10-27-o1-route-a-continues-duckdb-export-decorations-off-by-the-header-switch.md

Besides the brief's list I read: the engine and kernel owner's index sections; KNOWN-LIMITATIONS.md item 15 (lines 156-159); the amendment classes in docs/PREREGISTRATION-TEMPLATE.md (lines 101-132 and 167-170); a Glob of engine/tests/*.rs; and a Grep of engine/src for extension autoload.

## 1. Criteria, predictions and invalidators against what R2 records

§5 has no heading called "pass criteria". The form's pass criteria are the ones F §9 P-7 points to (F:275, "the pass criteria at `:11`"), which is DR:11, read with OPEN-1 and OPEN-2 as ruled (DA:17, DA:18). I take DR:11's three clauses first, then §5.

**DR:11, clause 1, every overflow ends in the fixed detail**
- Met for every column product the engine evaluated. The 35 "fixed" groups are at R2:111-115, R2:120 and R2:126-132.
- OPEN-1 (A) was never needed: the B3 cells raised at the execute site (R2:112, R2:114), not at fetch.
- L1, L2 and L4 completed equal to X with no error (R2:121-124). OPEN-2 (A) (DA:18) counts that as agreeing with the oracle.
- **Not decidable from the report: the overflow cells that completed rather than erroring.** These are P3 `(v * v) IS NOT NULL` on the six statistics files, and T-c-ar-s Q3. They completed equal to X with no error (R2:116, R2:129), although those files hold overflowing values: their P1/P2 runs end fixed.
  - §3 registered this outcome in advance as allowed ("the fixed detail or X", unpredicted; F:163).
  - T-C only asserts that no wrong rows come back (F:184).
  - OPEN-2 (A) covers literal-only products only, so it does not reach these cells.
  - R2 does not show why the product was not raised: the P3 plans are not in it (R2:113 counts EXPLAINs, it does not show them).
  - What would decide it is the human's reading of DR:11's "every overflow": an overflow DuckDB actually evaluates, or every predicate over data that overflows. The P3 EXPLAINs would show the mechanism.
  - If the clause is read the second way, OPEN-4 (A) (DA:18, DD:13) applies.

**DR:11, clause 2, the controls still refuse.** Met. C1 and C2 are refused with exactly the expected codes (R2:117).

**DR:11, clause 3, the exact cells agree with the i128 oracle.** Met.
- T-e Q1, Q2 and Q3 all have `eq_X=true`, and their per-k values are exact (R2:131).
- S k=0,1 and R k=0 are exact (R2:118-119).
- E-ar-n is not a P0 cell: §3 lists it only among the pinned test's files (F:174), and R2 has no row for it.

**§5 predictions (F:195-202)**
- **The §3 table:** see the cell table below.
- **S1 tally is 0:** met. TALLY is 0 of 136 runs and TALLY-NEW is 0 of 60 (R2:102-103). I reconciled the counts: 34 old groups and 15 new groups make the 49 groups, and 35 fixed plus 14 completed is 49 (R2:135).
- **The engine suite is green on the P0 target:** met, across three commands (R2:138-146). See item 4.
- **H-STD:** met as predicted ("at most a warning"). The mechanism differs from §0's hypothesis (F:36): no `-std=` flag reaches any of the 352 compile lines (R2:87), so there was nothing for clang-cl to ignore.
  - The compile line carries `-W0` and `-w` (R2:90), so "0 warnings from DuckDB" (R2:91) is what you would see with warnings suppressed. H-STD is decided by the missing flag, not by the warning count.
  - The C++ standard clang-cl then compiled under is not shown.
- **H-I128:** the link succeeded with no compiler-rt name in the archive or the executable (R2:92-96). The linker line itself was not seen. See item 3.
- **Imports:** R2:150 lists MSVCP140, VCRUNTIME140, VCRUNTIME140_1, the api-ms-win-crt set and system DLLs, and no clang, compiler-rt or libc++ DLL.
  - KNOWN-LIMITATIONS item 15 (KNOWN-LIMITATIONS.md:156-159 at c59b2424) names only `MSVCP140.dll` and lists no wider set. So the prediction is met as far as item 15 names anything.
  - "Unchanged" was never compared: no MSVC-built probe exe was dumped. This is also a test exe, not the installer exe.
  - §1's prediction that the installer's import list is unchanged (F:67) is decided only by a tauri build.
- **The cold CI builds fit their timeouts:** not decidable from P0. The PR's CI runs decide it. Cargo's local "17m 11s" (R2:84) is not a measurement.

**§5 invalidators (F:212-219)**
- clang-cl fails to compile or link: attempt 1 failed (R1:5, R1:46-59). The human ruled that the fallback had not fired (DD:8), recorded in F Amendment 1. Attempt 2 compiled and linked (R2:84, R2:92).
- The link needs compiler-rt: not met as far as the report can show (item 3). The linker line was not seen.
- Any run meets S1: not met (0).
- A control is admitted: not met (R2:117).
- An exact cell differs from X: not met. Every completed run is `eq_X=true` (R2:135).
- The engine suite turns red: not met, with item 4's caveat.
- A CI entry times out twice: not decidable. The PR's CI decides.
- `vswhom-sys` fails under clang-cl: not decidable. P0 built `spatial-engine` only; the PR's product-ci-shell run decides.

**Falsification (F:220):** not triggered. No clang-cl run completed an overflowing column product with wrapped rows.

**§3 cells: prediction against outcome**

| Cell | §3 predicted (F:157-172) | R2 observed |
|---|---|---|
| W | fixed, no batch | fixed, no batch, all 10 (R2:111) |
| W, B3-ar-n | an error; site unpredicted | fixed, at the execute site (R2:112) |
| F | fixed; no `EMPTY_RESULT` | fixed; 0 `EMPTY_RESULT` in 36 EXPLAINs (R2:113) |
| F, B3-ar-s, B3-dk | as B3-ar-n | fixed, at execute (R2:114) |
| P3 on -ar-n files with an overflow row | fixed | fixed (R2:115) |
| P3 on statistics files | fixed or X, unpredicted | X (R2:116) |
| C1, C2 | refused with the two codes | refused with those codes (R2:117) |
| Magnitude S | k=2..5 raise; k=0,1 exact | as predicted (R2:118) |
| Magnitude R | "as before" | k=0 exact; k=1,2 raise (R2:119). I did not compare this with the 2026-10-25 run report, which I did not read; that report's R lines would decide "as before" |
| L1, L2 | H-L: complete, equal to X | complete, X (2,048 / 0), no error (R2:121-122) |
| L3 | recorded, not graded | complete, X (R2:123) |
| L4 | as H-L | complete, X (R2:124) |
| T-c Q1, Q2 (-ar-n and -ar-s) | fixed | fixed (R2:126, R2:128) |
| T-c Q3 | as P3 | -ar-n fixed; -ar-s X (R2:127, R2:129) |
| T-o and its mirror | fixed; per-k raises | fixed; per-k raises (R2:130) |
| T-e | X, no error | X, no error (R2:131) |
| T-m | fixed | fixed (R2:132) |

The cells §3 left unpredicted:
- the B3 error site;
- P3 and T-c-ar-s Q3 on statistics files;
- L3, which is not graded;
- R-ar-n P1/P2 in the stream (R2:120, "not named in §3"), observed fixed;
- the literal-only `SELECT` outside the engine (R2:125), observed raising `Out of Range Error`, while the same products inside an admitted predicate complete equal to X. The mechanism is not read; F:371 assigns it to B-T1;
- T-c per-k (R2:133), observed: k=0 exact, k=1 and k=2 raise.

The "wrapped W = 0" in T-o (R2:130) is the probe's computed wrap, not an MSVC observation. The one-sided hole on MSVC is still inferred until M1 runs.

## 2. W-1

- R2:121 shows L1 completing with 2,048 ids, `eq_X=true`, and no error. It does not end in the fixed detail.
- The human's condition, at DA:15 (and the settlement, F:385), is that the first half stands literally only if P0 shows L1 ending in the fixed detail. That condition did not occur.
- It therefore selects the architect's replacement words, as a whole, at F:302 and DA:15. Byte-copied from DA:15: "An engine test pins it: in an admitted predicate, a BIGINT column holding 4000000000 squared ends in the fixed detail, and the products that fit in its cells return exactly the rows exact arithmetic selects."
- Against P0, the first half corresponds to S-ar-n k=4 (R2:118), whose P1/P2 end fixed (R2:111). The second half corresponds to T-e and P3 (R2:131, R2:116).
- The human's original clause at DR:17 ("4000000000 * 4000000000 ends in the fixed detail") is the literal L1 product, which P0 shows completing instead.
- The gate re-checks the words against the code (F:302).
- W-2 (DA:16) depends on whether port-2 has merged when the code lands. The report does not decide it.

## 3. Build facts for the build-of-record sentence

- **The define.**
  - The config bytes are at R2:66-73 with sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, the same value as F Amendment 2 and the custodian's re-read (R2:1).
  - The header's macro lines are byte-copied at R2:21-46 from `winapi.hpp` (sha256 6201fc81..., R2:19). Line 13 tests `DUCKDB_STATIC_BUILD` before line 16 tests `DUCKDB_BUILD_LIBRARY`, so the build script's `DUCKDB_BUILD_LIBRARY` define (R2:58-60, present on every unit, R2:87) does not override it.
  - The other uses of the macro are `duckdb.h:18` and `:35` (R2:52-53). The report describes them but does not byte-copy them.
  - The header exists only under the target and in the crate's tarball (R2:19), not in the repository. The gate's check "against the config and the header" (DD:15) needs that tarball extracted.
  - The clause's "variant_stats.hpp" matches attempt 1's two errors (R1:55-57).
- **clang-cl on every DuckDB unit.** 352 of 352 compile units name `"clang-cl"`, all carry `-DDUCKDB_STATIC_BUILD`, and none names cl.exe. There are 352 `.o` files (R2:86-88). This was read from the build script's saved `output` file, not from stdout (R2:85).
  - The archiver is `llvm-lib.exe` (R2:88). It does not compile anything, but the gate will see it.
- **No compiler-rt.** The archive and the exe contain none of the four names (R2:93). The archive's `/DEFAULTLIB` list is MSVC-only (R2:94). The link-lib lines are listed (R2:95). The dumpbin shows no clang runtime DLL (R2:150).
- **What the report could not show:**
  - (a) The linker command line (R2:96). A link-args print or a verbose link would show it.
  - (b) Whether `libduckdb.a` has undefined references to 128-bit helper routines, and what resolved them. This one is mine and unread: I recall that Rust's own runtime-support library supplies such helpers on this target, but I have not checked it. A listing of the archive's undefined symbols decides it.
  - (c) Which C++ standard was used, since no `-std=` flag appears.
  - (d) The cargo environment of P-4. R2:99 does not print `CARGO_TARGET_DIR` or `CC_ENABLE_DEBUG_OUTPUT`, so whether P-4 ran the P-3 binary (`o1_probe-1302719615501df6.exe`) is not shown. The `Running` lines in run1.log would show it.
  - (e) Export tables. The define removes `dllexport` from DuckDB's API, so the linked executables' export tables may change. I have not checked this. `dumpbin /EXPORTS` on an MSVC-built probe and the clang-cl probe decides it. As far as I read, the engine never loads an extension: autoload and autoinstall are off and the engine never issues INSTALL or LOAD (engine/src/pool.rs:159-160, :185-186). So I found no engine behaviour that depends on the export table.

## 4. The P-5 split into three commands

It does not change the outcome of any criterion.
- The only failing target is the untracked probe, which panicked because its environment variable was missing (R2:139). §8 item 1 (F:238) bars committing that probe, so the code piece's suite will not contain it.
- The counts reconcile with engine/tests/*.rs at c59b2424:
  - there are 46 files, and the 13 targets that come alphabetically after `o1_probe` are exactly the 13 at R2:143;
  - the 33 targets before it plus the lib tests give the 34 `ok` lines at R2:140;
  - with the doc-tests, 49 result lines in all (R2:146).
- Caveats:
  - the passed counts come from three logs, not one run (R2:145);
  - the checkout is at 688b847d, whose test list I did not read;
  - the 17 ignored tests were not compared with main.
- The six existing suites §4 requires to stay green (F:190) are all `ok` at R2:141.

## 5. What the piece needs next under the form

1. **§9 item 3 (F:276), a class 1 amendment recording P0.** Amendment 2 records the define and the build and says it grades nothing (F:407). Under the record cap the new amendment is references and hashes only. It should cover the cell outcomes, the tallies, the H-L / H-FETCH / H-STD / H-I128 discriminations, and W-1's selection.
2. **Class 2: none called for by the §3 cells.** Every observed outcome falls within a registered alternative. One possible class 2 is for the gate to decide: §5's "the build compiles" (F:199) missed on attempt 1. Amendment 1 records that as a post-result amendment but does not label it a deviation.
3. **The code (§9 item 4).**
   - The build-of-record line is the human's sentence (DR:17) with the clause from DD:15 (F:418), W-1's replacement words, and W-2 as port-2's state then gives it. §8 item 9 (F:246) blocks any other text.
   - The CONTRIBUTING sentence's missing-tool failure (F:100-101) was never observed in P0, because clang-cl was on PATH in both attempts. Either it is observed during the code piece, or the gate accepts the source read.
4. **M1.** §4 names "the `[env]` line" (F:182), but the config now has two entries. The OPEN-5 (A) "cheap way" on sefd (DA:19) has both entries absent, while removing only the CXX line would compile with cl.exe and the define, a build nobody has observed. Under DA:19, whether the sefd run counts as M1 is the architect's question. If a gate corrects it, class 4 is the candidate class.
5. **§7 (F:230-231)** declares 4 files, and the settlement adds CLAUDE.md (F:389). That is not a result of P0, but the gate's file count will meet it. Class 8 covers a file-count overrun.
6. **Left to the PR's CI and §9 item 6:** CI timeouts, `vswhom-sys`, H-CACHE, clang-cl on PATH on windows-latest, and the installer's import list.

---
Result: P0 meets DR:11's three clauses and §5's decidable predictions with no invalidator; W-1 takes the architect's replacement words.
Blocking question: P3 and T-c-ar-s Q3 on statistics files completed equal to X with no error over data that overflows (R2:116, R2:129). Does DR:11's "every overflow ends in the fixed detail" accept that? If not, OPEN-4 (A) applies. This is for the human or the custodian, not me.
Question (architect): does the sefd MSVC run, with both config entries absent, count as M1 now that the config has two entries?
Report path: C:/dev/spatial-ide/state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-reading-lead-data.md. I wrote no file, so its sha256 is the custodian's to compute when filing.
