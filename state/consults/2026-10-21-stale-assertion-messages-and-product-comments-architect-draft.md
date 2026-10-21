*Custodian's filing note (2026-10-21): the architect's draft of the form for stale-assertion-messages-and-product-comments, the docs lane's second piece, read only at main 39182e74. The run 2026-10-21T21:48:05Z to 21:58:42Z by its transcript (Read 52, Glob 5, Grep 48; no Write, Edit or Bash). The form is committed at `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md` from its heading to the end of its OPEN items, with its four "as it stands" blocks checked against the tree at 39182e74 by script and its 116 line cites pinned by script. OPEN-1 to OPEN-3 are the human's. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 139920777f60f186601b5cd8d1dd061e6ddb64bc742698f78618d11ad7a98b17.*

---

Drafted: stale-assertion-messages-and-product-comments, the form, at main 39182e74

I have no shell, so this draft has no sha256 anywhere. Every `path:line @ 39182e74` below comes from my own read of the main checkout at 39182e74. The custodian pins each one by script as `path:line @ <full id> sha256:<hex>`, on one line (round 15 (d), (e)). Every block marked "as it stands" was copied from a Read at 39182e74. It is not the proof: the custodian checks it against the tree by script before the form is committed.

---

# Stale assertion messages and product comments brought current: preregistration (full form)

File: `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md`

**Authority.**
- **The node:** PLAN node `stale-assertion-messages-and-product-comments`, `PLAN.yaml:4497-4513 @ 39182e74`. Its title is at `PLAN.yaml:4498 @ 39182e74`, its summary at `PLAN.yaml:4512 @ 39182e74`, and its budget of 60 at `PLAN.yaml:4508 @ 39182e74`.
- **Proposed by the human:** `state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md:19 @ 39182e74` (item 2, the four lines outside the lane).
- **Placement:** the human's item 4, the docs lane, 2 of 6: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:14 @ 39182e74`. The node was then moved behind `adr-036-pre-acceptance-block`, as the node summary records. Both dependencies are done (#220, #240).
- **The lane's terms:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21 @ 39182e74`. The lane changes documents, comments and test names only (`:19 @ 39182e74`), and rule (00) applies to it (`:20 @ 39182e74`). See OPEN-1.
- **The source:** piece f, `frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md`. Its §2.5 routes the four lines here (`frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md:267-271 @ 39182e74`). Its Amendment 1 item 6 makes the node (`:440 @ 39182e74`), and its Amendment 2 item 5 found the lines unchanged at its base (`:503 @ 39182e74`). Its rows F3a, F3c and F4 are the corrections this piece carries over into product code (`:141-183 @ 39182e74`).
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording blocks follow the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31.

**Drafted by** the architect, on the custodian's brief, at main 39182e74 (C). **These words are the architect's, not the human's.** None of the four lines is the human's wording.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating: full form and full gating** (`AUTONOMY.md` §21a, §25(e): `AUTONOMY.md:315-332 @ 39182e74`, `AUTONOMY.md:482 @ 39182e74`).
- By size this piece is under §21c (`AUTONOMY.md:347-357 @ 39182e74`): at most 27 lines (39 under OPEN-2), over 4 non-generated files plus this form and PLAN.yaml.
- Two of the four lines are failure messages on assertions that are currently tested: the identity-basis value, and K7's verbatim status. The buildLayers comment restates the constant-colour pass-through. That is §21a category 4, "any property currently under test" (`AUTONOMY.md:327 @ 39182e74`).
- A five-line `Out-of-scope` line would therefore have to name category 4. By §25(e), no five-line form is committed. The precedents are piece f's Gating paragraph and `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:23-27 @ 39182e74`.

**Reuse index (the standing step).** The output of `node tools/reuse.mjs <words>`, run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, as the custodian's brief carried it, byte for byte. Both queries miss. The miss is noted and does not block.

