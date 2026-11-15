*Custodian's filing note (2026-11-05): the architect's triage reading of the two docs audits' Tasks A and B (the notes and corrigenda appended to ADRs, each ADR's Status line against PLAN and the indices; the mentions of a moved path), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): the drift sweeps and the two docs audits triaged as on 2026-10-10, confirmed findings to nodes by the custodian's grading. Its brief by file (sha256 bd5f218f496c47ef283050c103bdaa7af9d89c923bd0182b4ae1e1e273fa3ffe), carrying the human's Part 1 rulings of 2026-11-05 by reference; its inputs the filed audits `state/consults/2026-11-03-cloud-adr-docs-audit-report.md` and `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md` and the filed comparison `state/consults/2026-11-05-platform-and-cloud-adr-docs-audit-comparison.md`; read at main 61a677d7. The run 18:55:47Z to 19:04:43Z by its transcript (claude-opus-5-5; unique calls Read 43, Grep 43, Glob 3 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (20473 bytes, sha256 e43813000a157b72585f7eb3e81e4d20252aa44135f2270e06ddc858e44b4bfe). One change: a path-and-line cite to a form at its path before governance piece F moved it is written as the path and then the word line with the number, so that `verify-cites.mjs` does not gate it as a cite on main; nothing else is changed. A reading, not Authority: the grading and any node are the custodian's; ADR text, Status lines, notes and amendments and KNOWN-LIMITATIONS words are the human's.*

---

**Verdict:** none. This is a triage reading, not a gate, so it has no Correctness, Evidence or Documentation verdict. Reviewed: main @ 61a677d7. The session's git status names that commit as the latest. I have no shell, so I could not confirm HEAD or the brief's sha256. The working tree carries the custodian's staged edits (CUSTODIAN-QUEUE, site, CUT-STATE and two consults); `governance/PLAN.yaml` is not among them. I read the tree as it stands.

Tag: `triage:docs-audit@tasks-a-b`. "C:n" is a line of `state/consults/2026-11-03-cloud-adr-docs-audit-report.md`. "P:n" is a line of the **filed** copy `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md`, which is the comparison's number + 4. Nodes are cited by id, and PLAN text by node id only. Every verdict comes from reading and Grep; I ran nothing else.

One fact neither audit had: `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1161` reads `## Note 2026-10-28 — the product publish runs §13's scan (bundle-redaction-scan-not-in-product-publish)`. It was merged by PR #276; node `adr-017-note-product-redaction-gate` is `status: done`. That supersedes both audits' "pending on a branch" (comparison item 9). It is a new note on main that neither audit read.

## Task A

**A-S1.** C:181 `**A-S1. ADR-026 says ADR-032 is Proposed; ADR-032 is now Accepted.**`
- Decides: `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:146` "the question is ADR-032 (Proposed, decision open)"; `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5` "**Status:** **Accepted** — 2026-09-23".
- CONFIRMED. The stale text is ADR-026's own note (the human's words). Node: `adr-notes-stale-statements-and-indices`.

**A-S2.** C:191 `**A-S2. ADR-017's Corrigendum 1 says ADR-009 is open; ADR-009 is Accepted.**`
- Decides: ADR-017:721 "ADR-009, which stays open and stays a precondition for public code."; `docs/adr/ADR-009-license-and-open-core-boundary.md:3` "**Status:** Accepted — 2026-08-07."; ADR-017:756 "ADR-009 was accepted on 2026-08-07 and settles it."
- CONFIRMED. The same file already corrects it (:756). The stale text is the ADR's own (the human's). Node: `adr-notes-stale-statements-and-indices`.

**A-S3.** C:201 `**A-S3. ADR-026's Status line calls a question open; a later section of ADR-026 records it settled.**`
- Decides: ADR-026:6 "still-open wording question"; ADR-026:110 "## The `pasted` wording, settled (2026-09-03, appended — Accepted)".
- CONFIRMED, and wider than the audit says. Two hand-written indices repeat it:
  - `docs/README.md:27` "the `pasted`-vs-`not-in-catalog` provenance-string wording stays open, queued separately"
  - `docs/02_Architecture.md:91` "**Still open, not settled by this acceptance:**"
- The Status line is the human's. `docs/README.md:64` is generated from it. README:27 and docs/02:91 are not the human's.
- Node: `adr-notes-stale-statements-and-indices` names only the Status line; the two index lines are in no node.

