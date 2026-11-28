# The identity scan refuses a null by name: the architect's build gate at f6614e15 (node:identity-scan-refuses-a-null-by-name@build-gate-architect): PASS WITH NOTES

*Filed by the custodian. The architect (Opus) read D:/wt/read-1127c at dda3521f80e62ed039db66885cfa737695f6426f and D:/wt/nullname at f6614e15043056e058c18c422aa5282f18b0c8c0, read only, and wrote no file. By the facts script its records run from 2026-11-27T23:55:43Z to 2026-11-28T00:00:35Z, with no call in the main checkout; by its completion notice it took 291700 ms and 38 tool uses. Its hand-back is below as received, with the harness indent removed: 13280 bytes, sha256 08e6ad3dee524559c476247452d3cc03b24b5963a338b0e81c66aa32be4c521b.*

---

**Verdict: PASS WITH NOTES.** I reviewed `cut/identity-scan-refuses-a-null-by-name @ f6614e15043056e058c18c422aa5282f18b0c8c0` against main `dda3521f80e62ed039db66885cfa737695f6426f`, read in D:/wt/read-1127c. The node is identity-scan-refuses-a-null-by-name@build-gate-architect, one part (Amendment 4 item 5).

Where the code is cited:
- Every code cite below is a line at the head f6614e15, in D:/wt/nullname, an unmerged branch, unless it is marked otherwise. Nothing below is pinned by hash.
- The base is f7770e1a. Its line numbers are worked out from the hunk headers in D:/wt/nullname-logs/gate-diff.txt.

There is no Correctness, Evidence or Architecture finding, so nothing blocks. There are two Documentation findings, D1 and D2. Each must be fixed before the merge, and neither changes code.

## Locators

- **gate-numstat.txt.** It holds six files: 39/13, 5/4, 164/0, 201/0, 49/0 and 65/1. That is 541 changed lines.
- **gate-diff.txt.** For `engine/src/dataset.rs` I counted the +/− lines hunk by hunk: 39 and 13, the same as the numstat. `engine/src/error.rs` also matches, at 5 and 4.
- **Hunks against the files.** Every hunk I compared against the worktree files (`dataset.rs:2123-2288`, `error.rs:151-177`, `kernel/tests/skp_admission_remediation.rs:706-772`) matches.
- **Not recomputed.** I have no shell, so I did not recompute the file's 30957 bytes or its sha256 e0978d7f….

## §10's architect line, item by item

**ADR-016 §1** (`docs/adr/ADR-016-stable-feature-identity-admission.md:58-61` @ dda3521f): **true.**
- The null-bearing file is still refused at open, as a typed `EngineError::IdentityUnusable` (`engine/src/dataset.rs:2185-2190`).
- The outcome is unchanged. Only `detail` is new.

**ADR-016 §5** (`:81-92` @ dda3521f): **true.**
- The check is still the one whole-column statement (`dataset.rs:2129-2134`).
- It runs inside the one `execute_guarded` call, with the cancel attach and detach unchanged (`:2147-2157`).
- So it stays cancellable.
- For a declared `parcel_key` it runs over the mapped column, the same as before.

**ADR-010 rule 2** (`docs/adr/ADR-010-render-frames-origins-boundaries.md:33` @ dda3521f): **true.**
- A pick resolves through a stable id, and a null row has none. Refusing that row at open protects the rule.
- The repeat detail's rule-2 sentence is unchanged (`dataset.rs:2195-2198`).

**The engine-facts rule for messages:** **true.**
- Both details state only the engine's own counts (`dataset.rs:2179-2184`).
- The Display wraps them in the engine's own subject (`error.rs:389-393`).
- Neither states another module's consequence.
- Where the rule lives: see D2.

**§9, item by item:**
1. **A second statement or pass: holds.** There is one `format!` SELECT with `count("<c>")` added as its index 4 (`dataset.rs:2130`), one guarded call and one `fetch_add` (`:2150`). T7 asserts a delta of 1 (`engine/tests/identity_null_refusal_scan_count.rs:611`).
2. **A new variant, wire code, wire field, literal or wire fixture: holds.** The `error.rs` change is the doc comment only (`:153-157`). No `protocol/` file and no `kernel/src` file is in the diff.
3. **A changed repeat or negative detail for a no-null file: holds.**
   - With no null, `present == rows`, so `nulls == 0` and the null arm is skipped.
   - The negative and repeat format strings are untouched (`dataset.rs:2160-2203`).
   - T5 pins the repeat detail byte for byte (`engine/tests/identity_null_refusal.rs:534-539`).
4. **A refusal decided by schema nullability: holds.** The refusal is decided by `rows - present` (`dataset.rs:2177-2178`). T4 is the guard, and M-4 is recorded against it.
5. **Code before W-1 and W-2 are carried, or a placeholder mark in code: holds.**
   - Amendment 1 item 2 carries the words.
   - A search for `placeholder` and `[W ` finds nothing in `dataset.rs` or in the diff.
