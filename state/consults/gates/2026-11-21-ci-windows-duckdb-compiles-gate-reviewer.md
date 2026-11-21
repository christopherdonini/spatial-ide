Reviewed: cut/ci-windows-duckdb-compiles at 3e41a14b378e9040d7749573f1584a95a385048d (the custodian's filing note, 2026-11-21: the CI piece's single gate, attempt 1 (ADV-2026-11-21-13 item 3 (a)); the hand-back of the reviewer (claude-opus-5-5), 10890 bytes, sha256 4cf4548864aa7278f3e8e5fae644bc36df26afa8c31df36d85a51499b27c8839; calls Bash 29, SubagentHandback 1, by unique call ids; errored 2 (Bash, Bash); from 2026-11-21T17:42:44Z to 2026-11-21T17:48:50Z; masked by the custodian: the scratch folder path 1 times; nothing else changed)

Checked: ci-windows-duckdb-compiles-on-the-current-image, reviewer, at 3e41a14b378e9040d7749573f1584a95a385048d
Verdict: PASS WITH NOTES

Reviewed: cut/ci-windows-duckdb-compiles @ 3e41a14b378e9040d7749573f1584a95a385048d. The form was read on main @ 06acb8208010467c0d13932872cb3c9200dcf185. Reviewer model: Opus 5.5 (claude-opus-5-5).

The code passes every check. I found one documentation error in the record: Amendment 4 gives the wrong image version. It is must-fix before the merge, and the exact correction words are at the end.

Mutations: none. I wrote nothing to the repository or the worktree. The only files I wrote are the downloaded job logs, in <S>\cigate\

**Heads.** `git rev-parse` gives these values:
- Main and origin/main: 06acb820….
- The worktree HEAD, origin/cut/ci-windows-duckdb-compiles after a fetch, and `ls-remote`: all 3e41a14b378e9040d7749573f1584a95a385048d.
- The worktree is clean.
- The merge base is e2b2f572. `git diff --stat e2b2f572 origin/main -- .github/` is empty, so main has not touched the workflows since the branch was cut.

## Check 1 — Scope: pass

**Commands:** `git diff --stat origin/main...HEAD`, the full three-dot diff, and a grep of runs-on, key and timeout lines in the three files at head.

**What they showed:**
- 3 files changed: product-ci-rust.yml, product-ci-shell.yml and tauri-build.yml. The diff is 14 lines added and 8 removed.
- Changed lines:
  - `runs-on` in the shell and tauri jobs.
  - The Windows matrix `os` line, plus one kept-name comment beside `job_name`.
  - The two written keys, now `windows-2022-shell` and `windows-2022-shell-tauri-build`.
  - Comment and header lines.
- Not changed: any other workflow, `.cargo/config.toml`, the toolchain, a dependency, a lockfile, an action version, a timeout, a trigger, a path filter, concurrency, or anything under `.claude/`.
- The Ubuntu and macOS matrix entries are untouched.
- The value of product-ci-rust.yml's key `${{ matrix.os }}-workspace` now follows the new label. ADV-2026-11-21-18 item 2 rules that inside the piece.

**Finding:** none.

## Check 2 — The change: pass

There is one route, the image label `windows-2022`. Nothing installs LLVM. Comment lines:
- Above each changed `runs-on` and `os` line, one line names ADV-2026-11-20-25 and ADV-2026-11-21-18.
- Above each renamed key, one line names ADV-2026-11-21-21, replacing the old "keeps its old name" line (diff 0ce16549..3e41a14b).
- product-ci-rust.yml:203 says the job name is kept, as ADV-2026-11-21-18 item 2 requires.

Header sentences corrected for the new label: product-ci-shell.yml:14 and :20, and product-ci-rust.yml:38. In the three files, `windows-latest` now appears only in sentences that record past runs (rust :65 and :90) and in the kept `job_name`, which ADV-2026-11-21-18 item 2 allows.

