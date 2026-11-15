Reviewed: PR #266 at 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6, gate 3, reviewer (gate 2's E-1)
Verdict: PASS WITH NOTES

Branch: cut/admitted-integer-overflow-silent-wraparound @ 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6. Main: aebe45ebb5135dba63c18b59acb3596c9d5cb1e8 (`git log -1`, rc 0). I read the brief whole and computed its sha256 with `sha256sum`: 6b23530e893eb3380e5bb2bd88e26f2a4601fe0ad33f4c3baa390edefcc76dd9, which matches the brief. I read gate 2's reviewer report on main (rc 0).

## Correctness
None.

## Evidence
None blocking. Gate 2's E-1 is closed by the condition it set itself: "Re-run the `tauri build` job at 4943d8b4. Read its log for `Compiling libduckdb-sys` after the restore from main's `…-b64a8a20`." Job 123017921905 restored main's `…-b64a8a20` with a partial match, then compiled `libduckdb-sys` in the run (check 2).

## Notes (none blocking, no re-gate)
- **N-1.** The pull_request run's `tauri build` job is still the build that restored the cache. That is job 122959781231 in run 40728970643, which ran 5m16s. Only the push run's job was re-run. `gh pr checks 266` lists both jobs as passing. Any record of the head's installer build should cite job 123017921905, never 122959781231.
- **N-2.** In run 40728961364's attempt 2, the shell job has a new id, 123017924536. It is a carried-over copy of job 122959747796, not a re-run: both have run_attempt 2 and 1 respectively, start 16:44:41Z, complete 17:14:46Z, and conclude success. Nothing changed there.
- **N-3.** Gate 2's D-1 to D-3 are outside this gate. They remain as gate 2 filed them.

## Check 1: Actions caches
- **Command.** `gh api --paginate "repos/{owner}/{repo}/actions/caches?per_page=100"`, filtered to keys containing `tauri-build`, written to `o1-g3r-caches.tsv`. rc 0.
- **Result.** Two entries exist:
  - `v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-f459d22b` on refs/heads/cut/admitted-integer-overflow-silent-wraparound. Created 2026-10-28T18:42:17.551153Z, 667345436 bytes.
  - `v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-b64a8a20` on refs/heads/main. Created 2026-10-15T19:24:29.933235Z, last accessed 2026-10-28T18:33:21.812158Z, 799964051 bytes.
- **The deleted entries are gone.** No `…-476dea4e` entry remains on any ref, and no `tauri-build` entry remains on refs/pull/266/merge.
- **Where the branch's `…-f459d22b` came from.** The re-run job wrote it. Its log shows `... Saving cache ...` at 18:42:07.44Z, and `Sent 667345436 of 667345436 (100.0%)` at 18:42:17.38Z. The byte count equals the entry's size, and the entry's creation time follows by 0.17 s.

## Check 2: the new job's log
- **Commands.**
  - `gh run view 40728961364 --job 123017921905 --log` > `o1-g3r-job.log`: rc 0, 1039 lines.
  - `gh api repos/{owner}/{repo}/actions/jobs/123017921905`: rc 0.
- **Head and conclusion.** The job API gives head_sha 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6, status completed, conclusion success, run_attempt 2, 18:28:36Z to 18:42:21Z. The log's checkout prints `4943d8b4a0272e02ea9d49371bb4ae1a069fbad6` at 18:28:47.16Z, and its reusable-workflow line names the same sha.
- **The cache it restored.** Grep for the cache lines (rc 0) gives:
  - Cache Key `v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-f459d22b`;
  - `Cache hit for restore-key: v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-b64a8a20`;
  - at 18:29:31.97Z, `Restored from cache key "v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-b64a8a20" full match: false.`

  It was a partial match on main's entry, not the branch's old entry.
