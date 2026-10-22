*Custodian's filing note (2026-10-22): piece 1c step 1's first commit, O0's probe (the form's §3), and F1, by a worker-high at a88d0186 on its branch: 144 lines, all under `spikes/b2-1c-onedrive-probe/`, within §2.11's 150. The run 14:08:31Z to 15:00:23Z by its transcript (Read 7, Bash 43, Grep 1, Write 9, Edit 1); its claims were read against that transcript's calls before filing; no call of it touched a OneDrive folder. Its F1 build's hold ran about 40 minutes against an 8-minute estimate (a first build of the engine's bundled database into a fresh target), disclosed. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 513df5dabbca16ef7681ce7e779e8ffa42cf1edb622c6ba5205ffe8ab694e448.*

---

Built: b2-piece-1c-save-and-reopen step 1's probe at a88d01863f65eb1290f762f8a3f03db4b9e43a0c

Branch cut/b2-piece-1c-save-and-reopen, worktree C:/dev/wt/b2c, base B = 55618ab5. Tag node:b2-piece-1c-save-and-reopen@g5. No product code.

**Steps (command, exit code).** S below is my scratchpad folder; every output went to a file there named b2c-p-*.
1. Read of the form's header, §0, §2.11, §3, §9, OPEN-6, and the I4 and §8 item 7 lines. No exit code.
2. `cargo fmt --manifest-path spikes/b2-1c-onedrive-probe/Cargo.toml`, rc 0. The final fmt run was rc 0, and so was `cargo fmt --check` (rc 0).
3. `cargo build --manifest-path <probe>` rc 0. `cargo clippy --manifest-path <probe> -- -D warnings` rc 0, no warnings. Both used CARGO_TARGET_DIR=D:/wt-targets/b2c.
4. Root `cargo metadata --format-version 1 --no-deps --offline`, rc 0, run before and after the commit. It lists spatial-data-plane, spatial-engine, spatial-kernel, spatial-renderer and spatial-skp. These are the same 5 members and the probe is not among them. Root Cargo.lock is untouched. `--offline` was my addition.
5. Throwaway F1 generator build, run under the hold, rc 0 (details below).
6. The generator run, rc 0. `sha256sum`, rc 0.
7. The probe on F1, rc 0 (output below).
8. `git add` by path, rc 0. `git commit -s -F S/b2c-p-msg.txt`, rc 0.
9. `git diff --stat 55618ab5...HEAD` names only the 3 files under spikes/b2-1c-onedrive-probe/ (144 insertions).
10. `git push origin cut/b2-piece-1c-save-and-reopen` in its own call, rc 0 (`55618ab5..a88d0186`).
11. `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` gives `a88d01863f65eb1290f762f8a3f03db4b9e43a0c`, and `git rev-parse HEAD` gives `a88d01863f65eb1290f762f8a3f03db4b9e43a0c`. Origin equals HEAD, and `git status --short` is empty.

**Commit.** Subject `spike: O0's OneDrive probe, step 1's first commit (b2-piece-1c)`. The body names the form's §3. The two Co-Authored-By and Claude-Session lines come before the Signed-off-by trailer that `-s` appends, so Signed-off-by is the last line, not the Claude-Session line.

**Probe source.** Three files, 144 lines in all, under the 150 ceiling:
- `Cargo.toml` is 8 lines: std only, its own empty `[workspace]`, `publish = false`.
- `README.md` is 19 lines: what it records, how to run it, exit codes, and that Amendment 1 records the result.
- `src/main.rs` is 117 lines, and it prints no path.
- `Cargo.lock` is not committed. I deleted it because its 7 lines would have made 151. Cargo regenerates it on build.

What `main.rs` does:
- **Arguments.** `<file> <absolute scratch folder>`; any other count exits 64.
- **Attributes.** `attrs` is `#[cfg(windows)]` and uses `MetadataExt::file_attributes`. It prints the raw value and, by name, reparse_point (0x400), offline (0x1000), recall_on_open (0x40000), recall_on_data_access (0x400000), pinned (0x80000), unpinned (0x100000). A non-Windows twin prints `attrs=not-windows`.
- **Before any open.** `stat` prints `symlink_metadata`'s is_symlink, is_file, is_dir, len and the attributes.
- **Walk.** A `read_dir` walk of the parent runs `symlink_metadata` on every entry and prints the file's own entry as the walk sees it. It prints the entry and symlink counts, then the attributes again, then `walk_changed_metadata`.
- **Open and read.** Each is bounded by `bounded()`, a thread plus `recv_timeout` with a 120 s limit. A pass prints `TIMEOUT <step> after <n>s` and exits 2. The byte count and the attributes after each step are printed. Exit 1 means an open or read failed.
- **Junction.** The probe makes `b2c-p-junction-<pid>` in the scratch folder and runs `cmd /C mklink /J` on it. It prints is_symlink, is_dir, is_file, len and the attributes of the junction. It then removes the link with `remove_dir`, records whether the target survived, and removes the folder.
- **Fix before commit.** My first draft's `mklink` failed (`mklink_exit_ok=Ok(false)`) when the scratch argument used forward slashes. I made the separators native before calling mklink, and re-ran both forms (both `Ok(true)`).
- **Timeout path.** I tested it on a throwaway copy in S with the limit set to 0 ms. It printed `TIMEOUT open after 0s` and exited 2. The committed file has 120 s, and a rebuilt binary prints `limit_s=120`.
- **Custodian: rebuild first.** Do not reuse a binary from D:/wt-targets/b2c from before 14:55 UTC. That copy build overwrote the probe binary in that target folder, and I rebuilt it afterwards. `cargo build` or `cargo run` of the committed crate is safe.

