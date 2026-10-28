*Custodian's filing note (2026-10-28): the tester-high's report on filler entry 9's step 0, under the committed full form (§9 item 2) at c98921bc, nothing committed. The custodian's check by its transcript: 2 cargo calls, 0 outside a shared hold by command text; no git write; the run 21:43:14Z to 22:04:43Z (Read 6, Bash 26, Write 1). The five raw files it names are in the local evidence folder, outside every repository; their sha256 values were recomputed by the custodian and match, and the terminal's sha256 appears in the raw output. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is f602d3ff23e1f9fffcd23bbd52a6e87a218882089f9bb91b04a270ff9c897750.*

---

Observed: stream-fetch-overflow-fixed-detail step 0 at c98921bc2e0309bad64730bbe42bf7548014032b

No invalidator (§5, 1 to 6) fired. The brief's sha256 matched when I read it (00e538d9b89a8c6f10976b6439c65572ab71a3096189fa254810d1ae38738b6a), and so did the form's (90b2788c60cd170cf9f44946b8ea68c66b334aa7db07aa58f14f112898373e21). The record is the transcript, and all figures below come from calls in it.

## Build facts
- **Checkout:** I created the detached worktree at C:/dev/wt/e9-step0, HEAD c98921bc2e0309bad64730bbe42bf7548014032b. Its porcelain was empty before the probe was added.
- **Config:** `.cargo/config.toml` sha256 is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, which equals the brief's value.
- **Compiler:** `clang-cl --version` reports clang version 20.1.8, Target: x86_64-pc-windows-msvc, InstalledDir: C:\Program Files\LLVM\bin.
- **DuckDB build line:** the libduckdb-sys `output` file (build dir libduckdb-sys-e687d2665fbd4cae) has this `running:` line, byte-copied from line 28: `running: "clang-cl" "-E" "D:/wt-targets/e9-step0\\debug\\build\\libduckdb-sys-e687d2665fbd4cae\\out\\1245944842339908396detect_compiler_family.c"`.
- **Compile lines:** 326 `running:` lines name clang-cl on a `.cpp` file. The only `running:` lines that don't name clang-cl are 10 llvm-lib archive steps. 708 lines carry DUCKDB_STATIC_BUILD.
- **Target and environment:** CARGO_TARGET_DIR was D:/wt-targets/e9-step0, new and mine alone. CC_ENABLE_DEBUG_OUTPUT=1, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 were set identically on both calls.
- **Calls:** `cargo test -p spatial-engine --locked --test e9_step0_probe -- --nocapture` ran twice, in separate processes, each inside a shared hold.
  - Process 1 was cold (the DuckDB build). Its cargo rc was 0 and its test ran 141.45 s.
  - Process 2 had cargo rc 0, "Finished in 0.45s", and its test ran 143.89 s.
  - The machine has 16 logical cores; the hold pinned cores 0-7.

## Each file's checks
Both processes wrote their own copy of each file under D:/wt-targets/e9-step0-data/ (proc-29896 and proc-35900), and the copies came out byte-identical.

| File | Bytes | sha256 | Row groups |
|---|---|---|---|
| F-1M | 44441691 | 5570b4d0599fa0b2055661d960ba640ba9cb103e3cc9d661b95f958b2d9e6453 | [1000000] |
| F-4M | 177758010 | 5c21082e6e5be1823151a6d052a19689901f617bd0e809b5738c68dd8c2a3368 | [1048576, 1048576, 1048576, 854272] |

- Extents are [2600000.0, 1200000.0, 2601999.0, 1200499.0] for F-1M and [2600000.0, 1200000.0, 2601999.0, 1201999.0] for F-4M.
- Both files, in both processes:
  - The footer num_rows and the SQL count both equal N.
  - Head rows with `v <> id` is 0.
  - The 1000-row tail reads back equal, from (N-1000, 3600000000000000000) to (N-1, 3600000000000000999).
  - `Dataset::open` is Ok with `v` Int64, encoding Point, covering usable and crs EPSG:2056.
- The file sha256 was equal before and after every one of the 16 stream runs.

## Cell I
On an independent connection, in both processes, both files ended in the same error at stage query_row, with `begins_with_label=true` and length 100. For F-1M the id was 999000, for F-4M it was 3999000:
`"Out of Range Error: Overflow in multiplication of INT64 (3600000000000000000 * 3600000000000000000)!"`
That is a raise, not a wrap.

## Every run's record
There are 16 stream runs: 4 cells (F-1M and F-4M, in the `all` and `view` shapes), twice per process, in 2 processes. `admit` succeeded on all of them. Every run ended in `next_into`, and none completed without an error.

- **Batches and ids before the terminal:** identical on every run of a file.
  - F-1M: 31 batches, 960512 ids, first id 1 and last id 960512. Id 0 is excluded because `0*0 > 0` is false.
  - F-4M: 123 batches, 3975168 ids, first id 1 and last id 3975168.
