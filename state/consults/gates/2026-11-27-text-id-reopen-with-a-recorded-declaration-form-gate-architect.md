Reviewed: governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md at main @ 90d7286f191b2f082fc8e4a5f8e1a3a69a919c51, against the code in the read checkout D:/wt/read-1127b at 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e. The C1 piece's form gate, the architect (Opus); its run, from its completion notice only (ADV-2026-11-26-02), was 85 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (16171 bytes, sha256 2bc7dfce4b15ff2acbe0daaa3c89ec2405ce96688e21818108eca77770b6da84), byte for byte below the rule.

---

**Verdict: PASS WITH NOTES.** Form `governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md` read at main @ 90d7286f191b2f082fc8e4a5f8e1a3a69a919c51. Code read at detached text-id head @ 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e.

I read the form as amended: each of Amendment 1's fifteen New texts in place of its Old. Under AUTONOMY §22:
- **Correctness: PASS.**
- **Evidence: PASS, with one finding (E1).** It does not block, because the failure it guards against is a loud red at E-R1, never a false green. Carry it by amendment before any code.
- **Documentation: six findings (D1 to D6), and A1 is owed on another form.** All must be fixed before the merge.

All quotes below are byte-copied from my Reads and marked verbatim. Everything else is paraphrase or my own words. Rulings are cited by id and item.

---

### 1. Class

- **Full form and both gates hold.** The piece adds a wire field and a new literal, which is a §21a category (the data plane or the wire). It also exceeds §21c's size threshold. ADV-2026-11-27-22 item 4 asks for a full form and both gates; the form chose way (a), says why, sent (b) to the advisor as OPEN-A1, and has "Not an OPEN" for the KNOWN-LIMITATIONS bullet. ADV-2026-11-27-24 item 8 is met: the form committed with Amendment 1 and the overlap rows, and the build gates run in two parts (Amendment 1 item 8).
- **Against the template, every section is present.** The form's §8 (base, merge, overlap) is an extra section, so the template's §8 to §10 appear as the form's §9 to §11.
- **Round 25 rules are respected:**
  - the "How red is read" text keeps `verify-mutation` as a check that mutations are recorded, never as an observation of one;
  - the Portability item is present;
  - §7's overrun line names class 8;
  - no hash cites a branch commit.
- **One template gap:** the §9 "Suites" line is missing from the form's §10 (D4).

### 2. ADV-2026-11-27-24 items 1 to 9, and ADV-2026-11-27-27

- **Item 1: true.** §0 "Choice: (a)" and §1's Claim. Way (a) brings the code back to ADR-016 Amendment 3, Decision 1, at line 302 of the ADR at the base ("only beside a refusal of the file's own `id` column in an attempt that declared no column"). `file:id` is exactly that case.
- **Item 2: true, and the five-site claim is confirmed.** A search of the whole tree finds exactly five places that build `IdentityUnusable`:
  - `engine/src/dataset.rs:2077`, `:2098`, `:2156`, `:2167`;
  - `engine/src/identity.rs:382`.
  - No kernel, protocol or shell code builds it.
  - The exhaustive destructures are the `Display` at `error.rs:380` and the kernel arm at `kernel/src/skp.rs:2248`. The match at `dataset.rs:2202` uses `..`.
  - `source` is built at `:2046-2060` and is only ever `IdSource::File` or `IdSource::Mapped`.
  - `as_envelope_value(&self)` at `identity.rs:82-90` returns the `file:id` / `mapped:<column>` vocabulary.
  - The in-module tests are at `:425`, `:434`, `:492` and `:543`, as stated.
  - The one wording defect is D5.
- **Item 3: true.**
  - §2 item 5 gives `skp/0.17` with the future-version fixture at `skp/0.18`.
  - §8 gives the protocol place.
  - Amendment 1 item 6 gives the order (identity route, then text-id, then this piece), the draft PR, and the re-check before the bump.
  - The recovery form's Amendment 14 records that it comes after this piece.
