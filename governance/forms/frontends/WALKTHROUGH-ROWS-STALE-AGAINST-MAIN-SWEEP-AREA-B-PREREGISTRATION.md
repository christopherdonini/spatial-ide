# shell docs: the walkthrough rows stale against main, sweep area B — full preregistration

*Committed before any change. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node walkthrough-rows-stale-against-main-sweep-area-b, first in the docs lane by the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`), with B7's L5 step folded in. The form, its row table, the OPEN items and what could not be settled are the architect's draft (`state/consults/2026-11-05-walkthrough-rows-stale-against-main-sweep-area-b-form-architect-draft.md`, read only at main 8b9193a1; extracted sha256 08cea0f99b73eaff4457fb7ee37eb641cac8d43853865f9738dfed9bde81f761), carried byte for byte with these changes, all the custodian's: each `WT:` cite written with the file's path (23); each cite the draft writes `path:line @ 8b9193a1…` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (90 pins; 0 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; 1 written with an elided path, kept as written; bare line numbers kept as written); this title and lead line added; the draft's opening paragraph dropped; the custodian's settlement added. Every row's new words are the architect's, checked against the code by the gates under the human's Part 1, item 1 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`), and seen by the human at the click. Form path: `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The form (full form): `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`

**Authority**
- The human's ruling of 2026-11-05 (evening), item 2: `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:11 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c1584a76aa6aa1234b9ad501514f3de1cadbb08d523edb6a6affecbc3a58232a`. It places this piece first in the docs lane, before the sitting, with B7's L5 step folded in.
- The human's gate-round rulings: `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, Part 1, items 1 to 9, by reference. Item 1 governs every row: the words are written from the code and checked clause by clause.
- The node: `governance/PLAN.yaml:6685-6701 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:dc52c0ea1891385c9b9ecf141e1de15f6b78f93cc1e144ee91bbb3f391979212`.
- The triage: `state/consults/2026-11-05-drift-sweep-areas-a-b-triage-architect.md:109-221 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a0ba93604b37f3099669dc8bd1a837153535b148797fb201ad8e3188b008259f` (Area B) and `:240-258 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the proposal).
- The sweep: `state/consults/2026-11-03-platform-drift-sweep-area-b.md:31-53 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e1372e47fe1be6014b5b2439b769ff7e8bcb2c6c38093a0e21662a0de34544b6`.
- The precedent: `governance/forms/frontends/WALKTHROUGH-STALE-CITES-L5-DEGREES-P1-PREREGISTRATION.md` (structure followed section by section).
- The reuse index **missed both queries**: no prior art is recorded. The output, carried byte for byte:
```text
$ node tools/reuse.mjs manual walkthrough operator rows   (exit 1)
No prior art recorded for "manual walkthrough operator rows". Research it before planning an implementation.
$ node tools/reuse.mjs residency tile size level reload   (exit 1)
No prior art recorded for "residency tile size level reload". Research it before planning an implementation.
```

**Drafted by:** the architect, read only, at 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a.

**Whose words:** every new span is the architect's. Whether any old span is the human's typed wording is not established (OPEN-6). The worker settles it at B with `git log -L` before any edit.

**Committed before any change:** by the custodian on main.

**Gating: full, both gates (architect, then reviewer).**
- The basis is §21a's fourth category, "any property currently under test" (`governance/AUTONOMY.md:325-327 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7`). The rows in Parts L, J and B, and the regression coverage row, restate properties that e2e steps and hooks assert:
  - the K2 arm and level hooks;
  - `ECHO'`/`TWOCMD'`, `HEXLIM'` and `CLASSC'`;
  - `B2'`/`B3'`.
- §25(e) (`governance/AUTONOMY.md:482 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`) therefore closes the five-line form at dispatch: its Out-of-scope line would have to name a §21a category.
- The size sits inside §21c's bounds (§7 below). It does not decide the route, and the precedent read its own case the same way.

### §0 Disclosure
This piece edits one gated file, `frontends/shell/MANUAL-WALKTHROUGH.md`, and nothing else under a gate. It does not touch:
- code, tests or e2e scripts;
- any result log or run record (a recorded result stays as recorded);
- the sitting script under `state/drafts/` (OPEN-5).

The PLAN node's status changes are the custodian's, on main.

### §1 May claim / may not claim
**May claim:** that each changed span states what the code at the dispatch commit does, clause by clause, as checked in §2.1.

**May not claim:**
- anything observed live (no run is made);
- any timing;
- that a reload re-initialises the arm and level, as an executed fact. That is read from module initialisation (§2.1, B7); the operator's getter read in the new preamble is the live check.

### §2 Rules and rows
**2.0 Rules**
- (a) Edit only the spans in 2.1. Everything else stays byte-identical.
- (b) No hunk at or after the `Result log` heading, located by its heading text, not by a line number.
- (c) A run-record row (Part H's H1, H2 and H5) is not edited in place. A dated pointer paragraph is added after Part H's existing 2026-09-08 pointer, following that pointer's own form.
- (d) Every clause of every new span resolves against the code cites in 2.1, re-read at the dispatch commit. If code has moved, the clause is re-checked, not carried.
- (e) A span that `git log -L` shows to be the human's typed words is held for the human under §31 (OPEN-6). The other spans proceed.

**2.1 Rows:** see the row table below. It is the form's §2.1 whole.

**2.2 In place.** All edits are in place in `frontends/shell/MANUAL-WALKTHROUGH.md`. Three are additions, not edits:
- the Part H pointer;
- the two coverage notes.

**2.3 Overlap.** Under rule (00), each walkthrough Part counts as its own path. This piece's paths are:
- `frontends/shell/MANUAL-WALKTHROUGH.md`: "What `e2e/regression.mjs` covers", "What `e2e/filter-panel.mjs` covers", Part A, Part B, Part H, Part J, Part L and Part N (and Part F only if OPEN-1 takes (a));
- this form.

Disjoint from all of the following:
- `cut/port-2-macos-l1-and-app-dirs` (nothing under `frontends/`);
- `cut/b2-piece-1c-save-and-reopen` (nothing under `frontends/`);
- `cut/b1-shell-half-pr-c` (0 files);
- 8c (`engine/`);
- `publish-filter-sentence-under-whole-dataset` (`publish.rs`, `src/publish/`, KNOWN-LIMITATIONS item 8; this piece reads KNOWN-LIMITATIONS but does not edit it).

The only claim on a Part is b1-shell-half's PR B on Part F (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:399 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b474581e8484d5189302a0b10f59035351c52cc8d09aeec9994d986b35e89838`, `:474 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`). Hence OPEN-1. No path touches `protocol/`, wire fixtures, `Cargo.lock` or `package-lock.json`.