```text
$ node tools/reuse.mjs stale assertion message
No prior art recorded for "stale assertion message". Research it before planning an implementation.
$ node tools/reuse.mjs stale comment product code
No prior art recorded for "stale comment product code". Research it before planning an implementation.
```

## §0. Disclosure

- **Inputs:** the node; piece f whole, with Amendments 1 to 5; the four files at C, and every file each claim rests on (cited in §2.1); the forms named in §2.5.
- **The base.** B is the merge-base on main when the branch is cut. The worker re-reads every cite at B.
  - A moved line is recorded as a class 3 row before code, and B's tree is authoritative for it.
  - A changed fact is an invalidator (§5).
- **Lines moved since piece f** (piece f cites the lines at 19b01c40; this form reads them at C):
  - `engine/tests/session_identity.rs`. Piece f cited the message at :190-192. At C the `assert_eq!` is at :190-196 and the message at :193-195. This fits piece f's OPEN-3 (b) rewrite above it, which turned :116-118 into :116-121; the custodian confirms by script.
  - `frontends/shell/e2e/regression.mjs:1830`, `frontends/shell/src/admission/crsAssertionState.ts:10` (within :8-11) and `frontends/shell/src/canvas/buildLayers.ts:31` (within :31-34) are at the same numbers.
- **Stopped being stale since piece f:** none.
- **More stale since piece f:** one. Piece f's F3a rewrote `App.test.ts`'s top comment. So `crsAssertionState.ts` now points at a reason that comment no longer gives (row C1).
- **Found beyond the node, marked (A):**
  - **(A1)** `frontends/shell/e2e/regression.mjs` holds three more stale line cites, in comments and not in a thrown message: :100-102, :1143 and :1145-1146. This is OPEN-2.
  - **(A2)** Two product comments depend on `crsAssertionState.ts`'s top comment:
    - `frontends/shell/src/admission/identityDeclarationState.ts:6-9 @ 39182e74`;
    - `frontends/shell/src/admission/AdmissionPanel.tsx:187-192 @ 39182e74`.
    - Both are true under C1's new words: the logic is tested without a render. No row.
  - **(A3)** Milestone 4's draft edits `canvas/buildLayers.ts` and `skp/client.ts` and widens `style/document.ts`. Either change would falsify row B1's facts. See §2.5 and §5.
- Nothing is measured, there is no fixture and no app run, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten line states what its cite shows at B, checked clause by clause in §2.1.
- **May not claim:**
  - any change to code logic, to a test's name, or to what any test asserts;
  - any string the app shows;
  - that `CrsAssertionForm.tsx` is never mounted by any suite;
  - that the shell will never request attribute columns;
  - that ADR-023 binds anything or is accepted;
  - that K7 has passed;
  - any wire change, any ADR amended, any fixture changed.
