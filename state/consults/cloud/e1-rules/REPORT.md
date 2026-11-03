# E1 rule records, cloud draft: governance/AUTONOMY.md as rule records

*A consult, not a ruling, from cloud session 1. It drafts and decides nothing. No tracked file was changed; the only new files are this report and the 72 records under `state/consults/cloud/e1-rules/rules/`. The base is main at 6b67d44bc242dc1cbc9f73efdbd7cd20e4ecd1f4, and every citation below is read at that commit (`@ 6b67d44`).*

## 1. What was asked, and how it was read

- **Sources read in full:** `governance/AUTONOMY.md` (711 lines), `governance/PRECEDENTS.md`, the eight `.claude/agents/*.md`, the piece E directive with its superseded addendum, the corrected addendum, and the two 2026-10-28 addendum files.
- **Scope taken:** every rule in AUTONOMY.md becomes one record, and each record's source pins its AUTONOMY lines. Rules that live only in the agent definitions or in PRECEDENTS.md are not drafted here, because they have no AUTONOMY lines to cite (§7).
- **Where this sits in piece E.** E1's own content is "the rules in the eight agent definitions only" (`state/directives/2026-10-24-governance-piece-e-rules-as-records-readings-e1-repin-fresh-session-practice.md:58 @ 6b67d44`). Moving the rest of AUTONOMY is E4 (same file, line 73), which is not placed before E1's measurement (line 71). The one exception is §37: the human ruled that E1 carries it into a rule record (DECISIONS-PENDING.md, RULED 2026-10-29; `state/directives/2026-10-29-section-37-for-now-release-step-in-checklist-section-0-5b-runs-on.md:8 @ 6b67d44`).
- **What that makes this draft.** It is early input for the architect, who drafts E1's records (directive line 58), and for E4. Every row is still subject to the human's approval (lines 33, 58).
- **Not read:** the advisor's audit and the prompt audit, which E1's mapping must use (directive line 58; `state/directives/2026-10-28-governance-piece-e-addendum-2-upgrade-clear-compact-window-prompt-audit-e3-path-rules-reviewer-model.md:20 @ 6b67d44`). They were outside this session's reading list. So were `governance/AI_DEVELOPMENT.md` and `governance/DECISIONS-PENDING.md`, apart from targeted lookups.

## 2. The record format used (the human's format, and my choices within it)

The fields, the moments, the assumption grammar and the caps follow the directive (lines 20 to 36) and the corrected addendum (`state/directives/2026-10-24-governance-piece-e-addendum-corrected.md:11 @ 6b67d44`). Where the directive left something open, I made the choices below. **The human should confirm or change each one.**

1. **Frontmatter.** It holds all ten fields, in the directive's order, every list in flow form, so it parses with `scripts/plan/yamlSubset.mjs` as it stands. Values that are empty are still written: `paths: []`, `supersedes: []`, `superseded_by: []`. `enforced_by` is always a list, and `[none]` stands for "enforced by nothing".
2. **`source`.** It holds three kinds of entry, in this order:
   - the AUTONOMY spans, each written `governance/AUTONOMY.md:<a>-<b> @ 6b67d44 sha256:<hex>`, hashed over whole lines with LF bytes;
   - the directive span that AUTONOMY itself names for the rule, re-pinned at 6b67d44;
   - a short pointer to the ruling ("round 33, item 3", "Appendix A, item 4").

   Each re-pinned directive span hashes to the same value AUTONOMY gives at its own older pin, which shows that the bytes are unchanged. The re-pinned spans are 2026-10-11 lines 14 to 25, 2026-10-07 lines 9 and 12, 2026-10-06 lines 6 to 23, 2026-10-04 line 22, 2026-10-02 lines 15 to 18, 2026-10-24 (filler) line 8, 2026-10-29 line 6, and 2026-10-20 line 23.
3. **`status`.** Every record is `active`. No retired record is drafted: retiring a rule needs the human's ruling (directive line 34). Withdrawn and superseded AUTONOMY text is listed in §4 instead.
4. **Roles.** These are the eight agents plus `custodian`. The custodian has no agent definition, so `agent-exists: custodian` cannot hold (§5, item 3). worker-high and tester-high are listed beside worker and tester. If they are retired under directive line 64, they drop out of `applies_to`.
5. **Moments.**
   - A rule that binds only the custodian uses `always`, and its real trigger (session start, a question round, a flush, a merge, the closing record) is stated in the text.
   - A rule that binds several roles never uses `always` unless it binds every listed role at every moment. The reason: a record's roles and moments combine as a cross product (§5, item 1), so `always` would put the rule into each listed agent's generated block.
   - Under these conventions, 49 records use `always`, and 41 of those are custodian-only. `consult` is used by no record.