**2.4 Portability.** No new platform claim. The Windows-only rows (N6 to N8) are not edited.

### §3 Fixtures
None.

### §4 Evidence (the worker runs these at H against B = the dispatch base, three-dot)
1. `git diff -U0 B...H -- frontends/shell/MANUAL-WALKTHROUGH.md`. Every hunk lies inside a span named in 2.1 or is one of the three additions in 2.2.
2. Byte-identical outside the spans: the file at H with the 2.1 spans reverted equals B.
3. Content checks at H. Each new span's distinctive strings are present once: `getResidencyTileSizeLevel()`, `.crs-assertion-form` (in row `B2'`/`B3'`), `columns, filter, limit}` (in J2) and `record_step` (in J3 and the Part H pointer).
4. Absence patterns at H, count 0 each:
   - `silently resets to`
   - `cut-2 remediation note`
   - `a note reads that remediation`
   - `never more than two`
   - ``{skp, dataset, bbox, bbox_crs, filter, limit}``
   - `16 numbered items`
   - `confirm none of the five limitations`
5. Positive self-test at B: each pattern in 4 counts ≥1 at B, and the script's exit code is checked. A pattern that finds nothing at B is a broken scan, not a pass.
6. No hunk at or after the `Result log` heading (rule (b)). `git diff --name-only B...H` lists only `frontends/shell/MANUAL-WALKTHROUGH.md`.

### §5 Predictions
- **E1:** every hunk lies inside the declared spans or additions.
- **E2:** the absence patterns go from ≥1 at B to 0 at H.
- **E3:** numstat is within the §7 ceiling.

**Declared unchanged:**
- Parts C to E, G, I, K and M;
- the result log;
- all code, tests and e2e scripts;
- the sitting script.

**Invalidators:**
- a changed span proves to be the human's typed words (`git log -L`) and is edited without the human's answer under §31;
- a clause in 2.1 fails against the code at the dispatch commit;
- a hunk outside the spans.

### §6 Instruments
`git`, `rg`/`grep` with exit codes checked, and the Read tool. Nothing is built or run.

