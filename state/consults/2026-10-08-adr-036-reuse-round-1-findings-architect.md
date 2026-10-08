*Custodian's filing note (2026-10-08): the architect's consult on the reuse round 1 report's section 1, "ADR-036", as findings for the human's acceptance sight of ADR-036, under item 2 of the reuse round 1 direction (run 16:50:14Z to 16:55:32Z by its transcript; write audit PASS, zero writes). Not a gate and not a ruling. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is e2ada85b1af6cc2b15d9e4ca73383eca482f9945d44933432dbb6e52fae4c78d. The report it reads is in PR #192 (`reuse/`, head 2ae29e9d), not yet on main.*

---

# ADR-036 — reuse round 1 findings, for the human's acceptance sight (architect consult)

**What I read:** main @ 966a298569d9eab838571c17ea170f6d3bb09ec8, and the report on cut/reuse-round-1-bundle @ 2ae29e9dff327a25984acbf39a2c3bd19ad7f914 (PR #192, not merged). **Verdict:** none. This is a consult, not a gate.

**Sources.**
- The report: `reuse/REUSE-ROUND-1.md:16-47` @ 2ae29e9d, plus `reuse/notes/n1-files.md`, `reuse/notes/n1-model.md`, and the `decisions_for_human` entries in `reuse/reuse-index.json` for the ADR-036 capabilities.
- The ADR: `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` on main.
- The rulings: rounds 69 and 70 and Decisions A to C (directive files and RULED blocks).
- Piece 1a's form, Amendments 1 to 7.
- My #190 gate reports (attempts 1 and 2), the reviewer's attempt-1 report, and my Amendment 5 draft's notes.
- The PLAN nodes `b2-piece-1b-recording` and `b2-piece-1c-save-and-reopen`.
- At main I checked: `kernel/src/dataset_ref.rs` (header, constants, bounds), `renderer/src/canonical.rs`, the `serde_json` version in `Cargo.lock`, the features in every `Cargo.toml`, the engine's by-path opens and `tauri.conf.json`.

**What I could not check without a shell:**
- Every third-party claim: the DuckDB share flags, cap-std, Go, serde_json's float parsing, the Tauri bundler, Windows and macOS extension rules, and tempfile.
- Any hash.

What I say about those claims rests on the notes alone. The report quotes nothing of the human's. Nothing below is quoted. Everything is paraphrase.

## Findings

### 1. §5 containment is the racy pattern (`reuse/REUSE-ROUND-1.md:20-24` @ 2ae29e9d)
- **Bears on:** ADR-036 §5, the Containment paragraph (lines 77-81). **Format change:** none. The fields stay. The resolver semantics the text states change.
- **Holds?** Partly.
  - Line 81 already requires 1c's form to state how the target that is checked is the target that is opened. The 1c PLAN node carries that requirement. So the race is already acknowledged and routed, not missed.
  - The finding is right on the semantics. Line 79 says the resolver follows every link and junction and opens if the resolved path is inside. That admits an absolute link or junction that points back inside the folder. The race-free designs refuse such a link (n1-files §3.1, §3.3, §4.1(b)). Under either option, line 79 would describe a resolver 1c cannot build race-free.
  - Verified at main: the engine opens by path (`engine/src/descriptor.rs:103` and `:122`, `std::fs::metadata` / `File::open`; `read_parquet(?)` in `engine/src/dataset.rs`). The DuckDB `CreateFileW` share flags and the pin-by-held-handle argument are unverified inference, and the note says so (n1-files §6).
  - Untested risk on the reference machine: OneDrive placeholders under a no-reparse open (n1-files §4.1(g)). That bears on whether option B refuses ordinary user files.
- **Conflicts:**
  - The carrying rule (round 70, OPEN-7, a red line) says a project-relative locator is carried where the data is inside. If "inside" is judged by a resolver that refuses inward junctions, data reached through one gets only `machine-recorded`. That departs from the ruled rule for that case, so it is the human's.
  - It does not conflict with docs/01 or with 1a's code. 1a has no resolver (N-10).
- **Question:** Inside the project folder, does the resolver follow relative links that stay inside, or refuse every link? Refusing junctions under either choice means some inside data carries no project-relative locator.

### 2. §1 OPEN: the project file name (`reuse/REUSE-ROUND-1.md:25-28` @ 2ae29e9d)
- **Bears on:** ADR-036 §1, the OPEN block (line 24) and the tree (line 19). **Format change:** yes, the name and the folder layout.
- **Holds?** It agrees with the human's own premise, which line 24 records.
  - That `.spatial.json` resolves as `.json` is inference, from Wine's source and Apple's documentation. Nothing was tested on either OS (n1-model §3.1, §6).
  - That the candidate extension collides with no common application is unchecked.
  - At main, `tauri.conf.json` has no `fileAssociations` and targets NSIS only (lines 27, 37), as the note says.
- **Conflicts:**
  - None with a ruling. Round 69, item 1's third addition reserves this to acceptance.
  - Single instance is a new dependency, the human's typed word (`state/directives/2026-10-08-reuse-round-1.md`, its last line). An earlier shell form excluded it as a scope addition (n1-model §1).
  - Two processes holding one project identity is a case no ruling covers. Round 70, OPEN-2 is about two folders, not two processes.
- **Question:** Which fixed single-segment name and extension does the project file take? And does a second double-click open a second process, or reach the first through a single-instance dependency?

### 3. §9 torn writes (`reuse/REUSE-ROUND-1.md:29-30` @ 2ae29e9d)
- **Bears on:** ADR-036 §9, the "After a crash" bullet (line 158). **Format change:** none as proposed. The alternative in n1-files §4.3, a per-line check member, would be one.
- **Holds?** Yes, as inference from the cited projects' code (etcd zero sectors, SQLite SAFE_APPEND, RocksDB point-in-time recovery).
  - A raw NUL byte never appears in canonical output, which escapes control characters (`renderer/src/canonical.rs:28-30`). So "no NUL" is a sound test.
  - **Defect in the proposed rule** (n1-files §4.3, paraphrase): it requires each step's `parent` to be the previous kept step's id. After a `restored` mark (§6, line 120), the next step's parent is the mark's `to`. A valid history after a restore would then be cut. The chain rule must follow `restored` marks.
- **Conflicts:**
  - Round 69, item 1 adopted the format as drafted, §9 included, so changing this sentence is the human's at acceptance.
  - It fits the brief's "a crash loses nothing" only if 1b syncs on every append (the 1b PLAN node: safe against a crash).
- **Question:** Does session-history recovery keep the longest valid prefix, with the chain followed through restore marks, instead of every complete line?

### 4. §8 files from different saves (`reuse/REUSE-ROUND-1.md:31` @ 2ae29e9d)
- **Bears on:** ADR-036 §8, "How it is written" (line 148), and §11 (lines 168, 172). **Format change:** yes, a new project-file member. Option B in n1-files §4.4 would also add a member to the steps header's closed `lineage` properties.
- **Holds?** Partly.
  - The members it would add must be fixed in version 1.
  - Its urgency is overstated for the project file. ADR-036 never lists the project file's top-level members (only `format`, `version`, the identity, dataset entries and `workspace`). §11 leaves `workspace` to 1c's amendment, accepted with the ADR. The project file's version-1 key set is therefore not closed yet.
  - The report states option A as a fact. It is the notes' recommendation.
- **Conflicts:** none. Round 69, item 1's second addition gives the mechanism to piece 1c's amendment. Adopting A means 1c's amendment proposes it.
- **Question:** Is ADR-036 accepted only together with 1c's amendments (the `workspace` member and the different-saves detection)? Or is the detection member settled now?

### 5. §6 collapse key (`reuse/REUSE-ROUND-1.md:32-36` @ 2ae29e9d)
- **Bears on:** ADR-036 §6, "The action registry" (line 131). **Format change:** no field. It changes the registry contract and the compaction semantics, and so what a lineage file holds.
- **Holds?** Yes as design reasoning (Qt, QGIS, Kafka, concepts only).
  - A target component costs nothing in B2. A project has one dataset (§11, line 177), so the target is implicit until projects with several datasets arrive.
- **Conflicts:**
  - Adjacent-only merging narrows the brief's compaction sentence (`state/directives/B2-BRIEF-2026-10-07.md:52`). That sentence collapses repeated edits of one property with no adjacency condition, and the brief is human-adopted. Five colour tries with a filter step between them would no longer collapse to one.
  - Never merging across `saved-here` fits the brief's "new steps … are added" (line 52).
  - Round 69, item 1 adopted §6 as drafted.
- **Question:** Do only adjacent steps with equal keys collapse, so that edits separated by another step stay distinct, or does the brief's wider collapse stand?

### 6. §3 forward compatibility (`reuse/REUSE-ROUND-1.md:37` @ 2ae29e9d)
- **Bears on:** ADR-036 §3 (line 42) and §2 (line 33). **Format change:** yes, a version rule. No field changes.
- **Holds?** Yes. The ADR as written is internally under-specified:
  - §2 refuses an unknown key;
  - §3 requires a step from a later vocabulary to be shown and never dropped;
  - a reader cannot validate the parameters of an action it does not know against a closed shape.
  The finding names the one open slot and binds writers to carry the step unchanged. Both needs are real.
- **Conflicts:**
  - It is consistent with docs/01, principle 8.
  - It touches round 69, item 1's as-drafted adoption, so it is the human's at acceptance.
  - It overlaps my N-2 (below): the Snapshot column is a shape that 1a's reader refuses as "not read by this version".
- **Question:** Is `intent.params` of an unregistered action under a newer `actions` value the only opaque slot, with that step kept unchanged on rewrite and never merged, and everything else needing a `version` increment?

### 7. §2 duplicate keys (`reuse/REUSE-ROUND-1.md:38` @ 2ae29e9d)
- **Bears on:** ADR-036 §2, "Closed key sets" (line 33). **Format change:** none. This is 1c's reader implementation.
- **Holds?** Yes, at main.
  - `kernel/src/dataset_ref.rs:19-20` says `parse` takes a `Value` that has collapsed duplicates, and that 1c's file reader must refuse them.
  - `renderer/src/canonical.rs` has no parse function. Its `pub fn`s are the writer, the hash and `write_double`.
  - `Cargo.lock:1744-1745` locks `serde_json` 1.0.151.
  - No `Cargo.toml` enables `float_roundtrip`.
  - The one-ULP risk is the note's inference and is untested.
  - Also unenforced today: the key order that §5 requires (line 60) cannot be checked through a `Value` either.
- **Conflicts:**
  - None with a ruling.
  - Enabling `float_roundtrip` unifies the feature across the workspace, so it changes float parsing for every `serde_json` user, `renderer/src/style.rs` included. That is a change to an existing dependency, so I would raise it with the human, not decide it.
- **Question:** Does 1c's strict reader parse number tokens with the canonical module's own grammar, or does the workspace enable `serde_json`'s `float_roundtrip`?

### 8. §4 identity, Godot's rule (`reuse/REUSE-ROUND-1.md:39-41` @ 2ae29e9d)
- **Bears on:** ADR-036 §4, the "A project opened from a second folder" bullet (line 54). **Format change:** none. Behaviour only.
- **Holds?** Partly.
  - Godot uses the same existence test, but it never asks. It re-keys silently (n1-model §3.3). "The same rule" is true only of the discriminator.
  - "New identity to the newly opened folder" matches the natural reading of the ruling.
  - "Re-read the identity in the old folder" changes the ruled condition. That is the note's own inference, with no project found doing it.
- **Conflicts:** **red line.** Line 54 is round 70, OPEN-2, typed by the human. Its move rule turns on whether the first folder still exists. Re-reading the identity there would treat a folder that still exists but holds another project, or none, as a move, with nothing asked. Only the human can change that.
- **Question:** When the first folder still exists but no longer holds this project, is it a move (nothing asked) or a copy (asked once)?

### 9. §5 "one spelling" is overstated (`reuse/REUSE-ROUND-1.md:42` @ 2ae29e9d)
- **Bears on:** ADR-036 §5, the `project-relative` bullet (line 70) and the Containment paragraph (line 79). **Format change:** yes if device names and trailing dots or spaces join canonical form, because the reader would then refuse more. Narrowing the sentence alone is wording only.
- **Holds?** Yes on the overclaim, and I drafted that sentence (Amendment 5, item 1(a)). Two canonical texts can name one file: case on NTFS and APFS, and Unicode normalisation on macOS. So "one spelling on every operating system" is not true as written. It binds nothing while Proposed, but it must be corrected before acceptance.
- **The new argument** (n1-files §4.1(d)), which my Amendment 5, item 2 did not weigh:
  - a handle-relative resolver applies no Win32 name rewriting;
  - DuckDB's by-path open does;
  - so for a trailing-dot name the checked target and the opened target can differ.
  This is inference and was not run. If it holds, Amendment 5 item 2's reason for keeping such names out of the text rule ("containment refuses them on the resolved target") fails for a handle-walk resolver.
- **Conflicts:**
  - Amendment 5, item 2 (the canonical-form list does not grow) is my drafting, not a ruling. The human can overrule it.
  - Widening canonical form enlarges the inside data that has no canonical spelling. That is the open item already routed to 1c's form (the 1c PLAN node), which departs from the round 70, OPEN-7 carrying rule, a red line.
- **Question:** Does canonical form also refuse reserved device names, segments ending in a dot or a space, and control characters, accepting that more inside data then carries only `machine-recorded`?

### 10. Atomic save (`reuse/REUSE-ROUND-1.md:43-46` @ 2ae29e9d)
- **Bears on:** ADR-036 §8, "How it is written" (line 148). **Format change:** none.
- **Holds?** The flush-before-rename and bounded-retry pattern is well supported in the notes. The OS claims (MoveFileExW, `tempfile`, `ReplaceFileW`) are unverified here, and the "about 60 lines" is an estimate. Two consequences:
  - A retry ceiling is a declared limit. Any timing claimed for it later needs a docs/08 measurement.
  - A temp file left by a crash sits in the folder. §1 (line 26) already says nothing else belongs to the format, so readers ignore it.
- **Conflicts:** none. It is 1c's implementation, not ADR text.
- **Question:** none for acceptance. It belongs in 1c's form.

## Table

| Finding | ADR-036 section | Format change | Conflicts | Question |
|---|---|---|---|---|
| 1 containment race | §5 Containment | no (semantics) | round 70 OPEN-7 carrying rule (red line), on the link rule | follow inside links, or refuse every link? |
| 2 file name | §1 OPEN | yes (name, layout) | none; single instance is a dependency ruling | which name and extension; one process or two? |
| 3 torn writes | §9 | no (yes if per-line check) | round 69 item 1 (as drafted); rule must follow restore marks | longest valid chained prefix? |
| 4 different saves | §8, §11 | yes (project-file member) | none; round 69 item 1 routes it to 1c | accept only with 1c's amendments? |
| 5 collapse key | §6 registry | no (registry and compaction semantics) | the brief's compaction sentence (line 52); round 69 item 1 | adjacent-only collapse? |
| 6 forward compat | §3, §2 | yes (version rule) | round 69 item 1 | is `intent.params` the only open slot? |
| 7 duplicate keys | §2 | no | none; `float_roundtrip` is workspace-wide | own number parser, or enable `float_roundtrip`? |
| 8 identity | §4 OPEN-2 bullet | no | round 70 OPEN-2 (red line) | first folder exists but holds another project: a move or a copy? |
| 9 one spelling | §5 | yes if the text rule widens | Amendment 5 item 2 (mine); OPEN-7 carrying rule (red line) | widen canonical form? |
| 10 atomic save | §8 | no | none | none (1c's form) |

## My N-9 acceptance items, still open at main

- **Reader ceilings not stated in the ADR** (attempt-1 N-3): 8 locators and 4,096 bytes per string (`kernel/src/dataset_ref.rs:44-45`), plus the bounds named in my Amendment 5 draft's notes. §2, line 37 states no numbers. Overlaps finding 7, and finding 3, whose "parse and validate" step needs the bounds.
- **The Snapshot column's version** (attempt-1 N-2): §5's table defines it in version 1, but 1a's reader refuses it as not read by this version (`kernel/src/dataset_ref.rs:478`). Overlaps finding 6.
- **Integers above 2^53 − 1** (the reviewer's attempt-1 S2): `byte_size` and `footer_length` are written as JSON integers and refused above that bound (`kernel/src/dataset_ref.rs:462`), while §2, line 35 says such integers are written as decimal strings. Overlaps finding 7.
- **N-10:** the module's docs say containment is checked by 1c's resolver. Findings 1 and 9 decide what that resolver checks, so 1c's form must make the doc true.
- **Also from my Amendment 5 draft's notes:** which locators the lineage header carries. It is carried by the 1c PLAN node. No finding touches it.

## Out of date at main, or already routed

- `reuse/REUSE-ROUND-1.md:3` @ 2ae29e9d calls PR #190 open. It merged at 3e754dfc (Amendment 7). ADR-036 is on main, still Proposed. The heading's acceptance timing (line 16) is still current.
- The ADR line numbers in n1-files §1 are pinned at 14acee0b. ADR-036 is unchanged from there to main (Amendment 7, item 1), and lines 70, 77-81, 148, 153, 158 and 183 match main. The `PLAN.yaml:4434-4449 @ 14acee0b` pin is historical: the 1c node is now at 4579-4595. The pin, not the tree, is what the note relied on.
- The master table and the index name `b2-piece-1a-step-record-and-dataset-reference` as need-by for:
  - `cross-file-save-consistency`, `reserved-filename-checks`, `format-forward-compatibility`, `stable-identity-copy-move`, `strict-json-reader` and `undo-merge-collapse-keys` (`reuse/REUSE-ROUND-1.md:198-227` @ 2ae29e9d).

  That node is done. These needs now fall on ADR-036's acceptance, 1b or 1c.
- Two findings present as new what is already routed:
  - finding 1's how-checked-is-opened is in ADR-036 line 81 and the 1c node;
  - finding 4's detection is round 69, item 1's addition, in ADR-036 lines 148 and 172.
- Finding 7's "every reader parses through `Value`" is still current at main.

## Also in the cited notes, outside the subsection

- **One-line project file against docs/01** (n1-model §3.7). The canonical writer emits no whitespace (`renderer/src/canonical.rs:23`), so the whole project file is one line. docs/01's derived rule "Plain text everywhere" asks for diffable, gittable text, and a git diff of a one-line file shows the whole file changed. docs/01 outranks ADR-036 (lower number wins). If a line-oriented canonical form is wanted, that is a version-1 encoding decision. My question: does the project file's canonical form stay one line?
- **The route for acceptance edits.** Piece 1a is closed. The edits that findings 2, 3, 5, 6 and 9 would make need an appended amendment carried by some piece: 1c's ADR amendment or a separate acceptance piece. The human places it. Draft ADR text is outside this consult.
- **For the custodian, under directive item 1, not this consult:** `reuse/notes/n1-model.md:3` @ 2ae29e9d names the advisor's home-relative workspace path. Item 1 requires checking the bundle for user-profile paths, and this line should be judged there.
