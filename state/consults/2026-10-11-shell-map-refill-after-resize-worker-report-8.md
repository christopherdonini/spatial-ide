*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 8, item 39's third sentence replaced by the human's under the form's Amendment 4, head 58967ff4d0a7191ef33142cf2cf73ac7f8eb1480, published (the worker run 08:49:11Z to 08:51:25Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 5627c6e5322b4ecba9ea8940ba547c8a94718dbec9285adc82d3dbe8c7585477.*

---

Commit 58967ff4d0a7191ef33142cf2cf73ac7f8eb1480: "docs: item 39's third sentence replaced with the human's wording (map-refill Amendment 4)". It is signed off and carries the Co-Authored-By trailer.

**What changed.** `KNOWN-LIMITATIONS.md` only, 2 lines. A single node script made the edit. It read directive line 11 (leading spaces stripped) and the clause from Amendment 4 item 2 in the form on main. No sentence was typed.
- The span "Before the first pan" to "asks for nothing new." occurs once in the file and once on the item line.
- The clause was copied from the double-quoted text in Amendment 4 item 2.

**Old and new lines, byte-copied by script, with sha256 over the line without its newline:**

OLD item line, sha256 16cd12675b47da8413ab7744689dc9a17c47cea7e785a5db9f28d34f7f023d94:
39. **Retired by shell-map-refill-after-resize.** When the map grows, because a region is closed, a splitter is dragged or the window is enlarged, the shell asks for the part of the map that lies outside the area it last asked for, with no pan or zoom. When the map shrinks it asks for nothing, because what it shows is already inside that area. Before the first pan, zoom or Zoom to layer after a file is opened, the map shows the features loaded when the file opened, and a change of size asks for nothing new. The number is kept so that references to it still resolve.

NEW item line, sha256 eba80c9a1ec861011e801e09070d030f910d0e4f090480ad930340f535461fab:
39. **Retired by shell-map-refill-after-resize.** When the map grows, because a region is closed, a splitter is dragged or the window is enlarged, the shell asks for the part of the map that lies outside the area it last asked for, with no pan or zoom. When the map shrinks it asks for nothing, because what it shows is already inside that area. One exception: after a file is opened, a filter is applied or cleared, or the map fits itself to the data, the map shows the features already loaded, and a change of size asks for nothing new until the next pan, zoom or Zoom to layer. The number is kept so that references to it still resolve.

Third sentence, equal to directive line 11 without its three leading spaces: sha256 0ee2481302311c98b625372d833cf0ada6133b2ff775fc06cfc0dd2227cba149.

Comment line, old sha256 9748a508cf49a1407f1795efba2e751a007935b4f8c65b450a0be9f0835e0223, new sha256 4308eec70f97cd81b51ce2a19475869f28f0e73290c095bac767b6f54ff9d81d. The new line is the old line with the clause inserted right after "(this form's Amendment 1, item 4)". The old line ends "...RESIZEQ and FILL. -->". In the new line, the text up to "item 4)" reads:
`    <!-- Retired by frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md §2.5 and its Amendment 1 (OPEN-1, OPEN-2); wording approved by the human on 2026-10-09 (this form's Amendment 1, item 4)`
and continues with the clause, then the rest of the old line unchanged:
`; its third sentence is the human's own wording of 2026-10-11 (this form's Amendment 4)`
Clause sha256: fe0e19ad113e8a70a7994b07540b5ebe8147c97cd3164f64fb304ab186c0e39b.

**Checks:**
- Script asserts, all true: the new item line equals the old one with only that span replaced; the new line contains the directive sentence; the comment line gained exactly the clause.
- `git diff --numstat a2f09cc9 HEAD` gives `2 2 KNOWN-LIMITATIONS.md`, so exactly two lines changed in one file.
- No CRLF: `file KNOWN-LIMITATIONS.md` shows none, and a count of CR bytes is 0.
- `node scripts/plan/verify-cites.mjs`: exit 0.
- `node scripts/plan/verify-quotes.mjs`: exit 0.
- §7 outside-the-count figure, `git diff --numstat 4fd3259a...HEAD -- KNOWN-LIMITATIONS.md`: `2 3`, which is 5 lines changed in total, against the budget of 8.

**Branch state.** `cut/shell-map-refill-after-resize`: `git status --porcelain` is empty and HEAD is 58967ff4d0a7191ef33142cf2cf73ac7f8eb1480. It is published (`a2f09cc9..58967ff4`). I opened no pull request and did not edit the PR body. I ran no e2e suite, did not start the app, and did not touch main or the base worktree.

**Self-check.** Cross-module seams: none. Every claim above points to a script result or an exit code. No user-facing message was added. The test-reach class does not apply, since this is a docs-only change. The model I observed myself running as is Sonnet 5.5, with no override. I received no context handoff and produced none.