### §7 Counting
`git diff --numstat B...H`, added plus deleted lines.
- **Ceiling:** 90 lines in 1 file. My estimate is about 55 (or about 57 with F2).
- **Overrun:** recorded as class 8. This §7 line is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`).

### §8 Block on sight
1. Any hunk in the result log or a run record (Part H's rows, Part J's run record).
2. Any edit outside `frontends/shell/MANUAL-WALKTHROUGH.md` on the branch.
3. A new span stating a timing or a figure.
4. A clause with no code cite behind it.
5. A quote marked verbatim that does not byte-match its source.
6. A line cite into `governance/DECISIONS-PENDING.md`.
7. A bare self-line in this form.
8. An edit to a span shown by `git log -L` to be the human's without the human's §31 answer.
9. An edit to Part F while b1-shell-half's PR B is in progress, unless OPEN-1 records (a).
10. An e2e script edited to match a row.
11. Any wording that calls the reload reset an observed fact.

### §9 Gates
1. Architect gate.
2. Reviewer gate, at the reviewed head, with §4 run by the reviewer.

The PR body lists the applied words and records whose words each span was (§31).

### §10 Amendments
Classes as in `docs/PREREGISTRATION-TEMPLATE.md` §10 and its Round 25 additions (`docs/PREREGISTRATION-TEMPLATE.md:165-177 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:afec4a387f393b113b888688d293687b249e4a33f6629f93125dc8f669fad64d`):
- class 8 for a §7 overrun;
- class 9 for a scope addition on a standing rule, declared before any code of it.

F2 joining later (OPEN-1 (b)) is class 9 in whichever piece carries it.

### §11 Open items
OPEN-1 to OPEN-7 below. Each records the recommendation as taken under the direction of 2026-10-31, item 4, with its date, if the human has not answered by dispatch.

---

## Row table (the form's §2.1)

Every cite is at 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a. `WT` = `frontends/shell/MANUAL-WALKTHROUGH.md` and `S` = `frontends/shell/src`. Old spans are byte-copied. New spans are mine.

### B1, part 1: Part B, B3 (`frontends/shell/MANUAL-WALKTHROUGH.md:177 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:14f37deb5b2e14d3f72212619fae688e095d044a6a9eb52b4a6c2c178d76052b`), Expected column

**Old:**
> Below the message, a note reads that remediation (asserting a CRS) is cut-2 work, not available in this build. There is no dismiss control on this panel — it is replaced, not closed, the next time you pick a file.

**New (mine):**
> No remediation note appears below the message; the CRS assertion form appears below the refusal panel instead (Part I's I1 describes it). The refusal block itself has no button and no dismiss control — it is replaced, not closed, the next time you pick a file.

**Clause check:**
- "no remediation note": `frontends/shell/src/admission/RefusalBlock.tsx:6-23 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:271a0f64fd8495b026231506b0ce5c2fd613d70761e285e26d3fe91a52af6eaf` says the blanket cut-2 note is gone. `frontends/shell/src/admission/formatRefusal.ts:70 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:933b030b747b06a93442cdc94ceb9f3e74ea1e6c723270be1e3dd19477c496b9` (`refusalGuidance`) has no `engine.crs_undeclared` case.
- "form below": `frontends/shell/src/admission/AdmissionPanel.tsx:29 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e42290b6759cf72528bf7c218661fc6e46f93d410885ce639258d2316a3e08e2` maps the code to the "crs" form. `frontends/shell/src/admission/AdmissionPanel.tsx:396-413 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:231defc43fac98731db67e3941307d8bb281d3871138239a98b16b75906b66be` renders RefusalBlock at 398, then CrsAssertionForm at 409-412.
- "no button": `frontends/shell/src/admission/RefusalBlock.tsx:24-43 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:89f537fa5e013cee2d40fb128fe3431c68ea369dd16306f6f9836bb88e3d943c`.
- "replaced": `frontends/shell/src/admission/AdmissionPanel.tsx:214-218 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7f5c35f4892c8d4fa84064ecf8f771e6df6a2ca6eab71bc9c02de1b274291988` and `:243-258 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- Asserted by `frontends/shell/e2e/regression.mjs:2373 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:5b32b2815ee72f17663c8464bb9ea5357aa3e86b273c5d46d186ca297c7723b2` and `:2376-2383 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B1, part 2: regression coverage row `B2'`/`B3'` (`frontends/shell/MANUAL-WALKTHROUGH.md:92 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:472523517956d5155a28a9a7217ccf13e988c91c8425a09401779c362c03eac5`), Covers column

**Old:**
> the panel shows that code, the verbatim message, the cut-2 remediation note, no dismiss control, and

**New (mine):**
> the panel shows that code and the verbatim message, no button inside the refusal block, `.crs-assertion-form` is present, and

This mirrors the `ABSENTCRS'` row's own words at `frontends/shell/MANUAL-WALKTHROUGH.md:93 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:01065327e41ab63ce70da1350968b0abb5a5a92a3e93a394fcc4ba643ff519dc`.

**Clause check:** `frontends/shell/e2e/regression.mjs:2369-2373 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:2c6d23e11e9d7d886697b5e08c33e11f3b6dbd366076458452e9bea491a1ced2` (hasButton), `:2376-2383 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the form selector) and `:2710-2711 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the step).

### B2: Part J, J3 (`frontends/shell/MANUAL-WALKTHROUGH.md:660 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:365e62283148108130f5dfccf390e4d551289c0b654b921e29658a874df65c45`), Expected column whole

**Old:**
> A new class-C entry appears in the console. Its statement text contains, verbatim, **"no API equivalent exists"**, naming the specific control you moved (e.g. fill opacity) as local `StylePanel` state, never sent to the kernel. Its owner line names **ADR-022** (and ADR-023). No copy button appears anywhere on this entry — there is no field on it a copy button could even read (`ClassCRowViewModel` carries no `request`/`copyText`). **Judge:** having just watched a real style edit repaint the canvas with nothing sent anywhere, does this entry read as *honest bookkeeping* — "here is a real gap, and here is who owns closing it" — rather than as a broken or missing feature?

**New (mine):**
> When you release the control, a new class-A `record_step` entry appears in the console — one per style value that changed since your last committed edit (one, for one control moved); dragging adds no entry per tick. It is labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button, as J1's entries are. No class-C entry appears for the edit, and no entry names **ADR-022**. **Judge:** having just watched a style edit repaint the canvas and record one step, does this entry read as *honest bookkeeping* — "here is exactly what that edit recorded" — rather than as noise?

**Clause check:**
- "on release, once per committed edit": `frontends/shell/src/style/StylePanel.tsx:89-108 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6c3a16030a003711aa5f858ac4c8aadb426a01e0bc6cb86a009321faaf427c33` and `frontends/shell/src/App.tsx:1983-1986 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:888d8e5e92e4571c16ea9f9ea1f0075c4d6c8046fd1c9665d1cdaea6d0613538`.
- "one per changed value": `frontends/shell/src/App.tsx:1990-1994 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:97cb3cb7350b46c7445a5912233afd9fa12366500910470d577bf2869792053d`.
- "`record_step`": `frontends/shell/src/App.tsx:857 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b6e95f02346d2814c8d159d8ad739207c63292fec23df4762b9ec88f97217f3a` and `frontends/shell/src/skp/client.ts:141-143 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:39fca71a993eb659e95e5bf7a4ed8c8c8dc5b91c6808b30c1d88990fbc32b42a`.
- "class A, label, Copy": `frontends/shell/src/skp/client.ts:55 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:fdef6e0e537b960e33c16b666d44dabcd40650e4c77c7f29272940c4a2543ed5`, `frontends/shell/src/console/ConsolePanel.tsx:143-174 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a86f35515c1a069cd8387cd262036c71fd37312ae377a6e45e0fca110a81937d` (the label at 166).
- "no class-C": `frontends/shell/src/console/surfaceRegistry.ts:174-176 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:1e4a960576659fb652efe4e6b1bd713c9614be00f3503bff4c5d471ad55f951f`.
- Asserted by `CLASSC'` (`frontends/shell/MANUAL-WALKTHROUGH.md:684 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:08c667615d043fe07f699e33d98adcf0501ea50ddbfb4abefbc5452d69e6906c`).
- Dataset open at J3 (it follows J1): `frontends/shell/src/App.tsx:1993 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:dbc8df67266f675ec793893187177619164f8949a21770420a096c5d0f811f83`.