**Note N1 (no change required):** rust.yml:38 now reads "`windows-2022` is the reference profile in `CLAUDE.md` (Windows 10 / …)". The runner is Windows Server 2022, not CLAUDE.md's Windows 10 machine. The earlier sentence ("`windows-latest` is the reference profile…") had the same loose stand-in sense. The piece changed only the label word, as it was told to.

## Check 3 — Budget: pass

Counted by §21c (insertions plus deletions, governance/AUTONOMY.md §21c): 14 + 8 = 22 changed lines in the merged diff. The limit is 60. The form and the records are not on the branch.

## Check 4 — Evidence: pass, with one documentation finding

**Commands:**
- `gh run list --commit` for 96a7c36c, 0ce16549 and 3e41a14b.
- `gh run view <run> --json jobs`.
- `gh run view --job <id> --log` for six jobs. The colour codes appear in these logs as literal text (`^[[…m`), not as escape bytes, so I stripped both forms.
- Greps for `Compiling libduckdb-sys` and `STL1000`. I first checked that each pattern finds a known matching line.
- `gh api …/actions/jobs/<id>` for the step results.

**Evidence commit 96a7c36c:** run 44907618403 (Rust workspace) and run 44907618426 (shell), both success.

| Job | Name | Image | Rust cache step | libduckdb-sys compiled | STL1000 lines | Result |
|---|---|---|---|---|---|---|
| 136856453430 | cargo test --workspace (windows-latest) | windows-2022, version 20261116.370.1 | skipped | 1 line, in "Build the workspace and every test target" | 0 | success |
| 136856453337 | shell | same | skipped | 2 lines, in "Build and test the Tauri backend" and in the release-profile check | 0 | success |
| 136856453581 | tauri build | same | skipped | 1 line | 0 | success |

All three printed "clang version 20.1.8" and the toolset folders `…\2022\Enterprise\VC\Tools\MSVC\14.29.30133` and `14.44.35207`. The Ubuntu and macOS jobs of 44907618403 passed. This matches Amendment 2 item 2.

**Head 3e41a14b:** run 44922808108, event push, created 2026-11-21T16:07:21Z, success.

| Job | Name | Image | Cache key | Restore | libduckdb-sys compiled | STL1000 lines | Result |
|---|---|---|---|---|---|---|---|
| 136902305747 | shell | windows-2022, version 20261116.370.1 | `windows-2022-shell` | "No cache found." | 2 lines, the first in "Build and test the Tauri backend" | 0 | success |
| 136902306088 | tauri build | same | `windows-2022-shell-tauri-build` | "No cache found." | 1 line | 0 | success |

The sha256 of my downloaded logs begins e84098e0d34f53f5 and e3408233f9d297c2, equal to the prefixes in Amendment 4 item 2 (b).

**The Rust workspace at the head's tree:** the key commit did not touch product-ci-rust.yml, and the workflow did not run at 3e41a14b. Run 44910484322 at 0ce16549 stands in for it: job 136865039290 ran on windows-2022, key `windows-2022-workspace`, "No cache found.", compiled libduckdb-sys, passed.

**The stop that Amendment 2 item 3 records:** job 136865039000 at 0ce16549 shows `Restored from cache key "v0-rust-windows-latest-shell-…" full match: true`, 8 LNK2019 lines and 2 LNK1120 lines. Amendment 2 item 3 is confirmed.

**Amendment 4's checklist (ADV-2026-11-21-20 item 3):**
- These items hold: (a), (b) apart from the image version, (c), (d) and (e). The job ids, event, creation time, keys, "no cache found", the compile step, the absence of STL1000 and both results all match.
- Amendment 1 says the fix commit has 12 lines added and 6 removed; `git show --shortstat 132a0a7e` agrees.

**D1 (documentation, must-fix before the merge):** Amendment 4 item 2 (b) says the head run's image was "windows-2022 version 20261111.635", and item 3 calls that "one difference from the evidence commit".
- Both are wrong. 20261111.635 is the version of the "Runner Image Provisioner / Hosted Compute Agent", and it is the same in all six jobs, the evidence jobs included.
- In every job, the evidence runs and the head runs alike, the image group reads "Image: windows-2022 / Version: 20261116.370.1".
- The difference item 3 describes does not exist.
- This is documentation-only under ADV-2026-11-21-20 item 2 (a): words close it, no requirement or guarantee depends on the figure, and the evidence itself is complete.

