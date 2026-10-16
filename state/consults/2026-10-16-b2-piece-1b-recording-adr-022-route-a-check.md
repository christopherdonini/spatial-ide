# b2-piece-1b-recording, Amendment 12 item 2: the custodian's check before ready, ADR-022 by route (a)

*Written by the custodian, 2026-10-16. The human asked for it in `state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md`: a script check that the file above the amendment heading is byte-identical to main's, and that the PR's diff to the ADR is the appended amendment alone. The script reads git only (`git show`, `git diff`, `git rev-list`, `git merge-base`), at the branch head on origin. It is kept in the custodian's scratch folder; its sha256 as run the second time is a1bf4f194da848f606fd43a6274bffd7ea1dda33661c335970191e3520b38ce1.*

## The result: PASS, every check

At the head ba0179fc85f29e59aa039f1f325a6f95e883c173 against origin/main 1dcaa5c6:

- **Above the amendment heading:** the head's first 5,067 bytes are main's ADR, byte for byte, and the one byte after them is the empty line that separates the amendment, so the heading line starts at byte 5,068. Main's ADR is byte-identical to the base B's.
- **The PR's diff to the ADR** (origin/main...head): one hunk after main's last line 71, 7 lines in, 0 out; the added lines are exactly the bytes after main's (the empty line and the six lines of Amendment 1).
- **The amendment:** the file at the head is the file at a542097e with `each edit is one step` replaced by the human's C-5 words and nothing else; it holds the words once; its sha256 is the one the brief named.
- **The commit:** one commit after the previous head, touching the ADR alone.

## The first run failed on the check's own error

The first run failed one check, the comparison of the added lines with the bytes after main's. The script had cut the decoded text at a byte offset; the ADR holds multi-byte characters (the middle dot, the em dash, the section sign), so the cut fell later in the text than the byte offset. The script was corrected to cut the bytes and decode them, and nothing else changed; the second run passed every check. Both runs are below, as printed.

**First run:**

```text
PASS  the merge base of origin/main 1dcaa5c6 and the head ba0179fc is B 31e25f15 (read: 31e25f15)
PASS  one commit on the branch after a542097e (read: 1)
PASS  that commit touches the ADR alone (read: docs/adr/ADR-022-style-v0-as-the-single-style-model.md)
PASS  main's ADR is byte-identical to B's (sha256 fa3a411cb9d6)
PASS  the head's ADR has the expected sha256 57107585e966 (read: 57107585e966)
PASS  the head has one amendment heading, Amendment 1, and main has none
PASS  the head's first 5067 bytes are main's ADR, byte for byte
PASS  above the heading: main's 5067 bytes, then the one empty line that separates the amendment (5068 bytes in all)
PASS  the amendment holds the human's C-5 words once, and the file no longer holds each edit is one step
PASS  the head's ADR is the file at a542097e with that one replacement and nothing else
PASS  the PR's diff to the ADR (origin/main...head): 7 lines in, 0 out (read: 7 in, 0 out)
PASS  one hunk, after main's last line 71, nothing removed (read: @@ -71,0 +72,7 @@ languages (all named refusals in `renderer/src/style.rs::V0_EXCLUDED`) · a styl)
FAIL  the added lines are exactly the bytes after main's: the empty line and the amendment
head ba0179fc85f29e59aa039f1f325a6f95e883c173; origin/main 1dcaa5c6fc539c9bfe3c0b7b8d136918cbb8bbdf; B 31e25f15a8639fe69f843b1802034ea27d76b0fa
RESULT: FAIL (1)
```

**Second run, after the correction:**

```text
PASS  the merge base of origin/main 1dcaa5c6 and the head ba0179fc is B 31e25f15 (read: 31e25f15)
PASS  one commit on the branch after a542097e (read: 1)
PASS  that commit touches the ADR alone (read: docs/adr/ADR-022-style-v0-as-the-single-style-model.md)
PASS  main's ADR is byte-identical to B's (sha256 fa3a411cb9d6)
PASS  the head's ADR has the expected sha256 57107585e966 (read: 57107585e966)
PASS  the head has one amendment heading, Amendment 1, and main has none
PASS  the head's first 5067 bytes are main's ADR, byte for byte
PASS  above the heading: main's 5067 bytes, then the one empty line that separates the amendment (5068 bytes in all)
PASS  the amendment holds the human's C-5 words once, and the file no longer holds each edit is one step
PASS  the head's ADR is the file at a542097e with that one replacement and nothing else
PASS  the PR's diff to the ADR (origin/main...head): 7 lines in, 0 out (read: 7 in, 0 out)
PASS  one hunk, after main's last line 71, nothing removed (read: @@ -71,0 +72,7 @@ languages (all named refusals in `renderer/src/style.rs::V0_EXCLUDED`) · a styl)
PASS  the added lines are exactly the bytes after main's: the empty line and the amendment
head ba0179fc85f29e59aa039f1f325a6f95e883c173; origin/main 1dcaa5c6fc539c9bfe3c0b7b8d136918cbb8bbdf; B 31e25f15a8639fe69f843b1802034ea27d76b0fa
RESULT: PASS, every check
```
