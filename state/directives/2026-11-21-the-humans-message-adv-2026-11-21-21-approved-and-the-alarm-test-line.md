# The human's message of 2026-11-21 (15:32Z): the advisor's draft ADV-2026-11-21-21 (the two written cache keys name the image) approved, and the stop alarm's TEST message as it reached them

*Filed verbatim by the custodian from the session transcript: the human's message is the user record of 2026-11-21T15:32:03.032Z (UTC), after its queue record (enqueue) at 2026-11-21T15:32:02.719Z; 136 bytes, sha256 c19bdf1c8e734b9d905bb5f6031c2482a00e083bc595aef1754431b19319e31f, byte-copied by script, with one final newline added. Its first line approves one draft in the human's advisory folder, by the grant's item 4 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`): PASTES/ADV-2026-11-21-21.md (802 bytes, sha256 f34858be5c0cde1bc3685e003de0d136e3c46f14ab8a3ff78a7391806e30fefa, last modified at 2026-11-21T14:13:56Z by the file system), modified before the approval and read again by the custodian at this filing (2026-11-21T15:43:10Z), equal to its filing on main (`state/consults/2026-11-21-advisor-draft-adv-2026-11-21-21-the-two-cache-keys-name-the-image-not-the-humans-words.md`). Its text follows the message, below its own rule, byte for byte. By the approval the draft's text is the human's words. The message's second line is the stop alarm's TEST message as it reached them; the advisor reads it as their line for live check (b), in its ruling ADV-2026-11-21-23 (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-23-the-humans-second-line-is-the-alarm-line.md`). Nothing is changed. The custodian's note, not the human's words: the folder's place on the machine is not written here.*

---

approved ADV-2026-11-21-21

Session stopped on an error: rate_limit — TEST of the stop alarm, live check (b): no session stopped (...)

---

Draft for Chris's approval.

To the custodian, 2026-11-21.

My approval of ADV-2026-11-20-25 (the Windows CI fix) stands, with one addition.

The fix takes the pinned image `windows-2022`. Two of the three workflows name their Rust cache by a written key: `windows-latest-shell` in `product-ci-shell.yml` and `windows-latest-shell-tauri-build` in `tauri-build.yml`. Under those keys the two Windows jobs restore what was built on the other image, and the link fails.

1. Those two keys are renamed to name the image: `windows-2022-shell` and `windows-2022-shell-tauri-build`. Each of the two jobs then builds its cache once more, on `windows-2022`.

2. No cache is deleted. Nothing else changes in the three workflows beyond the fix and these two keys.

3. Everything else in ADV-2026-11-20-25 stands.
