# ADR notes and docs paths audit (cloud session 6)

A read-only audit. It records what the files say and what their history shows, and decides nothing.
Every claim is cited as `path:line @ commit`.

- **Base.** `6b67d44` (6b67d44bc242dc1cbc9f73efdbd7cd20e4ecd1f4), the clone's HEAD and `origin/main`
  when the session started. During the session `origin/main` moved one commit, to `84a90e2`
  (84a90e2648d4ab8d7b9c60fdd0a0e8c2ba10bd38). That commit changes only `governance/PLAN.yaml`,
  `governance/CUSTODIAN-QUEUE.json`, `governance/CUSTODIAN-QUEUE.md`, `site/data/plan.json`,
  `site/index.html`, `state/CUT-STATE.md` and `state/FILLER-QUEUE.md`
  (`git diff --stat 6b67d44 84a90e2`). Where it changes a finding, the finding says so (A-S6).
- **Move commit.** `a8ae51d9`, the one commit named in all 188 data rows of
  `governance/MOVED.tsv:2-189 @ 6b67d44`.
- **History.** The clone was unshallowed (4362 commits on `main`), so every `git log` below reads the
  whole history.

## Scope and method

**Task A scope.** Task A covers every heading under `docs/adr/` whose text contains "note" or
"corrigend" (any case). That gives 22 sections in 9 ADRs (ADR-009, 017, 020, 021, 024, 026, 028, 030
and 035). Two headings are read as part of a section rather than as sections of their own: ADR-009's
"Addendum to the corrigendum" (`docs/adr/ADR-009-license-and-open-core-boundary.md:107 @ 6b67d44`)
with its corrigendum, and ADR-017's container heading "Corrigenda"
(`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:658 @ 6b67d44`) with Corrigenda 1 to 3.

Three things are left out:
- **ADR-002's "Priority note"** (`docs/adr/ADR-002-editing-topology-print-scope.md:20 @ 6b67d44`). It
  was not appended: the file has one commit, `aeb90955`, and the note is part of the text as first
  committed.
