# The human's message of 2026-11-21 (09:45Z): the advisor's drafts ADV-2026-11-21-12 (the words of the copy-or-same question, S8, given to the advisor), ADV-2026-11-20-25 (one CI change so that DuckDB compiles again on the Windows image), ADV-2026-11-19-18 (v0.2 waits for neither the Console node nor the mint-window node) and ADV-2026-11-18-25 (the stop alarm's check (d)) approved

*Filed verbatim by the custodian from the session transcript: the human's message is the user record of 2026-11-21T09:45:10.863Z (UTC), after its queue record (enqueue) at 2026-11-21T09:45:10.585Z; 107 bytes, sha256 991bc01e1ada73a4c69e35397355adab575edc564035fe949b39c6d8c78cabc3, byte-copied by script, with one final newline added. The message approves four drafts in the human's advisory folder, by the grant's item 4 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`): PASTES/ADV-2026-11-21-12.md (456 bytes, sha256 cc6035cd8ebaf50132194d9e0f7c51048c900312f75b2abe4b50f5a9b045854e, last modified at 2026-11-21T08:54:40Z by the file system); PASTES/ADV-2026-11-20-25.md (1090 bytes, sha256 f6aa3c9c1d180c2a9eb4f9715982c3ca0ea383bc0127262931c1dc6030faef8d, last modified at 2026-11-20T19:35:39Z by the file system); PASTES/ADV-2026-11-19-18.md (779 bytes, sha256 58a801eda650524208feba61e4a6387bea35dc504335fa011a4fe825c477bc9a, last modified at 2026-11-19T10:17:50Z by the file system); PASTES/ADV-2026-11-18-25.md (1049 bytes, sha256 2e7b332e0ab2e012ecf4c49d961fccfa011f724f512e3a81ce8320b889301f21, last modified at 2026-11-18T23:31:44Z by the file system); each modified before the approval and read again by the custodian at this filing (2026-11-21T09:59:47Z), equal to its filing on main. Their texts follow the message, each below its own rule, byte for byte. By the approval each draft's text is the human's words. Nothing is changed. The custodian's note, not the human's words: the folder's place on the machine is not written here.*

---

approved ADV-2026-11-21-12
approved ADV-2026-11-20-25
approved ADV-2026-11-19-18
approved ADV-2026-11-18-25

---

Draft for Chris's approval.

To the custodian, 2026-11-21. The words of the copy-or-same question.

The form for saving and reopening a project marks the words of one question as mine: the question the app asks when it opens a project that this machine remembers in another folder, with its three choices (S8). I give those words to the advisor like the other strings the app shows. Its ruling on them stands as mine, and I can overturn it like any other.

---

Draft for Chris's approval.

To the custodian, 2026-11-20.

1. I approve one change to CI, in the three workflows that have a Windows job: `product-ci-shell.yml`, `product-ci-rust.yml` and `tauri-build.yml`. Its purpose is that DuckDB compiles again on GitHub's current Windows image, where the image's Clang 20 is refused by the image's own Visual Studio headers, which expect Clang 22 or newer.
2. The change is one of two, not both: the Windows jobs install LLVM 22 or newer, at a pinned version; or the Windows jobs run on a pinned image label on which DuckDB compiles with the image's own Clang.
3. The piece's first step finds which of the two works. The pull request names it: the version and where it is downloaded from, or the image label. It shows a run in which DuckDB was compiled, not restored from the cache, and the job passed.
4. Nothing else changes in what CI installs. No change to `.cargo/config.toml`, to the Rust toolchain, to a dependency or to a lockfile.
5. The advisor classes and places the piece, and its merge check reads the pull request against this message.

---

Draft for Chris's approval.

To the custodian, 2026-11-19.

v0.2 does not wait for two fixes that came out of the first-look piece. Each gets its own piece, after the ones v0.2 already waits for.

1. The Console. It keeps its newest 256 entries, and one load of a view now fills most of that, so older entries leave it quickly. This is KNOWN-LIMITATIONS item 67. The steps I record stay in the session's history.

2. A rare timing case (`untiled-reissue-holds-earlier-look-handle-until-mint`). If a filter change lands at the moment the previous load is finishing, the new view may not be filled until I pan or zoom, and the status line can say the view is complete. It gets a KNOWN-LIMITATIONS item before v0.2 is tagged.

If I want either fix in v0.2 after all, I will say so.

---

Draft for Chris's approval.

To the custodian, 2026-11-18.

My approval of ADV-2026-11-18-06 (the stop alarm) stands, with one change to its check (d).

One existing test pins the settings file: `the_notification_hook_matches_only_the_two_quota_types` in `scripts/hooks/hooks.test.mjs`. It expects the list of hooks to be exactly the four of today, and the Notification matcher to be the two quota types. Items 1 and 3 of my approval change both. So that test cannot pass unchanged, and check (d) as I approved it cannot be met.

1. Check (d) now reads: every other existing test of the hooks passes unchanged. That one test changes in its two expected values only: the list of hook keys gains `StopFailure`, and the matcher gains `quota_auto_resume_fired`. Its name stays, because an earlier form claims it by name, with one comment line above it saying so. Its other assertions do not change.

2. `scripts/hooks/hooks.test.mjs` joins the piece's files, for that change alone.

3. Nothing else in ADV-2026-11-18-06 changes. It still costs nothing.