- **The crates compiled in the run.** `grep -c "Compiling"` gives 397 (rc 0). The lines for the crates in question:

  | Time (Z) | Crate |
  |---|---|
  | 18:30:33.28 | `cc v1.4.2` |
  | 18:30:55.05 | `vswhom-sys v0.1.3` |
  | 18:31:17.81 | `vswhom v0.1.0` |
  | 18:32:33.42 | `libduckdb-sys v1.10505.0` |
  | 18:40:17.22 | `duckdb v1.10505.0` |
  | 18:40:18.08 | `spatial-engine v0.0.0` |

  `duckdb` starts 7m44s after `libduckdb-sys`. A Rust-only rebuild of `libduckdb-sys` would take seconds, so that gap is consistent with the bundled C++ build running in this job. Gate 2 reported a comparable span in the 49297300 runs.
- **The release Finished line.** At 18:41:26.72Z: `` `release` profile [optimized] target(s) in 11m 04s ``. Then makensis ran and `Finished 1 bundle at:` printed at 18:41:52.47Z.
- **Which compiler built DuckDB.** The log cannot show it: cargo hides build-script stdout, so no compiler command line appears.
  - `grep -i -c clang` over the log printed 0 (rc 1).
  - The positive self-test, `grep -c Compiling`, printed 397 (rc 0).
  - No other line names cl.exe, CXX, NDEBUG or DUCKDB_ (grep, rc 0; only Node and Vite warnings matched).
- **What the head sets and does not set.**
  - `.cargo/config.toml` at the head (`git show`, rc 0) has sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f and no CR. It sets `[env]` `"CXX_x86_64-pc-windows-msvc" = "clang-cl"` and `"CXXFLAGS_x86_64-pc-windows-msvc" = "-DDUCKDB_STATIC_BUILD"`.
  - rust-cache lists this file under "Lockfiles considered", which is why main's entry matches only partially.
  - The `npm run tauri build` step's env block is only CARGO_INCREMENTAL, CARGO_TERM_COLOR and CACHE_ON_FAILURE.
  - `tauri-build.yml` at the head (`git show`, rc 0) sets no CXX, CC, RUSTFLAGS or clang (grep rc 0, matches only on unrelated lines 1/28/48/50/57/63/66-68). The build runs from `frontends/shell`, under the repository root's `.cargo/`.
- **What follows, and what does not.** DuckDB was compiled in this job, on the cl.exe-built cache from main, under a config that names clang-cl for the C++ compiler. That clang-cl was the compiler is an inference from the config, the absent overrides and the success: it is not a logged fact. Gate 2's local reading (352 of 352 units clang-cl) remains the direct evidence of the compiler, and it is for a local target, not this CI job.

## Check 3: E-1's condition and the head
- **Commands.**
  - `gh pr checks 266` > `o1-g3r-checks.txt`: rc 0, 16 checks, all `pass`.
  - `gh pr view 266 --json headRefOid,...`: rc 0. The head is 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6, the state OPEN, and the PR is a draft.
  - `git fetch origin <branch>`: rc 0. `git rev-parse origin/cut/admitted-integer-overflow-silent-wraparound` gives 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6.
- **What the checks list now holds.**
  - The push run's `tauri build` check is job 123017921905: pass, 13m45s.
  - The pull_request run's is the unchanged job 122959781231: pass, 5m16s (N-1).
  - `gh api .../runs/40728961364/attempts/2/jobs` (rc 0) lists two jobs: 123017921905, re-run, and 123017924536, carried over (N-2; `gh api` per job, rc 0 each).
- **E-1.** Closed by its own stated condition (Evidence above).
- **Anything else at the head.** The branch head has not moved. Nothing else changed: no new commit, and every check passes.

## End state
- I ran no cargo command. I made no commit, push, PR action, re-run or cache change, and wrote no repository file.
- My scratch files are `o1-g3r-caches.tsv`, `o1-g3r-job.log`, `o1-g3r-jobmeta.tsv`, `o1-g3r-cache-lines.txt`, `o1-g3r-fetch.txt`, `o1-g3r-config.toml`, `o1-g3r-tauri-build.yml`, `o1-g3r-checks.txt`, `o1-g3r-pr.tsv`, `o1-g3r-shelljobs.tsv` and `o1-g3r-attempt2.tsv`, all in <the session scratch folder>/

Paths:
- C:\dev\spatial-ide\state\consults\gates\2026-10-28-admitted-integer-overflow-silent-wraparound-gate2-reviewer.md
- <the session scratch folder>/o1-g3r-job.log