6. **Any path outside §7: holds.** See Scope.
7. **The base: holds on the record.**
   - The base f7770e1a is the C1 head placed by ADV-2026-11-27-33 item 2 (Amendment 4 item 1).
   - I could not check ancestry without git, so the absence of the recovery offer's head rests on that record.
8. **The skip, session-ordinal, not-addressable and set-aside arms, and the cancel guard: holds.**
   - No hunk touches the skip arm (`dataset.rs:2112-2121`), the session-ordinal arm (`:2064-2092`), the not-addressable arm (`:2100-2107`) or `set_aside_outcome` (`:2224-2242`).
   - The guard hunk changes comment lines only (`:2140-2143`), plus the tuple's destructure (`:2158`).
9. **A red that is a compile error: holds, by structure.**
   - The fix adds no item that the tests name. The tests use only the fixture items and API that already existed at the base: `IdentityDeclaration::new` at `engine/src/identity.rs:176` and `identity_source` on the variant.
   - So the tests compile at d48e3235.
   - I did not read d48e3235 itself.

Also checked:
- **ADR-006:** an open is a read, so the operation class does not change.
- **docs/08:** no performance claim is made.
- **docs/10:** the refusal is a control-plane error, with no bulk data on MCP.
- **docs/07:** the piece is an engine correctness fix, with no roadmap creep.

## §1 and §2 (with Amendments 1 and 3) against the head

**The null check in the same one pass: true.**
- The check sits after the negative check and before the repeat check, the order ruled as OPEN-A2 (A) (`dataset.rs:2160-2192`).
- `run_identity_scan` reads index 4 the way it reads the other counts (`:2264-2266`).
- The `min`/`max` reads keep indices 2 and 3, unchanged (`:2275-2286`).

**W-1 and W-2, carried in from the form's bytes: true.**
- The two format strings (`dataset.rs:2179` and `:2183`) are the same as §2.4's two word sets, byte for byte, on my read.
- They carry the same placeholders.
- W-2 is chosen exactly when `distinct != present` (`:2180`).

Each clause of the advisor's words is **true** against the code:
- `{nulls}` is `rows - present`.
- `{rows}` is `count(*)`.
- `{present}` is `count(c)`.
- `{distinct}` is `count(DISTINCT c)`, which never exceeds `count(c)`. So the else branch means `distinct < present`, and "at least two share" holds by pigeonhole.
- For AllNull, `present == distinct == 0` gives W-1 with 100 of 100.

I found no untrue clause.

**`identity_source` (Amendment 3): true.**
- The null site sets `source.as_envelope_value()` (`dataset.rs:2189`), the same as the other arms.
- That gives `file:id` or `mapped:<column>` (`identity.rs:82-89`).
- T1 asserts `file:id` (`identity_null_refusal.rs:459`).
- T3 asserts `mapped:parcel_key` at F-3d (`:503`).
- M-9 is recorded (`:485-486`).

**The arms §9 item 8 keeps: unchanged** (see item 8 above).

**K1 and K2 are written to the real interfaces.**
- They use the file's own helpers `fixture`, `small_spec`, `host`, `open_req` (`kernel/tests/skp_admission_remediation.rs:39-77`) and `set_aside_req` (`:522-527`).
- They read the real `error_of` mapping, which carries `detail` and `identity_source` (`kernel/src/skp.rs:2248-2264`).

## Scope (§7)

- **Inside the paths: yes.** The six changed paths are all among §7's seven. `engine/README.md` is untouched.
- **The count:** 541 changed lines over 6 files, against ceilings of 650 lines and 7 files. Under both, so there is no class 8.
- **How I counted:** the numstat is the full three-dot diff, and none of the six paths falls under §7's exclusions, so the excluded count equals the raw count.
- **The README at the merge:** §2.7's README pointers, written by lead-data at the merge, must be counted against the same ceilings. About 6 more lines in a seventh file keeps the total under 650 and at 7 files.

**The design did not grow beyond §2.**
- §2.6 is built as declared: one mode, two eight- and five-variant enums, and the four arms plus the buffer (`engine/src/fixture.rs:566-582`, `:692-830`, `:917-919`, `:1305-1307`, `:1324`, `:1405-1407`, `:1476-1478`).
- The one item §2.6 does not name is the private `NarrowColumn::field_name` (`fixture.rs:825-832`). It is a helper inside the declared mode and adds no `pub` surface.
- The new `pub` items are in the `fixture` module, which is feature-gated (`engine/src/lib.rs:110-111`) and enabled only by test and dev dependencies (`engine/Cargo.toml:90-91`, `kernel/Cargo.toml:38`).
- The caller rule therefore takes these items as test support outside the shipped surface, under the `NarrowInteger` precedent and OPEN-A4 (A). This is not a seam.

## ADV-2026-11-27-43 item 3: holds

