Reviewed: the property-testing trial form's revision, not committed, 18757 bytes, sha256 3bb2da7b3fe320d2ae8992e698b42044e78a77ce1de060b9864c5a76ac773d1e, read against main at 16c896558ac9073f132336f4c9cbcff5b31d8514 in the read worktree (the custodian's filing note, 2026-11-22: the trial form's architect gate, attempt 2 (ADV-2026-11-22-01 item 6); Read 8, Grep 7, Glob 1, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-22T05:25:58Z to 2026-11-22T05:31:30Z by its transcript; the report below byte for byte from its hand-back of 9339 bytes, sha256 8a8b2c140665a3b64f52c76592e8d5d8c6578a2d4288690bb4f65bd15e6b759d; its verdict line gives the revision's sha256 with one hex digit dropped, 63 characters, and the size and hash in this line are the custodian's, by script), gate, architect
Verdict: FAIL, the property-testing trial form's revision (form-trial-2.md, 18757 B, sha256 3bb2d7b3fe320d2ae8992e698b42044e78a77ce1de060b9864c5a76ac773d1e) read against main @ 16c896558ac9073f132336f4c9cbcff5b31d8514

Reviewed `main @ 16c896558ac9073f132336f4c9cbcff5b31d8514`, in the detached worktree C:\dev\wt\gate-read. I took the revision's size and hash from the brief. I did not recompute them: the architect has no Bash. "rev N" below means line N of that revision. Every repository path:line is at 16c89655 and carries no hash; the reviewer recomputes. Text in double quotes is bytes I copied from a file. Everything else is paraphrase.

The single blocking finding is C1, a false claim of a limit. It comes from my own first-gate N1. It is closed by words alone. The sentence is the custodian's wording, not the human's, so under `governance/AUTONOMY.md` §31, item 2 (d), the custodian applies my words below with no re-gate, and the commit message lists them. Every other finding of the first gate is closed.

---

## 1. The first gate's findings, by revised line

| Finding | Closed? | Where |
|---|---|---|
| E1 (P1) | closed | rev 32-47 |
| E2 (P2) | closed | rev 49-68 |
| E3 (regressions) | closed | rev 80-82 |
| E4 (defect count) | closed | rev 96 |
| E5 (pre-merge re-check) | closed | rev 12 |
| E6 (fixtures) | closed | rev 18. The folder is named by path in the first amendment, before the worker starts. That meets ADV-2026-11-22-01 item 9 |
| D1 (bare line cite) | closed | rev 86, first sentence |
| D2 (tool versions) | closed | rev 82 names proptest 1.12.0 and fast-check 4.10.2 |
| D3 ("first amendment" booked twice) | closed | The words are folded in. Amendments open empty (rev 106). The isolation record is the first amendment (rev 18) |
| D4 (breaks red, then green) | closed | rev 86 |
| D5 (Scope list) | closed | rev 90 |
| N6 (line budget) | applied | rev 91 |
| N1 | put to the advisor | rev 14. See C1 |

## 2. Lifted words compared with my report (`state/consults/gates/2026-11-22-property-testing-trial-form-gate-architect.md`)

I compared them line by line from the two files' contents. I also used Grep to check whitespace: neither file has a CR byte or a trailing tab. The only whitespace-only lines are lines of exactly two spaces, at rev 45, 59, 67 and at report 76, 90, 98. The report's fourth such line, :135, is not lifted. The custodian's script comparison is the proof. This comparison is the floor.

| Words | Revision | Report | Equal? |
|---|---|---|---|
| P1 | rev 32-47 | :63-78 | yes, 16 lines |
| P2 | rev 49-68 | :80-99 | yes, 20 lines |
| P3 | rev 72-76 | :10-14 | yes, 5 lines |
| §4 | rev 80-82 | :149-151 | yes |
| Merge line | rev 12 | the quoted span at :157 | yes |
| §7 span | rev 96 up to its semicolon | the quoted span at :154 | yes |
| E6 clause | rev 18 | :160 | yes |
| D1 sentence | rev 86 | :166 | yes |
| D4 clause | rev 86 | :169 | yes |
| D5 list | rev 90 | :170 | yes |
| Second sentence before P3 | rev 70 | :35 | yes |

D1's quoted fragment "Testing while writing the code" matches the human's paragraph at `state/directives/2026-11-22-the-humans-message-…-a-property-testing-trial.md:49`.

## 3. Findings

### Correctness

**C1. Rev 14 claims a limit the code does not support: "The strict bound holds at integer zoom and is not proved at fractional zoom."** The error is mine. My first gate's N1 (:176) said "The strict reading holds at integer zoom, where T is a power of two." That is false for both (a) and (b), for two reasons:
- The pixel metric is Euclidean (rev 41).
- At integer zoom 6 or more, T = 2^(23−z) (offsetFrame.ts:38, :89-90). An axis whose local coordinate lies in [T, 2T) then has an f32 half-ulp of exactly 0.5 px. That axis alone can come to the budget. The other axis's rounding pushes the norm past it. In (b), the second frame's rounding adds to it.

