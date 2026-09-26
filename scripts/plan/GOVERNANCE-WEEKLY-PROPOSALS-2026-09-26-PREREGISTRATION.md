# Governance weekly proposals, 2026-09-26 — preregistration

- Title: round 25, item 2's five process proposals, (a) to (e), adopted as one governance docs piece, with the one tool change (b) needs.
- Authority: PLAN node `governance-weekly-proposals-2026-09-26`; round 25, item 2 (the ruling, and its condition on (b)); `state/questions/round-25.md` item 2, (a) to (e), the proposals the ruling adopts; the record cap, `state/directives/2026-09-18-record-cap.md` (this batch is the week's allowance).
- Drafted by: the architect agent on the custodian's consult brief, from the files §0 names, read in the main checkout at `main` 522493a. No shell: every hash, count and run below is the worker's or the reviewer's.
- Branch: `governance/weekly-proposals-2026-09-26`, cut from `main` at `a5d8b8b`.
- Committed before any change, per the template's header rule. Full form and full gating (`AUTONOMY.md` §21a), for three reasons: nine non-generated files outside §21c's exempt set change (§7), past §21c's file bound; (e) applied to this piece, since its Out-of-scope line could not assert that no §21a category is touched (the gating of a broken rooted cite is a property under test, in `runVerifyCites gates a broken rooted reference, ignores doc-number, advises a loose one`, and §2.2 narrows where it holds); and it changes what both gates fail by name.
- Append-only once committed; an amendment written after any outcome has been seen says so in its first line.

## §0. Disclosure

- Informed by the ruling and the proposals, and by the files the texts land in, each read to its last line at 522493a: the template ends with the short form's closing paragraph, `AUTONOMY.md` with §23, `AI_DEVELOPMENT.md` with Amendment 3 to the Custodian role, and the three agent files with their closing paragraph.
- The template's class list runs 1 to 7 (class 7 on round 14, item 2), so the new classes are 8 and 9.
- `scripts/plan/verify-cites.mjs` at 522493a exempts one prefix, `state/drafts/`, in `runVerifyCites`; none of the 14 tests in `scripts/plan/verify-cites.test.mjs` covers it.
- `scripts/plan/verify-mutation.mjs` at 522493a: its header's WHAT THIS DOES NOT GUARANTEE paragraph.
- The examples the proposals name: the test-claims follow-ups form's Amendment 1 (a §7 overrun recorded as class 2); the source-change watcher's Amendments 3, 4 and 6 and its fix ruling's residual (the E5 pin), read on `cut/source-change-watcher`; the note of PR #116's architect gate (`state/gate-log.json`, node `kernel-ticket-drop-under-registry-lock`, architect attempt 2).
- Sibling search: `verify-quotes` and `verify-test-claims` do not read `state/consults/`, so `verify-cites` is the only tool (b) touches.
- No pilot, corpus, fixture drive or measurement.

## §1. What this preregistration may and may not claim

No performance number, no docs/08 row, no wire, no ADR, no byte of docs/01 or any docs/NN, no user-visible product string. No class 1–7 number or text changes; no landed record's byte changes; no filed report moves. Every governing-doc change is an append after the file's last line. It adopts nothing beyond round 25, item 2 (a) to (e) and the ruling's condition on (b); a gap found while applying it is a ledger finding for the next weekly window (2026-10-02), not a clause (the record cap, point (2)).

## §2. The change — stated before it is applied

1. **Texts.** T1–T6 (Appendix T), each appended at the end of its file: after the file's current last line, one empty line, then the block's lines exactly (fence lines excluded), the file ending in one LF. If a file lacks a final LF, one is added first; no other byte above changes. The worker copies each block by script from this form at its commit, never by hand.
   - T1 `docs/PREREGISTRATION-TEMPLATE.md`: classes 8 and 9 (a); (c); (d); (e).
   - T2 `AUTONOMY.md` §24: (b); (e).
   - T3 `AI_DEVELOPMENT.md`, Amendment 4 to the Custodian role: the custodian's half of all five.
   - T4 `.claude/agents/architect.md`, T5 `.claude/agents/reviewer.md`: the gate checks and the reviewed-commit first line.
   - T6 `.claude/agents/worker.md`: the worker's half of (a), (c), (d).
2. **Tool change, `scripts/plan/verify-cites.mjs`.**
   - One module-level constant, not exported, listing exactly two prefixes, `state/drafts/` then `state/consults/gates/`, each ending in a slash.
   - `runVerifyCites`'s `archived` test reads that list: a file whose repo-relative path starts with either prefix is archived. Nothing else in the function changes.
   - The comment above `archived` keeps its round-14 sentence and gains one: files under `state/consults/gates/` are filed gate reports (round 25, item 2 (b)), each naming the commit it reviewed, so a broken cite there is advisory too.
   - Nothing else in the file changes.
3. **PLAN.yaml**, in this form's commit only: the node's `gate` becomes this form. Nothing else.

## §3. Fixtures / corpus — pre-declared outcomes

No corpus. One unit fixture, built inside the new test with the test file's own `gitTree`: a three-line `engine/src/pool.rs` and four one-line markdown files, each citing that file at a line past its end.

| Citing file | Cited line | Predicted tier |
|---|---|---|
| `state/consults/gates/2026-09-27-example-gate1-reviewer.md` | 99 | advisory |
| `state/drafts/example.md` | 98 | advisory |
| `state/consults/2026-09-27-example-consult.md` | 97 | gated |
| `state/consults/gates-example.md` | 96 | gated |

## §4. Tests, and the mutation per new test

1. `a_broken_rooted_cite_in_a_filed_gate_report_is_advisory_and_its_siblings_stay_gated`, appended at the end of `scripts/plan/verify-cites.test.mjs`. It runs `runVerifyCites` over §3's tree and asserts that `gated` holds exactly the line-97 and line-96 findings and `advisory` exactly the line-99 and line-98 findings, each naming its citing file. It removes its temp tree in a `finally`.
   - A RECORDED MUTATION comment above it records each mutation applied, the test run, the failure by name with the commit observed at, and the revert. The comment describes the fixture cites in words and carries no `path:line` token.
   - M1, the registered mutation: `state/consults/gates/` removed from the list. The line-99 cite is gated.
   - M2: that prefix written without its trailing slash. The line-96 cite is advisory.
   - M3: `state/drafts/` removed from the list. The line-98 cite is gated.
2. The 14 existing tests are unchanged, byte for byte.

No test covers T1–T6; §9's byte check does.

## §5. Registered predictions · declared unchanged · invalidators · falsification

- P1. The file's 15 tests pass at the head; each of M1–M3 fails the new test by name, and no other test.
- P2. `node scripts/plan/verify-cites.mjs` at the head exits 0, with the same advisory findings as at the merge base.
- P3. `verify-quotes`, `verify-test-claims`, `verify-mutation --base origin/main --head HEAD` (one new test, its mutation recorded), `verify.mjs --offline`, `queue.mjs --check` and `site.mjs --check` exit 0 at the head.
- P4. For each of the six governing files, `git diff --numstat <merge-base>...HEAD -- <file>` shows 0 deletions.
- Declared unchanged: `verify-cites`' recognizer, tiers, classification, printed format and exit codes; every existing test; `verify-quotes`, `verify-test-claims`, `verify-mutation`; every file under `state/consults/` and `state/drafts/`; template classes 1–7; every byte above each governing file's pre-piece end; no export added.
- Invalidators (STOP, to the custodian and the architect; the worker never edits a T block):
  - at the branch point, the template's class list does not end at class 7, `AUTONOMY.md` has a §24, or `AI_DEVELOPMENT.md` has an Amendment 4 to the Custodian role;
  - a T block cannot be applied without changing a byte above its file's end;
  - any §9 tool fails at the head on a T block's text;
  - a file lands under `state/consults/gates/` on main before this piece merges.
- Falsification: the new test passes under M1.

## §6. Instruments

Assertions only. The temp-directory check counts `verify-cites-git-*` entries under the OS temp directory before and after one run of the new test alone (`--test-name-pattern`).

## §7. Declared values and ceilings

- The prefix list: exactly `state/drafts/`, `state/consults/gates/`.
- Budget: <= 80 insertions plus deletions over `scripts/plan/verify-cites.mjs` and `scripts/plan/verify-cites.test.mjs` (`git diff --numstat <merge-base>...HEAD -- <the two files>`). T1–T6 are docs fixed by Appendix T, not code or tests, and are not counted (§21c).
- At most 10 non-generated files: this form, `PLAN.yaml`, the six governing files, the two script files. The generated set (`CUSTODIAN-QUEUE.md`, `CUSTODIAN-QUEUE.json`, `site/index.html`, `site/data/*.json`) is regenerated, not counted.
- An overrun is recorded as class 8, T1's definition.
- PLAN: `gate` is this form; `budget_minutes` stays 120.
- Record correction: at most two rounds (the record cap, point (3)).

## §8. Block-on-sight

1. Any byte changed above the pre-piece last line of any of the six governing files.
2. An appended text not byte-identical to its T block.
3. A class renumbered, or any class 1–7 text changed.
4. In `verify-cites.mjs`: an export added; a prefix other than the two; a prefix without its trailing slash; any change outside the constant, the comment above `archived` and the `archived` line.
5. An existing test in `verify-cites.test.mjs` changed, in title or body.
6. A file under `state/consults/` or `state/drafts/` moved, renamed or edited.
7. Rule text beyond round 25, item 2 (a) to (e) and the ruling's condition on (b).
8. In a landed T block: a hash reference, a line cite into `DECISIONS-PENDING.md`, a reproduced ruling, or quotation marks around a passage attributed to another file.
9. The new test leaves its temp tree behind.
10. `PLAN.yaml` with CRLF line endings, or a `PLAN.yaml` change outside §2.3.
11. Any byte of an ADR, docs/01 or docs/NN.

## §9. Gates

- **Architect and reviewer**, full gating (§21a). Each report's first line names the branch and the commit reviewed. This piece's reports are filed under `state/consults/` as before; T2's rule takes effect at the merge.
- **Byte check**, run mechanically by the reviewer: a script extracts each T block from this form at the form's commit and compares it with its file's appended tail at the head; then P4.
- **Mutation**: the reviewer re-applies M1 at the head and observes the failure by name. A green `verify-mutation` is not the observation (T1's (c)).
- **Suites**: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`.
- **Self-checks**, each result naming its commit: verify-cites, verify-quotes, verify-test-claims, verify-mutation (`--base origin/main --head HEAD`), `verify.mjs --offline`, `queue.mjs --check`, `site.mjs --check`.
- **Temp-directory delta**: 0 (§6).
- **Operator**: none.

## §10. Amendments — opens empty, append-only

*(Empty. Append-only from this commit.)*

## Appendix T — the adopted texts, each appended at the end of its file (§2.1)

### T1 — appended at the end of `docs/PREREGISTRATION-TEMPLATE.md`

~~~
---

## Round 25 additions (the human, 2026-09-26, round 25, item 2; appended at the end so that no line a record cites above it moves)

*Round 25, item 2 adopted (a) to (e) of `state/questions/round-25.md` item 2 as one governance piece, this week's allowance under the record cap (`state/directives/2026-09-18-record-cap.md`); each is cited by round and item and not reproduced, and the operative text is this section's own. §10's class list now runs 1 to 9: classes 8 and 9 join classes 1 to 7 above, whose numbers and texts are unchanged. No record written before this section is re-labelled.*

8. **Budget overrun, full form, §7 not edited** (round 25, item 2 (a)) — a full-form piece exceeded a line budget or a file count its §7 declares. Its first line carries the words `budget overrun, §7 not edited`. It records the declared figure, the final figure by §7's own counting command at a named commit (by §21c's counting rule where §7 names none), and the reason; the §7 line is **never** edited to match. It opens no gate route, since the piece is already under full gating. Class 6 stays the short form's budget class, and class 2 stays the class of a missed §3/§5 prediction; an overrun recorded as class 2 before this section (round 23, item 4, O7) keeps its label.
9. **Scope addition on a standing rule** (round 25, item 2 (a)) — a standing rule of the human, a permanent ruling or a standing directive, adds work to a piece already preregistered. Not class 5, which narrows. Its first line carries the words `scope addition` and cites the rule by round and item, or by the directive's path, without reproducing it. Before any code of the addition, the amendment declares it as the form declares everything else: its §2 shape, its §4 tests each with a mutation, what §5 declares unchanged and what would invalidate it, and its §8 and §9 items. An addition recorded as class 5 before this section (the source-change watcher's Amendment 4) keeps its label. In a short-form piece, an addition that brings a §21a category follows §21b's mid-piece clause.

**Mutation-observation wording** (round 25, item 2 (c)). `scripts/plan/verify-mutation.mjs` at `a5d8b8b` checks that a mutation is recorded and runs none (its header's WHAT THIS DOES NOT GUARANTEE paragraph). No record calls a `verify-mutation` run an observation of a mutation, or names one as a mutation's observation of record. A mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it; that run, or the gate report that made it, is the observation of record. A later record stating that the tool runs mutations names the tool's commit (round 15 (c)).

**A test-text span on an unmerged branch** (round 25, item 2 (d)). When the span a class-3 test-text row pins exists only at a commit not yet on main, the row names it by that commit's id until merge, in words and with no hash: lines <a>-<b> of `<path>` at `<commit>`. Round 15 (e) forbids a hash reference at a branch commit in an append-only record, and the words form carries no `path:line` token for `verify-cites` to read against a later tree. The piece's PR body names the row and asks for a merge that keeps the commit reachable from main, never a squash. After the merge, the hash pin follows on main as an appended class-3 row, `<path>:<a>-<b> @ <commit> sha256:<hex>`, carried until then by a PLAN node blocked on the piece.

**Out-of-scope at dispatch** (round 25, item 2 (e)). When the `Out-of-scope` line a piece would carry at dispatch names a §21a category as touched, anything short of asserting that the piece touches none of the four, the piece takes the full form and full gating from dispatch, and no five-line form is committed for it. A category first found mid-piece still follows §21b's mid-piece clause, and a five-line form already committed is not rewritten.
~~~

### T2 — appended at the end of `AUTONOMY.md`, after §23

~~~
## §24. Gate reports under `state/consults/gates/`, and the full form at dispatch (the human, 2026-09-26, round 25, item 2; appended after §23 so that no line a record cites above it moves)

Round 25, item 2 adopted (a) to (e) of `state/questions/round-25.md` item 2 as one governance piece, this week's allowance under the record cap; each is cited by round and item and not reproduced. Classes 8 and 9 (a), the mutation-observation wording (c) and the commit-named test-text span (d) live in `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions; (b) and (e) live here.

**(b) Gate reports are filed under `state/consults/gates/`, each naming the commit it reviewed.** From the merge of the piece that adds this section, the custodian files every architect or reviewer gate report as `state/consults/gates/<date>-<piece>-gate<n>-<architect|reviewer>.md`. Its first line is the custodian's filing note, which names the gate, the attempt, the PLAN node and the reviewed commit, as `Reviewed: <branch> @ <commit id>`: the human's condition in the same ruling, so that the report's cites resolve against something fixed. Below the note the report is the agent's hand-back, byte-identical; a cite to a line that exists only on the reviewed branch is read at the named commit and is not rewritten. `scripts/plan/verify-cites.mjs` reports a broken cite in a file under `state/consults/gates/` as advisory, never gated, as it does under `state/drafts/`, tracked as record under round 14, item 4. Reports filed before that merge stay under `state/consults/`, where records cite them by path: none is moved, and their cites stay gated. A record that invokes a line of a filed report still pins it at a commit on main with its hash (round 12 (b), round 15 (e)): the advisory tier covers a report's own cites, never a record's cite into a report.

**(e) The full form at dispatch.** When the `Out-of-scope` line a piece would carry at dispatch names a §21a category as touched, anything short of asserting that the piece touches none of the four, the piece takes the full form and full gating (§21a) from dispatch, and no five-line form (§21d) is committed for it. The rule is the note of the architect gate on PR #116 (`state/gate-log.json`, node `kernel-ticket-drop-under-registry-lock`, architect attempt 2). A category first found mid-piece follows §21b's mid-piece clause as before, and a five-line form already committed is not rewritten.
~~~

### T3 — appended at the end of `AI_DEVELOPMENT.md`, after Amendment 3 to the Custodian role

~~~
## Amendment 4 to the Custodian role — the round-25 process rules (2026-09-26, appended on the human's ruling of the same day, round 25, item 2; appended at the end so that no line a record cites above it moves)

- **The rules and where they live.** Round 25, item 2 adopted the week's five proposals as one governance piece, this week's allowance under the record cap; the next weekly window falls due 2026-10-02. Classes 8 and 9, the mutation-observation wording and the commit-named test-text span are in `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions; gate-report filing and the full form at dispatch are `AUTONOMY.md` §24. The custodian's half is below.
- **Filing a gate report.** File it under `state/consults/gates/`, byte-identical below a one-line filing note naming the gate, the attempt, the PLAN node and `Reviewed: <branch> @ <commit id>`. Take the commit from the report's own first line; where the report names none, take it from the dispatch that launched the gate and say so in the note. No branch-only cite is rewritten. A branch whose commit a filed report names is not deleted until that commit is reachable from main or from its PR's ref. Reports filed before this amendment's merge are not moved.
- **Dispatch.** Before writing a five-line form, draft its `Out-of-scope` line; if it names a §21a category as touched, write the full form instead and dispatch the piece for full gating.
- **A commit-named test-text span.** When a piece carries a class-3 test-text row named by a branch commit, its PR body names the row and asks for a merge that keeps that commit reachable, never a squash; the custodian adds a PLAN node, blocked on the piece, that appends the hash pin on main after the merge (the precedent is the source-change watcher's E5 pin).
- **Briefs and mutations.** A brief never asks for a `verify-mutation` run as a mutation's observation; it asks for the mutation applied, the test run, the failure recorded by name with its commit, and the mutation reverted.
~~~

### T4 — appended at the end of `.claude/agents/architect.md`, after the Output format paragraph

~~~
Round 25, item 2 (the human, 2026-09-26; the rules are `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions and `AUTONOMY.md` §24, cited there by round and item). Your report's first line, beside the verdict, names the branch and the commit you reviewed, as `<branch> @ <commit id>`: the report is filed under `state/consults/gates/`, and its cites are read at that commit. From the merge of the piece that adds these rules, the gate fails by name: a full-form §7 overrun not recorded as class 8, or its §7 line edited to match; a scope addition on a standing rule not recorded as class 9, or any code of it landed before the amendment that declares it; a record that calls a `verify-mutation` run an observation of a mutation; a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id; a piece dispatched on a five-line form whose `Out-of-scope` line named a §21a category.
~~~

### T5 — appended at the end of `.claude/agents/reviewer.md`, after the Output paragraph

~~~
Round 25, item 2 (the human, 2026-09-26; the rules are `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions and `AUTONOMY.md` §24, cited there by round and item). Your report's first line, beside the verdict, names the branch and the commit you reviewed, as `<branch> @ <commit id>`: the report is filed under `state/consults/gates/`, and its cites are read at that commit. From the merge of the piece that adds these rules, fail by name: a full-form §7 overrun not recorded as class 8, or its §7 line edited to match; a scope addition on a standing rule not recorded as class 9, or any code of it landed before the amendment that declares it; a record that calls a `verify-mutation` run an observation of a mutation; a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id. Reading a five-line form's `Out-of-scope` line first (§21d), fail by name one that names a §21a category as touched: the piece takes the full form.
~~~

### T6 — appended at the end of `.claude/agents/worker.md`, after the Report format paragraph

~~~
Round 25, item 2 (the human, 2026-09-26; the rules are `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions, cited there by round and item). In every record you write: a full-form §7 budget overrun is class 8, and its §7 line is never edited; a scope addition on a standing rule is class 9, declared before any code of it; never call a `verify-mutation` run an observation of a mutation, because the tool at the commit that section names checks that a mutation is recorded and runs none: you observe a mutation by applying it, running the test, recording its failure by name with the commit, and reverting it; a span a class-3 test-text row pins that exists only on your unmerged branch is named in words, lines <a>-<b> of its path at its commit id, with no hash, and its pin follows on main after the merge.