- The piece adds no member to any type in `protocol/`, and touches no `protocol/` file.
- For the lists under rule (00): K2 writes one more literal of `spatial_skp::v0::DescribeRequest` (`skp_admission_remediation.rs:764-767`), beside that file's existing ones. `OpenDatasetRequest` is built only through the existing helpers.
- Outside `protocol/` but of the same kind: `engine::fixture::IdentityMode` gains a variant (`fixture.rs:566-582`). An exhaustive `match` on it on another branch would break. At the head every match on it outside `fixture.rs` compiles.

## The worker's §8 re-read and the enum names (Amendment 6 items 2 and 4)

- **The re-read's moves.** I checked the moves against the hunk headers and the head:
  - the SQL 2125-2130, the counter comment 2136, the guarded call 2143-2154;
  - the negative check 2156-2168, the repeat check 2169-2180, the admitted arm 2182-2187;
  - `run_identity_scan` 2221-2262, the count reads 2235-2240, `min`/`max` 2249-2257;
  - the instrument 96;
  - (c) at 2041-2044, (d) at 2190-2219 with C4 at 2207-2211;
  - the type check 2108, the not-addressable arm 2098-2105, the session-ordinal arm 2062-2090, the skip arm 2110-2119;
  - the variant 171-176 in `error.rs`, and `set_aside_req` 522-527.
- Each is right. The class-3 rows stand as the worker lists them.
- **The scan's shape** is unchanged, so §5's invalidator did not fire.
- **The enum names:** `NullBearingWidth` and `NullBearingValues` follow the house pattern of `NarrowWidth` and `NarrowValues`. Their variants match §2.6 exactly. There is no finding.
- **Round 25:** the worker's report keeps the mutations it observed by applying them at 69e36325 apart from `verify-mutation`'s reading of the records. It calls no `verify-mutation` run an observation.

## Findings

**D1, Documentation. Changes no code. Not the human's wording (an engine doc comment).**
- The defect is the `LodRefused` doc at `engine/src/error.rs:140-141`.
- It points to `IdentityUnusable` "above" and to "ADR-016's four" (paraphrase).
- This piece's §2.2 change makes `IdentityUnusable`'s doc list six (`:153-155`).
- `IdentityUnusable` is declared below `LodRefused` (`:172` against `:146`).
- The comment is inside §7's path. Under §2.1's "made untrue, corrected in the piece" practice, it is fixed here.
- The worker applies the pairs with no re-gate, and the PR body lists them. Each old text occurs once in `engine/src/error.rs`:
  - Old: `` the same argument `IdentityUnusable` above records for `` → New: `` the same argument `IdentityUnusable` below records for ``
  - Old: `ADR-016's four.` → New: `ADR-016's identity refusals.`
- Clause check:
  - "below" is true, since `:172` comes after `:146`.
  - "identity refusals" names the six listed at `:153-155` without a count that can go stale again.

**D2, Documentation. Changes no code. A record finding.**
- §10's architect line names "docs/01's engine-facts rule for messages". That is the form's text, copied.
- `docs/01_Principles.md` @ dda3521f has no such sentence: a search for "message", "owner" and "engine fact" finds nothing.
- The rule is the human's ruling of round 7 on operator-visible text.
- The form is append-only, so the fix is one reference line in the closing amendment. Suggested line, not the human's wording: "§10's 'docs/01's engine-facts rule for messages' is read as the human's round-7 ruling on operator-visible text; docs/01 carries no such sentence."

## Not discharged by this gate

- **The suites line of §10 is still open.** When the custodian read CI, Product CI — Rust workspace was still running at f6614e15 on push and on pull_request.
- That line needs that workflow green on both events. This gate does not cover it.

No ADR is missing; the piece adds no decision.

Files read:
- D:/wt/read-1127c/governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md
- D:/wt/read-1127c/state/consults/gates/2026-11-27-identity-scan-refuses-a-null-by-name-build-worker-report.md
- D:/wt/read-1127c/state/consults/gates/2026-11-26-identity-scan-refuses-a-null-by-name-form-gate-architect-attempt-2.md
- D:/wt/read-1127c/state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-43-the-recovery-base-corrected-by-one-commit-outside-part-1s-count-b-carries-the-two-lines-on-main-a-required-protocol-member-named.md
- D:/wt/read-1127c/docs/adr/ADR-016-stable-feature-identity-admission.md and D:/wt/read-1127c/docs/adr/ADR-010-render-frames-origins-boundaries.md
- D:/wt/read-1127c/governance/AI_DEVELOPMENT.md
- D:/wt/nullname-logs/gate-diff.txt and D:/wt/nullname-logs/gate-numstat.txt
- At f6614e15 in D:/wt/nullname: engine/src/dataset.rs, engine/src/error.rs, engine/src/identity.rs, engine/src/lib.rs, engine/Cargo.toml, kernel/Cargo.toml, kernel/src/skp.rs and kernel/tests/skp_admission_remediation.rs.
