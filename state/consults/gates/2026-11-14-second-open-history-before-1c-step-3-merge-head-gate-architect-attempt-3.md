Reviewed: PR #318 at 63d66887049e8ddafaef7c6183f09138e7893480 (the custodian's filing note, 2026-11-14: the gate, the architect, this gate's attempt 3 in the gate log, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2, at the merge head M of main N (f47a2ad90f69dfa02f63636887d0402862c03edd) into C4 (c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6), scoped to the merge under the advisor's ruling ADV-2026-11-14-21 item 4 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-21-318-hold-main-into-the-branch-both-gates-at-the-merge-head-a-standing-changed-paths-list-before-a-last-gate.md`), with a verdict and a row of its own (item 4 (d)); its message sent at 2026-11-14T21:55:18Z to the same run, whose resumed prompt at 2026-11-14T21:55:20Z holds it byte for byte inside the harness wrapper (the message 495 bytes, sha256 9725d7eb979351c8cb08510082b6f7ab429a7f8153e1e5b8bbea0452c6810ba0), pointing to its packet by file `<S>/msg-g318ma.txt` (4164 bytes, sha256 357df3d515ba2fc5570e01f3d810b888c977459c7352544e771056949961e4b1), which names `<S>/adv-2026-11-14-21.copy.md` (5349 bytes, sha256 81630b699934f2925d86affc1d1a7c655e62a7a22ffe6a5b8a32b3bb5d9539dc), `<S>/pr-318-hold.copy.md` (5775 bytes, sha256 ccd6db516a52fea9cf5a1b9607ca1362f953bd76287530f00f3e6b28bff11d14), `<S>/check-318-merge.mjs` (4770 bytes, sha256 0e3bdc150378e8352e6f095824e91ff0e27ae9f87298b6a938eff0314ab47d6f), `<S>/check-318-merge-M.out` (1645 bytes, sha256 68bc7cf858d88f7581978f72badadff2f59d8dd1bbed9927ebc1109f60ed7373) and `<S>/check-318-merge-M-verify.out` (947 bytes, sha256 e051bf6bca8dd5fc5b5a3846e268402098f044d258feb559f456e1c263abeef7); this attempt 2026-11-14T21:55:20Z to 2026-11-14T21:58:10Z by its transcript, 18 calls (Read 10, Grep 7, SubagentHandback 1), none errored, no Bash call and no file written, model claude-opus-5-5; below, the hand-back byte for byte (with one final newline, 6947 bytes, sha256 6a91b4f7ef8a6f17df400f97159db989e5d11d4823fee2253efff36939d4661a). Nothing is changed.)

Reviewed: PR #318 at 63d66887049e8ddafaef7c6183f09138e7893480, gate architect, attempt 3 (cut/second-open-history-before-1c-step-3 @ 63d66887049e8ddafaef7c6183f09138e7893480)
Verdict: PASS

The branch ref `refs/heads/cut/second-open-history-before-1c-step-3` reads 63d66887049e8ddafaef7c6183f09138e7893480. The worktree `C:/dev/wt/so` was read at M.

**Findings**
- Correctness: none.
- Evidence: none.
- Documentation: none.
- Nothing at M touches ruled wording, so nothing goes to the advisor under ADV-2026-11-14-21 item 4 (e).

**(1) Item 3 at M: what the script, its output and my reading show** (the paraphrase is mine)

- (a) Parents. The script reads M's parents with `rev-list --parents` and expects exactly [c8f8bdca, N]. Output line 2: c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6, f47a2ad90f69dfa02f63636887d0402862c03edd. This proves item 3 (a) as written.
- (b) The ten other files. For each file other than `KNOWN-LIMITATIONS.md`, the script compares its blob id at M with its blob id at c8f8bdca. The file list is `git diff --name-only` from the base 695e1303 to c8f8bdca: 11 files. Output lines 3 to 12 show all ten equal. Equal blob ids mean the bytes are equal, so this proves item 3 (b). It covers ADR-036 (blob 24d412b6a1c6) and `kernel/src/session_history.rs` (7dbd6bec4f7d), the file that holds the C1 pins of item 43's second comment.
- (c) `KNOWN-LIMITATIONS.md`. The script builds the expected file from two inputs, never from M:
  - it takes N's file;
  - it puts c8f8bdca's item 43 (its line and two comments) in place of N's item 43 (its line and one comment);
  - it removes N's item 63 (three lines and a blank line);
  - first it checks that N's item 43 and N's item 63 are each equal to the base's.

  It then compares the whole expected file with M's file. Output line 17: both sha256 067d0b11163fd708. This is stronger than item 3 (c)'s words, because a whole-file match leaves no line unchecked: item 47's lines are N's, and item 63 is gone.

  My own reading at M agrees:
  - `KNOWN-LIMITATIONS.md:436-438` is item 43's line, its approval comment and its second comment (with the C1 pins at a2fbab2c), as I passed them at c8f8bdca;
  - no item 63 line exists;
  - item 64 follows item 62 at :508.
