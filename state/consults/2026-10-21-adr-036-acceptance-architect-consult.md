*Custodian's filing note (2026-10-21): the architect's one consult on ADR-036's readiness for acceptance (the human's placements message, item 2), read at main 54d07268. Checked by script there: line 71 holds the sentence it names; line 3 is the Proposed status line; the .spatial check is named only as owed (the 2026-10-09 rulings; piece 1c's PLAN summary, "Owed before acceptance"), with no record of it done. The run 2026-10-21T04:43:45Z to 04:47:11Z by its transcript (Read 13, Grep 14); its one SubagentHandback call, at 04:47:10Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 31a419b2deeb8a013f345483a5f3ba7fdb6bb6e1ec67d5270935bb9053eaeef0.*

---

Consulted: ADR-036's readiness for acceptance, at main 54d07268 (main @ 54d072687e79f8cb9a77ca942aa6809dad4e326b)

**Answer:** The human's two conditions are met: blocks H to K are in the merged text as approved, with provenance, and both checks (R1, R2) are satisfied. The text as a whole is **not ready** for acceptance. One sentence claims a guarantee that does not hold (line 71). A check the human required before acceptance is not on record (.spatial). Accepting first would also make binding three passages that the human's rulings of 2026-10-09 replaced, and the ADR's own version rule would then turn their routed fixes into a version step. That last point is a choice for the human, not a defect in blocks H to K.

This is a consult, not a gate. I have no shell, so no cite below carries a sha256; the custodian fills them by script. Every cite reads at main 54d07268.

**1. Blocks H to K**
- **Block H: present as approved.**
  - The §6 `dependencies` cell, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:114`, matches the offered wording with `provenance`, as the human ruled (the 2026-10-14 directive, item 3, which replaces Block H's substring edit). It reads `"crs":{"identifier","provenance","definition"}`.
  - H's list, `:119-123`, matches the draft at `state/consults/2026-10-14-b2-1b-open-9-blocks-architect-draft.md:28-32` with no difference.
- **Block I: present, with the one change.** `:124` is the draft's `:63` with `source` replaced by `provenance` and no other difference. The code uses the same word: `kernel/src/session_history.rs:595` checks the three words and `:1283` writes the key `provenance`.
- **Block J: present as approved.**
  - `:199-201` matches draft `:86-88`. It is inserted after the bullet `- **Persisted feature ids.**` at `:198`.
  - The `scope` row at `:116` reads `A selection scope is reserved (§11, Reserved by name).`, which matches draft `:90`.
- **Block K: present as approved.** At `:139` it follows `in B2 the target is the project's one layer.` after one space, and matches draft `:107` with no difference. Block B's sentence comes before it, so B was applied before K.
- **Block 0 (outside H to K):** `:5` says `definition and provenance` where the draft's replacement line (`:136`) says `definition and source`. This applies the human's one-word change, and the 1b form's Amendment 2, item 3 (`kernel/B2-1B-RECORDING-PREREGISTRATION.md:763`) told the human. It is not a bar.

**2. The two checks**
- **R1:** met.
  - The smallest change it named is in: a definition hash over named bytes (`:121`), a named state where there is no definition (`:122`), and the identifier kept as a label only (`:120`).
  - The check's "assertion without a definition" case is handled by refusal at open, per the draft's finding (`state/consults/2026-10-14-b2-1b-open-9-blocks-architect-draft.md:16`). I did not re-read that code.
  - The R8 sub-item is met at `:124`, and R9 for step parameters at `:139`.
  - Nothing here stands against acceptance.
- **R2:** met. The epoch is reserved by name, and adding it is a planned version step (`:201`). The optional stronger form (a member in version 1) was not taken, and the check made it optional. The check's Documentation item, the selection-scope pointer, is fixed at `:116`. Nothing here stands against acceptance.

**3. Other things in the text that stand against acceptance now**
- **Correctness: an untrue guarantee claim.**
  - `:71` keeps "so that each path inside the folder has one spelling on every operating system". This is not true: case on NTFS and APFS, and Unicode normalisation on macOS, give one file two canonical texts (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:117`, "it must be corrected before acceptance").
  - The human ruled it corrected (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:24`).
  - The ruled widening also changes code: the reader at `kernel/src/dataset_ref.rs:544-552` does not refuse device names, a trailing dot or space, or control characters. So the fix is not only words, and since ADR amendment text keeps the human's typed words, I draft none.
  - The human's route puts the fix in 1c's amendment. Accepting first would bind the false sentence until that amendment lands.
- **Evidence: the .spatial check is not on record.** Ruling 2 says "Before acceptance, check that no common application claims .spatial." (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:10`). My Grep of the repository found it only there and in `PLAN.yaml:5323`. The custodian should confirm that absence by script. Meanwhile `:25` still reads "settled at acceptance".
- **Text the human has ruled against, which acceptance would bind.** These belong to 1c's amendment by the human's route (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:30`), so they are listed as 1c's. Acceptance first changes how that amendment lands:
  - `:80` follows links and opens a target that resolves inside the folder; ruling 1 (`:8` of the same directive) refuses every link and junction below the folder.
  - `:55` asks the copy-or-same question whenever "the first folder still exists"; ruling 8 (`:22`, restated at `:39-40`) asks only when the first folder holds a project with this identity.
  - `:31-32` puts the project file in the canonical subset, which is one line (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:174`); the human ruled a line-oriented form (directive `:29`).
- **What follows from acceptance.**
  - An accepted ADR is changed only by appended amendment, so lines `:25`, `:31-32`, `:55`, `:71` and `:80` stay as written and are superseded rather than edited.
  - `:42` binds "a change of shape increments the version". The 2026-10-12 check applied that rule to post-acceptance changes (`state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md:18`). On the same reading, the line-oriented form, ruling 4's lineage sha256 and step count member, and ruling 9's stricter reader become version 2.
  - The human chooses one of three routes:
    - (i) a pre-acceptance block for these rulings, as 1b's §2.7 did for H to K;
    - (ii) acceptance words that keep version 1 open to 1c's amendment;
    - (iii) the 2026-10-09 timing ("together with piece 1c's amendments").
- **1c's amendment owes these in any case. They are not bars:**
  - the `workspace` member and its R9 check (`:192`; `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md:33`, which the human approved as direction on 2026-10-12; the 2026-10-21 timing moves this check out of the acceptance);
  - the different-saves detection (`:170`, ruling 4);
  - the N-9 items (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:153-157`). `kernel/src/dataset_ref.rs:360,366` still writes `byte_size` and `footer_length` as JSON integers against `:36`, and `:487` still refuses the Snapshot column that `:65-68` defines in version 1.
- **Documentation, to fix with the acceptance commit:**
  - `:192` ("accepted together with it") and `:3` ("Acceptance is due before piece 1c ... merges") describe a timing the 2026-10-21 ruling replaced.
  - `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:74` says "ADR-036 defines (Proposed)". ADR-022 is accepted, so this stays as history and is not edited.

**4. What acceptance changes in the file**
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3`, as it stands:
  `**Status:** Proposed. **It binds nothing until the human accepts it.** Acceptance is due before piece 1c (`b2-piece-1c-save-and-reopen`) merges, the first piece that writes a file that a later version or another person reads. It is not architect-blockable until accepted.`
- The generated index row `docs/README.md:73`, which repeats that Status text, is regenerated.
- `:25`, as it stands, says the name is "settled at acceptance":
  `> **OPEN, until the human accepts this ADR: the project file's name and extension.** The draft named it `project.spatial.json`. A file ending in `.json` cannot open the application by double-click, so the name and the extension are settled at acceptance.`
  The acceptance either settles it (ruling 2 names `project.spatial`) or says it stays with 1c.
- I do not draft the human's words.

**ADR skeleton (a missing decision, for the human; not acceptance text)**
- **Context:** the human's 2026-10-21 item 2 accepts ADR-036 before piece 1c. The 2026-10-09 rulings 1, 2, 4, 8 and 9, and the line-oriented form, are routed to 1c's amendment. Once ADR-036 is accepted, `:42` reads a shape change as a version step.
- **Decision (the human's, one of):** apply the rulings as a pre-acceptance block; accept, naming version 1 as still open to 1c's amendment; or accept with 1c.
- **Consequences:** the first avoids version 2 and the false sentence at `:71`. The second binds `:55`, `:71` and `:80` until 1c's amendment lands. The third keeps the 2026-10-09 order and gives up 2026-10-21's "before its code".

Files read: `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`; `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md`; `state/consults/2026-10-14-b2-1b-open-9-blocks-architect-draft.md`; `state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md`; `state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md`; `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md`; `state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md`; `state/directives/2026-10-09-adr-036-ten-findings-rulings.md`; `state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:100-177`; `kernel/B2-1B-RECORDING-PREREGISTRATION.md:745-804`; `PLAN.yaml:5308-5324`; and, by Grep or Read, `kernel/src/dataset_ref.rs`, `kernel/src/session_history.rs`, `docs/README.md`, `docs/adr/ADR-022-style-v0-as-the-single-style-model.md` and `.git/refs/heads/main`.
