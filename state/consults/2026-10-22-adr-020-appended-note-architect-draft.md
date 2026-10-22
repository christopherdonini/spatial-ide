*Custodian's filing note (2026-10-22): the docs lane's next form, drafted ahead by the architect while #243 and #244 await the click, read only at main 708f4169. The run 17:21:07Z to 17:33:06Z by its transcript (Glob 3, Grep 46, Read 34; no Write, Edit or Bash); the reads its disclosure names are in it. The custodian checked by script at main 708f4169: entry 54's quoted span in the archive appears once and ends with its closing quotation mark, no full stop; ADR-020's line 403 ends with one; ADR-020 has no CR byte and ends in LF. It is a full form (an ADR's appended text, ADR-020 named in §21a's security posture). OPEN-4 is the custodian's and is taken as recommended: the form's file goes at the repository root. OPEN-1 (the corrigendum's words, red-line text, a typed answer), OPEN-2 and OPEN-3 are the human's. The form is committed, its cites pinned by script, only when the piece starts: after #243 and #244 merge and OPEN-1's typed answer is filed, outside #244's freeze window. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is a22c0606a7f6766b17479acae9cfe332dbb2b236913a8a44eef3db9ee5cb6248.*

---

Drafted: adr-020-appended-note, the form, at main 708f4169

(Read-only, at main @ 708f4169, in the main checkout. I have no shell, so this report carries no sha256. The custodian pins each `path:line @ 708f4169` by script, using the full commit id and the hash, written on one line. One more note: I byte-copied the reproduced span in the form from my Read of the archive, not by script. E4 rebuilds it by script.)

---

# ADR-020's appended corrigendum: Amendment 1 §(c)'s quoted sentence and its source's full stop. Preregistration (full form)

