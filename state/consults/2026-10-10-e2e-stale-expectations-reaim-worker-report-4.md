*Custodian's filing note (2026-10-11): `e2e-stale-expectations-reaim`'s worker report 4, the walkthrough commit of correction round 1 (gate 1's reviewer E1 and D3, the architect's D3), the worker run 21:57:16Z to 22:01:03Z (2026-10-10) by its transcript, head 04e21fb90b97e097f37f7dad7577ec95714818da, published. It arrived as a message and is extracted here by script from the last of its 1 SubagentHandback call(s), with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 1c616a99fbac2a38cedc6ba337f1f874a125efa04ead8f927c61fdfbb553f09e. The custodian stopped the run's stray stdin-reading cat process, which the worker had started, after the run.*

---

Three wording fixes landed in `frontends/shell/MANUAL-WALKTHROUGH.md`, committed and pushed. I ran no tests, since this is a docs-only change.

**Commit and push.** Commit `04e21fb90b97e097f37f7dad7577ec95714818da`, signed off, with the message and trailer you gave. The push was a plain fast-forward: `ef1cc519..04e21fb9  cut/e2e-stale-expectations-reaim`. After the commit, `git status --porcelain` is empty and HEAD is `04e21fb90b97e097f37f7dad7577ec95714818da`.

**Row edits.** Only the changed spans are shown; the rest of each row is untouched. Both versions were copied from the file by script.

1. GROUP′ coverage row (line 685). Before: "yield exactly 3 residential untiled `viewport_query` rows in one `×N` group, found by a bounded poll and asserted by what the entries are rather than by counting headers, that expands to the real individual entries, never a synthesized merge (I8);". After: "yield exactly 3 residential untiled `viewport_query` rows, found by a bounded poll and asserted by what the entries are rather than by counting headers; the step then asserts the grouping rule inside the window those rows span: each group's header reads `×N` for its N >= 2 rows of one key, no two adjacent items share a key, and some group shows 2+ rows in the window (else it fails as `GROUP': grouping not exercised`); each class-A row there parses on its own, never a synthesized merge (I8);". The UNCLASS′ and COPYTRUNC′ parts are unchanged. The new wording follows the e2e README's description of the rule (README lines 286-293 on the branch).
2. F-D fixture row (line 512). Before: "(re-aimed from an absent key, same reason as the No CRS row above — `engine/ADMISSION-PREREGISTRATION.md` §4 F-3)". After: "(`engine/ADMISSION-PREREGISTRATION.md` §4 F-3)". The `"crs": null` text, the `id` beside `parcel_key`, and the regenerate command are untouched.
3. Row N6 (line 949). Before: "(mirrors `source-changed.mjs:726-739`'s own S3 step)". After: "(mirrors the reopen route's S3 touch, `source-changed.mjs:871`; the default route's S3 now retargets a junction instead)". Line 871 of `frontends/shell/e2e/source-changed.mjs` at ef1cc519 is the `utimesSync(SCRATCH_COPY, later, later)` call under `S3-touch-mtime` on the reopen route. The default route's S3 is `S3-retarget-junction`, at lines 845-866.

**Checks.**
- `git diff --stat` before the commit showed one file, 3 insertions and 3 deletions.
- `git diff --numstat f0fccfaf` on the walkthrough shows 17 added and 17 deleted, against the form's ceiling of 60. It was 16/16 before this commit, so the form's "was 32" is the sum of 16 and 16. `git diff --numstat f0fccfaf HEAD` shows the same figure.
- `git diff --check` is clean.
- `git diff --name-only cf2434e6 HEAD` is long, because that base is far behind the branch's main merges. It includes the four files item 7 of Amendment 2 names: `frontends/shell/e2e/console.mjs`, `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`, `frontends/shell/e2e/README.md` and `frontends/shell/MANUAL-WALKTHROUGH.md`.
- The rest of that list is main's drift from the merge, which I did not itemize against the merge commit. It covers `CUSTODIAN-QUEUE.*`, `DECISIONS-PENDING.md`, `PLAN.yaml`, `engine/` (including `engine/tests/session_identity.rs`), `kernel/` (including `kernel/src/skp.rs`), `site/`, and `state/` (consults, directives, drafts, questions and `gate-log.json`).
- This commit touches only the walkthrough, confirmed by `git diff --stat`.

**Self-check.**
- Cross-module seam: the cites were read against the actual code (`source-changed.mjs` lines 845-871, README lines 286-293), and no code interface was touched.
- Completion claims: each claim above has a line cite or command output.
- User-facing text: the new walkthrough text describes behavior as the README and the code have it.
- Test assertions: none apply to this commit.
- Model: I ran as Sonnet 5.5, with no override and no context handoff.

**Other notes.** My first shell call hung on an accidental stdin-reading `cat` and was backgrounded, but it made no changes (the working tree was clean afterwards). The hand-edit script is `reaim-r1-wording.mjs` in the session scratchpad. I touched nothing under `e2e/out/`.