**A-S4.** C:212 `**A-S4. PLAN.yaml records ADR-021's Note 2026-09-29 both as accepted and as accepted later.**`
- Decides:
  - node `entry-79-b1-consult-items`, summary: "At B1's close the human accepts ADR-023's Amendment 2026-09-29 and ADR-021's Note 2026-09-29 together"
  - node `b1-close-nul-column-names`, summary: "the human accepted the ADR-021 Note"
  - `state/directives/2026-09-29-a2-1-and-b-1-sightings.md:7` "HUMAN RULING 2026-09-29: the ADR-021 Note in state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md §2c", and :8 "is accepted as drafted".
- CONFIRMED. Reading settles which statement holds: the Note was accepted on 2026-09-29. The "together at B1's close" wording comes from Fable's relayed item (`state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md:15` "For the human at B1's close (#142 architect note 4): ADR-023's amendment and the ADR-021 Note are"), not from the human's ruling.
- The stale text is `entry-79-b1-consult-items`'s summary (PLAN text, not the human's). Node: `adr-notes-stale-statements-and-indices`.

**A-S5.** C:227 `**A-S5. ADR-021's note relies on ADR-023's Status, whose wording no longer fits ADR-023's contents.**`
- Decides:
  - `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3` "**Status:** Proposed — **decision deliberately undrafted; binds nothing.**"
  - ADR-023:14 "**Record:** Decision text accepted as drafted with two §2 amendments by the human on 2026-09-14"
  - ADR-023:26 "## Decision"
- CONFIRMED for ADR-023's Status line (the human's; Proposed). ADR-021's note is not stale: `docs/adr/ADR-021-row-filter-on-viewport-query.md:233` "does not change ADR-023's Status" is still true.
- Copies: `docs/README.md:61` (generated). Hand-written, not the human's: README:27 "Proposed with its decision **deliberately open**" and docs/02:86 "**ADR-023 (proposed — decision deliberately open)**".
- Node: `adr-notes-stale-statements-and-indices` (the Status line). The index lines are in no node.

**A-S6.** C:241 `**A-S6. PLAN.yaml at 6b67d44 shows ADR-020's corrigendum as in progress, although it had merged.**`
- Decides: node `adr-020-appended-note` reads "status: done" and "evidence: {pr: 271}".
- NOT CONFIRMED on main. It was already resolved at 84a90e2, as C:247 says. The node rightly omits it.

**A-S7.** C:250 `ADR-035's note names the close race as unsettled; its PLAN node is done, and the note that would`
- Decides:
  - `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157` "3. **Not settled here:** the close race that mints such a generation (Decision 3's bullet names it)."
  - `kernel-generation-close-races` "status: done", "evidence: {pr: 136}"
  - `adr-035-close-races-note` "status: blocked", "depends_on: [kernel-generation-close-races, adr-020-appended-note]", "needs_human: {kind: ruling, minutes: 5}"
- PARTLY. The facts hold, and both dependencies are done. But the note's words limit what this note covers and are still true. What is missing is the follow-up note, which `adr-035-close-races-note` already holds. ADR text is the human's.
- Nodes: `adr-035-close-races-note` (the real home) and `adr-notes-stale-statements-and-indices` (a duplicate).

**A-S8.** C:264 `ADR-017 points readers to two indices for its corrigenda; both count three, and the file has`
- Decides:
  - ADR-017:667 "The pointer lives in the mutable indices instead — `docs/README.md` and `docs/02`.*"
  - README:27 "**three corrigenda appended**"; docs/02:80 "**Three corrigenda are appended**"
  - five corrigendum headings at ADR-017:672, :723, :750, :1044, :1144, plus the progress note at :960 and the new note at :1161
- CONFIRMED, and wider: neither index mentions the 2026-10-28 note. The indices are not the human's words.
- Nodes: `docs-02-adr-017-entry-current` (docs/02:80, blocked behind `sitting-wording-n1-to-n7`) and `adr-notes-stale-statements-and-indices` (README half).

**Platform-only items:**

- **README:27 hand-written status paragraph.** P:73 "The hand-written **Conventions paragraph** at `docs/README.md:27` is a second, non-generated status index and is where the disagreements are."
  - ADR-016. P:87 `it sits inside the "Proposed:" run while saying accepted.` README:27 reads "**Proposed: ADR-011**" … "**ADR-016** (stable feature identity admission and source-key mapping — **accepted 2026-09-02, architect-blockable**". CONFIRMED.
  - ADR-023. P:94 `"decision deliberately undrafted" is no longer true of the file`. CONFIRMED (see A-S5).
  - ADR-029. P:100 `the Status line has read "decision drafted 2026-09-14" since PR #66.` README:27 "**ADR-029** (the scan-progress carrier quantity — Proposed, decision deliberately undrafted;" against `docs/adr/ADR-029-scan-progress-carrier-quantity.md:3` "**Status:** Proposed — **decision drafted 2026-09-14 for the human's sight (below); binds nothing until its gate and the human's word.**" CONFIRMED.
  - ADR-033 to ADR-036. P:103-106 `**Absent from `docs/README.md:27`.**` By Grep, ADR-033 to ADR-036 occur in docs/README.md only at :70-73, the generated rows. CONFIRMED.
  - All of this is not the human's text, and no node covers it.
