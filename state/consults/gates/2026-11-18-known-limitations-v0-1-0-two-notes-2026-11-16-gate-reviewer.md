Gate: known-limitations-v0-1-0-two-notes-2026-11-16, reviewer, attempt 1, at 396cf62dcb9717deff770f4d6d3fa55eea8aab10
Verdict: PASS WITH NOTES

Reviewed: cut/known-limitations-v0-1-0-two-notes @ 396cf62dcb9717deff770f4d6d3fa55eea8aab10. Records read at origin/main a15e3bed70983dfaed6182951ec010ca8a20c374.

Nothing blocks. Both notes match their filed fences byte for byte, they sit at the two places the form names, and no other byte of the file changed. One Documentation item must be fixed before the merge (D1 below): it is in the custodian's comment wording, and my replacement words are given.

## Departures

1. **The stop.** The coordinator reports that my run stopped at 2026-11-16T09:03Z on the account's usage limit (HTTP 429). I cannot see that time from my side. Before the stop I had fetched, found origin/main at 5bb2f2e3, and read the form and the directive's ADV-2026-11-16-19 text there.
   - On resuming I fetched again (rc=0). origin/main is now a15e3bed70983dfaed6182951ec010ca8a20c374.
   - `git diff --quiet 5bb2f2e3… origin/main -- <file>` reports all four brief files unchanged: the form, the directive, the ADV-2026-11-16-20 ruling and the -19 clause check.
   - I read the ruling and the clause check at a15e3bed. The script reads the directive at a15e3bed.
2. **No Write tool.** The harness answered "Error: No such tool available: Write. Write is not among the tools available here." This was not a refusal of an action, so I did not treat it as a stop.
   - I wrote the script with one Bash heredoc to `<S>/kl19g-check.mjs`, a new name, after a test that no such file existed.
   - It is my own script. It reuses none of the custodian's.
   - It is my only write.

## Checks

**1. Head, diff and main's drift**
- `git -C C:/dev/wt/kl19 rev-parse HEAD` returns `396cf62dcb9717deff770f4d6d3fa55eea8aab10`. `git ls-remote origin refs/pull/329/head` returns the same id.
- `git -C C:/dev/wt/kl19 diff --numstat 5bb2f2e3… 396cf62d…` returns `5	0	KNOWN-LIMITATIONS.md`.
- `git diff --name-only 5bb2f2e343b7a3fd06befee1159df5a7045ffe31 origin/main` lists:
  - governance/CUSTODIAN-QUEUE.json
  - governance/CUSTODIAN-QUEUE.md
  - site/data/plan.json
  - site/index.html
  - state/CUT-STATE.md
- KNOWN-LIMITATIONS.md is **not** in that list (`grep -c` gives 0).

**2. The notes against the fences** (`node <S>/kl19g-check.mjs`, rc 0, "ALL OK")
- The script found 3 fences in the ADV-19 text. Fences 1 and 2 are one line each. The diff has 5 added lines and 0 removed.
- Note 1:
  - fence: 435 B, sha256 e8a5c27bedb961bbbcd35e3cca1979a00448e6aece5968ede8913aff5cbec2a9
  - diff: 435 B, sha256 e8a5c27b…
  - head line 188: 435 B, sha256 e8a5c27b…
  - Result: fence == diff == head, byte for byte.
- Note 2:
  - fence: 576 B, sha256 26074b76540a824a179a7d04bdbcc05c60b7b919e81a8fd20e967961130f512c
  - diff: 576 B, sha256 26074b76…
  - head line 227: 576 B, sha256 26074b76…
  - Result: byte for byte.
- Each note occurs exactly once in the head file, and the file has no CR byte.

**3. The places**
- The hunks are `@@ -187,0 +188,2 @@` and `@@ -224,0 +227,3 @@`.
- Note one: the paragraph runs from head line 184 to its last text line, 187. Note one is line 188, its comment is line 189, and the `<!-- DECISIONS-PENDING entry 87` comment is line 190.
- Note two: line 225 is item 44's indented comment, then a blank line (226), note two (227), its comment (228), a blank (229), and the heading `## On main since v0.1.0 — not in any release yet` (230).
- Lines 188, 189, 227 and 228 all start at column 0.

**4. Nothing else changed**
- The file at the head with lines 188, 189, 227, 228 and 229 removed is 167615 B, sha256 102daa62ab1acfecff3ce45b75865109fedcc682b19326dbd017c675b7357733. The base file is the same, byte for byte.
- The five removed lines are exactly the diff's added lines, in order.

**5. The comments**
- Both comments name the directive and the -19 clause check, and all four paths exist at origin/main.
- The paragraph above note one (4 lines) is identical to the base and was followed there by the entry 87 comment.
- Every line above note two, setting aside note one's two lines, is identical to the base. So "The paragraph above it is unchanged." and "No item of the list above is changed." are true.
- One clause is not true as written. See D1.