- **Item 4: true.**
  - D-R2 (i) is the draft's.
  - D-R1's New, with each line break plus its `    /// ` prefix read as one space, matches the ruling's first fence byte for byte.
  - D-R2 (ii)'s New matches the second fence byte for byte, without "New: ".
  - Each Old matches the code: `error.rs:177-183`, `AdmissionPanel.tsx:219`, and the span inside `:222`.
  - I checked every clause of the advisor's two texts against the code, and they hold. I also checked the reopen paths the texts do not name:
    - The choice re-runs the refused attempt's own `reopen` options (`rowPositionOptions`, `:234-237`).
    - A Copy answer rewrites the project file before the open (`project/mod.rs:797-799`), but it does not change the recorded admission.
  - No replacement words are owed.
- **Item 5: true.** The Strings pair says there is no owner line, and that the field row shows beside every refusal of this code, sorted by key (`formatRefusal.ts:38`, `RefusalBlock.tsx:35-37`), with no placeholder mark. §1's "direct open" sentence is the one leftover that contradicts this (D1).
- **Items 6, 7 and 9: true.**
  - Item 6 (the words): Amendment 1 item 5.
  - Item 7 (the overlap): the item 3 table and item 4.
  - Item 9 (the port): Amendment 1 item 7 and §10's Port line.
  - One dangling "as above" in the table (D6).
- **ADV-2026-11-27-27: true.**
  - The table's second row names `saveProject.test.ts`, A's head 38e9209d, and item 2's order.
  - The text-id form at main carries Amendment 17 (class 2, the shared path with A), as that ruling's item 3 asks.

### 3. Architecture

- **The field's place is right.**
  - `identity_source` is a string in `SkpError.fields`, the error map of the control plane (SKP-V0 §5; docs/10).
  - It carries the variant's own field under its own name, which meets SKP-V0 §5 as the ruling reads it, and it is not the `declared` key that `crs_assertion_conflict` already uses.
  - SKP-V0 §4 item 13 makes any field change a new literal, and `skp/0.17` is assembled under conditions (i) to (iv) (`SKP-V0.md:312-328`), with the PR kept a draft until text-id has merged.
  - The data plane is untouched, and no MCP adapter exists in the tree.
- **The ADR process is followed.**
  - The departure from Amendment 3, Decision 1 is the code's, at text-id's head. The form records it in §0 and §10, closes it in code, amends no ADR (§1), and forbids any edit to ADR-016 (§9 item 8).
  - No ADR-016 clause lists the refusal's fields (Decision §1 to §7, the SETTLED block, Amendments 1 to 3), so an added field needs no amendment.
  - Decisions 2 and 6 are kept: K-R1 (i) and (ii).
- **CRS and data-state words:** none.
- **docs/01 (engine messages state engine facts; owners state consequences):** the field is an engine fact, and no engine message changes.
- **The seams are written against interfaces that exist:**
  - **Engine to kernel:** the kernel arm's real destructure. K-R1 runs through `open_project_command` (`project/mod.rs:902`); K-R2 through `SkpHost::open_dataset`.
  - **Kernel to shell, end to end:** E-R1 in the real app.
  - **Reopen text bound:** at a reopen the refusal passes through `shownRefusal` before `rowPositionOffer` reads it (`openProject.ts:81`). `file:id` comes through unchanged, and a mangled value fails closed. E-R1's E-1 (d) control covers the case where the choice is still offered.
  - **Shell helper:** `fieldValue` exists with the signature the form uses (`formatRefusal.ts:45`).
  - **Callers:** each new parameter or field has a product caller.
- **Note on a NUL in the column name:**
  - At `:2098`, `identity_source` carries a NUL-bearing name raw (`mapped:key\0x`), just as `column` already does.
  - The B1 hostile-names checks cover `detail` and `Display` only (`engine/tests/b1_projection_hostile_names.rs:471-478`).
  - This is not a new class of exposure. N-R1's row already predicts exactly that value.

### 4. The null-by-name form's §2 against this form's §2 item 2

**A1 (Architecture). Owed on the null-by-name form, by an amendment before its code; it does not block this form.**
- After this piece, the null-by-name form's new null refusal (its §2.1, step 2) builds `IdentityUnusable` a sixth time.
- The compiler forces the new field to be present, but nothing forces its value. A site written as `IdSource::File.as_envelope_value()` would give F-3d (declared `parcel_key`) the value `file:id`, which is wrong.
- The rows that should catch this assert only `column` and `detail` (T1, T3, K1).
- Three of its sentences also become untrue on this piece's head.

