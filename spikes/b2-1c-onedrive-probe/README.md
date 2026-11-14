# O0's OneDrive probe (b2-piece-1c)

std only, no dependency. Windows is the target; elsewhere it records no attributes.
Authority: `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` section 3, O0. Its result is recorded
in that form's Amendment 1. It prints no path.

It records, for one file: `is_symlink`, `is_file` and the Windows attributes (reparse point,
offline, recall-on-open, recall-on-data-access, pinned, unpinned), each by name, before anything
opens it; then a `read_dir` walk of the parent with `symlink_metadata` and the attributes again,
with `walk_changed_metadata`; then an open and a full read by path, each bounded to 120 s on a
thread (a pass prints `TIMEOUT` and exits 2), with the byte count and the attributes after each.
Last, a junction made in the scratch folder by `mklink /J`, with `is_symlink` and its attributes,
removed again.

```text
cargo run --manifest-path spikes/b2-1c-onedrive-probe/Cargo.toml -- <file> <absolute scratch folder>
```

Exit 0 = ran to the end, 1 = an open or a read failed, 2 = TIMEOUT, 64 = wrong arguments.