- **The docs/02 status list.** P:109 `` `:86` "ADR-023 (proposed — decision deliberately open)" ``. CONFIRMED at docs/02:86. The same list has more, which neither audit found:
  - docs/02:77 "**ADR-013 (proposed)**", against `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3` "**Status:** Accepted — 2026-08-09" … "Architect-blockable from acceptance."
  - docs/02:94 "**ADR-029 (proposed — decision deliberately undrafted)**"
  - docs/02:91 (see A-S3)
  - By Grep, ADR-018, 030 and 032 to 036 do not occur in docs/02 at all.
  - None of this is the human's text. Node: `docs-02-adr-017-entry-current` covers docs/02:80 only.
- **ADR-009 generated cell.** P:81 `the sentence is the one the ADR's own corrigendum (`:90-106`) says was already false`.
  - docs/README.md:48 carries "**The repository does not become public until the pre-public checklist below lands**".
  - ADR-009:92 "**This is a correction of record, not a change of decision; nothing above is edited.**"
  - The header at docs/README.md:36 reads "an acceptance condition, a corrigendum or a qualification recorded in an adjacent header field is not shown here, so read the ADR before relying on a row."
  - CONFIRMED. The words are ADR-009's Status line (the human's), copied by the generator, and README:27 already carries a dated correction. Node: none.
- **ADR-022 Amendment 2.** P:93 `names an "ADR-022 Amendment 2" being prepared on branch `cut/b2-piece-1c-save-and-reopen` — not on `main``.
  - The ADR-022 file has only `## Amendment 1 — style persistence granted for the session history (2026-10-14, the human)` (:73). Node `b2-piece-1c-save-and-reopen` reads "status: in-progress", "evidence: {branch: cut/b2-piece-1c-save-and-reopen}".
  - CONFIRMED, and it is not a defect. Node: `b2-piece-1c-save-and-reopen`.

**Where the audits differ (comparison, section 2):**
- **Item 1, notes counted (27 against 22).** On main, Grep over headings matching note or corrigend finds 28: the platform's 27 plus ADR-017:1161. By the cloud's exclusions the count is 23. Each count holds by its own definition.
- **Item 2, same-file cites (0 against 6).** Six bare `:N` cites sit inside notes on main: ADR-024:298 `:253-263`; ADR-028:526 `:510` and `:461-462`; :528 `:512`; :530 `:478-479`; :532 `:518`. The cloud's 6 holds. The platform's 0 counts only cites that name a path.
- **Item 3, moved-path mentions in notes (12 against 11).** The platform's own table rows give 11 (rows 2×2, 10, 11, 12, 14, 15, 21, 22×2, 25), and the new note adds none. **11 holds.**
- **Item 8, ADR-020's PLAN node.** On main it is done with PR #271, so both audits agree there.
- **Items 11 and 12, total mentions.** On main, by Grep:
  - `.github`: 34 mentions in 9 files, 2 of them bare names.
  - `README.md`: 1.
  - docs/ outside the ADRs: 17 (README 11, docs/02 2, docs/04 1, docs/14 3).
  - docs/adr: 82 on 72 lines in 21 files.
  - That makes **134 on 119 lines in 35 files**, so the cloud's count holds on main. With `KNOWN-LIMITATIONS.md`'s 69, less the 4 bare names, the platform's 199 also holds.
- **Item 14, failing as written.** This is a difference of definition, not of count, and reading cannot settle it. Every old path is absent from the tree.
- **Item 15, line cites (10 against 12).** Also definitional: the 2 extra are the bare ADMISSION names at ADR-029:85 and :113.
- **Item 16, the pinned cite.** It holds on main: `KNOWN-LIMITATIONS.md:294` "OWNER-INVALIDATION-PREREGISTRATION.md:954 @ 607d8d166f2667b1b3e9bb9e501b57b4938328b9".
- **A miscount in the platform audit.** P:115 says ", 24 in YAML comments, 3 in CI step names". Its own table rows 1 to 32 give 29 comments (mine). Under the cloud's definition, main has 31 comments and 3 step names (pages.yml:62, governance-ci.yml:163 and :173). Those three are the only non-comment lines carrying an old path; they are confirmed by Grep.

