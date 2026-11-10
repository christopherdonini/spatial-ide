*Custodian's filing note (2026-11-05): the architect's form draft for `walkthrough-rows-stale-against-main-sweep-area-b`, first in the docs lane, on the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). Its brief by file (sha256 8255febbb1e7cf95fa6dc17a6253337859654fd6b3c1526ab6a9dd4559bfe22d), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte; read at main 8b9193a1. The run 23:13:52Z to 23:26:21Z by its transcript (claude-opus-5-5; unique calls Read 60, Grep 39 and the hand-back, 100, equal to the notification's). Extracted by script from the hand-back in that transcript (33533 bytes, sha256 08cea0f99b73eaff4457fb7ee37eb641cac8d43853865f9738dfed9bde81f761); nothing is changed. The form is committed from it at `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`. A draft, not Authority.*

---

Draft: walkthrough-rows-stale-against-main-sweep-area-b form, architect

I read everything at main @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a (the main checkout; I cannot read branches). I have no shell, so no sha256 is computed anywhere in this report; each cite is a `path:line @ commit` reference that the reviewer can hash. I leave no background shell. I wrote no file. Everything below that is not inside a byte-copied quote is my own wording. All replacement row words are new and mine: the triage I drafted on 2026-11-05 says, in my paraphrase, that it writes no replacement words, so the brief's "your drafted row words" does not exist to carry forward.

---

## The form (full form): `governance/forms/frontends/WALKTHROUGH-ROWS-STALE-AGAINST-MAIN-SWEEP-AREA-B-PREREGISTRATION.md`

**Authority**
- The human's ruling of 2026-11-05 (evening), item 2: `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:11 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`. It places this piece first in the docs lane, before the sitting, with B7's L5 step folded in.
- The human's gate-round rulings: `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`, Part 1, items 1 to 9, by reference. Item 1 governs every row: the words are written from the code and checked clause by clause.
- The node: `governance/PLAN.yaml:6685-6701 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- The triage: `state/consults/2026-11-05-drift-sweep-areas-a-b-triage-architect.md:109-221 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (Area B) and `:240-258 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the proposal).
- The sweep: `state/consults/2026-11-03-platform-drift-sweep-area-b.md:31-53 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
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
- The basis is §21a's fourth category, "any property currently under test" (`governance/AUTONOMY.md:325-327 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`). The rows in Parts L, J and B, and the regression coverage row, restate properties that e2e steps and hooks assert:
  - the K2 arm and level hooks;
  - `ECHO'`/`TWOCMD'`, `HEXLIM'` and `CLASSC'`;
  - `B2'`/`B3'`.
- §25(e) (`governance/AUTONOMY.md:482 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`) therefore closes the five-line form at dispatch: its Out-of-scope line would have to name a §21a category.
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

The only claim on a Part is b1-shell-half's PR B on Part F (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:399 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `:474 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`). Hence OPEN-1. No path touches `protocol/`, wire fixtures, `Cargo.lock` or `package-lock.json`.

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
- **Overrun:** recorded as class 8. This §7 line is never edited to match (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`).

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
Classes as in `docs/PREREGISTRATION-TEMPLATE.md` §10 and its Round 25 additions (`docs/PREREGISTRATION-TEMPLATE.md:165-177 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`):
- class 8 for a §7 overrun;
- class 9 for a scope addition on a standing rule, declared before any code of it.

F2 joining later (OPEN-1 (b)) is class 9 in whichever piece carries it.

### §11 Open items
OPEN-1 to OPEN-7 below. Each records the recommendation as taken under the direction of 2026-10-31, item 4, with its date, if the human has not answered by dispatch.

---

## Row table (the form's §2.1)

Every cite is at 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a. `WT` = `frontends/shell/MANUAL-WALKTHROUGH.md` and `S` = `frontends/shell/src`. Old spans are byte-copied. New spans are mine.

### B1, part 1: Part B, B3 (`WT:177 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), Expected column

**Old:**
> Below the message, a note reads that remediation (asserting a CRS) is cut-2 work, not available in this build. There is no dismiss control on this panel — it is replaced, not closed, the next time you pick a file.

**New (mine):**
> No remediation note appears below the message; the CRS assertion form appears below the refusal panel instead (Part I's I1 describes it). The refusal block itself has no button and no dismiss control — it is replaced, not closed, the next time you pick a file.

**Clause check:**
- "no remediation note": `frontends/shell/src/admission/RefusalBlock.tsx:6-23 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` says the blanket cut-2 note is gone. `frontends/shell/src/admission/formatRefusal.ts:70 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (`refusalGuidance`) has no `engine.crs_undeclared` case.
- "form below": `frontends/shell/src/admission/AdmissionPanel.tsx:29 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` maps the code to the "crs" form. `frontends/shell/src/admission/AdmissionPanel.tsx:396-413 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` renders RefusalBlock at 398, then CrsAssertionForm at 409-412.
- "no button": `frontends/shell/src/admission/RefusalBlock.tsx:24-43 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "replaced": `frontends/shell/src/admission/AdmissionPanel.tsx:214-218 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:243-258 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- Asserted by `frontends/shell/e2e/regression.mjs:2373 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:2376-2383 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B1, part 2: regression coverage row `B2'`/`B3'` (`WT:92 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), Covers column

**Old:**
> the panel shows that code, the verbatim message, the cut-2 remediation note, no dismiss control, and

**New (mine):**
> the panel shows that code and the verbatim message, no button inside the refusal block, `.crs-assertion-form` is present, and

This mirrors the `ABSENTCRS'` row's own words at `WT:93 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

**Clause check:** `frontends/shell/e2e/regression.mjs:2369-2373 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (hasButton), `:2376-2383 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the form selector) and `:2710-2711 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the step).

### B2: Part J, J3 (`WT:660 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), Expected column whole

**Old:**
> A new class-C entry appears in the console. Its statement text contains, verbatim, **"no API equivalent exists"**, naming the specific control you moved (e.g. fill opacity) as local `StylePanel` state, never sent to the kernel. Its owner line names **ADR-022** (and ADR-023). No copy button appears anywhere on this entry — there is no field on it a copy button could even read (`ClassCRowViewModel` carries no `request`/`copyText`). **Judge:** having just watched a real style edit repaint the canvas with nothing sent anywhere, does this entry read as *honest bookkeeping* — "here is a real gap, and here is who owns closing it" — rather than as a broken or missing feature?

**New (mine):**
> When you release the control, a new class-A `record_step` entry appears in the console — one per style value that changed since your last committed edit (one, for one control moved); dragging adds no entry per tick. It is labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button, as J1's entries are. No class-C entry appears for the edit, and no entry names **ADR-022**. **Judge:** having just watched a style edit repaint the canvas and record one step, does this entry read as *honest bookkeeping* — "here is exactly what that edit recorded" — rather than as noise?

**Clause check:**
- "on release, once per committed edit": `frontends/shell/src/style/StylePanel.tsx:89-108 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `frontends/shell/src/App.tsx:1983-1986 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "one per changed value": `frontends/shell/src/App.tsx:1990-1994 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "`record_step`": `frontends/shell/src/App.tsx:857 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `frontends/shell/src/skp/client.ts:141-143 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "class A, label, Copy": `frontends/shell/src/skp/client.ts:55 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `frontends/shell/src/console/ConsolePanel.tsx:143-174 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the label at 166).
- "no class-C": `frontends/shell/src/console/surfaceRegistry.ts:174-176 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- Asserted by `CLASSC'` (`WT:684 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`).
- Dataset open at J3 (it follows J1): `frontends/shell/src/App.tsx:1993 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B3: Part J, J2 (`WT:659 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`)

**Old:**
> exactly the keys `{skp, dataset, bbox, bbox_crs, filter, limit}`

**New (mine):**
> exactly the keys `{skp, dataset, bbox, bbox_crs, columns, filter, limit}`

**Clause check:**
- `frontends/shell/src/skp/client.ts:115-125 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (`columns` at 124);
- `frontends/shell/src/skp/types.ts:261-264 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (always present);
- `HEXLIM'` (`WT:683 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`);
- `frontends/shell/e2e/console.mjs:454 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B4: Part H, a new dated pointer after `WT:463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`
H1, H2 and H5 (`WT:448-449 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `WT:452 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`) are not edited.

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
- "default candidate": `frontends/shell/src/residency/residencyArm.ts:50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "never refuses a batch": `frontends/shell/src/canvas/WorkingCanvas.tsx:1742 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "no ceiling line": the only `declared ceiling reached` text is the `baseline-ceiling` case, `frontends/shell/src/residency/residencyStatus.ts:452-453 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "declared partial view": `frontends/shell/src/residency/residencyStatus.ts:464-468 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "record_step per value": `frontends/shell/src/App.tsx:1983-1995 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "no query": `frontends/shell/src/App.tsx:1976-1981 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (dispatch only).
- The form follows `WT:458-463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B5 (S3, riding): two dated notes; the table rows are not rewritten (OPEN-3)

**Note 1, after `WT:97 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (mine):**
> **Dated note, <merge date> — this table and the script.** The rows above are kept as written. `e2e/regression.mjs` now also runs `K6`, `K7`, `CURSOR'`, `FIND'`, `MP'`, `PT'` and `LN'`, which have no row here; and `OVERCEIL'` and `REOPEN'` no longer run in it — they run in `e2e/refusal-contract-baseline.mjs` (`npm run e2e:refusal-contract-baseline`), which pins the baseline arm before them.

**Note 2, after `WT:126 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (mine):**
> **Dated note, <merge date>.** The status paragraph above is the record of the 2026-08-15 run, and the rows are kept as written. `e2e/filter-panel.mjs` now runs `OPEN`, `PANEL'`, `PANELREFUSE'`, `CLEAR'` and `FIND'`; `SLOW'`/`CANCEL'` runs in `e2e/refusal-contract-baseline.mjs` (`npm run e2e:refusal-contract-baseline`), on the baseline arm it pins first.

**Clause check:**
- `frontends/shell/e2e/regression.mjs:2681-2709 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the seven steps);
- `frontends/shell/e2e/regression.mjs:2732 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the move);
- `frontends/shell/e2e/refusal-contract-baseline.mjs:606-617 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the baseline pin with readback);
- `frontends/shell/e2e/refusal-contract-baseline.mjs:627-629 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (`OVERCEIL'`, `REOPEN'`, `SLOW'`/`CANCEL'`);
- `frontends/shell/e2e/filter-panel.mjs:484-488 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`;
- `frontends/shell/package.json:27 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