### B3: Part J, J2 (`frontends/shell/MANUAL-WALKTHROUGH.md:659 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:37ede7ca095f96f1c563bd6ed8da32ddc316032511d7b99a6d9f540dd48bb3ed`)

**Old:**
> exactly the keys `{skp, dataset, bbox, bbox_crs, filter, limit}`

**New (mine):**
> exactly the keys `{skp, dataset, bbox, bbox_crs, columns, filter, limit}`

**Clause check:**
- `frontends/shell/src/skp/client.ts:115-125 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:5d37a92b1f468c4fec8c7117a4d03d22069bca4a1829196aff87d7650703a32c` (`columns` at 124);
- `frontends/shell/src/skp/types.ts:261-264 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:d41c739c6caf3a4ed29297d8439a63ec0028d2f79539a042a8c76c1e92339758` (always present);
- `HEXLIM'` (`frontends/shell/MANUAL-WALKTHROUGH.md:683 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:35a6707dba2272aa5f8c34c2ec0f3b8b3c66522d674ee60ecf2742f29ca28304`);
- `frontends/shell/e2e/console.mjs:454 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:dc1491aa1a0f45822f79ac3cf634ef1d748d4f138c0567fdd919f3c2f1d300c4`.

### B4: Part H, a new dated pointer after `frontends/shell/MANUAL-WALKTHROUGH.md:463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:31bf0655794be3014a85e95916512e311262fe1906cd16cb74a5bc88ca756259`
H1, H2 and H5 (`frontends/shell/MANUAL-WALKTHROUGH.md:448-449 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:dfa08a44c310bb1c42f003eb2726489427073ac3778af3354a4b7c425d48a7ca`, `frontends/shell/MANUAL-WALKTHROUGH.md:452 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:55f128e7f39328ae745697cf63e978f4ccf9f2541496212b6966eaf01580a2f1`) are not edited.

**Old spans named, not replaced:**
- H1:
  > Expect the Part D/OVERCEIL' ceiling shape — a red-bordered banner plus the persistent `.residency-status` line reading `<N> of 3300000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`
- H2:
  > expect the ceiling banner/status to reappear on most stops, by H1's own arithmetic.
- H5:
  > no admission, no query, nothing round-trips through the kernel

**New (mine):**
> **Dated pointer, <merge date, `date -u +%F`> — H1, H2 and H5.** The rows above are the record of runs on 2026-08-20/22 and stay exactly as run. Since then the shipped default arm is the candidate, which never refuses a batch: a rerun of H1 or H2 shows no red-bordered ceiling banner and no `declared ceiling reached` line; over the render budget, the status line states a declared partial view instead (Part K's K2 quotes its wording). And each committed style edit now records one `record_step` request per changed style value in the session history (Part J's J3): H5's "no query" still holds, but its "nothing round-trips through the kernel" no longer does.

**Clause check:**
- "default candidate": `frontends/shell/src/residency/residencyArm.ts:50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7f6a03cf4a311a343a544451e647abc60699d4db675128f8f872afbff2ec2bac`.
- "never refuses a batch": `frontends/shell/src/canvas/WorkingCanvas.tsx:1742 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:bdc0e81d2a66f6f65a1e815633bf4c62e6a789d0294981c0633f7db35ffd6df0`.
- "no ceiling line": the only `declared ceiling reached` text is the `baseline-ceiling` case, `frontends/shell/src/residency/residencyStatus.ts:452-453 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:2bd233f30fe97cc959de9e196cd1344103b5728b695969cfa1a4dd9e85126190`.
- "declared partial view": `frontends/shell/src/residency/residencyStatus.ts:464-468 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a387d8cf56e43215d58995a8e6ba33197e012863e7844094761ceeed2382a3e6`.
- "record_step per value": `frontends/shell/src/App.tsx:1983-1995 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:79ae72b33571f72bbf802b5a78eb37fe5ecf7a88caa04f9ef0ae9179e06cfb86`.
- "no query": `frontends/shell/src/App.tsx:1976-1981 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7b5741eb5059391178695853a4fd1657765f581f2b4b289c99a79ed09c3aa629` (dispatch only).
- The form follows `frontends/shell/MANUAL-WALKTHROUGH.md:458-463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:498a46a2e9c44fcbca3e1aa9a9c461b772520624c71065b353342fbb4f87a2c9`.

### B5 (S3, riding): two dated notes; the table rows are not rewritten (OPEN-3)

