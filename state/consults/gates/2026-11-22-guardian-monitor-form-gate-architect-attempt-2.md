Reviewed: the corrected draft form for the node guardian-checks-monitor-commands, not committed (<S>/form-guardian-monitor-2.md, 17322 bytes, sha256 2cf98058e5320d9447af479e1e22140011b36cc56c38820d89997cf2a4ed6075), read against main at c850b2353cf6149af89f3971828328c5a960df66 (the custodian's filing note, 2026-11-22: the form's architect gate, attempt 2, a narrow re-gate; Read 10, Glob 2, Grep 3, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T12:18:55Z to 2026-11-22T12:22:06Z by its transcript; no call named the main checkout; the report below byte for byte from its hand-back of 9795 bytes, sha256 81e1a22ddf9444f398905286cd2229fbf433f9991380b88549e3d07af60ae7d2, nothing masked, with this note in its first line and one final newline), gate, architect
Verdict: PASS WITH NOTES. I reviewed main @ c850b2353cf6149af89f3971828328c5a960df66, in the read-only checkout `C:/dev/wt/gate-read`, detached. I took that head from the brief: I have no shell, so I did not check it myself. The form is the uncommitted draft `<S>/form-guardian-monitor-2.md`, cited by its own section names. Every repository cite is a path:line at the head above.

Mapped onto AUTONOMY §22:
- **Correctness: closed.** C-1 is closed (item 4).
- **Evidence: closed.** E-1 is closed (item 4).
- **Documentation: must-fix before the form's first commit.** There are fourteen replacements, W1 to W14 below.

Every one of them is the custodian's form text, not the human's wording, and none changes code. So the worker applies them verbatim with no re-gate, and the PR body lists them. All the words are mine, the architect's. Each old text occurs once in `<S>/form-guardian-monitor-2.md`.

## 1. Spots

- **These carry their meaning where they landed:** C-1a, C-1b, E-1a, E-1c, E-1d, D-1, D-2, D-3, D-4, D-6, D-7, D-9, D-10, D-11 and D-13.
- **D-12 is at the wrong spot.** It landed as a fragment after the P0 stop sentence. I want it in the sentence "gains one line beside the Bash line" (W1, W2). That also closes finding 11.
- **E-1b is at the right spot,** but §0's heading and closing paragraph contradict it (W3 to W6).
- **D-5 is at the right spot,** but it is a lowercase fragment. Its "second bullet" is also the bullet the sentence already names: README.md:61 is "the bullet on tools that are not registered" (W10 to W12).
- **D-8 is at the right spot,** but it doubles the bullet's own sha256 clause (W9). The one-file-per-refusal reading is right: `register.js:962-963` writes one new file per refusal into the day folder, and README.md:48 says the same.

**The departure (`himself` to `themselves`) is right.** It changes no meaning. The sentence is not presented as a quote. Draft item 2 is matched in substance: "sends me the change as a patch file, and I apply it myself" (`state/consults/2026-11-22-advisor-draft-adv-2026-11-22-02-…-not-the-humans-words.md:18`).

**D-6 is right as it stands.**
- The draft is silent on a failed or inconclusive live check. Its item 6 (a) (draft:45) says only "inconclusive".
- So the grant of 2026-11-13, item 1, governs: "you ask the advisor, and it decides what needs me" (`state/directives/2026-11-13-the-grant-approved-…-the-advisor-merges.md:13`).
- C-1 differs because the human's own words route those two cases to the human (draft:18, draft:21).
- Any Guardian change that follows a failure is still reserved under the grant's item 4 (c) (the grant :22), and it reaches the human as a draft in any case.
- D-6 also agrees with §5.3's existing "A failed prediction is a finding to the advisor."

## 2. The worker's eleven findings