### B7: the Part L preamble (`WT:801-807 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), with the human's step folded in

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

**L5's Step (`WT:819 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`):**
- Old: `(Ctrl+R, **verify the arm**, reopen, Zoom to layer)`
- New (mine): `(Ctrl+R, **re-arm per K2, then verify the arm and the level**, reopen, Zoom to layer)`

**L1's Step (`WT:815 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), see OPEN-4:**
- Old: `(verify the arm!)`
- New (mine): `(verify the arm and the level!)`

**Clause check:**
- "default candidate": `frontends/shell/src/residency/residencyArm.ts:50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:58 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the module-init value).
- "level unset": `frontends/shell/src/residency/residencyTileSizeLevel.ts:37 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:48-50 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "runs at medium": `frontends/shell/src/residency/residencyTileSizeLevel.ts:21-28 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `frontends/shell/src/residency/candidateArmSession.ts:924 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `frontends/shell/src/streaming/tileViewportStreamManager.ts:404 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `frontends/shell/src/canvas/tileGridConstants.ts:35 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "re-arm accepted before an open": `frontends/shell/src/residency/residencyTileSizeLevel.ts:43 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:62-72 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "hooks exist": `frontends/shell/src/App.tsx:1328-1335 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "the getter reads the selection for the next session, so it is read before the open": `frontends/shell/src/e2e-test-surface.ts:326-331 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `frontends/shell/src/residency/residencyTileSizeLevel.ts:45-47 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "K2's calls": `WT:740 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

**Limits of the check:**
- That a Ctrl+R re-runs the page's modules is page-reload behaviour, not a line of code. It is inferred, not executed (§1).
- The hooks exist only in an instrumented build (`frontends/shell/src/e2e-test-surface.ts:343-351 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`). This is a dev-only switch under §31(c), already Part K's premise, and it does not block.

### B8: Part J, J1 (`WT:658 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`)

**Old:**
> produces exactly **two** new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry, never more than two (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point).

**New (mine):**
> produces two new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point). Once the dataset is admitted, the map's first data load adds at least one `viewport_query` class-A entry after these two (and, the first time this app process loads map data, one `binding_data_plane_attach` class-B entry).

**Clause check:**
- "two, in order": `frontends/shell/src/admission/admitDataset.ts:46-56 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "captured at call": `frontends/shell/src/skp/client.ts:46-68 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (record at 55).
- "first load adds viewport_query": `frontends/shell/src/App.tsx:1697-1700 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `frontends/shell/src/residency/candidateArmSession.ts:1267-1279 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `frontends/shell/src/skp/client.ts:107-126 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- "attach once per process": `frontends/shell/src/streaming/dataPlaneClient.ts:20-41 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.
- It agrees with the run record: `WT:1181-1183 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, not edited.