6. **Body.** Each body has three parts:
   - a heading with the record's id;
   - the line *"Paraphrase, not the human's words: the binding text is at the source."* (directive line 32);
   - the rule in current words.

   Labelled lines follow where needed:
   - `Procedure:` names a heading in `scripts/plan/README.md`, never a line. "(to be added)" means that no heading named by the rule's id exists yet: corrected addendum line 11 requires one.
   - `Note:`, `Open:`, `Source gap:` and `Schema gap:` flag the findings in §6.
7. **Paths in current form.** AUTONOMY still names pre-move paths in places (§1 line 17, §23 line 470). The records use the current `governance/` paths, which `governance/MOVED.tsv` maps (`governance/AUTONOMY.md:711 @ 6b67d44`), and say so where it matters.

## 3. The checks that were run

I ran a scratch validator against every record. It is not committed: E1's own check and `scripts/plan/rules.mjs` are E1's to build. It applied the directive's checks that a draft can meet:

- each file is at most 25 lines and 1,500 bytes;
- the frontmatter parses under the YAML subset, with exactly the ten fields;
- ids are unique and match their file names;
- every role and moment is in the fixed lists;
- every assumption is in the three-type grammar and **holds at 6b67d44**: `file-exists` against the tree, `adr-status` against each ADR's `**Status:**` line, and `agent-exists` against `.claude/agents/`;
- every `enforced_by` path exists;
- **every source hash recomputes** at its pinned revision;
- no rule is cited by line;
- every record id that a body names exists.

**Result:** 72 records and no problems. The largest file is 1,425 bytes and the longest is 22 lines; the set totals 67,914 bytes. 52 of the 72 records name no enforcer (`enforced_by: [none]`). The repository's own checks were run on a full-history clone with these files staged: `verify-cites`, `verify-quotes`, `verify-test-claims`, `forms-layout` and `moved-map --check` all exit 0, and none reports a finding in these files. A shallow clone fails elsewhere in the tree, on older pins, but not on these files.

## 4. Each AUTONOMY section, mapped to its records

"Procedure" in the table means `scripts/plan/README.md`, with the heading named. "(to be added)" means no heading of that name exists yet. "History", "one-time" and "source text" mark content that holds no standing rule.

