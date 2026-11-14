Reviewed: PR #318 at dc0bd9374e8b268bd09718f01994a960b92acd4f (the custodian's filing note, 2026-11-14: the gate, the architect, at C3, the re-gate of ADV-2026-11-14-17 item 10 (b) and this gate's attempt 2 in the gate log, under the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its brief given whole as its prompt, equal byte for byte (7189 bytes, sha256 d4569e93426c8632fd2891b7fe840ab857648b712dab4a3e95571dda087dc02a), naming the packet files <S>/rep-soc3-words.md (6843 bytes, sha256 ac23d81d2e92884ce28df73b690456d6638e47f363f06d68c00951d246f8f1e9), <S>/so-318-c3-diff.patch (34065 bytes, sha256 213cb0f5a57fe16310bc141b5c1401900c6d7b8db703cf43da827fbb709fa35e), <S>/chk-318-c3.mjs (8953 bytes, sha256 045dc77cc0358203cde84e7f00efcda289f8e67f5a292b3d2ffa9d298134ed73), <S>/chk-318-c3.out (9878 bytes, sha256 ecc921b0bc70ae9d2656c72eaf5c0244a6854867660d990ea6936c84516215ef); the run 17:27:13Z to 17:36:08Z by its transcript, 45 calls (Read 23, Grep 20, Glob 1, SubagentHandback 1), one errored (a Grep that timed out after 20 seconds), no file written, model claude-opus-5-5; it has no shell, and each claim rests on its reads; below, the hand-back byte for byte (with one final newline, 12530 bytes, sha256 d050386863731c8070c1c4d290aaaca96ec137e3827d7c8948609964093efa4c). Nothing is changed. Its C-1 went to the advisor, and ADV-2026-11-14-19 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-19-318-c-1-stands-adr-036-amendment-2-two-spans-new-fence-c4-after-the-reviewer-d-1-to-lead-data-item-64-not-edited.md`) holds it; its check of C4 is a second part of this report (ADV-2026-11-14-20 item 8), filed when it hands back, with this gate's one gate-log row.)

Reviewed: PR #318 at dc0bd9374e8b268bd09718f01994a960b92acd4f, gate architect at C3 · cut/second-open-history-before-1c-step-3 @ dc0bd9374e8b268bd09718f01994a960b92acd4f
Verdict: PASS WITH NOTES

**HOLD on the merge check.** One clause of Amendment 2, which the advisor ruled, is untrue as written (C-1 below). Under ADV-2026-11-14-17 item 6 (d) it goes to the advisor before the merge check. The words are the advisor's ruled red-line text (an ADR amendment), so this cannot be a WORDS-ONLY pass (Part 1 item 2; AUTONOMY §31 (f)). The brief also says I may not overturn a ruling. For those reasons I do not fail the worker's work on it: the worker applied the ruling byte for byte. Everything else in K1 and C3 holds against the code at H3.

How I read: I read at H3 in `C:/dev/wt/so`. The branch ref `.git/refs/heads/cut/second-open-history-before-1c-step-3` is dc0bd937. I cannot check that the tree is clean, because I have no shell. I read main at a9c884ba in `C:/dev/spatial-ide`. I ran nothing. Every hash and count below is the reviewer's to recompute. Text in quotation marks is byte-copied from the file named. Where I write "my words", the words are mine.

## Findings

### Correctness (for the advisor, item 6 (d); not the worker's)

**C-1. ADR-036 Amendment 2, topic 4, last sentence (ADR at H3 `:293`).**
- The clause "At this piece no command reaches a save into a project whose record the run already holds" is untrue as written.
- The sentence's own third reason is a later save, which goes to the open's own project (`kernel/src/project/mod.rs:244`, `:247`). That project holds a record once the open has a recorded step: the move at `session_history.rs:358`, or a step after the bind at `:302` and `:313`.
- Ordinary use reaches this: open, filter, save, save again. The PR's own tests do it: N1 makes a second save after a step and gets Written, and so does K-S15 with B's second save.
- What the sentence means to say: no save *binds* an open to such a project. Its phrase is the case name used by item 5 (c) (1c form, Amendment 28, item 3). In an accepted ADR, read on its own, the phrase over-claims.
- To close it, the advisor rules on these words (my words; the original is the advisor's wording, not the human's):
  "At this piece no save binds an open to a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`), and binds the open only if an earlier save's record move failed, when that project holds no record (`StepRecorder::adopt_project`)."
- Each clause checked at H3:
  - "binds" only at `session_history.rs:363`, and only while `bound` is None (`:345-347`).
  - "mints": `mod.rs:251`.
  - "refuses a folder": `mod.rs:266-268`.
  - "a later save goes to the open's own project … catalog name": `mod.rs:244`, `:247`.
  - "only if an earlier save's record move failed": a completed save calls `history` (`mod.rs:316` → `:361`), which binds unless `copy_under` fails. A failure returns at `:352`, before `:363`.
  - "that project holds no record": a record held by `Project(P)` comes only from a move (`:358`) or from a step of an open bound to P (`:302`, `:313`). Only this open's saves reach P (`mod.rs:244`). A failed copy removes its folder (`:530-535`) and pushes no record.
