Reviewed: governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md at main @ f39536be767cedc2f6637e3d0d48d286e2bc2688, against the code in the read checkout D:/wt/read-1127b at 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e. The C1 piece's form gate, the reviewer (Opus); its run, from its completion notice only (ADV-2026-11-26-02), was 89 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (18467 bytes, sha256 5972ff4680a40301b001bfa598cc42f599d3ab2de0b17b63cf12719d73725606), byte for byte below the rule.

---

**PASS WITH NOTES.** I reviewed `governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md` on main @ f39536be767cedc2f6637e3d0d48d286e2bc2688 (read checkout D:/wt/read-1127c), against the code at the detached text-id head @ 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e (read checkout D:/wt/read-1127b). The form gate, the reviewer. node:text-id-reopen-with-a-recorded-declaration@form-gate-reviewer.

Everything below is my paraphrase unless it is marked verbatim. Verbatim spans are byte-copied from my own reads of the form file. Rulings are cited by id and item. `<scratch>` is the session scratch folder. I wrote nothing outside it, ran no git command that writes, and built and ran nothing.

Under AUTONOMY §22:
- **Correctness: PASS.** No findings.
- **Evidence: PASS, with three findings (V1 to V3).** None of them blocks. Each test still fails on its own mutation and passes on the change, and no finding opens a path to a false green. Each is owed by amendment before any code.
- **Documentation: four findings (W1 to W4).** All must be fixed before the merge.

---

## 1. Mechanical checks (by script)

**Body against the draft.**
- I compared `sed -n '9,293p'` of the filed draft with `sed -n '1,285p'` of the form, by `diff`.
- The only difference is line 29: the ADR-016 cite now reads "line 302 of … at the base". That is the one change Amendment 1 discloses.
- Amendment 1's figures reproduce, read as the title through the last line before the blank line that precedes END OF FORM DRAFT (`head -c -1`):
  - the draft: 26351 bytes, sha256 05847b3a…88b61d6;
  - the body: 26371 bytes, sha256 8c571e03…01fc4.
- Counted with that blank line, the figures would be 26352 bytes and ec3c759c…. The amendment's figures follow the first reading. This is not a finding.

**Amendment 1's fence against the restatement.**
- The restatement has rule lines at 5, 16 and 237. Its lines 18 to 235 `cmp` equal to the form's lines 300 to 517: 16251 bytes, sha256 a2bedd4e…ce494, as Amendment 1 states.
- `<scratch>/a1check.mjs` parses the fence into Old/New pairs:
  - there are 15 pairs;
  - each Old occurs exactly once in the body, and twice in the whole form (once in the body, once in the fence itself), as expected;
  - no New is already present in the body.

**Amendment 2's seven Olds.**
- `<scratch>/a2check.mjs` takes each Old from the architect report's lines 144, 148, 152, 156, 160, 164 and 168.
- Each occurs exactly once in the form:
  - E1 and D1 to D4 are in the body;
  - D5 is in Amendment 1 pair 2's New;
  - D6 is in Amendment 1 item 3's table.

**The advisor's two texts.**
- `<scratch>/drcheck.mjs` rejoins D-R1's New, reading each line break plus its `    /// ` prefix as one space. The result equals ADV-2026-11-27-24 item 4's first fence byte for byte.
- D-R2 (ii)'s New, with "New: " added in front, equals the second fence.
- D-R2 (i)'s Old equals `AdmissionPanel.tsx:219`. D-R2 (ii)'s Old occurs once, inside `:222`. D-R1's Old matches `error.rs:177-183`.

**The null-by-name form.** `<scratch>/nullcheck.mjs`: each of A1's four Olds occurs once there.

**My own pairs.** `<scratch>/mine.mjs`: each Old given below occurs exactly once in the form file.

## 2. §2 against the code

