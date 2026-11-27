Reviewed: the form text r6-form-attempt-2.txt in the scratch folder, 30203 bytes, sha256 9d2c4653701707c5e79fcbdf08788bc8298f332dfce48eaa4632c38f012c076b, against the code in the read checkout D:/wt/read-1124f at 20ed759b71064079792541f2a76cf804a6c84bc1, read only. That text is lead-data's draft (`state/consults/2026-11-24-identity-scan-refuses-a-null-by-name-form-lead-data-draft.md`, its lines 10 to 345 at 7402b645: 28659 bytes, sha256 70b173b9) with ADV-2026-11-26-05 folded in by script (9 pairs, sha256 f76ec892). This is the custodian's filing note, 2026-11-26: the architect's form gate, attempt 2, node:identity-scan-refuses-a-null-by-name@form-gate-architect-2, under ADV-2026-11-26-03 item 2. Attempt 1, dispatched at 2026-11-24T11:00:23Z, is recorded as dispatched and not recovered; its result was not taken and not looked for. Attempt 2 was dispatched just before 2026-11-26T17:36:55Z (date -u after the call), with its brief byte for byte (brief-r6-form-gate-architect-2.md in the scratch folder, 3601 bytes, sha256 e2fff14d). Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 56 tool uses, 397821 ms, 146591 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T17:43:50Z (date -u after saving), and no message was sent to it. The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. Verdict: PASS WITH NOTES; Documentation D1 to D4; gate-log row 908.

**Verdict: PASS WITH NOTES.** Reviewed text: `r6-form-attempt-2.txt`, sha256 9d2c4653701707c5e79fcbdf08788bc8298f332dfce48eaa4632c38f012c076b. That hash is the one the brief gives; I have no shell and did not recompute it. Read checkout: `D:/wt/read-1124f` (detached) @ 20ed759b71064079792541f2a76cf804a6c84bc1. Node: identity-scan-refuses-a-null-by-name@form-gate-architect-2.

There are no Correctness or Evidence findings, so nothing blocks. Four Documentation findings follow. Each must be fixed before the form is committed. None of the sentences involved is the human's wording, so the custodian applies the words with no re-gate and the record lists them.

## Correctness: none

**§10's list for the architect**
- **ADR-016 §1** (`docs/adr/ADR-016-stable-feature-identity-admission.md:58-61`): the outcome stays a typed refusal at open, and the variant is unchanged (`engine/src/error.rs:163-167`).
  - Today a null id is only caught later, at stream time, as `Query` (`engine/src/stream.rs:2670-2675`). This piece does not change that arm.
  - The skip arm cannot be reached from the wire (ADR-016:161-164).
- **ADR-016 §5** (`:81-92`):
  - The check stays one guarded, cancellable statement (`engine/src/dataset.rs:2063-2074`). The extra `count(c)` is in the same `SELECT`.
  - What T7 proves is stated honestly: one guarded scan, not one statement. Block-on-sight 1 is left to review.
- **ADR-010 rule 2** (`docs/adr/ADR-010-render-frames-origins-boundaries.md:33`): a pick resolves through a stable ID. Refusing a null at open protects that prerequisite. W-2 drops today's second sentence on rule 2; that is a choice of words, not a violation.
- **docs/01, engine facts in engine messages:** W-1 and W-2 say only what the engine counted. Neither states what another module does as a result.
  - `ENGINE_REFUSAL_NOTICE` (`frontends/shell/src/project/reopenNotices.ts:100`) says a reopen refusal names claims the project file recorded. That is untrue for a native `id`. It is an owner's line, older than this piece, and correctly filed as a finding (ruling item 10).
- **§9, item by item:**
  - Items 1 and 3 to 9 hold. Items 4 and 3 each have a mutation behind them (M-4, M-5 and M-6).
  - Item 2 is ambiguous; see D2.
