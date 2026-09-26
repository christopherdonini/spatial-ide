*Custodian's filing note (2026-09-26): the architect gate's attempt-3 report (a scoped record round) for PLAN node `engine-source-change-watcher` at c7c009d, filed as returned (extracted by script from the agent's hand-back; byte-identical). Its record-cap (3) reduction is applied at 2b8aaaf on the branch, each replacement block checked present byte-exact by script. Everything below the rule is the agent's text, as returned, except 3 rooted cites to lines that exist only on the branch, on this file's lines 31, 53, 68. A script rewrote each to the worktree path the architect read, `C:\dev\wt\source-change-watcher\` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed.*

---

**Verdict: FAIL (record only). The record cap's point (3) applies, so no attempt 4 follows.** Architect gate, attempt 3: `engine-source-change-watcher`, `cut/source-change-watcher` @ c7c009d, tree read at `C:\dev\wt\source-change-watcher`.

- This is the piece's second record-correction round. The fix ruling's §5 counted the fix round as the first.
- The gate-2 fixes and Amendment 6 pass.
- The FAIL is six quotation spans that no earlier gate resolved. Under cap (3) I reduce them below.
- Once those bytes are applied as given, and the reviewer confirms that diff mechanically, the piece lands.
- No red line is reached. No decision is missing, so there is no ADR skeleton.
- I have no Bash, so every hash and count is the reviewer's to recompute.

## 1. Findings

**F1 (blocking; reduced below). Six spans marked as quotes do not match their named source byte for byte.**
- **Rule:** round 10 ("a quote marked verbatim that does not match its source byte-for-byte is a gate failure by name"). Round 11 adds that each retained span must match byte for byte.
- **Scope:** all six were added by this branch and cite `engine/SOURCE-WATCHER-PREREGISTRATION.md`, a file only this branch has. Gates 1 and 2 missed them. Gate 1's advisory 4 was the same defect class in KNOWN-LIMITATIONS.

| # | Where (branch) | What the comment has | What the source has |
|---|---|---|---|
| a | `C:\dev\wt\source-change-watcher\engine\src\watch.rs:453` | `"at most one signal per handle... There is no re-arm within an open."` | preregistration :102 has `**At most one signal per handle.**`, with a capital A and bold. Its sentence ends `within an open (brief rule 2).`, so the retained `open."` is not in the source. |
| b | `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:1261` | `"the first three pass ObservedChange"` | :143 has `The first three pass `ObservedChange`.`, with a capital T and backticks. |
| c | `C:\dev\wt\source-change-watcher\kernel\src\skp.rs:1333` | the same as (b) | the same as (b) |
| d | `C:\dev\wt\source-change-watcher\kernel\src\lib.rs:493-494` | the same as (b) | the same as (b) |
| e | `C:\dev\wt\source-change-watcher\frontends\shell\src\admission\formatRefusal.ts:73-74` | `"user-visible wording is the human's at P6 (addition 2). Every new string is a marked placeholder (§7)."` | :61 has `**User-visible wording is the human's at P6** (addition 2).`, with a capital U and bold. |
| f | `C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:552` | `"icacls deny under a timeout"` | :247 has `` `icacls` deny under a timeout ``, with backticks. |

**The reduction (cap (3); the exact replacement lines).** Every quotation becomes an unquoted reference by section. Indentation is kept, and so is every file's line count.

- `C:\dev\wt\source-change-watcher\engine\src\watch.rs:453`:
```
            // Per §2a, at most one signal per handle and no re-arm within an open. Cancel
```
- `kernel/src/skp.rs:1261`:
```
        // `ObservedChange`, as §2b's single emission point assigns to the pre-check.
```
- `kernel/src/skp.rs:1333`:
```
        // passes `ObservedChange`, as §2b's single emission point assigns to the pre-check.
```
- `kernel/src/lib.rs:493-494`:
```
        // passes `ObservedChange`, as `SOURCE-WATCHER-PREREGISTRATION.md` §2b's single emission
        // point assigns to the post-check.
```
- `frontends/shell/src/admission/formatRefusal.ts:73-74`:
```
      // Per `engine/SOURCE-WATCHER-PREREGISTRATION.md` §1, user-visible wording is the human's at
      // P6 (addition 2), and every new string is a marked placeholder (§7). This is one of those --
```
- `C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs:552`:
```
/// §4's table names an `icacls` deny under a timeout for this case. Verified empirically before
```

**How the reduction lands:**
- One commit, comments only, touching only these lines.
- The reviewer confirms each of the following:
  - the diff is exactly these bytes;
  - LF line endings;
  - `cargo fmt --check` and `npm run verify` are green;
  - `git diff --numstat origin/main...HEAD` is unchanged per module. All six spans are branch-added `+` lines, so it should be.
- **One more sweep for the reviewer.** Mine was a regex over lines that carry a § attribution and a double-quoted span. The reviewer greps the branch diff's `+` lines for every double-quoted span attributed to a section, amendment or ruling, and resolves each with `grep -F`.
  - Any further mismatch gets the same reduction in the same commit: drop the quotation marks and attribute by section, unquoted.
  - This spawns no clause and no gate round (cap (2), (3)).
- Spans that do resolve: `skp.rs:899` (source :149), `skp.rs:1845` and `C:\dev\wt\source-change-watcher\kernel\tests\injected_watch\mod.rs:8` (source :81, §2a), `skp.rs:2822` (source :288), and `skp.rs:882` and `watch.rs:47` (the label `Open and admission`, source :145).

## 2. The gate-2 fixes (b178ee5): each is what was asked, and nothing more
- **F1:** fixed. `C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs:245` now reads `resolves_unchanged()` is a second check beside the latch's own record (its doc, on`, continuing on :246. There is no quotation. The attribution holds: `C:\dev\wt\source-change-watcher\engine\src\watch.rs:42` reads `/// (and a second check beside) whatever bookkeeping the sink's own caller keeps from the`.
- **S1:** fixed as A6's doc reads. `source_watch_adapter.rs:257-259` equals `:354-356`, and the block is not deleted.
- **S2:** fixed. `MANUAL-WALKTHROUGH.md:1509` lists `frontends/shell/src/admission/DescribeSummary.tsx` (the two `<dt>` labels). The two labels are at `DescribeSummary.tsx:79,86`.
- **S3:** fixed. `viewportStreamManager.test.ts:795` reads §2d, not SH7. The sibling title it cites is at `tileViewportStreamManager.test.ts:1526`.
- **N1:** fixed. `typed_terminal_codes.rs:243` reads `takes a different path`.
- **N3:** fixed. `watch.rs:223` credits the fix ruling's §4 item 3, beyond B2.
- **The reviewer's nits:** `watch.rs:341-343` and `:460-462` are corrected, and `skp.rs:2828` reads `kernel\src\skp.rs`.
- **N2 and N5:** not applied, as expected.
- **Line counts:** the reviewer confirms they are held.

## 3. Amendment 6, row by row
Preregistration §10, Amendment 6: every row carries my gate-2 §6 row with the class I named, as references. Every hash reference is at 04b3680 or 3dfc622, both on main (round 15 (e)). Each reference sits on one line (round 15 (d)). The tool commit is named (round 15 (c)).

| Row | Class | Faithful? | Note |
|---|---|---|---|
| 1 | 1 | Yes | R:81-116. G2R:82-95 covers K15, E7, the pins, SH7, SH8 and SH11, with the observed failure counts (G2R's S3). G2R:72 is E10. The gate-log entries are cited by commit. The attempt-3 entry resolves once this gate's log lands on main, before the merge. |
| 2 | 3 | Yes | Two sentences, under the ceiling (round 12 (d)). Its opening clause identifies the defect in Amendment 3 item 5's last sentence (preregistration §10, Amendment 3 item 5). It does not re-assert it. |
| 3 | 1 | Yes | R:75-78; H4 is not restated. |
| 4 | 1 | Yes | R:62-69, R:71 and G2R:112-122. The report file's sha256 matches G2R:121. It is evidence, not Authority. |
| 5 | 1 | Yes, conditionally | "recounted unchanged at `722a551`" is true only if the reviewer's numstat at the tip, after the reduction commit, equals G2R:130-135 per module: 6,475 lines across 65 files. If it does not, row 5 is false. |
| 6 | 2 | Yes | R:102-104. |
| 7 | 2 | Yes | R:84 and G2R:87. |
| 8 | 1 | Yes | A:94-96. |
| 9 | 1 | Yes | A:58. |
| 10 | 1 | Yes | The symbol resolves: `skp.rs:2419` is `mod ticket_drop_under_lock_regression` and `:2978` is the fn. G2R:84-86. It claims no mutation observed on the mark. |
| 11 | 5 | Yes | G2A:46-50 is the `watch.rs` bullet with its four sub-items. Round 7 is met by a line. |
| 12 | 2 | Yes | Both backticked spans resolve byte for byte: preregistration :305 and `App.test.ts:1352`. Fix-ruling item 10 deletes the source-scan test. |
| 13 | residual | Ruled below | |
| 14 | — | Yes | This is my own wording, and it is imprecise. Row 11's discharge names a line, not a test, and round 7 accepts either. No finding. |
| 15 | index | Yes | Round 12 (e). |

**Row 13's form is right.**
- My §6 row 13 was wrong. Under round 15 (e), a hash reference in an append-only record cannot sit at the branch commit 4137f4d.
- The fix ruling's residual row governs (`state/consults/2026-09-26-source-watcher-fix-ruling.md`, §5 item 10).
- The row names lines and commit with no hash. It is a residual pointer, not a pin, and it is not read as current, because it names its commit.
- A stronger form would have referenced R:135 @ 04b3680, which already carries the pin on main. It is not required, and an append is not worth a round.
- **Two conditions for the custodian:**
  1. The merge must be a merge commit, not a squash. That keeps 4137f4d reachable, together with the header's other commits (2daf371..f280f76, b178ee5, 722a551).
  2. Row 13 says "the custodian's queue carries it". Today only `state/CUT-STATE.md:8` does; neither `PLAN.yaml` nor the queue does. Put it in the queue before the merge so the claim resolves.

**Reviewer confirms:**
- every hash in rows 1–11;
- dfdc8fb is attempt 1's gate-log entry;
- b178ee5 is comment-only, with line counts held;
- 722a551 touches nothing outside the branch's own diff set plus the regenerated files;
- `git diff origin/main...HEAD -- docs/adr` and the capabilities diff are empty.

## 4. Gate-log line
`engine-source-change-watcher` attempt 3 @ c7c009d: architect FAIL (record only, second record round, cap (3) invoked).
- **Fixes and amendment:** the gate-2 fixes (F1, S1–S3, N1, N3, the reviewer's nits) are built as asked, with nothing more. Amendment 6 carries G2A §6's rows 1–15 faithfully, as references and hashes, with the named classes. Row 13's hashless residual form is ruled correct under round 15 (e), since G2A's own row 13 was wrong.
- **What fails:** round 10 by name, on six branch-added spans quoted from the preregistration that do not match byte for byte. They are `watch.rs:453`, `skp.rs:1261`, `skp.rs:1333`, `kernel/src/lib.rs:493-494`, `formatRefusal.ts:73-74` and `source_watch_adapter.rs:552`: capitals, stripped markdown, and one period.
- **Reduction:** the architect has given exact unquoted replacements. They land in one comment-only commit, which the reviewer confirms mechanically: bytes, LF, fmt/verify, per-module numstat unchanged (so row 5 holds), and a full quoted-span sweep reduced the same way. Then the piece lands, with no attempt 4.
- **Still owed:** a merge commit, not a squash (keeps 4137f4d reachable), and the queue must carry the E5 pin. No red line.

Files:
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
- C:\dev\wt\source-change-watcher\engine\src\watch.rs
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs
- C:\dev\wt\source-change-watcher\kernel\src\lib.rs
- C:\dev\wt\source-change-watcher\frontends\shell\src\admission\formatRefusal.ts
- C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs
- C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs
- C:\dev\wt\source-change-watcher\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\wt\source-change-watcher\frontends\shell\src\streaming\viewportStreamManager.test.ts
- C:\dev\wt\source-change-watcher\kernel\tests\typed_terminal_codes.rs
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-gate2-architect.md
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-gate2-reviewer.md
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-gate1-reviewer.md
- C:\dev\spatial-ide\state\consults\2026-09-26-source-watcher-fix-ruling.md
- C:\dev\spatial-ide\state\CUT-STATE.md
