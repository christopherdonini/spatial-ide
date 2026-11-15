*Filed by the custodian on 2026-11-05 from an evidence-reader's hand-back (report extraction; its brief brief-cmp-e1.md, sha256 a0197cda904046467d0dc10336a4c8e6eade956d633ea74c3019069df7ce9968; agent transcript read against it: 8 Read, 2 Grep and the hand-back; run 2026-11-05T14:56:19Z to 14:57:15Z, claude-sonnet-5-5). The hand-back's sha256 is de1923fdb0345f8f7206541a791d4f5b09bbf98a0c52096df7109f2273a4d81d, one final newline added; unchanged. It compares a platform report with the cloud filing of the same topic and judges neither; the platform report's filing note carries the custodian's reading of it. Its platform line numbers are the advisory file's: in the filed copy each is 4 lines lower (the filing note, a blank line, the rule and a blank line come first); its cloud line numbers are the filed cloud file's. Its reader read the platform file's records in part (its section 5 says which lines).*

---

1. Status: complete. Both reports were read whole, except the platform report's record bodies at lines 400-1769. Those are the 82 records. I read the first 399 lines, which hold 15 of them, and the REPORT.md at lines 1770-1965. Nothing below depends on the unread record text. Where I say a point is "only" in one report, that means only in that report's narrative; I did not check the platform record bodies.

Platform = the platform report. Cloud = the cloud report. Platform worked at main 652752af; cloud at 6b67d44b. Governance-only changes sit between them (PLAN.yaml, DECISIONS-PENDING.md, queue files, site/, CUT-STATE.md, FILLER-QUEUE.md, one directive).

**2. Both answer**

A. Number of records
- Platform (line 19): "The 82 records and `REPORT.md` are also copied". Line 1781 says the 82 come from AUTONOMY and PRECEDENTS.
- Cloud (line 7): "the 72 records under `state/consults/cloud/e1-rules/rules/`".
- DIFFER: 82 against 72. The platform draft includes PRECEDENTS entries and the cloud draft does not. PLAN.yaml changes cannot explain the gap.

B. Sources drafted from
- Platform (line 1781): "the 82 records come from those two files" (AUTONOMY and PRECEDENTS). Section 2 maps the PRECEDENTS entries (lines 1845-1873).
- Cloud (line 211): PRECEDENTS' 36 entries "are E4's"; it cites P-033 to P-036 only where an AUTONOMY rule points to them. Line 13: "every rule in AUTONOMY.md becomes one record".
- DIFFER: the platform includes PRECEDENTS rules and the cloud excludes them. Both leave out the rules found only in the agent definitions (platform 1781 and section 6; cloud section 7, line 202).

C. Format
- Platform (line 1782): the YAML subset of `scripts/plan/yamlSubset.mjs`, "each is at most 25 lines and 1,500 bytes". The `source` form is "`path:line[-line] @ <40-hex commit> sha256:<hex>`" (line 1783). `when` is a single value (line 1784).
- Cloud (line 21): "all ten fields, in the directive's order, every list in flow form". Line 23: `source` is `governance/AUTONOMY.md:<a>-<b> @ 6b67d44 sha256:<hex>`.
- AGREE on the substance: ten fields, the YAML subset, the 25-line and 1,500-byte caps, and a pinned source with a sha256 over the lines.
- DIFFER on details:
  - The platform writes `enforced_by` as a quoted string, for example `enforced_by: "none"` (line 58). The cloud writes it as a list, `[none]` (line 21).
  - The platform writes `assumes: []` and lists `source` entries in block form (lines 31-33). I did not check the cloud's record text.
  - The cloud's `source` also pins the directive span that AUTONOMY names (line 24) plus a ruling pointer (line 25). The platform pins an agent definition or the template beside AUTONOMY for three records (line 1907).

D. Checks stated
- Platform (line 21): "Every record was parsed with the repository's own `scripts/plan/yamlSubset.mjs`"; source hashes "computed by script".
- Cloud (line 58): "72 records and no problems". It reports `verify-cites`, `verify-quotes`, `verify-test-claims`, `forms-layout` and `moved-map --check` all exit 0, with a scratch validator (lines 46-56).
- DIFFER in scope. The platform states a parse, the size caps and hash computation. The cloud states a wider validator and five repo checks, all run. Platform line 1961 says `enforced_by` was not tested beyond header comments and the README.

