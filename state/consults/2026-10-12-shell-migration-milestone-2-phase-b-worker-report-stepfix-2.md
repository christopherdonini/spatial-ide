*Custodian's filing note (2026-10-12): the worker's report on milestone 2's phase B second e2e step fix (the Layer tab restored after every step; E-KINDS' logging), branch cut/shell-migration-milestone-2-phase-b, at 2f18ad39363f649bad29e1fcb2556e870d6f6efd, the run 2026-10-12T08:52:48Z to 2026-10-12T09:18:40Z by its transcript (Bash 15, Read 4, Write 1, Monitor 1); its one SubagentHandback call, at 09:03:26Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is 53d939c39a0c64a739055224181ce1321ee6a5b5017fc321ad6294e81b90748e; this file's, from line 5 to the end, is 53d939c39a0c64a739055224181ce1321ee6a5b5017fc321ad6294e81b90748e. Its run left a shell waiting on standard input (a cat with no input, started 08:53Z); the custodian stopped that process tree at about 09:20Z, as its own subagent work.*

---

The fix is committed and pushed. I could not run e2e, so neither the Layer-tab fix nor the E-KINDS diagnosis has been exercised.

- **Head:** 2f18ad39363f649bad29e1fcb2556e870d6f6efd, on top of 5d45e2d9. Before editing, the head matched and porcelain was empty. The only file touched is `frontends/shell/e2e/selection.mjs`.
- **Diff:** +8 / -1.
  - New `showLayerTab(page)` beside `showFeatureTab`.
  - `runStep`'s `finally` now calls `await showLayerTab(page).catch(() => {});` after `clearTimeout`.
  - E-KINDS (point) has a failure block that builds one object of facts and fails the step with `JSON.stringify` of it appended to the message. It runs only when the Navigate click's id differs from the oracle id.
- **§7 count for `selection.mjs`:** `git diff --numstat c96e5329...HEAD` gives 650 + 8 = 658 (was 643 + 8 = 651). That is under the ~660 allowance, so there is no overrun.
- **Commands:**

| Command | Exit code |
|---|---|
| `node --check e2e/selection.mjs` | 0 |
| `verify-cites.mjs` | 0 |
| `verify-quotes.mjs` | 0 |
| `verify-test-claims.mjs` | 0 |
| `verify.mjs` | 0 |
| `node --test` over plan, hooks and evidence | 0 (457 pass, 0 fail) |

- **Slow runs:** my first attempt to run verify-quotes and verify timed out at 100 s, so I reran them as background commands, and both passed. I ran these before committing and not on the commit itself. The edit is the only change, and `verify-cites` and `verify-test-claims` print only advisories.
- **E-KINDS (point), what to look for in the message after "the oracle id there is N":** a JSON object with these fields.
  - `point`: the hit's CSS x and y, with fractions.
  - `dpr` and `rect`: `window.devicePixelRatio` and the `.working-canvas` rect.
  - `tab`: the whole `readTab` result — `lastClick`, `lastClickClass`, `selected`, `notice`, `sessionEnded`, `id`.
  - `pressed`: the texts of the `.tool-switch-button` elements with `aria-pressed="true"`.
  - `hover`: the `.hover-readout` text at click time.
  - `retries`: the log-only clicks, each with its point and the id read after it.
- **Retries:** there are two, `rounded` (`Math.round` of x and y) and `bufferCentre`. Hits carry only a CSS point, so the buffer-pixel centre is computed as (floor(x·dpr)+0.5)/dpr for each axis. Neither retry passes the step; it still fails.
- **How to read it:**
  - If `retries.rounded.id` or `retries.bufferCentre.id` equals the oracle id while the original click did not, H1 (the fractional point) is confirmed. The fix is then to round the hover point.
  - If neither retry inspects the oracle id, H1 is out. Then check `pressed` (is the Navigate tool really active?), `lastClickClass` and `notice` (was the tap received and refused?), and `hover` (did the readout still show the id when the click landed?).
- **Not done:** nothing outside `selection.mjs` was touched, and I did not round the hover point.
- **Final porcelain:** empty.
