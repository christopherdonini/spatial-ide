# Preregistration: identity-scan-refuses-a-null-by-name (full form)

**Status.** This is a draft by lead-data. Its words for the refusal (§2.4, W-1 and W-2) are proposals held under a placeholder mark: the words are the advisor's, from this draft after its gate (ADV-2026-11-24-23 item 5). No code is written until an amendment carries the advisor's words in, and until text-id's build has a pushed head with its suites green (§8).

- **Proposed path:** `governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md`
- **Node:** `identity-scan-refuses-a-null-by-name`, lane engine. The custodian names and places it under ADV-2026-11-24-23 item 5.
- **Authority:**
  - ADV-2026-11-24-23 item 5. It is not in the tree at 20ed759b; the custodian adds its filed path at the first commit.
  - ADV-2026-11-26-05, which rules every OPEN item (the section "OPEN items, ruled"). It is not in the tree at 20ed759b; the custodian adds its filed path at the first commit.
  - ADV-2026-11-23-25 item 2, as ADV-2026-11-24-23 item 5 applies it: of this piece and the recovery offer, whichever can start first builds first.
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
  - On that reading, one null in an otherwise unique column of n rows gives a row count of n but only n−1 distinct values. The open is then refused by the repeat arm with a false detail.
  - Its discriminator is §4's T1, red at the red commit (§4, "Red").
  - The draft amendment's author recorded the same reading and did not run it (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:129` @ 20ed759b).
- **The open's outcome does not change, only its reason.** A null-bearing file is refused today, as `EngineError::IdentityUnusable` naming the column. After this piece it is refused as the same variant, naming the same column, with a true detail.