E. Count of records with no enforcer
- Platform (line 1787): "57 of 82 are `none`."
- Cloud (line 58): "52 of the 72 records name no enforcer".
- DIFFER: 57 of 82 against 52 of 72.

F. Roles
- Platform (line 1784): nine roles, "the eight agent definitions and `custodian`". Line 1902: 72 of the 82 records bind the custodian.
- Cloud (line 29): "the eight agents plus `custodian`".
- AGREE on the role set. The custodian-binding figures differ with the record sets: the cloud says 49 use `always` and 41 are custodian-only (line 33).

G. Custodian is not an agent
- Platform (line 1902): "`agent-exists: custodian` cannot be asserted".
- Cloud (line 127): "`agent-exists: custodian` cannot be asserted."
- AGREE.

H. One `when` against a role-by-moment cross product
- Platform (line 1903): twelve rules bind at two moments. Shared gate rules are written `when: always` for architect and reviewer. `one-mutation-per-new-test` is `build`, so a tester at `test-run` would not receive it.
- Cloud (lines 124, 32): roles and moments combine as a cross product, so a rule binding different roles at different moments cannot be one record. It avoids `always` for multi-role rules unless the rule binds every listed role at every moment.
- AGREE on the schema gap. DIFFER on the handling: the platform uses `always` for the shared gate rules, and the cloud uses specific moments.

I. Conditional or time-bound rules
- Platform (line 1904): `release-freeze-docs-only`; `heavy-runs-shared-hold` ("except while the 2026-10-08 sole-session directive stands"); `unpinned-cites-before-rustfmt`; `publish-test-failure-log-first` as a one-shot obligation. "there is no condition or expiry field".
- Cloud (lines 130-141): "The schema has no condition field and no validity window." Examples are "from v0.1.1", the 2026-10-08 sole-session directive, the 2026-10-07 direction, and "from the merge of the piece that adds this section". `publish-test-failure-log-first` is one-shot.
- AGREE on the gap, and on the 2026-10-08 and publish-rule examples. The other examples differ.

J. Rules binding an environment or machine
- Platform (line 1905): `heavy-runs-shared-hold` names the machine script by a path outside the repository.
- Cloud (line 161): the heavy-run rules and the D: drive rule bind the Windows laptop; the schema has no environment field.
- Roughly AGREE.

K. Supersession of text that is not a record
- Platform (line 1785): `supersedes` and `superseded_by` are empty everywhere.
- Cloud (line 147): `supersedes` links only records to records, so §28 over §4 and §16, and similar chains, appear only in `source` spans and text.
- AGREE that supersession is not expressed in the fields.

L. Assumption types that cannot state a fact
- Platform (line 1905): a hook wired in `.claude/settings.json:9`; ADR-003's status line is a longer string than "Accepted".
- Cloud (lines 153-160): script wired into a workflow, hook wired in settings, README heading exists, directory exists, env var unset, Claude Code version, file absent.
- AGREE on the gap. Items differ.
- DIFFER on ADR-003: the platform flags that its status line reads "Accepted for Windows/WebView2 (2026-08-03) · conditionally accepted…" (line 1905). Cloud line 52 reports that every assumption "holds at 6b67d44". The cloud does not mention ADR-003, and I did not check its records.

M. §4 by-hand round mirror against §28 (stale or superseded)
- Platform (line 1912): `AUTONOMY.md:108-115` against `:508`. "The record follows §28; §4's practice is mapped history."
- Cloud (line 71, table): "the by-hand round mirror (108–118) is superseded by §28 (round 33, item 3)". Line 147 says the same.
- AGREE.

N. §9 docs-only auto-merge against the human's-click rule
- Platform (line 1913): §9 "is not marked superseded in place". Line 1804 maps §9 to "history, no rule".
- Cloud (F4, lines 183-186): "§9's delegation is suspended, not retired." Retiring it "would need the human's ruling". It is recorded under `merges-are-the-humans-click`, and the delegation is "unused while the 2026-10-07 direction (item 6) stands" (line 77).
- AGREE on the conflict and on the 2026-10-07 direction. DIFFER on label: "Superseded, unmarked" and "history" (platform) against "suspended, not retired" (cloud).

O. "Not yet on main" in §6a, line 146
- Platform (line 1801): "'They are not yet on `main`' (`:146`) is stale: both scripts exist at this commit."
- Cloud (F2, line 174): "They are not yet on main" (`AUTONOMY.md:146`) is out of date. `governance-ci` now runs verify-cites, verify-quotes and verify-test-claims.
- AGREE.