- **ADRs cited, none amended:**
  - 016: §6 and Amendment 1, Accepted (`docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 39182e74`, `:180 @ 39182e74`);
  - 017 §5a;
  - 023, Proposed (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 39182e74`).

## §2. The change

### 2.0 Rules

- **(a)** New text cites by item name (fn, const, file, ADR item). It never cites by a bare `path:line`.
- **(b)** Status words match the ADR's Status line. ADR-016 Amendment 1 is Accepted, and ADR-023 stays Proposed.
- **(c)** No new quotation marks unless the text is byte-copied. Existing quoted spans stay byte-identical: `"constant attribute"` and `format!("at level ...")`.
- **(d)** Comment width: the file's 100 columns. The exception is `regression.mjs:1830`, a template-literal line already over 100 (`:1829 @ 39182e74` also is). It stays one line, and a split at a `+` is allowed (§7).
- **(e)** No backticked test-prefixed snake_case token is written except a real test, named `path::name`, so `verify-test-claims` sees no new claim.
- **(f)** Ledger rulings are cited by round and item, never by line (round 12 (a), round 14 (a′)).

### 2.1 Rows

**M1: the session-tier assertion message** (`engine/tests/session_identity.rs:193-195 @ 39182e74`). This is the third `assert_eq!` (`:190-196 @ 39182e74`) in `engine/tests/session_identity.rs::a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis`.

- **As it stands:**
  ```
          "the third what-was-checked value, naming the basis. It is the PROPOSED ADR-016 \
           Amendment 1's, not the accepted ADR's — ADR-016 §6 as accepted lists two, and nothing \
           here treats the amendment as binding"
  ```
- **Why it is stale:**
  - ADR-016 Amendment 1 is Accepted (`docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 39182e74`, `:238 @ 39182e74`).
  - Its item 1 adds this value to the §6 record (`:206-208 @ 39182e74`).
  - So "PROPOSED", "not the accepted ADR's" and "nothing here treats the amendment as binding" are untrue.
  - The file's own doc comments already say Accepted (`engine/tests/session_identity.rs:116-117 @ 39182e74`, `:209-210 @ 39182e74`).
- **New text:**
  ```
          "the third what-was-checked value, naming the basis. ADR-016 Amendment 1 item 1 \
           (Accepted) adds it to the two §6 values settled at the ADR's acceptance"
  ```
- **Clause check (at C):**
  - "the third what-was-checked value, naming the basis": unchanged; `docs/adr/ADR-016-stable-feature-identity-admission.md:207-208 @ 39182e74`.
  - "ADR-016 Amendment 1 item 1 (Accepted) adds it": the heading carries "— Accepted" (`:180 @ 39182e74`); item 1's last bullet adds the third value (`:206-208 @ 39182e74`).
  - "the two §6 values settled at the ADR's acceptance": the SETTLED block of 2026-09-02 lists `verified-at-open-full-file` and `declared-not-verified` (`:150-157 @ 39182e74`).
- **Unchanged:** the two compared expressions (`engine/tests/session_identity.rs:191-192 @ 39182e74`) and every other line of the file.

**M2: K7's thrown message** (`frontends/shell/e2e/regression.mjs:1830 @ 39182e74`), inside `stepK7`'s `throw` (`:1827-1833 @ 39182e74`).

- **As it stands:**
  ```
          `verbatim (residencyStatus.ts:429-430) but it was ${JSON.stringify(settledStatus)} (per-notch snapshot ` +
  ```
- **Why it is stale:** `frontends/shell/src/residency/residencyStatus.ts:429-430 @ 39182e74` are doc-comment lines. The constant is at `:434-435 @ 39182e74`.
- **New text:**
  ```
          `verbatim (residencyStatus.ts's SETTLED_PARTIAL_WITHIN_BUDGET_TEXT) but it was ${JSON.stringify(settledStatus)} (per-notch snapshot ` +
  ```
- **Clause check (at C):**
  - The constant's name is at `frontends/shell/src/residency/residencyStatus.ts:434 @ 39182e74`. It is the settled, within-budget, partial branch's text (`:462 @ 39182e74`).
  - The local copy `K7_SETTLED_PARTIAL_TEXT` (`frontends/shell/e2e/regression.mjs:1765 @ 39182e74`) equals `residencyStatus.ts:435 @ 39182e74` byte for byte. This is checked by script at H (§4 item 6).
  - The naming form follows `frontends/shell/e2e/regression.mjs:2277 @ 39182e74`.
  - "verbatim" and the rest of the message are unchanged.

**C1: crsAssertionState.ts's harness premise** (`frontends/shell/src/admission/crsAssertionState.ts:9-11 @ 39182e74`; line 8 stays byte for byte).

- **As it stands:**
  ```
   * (this package's own convention -- see `App.tsx`'s `admitAndResetStaleUiState`/`nextScanState`,
   * and `App.test.ts`'s own top comment on why: no `@testing-library/react`-equivalent harness
   * exists here, so anything worth a unit test is factored out of JSX and tested directly).
  ```
- **Why it is stale:**
  - `App.test.ts`'s top comment no longer gives this reason. It says `App` is mounted elsewhere with `react-dom/client` and `act` (`frontends/shell/src/App.test.ts:49-68 @ 39182e74`, piece f F3a).
  - Components are mounted in jsdom in this package, for example `frontends/shell/src/App.lateResult.test.tsx:9 @ 39182e74` and `:19-21 @ 39182e74`. Twelve test files import `react-dom/client`.
  - So the pointer is stale, and so is the inference "anything worth a unit test is factored out of JSX". The clause "no … harness exists" alone stays literally true (piece f §2.5).
- **New text (replaces :9-11):**
  ```
   * so that it is unit-tested as plain functions, with no mount (`crsAssertionState.test.ts`,
   * `CrsAssertionForm.test.ts`). This package's own convention: `App.test.ts` tests `App.tsx`'s
   * `admitAndResetStaleUiState` and `nextScanState` the same way, without rendering `App`.
  ```
- **Clause check (at C):**
  - "unit-tested as plain functions, with no mount":
    - `frontends/shell/src/admission/crsAssertionState.test.ts:4-13 @ 39182e74` imports only vitest and the state module;
    - `frontends/shell/src/admission/CrsAssertionForm.test.ts:10 @ 39182e74` imports the functions, and `:13 @ 39182e74` says it does not mount the component.
  - "`App.test.ts` tests … `admitAndResetStaleUiState` and `nextScanState`": imported at `frontends/shell/src/App.test.ts:16 @ 39182e74` and `:29 @ 39182e74`; both are called in the file. The functions are at `frontends/shell/src/App.tsx:215 @ 39182e74` and `:475 @ 39182e74`.
  - "without rendering `App`": `frontends/shell/src/App.test.ts:52 @ 39182e74`.
  - Not claimed: that no suite ever mounts `CrsAssertionForm` (`AdmissionPanel.tsx` renders it, `:409 @ 39182e74`).

**B1: buildLayers.ts's no-attributes reason** (`frontends/shell/src/canvas/buildLayers.ts:31-34 @ 39182e74`).

- **As it stands:**
  ```
   * `0..1` opacity). Style v0 is literal-only (ADR-023: `viewport_query` carries no attributes, so
   * there is no per-feature value to accessor over), so this is exactly ONE colour for a whole style,
   * not a per-feature table -- a plain array, deck.gl's own "constant attribute" shape, is what this
   * type carries and what `buildLayers` below passes straight through unchanged. */
  ```
- **Why it is stale:** this is the premise piece f's F4 corrected in `renderer/tests/style_shell_agreement.rs:37-39 @ 39182e74`.
  - Style v0's grammar has `match` (`renderer/style-ts/src/style.ts:55 @ 39182e74`). Only the shell's document type is literal-only.
  - `viewport_query` has carried `columns` since `skp/0.6` (`protocol/skp/src/v0/commands.rs:230-231 @ 39182e74`, `:443-448 @ 39182e74`).
  - ADR-023 is Proposed and binds nothing (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 39182e74`).
