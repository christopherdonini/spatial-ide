*Custodian's filing note (2026-10-24): the architect's draft of ADR-023's acceptance notes, drafts only by the human's word, read only at main ae8cfdcc. Nothing is committed from it until B1's close; the ADR's status words are the human's. The run 14:18:32Z to 14:29:13Z by its transcript (Read 51, Grep 62, Glob 1; no write and no shell). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 4a3338011989bc013671cf9a7472da98c442bb3eee921e18db44d8b0382db71e.*

---

Drafted: ADR-023's acceptance notes, at main ae8cfdcc

These are drafts only, as the human's word says (`state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:17 @ ae8cfdcc`). I rule nothing here. I read the main checkout only, and I take HEAD to be ae8cfdcc from the session's git status. **I have no shell, so this report contains no sha256 and the HEAD is unconfirmed.** Every `path:line` is `@ ae8cfdcc`. Ledger passages are cited by round, item or entry, never by line. Every sentence below is my own words unless it is marked as a quote. Quotes are byte-copied from my Read, not by script, and the custodian should re-check them by script.

---

# The draft

## 1. What the human accepts

1. **ADR-023 as it stands**, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:1-161 @ ae8cfdcc`. This covers the Decision §§1–12 (`:26-138`), the "Conditions carried into B1" (`:140-149`) and entry 79's rulings (`:151-155`). The Decision text itself was already accepted as drafted (`:14-15`; RULED 2026-09-14, question set D, item D2). What the acceptance changes is the Status: it is held at Proposed "until B1's close" (`:15`, `:31`, `:149`).
2. **ADR-023's Amendment**, headed "Amendment 2026-09-29 (Proposed; for the human's acceptance with B1's close) — a column name DuckDB binds but its Arrow export does not carry" (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:163-184 @ ae8cfdcc`).
3. **ADR-021's Note**, headed "Note 2026-09-29 — a column that is not addressable is excluded from the namespace by name" (`docs/adr/ADR-021-row-filter-on-viewport-query.md:237-242 @ ae8cfdcc`).
   - The human already accepted this Note on 2026-09-29 (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md:7-9 @ ae8cfdcc`), and it is on main.
   - It is accepted "together" at B1's close because its "not addressable" is defined by item 2 above (`state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md:15-16 @ ae8cfdcc`; `PLAN.yaml:1221 @ ae8cfdcc`).
4. **The dated notes, in the human's own words.** These are milestone 4's OPEN-15 (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20 @ ae8cfdcc`), condition 2 (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:145 @ ae8cfdcc`) and the B1 form's F6 (`engine/B1-PROJECTION-PREREGISTRATION.md:51 @ ae8cfdcc`). They are new text. §3 lists what each note must state.
5. **Two items the ADR leaves for acceptance:**
   - whether ADR-023 becomes architect-blockable. Its Status says it is not (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:5 @ ae8cfdcc`). ADR-034 records the same question at `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:187 @ ae8cfdcc`;
   - §3's flagged deviation (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:81 @ ae8cfdcc`). Entry 79, item (1) already ruled it.

## 2. The conditions, and their state at main