**Which types reach the scan.**
- The type check runs first and reads no value (`engine/src/dataset.rs:2027-2028` @ 20ed759b).
- It admits exactly the eight integer widths (`engine/src/identity.rs:333-335` @ 20ed759b; ADR-016's Note 2026-11-09, `docs/adr/ADR-016-stable-feature-identity-admission.md:246` @ 20ed759b).
- So "every type admission takes" means those eight. A null in any other type is refused for its type first, unchanged.

**Paths this piece leaves as they are (found while reading).**
- The `skip_uniqueness_check` arm returns before the scan (`engine/src/dataset.rs:2030-2039` @ 20ed759b). A null there reaches the stream, which refuses it as `EngineError::Query` (`engine/src/stream.rs:2670-2675` @ 20ed759b). The wire has no field for that skip (`docs/adr/ADR-016-stable-feature-identity-admission.md:161-164` @ 20ed759b), so no user reaches it.
- The experimental row-group seam has its own null refusal (`engine/src/rowgroup.rs:518-526` @ 20ed759b; its test at `:863`). It is not on the product path.
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
- The doc of `identity_verification_scans` (`engine/src/dataset.rs:78-86` @ 20ed759b) gains text-id's scan-count test: N-3 in its §2 item 1 (`:75` @ 20ed759b), N-S after its Amendment 3 (`:537`, `:566` @ 20ed759b). §2.1 edits the same doc.
- Text-id's form names no change to the scan's SQL, to `run_identity_scan`, or to the negative and repeat checks. Their lines move.

**How this form's lines are drawn.** Every line here is drawn against main's code now (20ed759b, the same as a587fab5), and re-read on text-id's head before any code (§8, "Re-read at the base").

## §1 Claims and class

- **Claim:**
  - A null in the identity column is refused by name, for each of the eight integer widths, native or declared, in the same scan with no second pass. The detail says the column is null in so many rows.
  - A file with no null keeps today's outcome and today's details byte for byte, the repeat detail and the negative detail included.
- **Class: full**, both gates, by ADV-2026-11-16-06 item 2 (a). The piece meets:
  - **What the user is told about the state of their data (a refusal).** The refusal detail a user reads changes for every null-bearing file (§2.3).
  - **Over 260 changed lines.** The estimate is about 594 (§7).
- **It does not meet:**
  - **The wire.** There is no new code, field, literal or fixture (§2.3).
  - **An ADR's text** (OPEN-A6).
  - **CRS.**
  - **Persistence.** Nothing new is written (§2.3).
  - **Security.**
  - **A seam.** No interface changes on either side of the engine-to-kernel seam; K1 proves the existing one carries the new detail.
  - **Concurrency or cancellation, by change.** The guarded closure's body changes, but it stays one statement inside one guard. The existing cancel test stays green unchanged (§4).
- **No performance claim** (docs/08). The scan gains one aggregate in the same pass. Its cost is unmeasured and not claimed.
- **Portability:** this is not an OS-dependent feature, so it carries no R3 item. The tests run on CI's Windows and Linux L1 entries.

## §2 The change, stated before it is applied

**2.1 `engine/src/dataset.rs`, `admit_identity` and `run_identity_scan`** (lines at 20ed759b, re-read at the base):
- **The scan** (`:2045-2050`) gains `count("<c>")`, the count of non-null values, in the same `SELECT`, as its last column (index 4, after `max`), so the `min`/`max` reads at `:2136-2144` keep indices 2 and 3. It is still one statement, one guarded call and one counter increment (`:2063-2069`).
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

**2.2 `engine/src/error.rs`.** The `IdentityUnusable` doc (`:151-156`) lists four failures that "share a variant and are distinguished by `detail`" (`:155-156`). It gains a null in the column, and names the not-addressable refusal it omits today (`engine/src/dataset.rs:2019-2025` @ 20ed759b), so the list is six. The variant, its fields and its Display are not changed by this piece. Text-id changes the Display before this piece is built.

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

  Both are refused before the first row, as `NarrowInteger`'s writer refuses (its doc at `:558-563`; `narrow_refusal` at `:643-656`, called at `:1151-1153`).
- **Arms:** one each in `schema()` (`:754-770`), in the pre-row refusal (`:1151-1153`), in the value match (`:1236-1251`) and in the column finish (`:1312-1319`).
- **Unchanged:** every existing mode, the field nullability of those modes, and the geometry seeding.

**2.7 `engine/README.md`, the owner's index (pointers only).**
- The Open and admission row (`:539`) gains T1's pointer.
- The preregistration list (`:557`) gains this form's path.
- The **Last verified at** line (`:537`) gains the commit those two pointers are checked at, in its existing form.
- Lead-data writes them at the merge.

## §3 Fixtures, outcomes predicted before code

Each fixture has 100 features, except F-5 (2,000). Every fixture is generated; none is copied.

| row | fixture | today (predicted, from §0) | after this piece (predicted) |
|---|---|---|---|
| F-1 | `NullBearing{UInt64, Id, OneNull}` | refused, `column` `id`, repeat detail with 100 rows and 99 distinct values | refused, `column` `id`, W-1 with nulls 1, rows 100 |
| F-2 | `NullBearing{UInt64, Id, OneNullAndARepeat}` | refused, repeat detail, 100 and 98 | refused, W-2: 1 of 100; the other 99 carry 98 |
| F-3 | `NullBearing{w, Id, OneNull}`, w each of the eight widths | refused, repeat detail | refused, W-1, 1 of 100, for each w |
| F-3d | `NullBearing{w, ParcelKey, OneNull}`, declared `parcel_key`, w each of the eight widths | refused, `column` `parcel_key`, repeat detail | refused, `column` `parcel_key`, W-1 |
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
| `engine/src/error.rs` | `IdentityUnusable`'s doc | ~8 |
| `engine/src/fixture.rs` | §2.6 | ~120 |
| `engine/tests/identity_null_refusal.rs` (new) | T1 to T6 | ~275 |
| `engine/tests/identity_null_refusal_scan_count.rs` (new) | T7 | ~55 |
| `kernel/tests/skp_admission_remediation.rs` | K1, K2 | ~85 |
| `engine/README.md` | two pointers and the Last verified at line | ~6 |
| **total** | | **~594** |

- **Ceilings:** at most 650 changed lines (insertions plus deletions), over at most 7 files, by the counting command below. An overrun is class 8, and this line is never edited to match.
- **Scope, exactly:** the seven paths above.
- **Counting:** `git diff --numstat <base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, read at a named commit, where `<base>` is the recorded base.

## §8 Base, re-read, overlap

- **Base:** text-id's head, after its build has a pushed head with its suites green (ADV-2026-11-24-23 item 5). That head takes in the identity route and the heads its own base names. The commit is recorded. This piece is never built on the recovery offer's head (ADV-2026-11-26-05 item 11), and does not wait for it (ADV-2026-11-24-23 item 5, applying ADV-2026-11-23-25 item 2).
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
2. A new `EngineError` variant, or a new wire code, wire field, literal or wire fixture (§2.6's test-support mode is not a wire fixture).
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

## OPEN items, ruled

The advisor ruled every item below in ADV-2026-11-26-05, and the custodian folded the rulings in before the form gates' attempt 2. Each option stays as drafted; each item's ruling follows it, with the number of the ruling's item. The ruling's own words govern.

- **OPEN-A1 (advisor): the words W-1 and W-2** (§2.4). Recommendation: as proposed. Each is an engine fact and states no consequence.
  - **Ruled (item 1):** as proposed, subject to the form gates' clause check. A clause a gate finds untrue goes to the advisor with words; otherwise the custodian's amendment carries W-1 and W-2, and the code may use them with no mark.
- **OPEN-A2 (advisor): the order of the checks.**
  - (A) Recommended: negative, then null, then repeat. Every no-null outcome stays as it is, and the negative detail stays true with nulls present, because `min` skips them.
  - (B) Null first. A null-and-negative file would then read W-1 where today it reads the negative detail.
  - **Ruled (item 2):** (A).
- **OPEN-A3 (advisor): a null with repeats.**
  - (A) Recommended: one refusal, W-2, naming both facts. The one scan gives both, and the user meets both at once.
  - (B) W-1 alone. The repeat is then met at the next open.
  - **Ruled (item 3):** (A).
- **OPEN-A4: the fixture route.**
  - (A) Recommended: the new mode, through `write_geoparquet` and `Dataset::open`. Asserting against a written file, not a hand-built schema, is the house rule (`engine/tests/identity.rs:10-12` @ 20ed759b).
  - (B) Unit tests in `dataset.rs` over a DuckDB `COPY` file, as at `:2271-2275`. That is about 80 fewer lines, but it does not go through `Dataset::open`.
  - **Ruled (item 4):** (A).
- **OPEN-A5: where K1 and K2 live.**
  - (A) Recommended: `kernel/tests/skp_admission_remediation.rs`, beside (5b). It is already in the base.
  - (B) A new kernel test file. It shares no path, but it is one more test binary.
  - **Ruled (item 5):** (A).
- **OPEN-A6: what is not added.** Recommendation (A), in all four parts:
  - **No ADR text.** The outcome stays ADR-016 §1's refusal and only the reason changes. A dated note would be the human's, and a red line.
  - **No KNOWN-LIMITATIONS sentence.** Item 3 is under the human's K-1 and K-2 in text-id.
  - **No walkthrough row and no e2e step.** The shell shows the message verbatim, and K1 proves the wire.
  - If the advisor wants any of these, it is class 9 before code.
  - **Ruled (item 6):** (A), all four parts.
- **Found and not changed, for the advisor:** `ENGINE_REFUSAL_NOTICE` (`frontends/shell/src/project/reopenNotices.ts:100` @ 20ed759b) tells the user that the claims a reopen refusal names were recorded by the project file. A native `id`'s refusal at a reopen names no recorded claim. This is not new with this piece; it holds today for the repeat refusal.
  - **Ruled (item 10):** filed as a finding, with no change now. The advisor rules its words when text-id's build gates read that file.
- **The contract question (lead-data's note after the draft). Ruled (item 7):** confirmed. A new value of `detail` and of the message, with no new code, field or literal, is not a change of the wire's contract.
- **Text-id's offer after a null refusal (lead-data's note after the draft). Ruled (item 9):** agreed; the offer follows a null refusal under text-id's form as written, and K2 pins it.
- **Class and size. Ruled (item 8):** full form and both gates; the ceiling of 650 lines over 7 files (§7) stands.
- **Base and order. Ruled (item 11):** as §8 has it.


## Amendment 1 — 2026-11-26 — at the first commit: the authority on main, the words carried in, the node's gate, the form gates and the settle, the span hashes

*Written by the custodian at the form's first commit, after both form gates and before any code. References and hashes only. Nothing above is edited: the Status paragraph, the Authority line's "not in the tree at 20ed759b" and the words "None yet." in §11 are the draft's.*

1. **Authority on main.** ADV-2026-11-24-23 is filed at `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-23-the-humans-message-of-09-52z-placed-every-case-settled-not-an-approval-identity-route-first-r6-its-own-piece.md`, and ADV-2026-11-26-05 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-05-the-null-refusal-forms-open-items-w-1-and-w-2-order-a-one-refusal-full-form-ceiling-650.md`.
2. **The words carried in.** Both form gates found every clause of W-1 and W-2 true (item 4). So, by ADV-2026-11-26-05 item 1, this amendment carries W-1 and W-2 in as §2.4 states them, and the code uses them with no mark. Block-on-sight 5's first clause is met. The Status paragraph's other condition still holds code back: text-id's build needs a pushed head with its suites green (§8).
3. **The node's gate.** In the same commit, the PLAN node `identity-scan-refuses-a-null-by-name` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-26-05 item 8. The path is the one the draft proposes.
4. **The form gates and the settle.**
   - Both gates read the draft's attempt-2 text at 20ed759b: 30203 bytes, sha256 9d2c4653701707c5e79fcbdf08788bc8298f332dfce48eaa4632c38f012c076b.
   - The architect's report is at `state/consults/gates/2026-11-26-identity-scan-refuses-a-null-by-name-form-gate-architect-attempt-2.md`, and the reviewer's at `state/consults/gates/2026-11-26-identity-scan-refuses-a-null-by-name-form-gate-reviewer-attempt-2.md`.
   - They are gate-log rows 908 and 909. Both are PASS WITH NOTES, with no Correctness or Evidence finding.
   - Attempt 1's results were not taken (ADV-2026-11-26-03 item 2).
   - Lead-data, the author, settled the two gates' Documentation notes in 19 pairs, at `state/consults/2026-11-26-identity-scan-refuses-a-null-by-name-form-attempt-2-settle-lead-data.md`. The custodian applied them by script, finding each old text exactly once.
   - The result is this file's first 31123 bytes, sha256 e8cd57ff523b75fdcc2dac9cf350f7d4b6cfbaa5c6670d27e9f7f0b9f1616791.
5. **Span hashes.**
   - Every `path:line` cite above is read at 20ed759b71064079792541f2a76cf804a6c84bc1. There are 79 cites and 72 distinct spans.
   - Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit, and the sections that cite it. Each line is hashed with its LF, computed by script.
   - How a cite is read: a short name as the one tracked file it names, and a bare `:n` as the file named before it in the same passage. An entry marked (r) (15 of them) was read by the custodian against the file its sentence or list names.

- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:f089d4fe0c367cc2935001f30ce19fb2f040b87fe6b4f4ed8cc34a8992b2f1a9 — the header
- `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:129` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:afab4d41ac4b25b6b2630a46ee1e3246b3af00fb6c1a276f221cedac4c5a35ef — the header, §0
- `engine/src/dataset.rs:2045-2050` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:23cb47f3cb33dad68cdd596359ec2f52fa2c45ee3cdf55d0cb1749480e3938a5 — §0, §2; as written `:2045-2050`
- `engine/src/dataset.rs:2063-2074` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0bda2cc9ec345eb4038e4dad7f7e1fcb7d1d3e8b2e2c8501e872981516f2079a — §0
- `engine/src/dataset.rs:2108-2149` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:5f2d6a2fc0599cf3a173f47b0423ad87fbc035b6d8b9edf5d8c5d48cef5fa662 — §0, §2; as written `:2108-2149`
- `engine/src/dataset.rs:2076-2087` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3e49df666dd980acc80a48815542626be0acd4c3b2833ee76192730e4af2aa1f — §0, §2; as written `:2076-2087`
- `engine/src/dataset.rs:2088-2098` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:9f1b86f641ccb6db2c920f1876fb2ab6b456bc385fc1c8efef261d90a148a6b2 — §0, §2; as written `:2088-2098`
- `engine/src/dataset.rs:2027-2028` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3d2157a23924b88a839a4e0362cfd359a48866cc7b029498c5482d98d8c8ca6e — §0
- `engine/src/identity.rs:333-335` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:a66517e2b8b2207cbe45291fcf3f7eaf49dd4bf4f9b5884a5b550db4cee0d389 — §0
- `docs/adr/ADR-016-stable-feature-identity-admission.md:246` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:53dbc462238722ee174dceeb348e37067ac8a87f3902eec67fc78caa633d9fda — §0
- `engine/src/dataset.rs:2030-2039` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:b2fbc36e22fde8fa646b55a66fa7ee35afc02999761bfd764ade226bd4d25aee — §0
- `engine/src/stream.rs:2670-2675` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:aa302c341898aafde0c3b825e146a2e438dbb82b05aae7e6548df54a3053bd93 — §0
- `docs/adr/ADR-016-stable-feature-identity-admission.md:161-164` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:d2fac86ac54fc69ece245a09524e176297df456add92519063f411e5c348d30c — §0
- `engine/src/rowgroup.rs:518-526` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:443dd7b0d5b92513ee01e30cf89ee4f06f909c85327e97df3332997948d40027 — §0
- `engine/src/rowgroup.rs:863` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:ea8390e983b9b278900fb8a8ef8a59b3f1e8107f81ed334a2aca9c7b4b4f8840 — §0; as written `:863`
- `engine/src/dataset.rs:1984-2011` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:5413c5b7946d04c503580383010a0a4b4710c05d5e16e34ffedebd6045087cdf — §0
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:65-75` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:e192c18ff83eb7472508583788b0b94c1d038ae151ccd11c6967aac10c4f4005 — §0; as written `:65-75`
- `engine/src/dataset.rs:78-86` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:b0a7a1421ff7bee6a62b3bd1bb90f5264e1083da33c0cf2c047070bfae8193fa — §0, §2; as written `:78-86`
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:75` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:e26449b04e22dfd3be33b95a32eac7204de59d8c2228ce33171cb48345d0e7c2 — §0; as written `:75` (r)
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:537` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:a215b6d4d0b683aa7788fc7c5066c361e30bebcdd5f6d927c90a170250073b0e — §0; as written `:537` (r)
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:566` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:5f94c3426a2490ff51c842e209253b8fe306275f1987b7005611a48a52442513 — §0; as written `:566` (r)
- `engine/src/dataset.rs:2136-2144` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:80e235fb43d2ca384d7a430a0318037fefff8f5f5ea473589a55c8ff5d1d8d71 — §2; as written `:2136-2144`
- `engine/src/dataset.rs:2063-2069` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:46e2644ab9c3d4c70e27743b36abf94755a40398307d7142801e1390ab40edea — §2; as written `:2063-2069`
- `engine/src/dataset.rs:2122-2127` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:4bf7d85b973cbf867591a23948c467dfd99d2be96c34cbcc8e3ae26a70198b7d — §2; as written `:2122-2127`
- `engine/src/dataset.rs:2100-2105` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:e78aaf0f0005fa0e436f348d7221207eb389219f7ab919e83cad5becec2d5599 — §2; as written `:2100-2105`
- `engine/src/dataset.rs:2041-2044` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:c9a22b75640a4c644d33c22381c1658a7549d842df379ced6241553fb3d11990 — §2; as written `:2041-2044`
- `engine/src/dataset.rs:2056` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:b856af7d93259b29d00750ccfea773aba66d940534af2ba4fec376ec23adcd7d — §2; as written `:2056`
- `engine/src/dataset.rs:2128-2147` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3c2f96b2fd5c13fea0bc2afb697962869610497790c93f091d0a00efee7a8d14 — §2; as written `:2128-2147`
- `engine/src/error.rs:151-156` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:9474130efa9911cfac2b404fcab4dc11207f20d3e7b873954b5464795ab6c294 — §2; as written `:151-156`
- `engine/src/error.rs:155-156` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:e2ab5b50c131e4b9300a293fd440f61d96bbe764ad31875ce9d1019bcc90940b — §2; as written `:155-156`
- `engine/src/dataset.rs:2019-2025` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:e1fa58a465aa9aeaa106af0aed647af0a8d5e712fd2a36eb43ea5c0b55ff0985 — §2
- `engine/src/error.rs:163-167` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:f2d09d025966114e4ef7416d6fd3cd7e87ece80a82ea1dbd2f91e10a32142009 — §2
- `kernel/src/skp.rs:2223-2237` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:480cec6bbd415318979d3063b8d0a7d1f14066748568046a91298d714895c2fd — §2
- `kernel/tests/skp_admission_remediation.rs:253` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:dc09792675c4374bb94749185b83256919739db53baf192bb0050f36b32eb335 — §2
- `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:1-9` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0964298076c4596fa9a759520f3d3a010c4cd2d951305602f628a5543a4f9f5b — §2
- `protocol/skp/tests/conformance/fixtures/responses-accept.json:94-103` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3d013d6fd69678466ec53e7e4316d72535b1e91523ea865cb2ed62caca284814 — §2
- `frontends/shell/src/admission/formatRefusal.ts:12-16` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0fd91d0268f4c0b109e8ad20902d8852805f8b2b45913044ee9527d3c5fe8671 — §2
- `frontends/shell/src/admission/formatRefusal.ts:34-40` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:a92b5409c844e231c23acaaa0572ed4d30ac4f8caf6478d21cbbc47f59d812d8 — §2; as written `:34-40`
- `frontends/shell/src/admission/AdmissionPanel.tsx:34` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:9f9c939234b0cca355b2be809ae19be08873e3ed8383b31ff78e32d4583b6033 — §2
- `kernel/src/project/mod.rs:818-832` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3193281f0230cbcc08b02f6def0897867ab2f920777fbdbd75e2c6be47bad298 — §2
- `frontends/shell/src/admission/AdmissionPanel.tsx:276-277` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:8ff8bf40ed5c0c8544ce321a65d7048669249e8b3983dd6efdab6a7ff3b70d9d — §2
- `frontends/shell/src/project/openProject.ts:84-87` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:7ef0766914127f1e29d8176713bd2dd2e8947247d92919ba2f5334a93d508eab — §2
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:71` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:8d0fb180ff3c0981469b188fa0c2f60d12e3f996c0894819440e79f8f9439fe3 — §2; as written `:71` (r)
- `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:119-123` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:1f09a900ec12bba3d63727c4ba0d049b3bd5357aafe0ce5c79239bd1ebaadb4b — §2; as written `:119-123` (r)
- `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:54` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:981a52d5baecc804d04296c1b7faa30fba3a9a6788a3c2834cd7384b09c14bf9 — §2
- `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md:50` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:2024587d9b82fbd3c5df44eeeec91c1ccee6dff8cdd5ddb02f4c5bce048c665b — §2; as written `:50`
- `engine/src/fixture.rs:574-581` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0759e14640ddf6471893aadfebf59bb542ccf4261a35a9430504c26b1b75c7fd — §2; as written `:574-581`
- `engine/src/fixture.rs:585-590` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:905bd30de7b55cbcbbf3e167d4015a51b07a410438819763078e99ae0eeed197 — §2; as written `:585-590`
- `engine/src/fixture.rs:558-563` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:9e04fc5bfd8bdb7e5c247cde79484b0f7135b14fd3b8201ee1b9cced7ba2f155 — §2; as written `:558-563` (r)
- `engine/src/fixture.rs:643-656` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:5b5eb73fc645ec1a621b3fe41a4890784827059cb26523990b2489efa18de0ab — §2; as written `:643-656` (r)
- `engine/src/fixture.rs:1151-1153` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:ec965aba5ad153bd5b424a0b0265fcdc127b38afa5a96843f950b29c50ade0de — §2; as written `:1151-1153` (r)
- `engine/src/fixture.rs:754-770` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3466ea379a904d93d1b14fbeb31af8a928690ff834ce856c11de49813140439c — §2; as written `:754-770` (r)
- `engine/src/fixture.rs:1236-1251` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:53b95d0ff9d77f7eb513d16425e64f8ed95901b9bdbc29688e33ec53a02700a0 — §2; as written `:1236-1251` (r)
- `engine/src/fixture.rs:1312-1319` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:6a56eb443f680bae400362dcf5f5878bf0c91fed25f25fd80fd5986b03963a6a — §2; as written `:1312-1319` (r)
- `engine/README.md:539` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:bf26d41c961c8cb631713a27d5f636701f058978e158a9f34509607f1feb3137 — §2; as written `:539`
- `engine/README.md:557` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:78160eed9b5b427099da7bd13569a6254abcac441379e2b198573690d45d9669 — §2; as written `:557`
- `engine/README.md:537` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0302fc54e601b5e1d4475986f3bdbe142f6da33f18416663f2bc4ebf5f1dbf19 — §2; as written `:537`
- `engine/src/dataset.rs:2091-2095` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:293eeb791721c80b3a02bbeb520075150acae704a78d7934965e09122e36d6ad — §4; as written `dataset.rs:2091-2095`
- `engine/tests/admission_instruments.rs:13-23` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:0b2db3896e8121460b4a9452cb8c5f78d3785e20630627d88b11b8ff3c73f572 — §4
- `engine/tests/identity.rs:105-136` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:d06872fa3e34154470419435e127e67674e0c24f7806e42b4cff47fd2b6d0119 — §4
- `frontends/shell/e2e/admission-remediation.mjs:87-96` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:352c69e72f91ded0829bcec2429385885f283faa1d6dd53d46549ec42ed5e653 — §4; as written `:87-96`
- `frontends/shell/e2e/admission-remediation.mjs:487-501` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:8e4fdef6be8870856d893fecd524845eac87e0bc5b89ea82868352dc9929abbf — §4; as written `:487-501`
- `kernel/tests/skp_admission_remediation.rs:230-255` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:31680a1564b6088b8a8c16ddaa0e2e448f096e125d25804d34e28db11cfa87ad — §4; as written `:230-255` (r)
- `engine/tests/identity.rs:250-268` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:3cf2a2bb7edd8e0902dc3d72100dd34b59722aff81279b3900a8901d41d61824 — §4; as written `:250-268` (r)
- `engine/tests/identity.rs:295-325` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:ec133baa0de38b2dfd148f69d1d2d016d3c8a2a5c07dfc9476c7cfc82ba90064 — §4; as written `:295-325` (r)
- `engine/src/dataset.rs:2264-2295` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:14ab9e4d6306dd34b67d957ae9928cdbbb809307de5da5a6624c6013d6b54910 — §4; as written `:2264-2295` (r)
- `engine/src/dataset.rs:87` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:275a40ed081864c527d12fa8a50309deae991ce3bccc253c4b6e2976b19f58e7 — §6
- `docs/adr/ADR-016-stable-feature-identity-admission.md:58-61` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:d6cbbfc40631f7748aa58794ac9074515fc7acb6a1c2f9172ee5dd80cc8eee8a — §10
- `docs/adr/ADR-016-stable-feature-identity-admission.md:81-92` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:de54b84f91ea7aafa560366bc5c8ae26b4251d3fde14b546bb44a6f78dab717f — §10; as written `:81-92`
- `engine/tests/identity.rs:10-12` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:b0c606486f27708180f3fc40132d0205f63ecfb5f2f33c52dbf40bbf717896f6 — OPEN items
- `engine/src/dataset.rs:2271-2275` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:190b9e82cf6780ea5f4eb04810dd274cc41f1e44fe6e7dfb191fc65a6720aeb9 — OPEN items; as written `:2271-2275`
- `frontends/shell/src/project/reopenNotices.ts:100` @ 20ed759b71064079792541f2a76cf804a6c84bc1 sha256:7872047cb807ed5e02301d2f629517506d3792632af59bfecd8f46abb22629ca — OPEN items

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — 2026-11-27 — the custodian's: ADV-2026-11-27-24 item 7, this piece after text-id's C1 follow-up piece

*References only. Nothing above is edited.*

1. **The ruling** is ADV-2026-11-27-24, filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-24-text-ids-c1-follow-up-way-a-identity-source-carried-by-the-engine-skp-0-17-on-one-protocol-line-the-recovery-offer-behind-it.md`. By its item 7, this piece merges after `text-id-reopen-with-a-recorded-declaration`, and its code is built on that piece's head.
2. **If this piece's code starts earlier,** that piece's head comes in by a merge commit before this piece's gates.
3. **The form gates of `text-id-reopen-with-a-recorded-declaration`** read this form's §2 against item 2 of that form's §2. Both edit `admit_identity`'s scan arms.
4. **The PLAN node** gains `text-id-reopen-with-a-recorded-declaration` in its `depends_on`.

## Amendment 3 — 2026-11-27 — the custodian's: the C1 piece's field on this form's sixth site (class 9), from that piece's architect form gate

*References only. Nothing above is edited. Written before any code. This piece's code is built on the head of `text-id-reopen-with-a-recorded-declaration` (Amendment 2).*

1. **The source** is finding A1 of that piece's architect form gate, filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-form-gate-architect.md`, in its section 4.
   - On that piece's head the variant carries `identity_source`.
   - This form's new null refusal builds the variant a sixth time. The compiler forces the field, but nothing forces its value.
2. **Class 9**, the custodian's choice as the report recommends: this amendment adds a §2 value and §4 assertions.
3. **The report's four pairs for this form are read in place**, each New for its Old. Each Old was found exactly once here, by script at this commit. The third pair's New is its Old followed by one new line, as the report gives it.
4. **Added to §4**, in the report's terms:
   - T1 also asserts `identity_source` is `file:id`;
   - T3 at F-3d also asserts `mapped:parcel_key`;
   - one more recorded mutation values the null site's field as for a file's own `id` whatever the declaration. It is observed failing T3 at F-3d, and it takes the next unused name in this form's series.
5. **The build gates** read §2 and §4 as amended here.