**The sites that build the variant.**
- A `git grep` of the whole tree finds exactly five `IdentityUnusable {` construction sites: `dataset.rs:2077`, `:2098`, `:2156`, `:2167`, and `identity.rs:382`.
- The only exhaustive destructures are `error.rs:380` and `kernel/src/skp.rs:2248`.
- Among the engine tests, only `engine/tests/identity.rs:119` destructures without `..`. No kernel test builds the variant.
- `EngineError` derives only `Debug` (`error.rs:12`), so nothing persists its shape.

**`source`.**
- It is built at `:2046-2060`, as `File` or `Mapped` only.
- `as_envelope_value` (`identity.rs:82-90`) gives `file:id` at `:84` and `mapped:{column}` at `:85`.
- Its moves are inside the calls that begin at `:2111` and `:2178`, so D5 as amended holds.
- `admit_column_type`'s only product caller is `:2106`. Its in-module tests are at `:425`, `:434`, `:492` and `:543`.

**The kernel's arm** (`skp.rs:2248-2262`) needs one destructured field and one pair. Nothing else in `kernel/src` mints `identity_unusable`. A reopen passes `OpenFailure::Open(e) => e` unchanged (`project/mod.rs:973`).

**The shell's offer at a reopen.**
- `admitProject` sends no claim (`openProject.ts:73`).
- The refusal passes through `shownRefusal` (`shownText.ts:44-46`), which leaves `file:id` and `mapped:id` as they are.
- The new line goes after `AdmissionPanel.tsx:227`. `fieldValue` exists (`formatRefusal.ts:45`).

**The literal's files.**
- A grep for `skp/0.16` covers every shell, protocol and conformance file the scope's "each" lines name.
- The current future-version fixture is the object at lines 50 to 61 of `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json`, id `any-version-skp_0_17`. It is inside the scope, but §2 item 5 places it under `mod.rs` (W4).
- `protocol/skp/tests/fixtures.rs:1023` pins the literal.

**Can a worker build §2 as amended without a guess?** Yes, with two gaps:
- the content of the new declared fixture, which V1 fixes;
- where the future-version fixture lives, which W4 fixes.

## 3. §4, test by test

The rule applied: each test must go red for its own reason when its mutation is applied, a compile or import red does not count, and the test must pass on the change.

- **N-R1 / M-RD1.** File A is `StringIds`. Declaring `id` reaches the type check at `:2106`. Passing `&IdSource::File` there gives `file:id`, so the test goes red at its assertion. It compiles.
- **N-R2 / M-RD2.** A declared `id` over `DuplicateIds` reaches `:2167`. The mutation gives `file:id`, so the test goes red. The negative-value site, `:2156`, is asserted but has no mutation of its own; one mutation per test is what the rule asks.
- **K-R1 / M-RD3.**
  - (i) expects `mapped:id`; the mutation gives `file:id`, so the test goes red. The mutation leaves the binding unused, which is a warning: no `deny(...)` or RUSTFLAGS setting was found.
  - P1 is buildable. `DatasetRef::linked` records `{column}` (`dataset_ref.rs:219-221`) and `parse_admission` reads it (`:676-681`).
  - The check that the data file matches runs after the open (`project/mod.rs:850`), so the engine is reached.
  - The default spec and File A both declare LV95, so no CRS refusal comes first.
  - The recipe omits the close before the bytes are replaced (V3).
- **K-R2 / M-RD4.** The arm leaves the field out, so the test goes red at `file:id` and at `mapped:nope`.
- **W-R1 / M-RD6.** If the literal stays at 0.16, the request fixtures at 0.17 and the pin at `:1023` go red at their assertions.
- **S-R1 / M-RD5.** With the check removed, `mapped:id` is offered and so is a refusal without the field, so the test goes red. The `refusedOpen` helper exists (`AdmissionPanel.test.ts:805` onward), and the vitest environment is jsdom for both test files.
- **S-R2 / M-RD7.** With the key `source`, the `file:id` fixture is not offered, so the test goes red. The negative half cannot fail on this piece's mechanism (V1).
- **E-R1 / M-RD8.** The test can fail on its mutation and pass on the change, provided the step reaches C1 (V2). The E-1 (d) control holds: its project records `"identity": null`, so the reopen refusal is `file:id` and is offered.

