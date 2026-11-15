# The publish approval consult's four gate findings: the approval dialog's doc comment and walkthrough G3, the docs lane — five-line short form (`AUTONOMY.md` §21d)

This form is committed before any change, under the short-form discipline. It is the docs lane's piece that the human placed in their message of 2026-11-12 (21:15Z), item 4 (d). The architect drafted it read only at main 9540e6cb71ca57f097c6ef29bfccd38e18df79c0. The custodian fills each `<H>` by script at 9540e6cb: the sha256 of the cited whole lines, each with its LF. Where a cite is a sub-line span, the hash is the line's hash, and the cite says so. OPEN-1 and OPEN-2 were ruled before this commit (§O).

```
Authority: PLAN node publish-approval-consult-gate-findings; `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:22` @ 9540e6cb sha256:94418eaaf57c2a7eee4b6e5b7f63afd7edeb3fdcf046c66cb5af00fb53bae8f9, item 4 (d), the consult's four gate findings sent to the docs lane under item 4 of `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md` (cited by item); the findings at `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md:140-145` @ 9540e6cb sha256:51559fce7542ebfd02dcb8b250b67371fae24230ee656842f386d0892d22d727; the grant, `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:15` @ 9540e6cb sha256:70091e7946a1fe600a9e65ab213fe02b2879dc6d03a8679565bd7a2837c6e923 and `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:17` @ 9540e6cb sha256:76ae99bd72fc220f58ccc76307e90340442e73ddc4a867971e0726b6efa51fd5 (§C's words are the advisor's: OPEN-1 ruled (b) by the advisor's ruling ADV-2026-11-14-06 under the delegation of 2026-11-13, `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-06-findings-node-open-1-b-the-g3-style-hash-clause-the-judge-sentence-unchanged.md`); walkthrough Parts as disjoint paths (rule (00a)); the reuse index, three misses (§R).
Scope: frontends/shell/src/publish/PublishDialog.tsx (lines 169 to 171 of the component's doc comment only, three lines replaced by §B's four; none of the file's other `NEXT-CUT.md` pointers, OPEN-2) and frontends/shell/MANUAL-WALKTHROUGH.md (Part G, row G3 only: one span inside the row's line replaced by §C; no other row or Part); 2 files; declared line budget <= 12 changed lines by §21c's counting (7 + 2 expected), this form excluded. The node's PLAN record goes to main by the records commits (ruling (21)), not in the PR.
Change: the approval component's doc comment points to `types.ts` and the JSX below it instead of an unnamed report, and names the publish cut's brief as deleted; G3's Style hash entry tells the operator that the dialog names the style by its hash alone; nothing else changes.
Tests+mutation: none added or changed (documents only; no behaviour changes); the single reviewer checks §B and §C byte for byte at the head, and each clause of each against the code at the head (§B's and §C's clause lists); it recomputes every pin; it checks that `git diff origin/main...HEAD` changes no other line, and that `npm run verify` in frontends/shell stays green.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file (finding 1 is already met by ADR-024's appended note of 2026-10-20, §A), nothing under protocol/ or src-tauri/, no code statement, no test, and no string the app shows (the doc comment is never rendered, §A); PR B's form is not edited (finding 4 is PR B's own, §D).
```

### §A. Each finding at main (9540e6cb)

1. **ADR-024's 120 s approval lifetime: already met; no change.**
   - The appended note of 2026-10-20 carries amendment `publish-approval-ttl-ten-minutes`, at `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:302` @ 9540e6cb sha256:f4018b1a149d07581184d7704447d3abae3c5d4633c1c2f2a357c2323fd7a6d6. It states 600 s, and it names the Decision bullet's 120 s (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:88` @ 9540e6cb sha256:b9038105412169bd2bd9da5682a3afce4303ae46a4f72ae88936105292a61271, a sub-line span; the hash is the line's) as not the value.
   - Each of the note's clauses is true at the head:
     - 600 s: `frontends/shell/src-tauri/src/publish.rs:69` @ 9540e6cb sha256:e6d22c86a483b84486fe4742b38166e434ac77a7962557099712fffed75d1d0a.
     - The grant takes the same lifetime: `frontends/shell/src-tauri/src/publish.rs:656-658` @ 9540e6cb sha256:3df733958b60ed1662ef831a703b9b245cd772b244f5bdda8ac81ce974985178.
     - That lifetime stays under 20 minutes: `kernel/src/permission/grant.rs:221` @ 9540e6cb sha256:1b06596967d6d5f1fb54fc9303e332c94d3360465b0d26a88a51353cc6ed6b42.
     - One expiry sentence: `frontends/shell/src/publish/PublishDialog.tsx:16-17` @ 9540e6cb sha256:0d8eb08038b07070046ec534ee19114dcf30b94f32b79866e416612093816f3d and `frontends/shell/src/publish/PublishDialog.tsx:285` @ 9540e6cb sha256:49a16f951af792670c100b61a88ae3262a8912527094174372608f88d0c31953.
     - No countdown: the remaining seconds are the host's one number, `frontends/shell/src/publish/PublishDialog.tsx:257-259` @ 9540e6cb sha256:f58b79add1579adafb8ba05e68b0525f26d0241814d2f366a18670cd5b2d6e77.
   - The note is older than the consult, which was read at c85788f1 on 2026-11-12. The consult's finding 1 was therefore already met when it was written. The consult is a reading, not Authority, and it is not edited.
   - ADR-024 is Proposed, and its body is not rewritten.