| # | Condition | State at ae8cfdcc |
|---|---|---|
| C1 | `b1-engine-kernel-half` (`PLAN.yaml:617-633 @ ae8cfdcc`) | **met**: done, #134 |
| C2 | `b1-close-nul-column-names` (`PLAN.yaml:3266-3282 @ ae8cfdcc`), the Amendment's code | **met**: done, #143. Its code took `skp/0.7` (`protocol/skp/SKP-V0.md:951 @ ae8cfdcc`) |
| C3 | `b1-shell-half` (`PLAN.yaml:2353-2369 @ ae8cfdcc`) | **waiting**. PR A is merged (#246). PR C is in code (`cut/b1-shell-half-pr-c`). PR B needs three things first: `record-step-style-match-widening` (`PLAN.yaml:5788-5804 @ ae8cfdcc`, still proposed; OPEN-18 (b) makes it 1c step 1's first commit), 1c step 1 merged, and #241 merged (`state/consults/2026-10-23-v0-2-scope-proposal-architect.md:76-77 @ ae8cfdcc`) |
| C4 | `entry-79-b1-consult-items` (`PLAN.yaml:1206-1222 @ ae8cfdcc`), the node that closes B1 | **waiting**: blocked on C3. Entry 79's items (1) and (3) were delivered by #134, and item (2) by #246, in the Feature tab |
| C5 | B1 condition 1: the style module's in-code assertion corrected (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:144 @ ae8cfdcc`) | **met** by #246 (`frontends/shell/src/style/document.ts:18-21 @ ae8cfdcc`) |
| C6 | B1 condition 2: the Context corrigendum | **made by the acceptance itself** (§3, N1) |
| C7 | B1 condition 3: the memory consequence of per-column retention declared | **partly met**. `MAX_ATTRIBUTE_RETENTION_FACTOR = 2` is declared (`engine/src/stream.rs:109 @ ae8cfdcc`). The kernel's composed per-stream figure does not cover a projected stream (`kernel/README.md:72-76 @ ae8cfdcc`), and that work is the proposed, unplaced node `kernel-composed-ceiling-projected-stream` (`PLAN.yaml:3806-3822 @ ae8cfdcc`). See OPEN-B |
| C8 | B1 condition 4: the `filter_composition` tests re-pinned projection-aware | **met** by #134 (`engine/src/stream.rs:3527 @ ae8cfdcc`, `engine/src/stream.rs:3633 @ ae8cfdcc`) |
| C9 | §4's constant: renamed, or paired with a second declared constant | **met** by the rename to `MAX_PROJECTED_ATTRIBUTES` (`engine/src/attributes.rs:68-70 @ ae8cfdcc`) |
| C10 | Fable sights the Amendment's text before its code | **met** (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md:13-38 @ ae8cfdcc`) |
| C11 | v0.2's O5: acceptance at B1's close, before the tag | **ruled** (`state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:13 @ ae8cfdcc`, item 6) |
| C12 | The new refusal strings sighted "at B1's close" (`engine/B1-PROJECTION-PREREGISTRATION.md:80 @ ae8cfdcc`), together with A1-1's wording review (`PLAN.yaml:3299 @ ae8cfdcc`) | **waiting** on the sitting's Part AC (milestone 4 OPEN-14). A1-1's node is proposed and unplaced. See OPEN-C |

## 3. The records the acceptance makes, in order

**R1. The human's typed words** (a red line: `AI_DEVELOPMENT.md:451 @ ae8cfdcc`). They should cover:
- the acceptance line, which names items 1 to 3 of §1;
- architect-blockability;
- the notes N1 to N9 below, in the human's words;
- OPEN-B and OPEN-C.

**R2. Commit D (the custodian, on main): the directive file and its RULED block.**
- The file is `state/directives/<date -u +%F>-adr-023-accepted-<…>.md`. It has a filing note and a rule, and below the rule the text byte-copied by script, with one final newline added.
- A RULED block goes in `DECISIONS-PENDING.md` (§105).
- The pattern is `state/directives/2026-10-05-adr-034-acceptance.md:3 @ ae8cfdcc`.
- D comes first, so that commit A can pin D's lines at a commit on main (round 15 (e)).

**R3. Commit A (the custodian, on main, after D): the acceptance commit.**
- **Status, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ ae8cfdcc`, edited in place.** Lines 4-6 stay as they are, so no line below moves (see OPEN-A). Line 3 becomes:
  `**Status:** [the human: …] *Original status line, retained:* Proposed — **decision deliberately undrafted; binds nothing.** Filed 2026-08-15 as`
  - The "Original status line, retained" form is ADR-025's (`docs/adr/ADR-025-publish-above-the-readers-ceilings.md:3-7 @ ae8cfdcc`).
  - The tool needs exactly one Status line (`frontends/shell/scripts/adrIndex.mjs:148-161 @ ae8cfdcc`). It reads the paragraph up to `**Drafted by:**` (`frontends/shell/scripts/adrIndex.mjs:163-170 @ ae8cfdcc`). **No other line in ADR-023 may begin with `Status:` or `**Status:**`.**
- **An appended `## Acceptance (<date>)`, after `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:184 @ ae8cfdcc`.** It holds:
  - one filing line, which pins D's lines as `path:a-b @ <D> sha256:<hex>`;
  - the human's notes, byte-copied by script, marked as such and fenced (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:203-214 @ ae8cfdcc`);
  - no custodian prose that restates them (the record cap).
- **`docs/README.md:61 @ ae8cfdcc`, regenerated** with `npm run adr-index` in `frontends/shell`, then `npm run verify:adr-index`.
- **Nothing else in ADR-023 changes,** and from commit A it changes only by appended amendment. That is the human's ADR-036 wording (`state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8 @ ae8cfdcc`), and the precedent commit is `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:564 @ ae8cfdcc`.
- **ADR-021 is not edited** (see OPEN-D).

**What each note must state.** The facts are mine and are given for the human's drafting; the words are the human's.
- **N1 (condition 2).** The Related header's "publish-path only", twice (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:11-13 @ ae8cfdcc`; the target named at `state/drafts/post-tag/architect-consult-b1-adr-004-data-plane-review.md:79 @ ae8cfdcc`), and the Context's "has no projection parameter … reachable only from `stream_for_publish`" (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:21-22 @ ae8cfdcc`) have been historical since #134. `viewport_query` carries `columns` (`protocol/skp/src/v0/commands.rs:448 @ ae8cfdcc`; `engine/src/stream.rs:1012 @ ae8cfdcc`).
- **N2 (F6, §10).** §10's `skp/0.4` (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:120 @ ae8cfdcc`) is wrong:
  - B1 shipped at `skp/0.6` (`protocol/skp/SKP-V0.md:913 @ ae8cfdcc`);
  - the Amendment's code shipped at `skp/0.7` (`protocol/skp/SKP-V0.md:951 @ ae8cfdcc`);
  - §10's own rule corrected the number in the B1 form, not in the ADR (`engine/B1-PROJECTION-PREREGISTRATION.md:188 @ ae8cfdcc`).
- **N3 (OPEN-15, §6, entry 79 (2)).** The inspected feature's projected columns are shown in the Feature tab (`frontends/shell/src/feature/FeatureTab.tsx:27 @ ae8cfdcc`). The hover readout is unchanged, by OPEN-3 (a), confirmed (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20 @ ae8cfdcc`), and KNOWN-LIMITATIONS item 52 states it (`KNOWN-LIMITATIONS.md:415 @ ae8cfdcc`). Entry 79 (2) is therefore read as the inspection surface.
- **N4 (OPEN-15, §7 and §11 item 6).** "Style stays ephemeral in B1" and "Any style persisted in B1" (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:103 @ ae8cfdcc`, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:129 @ ae8cfdcc`) are overtaken by:
  - ADR-022 Amendment 1, the session history (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-78 @ ae8cfdcc`);
  - OPEN-4 (A′), the category style recorded through `record_step`'s widening;
  - ADR-022 Amendment 2, the project file, which is not yet on main and lands with 1c step 1's first commit.
- **N5 (§3 and §12, the human's questions).** Entry 79 (1) to (3) ruled them. The set is eight codes (`protocol/skp/SKP-V0.md:1200-1207 @ ae8cfdcc`), and `[]` is refused (`protocol/skp/SKP-V0.md:1179-1180 @ ae8cfdcc`).
- **N6 (§4 and §12, the architect's items; conditions 3 and 4).** C7, C8 and C9 as in §2, with C7's per-stream figure as OPEN-B rules it.
- **N7 (recommended).** The Decision's line cites were read for the draft of 2026-09-10 (`state/drafts/post-tag/architect-consult-b1-adr-023-decision.md:1 @ ae8cfdcc`), and the tree is authoritative. §5's self-cite `ADR-023:29-30` (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:95 @ ae8cfdcc`) no longer points at the Context (round 14's rule that a pin is never silently read as current).
- **N8.** The Consequences "of the deferral" (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:157-161 @ ae8cfdcc`) are history. "Hover shows `id` only" stays true (N3), and "styles by literal only" ends at PR B's merge.
- **N9.** ADR-021's Note 2026-09-29 is accepted with item 2, which it depends on.

**R4. The docs piece (§4).**
- Its form is committed before its code.
- Its branch edits the lines in §5 marked "change", after commit A.
- It needs one reviewer gate under §21b, if its Out-of-scope line holds. The merge is the human's click.
- Rule (00) is checked at dispatch. `kernel/README.md` is in 1c's scope, and `engine/README.md:550` is edited by any third-slot engine piece that adds a form.

**R5. PLAN.** `entry-79-b1-consult-items` is set done, with `{pr: <docs PR>}`, only in the done commit, after R4 merges. That satisfies `release-v0-2-0`'s dependency (`PLAN.yaml:5965 @ ae8cfdcc`).

## 4. The five-line form

**Read before the form.** An ADR Status line is a §21a category (`AUTONOMY.md:319-320 @ ae8cfdcc`). Under §25 (e) (`AUTONOMY.md:482 @ ae8cfdcc`), any piece whose Out-of-scope line names one takes the full form from dispatch. **So a five-line form cannot carry ADR-023's own edit.** The form below covers only the derived lines, and commit A carries the ADR edit (see OPEN-E). The path I propose is `engine/ADR-023-ACCEPTANCE-RECORDS-PREREGISTRATION.md`. The cites are to be pinned by script at A, and the bracketed parts are filled from D and A.

```
Authority: PLAN node entry-79-b1-consult-items (B1's close); the human's acceptance of ADR-023, state/directives/<D-file>.md (filed at <D>), applied by the acceptance commit <A>; v0.2 O5 (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 6).
Scope: engine/ADR-023-ACCEPTANCE-RECORDS-PREREGISTRATION.md, docs/02_Architecture.md, docs/README.md (the Conventions paragraph only; the generated block is untouched), engine/README.md, kernel/README.md, engine/src/lib.rs — 6 files; at most 30 changed lines, insertions plus deletions, this form excluded.
Change: every line that calls ADR-023 Proposed states its acceptance of <date> — by dated correction where the line is narrative (docs/02_Architecture.md:86, the ADR-023 clause of docs/README.md:27; the pattern of docs/02_Architecture.md:90), and by moving it between lists where the line is an index (engine/README.md:549 and :553, kernel/README.md:386 and :391), with engine/README.md:8-9 and engine/src/lib.rs:8-9 reading "ADR-023, Accepted" and engine/README.md:550 listing this form [and, per OPEN-F, ADR-036 moved on the same index lines]; nothing else changes.
Tests+mutation: none added (documentation and one doc comment); at the head, npm run verify:adr-index PASS unchanged, verify-cites and verify-quotes PASS, and a script count of "ADR-023 stays Proposed", "ADR-023 (proposed" and "binding nothing:** ADR-023" equal to 0 across the six files, each pattern self-tested positive at the base.
Out-of-scope: touches none of §21a's four — no file under docs/adr/ (ADR-023's Status line and Acceptance section are commit <A>, the human's typed words, before this piece), no security posture, nothing under protocol/ and no wire field, literal or fixture, no stated guarantee or invariant, and no user-visible string.
```

**Words for the two narrative lines.** These are mine, and each is clause-checked.
- **`docs/README.md:27 @ ae8cfdcc`.** The clause "**ADR-023** (attribute projection on `viewport_query` — Proposed with its decision **deliberately open**, filed as the named home for the categorical/live-attributes deferral; no implementation licensed)" gains, before its closing parenthesis: `; *dated correction, <date>: Accepted <date> at B1's close, on the human's word — see the ADR's Status line and its Acceptance section; the words above are retained as written*`.
  - Clause check: the date and the words "on the human's word" come from D, and "Status line and Acceptance section" from A.
  - That paragraph is the human's wording (`frontends/shell/scripts/adrIndex.mjs:17 @ ae8cfdcc`), so §31's three answers apply.
- **`docs/02_Architecture.md:86 @ ae8cfdcc`.** I could not establish who worded this line. The bullet's head becomes `**ADR-023 (accepted, <date> — dated status correction at B1's close: this line read "proposed — decision deliberately open" until this correction)**`. Its sentence from "Until decided" onward is replaced by the sentence below, each clause checked against the source shown:
  - "an optional, ordered `columns` list": `protocol/skp/src/v0/commands.rs:448 @ ae8cfdcc`;
  - "`[]` refused": `protocol/skp/SKP-V0.md:1179 @ ae8cfdcc`;
  - "one admission function shared with publish": `engine/src/attributes.rs:78 @ ae8cfdcc`;
  - "eight typed `skp.projection_*` refusals, before any lease or mint": `protocol/skp/SKP-V0.md:1173-1177 @ ae8cfdcc`, `protocol/skp/SKP-V0.md:1200-1207 @ ae8cfdcc`;
  - "a live ceiling of 32 columns": `engine/src/attributes.rs:70 @ ae8cfdcc`;
  - "`describe.schema[].projectable` from the kernel": `protocol/skp/src/v0/commands.rs:235 @ ae8cfdcc`;
  - "a column whose bound and exported names differ is not addressable": `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:173 @ ae8cfdcc`;
  - "the inspected feature's projected columns in the Feature tab, the hover readout showing none": `frontends/shell/src/feature/FeatureTab.tsx:27 @ ae8cfdcc`, `KNOWN-LIMITATIONS.md:415 @ ae8cfdcc`;
  - "colour by category over one projected text column": **checked only at PR B's head**, because it is not on main.

## 5. Tracked lines that call ADR-023 Proposed or unaccepted

**To change in R3 (commit A):** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ ae8cfdcc` and `docs/README.md:61 @ ae8cfdcc` (generated).

**To change in R4 (the docs piece):**
- `docs/02_Architecture.md:86 @ ae8cfdcc`
- `docs/README.md:27 @ ae8cfdcc` (the ADR-023 clause only)
- `engine/README.md:8-9 @ ae8cfdcc`, `engine/README.md:549 @ ae8cfdcc`, `engine/README.md:553 @ ae8cfdcc`
- `kernel/README.md:386 @ ae8cfdcc`, `kernel/README.md:391 @ ae8cfdcc`
- `engine/src/lib.rs:8-9 @ ae8cfdcc`

**To leave as history:**
- **Inside ADR-023:** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:4-6 @ ae8cfdcc` (retained), `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:14-15 @ ae8cfdcc`, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:31 @ ae8cfdcc`, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:149 @ ae8cfdcc`, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:163 @ ae8cfdcc`, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:165 @ ae8cfdcc`. The Acceptance section reads them as history.
- **ADR-021:** `docs/adr/ADR-021-row-filter-on-viewport-query.md:233 @ ae8cfdcc` ("does not change ADR-023's Status", which was true when written).
- **Forms:** `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:20 @ ae8cfdcc`, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:163 @ ae8cfdcc`, `engine/B1-PROJECTION-PREREGISTRATION.md:77 @ ae8cfdcc` and every other form or consult. These records are append-only.
- **PLAN summaries:** `PLAN.yaml:574 @ ae8cfdcc`, `PLAN.yaml:632 @ ae8cfdcc`, `PLAN.yaml:1221 @ ae8cfdcc`, as done or closing records.
- **Other history:** `RELEASE-0.1.md`, `AUTONOMY.md:417 @ ae8cfdcc`, `frontends/shell/MANUAL-WALKTHROUGH.md:878 @ ae8cfdcc` (Part M, M6).

**Not a status claim, and owned elsewhere:**
- `QUICKSTART.md:87 @ ae8cfdcc` and `KNOWN-LIMITATIONS.md:77 @ ae8cfdcc` change with PR B and the release rewrite;
- `frontends/shell/src/style/document.test.ts:98 @ ae8cfdcc` changes with PR B.

Neither `protocol/skp/SKP-V0.md` nor any shell source calls ADR-023 Proposed.

---

# OPEN items

- **OPEN-A. How the Status line is recorded.**
  - (a) ADR-025's form, as in R3: line 3 in place, with lines 4-6 retained.
  - (b) ADR-036's form: the whole paragraph `:3-6` is replaced by the human's words alone. Every line below moves up by 3, so the bare records' cites into ADR-023 (`:14`, `:97`, `:144`, `:153`, `:173`) silently name other text.
  - **Recommend (a).**
- **OPEN-B. Condition 3 (C7).**
  - (a) Accepted as met by the retention factor, with the per-stream figure named as open under `kernel-composed-ceiling-projected-stream`.
  - (b) That node is placed and done before B1's close.
  - **Recommend (a).** The condition says the memory consequence is declared, and the kernel's README says in plain words that its composed table does not cover a projected stream.
- **OPEN-C. The strings sighted "at B1's close" (C12).**
  - (a) B1 closes at PR B's merge, and the sight is carried to Part AC at the sitting.
  - (b) The acceptance waits for the sitting.
  - **Recommend (a).** It follows v0.2's order (`state/consults/2026-10-23-v0-2-scope-proposal-architect.md:149-151 @ ae8cfdcc`). The B1 form's line should then be named in N5 as carried.
- **OPEN-D. ADR-021 at acceptance.**
  - (a) No edit; the acceptance line names the Note.
  - (b) A dated one-line Note is appended in the human's words.
  - **Recommend (a).** The Note is already accepted, and nothing in ADR-021 reads ADR-023 as Proposed.
- **OPEN-E. Gating of commit A.**
  - (a) The ADR-034 and ADR-036 precedent: the custodian applies the human's typed words directly. The architect checks the human's notes once against the code before commit A, under §31 ("their own words … checked once"), with no re-gate.
  - (b) The ADR edit rides a full-form PR under §21a.
  - **Recommend (a).** The notes N1 to N9 state code facts, so a single check guards against a claim the code does not support.
- **OPEN-F. ADR-036 on the same index lines.** `engine/README.md:553 @ ae8cfdcc` and `kernel/README.md:391 @ ae8cfdcc` list ADR-036 as Proposed, although it was accepted on 2026-10-22.
  - (a) The docs piece moves it too, declared in the form's Change line at dispatch.
  - (b) It is left to its owner.
  - **Recommend (a) for engine/README.md**, because no piece owns that line. For kernel/README.md, (a) applies only if 1c's step 1 has not already edited the line; 1c's list names `kernel/README.md:375 @ ad921f55`, and I could not tell whether that is the same line.

# What I could not settle

- HEAD = ae8cfdcc, and every hash: I have no shell.
- Who worded `docs/02_Architecture.md:86`.
- Whether `kernel/README.md:375 @ ad921f55` is today's `:391`.
- The PR number of the docs PR that landed the Amendment and the ADR-021 Note. `PLAN.yaml:3281 @ ae8cfdcc` names the route but not the number.
- The commit that the Decision's 2026-09-10 cites were read at. The draft does not name one.
