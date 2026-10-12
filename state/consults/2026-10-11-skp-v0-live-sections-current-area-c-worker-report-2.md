*Custodian's filing note (2026-10-11): piece e worker report 2, correction round 1 under the form's Amendment 3, the worker run 17:06:37Z to 17:14:25Z by its transcript, on cut/skp-v0-live-sections-current-area-c, head 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7, published; the sibling lines' words are the worker's. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added and its 2 path:line cites de-rooted by script. The sha256 of the report as handed back is b030df3e8195d7b2737c1a23ea97248751cf366ab1dad5fea8d464641d69095b.*

---

Correction round 1 on PR #210 is done and pushed. Everything ran clean except one E1 point you should look at, and the docs lane cannot add a unit test for item 4.

**Start state:** HEAD and origin were both a8b45622, and `git status --porcelain` was empty.
**New head:** 20d8546e2bae5ec30e05ce156ec7f1ea733f43d7. The push (`git push origin cut/skp-v0-live-sections-current-area-c`) went through without force, rc=0.
**Commits** (both `-s`, with the Co-Authored-By trailer):
- 56b74f55 `docs: the three sibling statements the rewrite contradicted (Amendment 3 item 1)`
- 20d8546e `docs: gate 1's documentation findings and the owner's-index line (Amendment 3 item 2)`

**Changes**

*Item 4, the sibling lines (commit 56b74f55)*
- **`line 22 of protocol/skp/src/v0/commands.rs`, one line.**
  - Old: `/// UTF-8, absolute; canonicalized and checked by the host. Never a data-plane value — the path`
  - New: `/// UTF-8, absolute; passed to the engine's open as received. Never a data-plane value — the path`
  - It matches what `SKP-V0.md` §1's path sentence says: the host passes the path to the engine's open as received, without canonicalizing it. That sentence is the text row S4 produced.
  - The new line is 2 characters longer than the old one and is 101 columns wide. The old line was 99. `cargo fmt --check` still passes (rc=0), and rustfmt does not reflow comments.
- **`SKP-V0.md` §1, the `describe` lead.**
  - Old: `...Every field maps to an` / `existing `engine::Dataset` accessor; none of them runs a new query:`
  - New: `...Every field maps to an` / `existing `engine::Dataset` accessor, except `coverage` and `session_end`, which come from the` / `host's watch and generation state; none of them runs a new query:`
- **`line 13 of protocol/skp/src/v0/codec.rs`.**
  - Old: `//! Both are **strict**: a malformed value is a refusal, never a best-effort parse.`
  - New: `//! Both are **strict**: a malformed value is rejected, never a best-effort parse.`

*Item 1, the S12 §8 note in `SKP-V0.md` (edited in place, bullets 1 to 3 only)*
- **Section names.** `and a section cite corrected from §6 to §5 here and in §4 item 8.` is now `and, outside §5, a section cite corrected from §6 to §5 in §4 item 8 and §7.5.`
- **Directive cite.** `(the directive, item 4)` is now `` (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md`, item 4) ``.
- **Lead rewrites.** Two clauses are added to the §1 and §3 lists:
  - §1: ``the `describe` lead's currency sentence is replaced by one that points to this note, and its accessor sentence excepts `coverage` and `session_end`;``
  - §3: `the lead changes from refusal to rejected, and the `HexF64` bullet states...`
- **Fixture wording.** `for the nine `HexF64` fixtures still name` is now `for the nine `HexF64` fixtures that carry one still name`.
- I added no quotation marks.

*Item 2, §9.1*
- The 2026-10-11 dated note (its words unchanged) now sits after the 2026-09-29 `skp/0.7` note, at the end of §9.1's text.
- It was removed from just before that note. The §7.1 copy of the note is untouched.

*Item 3, `protocol/skp/src/v0/handles.rs`, lines 14-15*
- Old: line 14 ended `ADR-016's "stability across`, and line 15 began `//! reopen" OPEN block`.
- New: line 14 ends `ADR-016's`, and line 15 reads `//! "stability across reopen" OPEN block are both unsatisfied).`
- The span is whole on one line. At B it was on line 12.

*Item 5, `kernel/README.md` line 382*
- A script took the old and new lines from lead-data's two ```text fences and matched the old line against the file by exact whole-line equality: exactly 1 match, at index 381, with LF line endings.
- It replaced that line with the new line, which adds `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md` before `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`.

**Runs** (B = 1457fbd0a09464c03082a2aea3df65dd1171bc95)
- **E1** (`git diff -U0 B HEAD -- '*.rs' '*.ts'`, filtered by a script for non-`//` lines): it flagged 3 lines in `frontends/shell/src/skp/types.ts`. All three are ` * ...` continuation lines inside a `/** ... */` block comment, and none is code. I judge E1 satisfied; the script's literal `//` filter does not understand block comments.
- **E8:** B's §8 is a byte-identical prefix of the head's §8. It printed `prefix true`, with 39506 bytes at B and 41917 at the head. I did not edit §7 or §8 outside the S12 note.
- **Quoted span:** `"stability across reopen"` appears whole on one line at both B (handles.rs line 12) and the head (line 15). The grep matched the same text, and I did not hash it.
- **E5:** `cargo fmt --all -- --check` rc=0.
- **`verify-cites.mjs`:** rc=0, PASS (1751 files, 49 loose references advised).
- **`verify-quotes.mjs`:** rc=0, PASS (121 checked, 90 verified, 30 baselined, 0 hash-reference errors).
- **`verify-test-claims.mjs`:** rc=0, PASS (543 claimed tests, 9 superseded, 17 withdrawn, advisory).
- **`verify.mjs`:** rc=0. I sent its output to /dev/null and kept only the exit code.

**Budget** (`git diff --numstat B...HEAD`, insertions/deletions)

| File | Ins/Del | Total |
|---|---|---|
| `frontends/shell/src/skp/types.ts` | 3/2 | 5 |
| `kernel/README.md` | 1/1 | 2 |
| `kernel/src/skp.rs` | 6/3 | 9 |
| `protocol/skp/SKP-V0.md` | 51/19 | 70 |
| `protocol/skp/src/v0/codec.rs` | 5/3 | 8 |
| `protocol/skp/src/v0/commands.rs` | 3/3 | 6 |
| `protocol/skp/src/v0/error.rs` | 3/0 | 3 |
| `protocol/skp/src/v0/handles.rs` | 6/4 | 10 |

- **Total:** 8 files and 113 changed lines, against the 206 lines and 10 files ceiling.
- `commands.rs` is exactly 6 and `codec.rs` exactly 8, so both sit at their ceilings.
- I did not check the other files against §7 or Amendment 1 item 5's per-file figures (`handles.rs` at 10 included), because I did not re-read those figures. Please check them against the table.

**Not done as written:** nothing was left undone. I added no test (docs and comments only), so item 4 has no unit test, which fits the brief.

**Final state:** `git status --porcelain` is empty in `C:/dev/wt/skpe`, and the branch is pushed at 20d8546e.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff. The four-class self-check: no cross-module interface was written; each completion claim above names its run; each user-facing message states behaviour present at this commit; no required test was involved.