The form is append-only, so the correction goes in a new appended amendment. Exact words (a correction, three sentences):

> Amendment 4 items 2 (b) and 3 took version 20261111.635, which is the version of the job's Runner Image Provisioner (Hosted Compute Agent), for the image's version. Jobs 136902305747 and 136902306088 ran on the image windows-2022, version 20261116.370.1, the same version the evidence commit's runs had, so item 3's difference does not exist. Proof: the "Runner Image" group in each job's log (`gh run view --job <id> --log`).

Checks of each clause:
- Clause 1 is true: the "Runner Image Provisioner" group of each of the six jobs reads "Hosted Compute Agent / Version: 20261111.635".
- Clause 2 is true: the "Runner Image" group of 136902305747 and 136902306088 reads "Image: windows-2022 / Version: 20261116.370.1", and so do jobs 136856453430, 136856453337 and 136856453581 at 96a7c36c.
- Clause 3: the command named is the one that produced those lines.

Not the human's wording: this is the custodian's amendment.

## Check 5 — History: pass

**Commands:** `git log` with parents, `rev-parse <c>^{tree}`, a diff of the two revert diffs, `reflog` (HEAD, the branch and its upstream), `merge-base --is-ancestor`, and `ls-remote`.

**What they showed:**
- The chain is linear: e2b2f572 → 132a0a7e (fix) → 96a7c36c (evidence) → 0ce16549 (undo) → 3e41a14b (keys).
- The tree of 132a0a7e equals the tree of 0ce16549 (8c931184…), and `git diff 132a0a7e 0ce16549` is empty, so the evidence commit is undone exactly.
- The evidence commit changes only the three Windows jobs. It adds `if:` to the cache steps: `false` in shell and tauri, and `runner.os != 'Windows'` in rust, so the Ubuntu and macOS entries keep their cache. It also adds one print step per Windows job.
- 0ce16549..3e41a14b changes 2 files, 4 lines added and 4 removed, keys and comments only.
- The head's diff from main is therefore the fix plus the key rename.
- The branch and upstream reflogs show only "commit" and "update by push" entries. There is no amend and no rebase.

**Note N2:** the worktree's HEAD reflog has `e2b2f572 reset: moving to HEAD` at 14:08:40 +0100. It comes 7 s after the worktree was created, moves e2b2f572 to e2b2f572, and precedes the first commit. It looks like the internal reset that worktree creation does, and it rewrites no commit.

**Probe branch:** probe commits a8f79cab and 157c2878 are not ancestors of HEAD. The probe branch is still on origin, unmerged, and no PR exists for either branch.

## Check 6 — CI at the head: pass

At 2026-11-21T17:45:13Z, and again at 17:48:01Z by `date -u`, `gh run list --commit 3e41a14b378e9040d7749573f1584a95a385048d` showed two runs:
- 44922808108, Product CI — shell: completed, success.
- 44922808100, Ported notices: completed, success.

This matches Amendment 4 item 2 (e).

## Notes

- **N3:** the PR body has not been written yet. By ADV-2026-11-21-18 item 6 and ADV-2026-11-21-13 item 3 (e), it must:
  - name the label `windows-2022` and the image version 20261116.370.1;
  - name Visual Studio 2022 (the Enterprise folder the runs printed), the toolsets 14.29.30133 and 14.44.35207, and Clang 20.1.8;
  - link the three evidence jobs at 96a7c36c and run 44922808108;
  - name the corrected header sentences (shell :14 and :20, rust :38).

  The Visual Studio build number 17.14.37906.3 comes only from the probe report. The evidence runs printed the toolset folders, not that number, so the body should attribute it to the probe report.
- **N4 (outside the Scope, docs lane):** `kernel/tests/session_history.rs:640` says in the present tense "The proof is CI's windows-latest job". After the merge it would be stale. That file is outside this piece's Scope, so do not edit it here.
