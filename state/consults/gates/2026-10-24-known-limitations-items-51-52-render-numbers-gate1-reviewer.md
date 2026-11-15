Reviewed: PR #249 at 196a4f594111971c277805cd6ff6f8add4821ab7, gate 1, reviewer
Verdict: PASS WITH NOTES

Branch reviewed: `cut/known-limitations-items-51-52-render-numbers @ 196a4f594111971c277805cd6ff6f8add4821ab7`. Its merge-base with main is dc040c26830e017ad05ec039acb54cb6ed44f70a, and the branch is one commit ahead of it (`git rev-list --count` gave 1, rc=0). I read everything from git objects after `git fetch origin` (rc=0). origin/main is at dc040c26.

## Findings

**Correctness:** none.
**Evidence:** none.
**Documentation:** none in the diff.

**Note (non-blocking, for the merge step the PR body describes).** When main is merged into this branch after #241, the conflict hunk has to be resolved with #241's block first and this branch's line second. I checked both orders by script:
- **#241 first, then the line:** this matches the body's order (item 46, item 47, the line, item 51). It is byte-equal to "main + #241" with the line inserted before item 51, and numbers 45, 46, 47, 51, 52.
- **This branch's line first, then #241:** the line lands before item 47, so item 51 continues 47's list and renders as **48** (52 renders as 49).

Fix: resolve by hand to the body's order, then re-check the merge commit against "main + #241" plus this one line. The body already orders a second check.

## Check 1: one line, one file
- `git diff --numstat dc040c26… 196a4f59…` rc=0. It printed exactly `1	0	KNOWN-LIMITATIONS.md` (with `cat -A`: `1^I0^IKNOWN-LIMITATIONS.md$`) and nothing else.
- Byte script (node, `kl51-rev-bytes.js`) rc=0:
  - the base file is 92365 bytes and 418 split lines; the head file is 92529 bytes and 419 lines;
  - there are 0 CR bytes in either file;
  - the first differing line at the head is 411;
  - "head minus that line byte-equal to base: true";
  - the removed line is 163 bytes. 92529 − 92365 = 164 = 163 plus its LF, so no other byte differs, line endings included.

## Check 2: its place
- It is `KNOWN-LIMITATIONS.md:411` at the head, and it starts at column 0 (`startsWith('<!--')` is true).
- Line 409 is item 46's source comment (four-space indent, `    <!-- Approved as drafted by the human (state/directives/2026-10-20…`). Line 410 is blank (`""`). Line 412 is `51. **Attributes are not held for a batch of features that would take the map past 268,435,456 bytes of attribute data.**`.

## Check 3: item 42's form
Byte-copied from the head file (script output, `KNOWN-LIMITATIONS.md` at 196a4f59):
- line 190: `<!-- A line at column 0, so that item 42 starts its own list and renders as 42 (PR #215 gate 1, D-2). -->`
- line 196: `<!-- A line at column 0, so that item 44 starts its own list and renders as 44 (as for item 42, PR #215 gate 1, D-2). -->`
- line 411: `<!-- A line at column 0, so that item 51 starts its own list and renders as 51 (as for item 42, PR #215 gate 1, D-2; the human's ruling of 2026-10-24, item 4). -->`

The shape is the same: a column-0 single-line HTML comment, followed directly by the item with no blank line between, as at lines 190→191 and 196→197. The number is set to 51. It has item 44's pointer `as for item 42, PR #215 gate 1, D-2`, and the ruling is added after `; `. The ruling, line 14 of `state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md` (`sed -n 14p` rc=0), asks for one column-0 comment line before item 51, in item 42's form, as its own one-line docs-lane commit. The diff satisfies that.

## Check 4: rendering
- **No render was run.** I found no CommonMark renderer installed:
  - the four node_modules trees are `frontends/canvas-probe`, `frontends/shell`, `renderer/bundle-viewer` and `spikes/adr-003-crs-rendering/app` (`find` rc=0);
  - a scan of their top-level entries for markdown|commonmark|micromark|marked|mdast|remark printed nothing. The scan's rc=1 is only the last directory's grep, and the positive control matched with rc=0;
  - a scan of 336 package.json paths up to depth 3 also matched nothing (rc=1).
  - I installed nothing.
- **Argument from the spec (CommonMark):**
  - **At the merge-base:** item 46 (`46. `, content indent 4) holds lines 408 and 409, both indented 4. Line 410 is blank. The next non-blank line, `51. …`, is an ordered-list item with the same `.` delimiter, so it continues the list as a sibling. A later item's start number is ignored, so 51 renders as 47 and 52 as 48. That list starts at 45, because base line 401 is a column-0 HTML comment followed by a blank line.
  - **At the head:** line 411 is at indent 0, which is less than 4, and comes after a blank line. So it is neither a continuation of item 46 nor a lazy line, and item 46 and its list close. It opens HTML block type 2 (start condition `<!--`), and the block ends on that same line because the line contains `-->`. Line 412 therefore follows a closed HTML block, not a paragraph, so the rule that only a list starting at 1 may interrupt a paragraph does not apply. A new ordered list starts at 51, and 52 continues it as 52.
- **Heuristic only, not a renderer:** `kl51-rev-sim.js` (rc=0) applies the rule "a column-0 non-item, non-blank line ends the list; otherwise number sequentially from the first start". It gave `51->47 52->48` at the base and `51->51 52->52` at the head, which agrees with the spec argument.

## Check 5: merge order
- **The conflict claim is confirmed.** #241's head is `origin/cut/bundle-redaction-scan` = 50c634a85e0486bba0d7bff425defd91fcbab788, which matches `gh pr view 241` headRefOid (OPEN).
  - `git merge-tree --write-tree --name-only 196a4f59… origin/cut/bundle-redaction-scan`: rc=1, `CONFLICT (content): Merge conflict in KNOWN-LIMITATIONS.md`.
  - The reverse order: rc=1, same conflict.
  - main (dc040c26) with #241: rc=0, clean, tree c1d5efe609553742f3ea0e5fdae02dc25a73c70a.
  - #241 adds 9 lines to `KNOWN-LIMITATIONS.md` (numstat `9 0`).
  - In the conflicted tree's file, the hunk is this branch's line against #241's item 47 block (`47. **A publish is refused when the bundle would contain a local path, your login name, th…`).
- **The body's order works.** I simulated the "main + #241, then the line before item 51" state: the c1d5efe6 file with head line 411 inserted before its `51. **Attributes are not held` line, which is line 420. In the result:
  - item 46's comment is at 409 and line 410 is blank;
  - item 47 runs from 411 to 418, all continuation lines indented 4, with a nested `    - ` list;
  - line 419 is blank, the line is at 420 and item 51 at 421;
  - it has 0 CR bytes.
- **Numbering:**
  - item 47 continues item 46's list, so it renders as 47;
  - the column-0 line closes that list;
  - 51 and 52 render as 51 and 52 (heuristic output `45->45 46->46 47->47 51->51 52->52`).
- The simulated file is byte-equal to the conflict resolved #241-block-first ("sim equals theirs-first union: true"). See the Note above for the other order, which gives `51->48 52->49`.

Scratch files (all under <the session scratch folder>\): kl51-rev-bytes.js, kl51-rev-sim.js, kl51-rev-base.md, kl51-rev-head.md, kl51-rev-m241.md, kl51-rev-conflict.md, and their kl51-rev-*.txt outputs. Nothing was committed, pushed or written in the repository.
