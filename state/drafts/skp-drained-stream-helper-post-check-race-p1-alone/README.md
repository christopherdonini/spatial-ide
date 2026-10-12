# PR #198's E-1: P-1 run alone, 20 runs, 2026-10-09

What this holds: the custodian's one pre-declared set of 20 runs of `cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression`, in one exclusive hold, at `C:/dev/wt/skp`, head 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade. Its `kernel/src/skp.rs` equals be7eecb3's. The two job settings are unset, as the exclusive rule says (cargo's default test threads, 16 logical cores under the hold's affinity). The result is 20 of 20 runs, each with 22 passed and 0 failed, and the worktree clean after. The hold output is byte-identical to the run's, with CRLF stored as LF. The script copy has its scratch-folder path replaced by a placeholder. The sha256 of each file as filed:

- `hold-output.txt`: f29f99655f8237b60c537e654834d7204bc4caa955c64619a5b008c5166e2927
- `p1-solo.sh.txt`: 6c7bb11eb1ab71ab8457270ed99f0cb4f34189a6b321e4d2fe1c1b3c7a17e1e8
