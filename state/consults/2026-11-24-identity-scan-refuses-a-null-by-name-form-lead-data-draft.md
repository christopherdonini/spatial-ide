# identity-scan-refuses-a-null-by-name: the full form, lead-data's draft (R6 of the text-id consult)

*Filed by the custodian: node:identity-scan-refuses-a-null-by-name@form-lead-data-draft. A draft of a full form, not committed and not gated; its words for the refusal are proposals held under a placeholder mark, the words being the advisor's after its gates; placed by the advisor's ADV-2026-11-24-23, item 5 (state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-23-the-humans-message-of-09-52z-placed-every-case-settled-not-an-approval-identity-route-first-r6-its-own-piece.md). Dispatched at 2026-11-24T10:40:14Z to lead-data on opus, its brief byte for byte (brief-r6-null-form-lead-1.md in the scratch folder, 11169 bytes, sha256 93cf78563f809f663f2bf822e712124397e23c5dce911cded189cab9bdf4f0e7) with that ruling in it byte for byte; read only in the detached checkout D:/wt/read-1124f at main 20ed759b71064079792541f2a76cf804a6c84bc1; its run: Read 37, Grep 26, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T10:40:14Z to 2026-11-24T10:50:48Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T10:50:48Z; no message was sent to it. Its recommendations are for a ruling; nothing is placed by this filing. Filed below the rule, 32549 bytes, sha256 ec1fa207255926be419e7f773cdb433e230baab2aa0c24ff134feba7be921f96, byte for byte, nothing masked, with one final newline added.*

---

This is lead-data's draft of the full form for `identity-scan-refuses-a-null-by-name`. I wrote it read-only at 20ed759b in `D:/wt/read-1124f`. It confirms R6 from the code, and it finds that text-id's offer already follows a null refusal.

---FORM---
# Preregistration: identity-scan-refuses-a-null-by-name (full form)

**Status.** This is a draft by lead-data. Its words for the refusal (§2.4, W-1 and W-2) are proposals held under a placeholder mark: the words are the advisor's, from this draft after its gate (ADV-2026-11-24-23 item 5). No code is written until an amendment carries the advisor's words in, and until text-id's build has a pushed head with its suites green (§8).

- **Proposed path:** `governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md`
- **Node:** `identity-scan-refuses-a-null-by-name`, lane engine. The custodian names and places it under ADV-2026-11-24-23 item 5.
- **Authority:**
  - ADV-2026-11-24-23 item 5. It is not in the tree at 20ed759b; the custodian adds its filed path at the first commit.
  - ADV-2026-11-23-25 item 2: of this piece and the recovery offer, whichever can start first builds first.
  - The class rule: ADV-2026-11-16-06 item 2 (a) (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25` @ 20ed759b).
- **Reuse index:** the custodian ran tools/reuse.mjs in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, as `node tools/reuse.mjs identity column null refusal`, exit 1. Its output, byte for byte:
  `No prior art recorded for "identity column null refusal". Research it before planning an implementation.`
  That is a miss. Nothing is reused, and the change below is drafted from this repository's code alone.
- **Evidence, not Authority:**
  - the architect's consult on a text `id` as a lasting identity, R6 (on main at a587fab5 as `state/consults/2026-11-24-a-text-id-as-a-lasting-identity-architect-consult.md`; not in the tree at 20ed759b, and not read by me);
  - the ADR-016 Amendment 3 draft's own reading of the same fact (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:129` @ 20ed759b).
- **Drafted by:** lead-data, on the custodian's brief, reading only at 20ed759b71064079792541f2a76cf804a6c84bc1 (its `engine/`, `kernel/`, `protocol/`, `frontends/`, `docs/` and `governance/forms/` are the same as main a587fab5). Every `path:line` here is a historical pin at 20ed759b. The custodian adds each span's sha256 at the first commit, as text-id's Amendment 1 item 3 did. Self-references are by section and item.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and names what it touches or invalidates.
- **Gates:** architect and reviewer. This is a full form (§1).

## §0 Disclosure