A constructed case:
- z = 6, so T = 131072 m.
- O = (2_500_000, 1_200_000) and W = (2_631_072.5, 1_200_000). The drift is 32 px past the bound.
- p = (2_631_072.0078125, 1_200_000.3). In local coordinates, l1 = (131072.0078125, 0.3).
- The x coordinate is a midpoint on the 1/64 m grid. It rounds to 131072, an error of 0.5 px. fround(0.3) is not 0.3.
- The drawn error is therefore sqrt(0.25 + ε²) > 0.5 px.

The excess stays below about 0.0002 px over the declared domain, so P1's 0.001 px slack (rev 41) still holds. The strict reading holds at no zoom of 6 or more.

Correction of my first gate. The defect: its N1's integer-zoom sentence (:176). The corrected reference: this C1. The proof: the case above.

**Replacement for rev 14 (the architect's words; not the human's wording; §31, item 2 (d), applies them with no re-gate):**

"- **For the advisor's ruling before the build (the gate's N1, corrected by its re-gate's C1):** P1 declares a slack of 0.001 px beyond RECENTER_BUDGET_PX. The bound the architect derives over the declared domain is the budget plus about 0.00025 px. The strict bound is not proved at any zoom, integer or fractional: at an integer zoom of 6 or more, where T is a power of two, one axis's f32 rounding alone can come to the budget, and the other axis's rounding (the metric is Euclidean) and, in (b), the second frame's rounding add to it. Whether that reading of the human's re-centre sentence stands is the advisor's to rule."

Clause check:
- "declares a slack of 0.001 px": rev 41.
- "budget plus about 0.00025 px": rev 41's derivation. |e| ≤ 2^-24·|l| holds per component, so it holds for the Euclidean norm too.
- "integer zoom of 6 or more, where T is a power of two": offsetFrame.ts:90, with RECENTER_BUDGET_PX = 0.5 at :38. min(2^17, 2^23/2^z) = 2^(23−z) for z ≥ 6.
- "one axis's f32 rounding alone can come to the budget": the half-ulp on [T, 2T) is 2^-24·T, and 2^-24·2^(23−z)·2^z = 0.5. The case above reaches it.
- "an axis can lie at or past T": the drift test is Euclidean (offsetFrame.ts:167), and rev 36 puts W at T + 1/2^z or more.
- "the other axis's rounding adds": sqrt(0.5² + ey²) > 0.5 when ey ≠ 0.
- "in (b), the second frame's rounding adds": the jump is e1 − e2 (rev 39-41). Here e2 = fround(p − W) − (p − W) is non-zero in general.
- "the advisor's to rule": the delegation of 2026-11-13, item 2. Item 4 does not cover this.

### Evidence

None. E1 to E6 are closed (§1).

### Documentation (must-fix before the commit; no re-gate)

**DR1. Rev 9 under-attributes the words.** It says that only P1, P2, P3, §4, "the first sentence of section 7" and the Merge line are mine, and "The rest is the custodian's." That leaves out several spans that are also byte from my report:
- the E6 clause at rev 18;
- the D1 sentence and the D4 clause at rev 86;
- the D5 list at rev 90;
- rev 70's second sentence;
- C1's words, once they are applied.

Two further defects:
- Rev 96 is my span only up to its semicolon. The custodian rewrote the tail, which my E4 had said stays unchanged. The rewrite is supported: the human's item 3, line 47, says "give me a short consult", and the delegation of 2026-11-13, item 1, routes it through the advisor.
- "the first sentence of section 7 … byte for byte" is therefore not exact.

Replacement for rev 9's second to fourth sentences (the architect's words; the custodian's frame, not the human's wording):

"Its replacement words are folded in here before the form's first commit, as its D3 recommends, each byte for byte from the report: P1, P2 and P3 in section 3, and the second sentence before P3; the three lines of section 4; section 7's first sentence up to its semicolon; the Merge line; the isolation check's last clause (its E6); section 5's first sentence and its clause on the breaks (its D1 and D4); section 6's Scope list (its D5); and the third sentence of the question for the advisor (its re-gate's C1). They are the architect's words, not the human's. The rest is the custodian's, section 7's sentence after its semicolon included."

Clause check: each span against the report lines in the table of §2, and C1 above.

### Notes

The remaining frame text is supported and contradicts none of my words:
- the N1 line's routing;
- the isolation section;
- rev 70's first sentence (the human's item 3, line 45);
- §5;
- §6, including "any shipped source file", which agrees with P2's placement;
- rev 96's tail;
- §8, including the added post-build architect gate, which agrees with "both gates" at rev 11;
- the revised §1 and the title, which agree with §4.

- **N-a.** Once the form is committed, rev 11 and rev 100 describe this re-gate but do not name its report. Name the report path in the commit message, or in the first amendment beside the isolation record.
- **N-b.** For the degree unit, T is at least 512 degrees at every z ≤ 14. W then lies outside CRS84, where the largest separation is "about 402.49 degrees" (offsetFrame.ts:53). The degree arm therefore reaches the supported domain only above z ≈ 14.35. This is not false: the derivation does not depend on |O|, and the metre arm covers the full zoom range. It is thin coverage of the supported degree domain, and the month's consult may weigh it.
- **N-c.** My first report's heading at :61 reads "(the custodian's words, not the human's; mine)". The words are the architect's. Rev 9 attributes them correctly.

No ADR is needed: no decision is missing.