**Note 1, after `frontends/shell/MANUAL-WALKTHROUGH.md:97 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:480a9f674f5f06db5dabbb7af4cfa76a32c0f23ded3924c21228fddff3c054a3` (mine):**
> **Dated note, <merge date> — this table and the script.** The rows above are kept as written. `e2e/regression.mjs` now also runs `K6`, `K7`, `CURSOR'`, `FIND'`, `MP'`, `PT'` and `LN'`, which have no row here; and `OVERCEIL'` and `REOPEN'` no longer run in it — they run in `e2e/refusal-contract-baseline.mjs` (`npm run e2e:refusal-contract-baseline`), which pins the baseline arm before them.

**Note 2, after `frontends/shell/MANUAL-WALKTHROUGH.md:126 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:9afa284ade3e9c94bbd93a359f8ea8c49c4fadb79235cf031b20eb334cee75da` (mine):**
> **Dated note, <merge date>.** The status paragraph above is the record of the 2026-08-15 run, and the rows are kept as written. `e2e/filter-panel.mjs` now runs `OPEN`, `PANEL'`, `PANELREFUSE'`, `CLEAR'` and `FIND'`; `SLOW'`/`CANCEL'` runs in `e2e/refusal-contract-baseline.mjs` (`npm run e2e:refusal-contract-baseline`), on the baseline arm it pins first.

**Clause check:**
- `frontends/shell/e2e/regression.mjs:2681-2709 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6552329b5e961dfa0b3e36b61a5c1b667fd81c5aec4d9459457d40364bd67e46` (the seven steps);
- `frontends/shell/e2e/regression.mjs:2732 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:9c41ebfcf9e7ddd18eb5174502e7226d169985900fbca639f554502dda6d978b` (the move);
- `frontends/shell/e2e/refusal-contract-baseline.mjs:606-617 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b2d2808263aed547170eee60c7858c98e3e6f0798f6a6d24454036761e17e022` (the baseline pin with readback);
- `frontends/shell/e2e/refusal-contract-baseline.mjs:627-629 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:ece1a066995d63d4f2002815667c0268e90a173c933a7720b0bb7807a0efb87f` (`OVERCEIL'`, `REOPEN'`, `SLOW'`/`CANCEL'`);
- `frontends/shell/e2e/filter-panel.mjs:484-488 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b26b7501add7e806788339a50ae22147bb30cb4fa21a9718d67eee92825b4e7f`;
- `frontends/shell/package.json:27 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:de4fbf33652ff88c4a9bd84a5f10a517bbf982466ac6f3ed2a3a5ca6e29ee598`.

### B7: the Part L preamble (`frontends/shell/MANUAL-WALKTHROUGH.md:801-807 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:f69d748339278bfbf1c674936740a5b262a9d12ea96a790981560eee5a7e1b48`), with the human's step folded in

