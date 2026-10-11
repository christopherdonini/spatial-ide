*Custodian's filing note (2026-10-11): the docs lane's piece c worker report 3, the human's second ruling applied under the five-line form's Amendment 2, head d2294623916745d97e5d46cd08b9b5c46934526b, published (the worker run 09:50:38Z to 09:52:41Z by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 98df1c99734c525d5571e3cf3e370e3516b2959c0681852879a6ec1dfb60d953.*

---

Done. Commit d2294623916745d97e5d46cd08b9b5c46934526b: "docs: item 2's on-main paragraph, the second appended sentence replaced by the human's two (PR #205 ruling, round 2)". It is signed off and ends with the Co-Authored-By trailer. Published to origin. No PR opened and no PR body edited.

Method: a script read line 7 of the directive file, removed its three leading spaces, and replaced the span from `The code is` to `opens it.` on line 60 of KNOWN-LIMITATIONS.md. Before replacing, it checked that `The code is` occurs once in the file, `opens it.` occurs once, and both fall on line 60. No sentence was typed.

Old line 60 (sha256 of the line plus LF: 1245553166fb04e84315092d1c199c017217603eeac0e866ce0a88466252b37d). Its ending, byte-copied by the script:
"...cannot be longitude and latitude. The code is `engine.format_default_contradicted`, and asserting the CRS the file is really in opens it."

New line 60 (sha256 of the line plus LF: 32793286a05126e0fca6011c8ba0b220688605b1a1aeb8c5b1b6ae7accb0d58a). Its ending, byte-copied by the script:
"...cannot be longitude and latitude. The code is `engine.format_default_contradicted`. The app does not yet offer a CRS assertion after this refusal, so on `main` such a file cannot be opened in the app."

The rest of the line is byte-identical, and nothing else changed.

Checks at the new head:
- `git diff --numstat ef401e83 HEAD` gives `1 1 KNOWN-LIMITATIONS.md`.
- `file KNOWN-LIMITATIONS.md` prints "exported SGML document, Unicode text, UTF-8 text, with very long lines (1878)", with no CRLF mentioned.
- `node scripts/plan/verify-cites.mjs` exited 0.
- `node scripts/plan/verify-quotes.mjs` exited 0.
- `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- KNOWN-LIMITATIONS.md` gives `5 3`, which is 8 changed lines against the Scope count of 30.

Final state: branch cut/known-limitations-item-2-on-main-paragraph in C:/dev/wt/kl2. `git status --porcelain` is empty. HEAD d2294623916745d97e5d46cd08b9b5c46934526b equals origin/cut/known-limitations-item-2-on-main-paragraph, so it is published.

Self-check: no cross-module seam was touched. The only completion claims are the checks above, which I ran. No user-facing message was added beyond the ruling's own sentences. No test applies (docs-only). I ran as Sonnet 5.5 with no model override and received no context handoff.
