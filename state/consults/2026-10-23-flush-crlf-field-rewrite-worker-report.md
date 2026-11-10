*Custodian's filing note (2026-10-23): the build of `flush-crlf-field-rewrite` by a worker on `cut/flush-crlf-field-rewrite` from the form's commit 1f669f21. The run 17:13:12Z to 17:22:39Z by its transcript (Read 5, Grep 1, Bash 18, Edit 2, Write 1, Monitor 1); its claims were read against that transcript's calls before filing: two commits and two pushes, origin's branch equal to the head, the porcelain empty, no force push, rebase, amend, PR call or `verify-mutation` run; its Edit and Write calls only on the piece's two files and its `fcrlf-` scratch files; only those two files changed since the form's commit (5 and 41 lines). Its class 2 result, P3 falsified by one rotate-cut-state test failing under M3, goes into the form's Amendment 2. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 2e7cf23fed3124d18aafeccbff08f2cb10d70080be7a583373e0744dba29271f.*

---

Built: flush-crlf-field-rewrite at 197d81ea607027f26511d9df39f44aea8d726fb5 (origin's branch equals HEAD; porcelain empty). Not clean against the form: P3 is falsified (a class 2 result). Under M3, one rotate-cut-state test fails besides T1 (details below).

Commits (each pushed in its own call, signed off, with the two trailer lines):
- 8bfc3e69dab9fc3ca57d2376dff427cf48f8bcdd "fix(hooks): flush-crlf-field-rewrite, a rewritten field line keeps its own line ending (form 2, T1 and T2 of form 4)". Its message cites the seam read: session-resume.mjs buildOutput (line 99) and extractSessionContinuityBlock (line 45).
- 197d81ea607027f26511d9df39f44aea8d726fb5 "test(hooks): flush-crlf-field-rewrite, recorded mutations MC8 to MC10 beside MC1 to MC7 (form 4, M1 to M3 at 8bfc3e69)".

Diff:
- flush.mjs: the contract comment gains one 2-line bullet (may-claims 1 and 3 only). The rewrite becomes `const at = lineForKey[key]; lines[at] = ${key}: ${updates[key]}${lines[at].endsWith('\r') ? '\r' : ''}`. The CR is decided per line from the replaced line alone. No export, option or flag was added.
- flush.test.mjs: T1 and T2 are appended under their exact names, and three `RECORDED MUTATION` comments (MC8, MC9, MC10) follow MC7. No existing test was edited.
- T1 shows (a), (b) and (c) one by one with a single `assert.deepEqual` over the array [(a),(b),(c)] results against the three expected strings. A failure's diff names each element.
- T2 runs the CLI with `--file` on two temp projects (CRLF real ledger, LF real ledger), with the three fields explicit and `CUSTODIAN_TELEGRAM_DRY_RUN=1`. It asserts no bare LF in the CRLF file, and `buildOutput` text up to `\n\nResume facts:` equal for both.

Mutations: each applied alone at 8bfc3e69 by a script, run, then reverted with `git checkout`. Porcelain was empty after each revert. No `verify-mutation` tool was used.
- M1 (CR dropped; this run is P2): 2 failures. T1 fails with (a) and (b) differing and (c) not in the diff. T2 fails at the no-bare-LF assertion (`actual: false, expected: true`). Flush suite: 18 pass, 2 fail.
- M2 (CR whenever the text holds CRLF): 1 failure. T1 fails at (b) only; the diff shows `position` getting a CR. (a) and (c) pass. T2 passes. Flush suite: 19 pass, 1 fail.
- M3 (CR on every written line): flush suite 19 pass, 1 fail. T1 fails at (b) and (c), and (a) passes. T2 passes (it asserts nothing against extra CRs on the LF copy).
- M3 also fails the rotate-cut-state test `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`, at "its fields are the eight seeded lines" (every field carries a stray `\r`). rotate-cut-state suite under M3: 8 pass, 1 fail. This is recorded in MC10 and in the second commit message.

P1, P2, P3 against §3:
- P1 holds. At the head, flush.test.mjs has 20 of 20 passing and rotate-cut-state.test.mjs has 9 of 9, with no existing test edited.
- P2 holds. M1 fails T1 at (a) and (b), passes (c), and fails T2 at its no-bare-LF assertion.
- P3 is falsified. A test other than T1 fails under M3 (the rotate-cut-state test above). Class 2. Consequence for §3: the rotate test reads flush output, so it pins the LF terminator for that path.

§7: numstat `1f669f21...HEAD` over the two files is flush.mjs 4 added / 1 deleted and flush.test.mjs 41 / 0. That is 5 and 41, 46 in all, under 8, 60 and 68.

Checks at the head (exit code, last line):
- Numstat command: rc 0.
- `node --test scripts/hooks/flush.test.mjs`: rc 0, pass 20 / fail 0.
- `node --test scripts/plan/rotate-cut-state.test.mjs`: rc 0, pass 9 / fail 0.
- Scripts suite (3 globs, under the hold): rc 0, tests 553 / pass 553 / fail 0. The guardian parity fixtures did not time out.
- `verify-cites.mjs`: rc 0, "PASS — every rooted (in-tree) path:line reference across 2291 file(s) resolves".
- `verify-quotes.mjs`: rc 0, "PASS — 131 checked, 100 verified, 30 baselined … 0 ruling-cite errors".
- `verify-test-claims.mjs`: rc 0, "PASS — all 640 claimed test(s) across 195 file(s) exist or are planned, superseded or withdrawn".
- `verify.mjs`: rc 0, "PASS — … PLAN.yaml agrees with the repository".

Invalidators: I1 to I4 were not met. A disclosure: the first commit's push ran in parallel with the commit call, and origin's branch matched 8bfc3e69 when checked afterwards.

Hold lines (my project only): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` and `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`.

Off-scope: none touched. Scratch files are all `fcrlf-*` in my scratch folder. Every command I started ran to completion, so none is left running.

Model: claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff received or produced.

Self-check of the four classes:
- Cross-module: the seam was read at session-resume.mjs lines 45 and 99, and T2 runs from the real producer shape (the CLI on a copy of the real ledger through `buildOutput`).
- Completion claims: each claim above points to a run or output file in my scratch folder.
- User-facing text: no operator-visible string changed.
- Required tests: T1 reaches its three-way deepEqual and T2 reaches both assertions (M1 fails T2 at the no-bare-LF assertion).