- **New text:**
  ```
   * `0..1` opacity). The shell's style documents are literal-only (`style/document.ts`'s
   * `StyleDocumentV0` has no `match` variant; `viewport_query` has carried a declared attribute
   * projection since `skp/0.6`, and the shell requests none), so this is exactly ONE colour for a
   * whole style, not a per-feature table -- a plain array, deck.gl's own "constant attribute" shape,
   * is what this type carries and what `buildLayers` below passes straight through unchanged. */
  ```
- **Clause check (at C):**
  - "literal-only … `StyleDocumentV0` has no `match` variant": `frontends/shell/src/style/document.ts:18-22 @ 39182e74`, with the type at `:109 @ 39182e74`. Its only producer is `toStyleDocument` (`:14-15 @ 39182e74`, `:123 @ 39182e74`).
  - "since `skp/0.6`": `protocol/skp/src/v0/commands.rs:230-231 @ 39182e74`, and the field at `:448 @ 39182e74`.
  - "the shell requests none": `frontends/shell/src/skp/client.ts:122-124 @ 39182e74` sends `columns: null`. The request type makes the key required (`frontends/shell/src/skp/types.ts:262-264 @ 39182e74`), and no other non-test file in `frontends/shell/src` sets it.
  - "passes straight through unchanged" is unchanged: `frontends/shell/src/canvas/buildLayers.ts:422 @ 39182e74`, `:447 @ 39182e74`, `:470 @ 39182e74`.
  - ADR-023 is no longer named.

