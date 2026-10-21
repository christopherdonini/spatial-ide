Reviewed: PR #240 at 70edd381ac6a1bf62d57de49b39dfa1ad95bac05 (base 46158863), gate 1, reviewer — cut/adr-036-pre-acceptance-block @ 70edd381ac6a1bf62d57de49b39dfa1ad95bac05
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. The two Documentation findings below do not block. Each must be dealt with before the merge as stated.

## Correctness
None. I read the ADR at the head in full against the human's rulings and the sources the form pins:
- The new sentence that cites KNOWN-LIMITATIONS 19 to 28 ("ends the session") is supported. Item 19 on main says "a difference in any component present ends the session", and item 23 says a change the watch reports ends the session.
- The A7 match shape agrees with ADR-017 §5a at 2879e17f: the `column`/`cases`/`when`/`then`/`on_null`/`on_unmatched` order, and `when` as a string only. Limiting the match to `fillColor` follows the human's "a match value on fillColor" (route directive, line 10).
- The canonical subset escapes every code point below U+0020 (`renderer/src/canonical.rs` module doc at 2879e17f). So the layout rule's "every line break is a layout break" holds.
- The new text claims no behaviour of the code on main, as §1 requires.

## Evidence
None. Every check ran and passed (list below).

## Documentation (must be dealt with before the merge)

**D1. The A0 provenance line under-attributes the human's words. Red-line ADR text, so it goes to the human, and I give no replacement words.**
- Where: ADR-036 at the head, the second `**Amended:**` line.
- What is wrong: the line says "The last sentence of §5's containment rule". The human's passage is two sentences (block-rulings directive, line 10): "The check is made when the data is opened." and "A link or a rename that another program makes afterwards is not prevented, …".
- A reader of the ADR therefore takes the first of the two sentences as the architect's.
- Two things support the wording as it stands. The human's own label for the passage is "B1's last sentence". The form's §2.2 B1 marks the span as starting "from "The check is made when the data is opened."".
- The A0 text is architect wording that the human approved (I4), and it is ADR amendment text. So I give no replacement words.
- Fix: the human answers before the merge. Either "accepted as it stands", or the line names both sentences.

**D2. Amendment 1 item 3's pin count does not match the form. A record on main, so the fix is appended; not the human's wording.**
- What is wrong: item 3 says "each of the 51 `<path>:<lines> @ 2879e17f` cites outside a fenced block was pinned … Eight bare cites were expanded". Commit 314ca154's message says the same.
- The form carries 61 full pins. That is 63 occurrences of `@ 2879e17f`, less the two that are not pins: §0.6's sentence and item 3 itself.
- 11 pins are in the header, 50 in §0 to §9 and none in §10.
- Neither 51 nor 51 + 8 = 59 matches.
- Fix: one correction in S3's closing amendment, in these words:
  "Amendment 1 item 3's count is corrected: the form carries 61 pins of the form `@ 2879e17f1f4ece340473efa53b69f16bd0b91745 sha256:<hex>`, 11 in the header and 50 in §0 to §9, each recomputed at gate 1 of PR #240 with none failing."
- Clause check:
  - "61 pins": my pin regex matched 61, and 63 raw `@ 2879e17f` less 2 non-pin mentions is 61.
  - "11 in the header and 50 in §0 to §9": counted by line region of the form, with 0 in §10.
  - "none failing": my pin script printed "pins 61 bad 0", exit 0.
  - This is one sentence, within round 12 (d)'s ceiling. It restates no earlier claim beyond naming the item it corrects.

## Notes (no finding)
- **Acceptance before merge.** The human's acceptance message came before the merge. At the head the Status line reads Proposed and is exactly A1's new text. That satisfies §8 item 3 before acceptance. The Accepted line waits on the order question, which is not this PR's.
- **Items 19 to 28.** The form's §0.5 question (items 20 to 22 describe other limits) is still open with the human, and the PR body lists it. KNOWN-LIMITATIONS on main still numbers items 19 to 28 as §0.5 describes.
- **PR body.** It names B and H, as §7 requires.

## What I checked (commands; every output went to a file in my scratch folder, with the exit code printed after it)

