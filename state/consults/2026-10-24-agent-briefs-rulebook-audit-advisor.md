# Audit of the agent briefs and the rulebook (2026-10-24)

*An advisory, read-only audit: findings and proposals, not rulings. Read at main `ae8cfdcc5dd632473a561a48c4401a08ccd8cb0e` (2026-10-24T16:13:44+02:00). Every cite below is `path:line @ ae8cfdcc` unless it names another commit. Nothing in the repository was edited. An independent checker re-verified the findings before delivery (section 9).*

## 0. Scope, method and key

- **Read in full, rule by rule:** the eight agent definitions in `.claude/agents/` and `CLAUDE.md`.
- **Read in full to cross-check:** `AUTONOMY.md`, `AI_DEVELOPMENT.md` and `PRECEDENTS.md`. Their superseded and conflicting statements are listed in section 5; their other rules are not classified one by one.
- **Context at the same commit:** `state/gate-log.json`, `state/directives/`, the forms' amendment notes.
- **Who decides:** what a gate checks is the human's (`PRECEDENTS.md` P-005's limit: tooling fixes are "not a licence to add a dependency or change what a gate checks for", `PRECEDENTS.md:90-91`). Section 7 is proposals for the architect to draft and the human to word or approve.

| Class | Meaning |
|---|---|
| KEEP | active and consistent |
| STALE | states a fact that is no longer true |
| SUPERSEDED | a later rule replaced it, and the old text still reads as live |
| CONFLICT | two live texts disagree and nothing says which wins |
| DORMANT | governs work this agent no longer does |
| MISPLACED | an instruction for a different actor |
| OLD-STYLE | phrasing aimed at older models (emphatic dispatch triggers) |
| VERIFY | depends on a fact this audit could not check |

## 1. Findings in brief

1. **The worker and gate briefs are mostly one block of September rulings, loaded on every dispatch.**
   - `architect.md`: line 11 is 11,249 of the file's 16,356 bytes (69%).
   - `reviewer.md`: lines 18–25 are 10,930 of 16,417 bytes (67%).
   - `worker.md`: lines 17–25 are 10,714 of 13,382 bytes (80%).
   - About 37 sentences (about 13 KB) are identical in the architect's and the reviewer's briefs; about 10 KB of that is in the September block.
   - The same rulings appear a fourth time in `AI_DEVELOPMENT.md` "Gates and rule 7" (`AI_DEVELOPMENT.md:271-302`).
2. **The gate briefs contradict themselves, and only a catch-all sentence settles it.**
   - The September block says many failures block or "fail by name": 11 "fails/blocks … by name" phrases in the architect's brief and 12 in the reviewer's, most of them on record or documentation findings.
   - The 2026-10-05 paragraph (`.claude/agents/architect.md:17`, `.claude/agents/reviewer.md:31`) says documentation and record findings never fail a gate. It adds: "Where this definition elsewhere calls a documentation or record finding a failure or a block (the record-fidelity items above among them), that finding is now reported under this paragraph".
   - Every gate run has to reconcile the two.
3. **Much of the block governs work that no longer happens.**
   - **Record-correction rounds:** no gate-log entry has carried `record: true` since 2026-10-05. There were 86 in September and 7 on 1–4 October.
   - **Amendments:** 304 amendment notes in the forms name their writer (`*Written by …`, a convention in use by 2026-10-04 at the latest; the clone read here has history from 2026-10-09 only). 302 name the custodian, 2 the architect, none a worker.
   - So the worker brief's "In every amendment you write" and "In every closing amendment you write" rules have no current use.
4. **Stale facts in the briefs:**
   - the ADR-003 spike called "the current gate" (it concluded 2026-08-03);
   - verify-quotes conditionals "once it is on main" (it is on main);
   - the tester's ADR-003 Results-table rule.
5. **Superseded rules stay where a reader meets them first.**
   - Since 2026-09-19, `AUTONOMY.md` and `AI_DEVELOPMENT.md` have mostly been appended to rather than edited in place, so that unpinned line cites into them stay stable. This is a practice; neither file states it as a rule.
   - `AUTONOMY.md`'s last 13 sections (§23–§35) are each appended "so that no line a record cites above it moves".
   - §0, §3, §4, §6a, §9, §14 and §16 still read as live, although later sections or directives replaced them. Section 5 lists them.
