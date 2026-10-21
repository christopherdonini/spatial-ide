*Custodian's filing note (2026-10-21): the architect's additions to its draft of the redaction form's Amendment 3 (`state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-amendment-3-draft.md`), for OPEN-4 (A), read only at main 39182e74. The run 2026-10-21T21:46:02Z to 21:52:30Z by its transcript (Read 21, Grep 18; no Write, Edit or Bash). Sections A to D and E2 are integrated into Amendment 3 where they say. E1, MANUAL-WALKTHROUGH row F7, goes to the human for placement. E3 is noted in the amendment, E4 is applied to the ADR-017 note node's PLAN title, and E5 and E6 are noted. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 3157c4eb7bb454c7df5ba4e395797ac6e7eedf134b71fcd1204ce119b4744013.*

---

Drafted: bundle-redaction-scan-not-in-product-publish, Amendment 3's additions for OPEN-4 (A), at main 39182e74

Read only, in the main checkout. The session's git status shows HEAD 39182e74, but I have no shell to confirm it. Because I have no shell, no cite below carries a sha256; the custodian's script adds them. Nothing below is a quotation. The ruling is `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:8 @ 39182e74`, called "the ruling" below.

---

## A. W12, the CLI's module doc (add to the draft's **Words**, after W11)

**Where it goes:** a new paragraph in `kernel/src/bin/publish-bundle.rs`'s module doc. It goes after the paragraph that opens "**The five `--viewer-*` / `--corresponding-source-*` arguments are required, not optional.**" and ends with "`--viewer-license` is the *program*'s." (`kernel/src/bin/publish-bundle.rs:39-45 @ 39182e74`). It goes before the heading `## Publishing is a class-3 external side effect (ADR-006), and it now goes through a gate` (`kernel/src/bin/publish-bundle.rs:47 @ 39182e74`). It is separated from both by a `//!` blank line. These are the architect's words, not the human's: the worker applies them and the PR body lists them.

```text
**This binary's publish skips no viewer file** (the redaction form's Amendment 3). It takes no
viewer build record: `--viewer` is read with `ViewerAssets::from_dir` alone, so the redaction
gate's skip of recorded viewer files never applies here. The reference viewer's own build
(`renderer/bundle-viewer/dist`) carries licence texts in its `NOTICE.txt` that hold a
`credential` match and a `local-filesystem-path` match, so a publish with that build is refused
with `PublishError::RedactionFinding`. The refusal names `viewer/NOTICE.txt`, unless a top-level
bundle file (`build-info.json`, `manifest.json`, `style.json`) holds a match first: the gate
reads those, then `viewer/`, then `data/`. A rerun of the hero slice's acceptance run
(`kernel/RESULTS.md`), which publishes that build through this binary, is refused the same way.
Every test that runs this binary gives it a synthetic viewer that holds no match. The shell's
publish is the one that reads the build record, and it skips a `viewer/` file only when the
file's bytes match the record's entry for that path.
```

Each clause, checked:
- **"takes no viewer build record … `ViewerAssets::from_dir` alone":** `kernel/src/bin/publish-bundle.rs:520 @ 39182e74` is the only viewer construction in the file. OPEN-4 (A) adds no flag. Item 11's amended item 7 gives `with_build_record` one product caller, `bundled_viewer`. The new §8 item 19 (C below) holds this file to comment-only.
- **"the skip never applies here":** item 2 says no record means nothing is skipped. U1's fifth case tests that.
- **"`NOTICE.txt` … a `credential` match and a `local-filesystem-path` match":**
  - O0 found both (Amendment 2 item 1).
  - They are item 3's two `NOTICE.txt` reviewed rows.
  - Item 5 predicts both survive the strip.
  - Item 4 keeps the licence texts unedited and `NOTICE.txt`'s sha256 equal at B′ and H.
  - O1 confirms both at B′ before any code.
- **"is refused":** those two classes are never re-classed `operator-declared` (`kernel/src/bundle/redaction.rs:70-85 @ 39182e74`). With no record, T6's second half is the same refusal at `viewer/NOTICE.txt` through `boundary::execute`. `main` prints the error's `Display` (`kernel/src/bin/publish-bundle.rs:166-171 @ 39182e74`). That is why W12 names the variant and not the code string: the CLI prints W1's sentence, not `publish.redaction_finding`.
- **"names `viewer/NOTICE.txt`, unless a top-level file … first; those, then `viewer/`, then `data/`":** the walk (`kernel/src/bundle/redaction.rs:343-352 @ 39182e74`) works like this:
  - it scans a directory's files in sorted order and pushes its subdirectories;
  - it pops the last-pushed directory first, so `viewer/` comes before `data/`;
  - in `viewer/`, `NOTICE.txt` sorts before the lowercase names.

  §2.4 keeps that order for the gate. After the strip, no other `dist/` file holds a match (item 5).
- **"A rerun of the hero slice's acceptance run":** `kernel/RESULTS.md:1481-1484 @ 39182e74` passes `--viewer renderer/bundle-viewer/dist`.
- **"Every test that runs this binary gives it a synthetic viewer that holds no match":** there are three such viewers: `kernel/tests/publish_cli.rs:97-106 @ 39182e74`, `kernel/tests/scale_pass.rs:953-960 @ 39182e74` and `kernel/tests/import_layout_publish_determinism.rs:153-160 @ 39182e74`. Every `--viewer` argument in those files goes through them. Their bytes hold no needle and no drive shape.
- **"The shell's publish … skips a `viewer/` file only when the file's bytes match the record's entry for that path":** this is item 2's `bundled_viewer` and `is_built_asset`, tested by U1's first to fourth cases.
- **Who can reach it:** the installer ships no CLI (`KNOWN-LIMITATIONS.md:135-137 @ 39182e74`), so this is developer tooling (§1). It still blocks if untrue: a walkthrough step reaches it (E1).

