*Custodian's filing note (2026-10-08): the architect's draft of `b2-piece-1a-step-record-and-dataset-reference`'s Amendment 5, correcting gate 1's C-1 and C-2 (run 06:03:49Z to 06:08:44Z by its transcript; write audit PASS, zero writes). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 7d40c038deab044daaf7cd86e61b9564a27b97d7f4ea218ceb3cb8a2c53b1a1a. The form's Amendment 5 is this file's lines 9 to 116 (the draft's lines 5 to 112), byte for byte, after one blank line. The notes after the second rule are the architect's to the custodian, routed to piece 1c's PLAN node.*

---

Draft only: the custodian appends it as Amendment 5 (class 5). Branch and commit read: cut/b2-piece-1a-step-record-and-dataset-reference @ a3f9f34f58d285cbcb20853f10f93df5591b514d (the worktree `C:/dev/wt/1a`). I had no shell, so the reviewer recomputes every hash and the §7 count. Below the rule is the amendment text. After it come notes for the custodian and the list of files I read.

---

### Amendment 5 — gate 1's C-1 and C-2 corrected: OPEN-7's carrying rule and containment, and the named state's free-text basis (class 5)

*Written after gate 1's results were seen (the architect's report `state/consults/gates/2026-10-08-b2-piece-1a-step-record-and-dataset-reference-gate1-architect.md`, findings C-1 and C-2; gate-log 437), at the branch head a3f9f34f, before any code of the fix. Drafted by the architect and appended by the custodian. It touches ADR-036 §5, K-1's parser, R7's name, K1, and one new test, R8. It invalidates one observation: R7's mutation, observed at 1e637d55, is observed again at the fix head because the function it mutates is renamed. The ruling is round 70, OPEN-7. Nothing below is a quotation of the human. The fenced blocks are new ADR text. Anchors are given by section and by the opening of the line, not by line number.*

**How the ADR text is applied.** The worker applies items 1 and 5 by script to the text between §2.3's markers, as amended by Amendments 1 and 2. It then copies that text to `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`. The reviewer checks that the file is byte-equal to §2.3 as amended by Amendments 1, 2 and 5 (§8, item 10).

1. **C-1, ADR text.**
   - (a) **§5: the bullet that begins `` - `project-relative`: ``** (the text from Amendment 2, item 4) is replaced whole by:

     ```
     - `project-relative`: `at` is a path relative to the project folder, `/`-separated and in canonical form. Canonical form is not empty, does not begin with `/`, has no empty, `.` or `..` segment, and holds no `\` and no `:`, so that each path inside the folder has one spelling on every operating system. A reader refuses an `at` outside canonical form. Canonical form is checked on the text alone and does not by itself keep a path inside the project folder: containment, below, does;
     ```

   - (b) **§5: after the line that begins `Locators are built and resolved in the kernel only.`**, insert one blank line and then:

     ```
     **Which locators a project file carries.** A dataset entry in a project file always carries a `machine-recorded` locator. It also carries a `project-relative` locator, in canonical form, when the data is inside the project folder by the containment rule below, judged when the project is saved. It never carries an absolute path (§2). This rule binds the writer; a reader reads the locators an entry holds.

     **Containment.** A `project-relative` locator never points outside the project folder. Two rules hold this, and they are different things:
     - **canonical form** (above), which a reader checks on the text, before anything is resolved;
     - **containment,** which the resolver that opens the data checks on the resolved target, before it opens it. The resolver resolves the project folder and the target, following every symbolic link, junction and other reparse point, and opens the target only if its resolved path lies inside the resolved project folder. A target that resolves outside the folder is refused by name and never opened, however it gets there: through a link, through a name the operating system resolves to a device (such as `NUL` on Windows), or through a name the operating system rewrites (such as a segment ending in a dot or a space on Windows). A target that cannot be resolved is refused the same way.

     Piece 1c builds the writer and the resolver. Its form states how the target that is checked is the target that is opened.
     ```