- **Headings that are not titled Note or Corrigendum.** These are the Amendments, Clarifications and
  Acceptance sections, and ADR-028's "Correction"
  (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:361 @ 6b67d44`).
- **The two `PROPOSED-amendment-*` files.**

**Task A method.**
1. *Cites.* Each section was scanned with a regex for `path:line`, `path:line-line` and `#Lnn`, with or
   without a trailing `@ commit`, and then read by hand for same-file cites written as `:N`. As a
   cross-check, `node scripts/plan/verify-cites.mjs --files 'docs/**/*.md'` at 6b67d44 passes. Its
   three advisory lines are all in ADR-020's Amendment 1
   (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:190-193 @ 6b67d44`), which
   is not a note.
2. *Status.* Each note's words about a Status were compared with three things:
   - that ADR's Status line;
   - the generated index (`docs/README.md:40-73 @ 6b67d44`). `node frontends/shell/scripts/adrIndex.mjs
     --check` at 6b67d44 prints `PASS -- 34 ADRs, index in docs/README.md matches every Status line`;
   - `governance/PLAN.yaml`.

   `PLAN.yaml` has no table of ADR statuses. Its header says only that it was seeded from the Status
   lines (`governance/PLAN.yaml:7 @ 6b67d44`). So the comparison is with the PLAN nodes that carry a
   note, or that say something about a note's or an ADR's status.
3. *History.* For each note, `git log -S "<heading>"` finds the non-merge commit that wrote it, and a
   first-parent walk of `main` finds the commit that brought it onto `main`. Then every later commit
   that touches the file is read twice, once along the first-parent history and once as non-merge
   commits. Each `git diff -U0 <parent> <commit>` hunk is compared with the line where the note's
   heading sits in the parent. A hunk that starts above that line counts as an edit above the note.

**Task B scope.** Task B covers every tracked file under `docs/` (57 files), plus `README.md`,
`CONTRIBUTING.md`, and every tracked file under `.github/` (15 files).

A *mention* is a path token that equals an `old` value in `governance/MOVED.tsv`, read either from the
repository root or from the citing file's folder. A bare file name that equals a moved file's name
also counts.

- At 6b67d44 every old path is absent, and each moved file's name is held by exactly one tracked file.
- A second pass grepped every moved file's name over the same files. It found no occurrence that the
  first pass had missed: every other occurrence is part of the file's new path.
- Names written without a file extension are not paths and are not listed. At 6b67d44 they number 32
  `DECISIONS-PENDING`, 11 `RELEASE-0.1` and 16 `PLAN` (the last count includes "PLAN node").

## Summary

**Task A (22 notes and corrigenda).**

1. **Cites.** No note or corrigendum carries a `path:line` cite to another file. Six cites point at
   lines of their own ADR: one in ADR-024 and five in ADR-028. All six resolve, and each cited line is
   byte-identical at the appending commit and at 6b67d44 (A-C1, A-C2). The notes also make 11
   mentions, none with a line number, of 7 paths that `MOVED.tsv` moved. They are listed in Task B
   (rows B50, B51, B61, B80, B83, B84, B85, B98, B99, B100 and B122).
2. **Status.** Every note's own ADR has a Status line that agrees with `docs/README.md`. Eight places
   disagree with a current Status line, the index or `PLAN.yaml` (A-S1 to A-S8):
   - A-S1, A-S2 and A-S7: a note states another ADR's status, or the state of a piece of work, as it
     stood when the note was written, and that has changed since.
   - A-S3 and A-S5: a Status line's words disagree with its own ADR's later contents. In A-S3 that is
     ADR-026's, about its own note. In A-S5 it is ADR-023's, on which ADR-021's note relies.
   - A-S4 and A-S6: PLAN.yaml's record of a note disagrees with itself (A-S4) or with the tree (A-S6).
   - A-S8: the two indices ADR-017 points readers to count three of its five corrigenda.
3. **History.** In 17 of the 22 notes, no commit after the note edited a line above it. The other five
   are listed in A-H1 to A-H3:
   - ADR-017 Corrigenda 1 and 2. The text above was edited the same day the corrigenda were written,
     and the net change to the accepted body is the one blank line the preface states.
   - ADR-026's two notes of 2026-08-18. The Status line above them was rewritten at acceptance.
   - All three ADR-026 notes. A whole-file CRLF rewrite and its revert, which net to zero bytes.

**Task B (moved paths).**

- **Count.** 134 mentions on 119 lines in 35 files. Of these, 99 are under `docs/` (the ADRs, `docs/README.md`,
  and `docs/02`, `docs/04` and `docs/14`), 34 under `.github/` and 1 in `README.md`. `CONTRIBUTING.md` has none: it names the new paths
  (`CONTRIBUTING.md:56 @ 6b67d44`, `CONTRIBUTING.md:118 @ 6b67d44`).
- **Form.** None is a Markdown link and none is pinned to a revision. Every `.github/` mention is in a
  YAML comment or a step `name:`, so no workflow reads any of these paths.
- **Following them.** 133 fail as written: no file exists at the named path at 6b67d44, and
  `MOVED.tsv` maps each one to a file that exists. One resolves: `README.md:53 @ 6b67d44` names
  `PLAN.yaml` inside the `governance/` bullet.
- **Line cites.** 12 mentions carry a line. Followed to the moved file (through `MOVED.tsv`, or by file
  name for the 2 written as a bare name), 3 land on the same text, 1 on the same text apart from line
  endings, and 8 on different text.
- **Written after the move.** None of the 12 line cites sits on a line written after the move
  commit, so by the rule in `governance/README.md:32 @ 6b67d44` none of them fails `verify-cites`.
  That is consistent with its PASS above.

## Task A — the notes, one row each

"Appended by" gives the non-merge commit that wrote the note, then the commit that brought it onto
`main` along the first-parent history. "Status" compares what the note says with the ADR's Status line
and its index row. "Above it" reports the history check.

| # | Note (heading @ 6b67d44) | Appended by | path:line cites | Status | Above it |
|---|---|---|---|---|---|
| A1 | `docs/adr/ADR-009-license-and-open-core-boundary.md:90 @ 6b67d44`, with its addendum at `:107` | `914ef9f6` (2026-09-07); addendum `aa5439b6` (2026-09-07); both directly on `main` | none | The note quotes the Status paragraph "verbatim" (`docs/adr/ADR-009-license-and-open-core-boundary.md:92-94 @ 6b67d44`). The words match `docs/adr/ADR-009-license-and-open-core-boundary.md:4-6 @ 6b67d44` without its `**` markup. Index row `docs/README.md:48 @ 6b67d44` carries the same Status. No PLAN node: the note predates PLAN.yaml (seeded 2026-09-13, `governance/PLAN.yaml:3 @ 6b67d44`) | No hunk above. `aa5439b6` inserted only at old line 105, inside the corrigendum |
| A2 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:672 @ 6b67d44` (Corrigendum 1) | `d782068b` (2026-08-06), directly on `main` | none | Says the Status block's acceptance condition is untouched. Names ADR-009 as one "which stays open" (A-S2) | Edited the same day (A-H1) |
| A3 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:723 @ 6b67d44` (Corrigendum 2) | `d782068b` (2026-08-06), directly on `main` | none | Corrects the Status block's "§15/§18". The Status line still reads that way; the preface says it is left unaltered (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:660-662 @ 6b67d44`) | Edited the same day (A-H1) |
| A4 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:750 @ 6b67d44` (Corrigendum 3) | `fcb193ca` (2026-08-07), directly on `main` | none | Says "ADR-009 was accepted on 2026-08-07" (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:756 @ 6b67d44`), which matches `docs/README.md:48 @ 6b67d44`. Says ADR-017's Status confines `publish-bundle` to developer and test tooling (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:832 @ 6b67d44`), which matches the Status block (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3-7 @ 6b67d44`) | No hunk above |
| A5 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:960 @ 6b67d44` (Progress note) | `3ffbef38` (2026-08-07), directly on `main` | none | "This ADR is Accepted and immutable" (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:962 @ 6b67d44`), which matches `docs/README.md:55 @ 6b67d44` | No hunk above |
| A6 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044 @ 6b67d44` (Corrigendum 4) | `94df0f15` (2026-08-07), directly on `main` | none | "The Status block stands as accepted" (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1046 @ 6b67d44`), which matches `docs/README.md:55 @ 6b67d44` | No hunk above |
| A7 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1144 @ 6b67d44` (Corrigendum of 2026-09-07) | `9527e426` (2026-09-07), directly on `main` | none | Names no Status. Its "verbatim" quote is found at `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:833 @ 6b67d44`. "ADR-009 carries the same dated corrigendum" is true: see A1 | No hunk above |
| A8 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:680 @ 6b67d44` | `5ff86b13` (2026-11-01); on `main` via `daa4b8ff` (PR #271, 2026-11-03) | none | "A dated corrigendum, as the Status line provides" (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:682 @ 6b67d44`), which matches `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:5 @ 6b67d44` and `docs/README.md:58 @ 6b67d44`. Its PLAN node at 6b67d44 does not match the tree (A-S6) | No hunk above, and no later commit touches the file. The note says "Nothing above this heading is changed" (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:685 @ 6b67d44`) |
| A9 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:229 @ 6b67d44` (Note 2026-09-24) | `c1ea75c9` (2026-09-24); on `main` via `93140e98` (PR #113) | none | "the Status line included" unchanged (`docs/adr/ADR-021-row-filter-on-viewport-query.md:231 @ 6b67d44`), which matches `docs/README.md:59 @ 6b67d44`. Names ADR-023's Status (A-S5). PLAN node `adr-021-023-b1-notes` is done with `{pr: 113}` (`governance/PLAN.yaml:657 @ 6b67d44`, `governance/PLAN.yaml:662 @ 6b67d44`). Its item 3 waits on `b1-engine-kernel-half`, which is done (`governance/PLAN.yaml:639 @ 6b67d44`) | No hunk above |
| A10 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:237 @ 6b67d44` (Note 2026-09-29) | `f15b8697` (2026-09-29); on `main` via `d37fd760` (the merge of #142) | none | "the Status line included" unchanged (`docs/adr/ADR-021-row-filter-on-viewport-query.md:239 @ 6b67d44`). PLAN.yaml gives this note two acceptance states (A-S4). It names `b1-close-nul-column-names`, which is done (`governance/PLAN.yaml:3340 @ 6b67d44`) | No hunk above |
| A11 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:244 @ 6b67d44` (Note 2026-09-30) | `7c6f9019` (2026-09-30); on `main` via `c9438211` (PR #144) | none | "the Status line and the earlier Notes included" unchanged (`docs/adr/ADR-021-row-filter-on-viewport-query.md:246 @ 6b67d44`). Its implementation node `filter-bind-admission-implicit-coercions` is done (`governance/PLAN.yaml:3322 @ 6b67d44`) | No hunk above |
| A12 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:269 @ 6b67d44` (Note 2026-10-03) | `1445eaf3` (2026-10-04), directly on `main` | none | Unchanged, as for A11 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:271 @ 6b67d44`). Its implementation node `type-walk-null-literal-arithmetic` is done (`governance/PLAN.yaml:3570 @ 6b67d44`) | No hunk above, and no later commit touches the file |
| A13 | `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:296 @ 6b67d44` (Appended note, 2026-09-09) | `dc8f3a4a` (2026-09-09), directly on `main` | `:253-263` "at this appending", into this ADR (A-C1) | Names no Status. Says `docs/README.md`'s ADR-024 line "repeats no gap". At 6b67d44, row `docs/README.md:62 @ 6b67d44` contains none of "uncancellable", "unreported" or "pin phase". No PLAN node: the note predates PLAN.yaml | No hunk above |
| A14 | `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:300 @ 6b67d44` (Appended note, 2026-10-20) | `d5aafacc` (2026-10-21); on `main` via `3e8c848b` (PR #236) | none | "it stays Proposed" (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:302 @ 6b67d44`), which matches `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:3 @ 6b67d44` and `docs/README.md:62 @ 6b67d44`. PLAN node `publish-approval-ttl-ten-minutes` is done with `{pr: 236}` (`governance/PLAN.yaml:5985 @ 6b67d44`, `governance/PLAN.yaml:5990 @ 6b67d44`) | No hunk above, and no later commit touches the file |
| A15 | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:67 @ 6b67d44` (Implementation note, P2) | `6b80e952` (2026-08-18), directly on `main` | none | "does not change the Decision above" (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:70 @ 6b67d44`). Appended while the ADR was Proposed (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:3 @ 6b80e952`) | Status line rewritten after it; CRLF round trip (A-H2, A-H3) |
| A16 | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:91 @ 6b67d44` (Architect note for acceptance) | `16091f99` (2026-08-18), directly on `main` | none | The Status line above names this note's question as still open (A-S3) | Status line rewritten after it; CRLF round trip (A-H2, A-H3) |
| A17 | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:131 @ 6b67d44` (Implementation note, 2026-09-08) | `f21c2ee2` (2026-09-08), directly on `main` | none | "nothing in the Decision changes" (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:133-134 @ 6b67d44`). Names ADR-032 as Proposed (A-S1) | CRLF round trip only, net zero (A-H3) |
| A18 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:506 @ 6b67d44` (Appended note, 2026-09-09) | `2f4bc815` (2026-09-09); on `main` via `e331bf8b` (PR #38) | none | Names no Status. No PLAN node: the note predates PLAN.yaml | No hunk above |
| A19 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:520 @ 6b67d44` (Appended note, 2026-09-13) | `fe216df6` (2026-09-13); on `main` via `26876039` (PR #45) | `:510`, `:512`, `:461-462`, `:478-479`, `:518`, into this ADR (A-C2) | "ADR-028 is accepted and immutable" (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:522 @ 6b67d44`), which matches `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:3 @ 6b67d44` and `docs/README.md:66 @ 6b67d44`. PLAN node `land-45` is done with `{pr: 45}` (`governance/PLAN.yaml:311 @ 6b67d44`, `governance/PLAN.yaml:316 @ 6b67d44`) | No hunk above. The one later commit, `b0032c80`, appended Amendment 4 below it |
| A20 | `docs/adr/ADR-030-conveyed-artifact-notice-set.md:66 @ 6b67d44` (Appended note, 2026-09-09) | `4401ce96` (2026-09-09); on `main` via `9c2594d7` (PR #37) | none | "Candidate (a) is accepted as the rule" (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:68 @ 6b67d44`), which matches `docs/adr/ADR-030-conveyed-artifact-notice-set.md:3 @ 6b67d44` and `docs/README.md:68 @ 6b67d44`. The appending commit itself rewrote the Status line from Proposed to Accepted (`docs/adr/ADR-030-conveyed-artifact-notice-set.md:3-8 @ 3a342b1c` (its parent), `docs/adr/ADR-030-conveyed-artifact-notice-set.md:3 @ 4401ce96`) | No hunk above after the appending commit |
| A21 | `docs/adr/ADR-030-conveyed-artifact-notice-set.md:86 @ 6b67d44` (Appended note, 2026-10-09) | `587a9411` (2026-10-11); on `main` via `c95d27b8` (PR #208) | none | Names no Status. PLAN node `ported-code-notice-route` is done with `{pr: 208}` (`governance/PLAN.yaml:5137 @ 6b67d44`, `governance/PLAN.yaml:5143 @ 6b67d44`) | No hunk above, and no later commit touches the file |
| A22 | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149 @ 6b67d44` (Note 2026-09-25) | `ad08c1c4` (2026-09-25); on `main` via `f1d726de` (the merge of #122) | none | "the Status line and the Acceptance section included" unchanged (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:151 @ 6b67d44`), which matches `docs/README.md:72 @ 6b67d44`. PLAN node `adr-035-decision-4-note` is done with `{pr: 122}` (`governance/PLAN.yaml:2357 @ 6b67d44`, `governance/PLAN.yaml:2362 @ 6b67d44`). Its item 3 names a node that has since closed (A-S7) | No hunk above |

### Cites (A-C)

**A-C1.** ADR-024's note cites `:253-263` "at this appending"
(`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:298 @ 6b67d44`).
- At the appending commit, `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:253-263 @ dc8f3a4a`
  is the Consequences bullet on `ensure_pinned`'s pin phase.
- It contains the two quoted fragments, "uncancellable and unreported" (`:253`) and "Not built or
  closed by this ADR" (`:261`). The note's "no cancel affordance and no progress report of its own"
  spans `:255-256`.
- The same 11 lines are byte-identical at 6b67d44
  (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:253-263 @ 6b67d44`).

**A-C2.** ADR-028's note of 2026-09-13 cites five lines of its own file. Each line below is
byte-identical at the appending commit `fe216df6` and at 6b67d44.

| Cite | What the line holds |
|---|---|
| `:510` | "Path (i)". The line is the 2026-09-09 note's "Consequence, in two paths" paragraph, which labels both "(i)" (the eviction-protected set) and "(ii)" (the supersede keep-set) (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:510 @ 6b67d44`). |
| `:512` | "Path (ii)". The line is the 2026-09-09 note's paragraph headed "The second deviation", about the `fits`/over-budget latch (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:512 @ 6b67d44`). The closing note's "Path (ii)" paragraph is about the same latch (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:528 @ 6b67d44`), and its "Path (i)" paragraph covers the keep-set (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:526 @ 6b67d44`). So the cited line resolves, but the 2026-09-09 note's own "(ii)" label is on `:510`, not `:512`. |
| `:461-462` | Amendment 3's rule, quoted by the note word for word (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:461-462 @ 6b67d44`). |
| `:478-479` | "Tile keys never cross a module or protocol boundary" (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:478-479 @ 6b67d44`). |
| `:518` | The 2026-09-09 note's "Reopen" paragraph (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:518 @ 6b67d44`). |

**Commit names the notes give.** All of them exist in this repository:
- ADR-009's `73e9935`, `65dde47` and `de6ad08`
  (`docs/adr/ADR-009-license-and-open-core-boundary.md:110-114 @ 6b67d44`). Their author times, read
  in UTC, are 2026-08-03T12:31Z, 2026-08-07T08:18Z and 2026-08-06T23:45Z, as the addendum states;
- ADR-024's `79a9a3b` (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:298 @ 6b67d44`);
- ADR-026's `ba68256` (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:136 @ 6b67d44`).

ADR-030's `d8cdaa33fda8…` is named as an upstream DuckDB commit
(`docs/adr/ADR-030-conveyed-artifact-notice-set.md:74 @ 6b67d44`) and is not in this repository.

### Status (A-S)

**A-S1. ADR-026 says ADR-032 is Proposed; ADR-032 is now Accepted.**
- *The note.* ADR-026's note of 2026-09-08 says "the question is ADR-032 (Proposed, decision open)"
  (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:146 @ 6b67d44`).
- *The current record.* ADR-032's Status line reads "Accepted — 2026-09-23"
  (`docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 6b67d44`), and so does
  its index row (`docs/README.md:69 @ 6b67d44`). PLAN node `accept-adr-032` is done with `{pr: 103}`
  (`governance/PLAN.yaml:1173 @ 6b67d44`, `governance/PLAN.yaml:1178 @ 6b67d44`).
- *When it was written.* At the note's commit, ADR-032's Status line read "Proposed — filed 2026-09-08"
  (`docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:3 @ f21c2ee2`).

**A-S2. ADR-017's Corrigendum 1 says ADR-009 is open; ADR-009 is Accepted.**
- *The note.* Corrigendum 1 calls ADR-009 one "which stays open and stays a precondition for public
  code" (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:721 @ 6b67d44`).
- *The current record.* ADR-009's Status line reads "Accepted — 2026-08-07"
  (`docs/adr/ADR-009-license-and-open-core-boundary.md:3 @ 6b67d44`), and so does its index row
  (`docs/README.md:48 @ 6b67d44`). Corrigendum 3 in the same file records that acceptance
  (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:756 @ 6b67d44`).
- *When it was written.* Corrigendum 1's commit `d782068b` (2026-08-06T18:08Z) predates ADR-009's
  acceptance commit `de6ad08` (2026-08-06T23:45Z).

**A-S3. ADR-026's Status line calls a question open; a later section of ADR-026 records it settled.**
- *The Status line.* It says the "Architect note for acceptance" section "flags its own separate,
  still-open wording question … that stays queued"
  (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:3-8 @ 6b67d44`). Index row
  `docs/README.md:64 @ 6b67d44` copies that line.
- *The later section.* Below the note, "The `pasted` wording, settled (2026-09-03, appended — Accepted)"
  records the question as ruled
  (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:110 @ 6b67d44`).
- *Order.* The Status line was written at acceptance by `077bda17` (2026-09-02). The settled section
  was added by PR #21 (`35addad5`, 2026-09-04).

**A-S4. PLAN.yaml records ADR-021's Note 2026-09-29 both as accepted and as accepted later.**
- *Accepted later.* Node `entry-79-b1-consult-items` (status `blocked`, `governance/PLAN.yaml:1228 @ 6b67d44`)
  says: "At B1's close the human accepts ADR-023's Amendment 2026-09-29 and ADR-021's Note 2026-09-29
  together" (`governance/PLAN.yaml:1238 @ 6b67d44`).
- *Already accepted.* Node `b1-close-nul-column-names` (status `done`, `governance/PLAN.yaml:3340 @ 6b67d44`)
  says "the human accepted the ADR-021 Note" at the 2026-09-29 sighting
  (`governance/PLAN.yaml:3350 @ 6b67d44`).
- *The note itself.* It has no Proposed marker
  (`docs/adr/ADR-021-row-filter-on-viewport-query.md:237-243 @ 6b67d44`) and sits under the Accepted
  Status line (`docs/adr/ADR-021-row-filter-on-viewport-query.md:3 @ 6b67d44`, `docs/README.md:59 @ 6b67d44`).
- *The amendment it relies on.* The note cites ADR-023's Amendment 2026-09-29, item 2
  (`docs/adr/ADR-021-row-filter-on-viewport-query.md:241 @ 6b67d44`). That amendment's heading says
  "(Proposed; for the human's acceptance with B1's close)"
  (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:163 @ 6b67d44`).

**A-S5. ADR-021's note relies on ADR-023's Status, whose wording no longer fits ADR-023's contents.**
- *The note.* ADR-021's Note 2026-09-24 says its reference to ADR-023 §2 "does not change ADR-023's
  Status" (`docs/adr/ADR-021-row-filter-on-viewport-query.md:233 @ 6b67d44`).
- *ADR-023's Status line.* It reads "Proposed — decision deliberately undrafted; binds nothing"
  (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 6b67d44`), and so does its index row
  (`docs/README.md:61 @ 6b67d44`).
- *ADR-023's contents.* ADR-023 has a Decision section
  (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:26 @ 6b67d44`). PLAN node
  `adr-023-decision-text` is done with `{pr: 61}` (`governance/PLAN.yaml:581 @ 6b67d44`,
  `governance/PLAN.yaml:586 @ 6b67d44`), and its summary says "Status Proposed until B1 close"
  (`governance/PLAN.yaml:591 @ 6b67d44`).
- *Where they agree and differ.* All three agree on "Proposed". The words "decision deliberately
  undrafted" do not describe a file that has a Decision section.

**A-S6. PLAN.yaml at 6b67d44 shows ADR-020's corrigendum as in progress, although it had merged.**
- *At 6b67d44.* Node `adr-020-appended-note` reads `status: in-progress` with
  `evidence: {branch: cut/adr-020-appended-note}` (`governance/PLAN.yaml:5951 @ 6b67d44`,
  `governance/PLAN.yaml:5956 @ 6b67d44`).
- *In the tree.* The corrigendum is in the tree at 6b67d44 (A8), merged by `daa4b8ff`, which is an
  ancestor of 6b67d44 (`git merge-base --is-ancestor daa4b8ff 6b67d44`).
- *At 84a90e2.* The same node reads `status: done` with `evidence: {pr: 271}`
  (`governance/PLAN.yaml:5951 @ 84a90e2`, `governance/PLAN.yaml:5956 @ 84a90e2`).

**A-S7. ADR-035's note names the close race as unsettled; its PLAN node is done, and the note that would
record that is blocked.**
- *The note.* Item 3 of ADR-035's Note 2026-09-25 says the close race is "Not settled here", placed at
  PLAN node `kernel-generation-close-races`
  (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157 @ 6b67d44`).
- *The race's node.* `kernel-generation-close-races` is done with `{pr: 136}`
  (`governance/PLAN.yaml:2339 @ 6b67d44`, `governance/PLAN.yaml:2344 @ 6b67d44`).
- *The follow-up note's node.* `adr-035-close-races-note` is `blocked`
  (`governance/PLAN.yaml:3250 @ 6b67d44`). Its summary says that after that piece merges, three ADR-035
  passages describe removed code (`governance/PLAN.yaml:3260 @ 6b67d44`).
- *The ADR's status.* ADR-035's Status line is unchanged, as the note states
  (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 6b67d44`,
  `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:151 @ 6b67d44`).

**A-S8. ADR-017 points readers to two indices for its corrigenda; both count three, and the file has
five.**
- *The pointer.* The Corrigenda preface says "The pointer lives in the mutable indices instead —
  `docs/README.md` and `docs/02`" (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:667 @ 6b67d44`).
- *The indices.* Both say three corrigenda are appended (`docs/README.md:27 @ 6b67d44`,
  `docs/02_Architecture.md:80 @ 6b67d44`).
- *The file.* ADR-017 carries five corrigendum headings:
  `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:672 @ 6b67d44`,
  `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:723 @ 6b67d44`,
  `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:750 @ 6b67d44`,
  `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044 @ 6b67d44` and
  `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1144 @ 6b67d44`. It also carries a
  progress note (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:960 @ 6b67d44`).
- *Where the indices are silent.* Neither of those two index lines mentions Corrigendum 4 or the
  corrigendum of 2026-09-07.
- *Pending.* PLAN.yaml also holds an ADR-017 note that is not yet on `main`: node
  `adr-017-note-product-redaction-gate` is `in-progress` on a branch (`governance/PLAN.yaml:6053 @ 6b67d44`,
  `governance/PLAN.yaml:6058 @ 6b67d44`). It was not audited.

### History (A-H)

**A-H1. ADR-017, Corrigenda 1 and 2: same-day edits above them, net one blank line.**

Three commits on `main` on 2026-08-06:
- `d782068b`, the commit that appended the Corrigenda, also inserted a four-line "Corrigenda" pointer
  into the Status block at new lines 19-22 (`git diff -U0 b17decab d782068b`, `b17decab` being its parent, hunk `@@ -18,0 +19,4 @@`).
- `3292f1f7` (2026-08-06T19:56Z) removed those four lines (hunk `@@ -19,4 +18,0 @@`) and rewrote the
  Corrigenda preface, which sits above Corrigendum 1's heading (hunk `@@ -664,4 +660,10 @@`).
- `1aceb8f7` (2026-08-06T20:13Z) rewrote the preface's first two lines (hunk `@@ -660,2 +660,3 @@`).

The net result:
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1-656 @ 6b67d44` is byte-identical to
  the whole of the file at `b17decab` (656 lines).
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:657 @ 6b67d44` is the one added blank
  line.
- That is what the preface states (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:660-662 @ 6b67d44`).
- The preface also records that the earlier draft added a pointer to the Status block
  (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:663-667 @ 6b67d44`).
- No commit after `1aceb8f7` has a hunk above any ADR-017 note.

**A-H2. ADR-026, the two notes of 2026-08-18: the Status line above them was rewritten at acceptance.**
- `077bda17` (2026-09-02; on `main` via `da779198`, PR #17) replaced Status lines 3-5 with lines 3-8.
- Before: "Proposed (2026-08-18) — binds nothing until accepted"
  (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:3-5 @ 8ff8b3f4`, its parent).
- After: the current Accepted line (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:3-8 @ 077bda17`).
- Before that commit, no commit had a hunk above either note. Their appending commits (`6b80e952`,
  `16091f99`) inserted only after old lines 62 and 86.

**A-H3. ADR-026, all three notes: a CRLF rewrite and its revert.**
- `f21c2ee2` (2026-09-08), the commit that appended the third note, rewrote every line of the file
  with CRLF line endings: 149 lines carry a CR at `f21c2ee2`, none at its parent `770e3f7c`.
- `f8bddf6c` (2026-09-09, "restore LF line endings on seven files a custodian Python script rewrote as
  CRLF") rewrote them back.
- Net: `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:1-129 @ 6b67d44` is
  byte-identical to the whole of the file at `770e3f7c` (129 lines), `f21c2ee2`'s parent. Apart from line endings, the
  only change is the appended note.
- The Status edit in A-H2 predates this and sits inside those 129 lines.

## Task B — mentions of moved paths

**How to read the last column.**
- *"Fails as written."* Opening the path exactly as written, from the repository root or from the
  citing file's folder, finds no file at 6b67d44. Every old path is absent at 6b67d44. Every new path
  exists, and its file name is held by no other tracked file, so `governance/MOVED.tsv` or a file-name
  search finds it.
- *Pinned line cites.* A line cite pinned to a revision is read at that revision
  (`governance/README.md:30 @ 6b67d44`). None of the 125 rows is pinned; the pins in the "As written"
  column are added by this report.
- *Line cites followed through `MOVED.tsv`.* The last column gives what the new file's same line holds
  at 6b67d44, compared with what the old file's line held at the commit that wrote the cite.
- *Duplicates.* A row covers one path on one line; "×2" marks a path written twice on that line.

**Where the 134 mentions sit, by old path.**

| Mentions | Old path |
|---|---|
| 53 | `DECISIONS-PENDING.md` |
| 15 | `RELEASE-0.1.md` |
| 12 | `AI_DEVELOPMENT.md` |
| 10 | `AUTONOMY.md` |
| 6 | `PLAN.yaml` |
| 6 | `engine/ADMISSION-PREREGISTRATION.md` (2 of them as the bare name) |
| 4 | `PRE-PUBLIC-CHECKLIST.md` |
| 4 | `RELEASE-DAY-CHECKLIST.md` |
| 3 | `CUSTODIAN-QUEUE.md` |
| 3 | `PORT-1-LINUX-L1-PREREGISTRATION.md` |
| 2 each | `PUBLIC-AUDIENCE-AUDIT.md`, `frontends/shell/RESIDENCY-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md` |
| 1 each | the other 12 old paths, all in the table below |

**Facts the table rests on.**
- *Written after the move.* 13 mentions on 10 lines were last written after the move commit:
  - `README.md:53 @ 6b67d44` (`494cea7b`);
  - eight generated index rows, `docs/README.md:54-72 @ 6b67d44` (`f6168c99`, "governance piece F gate
    1 correction round 1 (the ADR index rows …)"), which copy the ADRs' Status lines;
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:687 @ 6b67d44` (`5ff86b13`).
- *Line cites.* The 12 line cites were all written between 2026-09-08 and 2026-09-24, before the move.
- *The cite at ADR-013:288.* It cites `DECISIONS-PENDING.md:37 @ 42a5f348` for the words "equirectangular
  wording binding for future geographic entries". At the commit that wrote it, that line holds other
  text. The words are at `DECISIONS-PENDING.md:37 @ 389edff9`, the commit that wrote ADR-032's own
  cite to the same line, and are archived at `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:1709 @ 6b67d44`.
- *What `MOVED.tsv` says about these paths.* `governance/README.md:29 @ 6b67d44` says a record that names
  a file by its old path is not edited, and that the verify scripts read the old path through `MOVED.tsv`.

| # | Mention | As written (a line cite pinned to the commit that wrote it) | Context | A reader following it at 6b67d44 |
|---|---|---|---|---|
| B1 | `.github/workflows/exposure-scan.yml:6 @ 6b67d44` | `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md` | YAML comment | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/scripts/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. |
| B2 | `.github/workflows/governance-ci.yml:3 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B3 | `.github/workflows/governance-ci.yml:3 @ 6b67d44` | `PLAN.yaml` | YAML comment | Fails as written: no `PLAN.yaml` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PLAN.yaml`, the only file of that name. |
| B4 | `.github/workflows/governance-ci.yml:4 @ 6b67d44` | `CUSTODIAN-QUEUE.md` | YAML comment | Fails as written: no `CUSTODIAN-QUEUE.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/CUSTODIAN-QUEUE.md`, the only file of that name. |
| B5 | `.github/workflows/governance-ci.yml:17 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B6 | `.github/workflows/governance-ci.yml:37 @ 6b67d44` | `DECISIONS-PENDING.md` | YAML comment | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B7 | `.github/workflows/governance-ci.yml:50 @ 6b67d44` | `PLAN.yaml` | YAML comment | Fails as written: no `PLAN.yaml` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PLAN.yaml`, the only file of that name. |
| B8 | `.github/workflows/governance-ci.yml:52 @ 6b67d44` | `CUSTODIAN-QUEUE.md` | YAML comment | Fails as written: no `CUSTODIAN-QUEUE.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/CUSTODIAN-QUEUE.md`, the only file of that name. |
| B9 | `.github/workflows/governance-ci.yml:54 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B10 | `.github/workflows/governance-ci.yml:62 @ 6b67d44` | `PORT-1-LINUX-L1-PREREGISTRATION.md` | YAML comment | Fails as written: no `PORT-1-LINUX-L1-PREREGISTRATION.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md`, the only file of that name. |
| B11 | `.github/workflows/governance-ci.yml:70 @ 6b67d44` | `AI_DEVELOPMENT.md` | YAML comment | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B12 | `.github/workflows/governance-ci.yml:73 @ 6b67d44` | `VERIFY-QUOTES-PREREGISTRATION.md` | YAML comment | Fails as written: no folder given and no such file beside the citing file; a file-name search finds the one file, `governance/forms/scripts/VERIFY-QUOTES-PREREGISTRATION.md`. |
| B13 | `.github/workflows/governance-ci.yml:75 @ 6b67d44` | `AI_DEVELOPMENT.md` | YAML comment | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B14 | `.github/workflows/governance-ci.yml:77 @ 6b67d44` | `DECISIONS-PENDING.md` | YAML comment | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B15 | `.github/workflows/governance-ci.yml:77 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B16 | `.github/workflows/governance-ci.yml:152 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B17 | `.github/workflows/governance-ci.yml:163 @ 6b67d44` | `PLAN.yaml` | YAML step `name:` | Fails as written: no `PLAN.yaml` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PLAN.yaml`, the only file of that name. |
| B18 | `.github/workflows/governance-ci.yml:173 @ 6b67d44` | `CUSTODIAN-QUEUE.md` | YAML step `name:` | Fails as written: no `CUSTODIAN-QUEUE.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/CUSTODIAN-QUEUE.md`, the only file of that name. |
| B19 | `.github/workflows/pages.yml:1 @ 6b67d44` | `PLAN.yaml` | YAML comment | Fails as written: no `PLAN.yaml` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PLAN.yaml`, the only file of that name. |
| B20 | `.github/workflows/pages.yml:10 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B21 | `.github/workflows/pages.yml:62 @ 6b67d44` | `PLAN.yaml` | YAML step `name:` | Fails as written: no `PLAN.yaml` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PLAN.yaml`, the only file of that name. |
| B22 | `.github/workflows/ported-notices.yml:3 @ 6b67d44` | `PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md` | YAML comment | Fails as written: no folder given and no such file beside the citing file; a file-name search finds the one file, `governance/forms/renderer/PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md`. |
| B23 | `.github/workflows/product-ci-rust.yml:16 @ 6b67d44` | `PORT-1-LINUX-L1-PREREGISTRATION.md` | YAML comment | Fails as written: no `PORT-1-LINUX-L1-PREREGISTRATION.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md`, the only file of that name. |
| B24 | `.github/workflows/product-ci-rust.yml:47 @ 6b67d44` | `PORT-1-LINUX-L1-PREREGISTRATION.md` | YAML comment | Fails as written: no `PORT-1-LINUX-L1-PREREGISTRATION.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md`, the only file of that name. |
| B25 | `.github/workflows/product-ci-shell.yml:240 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B26 | `.github/workflows/release-artifacts.yml:3 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B27 | `.github/workflows/release-artifacts.yml:7 @ 6b67d44` | `RELEASE-DAY-CHECKLIST.md` | YAML comment | Fails as written: no `RELEASE-DAY-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-DAY-CHECKLIST.md`, the only file of that name. |
| B28 | `.github/workflows/release-artifacts.yml:13 @ 6b67d44` | `RELEASE-DAY-CHECKLIST.md` | YAML comment | Fails as written: no `RELEASE-DAY-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-DAY-CHECKLIST.md`, the only file of that name. |
| B29 | `.github/workflows/release-artifacts.yml:30 @ 6b67d44` | `RELEASE-DAY-CHECKLIST.md` | YAML comment | Fails as written: no `RELEASE-DAY-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-DAY-CHECKLIST.md`, the only file of that name. |
| B30 | `.github/workflows/release-artifacts.yml:31 @ 6b67d44` | `AI_DEVELOPMENT.md` | YAML comment | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B31 | `.github/workflows/rust-fmt.yml:13 @ 6b67d44` | `WORKSPACE-RUSTFMT-PREREGISTRATION.md` | YAML comment | Fails as written: no `WORKSPACE-RUSTFMT-PREREGISTRATION.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/forms/root/WORKSPACE-RUSTFMT-PREREGISTRATION.md`, the only file of that name. |
| B32 | `.github/workflows/tauri-build.yml:8 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B33 | `.github/workflows/tauri-build.yml:70 @ 6b67d44` | `AUTONOMY.md` | YAML comment | Fails as written: no `AUTONOMY.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AUTONOMY.md`, the only file of that name. |
| B34 | `.github/workflows/tauri-build.yml:71 @ 6b67d44` | `RELEASE-DAY-CHECKLIST.md` | YAML comment | Fails as written: no `RELEASE-DAY-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-DAY-CHECKLIST.md`, the only file of that name. |
| B35 | `README.md:53 @ 6b67d44` | `PLAN.yaml` | line last written after the move (494cea7b) | Resolves: named inside the `governance/` bullet, which is where the file is (`governance/PLAN.yaml`). |
| B36 | `docs/02_Architecture.md:83 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B37 | `docs/02_Architecture.md:88 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B38 | `docs/04_AI_and_MCP.md:31 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B39 | `docs/14_Governance_and_Licensing.md:5 @ 6b67d44` | `PRE-PUBLIC-CHECKLIST.md` | prose | Fails as written: no `PRE-PUBLIC-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PRE-PUBLIC-CHECKLIST.md`, the only file of that name. |
| B40 | `docs/14_Governance_and_Licensing.md:19 @ 6b67d44` | `PRE-PUBLIC-CHECKLIST.md` | prose | Fails as written: no `PRE-PUBLIC-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PRE-PUBLIC-CHECKLIST.md`, the only file of that name. |
| B41 | `docs/14_Governance_and_Licensing.md:23 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B42 | `docs/README.md:54 @ 6b67d44` | `DECISIONS-PENDING.md` | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B43 | `docs/README.md:60 @ 6b67d44` | `DECISIONS-PENDING.md` | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B44 | `docs/README.md:64 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B45 | `docs/README.md:65 @ 6b67d44` | `DECISIONS-PENDING.md` | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B46 | `docs/README.md:69 @ 6b67d44` | `DECISIONS-PENDING.md` | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B47 | `docs/README.md:70 @ 6b67d44` | `DECISIONS-PENDING.md` | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B48 | `docs/README.md:71 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B49 | `docs/README.md:72 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | generated index row (copies that ADR's Status line); line last written after the move (f6168c99) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B50 | `docs/adr/ADR-009-license-and-open-core-boundary.md:97 @ 6b67d44` | `PRE-PUBLIC-CHECKLIST.md` | inside the note at ADR-009:90 (Task A) | Fails as written: no `PRE-PUBLIC-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PRE-PUBLIC-CHECKLIST.md`, the only file of that name. |
| B51 | `docs/adr/ADR-009-license-and-open-core-boundary.md:104 @ 6b67d44` | `PUBLIC-AUDIENCE-AUDIT.md` | inside the note at ADR-009:90 (Task A) | Fails as written: no `PUBLIC-AUDIENCE-AUDIT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PUBLIC-AUDIENCE-AUDIT.md`, the only file of that name. |
| B52 | `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:288 @ 6b67d44` | `DECISIONS-PENDING.md:37 @ 42a5f348` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/DECISIONS-PENDING.md:37 @ 6b67d44`: different text (blank line at HEAD; the file rotates). |
| B53 | `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:289 @ 6b67d44` | `RELEASE-0.1.md:1041 @ 42a5f348` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/RELEASE-0.1.md:1041 @ 6b67d44`: same text. |
| B54 | `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:326 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B55 | `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:204 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B56 | `docs/adr/ADR-016-stable-feature-identity-admission.md:4 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B57 | `docs/adr/ADR-016-stable-feature-identity-admission.md:213 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. |
| B58 | `docs/adr/ADR-016-stable-feature-identity-admission.md:238 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B59 | `docs/adr/ADR-016-stable-feature-identity-admission.md:240 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. |
| B60 | `docs/adr/ADR-016-stable-feature-identity-admission.md:240 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B61 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1153 @ 6b67d44` | `PUBLIC-AUDIENCE-AUDIT.md` | inside the note at ADR-017:1144 (Task A) | Fails as written: no `PUBLIC-AUDIENCE-AUDIT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PUBLIC-AUDIENCE-AUDIT.md`, the only file of that name. |
| B62 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:24 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B63 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:139 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B64 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:156 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B65 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:166 @ 6b67d44` | `RELEASE-0.1.md` (×2 on the line) | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B66 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:327 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B67 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:457 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B68 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:458 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B69 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:466 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B70 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:467 @ 6b67d44` | `RELEASE-0.1.md:798-799 @ 0129dd2d` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/RELEASE-0.1.md:798-799 @ 6b67d44`: same text apart from line endings (CRLF at 0129dd2d). |
| B71 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:512 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B72 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:558 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B73 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:618 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B74 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:653 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B75 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:653 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B76 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:666 @ 6b67d44` | `AI_DEVELOPMENT.md`, `AI_DEVELOPMENT.md:233 @ d38c5ada` (×2 on the line) | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/AI_DEVELOPMENT.md:233 @ 6b67d44`: different text. |
| B77 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:668 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B78 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:674 @ 6b67d44` | `AI_DEVELOPMENT.md:147 @ 0129dd2d` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/AI_DEVELOPMENT.md:147 @ 6b67d44`: different text. |
| B79 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:675 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B80 | `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:687 @ 6b67d44` | `DECISIONS-PENDING.md` | inside the note at ADR-020:680 (Task A); line last written after the move (5ff86b13) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B81 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:200 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B82 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:226 @ 6b67d44` | `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`. |
| B83 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:231 @ 6b67d44` | `DECISIONS-PENDING.md` | inside the note at ADR-021:229 (Task A) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B84 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:246 @ 6b67d44` | `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` | inside the note at ADR-021:244 (Task A) | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`. |
| B85 | `docs/adr/ADR-021-row-filter-on-viewport-query.md:271 @ 6b67d44` | `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` | inside the note at ADR-021:269 (Task A) | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`. |
| B86 | `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:4 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B87 | `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:15 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B88 | `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:142 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B89 | `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:165 @ 6b67d44` | `engine/B1-PROJECTION-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/B1-PROJECTION-PREREGISTRATION.md`. |
| B90 | `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:193 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B91 | `docs/adr/ADR-025-publish-above-the-readers-ceilings.md:66 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B92 | `docs/adr/ADR-025-publish-above-the-readers-ceilings.md:80 @ 6b67d44` | `RELEASE-0.1.md` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B93 | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:4 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B94 | `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:7 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B95 | `docs/adr/ADR-027-action-console-and-display-truth.md:3 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B96 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:26 @ 6b67d44` | `frontends/shell/RESIDENCY-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/frontends/RESIDENCY-PREREGISTRATION.md`. |
| B97 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:71 @ 6b67d44` | `frontends/shell/RESIDENCY-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/frontends/RESIDENCY-PREREGISTRATION.md`. |
| B98 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:518 @ 6b67d44` | `RELEASE-0.1.md` | inside the note at ADR-028:506 (Task A) | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B99 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:524 @ 6b67d44` | `RELEASE-0.1.md` | inside the note at ADR-028:520 (Task A) | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. |
| B100 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:524 @ 6b67d44` | `frontends/shell/ENTRY-66B-PREREGISTRATION.md` | inside the note at ADR-028:520 (Task A) | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/frontends/ENTRY-66B-PREREGISTRATION.md`. |
| B101 | `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:581 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B102 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:8 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B103 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:20 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B104 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:81 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md:248 @ 09cfc72d` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. Its line cite, followed through MOVED.tsv, reaches `governance/forms/engine/ADMISSION-PREREGISTRATION.md:248 @ 6b67d44`: different text. |
| B105 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:85 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md:248 @ 09cfc72d` (written as the bare name) | prose | Fails as written: no folder given and no such file beside the citing file; a file-name search finds the one file, `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. Its line cite, followed to that file, reaches `governance/forms/engine/ADMISSION-PREREGISTRATION.md:248 @ 6b67d44`: different text. |
| B106 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:97 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md:252 @ 09cfc72d` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. Its line cite, followed through MOVED.tsv, reaches `governance/forms/engine/ADMISSION-PREREGISTRATION.md:252 @ 6b67d44`: different text. |
| B107 | `docs/adr/ADR-029-scan-progress-carrier-quantity.md:113 @ 6b67d44` | `engine/ADMISSION-PREREGISTRATION.md:254 @ 09cfc72d` (written as the bare name) | prose | Fails as written: no folder given and no such file beside the citing file; a file-name search finds the one file, `governance/forms/engine/ADMISSION-PREREGISTRATION.md`. Its line cite, followed to that file, reaches `governance/forms/engine/ADMISSION-PREREGISTRATION.md:254 @ 6b67d44`: different text. |
| B108 | `docs/adr/ADR-030-conveyed-artifact-notice-set.md:8 @ 6b67d44` | `PRE-PUBLIC-CHECKLIST.md` | ADR header block | Fails as written: no `PRE-PUBLIC-CHECKLIST.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/PRE-PUBLIC-CHECKLIST.md`, the only file of that name. |
| B109 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B110 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:17 @ 6b67d44` | `RELEASE-0.1.md:1041 @ 389edff9` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/RELEASE-0.1.md:1041 @ 6b67d44`: same text. |
| B111 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:17 @ 6b67d44` | `DECISIONS-PENDING.md`, `DECISIONS-PENDING.md:37 @ 389edff9` (×2 on the line) | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/DECISIONS-PENDING.md:37 @ 6b67d44`: different text (blank line at HEAD; the file rotates). |
| B112 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:39 @ 6b67d44` | `RELEASE-0.1.md:1041 @ 389edff9` | prose | Fails as written: no `RELEASE-0.1.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/RELEASE-0.1.md`, the only file of that name. Its line cite, followed through MOVED.tsv, reaches `governance/RELEASE-0.1.md:1041 @ 6b67d44`: same text. |
| B113 | `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:56 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B114 | `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:3 @ 6b67d44` | `DECISIONS-PENDING.md` | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B115 | `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:33 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B116 | `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:39 @ 6b67d44` | `AI_DEVELOPMENT.md` | prose | Fails as written: no `AI_DEVELOPMENT.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/AI_DEVELOPMENT.md`, the only file of that name. |
| B117 | `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B118 | `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:5 @ 6b67d44` | `engine/LOD-PREREGISTRATION.md` | ADR header block | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/LOD-PREREGISTRATION.md`. |
| B119 | `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:137 @ 6b67d44` | `engine/LOD-PREREGISTRATION.md` | prose | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/engine/LOD-PREREGISTRATION.md`. |
| B120 | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 6b67d44` | `DECISIONS-PENDING.md` (×2 on the line) | ADR header block | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B121 | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:143 @ 6b67d44` | `DECISIONS-PENDING.md` | prose | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B122 | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:151 @ 6b67d44` | `DECISIONS-PENDING.md` | inside the note at ADR-035:149 (Task A) | Fails as written: no `DECISIONS-PENDING.md` at the repository root at 6b67d44; MOVED.tsv maps it to `governance/DECISIONS-PENDING.md`, the only file of that name. |
| B123 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:4 @ 6b67d44` | `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md` | ADR header block | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`. |
| B124 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:5 @ 6b67d44` | `kernel/B2-1B-RECORDING-PREREGISTRATION.md` | ADR header block | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md`. |
| B125 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:6 @ 6b67d44` | `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md` | ADR header block | Fails as written: no such file at 6b67d44; MOVED.tsv maps it to `governance/forms/kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`. |

## Seen while reading, outside the two tasks

- **ADR-020's Amendment 1.** Its three loose cites to `build.rs`
  (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:190-193 @ 6b67d44`) exceed
  both same-name files in the tree. `verify-cites` reports them as advisory, not gated. The amendment
  is not a note.
- **ADR-017's pending note.** The PLAN node `adr-017-note-product-redaction-gate` places a further ADR-017
  note on a branch that is not on `main` at 6b67d44 (`governance/PLAN.yaml:6048-6058 @ 6b67d44`). It was
  not read.

## Reproducing this

All commands run at 6b67d44 in a clone with full history (`git fetch --unshallow origin main`):

- **Note sections.** List them by heading, with
  `grep -nE '^#{1,6} ' docs/adr/*.md | grep -iE 'note|corrigend'`. Each section runs to the next
  heading of the same or a higher level.
- **Who appended a note.** `git log --no-merges --reverse --format=%H -S "<first 60 characters of the
  heading>" -- <ADR>` gives the commit that wrote it. `git log --first-parent --reverse -- <ADR>` gives
  the commit that brought it onto `main`.
- **Edits above a note.** For each later commit `C`, run `git diff -U0 C^1 C -- <ADR>`. A hunk whose old
  start line number is lower than the note heading's line number in `C^1` is an edit above the note.
- **Index and cites.** `node frontends/shell/scripts/adrIndex.mjs --check` and
  `node scripts/plan/verify-cites.mjs --files 'docs/**/*.md'`.
- **Task B.** Tokenise each tracked file under `docs/` and `.github/`, plus `README.md` and
  `CONTRIBUTING.md`. Resolve each token from the root and from the citing file's folder (Markdown link
  targets relative to the file), and match the results against column 1 of `governance/MOVED.tsv`. Then
  `git grep -nF <file name>` for every moved file name over the same files, to find any occurrence the
  tokeniser missed. There were none.
- **Line content behind a line cite.** `git show <citing commit>:<old path>` and
  `sed -n <line>p <new path>`.
