*The build worker's report for the node hooks-readme-subagent-compaction-sentences (PR 352, branch cut/hooks-readme-subagent-sentences, from 90bdeab78ea3dadd238d5dfe428e50b0df3840c6 to 17b0cf48bde716f611b78fe5d35b43d53b71e734), filed by the custodian byte for byte below the rule from its hand-back in its transcript: 2303 bytes, sha256 ddbc8e1498218f3004b6f073d79ebfe3f7f60d31858dd51d49b824386f15afc7. Its run: Read 5, Bash 15, Write 1, SubagentHandback 1, by unique call ids; no call errored; claude-sonnet-5-5; first record 2026-11-22T11:49:14Z, hand-back 2026-11-22T12:02:56Z; no compaction; no call named the main checkout. Its claims are checked by the reviewer gate at `state/consults/gates/2026-11-22-hooks-readme-subagent-compaction-sentences-gate-reviewer.md`.*

---

Done: hooks-readme-subagent-compaction-sentences pushed at 17b0cf48bde716f611b78fe5d35b43d53b71e734

Start state: HEAD 90bdeab78ea3dadd238d5dfe428e50b0df3840c6, status porcelain empty, branch cut/hooks-readme-subagent-sentences (each checked in its own call).
S0: open PRs were #351 (cut/verify-cites-shortened-target, draft) and #350 (cut/cancel-stamp-order, draft). Neither branch's diff against main names scripts/hooks/README.md.
Script log (rc=0): README-OK d67544b36f6b2a82b546e5a00941ed1d01fd9456e63257df3b5ec137edd8459d 14bcc3ebb24e64e22c1ba6bfa3c764e14f0c207c18b65973f62fbdbf30040060
Numstat: 5 1 scripts/hooks/README.md (that file alone). Diff: sentence (a) went on its own line after "...(the ledger block's value, else `null`).", and the rest of that line moved down to start at "`custom_instructions` is". Sentence (b) is a paragraph of its own at the end of the SessionStart section, after the resume-facts paragraph. Both sentences are on single lines.
Checks (all from the worktree):
- verify-cites: rc=0, "verify:cites PASS — every rooted (in-tree) path:line reference across 3569 file(s) resolves. (211 loose reference(s) advised above.)"
- verify-quotes: rc=0, "verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, ..."
- verify-test-claims: rc=0, "verify:test-claims PASS — all 895 claimed test(s) across 283 file(s) exist or are planned, superseded or withdrawn (...)"
- verify.mjs --offline: rc=0, "verify:plan PASS — ...PLAN.yaml agrees with the repository."
- node --test scripts/hooks/*.test.mjs: 202 tests, 202 pass, 0 fail. The chained command exited 0. The "test rc=" line was not captured, because the harness backgrounded the call and its output file showed only the first line.
Commit: 17b0cf48bde716f611b78fe5d35b43d53b71e734, subject "docs: the hooks README on a subagent's compaction and its SessionStart call", committer time 2026-11-22T13:02:43+01:00. Message file shown before commit, with the two trailers last. Signed with -s. Only scripts/hooks/README.md was staged. Porcelain was clean afterwards.
Push: 90bdeab7..17b0cf48 accepted, in its own call.
Departures: none, apart from the harness backgrounding the long check call, which I polled by reading output files (no second copy was started).
Model: Sonnet 5.5 (claude-sonnet-5-5).