**Old:**
> **MANDATORY after EVERY Ctrl+R (added 2026-09-06,
> after the first half-sitting's verdicts turned out arm-unverifiable): the arm silently resets to
> `"baseline"` on every reload, and baseline on this fixture shows Part D's ceiling refusal
> ("accepting this batch would carry N resident vertices…", "N of M features rendered — declared
> ceiling reached") where the candidate shows a declared partial view — so before each open, run
> `await window.__SPATIAL_E2E__.getResidencyArm()` and require it to print `"candidate"`. A step
> whose arm was not verified this way is recorded as arm-unverified, not as a verdict.**

**New (mine):**
> **MANDATORY after EVERY Ctrl+R (added 2026-09-06, after the first half-sitting's verdicts turned out arm-unverifiable; [CORRECTED <merge date>: a reload does not set the arm to `"baseline"`]): after a reload the arm is the shipped default, `"candidate"`, and the tile-size level is unset (`null`), which a candidate session runs at `"medium"`, not this Part's `fine`. So after each Ctrl+R, re-arm per K2 (both calls resolve `{ok:true}`); then, before each open, run `await window.__SPATIAL_E2E__.getResidencyArm()` and require it to print `"candidate"`, and run `await window.__SPATIAL_E2E__.getResidencyTileSizeLevel()` and require it to print `"fine"`. A step whose arm and level were not both verified this way is recorded as unverified, not as a verdict.**

**L5's Step (`frontends/shell/MANUAL-WALKTHROUGH.md:819 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7a491003ff0d054a8a039eb0fc37be3321878d990fafb086e91902ec917595a1`):**
- Old: `(Ctrl+R, **verify the arm**, reopen, Zoom to layer)`
- New (mine): `(Ctrl+R, **re-arm per K2, then verify the arm and the level**, reopen, Zoom to layer)`

**L1's Step (`frontends/shell/MANUAL-WALKTHROUGH.md:815 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:34bc3b8501b6269e7d8179c796deeec4093db4c34191a7600e1233b17d5a53e9`), see OPEN-4:**
- Old: `(verify the arm!)`
- New (mine): `(verify the arm and the level!)`

**Clause check:**
- "default candidate": `frontends/shell/src/residency/residencyArm.ts:50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7f6a03cf4a311a343a544451e647abc60699d4db675128f8f872afbff2ec2bac` and `:58 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the module-init value).
- "level unset": `frontends/shell/src/residency/residencyTileSizeLevel.ts:37 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e3a9ea81f4e35c6dd8f30f895806d0057a815e715e9e3a47ca71fa31b02be118` and `:48-50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "runs at medium": `frontends/shell/src/residency/residencyTileSizeLevel.ts:21-28 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b0342f34507a474d08bb732ff9575e3e17500413a337d45831ccd7a50f29877f`, `frontends/shell/src/residency/candidateArmSession.ts:924 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:790ba7ffbe1c0cd67e66f5078b1c715ddbe6ba3f702b1fff7723904bf1230d6c`, `frontends/shell/src/streaming/tileViewportStreamManager.ts:404 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:eabd563dd8ba160abb31a1beb01f064fbe27581748f13c64f8745b8f473cc099` and `frontends/shell/src/canvas/tileGridConstants.ts:35 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b8b771eb87c950fff9b9b6c91a601f55af06a9b91005c35476d5dd285f647c81`.
- "re-arm accepted before an open": `frontends/shell/src/residency/residencyTileSizeLevel.ts:43 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:634e957adc4d2361c4f981354e2a32194329cf3b81ce57e74c027af935b174a8` and `:62-72 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "hooks exist": `frontends/shell/src/App.tsx:1328-1335 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:16abbf108b8285a6365a4df93161a63004e9912dda2cb0af63261a70960cc6b7`.
- "the getter reads the selection for the next session, so it is read before the open": `frontends/shell/src/e2e-test-surface.ts:326-331 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:99460dacbf009246b780745d8b785d2b074d20d1491a32e15ae64a2ee892b11f` and `frontends/shell/src/residency/residencyTileSizeLevel.ts:45-47 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:66a6541c83910cfba385fd42a58f00738927e4103a334735def61dcd25a40361`.
- "K2's calls": `frontends/shell/MANUAL-WALKTHROUGH.md:740 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:02002bbb1f2173222a093c5dc23c7ad70f5f54cb371aa7ae5990ebad9c78d98c`.

**Limits of the check:**
- That a Ctrl+R re-runs the page's modules is page-reload behaviour, not a line of code. It is inferred, not executed (§1).
- The hooks exist only in an instrumented build (`frontends/shell/src/e2e-test-surface.ts:343-351 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:fb08c9186b54bf8d8102e929c67481e1cd05a0b65ad24f952ca705284d4727c4`). This is a dev-only switch under §31(c), already Part K's premise, and it does not block.

### B8: Part J, J1 (`frontends/shell/MANUAL-WALKTHROUGH.md:658 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c5f022efe6775af23da68738d56ce47996c063e8af410dae22b5257db5a1cdd8`)

**Old:**
> produces exactly **two** new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry, never more than two (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point).

**New (mine):**
> produces two new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point). Once the dataset is admitted, the map's first data load adds at least one `viewport_query` class-A entry after these two (and, the first time this app process loads map data, one `binding_data_plane_attach` class-B entry).

**Clause check:**
- "two, in order": `frontends/shell/src/admission/admitDataset.ts:46-56 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a72098ddd2dc56291d3c854fd58fbd36b5cdea1a5f790aef97f503a302a19086`.
- "captured at call": `frontends/shell/src/skp/client.ts:46-68 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:78d84ae58de45811296f59f06426ee29f1c2d86f72f30d4c43dc830b2d6cf4c7` (record at 55).
- "first load adds viewport_query": `frontends/shell/src/App.tsx:1697-1700 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:bb8ffe9c8215c21873177f3f34b9d55bf8d068ed7ac3b2eb7b6dc1ba2d113654`, `frontends/shell/src/residency/candidateArmSession.ts:1267-1279 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:56151a12d6d9502504618420b33351aa264ee30caeb8800c31bf6a0933d0028e` and `frontends/shell/src/skp/client.ts:107-126 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b05476b4af0739f7c5baa709b963b34f3676a2105e7cb0dfb761d1ba8891736b`.
- "attach once per process": `frontends/shell/src/streaming/dataPlaneClient.ts:20-41 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:0302d1d11b536b8634da87bc990b099ac4655d6610548f0dcddeac9e6d103cfe`.
- It agrees with the run record: `frontends/shell/MANUAL-WALKTHROUGH.md:1181-1183 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:39b82cfb7dc05984b7d27c92247294299cfa08dd01a64978d1bcf0c4119253e1`, not edited.

### B9: Part N, N9 (`frontends/shell/MANUAL-WALKTHROUGH.md:954 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e14c08a42fb70fce18c00ff23182cb1281bc3d16e73a8fa6c593734f106212e0`), three spans

**Step span. Old:**
> ; 16 numbered items plus one unnumbered paragraph between items 15 and 16, v0.1.0) and confirm none of the five limitations below appear among them yet.

**New (mine):**
> ) and find each of the five limitations below among its items.

**Expected span 1. Old:**
> None do, confirmed by a full read at this commit. Five rows are owed to whoever next revises that file for a release carrying Brief A — named here, not drafted:

**New (mine):**
> Each has its own numbered item under the file's heading "On main since v0.1.0 — not in any release yet" — items 19 to 23, in the order below:

**Expected span 2. Old:**
> their eventual KNOWN-LIMITATIONS phrasing would read as honest to you.

**New (mine):**
> their KNOWN-LIMITATIONS phrasing reads as honest to you.

**Clause check:**
- `KNOWN-LIMITATIONS.md:202 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:d400ae0754c48de7c2b6689ef457f0391880f839087297ed6cef43d4835dee78` (the heading);
- `:232 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 19, the change detector, = (1));
- `:248 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 20, partitioned, = (2));
- `:259 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 21, degrees publish, = (3));
- `:269 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 22, sanity check, = (4));
- `:280 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 23, small pan, = (5)).

The worker byte-checks the heading text in the new span against `:202` at B.