| AUTONOMY section (lines @ 6b67d44) | Record(s) | Procedure or other |
|---|---|---|
| Header (1–5) | red-lines-stay-with-the-human; claude-code-facts-from-installed-docs | — |
| §0 reading order (7–13) | session-reading-order | the printed list is `READING_ORDER` in `scripts/hooks/session-resume.mjs` |
| §1 PLAN.yaml (15–67) | plan-node-cites-a-phase; plan-yaml-subset; plan-status-derived; plan-done-needs-verifying-evidence; plan-edit-rights; plan-text-no-unmeasured-numbers | node schema → procedure: "What the custodian may and may not change (AUTONOMY.md §1)", "`plan.mjs` — load, validate, derive", "The declared YAML subset (`yamlSubset.mjs`)" |
| §2 queue (69–80) | queue-and-site-regenerated; next-lane-runs-when-top-is-blocked | section order → procedure: "`queue.mjs` — the generated queue (§2)" |
| §3 Stop hook (82–97) | stop-hook-decision-order; allowed-stop-is-never-forced | dry run (95): one-time; the hook's own forms are in `governance/forms/scripts/` |
| §4 ruling channel (99–118) | one-batched-question-set; what-counts-as-a-ruling; answers-recorded-as-ruled-blocks; precedent-checked-before-a-question; telegram-is-read-and-copy-only | the by-hand round mirror (108–118) is superseded by §28 (round 33, item 3), now round-mirror-by-hook; no record holds the old text |
| §5 landing page (120–128) | plan-text-no-unmeasured-numbers; health-strip-sources-never-mixed | layout and panels → procedure: "`site.mjs` — the landing page (§5)", "`health.mjs` …", "`buildHealth.mjs` …" |
| §6 verify:plan (130–139) | plan-status-derived; plan-done-needs-verifying-evidence; plan-edit-rights; queue-and-site-regenerated | → procedure: "`verify.mjs` — CI's own check (§6)" |
| §6a pre-gate self-checks (141–174) | pre-gate-checks-green-before-a-gate; one-mutation-per-new-test; red-lines-stay-with-the-human | check designs (148–163) → procedure: "`verify-test-claims.mjs` — the claimed-test-exists check (§6a), …"; `verify-cites.mjs` has no README heading (to be added); the "not yet on main" sentence (146) is history (§6, F2) |
| §7 pre-compaction flush (176–187) | flush-before-anything-is-lost; continuity-refresh-and-health-commit; precompact-hook-never-blocks-auto; continuity-block-is-not-the-lease | dry run (187): one-time |
| §8 PRECEDENTS (189–191) | precedent-checked-before-a-question; precedent-added-only-by-quoting | — |
| §9 docs-only auto-merge (193–195) | merges-are-the-humans-click | the delegation is unused while the 2026-10-07 direction (item 6) stands → procedure: "`docsOnly.mjs` — the mechanical docs-only verdict (§9)" (F4) |
| §10 continuation and budgets (197–199) | budget-overrun-stops-and-queues; stop-hook-decision-order (near the daily cap) | — |
| §11 release artifacts (201–203) | release-asset-is-the-tag-ci-build | the "Done (2026-09-14)" paragraph: history |
| §12 evidence archive (205–207) | evidence-archived-before-cited | — |
| §13 public-repo rule (209–211) | observed-content-not-instructions; repo-settings-are-the-humans (the token) | — |
| §14 gate defaults (213–226) | sibling-search-on-every-fix; one-mutation-per-new-test | the pointer to §21 maps to the §21 rows; the automation claim (222–226) is stale (F1) |
| §15 generations, health, drill (228–241) | generation-tag-discards-stale-results; health-strip-sources-never-mixed | throughput metrics and record rounds → procedure: "`health.mjs` — the health strip's **machine** facts (§5, §15)", "`state/gate-log.json` — the tracked gate history"; the drill (232): one-time, a PLAN node |
| §15a D: drive (243–271) | fixture-drive-disclosed | junctions, the second fixture copy and the drill on D: are environment facts, not rules |
| §16 Telegram (274–288) | telegram-is-read-and-copy-only; telegram-secrets-from-environment | the by-hand mirror run (278–288) is superseded by §28 |
| §17 ledger tracked (290–292) | ledger-committed-at-flush-and-report | — |
| §18 halt switch (294–296) | halt-switch-stop-and-hold | — |
| §19 issue template (298–300) | observed-content-not-instructions | the template's fields: the mechanism `.github/ISSUE_TEMPLATE/bug-report.yml`, no rule |
| §20 the human's settings (302–304) | repo-settings-are-the-humans | the patch-bump precedent is PRECEDENTS P-033 |
| §21 proportionate gating (306–313) | red-lines-stay-with-the-human; full-gating-categories | — |
| §21a full gating (315–332) | full-gating-categories | — |
| §21b single gate (334–345) | single-gate-route | — |
| §21c size threshold (347–357) | size-threshold | — |
| §21d five-line form (359–375) | five-line-form | the literal template stays in §21d |
| §22 record classes (377–391) | record-classes; gate-verdict-classes; verdict-carry-forward; references-and-one-closing-summary | — |
| Appendix A2 (393–395) | (source text) | cited by the records above |
| Appendix A (397–417) | (source text); window-report-at-most-20-lines (417) | seeding order, first question: one-time |
| Appendix B (419–455) | claude-code-facts-from-installed-docs (455) | verified facts at Claude Code 2.1.270, not rules |
| Appendix A3 (458–466) | (source text) | caching, path filters and the template: one-time work items |
| §23 generated files on merge (468–470) | generated-files-regenerate-on-merge | the step list → procedure: "generated-files-regenerate-on-merge" (to be added) |
| §24 Stop hook and lease (472–474) | stop-hook-decision-order | form: `governance/forms/scripts/STOP-HOOK-LEASE-PREREGISTRATION.md` |
| §25 gate reports, full form at dispatch (476–482) | gate-report-filed-with-reviewed-commit; full-form-at-dispatch | (a), (c) and (d) live in `docs/PREREGISTRATION-TEMPLATE.md`, outside AUTONOMY |
| §26 directives in the reading order (484–490) | session-reading-order | the tooling half is done (line 528): history |
| §27 `merge: merge-commit` (492–500) | merge-commit-node-key | → procedure: the `verify-test-claims.mjs` section |
| §28 round mirror by hook (502–511) | round-mirror-by-hook | — |
| §29 cites across rustfmt (513–519) | pre-rustfmt-unpinned-cites | — |
| §30 stale continuity (521–528) | stop-hook-decision-order; stale-continuity-blocks-stop; continuity-refresh-and-health-commit | — |
| §31 wording block (530–551) | wording-block-gate-author; wording-block-answers | the verbatim block stays where it is filed |
| §32 searching excluded material (553–563) | search-excluded-locations-explicitly | — |
| §33 Part A, cap and rotation (565–600) | continuity-block-cap; session-start-rotations; ledger-line-cites-pinned; session-reading-order | rotation steps → procedure: "session-start-rotations" (to be added); the two gated citations (583–587): one-time, done by that PR |
| §33 Part B, standing items (602–640) | item 1: start-piece-disjoint-paths. Item 2: heavy-runs-in-a-shared-hold; machine-holds-are-the-custodians. Item 3: reports-to-files; answers-recorded-as-ruled-blocks; continuity-refresh-and-health-commit; merges-are-the-humans-click; guardian-record-mechanics; brief-trailers-name-the-agent-model; publish-test-failure-log-first | item 3's round 50 clause and item 4 are withdrawn (626, 634): no record, since each would be a retired record; (2) and (18) are PRECEDENTS P-035 and P-036, outside this draft |
| §34 DECISIONS-PENDING rotation (642–666) | session-start-rotations; open-entry-ruled-marker; ledger-line-cites-pinned; session-reading-order | → procedure: "session-start-rotations" (to be added) |
| §35 PLAN summaries archived (668–685) | plan-summary-states-current-state; session-start-rotations | → procedure: "`rotate-plan-summaries.mjs` — done nodes' summaries to `state/cut-archive/` (AUTONOMY.md §35)" |
| §36 filler slot (687–696) | filler-slot-admission; filler-slot-conduct | — |
| §37 wait loops and background shells (698–709) | wait-loops-and-background-shells | the closing checklist → procedure: "wait-loops-and-background-shells" (to be added; RULED 2026-10-29) |
| The piece F pointer (711) | — | a fact; `governance/MOVED.tsv` and `scripts/plan/moved-map.mjs` carry it |

