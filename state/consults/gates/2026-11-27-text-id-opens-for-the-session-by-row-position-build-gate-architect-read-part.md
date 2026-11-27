Reviewed: the branch cut/text-id-opens-for-the-session-by-row-position at fc6d4b0098a08bc554f7f3ce15a1aa89564925cb in the detached read checkout D:/wt/read-1127b, and the form, the documents and the rulings at main a7be8395f0fdaddf0549f2a990050ae693cb2839 in D:/wt/read-1127c, read only, with the custodian's diffs in the scratch folder as locators. This is the custodian's filing note, 2026-11-27: the architect's build gate, THE READ PART (the form's Amendment 10 item 2; ADV-2026-11-27-11 item 2), node:text-id-opens-for-the-session-by-row-position@build-gate-architect-read-part; its run, from its completion notice only (ADV-2026-11-26-02), 61 tool uses. A read part gives no verdict and takes no gate-log row. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 16064 bytes, sha256 e658b2eb1beae55e9f6a0d5b3f04cc4446bdbf9974132971cf87bdd195a62074), byte for byte. The report wrote the scratch folder as <scratch> itself, so nothing is masked.

---

READ PART: text-id-opens-for-the-session-by-row-position (the piece's branch) @ fc6d4b0098a08bc554f7f3ce15a1aa89564925cb; form and governance read at main a7be8395f0fdaddf0549f2a990050ae693cb2839

Where I read: code in D:/wt/read-1127b at fc6d4b00; the form, docs/, ADR-016, AUTONOMY and the rulings in D:/wt/read-1127c at a7be8395. The diffs in <scratch> were used to find places only: textid-diff-piece.txt (83812fd5...ebf961d3), textid-diff-merge.txt (ebf961d3..fc6d4b00) and textid-numstat.txt. I ran nothing, started no app, and give no verdict. Everything below is paraphrase unless it is marked verbatim. The rulings are cited by id and item.

## 1. Scope (Amendment 9 item 5)

- I found no product item that §2 and its amendments do not describe.
- Each new helper carries out a §2 item or an amendment item, and each has a product caller:
  - engine: `open_cancellable_setting_aside_file_id`, `set_aside_outcome`, `new_session_ordinal_set_aside`, `set_aside_column()`
  - kernel: `Catalog::open_cancellable_setting_aside_file_id`, called from skp.rs `open_under` (lines 1205-1218)
  - shell: `refusedDeclarationOptions`, `rowPositionOffer`, `rowPositionOptions`, `carriedChoiceLine`, `reopenRetryOptions`, `RowPositionChoice`, `setAsideChoiceLine`
- K-6 calls the Catalog method directly, so that one caller is test-only. The method's product caller is the SkpHost path above.
- `identity_verification_scans` stays an instrument accessor, and its doc now names N-S.
- Nothing goes to the advisor under item 5.

## 2. R-ENG (ADV-2026-11-27-12 items 2 to 5)

**(a) The codes.** At a reopen with no choice, `open_error_of` (kernel/src/project/mod.rs) passes `OpenFailure::Open(e)` through, so every engine.* open refusal reaches the shell. These are:
- source, geo_metadata, encoding_mismatch
- crs_assertion_identifier_blank, crs_assertion_definition_too_large, crs_undeclared, crs_assertion_conflict
- axis_order_unestablished, axis_order_unsupported
- format_default_contradicted, internal_inconsistency
- identity_ordinal_partitioned_unsupported, identity_unusable
- query, arrow, connection_setup
- source_changed, source_coverage_lost

engine.cancelled maps to a null owner. engine.identity_set_aside_refused needs the choice. `reopenRefusalPlace` (openProject.ts:93-103) maps every engine.* code except cancelled to `ENGINE_REFUSAL_NOTICE`, on the code alone.

**(b) Recorded claim or file fact.**
- A recorded claim: the CRS assertion's shape and identifier codes; the axis codes when they come from a recorded assertion; identity_unusable under a recorded declaration.
- A recorded claim and a file fact: crs_assertion_conflict.
- A fact of the file now: source, geo_metadata, encoding_mismatch, crs_undeclared, format_default_contradicted, the partitioned refusal, source_changed, source_coverage_lost, and identity_unusable on the file's own `id` column.
- Neither: query, arrow, connection_setup, internal_inconsistency.

**(c) Yes, by reading.** The path is: a project saved after a set-aside open, reopened with no choice.
- K-7 shows the wire refusal is engine.identity_unusable with column `id`, and that the project file's bytes are unchanged.
- `reopenRefusalPlace` gives `ENGINE_REFUSAL_NOTICE` for that code.
- `admitProject` (openProject.ts:85) keeps that owner when the choice is not carried.
- T-11 (App.reopen.test.tsx:414-425) shows R-ENG beside engine.identity_unusable at a reopen.
- No test drives this exact shape (column `id`, project identity null) to the owner line, and E-1 (d) does not read the owner line. That is an Evidence note, not a doubt about the answer.
- By ADV-2026-11-27-12 item 4, the words land in this piece as class 9.

**Untrue clause, sent to the advisor unreworded.** It is R-ENG's second sentence (reopenNotices.ts:105-108). On the path in (c) it is untrue: the refusal names the file's own `id` column, and the project file recorded identity null, so it made no claim about that column. It is also untrue for every code in (b) that names a file fact or nothing. R-ENG's first and third sentences are true for an attempt with no choice.

**(d) My words.** These are input to item 3(d) only, not an old/new pair. The custodian drops them if the brief's "unreworded" governs.
- R-ENG: The project was not opened in this window. The open was tried with only the claims the project file recorded for the data; none was typed here.
  - Clause check: "tried with only the claims the project file recorded" holds by project/mod.rs:822-831, which passes `admission.crs_assertion` and `admission.identity`, with `set_aside_file_id` false and no shell claim. "None was typed here" holds because a reopen carries no typed claim. Both clauses hold for every code in (a).
- S-8 reading: S-8 shares R-ENG's defect. With the choice, the reachable refusals are S-6a and S-6c (file facts), S-6b (a recorded declaration), engine.query (names nothing) and the file facts checked before identity. Words: The project was not opened in this window. The open was tried with the claims the project file recorded for the data and with the choice you made here to open it by row position.
  - Clause check: project/mod.rs:822-831 passes the recorded claims together with the choice.

**(e) Places that quote them.**
- No walkthrough row, KNOWN-LIMITATIONS entry or e2e script at this head quotes R-ENG or S-8.
- Tests hold the constants, not the text: App.reopen.test.tsx:420, openProject.test.ts:111, AdmissionPanel.test.ts:650 and :861, reopenNotices.test.ts:101-104.
- The text appears in governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md, in ADV-2026-11-20-05 (the source), in ADV-2026-11-24-05 item 2(b) (S-8), and in reports under state/consults.
- I did not find the sitting's script. It is unlocated, not shown absent.

**Item 5.** engine/ADMISSION-RESULTS.md is a record of a past run, not a description of today. Its header names a generator test that is `#[ignore]`d (admission_p4_corpus.rs:805), the commit 7196452e and the date 2026-10-09, and says it is generated and never hand-edited. Its observed column is what that run saw. Rows 23 and 43 keep the old text, and correctly so. It stays unedited (Amendment 2).

## 3. §10 seams, each from the real shape on both sides

1. **engine to kernel.** Catalog calls the engine function with its actual signature: path, assertion, declared identity, cancel, connections. Proven by K-1, K-2 and K-7 through SKP.
2. **kernel to wire.** commands.rs adds `set_aside_file_id: bool` on both requests, required with no serde default and `deny_unknown_fields` kept. `IdentityInfo.set_aside_column` is always present. The `error_of` arm for engine.identity_set_aside_refused is at skp.rs:2214-2217. Proven by W-1 (fixtures.rs) on the new fixtures and on skp/0.17 for the future version.
3. **wire to shell.** types.ts mirrors the members. client.ts always sends the member, false by default. Proven by T-1 and by fixtures.test.ts reading the real fixture files. E-1 TEXTID' (a) to (d) is written, not run: the run is the tester's (Evidence, outstanding).
4. **kernel project to engine (C2).** project/mod.rs:822-831 sends the project's recorded claims and the choice. Proven by K-7, which runs false and then true and checks that the file's bytes are unchanged.

**Guarantees.**
- ADR-016 §1 and §3, no silent fallback: S-6a, S-6b and S-6c refuse by name, and `set_aside_outcome` turns only `IdentityUnusable` into the set-aside tier.
- Amendment 1 item 1: the session statement is unchanged.
- ADR-010 rule 2: no frame or origin code is in the diff.
- Publish refusal: K-6.
- G-A4, no generation saved: K-4 and K-5.
- Cancellation: N-9, plus the unit guard `a_set_aside_passes_cancelled_and_query_through_unchanged`.

## 4. ADR-016 and its appended block

Amendment 3 is appended and Accepted 2026-11-26; no accepted text above it is rewritten. Decision 6 (nothing saved or published) holds:
- K-4: the project file holds identity null and none of set_aside, set-aside, file_row_number or session-ordinal, with a positive control.
- K-5: the same for the history.
- K-6: `publish::preflight_pinless` refuses with publish.session_identity_not_publishable, so no bundle is made.

## 5. §1's claims

No §1 claim is contradicted by the code. F4 was checked in detail. `FilterError::IdentityAliasAmbiguous` gains `by_row_position`. The kernel's `filter_error_of` keeps the wire fields `column` and `source_column` unchanged, so the tier travels only in the Display text. K-3 asserts `source_column` "file_row_number" and S-4's text. This matches §1, which names no wire field for the tier.

## 6. §9 Block on sight, item by item

1. Code before the approval of Amendment 3: true no-violation. Code follows the acceptance on 2026-11-26 (Amendments 7 and 8).
2. A path outside §7: true no-violation for the piece. All 84 files are inside §7 with Amendments 2, 3 and 4. The merge's five files outside it are the route's (§8 below).
3. A choice without the user's act, or a default of true: no-violation. client.ts defaults to false. admitDataset.ts types the option as `true` or absent. Its only setter is `rowPositionOptions`, which only the click calls (RowPositionChoice.tsx:27).
4. Any byte of the choice in a project file, history or bundle: no-violation (K-4, K-5, K-6).
5. A declaration form on a reopen: no-violation (S-T4; formFamily null).
6. identity and set_aside_file_id sent together by the shell: no-violation. `refusedDeclarationOptions` and `rowPositionOptions` each drop the other member. The kernel's project path does send both on one path, which is finding C1 below; it is not the shell.
7. A base holding the recovery offer's head: no-violation (Amendment 8, base 83812fd5).
8. A test whose red is a compile error: not shown either way. No skeleton commit exists (the worker's departure in Amendment 9), so no red was read on a compiling skeleton. Evidence, for the reviewer and tester to settle.
9. Lab-folder content: none seen in the 84 + 13 files.
10. Any number from the human's item 1: not resolved. §9 does not name the number, and this read part did not open the human's item 1. The custodian or reviewer resolves it against its source.

## 7. The merge (ebf961d3..fc6d4b00, the route's 7fa66a68)

The design still matches §2. Of the 13 files, none changes a §2 item:
- AdmissionPanel.tsx: the offer's doc, the comment in `runAdmitPath`, and the route's D2 by ADV-2026-11-27-15 item 1.
- `runAdmitPath`'s resume rule now holds the admission for any open of the same path while the session-tier offer stands. It applies to a set-aside admission too, which KNOWN-LIMITATIONS item 3's last sentence already says, and leaves `rowPositionOffer` untouched.
- identity.rs: a doc cite and two mutation comments, with no code change.
- SKP-V0 §1 and §8 skp/0.15, mod.rs, types.ts: the route's candidate-list words. They agree with the set_aside_column paragraph, which is untouched.
- KNOWN-LIMITATIONS: only the comment line, the resolution of the conflict.
- Five files are the route's and outside this Scope: conditions-baseline.mjs, conditions.mjs, App.lateResult.test.tsx, IdentityDeclarationForm.tsx, conditions.test.ts.

KNOWN-LIMITATIONS item 3's cites hold at fc6d4b00: engine/src/identity.rs:365-392 is `admit_column_type`'s doc through its closing brace, and engine/src/error.rs:376-380 is the `IdentityUnusable` Display arm. The reviewer reads the merge line by line.

## 8. Class 8 overrun

This is the declared design in more lines, not a design that grew. By count: 2313 + 221 = 2534 lines over 84 of 84 files, against a ceiling of 2,150.
- Tests are 1536 lines against about 1,090. Most of the excess is kernel/tests/text_id_set_aside_not_saved_or_published.rs (367), skp_admission_remediation.rs (190), text_id_set_aside_session_tier.rs (260), and the extra N-S file text_id_set_aside_scan_counts.rs (95, Amendment 3's addition).
- Engine product is 225 against 150. dataset.rs has 138 lines, including `set_aside_outcome` and its unit guard.
- Shell product is 197 against 140, including the `reopenRetryOptions` refactor and the e2e scratch store.
- None of these adds a behaviour §2 does not name.

## Findings

**C1. Correctness, a question for the advisor; whether code changes is not determined.**
- Path: a project reopen whose file records a declaration of the file's `id` column. This happens when the file changed since the save, when the project file was edited by hand, or when another client wrote the project.
- What happens: the engine refuses engine.identity_unusable with column `id`. `rowPositionOffer` offers the choice, because `options.identity` is unset at a reopen. On the click, project/mod.rs:822-831 sends the recorded declaration together with `set_aside_file_id` true, and the engine refuses S-6b.
- What holds: the refusal is named, so there is no silent fallback. The owner shown is S-8.
- The problem: the shell offers a choice that the engine refuses by construction, on a path ordinary use can reach (a file changed between sessions).
- The advisor decides whether this is a departure from §2 item 12 or a gap to record. I propose no code.

**D1. Documentation, no code change; the worker's words, not ruled.**
- File: engine/src/error.rs, the `IdentitySetAsideRefused` doc, lines 177-179. The sentence does not cover the path in C1. The old string occurs once in the file.
- Old, verbatim: "Two of the three are
    /// reachable only if the file changes between attempts, or through a client other than the
    /// shell, which offers the choice only beside the refusal."
- New: "The first is
    /// reachable through the shell only at a project's reopen whose project file records a declaration
    /// of the file's `id` column (a file changed since the save, or a project file written by hand or by
    /// another client); the other two only if the file changes between attempts; each of the three
    /// also through a client other than the shell. The shell offers the choice only beside a refusal
    /// of the file's own `id` column."
- Clause check:
  - The first case is "beside a declared identity column", lines 170-172; the path is C1.
  - "The other two only if the file changes between attempts": `reopenRetryOptions` drops the choice on a retry after a question or a not-found reply, so the choice is re-sent only on the same file.
  - "Offers only beside a refusal": `rowPositionOffer` requires engine.identity_unusable with column "id".
- If C1 is ruled a defect and the code changes, these words are redrafted.

**D2. Documentation, no code change.** At fc6d4b00, §7's counting command over the base 83812fd5 also counts the route's merged files (89 files). The closing count must name its range as 83812fd5...ebf961d3, or leave the merge commit's route files out. This is a record matter; I propose no words for the form.

**D3. Documentation, no code change.** SKP-V0.md §8's skp/0.16 entry says §12.2 was brought current in place, but the diff also edits §12.3. I did not byte-copy that sentence, so I give no pair. The worker adds §12.3 to it.

**E1. Evidence, for the tester and reviewer.**
- E-1 TEXTID' is written, not run.
- No test drives the C(c) shape (project identity null, column `id`) to its owner line.
- §9 item 8's red was never read on a compiling skeleton.

**R-ENG and S-8. Ruled texts.** The clause defect is reported in §2 above, with no replacement pair. Item 3(d)'s input is given there, as that item asks.

**Checked, no finding.** The human's round-7 sentence quoted in error.rs:177 matches its source byte for byte.

Open item for the custodian: §9 item 10 (the number from the human's item 1) is unresolved by this read part.

Files:
- D:/wt/read-1127b/engine/src/error.rs
- D:/wt/read-1127b/kernel/src/project/mod.rs
- D:/wt/read-1127b/frontends/shell/src/project/openProject.ts
- D:/wt/read-1127b/frontends/shell/src/project/reopenNotices.ts
- D:/wt/read-1127b/frontends/shell/src/admission/AdmissionPanel.tsx
- D:/wt/read-1127c/governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md
