*Custodian's filing note (2026-09-30): gate 1 (architect) of PR #144, B-1's T-A (ADR-021's Note 2026-09-30), for PLAN node `filter-bind-admission-implicit-coercions` at generation 2, attempt 1. Reviewed: docs/b-1-adr-021-note @ 7c6f9019149c2f000fec56595bf4e86595847467 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its item 6 is closed by the reviewer's three-dot diff in the same gate. Its notes N1-N4 sit in text the human accepted as written, so they are recorded and change nothing. Profile paths redacted at filing: none.*

---

Reviewed: docs/b-1-adr-021-note @ 7c6f901

**Overall: PASS.** Nothing blocks. The byte-level proof is still the reviewer's: the span sha256 values and the three-dot `--stat`.

**Correctness: PASS.** Severity: none blocking. Scope: the one appended section, branch ADR-021 lines 243-267. Disposition: merge after the reviewer's byte proof.
**Evidence: PASS, with one dependency.** Severity: minor. Scope: item 6, which I could not check without Bash. Disposition: the reviewer's three-dot diff closes it.
**Documentation: PASS with notes.** Severity: minor. Scope: notes N1-N4 below, all inside the text the human accepted. Disposition: record them. The text cannot change without a new human act.

1. **Word for word. Holds.** I read branch lines 244-267 against rulings-file lines 22-45 one line at a time, and they match. The rulings file's line 40 is blank, and so is the branch's line 262. Grep finds `2026-09-30` only at branch lines 244 and 246, and no `<date>` token is left over. Those are the two places `<date>` stood (rulings lines 22 and 24). The second hit on line 246 ("Fable's O rulings of 2026-09-30") was already in T-A, so it is not a substitution. Neither file has CR bytes or trailing whitespace. Exactly one blank line (243) separates the 2026-09-29 Note from the new heading, and the file ends in one LF, as the base does.
2. **Append-only. Holds on read.** Base lines 1-242 at main @ 2700a04 read identical to branch lines 1-242. That includes the Status line (line 3), the Amendment of 2026-09-15 (lines 198-227), and the Notes of 2026-09-24 (229-235) and 2026-09-29 (237-242). The reviewer's diff is the proof.
3. **Authority. Reported, not ruled.** The RULED 2026-09-30 block in `DECISIONS-PENDING.md` ("B-1's typed texts accepted") and `state/directives/2026-09-30-b1-acceptance-and-handoff.md:7-9` accept T-A "as written", with the date filled. That includes the heading and item 6, the twelfth code. Item 3 of `state/directives/2026-09-30-takeover.md` orders it landed on main. Three things support the Note heading:
   - Decision 8 itself says a twelfth failure mode has to be mapped into the list by name (ADR-021:97-98). Extending the list by name is the ADR's own mechanism.
   - The Note of 2026-09-24 is the precedent for changing a decision's content under a ruling: it widened decision 5 (ADR-021:233).
   - The Status line is unchanged, so the docs/README ADR index cannot drift.
   The heading word is part of the accepted text, so changing "Note" to "Amendment" would itself need the human. On the record I found no further human act required. One adjacent fact for the human: the 2026-09-29 Note still waits on acceptance at B1's close, together with ADR-023's amendment (`state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md:15-16`). This Note does not depend on either of those.
4. **References. All resolve.**
   - Decision 6.3: ADR-021:83-85.
   - Decision 8 and its exhaustive mapping: ADR-021:93-99.
   - The two function sets: Consequences, ADR-021:139; What this ADR does not decide, ADR-021:176.
   - The Note of 2026-09-24: ADR-021:229-235.
   - Stage 3, the surrogate prepare and its BOOLEAN check: ADR-021:83-84.
   - `filter_rejected_by_binder`: ADR-021:96.
   - The 2026-09-29 sightings and Fable's B-1 point 6: `state/directives/2026-09-29-a2-1-and-b-1-sightings.md:79-83`.
   - Fable's O rulings of 2026-09-30: Part 1 of the rulings file.
   - The typed acceptance: the only RULED 2026-09-30 block.
   - The form's path exists on the branch.
   The Note contains no line cites and no passages marked verbatim.
5. **Constitution. No violation.**
   - docs/01 principle 8 (docs/01_Principles.md:14): every admitted conversion is declared by class. The float-literal rounding comes with its own boundary example (branch 260). The `/` rounding is declared as operator semantics (264), per O-1. A file value is never changed silently in any comparison.
   - ADR-010 rule 6 (declared ceilings): the bounds are 20 digits and scale 18, declared.
   - ADR-004 and decision 10: the refusal is control-plane and synchronous, before lease and mint, and the Note has no data-plane text.
   - ADR-006 class 1: unchanged.
   - I found no contradiction with any accepted ADR.
6. **Other files. Not verifiable by me.** I have no Bash, and Glob lists by name, not by change. The reviewer's `git diff --stat origin/main...7c6f901` has to show only `docs/adr/ADR-021-row-filter-on-viewport-query.md`.

**Non-blocking notes** (all in frozen text; for T-D's wording or a later human act):
- N1: The Note's last sentence exempts only the 2026-09-24 Note. The 2026-09-29 Note says the same "eleven codes stand" (ADR-021:241) and is not named.
- N2: Item 1's literal bound (branch 251) sits beside item 3's "any numeric operands" for `/` (264). The form says the bounds do not apply to `/` (§10 Amendment 1, the §2.5(c) replacement). The Note leaves that to the reader.
- N3: "Two numeric literals within the bounds" (261) does not say that a 20-digit integer literal against a double literal rounds. Only caller constants are involved, never file data.
- N4: Unlike the 2026-09-24 Note (ADR-021:235), this Note has no "until the piece lands" clause. Until T-D lands with the code, ADR-021 names twelve codes while `SKP-V0.md` §7.5 and the wire carry eleven. That ordering is intended (form §10 Amendment 1, Order of work).

Files: `C:\dev\wt\b-1-adr-021-note\docs\adr\ADR-021-row-filter-on-viewport-query.md`, `C:\dev\spatial-ide\state\directives\B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md`, `C:\dev\spatial-ide\engine\FILTER-BIND-COERCIONS-PREREGISTRATION.md`.
