*Custodian's filing note (2026-11-14): the architect's draft of the five-line form for the docs lane's `publish-approval-consult-gate-findings`, from its brief by file (6853 bytes, sha256 705efdd18304e2d1e59d667edd50a29129263cb13c8349b0f95d2d7f843e2094), read only at main 9540e6cb. Dispatched at 2026-11-14T02:31:34Z by its transcript; handed back at 2026-11-14T02:38:03Z (claude-opus-5-5; calls Read 25, Grep 14, Glob 1 and the hand-back, 41 in all; none errored; no write). The draft below was extracted by script from the hand-back in that transcript (19350 bytes with one final newline, sha256 fb234a56252742f61791820d8a1febd8883e1d5333205bd1f2821a7a9aabe377) and is unchanged. Its `<H>` placeholders are filled by script when the form is committed, not here. The custodian's notes, not the draft: OPEN-1 (walkthrough G3's words) goes to the advisor; OPEN-2 was never a red line and takes the drafter's recommendation (a) under item 4 of 2026-10-31, dated 2026-11-14.*

Drafted: publish-approval-consult-gate-findings form, at 9540e6cb

Reviewed: main @ 9540e6cb71ca57f097c6ef29bfccd38e18df79c0 (read only; no file written, no shell)

````markdown
# The publish approval consult's four gate findings: the approval dialog's doc comment and walkthrough G3, the docs lane — five-line short form (`AUTONOMY.md` §21d)

This form is committed before any change, under the short-form discipline. It is the docs lane's piece that the human placed in their message of 2026-11-12 (21:15Z), item 4 (d). The architect drafted it read only at main 9540e6cb71ca57f097c6ef29bfccd38e18df79c0. The custodian fills each `<H>` by script at 9540e6cb: the sha256 of the cited whole lines, each with its LF. Where a cite is a sub-line span, the hash is the line's hash, and the cite says so.

```
Authority: PLAN node publish-approval-consult-gate-findings; `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:22` @ 9540e6cb sha256:<H>, item 4 (d), the consult's four gate findings sent to the docs lane under item 4 of `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md` (cited by item); the findings at `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md:140-145` @ 9540e6cb sha256:<H>; the grant, `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:15` @ 9540e6cb sha256:<H> and `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:17` @ 9540e6cb sha256:<H> (§C's words are the advisor's to rule); walkthrough Parts as disjoint paths (rule (00a)); the reuse index, three misses (§R).
Scope: frontends/shell/src/publish/PublishDialog.tsx (lines 169 to 171 of the component's doc comment only, three lines replaced by §B's four; none of the file's other `NEXT-CUT.md` pointers, OPEN-2) and frontends/shell/MANUAL-WALKTHROUGH.md (Part G, row G3 only: one span inside the row's line replaced by §C; no other row or Part); 2 files; declared line budget <= 12 changed lines by §21c's counting (7 + 2 expected), this form excluded. The node's PLAN record goes to main by the records commits (ruling (21)), not in the PR.
Change: the approval component's doc comment points to `types.ts` and the JSX below it instead of an unnamed report, and names the publish cut's brief as deleted; G3's Style hash entry tells the operator that the dialog names the style by its hash alone; nothing else changes.
Tests+mutation: none added or changed (documents only; no behaviour changes); the single reviewer checks §B and §C byte for byte at the head, and each clause of each against the code at the head (§B's and §C's clause lists); it recomputes every pin; it checks that `git diff origin/main...HEAD` changes no other line, and that `npm run verify` in frontends/shell stays green.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file (finding 1 is already met by ADR-024's appended note of 2026-10-20, §A), nothing under protocol/ or src-tauri/, no code statement, no test, and no string the app shows (the doc comment is never rendered, §A); PR B's form is not edited (finding 4 is PR B's own, §D).
```

### §A. Each finding at main (9540e6cb)

1. **ADR-024's 120 s approval lifetime: already met; no change.**
   - The appended note of 2026-10-20 carries amendment `publish-approval-ttl-ten-minutes`, at `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:302` @ 9540e6cb sha256:<H>. It states 600 s, and it names the Decision bullet's 120 s (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:88` @ 9540e6cb sha256:<H>, a sub-line span; the hash is the line's) as not the value.
   - Each of the note's clauses is true at the head:
     - 600 s: `frontends/shell/src-tauri/src/publish.rs:69` @ 9540e6cb sha256:<H>.
     - The grant takes the same lifetime: `frontends/shell/src-tauri/src/publish.rs:656-658` @ 9540e6cb sha256:<H>.
     - That lifetime stays under 20 minutes: `kernel/src/permission/grant.rs:221` @ 9540e6cb sha256:<H>.
     - One expiry sentence: `frontends/shell/src/publish/PublishDialog.tsx:16-17` @ 9540e6cb sha256:<H> and `frontends/shell/src/publish/PublishDialog.tsx:285` @ 9540e6cb sha256:<H>.
     - No countdown: the remaining seconds are the host's one number, `frontends/shell/src/publish/PublishDialog.tsx:257-259` @ 9540e6cb sha256:<H>.
   - The note is older than the consult, which was read at c85788f1 on 2026-11-12. The consult's finding 1 was therefore already met when it was written. The consult is a reading, not Authority, and it is not edited.
   - ADR-024 is Proposed, and its body is not rewritten.

