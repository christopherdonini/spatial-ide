# Flake hunt, spatial-ide @ 116deb53293bb62ebbaa49ee795e3b1f0093745d

- runs.tsv: one line per workspace run (`cargo test --workspace --locked`). Conditions: ordinary, twocore (`taskset -c 0,1`).
- twocore-07.log: the workspace run where engine `slice` / `cancelling_mid_stream_stops_production_promptly` failed.
- slicebin.tsv, slicebin-alone-2core-06.log: the `slice` test binary run alone, alternating all cores and `taskset -c 0,1`. The failure seen there.
- exp.tsv, exp-B-01.log, experiment-C-final-state.diff: the discriminating experiment. All three phases ran the slice binary alone under `taskset -c 0,1`, 20 runs each.
  - A: diagnostics only in the test (the test hunk of the diff).
  - B: the diff's test hunk, plus a 20 ms `thread::sleep` (only while a trace is enabled) placed in `engine/src/stream.rs` `flush()` immediately BEFORE the `if cancel.is_cancelled()` check that increments `batches_after_cancel`.
  - C (control): the diff exactly as saved. The same sleep sits immediately AFTER that check.
  The edits were made in the sandbox clone only and have been reverted (`git status` is clean).
- run_loop.sh, alternate.sh, slicebin.sh, exp_loop.sh: the drivers used.
- build.log: the cold `cargo build --workspace --tests --locked`.