### 2.2 In place

Every row is current-state text, edited in place. No record under `state/` is edited.

### 2.3 OPEN-2: applied only on the human's yes (a yes is class 9, a no is class 5)

These are the stale comment line cites in `frontends/shell/e2e/regression.mjs` (A1), each re-aimed by item name under 2.0 (a). No claim changes.

- **:100-102 @ 39182e74.**
  - **What is stale:** `engine/src/error.rs:244` is not the `Display` arm, which is at `engine/src/error.rs:333 @ 39182e74`. `dataset.rs:1017` and `:1009` are not the `format!` and `convict_or_record`, which are at `engine/src/dataset.rs:1340-1341 @ 39182e74` and `:1332 @ 39182e74`. The `geo.bbox` branch of `sanity_check` calls it (`:1193 @ 39182e74`, `:1227-1233 @ 39182e74`).
  - **New text:**
    ```
    // Verbatim from `engine/src/error.rs`'s `Self::FormatDefaultContradicted` `Display` arm, with
    // the `{detail}` minted at `engine/src/dataset.rs`'s `format!("at level ...")`, inside
    // `convict_or_record`, fed by `dataset.rs`'s `sanity_check`, `geo.bbox` branch -- read back
    ```
- **:1143 @ 39182e74.**
  - **What is stale:** `WorkingCanvas.tsx:1227` is not `fitToExtent`, which is at `frontends/shell/src/canvas/WorkingCanvas.tsx:1376 @ 39182e74`. Its one camera write is at `:1396 @ 39182e74`, and Zoom to layer calls it at `:1581 @ 39182e74`.
  - **New text:**
    ```
     * into view via `WorkingCanvas.tsx`'s `fitToExtent` (one atomic camera change), then settles
    ```
- **:1145-1146 @ 39182e74.**
  - **What is stale:** `residency-harness.mjs:1971-1977` and `:1952` are code. The "P3i-b B4" paragraph is in the S4 doc comment of `runFieldSequenceIdentityCheck`: `frontends/shell/e2e/residency-harness.mjs:2007-2008 @ 39182e74`, `:2018 @ 39182e74`, the reload judgement at `:2027-2033 @ 39182e74`, and the function at `:2053 @ 39182e74`.
  - **New text:**
    ```
     * "P3i-b B4" paragraph of the block labelled S4, in `runFieldSequenceIdentityCheck`'s doc comment,
     * treats a mid-script reload as riskier than this). A plain DOM `btn.click()`, not a
    ```
- **Recommended: yes.** They are comments in a file the node names, inside the lane's terms, and the same edit as M2.

### 2.4 Not changed, recorded

- `frontends/shell/src/admission/identityDeclarationState.ts:6-9 @ 39182e74` and `frontends/shell/src/admission/AdmissionPanel.tsx:187-192 @ 39182e74` (A2) are still true after C1.
- `engine/tests/session_identity.rs` has no other status word. `frontends/shell/e2e/regression.mjs:1830` is its file's only thrown message with a line cite.
- The bare `NEXT-CUT.md` references in `crsAssertionState.ts` and `buildLayers.ts` are another class (the file now lives at `state/NEXT-CUT.md`) and are not taken.

### 2.5 Overlap (rule (00)): in progress, committed ahead, and drafted

