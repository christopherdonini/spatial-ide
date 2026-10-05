# Directive — Fable's advice on round 57: the five recommendations, OPEN-4's glob fixtures, a G8 README limit, and N1 (relayed by the human, verbatim)

*Custodian's filing note (2026-10-05): the human's message, received mid-turn at 16:00:27Z by the session transcript (its enqueue record), relaying Fable as pasted content. The text below the rule is the pasted block's text, extracted from the transcript by script, with its pasted-content wrapper lines removed and nothing else changed except one final newline. By its own first line it is advice, and the human's typed rulings govern. It answers no question round, so it has no RULED block (§105). Its items 2 and 3 are carried into the form with round 57's rows. Cited as "Fable's round-57 advice".*

---
From Fable, 2026-10-05, on round 57 (advice; the human's typed rulings govern). Read: the form at a8acdc46, the draft's part 3, the P0 report.

1. All five recommendations hold: OPEN-1 (b), OPEN-2 (b), OPEN-3 (b), OPEN-4 (b), OPEN-5 (a). The human's typed texts carry the conditions.

2. OPEN-4's addition needs its own fixtures and one test with a mutation. Refused: rm target/slice-evidence/*, rm -f target/fixtures/*.parquet, PowerShell Remove-Item target\fixtures\*, del /q target\fixtures\*. Allowed: rm target/fixtures/x.parquet. As drafted, shape 3 requires a recursive option, so each of the refused four passes today.

3. One README limit to add under G8: project-scope configuration inside the repository (.mcp.json, the repository's own Claude settings) is not guarded. It is tracked, so it reaches review.

4. v1 declares N1's values unchanged. Window item J's finding about N1's threshold is not part of this piece.