- (d) The merge's diff. The script checks that `diff --name-only N M` names exactly the 11 files, and output line 19 says it does. With (b), this proves the merge brought nothing past N except the PR's own changes.
- (e) The verify scripts. `<S>/check-318-merge-M-verify.out` was run at M with an empty porcelain. All four scripts returned rc=0:
  - verify-cites: 3047 files;
  - verify-test-claims: 804 claims;
  - verify.mjs --offline;
  - verify-quotes: 156 checked, 932 ruling cites, 0 errors.

  I have no Bash, so I did not run anything. The reviewer runs the scripts and compares.
- Item 2 (b). `merge-base --is-ancestor a2fbab2c M` passes (output line 20), so C1 is still reachable.

**Where the script is weaker than the words**
- The item 47 check (line 18) only finds that item 47 exists. On its own it proves nothing about item 47's words. The whole-file comparison in (c) is what proves them.
- Item 2 (a) and (c) are not checked: that the commit is signed off, that its message names N, and that it carries no hand edit. The byte result is the same as git's clean merge, but a hand-made commit with the same bytes would also pass.
- Item 3 (e) is not in the script. It rests on the separate verify output.
- The script proves item 3 only for the run it records. The reviewer's own run is the second reading.

**(2) Items 43 and 47, read whole at M**
- Item 43 (`KNOWN-LIMITATIONS.md:436-438`) is unchanged from what I passed at c8f8bdca. Its pins are historical pins at a2fbab2c, which is reachable from M. The pins themselves are authoritative. session_history.rs at M has the same blob as at c8f8bdca, so the current file is the one I read for C4.
- Item 47 (`KNOWN-LIMITATIONS.md:448-456`) is main's text, whose last sentence came in at 4e9984fc. It covers publish redaction and says nothing on session history, project save or ADR-036. It shares no text with item 43.
- Item 64's comment, "the number is the next after item 63", is still true as a record of where the number came from. Item 63 is withdrawn and its number is not reused.

**(3) What main brought, against what I passed at c8f8bdca**
None of the following makes untrue anything I passed. What I passed: SKP-V0 §11, item 43, ADR-036 Amendment 2, the form's clause checks, the OPEN-N4 sentence, and D1.
- Item 47's sentence: see (2).
- Walkthrough row G3 (`frontends/shell/MANUAL-WALKTHROUGH.md:333`), `frontends/shell/e2e/pan-anchor.mjs` and `frontends/shell/src/publish/PublishDialog.tsx`: a search of each for session history, `save_project`, item 43 or ADR-036 finds nothing.
- #320's three tests, all inside `mod ticket_drop_under_lock_regression` (`kernel/src/skp.rs:3455`):
  - `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` (:3646);
  - `the_close_race_mints_no_generation_so_no_unheld_reference_exists` (:4652);
  - `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` (:5238).

  None of them touches `record_step` or the save.
- The live check that `viewport_query` and `record_step` share (`kernel/src/skp.rs:1661-1665`) reads as it did when I read it earlier. I did not diff skp.rs's non-test code from the base to N. My statement that #320 changed only the test module rests on the brief and the advisor's item 4 (b). The reviewer can show it with a git diff from 695e1303 to N on that file.
- `kernel/README.md`:
  - My reading is that #320's lines are the "Last verified at" line (:361, "the three untested close-race tests piece … at b7133d0a") and the preregistration list (:390). Neither is :395.
  - `kernel/README.md:395` still lists `43, 47, 62, 63`, as it did at c8f8bdca.
  - D-1 therefore stays as ruled: it is closed for the merge by ADV-2026-11-14-19 item 6, and the form's Amendment 3 item 6 names this line and its replacement for the index update after the merge. The line has not moved.

**What I read in this attempt (tool calls)**
- Read, 10 calls:
  - in `<S>`: `msg-g318ma.txt`, `adv-2026-11-14-21.copy.md`, `pr-318-hold.copy.md`, `check-318-merge.mjs`, `check-318-merge-M.out`, `check-318-merge-M-verify.out`;
  - the branch ref;
  - `C:/dev/wt/so/KNOWN-LIMITATIONS.md:430-513`;
  - `C:/dev/wt/so/kernel/README.md:355-396`;
  - `C:/dev/wt/so/kernel/src/skp.rs:1658-1665`.
  - After the context compaction, the harness attached five of the `<S>` files again. Those are not counted as calls.
- Grep, 7 calls:
  - kernel/README.md;
  - KNOWN-LIMITATIONS.md item heads;
  - kernel/src/skp.rs, for the tests and session-history names;
  - PublishDialog.tsx;
  - pan-anchor.mjs;
  - MANUAL-WALKTHROUGH.md, for G3 (2 calls).
- SubagentHandback: 1.
- No Bash, Edit or Write. Nothing was changed in any repository or worktree.

Model: claude-opus-5-5 (Opus 5.5).
