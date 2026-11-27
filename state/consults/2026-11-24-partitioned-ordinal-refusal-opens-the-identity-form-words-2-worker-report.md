*Filed by the custodian: the worker's report of partitioned refusal's second words commit (the reviewer's D-1 to D-3), node:partitioned-ordinal-refusal-opens-the-identity-form@words-2, from 26cb874525d5bdace5035ce564d1f14bc74657d8 to 8d1fe83acfaede6873b6366e6594b99ddf9943ad on cut/partitioned-ordinal-refusal-opens-the-identity-form (PR 366, draft), dispatched at 2026-11-24T00:25:00Z; its run: Bash 22, Read 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-24T00:25:02Z to 2026-11-24T00:41:05Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T00:41:05Z. The report below from its hand-back, 4191 bytes, sha256 f786e32c1a7abd475266da02f74a8886c417c04abf86411de1f7f71cce9d9cf7, byte for byte but for 2 values of the hold's lines and of the project's name, written as <m> by the custodian, with one final newline added. It is evidence for the architect's build gate and the closing amendment, not a gate.*

---

**words-2 for partitioned-ordinal-refusal-opens-the-identity-form: committed and pushed.**

**Head and push**
- Head before: 26cb874525d5bdace5035ce564d1f14bc74657d8 (branch, head and clean tree were as WHERE says).
- Head after: 8d1fe83acfaede6873b6366e6594b99ddf9943ad.
- Push output: `26cb8745..8d1fe83a  cut/partitioned-ordinal-refusal-opens-the-identity-form -> cut/partitioned-ordinal-refusal-opens-the-identity-form`.
- THE REPORT was 18956 bytes with the stated sha256 (0c87c111…ace1), checked before use.
- `df -m /c` showed 44291 MB free, above the 40960 floor.

**The six blocks** (node script on THE REPORT's bytes; exactly 6 found; line count, then sha256 of the LF-joined text)
1. 1 line, 4011ddbb70cbb595824bf73a8bbbe1c11283c516227ddcfa9acca1b1efd2b980
2. 1 line, 31f15d896b91fa711dbb8182444edf905c977be786d9d65020ce88203d53abf2
3. 6 lines, a9f1613954e28c9fc3f7013bdd7a90b7d850e04d444b9d15cbb3160eb0a0c307
4. 7 lines, 6f41681a2172471e3d73dbc15258af986e02c4cbe4c699b36047d3e1010d4af1
5. 1 line, ea0cb39aeced16348dd8a4154a95cfb077d6c1826a17fe45f4d87ae11032b215
6. 2 lines, 0de84aa82b7f7a11b8728c23408e14655bf5c7f1d8ea8b946091f018945de326

**Step 1.** Each file held no CR. In each, the Old text counted 1 before and 0 after; the New text counted 0 before and 1 after.
- Pair 1: `engine/src/error.rs`.
- Pair 2: `frontends/shell/src/admission/formatRefusal.ts`.
- Pair 3: `frontends/shell/src/admission/formatRefusal.test.ts`.

**Step 2**
- `git diff --name-only` showed exactly those three files.
- `--stat`: 3 files changed, 10 insertions(+), 8 deletions(-).
- Whole diff, in short:
  - `error.rs`: the first doc line of the partitioned variant now reads "A path read as a **partitioned** source, a folder or a pattern — R-I4 (§2d; boundary 7)."
  - `formatRefusal.test.ts`: the describe-header sentence about the other three strings is reworded. Two are placeholders, and the partitioned guidance is the advisor's wording (ADV-2026-11-23-27 item 7).
  - `formatRefusal.ts`: the header now says "set for the human's sight at P6", names the other three as unchanged, and names `publish.geographic_crs_not_publishable` and `engine.internal_inconsistency` as the two placeholders.
- `git diff --numstat 2095a7ac…` over the five files: KNOWN-LIMITATIONS.md 8+7, error.rs 9+4, formatRefusal.test.ts 28+7, formatRefusal.ts 18+9, partitioned_refusal_offers_no_declaration.rs 93+0. Total 183, under the 200 ceiling (177 at the head, so +6).

**Checks, all exit 0**
- `cargo fmt --all -- --check`: 0.
- `npx tsc --noEmit`: 0.
- vitest on `src/admission/formatRefusal.test.ts`: 0, 1 file passed, 15 tests passed.
- Hold call, `cargo test --locked -p spatial-engine --lib error`: exit 0, `test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 209 filtered out`.
- `node scripts/plan/verify.mjs`: 0, PASS.
- `node scripts/plan/verify-cites.mjs`: 0, PASS (3734 files, 237 loose references advised).
- `node scripts/plan/verify-quotes.mjs`: 0.
- `node scripts/plan/verify-test-claims.mjs`: 0.

**Hold and release lines**
- Four MACHINE_WAITING lines, each `shared: turn of <m> held by pid <m> since <t>`.
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`.
- `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.

**Otherwise than the brief**
- I ran the four verify scripts in one foreground loop, which the harness moved to the background after 120 s. I took each script's exit code from the loop's own `echo name=$?` lines in its task output: `verify=0`, `verify-cites=0`, `verify-quotes=0`, `verify-test-claims=0`.
- While the loop ran, `tail` of the verify logs read stale files from earlier runs. I used the task output's exit codes, not those tails.
- Both the apply script and the commit message file sit outside the repository: `<S>/partref-apply.mjs` and `D:/wt-data/partref/msg.txt`.
- The commit carries the Co-Authored-By trailer, a Signed-off-by from `-s` and no email in the message text.
- Nothing was written in the main checkout.

**State left:** branch pushed at 8d1fe83a; `git status --porcelain` in the worktree printed nothing.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
