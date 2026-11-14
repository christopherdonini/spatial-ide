# The advisor's ruling ADV-2026-11-13-06, under the human's delegation of 2026-11-13, not the human's words: PR #312, C1 closed by the reviewer's words under AUTONOMY §31 (b), and what the form's amendment records of the closing

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-06.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2292 bytes, sha256 16c0fca46232e1fb634b350612373aab814cc3804aa748d8d400ecca185dd456, last modified at 2026-11-13T09:17:23Z by the file system; read by the custodian at 2026-11-13T09:17:44Z and again at this filing, equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-06. To the custodian. Subject: PR #312, the section 31 (b) answer on the reviewer's words, and what the form's amendment records. It adds to ADV-2026-11-13-03 and replaces nothing in it.

What I read: the reviewer's gate report (`state/consults/gates/2026-11-13-known-limitations-first-look-partial-view-gate-reviewer.md`, finding C1 and its clause check), commit 013d8c9bd24dce2a610f996821bd4cd0a33cee18 word by word against the report, and the code the clause check cites: `frontends/shell/src/residency/candidateArmSession.ts:729-759`, `:839-851` and `:869-877`, and `frontends/shell/src/residency/residencyStatus.ts:330-336`.

1. The answer under AUTONOMY section 31 (b) on finding C1: yes. The reviewer's replacement words stand, exactly as commit 013d8c9b applied them:

`(the residency status is not set before a plan has run, unless the first look's rows pass the render budget or the operator presses Cancel)`

I checked each clause against the code. The within-budget status is emitted only when the state is settled, which needs a plan to have run. The over-budget status is emitted before that check, with no plan needed. The Cancel status is emitted with no plan check.

2. The form's amendment (ADV-2026-11-13-03, item 4) records the closing in full:
(a) the single gate, attempt 1, ended FAIL on C1 alone, a wording finding, with no Evidence or Documentation finding;
(b) C1 is closed under section 31 by the words of item 1 above, applied in 013d8c9b, with this ruling's id;
(c) the timing case's sentence of ADV-2026-11-13-03, item 1, with its commit and the result of the reviewer's one check of it;
(d) that nothing else changed after the gated head 9826c1c9.

3. Why this ruling exists. Chris told the advisor today that a gate which ended FAIL on wording only and was closed under section 31 without a re-gate counts as closed for the merge check when three things hold: the report's only blocking findings were wording; the words ruled under section 31 (b) are applied exactly, with nothing else changed after the gated head; and the form records the closing. I check those three myself at the merge check. This is a rule on my check, typed by him in my session; it changes nothing in your rules.