Pairs for that file (each Old occurs once there; byte-copied, verbatim):
- **First pair.**
  - Old: `Only `detail`'s value is new.`
  - New (my words): `Only `detail`'s value is new. On text-id-reopen-with-a-recorded-declaration's head the variant also carries `identity_source`, and the null site values it `source.as_envelope_value()`, as the four scan and lookup sites in `admit_identity` do.`
- **Second pair.**
  - Old: `carrying the fields `column`, `detail` and `candidate_columns``
  - New: `carrying the fields `column`, `detail`, `candidate_columns` and, on that piece's head, `identity_source``
- **Third pair.**
  - Old: `  - its field `column` is `id`;`
  - New: `  - its field `column` is `id`;` followed by a new line `  - on that piece's head, its field `identity_source` is `file:id`;`
- **Fourth pair.**
  - Old: `  A null in a native `id` meets all four.`
  - New: `  A null in a native `id` meets all of them; a null in a declared `id` gives `mapped:id` and is not offered.`
- **The same amendment also needs:**
  - T1 asserting `identity_source == "file:id"`;
  - T3's F-3d asserting `mapped:parcel_key`;
  - a mutation that values the null site `IdSource::File.as_envelope_value()`, observed failing T3 at F-3d.
- The class is the custodian's to choose; class 9 fits best, since it adds a §2 value and a §4 assertion.

### 5. Leftover text after the pairs are read in

- **D1 and D2** are the leftovers.
- **The OPEN questions section** leaves no binding sentence untrue:
  - OPEN-A1's redraft and OPEN-A5's `[P6 placeholder]` are both conditional on rulings that went the other way.
  - OPEN-A2's alternative is a question, not a statement of what the form does.
  - §9 item 1's condition (OPEN-A1 to OPEN-A3 ruled) is met by ADV-2026-11-27-24 items 1 to 3.
- **§0's "the variant does not carry that fact"** is still true at the base.

### 6. §7, §9 (stops), §10, §11

- **§7 Scope covers §2 and §4 as amended.** I resolved it at the base:
  - the only engine test that destructures without `..` is `engine/tests/identity.rs:119`;
  - no kernel test builds the variant;
  - the shell files holding the literal, the conformance fixtures and the `tests/data` files are all covered by the "each" lines;
  - `regression.mjs` and `formatRefusal.test.ts` assert no field set that the change would break.
- **Size:** I count about 44 files that must change, under the 50-file ceiling. The estimate of about 750 lines is under the 900-line ceiling.
- **The 51-file resolution in the table** appears to include `engine/tests/b1_projection_hostile_names.rs`. Both of its destructures carry `..` (`:471-475`, `:783`), so by §7's own rule it is not in scope. The row's "No" is harmless.
- **Stops (form §9):** all are checkable. Item 5 as amended reads right.
- **§11 "None yet."** stands, read together with Amendment 1, which says so.
- **Invalidator (i)** will not fire on the recorded shape. `parse_admission` reads `identity` as a closed object with the one member `column` (`kernel/src/dataset_ref.rs:676-681`), and a save after a mapped open writes exactly that (`DatasetRef::linked`, `:219-221`). P1 is buildable as declared.

---

### Findings, each as an exact pair for one amendment (each Old occurs once in the form file; Olds byte-copied, verbatim; News are my words)

**E1 (Evidence).** P2's recipe and the reader's strict spelling check.
- The project reader refuses any bytes that are not its own canonical spelling. `read_project` calls `check_spelling` (`kernel/src/project/file.rs:157`; `kernel/src/project/strict_json.rs:103-110`), whose layout is two-space indent, `": "` after a key, one member to a line, and a final LF (`renderer/src/canonical.rs:170-218`).
- A "parse and write" that misses one byte is refused as a project-file refusal before the engine is reached. E-R1 and the walkthrough row would then fail to reach C1, and a worker could misread that as invalidator (i).
- §0's hand-edit reach still holds, but only for an edit in that exact spelling.
- Old: `with the recorded identity set to `{"column":"id"}` by JSON parse and write.`
- New: `with the recorded identity set to `{"column":"id"}`, written in the project reader's own spelling (the line-oriented layout of `to_line_oriented_string` in `renderer/src/canonical.rs`, then one LF), which `check_spelling` in `kernel/src/project/strict_json.rs` checks byte for byte at every read. A refusal of P2 by the project-file reader is a defect of the step, not invalidator (i). The walkthrough row gives the operator the edit in that spelling.`