2. **`PublishDialog.tsx:168-171`: still true; this node's change (§B).**
   - The span is at `frontends/shell/src/publish/PublishDialog.tsx:168-171` @ 9540e6cb sha256:<H>. It points to "this piece's own report" and names no path.
   - It is a JSDoc block above `export default function PublishDialog` (`frontends/shell/src/publish/PublishDialog.tsx:180` @ 9540e6cb sha256:<H>). It is never shown to a user: the dialog's rendered text is the JSX at `frontends/shell/src/publish/PublishDialog.tsx:234-331` @ 9540e6cb sha256:<H>. So it is a source comment, and its words are the writer's under AUTONOMY §31(d).
   - Its `NEXT-CUT.md` P2, at line 169, now resolves by bare name to `state/NEXT-CUT.md`. That file is a later cut's brief (Brief A), and its P2 is unrelated. The publish cut's brief was deleted by that cut's final docs commit (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:34-35` @ 9540e6cb sha256:<H>). §B fixes this inside the span.

3. **Walkthrough G3: one half still true, one half met.**
   - G3 is at `frontends/shell/MANUAL-WALKTHROUGH.md:333` @ 9540e6cb sha256:<H>; each sub-line span below carries the line's hash.
   - (i) **Still true.** The row's JUDGE asks whether the operator knows what style will be written. The dialog shows the style only as `style_hash` (`frontends/shell/src/publish/PublishDialog.tsx:249-250` @ 9540e6cb sha256:<H>), and the payload has no other style field (`frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:<H>).
     - The row is not false: it already lists the Style hash as `sha256:…`.
     - It does not tell the operator that the hash is the dialog's only style fact. §C is the change, if OPEN-1 rules it.
   - (ii) **Met at main by `publish-approval-columns-line`** (PR #314, merge 204c1762). The finding said the category column stays unnamed under PR B. At main:
     - the host composes the columns line from the request's attributes (`frontends/shell/src-tauri/src/publish.rs:322-331` @ 9540e6cb sha256:<H>; `frontends/shell/src-tauri/src/publish.rs:697` @ 9540e6cb sha256:<H>);
     - the shipped build's only attribute is the style's match column (`frontends/shell/src-tauri/src/publish.rs:1299-1307` @ 9540e6cb sha256:<H>);
     - the dialog renders the line (`frontends/shell/src/publish/PublishDialog.tsx:264` @ 9540e6cb sha256:<H>), and G3 already describes it.
     - So under PR B the line names the Colour by column. That PR B's operator row 5 asserts it is PR B's own work (item 4 (c), §D).

4. **PR B's form §2.3 (i): still true; PR B's own, not this node's (§D).**
   - The section is at `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:268-270` @ 9540e6cb sha256:<H>.
   - At main the form does not name the columns line, `publish-approval-columns-line` or the consult's path, in §2.3 or in Amendments 12 and 13. Amendment 13 names only the publish approval piece's OPEN-8 (a). The reviewer re-checks this absence by script.

### §B. The doc comment (the writer's words under AUTONOMY §31(d), not the advisor's; listed in the PR body)

Lines 169 to 171 are replaced by these four lines. Line 168 (`/**`) and line 172 onward are unchanged.

```text
 * The approval surface: P2 of the publish cut's brief, which that cut's final docs commit
 * deleted (ADR-024's Related list); ADR-024's Decision section records this surface. Every
 * `PublishPromptData` field (`types.ts`) is rendered verbatim, in the order the JSX below
 * declares it, and `filter_scope` only when the host sends one.
```

Each clause checked against the code at 9540e6cb:
- **The brief was deleted by the publish cut's final docs commit:** `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:34-35` @ 9540e6cb sha256:<H>.
- **The Decision section records the surface:** `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:137-178` @ 9540e6cb sha256:<H>.
- **Every field is rendered:**
  - the 13 fields are at `frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:<H>;
  - operation, class and reversibility at `frontends/shell/src/publish/PublishDialog.tsx:237` @ 9540e6cb sha256:<H>; outcome_summary at `:243`; the eight list fields at `frontends/shell/src/publish/PublishDialog.tsx:244-265` @ 9540e6cb sha256:<H>; filter_scope at `frontends/shell/src/publish/PublishDialog.tsx:266-270` @ 9540e6cb sha256:<H>.
- **Verbatim:** each value is interpolated unchanged. The header's separators and the "s" after the seconds are the component's own text, as before this change.
- **filter_scope only when sent:** it is null otherwise (`frontends/shell/src/publish/types.ts:35-39` @ 9540e6cb sha256:<H>), and the render is guarded (`:266`).
- **No case outside ordinary use** bears on any clause.

### §C. G3's Style hash entry (a DRAFT, the advisor's wording to rule under the delegation of 2026-11-13; OPEN-1)

The span to replace is byte-copied from `frontends/shell/MANUAL-WALKTHROUGH.md:333` as the Read tool showed it (verbatim; the reviewer confirms that it occurs exactly once in the line at the base):

```text
**Style hash** (`sha256:…` — the style you set in G1)
```

Option (b), recommended. The words up to the second dash are the advisor's to rule. The attribution after them is the writer's, in the grant's item 3 form.

```text
**Style hash** (`sha256:…` — the style you set in G1; the dialog names that style by this hash alone and shows none of its colours, opacity or outline — added by `publish-approval-consult-gate-findings`, the advisor's wording, under the delegation of 2026-11-13)
```

Each clause checked against the code at 9540e6cb:
- **"By this hash alone":** `style_hash` is the payload's only style field (`frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:<H>), and it is the dialog's only style render (`frontends/shell/src/publish/PublishDialog.tsx:249-250` @ 9540e6cb sha256:<H>).
- **"None of its colours, opacity or outline":** no field carries them, and none of the dialog's fixed text names them (`frontends/shell/src/publish/PublishDialog.tsx:276-328` @ 9540e6cb sha256:<H>).
- **Still true after PR B:** PR B keeps PublishDialog and `publish.rs` unchanged (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:176` @ 9540e6cb sha256:<H>). Under a Colour by style the columns line names a column, which is neither a colour, nor an opacity, nor an outline.
- **Reach:** ordinary use reaches every clause, with no timing, dev-only or instrumented case.

The other options are under OPEN-1. Option (a) changes no file, and the form drops MANUAL-WALKTHROUGH.md from Scope before its commit. Option (c) changes the JUDGE sentence instead, giving the same clause there.

### §D. The order with PR B, under rule (00)

- **Finding 2 (§B) lands before PR B, with no wait.** PR B's §2.1 keeps PublishDialog unchanged (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:176` @ 9540e6cb sha256:<H>), and PR B's branch at 6649a443 does not name the file (the custodian's check at 2026-11-14T02:28Z).
- **Finding 3 (§C) lands before PR B, with no wait.**
  - It edits Part G only. PR B's operator rows go into Part AC, the milestone 4 Part (`frontends/shell/MANUAL-WALKTHROUGH.md:1973` @ 9540e6cb sha256:<H>), which is a separate path under rule (00a).
  - G3 stays true after PR B. G1 sets a literal style, so at G3 the columns line still reads the no-attributes form, and §C's clauses hold (§C).
