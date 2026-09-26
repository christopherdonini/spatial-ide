*Custodian's filing note (2026-09-26): the reviewer gate's attempt-1 report for PLAN node `data-plane-origin-non-ascii` at 1a000a0, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS.** I found no blocking issues. Everything ran in C:\dev\wt\data-plane-origin at HEAD 1a000a0 unless stated otherwise, with CARGO_TARGET_DIR=C:/dev/spatial-ide/target. I committed nothing and the tree is clean (`git status --porcelain` is empty; no stash).

## History
- On origin/cut/data-plane-origin-non-ascii the parent chain is 1a000a0 → fff5114 → d445c86 → 3a9ed80 → b03e9e7.
- b03e9e7 is an ancestor of origin/main, and it is the merge base. origin/main has since moved on to dea920e.
- The force-pushed-away commit is c907f30: 58 comment lines, still visible in the reflog and not in the branch.
- fff5114 and 1a000a0 contain no added or removed lines except `//` comment lines, checked by grep.

## Runs (exit code @ commit)
1. **Diff.** `git diff --stat origin/main...HEAD` shows 10 files:
   - §7's three files: server.rs (+12/−1), session.rs (+3) and tests/origin_header_encoding.rs (+180, new);
   - 3a9ed80's own seven files: the prereg, PLAN.yaml, CUSTODIAN-QUEUE.json/.md, site/data/health.json, site/data/plan.json and site/index.html.
   - Nothing else. The server.rs change matches §2's shape exactly.
2. **Test-first run: rc=101**, on 3a9ed80's src with d445c86's test file.
   - T1 and T5 pass. T2, T3 and T4 fail with `left: Ok(()) right: Err(403)`, panicking at lines 113, 123 and 134.
   - I then restored the tree (`git checkout HEAD -- protocol/data-plane`).
   - One extra check of my own: with T4's f4a assertion neutralised on the pre-fix tree, F4b's assertion (line 162) fails as `Ok(())`. So H2 is now observed for F4b too. §4's test-first run could not show this, because T4 stops at f4a first.
3. **§4 mutations**, each applied to 1a000a0's src (which is byte-identical to d445c86's), run, and reverted with a clean porcelain after each. All returned rc=101.
   - **M1** (T1): the filtered run gives `0 passed; 1 failed; … 4 filtered out; finished in 0.01s`, identical to the record. Unfiltered, only T1 fails.
   - **M2** (T2): T4 and T2 fail and T3 passes, `3 passed; 2 failed`. Printed order T4, T2, matching 1a000a0.
   - **M3** (T3): only T3 fails, `4 passed; 1 failed`.
   - **M4** (T4): T4, T2 and T3 fail, `2 passed; 3 failed`. **My printed order was T4, T3, T2**, not the T4, T2, T3 that 1a000a0 records (see N2).
   - **M5** (T5): only T5 fails, with `left: Err(403) right: Ok(())`.
   - Every recorded "Printed failure" line, after its 5-character `//   ` prefix, matches the worker's transcripts t1.txt–t5.txt byte for byte and in order (checked by a node script: 3+5+3+7+3 lines, all found).
4. **Suites, all @1a000a0.**

| Command | Exit | Result |
|---|---|---|
| `cargo test -p spatial-data-plane` | 0 | 22 unit, 11 in candidate_a, 4 in no_transport_leakage, 5 in origin_header_encoding |
| `cargo test -p spatial-kernel` | 0 | includes both `skp_admission` declared-origin tests |
| `cargo clippy -p spatial-data-plane --all-targets` | 0 | 0 warnings |
| `cargo fmt --check -p spatial-data-plane` | 1 | all drift is pre-existing (below) |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 291 pass |
| verify-quotes | 0 | PASS |
| verify-cites | 0 | PASS |
| verify-test-claims | 0 | PASS |
| `verify-mutation --base origin/main --head HEAD` | 0 | 5/5 named |
| `timeout 120 node scripts/plan/verify.mjs --offline` | 0 | PASS |

   On the fmt drift: there is no rustfmt.toml and CI has no fmt step. Running `rustfmt --edition 2021 --check` on the committed blobs gives:
   - server.rs: 12 hunks at origin/main and 12 at HEAD;
   - session.rs: 1 hunk at both (`with_origin`, not this piece);
   - the new test file: clean (rc=0);
   - no drift hunk falls on server.rs lines 289–301. **This piece's own lines are clean.**
5. **§21c figure: 196** (195 insertions + 1 deletion, 3 files), within §7's 200 / 3 ceiling. The command:
   `git diff --numstat origin/main...HEAD -- protocol/data-plane/src protocol/data-plane/tests | awk '{i+=$1;d+=$2} END{print i+d}'`
   PLAN.yaml (+3/−3) is custodian state, not code or tests, so it is excluded. Counting it would give 202.