**E1's spelling claim, against the reader at the base: true.**
- `read_project` calls `check_spelling(&doc, bytes, Layout::LineOriented)` (`kernel/src/project/file.rs:157`).
- `spelling` is `to_line_oriented_string(v) + "\n"` (`strict_json.rs:91-95`).
- `same_bytes` refuses on the first byte that differs (`:110-124`).
- The layout is a two-space indent, `": "` after a key, one member to a line, and `{}` and `[]` for empty objects and arrays (`renderer/src/canonical.rs:170-218`).

**Existing tests.**
- D3 as amended is true: T-11 sends `fields: {}` (`App.reopen.test.tsx:416`).
- No other shell test drives the offer. `admission-row-position` appears only in `RowPositionChoice.tsx` and `e2e/admission-remediation.mjs`.
- No kernel exact-key-set assertion covers `identity_unusable`. The ones at `skp_admission.rs:643` and `skp_admission_remediation.rs:338`, `:643` and `:693` are on other codes.
- `regression.mjs`'s `stepRefusal` compares the message only, and the message does not change.

## 4. §1, §5, §7, §8, §9

- **§1's claims are true** as amended (with D1). `Display` and every message stay unchanged, and `dataset_ref.rs` is untouched.
- **§5.**
  - The predictions are consistent with §4.
  - Invalidator (i) will not fire on the recorded shape.
  - Invalidators (ii) to (iv) are checkable.
  - The falsification is well formed.
- **§7 Scope.** It covers every file §2 and §4 need.
  - By its own rules the scope resolves to 44 files at the base, not the 51 that Amendment 1 item 3 records (W2).
  - About 40 files must change, under the 50-file ceiling.
  - The estimate of about 750 lines is under the 900-line ceiling.
  - The overrun line names class 8.
- **§8.** True. The overlap rows match git:
  - A's hunks in `saveProject.test.ts` (f64fac32..38e9209d) do not hold line 70, the literal;
  - each branch's files that fall in the scope match its table row.
- **§9.** All nine stops are checkable. Stop 1's condition is met by ADV-2026-11-27-24 items 1 to 3.

## 5. ADV-2026-11-27-24 and -27, as the form carries them

- **Item 1:** §0's choice of (a).
  - On KNOWN-LIMITATIONS item 3 I read as the advisor reads. "A file whose `id` column cannot serve…" speaks of the file's own `id` with no declaration. "…opening the file or the project again refuses the column and asks again" speaks of a project saved after the choice, which records `null`. Both stay true under (a).
  - Nothing goes to the advisor.
- **Item 2:** Amendment 1 pairs 1 to 4, 11 to 15 and 10.
- **Item 3:** §2 items 5 and 7, and Amendment 1 item 6.
- **Item 4:** pairs 6 and 8, byte for byte.
- **Item 5:** the Strings pair.
- **Items 6, 7 and 9:** Amendment 1 items 5, 3 and 4, and 7.
- **Item 8:** the commit and the two form gates.
- **ADV-2026-11-27-27:** item 3's second row.
- **Leftover text.** After Amendments 1 and 2, the only text left that rests on an option not taken is conditional on a ruling that went the other way: OPEN-A1's redraft, OPEN-A2's alternative and OPEN-A5's placeholder. None of it is a binding sentence.

## 6. The null-by-name form's Amendment 3 against this §2 item 2

Consistent. Its first pair values the sixth site `source.as_envelope_value()`, as item 2 values the other four `admit_identity` sites.
- T1 asserting `file:id` stays red at that form's red commit for the detail, because there the refusal comes from `:2167` and already carries `file:id`.
- T3 at F-3d asserting `mapped:parcel_key`, with the new mutation, can fail by name.
- That form's §5 "the variant and its wire mapping" and "every `protocol/` file" stay true: that piece changes neither.

