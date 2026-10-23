*Custodian's filing note (2026-10-21): verify-quotes-round-item-cites's S2 (the instrument runs) by a worker, at 85ac5d78 (S1 with main merged in): STOP on I4, by its letter. S3 did not run, and nothing was committed. The run 2026-10-21T22:21:02Z to 22:32:00Z by its transcript (Bash 29, Read 2, Monitor 1, Write 3); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with its one scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 004f63b96804af186eb1e5dc7b7b6db7d40288a68e84eed19ab464766604f65d.*

---

S2: verify-quotes-round-item-cites at 85ac5d781508318f9177d31c9fe15d12eb365011
Result: STOP, I4 (one RULED header names a question round outside §2.3 (i): `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:125`). Steps 1 to 9 pass. S3 not run, nothing committed, no record or baseline touched. `git status --porcelain` is empty, HEAD unchanged.

Steps (every command in the foreground or a background job with its output in a `vqri-` scratch file; each rc was printed straight after it):
1. U1: B's `verify-quotes.mjs` copied untracked under a new name, run beside HEAD's on HEAD's tree. Both rc=0. Full output diffed: the only differing line is the PASS line, where HEAD's adds `, 836 ruling cites resolved, 0 ruling-cite errors`. Both print 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-baseline entry errors. Neither prints an unmatched or FAIL line. Copies deleted.
2. U2: both runs print `0 hash-reference errors (2 hash-baselined)` and list the same two LOD hash lines (`engine/LOD-PREREGISTRATION.md` 541 and 545); no unmatched.
3. U3: `cmp` of the baseline file at B and at HEAD, rc=0 (byte-identical).
4. U4: B's `verify-test-claims.mjs` copy and HEAD's, both rc=0. `cmp` rc=0, output byte-identical (17853 bytes each). The last line reads `PASS — all 613 claimed test(s) across 188 file(s)`. Copy deleted.
5. U5: `node scripts/plan/verify-cites.mjs` rc=0, `verify:cites PASS`. Its 85 advisories are labelled "not gated", so the gated count is 0.
6. P1: C = 836 ruling cites resolved on the default set (rc=0). The floor is 400, so it holds.
7. P2: MQ4, MQ5 and MQ13 applied together in `scripts/plan/rulingSet.mjs` (item pattern one asterisk, plural header first round only, round-file text forced to null). `verify-quotes.mjs` rc=1 with 152 `FAIL — ruling cite` lines against the floor of 100, so it holds. Reverted with `git checkout -- scripts/plan/rulingSet.mjs`; `git status --porcelain` printed nothing.
8. P3: U = 0 at HEAD on the default set (836 resolved, 0 ruling-cite errors, from step 6). The ceiling was 10, so it holds. There is nothing to list.
9. P4: each form run alone, all rc=0, each with 0 unresolved:
   - `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`: 1 resolved, 0 unresolved.
   - `scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md`: 5 resolved, 0 unresolved.
   - `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: 5 resolved, 0 unresolved.
   - `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md`: 0 resolved, 0 unresolved.
10. I4 (script `vqri-i4.mjs`, output `vqri-i4.txt`, both in the scratchpad). The ruling set is 2 files (`DECISIONS-PENDING.md` and the one archive), with 68 blocks whose header matches §2.3 (i). Before relying on zero counts I tested each pattern positive on a line that must match (header, plural header, item single and bold, item-like variants); all passed.
   - Item-like lines inside round-headed blocks: 166 match §2.3 (iii) and 0 do not.
   - Lines starting `**RULED` that do not match §2.3 (i): 127. They are listed by file and line in `vqri-i4.txt`: `DECISIONS-PENDING.md` lines 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, and 117 in the archive. 126 of the 127 name no numbered question round as the header's round. The text containing "round" in the others reads: line 36 ("the round 14 correction"), 120 ("not in round 3"), 146 (a cite inside the header), 1129 and 1143 ("unnumbered question round", "after round 30") and 1194 ("round 29 item 2"). Those are mentions, not round headings.
   - The exception is `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:125`: `**RULED 2026-10-12 — PR #217: gate 3's C-1 (B), …`, which ends `(question round 72, answered by selection at 17:05:02Z, …)`. It has no item lines (its bullets are `The rulings` and `Applied`), and round 72 has no other header form in the set. A cite to `round 72, item M` would report "no RULED block for question round 72", but U=0 means no cite does today.
   - By the letter of I4 this is a header naming a round outside §2.3 (i), so I stopped. If the custodian reads I4 as needing a cite that fails, it does not fire. That is the human's call (OPEN-5 (A)).

P1 to P4 against predictions: P1 836 against ≥400, held. P2 152 against ≥100, held. P3 0 against ≤10, held. P4 0 unresolved in all four forms, held.

Not done: S3 and any commit or push. The steps' tail-times were long (about 3 minutes per full `verify-quotes` run). No heavy hold was needed.

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports; no override; no context handoff received or produced. One slip: my first P2 background run started on the unmutated tree (my heredoc had mangled the script); I killed it (PID 31520) and discarded its output before rerunning. Scratch files: `<the session scratch folder>/vqri-*`.