## Task B

**`moved-path-mentions-outside-accepted-adrs`.** Its summary reads "134 mentions on 119 lines in 35 files name a path governance/MOVED.tsv maps to a new one, 133 failing as written; none is a link or pinned, and every workflow mention is a YAML comment or a step name, which no workflow reads."
- **The counts hold for the cloud's scope, not for the node's own.** The 134 includes 82 mentions inside ADR files. Within the node's title scope there are 52 mentions on 47 lines in 14 files, and 51 of them fail as written. `README.md:53` resolves: it reads "- `governance/` — how the work is run: the plan (`PLAN.yaml`)".
- **No links or pins: holds on main.** Grep finds no Markdown or HTML link whose target names any moved file, old or new, under docs/, README.md, CONTRIBUTING.md, QUICKSTART.md, KNOWN-LIMITATIONS.md or `.github/`. In the node's scope there are no line cites and no pins.
- **Workflow mentions: holds.** All 34 are comments (31) or step names (3).
- **Correction 1: 11 of the docs mentions cannot be edited by hand.** The node also says "the mutable docs and the workflow comments can name the new paths". But the 11 mentions in docs/README.md (:54, :60, :64×2, :65, :69, :70, :71×2, :72×2) are generated index rows ("do not edit by hand", :36). They copy accepted ADRs' Status lines, so they change only with those lines. What a docs edit can reach is 6 mentions: docs/02:83 and :88, docs/04:31, and docs/14:5, :19 and :23.
- **Correction 2: the Proposed ADRs fall outside both groups.** ADR-023 has 3 mentions (:15, :142, :165), ADR-024 has 1 (:193) and ADR-029 has 6 (:8, :20, :81, :85, :97, :113). They are in neither the node's title list nor its "accepted ADRs keep theirs". Their text is the human's.
- **ADR-029's four line cites point at other text.**
  - ADR-029:81 cites `engine/ADMISSION-PREREGISTRATION.md` line 248 for "the same reason the source-descriptor post-check is kept off the batch loop". Today `governance/forms/engine/ADMISSION-PREREGISTRATION.md:248` reads "`1.10505.0` (reporting DuckDB `v1.5.5`) accepts `file_row_number = true` on the `read_parquet`".
  - ADR-029:97 cites :252 for "§13 E closes 0.3 at Brief A's merge"; :252 reads "the identity mechanism is unchanged from §2d's."
  - ADR-029:113 cites :254 for "the §13 F conditional-escalation precedent"; :254 reads "2. **R-I3's reach, narrowed in implementation and recorded here.**"
  - The text at the citing commit 09cfc72d needs `git show`, which I cannot run, so I can confirm only that the current tree's lines do not say what the ADR attributes to them.

**`KNOWN-LIMITATIONS.md`.**
- On main there are 69 mentions: **67 in HTML comments**, every one on a line that is a whole `<!-- … -->` comment (Grep cross-check), and **2 a reader sees**:
  - :6 "recorded verbatim in `RELEASE-0.1.md` Amendments 15–18)"
  - :219 "declared for metres only (PLAN.yaml node `crs-zoom-constants-per-unit`)"
- The three line cites sit in comments. :246 (`:72-73`, R-D1/R-D2) and :278 (`:59-60`, R-S1/R-S2) land on the named rules in `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. :294 is pinned.
- **No open node holds these mentions.** The move form left them: `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md:581` "(A) Leave them all; they resolve through MOVED.tsv."
- The platform's account of that decision is only partly right. P:117 says the form "records the decision to leave records, workflow comments and `KNOWN-LIMITATIONS.md`/`docs/README.md` mentions as "named but not read; not edited … resolve through the map"". The form's :339-343 list does not name either file. Its :600 "**OPEN-7: (A) widened, plus (C), the human's.**" edited "(`CONTRIBUTING.md`, `docs/README.md` and `docs/PREREGISTRATION-TEMPLATE.md`), path only". That is why README:27 now reads `governance/DECISIONS-PENDING.md`.

**QUICKSTART.md and CONTRIBUTING.md.** P:115 "`QUICKSTART.md`, `CONTRIBUTING.md` and `.github/ISSUE_TEMPLATE/` carry none". CONFIRMED by Grep: no old path. CONTRIBUTING.md:56 and :118 name the new `governance/` paths.

**The rotation flag.** P:117 `Mentions of `DECISIONS-PENDING.md` by entry number fail twice over: the file moved *and* rotates, so pre-2026-10-20 entries are in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`` … (the elision drops a parenthetical cite only).
- The text "the ledger also rotates" appears on 56 lines of the audit.
- It holds. In my paraphrase: the live ledger's opening sentence sends line references written before the rotation to that archive. By Grep, the RULED blocks the mentions name (for example question round 17 of 2026-09-24, round 22 of 2026-09-25, 2026-09-14, and 2026-10-05) and entries 54, 55 and 77 occur in the archive and not in the live ledger.
- Two flagged rows already name the archive themselves: `.github/workflows/governance-ci.yml:37` "the ruling set (DECISIONS-PENDING.md and each tracked archive)", and ADR-020:690-691.