**About the README headings.** The corrected addendum puts a procedure under a heading that names the rule's id (`state/directives/2026-10-24-governance-piece-e-addendum-corrected.md:11 @ 6b67d44`). None of the existing headings named above carries an id. So each would need a new heading or a renamed one. That is an edit to `scripts/plan/README.md`, which E1 owns; nothing here edits it.

## 5. Rules the schema could not express

These are the cases where a rule's meaning goes beyond what the fields can hold. Each one is carried in the body text for now, where no check can see it.

1. **A rule binding different roles at different moments.** `applies_to × when` is a cross product. So a rule that binds the custodian `always` but an agent only at `gate-reviewer` cannot be one record. It needs two, or it accepts that the custodian gets it only when it selects that moment. My convention (§2, item 5) avoids putting such rules into agent `always` blocks. The cost is that in 17 records naming the custodian among other roles, the custodian's side is selected only by moment.
2. **The custodian's own moments.** Session start, before a question round, after each AskUserQuestion call, a flush or compaction, a handoff, a merge, the closing record, and dispatch are not in the fixed list. 41 custodian rules therefore sit at `always`, with the trigger stated in the text. The selector cannot narrow them.
3. **The custodian is not an agent.**
   - `agent-exists: custodian` cannot be asserted.
   - E1's form does not say where the custodian's `always` block is generated, since there is no agent definition to hold it.
   - Directive lines 54 to 57 cover agent definitions and dispatches only.