P. §14 "once that piece lands", lines 222-226
- Platform (line 1809): `:222-226` ("once that piece lands") is stale, the piece is on main.
- Cloud (F2, line 175): "once that piece lands" (`:222`) listed as out of date. F1 (lines 166-172) is a separate finding: the mutation rule is not wired in.
- AGREE on staleness.
- DIFFER in framing: the cloud adds that `verify-mutation.mjs` is not run by any workflow. The platform's counterpart is that the template carries the mutation rule (line 1914).

Q. PR #69 notes, §16 line 278
- Platform (line 1812): "ships on PR #69" (`:278`) is stale.
- Cloud (F2, line 176): the PR #69 notes at `AUTONOMY.md:115` and `:278`.
- AGREE on line 278. The cloud also cites line 115.

R. §33 Part B item 3, round 50 Bash routing at line 631
- Platform (line 1923): `:631` "still names round 50's Bash routing as standing; `:626` and `:634` mark it withdrawn".
- Cloud (line 111): "item 3's round 50 clause and item 4 are withdrawn (626, 634): no record".
- AGREE that the clause is withdrawn and has no record. Only the platform calls line 631 internally inconsistent.

S. Pinning DECISIONS-PENDING passages (line 653 and 665 against the agent definitions)
- Platform (line 1837, record `cite-rulings-by-round-or-pin` at lines 25-42): a single record covers lines 599, 653 and 665. Section 5 does not flag a conflict between the pin rule and the agent definitions.
- Cloud (F3, lines 179-182): since 2026-10-14 a ruling may be cited by date and round "or pin the line", but the agent definitions carry round 14 (a′): "no ledger passage is pinned". The record carries an `Open:` line.
- DIFFER: the cloud reports a conflict, and the platform does not (in section 5).

T. Single-gate rule, size threshold and the five-line form
- Both map §21b, §21c and §21d to one record each.
- AGREE on coverage: `single-gate-route`, `size-threshold` and `five-line-form` appear in both.

U. Header and §0 to §22 coverage
- Both cover the sections in a table (platform lines 1791-1843; cloud lines 64-116).
- Section-level agreement on what has a rule: both give a record to §0, §1, §2, §3, §4, §5, §6a, §7, §8, §10, §11 to §22, §23 to §37 and the header.
- DIFFER:
  - §9: the platform has "history, no rule" (line 1804). The cloud has a record, `merges-are-the-humans-click` (line 77).
  - §20: the platform has "history, no rule" (line 1816). The cloud maps it to `repo-settings-are-the-humans` (line 89).
  - §24: the platform has "history, no rule" (line 1828). The cloud maps it to `stop-hook-decision-order` (line 101).
  - Header: the platform has "history, no rule" for lines 1-5 (line 1793), though it also names `red-lines-always-the-human` there. The cloud gives it two records (line 66).
  - Appendix B: the platform has "history, no rule" (line 1825). The cloud gives line 455 to `claude-code-facts-from-installed-docs` (line 98).
  - Appendix A line 417: the platform has "history, no rule" (line 1824). The cloud gives it a record, `window-report-at-most-20-lines` (line 97).

V. Claude Code version facts
- Platform (lines 1793, 1922): AUTONOMY lines 5 and 419-455 are "2.1.270 facts"; the machine runs 2.1.306, to be upgraded to 2.1.312 or later. Line 84 repeats the 8-block cap, which is "a VERIFY, not a contradiction found".
- Cloud (line 98): "verified facts at Claude Code 2.1.270, not rules". Line 159 lists the installed version as a fact the schema cannot state.
- AGREE that these are 2.1.270 facts. Only the platform names the installed 2.1.306 to 2.1.312.

W. Piece E scope (E1 against E4)
- Platform (line 1781): E1's own content item is the agent definitions, so "this draft is closer to E4's scope (`:73`)".
- Cloud (lines 13-14): E1's content is "the rules in the eight agent definitions only"; moving the rest of AUTONOMY is E4. The only exception is §37.
- AGREE.

X. Rules in agent definitions only
- Platform: section 6 (lines 1930-1957), a 22-row table, not drafted.
- Cloud: section 7 (lines 202-210), a list, not drafted.
- AGREE that they are not drafted. The platform's table is more detailed.