**Finding 1 (D-12, and D-5's fragment).** Documentation.
- W1. old: `gains one line beside the Bash line. It has the same shape` → new: `gains one line beside the Bash line, after N1's registration so that N1 stays first. It has the same shape`
- W2. old: `before any code. after N1's registration, so that N1 stays first.` → new: `before any code.`
- Checked against the code: N1 is at `register.js:1106` and Bash at `register.js:1107`. A line placed directly after Bash is both beside Bash and after N1.
- D-5's fragment is under finding 2.

**Finding 2 (D-5).** Documentation.
- W10. old: `untrue. also: the opening paragraph's` → new: `untrue. Also, where they become untrue or incomplete: the opening paragraph's`
- W11. old: `; its second bullet, so that it also says G2, G3 and G4 read no Monitor command; and its G8 bullet` → new: `; and its G8 bullet`
- W12. old: `with a clause that a watch with no command is not read and that G6 is not applied to Monitor;` → new: `with a clause that a watch with no command is not read, that G6 is not applied to Monitor, and that G2, G3 and G4 read no Monitor command;`
  - Checked against the code: Monitor gets `decideShell` (G1, G7, G8, G9, `register.js:989-992`). G2, G3 and G4 are only in `decideWrite` (`register.js:1017-1021`).
- The README estimate is wrong, and it is also on the wrong count now that D-2 counts insertions plus deletions (W13).
  - W13. old: `(expected: about 3 in `register.js`, 80 to 140 in the tests, 6 to 12 in the README)` → new: `(expected, as counted below: about 5 to 9 in `register.js`, 80 to 140 in the tests, 18 to 30 in the README)`
  - Checked against the code and the README. In `register.js`: one new line, the map line at :952 changed (2), and the comment at :980-982 changed (2 to 6). In the README, about 11 lines change, at README.md:3, :5, :13, :17, :18, :20, :60, :61, :65, :73 and :90, each counted twice. The total stays under 200.

**Finding 3 (P0b against §0's heading, its closing paragraph and "no code before Amendment 1").** Documentation. P0b moves after Amendment 1 and gets its own record. The draft's item 3 (a) order still holds: the shape is read first, and the fixtures are built from it.
- W3. old: `read-only, before any code (the draft, item 3 (a))` → new: `read-only before any code, then P0b on the registration line alone before any test (the draft, item 3 (a))`
- W4. old: `5. **P0b, after the registration line and before any test.**` → new: `5. **P0b, after Amendment 1 is committed and before any test.**`
- W5. old: `The custodian records P0 as **Amendment 1, headed P0** (class 1). No code is written before Amendment 1 is committed.` → new: `The custodian records items 1 to 4 as **Amendment 1, headed P0** (class 1). No code is written before Amendment 1 is committed. The custodian records item 5 as **Amendment 2, headed P0b** (class 1), and no test is written before Amendment 2 is committed.`
- W6. old: `*(Opens empty; append-only. Amendment 1 is P0's record.)*` → new: `*(Opens empty; append-only. Amendment 1 is P0's record; Amendment 2 is P0b's.)*`

**Finding 4 (§6's "a stop, to the custodian", and the P0 stop listed there, against "to the human").** Documentation.
- W7. old: `## §6. Invalidators (a stop, to the custodian)` → new: `## §6. Invalidators (a stop, to the custodian; a P0 or P0b stop goes on to the human, as section 0 says, and a standing rule's or the Guardian's refusal in the worktree as Isolation says)`
- W8. old: `a P0 stop (section 0);` → new: `a P0 or P0b stop (section 0);`
- The second half of the finding needs no change. The Isolation bullet routes the patch to the human, while §5 and the Authority section route findings to the advisor. Those are different matters: draft item 2 reserves the patch, and the grant's item 1 governs findings.

**Finding 5.** No change. The custodian classifying a field is conservative, and Amendment 1 records that reading where the gates read it.

**Finding 6.** No change. It is consistent, as the worker says.

**Finding 7 (D-8's sha256 clause beside the bullet's earlier one).** Documentation.
- W9. old: `Its `target_sha256` is checked against the sha256 of the UTF-8 bytes of the `command` string in the tool call's input in the transcript, with no newline added. Its `reason` is G1's reason, byte for byte.` → new: `That sha256 is of the UTF-8 bytes of the `command` string in the tool call's input in the transcript, with no newline added, and the new file's `reason` is G1's reason, byte for byte.`
- Checked against the code: `sha256Hex(target)` with `target = e.command` (`register.js:952`, `register.js:959`) hashes the TextEncoder's bytes, that is UTF-8 (`register.js:920`).

**Finding 8.** No change. The line cite is in my report only, and the form's Isolation sentence carries none. ADV-2026-11-22-01 item 9 (at :45) matches the sentence in substance.

**Finding 9.** No change. It fits.

**Finding 10.** No change. "Never edited" binds from the first commit: the form is append-only from then (its "Committed before any code" line).

**Finding 11.** No change beyond W1.

## 3. Contradictions my attempt-1 words created that the worker did not find

- **D-2 counts at "a named commit", but the stop is "before the commit".** A commit that does not exist yet cannot be counted by that command. Documentation.
  - W14. old: `Over 200 is a stop to the custodian before the commit.` → new: `Before each commit, the worker counts the staged change the same way, by `git diff --numstat --cached <base> -- tools/mods/spatial-guardian`; over 200 is a stop to the custodian before that commit.`
  - The class 8 count stays the named-commit command, as the template's class 8 asks (docs/PREREGISTRATION-TEMPLATE.md:169).
- **No other contradiction.**
  - D-4 is accurate: the file carries 79 `RECORDED MUTATION` comments.
  - D-4 cites round 25, item 2 (c), and D-2 cites (a). Both resolve, at docs/PREREGISTRATION-TEMPLATE.md:172 and :169.
  - D-6's exception, D-7's failed prediction and §5.3 agree with each other.

## 4. C-1 and E-1

- **C-1 is closed.** The patch goes to the human (Isolation), and the P0 stops go to the human (§0). W7 and W8 are wording that keeps §6 in line with this; they are not a re-opening.
- **E-1 is closed.**
  - P0b is present.
  - The `command` field is pinned to `decideShell`'s top-level read (`register.js:988`).
  - A types folder with no Monitor declaration is a stop.
  - The field rule is defined, and `validate` is in §7.
  - W3 to W6 fix only P0b's order.

## Notes (not findings)

- §7's `validate` check could compare the head's output with P0b's whole output, byte for byte, rather than with P0's item 2. That is stronger, since the code after P0b changes no hook line.
- The heading "(the draft, item 3 (a), where the piece stops and comes back to the human)" also covers the stops this form adds. They are conservative and stay inside the draft.
- Constitution: nothing has changed since attempt 1.