6. **§8, item by item**
   1. **PASS.** `request_allowed`'s only product caller is `upgrade` (grep over protocol/data-plane, kernel and frontends). `None` arises only from `headers.get` returning `None`.
   2. **PASS.** The refusal is `(StatusCode::FORBIDDEN, "origin")`, returned at server.rs:299, before the token read at 307.
   3. **PASS.** No decoding, trimming, folding or prefix comparison. `Err(_)` returns immediately.
   4. **PASS.** session.rs's diff is 3 added `///` lines only. The body, signature and `tests` module are byte-identical to main.
   5. **PASS.** The token path's diff is empty and its order is unchanged.
   6. **PASS.** Refusals are asserted as `Err(403)` at test lines 108, 125, 140, 160 and 162. The helper panics on non-HTTP errors at line 92.
   7. **PASS.** Tests use the real `serve` (server.rs:196), which binds `127.0.0.1:0` and asserts loopback, with a real `tokio_tungstenite::connect_async` client.
   8. **PASS.** No diff outside §7's files and 3a9ed80's files.
   9. **PASS.** No Cargo.toml or Cargo.lock change. The pins read in §0 match Cargo.lock: http 1.5.0, axum 0.8.9, tungstenite and tokio-tungstenite 0.29.0.
   10. **PASS.** No `+…pub` line in the src/tests diff.
   11. **PASS.** No new string; the body `"origin"` is reused. The panic text exists only in the test.
   12. **PASS.** Name-status shows only A/M on §7 files. candidate_a.rs and skp_admission.rs are untouched.
   13. **PASS.**
       - A grep finds no `file:N` or `line N` cites in the added code/test lines or in the prereg.
       - The "finished in 0.0Ns" fields are runner output inside byte-copied transcript lines. They carry no comparison, threshold or docs/08 row, so I judged them not a performance claim; M1, M2, M3 and M5 reproduce them exactly.
       - There is no exploitability claim beyond A1-1's bound.
7. **Seam: PASS.** Both rows of §2's seam table are proven from the real shape. M4 (the fix reverted, so bytes are admitted) proves the bytes reach `upgrade`, which settles H2.
8. **LF: PASS.** `file` reports no CRLF on any of the 10 changed files, and every blob has 0 CR bytes.

Other checks:
- 4d0e727 is on main, and `git diff 4d0e727 b03e9e7` over §0's files is empty.
- §10 is empty, so there are no discharge clauses to resolve.
- The "Applied, run, reverted" comments are borne out by my reruns.

## Findings (none blocking)
- **N1**, origin_header_encoding.rs:97, 113, 130, 145 and 167 ("observed at d445c86"): the provenance is slightly off.
  - The transcripts are timestamped 11:50–11:52; d445c86 was committed at 11:58:58. Their panic lines (100/110/120/131/144) sit 3 lines above d445c86's (103/113/123/134/147), so the test file then was not d445c86's.
  - The src the runs used (mutations/server.rs.fixed and session.rs.fixed) is byte-identical to d445c86.
  - The recorded bytes reproduce at the committed code. Rule: record fidelity. Non-blocking.
- **N2**, origin_header_encoding.rs:144 (1a000a0's "printed in that order"): libtest prints failures in completion order, which varies between runs. My M4 run printed T4, T3, T2.
  - The claim is true of the recorded transcript (t4.txt) but is not a stable property.
  - The three printed pairs are identical, so no recorded byte is wrong. Non-blocking.
- **N3**, the closing amendment: H2's named discriminator for F4b ("the test-first run admits … F4b") cannot fire as T4 is written, because f4a fails first. The F4b observation above is the reviewer's own run, not the worker's. The closing amendment should reference it and not claim it as the worker's test-first run. Non-blocking.
- **Nit**, server.rs:290–291: the parenthetical puts "any byte outside visible ASCII" beside "ADR-020 Decision". That behaviour belongs to `http` 1.5.0's `to_str` (H1), not to the ADR.

Scratch outputs, including the mutation script and the m1–m5 logs, are in C:\Users\CHRIST~1\AppData\Local\Temp\claude\C--dev-spatial-ide\5d626cec-7aaf-40a2-9c79-6e4d2c8db2e6\scratchpad.

**Gate-log note:** @ 1a000a0 reviewer PASS (attempt 1): diff = §7's 3 files + 3a9ed80's own; §21c 196/200; test-first T2/T3/T4 fail, T1/T5 pass (rc=101 @ 3a9ed80+d445c86 test); M1–M5 reproduced (M4 printed order non-deterministic, N2); data-plane/kernel tests, clippy, node --test (291), verify-quotes/cites/test-claims/mutation, verify --offline all rc=0; fmt rc=1 pre-existing drift only; §8 1–13 clear; notes N1–N3 non-blocking.