- **Terminal Display:** the same on all 16 runs. As `{:?}` it reads:
  `"query: duckdb fetch panicked: Failed to fetch Arrow record batch: Invalid Input Error: Attempting to execute an unsuccessful or closed pending query result\nError: Out of Range Error: Overflow in multiplication of INT64 (3600000000000000000 * 3600000000000000000)!"`
  - Length is 263 bytes. sha256 is 1a18f782fb2bf7242d176e8cd47cc98432c11df3b72301bf5ab8e2b46fe5fd25.
  - The Display includes the operand digits, so S1 did not appear.
- **Byte offsets in the Display:**
  - `query: duckdb fetch panicked: ` ends at 30.
  - The crate prefix occupies 30 to 66 (36 bytes) and ends at 66.
  - The wrapper occupies 66 to 163 (97 bytes) and ends at 163.
  - The label begins at 163. The label count is 1 and the wrapper count is 1.
  - The 12 bytes after `pending query result` are `0a4572726f723a204f757420`, meaning one LF, then `Error: Out `.
- **Panic hook:** one line per run, in the form `PANIC-HOOK run=<tag> thread=engine-geoparquet-stream payload_len=233 location=<registry>/duckdb-1.10505.0/src/arrow_batch.rs:46:25`. I shortened the registry path to `<registry>`. The payload length of 233 equals 263 minus 30.
- **Wall time (s), as process 1 then process 2:**

| Cell | Rep 1 | Rep 2 |
|---|---|---|
| F-1M all | 0.727, 0.677 | 0.724, 0.699 |
| F-1M view | 0.821, 0.712 | 0.691, 0.802 |
| F-4M all | 3.001, 2.814 | 2.870, 3.223 |
| F-4M view | 3.030, 3.202 | 2.880, 2.973 |

  Every run was far under the 300 s ceiling. File bytes are as in the table above.

## Shapes by bytes
- **Wrapped:** all 16 of 16 runs, in both processes and both shapes, on both files. The Display is byte-identical on all 16, with the sha256 above. In the wrapped shape, the crate prefix, then the wrapper, then the label are contiguous, with no gaps.
- **Bare (H-BARE):** not seen in any run.
- **Any other shape:** not seen. There was no double wrapper, no payload without the crate prefix, no inner text other than the label, and no S1 and no wrap.
- Per OPEN-1 (B), the class 1 amendment can therefore keep the bare shape as "recognised, never observed through the engine".

## N by §3's size rule
N = 1,000,000. Every run on F-1M, in both shapes and both processes, delivered 31 batches before the terminal, so the smallest N that meets the rule is 1,000,000. F-4M also met it, and delivered 123 batches.

## Evidence files
All are in C:/dev/spatial-ide-local/evidence/2026-10-28/e9-step0/:

| File | sha256 |
|---|---|
| e9_step0_probe.rs | b55ce87c71c2bcff72401e65f831a1cc8c18a9a5beeccfdd8086050380ac728e |
| e9s0-proc1-stdout.txt | 26f9c46b43d7c4a55c7adf5b9a30e1893911c308b28ef1f7bf623cb158cfa6f8 |
| e9s0-proc1-stderr.txt | 7ce3e85abb806956691e8c896cf39dbb03ec65fe0c09711a64b27ff552d92eaf |
| e9s0-proc2-stdout.txt | 1d006aac552839f2a37f783ff4f7a7afd07fc964827c168bcf96ac478fc4f69c |
| e9s0-proc2-stderr.txt | 0646b9ac114bde197bd356ec8de1a5f6e6885ed7c514309d8e3da020e8a76fba |

## Hold lines (my project only)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:50844 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:50844 affinity=FF (cores 0-7)`
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:10200 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:10200 affinity=FF (cores 0-7)`

## State left for the custodian
- **Checkout:** the probe file is removed from C:/dev/wt/e9-step0. Its porcelain is empty, HEAD is c98921bc2e0309bad64730bbe42bf7548014032b, and the config sha256 is still 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.
- **Targets and data:** D:/wt-targets/e9-step0 and D:/wt-targets/e9-step0-data are left in place.
- **Scratch:** the `e9s0-` files remain in my scratch folder.
- **Never-list:** I committed nothing. I made no network fetch and no tracked-file edit.
- **Process ownership:** I killed nothing. I used only a wait on my own cargo PIDs.

## Four failure classes for this harness
- **Interface:** the probe uses the product interface, `AdmittedPredicate::admit`, then `Dataset::stream_with_cancel`, drained with `next_into`.
- **Result claims:** each points to the evidence files above. I wrote no results file.
- **Operator-facing lines:** none were written.
- **Assertion reach:** the probe makes no pass/fail assertion on outcomes. All 16 runs reached their printed terminal record, each process printed PROBE-DONE, and each test ended `ok`.

## Model
Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it, as tester-high. There was no model override and no context handoff. I have no usage figures to report.