- If the advisor changes the text, the merge check compares the ADR at the final head with the new ruling by script (item 10 (c)).

### Evidence
None. The CI rows at H3 rest on the custodian's read at 17:22:54Z. I did not re-read CI. The worker ran `cargo test --workspace --locked` at K1 (rc 0, 1077 passed). C3 changes only `.md` files. No Rust test and no CI workflow reads `KNOWN-LIMITATIONS.md` or ADR-036 (my search of `*.rs`, `*.ts`, `*.mjs` and `*.yml`).

### Documentation (must fix before the merge)

**D-1. `kernel/README.md:395` still lists item 63.** It reads "KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62, 63". Item 63 no longer exists at H3 (`KNOWN-LIMITATIONS.md:503-507`). It was the only other in-tree reference to the item I found in `kernel/`, `docs/` and `frontends/shell/src`.
- The file is outside §2.5, which says "no other kernel/ file". §2.6 makes the kernel owner's index lines lead-data's update after the merge.
- The fix before the merge: the closing amendment names this line for that update.
- Replacement (my words; not the human's): "- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62". Clause check: every number but 63 is unchanged, and 63 was withdrawn at C3 (item 5 (b)).

### Observations
- **O1. How strong the script's byte checks are.**
  - A proves only that each words-file key occurs once in its source. B and C then prove that H3 equals those keys. Neither proves that a key is the whole ruled block.
  - I closed the gap by reading. The ADR at H3, `:283-293`, equals ruling `:56-66` line for line, and the file ends there. Item 43's line at `:436` ends with the ruling's `:30` span, and main's `:436` ends with ruling `:24`.
  - A later script should anchor each key to its fence.
- **O2. Script H's header.** It says "the first "..." on each of those lines". For (d), the code takes the first quote after `: ` (correctly, because the first quote on that line is "Not covered"). Only the header's wording is off.
- **O3. Script F** does not limit K1's SKP-V0.md change to the four spans. The packet patch shows two hunks (`:1147` and `:1351`). I read both at H3 (`:1150-1156`, `:1354`). The reviewer's `git diff` confirms it.
- **O4. Topic 1: "that record is made at the holder's first step".** For a moved record I read this as true. The record is one object whose `holder` changes at the move (`:353-358`), and it was made at its first holder's first step. No change asked.
- **O5. A failed removal of the old folder after a move** (`:359-361`, `let _`) leaves that folder. `end_session` then removes only the new `dir` (`:406-410`). This is outside ordinary use (an I/O failure), and it predates this piece. It is not in the item 43 comment's list. It goes to round 77 if wanted.

## Checks

1. **Item 3.** Holds.
   - `KNOWN-LIMITATIONS.md:436` at H3 equals main's `:436` up to "It holds the filter text …". Main's old span is its line end. The new span, to the end of the line, is the ruling's `:30` (script A and B OK; I also read it).
   - Each clause holds:
     - ceiling per file: `:48`, `:77-90`, `:105-106`;
     - one file per open with a change: `:141-149`, `:308-316`, `mod.rs:244`;
     - a second open has its own file: `Holder::Open(name)` `:146`, and `create` is called only at `:313`;
     - no limit: the pushes at `:174` and `:313` are unbounded.
2. **Item 7.** Holds.
   - Amendment 2 is appended once after Amendment 1, with one blank line (`:282`) before its heading (`:283`).
   - Its text is the ruling's block (script C, and O1).
   - Nothing else changed: K1's ADR equals B2's; main's ADR ends at `:281`, as B2's does.
   - Append only. The header and Status are untouched.
3. **Item 6 (d), the clause check.** All hold except C-1.
   - Preamble: 1c form `:1870`, `:1874` record OPEN-N1 to N4 as stated. §2.6 exists.
   - Topic 1: `:122-149`, `:308-316`. The name is never written: `header_object` `:607-621`, `prepare(ds, intent)` `:648`, step `data` `:319-322`, locations `:467-475`. The old key is form §2.1's byte-copied lookup.
   - Topic 2:
     - bind-once: `:345-347`, `:363`;
     - the move: `:349-361`;
     - no record when none: `:349`, then `:313`;
     - `<record>` is 32 hex: `:445` and `mod.rs:69-71`, `:93-96`;
     - header `project`: `:609`;
     - a failed move leaves the open unbound: `:352` returns before `:363`, then retried through `mod.rs:244-247`, `:316`, `:361`.
   - Topic 3: minting at `:170-181` through `:301` or `:274-277`/`mod.rs:253`; the header and `data.dataset` at `:304`, `:320`; the project file at `mod.rs:247`, `:277-281`; the §4 quote matches ADR `:72`.
   - Topic 4: one caller, `mod.rs:361` (my search of `*.rs`: the only other mention is a doc comment at `kernel/tests/project_save.rs:561`); `history` is called at `mod.rs:316`. Its last sentence is C-1.
   - Symbols at H3:
     - `Holder` `:125`; `Open::holder` `:143`; `State::open` `:170`;
     - `StepRecorder::dataset_uri` `:274`, `record_step` `:284`, `adopt_project` `:343`, `create` `:432`;
     - `Projects::save` `mod.rs:236`, `Projects::history` `mod.rs:357`.
4. **Item 4.** Holds.
   - (a): `:437` carries the ruled phrase.
   - (b): `:438` opens with the attribution, and DRAFT is gone.
   - (c): the corrected sentence is there, and the reason after the colon stays.
   - (d): both cases are added. They are true at `:352`/`:363` and `:526`/`:359-361`.
   - (e): the worker chose the records half: "no line bounds how many records a run has". `records.len()` is used only at `:314`, and the only push is at `:313`. It is true, and it is within the `:300-316` pin.
   - Every pin parenthetical is true at H3, apart from O5's pre-existing gap.
5. **Item 5 (b).** Holds.
   - The hunks are `-507,4 +506,0`: heading, body, comment and the blank line after it. One blank line is left at `:506`.
   - 63 is not reused.
   - Item 64 is untouched.
   - Otherwise only `-436,3 +436,3` (script D, and the patch).
6. **Item 9.** All 10 pins recompute at C1 and are byte-equal at H3 (script E).
   - K1's only change in `session_history.rs` is the 1-for-1 change at `:186`, outside every range. `mod.rs` holds no item 43 pin.
   - This meets my B2 condition as item 9 reshapes it. It must be re-shown at the final head. The merge must be a merge commit (Amendment 1, item 2), because a squash or rebase voids the C1 pins.
7. **Commit 1.** Holds.
   - W5 is at SKP `:1354` and equals item 8 (a). W6 is at `:1150`, `:1152`, `:1154` and equals my B2 D4; `:1155-1156` are unchanged. W8 is at `mod.rs:232-235`. W9 is at `:186` (scripts A and F).
   - Each is true:
     - W5: `:313`, `:363`, `:380-381`;
     - W6: `:381-389`, `mod.rs:368-369`, and form §2.1;
     - W8: holder per open; P2 is freshly minted (`mod.rs:251`);
     - W9: `reached` is a `Record` field (`:159`), noted at `:330` and read at `:387`.
   - K1 changes only doc lines (script F: 5 and 2 `///` lines). `SKP_VERSION` is "skp/0.13" (`protocol/skp/src/v0/mod.rs:123`).
8. **Accepted ADRs and Part 1.**
   - ADRs: no other accepted text is made untrue. ADR-036 §4 `:72` is qualified by topic 3, and §6, §9 and Amendment 1 item 5 hold. ADR-006 class 2 is unchanged.
   - Part 1:
     - item 1: every sentence was written from the built code;
     - item 2: C-1 is excluded as red-line text;
     - items 3 and 4: K1's suite ran; no test changed;
     - items 6 and 7: no test seam touched.
     - Nothing breaks Part 1.
9. **Item 64's comment.** "the number is the next after item 63" (`:508`) is still true at H3 as the number's history: 63 is withdrawn, not reused. It has no class. A pointer to the withdrawal, if wanted, is a later edit (item 5 (b)).
10. **What the closing amendment must carry.**
    - D8: `budget overrun, §7 not edited`; the declared figure; the final figure at the last head by §21c (the worker gives 722 over the 7 code, test and protocol files at H3, for the reviewer to recompute, with the 4 record files classified); the reason; class 8 under ADV-2026-11-14-16.
    - W10, its cite checked against main.
    - Item 63's withdrawal as ADV-2026-11-14-17's (item 5 (c)).
    - The advisor's answer on C-1.
    - Item 9 shown at the final head, and the merge-commit condition.
    - D-1, for lead-data's index update.
    - The PR body lists W5, W6, W8 and W9 and item 4's comments as §31 (d) words, with item 4 (e)'s choice.
    - The worker's four departures, for round 77.
    - **The script:** its checks are the ones item 10 (b) names (bytes: A, B, C; item 9: E; item 63 gone and nothing else changed: D), plus F, G and H. It never over-claims its header except O2. Its gaps are O1 and O3. The clause check of item 6 (d) is this report's, not the script's.

No ADR skeleton needed.

Files:
- `C:/dev/wt/so/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`
- `C:/dev/wt/so/KNOWN-LIMITATIONS.md`
- `C:/dev/wt/so/kernel/src/session_history.rs`
- `C:/dev/wt/so/kernel/src/project/mod.rs`
- `C:/dev/wt/so/protocol/skp/SKP-V0.md`
- `C:/dev/wt/so/kernel/README.md`
- `<S>/chk-318-c3.mjs`, `<S>/chk-318-c3.out`, `<S>/so-318-c3-diff.patch`, `<S>/rep-soc3-words.md`