6. **Old-model phrasing is a small share:** two descriptions say "Use PROACTIVELY". The problem is accumulation and layering, not old-model prompting.
7. **`evidence-reader.md` is the model** the others could follow: narrow modes, a task-packet contract, inputs treated as data, a turn cap, `omitClaudeMd`, and a compact output.

## 2. The gate briefs

### `.claude/agents/architect.md`

| Line | Text (short) | Class | Note |
|---|---|---|---|
| 3 | description: "Use PROACTIVELY before starting non-trivial features and before merging anything that touches architecture." | OLD-STYLE; STALE | The architect's two main jobs are drafting forms and the architect's half of each full-form gate round (`AUTONOMY.md` §21a). The description names neither. An emphatic trigger invites the main session to dispatch on its own judgment. |
| 9 | constitution, cite by number, lower-number-wins | KEEP | |
| 11 | check order: principles · boundaries · operation class · perf budget · scope "against the roadmap (docs/07) and the current gate (ADR-003 spike)" | KEEP; the ADR-003 clause is STALE | The spike concluded 2026-08-03 (`CLAUDE.md:8`). |
| 11 | cross-module seams, the caller rule, its two exemptions | KEEP | Active, with a recorded cost (`AI_DEVELOPMENT.md:277-278`). |
| 11 | verbatim quotes, the tool is a floor, elisions | KEEP | The clause "(`node scripts/plan/verify-quotes.mjs` once it is on main)" is STALE. |
| 11 | round 12 (a)(b)(c) and the hash form | KEEP | Cite forms for every record a gate reads. |
| 11 | round 12 (d)(e): correction at most three sentences; superseded index; the gate "fails by name" on either | DORMANT; verdict SUPERSEDED by :17 | Record-correction mechanics. |
| 11 | round 14: (a′), no bare self-line, a pin is historical, nothing cites untracked Authority | KEEP as cite rules; "fails by name" SUPERSEDED by :17 | A misquote of the human marked verbatim stays Correctness or Evidence under :17. |
| 11 | round 15 (a) consult resolution step, (c) tool claims name their commit, (d) one-line references, (e) hash references at a main commit | KEEP as rules; verdict effect per :17 | |
| 11 | round 15 (b) re-scope per-row step, (f) restore bound, (g) class 1 for withdrawal rows | DORMANT | Record-correction mechanics. |
| 11 | record cap: the first sentence ("the smallest text a gate can verify"; closing amendment = references and hashes) | KEEP | |
| 11 | record cap: "record correction is two rounds per piece, after which the architect reduces the record to references" | DORMANT since 2026-10-05 | |
| 11 | the untracked-Authority rule dated non-retroactive | DORMANT | A historical rider. |
| 11 | discharge claims name their proof; engine messages state engine facts | KEEP | |
| 13 | "**Verdict** (pass / pass with notes / block)" | CONFLICT (minor) | The gate log records PASS / PASS WITH NOTES / FAIL, and :17 maps the output onto `AUTONOMY.md` §22's three verdicts. One vocabulary would do. |
| 15 | round 25 item 2: the report's first line names `<branch> @ <commit id>`; the five-line form's Out-of-scope check | KEEP | |
| 15 | round 25 item 2: class 8 and class 9 recording, mutation-observation wording, test-text span pins "fail by name" | verdict SUPERSEDED by :17 | Documentation must-fix. |
| 17 | proportional gates (2026-10-05) | KEEP | Should be the only verdict rule. |
| 19 | wording blocks (2026-10-11) | KEEP | Nearly identical to `.claude/agents/reviewer.md:33` (similarity ratio 0.996). |

### `.claude/agents/reviewer.md`