- **This piece's paths:**
  - P1 `engine/tests/session_identity.rs`;
  - P2 `frontends/shell/e2e/regression.mjs`;
  - P3 `frontends/shell/src/admission/crsAssertionState.ts`;
  - P4 `frontends/shell/src/canvas/buildLayers.ts`;
  - P5 this form;
  - P6 PLAN.yaml, with the generated `CUSTODIAN-QUEUE.*` and `site/`.
  - Nothing is under `protocol/` or `scripts/plan/`. B1 only reads `protocol/skp/src/v0/commands.rs`.
- **The redaction scan** (`bundle-redaction-scan-not-in-product-publish`, slot 1, in progress).
  - Its form keeps `frontends/shell/src/**` and `frontends/shell/e2e/**` unchanged (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:253-258 @ 39182e74`).
  - Its §7 paths (`:273-292 @ 39182e74`) and the 23 files of the Amendment 3 draft, item 10 (`state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-amendment-3-draft.md:133-161 @ 39182e74`), include none of P1 to P4.
  - Disjoint. Only P6's generated files are shared; they are the custodian's.
- **verify-quotes-round-item-cites** (governance lane, in progress).
  - Its paths (`scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md:284-292 @ 39182e74`) are `scripts/plan/**` and `.github/workflows/governance-ci.yml`. Disjoint.
  - **First contact:** its S2 scans the form of every in-progress piece (`:206 @ 39182e74`, `:236 @ 39182e74`). So every round + item cite in this form must resolve.
  - **Second contact:** if it merges mid-piece, `verify-quotes` and `verify-test-claims` change. E6 names each tool's commit (round 15 (c)).
- **Piece 1c** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, form committed, not in code).
  - Its §2.14 (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:531-581 @ 39182e74`) and its groups name none of P1 to P4. Disjoint.
  - It touches `protocol/` and this piece does not.
- **Milestone 4** (`b1-shell-half`, blocked behind the redaction scan, form not committed; `PLAN.yaml:2353-2368 @ 39182e74`).
  - Its draft edits `canvas/buildLayers` (per-datum `getFillColor`: `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:243 @ 39182e74`, `:331 @ 39182e74`). It also shares `skp/client.ts` and widens `style/document.ts` (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:568-572 @ 39182e74`).
  - P4 is therefore shared if milestone 4 enters code first. Its PR A or PR B would also make B1's facts untrue (§5).
  - **The order:** this piece runs before milestone 4 dispatches. If milestone 4 is in code or awaiting merge at this piece's dispatch, B1 waits, or B1 is dropped as class 5 and milestone 4's form carries the comment.
- **No PR is open** at C.
- **Rule (00) is re-checked at dispatch** against both slots, the governance lane and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature is added or changed, so R3 does not apply.

## §3. Fixtures

None.

## §4. Tests

- **No test is added, renamed or removed. No assertion's compared values or condition change. No mutation is owed.**
- **Two test strings change:**
  - M1, the failure message of one `assert_eq!`, printed only when it fails;
  - M2, the thrown message of K7's status check, printed only when it fails.
  - Neither is a test name (items 2 and 3), and neither is shown by the app.
- No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Evidence at H, each by script with its exit code checked, and each search pattern self-tested positive at B:**
  1. `cargo test -p spatial-engine --test session_identity` passes.
  2. `cargo test -p spatial-engine -- --list` is identical at B and H.
  3. In `frontends/shell`, `npx vitest list` is identical at B and H.
  4. `cargo fmt --all -- --check` exits 0.
  5. In `frontends/shell`:
     - `npx vitest run src/admission/crsAssertionState.test.ts src/admission/CrsAssertionForm.test.ts src/canvas/buildLayers.test.ts` passes;
     - `npm run typecheck` exits 0;
     - `node --check e2e/regression.mjs` exits 0.
  6. Text checks at H:
     - `429-430` has zero matches in `frontends/shell/e2e/regression.mjs`;
     - `PROPOSED ADR-016` has zero in `engine/tests/session_identity.rs`;
     - `carries no attributes` has zero in `frontends/shell/src/canvas/buildLayers.ts`;
     - `testing-library` has zero in `frontends/shell/src/admission/crsAssertionState.ts`;
     - the literal of `K7_SETTLED_PARTIAL_TEXT` equals the literal of `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` byte for byte.
  7. Hunk shape:
     - `git diff -U0 B...H` has exactly four hunks, inside M1, M2, C1 and B1's spans (seven under OPEN-2, adding its three spans);
     - every changed line in P3 and P4 begins with ` *`;
     - in P1, `:191-192`'s two expressions are byte-identical;
     - in P2, line 1830 differs only inside the parenthesis (a masked diff).

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:**
  - E1: §4 items 1 to 7 hold.
  - E2: `node scripts/plan/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs` exit 0 at H and in the done commit, each named with the tool's commit.
  - E3: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E4: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E5: PR CI is green.
  - E6: the numstat is 5, 2, 6 and 9 for P1 to P4 (P2 becomes 14 under OPEN-2).
- **Declared unchanged:**
  - every file but P1 to P6;
  - every code token, condition, compared value and literal, except M1's and M2's message text;
  - every test name;
  - every existing quoted span;
  - `protocol/**`, `scripts/**`, ADRs, docs/, KNOWN-LIMITATIONS.md;
  - every record under `state/`.
- **Invalidators (stop and report):**
  - at B, any of these: ADR-016 Amendment 1 is not Accepted; `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` is renamed or moved out of `residencyStatus.ts`; `client.ts` sends non-null `columns`; `StyleDocumentV0` gains `match`; `App.test.ts` no longer tests the two functions without a render;
  - a rewrite that would need a code, condition or literal change;
  - a fact cited here that changed at B, as opposed to a moved line.
- **Falsified if** a rewritten clause is shown untrue at B.

## §6. Instruments

Assertions only (§4, E1 to E6). No measurement. No operator step.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H -- <path>`, insertions plus deletions. B and H are named in the PR body.
- **Ceilings:**
  - engine/tests/session_identity.rs: 6;
  - frontends/shell/e2e/regression.mjs: 3, and 15 under OPEN-2;
  - frontends/shell/src/admission/crsAssertionState.ts: 8;
  - frontends/shell/src/canvas/buildLayers.ts: 10.
- **Totals:** at most 27 lines (39 under OPEN-2). Files: at most 6 non-generated, P1 to P6.
- **Budget:** 60 minutes (`PLAN.yaml:4508 @ 39182e74`).
- **No constant is added.** An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. A changed non-comment line other than M1's two message lines and M2's line.
2. A changed test name, compared value, condition or app string.
3. A path outside §7, anything under `scripts/plan/` or `protocol/`, or OPEN-2 applied before its answer.
4. A rewritten clause that claims more than its cite shows. That includes `CrsAssertionForm` called never mounted, the shell called unable to request columns, ADR-023 called binding, or K7 called passed.
5. A status word that does not match the ADR's Status line.
6. A quotation not byte-copied, or a byte changed in an existing quoted span.
7. A new bare `path:line` in rewritten text, a pin split across lines, or a pin at a branch commit.
8. A §7 overrun not recorded as class 8, or §7 edited.
9. A scope addition not recorded as class 9 before its code.
10. A record that calls a `verify-mutation` run an observation of a mutation.
11. A record under `state/` edited.
12. Code while milestone 4 is in code or awaiting merge on P4, unless B1 has been dropped (§2.5).

## §9. Gates

- **Architect and reviewer, full gating.**
  - The architect checks each clause of §2.1 (and §2.3 on a yes) at B, the status words, and then §8 item by item.
  - The reviewer checks the full diff, §4 by script, and E1 to E6.
- **Verdicts** are proportional (product-first, section 2). A clause's truth is Correctness, and E1 to E6 are Evidence.
- **Wording (§31):** none of these lines is the human's wording. A gate's replacement words are applied with no re-gate and listed in the PR body.
- **Briefs** carry THE MACHINE paragraph as written for items 1 to 5 of §4 (`state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 39182e74`).
- **Operator:** none. No walkthrough row, and no KNOWN-LIMITATIONS item.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. The answer to OPEN-1 is recorded before code. A yes to OPEN-2 is class 9, and a no is class 5.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | the lane's terms and the two message strings | (A) | no |
| OPEN-2 | regression.mjs's three stale comment line cites (§2.3) | yes | no |
| OPEN-3 | the same-class lines outside the four files | (a), a new node | no |

---

## OPEN items, with my recommendation

**OPEN-1: the two message strings and the lane's terms.**
- **The conflict.** The lane allows documents, comments and test names only (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19 @ 39182e74`). M1 and M2 are failure-message strings, which are none of those. The node's own summary says the docs lane cannot take them (`PLAN.yaml:4512 @ 39182e74`), and the human placed it in the docs lane anyway.
- (A) Read the placement as the human's admission of these two strings into this piece only. No test's name or condition changes, and neither string is shown by the app; §4 items 2, 3 and 7 prove it.
- (B) The piece takes C1 and B1 only. M1 and M2 go to a new slot node.
- (C) The whole piece leaves the docs lane for a slot.
- **Recommended: (A).** It is the smallest. The proof that no test changes is mechanical, and it is what the placement most plausibly means.

**OPEN-2: regression.mjs's stale comment cites at :100-102, :1143 and :1145-1146** (§2.3).
- They are comments in a named file, inside the lane, and the same edit as M2. They add 12 lines.
- **Recommended: yes.**

**OPEN-3: the same-class lines outside the four files.** None has a node:
- piece f's re-sweep list (`state/consults/2026-10-14-stale-test-names-and-comments-resweep-architect.md:51-61 @ 39182e74`, `:127 @ 39182e74`). At C, `frontends/shell/src/residency/residencyStatus.test.ts:73`, `:75`, `:176` and `:178 @ 39182e74` still call ruled strings drafts. Two of them are `describe` titles, which are name changes. `frontends/shell/src/residency/residencyArm.test.ts:78 @ 39182e74` still says `App` cannot be rendered. `frontends/shell/src/canvas/WorkingCanvas.test.ts:703 @ 39182e74` is still there;
- also `engine/src/identity.rs:68 @ 39182e74` and `:70 @ 39182e74`, whose line cites into `session_identity.rs` no longer point at the `pairs` closure (`engine/tests/session_identity.rs:146-152 @ 39182e74`) or at the test (`:135-172 @ 39182e74`).

Options:
- (a) A new proposed docs-lane node for them.
- (b) Fold them into this piece by class 9. That is three more files, about 25 lines, and two name changes.
- **Recommended: (a).** This piece stays the node's four lines, and the name changes get their own list evidence.

## What I could not settle

- **No hashes.** I have no shell. Every pin needs the custodian's script, and the "as it stands" blocks need a byte check against the tree.
- **M1's old line numbers at 19b01c40** are inferred from piece f's OPEN-3 (b) rewrite, not read at that commit.
- **Whether a mounted-`App` suite reaches `CrsAssertionForm`** through `AdmissionPanel`'s CRS refusal path. C1 is written so that it does not depend on the answer.
- **Whether `npm run typecheck` is heavy under THE MACHINE.** Its `pretypecheck` builds the viewer and the notice. The custodian decides whether it runs inside the hold.
- **Whether the gate wants M2's line split** to satisfy 2.0 (d). §7 allows 3 lines for that.
- **Milestone 4 and B1.** If milestone 4's PR A or PR B is dispatched before this piece, B1 must be re-drafted against that base or dropped (§2.5, §5).