- **ADR-006:** the open is a read, so the operation class does not change.
- **docs/08:** no performance claim is made, and the extra aggregate's cost is declared unmeasured.
- **docs/07 roadmap:** no scope creep. This is a fix to engine correctness.

**Seams**
- **K1 is written to the kernel's real interface:**
  - `SkpHost::open_dataset` and the existing `open_req` and `fixture` helpers (`kernel/tests/skp_admission_remediation.rs:38-75`);
  - `message` is the Display (`kernel/src/skp.rs:2139`), and the fields come from `:2223-2237`;
  - the prefixed code is pinned at `:253`.
- **K2 targets text-id's interface, which is not in code yet:**
  - The interface comes from text-id's form at 20ed759b: §2 item 1 (c) and (d) at `:70-71`, items 6 and 8, and `IdSource::SessionOrdinal`'s literal at `engine/src/identity.rs:88`.
  - The form makes K2 wait for the base. It re-reads at the base (§8) and treats a missing premise as an invalidator (§5). That satisfies the "read it first" rule at build time.
  - M-8 discriminates: under it, `Query` passes through arm (d) (text-id form, `:73`).
- **`pub` items:** the new `pub` items are only the fixture-mode items behind the `fixture` feature. This follows the `NarrowInteger` precedent (`engine/src/fixture.rs:549-600`) and the README's listing of test support (`engine/README.md:553`). No product-path `pub` item is added.

**Predictions:** I checked every row of §3 against the code, and each holds.
- F-2's 99 and 98 follow from row 2 repeating row 1's value.
- F-5 is 2,000 rows of the constant 7 (`engine/src/fixture.rs:1239`).
- F-6 reads `min = -1` because `min` skips nulls, so its negative detail is unchanged.
- F-7: `count(*)` is 100 and the distinct count is 0.
- Red and green reasons and mutations M-1 to M-8 each fail their own test.
- Round 25: the overrun is class 8 and its line is never edited to match (§7); scope added on a standing rule is class 9 before code (OPEN-A6); mutations are described as observed by applying them.

## Evidence: none

## Clause check of W-1 and W-2 (ADV-2026-11-26-05 item 1), against 20ed759b

Every clause is **true**. Nothing goes to the advisor.

| clause | verdict | shown by |
|---|---|---|
| W-1 `the column is null in {nulls}` | true | `nulls = count(*) − count(c)`. `count(*)` is at `engine/src/dataset.rs:2046` and is read at `:2122-2124`. That `count(c)` skips nulls is SQL semantics, and T1's exact rendered detail proves it at the head. |
| W-1 `of {rows} rows` | true | `count(*)`, `dataset.rs:2046`. |
| W-1 `so not every feature carries an identity` | true | One row is one feature (ADR-016 Amendment 1 item 1, `:186-188`). A null row holds no value in the column. The engine already states the same fact at stream time (`engine/src/stream.rs:2670-2672`). The Display's subject, "`<c>` cannot serve as stable feature identity" (`engine/src/error.rs:361`), bounds the clause to that column. |
| W-2 `the other {present} rows` | true | `present = count(c) = rows − nulls`. |
| W-2 `carry only {distinct} distinct values` | true | `count(DISTINCT c)` (`dataset.rs:2046`) counts non-null values only. W-2 is reached only when `distinct < present` (form §2.1 item 2), so "only" holds. |
| W-2 `so at least two of those features share an identity` | true | Pigeonhole: two equal non-null values. It is the same inference as today's repeat detail (`dataset.rs:2092-2093`). |
| Composition | true | On text-id's head the Display ends at `{detail}` (ADV-2026-11-23-36 item 2), so W-1 and then W-2 read as one clause after the dash. W-2 cannot be reached with `present` of 1. |

## "OPEN items, ruled" and the Authority line, against ADV-2026-11-26-05

