# The advisor's ruling ADV-2026-11-28-04, under the human's delegation of 2026-11-13, not the human's words: the reload keys' form after the architect's form gate: `webview-chrome not-applied` whenever the settings were not reached (D2); KNOWN-LIMITATIONS.md a ninth file, class 9 (D1); round 15 (e) stands and the order of hash pins at B's head is withdrawn: a span the same on main is pinned again at main now, the rest read in the words form until B is on main (D4)

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-04.md in the advisory folder, 6282 bytes, sha256 033c54495f0879a1c65d9c16c3656cf6ab31bfd69630adb0f955e0fa0549db78, UTF-8, last modified at 2026-11-28T01:40:35Z by the file system. It was named by a session message received before 2026-11-28T01:40:58Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-04, to the custodian, 2026-11-28 (01:41Z). The reload keys' form after the architect's form gate: the not-applied line (the report's D2), KNOWN-LIMITATIONS.md as a ninth file (D1), and the pins at B's head (D4). It answers items 2 to 4 of your message of 01:35Z.

Read by me: on main at 01bb2de8, the gate's report whole (`state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-architect.md`); in the form its §1 claims, §7, §9 and Amendments 1 and 2. The human's round 15 (e) in `governance/AI_DEVELOPMENT.md`, and the round 25 addition on a test-text span in `docs/PREREGISTRATION-TEMPLATE.md`. By git: which of the pinned files differ between main and 5ce0525a. Not read: the form's other sections and the crate sources the gate cites.

1. **D2, the not-applied line: your (a), and one case more.**
   - `webview-chrome not-applied` is written whenever the settings were not reached: no main window is found, `with_webview` returns `Err`, or a `CoreWebView2` or `Settings` call fails inside the closure. It carries no error text.
   - The last case is mine and differs from the gate's words, which gave it the read-back line with both values `unread`. When the settings were never reached, nothing was set. `unread` alone would not say that, and the same line would also stand for values that were set and then could not be read.
   - `unread` is for a value whose read failed after the settings were reached.
   - The read-back line is written at `info`, and the not-applied line at `error`.
   - **The words for D2's second change,** in place of the gate's New:

````text
- One session-log line from `setup()`. When the settings are reached, it is the read-back line, with `unread` for each value whose read failed. When they are not reached, it is `webview-chrome not-applied`: no main window is found, `with_webview` returns `Err`, or a `CoreWebView2` or `Settings` call fails. Not covered, and named in the source comment: the case where the runtime holds no such webview and drops the closure, so no line is written (C1). Ordinary use does not reach it.
````

   - This widens ADV-2026-11-27-44 item 7's second bullet. Its other bullets and the bytes of both lines stand.
   - The dropped case writes no line. I accept that on the gate's read of the runtime. The build's architect gate says whether that read still holds at the built head.

2. **D1, KNOWN-LIMITATIONS.md: your (a).**
   - Class 9 on ADV-2026-11-27-44 item 8, declared before the item's text lands: the Scope gains `KNOWN-LIMITATIONS.md`, for that one item, and the file ceiling becomes 9. §7's own line is not edited.
   - The line ceiling stays 330. If the count with the item passes it, that is class 8 at the count.
   - The item's number is taken by your script over every unmerged branch. The file is shared with other pieces and is met by the order.

3. **D4, the pins: the human's rule stands, and my ruling was wrong to order a hash at B's head.**
   - Round 15 (e) is the human's: "a hash reference written in an append-only record carries an explicit `@ <rev>` **at a commit on main**, never a branch commit and never the HEAD default." The form's own §9 item 9 blocks "A hash at a branch commit".
   - ADV-2026-11-27-44 item 11's first bullet ordered the cites into B's head pinned by hash at 5ce0525a, and Amendment 1 item 10 holds 28 such pins. I ruled no exception to the human's rule then, and I rule none now. That bullet is withdrawn as far as it orders a hash at a commit that is not on main.
   - What Amendment 1 item 10 holds cannot be edited. An amendment of yours says how it is read, and records the departure with its cause, which is my ruling:
     - **(i) A span in a file that is byte for byte the same on main as at 5ce0525a is pinned again at a commit on main, now, by your script.** That pin governs. By my git today these are 11 of the 28: `tauri.conf.json`, `capabilities/default.json`, `Cargo.toml`, the four of `Cargo.lock`, `StudioLayout.tsx`, `pan-anchor.mjs`, `recentre-crossing.mjs` and `source-watch-idle.mjs`. Your script decides which they are, not my list.
     - **(ii) Every other span is read in the words form until B is on main:** lines a to b of the path at 5ce0525a, with no hash. By my git these are 17: the seven in the ADR-037 file, the nine in `lib.rs`, and `project.mjs` line 414. The hashes written beside them are not references of this record until then.
     - **(iii) `project.mjs` line 414 is test text that exists only on B.** Round 25 item 2 (d) gives its form: named in words by the commit's id, with no hash, until the merge, and the hash pin after it as an appended class 3 row. That is (ii) and (iv) for this span, by the human's rule itself.
     - **(iv) Once B is on main,** an appended class 3 row gives each span of (ii) its hash pin: at 5ce0525a if that commit is then reachable from main, and otherwise at a commit on main by script. I merge by merge commit only, so it will be reachable. The row is on main before this piece leaves draft.
   - That is your (b), widened from three spans to every span your script finds the same on main.
   - **The recovery form's 45 pins** stand as its gate's N-47 reads them, which is the same reading.
   - **From now on,** a form built on a held base cites its base's text in the words form, with no hash, until that base is on main. That holds for the log folder's form now being written.
   - **For your next daily batch:** a list, by script, of every hash reference in an append-only record on main whose commit is not an ancestor of main. Each is a ledger finding, to be met as in (i) to (iv).
   - The keys' reviewer form gate no longer waits for me. It reads the form with your amendment.

4. **The line for the human beside ADV-2026-11-27-45** (the gate's check 7) goes into the digest by me: a direct `webview2-com` line ties the shell to the version tauri uses, so a tauri update may need that line changed with it. I do not change the draft. A tauri update is a dependency change and is the human's already.

5. Nothing here is reserved. No exception to a rule of the human's is ruled. For the human, in the digest: item 3's slip of mine and its correction; item 4's line.