- **Finding 4 is PR B's own.** The custodian's amendment on PR B's form carries it, and this node does not touch that file. There are two reasons:
  - Rule (00): PR B is in progress, and its form is its governing record. The custodian amends it straight to main (ruling (21)), so a second piece editing that file would be two pieces on one file.
  - The record is about PR B's work and results. Item 4 (c) (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:21` @ 9540e6cb sha256:<H>) makes PB-E2 and operator row 5 assert that the line names the column. That adds work to a preregistered piece, which is class 9 (round 25, item 2 (a)), declared before any code of it. What the change means for the approval can be stated only against PB-E2's run.
  - So Amendment 14 declares PB-E2's added assertion with its mutation, and row 5's added expected outcome, and cites the consult by path. PR B's records commit reads them against the run.
- **Finding 1:** nothing lands.

### §E. Checks (the single reviewer, §21b)

- The Out-of-scope line first.
- §B and §C byte for byte at the head: §C as the advisor's ruling gives it, and §B as written.
- Every clause in §B's and §C's lists, against the code at the head.
- §A's "met" claims (findings 1 and 3 (ii)), each against the lines it names.
- Every `<H>`, by recomputation.
- `git diff origin/main...HEAD` changes the two spans and no other line, and the count stays within Scope's budget.
- `npm run verify` in frontends/shell stays green. In a fresh worktree this needs `npm ci` in renderer/bundle-viewer as well.
- No test is expected. The reviewer reports any clause it reads as untrue at the head, and it changes no word itself.

