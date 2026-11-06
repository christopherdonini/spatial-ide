*Custodian's filing note (2026-11-06): lead-data's impact read for filler entry 8f, `single-file-bracket-name-refused-as-partitioned` (the human's placement of 2026-11-05, evening, item 2), drafted ahead while 8e (PR #290) awaits the click; read only at main c66bfede. Its brief by file (9610 bytes, sha256 c219c72ce074509c110b3c151d06f43c141628502d43b449cf49ee1239765919), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's two misses byte for byte. The run 2026-11-06T18:46:56.221Z to 2026-11-06T18:52:00.604Z by its transcript (claude-opus-5-5; unique calls Read 39, Grep 19 and the hand-back, 59, equal to the notification's). Extracted by script from its one SubagentHandback call, at 2026-11-06T18:52:00.435Z, one final newline added; its sha256 is 03efc5328cbfc4ba9dd1da44d9609a2580cefaf13331ff7f74fbb4f426467b42. The custodian's answers to its three questions, for the architect's draft: (1) reversing the admission form's Amendment 2, items 8 and 10, is an OPEN item, the architect saying whose decision it records and marking it a red line if the human's; (2) a probe first, yes, as the form's step 0 (tester-high, at the real boundary, the pinned DuckDB, no dependency change), its outcomes preregistered with the shape each selects; (3) a new wire code under (d) is an OPEN item with the architect's recommendation. A reading, not Authority.*

---

Impact read: single-file-bracket-name-refused-as-partitioned (lead-data, 2026-11-06)

The piece is NOT confined to engine/ and kernel/ under any shape I can find. Every shape changes KNOWN-LIMITATIONS item 20 (the human's wording, at the click). The fixing shapes also make a protocol/skp/SKP-V0.md sentence untrue. The refusal-only shape also makes a shell guidance string untrue. I wrote no file and changed nothing. I have no shell, so I give no sha256, list no branch and cannot confirm HEAD by command. I read the main checkout's working tree, whose HEAD the session snapshot shows as c66bfede00f4e50cace415f3ef8738c9e56fb60a; that snapshot lists only two untracked paths, neither of them anything below. I left no background shell. Everything not marked as a quote is my own words.

Re-read of the triage's pointers at c66bfede00f4e50cace415f3ef8738c9e56fb60a:
- Still current: dataset.rs:325-327, error.rs:388-390, AdmissionPanel.tsx:28-32 and commands.rs:239.
- Moved: KNOWN-LIMITATIONS.md:248-256 now points at item 18 (retired) and item 19. Item 20 is at KNOWN-LIMITATIONS.md:269-278 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.

## 1. The behaviour at main
- **Which path text counts as partitioned.**
  - The gate is the first statement of `open_inner`, before the `is_file` check and before any use of `declared_identity`: engine/src/dataset.rs:319-327 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - `partitioned_source_detail` returns a detail when the path is a directory (engine/src/dataset.rs:1850-1852 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - It also returns one when the path text, with any `\\?\` or `\\?\UNC\` prefix removed, contains any of `* ? [ ] { }` (`GLOB_METACHARACTERS`, a plain `contains` test, no stat): engine/src/dataset.rs:1853-1888 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - The comment says this is deliberate, refusing an existing literal file as the accepted false positive: engine/src/dataset.rs:1862-1880 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - So any single existing file whose name holds `[`, `]`, `{` or `}` (or, off Windows, `*` or `?`) is refused.
- **What the engine returns.** `EngineError::IdentityOrdinalPartitionedUnsupported { detail }` (engine/src/error.rs:182-189 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - The Display text is at engine/src/error.rs:386-391 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a. Both halves share it.
  - The metacharacter detail is at engine/src/dataset.rs:1883-1886 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
- **What the kernel sends.**
  - `error_of` sets the message to the Display text, unchanged (kernel/src/skp.rs:2113-2114 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - It maps the variant to `identity_ordinal_partitioned_unsupported` with a `detail` field (kernel/src/skp.rs:2164-2167 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - It prefixes `engine.` (kernel/src/skp.rs:2271-2273 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - The terminal form is `terminal_detail_of` (kernel/src/skp.rs:2106-2108 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - Per SKP-V0, the host passes the path as received (protocol/skp/SKP-V0.md:31-33 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
- **What the panel shows.**
  - `RefusalBlock` renders the code, `message` and `fields`, plus `refusalGuidance(code)` (frontends/shell/src/admission/RefusalBlock.tsx:25-29 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - For this code the guidance is frontends/shell/src/admission/formatRefusal.ts:112-117 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a. It is a second statement that the source spans more than one file, with the same two remedies.
  - No form opens: `formFamilyForCode` opens forms only for three other codes (frontends/shell/src/admission/AdmissionPanel.tsx:28-33 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
- **Why the remedies cannot be followed.**
  - "Open a single file": the user already did.
  - "Declare an identity column": the panel offers no identity form for this code. Separately, the engine checks the gate before `declared_identity` is read (engine/src/dataset.rs:325-327 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a). So a declaration cannot get past it from any caller, not only in the app. This holds for the directory half too.
  - The only real route is renaming the file outside the app. The picker is `pick_file` (frontends/shell/src-tauri/src/commands.rs:233-245 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a), so no path can be typed or quoted.

## 2. The shapes of a fix
Every DuckDB call site receives the raw path string:
- bound parameters at engine/src/dataset.rs:1082, :1115, :1128, :1434, :1711, :1741 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a, and engine/src/stream.rs:1445 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a;
- interpolated at engine/src/dataset.rs:1806, :1996 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a;
- the experimental seams at engine/src/index.rs:326 and engine/src/rowgroup.rs:391 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a;
- the fixture-only `layout` (engine/src/lib.rs:118-119 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a) at engine/src/layout.rs:344, :442, :600, :624 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.

DuckDB is the `duckdb` crate at version 1.10505.0, bundled (engine/Cargo.toml:48 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).

The only claim in the tree about what DuckDB does with these characters is the engine's own comment (engine/src/dataset.rs:1862-1865 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a) and governance/forms/engine/ADMISSION-PREREGISTRATION.md:662-665 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a. I found no test that observes DuckDB with an existing literal bracket or brace file. **For every shape below, what DuckDB does with such a name is unknown without a run.** That includes:
- whether it expands `{a,b}` at all;
- whether `[1]` matches a literal `[1]`, matches a neighbouring `1`, or matches nothing;
- whether the pinned version offers a literal-path option or an escape.

- **(a) Check the disk first** (if `is_file`, skip the metacharacter scan). Site: engine/src/dataset.rs:1849-1888 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a only.
  - Risk: DuckDB then receives the pattern text. If it globs, it may read a different file (for example `zones1.parquet` beside `zones[1].parquet`). The descriptor and content pin would describe the literal file while the rows come from another. If it matches nothing, the refusal becomes `engine.source` carrying DuckDB's text (engine/src/dataset.rs:1096 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
  - It reverses the recorded decision that the glob test never looks at the disk (governance/forms/engine/ADMISSION-PREREGISTRATION.md:671-672 and :816-821 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a).
- **(b) Take an existing single file literally:** (a), plus a literal route at every DuckDB site listed above. The non-DuckDB readers (descriptor, pin, watcher, LOD's arrow-rs reader) already read literally.
  - Whether the pinned DuckDB has a literal route is unknown without a run.
  - It reverses the same recorded decision.
- **(c) Escape the metacharacters for the reader:** the same sites as (b), through one helper used only at the DuckDB boundary. Every other consumer (descriptor, pin, `describe`'s `path_display`, dataset reference) keeps the raw path.
  - DuckDB's escape syntax is unknown without a run.
  - A backslash cannot be the escape on Windows.
- **(d) Keep the refusal; change only its detail or message.** Sites:
  - engine/src/dataset.rs:1883-1886 (the detail) and engine/src/error.rs:386-391 (the shared Display) @ c66bfede00f4e50cace415f3ef8738c9e56fb60a;
  - optionally a separate variant and code. A new code is a wire-contract change (SKP-V0 §5 and §7's code list, a new protocol fixture, an `error_of` arm, the shell), so it is a question for the custodian.
  - DuckDB is never reached, so its behaviour is known: nothing happens.
  - The file still cannot be opened in the app.
- **My reading:** I would point the architect to (b), behind a first step: a probe test run against the pinned DuckDB, at the real boundary, with a decoy file. Only (b) makes the file openable, and that is what the user cannot do now. (a) alone risks a silent wrong-file read. (c) is (b) with an unknown syntax. If the probe finds no literal route, (d) is the fallback, and it pulls in the shell guidance and possibly a new code. Either way, reversing ADMISSION-PREREGISTRATION Amendment 2 item 8 and item 10 is a decision I put as a question, not one I make.

## 3. Strings the app shows
All are P6 strings for the human at the sitting. I propose no words.
- engine/src/error.rs:386-391 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a: the Display text, shared by the directory and metacharacter halves and quoted in item 20. I found no ruling that makes it the human's wording; my grep for its first sentence found it only in the triage, PLAN.yaml, CUSTODIAN-QUEUE.md, the protocol fixture and error.rs. It is not marked as a placeholder.
- engine/src/dataset.rs:1851 and :1884-1885 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a: the two details, shown as the `detail` field and inside the message.
- engine/src/dataset.rs:329-331 and :1096 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a: the `engine.source` texts, which (a), (b) or (c) could surface, the second carrying DuckDB's own error.
- frontends/shell/src/admission/formatRefusal.ts:112-117 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a: the guidance. Its own comment says these guidance strings are P6 placeholders, not asserted verbatim (frontends/shell/src/admission/formatRefusal.ts:60-63 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a), though the text has no "[P6 placeholder]" prefix. It stays a placeholder. Under (b) it stays true for the cases left. Under (d) it is untrue for a single file.
- The protocol fixture protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a carries the Display text byte for byte for the directory case. Its test only round-trips the shape (protocol/skp/tests/fixtures.rs:221-242 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a), so a Display change would leave it stale without failing.

## 4. Tests
- **Existing coverage: no test opens an existing single file whose name holds a bracket or brace.**
  - `engine/tests/session_identity.rs::every_glob_metacharacter_read_parquet_expands_is_refused_by_name` (engine/tests/session_identity.rs:688-702 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a) opens paths at which no file was written.
  - `a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not` (:284-307) and `a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file` (:266-278) do not either.
  - The kernel tests build the variant directly and never open a path: `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` (kernel/tests/typed_terminal_codes.rs:380-398) and `kernel/tests/no_generation_in_persisted_artifacts.rs::every_typed_string_a_session_log_line_can_carry_around_a_detected_change_has_no_generation_substring` (kernel/tests/no_generation_in_persisted_artifacts.rs:344-351), both @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - Others that name the variant or code: engine/tests/admission_p4_corpus.rs:400-402 and frontends/shell/src/admission/formatRefusal.test.ts:176-182 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
- **Per shape** (Part 1, item 7). The file is written by the real fixture producer and opened through `Dataset::open_cancellable`. One kernel test crosses `SkpHost::open_dataset`; I did not read the harness in kernel/tests/skp_admission.rs.
  - (a) and (b): `zones[1].parquet` beside a decoy `zones1.parquet` with different ids and row count, plus a `{a,b}` pair. Assert that the open is admitted and that the streamed rows and count are the literal file's. Mutation: give the raw path back to one DuckDB site (engine/src/stream.rs:1445 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a); the test must fail by name. The existing missing-path tests must stay green. DuckDB's no-match error must be observed from DuckDB, not written as a string.
  - (c): the same decoy test. Mutation: drop one character from the escape set.
  - (d): an existing `zones[1].parquet` is refused with the single-file detail, asserted by structure because the wording is a placeholder. A kernel test checks the wire code and `detail` field through `SkpHost::open_dataset`. Mutation: restore the old detail format, or map the variant to another code in `error_of`.
  - `*` and `?` file names cannot be created on Windows, so those cases are platform-gated.

## 5. Files and overlap
- **(b)** (my count is 9-11 files):
  - engine/src/dataset.rs, engine/src/stream.rs, engine/src/index.rs, engine/src/rowgroup.rs (engine/src/layout.rs only if the fixture path is included);
  - engine/tests/session_identity.rs or a new engine test, plus a kernel test;
  - protocol/skp/SKP-V0.md (the sentence at :32-33 becomes untrue);
  - KNOWN-LIMITATIONS.md;
  - engine/README.md;
  - the form.
- **(d):**
  - engine/src/error.rs, engine/src/dataset.rs, an engine test, a kernel test;
  - frontends/shell/src/admission/formatRefusal.ts and its test;
  - the protocol fixture and KNOWN-LIMITATIONS.md;
  - with a new code, also kernel/src/skp.rs, protocol/skp/SKP-V0.md, a new fixture and engine/tests/admission_p4_corpus.rs.
- **Overlap with the in-flight list:**
  - KNOWN-LIMITATIONS.md: #289, #291 and port-2. Whether they touch item 20 I cannot read.
  - protocol/skp/SKP-V0.md and kernel/src/skp.rs: #290, which 8f follows anyway.
  - engine/src/lib.rs: port-2, only if a pub item is added.
  - kernel/README.md: #289, only if a kernel pointer changes.
  - None of the other paths is on the list.
- **Owner's index after the merge:**
  - engine/README.md:537 (Last verified), :539 (the Open and admission row: add the new test), :557 (add the form), and :548 only if the variant changes, @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - kernel/README.md:369 only for a new code, and :389 if the form names a kernel half.
- **KNOWN-LIMITATIONS item 20 changes under every shape:**
  - Its sentence that a single file with a metacharacter gets the same code and message "even where exactly one file exists at that path" becomes untrue under (a), (b) and (c).
  - Its quoted message changes under (d).
  - Its comment's pins (KNOWN-LIMITATIONS.md:278 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a) are historical, pinned at 4fd3259a. The tree has moved: dataset.rs:1838-1889, error.rs:386-391, skp.rs:2164-2167.
  - The wording is the human's, at the click.

## 6. Line estimate (§21c: tests and prose count)
My estimates, not measured:
- (b) about 150-210 lines over 9-11 files: the gate and helper 25-40, the sites about 15, the comments 25, tests 70-100, prose 15. Over both five-line bounds, so it needs the full form, and the probe comes first.
- (d) with no new code: about 100-140 lines over 6-8 files, at the edge of the bounds.
- (d) with a new code: about 150-200 lines over 10 or more files, over the bounds.

## 7. Risks and red lines to name before drafting
- **P6 strings:** every string in section 3, the human's at the sitting.
- **Text that states this refusal:**
  - ADR-016 Amendment 1 §5 (docs/adr/ADR-016-stable-feature-identity-admission.md:230-232 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a; Accepted) says single file only and refused by name. It does not state the metacharacter rule, and (b) keeps it true. Its claim that the declared-mapping route is "untouched" sits beside a gate that runs before any declaration. An accepted ADR changes only by a note in the human's words, so the form should not touch it.
  - protocol/skp/SKP-V0.md:31-33 and :730-731 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - The recorded trade-off in governance/forms/engine/ADMISSION-PREREGISTRATION.md:662-672 and :816-821 @ c66bfede00f4e50cace415f3ef8738c9e56fb60a.
  - The closed form at governance/forms/protocol/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md:121 and the walkthrough row frontends/shell/MANUAL-WALKTHROUGH.md:954 (N9), both @ c66bfede00f4e50cace415f3ef8738c9e56fb60a, should be left as they are.
- **The directory half:** my reading is that it stays as it is. It is unreachable from `pick_file`, ADR-016 governs it, and the fixture carries its text. Because the Display is shared, a shape that rewords it changes the directory's text too, unless the halves are split.
- **What makes this more than an engine change:**
  - KNOWN-LIMITATIONS item 20 (root), every shape;
  - SKP-V0.md (protocol) under (a), (b) and (c);
  - the shell guidance under (d);
  - a new wire code, a contract change;
  - any DuckDB version change, which is a dependency and a red line;
  - the round-7 rule that engine messages state facts and owners state consequences, which the Display's two instructions sit under.

## What I could not settle
- What the pinned DuckDB does with an existing literal `[`, `]`, `{` or `}` file name, and whether it offers a literal or escaped route. This needs a run.
- Whether the Display text or item 20's text is the human's wording.
- Which KNOWN-LIMITATIONS items the in-flight branches touch.
- The kernel test harness for `SkpHost::open_dataset`, which I did not read.

Blocking questions for the custodian:
- Does the piece reverse ADMISSION-PREREGISTRATION Amendment 2 item 8 and item 10 (the glob test never looks at the disk; an existing literal file is refused as the accepted false positive), as (a), (b) and (c) do?
- May a probe run against the pinned DuckDB come first, as its own step, before the shape is chosen?
- If (d): one shared code, or a new code (a wire-contract change)?

REPORT PATH: C:/dev/spatial-ide/state/consults/2026-11-06-single-file-bracket-name-refused-as-partitioned-impact-read-lead-data.md. I have no shell, so I give no sha256.