### B10 (S3, riding): Part A, A3 (`frontends/shell/MANUAL-WALKTHROUGH.md:158 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:1dc867563da2b9a775086733515f147ace56e08fef29183c649fccc4c6787d8d`)

**Old span:**
> **Geometry** `geometry (geoarrow.polygon)`;

**New (mine):**
> **[P6 placeholder] Geometry (encoding chosen by the engine)** `geometry (geoarrow.polygon)`; **[P6 placeholder] Geometry types declared by the file** (the file's own declaration);

**And after** `**License** "not declared"` **insert (mine):**
> ; **CRS provenance**

**Clause check:** `frontends/shell/src/admission/DescribeSummary.tsx:29-63 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:668fb516c3d35a6562ab1e1cc2f6583252e596302cf84acb37bc96dbdc2cf5d8`:
- the labels at 36, 41 and 62;
- the order: CRS, Geometry encoding, Geometry types, Identity, Row count, Extent, Schema, License, CRS provenance;
- `frontends/shell/src/admission/describeSummaryText.ts:47-49 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:f61c2eca3841e0bc9028974c0132ae1de52ae9a12a5673b713395805ce3c7234` and `:105-114 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

Part M's M4 ("exactly as Part A's A3 describes") is fixed through A3. Part M is not edited.

### F2: see OPEN-1. The span if it rides: `frontends/shell/MANUAL-WALKTHROUGH.md:269 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:843c1d3ecc8eea455d0759ef716f0ac726b8093e8c9dbe00dccaf7dd7923e140`

**Old:**
> no admission dialog, no query, nothing round-trips through the kernel (a style edit is a re-render of already-resident data only).

**New (mine):**
> no admission dialog, no query (a style edit is a re-render of already-resident data only); once the edit is committed, it is recorded in the session history by one `record_step` request per changed style value (Part J's J3).

The clause check is the same as B2's and B4's.

---

## OPEN items (none is a red line: walkthrough rows are neither ADR text, gate rulings, licensing nor security posture)

**OPEN-1. Does F2 ride here or wait?**
- (a) Ride now. Git shows the paths disjoint: PR B is not open and `cut/b1-shell-half-pr-c` has 0 files. The milestone-4 form scopes PR B's Part F edits to location words (`...MILESTONE-4-PREREGISTRATION.md:399 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `:474 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), and F2's clause is not one.
- (b) Wait. b1-shell-half is `in-progress` (`governance/PLAN.yaml:2370-2386 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c3faed0707c9cf4ef60f11be352144dde19748d18cbcabb7a34f16eb406294b5`) and declares Part F. Rule (00) (`governance/AUTONOMY.md:609 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0`) counts every in-progress piece's paths, Parts separately, not only open PRs. F2 then joins PR B, or the first docs piece after it, as class 9, with the words above.
- **Recommend (b).** Rule (00) is a standing rule and its strict reading names the Part, not the row. The node's own summary already places F2 after PR B.
- Mitigation if the sitting reaches Part F first: the custodian puts a one-line pointer to Part J's J3 beside F2 in the ungated sitting script (OPEN-5).
- Until PR B, the Part H pointer will contradict F2's text. I name that, and accept it.

**OPEN-2. Part H: a pointer, or in-place edits of H1, H2 and H5?**
- (a) Edit the spans in place.
- (b) Add a dated pointer after the 2026-09-08 pointer.
- **Recommend (b).** The rows are a run record "kept exactly as run" by the file's own precedent (`frontends/shell/MANUAL-WALKTHROUGH.md:458-463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:498a46a2e9c44fcbca3e1aa9a9c461b772520624c71065b353342fbb4f87a2c9`), and the brief rules that no recorded result is edited.

**OPEN-3. B5: dated notes, or rewritten coverage tables?**
- (a) Add rows for K6 to LN', and move the rows for OVERCEIL', REOPEN' and SLOW'/CANCEL' under a new refusal-contract-baseline table.
- (b) Two dated notes.
- **Recommend (b).** It is S3, it costs fewer lines, and it leaves no coverage claim unverified. A new table's Covers and Does-not-cover cells would each need their own clause checks against the scripts, which is a larger piece.

**OPEN-4. L1: add the level check?**
- (a) Yes, one clause.
- (b) Only L5, as ruled.
- **Recommend (a).** The new preamble requires the level before each open, and L1's parenthetical would otherwise under-state it.

**OPEN-5. The sitting script (`state/drafts/sitting-script-2026-10-23.md`).**
It byte-copies Part L at its lines 673-718 from a commit before #274, with the baseline sentence at 708-714. It is already stale on another cite.
- (a) This piece edits it.
- (b) The custodian re-copies Part L whole from main after the merge.
- **Recommend (b).** It is not gated. Editing it here adds an unscoped path, and a re-copy from the merged file is byte-true by construction. The custodian also updates `operator-sitting-queue`'s summary text (`governance/PLAN.yaml:5878-5894 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:361b87d2c36c8ac3d0464ffe52cc02b9ffe97d866aed831c482252c72df3e54c`).

**OPEN-6. Whose words (§31).**
I cannot run `git log -L`.
- (a) The worker runs it per old span at B and records the result in the PR body. Spans that are not the human's take my words with no re-gate. Any span that is the human's is held for the human's §31 answer (yes / their own words / accepted as it stands); the rest proceed.
- (b) Hold every span for the human (back 2026-11-09).
- **Recommend (a).** The node says the human sees the row words at the click in any case.

**OPEN-7. J3's Judge sentence.**
- (a) Remove only the false premise ("with nothing sent anywhere").
- (b) Re-aim the question, as drafted.
- **Recommend (b), as drafted.** With the premise gone, "a real gap, and … who owns closing it" has no referent.
- If OPEN-6 finds the sentence to be the human's, it falls under OPEN-6.

---

## Could not settle
1. Whether any old span is the human's typed words (no shell; OPEN-6).
2. The reload re-initialisation of the arm and level is read from module-init code, not executed. The new preamble makes the operator's getter read the check.
3. Which candidate status string H1 or H2 shows at 5 GB at settle (the base sentence plus which suffix). The pointer claims only "a declared partial view".
4. The values that the two new A3 rows (geometry types and CRS provenance) show for `100k-happy-path.parquet`. I did not read the fixture's metadata, so the new A3 words name those rows without values.
5. N9's retained clauses outside the replaced spans were not re-checked. For example, (2)'s "no partitioned fixture exists yet, boundary 7".
6. Side findings, outside scope:
   - `frontends/shell/e2e/console.mjs:452 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e6b105cb4b3951a0b9f99a322acecfc5ea8d784d5de7e1e22dadb4a254036bc9`'s comment, as I read it, says the client sends `null` for a key the client always sends (`types.ts:261-264`).
   - `frontends/shell/src/e2e-test-surface.ts:304-314 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:67179e41a9eebc93013340a41814c2f7297efa9c0f716dc2d9f38af680d03368` still calls `"baseline"` the default. That is triage A2, the shell-comments node; an operator reading the hook's doc would meet the claim B7 retires.
7. `adr-023-stale-cites-before-acceptance` depends on this node (`governance/PLAN.yaml:6838-6845 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b0262551110a7b81b88ba7a3413ea12f437d1a47679a4cd5d49661704ef58ec7`). Nothing in this piece changes that dependency.

## The custodian's settlement (class 1, before any change)

- **OPEN-1: (b)**, F2 waits for b1-shell-half's PR B; **OPEN-2: (b)**, the dated pointer; **OPEN-3: (b)**, the two dated notes; **OPEN-4: (a)**, L1's level clause; **OPEN-5: (b)**, the custodian re-copies Part L into the sitting script from main after the merge and updates `operator-sitting-queue`'s summary; **OPEN-6: (a)**, the worker runs `git log -L` per old span at the base and holds any span that is the human's typed words for the human's answer under §31; **OPEN-7: (b)**. Each taken on 2026-11-05 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **The read commit and main:** `git diff --name-only 8b9193a1 d3391d4b -- frontends/shell/MANUAL-WALKTHROUGH.md` is empty.
- **Rule (00)** was checked at main d3391d4b by `git diff --name-only origin/main...<branch>` over the branches in flight (`cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`, `cut/b1-shell-half-pr-c`): none touches `frontends/shell/MANUAL-WALKTHROUGH.md`. publish-filter-sentence-under-whole-dataset, in slot 2, edits Part G and the e2e/publish.mjs coverage table, which this piece does not touch; no PR is open. It is checked again at dispatch.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-06 — the closing record (class 1), written after gate 1's reports, the words commit and its CI were seen; references and hashes only

- **The final head:** 5920dee5c5ceb2f1fa45494113b27c3034c61599, one commit on 6c6d4564b9bcb33382dbf4ccb3c516d554277f79; the one Scope file and 32 lines (`git diff --numstat 2c72923e...5920dee5`: `frontends/shell/MANUAL-WALKTHROUGH.md` 16/16), within section 7's 90.
- **Gate 1 at 6c6d4564:**
  - `state/consults/gates/2026-11-06-walkthrough-rows-stale-against-main-sweep-area-b-gate1-architect.md` (sha256 54cf01b4ce93aa42c5ee2ddc44c16224046374d4c8db8cdccf468a0d90e92e0e), gate-log 680, PASS WITH NOTES, WORDS-ONLY.
  - `state/consults/gates/2026-11-06-walkthrough-rows-stale-against-main-sweep-area-b-gate1-reviewer.md` (sha256 0d25f4bd18f8c54d5cce0665f9d673343ae52ffe1c3a03f04a3c6fc690609d42), gate-log 681, PASS WITH NOTES, WORDS-ONLY.
- **The words:** the architect's C-1 (J1's span, whole) and D-1 (the Part H pointer), taken for the reasons gate-log 681's note gives; the reviewer's C-1 words not taken. Applied at 5920dee5 by a worker, `state/consults/2026-11-06-walkthrough-rows-stale-against-main-sweep-area-b-gate1-words-worker-report.md` (from its hand-back, sha256 b2a0dc14ccacb0b5cc1f9dd6ac340324092cde0f46165be9c83258123916b248); the file's sha256 at the head, 83e419bc4557b87c0e8149679640608befd66050d373fa54dea8c63685a21bbb, equal to the brief's, checked by git. Section 2.1's B8 words and the B4 pointer's clause are superseded at those two spans by gate 1's words.
- **D-2:** the four dates reading 2026-11-05 carry the date of the edit at 6c6d4564, not the merge date, by gate 1's architect report, D-2's second closure; the PR body records it.
- **Notes:** each gate's N-1 to N-3, recorded in its report, not applied.
- **CI at 5920dee5:** Product CI — shell 42144625462 and 42144632512, Ported notices 42144625434 and 42144632516, Exposure scan 42144632532 and DCO sign-off 42144632720, each success.
- **Merge:** the human's click, by merge commit.