File: `ADR-020-APPENDED-NOTE-PREREGISTRATION.md` (at the repository root, the custodian's choice; OPEN-4)

**Authority.**
- **The node:** PLAN node `adr-020-appended-note`, `PLAN.yaml:5615-5631 @ 708f4169` (entries [102], budget 30, depends_on #243 and #244).
- **What owes it:** round 11, item 1. Its condition (a) names the accepted-ADR note among the owed corrections. The baseline entry is `scripts/plan/verify-quotes.baseline.json:20-28 @ 708f4169`: disposition `owed-correction`, with a `corrected_by` that names no piece.
- **Placed:** `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:14 @ 708f4169` (the docs lane, 3 of 6).
- **Ordered:** `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:12 @ 708f4169` (the Docs lane line).
- **The lane's terms:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21 @ 708f4169`.
- **Red line:** `AI_DEVELOPMENT.md:451-454 @ 708f4169` (ADR statuses and amendments; security posture).
- **Verdicts:** proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Wording follows the 2026-10-11 direction, item 2, and `AUTONOMY.md` §31. The corrigendum is red-line text, so §31's replacement route does not apply to it.

**Drafted by** the architect, on the custodian's brief, at main 708f4169 (C). **These words are the architect's, not the human's.** The corrigendum lands only on the human's typed word (OPEN-1).

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating: full form and full gating from dispatch.** The rules are `AUTONOMY.md:315-332 @ 708f4169` (§21a) and `AUTONOMY.md:482 @ 708f4169` (§25(e), the paragraph the brief calls §21(e)).
- The change touches two §21a categories:
  - category 1, an ADR amendment (`AUTONOMY.md:319-320 @ 708f4169`). A dated corrigendum appended to an accepted ADR is amendment text, and the ADR-035 note precedent was gated in full on this bullet (`state/consults/2026-09-25-adr-035-decision-4-note.md:41 @ 708f4169`);
  - category 2, security posture (`AUTONOMY.md:321-322 @ 708f4169`). ADR-020 is named there by number.
- The corrigendum changes no posture. But §25(e) turns on what an `Out-of-scope` line could honestly assert. A piece whose only product is text appended to ADR-020 cannot assert that it touches none of the four. A five-line form would carry a false `Out-of-scope` line, and dispatching a piece on it fails by name (round 25, item 2).
- By size the piece is well under §21c (`AUTONOMY.md:347-357 @ 708f4169`).
- **The human's word is needed, but no acceptance step is.** The Status line is unchanged, and ADR-020 stays Accepted 2026-08-13. The Status line itself provides for dated corrigenda (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:5 @ 708f4169`), and amendments are appended, never rewritten (`docs/README.md:27 @ 708f4169`). Even so, the text is a §B red line, so the words land only on the human's typed word (OPEN-1), and the merge is the human's click. The node's `needs_human` (none) should become a ruling of about 5 minutes. That is the custodian's PLAN edit.

**Reuse index (the standing step).** The output of `node tools/reuse.mjs <words>`, run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, byte for byte as the custodian's brief carried it. Both queries miss. The miss is noted and does not block.

```text
$ node tools/reuse.mjs adr appended note
No prior art recorded for "adr appended note". Research it before planning an implementation.
$ node tools/reuse.mjs quote correction note
No prior art recorded for "quote correction note". Research it before planning an implementation.
```

The prior art in the tree is these appended corrections:
- ADR-017's Corrigendum 2, which corrects record pointers and changes no decision (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:723-726 @ 708f4169`);
- ADR-009's corrigendum (`docs/adr/ADR-009-license-and-open-core-boundary.md:90 @ 708f4169`);
- ADR-035's Note (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149 @ 708f4169`).

## §0. Disclosure

- **Inputs read at C:**
  - the node;
  - round 11, item 1, and the RULED 2026-09-07 block on entries 52 to 54, both found in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md` by round and by entry;
  - entry 54 in the same archive, found by entry number;
  - ADR-020 at its Status, at `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:401-417 @ 708f4169`, and from :612 to its end at :678;
  - `scripts/plan/verify-quotes.mjs` whole, and its baseline whole;
  - `scripts/plan/site.mjs`'s baseline count;
  - `frontends/shell/scripts/adrIndex.mjs`'s Status rule;
  - §21a to §21d and §25(e);
  - the six forms in §2.5.
- **The defect.** ADR-020 Amendment 1 §(c) introduces its blockquote as verbatim (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:401 @ 708f4169`), and the blockquote ends in a full stop (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:403 @ 708f4169`). In entry 54, the source, the same words sit inside an italic quoted span that ends at its last word and the closing quotation mark, with no full stop. The record's two other copies of the sentence also carry no full stop (`RELEASE-0.1.md:284-285 @ 708f4169`, `RELEASE-0.1.md:449 @ 708f4169`, `RELEASE-0.1.md:796-797 @ 708f4169`).
- **The checker as found (tool claims about `scripts/plan/verify-quotes.mjs` at 708f4169, round 15 (c)):**
  - The §(c) blockquote is extracted, because the trigger sits at :401. No path:line cite is near it, so it is searched tree-wide. It is found in no tracked file, and it is reported as baselined by the entry's file, line and words (`scripts/plan/verify-quotes.mjs:930-944 @ 708f4169`, `scripts/plan/verify-quotes.mjs:486-497 @ 708f4169`).
  - Entry validation reads only `disposition` and `ruling` (`scripts/plan/verify-quotes.mjs:470-481 @ 708f4169`). Output prints the entry's `reason`, never its `corrected_by` (`scripts/plan/verify-quotes.mjs:1070-1073 @ 708f4169`).
  - A baseline entry that matches nothing is printed and never gated (`scripts/plan/verify-quotes.mjs:1076-1079 @ 708f4169`, `scripts/plan/verify-quotes.mjs:1108-1121 @ 708f4169`).
  - `site.mjs` reads the baseline's entry count only (`scripts/plan/site.mjs:784 @ 708f4169`).
  - By Grep at C, no test under `scripts/plan` names ADR-020's entry or pins the baseline count.
- **The self-verification hazard (the checker's disclosed residual, `scripts/plan/verify-quotes.mjs:28-32 @ 708f4169`).** Suppose any tracked file, this form and the corrigendum included, carried the §(c) sentence followed by a full stop in any form that normalizes to it: plain prose, a backtick span followed by a full stop, or an emphasis pair followed by a full stop. Then the §(c) blockquote would verify against that copy, and its baseline entry would turn stale. In this form and in the corrigendum, the sentence appears only inside its `*"` … `"*` wrapper, with no full stop. E5 and C1 check this.
- **Not measured.** There is no fixture and no app run.

## §1. May and may not claim

- **May claim:**
  - the corrigendum states what entry 54 and ADR-020 §(c) show at B, checked clause by clause in §2.2;
  - ADR-020's bytes at B are a prefix of its bytes at H.
- **May not claim:**
  - any change to a decision, a condition, the accepted mechanism, a test, or Amendment 1's claims;
  - that the §(c) blockquote's bytes are corrected (they are immutable);
  - that the baseline entry leaves, or that the baseline count falls;
  - any statement about the code ADR-020 governs.
- **ADRs:** ADR-020, appended only; its Status line is unchanged. No other ADR is touched.

## §2. The change

### 2.0 Rules

- (a) A single append at the end of ADR-020. Nothing above is edited.
- (b) No path:line cite and no hash inside the corrigendum:
  - the ledger passage is referenced by entry number (round 14 (a′));
  - ADR-020's own text is referenced by section (Amendment 1 §(c));
  - the archive is named by path alone.
  - No bare self-line, and no line cite into a file this commit edits.
- (c) No line in the corrigendum begins with `Status:` or `**Status:**`, because `adrIndex.mjs` fails an ADR with two Status lines.
- (d) The reproduction is a single physical line, byte-copied by script (E4) with its `*"` … `"*` wrapper, and nothing follows it on that line.
- (e) The only quotation marks in the corrigendum are those of the reproduction.
- (f) Lines are wrapped at 100 columns, as the file is. Words do not change in a rewrap.

### 2.1 The corrigendum, whole (the architect's words, pending OPEN-1)

`<DATE>` is the UTC date (`date -u +%F`) of the appending commit. `<DIRECTIVE>` and `<N>` come from OPEN-1's filed answer. The block starts with the one blank line that separates it from ADR-020's last line.

```text

## Corrigendum — <DATE> — Amendment 1 §(c): a full stop its source does not have

*A dated corrigendum, as the Status line provides, owed under round 11, item 1 and appended on
the human's typed word (<DIRECTIVE>, item <N>). Nothing above this heading is changed.*

Amendment 1 §(c) gives the sentence that `DECISIONS-PENDING.md` entry 54 set out for this record,
in the shape the human's ruling on entry 54 (2026-09-07) pre-approved, as a verbatim blockquote
ending in a full stop; entry 54's sentence has no full stop, and its words are otherwise the same.
Entry 54's sentence, verbatim, byte-copied by script from the entry (archived in
`state/cut-archive/DECISIONS-PENDING-2026-10-20.md`) and marked so:

*"the accepted mechanism is unchanged; this replaces a selector the acceptance never covered"*
```

Round 12 (d) is met: the correction is two sentences (the defect, then the corrected reference with its reproduction) and restates no earlier amendment's claim. The heading avoids the "Appended <date>" form (`state/consults/2026-09-25-adr-035-decision-4-note.md:30 @ 708f4169`).

### 2.2 Clause check (at C)

1. **A dated corrigendum, as the Status line provides:** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:5 @ 708f4169`.
2. **Owed under round 11, item 1:** that item's condition (a) names the accepted-ADR note as owed, and the entry's `ruling` is round 11 (`scripts/plan/verify-quotes.baseline.json:20-28 @ 708f4169`).
3. **On the human's typed word:** filled from OPEN-1. If the answer has not been filed, the corrigendum is not written.
4. **Nothing above this heading is changed:** E2.
5. **The sentence that entry 54 set out for this record:** entry 54 lists the record's contents, and this sentence is among them.
6. **In the shape the human's ruling on entry 54 (2026-09-07) pre-approved:** the RULED 2026-09-07 block on entries 52 to 54 pre-approves Amendment 1 in that shape.
7. **As a verbatim blockquote ending in a full stop:** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:401-403 @ 708f4169`.
8. **Entry 54's sentence has no full stop:** its quoted span ends at its last word and the closing quotation mark (E4).
9. **Its words are otherwise the same:** E4's second comparison.
10. **Archived in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`:** that tracked file holds entry 54 at C.

### 2.3 Why the source's words are reproduced (round 12 (b) rider; OPEN-2)

By its own rider, round 12 (b) defaults to a reference without reproduction. This reproduction is the content of the correction, not an illustration of it. The ruling on entry 54 pre-approved a record that carries this sentence verbatim, and §(c)'s blockquote does not. Only a byte-copied reproduction gives ADR-020 the sentence as its source has it. The ADR-035 note reproduced on the same ground. OPEN-2 offers reference-only instead.

### 2.4 The append itself

- **One Edit.** Its `old_string` is ADR-020's last line at B, with the file's final newline. The worker copies it from B by script; at C it is :678, the last line of the History list. Its `new_string` is the same text plus §2.1's block, ending with one final newline. This is the shape Guardian G3 allows for an accepted ADR. If the file at B does not end in LF, the worker stops (§5).
- **Pins.** The corrigendum carries none (§2.0 (b)). This form's own cites are pinned by the custodian at a commit on main (round 15 (e)).

### 2.5 Overlap (rule (00), `AUTONOMY.md:609 @ 708f4169`)

**This piece's paths:**
- P1 `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md`, appended only;
- P2 this form;
- P3 PLAN.yaml, with the generated `CUSTODIAN-QUEUE.*` and `site/`, which are the custodian's;
- P4 `scripts/plan/verify-quotes.baseline.json`, its one `corrected_by` value, only under OPEN-3 (a).

Nothing is under `protocol/`, and no wire fixture or lockfile changes. `docs/README.md` is not edited, because the Status line is unchanged.

**How each piece in progress or awaiting merge meets it:**
- **#241, `bundle-redaction-scan-not-in-product-publish`.** Its 24 files are at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ 708f4169`, with the rule (00) note at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:773-784 @ 708f4169`. It edits nothing under `docs/`. **Disjoint.**
- **#242, `verify-quotes-round-item-cites`.** Its paths are at `scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md:284-292 @ 708f4169`. By file the baseline is outside them, and its §2.7 leaves `verify-quotes.baseline.json` unchanged. **Disjoint for P1 to P3.** P4 waits for #242's merge (OPEN-3).
  - Contact: once #242 merges, the corrigendum's and this form's round + item cites are resolved. The only ones used are round 11, item 1 and round 25, item 2, and both blocks carry those item lines.
- **#243, `stale-assertion-messages-and-product-comments`.** Its four code and test files, its form and PLAN.yaml are at `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-221 @ 708f4169`. **Disjoint.** This piece also depends on #243's merge.
- **#244, `walkthrough-row-f7-cli-refusal`.** Its paths are Part F (and Part G under its OPEN-2) of `frontends/shell/MANUAL-WALKTHROUGH.md`, its form and PLAN.yaml, at `frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:163-168 @ 708f4169`. **Disjoint by file.** This piece also depends on #244's merge.
  - **The freeze:** #244's §2.3 forbids any commit to main between #244's click and #241's (`frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:149 @ 708f4169`). This form's commit and every later commit of this piece stay out of that window.
- **Milestone 4, PR A (`b1-shell-half`, `cut/b1-shell-half-pr-a`).** Its files are at `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:333-357 @ 708f4169`, with the exclusions at `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:401-407 @ 708f4169`. The paths Amendment 3 adds are at `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:897-906 @ 708f4169`. Everything is under `frontends/shell/`, plus `renderer/tests/style_shell_agreement.rs` and `kernel/tests/manual_walkthrough_fixtures.rs`, with no ADR. **Disjoint.**
- **Piece 1c, step 1.** Its groups are at `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-458 @ 708f4169`. Its ADR text is ADR-036 and ADR-022 only, and it touches `protocol/`. This piece touches neither. **Disjoint.**
  - Contact: 1c appends to two other ADRs, and its form says round + item cites under `docs/adr/` must resolve (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:431 @ 708f4169`). That is no shared path.
- **The docs lane's next piece**, `adr-035-close-races-note`, depends on this node (`PLAN.yaml:3165 @ 708f4169`), so it is serialised.
- **Rule (00) is re-checked at dispatch** against both slots, the docs lane, the governance lane and every PR awaiting merge.

### 2.6 Portability

No OS-dependent feature is involved. R3 does not apply.

## §3. Fixtures

None.

## §4. Tests and evidence

- **No test is added, renamed or changed, and no mutation is owed: the piece changes documents only.** No record of this piece calls any run an observation of a mutation, a `verify-mutation` run or C1 included.
- **Evidence at H**, each by script with its exit code checked, and each search pattern self-tested positive at B. Each tool claim names the tool's commit (round 15 (c)). Every run is light (node only), so no heavy-run hold applies.

E1. Additions only, at most §7's ceiling:

```text
git diff --numstat B...H -- docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md
```

The output has insertions ≤ 20 and deletions 0.

E2. B's file is a byte prefix of H's file, the Status line included:

```text
git show B:docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md > b.md
git show H:docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md > h.md
node -e "const f=require('fs');const b=f.readFileSync('b.md'),h=f.readFileSync('h.md');process.exit(h.length>b.length&&h.subarray(0,b.length).equals(b)?0:1)"
```

E3. H's file has no CR byte, and its last byte is LF. Checked with node, not grep.

E4. Two comparisons, both by node script:
- Locate entry 54 in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md` at B, by its entry head and the next entry's head; no line number is written anywhere. Take its italic quoted span from its opening asterisk and quotation mark through its closing quotation mark and asterisk. It must equal the corrigendum's reproduction line byte for byte.
- That span without its four wrapper bytes must equal :403 at B without its `> ` prefix and its last byte, and that last byte must be a full stop.

E5. `node scripts/plan/verify-quotes.mjs` exits 0, and the following hold compared with B:
- checked +1 and verified +1, from the reproduction (0 and 0 under OPEN-2 (B));
- baselined and advisory unchanged;
- `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:403` is still in the baselined list with the entry's reason;
- no matched-nothing line names it;
- if #242 has merged at B, its ruling-cite count is +1 with 0 errors.

E6. `node scripts/plan/verify-cites.mjs` exits 0.

E7. `node scripts/plan/verify-test-claims.mjs` and `node scripts/plan/verify.mjs` each exit 0.

E8. `npm run verify:adr-index` in `frontends/shell` exits 0, and ADR-020's row (`docs/README.md:58 @ 708f4169`) is unchanged.

E9. `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.

E10. This command exits 0:

```text
node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"
```

E11. PR CI is green.

C1, a control run. It is not a mutation, and no test exists to mutate.
- In a scratch worktree at H, never committed: remove the reproduction's wrapper and put a full stop after its last word. Run verify-quotes.
- Predicted: the ADR-020 entry is listed under matched nothing. This shows that E5's check catches a corrigendum that would make §(c) verify against itself.
- Revert, show the worktree clean, and record the result with H's commit id.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predicted:** E1 to E11 and C1 hold. The health strip's baseline count is unchanged. The entry stays, because §(c)'s bytes stay.
- **Declared unchanged:**
  - every byte of ADR-020 at B;
  - `docs/README.md`;
  - `RELEASE-0.1.md`;
  - `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md`, a filed form whose table row on this entry stays as history;
  - the baseline file, except under OPEN-3 (a);
  - every other file.
- **Invalidators (stop and report):**
  - at B, ADR-020 :401-403 differs from C, the file does not end in LF, or a piece in flight names ADR-020;
  - E4 fails;
  - the baseline entry at B no longer carries file ADR-020, line 403 and its words;
  - the human's words (OPEN-1) need a clause the sources do not support.
- **Falsified if** a clause in §2.2 is shown untrue at B, or verify-quotes at H treats :403 as verified.

## §6. Instruments

Assertions by script only (E1 to E11, C1). There is no measurement and no operator step.

## §7. Declared values and ceilings

- **Counting:** `git diff --numstat B...H`, with insertions and deletions counted together.
- **Ceilings:**
  - P1: ≤ 20 insertions, 0 deletions;
  - P4, under OPEN-3 (a) only: 2 lines (1 + 1).
- **Files:** at most P1, P4 and this form as non-generated files, plus PLAN.yaml and the generated files.
- **Budget:** 30 minutes (the node's). Past twice the budget, the node stops.
- **Overruns:** an overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any byte of ADR-020 at B changed, the Status line included (E2).
2. The §(c) sentence followed by a full stop in any normalized form, in any tracked file this piece writes (E5, C1).
3. The corrigendum written before the human's typed answer to OPEN-1, or in words other than those the answer approves.
4. A line cite into `DECISIONS-PENDING.md` or its archive; a bare `:line` into ADR-020; a pin split across lines; a hash at a branch commit.
5. A tool claim without the tool's commit.
6. A path outside §2.5. Anything under `scripts/plan/` unless OPEN-3 (a) is ruled and #242 has merged. Anything under `protocol/`.
7. A clause claiming more than §1 allows: a corrected §(c), a changed decision or mechanism, or an "Appended <date>" claim.
8. A line beginning `Status:` or `**Status:**`, or `docs/README.md` edited.
9. A §7 overrun not recorded as class 8, or §7 edited. A scope addition not recorded as class 9 before its code.
10. A record that calls a `verify-mutation` run, or C1, an observation of a mutation.
11. A commit to main by this piece inside #244's freeze window.

## §9. Gates

- **Architect and reviewer, full gating.**
  - **The architect** checks §2.2 against entry 54, the RULED 2026-09-07 block and ADR-020 at B; then §2.3, the gating, and §8 item by item.
  - **The reviewer** checks the diff, recomputes every pin, runs E1 to E11 and C1 by script, and confirms OPEN-1's words are applied byte for byte.
- **Verdicts are proportional.** A clause's truth is Correctness. E1 to E11 are Evidence.
- **Operator:** none. No walkthrough row and no KNOWN-LIMITATIONS item.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. OPEN answers are recorded before code: class 5, or class 9 for OPEN-3 (a).

## §11. OPEN items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | the corrigendum's words, heading form and date | (A) | yes: typed |
| OPEN-2 | reproduce entry 54's words, or reference only | (A) | no |
| OPEN-3 | the baseline entry's `corrected_by` | (a) | no |
| OPEN-4 | the form's location | root | no |

---

## OPEN items, with options and my recommendation

**OPEN-1: the corrigendum's words (red line; the answer is typed, not clicked).**
- (A) Yes to §2.1's words.
- (B) Your own words. The gate checks them once against §2.2's sources.
- Sub-choice, the heading:
  - "Corrigendum — <date>". These are ADR-020's own Status-line word and the form ADR-017 and ADR-009 use.
  - "Note <date>". This is the form ADR-021 and ADR-035 use.
- Sub-choice, the date:
  - the appending commit's UTC date, as the brief asks;
  - the merge day, the ADR-024 precedent. That date is then set at the final pre-merge commit.
- **Recommended:** (A), "Corrigendum", the commit's date.

**OPEN-2: reproduction (§2.3).**
- (A) Reproduce entry 54's quoted span, byte-copied by script and marked.
- (B) Reference only, under round 12 (b)'s default. The second sentence then names entry 54 and says only that its sentence ends without a full stop.
- **Recommended: (A).** The pre-approved record must carry the sentence verbatim, and only the reproduction does that.

**OPEN-3: the baseline entry once the corrigendum lands.**
- **The entry must stay.** §(c)'s bytes are immutable. Removing the entry makes verify-quotes fail on :403 with exit 1, and CI goes red.
- **Its disposition stays `owed-correction`.** This follows the custodian's Applied reading of round 11, item 1: an immutable record corrected by an appended statement keeps `owed-correction`, with that statement named. It also follows three precedents (`scripts/plan/verify-quotes.baseline.json:183 @ 708f4169`, `scripts/plan/verify-quotes.baseline.json:232 @ 708f4169`, `scripts/plan/verify-quotes.baseline.json:69 @ 708f4169`).
- **Its `corrected_by` should change.** No check reads it (§0), but round 11, item 1's condition (a) wants the corrector named. Today it names none, and "owed" turns false at the merge.
- **The proposed value**, with no line cite because the same PR edits ADR-020:

```text
docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md, the Corrigendum on Amendment 1 §(c) (PLAN node adr-020-appended-note; appended -- the blockquote's own bytes are immutable)
```

- **Options:**
  - (a) You admit this one field into this piece, as an exception to the docs lane's no-`scripts/plan` term. It is applied only after #242 has merged, as class 9 before its code, so the record and its pointer land together.
  - (b) A separate governance-lane node after #242 and this piece merge: a five-line form with one reviewer, for one line.
  - (c) Leave the field as it is. Not recommended: it would state that something owed is still owed after it has landed.
- **Recommended: (a).** If #242 has not merged at dispatch, (b).

**OPEN-4: the form's file.** Recommended: the repository root, as with the KNOWN-LIMITATIONS forms. `docs/adr/` would put a form inside the scan set as an ADR-shaped file. The choice is the custodian's.

**Not recommended:** setting §25(e) aside for a five-line form, as was done for the TTL piece on 2026-10-20. This full form is already drafted, and the piece is small.

---

## What I could not settle

- No hashes and no runs. E5's before-and-after figures come from reading `verify-quotes.mjs` at 708f4169, not from observing a run.
- Whether #242 merges before this piece's B. That changes E5's ruling-cite clause and decides OPEN-3 (a) against (b).
- The human's 2026-10-22 Docs lane line puts "item 41's comment" ahead of the ADR notes, but `known-limitations-item-41-source-comment` is done (#228) at C (`PLAN.yaml:5462-5472 @ 708f4169`). I could not place which item-41 piece, if any, still comes before this one. That is the custodian's to place.
- That ADR-020's last byte is LF at C. I could not check it without a shell; E3 and §5 cover it.

Files: `C:\dev\spatial-ide\docs\adr\ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md`, `C:\dev\spatial-ide\scripts\plan\verify-quotes.baseline.json`, `C:\dev\spatial-ide\scripts\plan\verify-quotes.mjs`, `C:\dev\spatial-ide\state\cut-archive\DECISIONS-PENDING-2026-10-20.md` (entry 54; RULED 2026-09-07; round 11, item 1), `C:\dev\spatial-ide\AUTONOMY.md`, `C:\dev\spatial-ide\AI_DEVELOPMENT.md`, `C:\dev\spatial-ide\frontends\shell\scripts\adrIndex.mjs`, `C:\dev\spatial-ide\PLAN.yaml`.