**D1 (Documentation).** §1 contradicts the Strings paragraph and ADV-2026-11-27-24 item 5.
- Old: `  - A direct open behaves as today.`
- New: `  - A direct open is offered the choice as today; its refusal block, like every refusal of this code, shows one more field row, `identity_source` (ADV-2026-11-27-24 item 5).`

**D2 (Documentation).** A stale pointer to a question that has been ruled.
- Old: `They go to OPEN-A4.`
- New: `OPEN-A4 is ruled by ADV-2026-11-27-24 item 4: D-R2 (i) as drafted, and the advisor's texts for D-R1 and D-R2 (ii).`

**D3 (Documentation).** The line names T-11, but T-11 does not drive the offer: its refusals carry `fields: {}` (`frontends/shell/src/App.reopen.test.tsx:414-421`). Every offer case in `AdmissionPanel.test.ts` uses `ID_REFUSAL`.
- Old: `- T-11 and any other test that drives the offer from a hand-made refusal gain the field.`
- New: `- No other test at the base drives the offer from a hand-made refusal: every offer case in `AdmissionPanel.test.ts` uses `ID_REFUSAL`, and T-11 in `App.reopen.test.tsx` sends refusals with no fields, so it is offered nothing before and after this piece. A test found to drive the offer otherwise gains the field.`

**D4 (Documentation).** The template's §9 Suites line is missing.
- Old: `- **Port:** E-R1 needs the port (an e2e step, in this piece's own port turn). Nothing else does.`
- New: the Old line, then a new line: `- **Suites:** before either build gate, at the head: the engine, kernel and protocol test suites, the shell's unit tests and type check, and the pre-gate self-checks of `governance/AUTONOMY.md` §6a, each green; a `verify-mutation` run is read only as a check that each mutation is recorded.`

**D5 (Documentation).** `:2111` comes before `:2156` and `:2167` in line order. The claim is true by control flow only, because the `skip` arm returns.
- Old: ``source` is borrowed there and moved only at `:2111` and `:2178`, after every site.`
- New: ``source` is borrowed there and moved only at `:2111`, inside the `skip` arm, which returns before the scan, and at `:2178`, after the last site; no site follows a move on any path.`

**D6 (Documentation).** The first row of the overlap table says "as above", but there is nothing above it.
- Old: `| `engine/tests/b1_projection_hostile_names.rs` | No: as above. |`
- New: `| `engine/tests/b1_projection_hostile_names.rs` | No: no piece in progress and no open PR owns it (ADV-2026-11-27-27 item 4). |`

### Under the wording-blocks rule (§31)

- None of these findings blocks, and none changes what the code does.
- D1 to D6 and E1 are form text, not the human's wording. The custodian carries them by amendment, with no re-gate.
- D-R1 and D-R2 are the advisor's words. Their clauses hold, and I offer no replacement.

No ADR skeleton is owed: no decision is missing.

### Not checked

- I did not check the reuse line on line 12 against tools/reuse.mjs: the reuse clone was outside my read set.
- I ran nothing.

### Files read
- D:/wt/read-1127c/governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md
- D:/wt/read-1127c/state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft-restatement.md
- D:/wt/read-1127c/state/directives/ (ADV-2026-11-27-22 item 4, -24, -27)
- D:/wt/read-1127c/governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md
- D:/wt/read-1127b/engine/src/{error.rs,dataset.rs,identity.rs}
- D:/wt/read-1127b/kernel/src/{skp.rs,project/mod.rs,project/strict_json.rs,dataset_ref.rs}
- D:/wt/read-1127b/frontends/shell/src/admission/AdmissionPanel.tsx
- D:/wt/read-1127b/docs/adr/ADR-016-stable-feature-identity-admission.md
