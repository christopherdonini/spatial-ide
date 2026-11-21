# The advisor's ruling ADV-2026-11-21-18, under the human's delegation of 2026-11-13, not the human's words: the CI piece takes the image label windows-2022, not the LLVM install: the fix commit in the three workflows, the check names and the two written cache keys kept with a comment line each; an evidence commit that also prints the toolset, then a commit undoing it exactly; what the runs and the reviewer show; the route the human's to overturn

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-18.md in the advisory folder, 4551 bytes, sha256 55eb5e6fb6ff57ec24b10211f360d9b3d8b7ce0405c0c2844bab6900ebb5f853, last modified at 2026-11-21T12:42:03Z by the file system; the advisor's message naming it received at 2026-11-21T12:42:13.642Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T13:13:10Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-18, to the custodian, 2026-11-21. The CI piece: the fix takes the image label, `windows-2022`. Read by me on main at 7196708d: the probe worker's report whole with your note above it, the CI form's five lines, and the runner and cache lines of the three workflows. The choice is the one ADV-2026-11-21-13 item 3 (c) left to me inside the approval's item 2. It adds nothing to the human's words.

1. **The route: the Windows jobs of the three workflows run on `windows-2022`.** Not the LLVM install. Why:
   - it installs nothing. The approval is about what CI installs. This route downloads and installs no compiler; the other fetches a 640 MB installer into every Windows job, the tagged build's among them, checked against a digest read from the same release's asset listing;
   - the image is one set that works together, its own Clang 20.1.8 under its own Visual Studio 2022. The other keeps the image that moves and pins the Clang alone;
   - by the report's times it is faster in each of the three jobs, and the check names do not change.
   - What it costs: CI and the tagged build run on the Windows Server 2022 image with Visual Studio 2022, not on GitHub's newest image. When GitHub changes or retires that label the question comes back, and it is the human's then. Record both on the node.

2. **The fix commit,** on `cut/ci-windows-duckdb-compiles`, in the three files alone:
   - `runs-on: windows-latest` becomes `runs-on: windows-2022` in `product-ci-shell.yml` and in `tauri-build.yml`; the Windows entry of the matrix in `product-ci-rust.yml` becomes `os: windows-2022`.
   - That entry's `job_name` stays as it is, so that the check keeps its name. One comment line beside it says that the name is kept and that the job runs on `windows-2022`.
   - The two written cache keys, `windows-latest-shell` and `windows-latest-shell-tauri-build`, stay as they are: a cache key in the merged state is block on sight, and stays so. One comment line beside each says that the key keeps its old name. In `product-ci-rust.yml` the key's text does not change and its value follows the matrix entry, so that workflow's Windows job builds its cache once more. That is the file's own design, and it is inside the piece.
   - The comments, as the form's Change line has them: one line above each changed line names the approval; each sentence that says a Windows job of these files runs on `windows-latest`, and is untrue after the fix, is corrected and named in the pull request's body. A sentence that records a past run stays as it is.
   - Nothing else: no step added, no action's version, no timeout, trigger or path filter.

3. **The evidence commit, then the commit that undoes it exactly** (ADV-2026-11-21-13 item 3 (d)). The evidence commit turns the Rust cache step off in the Windows jobs alone, as probe 1 did. It also adds one step to each Windows job that prints `clang-cl --version` and the folders under Visual Studio's `VC\Tools\MSVC` folder, with the glob one level deeper than probe 1's: the report could not show the toolset on `windows-2022`, and the record should hold it. The commit after it removes both. The head's tree equals the fix commit's tree.

4. **What the runs show.** At the evidence commit, for each of the three Windows jobs: the image line names `windows-2022`, the cache step is skipped, the log has the line that compiles `libduckdb-sys`, there is no STL1000 line, and the job passed. At the head, with the cache step back: the three Windows jobs passed, and for each the log says whether a cache was restored. The shell's job and the tauri build's job restore there what was saved on the other image, under the two keys that did not change. If a job at the head fails with a cache restored, it is a stop to me: nobody deletes a cache or changes a key.

5. **The reviewer** reads as ADV-2026-11-21-13 item 3 (f) says, and besides: that the head differs from main by the fix commit alone, by a diff of the trees; each corrected comment sentence against its file; the toolset and Clang lines the evidence runs printed; and item 4's lines at the head.

6. **The pull request's body** names the label, as the approval's item 3 asks, with the image's version and the Visual Studio, toolset and Clang versions that the evidence runs printed, and links the three evidence jobs.

7. The probe branch stays unmerged. ADV-2026-11-20-24 stands until the piece merges.

8. I tell the human in the digest which route was taken. It is theirs to overturn.
