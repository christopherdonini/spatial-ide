*Custodian's filing note (2026-10-11): the docs lane's piece c worker report 2, the human's two sentences appended under the five-line form's Amendment 1, head ef401e830c74fd1e369dfa42fa894a52385ac2da, published; the worker found the paragraph's opening words at a second line, in item 3, and changed only item 2's line, checked equal to the human's paragraph (the worker run 08:49:11Z to 08:51:35Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 9b806750e2fe49699b1482473d398a8f229dab517cdc6c6abd9f8a159f18c3ee.*

---

Commit ef401e830c74fd1e369dfa42fa894a52385ac2da: "docs: KNOWN-LIMITATIONS item 2's on-main paragraph gains the human's two sentences (C-1 (A), byte-copied from the ruling's line 7)". It is signed off and carries the Co-Authored-By trailer.

**Deviation from the brief:** the check for exactly one line beginning `   **On `main` (not the v0.1.0 artifact above).**` found two. They are line 60, in item 2, and line 70, in item 3 (item 3 starts at line 62). I changed only line 60. I confirmed by script that line 60 at dd01801e is byte-equal to line 9 of `state/directives/2026-10-10-drift-sweep-area-e-instructions.md`, the human's paragraph. Line 70 is not equal to it. My script took the lines in item 2's range (34-61) that begin that way and asserted exactly one.

**The change:** line 60 became the old line + one space + the directive's line 7 minus its three leading spaces. The script read line 7 of `state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md` from the main checkout; I typed no sentence.
- Old line sha256, newline excluded: d41f13ee8015f7a958f7078b316bedee6ff8108c4438855473188d4eac79c2e7
- New line sha256, newline excluded: 0a11ecc2c0c06af1336aa44fe261e6663ce422fc0f513c3390b3aabbba859b92
- Appended text (line 7 without its three spaces), newline excluded: c8b9f19070882638d7ea4a05187242f55057e8b06478b25afb7f59577ba98f6f
- With a trailing LF (`sed -n 60p | sha256sum`): old 846786d76d40004eea476f77aecc0c531fa71046736393675fde31d05863cd23, new 1245553166fb04e84315092d1c199c017217603eeac0e866ce0a88466252b37d.
- The new line ends with (byte-copied from `git show HEAD:KNOWN-LIMITATIONS.md | sed -n 60p`): "...and either case in a file of any other GeoParquet version. Also refused: a file with no `crs` key whose coordinates the open-time check (item 22) finds outside ±180/±90, because they cannot be longitude and latitude. The code is `engine.format_default_contradicted`, and asserting the CRS the file is really in opens it."

**Checks at the new head:**
- `git diff --numstat dd01801e HEAD` gives `1 1 KNOWN-LIMITATIONS.md`, so one line changed and nothing else.
- `file KNOWN-LIMITATIONS.md` shows no CRLF, and `grep -c $'\r'` gives 0.
- `node scripts/plan/verify-cites.mjs` exited 0.
- `node scripts/plan/verify-quotes.mjs` exited 0. I ran both before the commit, with the change in the working tree, and I did not re-run them after it. I read only their exit codes (output discarded), so I did not read the cite-content listing.
- The Scope count, `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- KNOWN-LIMITATIONS.md`, gives `5 3`, so 8 changed lines against the 30 budget.

**State:** HEAD is ef401e830c74fd1e369dfa42fa894a52385ac2da, and `git status --porcelain` is empty. The branch `cut/known-limitations-item-2-on-main-paragraph` is published: origin's branch equals HEAD. I opened no pull request and did not touch the PR body.

**Self-check of the four classes:**
- Cross-module seam: none, since this is a document change.
- Completion claims: each one points to the script output above.
- User-facing message: the appended text is the human's own. I did not check its claim about `engine.format_default_contradicted` against the code, because the ruling says to append it as written.
- Required tests: none were added.

**Model:** Sonnet 5.5, no override and no context handoff.