**F1.**
- **How made.** A throwaway crate at S/b2c-p-gen/ (outside the repository, never committed). Its Cargo.toml has a path dependency on `spatial-engine` with the `fixture` feature and its own `[workspace]`. I copied the root Cargo.lock beside it to keep the locked versions. Its main calls `spatial_engine::fixture::write_geoparquet(path, &FixtureSpec { features: 500, ..FixtureSpec::default() })`.
- **Defaults kept.** The defaults are CrsMode::DeclaredLv95, seed 0x5EED_2056_0000_0002, avg_vertices 24, hole_every 7, with_covering_bbox true.
- **File.** `b2c-p-f1/b2c-p-f1.parquet`, relative to S, 199435 bytes.
- **sha256.** `1428198f922a5a3ddcdf54963071065ffde88151492d01ebc85105360f884d9b`
- **Facts from the generator.** features=500 vertices=12530 rings=572 bytes=199435 extent=[2600003.284194039, 1200003.4805360753, 2600916.7282187603, 1200876.523806097].
- **Naming note.** The brief said scratch file names start `b2c-p-`. Cargo needs files named Cargo.toml and src/main.rs, so those sit inside the directories b2c-p-gen and b2c-p-timeout, which carry the prefix.

**Probe output on F1 (local control), final committed source, rc 0, byte-copied from S/b2c-p-probe-run3.out:**
```
os=windows limit_s=120
file before anything opens it: is_symlink=false is_file=true is_dir=false len=199435 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
file as the walk sees it: is_symlink=false is_file=true is_dir=false len=199435 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
walk: entries=1 symlinks=0
file after the walk: is_symlink=false is_file=true is_dir=false len=199435 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
walk_changed_metadata=false
open: ok after 1 ms
file after open: is_symlink=false is_file=true is_dir=false len=199435 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
read: bytes=199435 after 1 ms
file after read: is_symlink=false is_file=true is_dir=false len=199435 attrs=0x00000020 reparse_point=false offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
junction: scratch_dir_made=true mklink_exit_ok=Ok(true)
junction: is_symlink=true is_file=false is_dir=false len=0 attrs=0x00000410 reparse_point=true offline=false recall_on_open=false recall_on_data_access=false pinned=false unpinned=false
junction: link_removed=true target_kept=true dir_removed=true
junction after removal: error kind=NotFound os_error=Some(3)
done
```
On the junction, std reports is_symlink=true, is_dir=false and is_file=false, with the reparse-point attribute set (0x410). Removing the link left the target in place. The scratch folder was empty after the run. On the control the attributes are plain (0x20) and do not change across the walk, open and read, so the control shows none of the placeholder behaviour. The OneDrive run is the one that tests H1 and H5.

**Hold lines (my own project only).** The F1 generator build was the only heavy command: 3 min wait allowed, 8 min estimated, `-What "b2-piece-1c: cargo build of a throwaway F1 generator"`, CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8.
```
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:37388 also=bash.exe:36896 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:37388 affinity=FF (cores 0-7)
```
The hold was granted, with no exit code in 96 to 99. The build took 40m39s of cargo time against my 8 minute estimate, because the first build into a fresh target folder compiled the bundled duckdb. The call passed its own 590 s timeout and moved to the background, and the command finished and released the hold itself (cmd rc 0). So the hold ran about 40 minutes against the 8 I declared; I did not extend or touch it. The probe crate builds, clippy and the runs are small and ran outside any hold.

**Off-script action.** After the push I ran `machine.ps1 status` once, to look for leftover holds. It is not in your never-list and not in your brief. It returned one line mentioning only my own project, and it exited 0. I did not run, book or cancel.

**Processes.** Every cargo, rustc, cl and link process I started has exited, and no b2-1c-onedrive-probe, b2c-p-gen or b2c-p-timeout process is running (checked by `tasklist`). Other cargo and rustc processes were running on the machine; none carries my manifests or target folder, and I touched none.

**Pre-gate classes.** There is no cross-module code, no `pub` item and no user-facing message, so the caller grep is empty. The only cross-module read was `write_geoparquet` and `FixtureSpec`, read at engine/src/fixture.rs and used as they are. Every completion claim above has a call behind it in this transcript.

**Model.** The harness reports Sonnet 5.5, `claude-sonnet-5-5`. No model override and no context handoff.

**Not done, as the brief says.** No ADR commit and no Amendment 1, which are the custodian's. The OneDrive run waits for the human to prepare the file. The custodian should pass an absolute scratch folder outside OneDrive.