---

## Findings, as exact pairs

Each Old is byte-copied from the form file (verbatim) and occurs once there, checked by `<scratch>/mine.mjs`. Each New is in my words. None is the human's wording or the advisor's: these are form text, so the custodian carries them by amendment, with no re-gate (§31).

**V1 (Evidence).** S-R2's negative half cannot fail on this piece's mechanism.
- The declared fixture carries `mapped:parcel_key`, so its `column` is `parcel_key`. `rowPositionOffer` therefore returns null at the column check (`:227`) before the new line is reached.
- M-RD7 is still caught, by the positive half. But no fixture file carries C1's real shape: `column` `id` together with `mapped:id`.
- Pair 1:
  - Old, verbatim: `   - a new `v0-error-identity_unusable-declared.json` with `mapped:parcel_key`.`
  - New: `   - a new `protocol/skp/tests/data/v0-error-identity_unusable-declared.json`, in the shape the engine gives at C1: `column` `id`, the type refusal's `detail` and `message` for a text `id`, `candidate_columns` empty, and `identity_source` `mapped:id`.`
- Pair 2:
  - Old, verbatim: ``file:id` offered, `mapped:parcel_key` not.`
  - New: ``file:id` offered, `mapped:id` not; both name the column `id`, so only `identity_source` tells them apart.`

**V2 (Evidence).** P2's recipe leaves undecided what E-R1's reopen meets first.
- A copy whose first folder still holds the project makes the reopen ask a question first (`asks`, `kernel/src/project/mod.rs:1128-1144`).
- A project this window still holds is refused as `skp.project_open_elsewhere` (`:783-790`; `OPEN_ELSEWHERE_OWN_NOTICE`, `reopenNotices.ts:30`). E-1 (d) holds its project after `choose("(d)")` until another open replaces it (`App.tsx:1688-1694`), and it removes its folder in its `finally`.
- Either answer is a loud red, but a worker could misread it as invalidator (i) or as the falsification.
- Pair 3:
  - Old, verbatim: `a copy of E-1 (d)'s saved project,`
  - New: `a copy of E-1 (d)'s saved project, written before E-1 (d)'s folder is removed and opened only after that folder is gone and another open has replaced E-1 (d)'s project in the window (a first folder that still holds the project makes the reopen ask, `asks` in `kernel/src/project/mod.rs`; a project this window holds is refused as `skp.project_open_elsewhere`),`
- Pair 4:
  - Old, verbatim: `P2 through Open project: refused, the field row `identity_source` `mapped:id`, R-ENG, and no S-1.`
  - New: `P2 through Open project: `e2eOpenProjectFolder` answers `engine.identity_unusable` at its first call (an answer of `question` or `skp.project_open_elsewhere` fails the step by name as not reaching C1), the field row `identity_source` `mapped:id`, R-ENG, and no S-1.`

**V3 (Evidence).** P1's recipe replaces the data file without closing the open that saved it.
- The saved open holds the project's lock, and on Windows the data file too.
- Text-id's K-7 rig closes before it reopens (`kernel/tests/text_id_set_aside_not_saved_or_published.rs:339`).
- Pair 5:
  - Old, verbatim: `save, then replace the data file's bytes at the recorded place with File A's.`
  - New: `save, close it as text-id's K-7 rig does (`rig.close`), then replace the data file's bytes at the recorded place with File A's.`

