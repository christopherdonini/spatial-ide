# The Stop hook honours the custodian lease — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: the human's message of 2026-09-26, item (4), verbatim in state/directives/2026-09-26-corpus-positions-and-stop-hook.md §2 ("Tooling fix, light lane"); AUTONOMY.md §21b; AI_DEVELOPMENT.md, "The lease and handover".
Scope: scripts/hooks/stop-queue.mjs, scripts/hooks/hooks.test.mjs, scripts/hooks/cloud.test.mjs, scripts/hooks/README.md, AUTONOMY.md (one appended section, the obliged sentence); declared line budget <= 150 non-generated lines across 5 files, this form excluded.
Change: after the HALT step and before the ready set is derived, the Stop hook reads CUSTODIAN-LEASE at the project root and allows the stop, with the reason on stderr, unless the file's first line is an active `lease: <id> ...` line whose <id> equals the stdin session_id -- so a relinquished lease, an absent file, another session's lease, or a missing session_id each allows; a session holding its own lease meets the existing steps unchanged.
Tests+mutation: three new tests in scripts/hooks/hooks.test.mjs -- `stop-queue: allows when this session's lease is relinquished` (mutation: a `relinquished:` line read as held -> fails, block where allow is expected), `stop-queue: allows when this session holds no lease (file absent, or another session's lease)` (mutation: an absent file read as held -> fails), `stop-queue: blocks as before when CUSTODIAN-LEASE holds this session's own lease` (mutation: the id comparison inverted -> fails); the existing block-path tests write their session's lease; dry run of the CLI on a two-node throwaway plan: relinquished and no-lease each allow (empty stdout), the holder blocks.
Out-of-scope: no ADR, wire, security or guarantee text; the lease rules in AI_DEVELOPMENT.md unchanged; the hook's other steps, caps and reason text unchanged; .claude/settings.json unchanged; no PLAN.yaml change in this piece (its node is added on main after the merge, with the PR as evidence).
```
