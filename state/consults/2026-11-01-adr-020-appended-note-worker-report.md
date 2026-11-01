*Custodian's filing note (2026-11-01): the docs lane's `adr-020-appended-note`, built by a worker on `cut/adr-020-appended-note` from main ae71bd8a, head 5ff86b13, under its full form `governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md`. The custodian's check by git: origin's branch is at 5ff86b13; one commit; the diff against main is the two files the settlement names (ADR-020 +15/-0, the quote baseline +1/-1); main's ADR-020 and baseline equal ae71bd8a's. By its transcript: one commit, one push to the branch, no reset, rebase, merge, amend, force, PR action, cargo or claude call; its C1 checkout created and removed by it; Bash 31, Read 6, Write 3, Edit 3; run 00:20:40Z to 00:51:21Z. Draft PR #271 opened by the custodian. Extracted by script from its SubagentHandback call, with one final newline added; the session's scratch folder, named 1 time(s) by its full path, is written `<scratch>/`; nothing else is changed. Its sha256 as handed back, from line 5 to the end, is 6f94d2c79be9f4a94ffdb95919e338c19db02b7c51852882e741b278f2c7da11; as filed, d82d7a455c3dfd727b21efe080e18daec2f84b27d63db9dd2289ec6c60d94d59.*

---

Built: adr-020-appended-note at 5ff86b13fcca3854eed89076426f30fb1a37f9b8

- Commit: one, signed off, on cut/adr-020-appended-note, pushed. Subject: "docs: adr-020-appended-note (the Corrigendum on Amendment 1 section (c) appended to ADR-020; the baseline entry's corrected_by names it)". The message file has `@` only on the Co-Authored-By line, and the `-s` sign-off adds the other.
- `<DATE>` is 2026-11-01, taken by `date -u +%F` before the edit. The commit's UTC date is 2026-11-01 (`TZ=UTC git log -1 --format=%cd --date=format-local:%F`), so they match.
- Block file: `<scratch>/a020-block.txt`, sha256 b0c7bf0d3e81ea8452ef799536771cd838b8a9a6d916907b6de079d7ba950171 (equal to the given value). A node check also showed H's ADR-020 equals B's bytes plus the block with `<DATE>` filled.
- Numstat `B...H`: ADR-020 15 insertions, 0 deletions; `scripts/plan/verify-quotes.baseline.json` 1 insertion, 1 deletion. Only those two files changed. The baseline edit is the line-403 entry's `corrected_by` and nothing else.
- Step 1 invalidators at B: none met. ADR-020 has no CR byte and ends in LF, and its tail was as expected. The baseline entry still carries file ADR-020, line 403 and its words.
- B's verify-quotes: exit 0. 134 checked, 103 verified, 30 baselined, 1 advisory, 896 ruling cites resolved, 0 errors. The ADR-020:403 line was in the baselined list.
- E1: exit 0, +15/-0 (the ceiling is 20/0).
- E2: exit 0. B is a byte prefix of H.
- E3: exit 0. No CR byte, and the last byte is LF.
- E4: exit 0, with the script `a020-e4.mjs` in the scratchpad. Entry 54 is located by its head "54. **[Release cut, item 1" through the next entry's head. In the archive that next head is "53. **[Release cut, items 3", because 53 follows 54 in the file; both heads occur once. Exactly one span matches. It equals exactly one line in H byte for byte. Without its four wrapper bytes it equals :403 at B minus `> ` and the last byte, and that last byte is a full stop. The script was run positive at B before the edit.
- E5: exit 0. At H: 135 checked (+1), 104 verified (+1), 30 baselined, 1 advisory, 897 ruling cites (+1), 0 ruling-cite errors. The ADR-020:403 entry is still in the baselined list. No matched-nothing line is printed at H, and the whole output except the PASS line is identical to B's. Its only "stale" hit is an unrelated OWNER-INVALIDATION entry's reason, present at B as well.
- E6: verify-cites exit 0.
- E7: verify-test-claims exit 0 (701 claimed tests). `verify.mjs` exit 0.
- E8: `node scripts/adrIndex.mjs --check` in `frontends/shell` exit 0, "34 ADRs, index in docs/README.md matches every Status line". `docs/README.md` is not in the diff.
- E9: `queue.mjs --check` exit 0 (current). `site.mjs --check` exit 0 (current).
- E10: exit 0. 590 tests, 590 pass, 0 fail.
- E11 (PR CI) is not mine, since there is no PR yet.
- C1 (a control run, not a mutation), at H = 5ff86b13fcca3854eed89076426f30fb1a37f9b8: in a detached checkout I replaced the reproduction line with the same words followed by a full stop, no wrapper. verify-quotes exit 0 and printed "1 baseline entry matched nothing this run", naming the ADR-020 line-403 entry. That is the prediction. Counts: 134 checked, 104 verified, 29 baselined. I reverted with `git checkout --`, the porcelain was empty, and I removed the checkout with `git worktree remove`.
- Push: origin's branch equals HEAD (5ff86b13fcca3854eed89076426f30fb1a37f9b8, confirmed by `ls-remote`). The porcelain in C:/dev/wt/a020 is empty.
- Stop rules: none met, and the Guardian did not refuse the Edit.
- Disclosure: I made two non-gating mistakes before the commit. My first E4 script assumed entry 55 follows 54, so I changed it to 53. Two of my wait loops matched on the wrong text and ended at their own timeouts. No background shell of mine is still running. `tasklist` shows 7 node processes, none of them started by me as far as I know, and I killed nothing.
- Off-scope, not done: nothing noticed.
- Cross-module seams: none (docs and a baseline JSON only), so there is no interface cite and no new `pub` item or caller.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override. I received no context handoff and produced none.