| Line | Text (short) | Class | Note |
|---|---|---|---|
| 3 | description: "Use PROACTIVELY after writing or modifying significant code, before every commit." | OLD-STYLE; CONFLICT | The custodian's records commit straight to main with no gate: "PLAN.yaml, the records under state/, the gate log, forms' amendments, DECISIONS-PENDING.md and CUT-STATE.md are the custodian's and commit straight to main; everything under a gate goes through a PR." (`state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:27`) |
| 11–17 | checklist 1–7: correctness, blocking, JSON on a data path, CRS as a type, unmeasured perf claims, float precision, missing tests | KEEP | The gate's product substance. |
| 18–25 | item 8: the same September block as `.claude/agents/architect.md:11` | as in the architect's table | "(`node scripts/plan/verify-quotes.mjs` once it is on main)" is STALE. |
| 27 | "Output: blocking issues first (with doc citations), then suggestions, then nits." | SUPERSEDED by :31 | :31 says "each Documentation finding is listed as must-fix before the merge, not as an optional suggestion or nit." |
| 29 | round 25 item 2 | as `.claude/agents/architect.md:15` | |
| 31, 33 | proportional gates; wording blocks | KEEP | |

## 3. The worker, tester, variant, lead-data and evidence-reader briefs

### `.claude/agents/worker.md`

| Line | Text (short) | Class | Note |
|---|---|---|---|
| 3, 9–15 | scope from the piece; the constitution binds; the state file; `git commit -s`; never touch red lines | KEEP | |
| 17–24 | cross-module seams; the caller grep, pasted in the report | KEEP | |
| 25 | the two caller-rule exemptions | KEEP | |
| 25 | verbatim quotes; run verify-quotes before a gate "(or the same script from `governance/verify-quotes` until it is on main)" | KEEP; the conditional is STALE | |
| 25 | "Dispatch mechanic (the same ruling): "record-correction rounds always go to a fresh worker — fidelity work never runs from a long context."" | MISPLACED | A rule for the custodian, also at `AI_DEVELOPMENT.md:308`; a worker cannot act on it. |
| 25 | round 12 (a)–(c); round 14's cite and pin rules; round 15 (c)(d)(e) | KEEP | They govern the worker's report and any record line it writes. |
| 25 | round 12 (d)(e); "In every amendment you write…"; "In every record you write: … a correction of test text is class 3 by named exception"; round 15 (a)(b)(f)(g); record cap "In every closing amendment you write…" | DORMANT | The custodian writes every amendment and closing record (section 1, item 3), and there have been no record rounds since 2026-10-05. |
| 25 | discharge claims; engine messages | KEEP | |
| 27 | the four-failure-class self-check; the model, overrides and handoffs in the report | KEEP | |
| 29–31 | report format, about 20 lines | KEEP | |
| 33 | never call a verify-mutation run an observation; how to observe a mutation | KEEP | |
| 33 | class 8 and class 9 recording; naming a test-text span on an unmerged branch | DORMANT for workers | These go in the custodian's amendments. |

### `.claude/agents/tester.md`

| Line | Text (short) | Class | Note |
|---|---|---|---|
| 3, 11, 13–15 | measured numbers with method; committed scripts; regressions reported loudly; PROJ and PostGIS reference values | KEEP | |
| 12 | "For the ADR-003 spike, fill the Results table in `spikes/adr-003-crs-rendering/README.md`" … "A milestone without filled metrics is not done." | STALE | The spike concluded 2026-08-03. |
| 17 | report additions | KEEP | |

### `worker-high.md` and `tester-high.md`: VERIFY

- **What they are:** effort-only variants that read the base file. They exist because "The Agent tool here has no per-dispatch effort control — say so, never pretend." (`AI_DEVELOPMENT.md:309-310`, rejoined across the line break).
- **Why that may have changed:** this advisory session's Agent tool, a Claude Code build, takes an effort value per call.
- **What to do:** if the installed version (`claude --version` 2.1.304, `scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md`, Amendment 9 item 6) does too, both files and that sentence can go. Check against that version's documentation first, as `AUTONOMY.md` Appendix A asks (`AUTONOMY.md:399`).

### `.claude/agents/lead-data.md`: KEEP as written