**W1 (Documentation).** Amendment 1 pair 6's preamble says no wrapped line other than line 177 exceeds 97 columns. That is untrue.
- Measured (`<scratch>/drcheck.mjs`, and `awk` on the form's lines 379 to 389), the continuation lines are 96, 97, 98, 98, 97 and 46 columns.
- The two 98-column lines begin "whose" and "reached only".
- No width rule applies: the repo has no rustfmt.toml, and `error.rs` already has 105-column lines.
- Old, verbatim: `so line 177 becomes 98 columns; no other line exceeds 97.`
- New: `so line 177 becomes 98 columns, as do the continuation lines that begin `/// whose` and `/// reached only`; no other line exceeds 97.`

**W2 (Documentation).** Amendment 1 item 3 records the scope as 51 files.
- By §7's own rules it is 44. The 51 also counts the seven `engine/tests/*.rs` files that name `IdentityUnusable` only with `..`, `b1_projection_hostile_names.rs` among them, which is why the table's first row lists that file.
- Only `engine/tests/identity.rs` destructures without `..`.
- Old, verbatim: `§7's scope is resolved at the base to 51 files`
- New: `§7's scope is resolved at the base to 44 files by its own rule (51 counting the seven `engine/tests/*.rs` that name `IdentityUnusable` only with `..`, as the table's first row does)`

**W3 (Documentation).** §10 says W-R1 proves the kernel-to-wire seam, but W-R1 reads fixture files only. The kernel's real `SkpError` is proven by K-R1 and K-R2.
- Old, verbatim: `  - kernel to wire: the field in `SkpError.fields` (W-R1);`
- New: `  - kernel to wire: the field in `SkpError.fields` as `SkpHost` returns it (K-R1, K-R2), and in the wire fixtures both sides read (W-R1, S-R2);`

**W4 (Documentation).** §2 item 5 places the future-version fixture under `mod.rs`.
- The fixture is in `tests/conformance/fixtures/refusals-any-layer.json`, and the literal is also pinned in `tests/fixtures.rs`.
- Old, verbatim: `5. `protocol/skp/src/v0/mod.rs`: the literal goes to `skp/0.17`, and the future-version fixture to `skp/0.18`.`
- New: `5. `protocol/skp/src/v0/mod.rs`: the literal goes to `skp/0.17`, with its pin in `protocol/skp/tests/fixtures.rs`; the future-version fixture `any-version-skp_0_17` in `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json` goes to `skp/0.18`, renamed as `tests/conformance/README.md` records for each earlier bump.`

---

## Not checked
- The reuse line, because the reuse clone is outside my read set.
- Text-id's form and the recovery form beyond what this form names.
- How a closed dataset leaves the catalog. V2's New states outcomes, not that mechanism.
- I ran no test and observed no mutation. Every red and green above is read from the code.

## Files
- D:/wt/read-1127c/governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md
- D:/wt/read-1127c/state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft.md
- D:/wt/read-1127c/state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft-restatement.md
- D:/wt/read-1127c/state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-form-gate-architect.md
- D:/wt/read-1127c/governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md
- D:/wt/read-1127c/state/directives/ (ADV-2026-11-27-24, -27; -22 item 4)
- D:/wt/read-1127c/docs/PREREGISTRATION-TEMPLATE.md
- D:/wt/read-1127b/engine/src/{error.rs,dataset.rs,identity.rs,fixture.rs}
- D:/wt/read-1127b/kernel/src/{skp.rs,project/mod.rs,project/file.rs,project/strict_json.rs,dataset_ref.rs}
- D:/wt/read-1127b/renderer/src/canonical.rs
- D:/wt/read-1127b/protocol/skp/{SKP-V0.md,src/v0/mod.rs,tests/fixtures.rs,tests/data/,tests/conformance/}
- D:/wt/read-1127b/frontends/shell/src/{admission/AdmissionPanel.tsx,admission/formatRefusal.ts,project/openProject.ts,project/shownText.ts,App.tsx}
- D:/wt/read-1127b/frontends/shell/e2e/{admission-remediation.mjs,regression.mjs}
- D:/wt/read-1127b/KNOWN-LIMITATIONS.md (item 3)
- D:/wt/read-1127b/docs/adr/ADR-016-stable-feature-identity-admission.md
- Scripts: `<scratch>/a1check.mjs`, `a2check.mjs`, `drcheck.mjs`, `nullcheck.mjs`, `mine.mjs`. Scope list: `<scratch>/scope.txt`.
