*Custodian's filing note (2026-10-25): the worker-high's stop on `first-batch-factorial-ignored-trace-tests` (the filler queue's entry 6b): the fixture S is not in the main checkout, a stop of the form's note 2, so no export was made and no test was run. Its code commit 3c8e91f6 (22 lines in the one file, before the record lines) is pushed; the worktree is clean. Its writes were the one file and its own scratch files; no rebase, reset, PR action or force push. The route is the custodian's to choose next (S regenerated, or a narrower claim by amendment), after a read-only consult on how S is produced. The run 20:48:35Z to 20:51:16Z by its transcript (Read 5, Bash 17, Write 2, Edit 3, Grep 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 698c5963e8581fba317aaef1f03adc5d1be56e7baa66e64c4553fb46dccf890d.*

---

Stopped: first-batch-factorial-ignored-trace-tests, note 2's stop "a fixture is absent": S is not in the main checkout, so the observation (step 2) was not started. Step 1 (the code commit) is done and pushed. Step 3 (the record commit) is not made, because it depends on the observation.

**Commit (one, pushed)**
- 3c8e91f634246b620e8346b2d34acca597a6385e, subject: `test: first-batch-factorial-ignored-trace-tests, the file-local trace lock (form Change line, note 1)`.
- It touches only `kernel/tests/first_batch_factorial.rs`. The added lines are:
  - W1's doc words, 14 lines. The third line of the form's paragraph was over 100 columns, so I re-wrapped from there. No word changed.
  - `static TRACE_SERIAL: std::sync::Mutex<()>` and `fn serial()` in the sibling's shape, placed after `the_5gb_clustered_cell` and above the doc of `cancellation_holds_with_pruning_in_the_path`.
  - `let _serial = serial();` as the first statement of each of the two tests, before `refuse_debug`.
- The doc is 14 lines (file lines 1281-1294). I checked those lines against the wrap script's output with `cmp` and they match (rc 0).
- The RECORDED MUTATION line is not written yet. The doc ends at "commands run each of these two alone with `--exact`."
- The message file had no `@` outside the Co-Authored-By line (checked with grep before the commit). `git commit -s -F` added the sign-off.
- Pushed: `git push origin cut/first-batch-factorial-ignored-trace-tests` returned rc 0, `8d8d412e..3c8e91f6`.

**Why I stopped**
- The main checkout's `target` is a link to `/d/spatial-ide/target`. Its `slice-evidence/` holds only `cancel-rescore`, `concurrency-in-situ.json`, `filter-panel`, `query-window-attribution`, `scale-pass` and `sql-filter`. The folder `slice-evidence/first-batch/` does not exist at all.
- So S (`parcels-145mb.parquet`) and H5 (`parcels-5gb-duckdb-hilbert16.parquet`) are both absent from the place the form says to copy them from. `slice-evidence/import-layout/` is absent too.
- A `find` to depth 6 under `/d/spatial-ide`, `/d/wt-targets` and `/c/dev` found no `parcels-145mb*.parquet`. It found only `scale-pass/parcels-5gb.parquet` (G5, not H5) and `target/fixtures/first-batch` folders in the main checkout, `b2c` and `ccc` (small `lever-*.parquet` files, not S).
- I did not look for S anywhere else, create an export, copy a fixture, build or run a test. Because S is absent, OPEN-2 (B) does not apply: it covers an absent H5 only when S is present.
- Not created: `D:/wt-targets/fbf-export` and `D:/wt-targets/fbf-export-target`. `ls` of `D:/wt-targets` shows no `fbf*` entry, so there is nothing to remove.
- The drive has 175 GB free (`df`: 466G size, 292G used). The floor check never ran.
- S's sha256 was not checked against `fe61e704fcc01d40…` (`kernel/RESULTS.md:2988`), and H5's size and sha256 were not recorded.
- The tests were not run unmutated or under M-1. There are no hold lines of mine, because no heavy command ran.

**Decision for the custodian:** the fixtures need regenerating, or a copy needs placing at the main checkout's `slice-evidence/first-batch/`, before the observation. The factorial pass generates S. Whether to regenerate it, and how, is your call. I have not claimed the fixtures are non-regenerable.

**Checks run (only the free ones)**
- Scope count: `git diff --numstat 8d8d412e...HEAD` gives `22 0 kernel/tests/first_batch_factorial.rs`. That is 22 of 40, before the RECORDED MUTATION lines of step 3.
- `cargo fmt --all -- --check`: rc 0, run before the commit and again at the head.
- Not run: `cargo test -p spatial-kernel --locked --test first_batch_factorial`, `cargo clippy -p spatial-kernel --tests --locked`, and the four `scripts/plan` verifiers. They are needed at the head of the final commit, so I did not run them at this commit.
- The code therefore has not been compiled by me. fmt is clean, and the lock is a copy of the sibling's shape.

**State left**
- The worktree `C:/dev/wt/fbf` is clean (porcelain 0 lines).
- HEAD and origin's branch both equal 3c8e91f634246b620e8346b2d34acca597a6385e, checked after a fetch.
- No process I started is still running. I started none beyond foreground commands.

**Other:** no stop rule beyond the fixture one was met, and I made no disclosure. My model, as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). I received no context handoff and produced none.
