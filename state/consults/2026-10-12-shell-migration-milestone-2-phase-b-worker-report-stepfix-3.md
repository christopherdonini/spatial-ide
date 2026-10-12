*Custodian's filing note (2026-10-12): the worker's report on milestone 2's phase B third e2e step fix (the hover point rounded to whole CSS pixels; EXPORT-TODAY skipped after B3), branch cut/shell-migration-milestone-2-phase-b at a6607738e7fe5080e3556cb67350b73dbb54e706, the run 2026-10-12T09:37:06Z to 2026-10-12T09:42:14Z by its transcript (Bash 6); its one SubagentHandback call, at 09:42:13Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is fdc0ce7c415eed779d3dca2e5a92cf95b0653c9a301f22028165195161c7d191; this file's, from line 5 to the end, is fdc0ce7c415eed779d3dca2e5a92cf95b0653c9a301f22028165195161c7d191.*

---

Both changes are committed and pushed. I could not run e2e, as instructed, so neither change has been exercised.

**Head:** a6607738e7fe5080e3556cb67350b73dbb54e706 (parent cdc8a423; the head matched and porcelain was empty before I started). Pushed to cut/shell-migration-milestone-2-phase-b with a plain push. No PR.

**Diff** (only `frontends/shell/e2e/selection.mjs`; 7 insertions, 2 deletions):
- **Change 1:** `hoverHits` now computes `exact = bufferPointToCss(...)` and rounds `css` to whole pixels with `Math.round`. A one-line comment says why: a real mouse at 100% scaling gives whole CSS pixels, and Hammer rounds the tap.
- **Change 2, header:** the header comment now says EXPORT-TODAY is skipped since B3.
- **Change 2, skip line:** `main` prints the exact SKIP line you gave.
- **Change 2, body kept, not removed:** removing it would have added about 20 deleted lines to §7. The body is inline in `main`, not a function, so I wrapped it in `if (process.env.SELECTION_EXPORT_TODAY === "1") { ... }`. It never runs unless that variable is set, and the header marks it unused. The env guard is my addition; say if you would rather have a plain `if (false)`.

**§7 count** (`git diff --numstat c96e5329...HEAD`): 655 insertions + 8 deletions = 663, against an allowance of about 660. That is 5 more than B's 658 and about 3 over the allowance, so I record it as an overrun.

**Other steps with the same pattern:** in `selection.mjs`, `bufferPointToCss` is called only in `hoverHits`, and the other steps (E-REFUSED, E-KINDS) go through `hoverHits`. Outside `selection.mjs`, these files call `bufferPointToCss` with `flipY` and do not go through `hoverHits`:
- `regression.mjs`: lines 860 and 1120.
- `source-changed.mjs`: lines 781 and 801.
- `source-watch-idle.mjs`: line 425.

Those files were out of my scope and I did not read what they do after the call, so I don't know whether they hover and then click at the point. I changed none of them.

**Commands** (the four verify scripts' output was discarded; only exit codes were kept):

| Command | Exit code |
|---|---|
| `node --check e2e/selection.mjs` | 0 |
| `node scripts/plan/verify-cites.mjs` | 0 |
| `node scripts/plan/verify-quotes.mjs` | 0 |
| `node scripts/plan/verify-test-claims.mjs` | 0 |
| `node scripts/plan/verify.mjs` | 0 |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 |

**Final porcelain** in `C:/dev/wt/mm2b`: empty.

**Model:** I observe myself running as Sonnet 5.5, with no model override and no context handoff.

**Pre-gate self-check:**
- No cross-module interface was touched.
- Every completion claim above points to a command or diff output.
- No user-facing message was added except the e2e SKIP line, which describes behaviour implemented at this commit.
- The required assertions were not run, because I could not run e2e.
