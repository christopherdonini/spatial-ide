*Custodian's filing note (2026-10-21): S1 of ADR-036's pre-acceptance block, by a worker in `C:/dev/wt/a36` at B ad921f552f25a138bf845368e2e9e1f726d73812, building 70edd381ac6a1bf62d57de49b39dfa1ad95bac05. The run 2026-10-21T15:29:08Z to 15:36:33Z by its transcript (Bash 9, Read 1; no Write or Edit tool call; its script in its scratch folder). The branch's diff from B is ADR-036 and `docs/README.md` alone, and the Status line at the head still reads Proposed, both checked by the custodian. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is e114ab240657ed3a7bbc7dab79e075aebd6e18cef9822c82d2d48860c48ea272.*

---

Built: adr-036-pre-acceptance-block S1 at 70edd381ac6a1bf62d57de49b39dfa1ad95bac05 (branch cut/adr-036-pre-acceptance-block, pushed, no force; `git status --porcelain` empty afterwards). The commit has the signoff and both trailers.

Steps, each run with output redirected to a file and its exit code printed:
1. I1: `git diff --stat 2879e17f… ad921f55… -- <ADR-036> docs/README.md` gave rc=0 and empty output, so I1 did not fire.
2. Script: `apply36.mjs` in my scratch folder, never committed. It reads the passages from the form's fenced blocks at B, matches each old passage once by its bytes, and inserts after the named anchor lines. It printed "applied 20 edits: A1 A0 A2a A2b A2c A3 B2 B5a A4 B1a C1 B1b C2 B4 A7a A7b A5a A6 A5b B5b" with rc=0. No I2 occurred. §2.3 was not applied separately, since its passages are inside B1's and A6's "New" text.
3. `adrIndex.mjs` rc=0 ("wrote 34 ADR rows"). `adrIndex.mjs --check` rc=0 (PASS, 34 ADRs). I did not edit `docs/README.md` by hand.
4. V1: `apply36.mjs check` rebuilt ADR-036 from `git show B:<path>`. It printed "V1 byte-equal: true", rc=0.
5. V3: `git diff --name-only B` lists exactly `docs/README.md` and `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (rc=0).
6. V4/V5, all rc=0, last lines:
   - verify.mjs: "verify:plan PASS — … PLAN.yaml agrees with the repository."
   - verify-cites.mjs: "verify:cites PASS — every rooted (in-tree) path:line reference across 2161 file(s) resolves. (85 loose reference(s) advised above.)"
   - verify-quotes.mjs: "verify:quotes PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors."
   - verify-test-claims.mjs: "verify:test-claims PASS — all 581 claimed test(s) across 185 file(s) exist or are planned, superseded or withdrawn (4 planned, 9 superseded, 17 withdrawn, advisory)."
   - queue.mjs --check: "CUSTODIAN-QUEUE.md/.json are current."
   - site.mjs --check: "site/ is current."
   - node --test of the plan, hooks and evidence suites: tests 527, pass 527, fail 0 (rc=0).
7. §7 count: `git diff --numstat B -- <ADR-036>` gave 44 insertions, 18 deletions = 62, under the ceiling of 90.
8. Commit with `git add` of the two paths only and `git commit -s -F`. Subject: "docs: ADR-036's pre-acceptance block applied (the human's rulings of 2026-10-21)". The push is a separate call.

Lines at H (70edd381) in ADR-036. The line numbers are from grep and a diff read, except where noted:
- A1: 3. Status still says Proposed.
- A0: 6, inserted after the 1b "Amended" line (5). Line 7 is the Related line.
- A2: 21 (tree line); 26 (name paragraph, replacing the OPEN note); 30 (members paragraph, after the blank line that follows line 28's "Nothing else in the folder belongs to the format." line).
- A3: 34 to 55 (my arithmetic: the 22-line New block starts at 34). The Encoding bullet is at 34, its three sub-bullets after it, and the layout bullet at 38.
- B2: 77.
- B5a: 92. A blank line sits before it (the diff shows `The Snapshot column…` after a blank) and another after it, before the `locators` line.
- A4: 95.
- B1: 100 (locators paragraph), 102 (Containment, C1), 104 (containment bullet), 106 ("Piece 1c builds the writer and the resolver.", C2).
- B4: 108.
- A7: 175 (`style.set` row), 177 (the `filter.apply` sentence).
- A5: 194, 195 (new lineage member bullet), 219 (the work-left-to-later line).
- A6: 217.
- B5b: 227, after the coordinate-epoch bullet.

Context around each insertion at H (from `git diff -U1`, cut to 70 to 110 columns):
- A0: line 5 is "**Amended:** in piece 1b's form (…" and line 7 is "**Related:** ADR-005; ADR-006; …".
- A2 members: it follows "Nothing else in the folder belongs to the format. The session history, …", then a blank line. It is followed by a blank line and "### 2. Encoding".
- B5a: it is preceded by "A dataset entry, in the project file and in a steps file's header, is `{"resource…" … and a blank line. It is followed by a blank line and "`locators` holds one or more `{"kind", "at"}` objects:".
- B5b: it is preceded by "  - **the coordinate epoch:** when a dataset's coordinates were observed, …" and followed by "- **Out of B2 altogether:** projects with several datasets; …".

Regenerated `docs/README.md` row 73, byte for byte:
`| [ADR-036](adr/ADR-036-project-folder-step-record-and-dataset-reference.md) | B2's file formats: the project folder, the step record and the lasting dataset reference | Proposed. **It binds nothing until the human accepts it.** Acceptance is due once the pre-acceptance block (piece `adr-036-pre-acceptance-block`) has merged, and before piece 1c (`b2-piece-1c-save-and-reopen`), the first piece that writes a file that a later version or another person reads, starts its code. It is not architect-blockable until accepted. |`

Off-scope noticed, not done: nothing.

Machine paragraph: none of the commands was heavy, so I used no hold. Model I ran as: Sonnet 5.5, no override, no context handoff.

Pre-gate four classes:
- Cross-module: none, since this is documentation only.
- Completion claims: each points to its command and exit code above.
- User-facing messages: none changed.
- Required tests: I added no test. V1 is a byte comparison that reached its assertion ("V1 byte-equal: true").

File: C:/dev/wt/a36/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