2. **`PublishDialog.tsx:168-171`: still true; this node's change (§B).**
   - The span is at `frontends/shell/src/publish/PublishDialog.tsx:168-171` @ 9540e6cb sha256:617e16b10bcf8b902f366d642afb49c5347c873f7662b1fb6fdd22f82874a744. It points to "this piece's own report" and names no path.
   - It is a JSDoc block above `export default function PublishDialog` (`frontends/shell/src/publish/PublishDialog.tsx:180` @ 9540e6cb sha256:cf958427b119caaf2425c7a47aaa5fb190f7db8436a757e29016a67ef713d50b). It is never shown to a user: the dialog's rendered text is the JSX at `frontends/shell/src/publish/PublishDialog.tsx:234-331` @ 9540e6cb sha256:14435442d5ac496fc7120f32084c7b2a6bf0052d09fee9844a7976609cce85a2. So it is a source comment, and its words are the writer's under AUTONOMY §31(d).
   - Its `NEXT-CUT.md` P2, at line 169, now resolves by bare name to `state/NEXT-CUT.md`. That file is a later cut's brief (Brief A), and its P2 is unrelated. The publish cut's brief was deleted by that cut's final docs commit (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:34-35` @ 9540e6cb sha256:008b0d6386d76534457ea5af0441a0dfdf9b262bf370d0d9f7dfdf9f7fdc93a8). §B fixes this inside the span.