4. **Rules that hold only under a condition or for a period.** Examples:
   - "from v0.1.1" (release-asset-is-the-tag-ci-build);
   - "while the 2026-10-08 sole-session directive stands" (machine-holds-are-the-custodians);
   - "while the 2026-10-07 direction stands", under which §9 stays unused (merges-are-the-humans-click);
   - "from the merge of the piece that adds this section" (§25, §28, §30).

   The schema has no condition field and no validity window.
5. **One-shot duties.**
   - publish-test-failure-log-first applies to the "next failure" only.
   - The §3 and §7 dry runs and the §15 drill are one-time.

   No field expires a rule after it fires. The dry runs and the drill are left out; the publish rule is drafted with a `Schema gap:` line.
6. **Exceptions between rules.** Two cases are written only as body text that the check cannot read:
   - filler-slot-admission sets aside full-form-at-dispatch;
   - PRECEDENTS P-034 makes an exception to plan-edit-rights (the custodian may place a test-only node).

   There is no `except` or `overrides` field.
7. **Supersession of text that is not a record.** §28 replaced the by-hand mirror in §4 and §16, §30 reordered §3, and §26 extended §0. `supersedes` links only records to records, so these chains appear only in the `source` spans and the text.
8. **Authority that is not a ruling.**
   - size-threshold is "the custodian's stated choice … not the human's ruling", adjustable by a one-line note (`governance/AUTONOMY.md:349-355 @ 6b67d44`).
   - The Guardian's Write-tool clause has no ruling at all (`governance/AUTONOMY.md:625 @ 6b67d44`).

   `source` expects a ruling, and there is no field for "a custodian's choice under a directive".