## B. Item 10's table, one row, and its totals

- **Row** (after `kernel/src/permission/audit/reader.rs`): `| kernel/src/bin/publish-bundle.rs (new to scope; module doc only, W12) | 16 |`. That is twelve text lines and one `//!` separator, with room for rewrapping.
- **Totals:** item 10's bold sentence reads **At most 1,222 changed lines over 24 non-generated files, plus this form.** That is 1,206 + 16 = 1,222, and 23 + 1 = 24. I re-summed the existing 23 rows: they make 1,206.

## C. What else this file touches

- **§8 (item 11, added):** `19. any edit to kernel/src/bin/publish-bundle.rs other than W12 in its module doc; a viewer build record taken by the CLI included (OPEN-4 (A)).` This is needed. Without it, the row's "module doc only" and W12's first clause are not enforced.
- **§5 (item 9, "Declared unchanged, added"; recommended so it matches `commands.rs`):** `kernel/src/bin/publish-bundle.rs`, except W12.
- **§2.10 (item 7):** "W4′, W5′, W7′, W9, W10 and W11" becomes "W4′, W5′, W7′, W9, W10, W11 and W12".
- **§9 (item 12):**
  - The architect's list: "W4′ to W11" becomes "W4′ to W12".
  - Rule (00): "the 23 in item 10" becomes "the 24 in item 10".
  - Under "Piece 1c's committed form", add: `kernel/src/bin/publish-bundle.rs` is in none of 1c's step groups (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-490 @ 39182e74`), and 1c's overlap section names no `kernel/src/bin/` path (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:546-553 @ 39182e74`), so the two are disjoint. 1c's version-literal group is the SKP version, and this file defines no SKP message (`kernel/src/bin/publish-bundle.rs:73-74 @ 39182e74`).
  - One fact for the dispatch re-check: 1c's overlap lists this piece's paths as of the form's §9 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:546 @ 39182e74`), from before Amendment 3. 1c's form is append-only, so the custodian's re-check at dispatch is what covers the new paths.
- **§4:** no test or mutation is needed.
  - W12 adds no behaviour.
  - The CLI's shape (no record) is U1's fifth case.
  - The refusal through `boundary::execute` is T6's second half.
  - The bytes are O1's result.
  - The new §8 item 19 blocks the only change that could falsify W12 (a record path in the CLI).

## D. The other rulings: none changes an item's substance

Every option the human picked is the draft's recommendation: OPEN-1 (B), OPEN-2 (A), OPEN-3 (A), OPEN-4 (A), OPEN-5 (A), and yes to W6′. So every "pending OPEN-n" item stands as drafted.

- **OPEN-2's guard:** O1 already builds with a scratch strip edit, scans, predicts exactly item 5's rows, and STOPs before any code on any other finding (item 8's O1; item 9's first invalidator). No text change is needed.
- **OPEN-7's carry:** the node `adr-017-note-product-redaction-gate` already records it (`PLAN.yaml:5698 @ 39182e74`). The form's "No ADR is amended" stays true. No text change is needed.

The one edit the rulings do need is to the amendment's References line. Add: `OPEN-1 to OPEN-7 are ruled as recommended (state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:8 @ 39182e74); every "pending OPEN-n" item stands as drafted, and W6′ is approved.` This keeps the markers as written, as the record cap prefers, instead of editing six of them.

---

## What I could not settle

- **E1. MANUAL-WALKTHROUGH Part F, row F7.** `frontends/shell/MANUAL-WALKTHROUGH.md:274 @ 39182e74` has the operator run `publish-bundle.exe … --viewer "C:\dev\spatial-ide\renderer\bundle-viewer\dist"` and predicts success "with no error". At H, under OPEN-4 (A), that step is refused at `viewer/NOTICE.txt`. The draft's OPEN-4 text named only the kernel tests, not this row. The form puts walkthrough rows outside this piece (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:352 @ 39182e74`). An expected outcome that is false at H, and that a sitting reaches, should be placed before this PR merges. I recommend a docs-lane piece that sends F7 to Part G's G5/G7, which already makes the same visual comparison through the shell. The other route is a class 9 addition to this piece (one more row, a separate path under rule (00)). Either way it is the human's placement. `MACOS-BRINGUP.md:129-142 @ 39182e74` translates Part F too; it is paused, so I only note it.
- **E2. Item 6's §1 bullet is less exact than W12.** "it is refused at `viewer/NOTICE.txt`" leaves out the top-level-file case. Words to replace that clause, if the custodian accepts the change: `it is refused, naming viewer/NOTICE.txt unless a top-level bundle file holds a match first (W12)`. The brief said nothing else in the draft changes, so I have not made this an addition.
- **E3. A stale bullet in item 12.** It describes PR #240 as open, but #240 merged at e8f110bb. The paths are still disjoint, so this is a fact to bring current, not a conflict.
- **E4. The PLAN title of `adr-017-note-product-redaction-gate`** (`PLAN.yaml:5684 @ 39182e74`) says the product publish scans every emitted file. After this piece, the viewer's files are scanned at the viewer's build instead. This is the custodian's PLAN text, and the note's words are the human's, later.
- **E5. Test comments that say the real notice "reaches the acceptance run"** (`kernel/tests/publish_cli.rs:102-103 @ 39182e74`; `kernel/tests/publish.rs:109 @ 39182e74`). They now describe a run that a rerun would refuse. `publish.rs` is declared byte-unchanged (§8 item 3), and `publish_cli.rs` is outside scope. I recommend no edit, because they read as describing the recorded run.
- **E6.** The walk order in W12 rests on §2.4 keeping `scan_directory`'s order for the gate. The architect's gate reads that against the diff at H.