1. **Full diff.**
   - `git diff origin/main...HEAD`: rc=0. Two files: `docs/README.md` (+1/−1, the ADR-036 row only) and ADR-036 (+44/−18).
   - `git diff --numstat origin/main...HEAD`: rc=0.
   - Every hunk falls inside A0 to A7, B1 to B5 and C1 to C2. Nothing is outside §2.1 to §2.4 (§8 item 1).
   - The form at B equals the form at main: `git diff --stat ad921f55 origin/main -- <form>`, rc=0, empty.
   - I1: `git diff --stat 2879e17f ad921f55 -- <ADR-036> docs/README.md`, rc=0, empty.
2. **V1, by my own script, not the worker's.** It does the following:
   - takes the form from `git show origin/main:` and ADR-036 from `git show ad921f55:`;
   - checks for CR bytes, and finds none;
   - collects the 40 column-0 fenced blocks;
   - checks that each of the 16 "as it stands" passages occurs exactly once at B as whole lines, and each of the 4 insertion anchors exactly once;
   - applies them, with one blank line before A2's members paragraph and before B5a, and none before A0 or B5b;
   - compares the result with `git show HEAD:` byte for byte.

   Results:
   - Run: rc=0, "V1 byte-equal: true len 29577 29577", "final LF: true".
   - Self-test 1, one wrong passage (B1's new line 80 changed by one word): rc=1, first difference at line 104.
   - Self-test 2 (B5a's inserted line changed): rc=1, first difference at line 92.
3. **V2 to V6 at the head** (worktree, 70edd381):
   - `node scripts/adrIndex.mjs --check` (in frontends/shell): rc=0, "PASS -- 34 ADRs".
   - `git diff --name-only ad921f55...HEAD`: rc=0, exactly the two files, both inside §2.7.
   - `node scripts/plan/verify.mjs`: rc=0, PASS.
   - `verify-cites.mjs`: rc=0, PASS, 2161 files.
   - `verify-quotes.mjs`: rc=0, PASS, 130 checked, 0 hash-reference errors.
   - `verify-test-claims.mjs`: rc=0, PASS, 581 claimed.
   - `queue.mjs --check`: rc=0, current.
   - `site.mjs --check`: rc=0, current.
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside a shared hold (granted, then released): rc=0, 527 tests, 527 pass, 0 fail.
   - V6, `gh pr checks 240`: rc=0, all 8 checks pass. `gh run view 39628396441` gives headSha 70edd381, so CI ran on the head.
   - `git status --porcelain` afterwards: empty. Nothing in the worktree changed.
4. **§7.** `git diff --numstat ad921f55...HEAD -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: rc=0. 44 + 18 = 62, against a ceiling of 90. This matches §5's prediction of about 62 lines. There is no overrun and §7 is unedited.
5. **Pins.**
   - My script recomputed every `` `path:a[-b]` @ <rev> sha256:<hex> `` in the form from `git show <rev>:<path>`: the cited lines joined with LF and one final LF added.
   - rc=0, "pins 61 bad 0". All are at 2879e17f1f4ece340473efa53b69f16bd0b91745.
   - Self-test (one hash digit altered): rc=1, 1 BAD.
6. **The human's two passages (§2.3).**
   - Each was sliced from the block-rulings directive on main, line 10 after `piece 1c's form declares it.": ` and line 12 after `in A6 or the block: `. Each lead-in occurs once.
   - Each equals the form's §2.3 block byte for byte.
   - Each occurs once in ADR-036 at the head: passage (1) ends the containment bullet (line 104), and passage (2) follows the semicolon in §11's `workspace` bullet (line 217).
   - The pins for directive lines 10 and 12 at 2879e17f also recompute (item 5). Script rc=0.
7. **The Status line at the head.** Line 3 equals A1's new text byte for byte (rc=0) and begins `**Status:** Proposed.`.
   - The regenerated `docs/README.md` row equals the form's §2.5 block byte for byte, and appears once.
   - The quoted docs/01 rule "Plain text everywhere." is byte-exact at the head's docs/01 line 24, and docs/02 line 48 sits under `## Projects`.
   - Commit 70edd381 carries a sign-off and both trailers.