2. **C-1: the canonical-form list stays as it is.** It does not shrink, and it does not grow.
   - **Why it stays.** Each refusal is one of two kinds:
     - a lexical way out of the folder on some operating system: `..`; a leading `/`; `\`, which is a separator on Windows; and `:`, which is a drive prefix on Windows;
     - a second spelling of a path that stays inside: `.`; an empty segment; `:`, which names an alternate data stream on NTFS; and `\`, which is a file-name character on POSIX.

     With one spelling for each path, the text stays diffable, and 1c can compare two locators as strings. The only writer is 1c's own, which writes canonical form, so the refusals cost a correct writer nothing. Shrinking the list would not change containment, which the resolver holds in either case.
   - **Why it does not grow.** Trailing dots and spaces and device names are facts of how one operating system resolves a path. Containment refuses them on the resolved target. Adding them to the lexical list would also enlarge the set of inside paths that have no canonical spelling (see the custodian's notes).

3. **C-1, the code, in words** (`kernel/src/dataset_ref.rs`).
   - `stays_inside_the_project_folder` is renamed `in_canonical_form`. Its body is unchanged: the same refusals.
   - Its doc comment says that it checks ADR-036 §5's canonical form on the string alone, and that containment is checked by piece 1c's resolver, not here.
   - The error detail it returns states canonical form, not containment. The variant is still `Malformed`, at the locator's `at` path.
   - The doc of `Locator::ProjectRelative` gains: checked here for canonical form only.
   - No `pub` item and no error variant is added. Amendment 2, item 4's exception to §8 item 1 stands: the check is a string check, now named canonical form.

4. **C-1, the test.** R7, as it stands at a3f9f34f, is renamed `a_project_relative_locator_outside_canonical_form_is_refused`. Its nine cases and its assertions are unchanged.
   - Its recorded-mutation note now names the renamed function.
   - Mutation: the canonical-form check is removed, so `../x.parquet` parses. It is observed again at the fix head.
   - R7 is this piece's own test, not a test that existed before the piece, so I3 does not fire.

5. **C-2, ADR text.**
   - (a) **§5: the paragraph that begins `` **`observed`** is the change-detection observation ``** is replaced whole by:

     ```
     **`observed`** is the change-detection observation of the open that the reference was bound to: `byte_size`; `modified_ns` (a decimal string in minimal form, or the state `not-reported`); `footer_length`; `footer_sha256` (64 lowercase hex characters, or the state `not-read-over-ceiling`). Minimal form is digits only, with no sign and no leading zero unless the value is 0. A reader refuses any other spelling of either value, so each value has one spelling.
     ```

   - (b) **§5: after the bullet that begins `- The claim is recorded rather than inferred again`**, insert one blank line and then:

     ```
     **Named states in an entry.** Each named state's word is one this section gives for its member, and a reader refuses any other word. Its basis is free text (§2): a reader accepts any basis that is not blank and is within its bound, and does not interpret it. A writer that writes the entry again writes its own basis for the same word, so an entry from another writer keeps its words and may change its basis texts.
     ```

   - §2's named-state sentence is unchanged.

6. **C-2, the code, in words** (`kernel/src/dataset_ref.rs`).
   - `expect_state` keeps the closed key set `{state, basis}` and the closed word. Its basis must be a string within `MAX_REF_STRING_BYTES` and not blank: text of whitespace alone is refused as `Malformed` at `<path>.basis`. Any other basis is accepted and not kept. The comparison against the fixed text is removed.
   - The comment above the four basis constants, and `expect_state`'s doc, say that the word is closed and that the basis is the text this writer writes.
   - The module header gains one sentence: the reader accepts any bounded, non-blank basis and keeps none, and `to_json` writes this writer's own basis texts.
   - Unchanged: `to_json`, which still writes the fixed texts (§2.4), and `parse_observed`, which still refuses the minimal-form and lowercase-hex violations. Those two checks now match item 5 (a).

7. **C-2, the tests.**
   - **K1, extended** (`kernel/tests/dataset_ref.rs`, as it stands at a3f9f34f). This is the seam test, from the real shape.
     - The test takes the reference's entry and replaces `resource.source_revision` with the bundle's own `source.source_revision` value from the same real `publish_unguarded` manifest.
     - It asserts that the two basis texts differ, so the case is not vacuous.
     - It asserts that the entry parses.
     - It asserts that the parsed entry writes back to the reference's own text: the writer re-states its basis.
     - K1's existing mutation stands. Its added mutation: the fixed-text comparison in `expect_state` is restored as it stands at a3f9f34f. K1 then fails at the parse of the bundle's state.
   - **R8, new** (`kernel/src/dataset_ref.rs`): `a_named_states_basis_is_free_text_and_its_word_is_closed`. It runs over an entry that holds all four named states: `$.resource.content_hash`, `$.resource.source_revision`, `$.observed.modified_ns` and `$.observed.footer_sha256`. For each, it checks four things:
     - another non-blank basis parses, and writes back to the writer's own text;
     - a basis of spaces alone is refused as `Malformed` at `<path>.basis`;
     - a basis over `MAX_REF_STRING_BYTES` is refused as `OverCeiling` at `<path>.basis`;
     - another word is refused as `UnknownState` at `<path>.state`.

     Mutation: the blank check is removed. R8 then fails at the blank case.
   - Each mutation is applied by hand, its test is run, the failure is recorded by name with the commit it was observed at, and the mutation is reverted (§4). No `verify-mutation` run is called an observation.

8. **Routed to `b2-piece-1c-save-and-reopen`.** The custodian adds both items to the PLAN summary in this amendment's commit.
   - **The carrying rule, for 1c's writer.** Each dataset entry in a project file carries the `machine-recorded` locator always. It also carries a `project-relative` locator in canonical form when the data is inside the project folder by the containment rule, judged at save. It never carries an absolute path.
   - **Containment, for 1c's resolver.**
     - The resolver opens a `project-relative` target only when the target, resolved with every link, junction and reparse point followed, lies inside the resolved project folder.
     - It refuses anything else by name, including a target it cannot resolve.
     - 1c's form states how the target that is checked is the target that is opened.
     - 1c's tests cover a symbolic link out of the folder, and on Windows a junction out, a device name, and a segment ending in a dot or a space. Each is refused, and a plain file inside is opened. A case that cannot be built on a platform is declared under 1c's R6.

9. **The effect on §7. This is an estimate, not a count.**
   - Kernel product, already class 8 at 822 against 760: it grows by about 60 lines (the rename, the doc lines, the `expect_state` change and R8).
   - Kernel tests, already class 8 at 525 against 520: they grow by about 12 lines (K1's extension and its mutation note).
   - ADR, at 174 against 280: it grows by about 20 lines and stays within its ceiling.
   - The total, 1,930 at 479ae81d, may pass 2,010.
   - At the fix head, §7's command is run from the merge base. Every group over its ceiling, and the total if it is over, is recorded as class 8 in the closing record. §7 is not edited.

10. **Generation 6.**

**Superseded index.**
- Amendment 2, item 4: the ADR-text block for §5's `project-relative` bullet → item 1 (a).
- Amendment 2, item 4: R7's name, and its description as a locator that leaves the project folder → item 4. Its cases and its mutation stand.
- Amendment 2, item 4: the grammar of the scope-addition bullet, and the string check of the §8 item 1 exception → read as canonical form, by item 3. Both stand.
- Amendment 2, item 5: the OPEN-7 routing → extended by item 8. It stands.
- Amendment 3, item 9: the last sentence, on the fixed basis text → item 6.
- §2.3: the first sentence of §5's `observed` paragraph → item 5 (a).
- Amendment 4, item 8: stands as the count at 479ae81d. The fix head's class 8 record is the piece's final count (item 9).
- None is edited.

---

**Notes for the custodian. These are not part of the amendment.**

- **A question for the human.** Some data inside the folder has no canonical spelling: a segment holding `\` or `:` is legal on POSIX. For such data, the ruled carrying rule (a project-relative locator wherever the data is inside the folder) cannot be met. Item 1 does not settle what happens then. The choices are to refuse the save, or to carry `machine-recorded` alone and tell the user. Either is a departure from a red-line ruling, so it is the human's. It should go to 1c's form as an OPEN, or be asked now.
- **The gate report's type name.** Gate 1's report names the bundle's named state `NamedState`. The type is `Unknown`, in `kernel/src/bundle/mod.rs`. Its `basis` is a free `String`, which item 6 matches.
- **Reader limits the ADR does not state.** The reader refuses `byte_size` and `footer_length` above 2^53 − 1, and `modified_ns` above 2^128 − 1. These are ceilings, like gate 1's N-3, and are left to acceptance with N-3. Item 5 drafts only the two canonical forms you asked for.
- **The lineage file's header.** It also holds dataset entries, and it travels in the folder. The ruled carrying rule names the project file only. 1c's form should state which locators the lineage header carries.
- **The closing record.** D-1, D-2 and D-3 are left to you, as you asked.

**Files read:**
- `C:\dev\spatial-ide\state\consults\gates\2026-10-08-b2-piece-1a-step-record-and-dataset-reference-gate1-architect.md`
- `C:\dev\wt\1a\kernel\B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md` (§0 to §10, Amendments 1 to 4)
- `C:\dev\spatial-ide\state\directives\2026-10-08-round-69-rulings.md`
- `C:\dev\spatial-ide\state\directives\2026-10-08-round-70-rulings.md`
- `C:\dev\wt\1a\docs\adr\ADR-036-project-folder-step-record-and-dataset-reference.md`
- `C:\dev\wt\1a\kernel\src\dataset_ref.rs`
- `C:\dev\wt\1a\kernel\src\bundle\mod.rs`: `Unknown`, `Known`, `ResourceRef` and `Locator`
- `C:\dev\wt\1a\kernel\src\publish\mod.rs`: the `none-pinned` basis texts, by search
- `C:\dev\wt\1a\kernel\tests\dataset_ref.rs`: K1's body
- `C:\dev\spatial-ide\docs\01_Principles.md`: principle 8, by search
