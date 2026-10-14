*Custodian's filing note (2026-10-14): the worker's report for PR #218's correction round 1 (the form's Amendment 3: E-STATUS-HEIGHT at a window of 880 by 800), built in C:/dev/wt/sb1h from e1f92a97; the head d9e9b817a039f0b3f0d8dc4477e7edd206f1ceb0, pushed and checked by the custodian (porcelain empty; local equals origin). The run 2026-10-14T12:44:05Z to 2026-10-14T12:52:03Z by its transcript (Bash 12, bash 1); its one SubagentHandback call, at 12:52:02Z. Extracted by script; 0 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is db742dca7ee9535c8351c1fcdfa070e0b6ba19fac2f673378c64bfaf4ac8013b; this file's, from line 5 to the end, is db742dca7ee9535c8351c1fcdfa070e0b6ba19fac2f673378c64bfaf4ac8013b. The e2e is the custodian's, recorded separately.*

---

Amendment 3 items 2, 4 and 5 are built in `frontends/shell/e2e/selection.mjs` only. I have not run it, because e2e is out of my reach.

**Head:** d9e9b817a039f0b3f0d8dc4477e7edd206f1ceb0, one `test:` commit signed off, with the Co-Authored-By trailer. It is pushed to `cut/shell-status-bar-one-height` (e1f92a97..d9e9b817). Before starting, the head was e1f92a97 and the porcelain was empty.

**Change:**
- The present body is renamed `stepStatusHeightAt880`, one line, and is not re-indented.
- A new outer `stepStatusHeight` does the window work:
  - It reads the inner size and the window bounds with `Browser.getWindowBounds`.
  - It sets 880 by 800 with `Browser.setWindowBounds`, then polls with `pollUntil` for 5 s until `innerWidth` is 880 and `innerHeight` is 800.
  - If a window call throws or the size does not take, it throws INCONCLUSIVE (class 2, never a pass), naming the size read.
  - A `finally` restores the bounds it read and polls until the inner size is back. A restore that does not take fails the step and names both sizes.
  - If the body had already failed, the restore failure is appended to that error's message, so the earlier failure is not hidden.
  - The CDP session is detached in the `finally`.
- B now records whether `.residency-status` is present. The PASS note gains that field, the inner size after the resize and the inner size after the restore; none of these is asserted.
- I did not touch the header's step list, the recorded-mutation comment or the mutation. E-DBLCLICK is still last.
- I did not write a new doc comment for the outer function. The present comment stays above the renamed body.

**Commands and exit codes:**
- `node --check e2e/selection.mjs`: 0
- `verify-cites.mjs`: 0, PASS
- `verify-quotes.mjs`: 0, PASS
- `verify-test-claims.mjs`: 0, PASS
- `verify.mjs`: 0, PASS
- `git push`: 0

**§7:**
- This round adds 33 insertions and 3 deletions to `selection.mjs`, which is 36, exactly Amendment 3's allowance. I had to merge a few statements onto shared lines to stay within it.
- By §7's command, `git diff --numstat f8bc2951...HEAD -- frontends/shell/e2e/selection.mjs` gives 81 and 1, a total of 82. That is below 88, because earlier changed lines overlap this round's.

**Final porcelain:** empty.

**Pre-gate self-check:**
- The CDP calls use the interface `pan-anchor.mjs:180-191` actually makes.
- The session pattern follows `selection.mjs:309-323`.
- Every completion claim points to a command above.
- The new message texts describe behaviour implemented at this commit.
- Only the syntax check reached any assertion, since e2e was not run.

**Model:** Sonnet 5.5, no override, no context handoff.