3. **Walkthrough G3: one half still true, one half met.**
   - G3 is at `frontends/shell/MANUAL-WALKTHROUGH.md:333` @ 9540e6cb sha256:1846956eda1a2ec577857411a57f68209b7e3356bc3560ba5fddfbb23b071218; each sub-line span below carries the line's hash.
   - (i) **Still true.** The row's JUDGE asks whether the operator knows what style will be written. The dialog shows the style only as `style_hash` (`frontends/shell/src/publish/PublishDialog.tsx:249-250` @ 9540e6cb sha256:87434cab6e5ef1a463db65b363b5e85394d993bd6c5c55f05d10bb9680b04307), and the payload has no other style field (`frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:eda91fbc8f0e689786a2875183ee8230c80b4dfba219d392d1b3990b814715d9).
     - The row is not false: it already lists the Style hash as `sha256:…`.
     - It does not tell the operator that the hash is the dialog's only style fact. §C is the change, if OPEN-1 rules it.
   - (ii) **Met at main by `publish-approval-columns-line`** (PR #314, merge 204c1762). The finding said the category column stays unnamed under PR B. At main:
     - the host composes the columns line from the request's attributes (`frontends/shell/src-tauri/src/publish.rs:322-331` @ 9540e6cb sha256:d0d43e272259716976b5637962c28460307e495c67c07755d46748adbe6e8f7d; `frontends/shell/src-tauri/src/publish.rs:697` @ 9540e6cb sha256:f41b0f38fc7e9e3090b6f33fd24b21e13f3dfd670c003e871b73ba92285f9925);
     - the shipped build's only attribute is the style's match column (`frontends/shell/src-tauri/src/publish.rs:1299-1307` @ 9540e6cb sha256:344ffb2c470af3efcb1b1b3f1bbf31992c7278d33ae7706e14cd2ea073530c4d);
     - the dialog renders the line (`frontends/shell/src/publish/PublishDialog.tsx:264` @ 9540e6cb sha256:5b15080b9cc8fe1e4772b5dbae8ddf8af97d68dd53f68db8cf6d6757fd2173da), and G3 already describes it.
     - So under PR B the line names the Colour by column. That PR B's operator row 5 asserts it is PR B's own work (item 4 (c), §D).

4. **PR B's form §2.3 (i): still true; PR B's own, not this node's (§D).**
   - The section is at `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:268-270` @ 9540e6cb sha256:b216be69c816050bfac303c5456b5665bf4ba48e3eef025eb49ce008a2c27af7.
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
- **The brief was deleted by the publish cut's final docs commit:** `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:34-35` @ 9540e6cb sha256:008b0d6386d76534457ea5af0441a0dfdf9b262bf370d0d9f7dfdf9f7fdc93a8.
- **The Decision section records the surface:** `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:137-178` @ 9540e6cb sha256:54f3b373b9b195394ae8aa8d58adce3481a96ebf749ec99d02ef612b4b6eb274.
- **Every field is rendered:**
  - the 13 fields are at `frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:eda91fbc8f0e689786a2875183ee8230c80b4dfba219d392d1b3990b814715d9;
  - operation, class and reversibility at `frontends/shell/src/publish/PublishDialog.tsx:237` @ 9540e6cb sha256:c4d7bcac4707bc63965cf21eb1910b377f56e4fbac288dc63b636786ac62131a; outcome_summary at `:243`; the eight list fields at `frontends/shell/src/publish/PublishDialog.tsx:244-265` @ 9540e6cb sha256:37d396ee6c1b15fe19b020b6d27221efca87c8b06fb79f468a4ab7f5238a611a; filter_scope at `frontends/shell/src/publish/PublishDialog.tsx:266-270` @ 9540e6cb sha256:bdf53f0895463436240c4a648c93a6679e4a7a1f5693c30ad8c4faaa68e08cb0.
- **Verbatim:** each value is interpolated unchanged. The header's separators and the "s" after the seconds are the component's own text, as before this change.
- **filter_scope only when sent:** it is null otherwise (`frontends/shell/src/publish/types.ts:35-39` @ 9540e6cb sha256:77bb6b2c84e3d53cd62423363084d6ec6ed5a3a8fc2b470fb1132617eaf08398), and the render is guarded (`:266`).
- **No case outside ordinary use** bears on any clause.

### §C. G3's Style hash entry (the advisor's wording, under the delegation of 2026-11-13: OPEN-1 ruled (b) by ADV-2026-11-14-06)

The span to replace is byte-copied from `frontends/shell/MANUAL-WALKTHROUGH.md:333` as the Read tool showed it (verbatim; the reviewer confirms that it occurs exactly once in the line at the base):

```text
**Style hash** (`sha256:…` — the style you set in G1)
```

Option (b), ruled by the advisor's ruling ADV-2026-11-14-06, whose item 2 gives this span; the custodian's script checked it equal to that item's span, byte for byte, when the form was committed. The words up to the second dash are the advisor's wording, under the delegation of 2026-11-13. The attribution after the second dash is in the grant's item 3 form and is part of the ruled span.

```text
**Style hash** (`sha256:…` — the style you set in G1; the dialog names that style by this hash alone and shows none of its colours, opacity or outline — added by `publish-approval-consult-gate-findings`, the advisor's wording, under the delegation of 2026-11-13)
```

Each clause checked against the code at 9540e6cb:
- **"By this hash alone":** `style_hash` is the payload's only style field (`frontends/shell/src/publish/types.ts:15-52` @ 9540e6cb sha256:eda91fbc8f0e689786a2875183ee8230c80b4dfba219d392d1b3990b814715d9), and it is the dialog's only style render (`frontends/shell/src/publish/PublishDialog.tsx:249-250` @ 9540e6cb sha256:87434cab6e5ef1a463db65b363b5e85394d993bd6c5c55f05d10bb9680b04307).
- **"None of its colours, opacity or outline":** no field carries them, and none of the dialog's fixed text names them (`frontends/shell/src/publish/PublishDialog.tsx:276-328` @ 9540e6cb sha256:89db3f62e9e698999313209bdb5b972a1389a07f455b81019193c9746ab7cd74).
- **Still true after PR B:** PR B keeps PublishDialog and `publish.rs` unchanged (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:176` @ 9540e6cb sha256:829af76f9fb294a265e56f9124643a594c7b37059c765208a2a5945559be3eff). Under a Colour by style the columns line names a column, which is neither a colour, nor an opacity, nor an outline.
- **Reach:** ordinary use reaches every clause, with no timing, dev-only or instrumented case.

OPEN-1's options (a), no edit, and (c), the same clause in the JUDGE sentence, were not taken (the ruling's item 1). The JUDGE sentence is not changed, and MANUAL-WALKTHROUGH.md stays in Scope (its item 4).

### §D. The order with PR B, under rule (00)