**6. Rendering** (CommonMark)
- **Note one.** Line 188 follows line 187 with no blank line. A `*` followed by `C` is not a list marker (a bullet needs a space or tab after it). It is not a thematic break or setext underline either, so line 188 is a paragraph continuation line: a soft break, then emphasis, inside the same paragraph.
  - The opening `*` is left-flanking. The closing `*` follows `.` and ends the line, so it is right-flanking.
  - Each note line holds exactly two `*`.
  - Line 189's `<!--` starts an HTML block of type 2, which may interrupt a paragraph, and it closes on the same line. Line 190 does the same. Neither shows anything.
  - This is how the earlier corrections render (for example line 77), except that they continue list items with indentation.
- **Note two.** A blank line comes first, so it is not a lazy continuation. Column 0 is less than item 44's content indent of 4, so it is not item content either. It closes the list and renders as a top-level paragraph in emphasis. Line 228 is an HTML block, 229 is blank, and 230 is an ATX heading.
- Finding: none.

**7. CI** (read at 2026-11-18T08:35:13Z by `date -u +%FT%TZ`; `gh pr checks 329`, rc 0)
- every commit is signed off: pass
- no profile path in the range: pass
- ported-notices: pass
- ported-notices: pass (a second run)
- `gh pr view` gives the head as 396cf62d…, OPEN, draft=true.

## Correctness
None.

## Evidence
None.

## Documentation (must-fix before the merge, no re-gate; the custodian's wording, not the human's)

**D1. Both comments claim the -19 clause check checked "each clause". It did not.** Both comment lines (189 and 228) say:

`each clause checked against the code at the v0.1.0 tag in state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-19-clause-check-reviewer.md`

That file grades only the sentences that changed from -17 to -19:
- Of fence 1 it says: "unchanged from -17 (byte-identical); not graded again".
- Of fence 2 it grades only the new "To ask again" sentence.

The rest of the clauses were graded at the tag in `state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-17-clause-check-reviewer.md`:
- "Fence 1 (note one): ALL PASS."
- F2-1 to F2-7 and F2-9 PASS. Its one CONDITIONAL, F2-8, is the sentence -19 replaced.

ADV-2026-11-16-20 item 3 makes the -19 check stand for item 4, so the gap is in the record, not in the checking.

Replacement for the clause after the directive's path:
- **Line 189:**
  `; each clause checked against the code at the v0.1.0 tag in state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-17-clause-check-reviewer.md, of ADV-2026-11-16-17, whose text is byte-identical; the check of ADV-2026-11-16-19 in state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-19-clause-check-reviewer.md stands for item 4 by ADV-2026-11-16-20 item 3. The paragraph above it is unchanged. -->`
- **Line 228:**
  `; its clauses checked against the code at the v0.1.0 tag in state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-17-clause-check-reviewer.md, of ADV-2026-11-16-17, and its one changed sentence, To ask again, in state/consults/2026-11-16-v0-1-0-notes-adv-2026-11-16-19-clause-check-reviewer.md, which stands for item 4 by ADV-2026-11-16-20 item 3. No item of the list above is changed. -->`

Each clause checked against the evidence:
- **"byte-identical" (note one):** my script printed `fence 1 identical in -17 and -19: true`.
- **"its one changed sentence, To ask again" (note two):**
  - My `node -e` sentence split found 5 sentences on each side. Only sentence 3 differs: `"To ask again, apply or clear the filter again, or open the file again."` -> `"To ask again, repeat the step: open the file again, or apply or clear the filter again."`.
  - The -19 check grades that sentence: "Fence 2: ALL PASS. The new sentence is true for B2-open and B2-filter."
- **"checked against the code at the v0.1.0 tag" (-17 check):** its header says "Code read at tag v0.1.0, commit b391e43622056324c56d35cc33065305140a8415." Its verdicts are fence 1 ALL PASS and fence 2 with F2-8 the only CONDITIONAL.
- **"stands for item 4 by ADV-2026-11-16-20 item 3":** ruling item 3 says "the reviewer's clean check of ADV-2026-11-16-19 stands for item 4 of that draft".
- **The closing sentences:** check 5.
- **HTML comment safety:** the new words contain no `--`, so they cannot end the comment early.

The worker applies these words, and the PR body lists them.

## Notes
- N1. "approved by the human's typed message of 2026-11-16 as ADV-2026-11-16-19 item 2" can be read as calling the message itself item 2. The message approves the draft ADV-2026-11-16-19, and the words are its item 2's fences. A possible rewording: "approved by the human's typed message of 2026-11-16, which approves ADV-2026-11-16-19; the words are its item 2's first (second) fence". This is not false as it stands, so it does not block.
- N2. Governance CI did not run on this PR. Its `pull_request.paths` filter does not include KNOWN-LIMITATIONS.md, so verify-cites and verify-quotes never ran. The comments carry no path:line cite and no quotation marked verbatim, so nothing here needed them. The form's "CI's checks on the PR head" means the four checks shown in check 7.
- N3. The PR is still a draft.

## Runs
- **Reused, not redone:**
  - The -19 clause check, which stands for item 4 by the brief and by ADV-2026-11-16-20 item 3.
  - The -17 clause check, read for D1 only.
  - CI's four GitHub runs.
- **Reproduced by my own calls:** checks 1 to 6, the comparison of fences across -17 and -19, and the CI read.

Files: C:/dev/wt/kl19/KNOWN-LIMITATIONS.md; `<S>/kl19g-check.mjs` (my script).

Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.