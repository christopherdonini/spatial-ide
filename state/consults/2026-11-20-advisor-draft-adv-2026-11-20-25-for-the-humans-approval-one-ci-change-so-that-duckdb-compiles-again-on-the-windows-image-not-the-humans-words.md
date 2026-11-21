# The advisor's draft ADV-2026-11-20-25, for the human's approval: one CI change, in the three workflows with a Windows job, so that DuckDB compiles again on GitHub's current Windows image, by a pinned LLVM 22 or newer or a pinned image label, not both. Not the human's words and not a ruling: what CI installs is the human's (the grant's item 4 (c)), so nothing in it is acted on or built until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-20: PASTES/ADV-2026-11-20-25.md in the advisory folder, 1090 bytes, sha256 f6aa3c9c1d180c2a9eb4f9715982c3ca0ea383bc0127262931c1dc6030faef8d, last modified at 2026-11-20T19:35:39Z by the file system; the advisor's message naming it received at 2026-11-20T19:35:52.553Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T19:39:46Z), equal. Filed with the next records commit, as ADV-2026-11-19-18 was. The custodian's fact check, at main 0dd9bed3: the workflows whose jobs run on a Windows image are exactly the three it names (product-ci-rust.yml by a matrix entry); the root .cargo/config.toml sets clang-cl for the Windows target; and run 44798555221's log shows clang-cl, from the image's LLVM 20, stopped at STL1000 in the image's MSVC 14.52.37025 headers, which expect Clang 22 or newer. No clause was found untrue. Whether either route works is the piece's first step. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-20.

1. I approve one change to CI, in the three workflows that have a Windows job: `product-ci-shell.yml`, `product-ci-rust.yml` and `tauri-build.yml`. Its purpose is that DuckDB compiles again on GitHub's current Windows image, where the image's Clang 20 is refused by the image's own Visual Studio headers, which expect Clang 22 or newer.
2. The change is one of two, not both: the Windows jobs install LLVM 22 or newer, at a pinned version; or the Windows jobs run on a pinned image label on which DuckDB compiles with the image's own Clang.
3. The piece's first step finds which of the two works. The pull request names it: the version and where it is downloaded from, or the image label. It shows a run in which DuckDB was compiled, not restored from the cache, and the job passed.
4. Nothing else changes in what CI installs. No change to `.cargo/config.toml`, to the Rust toolchain, to a dependency or to a lockfile.
5. The advisor classes and places the piece, and its merge check reads the pull request against this message.

*Approved, 2026-11-21: the human's typed message of 09:45Z approves this draft by its id (`state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md`); from then its text is the human's words. Nothing above is edited.*