- **Its text matches current use:**
  - it drafted the forms committed on 2026-10-24 for the covering-case collision (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md:9`) and the publish sort window (`kernel/PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI-PREREGISTRATION.md:22`);
  - it keeps the engine owner's index (last changed 2026-10-21);
  - the human ordered an impact read on 2026-10-21 (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:12`).
- **The issue is its status in the rulebook** (section 5).

### `.claude/agents/evidence-reader.md`: KEEP all

## 4. `CLAUDE.md` (loaded into every session, and every agent except evidence-reader)

| Line | Text (short) | Class | Note |
|---|---|---|---|
| 8 | "**Current focus: the follow-ups after v0.1.0.**" | STALE | Product first since 2026-10-05 (`state/directives/2026-10-05-product-first-direction.md`). The same sentence's second half ("the work in hand is what `PLAN.yaml` places and `CUSTODIAN-QUEUE.md` lists") is right and enough. The ADR-010 and ADR-011 notes stay: ADR-011 is still Proposed (`docs/adr/ADR-011-tiled-render-batches-gpu-cache-lifecycle.md:3`). |
| 12–17, 21–24, 28, 32–34, 38 | non-negotiables, layout, environment, custodian pointer, workflow | KEEP | |

## 5. The rulebook: superseded and conflicting statements

### `AUTONOMY.md`

| Statement | Class | Replaced by |
|---|---|---|
| §0, the reading order, five items (:7-13) | SUPERSEDED | §26 (:484-490), §33 Part A (iv) (:600) and §34 Part B (v) (:666). The current list is `READING_ORDER`, `scripts/hooks/session-resume.mjs:28-34`. |
| §3, the Stop hook's decision order (:86-93) | SUPERSEDED | §30 (:525). |
| §4: the custodian writes the round file and runs the mirror CLI before the first AskUserQuestion (:108-115) | SUPERSEDED, in direct conflict | §28: "The custodian writes no round file by hand for a call and runs no mirror CLI before one." (:508) |
| §4 :115 and §16 :278: the mirror "ships on `governance/telegram-round-mirror`, PR #69" | STALE | The hook is wired in `.claude/settings.json`. |
| §6a :146: "They are not yet on `main`" | STALE | `scripts/plan/verify-cites.mjs` and `scripts/plan/verify-test-claims.mjs` are on main. |
| §14 :222-226: "once that piece lands" | STALE | Same. |
| §9, docs-only auto-merge (:193-195) | SUPERSEDED, unmarked | "Unchanged: every merge is my click, as a merge commit; AUTONOMY section 9's auto-merge stays unused" (`state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:12`). |
| the header (:5) and Appendix B (:419-455): Claude Code 2.1.270 facts | VERIFY | The machine runs 2.1.304 (section 3). |
| §33 Part B, item 3's copied text (:631) | SUPERSEDED in part | The copied block still names round 50's Bash routing as standing. Item 3's source list (:626) and item 4 (:634) mark it withdrawn on 2026-10-11, but a reader of the block alone would apply it. |

### `AI_DEVELOPMENT.md`

