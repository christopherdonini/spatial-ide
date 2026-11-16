# KNOWN-LIMITATIONS item 56: the advisor's words of ADV-2026-11-16-09 applied at 0ef69cb1; the worker's report

*Filed by the custodian, 2026-11-16: the hand-back byte for byte, 2135 bytes, sha256 54dc30aa088b763b4c5471d82714832a4c229229dc832bc0ae0a5ef93817ac59; model claude-sonnet-5-5, 11 calls.*

---

Built: item 56 words at 0ef69cb19e01dfef8489f8011b0e16a59836984f

- Commit subject: `docs: KNOWN-LIMITATIONS item 56: the advisor's words of ADV-2026-11-16-09 after the reviewer's gate (C1, D1 to D4)`. It is signed off with -s. The message file has no `@` outside the first trailer line (grep showed only line 5).
- Before the edits: HEAD and origin/cut/known-limitations-item-56-tile-refusal-record were both 6f98980e9a9fc77b28a577a61b0852544817c4bb, and the porcelain was empty. Each of the four old texts was found exactly once (grep -c gave 1 for each). I made the four replacements with the Edit tool.
- Size and hash after the edits (wc -c and sha256sum, rc=0 for each): 167615 bytes, sha256 102daa62ab1acfecff3ce45b75865109fedcc682b19326dbd017c675b7357733. Both match the values you gave.
- `git diff --numstat` (rc=0): `2	2	KNOWN-LIMITATIONS.md`, no other file. `git diff -U0` showed one hunk header, `@@ -481,2 +481,2 @@`, which covers lines 481 and 482 only.
- Lines 481 and 482: I did not print them in full after the edit. I printed only the replaced parts of each, byte-copied from the file on disk at my head:
  - Line 481: `and the status bar never names it: at most it says that some areas were not loaded, or that areas are not drawn to stay within the render budget.`
  - Line 482: `through reportViewportOutcome in App.tsx and formatRefusal (frontends/shell/src/admission/formatRefusal.ts)`
  - Pairs 2 and 3 on line 482 were not re-printed after the edit.
- A stray `cut` command in my last check call failed with "invalid decreasing range". It was a typo with no bearing on the checks above.
- Push: `git push` ran in its own call, rc=0, 6f98980e..0ef69cb1. After it, origin/cut/known-limitations-item-56-tile-refusal-record equals HEAD (0ef69cb19e01dfef8489f8011b0e16a59836984f) and `git status --porcelain` is empty.
- Background shells left: none.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
- Self-check on the four failure classes: this change touches no cross-module interface, code, tests or user-facing messages beyond the item's own wording. Nothing was built or tested, as ordered.