**R6, read against the code. The reading holds.**
- The scan is one statement that selects `count(*)`, `count(DISTINCT "<c>")`, `min` and `max` over the column (`engine/src/dataset.rs:2045-2050` @ 20ed759b).
- It runs once, inside the cancel guard, through `run_identity_scan` (`engine/src/dataset.rs:2063-2074` @ 20ed759b, `:2108-2149`).
- The negative check runs first, on `min` (`:2076-2087`). The repeat check refuses when the distinct count differs from the row count, with a detail that at least two features share an identity (`:2088-2098`).
- A hypothesis, from my knowledge of SQL and not from a repository read: `count(*)` counts every row, while `count(DISTINCT c)` and `min`/`max` skip nulls.
  - On that reading, one null in an otherwise unique column of n rows gives n distinct-eligible rows but only n−1 distinct values. The open is then refused by the repeat arm with a false detail.
  - Its discriminator is §4's T1, red at the red commit (§4, "Red").
  - The draft amendment's author recorded the same reading and did not run it (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:129` @ 20ed759b).
- **The open's outcome does not change, only its reason.** A null-bearing file is refused today, as `EngineError::IdentityUnusable` naming the column. After this piece it is refused as the same variant, naming the same column, with a true detail.

**Which types reach the scan.**
- The type check runs first and reads no value (`engine/src/dataset.rs:2027-2028` @ 20ed759b).
- It admits exactly the eight integer widths (`engine/src/identity.rs:333-335` @ 20ed759b; ADR-016's Note 2026-11-09, `docs/adr/ADR-016-stable-feature-identity-admission.md:246` @ 20ed759b).
- So "every type admission takes" means those eight. A null in any other type is refused for its type first, unchanged.

**Paths this piece leaves as they are (found while reading).**
- The `skip_uniqueness_check` arm returns before the scan (`engine/src/dataset.rs:2030-2039` @ 20ed759b). A null there reaches the stream, which refuses it as `EngineError::Query` (`engine/src/stream.rs:2670-2675` @ 20ed759b). The wire has no field for that skip (`docs/adr/ADR-016-stable-feature-identity-admission.md:161-164` @ 20ed759b), so no user reaches it.
- The experimental row-group seam has its own null refusal (`engine/src/rowgroup.rs:863` @ 20ed759b). It is not on the product path.
- The session-ordinal arm reads nothing (`engine/src/dataset.rs:1984-2011` @ 20ed759b).

**What text-id's form changes in this function** (`governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md`, its §2 item 1 at `:65-75` @ 20ed759b, with its Amendments 2 to 6):
- `admit_identity` gains `set_aside_file_id: bool`, with arms (a) to (e).
  - (c) runs the existing native path unchanged: the type check, then the scan.
  - (d) maps any `EngineError::IdentityUnusable` from (c) to the session tier.
  - Amendment 3 item 2 (its C4) removes `id` from (d)'s candidates.
- `engine/src/error.rs`:
  - a new variant `IdentitySetAsideRefused`;
  - the `IdentityUnusable` Display loses its last sentence (its Amendment 2 item 3).
- `engine/src/identity.rs`: the type refusal's second sentence changes (its Amendment 3 item 5).
- Text-id's form names no change to the scan's SQL, to `run_identity_scan`, or to the negative and repeat checks. Their lines move.

**How this form's lines are drawn.** Every line here is drawn against main's code now (20ed759b, the same as a587fab5), and re-read on text-id's head before any code (§8, "Re-read at the base").

## §1 Claims and class

- **Claim:**
  - A null in the identity column is refused by name, for each of the eight integer widths, native or declared, in the same scan with no second pass. The detail says the column is null in so many rows.
  - A file with no null keeps today's outcome and today's details byte for byte, the repeat detail and the negative detail included.
- **Class: full**, both gates, by ADV-2026-11-16-06 item 2 (a). The piece meets:
  - **What the user is told about the state of their data (a refusal).** The refusal detail a user reads changes for every null-bearing file (§2.3).
  - **Over 260 changed lines.** The estimate is about 578 (§7).
- **It does not meet:**
  - **The wire.** There is no new code, field, literal or fixture (§2.3).
  - **An ADR's text** (OPEN-A6).
  - **CRS.**
  - **Persistence.** Nothing new is written (§2.3).
  - **Security.**
  - **A seam.** No interface changes on either side of the engine-to-kernel seam; K1 proves the existing one carries the new detail.
  - **Concurrency or cancellation, by change.** The guarded closure's body changes, but it stays one statement inside one guard. The existing cancel test stays green unchanged (§5).
- **No performance claim** (docs/08). The scan gains one aggregate in the same pass. Its cost is unmeasured and not claimed.
- **Portability:** this is not an OS-dependent feature, so it carries no R3 item. The tests run on CI's Windows and Linux L1 entries.

## §2 The change, stated before it is applied

**2.1 `engine/src/dataset.rs`, `admit_identity` and `run_identity_scan`** (lines at 20ed759b, re-read at the base):
- **The scan** (`:2045-2050`) gains `count("<c>")`, the count of non-null values, in the same `SELECT`. It is still one statement, one guarded call and one counter increment (`:2063-2069`).
- **`run_identity_scan`** (`:2108-2149`) returns that count beside the others. It reads the count as the existing counts are read (`:2122-2127`).
- **The checks, in this order** (OPEN-A2):
  1. The negative check (`:2076-2087`), unchanged.
  2. **New:** if `nulls = rows − present` is above zero, the scan refuses with `EngineError::IdentityUnusable`. The column is the same, and so are the candidates (`identity::candidate_identity_columns(schema)`). The detail is:
     - W-1 when the non-null values are distinct (`distinct == present`);
     - W-2 when they are not (OPEN-A3).
  3. The repeat check (`:2088-2098`), unchanged in text. It is reached only when `nulls == 0`, where `present == rows`.
- **The admitted arm** (`:2100-2105`) is unchanged.
- **Comments made untrue, corrected in the piece:**
  - "One pass, three questions" (`:2041-2044`), which becomes four;
  - the counter comment's "(a duplicate or negative value)" (`:2056`), which gains a null;
  - the doc of `identity_verification_scans` (`:78-86`), which names T7 among its callers, as the instrument exemption requires.
- **Not changed:**
  - the type check;
  - the not-addressable, no-such-column, skip and session-ordinal arms;
  - the cancel guard;
  - the min/max reading and its comment (`:2128-2147`).

**2.2 `engine/src/error.rs`.** The `IdentityUnusable` doc (`:151-156`) lists four failures that "share a variant and are distinguished by `detail`" (`:155-156`). It gains a null in the column as a fifth. The variant, its fields and its Display are not changed by this piece. Text-id changes the Display before this piece is built.

**2.3 What the refusal reaches, step by step.**
1. **Engine.** The same variant, `IdentityUnusable { column, detail, candidate_columns }` (`engine/src/error.rs:163-167` @ 20ed759b). Only `detail`'s value is new.
2. **Wire (SKP).**
   - `error_of` maps the variant to `identity_unusable`, carrying the fields `column`, `detail` and `candidate_columns` (`kernel/src/skp.rs:2223-2237` @ 20ed759b). The prefixed code is `engine.identity_unusable` (`kernel/tests/skp_admission_remediation.rs:253` @ 20ed759b).
   - The message is the Display, which holds the detail.
   - **Nothing new goes on the wire.** There is no new code, field or literal. `protocol/` is untouched, so this piece holds no `protocol/` place under rule (00).
   - No wire fixture pins the repeat detail:
     - the populated fixture holds the no-such-column detail (`protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:1-9` @ 20ed759b);
     - the conformance fixture holds the message `"x"` (`protocol/skp/tests/conformance/fixtures/responses-accept.json:94-103` @ 20ed759b).
3. **Shell.**
   - The refusal's message is shown verbatim, with no rewording (`frontends/shell/src/admission/formatRefusal.ts:12-16` and `:34-40` @ 20ed759b).
   - The code opens the identity form family (`frontends/shell/src/admission/AdmissionPanel.tsx:34` @ 20ed759b).
   - On text-id's head, the row-position choice is offered beside it when the condition in §2.5 holds.
   - No shell file changes.
4. **A saved project's reopen.**
   - The reopen sends the recorded admission through `open_under` and returns the engine's refusal (`kernel/src/project/mod.rs:818-832` @ 20ed759b).
   - The shell opens no form at a reopen refusal (`frontends/shell/src/admission/AdmissionPanel.tsx:276-277` @ 20ed759b) and places the owner line `ENGINE_REFUSAL_NOTICE` beside an `engine.*` code (`frontends/shell/src/project/openProject.ts:84-87` @ 20ed759b).
   - A reopen meets the null refusal in two ways:
     - (i) a project saved after a row-position open of a null-bearing file (text-id) records no identity, so its reopen is refused again and text-id's reopen offer follows (its K-7, S-T4);
     - (ii) a project whose file gained a null after the save.
   - Nothing that is saved changes.

**2.4 The refusal's words (the advisor's; held under the mark `[W placeholder]`).** The code carries no mark: block-on-sight 5. Proposed in OPEN-A1:
- **W-1:** `the column is null in {nulls} of {rows} rows, so not every feature carries an identity`
- **W-2:** W-1, then `; the other {present} rows carry only {distinct} distinct values, so at least two of those features share an identity`