| Statement | Class | Replaced by |
|---|---|---|
| :33-35, the working loop "… → ff-merge → push" | SUPERSEDED | The 2026-10-07 item 6 above: every merge is the human's click, as a merge commit. |
| :122-125 and Amendment 2 §B (:548-558), docs-only auto-merge | SUPERSEDED, unmarked | Same. |
| :256-261, "The citation-integrity scanner covers five files (2026-09-08)." … "widening the scanner is a NEXT-CUT tooling item" | SUPERSEDED | verify-cites and verify-quotes are on main (`AUTONOMY.md` §6a). |
| :309-310, no per-dispatch effort control | VERIFY | Section 3. |
| :338-340, "Applied decisions move to a dated "resolved" section in the same file." | SUPERSEDED | `AUTONOMY.md` §34: the resolved part rotates into `state/cut-archive/`. |
| :364, the chat report is "≤ 30 lines" | CONFLICT | `AUTONOMY.md` Appendix A (:417), 2026-09-13: "Report ≤20 lines per window". |
| :381-387, item 10: the state file moves to `state/cut-archive/` "(untracked, gitignored)" | SUPERSEDED | `AUTONOMY.md` §17 (:292): tracked. |
| :523-623, Amendment 2 §A–§H | DUPLICATE, drifted | It quotes `AUTONOMY.md` §7–§15 as verbatim, but §H's health-strip bullet (:618-619) no longer matches `AUTONOMY.md` §15 (:231). |
| :271-302, Gates and rule 7 | DUPLICATE | The fourth copy of the September rulings. Keep this one: it is the record, with each lesson's cost, and the briefs can point to it. |
| :747-751, "The data-path lead (pilot, from 2026-10-03)" | STALE status | The mandatory impact read ended: "2. The data lead's pilot: I end the mandatory impact read, as you recommend." (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:8`). lead-data still drafts forms and keeps the owner's index (section 3), so its standing is undefined. A decision for the human. |

### `PRECEDENTS.md`

- **Drifted cites:**
  - P-001 to P-006 and the matrix line that P-007 to P-016 share (`PRECEDENTS.md:27`, `:42`, `:57`, `:70`, `:84`, `:97`, `:111`) cite `AI_DEVELOPMENT.md:410-426` unpinned.
  - That text now sits 41 lines lower, at `AI_DEVELOPMENT.md:451-467`. For example, "Mechanical closure under §A." is at `AI_DEVELOPMENT.md:457`, cited as `:416`.
  - The quoted words are right; the line numbers are not.
- **Why CI misses it:** `scripts/plan/verify-cites.mjs` discloses that it does not catch a cited line that moved but stayed in range.
- **The rest:** P-029 to P-032 (`PRECEDENTS.md:395-433`, into `AI_DEVELOPMENT.md:44-51`) still match.

### Other

- **`state/NEXT-CUT.md`:** it still holds Brief A, ported 2026-09-10. `AI_DEVELOPMENT.md:381-387` says a brief is deleted by its cut's final docs commit. VERIFY whether Brief A is closed.

## 6. What a slimmer brief keeps (a sketch for the architect, not wording)

### Gate briefs, always loaded

1. The role and the constitution order.
2. The product checklist: the reviewer's items 1–7, and the architect's check order without the ADR-003 clause.
3. The active rules, one line each with its round and item, marked paraphrase (as round 12 (c) allows, and as :17 and :19 already do):
   - seams and the caller rule with its two exemptions;
   - the human's words quoted byte for byte, with the tool as a floor and honest elisions;
   - discharge claims name their proof;
   - engine messages state engine facts;
   - cite forms: round and item for rulings; `path:line @ <commit> sha256:<hex>` for lines; no bare self-line; tool claims name their commit; a pin is historical;
   - the five-line form's Out-of-scope check;
   - the report names `<branch> @ <commit id>`.
4. One verdict rule, the 2026-10-05 paragraph: Correctness or Evidence blocks; a Documentation finding is must-fix before the merge; three items are never documentation-only.
5. Wording blocks (2026-10-11), unchanged.
6. The output in `AUTONOMY.md` §22's three verdicts.

### Moved to a block the custodian pastes only into a record-correction dispatch

- round 12 (d)(e);
- round 15 (a)(b)(f)(g);
- the record cap's two-round rule;
- the untracked-Authority rider;
- class 8 and class 9 recording.

Rough size: 5–7 KB per gate brief, against about 16 KB today. This is an estimate, not a measurement.

### Worker brief

- **Keep:**
  - role, scope and constitution (:9-15);
  - seams and the caller rule with its exemptions (:17-25);
  - verbatim quotes and the verify-quotes run;
  - cite forms for its report;
  - discharge claims;
  - engine messages;
  - mutation observation (:33);
  - the four-class self-check and the report (:27-31).
- **Move out:** the amendment, closing-record and record-correction rules, and the custodian's dispatch sentence.
- **Rough size:** about 5 KB, against 13 KB (an estimate).

## 7. Proposals, ranked

1. **Gate briefs (architect, reviewer): restructure them as in section 6.**
   - Nothing is repealed. The September rulings stay quoted in `AI_DEVELOPMENT.md` "Gates and rule 7" and in the ruling archives, and the briefs point to them.
   - The architect drafts the new text with a table that maps every current sentence to one of: kept, referenced, moved to the record-correction block, or deleted as stale. The human approves.
   - One governance piece, a docs-only diff, the human's click.
2. **Worker brief:** the same treatment, in the next piece, so the effect of each change is read separately (item 9).
3. **Descriptions:** the architect's and the reviewer's descriptions say what each is dispatched for.
   - The architect: drafting forms, and the architect's half of each full-form gate round (`AUTONOMY.md` §21a).
   - The reviewer: the reviewer's half of each gate round, or the single gate of `AUTONOMY.md` §21b.
   - No "PROACTIVELY", no "before every commit".
4. **Stale lines, folded into 1 and 2:**
   - the architect's ADR-003 clause and `.claude/agents/tester.md:12`;
   - the three "on main" conditionals;
   - `.claude/agents/reviewer.md:27`;
   - the verdict vocabulary at `.claude/agents/architect.md:13`;
   - `CLAUDE.md:8`'s "Current focus".
5. **`AUTONOMY.md`:**
   - Append a §36 supersession index: one row per statement in section 5, with its replacement. Appending moves no line, so the append-only rule holds.
   - The bigger option is a full restructure, the way C and D were done: pin every `AUTONOMY.md:<line>` cite first, then rotate the old text into `state/cut-archive/`. Decide after the index shows how much is left.
6. **`AI_DEVELOPMENT.md`:** the same index, and the human's words on lead-data's standing (pilot ended, or a standing role).
7. **`PRECEDENTS.md`:** re-pin the seven drifted cites. This is a citation nit, delegated under P-003.
8. **Verify on the installed Claude Code:**
   - per-dispatch effort (if yes, retire the two `-high` files);
   - Appendix B's hook facts.
9. **Measure:** take a baseline from `state/gate-log.json` before 1 lands, and compare after the next ten gated pieces. Change the gate briefs first and the worker brief second, so each change is read on its own.
   - Baseline since 2026-10-11: 139 gate runs over 45 nodes, 3.1 per node.
   - FAIL: the architect 26 of 60, the reviewer 26 of 79.

Skills for the custodian's procedures (rotations, gate filing, the question round, closing records) are a candidate after 5, not before. First make the text consistent, then decide what moves out of it.

## 8. What not to cut

- The reviewer's product checklist and the architect's constitution checks.
- The seams and caller rule, the verbatim-quote rule and the discharge-claim rule. Each is active and has a recorded cost (`AI_DEVELOPMENT.md:271-302`).
- The 2026-10-05 and 2026-10-11 paragraphs.
- evidence-reader as it is.

## 9. Verification and limits

- **Independent re-check:** a separate agent that had not seen the work re-read every cite, quote and count at `ae8cfdcc`. About 140 claims were confirmed. Eight corrections were applied in this version:
  - the amendment-note convention's start date;
  - the sentence-overlap figure;
  - the architect's and reviewer's jobs, read as halves of one gate round;
  - the wording of the "by name" count;
  - the `AI_DEVELOPMENT.md:309-310` cite;
  - one range made consistent (`AI_DEVELOPMENT.md:271-302`);
  - §33 item 3's withdrawal marks;
  - "append-only" stated as a practice, not a rule.
- **Not verified:**
  - how often the custodian reads `AUTONOMY.md` or `AI_DEVELOPMENT.md` whole (this audit has no transcript access);
  - whether the installed Claude Code's Agent tool takes an effort value per call;
  - whether Brief A is closed;
  - any effect of brief size on gate outcomes (item 9 of section 7 is how to measure it).
- **Method:**
  - Byte counts are UTF-8.
  - Sentence overlap was counted by splitting on sentence ends and comparing sentences over 40 characters, across the whole files.
  - The "by name" phrases were counted by one regular expression over each file.
  - Gate-log counts come from `state/gate-log.json` at this commit.