### B9: Part N, N9 (`WT:954 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), three spans

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
- `KNOWN-LIMITATIONS.md:202 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (the heading);
- `:232 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 19, the change detector, = (1));
- `:248 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 20, partitioned, = (2));
- `:259 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 21, degrees publish, = (3));
- `:269 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 22, sanity check, = (4));
- `:280 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` (item 23, small pan, = (5)).

The worker byte-checks the heading text in the new span against `:202` at B.

### B10 (S3, riding): Part A, A3 (`WT:158 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`)

**Old span:**
> **Geometry** `geometry (geoarrow.polygon)`;

**New (mine):**
> **[P6 placeholder] Geometry (encoding chosen by the engine)** `geometry (geoarrow.polygon)`; **[P6 placeholder] Geometry types declared by the file** (the file's own declaration);

**And after** `**License** "not declared"` **insert (mine):**
> ; **CRS provenance**

**Clause check:** `frontends/shell/src/admission/DescribeSummary.tsx:29-63 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`:
- the labels at 36, 41 and 62;
- the order: CRS, Geometry encoding, Geometry types, Identity, Row count, Extent, Schema, License, CRS provenance;
- `frontends/shell/src/admission/describeSummaryText.ts:47-49 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` and `:105-114 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`.

Part M's M4 ("exactly as Part A's A3 describes") is fixed through A3. Part M is not edited.

### F2: see OPEN-1. The span if it rides: `WT:269 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`

**Old:**
> no admission dialog, no query, nothing round-trips through the kernel (a style edit is a re-render of already-resident data only).

**New (mine):**
> no admission dialog, no query (a style edit is a re-render of already-resident data only); once the edit is committed, it is recorded in the session history by one `record_step` request per changed style value (Part J's J3).

The clause check is the same as B2's and B4's.

---

## OPEN items (none is a red line: walkthrough rows are neither ADR text, gate rulings, licensing nor security posture)

**OPEN-1. Does F2 ride here or wait?**
- (a) Ride now. Git shows the paths disjoint: PR B is not open and `cut/b1-shell-half-pr-c` has 0 files. The milestone-4 form scopes PR B's Part F edits to location words (`...MILESTONE-4-PREREGISTRATION.md:399 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`, `:474 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), and F2's clause is not one.
- (b) Wait. b1-shell-half is `in-progress` (`governance/PLAN.yaml:2370-2386 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`) and declares Part F. Rule (00) (`governance/AUTONOMY.md:609 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`) counts every in-progress piece's paths, Parts separately, not only open PRs. F2 then joins PR B, or the first docs piece after it, as class 9, with the words above.
- **Recommend (b).** Rule (00) is a standing rule and its strict reading names the Part, not the row. The node's own summary already places F2 after PR B.
- Mitigation if the sitting reaches Part F first: the custodian puts a one-line pointer to Part J's J3 beside F2 in the ungated sitting script (OPEN-5).
- Until PR B, the Part H pointer will contradict F2's text. I name that, and accept it.

**OPEN-2. Part H: a pointer, or in-place edits of H1, H2 and H5?**
- (a) Edit the spans in place.
- (b) Add a dated pointer after the 2026-09-08 pointer.
- **Recommend (b).** The rows are a run record "kept exactly as run" by the file's own precedent (`WT:458-463 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`), and the brief rules that no recorded result is edited.

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
- **Recommend (b).** It is not gated. Editing it here adds an unscoped path, and a re-copy from the merged file is byte-true by construction. The custodian also updates `operator-sitting-queue`'s summary text (`governance/PLAN.yaml:5878-5894 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`).

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
   - `frontends/shell/e2e/console.mjs:452 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`'s comment, as I read it, says the client sends `null` for a key the client always sends (`types.ts:261-264`).
   - `frontends/shell/src/e2e-test-surface.ts:304-314 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` still calls `"baseline"` the default. That is triage A2, the shell-comments node; an operator reading the hook's doc would meet the claim B7 retires.
7. `adr-023-stale-cites-before-acceptance` depends on this node (`governance/PLAN.yaml:6838-6845 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a`). Nothing in this piece changes that dependency.