- **Finding 2 (§B) lands before PR B, with no wait.** PR B's §2.1 keeps PublishDialog unchanged (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:176` @ 9540e6cb sha256:829af76f9fb294a265e56f9124643a594c7b37059c765208a2a5945559be3eff), and PR B's branch at 6649a443 does not name the file (the custodian's check at 2026-11-14T02:28Z).
- **Finding 3 (§C) lands before PR B, with no wait.**
  - It edits Part G only. PR B's operator rows go into Part AC, the milestone 4 Part (`frontends/shell/MANUAL-WALKTHROUGH.md:1973` @ 9540e6cb sha256:3ecbacc9f43c7c739ad64612f7f7600b910d720f19923518be31c5a2d8e6c0c3), which is a separate path under rule (00a).
  - G3 stays true after PR B. G1 sets a literal style, so at G3 the columns line still reads the no-attributes form, and §C's clauses hold (§C).
- **Finding 4 is PR B's own.** The custodian's amendment on PR B's form carries it, and this node does not touch that file. There are two reasons:
  - Rule (00): PR B is in progress, and its form is its governing record. The custodian amends it straight to main (ruling (21)), so a second piece editing that file would be two pieces on one file.
  - The record is about PR B's work and results. Item 4 (c) (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:21` @ 9540e6cb sha256:70932e1712f73c4e0defe23359d0f8eff4d87312033dbee4ac2147a866fda166) makes PB-E2 and operator row 5 assert that the line names the column. That adds work to a preregistered piece, which is class 9 (round 25, item 2 (a)), declared before any code of it. What the change means for the approval can be stated only against PB-E2's run.
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

### §O. The OPEN items, ruled before this commit

- **OPEN-1, G3 (finding 3 (i)):** (b), §C's words in the Style hash entry, by the advisor's ruling ADV-2026-11-14-06 under the delegation of 2026-11-13 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-06-findings-node-open-1-b-the-g3-style-hash-clause-the-judge-sentence-unchanged.md`), items 1, 2 and 4.
- **OPEN-2, the file's other `NEXT-CUT.md` pointers** (lines 24, 56, 92, 143, 252, 257 and 300 of the dialog's component, and the two describe names of its test file at lines 57 and 112): (a), out of scope here and a gate finding for a later docs-lane node, the drafter's recommendation taken under item 4 of 2026-10-31, dated 2026-11-14; the advisor has no objection (the ruling's item 6).
- **The operator sitting:** G3, a changed walkthrough row, joins the operator sitting's list as one line (the ruling's item 5 (a)).

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the single reviewer gate at 9fb3aff1: PASS; the closing record (class 1, written after the results were seen)

*Written by the custodian after the gate's report and the checks at the head were seen. References only. Nothing above is edited.*

1. **The gate** (§E): the single reviewer at 9fb3aff1bba72dbf5349a12adf518f34a09e0020, PR #319: PASS, no finding, three observations with no action. The report: `state/consults/gates/2026-11-14-publish-approval-consult-gate-findings-gate-reviewer.md` (sha256 b970dd6263831431f96e21080115b1eba17b4bc68bc78bd06812ccc7d0e92fc1 on main); gate-log row 746. The custodian compared the runs it claims with its transcript: each has a call behind it, and each run's log on disk gives the counts and exits it reports.
2. **The words.** §B's four lines are listed in the PR body, byte-copied by script from §B's fence (the writer's words under AUTONOMY §31(d)). §C's words are the advisor's ruling ADV-2026-11-14-06 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-06-findings-node-open-1-b-the-g3-style-hash-clause-the-judge-sentence-unchanged.md`), as §O records. The head is the gated head: nothing changed after it.
3. **Size.** `git diff --numstat 54ee3522...9fb3aff1`: 5 insertions and 4 deletions in the two files of Scope, 9 changed lines against the budget of 12. No overrun.
4. **Checks at the head 9fb3aff1.** `gh pr checks 319`, read at 2026-11-14T11:58:31Z: all 8 rows pass.
5. **Out of draft.** The PR body was set and read back equal, and in the same chain the PR was marked ready, at 2026-11-14T11:58:53Z.
6. **The time taken** (the PLAN node's 30 minutes, an estimate, not a measurement). The subagent runs by their transcripts, as their filed reports give them: the build worker, 2026-11-14 04:52:16Z to 05:12:08Z (`state/consults/2026-11-14-publish-approval-consult-gate-findings-worker-report.md`); the gate, 10:36:57Z to 11:00:31Z. That is 43 minutes and 26 seconds in all, over the estimate. The architect's draft of the form is not counted.
- **Unchanged:** everything else.
