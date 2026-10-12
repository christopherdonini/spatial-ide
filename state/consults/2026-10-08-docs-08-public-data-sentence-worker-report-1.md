*Custodian's filing note (2026-10-08): `docs-08-public-data-sentence`'s worker report, at the branch head 388531fa3df01e2d63854ff63992c6e30014982b (worker run from 18:14:16Z, report at 18:17:48Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is e6fb72d8ca4d84be24cdbb34bfdae2ffd5ead74c20201b4d5b474e2098351914. The custodian read the diff from main (one line of docs/08_Testing.md replaced) and compared the new line byte for byte with its own derivation. Paths and lines below are at the branch head, not main. PR #194.*

---

Line 40 of docs/08_Testing.md now holds the human's sentence. It is committed as one signed-off commit and pushed to origin as an ordinary update. The worktree is clean.

- **Head:** 388531fa3df01e2d63854ff63992c6e30014982b, on top of 4cb3cd2e. That matches your correction; I started from 4cb3cd2e.
- **New line 40** (docs/08_Testing.md:40, byte-copied): `- **Public data**: Overture Maps, OSM extracts, Sentinel/NAIP samples — real scale. Each file is fetched from its source and kept local, never redistributed; its hash, licence and attribution are recorded.`
- **Comparison:** I derived the line by script from lines 25-27 of the directive file. Those lines were joined with single spaces and their leading indentation removed. `cmp` against your line showed no difference, so I did not stop. `cmp` of the new line 40 against my derivation also showed no difference. The dash is U+2014.
- **Line ending:** `file` reports "UTF-8 text" with no CRLF, before and after the change.
- **Numstat:** `git diff --numstat origin/main...HEAD` gives `1 1 docs/08_Testing.md`, so 1 file, 1 added and 1 removed.
- **Checks:** `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`, `verify.mjs`, `queue.mjs --check` and `site.mjs --check` each exited 0. I ran them with the change staged, before the commit.
- **Grep:** `git grep -n -i redistributable -- docs/` finds only the two ADR-017 hits, which concern a published artifact:
  - docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:924
  - docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:930
- **Deviations:** none.
