*Filed by the custodian: P6's first group's three comments in the reviewer's words (ADV-2026-11-21-17 item 1), the hand-back of the worker (claude-sonnet-5-5), 2294 bytes, sha256 6bcb8b024743cee6132a551d166be715b15d67b37e822bf6fd99d5751e89fdfa, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Read 1, Bash 6, Write 2, SubagentHandback 1; none errored, from 2026-11-21T12:46:38Z to 2026-11-21T12:47:51Z. Read by the custodian: cut/1c-p6-group-1 at 13e1a7e9, the head and the remote branch equal, the porcelain empty; the custodian's own check of the commit ended CHECK OK (the 1c form's Amendment 76 item 2).*

---

Built: P6's three comments at 13e1a7e9c5ff3dc78fb80c2ac3ec6686d78ecc51
Result: the three comments are replaced with the reviewer's words by script, committed and pushed. The check ended `CHECK OK`.

- **Start state:** HEAD, and `git ls-remote` for cut/1c-p6-group-1, were both b42ccb3e7060d7179822ee21c7661ca2699bb18b. `git status --porcelain` was empty. The copy `adv-21-17.copy.md` has sha256 ea33e22a3d626932a72203b777ae88502783bcca0faeed1bc55ef647dd6308a5, as required.
- **Script:** `<S>/p6n-apply.mjs`, sha256 5cfdbe0f1b1c2e27790699b3b1431c1ede8f6b1d5495cde635ce0d3d25616365. It reads the report with `git show origin/main:<path>` and checks each old text occurs once and each new text once. Its output is in `<S>/p6n-apply.out`.
- **N1:** line 89 of `actionRegistry.ts` changed only in its cite, from `ADV-2026-11-21-14 item 2` to `ADV-2026-11-20-05 item 2`. The replacement is the report's backticked text, with its two leading spaces kept.
- **N2:** lines 15-16 of `saveProject.ts` are replaced by the report's two lines. The new text is "...**: `THROUGH_LINK_NOTICE` (O-9) from ADV-2026-11-20-05" then "item 2, and the others the words the worker of step 1 wrote, taken as the app's words by ADV-2026-11-21-14 item 2." I removed only each line's outer backticks and kept the inner ones around `THROUGH_LINK_NOTICE`.
- **N3:** in `reopenNotices.ts`, `S8 is the human's approval of ADV-2026-11-21-12, filed at` became `S8's words are the advisor's by the human's approval of ADV-2026-11-21-12, filed at`. The path that follows is unchanged.
- **Numstat against H:** `actionRegistry.ts` 1/1, `reopenNotices.ts` 1/1, `saveProject.ts` 2/2. Only those three files changed, and only comment lines. I showed the whole `git diff H`.
- **Check:** `node chk-p6g1.mjs 13e1a7e9...`, output in `<S>/p6n-chk.out`, last line `CHECK OK`, exit code 0.
- **Push:** `b42ccb3e..13e1a7e9  cut/1c-p6-group-1 -> cut/1c-p6-group-1`, rc 0. Afterwards the porcelain was empty and `git ls-remote` shows 13e1a7e9c5ff3dc78fb80c2ac3ec6686d78ecc51.
- **Departures from the brief:** none. I ran no tests, builds or apps. I issued the commit-and-check call and the push call in one tool block. They ran in order, so the push carried the new commit.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5), as the harness gives it.