### §R. The reuse index (byte for byte, as the custodian ran it in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-14)

```text
$ node tools/reuse.mjs approval dialog field list pointer   (exit 1)
No prior art recorded for "approval dialog field list pointer". Research it before planning an implementation.
$ node tools/reuse.mjs pending approval lifetime ttl note   (exit 1)
No prior art recorded for "pending approval lifetime ttl note". Research it before planning an implementation.
$ node tools/reuse.mjs walkthrough question publish style   (exit 1)
No prior art recorded for "walkthrough question publish style". Research it before planning an implementation.
```

All three are misses. The form rests on the tree at 9540e6cb alone, and it plans no implementation.

### Settlement

- **Route:** the five-line form under §21c (2 files, at most 12 changed lines) and §21d, with the single reviewer gate of §21b from dispatch. The PLAN node's gate becomes this form's path, and its 30 minutes stand.
- **Rule (00):** the custodian checked at 2026-11-14T02:28Z.
  - PR B (`origin/cut/b1-shell-half-pr-b` at 6649a443) and port-2 name neither file.
  - Second-open touches kernel and protocol doc files, and pan-anchor touches `frontends/shell/e2e/pan-anchor.mjs` only.
  - No PR awaiting merge touches either file. No path is under protocol/.

### Amendments

*(Opens empty; append-only.)*
````

## OPEN items

- **OPEN-1: G3 (finding 3 (i)).** This needs the advisor's ruling, because it is walkthrough wording (grant, item 2).
  - (a) No edit. G3 already shows the hash, and the JUDGE question is the exposure review's own question: an operator's "no" there is a finding, not a defect.
  - (b) §C's words in the Style hash entry. **Recommended.** The operator can see the fact, the edit is one span, and the JUDGE question is left as it is.
  - (c) The same clause placed in the JUDGE sentence instead. This edits the exposure review's question.
- **OPEN-2: the file's other `NEXT-CUT.md` pointers.** These are `PublishDialog.tsx` lines 24, 56, 92, 143, 252, 257 and 300, and the describe names at `PublishDialog.test.ts` lines 57 and 112. Several of them quote the deleted brief. This needs the custodian's ruling under item 4 of 2026-10-31; it was never a red line.
  - (a) Out of scope here, and a gate finding for a later docs-lane node. **Recommended:** keeping the quoted rules honest needs the deleted brief's text from git history, and that is more than 30 minutes.
  - (b) Widen this node before its form is committed.

## Gate findings (not ruled)

1. My consult's finding 1 was already met when it was written. ADR-024's note of 2026-10-20 was on the tree at c85788f1, and the consult cited line 88 without reading to the end of the ADR. Under the record cap the only record of this is §A.
2. Finding 4 needs PR B's Amendment 14 to declare item 4 (c)'s PB-E2 assertion as class 9, with its mutation, before any code of it (round 25, item 2 (a)). Landing that code first is a gate failure by name.
3. The "every field rendered" claim is only partly proven by tests. `PublishDialog.test.ts` render tests cover source, the two hashes, destination, row scope, outcome_summary and published_columns. No render test asserts the header fields, grantor, grant_remaining_s or filter_scope. This is not this node's to fix (documents only).

## Read, by path

- the consult: `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md`
- the directives: `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md` and `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`
- `governance/PLAN.yaml`: the nodes b1-shell-half, publish-approval-columns-line, publish-approval-kernel-parity and publish-approval-consult-gate-findings
- `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`, whole
- `frontends/shell/src/publish/PublishDialog.tsx`, `frontends/shell/src/publish/PublishDialog.test.ts` and `frontends/shell/src/publish/types.ts`
- `frontends/shell/src-tauri/src/publish.rs`, by search and in parts
- `kernel/src/permission/grant.rs`, by search
- `frontends/shell/MANUAL-WALKTHROUGH.md`: Part G, the Parts index, and the 2026-08-17 log
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`: §1, §2.1, §2.3, §9, Amendments 12 and 13, and a search for the approval
- `KNOWN-LIMITATIONS.md`, items 58 and 59
- `governance/AUTONOMY.md`, §21 to §21d and §31
- `docs/PREREGISTRATION-TEMPLATE.md`
- `governance/forms/root/KNOWN-LIMITATIONS-ITEM-47-NAME-FLOOR-SENTENCE-PREREGISTRATION.md`
- `state/NEXT-CUT.md`, by search

## Packet gaps

- The text of item 4 of 2026-10-31 was not given or read. It is cited by item only.
- The brief does not say whether a changed G3 row joins the operator sitting's list.
- The brief does not say when PR B's Amendment 14 is due relative to this node.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports it.