## Proposal (grading is the custodian's)

1. **Hand-written indices (not the human's words).**
   - Paths: `docs/README.md:27`; `docs/02_Architecture.md`'s ADR list.
   - Findings: A-S8; the index halves of A-S3 and A-S5; ADR-016 in the "Proposed:" run; ADR-029's wording; ADR-013 at docs/02:77; the missing ADRs; the 2026-10-28 note.
   - Overlaps: `adr-notes-stale-statements-and-indices` and `docs-02-adr-017-entry-current`. The precedent is `adr-032-staleness-docs` (done).
   - Misleads: docs/02:77 can lead a reader into a wrong action, because ADR-013 is architect-blockable. README:27 and docs/02:91 (the settled wording called open) are the same, mildly. The rest is stale only.
2. **ADR words (the human's).**
   - Findings: A-S1, A-S2, A-S3's Status line, A-S5 (ADR-023:3, a Proposed ADR), and the ADR-009 Status line behind README:48.
   - Each closes only by an appended dated note in the human's typed words, or, for ADR-023, at the Status change at B1's close.
   - Node: `adr-notes-stale-statements-and-indices`. All stale only; each file but ADR-026's note (A-S1) carries correcting text.
3. **PLAN text.**
   - Finding: A-S4, the `entry-79-b1-consult-items` summary.
   - Misleads into wrong action: it would put an acceptance already given back to the human.
4. **A-S7** belongs to `adr-035-close-races-note`. Its duplicate in `adr-notes-stale-statements-and-indices` can go (my suggestion).
5. **Moved paths.**
   - (a) `.github/workflows/*.yml`, 9 files, 34 mentions.
   - (b) docs/02, 04 and 14, 6 mentions.
   - (c) the 11 generated rows, which no edit reaches.
   - (d) the Proposed ADRs, 10 mentions; ADR-029's 4 line cites mislead and sit in no node.
   - (e) `KNOWN-LIMITATIONS.md`, 69 mentions, left by OPEN-7 (A).
   - All are stale only except (d)'s line cites.
   - Overlaps: `moved-path-mentions-outside-accepted-adrs`, plus `module-readme-moved-form-paths` (kernel/ and engine/ READMEs; disjoint paths, same class).
6. **The docs/02 path clash.** Groups 1 and 5(b) and `docs-02-adr-017-entry-current` all touch `docs/02_Architecture.md`. Under rule (00) they either become one piece or are chained.

**I could not decide by reading:** HEAD and the brief's hash, since I have no shell; and the text at the citing commits behind any line cite, which needs `git show`.

**Files read:** the brief (scratchpad `brief-tri-dab.md`); `state/consults/2026-11-05-platform-and-cloud-adr-docs-audit-comparison.md`; `state/consults/2026-11-03-cloud-adr-docs-audit-report.md`; `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md` (lines 1-222, plus Grep); `state/consults/2026-11-05-drift-sweep-areas-c-d-triage-architect.md` (1-40); `governance/PLAN.yaml` (the nodes named above); `governance/MOVED.tsv`; `governance/README.md` (20-35); `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` (333-346, plus Grep); `governance/forms/engine/ADMISSION-PREREGISTRATION.md` (58-73, 246-255); `governance/DECISIONS-PENDING.md` (1-6, plus Grep); `state/cut-archive/DECISIONS-PENDING-2026-10-20.md` (Grep); `state/directives/2026-09-29-a2-1-and-b-1-sightings.md` (1-12); `state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md`; `docs/README.md`; `docs/02_Architecture.md` (58-95); `docs/adr/` ADR-009, 017, 020, 021, 023, 026, 029 and 035 (the spans cited above), plus Grep over all ADRs; `KNOWN-LIMITATIONS.md` (1-33, 215-224, plus Grep); `README.md`, `CONTRIBUTING.md`, `QUICKSTART.md`, docs/04 and docs/14 (Grep); `.github/` (Grep).