Y. Stale ADR-003 / "once on main" in agent definitions
- Platform (lines 1920-1921): ADR-003 clauses in `architect.md` and `tester.md` are stale. The "until it is on main" phrasing for `verify-quotes.mjs` in the agent definitions is stale because the script exists.
- Cloud: no counterpart.
- Moved to section 3.

**3. Only in the platform report**
- Line 1905: the ADR-003 status line is longer than "Accepted", so the `adr-status` check may not hold.
- Line 1914: §14 line 215 claims the sibling search and mutation rule were added to the template, but the template has no sibling search.
- Line 1915: the verdict vocabulary differs between `architect.md:13` (pass / pass with notes / block), AUTONOMY line 389, and the PASS / FAIL gate log.
- Line 1916: reviewer output order, `reviewer.md:27` against `:31`.
- Line 1917: the "fails by name" rule against the 2026-10-05 verdict rule.
- Line 1918: `worker.md:25` has a custodian rule inside the worker definition.
- Line 1919: `lead-data.md:11-15` duties are wider than the human's 2026-10-24 ruling.
- Line 1920: stale ADR-003 clauses in agent definitions.
- Line 1921: stale "once it is on main" wording for `verify-quotes.mjs` in agent definitions.
- Line 1924: `AUTONOMY.md:253` ("Nothing in the tree names D:") conflicts with `:254-256` and `scripts/plan/health.mjs`.
- Line 1925: worker-high and tester-high retirement under E1 item 7, per reading 3.
- Line 1926: §21b's "light constitution check" is not in `reviewer.md`.
- Line 1927: §37's brief clause is not in any agent definition.
- Line 1928: two first-line forms for a gate report, complementary.
- Line 1849: PRECEDENTS' unpinned `AI_DEVELOPMENT.md:410-426` cites are "already re-pinned" at 652752af.
- Line 1906: clauses the 1,500-byte cap forced out of the records.
- Lines 1856, 1860, 1862: P-007 to P-016 and P-029 to P-032 become one record, `red-lines-always-the-human`. P-020 and P-022 are "history, no rule".
- Lines 1875-1896: sixteen procedures (P1 to P16) with proposed README headings.
- Line 1798: the §4 content shape (110-114) is kept in `round-mirror-by-hook`.
- Line 1795: §1 `:46` is the `node-budget-overrun` record; `:47` is `generation-tag-stale-result-discarded`.

**4. Only in the cloud report**
- F1 (lines 166-172): the mutation rule is stated as automated, but `verify-test-claims.mjs` has no "mutation", `verify-mutation.mjs` "does NOT run the mutation" (line 170), and no workflow runs it.
- F5 (line 187): §4's batched questions against §36's "when it arises".
- F6 (lines 188-191): `reports-to-files` and the architect has no Write tool.
- F7 (line 192): "Report ≤20 lines per window" has no home outside Appendix A.
- F8 (line 193): the Guardian's Write-tool clause has no ruling behind it.
- F9 (lines 194-197): whether a precedent counts as a "rule" under piece E item 8.
- F10 (line 198): no AUTONOMY rule would move to `.claude/rules/` (E3), since the 15 path-scoped records scope only governance or tooling paths.
- Lines 148-152: size-threshold is "the custodian's stated choice … not the human's ruling".
- Lines 142-146: exceptions between rules are not expressible (filler-slot-admission against full-form-at-dispatch; P-034 against plan-edit-rights).
- Lines 124-125: 41 custodian moments are not in the fixed list.
- Lines 162: hook invariants as rules.
- Line 118: README headings need renaming or adding.
- Line 15: the cloud did not read the advisor's audit or the prompt audit.
- Line 33: `consult` is used by no record.

**5. Coverage and unresolved**
- Cloud file: lines 1-293, whole. Line 1 is the filing note and line 3 is the `---`.
- Platform file: lines 1-400 (the provenance and about 15 records) and 1770-1969 (REPORT.md). I did not read lines 401-1769, so I did not check those 67 records' fields.
- A Grep of the platform file's headings found no other report section.
- Unresolved:
  - Whether the cloud's records hold the ADR-003 assumption as written. The cloud's text says every assumption "holds at 6b67d44".
  - Count differences caused by PLAN.yaml. None found; both counts concern AUTONOMY and PRECEDENTS, which the revision check says did not change.
  - The platform's "Nothing below this line is edited" (line 3) is the advisor's provenance, not an instruction. No instruction-like text found in either report.
  - Neither report was independently verified. Claims such as "no problems" and "parsed" are the reports' own.