- Items 1 to 11 are each stated truly. Item 2 is (A) and is consistent with §2.1. Items 3 to 6 are (A) and consistent with §2.4, §2.6, §4 and OPEN-A6. Items 7, 8, 9 and 11 match. Item 10 is filed with no change.
- Item 10 reads "read that file" where the ruling has "read them" (the line's neighbours). Those neighbours are in that file. It is not presented as verbatim, and "The ruling's own words govern" covers it.
- The Authority line at the form's line 9 is true. It must carry the filed path at the first commit, because nothing tracked may cite an untracked file as Authority.
- Nothing in the form contradicts a ruling. The Status line, §2.4's heading and §9 item 5 keep the placeholder mark until an amendment carries the words, which is exactly what item 1 orders.

## Documentation, must fix before commit

Each old text occurs once in `r6-form-attempt-2.txt`.

**D1. The scan's new column has no position.** "Not changed: the min/max reading" (§2.1) holds only if `count(c)` comes after `max`, because `min` and `max` are read at fixed indices 2 and 3 (`dataset.rs:2136-2144`). The tests would catch a wrong index, but the form should say where the column goes.
- Old: ``gains `count("<c>")`, the count of non-null values, in the same `SELECT`.``
- New: ``gains `count("<c>")`, the count of non-null values, in the same `SELECT`, as its last column (index 4), so the `min`/`max` reads at `:2136-2145` keep indices 2 and 3.``
- Checked: `get(2)` is at `:2136` and `:2139-2141`; `get(3)` is at `:2136` and `:2142-2144`.

**D2. §9 item 2 can be read as forbidding §2.6's fixture mode.** As written, "fixture" can mean any fixture, while §1 means a wire fixture.
- Old: ``2. A new `EngineError` variant, wire code, field, literal or fixture.``
- New: ``2. A new `EngineError` variant, or a new wire code, wire field, literal or wire fixture (§2.6's test-support mode is not a wire fixture).``

**D3. §2.7 misses the README's "Last verified at" line.** Every piece that adds a pointer also adds the commit it was checked at to that line (`engine/README.md:537`, for example "…the Open and admission row's single-file bracket-name test … at e05a8b90"). It stays within §7's ~4 lines and the same path.
- Old: `- Lead-data writes them at the merge.`
- New: `- The **Last verified at** line (`:537`) gains the commit those two pointers are checked at, in its existing form.` followed by a new line: `- Lead-data writes them at the merge.`

**D4. §1's claim is wider than its tests.** "For each of the eight integer widths, native or declared" is tested for all eight widths natively but for one declared width only (F-3d). The code does support the wider claim: a declared column only changes `column` and `source` (`dataset.rs:1961-1982`) and then runs the same type check and scan (`:2027-2074`). So the claim is true, and the words should say what proves it.
- Old: `for each of the eight integer widths, native or declared, in the same scan with no second pass.`
- New: ``for each of the eight integer widths, native or declared, in the same scan with no second pass (T3 opens each width natively and `UInt32` declared; a declared column reaches the same scan through the same function).``

## Notes, no action

- The span hashes for every `@ 20ed759b` pin are owed at the first commit, as the form's line 18 says. 20ed759b is on main.
- §2.6's `:558-563` points at the doc comment that describes the refusal. The code that refuses is `engine/src/fixture.rs:1151-1153`. Either cite is true.
- §2.3 item 4 (i) relies on text-id's K-7 and S-T4. Those exist only under that form's OPEN-H2 C2, which its §2 is drafted for. The re-read at the base (§8) covers this.

No ADR is missing; the form adds no decision.

Files read: `D:/wt/read-1124f/engine/src/dataset.rs`, `engine/src/error.rs`, `engine/src/identity.rs`, `engine/src/fixture.rs`, `engine/src/stream.rs`, `engine/README.md`, `kernel/src/skp.rs`, `kernel/tests/skp_admission_remediation.rs`, `docs/adr/ADR-016-stable-feature-identity-admission.md`, `docs/adr/ADR-010-render-frames-origins-boundaries.md`, `governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md`, and the scratch files `r6-form-attempt-2.txt` and `adv-26-05.md`.