9. **Facts outside the three assumption types.** Several rules depend on facts that `file-exists`, `adr-status` and `agent-exists` cannot state:
   - that a script is wired into a workflow, which is the very fact F1 below turns on;
   - that a hook is wired in `.claude/settings.json`;
   - that a README heading exists;
   - that a directory exists (`state/consults/gates/`);
   - that an environment variable is unset (`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`, `CLAUDE_CODE_AUTO_COMPACT_WINDOW`);
   - the installed Claude Code version (Appendix B's facts are dated 2.1.270);
   - that a file is absent (`state/CUSTODIAN-HALT`).
10. **Rules bound to a machine or platform.** The heavy-run rules (the PowerShell machine script, cores 0 to 7) and fixture-drive-disclosed (C: or D:) bind the Windows laptop. A cloud session such as this one cannot meet them, and the schema has no field for an environment.
11. **The invariants of a hook.** stop-hook-decision-order and precompact-hook-never-blocks-auto describe what code must keep doing, not an agent's conduct. They are drafted as rules scoped by `paths` for the roles that edit that code. Whether such rules belong in the catalogue or in the hook's own form is for the architect.

## 6. Stale facts and conflicts found (reported; none decided)

- **F1. The mutation rule is said to be automated, but it is not wired in.**
  - What AUTONOMY says: `verify:test-claims` verifies the mutation rule mechanically (`governance/AUTONOMY.md:164-166 @ 6b67d44`, `governance/AUTONOMY.md:222-226 @ 6b67d44`).
  - What the tree shows at 6b67d44:
    - `scripts/plan/verify-test-claims.mjs` contains no occurrence of "mutation".
    - `scripts/plan/verify-mutation.mjs` exists, but it "does NOT run the mutation" (`scripts/plan/verify-mutation.mjs:24 @ 6b67d44`).
    - No workflow runs it: governance-ci's steps are at `.github/workflows/governance-ci.yml:150-199 @ 6b67d44`, and no other workflow names it.
  - In the draft: one-mutation-per-new-test is recorded as `enforced_by: [none]`.
- **F2. Status sentences that have gone out of date.**
  - "They are not yet on main" (`governance/AUTONOMY.md:146 @ 6b67d44`). governance-ci now runs verify-cites, verify-quotes and verify-test-claims (`.github/workflows/governance-ci.yml:155-161 @ 6b67d44`).
  - "once that piece lands" (`governance/AUTONOMY.md:222 @ 6b67d44`).
  - The PR #69 notes (`governance/AUTONOMY.md:115 @ 6b67d44`, `governance/AUTONOMY.md:278 @ 6b67d44`).

  The records use current words; the AUTONOMY lines stay as filed.
- **F3. Pinning a DECISIONS-PENDING passage: two rules disagree.**
  - Since 2026-10-14, a ruling may be cited by date and round, "or pin the line" (`governance/AUTONOMY.md:653 @ 6b67d44`, `governance/AUTONOMY.md:665 @ 6b67d44`).
  - The gate and worker definitions carry round 14 (a′): "no ledger passage is pinned by (b)'s path:line + hash", and a passage with no round is cited by its entry number (`.claude/agents/architect.md:11 @ 6b67d44`, `.claude/agents/reviewer.md:25 @ 6b67d44`, `.claude/agents/worker.md:25 @ 6b67d44`).
  - In the draft: ledger-line-cites-pinned carries an `Open:` line. Which rule governs is for the architect's reading or the human's ruling.
- **F4. §9's delegation is suspended, not retired.**
  - §9 lets the custodian merge a docs-only PR (`governance/AUTONOMY.md:195 @ 6b67d44`).
  - The 2026-10-07 direction keeps it unused (`state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:12 @ 6b67d44`), and §33 item 3 says "merges are the human's click, merge commit only" (`governance/AUTONOMY.md:631 @ 6b67d44`).
  - The record carries the later text. Retiring §9 would need the human's ruling.
- **F5. Batched questions against the filler rule.** §4 runs every unblocked node to exhaustion and then raises one batched set (`governance/AUTONOMY.md:101 @ 6b67d44`). §36 asks a filler's question "when it arises" (`governance/AUTONOMY.md:692 @ 6b67d44`). The record notes the filler exception and claims nothing beyond it.
- **F6. reports-to-files and the architect's tools.**
  - The rule has every subagent, the architect included, write its report to a file (`state/directives/2026-10-03-reports-to-files-two-pieces-trial.md:8-11 @ 6b67d44`; `governance/AUTONOMY.md:631 @ 6b67d44`).
  - The architect has no Write tool (`.claude/agents/architect.md:4 @ 6b67d44`).
  - How the architect's reports reach files today is not in this session's reading.
- **F7. A rule with no home outside the appendix.** "Report ≤20 lines per window" sits only in Appendix A (`governance/AUTONOMY.md:417 @ 6b67d44`). No section of the AUTONOMY body carries it, and `governance/AI_DEVELOPMENT.md` has no "20 lines". It is drafted as window-report-at-most-20-lines, with an `Open:` line.
- **F8. A rule with no ruling behind it.** The Guardian's Write-tool clause has no ruling (`governance/AUTONOMY.md:625 @ 6b67d44`). guardian-record-mechanics carries a `Source gap:` line.
- **F9. PRECEDENTS after E1.**
  - Piece E item 8 says PRECEDENTS.md takes no new rules from E1's merge (directive line 65).
  - §8 lets the custodian add a precedent by quoting a ruling (`governance/AUTONOMY.md:191 @ 6b67d44`).
  - Whether a precedent counts as a "rule" under item 8 is for the human.
- **F10. E3 gets nothing from AUTONOMY.** Addendum 2 makes E3 path-scoped product rules under `.claude/rules/` (`state/directives/2026-10-28-governance-piece-e-addendum-2-upgrade-clear-compact-window-prompt-audit-e3-path-rules-reviewer-model.md:22-24 @ 6b67d44`). The 15 path-scoped records here all scope governance or tooling paths, none under `engine/`, `kernel/`, `protocol/`, `renderer/` or `frontends/shell/`. So no AUTONOMY rule would move to `.claude/rules/`.

## 7. Not covered by this draft

- **Rules found only in the agent definitions** (E1's own content, directive line 58). They have no AUTONOMY lines to cite:
  - the reviewer's product checklist (`.claude/agents/reviewer.md:11-17 @ 6b67d44`);
  - the cross-module seam and caller rules, the verbatim-quote rules (rounds 10 and 11), quote by reference (round 12), round 14 (a′) and the root-cause rule, round 15 (a) to (g), the record cap, discharge claims and operator-visible text (`.claude/agents/architect.md:11 @ 6b67d44`, `.claude/agents/reviewer.md:18-25 @ 6b67d44`, `.claude/agents/worker.md:17-25 @ 6b67d44`);
  - the worker's scope and commit rules and its four failure classes (`.claude/agents/worker.md:11-15 @ 6b67d44`, `.claude/agents/worker.md:27 @ 6b67d44`);
  - the tester's rules (`.claude/agents/tester.md:11-17 @ 6b67d44`);
  - lead-data's duties and limits (`.claude/agents/lead-data.md:11-22 @ 6b67d44`);
  - the evidence-reader's modes (`.claude/agents/evidence-reader.md:13-37 @ 6b67d44`).

  Three agent-definition paragraphs do derive from AUTONOMY: Round 25 item 2, proportional gates, and wording blocks. Their AUTONOMY counterparts are drafted here as gate-report-filed-with-reviewed-commit, full-form-at-dispatch, gate-verdict-classes, wording-block-gate-author and wording-block-answers.
- **PRECEDENTS.md's 36 entries.** These are E4's. The draft cites P-033, P-034, P-035 and P-036 only where an AUTONOMY rule points to them.
- **The fresh-session practice and /clear's lease handover.** These come from piece E and addendum 2 (directive lines 80 to 87; addendum 2 line 10). They are not in AUTONOMY, so no record is drafted for them.

## 8. Record index

The table shows each record's roles, moments, path scope, enforcer and AUTONOMY lines (@ 6b67d44).

Role key: C custodian, A architect, R reviewer, W worker, Wh worker-high, T tester, Th tester-high, L lead-data, E evidence-reader. In the enforcer column, "plan/" and "hooks/" stand for `scripts/plan/` and `scripts/hooks/`.

| id | roles | when | paths | enforced_by | AUTONOMY lines |
|---|---|---|---|---|---|
| allowed-stop-is-never-forced | C | always |  | none | 97 |
| answers-recorded-as-ruled-blocks | C | always |  | none | 105, 621 |
| brief-trailers-name-the-agent-model | C | always |  | none | 627, 631 |
| budget-overrun-stops-and-queues | C | always |  | none | 199 |
| claude-code-facts-from-installed-docs | C A R W Wh | draft, build, gate-architect, gate-reviewer | yes | none | 5, 455 |
| continuity-block-cap | C | always |  | hooks/flush.mjs, hooks/flush.test.mjs | 574-576, 597 |
| continuity-block-is-not-the-lease | C | always |  | none | 183 |
| continuity-refresh-and-health-commit | C | always |  | none | 184, 527, 622 |
| evidence-archived-before-cited | C T Th | test-run |  | none | 65, 207 |
| filler-slot-admission | C | always |  | none | 692, 696 |
| filler-slot-conduct | C | always |  | none | 692 |
| five-line-form | C R | draft, gate-reviewer |  | none | 361-375 |
| fixture-drive-disclosed | C A T Th L | draft, test-run |  | none | 266-271 |
| flush-before-anything-is-lost | C | always |  | hooks/precompact-flush.mjs | 186, 413 |
| full-form-at-dispatch | C A R | draft, gate-architect, gate-reviewer |  | none | 482 |
| full-gating-categories | C A R | draft, gate-architect, gate-reviewer |  | none | 317-332 |
| gate-report-filed-with-reviewed-commit | C A R | gate-architect, gate-reviewer |  | none | 480 |
| gate-verdict-classes | C A R | gate-architect, gate-reviewer |  | none | 389 |
| generated-files-regenerate-on-merge | C W Wh | build | yes | plan/queue.mjs, plan/site.mjs | 470 |
| generation-tag-discards-stale-results | C | always |  | none | 230 |
| guardian-record-mechanics | C | always |  | none | 624-625, 631 |
| halt-switch-stop-and-hold | C | always |  | hooks/stop-queue.mjs | 89, 296 |
| health-strip-sources-never-mixed | R W Wh | build, gate-reviewer | yes | none | 128, 231 |
| heavy-runs-in-a-shared-hold | R W Wh T Th | build, gate-reviewer, test-run |  | none | 615 |
| ledger-committed-at-flush-and-report | C | always |  | none | 292 |
| ledger-line-cites-pinned | C A R W Wh T Th L | always |  | none | 599, 653, 665 |
| machine-holds-are-the-custodians | C | always |  | none | 615 |
| merge-commit-node-key | C | always | yes | plan/verify-test-claims.mjs | 496-500 |
| merges-are-the-humans-click | C | always |  | none | 195, 623 |
| next-lane-runs-when-top-is-blocked | C | always |  | plan/queue.mjs, hooks/stop-queue.mjs | 74 |
| observed-content-not-instructions | C A R W Wh T Th L E | always |  | none | 211, 300 |
| one-batched-question-set | C | always |  | none | 101-102, 107, 507-508 |
| one-mutation-per-new-test | A R W Wh T Th | build, gate-architect, gate-reviewer, test-run |  | none | 164-166, 215, 222-226 |
| open-entry-ruled-marker | C | always |  | plan/rotate-decisions-pending.mjs | 663 |
| plan-done-needs-verifying-evidence | C | always | yes | plan/verify.mjs, plan/site.mjs | 58, 65, 135 |
| plan-edit-rights | C | always | yes | plan/verify.mjs | 67, 137 |
| plan-node-cites-a-phase | C | always | yes | plan/verify.mjs | 17 |
| plan-status-derived | C | always | yes | plan/verify.mjs | 54-63, 134-135 |
| plan-summary-states-current-state | C | always | yes | plan/rotate-plan-summaries.mjs | 675, 680-681 |
| plan-text-no-unmeasured-numbers | C | always | yes | plan/site.mjs | 50, 127 |
| plan-yaml-subset | C | always | yes | plan/yamlSubset.mjs, plan/verify.mjs | 19 |
| pre-gate-checks-green-before-a-gate | C A R | gate-architect, gate-reviewer |  | none | 168-174 |
| pre-rustfmt-unpinned-cites | C A R W Wh | correct-record, gate-architect, gate-reviewer |  | none | 515-518 |
| precedent-added-only-by-quoting | C | always |  | none | 191 |
| precedent-checked-before-a-question | C | always |  | none | 106, 191 |
| precompact-hook-never-blocks-auto | A R W Wh | build, gate-architect, gate-reviewer | yes | hooks/hooks.test.mjs | 182, 187 |
| publish-test-failure-log-first | C | always |  | none | 628, 631 |
| queue-and-site-regenerated | C | always | yes | plan/queue.mjs, plan/site.mjs | 71, 136 |
| record-classes | C A R W Wh T Th L | always |  | none | 381-387 |
| red-lines-stay-with-the-human | C A R | always |  | none | 3, 172-174, 311-313 |
| references-and-one-closing-summary | C A R W Wh T Th L | always |  | none | 391 |
| release-asset-is-the-tag-ci-build | C | always |  | none | 203 |
| repo-settings-are-the-humans | C | always |  | none | 211, 304 |
| reports-to-files | C A R W Wh T Th | always |  | none | 620, 631 |
| round-mirror-by-hook | C | always |  | hooks/questions-mirror.mjs | 506-511 |
| search-excluded-locations-explicitly | C A R W Wh T Th L | always |  | none | 557-561 |
| session-reading-order | C | always |  | hooks/session-resume.mjs | 7-13, 486-488, 600, 666 |
| session-start-rotations | C | always |  | none | 598, 664, 682-683 |
| sibling-search-on-every-fix | C A R W Wh | build, gate-architect, gate-reviewer |  | none | 215 |
| single-gate-route | C R | draft, gate-reviewer |  | none | 336-345 |
| size-threshold | C A R | draft, gate-architect, gate-reviewer |  | none | 349-357 |
| stale-continuity-blocks-stop | C | always |  | hooks/stop-queue.mjs | 526 |
| start-piece-disjoint-paths | C | always |  | none | 606-609 |
| stop-hook-decision-order | A R W Wh | build, gate-architect, gate-reviewer | yes | hooks/hooks.test.mjs | 84-95, 474, 525-526 |
| telegram-is-read-and-copy-only | C | always |  | none | 115-117, 276 |
| telegram-secrets-from-environment | C R W Wh | build, gate-reviewer | yes | none | 276, 280-285 |
| verdict-carry-forward | C A R | gate-architect, gate-reviewer |  | none | 391 |
| wait-loops-and-background-shells | C A R W Wh T Th L E | always |  | none | 703, 707-709 |
| what-counts-as-a-ruling | C | always |  | none | 103-104 |
| window-report-at-most-20-lines | C | always |  | none | 417 |
| wording-block-answers | C W Wh | build, correct-record |  | none | 537-540, 542 |
| wording-block-gate-author | A R | draft, gate-architect, gate-reviewer |  | none | 536, 541-544 |
