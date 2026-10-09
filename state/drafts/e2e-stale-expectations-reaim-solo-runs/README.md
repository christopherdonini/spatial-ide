# The e2e re-aim's solo runs, 2026-10-09 (the custodian, exclusive holds)

What this holds: the custodian's final solo runs of `e2e-stale-expectations-reaim`. They ran at `C:/dev/wt/reaim`, head cf2434e6f25033335d69ee4b667caefd109832f1, with the worker's exe built at window height 800. Each suite ran on a fresh app, in exclusive holds with nothing else of this session running.
- **Window 2:** regression, admission and source-changed (default route), each exit 0, with the worktree clean after each.
- **Window 3:** the console suite three times. Runs 1 and 2 exit 0, and run 3 exits 1: GROUP′ split, as its log shows.
- **Run 3's log only.** The script gave all three console runs the same log name, so runs 1 and 2's logs were overwritten. Their outcomes stand only as the exit codes in the hold output. This is the custodian's error.
- **The bytes:** the hold outputs are byte-identical to the runs', with CRLF stored as LF. The script copy has its scratch-folder path replaced by a placeholder.

The sha256 of each file as filed:

- `window-2-hold-output.txt`: 21507c9ce504f14f51d94b2cfd1c32847145b832e142cc140bb073cd7fedb2a4
- `w2-regression.log.txt`: 01e08e3b9b01fe43683730fd4333c9e1f8c24aabec3f0867158cd4bbf61cf3ed
- `w2-admission.log.txt`: 7e8f92c0a7bfb25f56ca329f0cdb53db9b7a42c030598c6ff3eeb3c498de1133
- `w2-source-changed.log.txt`: 95eeb355095e8b001796c10d331b8009c5839a289acd9e8b6076349b79ff7567
- `window-3-hold-output.txt`: 11b56baf4a03b87dc4da7c25d1d5951c28adcd802375ccb0efdfb47357dd412a
- `w3-console-run3.log.txt`: 098eddac310629fe060a1dad4b363ce54e97b609d593e096315fee8851676c7d
- `reaim-solo.sh.txt`: cc78af3c009daa1b6d619ae4e310951ec08c59546a8d01f28ff2457d423ea1c8