Each clause, checked against the code:
- `{rows}` is `count(*)`, the file's feature count, since each row is one feature.
- `{nulls}` is `rows − count(c)`.
- `{present}` is `count(c)`.
- `{distinct}` is `count(DISTINCT c)`, which counts only non-null values.
- "share an identity" holds by count: `distinct < present` means at least two of the non-null values are equal.
- Neither word set states a consequence outside the engine, under the rule that engine messages state engine facts.
- The Display around them is text-id's head's, ending as ADV-2026-11-23-36 item 2 gives it.

**2.5 Text-id's offer after a null refusal.** It follows, under text-id's form as written. No condition changes.
- **Engine.** Text-id's arm (d) admits on the session tier on any `EngineError::IdentityUnusable` from (c) (its §2 item 1 (d), `:71` @ 20ed759b). The null refusal is that variant, raised inside (c)'s scan.
- **Shell.** The offer's condition is (its §2 item 12, `:119-123` @ 20ed759b):
  - the refusal is `engine.identity_unusable`;
  - its field `column` is `id`;
  - `options.identity` is unset;
  - `options.setAsideFileId` is unset.

  A null in a native `id` meets all four.
- **The ADR draft.** Its Decision 2 admits the choice "Only when they refuse the column" (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:54` @ 20ed759b). Its Context counts "the value checks run with the scan" (`:50`), and the null check is one of them.
- **Today, without this piece.** A null-bearing file already reaches arm (d), through the repeat refusal. This piece changes the detail the user reads beside the offer, not whether the offer appears.
- K2 (§4) pins the engine half on text-id's head.

**2.6 `engine/src/fixture.rs` (test support, behind the `fixture` feature; OPEN-A4 (A)).**
- **Added:** one identity mode, `IdentityMode::NullBearing { width, column, values }`, written through `write_geoparquet` like every other mode.
  - `width` is a new eight-variant enum: the six of `NarrowWidth` (`:574-581`) plus `Int64` and `UInt64`.
  - `column` reuses `NarrowColumn` (`:585-590`).
  - `values` is one of `NoNull`, `OneNull`, `OneNullAndARepeat`, `OneNullAndANegative` or `AllNull`.
  - The field is written nullable. Row `r` holds `r`.
  - `OneNull` writes row 0 as null.
  - `OneNullAndARepeat` also writes row 2 with row 1's value.
  - `OneNullAndANegative` also writes row 1 as −1, on a signed width only.
  - `AllNull` writes every row as null.
- **It refuses, never wraps:**
  - when `features` exceeds what the width holds;
  - for `OneNullAndANegative` on an unsigned width.

  Both are refused before the first row, as `NarrowInteger`'s writer refuses (`:558-563`).
- **Arms:** one each in `schema()` (`:754-770`), in the value match (`:1236-1251`) and in the column finish (`:1312-1319`).
- **Unchanged:** every existing mode, the field nullability of those modes, and the geometry seeding.

**2.7 `engine/README.md`, the owner's index (pointers only).**
- The Open and admission row (`:539`) gains T1's pointer.
- The preregistration list (`:557`) gains this form's path.
- Lead-data writes them at the merge.

## §3 Fixtures, outcomes predicted before code

Each fixture has 100 features, except F-5 (2,000). Every fixture is generated; none is copied.

| row | fixture | today (predicted, from §0) | after this piece (predicted) |
|---|---|---|---|
| F-1 | `NullBearing{UInt64, Id, OneNull}` | refused, `column` `id`, repeat detail with 100 rows and 99 distinct values | refused, `column` `id`, W-1 with nulls 1, rows 100 |
| F-2 | `NullBearing{UInt64, Id, OneNullAndARepeat}` | refused, repeat detail, 100 and 98 | refused, W-2: 1 of 100; the other 99 carry 98 |
| F-3 | `NullBearing{w, Id, OneNull}`, w each of the eight widths | refused, repeat detail | refused, W-1, 1 of 100, for each w |
| F-3d | `NullBearing{UInt32, ParcelKey, OneNull}`, declared `parcel_key` | refused, `column` `parcel_key`, repeat detail | refused, `column` `parcel_key`, W-1 |
| F-4 | `NullBearing{w, Id, NoNull}`, w each of the eight widths | admitted, `verified-at-open-full-file`, verified rows 100, max 99 | the same, unchanged |
| F-5 | `DuplicateIds` (existing; 2,000 features) | refused, the repeat detail with 2,000 rows and 1 distinct value | the same detail, byte for byte |
| F-6 | `NullBearing{Int32, Id, OneNullAndANegative}` | refused, the negative detail with −1 | the same, unchanged (OPEN-A2) |
| F-7 | `NullBearing{UInt64, Id, AllNull}` | refused, repeat detail, 100 and 0 | refused, W-1, 100 of 100 |

## §4 Tests, and the mutation per new test

**Red.** Red is read at a commit that holds §2.6 and the tests, and none of §2.1. The rows below give each test's state there:
- **Red at that commit, for its named reason:** T1, T2, T3 and K1.
- **Guards, green at that commit:** T4, T5, T6, T7 and K2. Each is green because it pins today's behaviour, and its proof is its mutation.

No test's red is a compile error. Green is read at the head. Each mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it.

**Engine: `engine/tests/identity_null_refusal.rs` (new).** Native opens go through `Dataset::open`; declared opens go through `Dataset::open_with_declared_identity`.

| id | test | fixture | asserts | red because | mutation |
|---|---|---|---|---|---|
| T1 | `a_single_null_in_an_otherwise_unique_integer_id_is_refused_by_name_as_a_null` | F-1, F-7 | `IdentityUnusable`, `column == "id"`, `detail` equals W-1 rendered; `detail` does not contain `share an identity` | the repeat detail | M-1: the null check removed |
| T2 | `a_null_beside_repeated_values_is_refused_naming_both` | F-2 | `detail` equals W-2 rendered | the repeat detail | M-2: the null refusal always gives W-1 |
| T3 | `a_null_is_refused_by_name_in_every_integer_width_admission_takes` | F-3, F-3d | W-1 for each width; `column` is `parcel_key` for F-3d | the repeat detail | M-3: the null check runs only for `Int64` and `UInt64` |
| T4 | `a_nullable_integer_id_holding_no_null_is_still_admitted_in_every_width` | F-4 | admitted, `VerifiedAtOpenFullFile`, `verified_rows == Some(100)` | (guard) | M-4: refusal on `field.is_nullable()` in place of the count |
| T5 | `the_repeated_values_refusal_is_unchanged_when_no_value_is_null` | F-5 | `detail` equals today's repeat detail exactly, as `dataset.rs:2091-2095` @ 20ed759b formats it, with 2,000 and 1 | (guard) | M-5: `nulls` computed as `rows − distinct` |
| T6 | `a_null_beside_a_negative_value_keeps_the_negative_refusal` | F-6 | `detail` contains `negative value (-1)` | (guard) | M-6: the null check placed before the negative check |

**Engine: `engine/tests/identity_null_refusal_scan_count.rs` (new; exactly one `#[test]`, for the reason `engine/tests/admission_instruments.rs:13-23` @ 20ed759b records).**
- **T7:** `a_null_refusal_issues_exactly_one_verification_scan`. F-1 opened natively; `identity_verification_scans()` delta is exactly 1. It is a guard. M-7: the null count read by a second guarded call over the file, so the delta is 2.
- Declared: T7 proves one guarded scan, not one statement. A second statement inside the same guarded call is caught by block-on-sight 1, at review.

**Kernel: `kernel/tests/skp_admission_remediation.rs` (OPEN-A5), through `SkpHost::open_dataset`.**
- **K1:** `a_null_in_the_files_own_id_reaches_the_wire_as_identity_unusable_naming_the_null`. F-1:
  - the code is `engine.identity_unusable`;
  - `fields.column` is `id`;
  - `fields.detail` is W-1 rendered;
  - the `message` contains that detail.

  Red: the repeat detail. M-8: the null refusal raised as `EngineError::Query`, so K1 fails at the code.
- **K2 (text-id's head):** `a_null_in_the_files_own_id_opens_by_row_position_when_set_aside`. F-1 with text-id's `set_aside_file_id: true`:
  - it opens;
  - `describe.identity.source` is `session-ordinal:file_row_number`;
  - `set_aside_column` is `id`.

  It is a guard, because on text-id's head the repeat refusal already reaches arm (d). M-8, observed against K2 too: `Query` passes (d) through, so the open is refused. K2 is written to text-id's interface as it stands at the base (§8).

**Existing tests that pin today's detail, and stay green unloosened:**
- `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`. It checks that the detail contains `distinct` (`engine/tests/identity.rs:105-136` @ 20ed759b).
- `frontends/shell/e2e/admission-remediation.mjs`, step DUPKEY'. It compares the whole message, on the plain open and on the declared submit (`:87-96`, `:487-501` @ 20ed759b). It is unchanged by this piece, since `dupkey-refused.parquet` holds no null. Text-id edits its last sentence earlier.
- `kernel/tests/skp_admission_remediation.rs::declared_identity_naming_a_non_unique_column_is_refused`. It checks the code and the column only (`:230-255` @ 20ed759b).
- `engine/tests/identity.rs::a_negative_identity_value_is_refused_because_it_cannot_widen_into_u64` (`:250-268`), and `skipping_the_uniqueness_check_is_recorded_rather_than_hidden` (`:295-325`).
- `engine/src/dataset.rs::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled` (`:2264-2295`).
- `engine/tests/admission_instruments.rs`, and text-id's scan-count test at its head.

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's right-hand column. Every red test is red at the red commit for its named reason and green at the head. Every mutation fails its own test.
- **Declared unchanged:**
  - every outcome and detail for a file with no null;
  - the variant and its wire mapping;
  - the scan count per open;
  - the skip, not-addressable, session-ordinal and set-aside arms;
  - nothing saved, published or recorded in a session history;
  - every shell file;
  - every `protocol/` file;
  - the DUPKEY' message.
- **Invalidators** (each stops the piece and goes to the custodian):
  - T1 green at the red commit, which would mean §0's hypothesis is wrong; recorded as class 2;
  - any existing test changing outcome;
  - text-id's head changing the scan's shape (a second statement, or the checks moved out of one function);
  - any path outside §7;
  - K2's premise absent at the base (text-id's arm (d) not catching `IdentityUnusable`).
- **Falsification:** at the head, a null-bearing file in any of the eight widths refused with a detail that names a shared identity when no non-null value repeats; or any no-null file whose detail differs from today's.

## §6 Instruments

- `identity_verification_scans` (`engine/src/dataset.rs:87` @ 20ed759b) is an existing assertion instrument. Its doc gains T7's name (§2.1).
- There is no measurement and no new `pub` item outside the `fixture` feature.

## §7 Ceilings and Scope

**Estimate:**

| path | what | lines |
|---|---|---|
| `engine/src/dataset.rs` | the aggregate, the scan's return, the null check, W-1 and W-2, three comments, the counter's doc | ~45 |
| `engine/src/error.rs` | `IdentityUnusable`'s doc | ~4 |
| `engine/src/fixture.rs` | §2.6 | ~115 |
| `engine/tests/identity_null_refusal.rs` (new) | T1 to T6 | ~270 |
| `engine/tests/identity_null_refusal_scan_count.rs` (new) | T7 | ~55 |
| `kernel/tests/skp_admission_remediation.rs` | K1, K2 | ~85 |
| `engine/README.md` | two pointers | ~4 |
| **total** | | **~578** |

- **Ceilings:** at most 650 changed lines (insertions plus deletions), over at most 7 files, by the counting command below. An overrun is class 8, and this line is never edited to match.
- **Scope, exactly:** the seven paths above.
- **Counting:** `git diff --numstat <base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, read at a named commit, where `<base>` is the recorded base.

## §8 Base, re-read, overlap

- **Base:** text-id's head, after its build has a pushed head with its suites green (ADV-2026-11-24-23 item 5). That head takes in the identity route and the heads its own base names. The commit is recorded. This piece is never built on the recovery offer's head, and does not wait for it (ADV-2026-11-23-25 item 2).
- **Re-read at the base, before code.** The worker re-reads, at the base:
  - every line in §2.1 and §2.2;
  - text-id's (c) and (d);
  - K2's request member;
  - `skp_admission_remediation.rs`'s helpers.

  A moved line is a class-3 row. A changed scan shape is an invalidator (§5).
- **Literal:** none. **`protocol/` place:** none.
- **Shared paths, compared at the base under rule (00a):**
  - `engine/src/dataset.rs` and `engine/src/error.rs`: text-id; taken in by the base;
  - `kernel/tests/skp_admission_remediation.rs`: the identity route and text-id, both in the base;
  - `engine/src/fixture.rs` and `engine/README.md`: any unmerged head that touches them is named at the base.
- **Merge:** after text-id. The PR stays a draft until its base is on main.

## §9 Block on sight

1. A second statement or pass over the file for the null count.
2. A new `EngineError` variant, wire code, field, literal or fixture.
3. A changed repeat or negative detail for a file with no null.
4. A refusal decided by schema nullability.
5. Code before the advisor's W-1 and W-2 are carried by an amendment, or any placeholder mark in code.
6. Any path outside §7.
7. A base without text-id's pushed, green head, or a base holding the recovery offer's head.
8. Any change to the skip, session-ordinal, not-addressable or set-aside arm, or to the cancel guard.
9. A test whose red is a compile error.

## §10 Gates

- **Architect:** ADR-016 §1 and §5 (`docs/adr/ADR-016-stable-feature-identity-admission.md:58-61`, `:81-92` @ 20ed759b), ADR-010 rule 2, docs/01's engine-facts rule for messages, and §9 item by item.
- **Reviewer:** the full diff; §9; the mutations observed.
- **Suites:** the engine and kernel suites on CI's Windows and Linux L1 entries.
- **Operator:** none proposed (OPEN-A6).

## §11 Amendments

None yet.

## OPEN items

- **OPEN-A1 (advisor): the words W-1 and W-2** (§2.4). Recommendation: as proposed. Each is an engine fact and states no consequence.
- **OPEN-A2 (advisor): the order of the checks.**
  - (A) Recommended: negative, then null, then repeat. Every no-null outcome stays as it is, and the negative detail stays true with nulls present, because `min` skips them.
  - (B) Null first. A null-and-negative file would then read W-1 where today it reads the negative detail.
- **OPEN-A3 (advisor): a null with repeats.**
  - (A) Recommended: one refusal, W-2, naming both facts. The one scan gives both, and the user meets both at once.
  - (B) W-1 alone. The repeat is then met at the next open.
- **OPEN-A4: the fixture route.**
  - (A) Recommended: the new mode, through `write_geoparquet` and `Dataset::open`. Asserting against a written file, not a hand-built schema, is the house rule (`engine/tests/identity.rs:10-12` @ 20ed759b).
  - (B) Unit tests in `dataset.rs` over a DuckDB `COPY` file, as at `:2271-2275`. That is about 80 fewer lines, but it does not go through `Dataset::open`.
- **OPEN-A5: where K1 and K2 live.**
  - (A) Recommended: `kernel/tests/skp_admission_remediation.rs`, beside (5b). It is already in the base.
  - (B) A new kernel test file. It shares no path, but it is one more test binary.
- **OPEN-A6: what is not added.** Recommendation (A), in all four parts:
  - **No ADR text.** The outcome stays ADR-016 §1's refusal and only the reason changes. A dated note would be the human's, and a red line.
  - **No KNOWN-LIMITATIONS sentence.** Item 3 is under the human's K-1 and K-2 in text-id.
  - **No walkthrough row and no e2e step.** The shell shows the message verbatim, and K1 proves the wire.
  - If the advisor wants any of these, it is class 9 before code.
- **Found and not changed, for the advisor:** `ENGINE_REFUSAL_NOTICE` (`frontends/shell/src/project/reopenNotices.ts:100` @ 20ed759b) tells the user that the claims a reopen refusal names were recorded by the project file. A native `id`'s refusal at a reopen names no recorded claim. This is not new with this piece; it holds today for the repeat refusal.

---END OF FORM---

**My answer to point 5:** the offer follows a null refusal, and text-id's form already covers it. Nothing goes to the advisor.
- **Engine.** Text-id's arm (d) admits on the session tier on any `EngineError::IdentityUnusable` from the native path (its §2 item 1 (d), `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:71` @ 20ed759b). The null refusal stays that variant, raised inside that path's scan.
- **Shell.** The offer's condition is the code `engine.identity_unusable`, field `column` = `id`, and no declaration or set-aside in the attempt (`:119-123`). A null in a native `id` meets all of it.
- **The ADR draft.** Its Decision 2 admits the choice "Only when they refuse the column" (draft `:54`).
- **Already true today.** Before this piece, a null-bearing file reaches arm (d) through the repeat refusal. This piece changes only the detail beside the offer.
- **Pinned.** K2 pins the engine half on text-id's head.
- **One note for the advisor, not a question.** I read a null as inside "cannot serve", as ADV-2026-11-24-23 item 1 reads a negative value. The human's approval of ADV-2026-11-23-34 settles it either way, as that item says.

**Questions (none blocks the draft):**
- **Contract.** For a null-bearing file, the `detail` value and the message of `engine.identity_unusable` change, with no new code, field or literal. My reading is that this is not a wire contract change: `detail` is a free string, and no fixture pins this value. Please confirm, or send it to the advisor.

**Report path:** `state/consults/2026-11-24-identity-scan-refuses-a-null-by-name-form-lead-data-draft.md`. I wrote no file, as the brief says, so there is no sha256 from me: the custodian computes it on filing this message.

**Files read** (all in `D:/wt/read-1124f` at 20ed759b):
- `engine/README.md` (owner's index) and `kernel/README.md` (owner's index)
- `engine/src/dataset.rs` (60-91, 520-579, 1940-2179, 2240-2309)
- `engine/src/identity.rs`
- `engine/src/error.rs` (150-179, 355-368)
- `engine/src/stream.rs` (1428-1441, 2650-2689, plus a grep)
- `engine/src/fixture.rs` (520-789, 1215-1264, 1300-1329)
- `engine/src/attributes.rs` (445-484)
- `engine/tests/identity.rs`
- `engine/tests/first_batch_and_pruning.rs` (540-569)
- `engine/tests/admission_instruments.rs` (1-30)
- `kernel/src/skp.rs` (2210-2244)
- `kernel/src/project/mod.rs` (805-839)
- `kernel/tests/skp_admission_remediation.rs` (205-304)
- `frontends/shell/src/admission/formatRefusal.ts` (1-60)
- `frontends/shell/src/project/openProject.ts` (78-91)
- `frontends/shell/e2e/admission-remediation.mjs` (76-100)
- `protocol/skp/SKP-V0.md` (280-291, 586-599)
- `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json`
- `protocol/skp/tests/conformance/fixtures/responses-accept.json` (94-105)
- `docs/adr/ADR-016-stable-feature-identity-admission.md`
- `docs/PREREGISTRATION-TEMPLATE.md`
- `.claude/agents/architect.md`
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md`
- `governance/forms/kernel/WINDOWS-CASE-FOLD-NON-ASCII-PREREGISTRATION.md` and `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md` (headings only, for shape)
- `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md` (46-57, 120-139)
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-...md` (line 25)
- `KNOWN-LIMITATIONS.md` (60-73)
- greps over `engine/`, `kernel/`, `protocol/` and `frontends/` for the repeat detail and `identity_unusable`

**Model:** Opus 5.5 (claude-opus-5-5).
