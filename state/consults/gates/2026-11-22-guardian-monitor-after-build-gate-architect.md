Reviewed: cut/guardian-monitor at b6d8835810e36249097744cff509b59ae8e9771c, PR 357, against `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md` (the custodian's filing note, 2026-11-22: section 7's architect after the build, node:guardian-checks-monitor-commands@gate-architect-after-build-1, the form and its authority read at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout; Read 16, Glob 3, Grep 6, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T16:10:06Z to 2026-11-22T16:14:20Z by its transcript; 0 calls named the main checkout; no compaction. Filed byte for byte below the rule from its hand-back, 12022 bytes, sha256 1f90fe31d0bbdd0d5c6499f1f41379f4be952e2d0884d97dfceebeb9d8938cca, with one final newline added. It agrees with the reviewer's D1 to D3 word for word and adds A1; D1, D3 and A1 were applied at 269b0532bc1228fa0fac9be75afe062be02815de.)

---

Verdict: PASS WITH NOTES — cut/guardian-monitor @ b6d8835810e36249097744cff509b59ae8e9771c (the form and its authority read at main 466318621a13f00ae7b1114a4690582be42bdc94 in C:/dev/wt/read-1122)

I found no Correctness or Evidence finding, so nothing blocks. There are four Documentation findings (AUTONOMY §22), all to be fixed before the merge: the reviewer's D1 to D3, which I agree with word for word, and one of my own, A1. None of them is in the human's wording. The worker applies the words with no re-gate, and the PR body lists them. The two gates give no different words for the same place, so nothing goes to the advisor under ADV-2026-11-22-13.

## Check 1. The change against the draft and section 1

- **Monitor's command goes through the shell decision with G1, G7, G8 and G9, and without G6.** Holds.
  - The registration is at `tools/mods/spatial-guardian/hooks/register.js:1109`. It comes after N1 (`:1107`) and beside Bash (`:1108`). It has the same shape and the same `.catch`, and it calls `guardShell(..., false)`.
  - Because `isPowerShell` is false, G6 is skipped (`:985`). G1, G7, G8 and G9 then run in that order (`:990-993`).
- **The refusal log's target map has Monitor.** Holds: `Monitor: e.command` at `register.js:952`.
- **A watch with no command passes unchanged.** Holds. `String(e.command ?? '')` at `register.js:989` gives `''`. That splits into one empty segment with no tokens, so every rule returns false and the call reaches `next(e)` (`:1004`). No code was added for it, as the form's section 2 item 3 says.
- **Nothing else changed.** Holds.
  - Against main's file, the only other changes in `register.js` are the comment above `decideShell` (`:980-983`, against `register.js:980-982` at main) and the map line (`:952` at both).
  - The other registrations, all rules, the reason texts and the log fields are unchanged.
  - The reviewer's numstat, 6 inserted and 4 deleted, matches exactly these three hunks.
- **Tests for each claim section 1 allows:**
  - G1, G7, G8 and G9 each refuse with their own reason, nothing reaches the engine, and one log line is written naming Monitor: M-T1 to M-T4 through `monitorRefused` (`tools/mods/spatial-guardian/test/guardian.test.ts:1938-1957`). It checks the seven fields in order, `tool: 'Monitor'`, `agent: 'main'`, `target_sha256 = sha256(command)`, the reason, and that the line holds no command text.
  - A harmless command and a commandless call pass unchanged with no log line: M-T5 and M-T6 (`guardian.test.ts:2001-2026`).
  - Under MU1 and MU2, M-T1 to M-T4 go red. Under MU3, M-T5 and M-T6 go red. The reviewer reproduced all three at the head. The second commit adds only the 30 `// RECORDED MUTATION:` comment lines (6+5+5+5+5+4), so the test bodies observed at 727dc2fb are the head's.
- **Claims section 1 forbids:** none.
  - G6 on Monitor is denied in `README.md:17` and `:61`.
  - A live Monitor refusal is not claimed before M-E1 (`README.md:60`).
  - The list of what the shell rules do not read stands as written (`README.md:63`).
  - Nothing is claimed for the other tools on the draft's item 8 list.

## Check 2. The README's changed lines against the code

- **Line 3:** true, except for the stale form paths (D3).
- **Line 5, the build line:** see below and D1.
- **G1, G7 and G9 rows (`README.md:13`, `:18`, `:20`), "Bash, Monitor and PowerShell":** true at `register.js:1108-1110`.
- **G6 row (`:17`):** true. `isPowerShell` is false on both the Bash and the Monitor registrations.
- **`:60`:** true.
- **`:61`:** true, except for the clause in A1.
- **G8 bullet (`:65`):** true. No path rule runs on a shell or Monitor call.
- **Last bullet (`:73`):** true (check 3).
- **Shell route (`:90`):** true at `register.js:1109` and `:985`.
- **"Files":** still true, and correctly left unchanged.

**The build line.** I agree with the reviewer's check 4.
- The form's section 2 item 4 asks for words saying that Monitor's event shape "was read at it" (`governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md:60`).
- P0 read no shape (`GUARDIAN-MONITOR-PREREGISTRATION.md:193`). The human's draft says "assumed, not read" and names the README (`state/consults/2026-11-22-advisor-draft-adv-2026-11-22-12-the-guardian-and-monitor-piece-after-its-p0-stop-not-the-humans-words.md:15`).
- Writing "read at it" would therefore be an untrue claim. The worker was right not to write it, and in substance the line follows the draft's item 2 (b).
- "read at no build", however, is an absolute negative that the record does not support. The v0 form's Amendment 1 item (ii) found a Monitor entry in the 2.1.288 type declarations, though it records no fields (`governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md:531`). D1 fixes this.
- The form's section 2 item 4 is not among the sections that its Amendment 2 item 1 hands to the draft, so the set-aside needs the record line D2 asks for.

## Check 3. The assumed fields

- **The fixture:** `monitor()` (`guardian.test.ts:1926-1932`) builds `{ tool, description, timeout_ms, command?, ws }` with no `agentId`.
  - That is the draft's four input fields, plus the three event fields the handlers read: `e.tool` and `e.command` at `register.js:952` and `:989`, and `e.agentId` at `:958` and `:985`.
  - It matches ADV-2026-11-22-12 item 2 (b) (`ADV-2026-11-22-12 draft:15`).
- **The line 15 sentence** "That a Monitor event has those fields is assumed, not read." appears byte-identical at `guardian.test.ts:1925` and `README.md:73`, each with the lead-in that names the fields.
- **The PR body:** I did not read it. The reviewer's check 5 reports the sentence once in PR 357's body.

## Check 4. The live checks

Nothing more is needed from the code.
- **M-E1:** G1 refuses `git push --force ...` (`register.js:990`). The log line takes `tool` from `e.tool`, the agent `main` from a main-loop call with no `agentId` (`:936`), and `target_sha256` from `e.command` (`:952`, `:959`). The reason is G1_REASON. The folder is `<parent>/<name>-local/guardian/<UTC date>/` (`:930`, `:963`).
- **M-E2:** `echo` is refused by no rule.
- **The conditional Bash call (draft 12 item 3 (b)):** it needs only the existing Bash registration (`:1108`).
- **The revert and the hold:** both are procedure, with no code.
- **The gap is in the interface, not the code.** The engine's Monitor event is assumed, by the human's approval of ADV-2026-11-22-12. Under the seam rule, the end-to-end test from the real shape is M-E1 together with the conditional call. Merging does not settle the seam. The hold stands until M-E1 is recorded.

## Check 5. Contradictions

- **docs/01:** no contact. The Guardian is a session-tooling plugin, not a product extension surface, so principle 5 and the derived "One extension surface" rule do not apply.
- **The v0 and v1 forms:**
  - The v1 form's log field "`target_sha256` ... for Bash and PowerShell" (`governance/forms/tools/GUARDIAN-V1-PREREGISTRATION.md:354`) is extended under this form. `README.md:3` names this form as governing the Monitor registration.
  - No v0 or v1 rule, reason or field changes.
- **AUTONOMY §22:** the verdict is mapped onto its three categories.

## Replacement words (the architect's words; none is the human's wording)

**D1 (the reviewer's). I agree with its words.**
- Old (once, `README.md:5`): `; Monitor's event shape was read at no build (see "What it does not claim").`
- New: `; Monitor's event shape is assumed, not read: at 2.1.330 the engine wrote no type declarations into this folder (see "What it does not claim").`
- Clause check:
  - "assumed, not read" is the wording of `ADV-2026-11-22-12 draft:15`.
  - "at 2.1.330 the engine wrote no type declarations into this folder" is `GUARDIAN-MONITOR-PREREGISTRATION.md:193`. The reviewer also found no types folder in its export.
  - The new words claim no read at any build.

**D2 (the reviewer's). I agree.** This is new text for the form's Amendment 3, so it has no old text. It is one reference sentence: `Section 2 item 4's "and that Monitor's event shape was read at it" is superseded by ADV-2026-11-22-12 item 2 (b).` The quoted span matches `GUARDIAN-MONITOR-PREREGISTRATION.md:60` byte for byte. The change narrows section 2 item 4 and adds nothing to it, so it is not class 9.

**D3 (the reviewer's). I agree with its words.**
- Old (once, `README.md:3`): ``The forms are `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, `tools/mods/GUARDIAN-V1-PREREGISTRATION.md` and``
- New: ``The forms are `governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md`, `governance/forms/tools/GUARDIAN-V1-PREREGISTRATION.md` and``
- Clause check: both new paths exist at main. `governance/MOVED.tsv:187-188` maps the old paths to them, at a8ae51d9.

**A1 (mine): "holds nothing to read" says more than the code does.** A ws watch does hold a `ws` address. The Guardian just never reads it.
- Old (once, `README.md:61`): `A Monitor watch with no command holds nothing to read, so no rule reads it, and G6 is not applied to Monitor.`
- New: ``A Monitor watch with no command carries no command for a rule to read, and no rule reads a Monitor call's `ws`; G6 is not applied to Monitor.``
- Clause check:
  - "no command for a rule to read": `register.js:989`, and M-T6.
  - "no rule reads ... `ws`": only `e.tool`, `e.command` and `e.agentId` are read on this path (`register.js:952`, `:958`, `:985`, `:989`), and `nudge` reads only `e.agentId` (`:1084`).
  - "G6 is not applied": `register.js:1109` with `isPowerShell` false, and `:985`.

## Notes (no change asked in this piece)

1. **The reviewer's N4 (R11, `README.md:92`, does not name Monitor).** I agree that it is outside section 2 item 4's list. Extending R11's rule to Monitor would be a scope addition on a standing rule, which is class 9 and needs its own amendment first. It goes to the advisor. Nothing in R11 is untrue today: none of the three report-only definitions grants Monitor.
2. **The reviewer's N5 (a possible types source).** For the advisor. Draft 12 item 2 (c) bars further `claude` commands, and its item 6 already covers a later build that writes the types.
3. **M-E1's day folder** is named by the UTC date of the decision (`register.js:963`). The before and after listings should both be of that UTC day's folder. This is a timing edge only.
4. **MU3 is coarse.** It shows that M-T5 and M-T6 catch a Monitor hook that refuses, not one that refuses only a commandless call. The architect accepted it at the form gate, and it stands.
5. **Hashes:** I have no shell, so I give cites as path:line at the commits named, with no sha256. The reviewer recomputes any hash a later record carries.

## Files read

- At the head, in C:/dev/wt/guardian-monitor, each read whole:
  - `tools/mods/spatial-guardian/hooks/register.js`
  - `tools/mods/spatial-guardian/test/guardian.test.ts`
  - `tools/mods/spatial-guardian/README.md`
- At main 466318621a13, in C:/dev/wt/read-1122:
  - `governance/forms/tools/GUARDIAN-MONITOR-PREREGISTRATION.md`, whole
  - `state/consults/2026-11-22-advisor-draft-adv-2026-11-22-12-the-guardian-and-monitor-piece-after-its-p0-stop-not-the-humans-words.md`
  - `state/directives/2026-11-22-the-humans-approval-adv-2026-11-22-12-the-guardian-and-monitor-piece-goes-on-without-the-types-its-live-checks-named.md`
  - `state/consults/2026-11-22-advisor-draft-adv-2026-11-22-02-the-guardian-checks-a-monitor-command-as-it-checks-a-bash-command-not-the-humans-words.md`
  - `state/directives/2026-11-22-the-humans-approvals-adv-2026-11-22-02-03-06-the-guardian-and-monitor-the-trial-pins-the-hooks-readme-sentences.md`
  - `tools/mods/spatial-guardian/README.md` and `hooks/register.js`, for the before text
  - `governance/forms/tools/GUARDIAN-V0-PREREGISTRATION.md:515-539`
  - `governance/forms/tools/GUARDIAN-V1-PREREGISTRATION.md`, by search
  - `governance/MOVED.tsv`, by search
  - `docs/01_Principles.md`, by search
- Read as claims only:
  - the build worker's report, `gmb-report.md`
  - the reviewer's gate report, `gm-rev-report.md`, both in the session scratchpad
