# The advisor's draft ADV-2026-11-21-21, for the human's approval: the two written Rust cache keys name the image, windows-2022-shell and windows-2022-shell-tauri-build, with no cache deleted and nothing else changed. Not the human's words and not a ruling: the change lies outside the human's approval of ADV-2026-11-20-25 (ADV-2026-11-21-22 item 2), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-21: PASTES/ADV-2026-11-21-21.md in the advisory folder, 802 bytes, sha256 f34858be5c0cde1bc3685e003de0d136e3c46f14ab8a3ff78a7391806e30fefa, last modified at 2026-11-21T14:13:56Z by the file system; the advisor's message naming it received at 2026-11-21T14:14:02.560Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T14:20:39Z), equal. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-21.

My approval of ADV-2026-11-20-25 (the Windows CI fix) stands, with one addition.

The fix takes the pinned image `windows-2022`. Two of the three workflows name their Rust cache by a written key: `windows-latest-shell` in `product-ci-shell.yml` and `windows-latest-shell-tauri-build` in `tauri-build.yml`. Under those keys the two Windows jobs restore what was built on the other image, and the link fails.

1. Those two keys are renamed to name the image: `windows-2022-shell` and `windows-2022-shell-tauri-build`. Each of the two jobs then builds its cache once more, on `windows-2022`.

2. No cache is deleted. Nothing else changes in the three workflows beyond the fix and these two keys.

3. Everything else in ADV-2026-11-20-25 stands.
